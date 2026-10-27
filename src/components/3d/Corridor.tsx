"use client";

import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { type SectorId } from "@/data/portfolio";
import { bays, doors as placements, type FacilityPhase } from "@/lib/facility-layout";
import CameraRig from "./CameraRig";
import { Box, Sign, PaintedSurfaces } from "./Primitives";
import { hasInterior, type RoomAction, type RoomId, type RoomView } from "@/data/rooms";
import RoomInteriors from "./RoomInteriors";
import MaintenanceRobot from "./MaintenanceRobot";
import SpatialTitle from "./SpatialTitle";
import WallDetails from "./WallDetails";
import OperatorAvatar from "./OperatorAvatar";
import UniversityHologram from "./UniversityHologram";
import LoopGate from "./LoopGate";
import PeriodicLights from "./PeriodicLights";
import type { RoomExperience, SceneNavigation } from "@/lib/scene-navigation";

type Props = { progress:React.RefObject<number>; navigation:React.RefObject<SceneNavigation>; roomProgress:React.RefObject<number>; experience:RoomExperience; selectedTile:number; departingTile:number; destination:SectorId|null; departingRoom:RoomId|null; phase:FacilityPhase; roomView:RoomView; inspectionOpen:boolean; selectedAction:RoomAction|null; reducedMotion:boolean; onObject:(action:RoomAction)=>void; onDoor:(id:SectorId,copy?:number)=>void; onReady:()=>void; onFailure:()=>void; onArrive:(id:SectorId)=>void; onReturn:(progress:number)=>void };
function Door({ item, onDoor, onObject, active, reducedMotion, copy, sceneProps }: { item: typeof placements[number]; onDoor: Props["onDoor"]; onObject: Props["onObject"]; active: boolean; reducedMotion: boolean; copy:number; sceneProps:Props }) {
  const interior = hasInterior(item.id) ? item.id : null;
  const [hovered, setHovered] = useState(false);
  const [nearby, setNearby] = useState(false);
  const near = useRef(false);
  const doorway = useRef<THREE.Group>(null);
  const frontage = useRef<THREE.Group>(null);
  const localCamera = useRef(new THREE.Vector3());
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  useFrame(({camera}, delta) => {
    if (doorway.current && frontage.current) {
      doorway.current.worldToLocal(localCamera.current.copy(camera.position));
      const approaching = sceneProps.phase === "corridor" && Math.abs(localCamera.current.x) < (near.current ? 9 : 8.4) && localCamera.current.z > 0 && localCamera.current.z < 9;
      if (approaching !== near.current) { near.current = approaching; setNearby(approaching); }
      const amount = approaching || (hovered && sceneProps.phase === "corridor") ? 0.58 : 0;
      frontage.current.position.z = reducedMotion ? amount : THREE.MathUtils.damp(frontage.current.position.z, amount, 7, delta);
    }
    const opening = active ? 1.72 : 0.67;
    if (left.current && right.current) {
      left.current.position.x = reducedMotion ? -opening : THREE.MathUtils.damp(left.current.position.x, -opening, 6, delta);
      right.current.position.x = -left.current.position.x;
    }
  });
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onDoor(item.id,copy); };
  return <group ref={doorway} position={[item.x, 0, item.z]} rotation={[0, item.side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
    {/* A real wall opening and shallow vestibule, rather than a painted-on door. */}
    <Box position={[0, -0.08, -1.65]} scale={[4.1, 0.16, 3.8]} color="#696c5f" surface="concrete" />
    {!interior && <Box position={[0, 2.4, -3.5]} scale={[4.1, 4.8, 0.2]} color="#435853" />}
    <Box position={[0, 4.7, -1.7]} scale={[4.1, 0.2, 3.7]} color="#363f3d" />
    {[-1, 1].map(side => <Box key={`alcove-${side}`} position={[side * 2, 2.4, -1.7]} scale={[0.16, 4.8, 3.7]} color="#666f62" />)}
    {!interior && <><group position={[0, 2.8, -3.38]}><Sign title={`${item.number} / ${item.name}`} subtitle="SECTOR ACCESS / PORTFOLIO" width={3.3} height={0.85} color={item.accent} /></group><Box position={[0, 0.9, -3.14]} scale={[2.1, 0.75, 0.4]} color="#77877a" /></>}
    {interior && active && <RoomInteriors room={interior} onObject={onObject} reducedMotion={reducedMotion} navigation={sceneProps.navigation} experience={sceneProps.experience} selectedAction={sceneProps.selectedAction} inspectionOpen={sceneProps.inspectionOpen} />}
    <mesh position={[0, 4.45, -1.9]}><boxGeometry args={[1.6, 0.06, 0.12]} /><meshBasicMaterial color={item.accent} /></mesh>
    {active && <pointLight position={[0, 3.7, -1.8]} intensity={12} distance={7} color="#dec89c" />}
    <group ref={frontage} name={`door-front-${item.id}-${copy}`} userData={{nearby}}>
    {[-1, 1].map(side => <group key={`leaf-${side}`} ref={side === -1 ? left : right} position={[side * 0.67, 0, 0]}>
      <Box position={[0, 1.97, 0]} scale={[1.32, 3.88, 0.18]} color={hovered ? "#7b9287" : item.bay === 1 ? "#7e7861" : "#60796f"} />
      <Box position={[0, 0.44, 0.12]} scale={[1.19, 0.57, 0.045]} color="#394c48" surface="metal" />
      <Box position={[0, 3.65, 0.12]} scale={[1.15, 0.025, 0.04]} color="#a8b4a0" />
      <Box position={[-side * 0.46, 1.8, 0.15]} scale={[0.055, 0.58, 0.1]} color="#b5b39c" surface="metal" />
      <group position={[0, 2.75, 0.105]}><Sign title={item.number} width={0.72} height={0.5} color={item.accent} /></group>
    </group>)}
    {[-1, 1].map(side => <group key={side}>
      <Box position={[side * 1.52, 2.1, 0.3]} scale={[0.22, 4.2, 0.35]} color="#8a8e81" />
    </group>)}
    <Box position={[0, 4.16, 0.26]} scale={[3.25, 0.23, 0.4]} color="#8a8e81" />
    <Box position={[0, 0.035, 0.05]} scale={[3.3, 0.06, 1.2]} color="#a89a73" />
    <group position={[0, 4.7, 0.27]}><Sign title={`${item.number} / ${item.name}`} subtitle={nearby || hovered ? "KLIK / KETUK PINTU UNTUK MASUK" : item.label} color={item.accent} /></group>
    {(nearby || hovered) && <group position={[0, 1.3, 0.16]}><Sign title="MASUK SEKTOR  >" subtitle="KLIK / KETUK" width={1.8} height={0.5} color="#ecd4a2" /></group>}
    <Box position={[1.91, 2, 0.18]} scale={[0.3, 0.5, 0.22]} color="#343b43" />
    <mesh position={[1.92, 2.1, 0.31]}><boxGeometry args={[0.13, 0.07, 0.02]} /><meshBasicMaterial color="#c5ae78" /></mesh>
    <mesh position={[0, 4.32, 0.47]}><boxGeometry args={[1.35, 0.08, 0.1]} /><meshBasicMaterial color={hovered ? "#f2d59d" : "#bdab7b"} /></mesh>
    {/* Invisible generous hit area; every door also has an equivalent HTML button. */}
    <mesh name={`door-hit-${item.id}-${copy}`} position={[0, 2.3, 0.6]} onClick={click} onPointerOver={e => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = ""; }}>
      <planeGeometry args={[3.4, 5.1]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
    </group>
  </group>;
}

function WallSegment({ x, from, to, height }: { x: number; from: number; to: number; height: number }) {
  if (to - from < 0.01) return null;
  const z = (from + to) / 2, length = to - from;
  return <group>
    <Box position={[x, 0.6, z]} scale={[0.3, 1.2, length]} color="#455d56" />
    <Box position={[x, 2.85, z]} scale={[0.3, 3.3, length]} color="#a2a79c" />
    <Box position={[x, (4.5 + height) / 2, z]} scale={[0.3, height - 4.5, length]} color="#7d897a" />
    <Box position={[x - Math.sign(x) * 0.19, 1.22, z]} scale={[0.08, 0.055, length]} color="#b4ac8b" />
  </group>;
}

function Lamp({ position, teal = false }: { position: [number, number, number]; teal?: boolean }) {
  return <group position={position}>
    <Box position={[0, 0, 0]} scale={[0.8, 0.25, 0.35]} color="#374a46" surface="metal" />
    <mesh position={[0, -0.09, 0.12]}><boxGeometry args={[0.6, 0.1, 0.18]} /><meshBasicMaterial color={teal ? "#94b8ac" : "#e1bf80"} /></mesh>
    <Box position={[0, 0.05, 0.23]} scale={[0.86, 0.08, 0.45]} color="#536256" />
  </group>;
}

function Architecture() {
  return <>{bays.map((bay, bayIndex) => {
    const start = bay.center - bay.length / 2, end = bay.center + bay.length / 2;
    const count = Math.ceil(bay.length / 3), slab = bay.length / count;
    const beams = Math.ceil(bay.length / 7);
    return <group key={bay.name}>
      {Array.from({ length: count }, (_, i) => <group key={`floor-${i}`}>
        <Box position={[0, -0.15, start + (i + 0.5) * slab]} scale={[bay.halfWidth * 2, 0.29, slab - 0.025]} color={i % 3 === 0 ? "#7d8170" : "#898b78"} surface="concrete" />
        <Box position={[0, 0.004, start + (i + 0.5) * slab]} scale={[3.4, 0.025, slab - 0.04]} color={i % 2 ? "#96927b" : "#999882"} surface="concrete" />
        {[-1, 1].map(side => <Box key={side} position={[side * 2.1, 0.018, start + (i + 0.5) * slab]} scale={[0.09, 0.02, 1.4]} color="#c6b078" />)}
      </group>)}
      {[-1, 1].map(side => {
        const door = placements.find(item => item.bay === bayIndex && item.side === side)!;
        const wallX = side * (bay.halfWidth + 0.14);
        return <group key={side}>
          <WallSegment x={wallX} from={start} to={door.z - 1.85} height={bay.height} />
          <WallSegment x={wallX} from={door.z + 1.85} to={end} height={bay.height} />
          <Box position={[wallX, (4.35 + bay.height) / 2, door.z]} scale={[0.3, bay.height - 4.35, 3.7]} color="#919880" />
          <Box position={[side * (bay.halfWidth / 2 + 0.8), bay.height, bay.center]} scale={[bay.halfWidth - 1.6, 0.25, bay.length]} color="#4f5f56" />
          {[0, 1].map(i => <mesh key={i} position={[side * (bay.halfWidth - 0.32), bay.height - 0.8 - i * 0.28, bay.center]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.09 - i * 0.025, 0.09 - i * 0.025, bay.length, 8]} /><meshStandardMaterial color={i ? "#8a9d8a" : "#a49672"} roughness={1} /></mesh>)}
          <group position={[side * (bay.halfWidth - 1.1), 4.1, door.z + 1.9]}><Sign title={`SECTOR ${door.number}`} subtitle={door.label} width={1.5} height={0.48} color={door.accent} /></group>
          <Lamp position={[side * (bay.halfWidth - 0.25), 3.7, door.z + 3.5]} teal={side === 1} />
        </group>;
      })}
      {Array.from({ length: beams }, (_, i) => <group key={`beam-${i}`} position={[0, 0, end - (i + 0.5) * bay.length / beams]}>
        <Box position={[0, bay.height - 0.25, 0]} scale={[bay.halfWidth * 2, 0.35, 0.38]} color="#3c514a" surface="metal" />
        {[-1, 1].map(side => <group key={side}>
          <Box position={[side * (bay.halfWidth - 0.2), bay.height / 2, 0]} scale={[0.32, bay.height, 0.38]} color="#566d5f" />
          <Box position={[side * (bay.halfWidth - 0.78), bay.height - 0.9, 0]} scale={[0.18, 1.8, 0.32]} rotation={[0, 0, side * 0.65]} color="#929981" />
          <Box position={[side * (bay.halfWidth - 0.4), 0.15, 0]} scale={[0.7, 0.3, 0.68]} color="#4c5b4e" />
        </group>)}
        <mesh position={[0, bay.height + 0.09, -1.2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[3.15, bay.length / beams - 0.3]} /><meshBasicMaterial color={bayIndex === 1 ? "#cbd4bd" : "#a8bbae"} side={THREE.DoubleSide} /></mesh>
      </group>)}
      <Lamp position={[-1, bay.height - 0.7, bay.center + 3]} />
    </group>;
  })}
    {/* Portal shoulders make the width/height changes legible from the main route. */}
    {[-16, -38].map(z => <group key={z}>
      <Box position={[0, 5.65, z]} scale={[12, 0.8, 0.65]} color="#3a5049" />
      {[-1, 1].map(side => <Box key={side} position={[side * 4.65, 2.6, z]} scale={[0.5, 5.2, 0.65]} color="#6d7b66" />)}
      <group position={[0, 4.85, z + 0.36]}><Sign title={z === -16 ? "03—04 / PROCESS ATRIUM" : "05—06 / RESEARCH WING"} subtitle="NOVA NODE / CONTINUE FORWARD" width={3.3} height={0.65} /></group>
    </group>)}
    {/* Elevated maintenance bridge and side catwalk, clear of the walking route. */}
    <Box position={[0, 5.1, -29]} scale={[11.9, 0.25, 1.6]} color="#4a6054" surface="metal" />
    <Box position={[-5.1, 5.1, -27]} scale={[1.25, 0.2, 19]} color="#556b5b" />
    {[-29.7, -28.3].map(z => <group key={z}>
      <Box position={[0, 6.15, z]} scale={[11.8, 0.08, 0.08]} color="#ab9b71" />
      {[-5.5, -3.3, -1.1, 1.1, 3.3, 5.5].map(x => <Box key={x} position={[x, 5.65, z]} scale={[0.06, 1.05, 0.06]} color="#ab9b71" />)}
    </group>)}
    <Box position={[-4.5, 6.15, -27]} scale={[0.08, 0.08, 19]} color="#a49c74" />
    {[-35, -31, -27, -23, -19].map(z => <Box key={z} position={[-4.5, 5.65, z]} scale={[0.07, 1.05, 0.07]} color="#a49c74" />)}
  </>;
}

function ServiceProps() {
  return <>
    <group position={[4.15, 0, 5.8]} rotation={[0, -Math.PI / 2, 0]}>
      <Box position={[0, 1.5, 0]} scale={[1.3, 3, 0.55]} color="#6e8071" />
      <Box position={[0, 1.65, 0.3]} scale={[1.08, 2.45, 0.1]} color="#8f9480" />
      {[0, 1, 2, 3].map(i => <Box key={i} position={[0, 2.5 - i * 0.12, 0.37]} scale={[0.76, 0.035, 0.04]} color="#465a50" />)}
      <Box position={[0.32, 1.55, 0.4]} scale={[0.05, 0.35, 0.07]} color="#c3b99a" />
      <group position={[-0.1, 0.8, 0.365]}><Sign title="SERVICE" subtitle="MAINTENANCE / 01" width={0.7} height={0.25} /></group>
      <mesh position={[0.29, 1.25, 0.37]}><boxGeometry args={[0.07, 0.07, 0.04]} /><meshBasicMaterial color="#d0ac68" /></mesh>
    </group>
    {[0, 1].map(i => <group key={i} position={[3.7, 0, 8 + i * 1.1]}>
      <Box position={[0, 0.44, 0]} scale={[0.95, 0.85, 0.9]} color={i ? "#9b8e6e" : "#6c7f69"} />
      <Box position={[0, 0.89, 0]} scale={[1.02, 0.07, 0.96]} color="#b6ab89" />
      {[-1, 1].map(side => <Box key={side} position={[side * 0.33, 0.45, 0.46]} scale={[0.07, 0.76, 0.04]} color="#525e4e" />)}
    </group>)}
    <group position={[-5.65, 0, -29]}>
      <Box position={[0, 0.7, 0]} scale={[0.5, 1.4, 2]} color="#7d8972" />
      <Box position={[0.05, 1.5, 0]} scale={[0.75, 0.15, 2.15]} color="#aba17e" />
      <mesh position={[0.42, 2.5, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.15, 0.15, 0.04, 12]} /><meshStandardMaterial color="#bcaa7d" roughness={1} /></mesh>
    </group>
    {[-1, 1].map(side => <group key={side} position={[side * 3.4, 0, 11.5]}>
      {[0, 1, 2].map(i => <Box key={i} position={[0, 0.58, i * 0.9]} scale={[0.07, 1.16, 0.07]} color="#b3a47a" />)}
      <Box position={[0, 1.16, 0.9]} scale={[0.09, 0.09, 2]} color="#b3a47a" />
    </group>)}
  </>;
}

function CorridorCopy({copy,props}:{copy:number;props:Props}) {
  const group=useRef<THREE.Group>(null);
  useFrame(({camera})=>{if(group.current)group.current.visible=copy===0||(copy===1?camera.position.z<-42:camera.position.z>0)||(props.destination!==null&&props.selectedTile===copy)||(props.departingRoom!==null&&props.departingTile===copy);});
  return <group ref={group} position={[0,0,-copy*88]}><Architecture /><WallDetails /><SpatialTitle reducedMotion={props.reducedMotion} /><LoopGate copy={copy} reducedMotion={props.reducedMotion} />{placements.map(item=><Door key={item.id} item={item} copy={copy} sceneProps={props} onDoor={props.onDoor} onObject={props.onObject} active={(props.destination===item.id&&props.selectedTile===copy)||(props.departingRoom===item.id&&props.departingTile===copy)} reducedMotion={props.reducedMotion} />)}<ServiceProps /><UniversityHologram /><OperatorAvatar onSelect={()=>{if(props.phase==="corridor")props.onDoor("operator",copy);}} /><MaintenanceRobot reducedMotion={props.reducedMotion} /></group>;
}
function World(props: Props) {
  const { gl } = useThree();


  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); props.onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    props.onReady();
    return () => {
      // R3F intentionally loses the context when this scene is disposed. That is not a failure.
      gl.domElement.removeEventListener("webglcontextlost", lost);
      document.body.style.cursor = "";
    };
  }, [gl, props.onReady, props.onFailure]);
  return <PaintedSurfaces>
    <color attach="background" args={["#788580"]} />
    <fog attach="fog" args={["#788580", 30, 106]} />
    <ambientLight intensity={0.6} color="#d6d3c9" />
    <hemisphereLight args={["#c9d8d1", "#5c5c50", 1.4]} />
    <PeriodicLights />
    <CameraRig {...props} />
    {[-1,0,1].map(copy=><CorridorCopy key={copy} copy={copy} props={props} />)}
  </PaintedSurfaces>;
}

export default function Corridor(props: Props) {
  return <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.5, 2.65, 13], fov: 62, near: 0.1, far: 125 }} gl={{ antialias: true, powerPreference: "low-power" }} onCreated={({ gl }) => {
    gl.domElement.tabIndex=0;
    if (new URLSearchParams(window.location.search).get("scene-qa") === "1") gl.domElement.dataset.sceneQa = "true";
  }} aria-label="SYAHDAN, koridor 3D dengan enam sektor. Direktori tersedia untuk keyboard.">
    <World {...props} />
  </Canvas>;
}

