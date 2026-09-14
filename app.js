const questions = [
  {
    id:'lang1', skill:'language', difficulty:1, skillLabel:'Language analysis',
    passage:'Tom pushed open the classroom door. Every head turned towards him. He stopped for a moment, gripping the strap of his bag. The teacher smiled, but Tom stared at the floor and walked quickly to the empty desk at the back.',
    question:'How does the writer suggest that Tom feels uncomfortable when he enters the classroom?',
    action:'explain how words suggest', target:'Tom’s feelings of discomfort',
    actionOptions:['explain how words suggest','find three facts','judge and give evidence','continue the story'],
    targetOptions:['Tom’s feelings of discomfort','what the teacher looks like','the size of the classroom','why the lesson is difficult'],
    evidence:[
      ['“Every head turned towards him.”',true],['“He stopped for a moment.”',true],['“gripping the strap of his bag”',true],['“The teacher smiled”',false],['“empty desk at the back”',false]
    ],
    scaffoldLabels:['Clue','What it suggests','Overall feeling'],
    scaffold:['everyone looks at Tom','he freezes, grips his bag and avoids eye contact','he feels nervous and self-conscious'],
    model:'The writer suggests that Tom feels uncomfortable because he “stopped for a moment” when everyone looked at him. He also grips his bag and stares at the floor, which suggests that he feels nervous and does not want attention.'
  },
  {
    id:'inf1', skill:'inference', difficulty:1, skillLabel:'Inference',
    passage:'Maya checked the clock for the fourth time. Her packed bag stood by the front door. When a car slowed outside, she sprang up from the sofa, but it drove on.',
    question:'What do you think Maya is waiting for? Give evidence from the passage.',
    action:'infer and give evidence', target:'what Maya is waiting for',
    actionOptions:['infer and give evidence','describe the setting','choose a phrase and explain it','compare two characters'],
    targetOptions:['what Maya is waiting for','why the car is old','what is inside her bag','the time of day'],
    evidence:[['“checked the clock for the fourth time”',true],['“packed bag stood by the front door”',true],['“she sprang up” when a car slowed',true],['“sofa”',false],['“it drove on”',true]],
    scaffoldLabels:['Clue 1','Clue 2','Conclusion'],
    scaffold:['repeatedly checks time','bag ready + reacts to a car','she is probably waiting to be collected for a journey or event'],
    model:'Maya is probably waiting for someone to collect her. Her bag is already packed by the door, and she repeatedly checks the time and jumps up when a car slows outside.'
  },
  {
    id:'judge1', skill:'judgement', difficulty:2, skillLabel:'Judgement',
    passage:'Mr Vale never raised his voice. When pupils whispered, he stopped speaking and waited until the room was silent. He returned homework the next day with careful comments in the margins, but he rarely praised anyone aloud.',
    question:'Do you think Mr Vale would be a good teacher? Give reasons for your answer, using details from the passage.',
    action:'judge and give evidence', target:'whether Mr Vale would be a good teacher',
    actionOptions:['judge and give evidence','explain a simile','retrieve one fact','predict the ending'],
    targetOptions:['whether Mr Vale would be a good teacher','why the pupils whisper','what subject he teaches','what his handwriting looks like'],
    evidence:[['“never raised his voice”',true],['“waited until the room was silent”',true],['“careful comments in the margins”',true],['“rarely praised anyone aloud”',true],['“returned homework the next day”',true]],
    scaffoldLabels:['Positive evidence','Negative evidence','Judgement'],
    scaffold:['calm, patient, gives careful feedback','rarely praises pupils aloud','probably effective, though not especially encouraging'],
    model:'Mr Vale would probably be an effective teacher because he remains calm and gives pupils careful written feedback. However, because he “rarely praised anyone aloud”, some pupils might find him rather discouraging. Overall, he seems good at teaching but less strong at encouragement.'
  },
  {
    id:'retr1', skill:'retrieval', difficulty:1, skillLabel:'Retrieval / comparison',
    passage:'The classroom was heated by a coal stove. Each pupil wrote with a dip pen, and forty-eight children sat on long wooden benches. At the front stood a slate board covered in chalk.',
    question:'Give three ways in which this classroom is different from a modern classroom.',
    action:'find and compare', target:'three differences between this classroom and a modern one',
    actionOptions:['find and compare','infer a feeling','analyse one word','judge a character'],
    targetOptions:['three differences between this classroom and a modern one','why the pupils are unhappy','how old the teacher is','the writer’s opinion of chalk'],
    evidence:[['coal stove',true],['dip pens',true],['forty-eight children',true],['long wooden benches',true],['slate board',true]],
    scaffoldLabels:['Difference 1','Difference 2','Difference 3'],
    scaffold:['coal stove → modern heating','dip pens → modern pens/devices','48 pupils on benches → smaller classes and individual desks'],
    model:'The room is heated by a coal stove rather than modern central heating. Pupils use dip pens instead of modern pens or devices, and forty-eight children share long benches, whereas modern classes are usually smaller and use individual desks.'
  },
  {
    id:'lang2', skill:'language', difficulty:2, skillLabel:'Language analysis',
    passage:'The old house crouched beneath the trees. Its windows were blind black squares, and the narrow path twisted towards the door like a warning finger.',
    question:'How does the writer make the house seem threatening?',
    action:'explain how words create an effect', target:'the threatening impression of the house',
    actionOptions:['explain how words create an effect','list what happens','judge the narrator','find a synonym'],
    targetOptions:['the threatening impression of the house','the age of the trees','the shape of the path','whether the door is locked'],
    evidence:[['“crouched”',true],['“blind black squares”',true],['“like a warning finger”',true],['“old house”',false],['“beneath the trees”',false]],
    scaffoldLabels:['Quotation','Word / image','Effect'],
    scaffold:['“crouched”','makes the house seem like an animal waiting to spring','creates a watchful, menacing atmosphere'],
    model:'The verb “crouched” makes the house seem like an animal waiting to spring, so it appears watchful and dangerous. The path is also compared to “a warning finger”, making the approach to the house feel like a threat.'
  },
  {
    id:'inf2', skill:'inference', difficulty:2, skillLabel:'Inference',
    passage:'Ella placed the cracked cup at the very back of the cupboard. When her father entered the kitchen, she began talking quickly about school and stood directly in front of the cupboard door.',
    question:'What can you infer about Ella? Explain your answer.',
    action:'infer and explain', target:'Ella’s behaviour and likely motive',
    actionOptions:['infer and explain','summarise the whole passage','compare settings','identify punctuation'],
    targetOptions:['Ella’s behaviour and likely motive','her father’s job','the value of the cup','what happened at school'],
    evidence:[['puts cracked cup at the back',true],['talks quickly when father arrives',true],['stands in front of cupboard',true],['father enters kitchen',false]],
    scaffoldLabels:['Clue','Meaning','Conclusion'],
    scaffold:['hides damaged cup + blocks cupboard','she does not want her father to see it','she probably broke it and is trying to conceal what happened'],
    model:'Ella is probably trying to hide the fact that she broke the cup. She puts it at the back of the cupboard and then stands in front of the door, while talking quickly to distract her father.'
  },
  {
    id:'judge2', skill:'judgement', difficulty:3, skillLabel:'Judgement',
    passage:'Mrs Pell inspected every exercise book herself and expected corrections to be completed before lunch. She could be sharply critical of careless work, yet when Noor struggled with fractions she stayed behind for twenty minutes, drawing diagrams until he understood.',
    question:'Is Mrs Pell presented as a harsh teacher, a caring teacher, or both? Use evidence from the passage.',
    action:'weigh evidence and judge', target:'how Mrs Pell is presented as a teacher',
    actionOptions:['weigh evidence and judge','retrieve a number','analyse the setting','predict what Noor does next'],
    targetOptions:['how Mrs Pell is presented as a teacher','whether Noor likes fractions','how long lunch lasts','the appearance of the classroom'],
    evidence:[['“expected corrections” before lunch',true],['“sharply critical”',true],['“stayed behind for twenty minutes”',true],['“drawing diagrams until he understood”',true]],
    scaffoldLabels:['Harsh side','Caring side','Balanced judgement'],
    scaffold:['strict standards + sharp criticism','gives extra time and patient explanations','demanding but genuinely committed to pupils learning'],
    model:'Mrs Pell is presented as both harsh and caring. She is strict because she expects corrections quickly and is “sharply critical” of careless work. However, she stays behind to help Noor until he understands, showing that her strictness is matched by real commitment to her pupils.'
  },
  {
    id:'creative1', skill:'creative', difficulty:2, skillLabel:'Creative continuation',
    passage:'When Miss Arden entered the hall for her first assembly, the microphone squealed and every pupil turned towards her. She gripped her notes, smiled too quickly, and began with the wrong page.',
    question:'Imagine you are one of the pupils. Describe what happened next and how Miss Arden behaved.',
    action:'continue consistently from a viewpoint', target:'what happens next and how Miss Arden behaves',
    actionOptions:['continue consistently from a viewpoint','judge the headteacher','find three facts','explain one metaphor'],
    targetOptions:['what happens next and how Miss Arden behaves','the history of the hall','why microphones squeal','what the pupils study'],
    evidence:[['first assembly',true],['microphone squealed',true],['gripped her notes',true],['smiled too quickly',true],['began with the wrong page',true]],
    scaffoldLabels:['Start','Problem','Turning point','Ending'],
    scaffold:['Miss Arden is nervous','pupils notice and somebody laughs','she pauses, finds the right page and calmly continues','the room settles and narrator’s opinion improves'],
    model:'At first, Miss Arden looked as though she might stop altogether. A few pupils began to laugh, but she lowered her notes and waited. “I think,” she said, “we can all agree that was not the beginning I planned.” The laughter changed. This time it was with her, not at her. She found the correct page and continued more slowly, and by the end of the assembly her hands had stopped shaking.'
  },
  {
    id:'lang3', skill:'language', difficulty:3, skillLabel:'Language analysis',
    passage:'The corridor swallowed the last of the daylight. Beyond the glass doors, rain needled the empty playground, while the clock above reception clicked with maddening patience.',
    question:'How does the writer create a feeling of unease in this description?',
    action:'explain how language creates an atmosphere', target:'the feeling of unease',
    actionOptions:['explain how language creates an atmosphere','find the main event','compare two people','give your personal opinion'],
    targetOptions:['the feeling of unease','the exact weather forecast','the age of the clock','why reception is empty'],
    evidence:[['“corridor swallowed the last of the daylight”',true],['“rain needled”',true],['“empty playground”',true],['“maddening patience”',true],['“glass doors”',false]],
    scaffoldLabels:['Quotation','Technique / image','Effect on atmosphere'],
    scaffold:['“swallowed” the daylight','personifies darkness as something consuming light','makes the corridor feel hostile and enclosing'],
    model:'The corridor is personified as something that “swallowed” the daylight, making the darkness seem active and threatening. The rain “needled” the playground, suggesting sharp, unpleasant movement, while the clock’s “maddening patience” makes time itself seem oppressive. Together these details create an uneasy, trapped atmosphere.'
  }
];

