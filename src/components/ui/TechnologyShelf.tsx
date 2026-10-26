"use client";
import { useState } from "react";
import type { RoomId } from "@/data/rooms";
import { technologiesForRoom } from "@/data/technologies";
import TechnologyArchive from "./TechnologyArchive";
export default function TechnologyShelf({room}:{room:RoomId}) {
  const [open,setOpen]=useState(false);
  return <details className="grading-inline" onToggle={event=>setOpen(event.currentTarget.open)}><summary>Arsip teknologi & alat</summary>{open&&<TechnologyArchive room={room}/>}<noscript><ul>{technologiesForRoom(room).map(item=><li key={item.id}>{item.name} — {item.experience}</li>)}</ul></noscript></details>;
}
