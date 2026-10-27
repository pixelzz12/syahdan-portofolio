import {MathUtils} from "three";

// Local corridor coordinates keep the introduction identical on every loop.
export function arrivalReveal(cameraZ:number){
 return MathUtils.smootherstep(12-cameraZ,0,6);
}

export function letterReveal(reveal:number,index:number){
 if(index===3)return 0;
 const distance=Math.abs(index-3);
 return MathUtils.smootherstep(reveal,(3-distance)*0.13,1);
}
