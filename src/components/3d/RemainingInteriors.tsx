"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { contactChannels, contacts, hardwareProjects } from "@/data/portfolio";
import { roomActions, type RoomAction } from "@/data/rooms";
import { contactEntries } from "@/lib/contact-links";
import { Box, Sign } from "./Primitives";
import { Desk, Hotspot, Monitor } from "./RoomProps";
import MaintenanceRobot from "./MaintenanceRobot";

type InteractiveProps = { onObject: (action: RoomAction) => void };

function Cable({ points, color = "#b19c73" }: { points: [number, number, number][]; color?: string }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point))), [points]);
  return <mesh><tubeGeometry args={[curve, 18, 0.018, 5, false]} /><meshStandardMaterial color={color} roughness={1} /></mesh>;
}

function Board({ arduino = false }: { arduino?: boolean }) {
  return <group>
    <Box position={[0, 1.49, 0.13]} scale={[0.75, 0.07, 0.48]} color={arduino ? "#537a72" : "#657b55"} />
    <Box position={[0.04, 1.57, 0.1]} scale={[0.22, 0.08, 0.21]} color="#303d3b" />
    <Box position={[-0.29, 1.56, 0.14]} scale={[0.16, 0.13, 0.18]} color="#a5a794" />
    {[-1, 1].map(side => <group key={side}>
      <Box position={[0, 1.55, 0.13 + side * 0.2]} scale={[0.53, 0.09, 0.045]} color="#343d38" />
      {[-0.2, -0.1, 0, 0.1, 0.2].map(x => <Box key={x} position={[x, 1.61, 0.13 + side * 0.2]} scale={[0.022, 0.07, 0.022]} color="#baac79" />)}
    </group>)}
    {!arduino && <group position={[0.68, 0, 0]}><Box position={[0, 1.53, 0.08]} scale={[0.36, 0.06, 0.27]} color="#3c5a55" /><group position={[0, 1.58, 0.09]} rotation={[-Math.PI / 2, 0, 0]}><Sign title="OLED" subtitle="PENDING" width={0.29} height={0.2} /></group></group>}
    <Cable points={[[0.2, 1.63, 0.28], [0.4, 1.77, 0.35], [0.7, 1.64, 0.2]]} />
    <Cable points={[[0.1, 1.63, -0.05], [0.35, 1.8, -0.13], [0.7, 1.64, 0]]} color="#83a69b" />
  </group>;
}

export function Workshop({ onObject }: InteractiveProps) {
  const completed = hardwareProjects.filter(project => project.status === "Selesai").length;
  return <>
    {[-1, 1].map((side, i) => <Desk key={side} position={[side * 1.65, 0, -8.7]} width={2.65}>
      <Monitor title={i === 0 ? "ESP32-C3 / OLED" : "ARDUINO / EXPERIMENTS"} subtitle={hardwareProjects[i]?.status === "Selesai" ? "SELESAI / LIHAT DOKUMENTASI" : hardwareProjects[i]?.status === "Dalam pengembangan" ? "DALAM PENGEMBANGAN" : "STATUS BELUM DIKONFIRMASI"} action={roomActions.workshop[i]} onObject={onObject} width={1.45} keyboard={false} />
      <group position={[0, 0, 0.1]}><Board arduino={i === 1} /></group>
    </Desk>)}
    <Box position={[0, 1.35, -8.7]} scale={[0.7, 0.14, 1.05]} color="#a19879" />
    <group position={[0, 3.35, -10.34]}>
      <Box position={[0, 0, 0]} scale={[1.95, 1.1, 0.08]} color="#7f826a" />
      <group position={[0, 0, 0.06]}><Sign title="EXPERIMENT LOG" subtitle={`${completed} SELESAI / STATUS SESUAI DATA`} width={1.8} height={0.95} color="#cfbd8b" /></group>
      <Hotspot action={roomActions.workshop[2]} position={[0, 0, 0.13]} size={[2, 1.2, 0.18]} onObject={onObject} />
    </group>
    <group position={[2.5, 3.2, -10.3]}>
      <Box position={[0, 0, 0]} scale={[1.4, 1.35, 0.08]} color="#7d8771" />
      {[-0.42, 0, 0.42].map((x, i) => <group key={x} rotation={[0, 0, i === 1 ? 0.1 : -0.06]}>
        <Box position={[x, -0.13, 0.09]} scale={[0.12, 0.48, 0.12]} color={i === 0 ? "#b29c6b" : "#627f70"} />
        <Box position={[x, 0.25, 0.09]} scale={[i === 2 ? 0.3 : 0.035, 0.4, 0.06]} color="#adb19c" />
      </group>)}
    </group>
    <Box position={[-3.05, 0.65, -6.9]} scale={[0.85, 1.3, 1.2]} color="#697e68" />
    <group position={[-3.05, 1.5, -6.7]}><Sign title="PARTS / TOOLS" subtitle="WORKBENCH STORAGE" width={0.85} height={0.3} /></group>
    <Box position={[0, 1.42, -8.4]} scale={[0.48, 0.18, 0.45]} color="#445b53" />
    <Box position={[0.06, 1.6, -8.4]} scale={[0.06, 0.5, 0.055]} rotation={[0, 0, -0.6]} color="#b9b59b" />
    <Cable points={[[0, 1.55, -8.4], [-0.35, 1.5, -8.1], [-0.45, 0.6, -8], [-0.15, 0.07, -8.5]]} color="#435c56" />
  </>;
}

