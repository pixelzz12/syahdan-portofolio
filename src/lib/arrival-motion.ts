import {MathUtils} from "three";

// Local corridor coordinates keep the introduction identical on every loop.
export function arrivalReveal(cameraZ:number){
 return MathUtils.smoothstep(12-cameraZ,0,6);
}
