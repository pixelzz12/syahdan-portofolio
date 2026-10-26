import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('public/assets/logos/technologies');await fs.mkdir(root,{recursive:true});
const source=await fs.readFile('src/data/technologies.ts','utf8');
// Explicit slugs; no university logo is downloaded or generated.
const slugs=['html5','css3','javascript','typescript','php','react','nextdotjs','laravel','tailwindcss','bootstrap','threedotjs','greensock','nodedotjs','npm','git','github','visualstudiocode','vite','python','openjdk','c','cplusplus','arduino','mysql','phpmyadmin','postgresql','sqlite','mongodb','express','espressif','raspberrypi','micropython','bluetooth','mqtt','adobephotoshop','adobeillustrator','canva','figma','adobelightroom','capcut','adobepremierepro','adobeaftereffects','davinciresolve','ollama','docker','linux'];
const base='https://raw.githubusercontent.com/simple-icons/simple-icons/11.15.0/';const results=[];
for(let i=0;i<slugs.length;i+=4)await Promise.all(slugs.slice(i,i+4).map(async slug=>{let url=base+'icons/'+slug+'.svg';try{let response=await fetch(url);if(!response.ok){url='https://raw.githubusercontent.com/simple-icons/simple-icons/15.0.0/icons/'+slug+'.svg';response=await fetch(url);}if(!response.ok)throw new Error('HTTP '+response.status);let svg=await response.text();if(!svg.includes('<svg'))throw new Error('Not SVG');svg=svg.replace('<svg ','<svg width="128" height="128" ');await fs.writeFile(path.join(root,slug+'.svg'),svg);results.push({slug,url,license:'CC0-1.0',available:true});}catch(error){results.push({slug,url,available:false,error:String(error)});}}));
const license=await fetch(base+'LICENSE.md');if(license.ok)await fs.writeFile(path.join(root,'LICENSE.md'),await license.text());
await fs.writeFile(path.join(root,'SOURCES.json'),JSON.stringify({source:'Simple Icons 11.15.0; per-icon fallback 15.0.0',license:'CC0-1.0 (trademarks remain with their owners)',artworkModified:false,displaySizeOnly:'SVG width/height set to 128',icons:results},null,2));
console.log(JSON.stringify({downloaded:results.filter(r=>r.available).length,missing:results.filter(r=>!r.available).map(r=>r.slug)}));
