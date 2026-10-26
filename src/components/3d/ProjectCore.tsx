"use client";
import { useMemo,useRef } from "react";
import { useFrame,useThree } from "@react-three/fiber";
import * as THREE from "three";
import { developmentProjects } from "@/data/portfolio";
import { roomActions,type RoomAction } from "@/data/rooms";
import { Box,Sign } from "./Primitives";
import { Hotspot,ImagePlane } from "./RoomProps";

function ProjectSheet({index,onObject,selected,reducedMotion}:{index:number;onObject:(action:RoomAction)=>void;selected:boolean;reducedMotion:boolean}) {
  const ref=useRef<THREE.Group>(null),{camera}=useThree();
  const angle=[-Math.PI/3,-Math.PI*2/3,Math.PI/3,Math.PI*2/3][index];
  const home=useMemo(()=>new THREE.Vector3(Math.sin(angle)*3.5,2.5+index*0.16,-11+Math.cos(angle)*3.5),[angle,index]);
  const tools=useMemo(()=>({goal:new THREE.Vector3(),rotation:new THREE.Quaternion(),parentQ:new THREE.Quaternion(),matrix:new THREE.Matrix4(),right:new THREE.Vector3()}),[]);
  const action=roomActions.development[index],project=developmentProjects.find(item=>item.id===action.projectId)!;
  useFrame(({clock,size},dt)=>{
    const group=ref.current;if(!group||!group.parent)return;
    if(selected){
      camera.getWorldDirection(tools.goal).multiplyScalar(3.1).add(camera.position);
      tools.right.set(1,0,0).applyQuaternion(camera.quaternion).multiplyScalar(size.width<700?0:-0.75);tools.goal.add(tools.right);
      group.parent.worldToLocal(tools.goal);group.parent.getWorldQuaternion(tools.parentQ);tools.rotation.copy(tools.parentQ).invert().multiply(camera.quaternion);
    }else{
      tools.goal.copy(home);if(!reducedMotion)tools.goal.y+=Math.sin(clock.elapsedTime*0.55+index*1.4)*0.045;
      tools.matrix.lookAt(home,new THREE.Vector3(0,2.6,-11),new THREE.Vector3(0,1,0));tools.rotation.setFromRotationMatrix(tools.matrix);tools.rotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI));
    }
    group.position.lerp(tools.goal,reducedMotion?1:1-Math.exp(-Math.min(dt,0.1)*5));group.quaternion.slerp(tools.rotation,reducedMotion?1:1-Math.exp(-Math.min(dt,0.1)*5));
  });
  return <group ref={ref} position={home} name={`project-sheet-${project.id}`}>
    <Box position={[0,0,0]} scale={[1.8,2.2,0.07]} color="#cbc4ac"/>
    <Box position={[-0.76,0,0.05]} scale={[0.025,1.93,0.02]} color="#648d8b"/>
    <group position={[0,0.35,0.045]}>{project.thumbnail?<ImagePlane src={project.thumbnail} width={1.5} height={0.9}/>:<Sign title={project.title} subtitle={project.status==="Dalam pengembangan"?"DALAM PENGEMBANGAN":"DETAIL / ASET MENYUSUL"} width={1.48} height={0.9} color="#c9b98d"/>}</group>
    <group position={[0,-0.65,0.05]}><Sign title={`0${index+1} / BUKA PROYEK`} width={1.5} height={0.3}/></group>
    <Hotspot action={action} position={[0,0,0.12]} size={[1.84,2.24,0.15]} onObject={onObject}/>
  </group>;
}
export default function ProjectCore({onObject,selected,reducedMotion}:{onObject:(action:RoomAction)=>void;selected:string|null;reducedMotion:boolean}) {
  return <group name="project-core">
    <mesh position={[0,0.055,-11]}><cylinderGeometry args={[2.2,2.35,0.1,32]}/><meshStandardMaterial color="#586e66" roughness={1}/></mesh>
    <mesh position={[0,0.112,-11]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[2.01,2.06,32]}/><meshStandardMaterial color="#b6aa86" roughness={1}/></mesh>
    {[0,1,2,3].map(index=><ProjectSheet key={index} index={index} onObject={onObject} selected={selected===roomActions.development[index].id} reducedMotion={reducedMotion}/>)}
    <group position={[0,4.8,-17.9]}><Sign title="PROJECT CORE" subtitle="GULIR UNTUK MENJELAJAHI / PILIH LEMBAR UNTUK MEMBACA" width={4} height={0.65}/></group>
    {[-1,1].map(side=><Box key={side} position={[side*5.5,3.45,-11]} scale={[0.22,6.9,0.3]} color="#4a6159"/>)}
  </group>;
}
