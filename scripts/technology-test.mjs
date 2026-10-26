import assert from 'node:assert/strict';
import fs from 'node:fs';
import {technologies,featuredTechnologyIds} from '../src/data/technologies.ts';
const confirmed=['mysql','sql','photoshop','illustrator','canva','figma','lightroom','capcut','premiere','aftereffects','resolve'].sort();
const used=technologies.filter(t=>t.experience==='Pernah Digunakan').map(t=>t.id).sort();
assert.deepEqual(used,confirmed,'Only explicitly confirmed tools may be labeled used');
assert.equal(new Set(technologies.map(t=>t.id)).size,technologies.length,'IDs must be unique');
for(const entry of technologies){assert.ok(['Pernah Digunakan','Sedang Dipelajari','Ingin Dieksplorasi','Belum Dikonfirmasi'].includes(entry.experience));assert.equal(typeof entry.visible,'boolean');assert.ok(Array.isArray(entry.relatedProjectIds));}
for(const ids of Object.values(featuredTechnologyIds)){assert.ok(ids.length<=6);for(const id of ids)assert.ok(technologies.find(t=>t.id===id));}
const missing=technologies.filter(t=>t.logoPath&&!fs.existsSync('public'+t.logoPath));
assert.deepEqual(missing.map(t=>t.id),['capcut']);
console.log(JSON.stringify({total:technologies.length,used:used.length,unconfirmed:technologies.filter(t=>t.experience==='Belum Dikonfirmasi').length,learning:technologies.filter(t=>t.experience==='Sedang Dipelajari').length,exploratory:technologies.filter(t=>t.experience==='Ingin Dieksplorasi').length,missingLogos:missing.map(t=>t.name)}));
console.log('PASS: confirmed experience, unique editable IDs, bounded physical wall collections, graceful missing logo inventory.');
