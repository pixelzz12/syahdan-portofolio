"use client";
import { type RoomAction } from "@/data/rooms";
import { Box } from "./Primitives";
import { Hotspot } from "./RoomProps";
import {useEVIdle} from "./EVIdle";
export default function MaintenanceRobot({ reducedMotion, position = [-2.5, 0, 3.2], action, onObject, scale = 1 }: { reducedMotion: boolean; position?: [number, number, number]; action?: RoomAction; onObject?: (action: RoomAction) => void; scale?: number }) {
  const {robot,eyes,arm,bubble,map}=useEVIdle(reducedMotion);
  return <group position={position} rotation={[0, 0.25, 0]} scale={scale}>
    <group ref={robot} name={action ? "ev-research-idle" : "ev-corridor-idle"}>
      <Box position={[0, 0.58, 0]} scale={[0.66, 0.65, 0.48]} color="#b5aa8f" />
      <Box position={[0, 1.14, 0.02]} scale={[0.85, 0.51, 0.54]} color="#c5bda8" />
      <Box position={[0, 1.15, 0.305]} scale={[0.66, 0.28, 0.025]} color="#293b3d" />
      <group ref={eyes} position={[0,1.16,0.325]}>{[-1,1].map(side=><Box key={side} position={[side*.17,0,0]} scale={[.075,.1,.02]} color="#9ebeb3"/>)}</group>
      {[-1, 1].map(side => <group key={side}>
        <group ref={side===1?arm:undefined} position={[side*.43,.83,0]} rotation={[0,0,side*.12]}><Box position={[0,-.22,0]} scale={[.14,.43,.22]} color="#6c7b77"/></group>
        <mesh position={[side * 0.29, 0.22, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.22, 0.22, 0.19, 10]} /><meshStandardMaterial color="#343b43" roughness={1} /></mesh>
      </group>)}
      <Box position={[0.24, 1.55, 0]} scale={[0.035, 0.3, 0.035]} color="#818b91" />
      <mesh position={[0.24, 1.72, 0]}><sphereGeometry args={[0.055, 8, 8]} /><meshStandardMaterial color="#be9660" /></mesh>
    </group>
    <group ref={bubble} name="ev-code-bubble" visible={false} position={[.55,2.3,0]}><mesh><planeGeometry args={[2.5,.78125]}/><meshBasicMaterial map={map} transparent alphaTest={.02} depthWrite={false} toneMapped={false}/></mesh></group>
    {action && onObject && <Hotspot action={action} position={[0, 1, 0.12]} size={[1.05, 1.7, 0.8]} onObject={onObject} />}
  </group>;
}


