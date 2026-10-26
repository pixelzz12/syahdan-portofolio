"use client";
import { useCallback, useEffect, useRef } from "react";
import type { RoomExperience } from "@/lib/scene-navigation";

export function useCorridorScroll(track: React.RefObject<HTMLElement | null>, progress: React.RefObject<number>, enabled: boolean, locked: boolean, onProgress: (value: number) => void) {
  const offset = useRef(0), span = useRef(1), lockedRef = useRef(locked), initialized = useRef(false);
  lockedRef.current = locked;
  const restore = useCallback((value: number) => {
    offset.current = Math.floor(value);
    progress.current = value;
    window.scrollTo({ top: span.current * (1 + value - offset.current), behavior: "instant" });
    onProgress(value);
  }, [progress,onProgress]);
  useEffect(() => {
    if (!enabled || !track.current) { initialized.current = false; return; }
    span.current = Math.max(1,(track.current.offsetHeight-window.innerHeight)/3);
    restore(initialized.current ? progress.current : 0); initialized.current = true;
    const read = () => {
      if (lockedRef.current) return;
      const y = window.scrollY;
      const value = offset.current + y/span.current - 1;
      progress.current = value; onProgress(value);
      if (y > span.current*2.25) { offset.current++; window.scrollTo({ top:y-span.current,behavior:"instant" }); }
      else if (y < span.current*0.75) { offset.current--; window.scrollTo({ top:y+span.current,behavior:"instant" }); }
    };
    const resize = () => { span.current = Math.max(1,(track.current!.offsetHeight-innerHeight)/3); restore(progress.current); };
    const key = (event: KeyboardEvent) => {
      if (lockedRef.current || (event.target as HTMLElement).closest("input,textarea,select,button,a")) return;
      if (event.key === "Home" || event.key === "End") { event.preventDefault(); restore(Math.floor(progress.current)+(event.key==="End"?0.96:0)); }
    };
    window.addEventListener("scroll",read,{passive:true}); window.addEventListener("resize",resize); window.addEventListener("keydown",key);
    return () => { window.removeEventListener("scroll",read); window.removeEventListener("resize",resize); window.removeEventListener("keydown",key); };
  },[enabled,track,progress,restore,onProgress]);
  return restore;
}

export function useRoomScroll(progress: React.RefObject<number>, active: boolean, experience: RoomExperience) {
  useEffect(() => {
    if (!active || experience === "standard") return;
    const interactive = (target: EventTarget | null) => (target as HTMLElement)?.closest?.("button,a,input,select,textarea,dialog,.directory");
    const wheel = (event: WheelEvent) => { if (interactive(event.target)) return; event.preventDefault(); progress.current += Math.max(-240,Math.min(240,event.deltaY))/(innerHeight*3); };
    let previous = 0;
    const start = (event: TouchEvent) => { previous=event.touches[0]?.clientY || 0; };
    const move = (event: TouchEvent) => { if (interactive(event.target)) return; const y=event.touches[0]?.clientY || previous; event.preventDefault(); progress.current += (previous-y)/(innerHeight*1.8); previous=y; };
    const key = (event: KeyboardEvent) => { if (interactive(event.target)) return; if (["ArrowDown","ArrowRight","PageDown","ArrowUp","ArrowLeft","PageUp"].includes(event.key)) { event.preventDefault(); progress.current += ["ArrowDown","ArrowRight","PageDown"].includes(event.key)?0.06:-0.06; } };
    window.addEventListener("wheel",wheel,{passive:false}); window.addEventListener("touchstart",start,{passive:true}); window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("keydown",key);
    return () => { window.removeEventListener("wheel",wheel);window.removeEventListener("touchstart",start);window.removeEventListener("touchmove",move);window.removeEventListener("keydown",key); };
  },[active,experience,progress]);
}
