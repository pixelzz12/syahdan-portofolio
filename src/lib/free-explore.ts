import type {SectorId} from "@/data/portfolio";
export type FreeExploreState={active:boolean;paused:boolean;forward:number;strafe:number;lookX:number;lookY:number};
export type Obstacle={minX:number;maxX:number;minZ:number;maxZ:number};
export const roomLimits:Record<SectorId,{halfWidth:number;back:number}>={operator:{halfWidth:4.3,back:-12.55},development:{halfWidth:6,back:-18.55},film:{halfWidth:5.4,back:-16.55},workshop:{halfWidth:3.6,back:-10.55},research:{halfWidth:3.6,back:-10.55},transmission:{halfWidth:3.6,back:-10.55}};
export function safeRoomStep(x:number,z:number,dx:number,dz:number,room:SectorId,obstacles:Obstacle[]){
 const limit=roomLimits[room],radius=.28;
 const blocked=(nx:number,nz:number,ox:number,oz:number)=>obstacles.some(b=>{const inside=(a:number,c:number)=>a>b.minX-radius&&a<b.maxX+radius&&c>b.minZ-radius&&c<b.maxZ+radius;return inside(nx,nz)&&!inside(ox,oz);});
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.08));
 for(let i=0;i<steps;i++){const nx=Math.max(-limit.halfWidth+.45,Math.min(limit.halfWidth-.45,x+dx/steps));if(!blocked(nx,z,x,z))x=nx;const nz=Math.max(limit.back+.45,Math.min(-3.15,z+dz/steps));if(!blocked(x,nz,x,z))z=nz;}
 return {x,z};
}
