"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { type RoomAction } from "@/data/rooms";
import { Box, Sign } from "./Primitives";
import { Hotspot } from "./RoomProps";
export default function MaintenanceRobot({ reducedMotion, position = [-2.5, 0, 3.2], action, onObject, scale = 1 }: { reducedMotion: boolean; position?: [number, number, number]; action?: RoomAction; onObject?: (action: RoomAction) => void; scale?: number }) {
  const robot = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (robot.current && !reducedMotion) robot.current.position.y = 0.05 + Math.sin(clock.elapsedTime * 1.5) * 0.025; });
  return <group position={position} rotation={[0, 0.25, 0]} scale={scale}>
    <group ref={robot} name={action ? "ev-research-idle" : "ev-corridor-idle"}>
      <Box position={[0, 0.58, 0]} scale={[0.66, 0.65, 0.48]} color="#b5aa8f" />
      <Box position={[0, 1.14, 0.02]} scale={[0.85, 0.51, 0.54]} color="#c5bda8" />
      <Box position={[0, 1.15, 0.305]} scale={[0.66, 0.28, 0.025]} color="#293b3d" />
      {[-1, 1].map(side => <group key={side}>
        <Box position={[side * 0.17, 1.16, 0.325]} scale={[0.075, 0.1, 0.02]} color="#9ebeb3" />
        <Box position={[side * 0.43, 0.61, 0]} scale={[0.14, 0.43, 0.22]} color="#6c7b77" rotation={[0, 0, side * 0.12]} />
        <mesh position={[side * 0.29, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.22, 0.22, 0.19, 10]} /><meshStandardMaterial color="#343b43" roughness={1} /></mesh>
      </group>)}
      <Box position={[0.24, 1.55, 0]} scale={[0.035, 0.3, 0.035]} color="#818b91" />
      <mesh position={[0.24, 1.72, 0]}><sphereGeometry args={[0.055, 8, 8]} /><meshStandardMaterial color="#be9660" /></mesh>
    </group>
    {action && onObject && <Hotspot action={action} position={[0, 1, 0.12]} size={[1.05, 1.7, 0.8]} onObject={onObject} />}
    <group position={[0, 0.08, 0.85]} rotation={[-Math.PI / 2, 0, 0]}><Sign title="EV / prototype" width={1.3} height={0.35} /></group>
  </group>;
}


