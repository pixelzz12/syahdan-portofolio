"use client";
import {useEffect,useRef} from "react";
export function useReadingMotion(active:boolean){
 const seen=useRef(new WeakSet<HTMLElement>());
 useEffect(()=>{
  if(!active)return;
  const root=document.querySelector<HTMLElement>('.reading-mode[data-active="true"]');if(!root)return;
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  let dispose=()=>{};
  const setup=()=>{
   dispose();
   if(media.matches||!("IntersectionObserver" in window))return;
   const animated=new Set<HTMLElement>(),selector=".reading-sector-label,.reading-sector-body>h2,.section-intro,.operator-grid,.interest-tags,.project-card,.achievement-card,.contact-channel,.photo-card,.empty-state,.cv-panel,.technology-card,.archive-slots>div";
   const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const node=entry.target as HTMLElement;observer.unobserve(node);if(seen.current.has(node))continue;seen.current.add(node);animated.add(node);const siblings=node.parentElement?Array.from(node.parentElement.children):[];node.style.setProperty("--read-delay",`${Math.min(siblings.indexOf(node)%4,3)*65}ms`);node.classList.add("read-reveal");}},{threshold:.04,rootMargin:"0px 0px -25px 0px"});
   const observe=(node:HTMLElement)=>{if(node.matches(selector)&&!seen.current.has(node))observer.observe(node);node.querySelectorAll<HTMLElement>(selector).forEach(el=>{if(!seen.current.has(el))observer.observe(el);});};observe(root);
   const mutations=new MutationObserver(records=>{for(const record of records)record.addedNodes.forEach(node=>{if(node instanceof HTMLElement)observe(node);});});mutations.observe(root,{childList:true,subtree:true});
   const finish=(event:AnimationEvent)=>{if(event.animationName!=="read-rise")return;const node=event.target as HTMLElement;node.classList.remove("read-reveal");animated.delete(node);};root.addEventListener("animationend",finish);
   const sections=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(!visible.length)return;const id=visible[0].target.id;root.querySelectorAll<HTMLAnchorElement>(".reading-nav a").forEach(a=>{if(a.hash===`#${id}`)a.setAttribute("aria-current","location");else a.removeAttribute("aria-current");});},{rootMargin:"-12% 0px -48% 0px",threshold:[0,.2,.5]});root.querySelectorAll(".reading-sector").forEach(s=>sections.observe(s));
   let frame=0;const scroll=()=>{if(frame)return;frame=requestAnimationFrame(()=>{root.style.setProperty("--read-parallax",`${Math.min(22,Math.max(0,scrollY*.035))}px`);frame=0;});};window.addEventListener("scroll",scroll,{passive:true});scroll();
   dispose=()=>{observer.disconnect();mutations.disconnect();sections.disconnect();window.removeEventListener("scroll",scroll);cancelAnimationFrame(frame);animated.forEach(el=>el.classList.remove("read-reveal"));root.style.removeProperty("--read-parallax");root.removeEventListener("animationend",finish);root.querySelectorAll(".reading-nav a[aria-current]").forEach(a=>a.removeAttribute("aria-current"));};
  };
  setup();media.addEventListener("change",setup);return()=>{dispose();media.removeEventListener("change",setup);};
 },[active]);
}
