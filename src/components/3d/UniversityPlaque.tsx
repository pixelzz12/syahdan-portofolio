"use client";
import {profile} from "@/data/portfolio";
import {Box,Sign} from "./Primitives";
import {ImagePlane} from "./RoomProps";

export default function UniversityPlaque(){
 return <group name="unair-wall-plaque" position={[4.6,2.9,1.5]} rotation={[0,-Math.PI/2,0]}>
  <Box position={[0,0,0]} scale={[1.85,2.15,0.1]} color="#42594f"/>
  <Box position={[0,0,0.06]} scale={[1.71,2.01,0.025]} color="#b6b39b"/>
  <group position={[0,0.17,0.079]}>{profile.universityLogo?<ImagePlane src={profile.universityLogo} width={1.52} height={1.52}/>:<Sign title="UNIVERSITAS AIRLANGGA" width={1.5} height={0.6}/>}</group>
  <group position={[0,-0.8,0.082]}><Sign title="UNIVERSITAS AIRLANGGA" subtitle="TEKNIK INFORMATIKA" width={1.5} height={0.24}/></group>
 </group>;
}
