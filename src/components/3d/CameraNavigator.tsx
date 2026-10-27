"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { SectorId } from "@/data/portfolio";
import { doors, pathPoints, type FacilityPhase } from "@/lib/facility-layout";
import { roomPose } from "@/lib/room-paths";
import { CORRIDOR_LENGTH, dampMotion, fraction, type PoseSnapshot, type RoomExperience, type SceneNavigation } from "@/lib/scene-navigation";
import type { RoomView } from "@/data/rooms";

type Props = { progress: React.RefObject<number>; navigation: React.RefObject<SceneNavigation>; roomProgress: React.RefObject<number>; experience: RoomExperience; selectedTile: number; destination: SectorId|null; phase: FacilityPhase; reducedMotion: boolean; roomView: RoomView; inspectionOpen: boolean; onArrive:(id:SectorId)=>void; onReturn:(progress:number)=>void };
type Journey = { curve:THREE.CatmullRomCurve3; elapsed:number; duration:number; finalLook:THREE.Vector3; returning:boolean };
export default function CameraNavigator(props:Props) {
  const path=useMemo(()=>new THREE.CatmullRomCurve3(pathPoints.map(p=>new THREE.Vector3(...p)),false,"centripetal"),[]);
  const tools=useMemo(()=>({p:new THREE.Vector3(),look:new THREE.Vector3(),ahead:new THREE.Vector3(),matrix:new THREE.Matrix4(),q:new THREE.Quaternion(),up:new THREE.Vector3(0,1,0)}),[]);
  const route=useRef<Journey|null>(null), previousKey=useRef(""), previousDoor=useRef<(typeof doors[number]&{tile:number})|null>(null);
  const speed=useRef(0), roomSpeed=useRef(0), corridorHold=useRef<PoseSnapshot|null>(null), roomHold=useRef<{position:THREE.Vector3;quaternion:THREE.Quaternion;progress:number;key:string}|null>(null), wasInspecting=useRef(false);
  function sample(u:number,base:number,out=new THREE.Vector3()) { path.getPointAt(fraction(u),out);out.z-=CORRIDOR_LENGTH*(Math.floor(u)-base);return out; }
  function atZ(z:number) { let a=0,b=1;for(let i=0;i<18;i++){const t=(a+b)/2;if(path.getPointAt(t).z>z)a=t;else b=t;}return(a+b)/2; }
  useFrame(({camera,gl,scene,size,clock},rawDelta)=>{
    const dt=Math.min(rawDelta,0.1), nav=props.navigation.current, {p,look,ahead,matrix,q,up}=tools;
    const door=doors.find(item=>item.id===props.destination), key=`${props.phase}:${props.destination}:${props.selectedTile}`;
    const viewKey=`${props.destination}:${props.roomView}:${props.experience}`;
    if(props.inspectionOpen&&!wasInspecting.current&&props.phase==="room") {
      props.roomProgress.current=nav.roomCursor;
      roomHold.current={position:camera.position.clone(),quaternion:camera.quaternion.clone(),progress:nav.roomCursor,key:viewKey};roomSpeed.current=0;
    }
    wasInspecting.current=props.inspectionOpen;
    if(key!==previousKey.current) {
      previousKey.current=key;
      if((props.phase==="approaching"||props.phase==="returning")&&door) {
        const returning=props.phase==="returning";
        if(!nav.snapshot) nav.snapshot={position:camera.position.toArray() as [number,number,number],quaternion:camera.quaternion.toArray() as [number,number,number,number],progress:nav.cursor,cycle:nav.cycle};
        const snap=nav.snapshot, points=[camera.position.clone()], last=previousDoor.current;
        let start=nav.cursor;
        if(last&&Math.abs(camera.position.x)>last.halfWidth-2) {
          const z=last.z-last.tile*CORRIDOR_LENGTH;
          points.push(new THREE.Vector3(last.x+last.side*1.05,2.35,z),new THREE.Vector3(last.x-last.side*2.8,2.5,z));
          start=nav.cycle+last.tile+atZ(last.z+4.5);points.push(sample(start,nav.cycle));
        }
        const end=returning?snap.progress:nav.cycle+props.selectedTile+atZ(door.z+4.5);
        const steps=Math.max(1,Math.ceil(Math.abs(end-start)*14));
        for(let i=1;i<=steps;i++)points.push(sample(THREE.MathUtils.lerp(start,end,i/steps),nav.cycle));
        let finalLook:THREE.Vector3;
        if(returning) {
          p.fromArray(snap.position);points.push(p.clone());
          finalLook=new THREE.Vector3(0,0,-10).applyQuaternion(new THREE.Quaternion().fromArray(snap.quaternion)).add(p);
        } else {
          const z=door.z-props.selectedTile*CORRIDOR_LENGTH;
          points.push(new THREE.Vector3(door.x-door.side*2.8,2.45,z),new THREE.Vector3(door.x+door.side*1.05,2.35,z));
          const preset=roomPose(door.id,"overview",door.id==="development"?"project":"standard",0);
          points.push(new THREE.Vector3(door.x-door.side*preset.position[2],preset.position[1],z+door.side*preset.position[0]));
          finalLook=new THREE.Vector3(door.x-door.side*preset.look[2],preset.look[1],z+door.side*preset.look[0]);
        }
        const clean=points.filter((point,i)=>i===0||point.distanceTo(points[i-1])>0.001);if(clean.length===1)clean.push(clean[0].clone().add(new THREE.Vector3(0,0,-0.001)));
        const curve=new THREE.CatmullRomCurve3(clean,false,"centripetal");
        route.current={curve,elapsed:0,duration:1.6+Math.min(1.6,curve.getLength()/35),finalLook,returning};
        previousDoor.current={...door,tile:props.selectedTile};roomHold.current=null;roomSpeed.current=0;
      } else if(props.phase==="corridor") { route.current=null;previousDoor.current=null; }
    }
    const journey=route.current;
    if(journey&&(props.phase==="approaching"||props.phase==="returning")) {
      journey.elapsed+=dt;const t=props.reducedMotion?1:Math.min(1,journey.elapsed/journey.duration),e=THREE.MathUtils.smoothstep(t,0,1);
      journey.curve.getPointAt(e,p);journey.curve.getPointAt(Math.min(1,e+0.035),ahead);
      look.copy(ahead).sub(p).normalize().multiplyScalar(8).add(p);look.y=THREE.MathUtils.lerp(p.y-0.1,journey.finalLook.y,e);look.lerp(journey.finalLook,THREE.MathUtils.smoothstep(t,0.7,1));
      camera.position.copy(p);matrix.lookAt(p,look,up);q.setFromRotationMatrix(matrix);camera.quaternion.slerp(q,props.reducedMotion?1:1-Math.exp(-dt*8));
      if(t===1) {
        route.current=null;
        if(journey.returning&&nav.snapshot) {
          const snap=nav.snapshot;camera.position.fromArray(snap.position);camera.quaternion.fromArray(snap.quaternion);nav.cursor=snap.progress;nav.cycle=snap.cycle;
          corridorHold.current=snap;nav.snapshot=null;speed.current=0;props.progress.current=snap.progress;props.onReturn(snap.progress);
        } else if(door){camera.lookAt(journey.finalLook);nav.roomCursor=0;props.onArrive(door.id);}
      }
    } else if(props.phase==="room"&&door&&!props.inspectionOpen) {
      const hold=roomHold.current;
      if(hold&&hold.key===viewKey&&Math.abs(props.roomProgress.current-hold.progress)<0.000001){camera.position.copy(hold.position);camera.quaternion.copy(hold.quaternion);}
      else {
        roomHold.current=null;
        const next=dampMotion(nav.roomCursor,props.roomProgress.current,roomSpeed.current,dt,0.3);nav.roomCursor=props.reducedMotion?props.roomProgress.current:next.value;roomSpeed.current=next.velocity;
        const preset=roomPose(door.id,props.roomView,props.experience,nav.roomCursor),z=door.z-props.selectedTile*CORRIDOR_LENGTH;
        p.set(door.x-door.side*preset.position[2],preset.position[1],z+door.side*preset.position[0]);look.set(door.x-door.side*preset.look[2],preset.look[1],z+door.side*preset.look[0]);
        camera.position.lerp(p,props.reducedMotion?1:1-Math.exp(-dt*5));matrix.lookAt(camera.position,look,up);q.setFromRotationMatrix(matrix);camera.quaternion.slerp(q,props.reducedMotion?1:1-Math.exp(-dt*6));
      }
    } else if(props.phase==="corridor") {
      const hold=corridorHold.current;
      if(hold&&Math.abs(props.progress.current-hold.progress)<0.000001){camera.position.fromArray(hold.position);camera.quaternion.fromArray(hold.quaternion);}
      else {
        corridorHold.current=null;
        const next=dampMotion(nav.cursor,props.progress.current,speed.current,dt);nav.cursor=props.reducedMotion?props.progress.current:next.value;speed.current=next.velocity;nav.cycle=Math.floor(nav.cursor);
        sample(nav.cursor,nav.cycle,p);sample(nav.cursor+0.12,nav.cycle,look);look.y=p.y-0.15;camera.position.copy(p);matrix.lookAt(p,look,up);q.setFromRotationMatrix(matrix);camera.quaternion.slerp(q,props.reducedMotion?1:1-Math.exp(-dt*6));
      }
    }
    if(gl.domElement.dataset.sceneQa==="true"&&clock.elapsedTime-Number(gl.domElement.dataset.sampleTime||-1)>0.1) {
      camera.updateMatrixWorld();gl.domElement.dataset.sampleTime=String(clock.elapsedTime);
      const objects:{id:string;x:number;y:number;visible:boolean}[]=[];let aiProjectionCount=0,evHeight:number|null=null;const installations:{name:string;position:number[];quaternion:number[];opacity?:number}[]=[],gates:{name:string;open:boolean}[]=[];
      scene.traverse(object=>{if(object.name.startsWith("loop-gate-"))gates.push({name:object.name,open:object.userData.open===true});if(object.name.startsWith("project-sheet-")||object.name==="paper-airplane"||object.name==="spatial-syahdan-title"||object.name==="operator-avatar"||object.name.startsWith("arrival-letter-"))installations.push({name:object.name,position:object.getWorldPosition(new THREE.Vector3()).toArray(),quaternion:object.getWorldQuaternion(new THREE.Quaternion()).toArray(),opacity:object instanceof THREE.Mesh&&object.material instanceof THREE.MeshBasicMaterial?object.material.opacity:undefined});if(object.name==="research-ai-projection")aiProjectionCount++;if(object.name==="ev-research-idle")evHeight=object.position.y;if(!object.name.startsWith("room-object-"))return;const point=object.getWorldPosition(new THREE.Vector3()).project(camera);objects.push({id:object.name.slice(12),x:(point.x+1)*size.width/2,y:(1-point.y)*size.height/2,visible:Math.abs(point.x)<1&&Math.abs(point.y)<1&&point.z>-1&&point.z<1});});
      gl.domElement.dataset.scene=JSON.stringify({camera:camera.position.toArray(),quaternion:camera.quaternion.toArray(),phase:props.phase,cursor:nav.cursor,cycle:nav.cycle,roomCursor:nav.roomCursor,snapshot:nav.snapshot,installations,gates,objects,aiProjectionCount,evHeight,doors:doors.map(item=>{const mesh=scene.getObjectByName(`door-hit-${item.id}-0`);const point=mesh?mesh.getWorldPosition(new THREE.Vector3()).project(camera):new THREE.Vector3(2,2,2);return{id:item.id,number:item.number,x:(point.x+1)*size.width/2,y:(1-point.y)*size.height/2,depth:point.z,visible:Math.abs(point.x)<1&&Math.abs(point.y)<1&&point.z>-1&&point.z<1};})});
    }
  },-2);
  return null;
}
