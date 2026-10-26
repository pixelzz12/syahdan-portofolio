const assert=require('node:assert/strict');
const {chromium}=require(process.env.NOVA_PLAYWRIGHT_PATH||'playwright');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.NOVA_BROWSER_PATH?{executablePath:process.env.NOVA_BROWSER_PATH}:{})});try{
const url=process.env.NOVA_BASE_URL||'http://localhost:3000';
for(const viewport of [{width:390,height:844},{width:320,height:640},{width:844,height:390}]){
 const p=await browser.newPage({viewport,isMobile:true,hasTouch:true});
 await p.addInitScript(()=>{const getContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(String(type).includes('webgl'))return null;return getContext.call(this,type,...args);};});
 await p.goto(url);await p.getByRole('status').filter({hasText:'Tampilan 3D tidak tersedia'}).waitFor();assert.equal(await p.locator('.reading-sector:visible').count(),6);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await p.locator('#film summary').filter({hasText:'Meja inspeksi'}).tap();await p.locator('#film .local-photo-inputs input').first().waitFor();assert.equal(await p.locator('#film .local-photo-inputs input:visible').count(),2);await p.locator('#film summary').filter({hasText:'Meja inspeksi'}).tap();await p.locator('#film .local-photo-inputs input').first().waitFor({state:'detached'});
 await p.locator('#development summary').filter({hasText:'Arsip teknologi'}).tap();await p.locator('#development').getByRole('button',{name:'Inspeksi MySQL',exact:true}).tap();assert.match(await p.locator('#development .technology-selection').innerText(),/Pernah Digunakan/);await p.close();
}
const noJS=await browser.newPage({javaScriptEnabled:false});await noJS.goto(url);assert.equal(await noJS.locator('.reading-sector:visible').count(),6);assert.equal(await noJS.getByRole('heading',{name:'Operator’s Quarters',exact:true}).count(),1);await noJS.close();
console.log('PASS: WebGL fallback, all six HTML sectors, 320px/390px/landscape layouts, mobile grading open/dispose, accessible technology archive, JavaScript-disabled portfolio.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});

