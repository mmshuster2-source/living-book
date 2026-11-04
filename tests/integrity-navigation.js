/* State model for the Integrity workflow; no browser or storage dependencies.
   This is an isolated contract fixture until imported into the editor. */
const IntegrityFlow = {
 begin(issueId,targetCount,scroll=0){
  if(!issueId||!Number.isInteger(targetCount)||targetCount<1)throw Error('Invalid issue or targets');
  return {issueId,targetCount,targetIndex:null,scrollPosition:scroll,mode:'compare'};
 },
 goTo(state,targetIndex,scrollPosition){
  if(!state||state.mode!=='compare')throw Error('Comparison not open');
  if(!Number.isInteger(targetIndex)||targetIndex<0||targetIndex>=state.targetCount)throw Error('Target out of range');
  return {...state,targetIndex,scrollPosition,mode:'edit'};
 },
 back(state){
  if(!state||state.mode!=='edit')throw Error('Not editing');
  return {...state,targetIndex:null,mode:'compare'};
 },
 finish(state){
  if(!state||state.mode!=='compare')throw Error('Finish after returning from edit');
  return null;
 }
};

if(typeof module!=='undefined')module.exports={IntegrityFlow};
