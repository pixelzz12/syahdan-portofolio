// Shared approach envelope: strongest just before the door, quiet behind it.
const smooth=(a:number,b:number,x:number)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
export const sectorCue=(distance:number)=>smooth(-2,1.5,distance)*(1-smooth(6,14,distance));
export function returnAngles(startYaw:number,startPitch:number,endYaw:number,endPitch:number,t:number){
 const blend=smooth(.12,1,t),yawDelta=Math.atan2(Math.sin(endYaw-startYaw),Math.cos(endYaw-startYaw));
 return {yaw:startYaw+yawDelta*blend,pitch:startPitch+(endPitch-startPitch)*blend};
}
