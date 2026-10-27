import {LESSONS} from './explain-data.js';
const $=s=>document.querySelector(s);
const lessons=LESSONS.filter(l=>l.sentence?.length&&l.options?.length).slice(0,15);
let index=0, choice=-1, stage=0,showAllHistory=false;
const storageKey='comprehension-answer-ladder-v1';
const saved=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'[]')}catch{return []}};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const record=(entry)=>{const a=saved();a.unshift(entry);localStorage.setItem(storageKey,JSON.stringify(a.slice(0,50)));renderHistory()};
function current(){return lessons[index]}
function render(){const l=current();if(!l)return;choice=-1;stage=0;$('#counter').textContent='LESSON '+(index+1)+' / '+lessons.length;$('#bar').innerHTML=lessons.map((_,i)=>'<i class="'+(i<=index?'on':'')+'"></i>').join('');$('#heading').textContent=l.title;$('#question').textContent=l.question;$('#quote').textContent=l.quote;$('#choices').innerHTML='';l.options.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o.text;b.onclick=()=>choose(i);$('#choices').append(b)});$('#choiceFeedback').replaceChildren();$('#previous').disabled=index===0;$('#next').textContent=index===lessons.length-1?'Start again':'Next ›';$('#answer').value='';$('#feedback').replaceChildren();$('#model').classList.add('hidden');$('#model').textContent='';$('#aiFeedback').textContent='Sign in as parent and tick consent to request AI coaching. Your words are not sent until you press Ask AI.';$('#consent').checked=false;renderBuilding();}
function choose(i){const l=current();choice=i;[...$('#choices').children].forEach((b,j)=>b.classList.toggle('selected',j===i));const box=$('#choiceFeedback');box.replaceChildren();for(const o of l.options){const r=document.createElement('div');r.className='outcome';const m=document.createElement('span');m.className='mark'+(o.correct?'':' bad');m.textContent=o.correct?'✓':'×';const t=document.createElement('span');const b=document.createElement('strong');b.textContent=o.text+' — '+o.part+'. ';t.append(b,document.createTextNode(o.why));r.append(m,t);box.append(r)}}
function renderBuilding(){
 const l=current();
 // Curated by lesson rather than guessed from a word pattern: a 'like' can be a verb,
 // and some passages support several perfectly valid techniques.
 const techniques={
   door:['Powerful verb / descriptive word'],
   trembled:['Powerful verb / descriptive word'],
   whisper:['Powerful verb / descriptive word'],
   growl:['Powerful verb / descriptive word','Metaphor'],
   'like-thunder':['Simile'],
   'is-thunder':['Metaphor'],
   'the-door-burst':['Powerful verb / descriptive word'],
   'wind-clawed':['Powerful verb / descriptive word','Personification','Metaphor'],
   'dulwich-voice':['Simile'],
   'dulwich-eyes':['Metaphor'],
   'dulwich-face':['Powerful verb / descriptive word','Alliteration'],
   'dulwich-overall':['Powerful verb / descriptive word']
 };
 const accepted=techniques[l.id]||['Powerful verb / descriptive word'],technique=accepted[0];
 const choices=['Simile','Metaphor','Alliteration','Personification','Powerful verb / descriptive word'];
 const meaning={'Simile':'Compares things with like or as.','Metaphor':'Describes one thing directly as another.','Alliteration':'Repeats starting consonant sounds.','Personification':'Gives a non-human thing human qualities.','Powerful verb / descriptive word':'A deliberately chosen word creates a clear image or impression.'};
 const wrong='A different technique might occur elsewhere, but it is not the strongest explanation for THIS quotation.';
 $('#building').innerHTML='<h3>Technique Detective</h3><p>Which technique is MOST useful for explaining this quotation? Some labels may be true elsewhere in the passage, but choose the strongest for this question.</p><div class="choices" id="techChoices">'+choices.map((o,i)=>'<button type="button" data-tech="'+i+'">'+escape(o)+'</button>').join('')+'</div><div id="techFeedback"></div><h3>Build the reasoning</h3><div class="grid">'+['I can quote or identify the writer’s choice','I can explain the picture or sound it creates','I can connect it to the question’s TARGET','I can justify why that evidence is most relevant'].map((o,i)=>'<label class="note" style="margin:0"><input type="checkbox" data-part="'+i+'"> '+escape(o)+'</label>').join('')+'</div>';
 $('#techChoices').querySelectorAll('button').forEach(b=>b.onclick=()=>{
  const chosen=choices[Number(b.dataset.tech)],correct=chosen===technique;
  [...$('#techChoices').children].forEach(x=>x.classList.toggle('selected',x===b));
  const feedback=$('#techFeedback');feedback.replaceChildren();
  const row=document.createElement('div');row.className='outcome';
  const mark=document.createElement('span');mark.className='mark'+(correct?'':' bad');mark.textContent=correct?'✓':'×';
  const explanation=document.createElement('span');explanation.textContent=(correct?(chosen===technique?'Good choice. ':'A valid technique, although '+technique+' is the most direct choice here. '):'The most direct choice here is '+technique+'. ')+meaning[chosen]+' '+(correct?'Now explain its effect, not just its name.':wrong);
  row.append(mark,explanation);feedback.append(row);
 });
}

