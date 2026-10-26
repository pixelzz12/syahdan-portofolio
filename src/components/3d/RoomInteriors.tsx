"use client";




import { developmentProjects, photoSlots, profile, sectors } from "@/data/portfolio";
import { roomActions, type RoomAction, type RoomId } from "@/data/rooms";
import { Box, Sign } from "./Primitives";
import { Desk, Monitor, Hotspot, ImagePlane } from "./RoomProps";
import { Research, Transmission, Workshop } from "./RemainingInteriors";
import ProjectCore from "./ProjectCore";
import PaperJourney from "./PaperJourney";
import TechnologyWall from "./TechnologyWall";
import type { RoomExperience,SceneNavigation } from "@/lib/scene-navigation";
import { assetTexture } from "@/lib/assets";

function Shell({ room }: { room: RoomId }) {
  const film = room === "film";
  const compact = room === "workshop" || room === "research" || room === "transmission";
  const core=room==="development";
  const halfWidth = core?6:compact ? 3.6 : 4.3;
  const center = core?-10.5:compact ? -6.5 : -7.5;
  const depth = core?16:compact ? 8 : 10;
  const back = core?-18.55:compact ? -10.55 : -12.55;
  const height=core?6.8:5.2;
  const sector = sectors.find(item => item.id === room)!;
  return <>
    <Box position={[0, -0.1, center]} scale={[halfWidth * 2, 0.2, depth]} color={film ? "#555f57" : "#848775"} surface="concrete" />
    <Box position={[0, height/2, back]} scale={[halfWidth * 2 + 0.1, height, 0.2]} color={film ? "#485858" : room === "research" ? "#718b83" : room === "transmission" ? "#7b8e8b" : "#8b9789"} />
    {[-1, 1].map(side => <group key={side}>
      <Box position={[side * halfWidth, height/2, center]} scale={[0.2, height, depth]} color={film ? "#465450" : "#798d80"} />
      <Box position={[side * (compact ? 2.85 : 3.17), 2.6, -2.55]} scale={[compact ? 1.4 : 2.1, 5.2, 0.2]} color="#6c8073" />
      <Box position={[side * (halfWidth - 0.13), 0.6, center]} scale={[0.08, 1.15, depth - 0.2]} color="#394f4a" />
      <Box position={[side * (halfWidth - 0.25), 4.4, center]} scale={[0.15, 0.12, depth - 0.2]} color="#a49876" surface="metal" />
      {(compact ? [-4.8, -8.8] : [-5.2, -9.5]).map(z => <Box key={z} position={[side * (halfWidth - 0.18), 2.6, z]} scale={[0.15, 5.1, 0.2]} color="#4a6259" />)}
    </group>)}
    <Box position={[0, core?6.8:5.15, center]} scale={[halfWidth * 2, 0.2, depth]} color="#3d504a" />
    {(compact ? [-4.8, -8.8] : [-5.1, -9.5]).map(z => <Box key={z} position={[0, 4.95, z]} scale={[halfWidth * 2 - 0.1, 0.22, 0.2]} color="#718475" />)}
    <Box position={[0, 4.78, -8]} scale={[2.1, 0.15, 0.4]} color="#344d47" />
    <mesh position={[0, 4.68, -8]}><boxGeometry args={[1.8, 0.045, 0.24]} /><meshBasicMaterial color={film ? "#c48c6c" : "#d6c598"} /></mesh>
    <pointLight position={[0, 4.35, -8]} intensity={film ? 22 : 32} distance={13} color={film ? "#c99678" : "#e0cc9f"} />
    <group position={[0, 3.85, back + 0.13]}><Sign title={`${sector.number} / ${sector.name}`} subtitle={film ? "AUTHENTIC PHOTOS / ARCHIVE IN PREPARATION" : room === "research" ? "PROTOTYPES / DALAM PENGEMBANGAN" : room === "transmission" ? "CONTACT CHANNELS / STANDBY" : "WORK / LEARN / MAKE"} width={4} height={0.7} /></group>
  </>;
}

