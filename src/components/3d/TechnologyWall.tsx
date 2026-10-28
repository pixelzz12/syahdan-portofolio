"use client";
import { technologies,featuredTechnologyIds } from "@/data/technologies";
import type { RoomId,RoomAction } from "@/data/rooms";
import { Box,Sign } from "./Primitives";
import { Hotspot,ImagePlane } from "./RoomProps";
export default function TechnologyWall({room,onObject}:{room:RoomId;onObject:(action:RoomAction)=>void}) {
  const list=(featuredTechnologyIds[room]||[]).map(id=>technologies.find(item=>item.id===id)).filter(item=>item?.visible);
  if(!list.length)return null;
  const position: [number,number,number]=room==="development"?[0,3.1,-18.35]:room==="film"?[5.22,2.8,-8.5]:[-3.43,2.8,-6.4];
  return <group position={position} rotation={[0,room==="development"?0:room==="film"?-Math.PI/2:Math.PI/2,0]}>
    <Box position={[0,0,0]} scale={[3.75,2.1,0.12]} color="#657e71"/>
    <group position={[0,1.3,0.1]}><Sign title="ARSIP TEKNOLOGI" subtitle="STATUS PENGALAMAN / DAPAT DIINSPEKSI" width={3.5} height={0.45}/></group>
    {list.map((item,i)=>{if(!item)return null;return <group key={item.id} position={[(i%3-1)*1.16,0.52-Math.floor(i/3)*1.05,0.09]}><Box position={[0,0,0]} scale={[1.02,0.92,0.06]} color="#ccc7b4"/><group position={[0,0.14,0.04]}>{item.logoPath?<ImagePlane src={item.logoPath} width={0.4} height={0.4}/>:<Sign title={item.name.slice(0,2)} width={0.4} height={0.4}/>}</group><group position={[0,-0.25,0.045]}><Sign title={item.name} subtitle={item.experience} width={0.92} height={0.28}/></group><Hotspot action={{id:`tech-${item.id}`,label:item.name,kind:"technology",technologyId:item.id}} position={[0,0,0.11]} size={[1.04,0.94,0.14]} onObject={onObject}/></group>;})}
  </group>;
}
