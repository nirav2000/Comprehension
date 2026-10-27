import {LESSONS, LESSON_BY_ID, LEVELS, GLOSSARY} from './explain-data.js';

const KEY='comprehension-explain-v2';
const DAY=86400000, MAX_AUDIO_SECONDS=90;
const $=selector=>document.querySelector(selector);
const $$=selector=>Array.from(document.querySelectorAll(selector));
const clean=s=>String(s??'');
const esc=s=>clean(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const id=()=>globalThis.crypto?.randomUUID?.()||'attempt-'+Date.now()+'-'+Math.random().toString(36).slice(2);
const dateLabel=t=>t?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(new Date(t)):'Not yet';
const durationLabel=ms=>ms<60000?`${Math.round(ms/1000)}s`:`${Math.round(ms/60000)}m`;
function emptyData(){return {schema:2,attempts:[],review:{},wordLookups:{},updatedAt:Date.now()}}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(d?.schema===2&&Array.isArray(d.attempts)&&d.review)return d;}catch{}return emptyData()}
let data=load(),session=null,view='learn',lastLesson=null,wordReturnFocus=null;
let recorder=null,micStream=null,recordChunks=[],recordTimeout=null,liveRecognition=null,audioObjectUrl=null,audioEntry=null,learningSDK=null;
let audioDb=null;

