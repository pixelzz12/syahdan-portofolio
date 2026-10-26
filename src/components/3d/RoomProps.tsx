"use client";
import { useEffect, useState } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { type RoomAction } from "@/data/rooms";
import { Box, Sign } from "./Primitives";
export function ImagePlane({ src, width, height }: { src: string; width: number; height: number }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let live = true;
    const map = new THREE.TextureLoader().load(src, loaded => { loaded.colorSpace = THREE.SRGBColorSpace; if (live) setTexture(loaded); }, undefined, () => { if (live) setTexture(null); });
    return () => { live = false; map.dispose(); };
  }, [src]);
  const image = texture?.image as HTMLImageElement | undefined;
  const aspect = image?.width && image?.height ? image.width / image.height : width / height;
  const fittedWidth = Math.min(width, height * aspect);
  return texture ? <mesh><planeGeometry args={[fittedWidth, fittedWidth / aspect]} /><meshBasicMaterial map={texture} transparent alphaTest={0.02} toneMapped={false} /></mesh> : null;
}

export function Hotspot({ action, position, size, onObject }: { action: RoomAction; position: [number, number, number]; size: [number, number, number]; onObject: (action: RoomAction) => void }) {
  function enter(event: ThreeEvent<PointerEvent>) { event.stopPropagation(); document.body.style.cursor = "pointer"; }
  return <mesh name={`room-object-${action.id}`} position={position} userData={{ actionId: action.id }} onClick={event => { event.stopPropagation(); document.body.style.cursor = ""; onObject(action); }} onPointerOver={enter} onPointerOut={() => { document.body.style.cursor = ""; }}>
    <boxGeometry args={size} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
  </mesh>;
}

export function Desk({ position, width = 2.2, children }: { position: [number, number, number]; width?: number; children?: React.ReactNode }) {
  return <group position={position}>
    <Box position={[0, 1.35, 0]} scale={[width, 0.14, 1.05]} color="#a19879" />
    {[-1, 1].map(side => <Box key={side} position={[side * (width / 2 - 0.17), 0.66, 0]} scale={[0.12, 1.32, 0.8]} color="#4c625b" surface="metal" />)}
    <Box position={[0, 0.4, -0.35]} scale={[width - 0.2, 0.1, 0.08]} color="#5c7065" />
    {children}
  </group>;
}

export function Monitor({ title, subtitle, action, screenshot, onObject, width = 1.5, keyboard = true }: { title: string; subtitle: string; action: RoomAction; screenshot?: string; onObject: (action: RoomAction) => void; width?: number; keyboard?: boolean }) {
  return <group>
    <Box position={[0, 1.52, -0.18]} scale={[0.48, 0.06, 0.3]} color="#354844" />
    <Box position={[0, 1.8, -0.25]} scale={[0.09, 0.55, 0.1]} color="#536c62" />
    <Box position={[0, 2.18, -0.24]} scale={[width + 0.14, 1.03, 0.17]} color="#343d3e" />
    <group position={[0, 2.18, -0.145]}>{screenshot ? <ImagePlane src={screenshot} width={width} height={0.85} /> : <Sign title={title} subtitle={subtitle} width={width} height={0.85} color="#a9c3b5" />}</group>
    {keyboard && <><Box position={[0, 1.46, 0.28]} scale={[0.85, 0.065, 0.31]} color="#5e7068" /><Box position={[0.67, 1.46, 0.25]} scale={[0.12, 0.065, 0.2]} color="#bdbaa2" /></>}
    <Hotspot action={action} position={[0, 2.16, -0.11]} size={[width + 0.2, 1.12, 0.16]} onObject={onObject} />
  </group>;
}