function checker(){const l=current(),text=$('#answer').value.trim(),f=$('#feedback');f.replaceChildren();if(!text){f.innerHTML='<div class="note">Try saying or writing one sentence first, or reveal the model. There is no penalty for needing help.</div>';return}const lower=text.toLowerCase(),groups=l.rubric||[],covered=groups.map(g=>g.some(w=>lower.includes(w.toLowerCase())));const headings=['Writer / technique','Evidence / comparison','Effect / meaning'];const box=document.createElement('div');box.className='note';const h=document.createElement('strong');h.textContent='Ideas detected: '+covered.filter(Boolean).length+' / '+groups.length+' (keyword hints, not a mark)';box.append(h);covered.forEach((ok,i)=>{const p=document.createElement('p');p.textContent=(ok?'✓ ':'? ')+(headings[i]||'Idea')+': '+(ok?'a possible match':'not detected — you may have said it differently');box.append(p)});const tip=document.createElement('p');tip.className='hint';tip.textContent='Try strengthening this ONE part: '+(covered[1]===false?'say which words or objects are being compared':covered[2]===false?'explain what this makes the reader imagine or infer':'explain why that particular quotation is the best evidence');box.append(tip);f.append(box)}
function renderHistory(){$('#parentSummary').textContent=saved().length+' saved attempts across this browser and any synced parent records.';$('#history').innerHTML=saved().slice(0,showAllHistory?100:6).map(x=>'<div class="note"><strong>'+escape(x.title)+'</strong><div class="small">'+escape(new Date(x.date).toLocaleString('en-GB'))+'</div><p>'+escape(x.answer)+'</p></div>').join('')||'<p class="small">No saved explanations yet.</p>'}
$('#previous').onclick=()=>{if(index){index--;render()}};
$('#next').onclick=()=>{index=(index+1)%lessons.length;render()};
$('#check').onclick=checker;
$('#showModel').onclick=()=>{const l=current();const m=$('#model');m.classList.toggle('hidden');m.textContent='MODEL: '+l.model+' WHY: '+l.whyBetter};
$('#save').onclick=()=>{const answer=$('#answer').value.trim();if(!answer){$('#feedback').textContent='Write or dictate an answer before saving.';return}record({title:current().title,lessonId:current().id,date:Date.now(),choice,answer});$('#feedback').textContent='✓ Saved locally. Try an improved version and save it again to compare.'};
$('#ai').onclick=()=>{$('#aiFeedback').textContent='AI feedback is not configured. No text was sent. You can still use the guided feedback above.'};
$('#consent').onchange=()=>{$('#ai').disabled=!$('#consent').checked};
render();renderHistory();
try{
 const incoming=JSON.parse(sessionStorage.getItem('comprehension-ai-handoff')||'null');
 if(incoming&&Date.now()-incoming.savedAt<1800000){
  const found=lessons.findIndex(l=>l.id===incoming.lessonId);
  if(found>=0){index=found;render()}
  if(incoming.answer){$('#answer').value=String(incoming.answer).slice(0,4000);$('#feedback').textContent='Your answer was brought over from the '+(incoming.source==='quick'?'five-question practice':'Learn to Explain')+' exercise. Choose Check my ideas or request AI coaching.'}
 }
 sessionStorage.removeItem('comprehension-ai-handoff');
}catch{}

window.addEventListener('comprehension-history-loaded',renderHistory);

$('#showAllHistory').onclick=()=>{showAllHistory=!showAllHistory;$('#showAllHistory').textContent=showAllHistory?'Show recent only':'Show all answers';renderHistory()};
$('#exportHistory').onclick=()=>{const blob=new Blob([JSON.stringify({app:'comprehension',schema:1,exportedAt:new Date().toISOString(),attempts:saved()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='sai-comprehension-history.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