function persist(){
  data.updatedAt=Date.now();
  try{localStorage.setItem(KEY,JSON.stringify(data)); $('#storageNote').textContent='Saved on this device';return true;}
  catch(error){$('#storageNote').textContent='Storage full: export your work';console.error('Local save failed',error);return false;}
}
function due(id){const r=data.review[id];return !r||r.nextDue<=Date.now()}
function dueCount(){return LESSONS.filter(l=>data.review[l.id]&&due(l.id)).length}
function currentLesson(){return session&&LESSON_BY_ID[session.lessonId]}
function setView(to){
  view=to;
  $$('.nav-btn').forEach(b=>{const active=b.dataset.view===to;b.classList.toggle('active',active);active?b.setAttribute('aria-current','page'):b.removeAttribute('aria-current')});
  $$('.view').forEach(el=>el.classList.toggle('active',el.id===to+'View'));
  if(to==='learn'){renderLessons();if(!session){$('#lessonList').classList.remove('hidden');$('#workshop').classList.add('hidden')}}
  if(to==='review')renderReview();
  if(to==='parent')renderParent();
  window.scrollTo({top:0,behavior:'instant'});
}
function recentFor(id){return data.attempts.find(a=>a.lessonId===id)}
function renderLessons(){
  const filter=$('#levelFilter').value;
  const pool=LESSONS.filter(l=>filter==='all'||String(l.level)===filter);
  $('#lessonList').innerHTML=pool.map(l=>{
    const prev=recentFor(l.id),r=data.review[l.id];
    let note=!prev?'Not yet practised':`Last tried ${dateLabel(prev.timestamp)}`;
    if(r&&due(l.id))note='Due for review';
    else if(r)note=`Next review ${dateLabel(r.nextDue)}`;
    return `<button type="button" class="lesson-card" data-lesson="${esc(l.id)}"><div class="lesson-level"><span>LEVEL ${l.level} · ${esc(LEVELS[l.level])}</span><span>${prev?'✓':''}</span></div><h3>${esc(l.title)}</h3><p>${esc(l.quote)}</p><div class="card-foot"><span>${esc(note)}</span><strong>${l.minutes} min →</strong></div></button>`;
  }).join('')||'<p class="empty">No lessons at this level yet.</p>';
  $('#heroAttempts').textContent=data.attempts.length;
  const independent=data.attempts.filter(a=>a.independent).length;
  $('#heroConfidence').textContent=data.attempts.length?`${independent} completed without hints`:'Start with one word.';
  $('#reviewCount').textContent=dueCount();
}
function openLesson(lessonId,{review=false}={}){
  if(!LESSON_BY_ID[lessonId])return;
  stopRecognition();stopRecording(true);
  session={lessonId,stage:1,startedAt:Date.now(),stageStartedAt:Date.now(),stageTimes:[0,0,0,0],choice:null,choiceTime:null,firstChoice:null,firstChoiceCorrect:null,choiceHistory:[],hints:0,shownHints:[],wordLookups:0,build:['','','',''],answer:'',entryMode:'typed',recordingId:null,hasAudio:false,feedbackSeen:false,modelSeen:false,revisionOf:lastLesson===lessonId?recentFor(lessonId)?.id:null,fromReview:review,attemptSaved:false,finishedId:null};
  lastLesson=lessonId;
  setView('learn');
  $('#lessonList').classList.add('hidden');$('#workshop').classList.remove('hidden');
  const l=currentLesson();
  $('#lessonTitle').textContent=l.title;
  $('#lessonBadge').textContent=`LEVEL ${l.level} · ${LEVELS[l.level].toUpperCase()}`;
  $('#lessonSubhead').textContent=review?'REVIEW & IMPROVE':'BUILD THE SKILL';
  $('#lessonMinutes').textContent=`About ${l.minutes} min`;
  $('#lessonSource').textContent=l.source?l.source+" · Note: one printing of Q2 mentions activity and excitement, but the school's mark scheme assesses language techniques and their effects.":'Short practice before longer exam answers';
  $('#questionText').textContent=l.question;
  $('#quote').replaceChildren(...renderTappableQuote(l.quote));
  $('#decode').innerHTML=`<details><summary>Translate the question into simple words</summary><p><b>ACTION:</b> ${esc(l.action)}<br><b>TARGET:</b> ${esc(l.target)}</p><p>EXPLAIN means: identify the clue, tell us what it makes you picture, and say why that matters. <button type="button" class="quiet-link" data-word="explain">What does explain mean?</button></p></details>`;
  renderStage();
  $('#workshop').scrollIntoView({block:'start',behavior:'smooth'});
}
function renderTappableQuote(s){
  return s.split(/(\b[\w’'-]+\b)/g).filter(Boolean).map(t=>{
    const w=t.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g,'');
    if(!/[a-z]/i.test(t))return document.createTextNode(t);
    const b=document.createElement('button');b.type='button';b.className='tap-word';b.dataset.word=w;b.textContent=t;b.title=`Word help: ${w}`;b.setAttribute('aria-label',`Find meaning of ${t}`);return b;
  });
}
function changeStage(n){
  if(!session)return;
  if(liveRecognition||recorder?.state==='recording'){announce('Stop the microphone first, so your answer is not lost.');return}
  n=clamp(n,1,4);
  if(n===session.stage)return;
  session.stageTimes[session.stage-1]+=Date.now()-session.stageStartedAt;
  session.stage=n;session.stageStartedAt=Date.now();
  renderStage();$('#workshop').scrollIntoView({block:'start',behavior:'smooth'});
}
function announce(text){$('#stageHelp').textContent=text}
function renderStage(){
  const l=currentLesson(),s=session;
  if(!l)return;
  $$('.step').forEach(b=>{const n=Number(b.dataset.stage);b.classList.toggle('active',n===s.stage);b.classList.toggle('visited',n<s.stage);b.setAttribute('aria-current',n===s.stage?'step':'false')});
  $('#previousStage').disabled=s.stage===1;
  $('#nextStage').textContent=s.stage===4?'Finish & save ✓':'Continue →';
  announce('You can ask for help at any stage.');
  if(s.stage===1)renderUnderstand(l,s);
  if(s.stage===2)renderChoose(l,s);
  if(s.stage===3)renderBuild(l,s);
  if(s.stage===4)renderWrite(l,s);
}
function renderUnderstand(l,s){
  $('#lessonBody').innerHTML=`<p class="eyebrow">STEP 1 · UNDERSTAND</p><h3>Learn these words first</h3><p class="explain">Read the definitions before guessing. Tap any word above if you want to check it again.</p><div class="definition-list">${l.vocabulary.map(w=>{const v=GLOSSARY[w.toLowerCase()];return `<article class="definition"><strong>${esc(w)}</strong><small>${esc(v?.[0]||'Word help')}</small><p>${esc(v?.[1]||'Tap the word above to look it up.')}</p><em>${esc(v?.[2]||'')}</em></article>`}).join('')}</div><div class="hint"><strong>How to begin:</strong> ACTION = ${esc(l.action)}. TARGET = ${esc(l.target)}. First make sure you understand the words, then decide what the writer makes you picture.</div>`;
}
function renderChoose(l,s){
  const answered=s.choice!==null;
  const selected=l.options[s.choice];
  $('#lessonBody').innerHTML=`<p class="eyebrow">STEP 2 · CHOOSE</p><h3>Choose the best explanation</h3><p class="explain">You can get it wrong and still continue. After you choose, you'll see why EVERY answer works or doesn't work.</p>
  <div class="answer-grid">${l.options.map((o,i)=>`<button class="option ${s.choice===i?'selected':''} ${answered?(o.correct?'correct':s.choice===i?'incorrect':''):''}" type="button" data-option="${i}" aria-pressed="${s.choice===i}"><span class="radio-dot" aria-hidden="true"></span><span>${esc(o.text)}</span></button>`).join('')}</div>
  ${answered?`<div class="feedback ${selected.correct?'':'bad'}" role="status"><h4>${selected.correct?'✓ Exactly. Here is why.':'Not quite — here is the right answer.'}</h4><p>${esc(selected.why)}</p>${selected.correct?'':`<p><strong>Best answer:</strong> ${esc(l.options.find(o=>o.correct)?.text||'')}</p>`}<div class="reasons"><p><b>What each choice teaches us</b></p>${l.options.map(o=>`<div class="reason"><b><span class="result-icon ${o.correct?'correct-icon':'wrong-icon'}" aria-hidden="true">${o.correct?'✓':'×'}</span> ${esc(o.text)} · ${esc(o.part)}</b><p>${esc(o.why)}</p></div>`).join('')}</div></div>`:''}
  <div class="hintbar"><button class="btn ghost" type="button" data-hint="1">Give me a hint</button><button class="btn ghost" type="button" data-word="explain">What does explain mean?</button></div><div id="hintSlot"></div>`;
  if(s.shownHints.length)renderHints(l);
}
function renderHints(l){const slot=$('#hintSlot');if(!slot)return;slot.innerHTML=session.shownHints.map((h,i)=>`<div class="hint">Hint ${i+1}: ${esc(h)}</div>`).join('')}
function giveHint(){const l=currentLesson();if(!session||!l)return;const next=l.hints[session.shownHints.length];if(next){session.shownHints.push(next);session.hints++;renderHints(l)}else announce('All hints are showing. You can also read the model answer in the next stages.')}
function renderBuild(l,s){
  const labels=['WHO & TECHNIQUE','THE WORD OR COMPARISON','WHAT I PICTURE','WHAT IT SUGGESTS'];
  const prompts=['Who makes the choice?','Which exact word or technique?','What sound, picture or idea does it create?','Why does it matter?'];
  $('#lessonBody').innerHTML=`<p class="eyebrow">STEP 3 · BUILD</p><h3>Build an explanation, one part at a time</h3><p class="explain">Don't try to write the whole answer yet. Say what each part does. Write a few words or show the worked example.</p>
  <div class="builder">${labels.map((label,i)=>`<div class="build-row"><label for="build${i}">${i+1}. ${label}</label><div><input id="build${i}" data-build="${i}" value="${esc(s.build[i])}" placeholder="${esc(prompts[i])}"><small>${esc(prompts[i])}</small></div></div>`).join('')}</div>
  <div class="hintbar"><button class="btn secondary" type="button" id="showParts">${s.modelSeen?'Hide worked example':'Show worked example'}</button><button class="btn ghost" type="button" id="fillParts">Put the example parts into my boxes</button></div>
  <div id="partsModel" class="model ${s.modelSeen?'':'hidden'}"><h4>What each part of the sentence does</h4>${l.sentence.map((p,i)=>`<p><strong>${i+1}. ${labels[i]}:</strong> ${esc(p)}</p>`).join('')}<p class="subnote">This is ONE possible construction, not a script you have to memorise.</p></div>`;
}
function renderWrite(l,s){
  $('#lessonBody').innerHTML=`<p class="eyebrow">STEP 4 · EXPLAIN IT</p><h3>Now explain it in your own words</h3><p class="explain">You can type, use your keyboard's microphone, dictate with the button, or record your voice. All help is optional.</p>
  <label for="answerArea" class="overline">MY ANSWER</label><textarea class="answer-area" id="answerArea" spellcheck="true" placeholder="The writer uses ... This makes us imagine ...">${esc(s.answer)}</textarea>
  <div class="answer-actions"><button id="insertParts" type="button" class="btn secondary">Use my four parts</button><button id="modelBtn" type="button" class="btn ghost">${s.modelSeen?'Hide':'Show'} model answer</button><button id="compareBtn" type="button" class="btn ghost">Check my explanation</button></div>
  <div id="modelSlot" class="model ${s.modelSeen?'':'hidden'}"><h4>One strong answer</h4><p>${esc(l.model)}</p><h4>Why is this better?</h4><p class="weak">Less effective: ${esc(l.weak)}</p><p>${esc(l.whyBetter)}</p></div>
  <div id="comparisonSlot"></div>
  <div class="audio-box"><h4>🎙 Speak instead of typing</h4><p>One button records the audio and attempts speech-to-text at the same time. Some browsers allow audio but not transcription; you can still edit your answer or use keyboard dictation.</p>
  <div class="recorder-actions"><button id="recordBtn" class="btn primary" type="button">● Record + Dictate</button><button id="stopAudioBtn" class="btn secondary hidden" type="button">■ Stop recording + dictation</button></div>
  <p id="micStatus" class="quiet" role="status">Or tap the microphone on the iPad/iPhone keyboard inside the answer box.</p>
  <div id="transcriptPreview" class="transcript-preview" aria-live="polite"></div><div id="audioPlayback"></div></div>
  <div id="saveMessage" aria-live="polite"></div>
  <p class="subnote">Answers are checked using simple clue matching, not AI marking. An original, correct explanation may use entirely different words. You and your parent can judge the meaning.</p>`;
  $('#answerArea').addEventListener('input',e=>{s.answer=e.target.value;if(s.entryMode==='dictated')s.entryMode='dictated + edited';else if(s.entryMode!=='dictated + edited')s.entryMode='typed'});
  $('#insertParts').onclick=()=>{const bits=s.build.map(x=>x.trim()).filter(Boolean);if(!bits.length){announce('Try adding words in the four boxes first, or show the worked example.');return}const area=$('#answerArea');area.value=bits.join(' ').replace(/\s+([,.!?])/g,'$1');s.answer=area.value;s.entryMode='scaffolded';area.focus()};
  $('#modelBtn').onclick=()=>{s.modelSeen=!s.modelSeen;$('#modelSlot').classList.toggle('hidden',!s.modelSeen);s.feedbackSeen=true};
  $('#compareBtn').onclick=()=>{s.feedbackSeen=true;$('#comparisonSlot').innerHTML=renderComparison(l,s.answer)};
  $('#recordBtn').onclick=startRecording;
  $('#stopAudioBtn').onclick=()=>stopRecording(false);
  if(s.audioBlob)showAudioPreview(s.audioBlob);
  else if(s.recordingId)loadAudioPreview(s.recordingId);
}
function renderComparison(l,answer){
  if(!answer.trim())return '<p class="warning">First say, dictate or write an explanation. The model is available whenever you need it.</p>';
  const lower=answer.toLowerCase(),present=l.rubric.map(group=>group.some(x=>lower.includes(x.toLowerCase())));
  const names=['The writer\'s word or technique','The picture, sound or comparison','What this makes us think or feel'];
  const found=present.filter(Boolean).length;
  return `<div class="model"><h4>Let's inspect your answer</h4><p class="compare-score">${found}/3 ideas spotted by the simple text checker</p><div class="compare-list">${present.map((ok,i)=>`<div class="compare-item ${ok?'':'miss'}"><span class="status">${ok?'✓':'?'}</span><span>${names[i]} — ${ok?'some matching words found':'could be missing or phrased differently'}</span></div>`).join('')}</div><p>${esc(l.exampleReason)}</p><p class="subnote">This is a prompt for discussion, NOT an exam mark. It can miss synonyms and thoughtful explanations.</p><label class="inline-check"><input type="checkbox" id="ownAnswer">I can explain why my own words make sense</label><button class="btn secondary" type="button" id="retryAnswer">Try improving my answer</button></div>`;
}
function addReview(l,record){
  const old=data.review[l.id]||{streak:0};
  const streak=record.independent?Math.min(5,old.streak+1):0;
  const days=record.independent?[1,3,7,14,30][Math.max(0,streak-1)]:1;
  data.review[l.id]={streak,nextDue:record.timestamp+days*DAY,lastAt:record.timestamp,lastCorrect:record.correct,independent:record.independent,days};
}
function persistAttempt(){
  const l=currentLesson(),s=session;
  if(!l||!s)return;
  if(s.attemptSaved){$('#saveMessage').innerHTML='<p class="success">Already saved. Select another lesson or retry to make a new attempt.</p>';return}
  s.answer=$('#answerArea')?.value??s.answer;
  if(!s.answer.trim()&&!s.hasAudio){$('#saveMessage').innerHTML='<p class="warning">Please type, dictate or record something first. You can also show the model and have a go.</p>';return}
  if(liveRecognition||recorder?.state==='recording'){$('#saveMessage').innerHTML='<p class="warning">Stop recording or dictation before saving.</p>';return}
  const timestamp=Date.now();
  const phases=[...s.stageTimes];phases[s.stage-1]+=timestamp-s.stageStartedAt;
  const coverage=s.answer.trim()?l.rubric.map(group=>group.some(w=>s.answer.toLowerCase().includes(w.toLowerCase()))):[];
    const trulyIndependent=s.firstChoiceCorrect===true&&coverage.filter(Boolean).length>=2&&s.hints===0&&!s.modelSeen&&s.entryMode!=='scaffolded';
  const result={id:id(),lessonId:l.id,concept:l.concept,level:l.level,timestamp,correct:s.firstChoiceCorrect===true,finalChoiceCorrect:!!l.options[s.choice]?.correct,choice:s.choice,firstChoice:s.firstChoice,choiceHistory:s.choiceHistory,choiceMs:s.choiceTime, phaseMs:phases,seconds:Math.round((timestamp-s.startedAt)/1000),hints:s.hints,vocabLookups:s.wordLookups,answer:s.answer.slice(0,4000),entryMode:s.entryMode,audioId:s.recordingId,hasAudio:s.hasAudio,modelSeen:s.modelSeen,feedbackSeen:s.feedbackSeen,coverage,independent:trulyIndependent,revisionOf:s.revisionOf};
  data.attempts.unshift(result);data.attempts=data.attempts.slice(0,500);addReview(l,result);
  if(!persist()){$('#saveMessage').innerHTML='<p class="warning">Could not save to this device. Please use the export tool from Parent progress to back up work.</p>';return}
  s.attemptSaved=true;s.finishedId=result.id;
  $('#saveMessage').innerHTML=`<div class="success"><strong>✓ Saved on this device.</strong><p>${trulyIndependent?'You explained it without hints or a model.': 'Your attempt is saved. Using hints is part of learning.'} We'll revisit this skill ${dateLabel(data.review[l.id].nextDue)}.</p><div class="answer-actions"><button class="btn secondary" id="retryLesson" type="button">Retry this lesson</button><button class="btn primary" id="chooseNext" type="button">Choose another lesson →</button></div></div>`;
  $('#retryLesson').onclick=()=>openLesson(l.id,{review:true});
  $('#chooseNext').onclick=()=>backToLessons();
  try{learningSDK?.record({concept:`english:${l.concept}`,correct:trulyIndependent,hints:s.hints,durationMs:timestamp-s.startedAt,mode:'explain',context:{lessonId:l.id,medium:s.entryMode}})}catch(error){console.warn('Shared Learning SDK write unavailable',error)}
  renderLessons();
}
function backToLessons(){
  if(liveRecognition||recorder?.state==='recording'){stopRecognition();stopRecording(true)}
  session=null;$('#workshop').classList.add('hidden');$('#lessonList').classList.remove('hidden');renderLessons();window.scrollTo({top:0,behavior:'smooth'});
}
function showWord(word,button){
  const key=word.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g,'');
  const def=GLOSSARY[key];
  wordReturnFocus=button||document.activeElement;
  $('#wordTitle').textContent=word;
  $('#wordPart').textContent=def?.[0]||'Word not yet in the built-in glossary';
  $('#wordDefinition').textContent=def?.[1]||`This word isn't included in the offline glossary yet. You can use your device's Look Up option, or open the dictionary linked below.`;
  $('#wordExample').textContent=def?.[2]||'Tap the dictionary link to read the definition and examples.';
  $('#wordExample').classList.toggle('hidden',!def?.[2]);
  $('#wordDictionary').href='https://dictionary.cambridge.org/dictionary/english/'+encodeURIComponent(key);
  $('#wordOverlay').classList.remove('hidden');$('#closeWord').focus();
  if(session){session.wordLookups++;data.wordLookups[key]=(data.wordLookups[key]||0)+1;persist()}
}
function hideWord(){$('#wordOverlay').classList.add('hidden');wordReturnFocus?.focus?.()}
function renderReview(){
  const dueLessons=LESSONS.filter(l=>data.review[l.id]&&due(l.id));
  const upcoming=LESSONS.filter(l=>data.review[l.id]&&!due(l.id)).sort((a,b)=>data.review[a.id].nextDue-data.review[b.id].nextDue);
  const row=l=>`<div class="review-row"><div><h3>${esc(l.title)}</h3><p>${due(l.id)?'Ready now':'Next review '+dateLabel(data.review[l.id].nextDue)} · ${data.review[l.id].streak} independent in a row</p></div><button type="button" class="btn ${due(l.id)?'primary':'secondary'}" data-start-review="${esc(l.id)}">Practise →</button></div>`;
  $('#reviewBody').innerHTML=`<section class="review-panel"><h2>${dueLessons.length} skills ready for review</h2>${dueLessons.length?dueLessons.map(row).join(''):'<p class="quiet">No previous lessons are due. You can still practise any lesson whenever you wish.</p>'}</section><section class="review-panel"><h2>Coming up</h2>${upcoming.length?upcoming.map(row).join(''):'<p class="quiet">Lessons you complete will appear here with spaced practice dates.</p>'}</section><div class="dashboard-actions"><button class="btn secondary" type="button" data-add-next>Export review task for Next</button><button class="btn ghost" type="button" data-export-ics>Export review calendar (.ics)</button></div><p class="subnote">Next integration downloads a task JSON for importing through Next. Browser storage cannot be shared between the two different websites.</p>`;
  $('#reviewCount').textContent=dueCount();
}
function renderParent(){
  const attempts=data.attempts;
  const count=attempts.length,correct=attempts.filter(a=>a.correct).length,indep=attempts.filter(a=>a.independent).length;
  const totalHints=attempts.reduce((n,a)=>n+(a.hints||0),0);
  const avg=count?Math.round(attempts.reduce((n,a)=>n+a.seconds,0)/count):0;
  const transcribed=attempts.filter(a=>a.entryMode==='dictated').length;
  const audio=attempts.filter(a=>a.hasAudio).length;
  const phases=['Understanding words','Choosing an answer','Building sentences','Speaking / writing'];
  const phaseStats=phases.map((_,i)=>count?Math.round(attempts.reduce((n,a)=>n+(a.phaseMs?.[i]||0),0)/count/1000):0);
  const maxPhase=Math.max(1,...phaseStats);
  const problemRates=[
    ['Vocabulary help',attempts.filter(a=>a.vocabLookups>0).length],
    ['Multiple choice incorrect',attempts.filter(a=>!a.correct).length],
    ['Needed hints',attempts.filter(a=>a.hints>0).length],
    ['Needed model answer',attempts.filter(a=>a.modelSeen).length],
    ['Explanation missing ideas*',attempts.filter(a=>a.coverage.length&&a.coverage.filter(Boolean).length<2).length]
  ];
  const weak=problemRates.filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);
  $('#parentBody').innerHTML=`<div class="stats-grid"><div class="stat"><strong>${count}</strong><small>Total attempts</small></div><div class="stat"><strong>${count?Math.round(correct/count*100):0}%</strong><small>Multiple-choice accuracy</small></div><div class="stat"><strong>${count?Math.round(indep/count*100):0}%</strong><small>Independent explanations*</small></div><div class="stat"><strong>${avg}s</strong><small>Average time per attempt</small></div></div>
  <section class="dashboard-panel"><h3>Where time is spent</h3><p class="subnote">Time in each stage shows time spent, not necessarily confusion. A longer duration may mean careful thought.</p>${phases.map((n,i)=>`<div class="metric-row"><span>${n}</span><div class="meter"><i style="width:${Math.round(phaseStats[i]/maxPhase*100)}%"></i></div><span>${phaseStats[i]}s</span></div>`).join('')}</section>
  <section class="dashboard-panel"><h3>What support was needed?</h3>${problemRates.map(([label,n])=>`<div class="metric-row"><span>${esc(label)}</span><div class="meter"><i style="width:${count?Math.round(n/count*100):0}%"></i></div><span>${n}</span></div>`).join('')}<p class="subnote">*An automated keyword check is only an approximate prompt, not a teacher's mark. Independence means an accurate choice, at least two keyword groups detected, and no hints, model or copied scaffold.</p></section>
  <section class="dashboard-panel"><h3>Suggested next teaching step</h3><p>${!count?'Start with the first beginner lesson: a single word, its meaning and its effect.':weak.length?`Focus on <strong>${esc(weak[0][0].toLowerCase())}</strong>. Work through a short example aloud, reveal the explanation, then ask Sai to try a different sentence without copying.`:'Continue practising without hints and use a short handwritten answer after each spoken explanation.'}</p><p class="subnote">Dictated answers: ${transcribed}. Audio-only recordings: ${audio}. Total hints shown: ${totalHints}. These counts are descriptive, not clinical assessments.</p></section>
  <section class="dashboard-panel"><h3>Recent attempts and revisions</h3><div class="table-scroll"><table class="history-table"><thead><tr><th>When</th><th>Lesson</th><th>Choice</th><th>Answer mode</th><th>Help</th><th>Time</th><th>Details</th></tr></thead><tbody>${attempts.slice(0,60).map(a=>`<tr><td>${esc(dateLabel(a.timestamp))}</td><td>${esc(LESSON_BY_ID[a.lessonId]?.title||a.lessonId)}${a.revisionOf?' <small>(retry)</small>':''}</td><td>${a.correct?'✓':'×'}</td><td>${esc(a.entryMode)}</td><td>${a.hints||0} hints; ${a.vocabLookups||0} words</td><td>${a.seconds}s</td><td><button type="button" class="quiet-link" data-attempt="${esc(a.id)}">Inspect</button></td></tr>`).join('')||'<tr><td colspan="7">Nothing saved yet.</td></tr>'}</tbody></table></div><div id="attemptDetail" class="model hidden" aria-live="polite"></div></section>
  <section class="dashboard-panel"><h3>Use progress elsewhere</h3><p class="explain">Answers and metadata stay in this device's browser storage. Audio is saved separately in IndexedDB. Export text for a backup; save individual recordings from the audio player.</p><div class="dashboard-actions"><button type="button" class="btn primary" data-export-json>Export all text progress (.json)</button><button type="button" class="btn secondary" data-export-csv>Export attempt table (.csv)</button><button type="button" class="btn secondary" data-export-ics>Export review dates (.ics)</button><button type="button" class="btn secondary" data-add-next>Export task for Next</button><button type="button" class="btn ghost" data-clear-data>Reset Comprehension lessons</button></div><p id="parentStatus" class="subnote" role="status">Shared Learning SDK: ${learningSDK?'local learning events recorded':'not connected; Comprehension progress still saved locally'}. Signed-in cloud sync has not been enabled for this pathway.</p></section>`;
}
async function showAttempt(attemptId){
  const a=data.attempts.find(x=>x.id===attemptId);if(!a)return;
  const l=LESSON_BY_ID[a.lessonId];
  const el=$('#attemptDetail');el.classList.remove('hidden');
  el.replaceChildren();
  const title=document.createElement('h4');title.textContent=(l?.title||a.lessonId)+' · '+dateLabel(a.timestamp);el.append(title);
  const content=document.createElement('p');content.textContent='Sai\'s answer: '+(a.answer||'(audio only: no transcript saved)');el.append(content);
  const stats=document.createElement('p');stats.textContent=`Answer mode: ${a.entryMode}; hints: ${a.hints}; words looked up: ${a.vocabLookups}; time: ${a.seconds}s; independently completed: ${a.independent?'yes':'not yet'}; initial choice correct: ${a.correct?'yes':'no'}; choices tried: ${(a.choiceHistory||[]).length}.`;el.append(stats);
  const m=document.createElement('p');m.textContent='Model: '+(l?.model||'');el.append(m);
  if(a.audioId){
    const blob=await audioGet(a.audioId);if(blob){
      const player=document.createElement('audio');player.controls=true;player.src=URL.createObjectURL(blob);el.append(player);
      const link=document.createElement('a');link.className='quiet-link';link.download=`comprehension-${a.lessonId}-${a.audioId}.${blob.type.includes('mp4')?'m4a':'webm'}`;link.href=player.src;link.textContent='Download this recording';el.append(document.createElement('p'),link);
    }
  }
  el.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function downloadFile(name,content,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000)}