function Development({ onObject }: { onObject: (action: RoomAction) => void }) {
  const locations: [number, number, number][] = [[-2.65, 0, -9.9], [0, 0, -10.1], [2.65, 0, -9.9], [2.65, 0, -6.25]];
  return <>{roomActions.development.map((action, i) => {
    const project = developmentProjects.find(item => item.id === action.projectId);
    return <group key={action.id}>
      <Desk position={locations[i]} width={i === 1 ? 2.35 : 2.1}><Monitor title={action.label} subtitle={project?.status === "Dalam pengembangan" ? "DALAM PENGEMBANGAN" : "DETAIL / ASET MENYUSUL"} action={action} screenshot={project?.screenshot} onObject={onObject} width={i === 1 ? 1.7 : 1.4} /></Desk>
      <Box position={[locations[i][0], 0.7, locations[i][2] + 1]} scale={[0.7, 0.12, 0.6]} color="#455e54" />
      <Box position={[locations[i][0], 0.33, locations[i][2] + 1]} scale={[0.12, 0.65, 0.12]} color="#6c7c69" />
    </group>;
  })}<group position={[-3.8, 2.4, -6.5]} rotation={[0, Math.PI / 2, 0]}><Sign title="BUILD / ITERATE" subtitle="PROJECT DETAILS REMAIN EDITABLE" width={2.1} height={0.75} /></group></>;
}

function Operator({ onObject }: { onObject: (action: RoomAction) => void }) {
  return <>
    <Desk position={[-1.15, 0, -9.4]} width={3.8}>
      <Monitor title="SYAHDAN / PROFILE" subtitle="WEB / PHOTOGRAPHY / TECHNOLOGY" action={roomActions.operator[0]} onObject={onObject} width={1.6} />
      <group position={[-1.15, 1.58, 0.16]}>
        <Box position={[0, 0, 0]} scale={[0.45, 0.33, 0.23]} color="#384845" />
        <mesh position={[0.04, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.14, 0.14, 0.23, 12]} /><meshStandardMaterial color="#222e30" roughness={1} /></mesh>
        <Box position={[0.12, 0.2, 0]} scale={[0.16, 0.09, 0.18]} color="#637970" />
        <Hotspot action={roomActions.operator[1]} position={[0, 0, 0.1]} size={[0.72, 0.6, 0.65]} onObject={onObject} />
      </group>
      <group position={[1.12, 1.46, 0.13]} rotation={[0, -0.14, 0]}>
        <Box position={[0, 0, 0]} scale={[0.7, 0.065, 0.48]} color="#c2baa0" />
        <Box position={[0, -0.04, 0]} scale={[0.74, 0.035, 0.51]} color="#57766b" />
        <Box position={[-0.2, 0.05, 0]} scale={[0.02, 0.025, 0.4]} color="#555e50" rotation={[0, 0.18, 0]} />
        <Hotspot action={roomActions.operator[2]} position={[0, 0.12, 0]} size={[0.8, 0.35, 0.65]} onObject={onObject} />
      </group>
    </Desk>
    <group position={[2.5, 2.7, -12.35]}>
      <Box position={[0, 0, 0]} scale={[2.05, 1.65, 0.12]} color="#b5ad90" />
      <group position={[0, 0, 0.07]}>{profile.universityLogo ? <ImagePlane src={profile.universityLogo} width={1.2} height={1.2} /> : <Sign title="UNIVERSITAS AIRLANGGA" subtitle="SLOT LOGO RESMI / BELUM DITAMBAHKAN" width={1.86} height={1.4} color="#c8bea1" />}</group>
      <Hotspot action={roomActions.operator[3]} position={[0, 0, 0.17]} size={[2.1, 1.7, 0.2]} onObject={onObject} />
    </group>
    <Box position={[2.7, 0.75, -10.4]} scale={[1.4, 1.5, 0.8]} color="#647f70" />
    {[0, 1, 2].map(i => <Box key={i} position={[2.7, 0.28 + i * 0.46, -9.97]} scale={[1.15, 0.035, 0.06]} color="#b4b295" />)}
    <group position={[-2.1, 3.05, -12.38]}><Sign title="MUHAMMAD SYAHDAN" subtitle="HERDHIYANTA / TEKNIK INFORMATIKA" width={3} height={0.7} /></group>
  </>;
}

