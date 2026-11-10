// Response timing and parent portal for Comprehension Coach.
const TELEMETRY_KEY='saiComprehensionTelemetryV1';
let telemetryState=JSON.parse(localStorage.getItem(TELEMETRY_KEY)||'{"events":[]}');
let rt={};

const tnow=()=>performance.now();
const tsec=ms=>Math.max(.1,Math.round(ms/100)/10);
function saveTelemetry(){telemetryState.events=telemetryState.events.slice(-500);localStorage.setItem(TELEMETRY_KEY,JSON.stringify(telemetryState));renderParentPortal();}
function resetTiming(){rt={shownAt:tnow(),firstDecode:null,decodeChanges:0,lastDecode:{action:null,target:null},firstEvidence:null,evidenceChanges:0,answerShown:null,firstAnswer:null,answerChanges:0,lastAnswer:null,writeStart:null,writeChanges:0};}
function classify(correct,seconds,changes=0){
  if(correct&&seconds<=10&&changes<=1)return['Secure','Fast + correct: likely secure and increasingly automatic.'];
  if(correct)return['Developing','Correct but hesitant: understood, but not yet automatic.'];
  if(seconds<=6&&changes<=1)return['Rushed','Fast + wrong: may indicate impulsive reading or a strong misconception.'];
  return['Misconception','Wrong despite thinking time: likely a genuine skill gap or competing idea.'];
}
function logEvent(evt){telemetryState.events.push({ts:Date.now(),questionId:current?.id||'',skill:current?.skillLabel||'',...evt});saveTelemetry();}

document.addEventListener('click',e=>{
  const d=e.target.closest('.choice[data-type="action"],.choice[data-type="target"]');
  if(d){if(!rt.firstDecode)rt.firstDecode=tnow();const k=d.dataset.type,v=d.dataset.value;if(rt.lastDecode[k]&&rt.lastDecode[k]!==v)rt.decodeChanges++;rt.lastDecode[k]=v;}
  const ev=e.target.closest('#evidenceChoices .evidence-option');if(ev){if(!rt.firstEvidence)rt.firstEvidence=tnow();rt.evidenceChanges++;}
  const a=e.target.closest('.sai-answer-choice');if(a){if(!rt.firstAnswer)rt.firstAnswer=tnow();const v=decodeURIComponent(a.dataset.text||'');if(rt.lastAnswer&&rt.lastAnswer!==v)rt.answerChanges++;rt.lastAnswer=v;}
});

document.querySelector('#checkDecodeBtn')?.addEventListener('click',()=>setTimeout(()=>{
  if(!selectedAction||!selectedTarget)return;
  const correct=selectedAction===current.action&&selectedTarget===current.target;
  const seconds=tsec(tnow()-rt.shownAt),first=rt.firstDecode?tsec(rt.firstDecode-rt.shownAt):seconds,[label,meaning]=classify(correct,seconds,rt.decodeChanges);
  logEvent({stage:'decode',correct,responseSeconds:seconds,firstChoiceSeconds:first,changes:rt.decodeChanges,label,meaning});
},0));

document.querySelector('#checkEvidenceBtn')?.addEventListener('click',()=>setTimeout(()=>{
  const boxes=[...document.querySelectorAll('#evidenceChoices input')];
  const good=boxes.filter((x,i)=>x.checked&&current.evidence[i][1]).length,bad=boxes.filter((x,i)=>x.checked&&!current.evidence[i][1]).length,need=current.evidence.filter(x=>x[1]).length;
  const correct=good===need&&bad===0,start=rt.firstEvidence||rt.shownAt,seconds=tsec(tnow()-start),[label,meaning]=classify(correct,seconds,rt.evidenceChanges);
  logEvent({stage:'evidence',correct,responseSeconds:seconds,firstChoiceSeconds:rt.firstEvidence?tsec(rt.firstEvidence-rt.shownAt):null,changes:rt.evidenceChanges,label,meaning});
  const s=document.querySelector('#answerChoiceStage');if(s&&!s.classList.contains('locked'))rt.answerShown=tnow();
},0));

document.querySelector('#checkSaiAnswerBtn')?.addEventListener('click',()=>setTimeout(()=>{
  if(!chosenSaiAnswer)return;
  const start=rt.answerShown||rt.shownAt,seconds=tsec(tnow()-start),first=rt.firstAnswer?tsec(rt.firstAnswer-start):seconds,correct=!!chosenSaiAnswer.correct,[label,meaning]=classify(correct,seconds,rt.answerChanges);
  logEvent({stage:'strongest_answer',correct,responseSeconds:seconds,firstChoiceSeconds:first,changes:rt.answerChanges,errorTag:correct?null:(chosenSaiAnswer.tag||current.errorFocus||null),label,meaning});
},0));

const answerBoxRT=document.querySelector('#answerBox');
answerBoxRT?.addEventListener('input',()=>{if(!rt.writeStart)rt.writeStart=tnow();rt.writeChanges++;});
document.querySelector('#showModelBtn')?.addEventListener('click',()=>{
  const text=answerBoxRT?.value?.trim()||'';if(!text)return;
  logEvent({stage:'writing',correct:null,responseSeconds:rt.writeStart?tsec(tnow()-rt.writeStart):null,firstChoiceSeconds:rt.writeStart?tsec(rt.writeStart-rt.shownAt):null,changes:rt.writeChanges,wordCount:text.split(/\s+/).filter(Boolean).length,label:'Recorded',meaning:'Writing time and answer length recorded.'});
});

