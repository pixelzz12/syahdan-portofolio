"use client";
import { useEffect,useState } from "react";
import { sectors } from "@/data/portfolio";
import { roomActions,roomViews,type RoomId,type RoomView,type RoomAction } from "@/data/rooms";
import { aboutPoints } from "@/lib/room-paths";
import { fraction,type SceneNavigation,type RoomExperience } from "@/lib/scene-navigation";
export default function ExplorationHUD({room,view,navigation,experience,onExperience,onView,onObject,onRead,onReturn}:{room:RoomId;view:RoomView;navigation:React.RefObject<SceneNavigation>;experience:RoomExperience;onExperience:(value:RoomExperience)=>void;onView:(view:RoomView)=>void;onObject:(action:RoomAction)=>void;onRead:()=>void;onReturn:()=>void}) {
  const [open,setOpen]=useState(false),[point,setPoint]=useState(0);
  useEffect(()=>{if(experience!=="about")return;const timer=setInterval(()=>setPoint(Math.min(3,Math.floor(fraction(navigation.current.roomCursor)*4))),150);return()=>clearInterval(timer);},[experience,navigation]);
  const sector=sectors.find(item=>item.id===room)!;
  return <div className="room-hud" data-room={room} data-experience={experience}>
    <div className="room-title"><button className="room-back" onClick={onReturn} aria-label="Kembali ke koridor">← Koridor</button><h2>{sector.name}</h2></div>
    {experience==="about"&&<div className="about-point" aria-live="polite"><span className="mono">0{point+1} / 04</span><h3>{aboutPoints[point].title}</h3><p>{aboutPoints[point].text}</p></div>}
    <div className="room-controls"><div className="room-view-buttons" role="group" aria-label="Sudut pandang ruangan">{(["overview","left","right"] as RoomView[]).map((key,i)=><button key={key} aria-pressed={view===key&&experience==="standard"} onClick={()=>onView(key)}>{roomViews[room][i]}</button>)}</div>
      <div className="experience-actions">{room==="development"&&<button onClick={()=>onExperience(experience==="project"?"standard":"project")}>{experience==="project"?"Jeda jalur proyek":"Jelajahi Project Core"}</button>}{room==="operator"&&<button onClick={()=>onExperience(experience==="about"?"standard":"about")}>{experience==="about"?"Keluar perjalanan":"Ikuti pesawat kertas"}</button>}<button aria-expanded={open} onClick={()=>setOpen(value=>!value)}>Objek {open?"−":"+"}</button><button onClick={onRead}>Baca sektor ☷</button></div>
      {open&&<nav className="room-objects" aria-label="Objek interaktif ruangan">{roomActions[room].map(action=><button key={action.id} onClick={()=>onObject(action)}>↗ {action.label}</button>)}{["development","film","workshop","research"].includes(room)&&<button onClick={()=>onObject({id:"technology-archive",label:"Arsip teknologi & alat",kind:"technology-archive",archiveRoom:room})}>Arsip teknologi ↗</button>}</nav>}
      {experience!=="standard"&&<p className="journey-hint">Gulir / geser untuk bergerak. Balik gulir untuk kembali.</p>}
    </div>
  </div>;
}