export function Research({ onObject, reducedMotion }: InteractiveProps & { reducedMotion: boolean }) {
  return <>
    <Desk position={[-2.05, 0, -8.9]} width={2.25}>
      <Box position={[0, 1.46, 0]} scale={[1.25, 0.08, 0.85]} color="#71877b" />
      {[-0.15, 0, 0.15].map(z => <Box key={z} position={[0, 1.51, z]} scale={[0.9, 0.02, 0.055]} color="#354c46" />)}
      <group position={[0, 1.97, -0.38]} rotation={[-0.1, 0, 0]}>
        <Box position={[0, 0, 0]} scale={[1.28, 0.9, 0.1]} color="#3c504b" />
        <group position={[0, 0, 0.06]}><Sign title="LOCAL LLM" subtitle="DALAM PENGEMBANGAN" width={1.14} height={0.75} color="#a2bdb0" /></group>
        <Hotspot action={roomActions.research[0]} position={[0, 0, 0.15]} size={[1.4, 1.05, 0.18]} onObject={onObject} />
      </group>
    </Desk>
    <group position={[2.45, 0, -9.2]}>
      <Box position={[0, 0.14, 0]} scale={[1.5, 0.28, 1.25]} color="#364a44" />
      {[-1, 1].map(side => <Box key={side} position={[side * 0.67, 1.63, 0]} scale={[0.12, 3.1, 1.1]} color="#50675f" />)}
      <Box position={[0, 3.16, 0]} scale={[1.5, 0.16, 1.2]} color="#7d8b78" />
      {[0, 1, 2].map(i => <group key={i}>
        <Box position={[0, 0.7 + i * 0.82, 0]} scale={[1.17, 0.61, 0.9]} color={i === 0 ? "#667a6a" : "#455c55"} />
        <Box position={[-0.18, 0.7 + i * 0.82, 0.48]} scale={[0.58, 0.15, 0.025]} color="#293e39" />
        <Box position={[0.41, 0.7 + i * 0.82, 0.49]} scale={[0.05, 0.055, 0.03]} color="#b4a279" />
      </group>)}
      <group position={[0, 3.55, 0.08]}><Sign title="HOMELAB" subtitle="DALAM PENGEMBANGAN" width={1.6} height={0.6} /></group>
      <Hotspot action={roomActions.research[1]} position={[0, 1.7, 0.58]} size={[1.5, 3.1, 0.2]} onObject={onObject} />
    </group>
    <group position={[0, 0, -8.6]}>
      <Box position={[0, 0.67, 0]} scale={[1.2, 1.34, 1.05]} color="#556e63" />
      <Box position={[0, 1.39, 0]} scale={[1.55, 0.12, 1.3]} color="#9eaa90" />
      <mesh name="research-ai-projection" position={[0, 2.35, 0]}><torusGeometry args={[0.64, 0.018, 6, 48]} /><meshBasicMaterial color="#91b3a8" transparent opacity={0.62} toneMapped={false} /></mesh>
      <Box position={[0, 2.35, 0]} scale={[0.12, 0.12, 0.09]} color="#91aca0" />
      <group position={[0, 0.8, 0.54]}><Sign title="PROTOTYPE ONLY" subtitle="FUTURE LOCAL LLM INTERFACE" width={1.05} height={0.55} /></group>
      <Hotspot action={roomActions.research[2]} position={[0, 2.35, 0.05]} size={[1.45, 1.45, 0.2]} onObject={onObject} />
    </group>
    <MaintenanceRobot position={[1.25, 0, -8.15]} scale={0.75} reducedMotion={reducedMotion} action={roomActions.research[3]} onObject={onObject} />
  </>;
}

export function Transmission({ onObject }: InteractiveProps) {
  const entries = contactEntries(contactChannels, contacts);
  return <>
    <Desk position={[0, 0, -8.7]} width={3.4}><Monitor title="TRANSMISSION" subtitle="EMAIL / GITHUB / INSTAGRAM" action={roomActions.transmission[0]} onObject={onObject} width={2.1} />
      <group position={[-1.28, 0, 0.15]}>
        <Box position={[0, 1.6, 0]} scale={[0.65, 0.35, 0.45]} color="#536a64" />
        <Box position={[0, 1.63, 0.24]} scale={[0.35, 0.1, 0.025]} color="#293f3d" />
        <Box position={[-0.23, 2.25, -0.12]} scale={[0.025, 1.1, 0.025]} rotation={[0, 0, -0.12]} color="#acaf98" />
      </group>
    </Desk>
    {entries.map((entry, i) => <group key={entry.kind} position={[(i - 1) * 2.4, 3.25, -10.34]}>
      <Box position={[0, 0, 0]} scale={[1.85, 0.95, 0.1]} color={entry.url ? "#748f80" : "#687c72"} />
      <group position={[0, 0, 0.07]}><Sign title={entry.label} subtitle={entry.url ? "TAUTAN TERSEDIA" : "BELUM DIPUBLIKASIKAN"} width={1.7} height={0.8} color="#b6c5af" /></group>
      <Hotspot action={roomActions.transmission[i + 1]} position={[0, 0, 0.16]} size={[1.95, 1.05, 0.18]} onObject={onObject} />
    </group>)}
    <Box position={[-2.85, 0.75, -8.9]} scale={[1, 1.5, 1.1]} color="#687f72" />
    <group position={[2.8, 2, -9.5]}><Sign title="TRANSMISSION LOG" subtitle="CHANNELS / STANDBY" width={1.35} height={0.65} /></group>
    <Cable points={[[-1.2, 1.5, -8.7], [-1.7, 1.5, -8.3], [-2.5, 0.3, -8.7], [-2.7, 0.08, -9.2]]} color="#4a625b" />
  </>;
}
