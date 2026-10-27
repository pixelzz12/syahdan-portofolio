const assert=require('node:assert/strict');
const {AmbientAudio}=require('../src/lib/ambient-audio.ts');
const sources=[],gains=[];let requests=0,contexts=0;
class Context{
 constructor(){contexts++;this.currentTime=1;this.state='suspended';this.destination={};}
 async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}
 async decodeAudioData(){return{duration:.05};}
 createBufferSource(){const source={connect(){},disconnect(){this.disconnected=true;},start(){this.started=true;},stop(){this.stopped=true;},onended:null};sources.push(source);return source;}
 createGain(){const gain={gain:{value:1,cancelScheduledValues(){},setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v,time){this.target=v;this.time=time;}},connect(){},disconnect(){this.disconnected=true;}};gains.push(gain);return gain;}
}
global.window={AudioContext:Context};global.fetch=async(url,{signal})=>{requests++;if(url.includes('slow'))return new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))));return{ok:!url.includes('missing'),arrayBuffer:async()=>new ArrayBuffer(8)};};
(async()=>{
 const engine=new AmbientAudio();assert.equal(contexts,0);assert.equal(requests,0);assert.equal(engine.state.context,'absent');
 await engine.enable();await engine.setRoom(null);assert.equal(requests,0,'Missing configuration never fetches an asset');
 await engine.setRoom('/audio/corridor.ogg');assert.equal(engine.state.voices,1);assert.equal(sources[0].loop,true);assert.equal(gains[0].gain.target,.1);
 await engine.setRoom('/audio/operator.ogg');assert.equal(engine.state.voices,2);assert.equal(gains[0].gain.target,0,'Previous room crossfades to silence');assert.equal(gains[1].gain.target,.1);
 engine.pause();assert.equal(engine.state.voices,0);assert.ok(sources.every(source=>source.stopped&&source.disconnected));
 await engine.enable();await engine.setRoom('/audio/corridor.ogg');assert.equal(requests,2,'Decoded audio is reused');
 await engine.playEffect('/audio/door.ogg');assert.equal(engine.state.voices,2);sources.at(-1).onended();assert.equal(engine.state.voices,1);
 const slow=engine.setRoom('/audio/slow.ogg');await engine.setRoom('/audio/operator.ogg');await slow;assert.equal(engine.state.enabled,true);
 await assert.rejects(engine.setRoom('/audio/missing.ogg'));await assert.rejects(engine.setRoom('https://example.test/audio.ogg'));
 engine.disable();const total=requests;await engine.playEffect('/audio/door.ogg');assert.equal(requests,total);assert.equal(engine.state.voices,0);
 engine.dispose();assert.equal(engine.state.context,'closed');assert.ok(gains.every(gain=>gain.disconnected));
 console.log('PASS: no autoplay/resource creation, missing assets make no requests, crossfade, cache, one-shot cleanup, cancelled loads, failure handling, mute and disposal.');
})().catch(error=>{console.error(error);process.exitCode=1});