const patterns = [
  ['Language','quotation → important word/image → effect → feeling/impression'],
  ['Inference','clue 1 + clue 2 → sensible conclusion'],
  ['Judgement','positive evidence → negative evidence → weigh both → final judgement'],
  ['Retrieval / comparison','text fact → modern contrast → repeat x3'],
  ['Creative','character at start → problem → reaction → turning point → change at end']
];

let current = null, startedAt = Date.now();
let selectedAction = '', selectedTarget = '';
let state = JSON.parse(localStorage.getItem('comprehensionProgress') || '{"attempts":[],"decodeCorrect":0,"decodeTotal":0,"mastered":0}');

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function save(){ localStorage.setItem('comprehensionProgress', JSON.stringify(state)); renderProgress(); renderHeader(); }
function renderHeader(){
  $('#streakLabel').textContent = `${state.mastered || 0} mastered`;
  $('#accuracyLabel').textContent = state.decodeTotal ? `${Math.round(state.decodeCorrect/state.decodeTotal*100)}%` : '—';
}
function pickQuestion(){
  const skill=$('#skillSelect').value, diff=$('#difficultySelect').value;
  let pool=questions.filter(q=>(skill==='all'||q.skill===skill)&&(diff==='all'||String(q.difficulty)===diff));
  if(!pool.length) pool=questions;
  const alternatives=pool.filter(q=>!current||q.id!==current.id);
  current=(alternatives.length?alternatives:pool)[Math.floor(Math.random()*(alternatives.length?alternatives:pool).length)];
  startedAt=Date.now(); selectedAction=''; selectedTarget='';
  renderQuestion();
}
function renderQuestion(){
  $('#skillBadge').textContent=current.skillLabel;
  $('#difficultyBadge').textContent=['','Starter','11+','Selective'][current.difficulty];
  $('#passage').textContent=current.passage; $('#question').textContent=current.question;
  renderChoices('#actionChoices',current.actionOptions,'action'); renderChoices('#targetChoices',current.targetOptions,'target');
  $('#evidenceChoices').innerHTML=current.evidence.map((e,i)=>`<label class="evidence-option"><input type="checkbox" data-i="${i}"><span>${e[0]}</span></label>`).join('');
  $('#scaffoldTemplate').innerHTML=current.scaffoldLabels.map((x,i)=>`<div class="scaffold-row"><strong>${x.toUpperCase()}</strong><textarea rows="2" placeholder="Write a short note…"></textarea></div>`).join('');
  $('#scaffoldReveal').innerHTML=`<strong>Strong scaffold</strong><div class="arrow-chain">${current.scaffold.join(' → ')}</div>`;
  $('#modelAnswer').innerHTML=`<strong>Model answer</strong><p>${current.model}</p>`;
  $('#selfMark').innerHTML=`<strong>Self-mark</strong>${['I answered the exact question.','I used evidence from the passage.','I explained what the evidence shows.','I kept my answer concise and clear.'].map(x=>`<label><input type="checkbox"> ${x}</label>`).join('')}`;
  ['#decodeFeedback','#evidenceFeedback','#scaffoldReveal','#modelAnswer','#selfMark'].forEach(x=>$(x).classList.add('hidden'));
  $('#collectStage').classList.add('locked'); $('#scaffoldStage').classList.add('locked'); $('#writeStage').classList.add('locked');
  $('#answerBox').value=''; $$('.choice').forEach(x=>x.classList.remove('selected','correct','wrong'));
}
function renderChoices(sel,arr,type){
  $(sel).innerHTML=arr.map(x=>`<button class="choice" data-type="${type}" data-value="${x.replace(/"/g,'&quot;')}">${x}</button>`).join('');
}
function checkDecode(){
  if(!selectedAction||!selectedTarget){showFeedback('#decodeFeedback',false,'Choose both an ACTION and a TARGET first.');return;}
  const a=selectedAction===current.action,t=selectedTarget===current.target,ok=a&&t;
  state.decodeTotal++; if(ok) state.decodeCorrect++;
  $$('.choice[data-type="action"]').forEach(b=>b.classList.add(b.dataset.value===current.action?'correct':(b.classList.contains('selected')?'wrong':'')));
  $$('.choice[data-type="target"]').forEach(b=>b.classList.add(b.dataset.value===current.target?'correct':(b.classList.contains('selected')?'wrong':'')));
  showFeedback('#decodeFeedback',ok,ok?`Exactly. ACTION: ${current.action}. TARGET: ${current.target}.`:`Not quite. ACTION = ${current.action}. TARGET = ${current.target}. Read the command words and the thing they point at.`);
  if(ok) $('#collectStage').classList.remove('locked'); save();
}
function checkEvidence(){
  const chosen=$$('#evidenceChoices input').map((x,i)=>[i,x.checked]);
  let correct=0,totalTrue=current.evidence.filter(x=>x[1]).length, wrong=0;
  chosen.forEach(([i,on])=>{if(on&&current.evidence[i][1])correct++; if(on&&!current.evidence[i][1])wrong++;});
  const ok=correct===totalTrue&&wrong===0;
  showFeedback('#evidenceFeedback',ok,ok?'Good. Every selected clue directly helps answer the question.':`You found ${correct} useful clue${correct===1?'':'s'}. Recheck whether each chosen detail directly helps the TARGET.`);
  if(correct>=Math.max(1,totalTrue-1)&&wrong===0){ $('#scaffoldStage').classList.remove('locked'); $('#writeStage').classList.remove('locked'); }
}
function showFeedback(sel,good,msg){const el=$(sel);el.className=`feedback ${good?'good':'bad'}`;el.textContent=msg;}
function finishAttempt(){
  const elapsed=Math.max(1,Math.round((Date.now()-startedAt)/1000));
  if(!state.attempts.some(a=>a.id===current.id&&Date.now()-a.ts<5000)){
    state.attempts.unshift({id:current.id,skill:current.skillLabel,question:current.question,seconds:elapsed,ts:Date.now()}); state.attempts=state.attempts.slice(0,20); state.mastered=(state.mastered||0)+1; save();
  }
}
function renderExamples(){
  $('#examplesList').innerHTML=questions.slice(0,6).map(q=>`<article class="example card"><span class="badge">${q.skillLabel}</span><h3>${q.question}</h3><p><b>ACTION:</b> ${q.action}<br><b>TARGET:</b> ${q.target}</p><div class="arrow-chain">${q.scaffold.join(' → ')}</div><p><b>Model:</b> ${q.model}</p></article>`).join('');
}
function renderPatterns(){ $('#patternCards').innerHTML=patterns.map(([a,b])=>`<article class="pattern card"><h3>${a}</h3><div class="arrow-chain">${b}</div></article>`).join(''); }
function renderProgress(){
  const avg=state.attempts.length?Math.round(state.attempts.reduce((s,a)=>s+a.seconds,0)/state.attempts.length):0;
  $('#progressStats').innerHTML=`<div class="stat"><small>Attempts</small><strong>${state.attempts.length}</strong></div><div class="stat"><small>Decode accuracy</small><strong>${state.decodeTotal?Math.round(state.decodeCorrect/state.decodeTotal*100)+'%':'—'}</strong></div><div class="stat"><small>Avg. time</small><strong>${avg?avg+'s':'—'}</strong></div>`;
  $('#historyList').innerHTML=state.attempts.length?state.attempts.map(a=>`<div class="history-item"><div>${a.skill}<br><small>${a.question}</small></div><strong>${a.seconds}s</strong></div>`).join(''):'<p>No attempts yet. Complete a practice question to start your record.</p>';
}

