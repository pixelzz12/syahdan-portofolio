type Voice={source:AudioBufferSourceNode;gain:GainNode;timer?:ReturnType<typeof setTimeout>;effect?:boolean};

/** A gesture-created Web Audio session. No resources are allocated on page load. */
export class AmbientAudio{
 private context:AudioContext|null=null;
 private voices=new Set<Voice>();
 private buffers=new Map<string,AudioBuffer>();
 private controllers=new Set<AbortController>();
 private roomRequest:AbortController|null=null;
 private revision=0;
 private currentUrl:string|null=null;
 private enabled=false;
 private disposed=false;
 get state(){return{enabled:this.enabled,voices:this.voices.size,context:this.context?.state||"absent"};}
 async enable(){
  if(this.disposed)throw new Error("Audio session closed");
  if(!this.context){const Constructor=window.AudioContext||(window as typeof window&{webkitAudioContext?:typeof AudioContext}).webkitAudioContext;if(!Constructor)throw new Error("Web Audio unavailable");this.context=new Constructor();}
  const revision=this.revision;await this.context.resume();if(this.disposed||revision!==this.revision){if(this.context.state==="running")void this.context.suspend().catch(()=>{});return;}this.enabled=true;
 }
 private async load(src:string,controller:AbortController){
  if(!src.startsWith("/audio/")||src.includes(".."))throw new Error("Use a local audio asset");
  const cached=this.buffers.get(src);if(cached)return cached;
  this.controllers.add(controller);
  try{const response=await fetch(src,{signal:controller.signal});if(!response.ok)throw new Error("Audio asset unavailable");const buffer=await this.context!.decodeAudioData(await response.arrayBuffer());if(!this.disposed&&!controller.signal.aborted)this.buffers.set(src,buffer);return buffer;}finally{this.controllers.delete(controller);}
 }
 private release(voice:Voice){
  if(!this.voices.delete(voice))return;
  if(voice.timer)clearTimeout(voice.timer);
  voice.source.onended=null;try{voice.source.stop();}catch{/* Already ended. */}voice.source.disconnect();voice.gain.disconnect();
 }
 private fadeOut(voice:Voice){
  const now=this.context!.currentTime;voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setValueAtTime(voice.gain.gain.value,now);voice.gain.gain.linearRampToValueAtTime(0,now+.8);
  if(voice.timer)clearTimeout(voice.timer);voice.timer=setTimeout(()=>this.release(voice),850);
 }
 async setRoom(src:string|null){
  if(!this.enabled||this.disposed)return;
  if(src===this.currentUrl&&this.voices.size)return;
  const revision=++this.revision;this.roomRequest?.abort();this.roomRequest=null;
  if(!src){this.currentUrl=null;for(const voice of this.voices)if(!voice.effect)this.fadeOut(voice);return;}
  const controller=new AbortController();this.roomRequest=controller;
  try{
   const buffer=await this.load(src,controller);
   if(revision!==this.revision||!this.enabled||this.disposed)return;
   const context=this.context!,source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(context.destination);
   const now=context.currentTime;gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.1,now+.8);
   for(const old of this.voices)if(!old.effect)this.fadeOut(old);
   const voice={source,gain};this.voices.add(voice);this.currentUrl=src;source.start();
  }catch(error){if(!controller.signal.aborted&&revision===this.revision)throw error;}
 }
 async playEffect(src:string|null){
  if(!src||!this.enabled||this.disposed)return;
  const controller=new AbortController(),revision=this.revision;
  try{const buffer=await this.load(src,controller);if(!this.enabled||this.disposed||revision!==this.revision)return;const context=this.context!,source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=.055;source.connect(gain);gain.connect(context.destination);const voice:Voice={source,gain,effect:true};this.voices.add(voice);source.onended=()=>this.release(voice);source.start();}catch(error){if(!controller.signal.aborted)throw error;}
 }
 pause(){
  this.revision++;this.roomRequest?.abort();this.roomRequest=null;
  for(const controller of this.controllers)controller.abort();this.controllers.clear();
  for(const voice of [...this.voices])this.release(voice);this.currentUrl=null;
  if(this.context?.state==="running")void this.context.suspend().catch(()=>{});
 }
 disable(){this.enabled=false;this.pause();}
 dispose(){if(this.disposed)return;this.disposed=true;this.disable();this.buffers.clear();if(this.context)void this.context.close().catch(()=>{});}
}
