import manifest from "@/data/assets.generated.json";
type Variant={src:string;thumbnail:string;texture:string;width:number;height:number;beforeSrc?:string;framingConfirmed?:boolean};
const assets=manifest.assets as Variant[];
export const assetThumbnail=(src:string,explicit?:string)=>explicit||assets.find(asset=>asset.src===src)?.thumbnail||src;
export const assetTexture=(src:string,explicit?:string)=>explicit||assets.find(asset=>asset.src===src)?.texture||src;
export const assetPairConfirmed=(src:string)=>assets.find(asset=>asset.src===src)?.framingConfirmed===true;
