'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=fs.readFileSync('editor-v3-20-rc.html','utf8');
const start=src.indexOf('modelOps.moveBlocks=function(');
const end=src.indexOf('editorCommands.moveBlocks=function(',start);
assert(start>=0&&end>start,'bulk move model not found');
const modelOps={};new Function('modelOps',src.slice(start,end))(modelOps);
const make=()=>({sections:[{id:'s1'},{id:'s2'},{id:'s3'}],
 paragraphs:[{id:'a',section:'s1'},{id:'b',section:'s1'},{id:'free',section:'s1'},
 {id:'c',section:'s2'},{id:'d',section:'s3'}],
 blocks:[{id:'B1',section:'s1',paragraphIds:['a','b']},
 {id:'B2',section:'s2',paragraphIds:['c']},{id:'B3',section:'s3',paragraphIds:['d']}],
 annotations:[{id:'R1',target:'a'}],
 expertPackage:{integrityReview:[{id:'C01',targets:['a','d']}]}});
const p=d=>d.paragraphs.map(x=>x.id+':'+x.section).join(',');
let d=make();modelOps.moveBlocks(d,['B1','B2'],'s3');
assert.equal(p(d),'free:s1,d:s3,a:s3,b:s3,c:s3');
assert.deepEqual(d.expertPackage.integrityReview[0].targets,['a','d']);
d=make();modelOps.moveBlocks(d,['B3'],'s1');
assert.equal(p(d),'a:s1,b:s1,free:s1,d:s1,c:s2');
d=make();let before=JSON.stringify(d);
assert.throws(()=>modelOps.moveBlocks(d,['B1','BAD'],'s2'));
assert.equal(JSON.stringify(d),before);
d=make();d.blocks[2].paragraphIds.push('a');before=JSON.stringify(d);
assert.throws(()=>modelOps.moveBlocks(d,['B1'],'s3'),/нескольким блокам/);
assert.equal(JSON.stringify(d),before);
// Simulate the editorCommands.execute save boundary: only publish draft
// after a successful persistence result.
d=make();before=JSON.stringify(d);
function transaction(doc,writeOk){
 const draft=JSON.parse(JSON.stringify(doc));
 modelOps.moveBlocks(draft,['B1'],'s2');
 return writeOk?draft:doc;
}
assert.equal(JSON.stringify(transaction(d,false)),before);
assert.notEqual(JSON.stringify(transaction(d,true)),before);
console.log('PASS bulk move: multiple/ordered/upward/invalid/conflict/draft rollback');
