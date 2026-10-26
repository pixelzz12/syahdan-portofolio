"use client";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
type Surface = "paint" | "concrete" | "metal";
const PaintContext = createContext<Record<Surface, THREE.Texture> | null>(null);

function makePaintTexture(surface: Surface) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = surface === "concrete" ? "#eeeade" : "#f4f2e9"; ctx.fillRect(0, 0, 256, 256);
  let seed = 42;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  // Small, deterministic dry-brush marks; shared by geometry, no downloaded textures.
  for (let i = 0; i < 220; i++) {
    ctx.fillStyle = `rgba(80,84,78,${0.015 + random() * 0.035})`;
    const x = random() * 256, y = random() * 256;
    ctx.save(); ctx.translate(x, y); ctx.rotate(surface === "metal" ? 0 : random() * 0.35 - 0.175);
    ctx.fillRect(0, 0, 8 + random() * 44, 3 + random() * 11); ctx.restore();
  }
  ctx.strokeStyle = "#fff9e512"; ctx.lineWidth = 2; ctx.strokeRect(2, 2, 252, 252);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function Box({ position, scale, color, surface = "paint", ...rest }: { position: [number, number, number]; scale: [number, number, number]; color: string; surface?: Surface; rotation?: [number, number, number] }) {
  const paint = useContext(PaintContext);
  return <mesh position={position} scale={scale} castShadow receiveShadow {...rest}><boxGeometry /><meshStandardMaterial color={color} map={paint?.[surface]} roughness={1} metalness={0} /></mesh>;
}

export function Sign({ title, subtitle, width = 2.65, height = 0.65, color = "#d6d3c9" }: { title: string; subtitle?: string; width?: number; height?: number; color?: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#252c30"; ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = color; ctx.fillRect(25, 35, 7, 186);
    ctx.font = "bold 57px Arial"; ctx.fillText(title.toUpperCase(), 62, subtitle ? 111 : 151, 925);
    if (subtitle) { ctx.font = "28px monospace"; ctx.fillStyle = "#9baba8"; ctx.fillText(subtitle.toUpperCase(), 65, 177, 920); }
    const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, [title, subtitle, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh><planeGeometry args={[width, height]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>;
}

export function PaintedSurfaces({ children }: { children: ReactNode }) { const paint = useMemo(() => ({ paint: makePaintTexture("paint"), concrete: makePaintTexture("concrete"), metal: makePaintTexture("metal") }), []); useEffect(() => () => Object.values(paint).forEach(texture => texture.dispose()), [paint]); return <PaintContext.Provider value={paint}>{children}</PaintContext.Provider>; }
