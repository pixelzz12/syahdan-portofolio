export function projectLink(value?:string){
 if(!value)return null;
 try{const url=new URL(value);return ["https:","http:"].includes(url.protocol)&&!url.username&&!url.password&&url.hostname!=="localhost"&&url.hostname!=="127.0.0.1"?url.href:null;}catch{return null;}
}
