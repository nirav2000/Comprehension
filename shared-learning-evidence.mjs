// Comprehension Coach -> Shared Learning Evidence v1.
// Original typed answers, audio, parent archive and Firebase permissions stay untouched.
async function bootstrap(){
  const target=document.getElementById('parentView');
  if(!target)return;
  let mountEvidencePanel,toLearningEvent;
  try{
    ({mountEvidencePanel}=await import('https://nirav2000.github.io/Apps/learning-evidence/v1/panel.js'));
    ({toLearningEvent}=await import('https://nirav2000.github.io/Apps/learning-evidence/v1/index.js'));
  }catch(e){console.warn('Shared Learning Evidence unavailable; original progress remains intact',e);return;}
  let panel;
  try{panel=mountEvidencePanel({target,appId:'comprehension',accountId:'guest',learnerId:'sai',
      title:'Learning evidence · English explanations'});}
  catch(e){console.warn('Unable to mount Comprehension evidence',e);return;}
  const read=()=>{try{return JSON.parse(localStorage.getItem('comprehension-explain-v2')||'null')}catch{return null;}};
  const convert=a=>{
    if(!a?.id||!a.concept)return null;
    // This is accuracy on the first multiple-choice decision, NOT quality of
    // a free-written explanation (which needs an educator's judgement).
    const support=(Number(a.hints)||0)>0?'small-prompt':'none';
    return {id:'comprehension-choice:'+a.id,
      concept:'english:choose:'+a.concept,phase:'practice',
      correct:a.correct===true,total:1,support,at:a.timestamp,
      durationMs:Number.isFinite(a.choiceMs)?a.choiceMs:null,
      source:{kind:'comprehension-choice-v2',ref:a.id}};
  };
  function capture(){
    const saved=read();
    try{panel.store.ingest((saved?.attempts||[]).map(convert).filter(Boolean));}
    catch(e){console.warn('Comprehension evidence capture unavailable; original attempts remain saved',e);}
  }
  function mirrorManual(){
    const sdk=window.ComprehensionShared?.learningStore;
    const sync=window.ComprehensionShared?.learningSync;
    if(!sdk||!sync)return;
    const linked=new Set((sdk.getState().events||[]).map(e=>e.context?.learningEvidenceV1?.id).filter(Boolean));
    let changed=false;
    for(const row of panel.store.getEntries()){
      if(row.source?.kind!=='parent-check'||linked.has(row.id))continue;
      sdk.record(toLearningEvent(row));linked.add(row.id);changed=true;
    }
    if(changed){
      try{sync.capture(sdk.getState());}
      catch(e){console.warn('Manual assessment saved locally; Learning Sync mirror unavailable',e);}
    }
  }
  panel.store.subscribe(mirrorManual);
  capture();
  mirrorManual();
  window.addEventListener('comprehension-local-saved',capture);
  window.addEventListener('comprehension-history-loaded',capture);
  window.addEventListener('comprehension-shared-status',mirrorManual);
  window.COMPREHENSION_LEARNING_EVIDENCE={store:panel.store,panel,refresh:capture};
  if(new URLSearchParams(location.search).get('learningEvidence')==='1'){
    document.querySelector('[data-view="parent"]')?.click();
    panel.element.scrollIntoView({block:'start'});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootstrap);
else bootstrap();
