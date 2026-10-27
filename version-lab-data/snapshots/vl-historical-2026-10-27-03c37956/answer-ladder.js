import {LESSONS} from './explain-data.js';
const $=s=>document.querySelector(s);
const lessons=LESSONS.filter(l=>l.sentence?.length&&l.options?.length).slice(0,15);
let index=0, choice=-1, stage=0;
const storageKey='comprehension-answer-ladder-v1';
const saved=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'[]')}catch{return []}};
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const record=(entry)=>{const a=saved();a.unshift(entry);localStorage.setItem(storageKey,JSON.stringify(a.slice(0,50)));renderHistory()};
function current(){return lessons[index]}
function render(){const l=current();if(!l)return;choice=-1;stage=0;$('#counter').textContent='LESSON '+(index+1)+' / '+lessons.length;$('#bar').innerHTML=lessons.map((_,i)=>'<i class="'+(i<=index?'on':'')+'"></i>').join('');$('#heading').textContent=l.title;$('#question').textContent=l.question;$('#quote').textContent=l.quote;$('#choices').innerHTML='';l.options.forEach((o,i)=>{const b=document.createElement('button');b.textContent=o.text;b.onclick=()=>choose(i);$('#choices').append(b)});$('#choiceFeedback').replaceChildren();$('#previous').disabled=index===0;$('#next').textContent=index===lessons.length-1?'Start again':'Next ›';$('#answer').value='';$('#feedback').replaceChildren();$('#model').classList.add('hidden');$('#model').textContent='';$('#aiFeedback').textContent='AI service not connected yet. The guided checker above works offline.';$('#consent').checked=false;renderBuilding();}
function choose(i){const l=current();choice=i;[...$('#choices').children].forEach((b,j)=>b.classList.toggle('selected',j===i));const box=$('#choiceFeedback');box.replaceChildren();for(const o of l.options){const r=document.createElement('div');r.className='outcome';const m=document.createElement('span');m.className='mark'+(o.correct?'':' bad');m.textContent=o.correct?'✓':'×';const t=document.createElement('span');const b=document.createElement('strong');b.textContent=o.text+' — '+o.part+'. ';t.append(b,document.createTextNode(o.why));r.append(m,t);box.append(r)}}
function renderBuilding(){
 const l=current(),q=l.quote.toLowerCase();
 const isSimile=/\\blike\\b|\\bas\\b.*\\bas\\b/.test(q),isMetaphor=/voice was thunder|eyes.{0,25}pools|was a (?:lion|storm)/.test(q);
 const technique=isSimile?'Simile':isMetaphor?'Metaphor':'Powerful verb / descriptive word';
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
  const explanation=document.createElement('span');explanation.textContent=(correct?'Good choice. ':'The strongest choice here is '+technique+'. ')+meaning[chosen]+' '+(correct?'Now explain its effect, not just its name.':wrong);
  row.append(mark,explanation);feedback.append(row);
 });
}

function checker(){const l=current(),text=$('#answer').value.trim(),f=$('#feedback');f.replaceChildren();if(!text){f.innerHTML='<div class="note">Try saying or writing one sentence first, or reveal the model. There is no penalty for needing help.</div>';return}const lower=text.toLowerCase(),groups=l.rubric||[],covered=groups.map(g=>g.some(w=>lower.includes(w.toLowerCase())));const headings=['Writer / technique','Evidence / comparison','Effect / meaning'];const box=document.createElement('div');box.className='note';const h=document.createElement('strong');h.textContent='Ideas detected: '+covered.filter(Boolean).length+' / '+groups.length+' (keyword hints, not a mark)';box.append(h);covered.forEach((ok,i)=>{const p=document.createElement('p');p.textContent=(ok?'✓ ':'? ')+(headings[i]||'Idea')+': '+(ok?'a possible match':'not detected — you may have said it differently');box.append(p)});const tip=document.createElement('p');tip.className='hint';tip.textContent='Try strengthening this ONE part: '+(covered[1]===false?'say which words or objects are being compared':covered[2]===false?'explain what this makes the reader imagine or infer':'explain why that particular quotation is the best evidence');box.append(tip);f.append(box)}
function renderHistory(){$('#history').innerHTML=saved().slice(0,6).map(x=>'<div class="note"><strong>'+escape(x.title)+'</strong><div class="small">'+escape(new Date(x.date).toLocaleString('en-GB'))+'</div><p>'+escape(x.answer)+'</p></div>').join('')||'<p class="small">No saved explanations yet.</p>'}
$('#previous').onclick=()=>{if(index){index--;render()}};
$('#next').onclick=()=>{index=(index+1)%lessons.length;render()};
$('#check').onclick=checker;
$('#showModel').onclick=()=>{const l=current();const m=$('#model');m.classList.toggle('hidden');m.textContent='MODEL: '+l.model+' WHY: '+l.whyBetter};
$('#save').onclick=()=>{const answer=$('#answer').value.trim();if(!answer){$('#feedback').textContent='Write or dictate an answer before saving.';return}record({title:current().title,lessonId:current().id,date:Date.now(),choice,answer});$('#feedback').textContent='✓ Saved locally. Try an improved version and save it again to compare.'};
$('#ai').onclick=()=>{$('#aiFeedback').textContent='AI feedback is not configured. No text was sent. You can still use the guided feedback above.'};
$('#consent').onchange=()=>{$('#ai').disabled=!$('#consent').checked};
render();renderHistory();