function exportProgress(){downloadFile('comprehension-sai-progress.json',JSON.stringify({schema:2,exportedAt:new Date().toISOString(),...data},null,2),'application/json')}
function exportCSV(){
 const headings=['timestamp','lesson','level','correct','independent','answer mode','hints','vocabulary lookups','seconds','answer','audio ID'];
 const rows=data.attempts.map(a=>[new Date(a.timestamp).toISOString(),a.lessonId,a.level,a.correct,a.independent,a.entryMode,a.hints,a.vocabLookups,a.seconds,a.answer,a.audioId]);
 const csv=[headings,...rows].map(row=>row.map(v=>'"'+clean(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
 downloadFile('comprehension-sai-attempts.csv',csv,'text/csv;charset=utf-8');
}
function exportICS(){
 const dates=Object.entries(data.review).filter(([k,v])=>LESSON_BY_ID[k]&&v.nextDue).map(([k,v])=>({lesson:LESSON_BY_ID[k],date:new Date(v.nextDue).toISOString().slice(0,10).replaceAll('-','')}));
 if(!dates.length){alert('Complete a lesson first to create review dates.');return}
 const entries=dates.map(({lesson,date})=>`BEGIN:VEVENT\r\nUID:comprehension-${lesson.id}@learning.local\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}\r\nDTSTART;VALUE=DATE:${date}\r\nSUMMARY:Review English - ${lesson.title.replace(/[;,\\]/g,' ')}\r\nDESCRIPTION:Practise at https://nirav2000.github.io/Comprehension/explain.html\r\nEND:VEVENT`);
 downloadFile('comprehension-review-dates.ics',['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Comprehension Coach//Learning Review//EN',...entries,'END:VCALENDAR'].join('\r\n'),'text/calendar');
}
function addToNext(){
  const ordered=Object.entries(data.review).filter(([key,value])=>LESSON_BY_ID[key]&&value.nextDue).sort((a,b)=>a[1].nextDue-b[1].nextDue);
  if(!ordered.length){alert('Complete a Comprehension lesson first to create a review task.');return}
  const [lessonId,review]=ordered[0],l=LESSON_BY_ID[lessonId];
  const task={id:'comprehension-review-'+lessonId,title:'Comprehension review: '+l.title,subject:'English',summary:'Revisit '+l.concept+' with definitions and a spoken answer.',createdAt:new Date().toISOString(),expectedDate:new Date(review.nextDue).toISOString().slice(0,10),estimatedMinutes:l.minutes,status:'ready',progress:0,lastOpened:null,completedAt:null,contentHtml:'<h2>Comprehension review</h2><p>Open <a href="https://nirav2000.github.io/Comprehension/explain.html?lesson='+encodeURIComponent(lessonId)+'">the interactive practice lesson</a>.</p>',cards:[],reviews:{},history:[]};
  downloadFile('comprehension-next-task.json',JSON.stringify(task,null,2),'application/json');
  const status=$('#parentStatus');
  if(status)status.textContent='Downloaded a Next-compatible lesson/task JSON. Import it in Next using its Add/Import workflow. Browser data cannot be written directly across these separate sites.';
}

function clearProgress(){
 if(!confirm('Delete the lesson attempts, answers and progress saved on this device? Recorded audio will also be deleted. This cannot be undone.'))return;
 data=emptyData();persist();audioClear();renderLessons();renderParent();renderReview();
}
function getAudioDatabase(){
  if(!('indexedDB' in window))return Promise.reject(Error('Audio storage is unavailable in this browser'));
  if(audioDb)return Promise.resolve(audioDb);
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open('comprehension-coach-audio-v1',1);
    req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('recordings'))req.result.createObjectStore('recordings')};
    req.onsuccess=()=>{audioDb=req.result;resolve(audioDb)};
    req.onerror=()=>reject(req.error);
  });
}
async function audioPut(key,blob){const db=await getAudioDatabase();return new Promise((resolve,reject)=>{const tx=db.transaction('recordings','readwrite');tx.objectStore('recordings').put(blob,key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
async function audioGet(key){try{const db=await getAudioDatabase();return await new Promise((resolve,reject)=>{const req=db.transaction('recordings').objectStore('recordings').get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}catch{return null}}
async function audioClear(){try{const db=await getAudioDatabase();const tx=db.transaction('recordings','readwrite');tx.objectStore('recordings').clear()}catch{}}
function mediaStatus(text){const target=$('#micStatus');if(target)target.textContent=text}
function clearAudioUrl(){if(audioObjectUrl){URL.revokeObjectURL(audioObjectUrl);audioObjectUrl=null}}
function showAudioPreview(blob){const el=$('#audioPlayback');if(!el||!blob)return;clearAudioUrl();audioObjectUrl=URL.createObjectURL(blob);el.replaceChildren();const player=document.createElement('audio');player.controls=true;player.src=audioObjectUrl;el.append(player);const p=document.createElement('p');const a=document.createElement('a');a.href=audioObjectUrl;a.download=`sai-explanation.${blob.type.includes('mp4')?'m4a':blob.type.includes('webm')?'webm':'audio'}`;a.className='quiet-link';a.textContent='Download audio file';p.append(a);el.append(p)}
async function loadAudioPreview(key){const blob=await audioGet(key);if(blob&&session?.recordingId===key)showAudioPreview(blob)}
async function startRecording(){
 if(!session||recorder?.state==='recording')return;
 stopRecognition();
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){mediaStatus('Recording not supported. Try Safari/Chrome over HTTPS, or use iPad keyboard dictation.');return}
 try{
  micStream=await navigator.mediaDevices.getUserMedia({audio:true});
  const types=['audio/mp4','audio/webm;codecs=opus','audio/webm'];const mimeType=types.find(t=>MediaRecorder.isTypeSupported(t));
  recorder=new MediaRecorder(micStream,mimeType?{mimeType}:undefined);
  recordChunks=[];
  recorder.ondataavailable=e=>{if(e.data?.size)recordChunks.push(e.data)};
  recorder.onerror=()=>mediaStatus('Recording failed. Check microphone permissions, then try again.');
  recorder.onstop=async()=>{
   clearTimeout(recordTimeout);micStream?.getTracks().forEach(t=>t.stop());micStream=null;
   const blob=new Blob(recordChunks,{type:recorder.mimeType||'audio/webm'});
   const btn=$('#recordBtn'),stop=$('#stopAudioBtn');btn?.classList.remove('hidden');stop?.classList.add('hidden');
   if(!session||!blob.size){mediaStatus('Recording was empty. You can try again.');return}
   const key=id();
   try{await audioPut(key,blob);session.recordingId=key;session.hasAudio=true;session.audioBlob=blob;showAudioPreview(blob);mediaStatus('Audio saved on this device. Transcript was added if browser speech recognition worked; check the text for mistakes.');}
   catch{session.recordingId=null;session.hasAudio=true;session.audioBlob=blob;showAudioPreview(blob);mediaStatus('Recording available for playback, but saving failed. Download it now if you want to keep it.')}
  };
  recorder.start();
  startRecognition();
  $('#recordBtn').classList.add('hidden');$('#stopAudioBtn').classList.remove('hidden');
  mediaStatus('● Recording now. Speak clearly and tap Stop. Maximum 90 seconds.');
  recordTimeout=setTimeout(()=>stopRecording(false),MAX_AUDIO_SECONDS*1000);
 }catch(e){micStream?.getTracks().forEach(t=>t.stop());micStream=null;mediaStatus('Could not use the microphone ('+(e.name||'permission denied')+'). You can still type or use keyboard dictation.')}
}
function stopRecording(discard){
 stopRecognition();
 clearTimeout(recordTimeout);
 if(recorder?.state==='recording'){
  if(discard){recorder.onstop=()=>{micStream?.getTracks().forEach(t=>t.stop());micStream=null};}
  recorder.stop();
 }
 micStream?.getTracks().forEach(t=>t.stop());micStream=null;
}
function startRecognition(){
 if(!session)return;
 if(liveRecognition){stopRecognition();return}
 const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Speech){mediaStatus('Recording audio. Automatic transcription unsupported here; use keyboard dictation afterwards if needed.');return}
 const r=new Speech();r.lang='en-GB';r.interimResults=true;r.continuous=false;
 liveRecognition=r;const before=($('#answerArea').value||'').trim();let final='';
 r.onresult=e=>{
  let interim='';
  for(let i=e.resultIndex;i<e.results.length;i++){const part=e.results[i][0]?.transcript||'';if(e.results[i].isFinal)final+=part+' ';else interim+=part}
  const area=$('#answerArea');if(area){area.value=[before,final.trim()].filter(Boolean).join(' ').trim();session.answer=area.value;session.entryMode='dictated'}
  $('#transcriptPreview').textContent=interim?'Listening: '+interim:'Text added. Read it and correct any mistakes.';
 };
 r.onerror=e=>mediaStatus('Audio recording continues. Speech-to-text unavailable ('+e.error+').');
 r.onend=()=>{if(liveRecognition===r)liveRecognition=null;if(recorder?.state!=='recording')mediaStatus('Dictation finished. Check the text for mistakes.');};
 try{r.start();mediaStatus('Listening for your explanation. Speech recognition may use your browser’s online speech service.');}
 catch(e){liveRecognition=null;$('#dictateBtn').textContent='🎤 Dictate to text';mediaStatus('Dictation could not start. Use keyboard dictation or type instead.')}
}
function stopRecognition(){if(liveRecognition){try{liveRecognition.stop()}catch{}liveRecognition=null;}}
async function startLearningSDK(){
 try{const mod=await import('https://nirav2000.github.io/Apps/learning/v1/index.js');learningSDK=mod.createLearningStore({appId:'comprehension',learnerId:'sai'});}catch(e){console.info('Shared learning SDK unavailable; lesson progress remains local',e)}
}

// Delegated controls keep working after every stage re-render.
document.addEventListener('click',e=>{
 const word=e.target.closest('[data-word]');if(word){showWord(word.dataset.word,word);return}
 const card=e.target.closest('[data-lesson]');if(card){openLesson(card.dataset.lesson);return}
 const opt=e.target.closest('[data-option]');if(opt&&session){session.choice=Number(opt.dataset.option);if(session.firstChoice===null){session.firstChoice=session.choice;session.firstChoiceCorrect=!!currentLesson().options[session.choice]?.correct;session.choiceTime=Date.now()-session.stageStartedAt;}session.choiceHistory.push(session.choice);renderChoose(currentLesson(),session);return}
 const review=e.target.closest('[data-start-review]');if(review){openLesson(review.dataset.startReview,{review:true});return}
 const inspect=e.target.closest('[data-attempt]');if(inspect){showAttempt(inspect.dataset.attempt);return}
 if(e.target.closest('[data-hint]')){giveHint();return}
 if(e.target.closest('[data-export-json]')){exportProgress();return}
 if(e.target.closest('[data-export-csv]')){exportCSV();return}
 if(e.target.closest('[data-export-ics]')){exportICS();return}
 if(e.target.closest('[data-add-next]')){addToNext();return}
 if(e.target.closest('[data-clear-data]')){clearProgress();return}
});
$$('.nav-btn').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
$$('.step').forEach(b=>b.addEventListener('click',()=>changeStage(Number(b.dataset.stage))));
$('#nextStage').onclick=()=>session?.stage===4?persistAttempt():changeStage(session.stage+1);
$('#previousStage').onclick=()=>changeStage(session.stage-1);
$('#backToLessons').onclick=backToLessons;
$('#levelFilter').onchange=renderLessons;
$('#lessonBody').addEventListener('input',e=>{if(e.target.matches('[data-build]')&&session)session.build[Number(e.target.dataset.build)]=e.target.value});
$('#lessonBody').addEventListener('click',e=>{
 if(e.target.id==='showParts'){session.modelSeen=!session.modelSeen;$('#partsModel').classList.toggle('hidden',!session.modelSeen);e.target.textContent=session.modelSeen?'Hide worked example':'Show worked example'}
 if(e.target.id==='fillParts'){session.build=[...currentLesson().sentence];session.hints++;session.modelSeen=true;renderBuild(currentLesson(),session)}
 if(e.target.id==='retryAnswer'){const box=$('#answerArea');box.focus();box.setSelectionRange(box.value.length,box.value.length)}
});
function handleWordClose(e){if(e.target===$('#wordOverlay'))hideWord()}
$('#wordOverlay').addEventListener('click',handleWordClose);
$('#closeWord').onclick=hideWord;$('#wordDone').onclick=hideWord;
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#wordOverlay').classList.contains('hidden'))hideWord()});
window.addEventListener('pagehide',()=>{stopRecognition();stopRecording(true);clearAudioUrl()});
renderLessons();startLearningSDK();
const params=new URLSearchParams(location.search);
const deepLink=params.get('lesson');if(deepLink&&LESSON_BY_ID[deepLink])openLesson(deepLink);