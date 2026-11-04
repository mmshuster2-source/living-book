/* Run with: node integrity-navigation.test.js
   Browser-independent checks for the historical compare -> edit -> return flow. */
'use strict';
const assert = require('node:assert/strict');
const {IntegrityFlow} = require('./integrity-navigation.js');

const originalTargets = ['BK-001','p-002','BK-003'];
let state=IntegrityFlow.begin('C05',originalTargets.length,74);
assert.equal(state.mode,'compare');assert.equal(state.issueId,'C05');
state=IntegrityFlow.goTo(state,2,115);
assert.equal(state.targetIndex,2);assert.equal(state.mode,'edit');
assert.equal(originalTargets[state.targetIndex],'BK-003');
state=IntegrityFlow.back(state);
assert.equal(state.mode,'compare');assert.equal(state.issueId,'C05');
assert.equal(state.scrollPosition,115);
state=IntegrityFlow.goTo(state,0,20);
state=IntegrityFlow.back(state);
assert.equal(state.issueId,'C05');
assert.equal(state.scrollPosition,20);
assert.throws(()=>IntegrityFlow.goTo(state,3,0),/range/);
assert.throws(()=>IntegrityFlow.back(state),/Not editing/);
assert.equal(IntegrityFlow.finish(state),null);
assert.equal(IntegrityFlow.begin('C01',1).targetCount,1);
assert.equal(IntegrityFlow.begin('C02',2).targetCount,2);
assert.equal(IntegrityFlow.begin('C03',5).targetCount,5);
assert.throws(()=>IntegrityFlow.begin('',3),/Invalid/);
assert.throws(()=>IntegrityFlow.begin('C04',0),/Invalid/);
console.log('PASS: comparison navigation, three targets, scroll, repeated return, bounds');