const qNode=document.querySelector('#question');
new MutationObserver(()=>resetTiming()).observe(qNode,{childList:true,subtree:true,characterData:true});

const navRT=document.querySelector('.tabs'),parentTab=document.createElement('button');
parentTab.className='tab';parentTab.textContent='Parent portal';navRT.appendChild(parentTab);
const parentView=document.createElement('section');parentView.className='view';parentView.id='parentView';parentView.innerHTML=`
<article class="card parent-card">
  <div class="section-head"><div><p class="eyebrow">Parent portal</p><h2>Accuracy × fluency</h2><p class="muted">Timing is measured quietly. Accuracy comes first; speed is used only to detect hesitation, impulsive answers and growing automaticity.</p></div></div>
  <div id="parentSummary" class="stats-grid"></div>
  <h3>Likely interpretation</h3><div class="parent-table-wrap"><table id="interpretationTable" class="parent-table"></table></div>
  <h3>Skill picture</h3><div id="skillPicture" class="history"></div>
  <h3>Recent timed responses</h3><div id="timedHistory" class="history"></div>
  <button id="resetTelemetryBtn" class="danger-link">Reset timing data</button>
</article>`;
document.querySelector('.shell').appendChild(parentView);
parentTab.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));parentTab.classList.add('active');document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));parentView.classList.add('active');renderParentPortal();};

const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
function fluency(rate,time){if(rate>=.85&&time<=12)return'Fluent';if(rate>=.7)return time>18?'Hesitant':'Developing';return'Needs practice';}
function renderParentPortal(){
  const all=telemetryState.events.filter(e=>e.stage==='strongest_answer'),correct=all.filter(e=>e.correct).length,acc=all.length?Math.round(correct/all.length*100):0,tm=all.length?Math.round(avg(all.map(e=>e.responseSeconds))*10)/10:0;
  document.querySelector('#parentSummary').innerHTML=`<div class="stat"><small>Answer accuracy</small><strong>${all.length?acc+'%':'—'}</strong></div><div class="stat"><small>Avg. decision time</small><strong>${all.length?tm+'s':'—'}</strong></div><div class="stat"><small>Hesitant / misconception</small><strong>${all.length?all.filter(e=>e.label==='Developing'||e.label==='Misconception').length:'—'}</strong></div>`;
  const rows=[['Fast + correct','Secure','Likely secure and increasingly automatic.'],['Slow + correct','Developing','Understands it, but hesitation suggests it is not yet automatic.'],['Fast + wrong','Rushed','May have misread, clicked impulsively, or applied a strong misconception.'],['Slow + wrong','Misconception','Likely a genuine skill gap or competing idea that needs teaching.'],['Changes answer repeatedly','Uncertain','Concepts are competing even if the final answer is correct.']];
  document.querySelector('#interpretationTable').innerHTML='<thead><tr><th>Pattern</th><th>Label</th><th>Likely interpretation</th></tr></thead><tbody>'+rows.map(r=>`<tr><td>${r[0]}</td><td><strong>${r[1]}</strong></td><td>${r[2]}</td></tr>`).join('')+'</tbody>';
  const grouped={};all.forEach(e=>(grouped[e.skill]||=[]).push(e));const skills=Object.entries(grouped).map(([skill,a])=>{const rate=a.filter(x=>x.correct).length/a.length,time=avg(a.map(x=>x.responseSeconds));return{skill,n:a.length,accuracy:Math.round(rate*100),time:Math.round(time*10)/10,status:fluency(rate,time)}}).sort((a,b)=>a.accuracy-b.accuracy||b.time-a.time);
  document.querySelector('#skillPicture').innerHTML=skills.length?skills.map(s=>`<div class="history-item"><div><strong>${s.skill}</strong><br><small>${s.n} responses · ${s.accuracy}% correct · ${s.time}s average</small></div><strong>${s.status}</strong></div>`).join(''):'<p>No timed answer choices yet.</p>';
  const recent=[...telemetryState.events].reverse().slice(0,20);document.querySelector('#timedHistory').innerHTML=recent.length?recent.map(e=>`<div class="history-item"><div><strong>${e.label||e.stage}</strong> · ${e.skill}<br><small>${e.stage.replaceAll('_',' ')} · ${e.correct===true?'correct':e.correct===false?'incorrect':'recorded'}${e.errorTag?' · '+(errorLabels[e.errorTag]||e.errorTag):''}${e.changes?' · '+e.changes+' change'+(e.changes===1?'':'s'):''}</small></div><strong>${e.responseSeconds!=null?e.responseSeconds+'s':'—'}</strong></div>`).join(''):'<p>No timing data yet.</p>';
}
parentView.addEventListener('click',e=>{if(e.target.id==='resetTelemetryBtn'&&confirm('Reset all timing data on this device?')){telemetryState={events:[]};saveTelemetry();}});
resetTiming();renderParentPortal();