$$('.tab').forEach(t=>t.onclick=()=>{$$('.tab').forEach(x=>x.classList.toggle('active',x===t));$$('.view').forEach(v=>v.classList.remove('active'));$('#'+t.dataset.view+'View').classList.add('active');});
document.addEventListener('click',e=>{const b=e.target.closest('.choice');if(!b)return;const type=b.dataset.type;$$(`.choice[data-type="${type}"]`).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');if(type==='action')selectedAction=b.dataset.value;else selectedTarget=b.dataset.value;});
$('#checkDecodeBtn').onclick=checkDecode; $('#checkEvidenceBtn').onclick=checkEvidence;
$('#revealScaffoldBtn').onclick=()=>$('#scaffoldReveal').classList.toggle('hidden');
$('#showModelBtn').onclick=()=>{ $('#modelAnswer').classList.remove('hidden'); finishAttempt(); };
$('#selfMarkBtn').onclick=()=>$('#selfMark').classList.toggle('hidden');
$('#newQuestionBtn').onclick=pickQuestion; $('#nextBtn').onclick=()=>{finishAttempt();pickQuestion();window.scrollTo({top:0,behavior:'smooth'});};
$('#skillSelect').onchange=pickQuestion; $('#difficultySelect').onchange=pickQuestion;
$('#resetProgressBtn').onclick=()=>{if(confirm('Reset all local practice progress on this device?')){state={attempts:[],decodeCorrect:0,decodeTotal:0,mastered:0};save();}};
setInterval(()=>{if(current){const s=Math.floor((Date.now()-startedAt)/1000);$('#timer').textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}},1000);
renderExamples(); renderPatterns(); renderProgress(); renderHeader(); pickQuestion();
