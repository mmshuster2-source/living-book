/* Conservative structural guard, not a browser/E2E test.
   Run: node tests/v3-structure-guard.test.js editor-v3-13-rc.html */
'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const path=process.argv[2]||'editor-v3-13-rc.html';
const source=fs.readFileSync(path,'utf8');
const required=[
 ['transaction wrapper','const editorCommands={'],
 ['draft isolation','const before=data,draft=structuredClone(before)'],
 ['rollback on failed persistence','if(!save()){data=before;return false}'],
 ['storage conflict detection','actual!==expectedSnapshot'],
 ['storage readback verification','storage.getItem(articleKey)!==next'],
 ['DOM-free block-text mutation','modelOps.saveBlockText=function(doc,blockId,entries)'],
 ['block-text command','editorCommands.saveBlockText=function(blockId,entries)'],
 ['direct operations dispatcher','function executeOperation(id,context)'],
 ['separate operations panel','id="operationsPanel"'],
 ['separate passport panel','id="passportPanel"'],
 ['separate reviews panel','id="revisionPanel"'],
 ['separate integrity panel','id="integrityPanel"'],
 ['note badge selection','function focusReviewNote(id)'],
 ['note list rendering','function renderReviews(){'],
 ['document-wide integrity collection','function collectIntegrityItems(doc)'],
 ['actual imported integrity field','pkg.integrityReview'],
 ['multiple integrity targets','integrityEntryTargets(item)'],
 ['comparison user-flow contract reference','function renderExpertiseSummary(){']
];
for(const [name,text] of required){assert(source.includes(text),'Missing: '+name+' ('+text+')')}
assert(!source.includes('id="expertPanel"'),'The removed Expertise wrapper must not reappear');
assert(!source.includes('id="nextRevision"'),'The rejected Next review command must not return');
const main=source.match(/<script>\s*('use strict';[\s\S]*?)<\/script><\/body><\/html>$/)?.[1];
assert(main,'Main script not located');
new Function(main);
console.log('PASS '+path+' — '+required.length+' structural checks and JavaScript parse');
console.log('LIMITATION: static tests do not exercise browser selection, saves or user workflow');
