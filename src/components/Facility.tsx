"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { sectors, type SectorId } from "@/data/portfolio";
import { type FacilityPhase } from "@/lib/facility-layout";
import PortfolioContent from "./ui/PortfolioContent";
import SectorDialog from "./ui/SectorDialog";
import { hasInterior, type RoomAction, type RoomId, type RoomView } from "@/data/rooms";
import RoomHUD from "./ui/RoomHUD";
import { useCorridorScroll,useRoomScroll } from "./useExplorationScroll";
import { fraction,type RoomExperience,type SceneNavigation } from "@/lib/scene-navigation";
import CVDialog from "./ui/CVPanel";
import {useAmbientAudio} from "./useAmbientAudio";
import BootScreen from "./ui/BootScreen";
import EVGuide from "./ui/EVGuide";
import FacilityMap from "./ui/FacilityMap";
import FreeExploreControls from "./ui/FreeExploreControls";
import {useFreeExplore} from "./useFreeExplore";
import type {FreeExploreState} from "@/lib/free-explore";

const Corridor = dynamic(() => import("./3d/Corridor"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Facility() {
  const [mode, setMode] = useState<"facility" | "reading">("facility");
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const[bootStep,setBootStep]=useState(0),[bootComplete,setBootComplete]=useState(false);
  const bootActive=mode==="facility"&&!bootComplete;
  const [reducedMotion, setReducedMotion] = useState(false);
  const [destination, setDestination] = useState<SectorId | null>(null);
  const [inspecting, setInspecting] = useState<SectorId | null>(null);
  const [current, setCurrent] = useState(0);
  const [travel, setTravel] = useState(0);
  const [phase, setPhase] = useState<FacilityPhase>("corridor");
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [roomView, setRoomView] = useState<RoomView>("overview");
  const [roomAction, setRoomAction] = useState<RoomAction | null>(null);
  const [departingRoom, setDepartingRoom] = useState<RoomId | null>(null);
  const [selectedTile,setSelectedTile]=useState(0),[departingTile,setDepartingTile]=useState(0);
  const [experience,setExperience]=useState<RoomExperience>("standard");
  const[cvOpen,setCVOpen]=useState(false);
  const[guideOpen,setGuideOpen]=useState(false);
  const[mapOpen,setMapOpen]=useState(false),[visited,setVisited]=useState<SectorId[]>([]),[visitsLoaded,setVisitsLoaded]=useState(false);
  const[freeExplore,setFreeExplore]=useState(false);
  const freeInput=useRef<FreeExploreState>({active:false,paused:false,forward:0,strafe:0,lookX:0,lookY:0});
  const exitFree=useCallback(()=>setFreeExplore(false),[]);
  const freePaused=Boolean(inspecting||guideOpen||mapOpen||cvOpen||phase!=="room");
  freeInput.current.active=freeExplore;freeInput.current.paused=freePaused;
  useFreeExplore(freeInput,freeExplore,freePaused,exitFree);
  useEffect(()=>{if(phase!=="room")setFreeExplore(false);},[phase]);
  const guideCount=useRef(0);
  const markVisited=useCallback((id:SectorId)=>setVisited(old=>old.includes(id)?old:[...old,id]),[]);
  useEffect(()=>{try{const ids=JSON.parse(sessionStorage.getItem("nova-visited")||"[]");if(Array.isArray(ids))setVisited(sectors.filter(s=>ids.includes(s.id)).map(s=>s.id));}catch{}setVisitsLoaded(true);},[]);
  useEffect(()=>{if(visitsLoaded)try{sessionStorage.setItem("nova-visited",JSON.stringify(visited));}catch{}},[visited,visitsLoaded]);
  const audio=useAmbientAudio(mode==="facility"?(phase==="room"&&destination?destination:"corridor"):null);
  const roomProgress=useRef(0);
  const navigation=useRef<SceneNavigation>({cursor:0,cycle:0,roomCursor:0,snapshot:null});
  const progress = useRef(0);
  const track = useRef<HTMLElement>(null);
  const busy = phase === "approaching" || phase === "returning";
  const onProgress=useCallback((value:number)=>{const t=fraction(value);setCurrent(Math.min(5,Math.floor(t*6)));setTravel(Math.round(t*100));},[]);
  const restoreCorridor=useCorridorScroll(track,progress,mode==="facility",Boolean(destination||inspecting||cvOpen||bootActive||guideOpen||mapOpen),onProgress);
  useRoomScroll(roomProgress,phase==="room"&&!inspecting&&!cvOpen&&!guideOpen&&!mapOpen&&!freeExplore,experience);
  const onBootStep=useCallback((step:number)=>setBootStep(previous=>Math.max(previous,step)),[]);
  const markReady = useCallback(() => {setBootStep(4);setReady(true);}, []);
  const finishBoot=useCallback(()=>setBootComplete(true),[]);
  const fallback = useCallback(() => { setWebgl(false); setMode("reading"); setDestination(null); setInspecting(null); setPhase("corridor"); }, []);
  const onArrive = useCallback((id: SectorId) => {
    markVisited(id);
    requestAnimationFrame(()=>document.querySelector("canvas")?.focus({preventScroll:true}));
    roomProgress.current=0;setExperience(id==="development"?"project":"standard");
    setDepartingRoom(null); setRoomAction(null); setRoomView("overview");
    if (hasInterior(id)) { setInspecting(null); setPhase("room"); setDirectoryOpen(false); }
    else { setInspecting(id); setPhase("inspecting"); }
  }, [markVisited]);
  const onReturn = useCallback((value:number) => { restoreCorridor(value);setDestination(null); setDepartingRoom(null); setPhase("corridor"); }, [restoreCorridor]);
  const openGuide=useCallback(()=>{guideCount.current++;setMapOpen(false);setGuideOpen(true);window.dispatchEvent(new Event("nova:ev-greet"));},[]);
  const onObject = useCallback((action: RoomAction) => {
    audio.effect("object");
    if(action.kind==="ev"&&phase==="room"){openGuide();return;}
    setGuideOpen(false);
    if (destination && hasInterior(destination) && phase === "room") { if(action.kind==="journey"){setFreeExplore(false);roomProgress.current=0;navigation.current.roomCursor=0;setExperience("about");document.querySelector("canvas")?.focus({preventScroll:true});return;}setRoomAction(action); setInspecting(destination); }
  }, [destination, phase,audio.effect,openGuide]);
  useEffect(()=>{if(inspecting||cvOpen||busy){setGuideOpen(false);setMapOpen(false);}},[inspecting,cvOpen,busy]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!context) fallback();
      else { setBootStep(1);setWebgl(true); context.getExtension("WEBGL_lose_context")?.loseContext(); }
    } catch { fallback(); }
    return () => { media.removeEventListener("change", update); };
  }, [fallback]);



  useEffect(() => {
    if (!destination && !inspecting && !guideOpen && !mapOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [destination, inspecting,guideOpen,mapOpen]);

  function openSector(id: SectorId, tile?:number) {
    if (busy) return;
    setFreeExplore(false);setMapOpen(false);setGuideOpen(false);
    audio.effect("door");
    if (phase === "room" && hasInterior(destination)) setDepartingRoom(destination);
    setSelectedTile(tile ?? (phase === "room" ? selectedTile : 0));
    setDepartingTile(selectedTile);
    setRoomAction(null);
    setDestination(id);
    if (mode === "reading" || !ready) { setInspecting(id); setPhase("inspecting"); return; }
    setInspecting(null); setPhase("approaching");
  }
  function navigateWithGuide(id:SectorId) {
    setMapOpen(false);
    if(mode==="reading"){
      markVisited(id);setGuideOpen(false);
      requestAnimationFrame(()=>{
        const heading=document.getElementById(`heading-${id}`);
        document.getElementById(id)?.scrollIntoView({behavior:reducedMotion?"instant":"smooth",block:"start"});
        if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
      });
    }else if(destination===id&&phase==="room"){
      setGuideOpen(false);document.querySelector("canvas")?.focus({preventScroll:true});
    }else openSector(id);
  }
  function closeSector() {
    setFreeExplore(false);
    setMapOpen(false);
    setGuideOpen(false);
    setInspecting(null); setRoomAction(null);
    if (destination && mode === "facility" && ready) setPhase("returning");
    else { setDestination(null); setPhase("corridor"); }
  }
  function changeMode() {
    setFreeExplore(false);
    setMapOpen(false);
    setGuideOpen(false);
    setBootComplete(false);setBootStep(webgl?1:0);
    navigation.current.cursor=0;navigation.current.cycle=0;navigation.current.roomCursor=0;progress.current=0;
    navigation.current.snapshot=null;
    setRoomAction(null); setDepartingRoom(null);
    setInspecting(null); setDestination(null); setPhase("corridor"); setReady(false);
    setMode(value => value === "facility" ? "reading" : "facility");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function showReadingMode() {
    setFreeExplore(false);
    setMapOpen(false);
    setGuideOpen(false);
    navigation.current.snapshot=null;
    setRoomAction(null); setDepartingRoom(null);
    setInspecting(null); setDestination(null); setPhase("corridor"); setReady(false); setMode("reading");
  }

  useEffect(() => {
    if(mode==="reading")window.scrollTo({top:0,behavior:"instant"});
  },[mode]);
  useEffect(() => {
    if (phase !== "approaching") return;
    const cancel = (event: KeyboardEvent) => { if (event.key === "Escape") setPhase("returning"); };
    window.addEventListener("keydown", cancel);
    return () => window.removeEventListener("keydown", cancel);
  }, [phase]);

  return <>
    <a className="skip-link" href="#portfolio" onClick={showReadingMode}>Lewati 3D, baca portfolio</a>
    <header className="site-header"><a href="#" className="brand" aria-label="SYAHDAN, kembali ke awal" onClick={event=>{event.preventDefault();navigation.current.snapshot=null;setInspecting(null);setDestination(null);setPhase("corridor");restoreCorridor(Math.floor(navigation.current.cursor));}}><span>SYAHDAN<small>NOVA NODE / PORTFOLIO</small></span></a><div className="header-right"><span className="system-label"><i className="signal-dot" /> CREATIVE WEBSITE DEVELOPER</span><button className="utility-button header-cv" disabled={busy} onClick={()=>setCVOpen(true)} aria-label="Preview dan Download CV"><span className="header-cv-long">Download </span>CV ↓</button><button className="utility-button audio-control" disabled={!audio.available} onClick={audio.toggle} aria-pressed={audio.enabled} aria-label={!audio.available?"Ambience belum tersedia":audio.enabled?"Matikan audio lingkungan":"Nyalakan audio lingkungan"} title={!audio.available?"Ambience belum tersedia":audio.enabled?"Matikan audio":"Nyalakan audio"}>{audio.enabled?"♫":"♪"}</button><button className="mode-button" onClick={changeMode} disabled={webgl === false && mode === "reading"}><span aria-hidden="true">{mode === "facility" ? "☷" : "◇"}</span> {mode === "facility" ? "Read Mode" : webgl === false ? "Read Mode aktif" : "Jelajahi 3D"}</button></div></header>
    {mode === "facility" && <main className="facility-track" ref={track}>
      <div className="facility-viewport" data-phase={phase} data-travelling={travel > 3}>
        <div className="scene-container" style={{visibility:ready?"visible":"hidden"}}>{webgl && <SceneBoundary onFailure={fallback}><Corridor freeInput={freeInput} progress={progress} navigation={navigation} roomProgress={roomProgress} experience={experience} selectedTile={selectedTile} departingTile={departingTile} selectedAction={roomAction} destination={destination} departingRoom={departingRoom} phase={phase} roomView={roomView} inspectionOpen={Boolean(inspecting)} onObject={onObject} reducedMotion={reducedMotion} onDoor={openSector} onReady={markReady} onBootStep={onBootStep} onFailure={fallback} onArrive={onArrive} onReturn={onReturn} /></SceneBoundary>}</div>
        <div className="scene-shade" />
        <h1 className="sr-only">SYAHDAN — portfolio Muhammad Syahdan Herdhiyanta</h1>
        <aside className="directory" aria-label="Direktori enam sektor" data-open={directoryOpen}><button className="directory-heading" aria-expanded={directoryOpen} aria-controls="facility-sectors" onClick={() => setDirectoryOpen(value => !value)}><span className="mono">FACILITY DIRECTORY</span><span className="mono">06 SECTORS {directoryOpen ? "−" : "+"}</span></button><nav id="facility-sectors" hidden={!directoryOpen}>{sectors.map((sector, index) => <button key={sector.id} disabled={busy} className={`directory-item ${current === index ? "active" : ""}`} onClick={() => openSector(sector.id)} aria-label={`Buka sektor ${sector.number}: ${sector.name}`}><span className="directory-number">{sector.number}</span><span><strong>{sector.name}</strong><small>{sector.label}</small></span><span className="directory-arrow" aria-hidden="true">↗</span></button>)}</nav><div className="directory-foot" hidden={!directoryOpen}><i className="signal-dot" /><span>Enam ruang. Pilih untuk masuk.</span><button className="text-link ev-greeting-button" onClick={()=>window.dispatchEvent(new Event("nova:ev-greet"))}>Sapa EV ↗</button></div></aside>
        <div className="facility-bottom"><div className="scroll-cue"><span className="scroll-icon" aria-hidden="true">↓</span><span>{reducedMotion ? "PILIH SEKTOR UNTUK MENJELAJAHI" : "SCROLL UNTUK MENJELAJAHI"}<small>atau pilih sektor langsung</small></span></div><div className="location"><span className="mono">{destination ? "SECTOR APPROACH" : "MAIN CORRIDOR"}</span><strong>{destination ? sectors.find(s => s.id === destination)?.number : "00"}<span> / 06</span></strong></div></div>
        <div className="travel-track"><div style={{ width: `${travel}%` }} /></div>
        {!ready && <div className="loading-note" role="status">Menyiapkan ruang 3D… <button onClick={changeMode}>Baca portfolio sekarang ↗</button></div>}
        {busy && <div className="approach-note" role="status">{phase === "returning" ? "Kembali ke posisi koridor…" : `Memasuki sektor ${sectors.find(s => s.id === destination)?.number}…`}{phase === "approaching" && <button onClick={closeSector}>Batalkan / Esc</button>}</div>}
        {phase === "room" && hasInterior(destination) && <RoomHUD freeControls={<FreeExploreControls active={freeExplore} paused={freePaused} input={freeInput} onToggle={()=>{setFreeExplore(value=>!value);document.querySelector("canvas")?.focus({preventScroll:true});}}/>} room={destination} view={roomView} navigation={navigation} experience={experience} onExperience={value=>{setFreeExplore(false);roomProgress.current=0;navigation.current.roomCursor=0;setExperience(value);document.querySelector("canvas")?.focus({preventScroll:true});}} onView={value=>{setFreeExplore(false);setExperience("standard");setRoomView(value);}} onObject={onObject} onRead={() => { setRoomAction(null); setInspecting(destination); }} onReturn={closeSector} />}
      </div>
    </main>}
    <main id="portfolio" className="reading-mode" data-active={mode === "reading"}>
      <div className="reading-intro"><span className="eyebrow">SYAHDAN / PORTFOLIO</span><h1>Portfolio</h1>{webgl === false && <p className="fallback-note" role="status">Tampilan 3D tidak tersedia di perangkat ini. Seluruh konten tetap dapat dibaca di bawah.</p>}<nav className="reading-nav" aria-label="Lompat ke sektor">{sectors.map(sector => <a key={sector.id} href={`#${sector.id}`}><span>{sector.number}</span>{sector.label} ↗</a>)}</nav></div>
      {sectors.map(sector => <section key={sector.id} id={sector.id} className="reading-sector" aria-labelledby={`heading-${sector.id}`}><div className="reading-sector-label"><span style={{ color: sector.accent }}>{sector.number}</span><small className="mono">{sector.label}</small></div><div className="reading-sector-body"><h2 id={`heading-${sector.id}`}>{sector.name}</h2><PortfolioContent id={sector.id} /></div></section>)}
      <footer className="reading-footer"><span className="brand-text">SYAHDAN</span><p>© {new Date().getFullYear()} Muhammad Syahdan Herdhiyanta</p><a href="#portfolio">Kembali ke atas ↑</a></footer>
    </main>
    {inspecting && <SectorDialog id={inspecting} detail={roomAction} inRoom={phase === "room"} onClose={phase === "room" ? () => { setInspecting(null); setRoomAction(null); } : closeSector} onExit={closeSector} onNavigate={openSector} />}
    {bootActive&&<BootScreen step={bootStep} ready={ready} reducedMotion={reducedMotion} onRead={showReadingMode} onDone={finishBoot}/>}
    {!bootActive&&!inspecting&&!cvOpen&&<><button type="button" className="ev-guide-toggle" disabled={busy} aria-controls={guideOpen?"ev-guide-panel":undefined} aria-expanded={guideOpen} aria-haspopup="dialog" onClick={()=>guideOpen?setGuideOpen(false):openGuide()}><i className="ev-guide-indicator" aria-hidden="true"/>EV Guide</button>{guideOpen&&<EVGuide room={phase==="room"?destination:null} visitCount={guideCount.current} onClose={()=>setGuideOpen(false)} onNavigate={navigateWithGuide} onDetails={destination==="research"&&phase==="room"?()=>{setGuideOpen(false);setRoomAction({id:"ev-robot",label:"EV / rencana integrasi",kind:"ev"});setInspecting("research");}:undefined}/>}</>}
    {!bootActive&&!inspecting&&!cvOpen&&<><button className="ev-guide-toggle map-toggle" disabled={busy} aria-expanded={mapOpen} aria-haspopup="dialog" onClick={()=>{setGuideOpen(false);setMapOpen(value=>!value);}}>Map</button>{mapOpen&&<FacilityMap room={phase==="room"?destination:null} current={current} visited={visited} onClose={()=>setMapOpen(false)} onNavigate={navigateWithGuide}/>}</>}

    {cvOpen&&<CVDialog onClose={()=>setCVOpen(false)}/>}<span className="sr-only" role="status">{audio.error}</span>
    <noscript><style>{`.facility-track,.mode-button,.boot-screen{display:none!important}.reading-mode[data-active]{display:block!important}`}</style><p className="noscript-note">JavaScript tidak aktif. Portfolio tersedia dalam mode baca.</p></noscript>
  </>;
}