function Film({ onObject }: { onObject: (action: RoomAction) => void }) {
  const rows = Math.max(1, Math.ceil(photoSlots.length / 6));
  const rowZ = (row: number) => -6.9 - row * 3.6 / Math.max(1, rows - 1);
  return <>
    <Desk position={[0, 0, -10.5]} width={3.1}><Monitor title="PHOTO INSPECTION" subtitle="ARCHIVE / BEFORE & AFTER" action={roomActions.film[1]} onObject={onObject} width={2} /></Desk>
    <group position={[-3.15, 0, -9.4]}>
      <Box position={[0, 1.6, 0]} scale={[1.35, 3.2, 1.3]} color="#50665f" />
      {[0, 1, 2, 3].map(i => <group key={i}><Box position={[0, 0.5 + i * 0.72, 0.68]} scale={[1.15, 0.58, 0.06]} color="#8c8a72" /><Box position={[0, 0.5 + i * 0.72, 0.73]} scale={[0.4, 0.065, 0.06]} color="#c0b69a" /></group>)}
      <group position={[0, 3.55, 0.1]}><Sign title="PHOTO ARCHIVE" subtitle={`${photoSlots.filter(slot => slot.photo).length} / ${photoSlots.length} SLOTS FILLED`} width={1.45} height={0.5} /></group>
      <Hotspot action={roomActions.film[0]} position={[0, 1.6, 0.8]} size={[1.55, 3.3, 0.25]} onObject={onObject} />
    </group>
    {Array.from({ length: rows }, (_, row) => <group key={row}>
      <Box position={[0, 4.05, rowZ(row)]} scale={[7.1, 0.025, 0.025]} color="#a3a18a" surface="metal" />
      {[0, 1].map(side => <Box key={side} position={[side ? 3.5 : -3.5, 4.6, rowZ(row)]} scale={[0.025, 1.1, 0.025]} color="#88968a" />)}
    </group>)}
    {photoSlots.map((slot, i) => {
      const row = Math.floor(i / 6), column = i % 6, count = Math.min(6, photoSlots.length - row * 6);
      const action: RoomAction = { id: `print-${slot.id}`, label: slot.photo?.title || `Slot foto ${slot.id}`, kind: "photo", slotId: slot.id };
      return <group key={slot.id} position={[(column - (count - 1) / 2) * 1.06, 3.48, rowZ(row)]} rotation={[0, (i % 3 - 1) * 0.07, (i % 2 ? 1 : -1) * 0.035]}>
        <Box position={[0, 0, 0]} scale={[0.85, 0.9, 0.025]} color="#c6c0aa" />
        <Box position={[0, 0.49, 0]} scale={[0.08, 0.19, 0.08]} color="#85927d" />
        <group position={[0, 0.015, 0.02]}>{slot.photo ? <ImagePlane src={assetTexture(slot.photo.src,slot.photo.thumbnailSrc)} width={0.73} height={0.69} /> : <Sign title={`SLOT ${slot.id}`} subtitle="MENUNGGU FOTO ASLI" width={0.73} height={0.67} color="#c4b898" />}</group>
        <Hotspot action={action} position={[0, 0, 0.055]} size={[0.91, 0.94, 0.1]} onObject={onObject} />
      </group>;
    })}
    <Box position={[3.3, 0.65, -10.4]} scale={[1.3, 1.3, 1.3]} color="#695b50" />
    <group position={[3.3, 1.9, -10.4]}><Sign title="RAW / PRINTS" subtitle="AUTHENTIC ASSETS ONLY" width={1.4} height={0.55} color="#bf9c80" /></group>
  </>;
}

export default function RoomInteriors({ room,onObject,reducedMotion,navigation,experience,selectedAction,inspectionOpen }: {room:RoomId;onObject:(action:RoomAction)=>void;reducedMotion:boolean;navigation:React.RefObject<SceneNavigation>;experience:RoomExperience;selectedAction:RoomAction|null;inspectionOpen:boolean}) {
  return <group name={`interior-${room}`}><Shell room={room}/>{room==="development"?<ProjectCore onObject={onObject} selected={inspectionOpen?selectedAction?.id||null:null} reducedMotion={reducedMotion}/>:room==="operator"?<><Operator onObject={onObject}/><PaperJourney active={experience==="about"} navigation={navigation} onObject={onObject}/></>:room==="film"?<Film onObject={onObject}/>:room==="workshop"?<Workshop onObject={onObject}/>:room==="research"?<Research onObject={onObject} reducedMotion={reducedMotion}/>:<Transmission onObject={onObject}/>}<TechnologyWall room={room} onObject={onObject}/></group>;
}
