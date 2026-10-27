'use strict';
const ITEMS=[
{quote:'The door slammed.',question:'Which word tells you the door made a sudden loud noise?',options:[['door','Noun','Names a thing, but does not tell us how it closed.'],['slammed','Verb','Shows that it closed suddenly and forcefully, probably with a bang.'],['The','Definite article (determiner)','Identifies a particular door. "A" is an indefinite article.']],correct:1,model:'The writer uses the verb "slammed" instead of "closed" to make us imagine a sudden, loud bang. This makes the action feel more forceful.',key:['slammed','loud','sudden']},
{quote:'Her hands trembled.',question:"What does 'trembled' suggest about the girl?",options:[['She might be frightened or nervous','Supported inference','Shaking hands can be a clue that someone is nervous or afraid. She might also be cold, so we cannot be certain.'],['She is definitely happy','Unsupported certainty','Nothing here proves she is happy. The word "definitely" is too certain.'],['She is running fast','Unrelated idea','Trembled means shook slightly, not ran quickly.']],correct:0,model:'The writer uses the verb "trembled" to show that the girl’s hands are shaking. This suggests that she might be frightened or nervous.',key:['trembled','shak','nervous','frighten']},
{quote:'His voice was like thunder.',question:'Which two things are being compared?',options:[['The man and the sky','Not the comparison','The sentence compares sounds, not a person with the sky.'],['His voice and thunder','Simile','The word "like" compares his voice with the loud rumbling sound of thunder.'],['His face and thunder','Wrong feature','The quotation is about the man’s voice, not his face.']],correct:1,model:'The writer uses a simile to compare the man’s voice to thunder. This makes us imagine that his voice is loud and powerful.',key:['simile','voice','thunder']},
{quote:'His voice was thunder.',question:'Why is this a metaphor rather than a simile?',options:[['It directly calls his voice thunder','Metaphor','A metaphor makes a direct comparison without "like" or "as".'],['It uses the word "like"','Simile','This quotation does not contain "like". The previous example did.'],['It has no comparison','Incorrect','His voice is being compared directly with thunder.']],correct:0,model:'The writer uses a metaphor, describing his voice as thunder. This makes his voice seem extremely loud and powerful.',key:['metaphor','voice','thunder']},
{quote:'His voice sounded like a hammer striking an anvil.',question:'What is the strongest explanation of the effect?',options:[['It is a simile','Names technique only','Correct label, but it does not explain what we imagine or what it suggests.'],['His voice must be made of metal','Too literal','The man is not literally made of metal. The writer compares sounds.'],['It makes his voice seem loud and harsh, suggesting he is commanding','Explains the effect','Links the sound we imagine with an impression of the man.']],correct:2,model:'The writer uses a simile to compare the man’s voice to a hammer striking an anvil. This makes his voice seem loud and harsh, suggesting that he is powerful and commanding.',key:['simile','hammer','loud','harsh','command']}
];
let index=0,selection=null,recorder=null,chunks=[],audioUrl=null,recognition=null;const $=id=>document.getElementById(id);const STORE='comprehension:quick-practice:v0.2.0';function read(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return{}}}let progress=read();function save(){try{localStorage.setItem(STORE,JSON.stringify(progress))}catch{$('saved').textContent='Private mode: saving unavailable. You may copy your answers.'}}
function render(){const q=ITEMS[index];selection=progress[index]?.choice??null;$('counter').textContent=`Exercise ${index+1} of ${ITEMS.length}`;$('progress').innerHTML=ITEMS.map((_,i)=>`<span class="${i<=index?'passed':''}"></span>`).join('');$('passage').textContent=q.quote;$('question').textContent=q.question;$('options').innerHTML='';q.options.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.className='option'+(selection===i?' chosen':'');b.innerHTML='<span class="circle"></span>';const label=document.createElement('span');label.textContent=o[0];b.append(label);b.addEventListener('click',()=>choose(i));$('options').append(b)});$('feedback').innerHTML='';$('write').hidden=selection===null;$('answer').value=progress[index]?.answer||'';$('modelText').hidden=true;$('modelText').textContent='';$('prev').disabled=index===0;$('next').textContent=index===4?'Start again ›':'Next exercise ›';if(selection!==null)showFeedback()}
function choose(i){selection=i;progress[index]={...(progress[index]||{}),choice:i,ts:Date.now()};save();render()}
function showFeedback(){
 const q=ITEMS[index],good=selection===q.correct,box=$('feedback');box.className='feedback';box.replaceChildren();
 const head=document.createElement('div');head.className='feedback-head';
 const mark=document.createElement('span');mark.className='result-icon '+(good?'correct-icon':'wrong-icon');mark.textContent=good?'✓':'×';
 const label=document.createElement('b');label.textContent=good?'Correct. '+q.options[q.correct][0]:'Not quite. The answer is '+q.options[q.correct][0];head.append(mark,label);box.append(head);
 const intro=document.createElement('p');intro.textContent=q.options[selection][2];box.append(intro);
 const title=document.createElement('p');title.textContent='Why each option works or does not work:';box.append(title);
 const rows=document.createElement('div');rows.className='reason-list';
 q.options.forEach((o,i)=>{const row=document.createElement('div');row.className='reason-row';const icon=document.createElement('span');icon.className='result-icon '+(i===q.correct?'correct-icon':'wrong-icon');icon.textContent=i===q.correct?'✓':'×';icon.setAttribute('aria-label',i===q.correct?'Correct':'Incorrect');const content=document.createElement('span');const bold=document.createElement('strong');bold.textContent=o[0]+' — '+o[1]+': ';content.append(bold,document.createTextNode(o[2]));row.append(icon,content);rows.append(row)});box.append(rows);
}
$('prev').onclick=()=>{if(index>0){index--;render()}};$('next').onclick=()=>{index=(index+1)%ITEMS.length;render()};$('answer').oninput=()=>{progress[index]={...(progress[index]||{}),answer:$('answer').value,answerAt:Date.now()};save()};$('model').onclick=()=>{const e=$('modelText');e.hidden=!e.hidden;if(!e.hidden)e.textContent='Example explanation: '+ITEMS[index].model};$('check').onclick=()=>{const q=ITEMS[index],answer=$('answer').value.toLowerCase();const matches=q.key.filter(k=>answer.includes(k));const e=$('modelText');e.hidden=false;e.textContent=answer.trim()?`You included ${matches.length} of ${q.key.length} helpful ideas (${matches.join(', ')||'none yet'}). This is a word-check, not a mark: other correct wording is possible. Compare with: ${q.model}`:'Try speaking or writing one sentence first, or reveal this example: '+q.model};
let voiceActive=false,voiceStream=null,voiceTimer=null,spokenBase='',spokenFinal='',spokenError='';
const voiceStatus=t=>$('voiceStatus').textContent=t;
function voiceButtons(active){$('record').hidden=active;$('stop').hidden=!active}
async function startVoice(){
 if(voiceActive)return;
 if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){voiceStatus('Microphone recording is unsupported here; use keyboard dictation or type.');return}
 voiceActive=true;spokenError='';spokenBase=$('answer').value.trim();spokenFinal='';voiceButtons(true);
 try{
  voiceStream=await navigator.mediaDevices.getUserMedia({audio:true});
  if(!voiceActive){voiceStream.getTracks().forEach(t=>t.stop());return}
  const type=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  recorder=new MediaRecorder(voiceStream,type?{mimeType:type}:undefined);chunks=[];
  recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};
  recorder.onstop=()=>{voiceStream?.getTracks().forEach(t=>t.stop());voiceStream=null;
   const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});if(audioUrl)URL.revokeObjectURL(audioUrl);
   if(blob.size){audioUrl=URL.createObjectURL(blob);$('playback').src=audioUrl;$('playback').hidden=false;voiceStatus(spokenFinal?'Audio captured. Transcript added; please correct any misheard words.':'Audio captured. '+(spokenError||'No transcript was produced. Use keyboard dictation if needed.'))}else voiceStatus('No audio was captured. Please retry.');chunks=[]};
  recorder.start();
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SR){try{
   const speech=new SR();recognition=speech;speech.lang='en-GB';speech.interimResults=true;speech.continuous=true;
   speech.onresult=e=>{let final='',interim='';for(let i=0;i<e.results.length;i++){const result=e.results[i];if(result.isFinal)final+=(result[0]?.transcript||'')+' ';else interim+=(result[0]?.transcript||'')+' '}
    spokenFinal=final.trim();$('answer').value=[spokenBase,spokenFinal,interim.trim()].filter(Boolean).join(' ');$('answer').dispatchEvent(new Event('input'));voiceStatus('Recording and transcribing. Correct any words the device mishears.')};
   speech.onerror=e=>{spokenError='Transcription unavailable ('+e.error+').';voiceStatus('Recording audio. '+spokenError)};
   speech.onend=()=>{if(recognition===speech)recognition=null;if(voiceActive)voiceStatus('Audio recording continues; speech recognition has stopped.')};
   speech.start();
  }catch(e){recognition=null;spokenError='Automatic transcription could not start.'}}
  else spokenError='Automatic transcription is not supported in this browser.';
  voiceStatus(spokenError?'Recording audio. '+spokenError:'Recording and dictating. Tap Stop when finished.');
  voiceTimer=setTimeout(stopVoice,90000);
 }catch(e){voiceStream?.getTracks().forEach(t=>t.stop());voiceStream=null;voiceActive=false;voiceButtons(false);voiceStatus('Microphone unavailable: '+(e.name||e.message))}
}
function stopVoice(){
 if(!voiceActive)return;voiceActive=false;clearTimeout(voiceTimer);voiceButtons(false);
 if(recognition){try{recognition.stop()}catch{}recognition=null}
 if(spokenFinal){$('answer').value=[spokenBase,spokenFinal].filter(Boolean).join(' ');$('answer').dispatchEvent(new Event('input'))}
 if(recorder?.state==='recording')recorder.stop();else{voiceStream?.getTracks().forEach(t=>t.stop());voiceStream=null}
}
$('record').onclick=startVoice;$('stop').onclick=stopVoice;
window.addEventListener('pagehide',()=>{stopVoice();if(audioUrl)URL.revokeObjectURL(audioUrl)});
render();

$('aiCoachHandoff').onclick=()=>{const lessonIds=['door','trembled','like-thunder','is-thunder','dulwich-voice'];const answer=$('answer').value;try{sessionStorage.setItem('comprehension-ai-handoff',JSON.stringify({lessonId:lessonIds[index],answer,source:'quick',savedAt:Date.now()}))}catch{navigator.clipboard?.writeText(answer).catch(()=>{})}location.href='./answer-ladder.html'};
