const assert=require('node:assert/strict');
const {dampMotion}=require('../src/lib/scene-navigation.ts');
for(const smoothTime of [.16,.22])for(const target of [1,12,-12]){
 let value=0,velocity=0;
 for(let frame=0;frame<120;frame++){const next=dampMotion(value,target,velocity,1/60,Infinity,smoothTime);value=next.value;velocity=next.velocity;}
 assert.equal(value,target,'Large scroll bursts must settle without a movement backlog');
 for(let frame=0;frame<150;frame++){const next=dampMotion(value,-target,velocity,1/60,Infinity,smoothTime);value=next.value;velocity=next.velocity;}
 assert.equal(value,-target,'Reversed input must settle without continued drift');
 assert.equal(velocity,0);
}
console.log('PASS: large forward/reverse scroll bursts settle and stop without queued camera movement.');
