import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const args=process.argv.slice(2), option=name=>{const index=args.indexOf(name);return index>=0?args[index+1]:undefined;};
const workspace=process.cwd(), configFile=path.resolve(option('--config')||'assets.config.json');
const config=JSON.parse(await fs.readFile(configFile,'utf8'));
const revision=option('--revision')||config.revision||'v1';
if(!/^[a-zA-Z0-9_-]+$/.test(revision))throw new Error('Revision must contain letters, digits, hyphens or underscores.');
function inside(root,value){const resolved=path.resolve(root,value),relative=path.relative(root,resolved);if(relative.startsWith('..')||path.isAbsolute(relative))throw new Error('Path escapes configured directory: '+value);return resolved;}
const input=inside(workspace,config.inputRoot||'assets/source'),output=inside(workspace,config.outputRoot||'public/assets');
inside(path.join(workspace,'public'),output);
const manifestPath=inside(workspace,config.manifest||'src/data/assets.generated.json');
const reports=inside(workspace,config.report||'asset-report.json');
sharp.cache(false);sharp.concurrency(1);
let previous={assets:[]};try{previous=JSON.parse(await fs.readFile(manifestPath,'utf8'));}catch{}
const byId=new Map(previous.assets.map(entry=>[entry.id,entry])), results=[];
const recipes={photography:{full:2000,quality:84,thumbnail:640},profile:{full:1200,quality:84,thumbnail:320},projects:{full:1600,quality:82,thumbnail:640},experiments:{full:1600,quality:82,thumbnail:640},research:{full:1600,quality:82,thumbnail:640}};
const exists=async file=>{try{await fs.access(file);return true;}catch{return false;}};
const dimensions=async file=>{const metadata=await sharp(file).metadata();const swapped=[5,6,7,8].includes(metadata.orientation);return {width:swapped?metadata.height:metadata.width,height:swapped?metadata.width:metadata.height};};
const publicUrl=file=>'/'+path.relative(path.join(workspace,'public'),file).split(path.sep).join('/');
async function writeNew(file,buffer){await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,buffer,{flag:'wx'});}
for(const item of config.assets){
  try{
    if(!/^[a-z0-9_-]+$/i.test(item.id))throw new Error('Invalid asset ID');
    const source=inside(input,item.source);
    if(!await exists(source)){results.push({id:item.id,status:'missing',source:item.source,required:Boolean(item.required)});continue;}
    const buffer=await fs.readFile(source);
    let beforeFile=null,beforeBuffer=null;
    if(item.before&&await exists(inside(input,item.before))){beforeFile=inside(input,item.before);beforeBuffer=await fs.readFile(beforeFile);}
    const hash=crypto.createHash('sha256').update(buffer).update(beforeBuffer||'').update(JSON.stringify({kind:item.kind,revision,framingConfirmed:item.framingConfirmed,version:1})).digest('hex');
    const old=byId.get(item.id);
    const folder=inside(output,path.join('optimized',revision,item.kind));
    if(item.kind==='logos'){
      if(!/\.svg$/i.test(source))throw new Error('Official logo expects the original SVG file; configure a raster asset separately if needed.');
      const file=inside(folder,item.id+'.svg');
      if(await exists(file)){if(old?.hash!==hash||old?.src!==publicUrl(file))throw new Error('Output exists with different source. Use --revision v2; no overwrite performed.');}
      else if(!args.includes('--check'))await writeNew(file,buffer);
      const entry={id:item.id,hash,src:publicUrl(file),thumbnail:publicUrl(file),texture:publicUrl(file)};
      if(!args.includes('--check'))byId.set(item.id,entry);
      results.push({id:item.id,status:args.includes('--check')?'valid':old?.hash===hash?'unchanged':'generated',src:entry.src});continue;
    }
    const recipe=recipes[item.kind];if(!recipe)throw new Error('Unknown image kind '+item.kind);
    const size=await dimensions(source);if(!size.width||!size.height)throw new Error('Image has no valid dimensions.');
    if(beforeFile){const beforeSize=await dimensions(beforeFile);if(size.width!==beforeSize.width||size.height!==beforeSize.height)throw new Error('Grading pair dimensions/orientation mismatch; nothing cropped or generated.');if(item.framingConfirmed!==true)throw new Error('Confirm matching framing with framingConfirmed:true before generating a grading pair.');}
    const files={src:inside(folder,item.id+'.webp'),thumbnail:inside(folder,item.id+'.thumb.webp'),texture:inside(folder,item.id+'.texture.webp')};
    if(beforeFile)files.beforeSrc=inside(folder,item.id+'.before.webp');
    const urls=Object.fromEntries(Object.entries(files).map(([key,file])=>[key,publicUrl(file)]));
    const present=await Promise.all(Object.values(files).map(exists));
    if(present.some(Boolean)&&(old?.hash!==hash||old?.src!==urls.src))throw new Error('Existing output differs. Use --revision v2; originals and old variants remain untouched.');
    if(!args.includes('--check')){
      for(const [key,file]of Object.entries(files)){
        if(await exists(file))continue;
        const maximum=key==='thumbnail'?recipe.thumbnail:key==='texture'?320:recipe.full;
        const quality=key==='thumbnail'?78:key==='texture'?74:recipe.quality;
        const result=await sharp(key==='beforeSrc'?beforeFile:source).rotate().resize({width:maximum,height:maximum,fit:'inside',withoutEnlargement:true}).webp({quality}).toBuffer();
        await writeNew(file,result);
      }
      byId.set(item.id,{id:item.id,hash,...urls,width:size.width,height:size.height,framingConfirmed:Boolean(beforeFile&&item.framingConfirmed)});
    }
    results.push({id:item.id,status:args.includes('--check')?'valid':old?.hash===hash?'unchanged':'generated',...size,...urls,beforeRequested:Boolean(item.before),beforeAvailable:Boolean(beforeFile)});
  }catch(error){results.push({id:item.id,status:'invalid',error:String(error.message||error)});}
}
await fs.mkdir(path.dirname(reports),{recursive:true});await fs.writeFile(reports,JSON.stringify({revision,results},null,2));
if(!args.includes('--check')){const temporary=manifestPath+'.tmp';await fs.mkdir(path.dirname(manifestPath),{recursive:true});await fs.writeFile(temporary,JSON.stringify({revision,assets:[...byId.values()]},null,2));await fs.rename(temporary,manifestPath);}
const counts={generated:results.filter(r=>r.status==='generated').length,unchanged:results.filter(r=>r.status==='unchanged').length,valid:results.filter(r=>r.status==='valid').length,missing:results.filter(r=>r.status==='missing').length,invalid:results.filter(r=>r.status==='invalid').length};
console.log(JSON.stringify({revision,...counts,report:path.relative(workspace,reports)}));
if(counts.invalid||results.some(r=>r.status==='missing'&&r.required)||args.includes('--strict')&&counts.missing)process.exitCode=1;
