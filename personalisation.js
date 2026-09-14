// Adaptive coaching layer based on recurring error patterns seen in Sai's work.
// The aim is to make plausible-but-wrong answers look familiar at first,
// then gradually train the habits needed for highly selective 11+/12+ papers.

const SAI_PROFILE_KEY = 'saiComprehensionErrorProfileV1';
let saiProfile = JSON.parse(localStorage.getItem(SAI_PROFILE_KEY) || '{}');

const errorLabels = {
  off_target: 'Answers the wrong part of the question',
  unsupported_guess: 'Invents a plausible answer without enough evidence',
  weak_evidence: 'Chooses evidence that is related but does not prove the point',
  literal_only: 'Stops at the literal meaning instead of the implied effect',
  labels_technique: 'Names a technique but does not explain its effect',
  vague_wording: 'Uses vague words such as nice, mean, scary or bad',
  one_sided: 'Makes a judgement without weighing both sides',
  creative_drift: 'Invents events that no longer fit the original character/text',
  overlong: 'Keeps explaining after the question has already been answered'
};

function saveSaiProfile(){
  localStorage.setItem(SAI_PROFILE_KEY, JSON.stringify(saiProfile));
  renderSaiFocus();
}
function bumpError(tag, amount=1){
  if(!tag) return;
  saiProfile[tag] = Math.max(0, (saiProfile[tag] || 0) + amount);
  saveSaiProfile();
}

// Add targeted questions modelled on the kinds of errors Sai has actually made.
questions.push(
  {
    id:'sai_target_room', skill:'language', difficulty:1, skillLabel:'Question decoding', errorFocus:'off_target',
    passage:'At the end of the corridor was a cramped staff room. Its low ceiling pressed down over two narrow tables, and a single dusty window admitted hardly any light. “Morning,” called Mr Webb from inside.',
    question:'Choose a phrase that describes the staff room particularly well and explain why it is effective.',
    action:'choose and explain', target:'a phrase describing the staff room',
    actionOptions:['choose and explain','say what happens next','judge and give evidence','find three differences'],
    targetOptions:['a phrase describing the staff room','what Mr Webb says','Mr Webb’s personality','the length of the corridor'],
    evidence:[['“cramped staff room”',true],['“low ceiling pressed down”',true],['“a single dusty window admitted hardly any light”',true],['“Morning”',false],['“Mr Webb”',false]],
    scaffoldLabels:['Phrase','Important word/image','Effect'],
    scaffold:['“low ceiling pressed down”','“pressed” makes the room seem physically oppressive','the room feels cramped and uncomfortable'],
    model:'The phrase “the low ceiling pressed down” is particularly effective because “pressed” makes the room seem oppressive, as though it is closing in on the teachers.'
  },
  {
    id:'sai_infer_sheet', skill:'inference', difficulty:2, skillLabel:'Inference', errorFocus:'unsupported_guess',
    passage:'Mr Kemp placed a fresh stack of thirty worksheets beside the pencils. “One each,” he said, writing ten numbered questions on the board before the pupils entered.',
    question:'What sort of activity do you think the pupils are about to do? Give a reason.',
    action:'infer and justify', target:'the likely classroom activity',
    actionOptions:['infer and justify','describe Mr Kemp’s appearance','analyse the weather','compare two classrooms'],
    targetOptions:['the likely classroom activity','the pupils’ names','the history of the school','why the pencils are new'],
    evidence:[['thirty worksheets',true],['“One each”',true],['ten numbered questions on the board',true],['fresh stack',false],['before the pupils entered',false]],
    scaffoldLabels:['Clue','Likely activity','Reason'],
    scaffold:['one worksheet each + numbered questions','an individual written exercise or quiz','the clues point to pupils answering the same questions independently'],
    model:'The pupils are probably about to complete an individual written exercise or quiz because each pupil will receive a worksheet and there are numbered questions on the board.'
  },
  {
    id:'sai_literal_colourless', skill:'language', difficulty:2, skillLabel:'Vocabulary in context', errorFocus:'literal_only',
    passage:'Mrs Denham entered in a colourless dress and spoke in a flat, careful voice. Even her smile seemed pale beside the noisy brightness of the children.',
    question:'What impression does the word “colourless” give of Mrs Denham?',
    action:'explain the implied impression', target:'what “colourless” suggests about Mrs Denham',
    actionOptions:['explain the implied impression','identify the dress colour only','judge the children','find a fact about her voice'],
    targetOptions:['what “colourless” suggests about Mrs Denham','the exact shade of her dress','why the children are noisy','the time of day'],
    evidence:[['“colourless dress”',true],['“flat, careful voice”',true],['“smile seemed pale”',true],['“children”',false]],
    scaffoldLabels:['Literal meaning','Implied meaning','Overall impression'],
    scaffold:['little or no strong colour','plain, dull, lacking liveliness','she seems unremarkable and subdued'],
    model:'“Colourless” literally suggests a dull appearance, but it also makes Mrs Denham seem plain and lacking in liveliness or individuality.'
  },
  {
    id:'sai_judge_balance', skill:'judgement', difficulty:2, skillLabel:'Judgement', errorFocus:'one_sided',
    passage:'Miss Crane demanded silence the instant the bell rang and frowned at untidy work. Yet she noticed when Eli had no ruler, lent him her own, and quietly stayed behind to help him redo a difficult diagram.',
    question:'Would Miss Crane be a good teacher? Use details from the passage.',
    action:'judge and give evidence', target:'whether Miss Crane would be a good teacher',
    actionOptions:['judge and give evidence','describe the classroom','predict the next lesson','find one adjective'],
    targetOptions:['whether Miss Crane would be a good teacher','whether Eli owns a ruler','what the diagram shows','why the bell rang'],
    evidence:[['demanded silence',true],['frowned at untidy work',true],['lent Eli her ruler',true],['stayed behind to help',true]],
    scaffoldLabels:['Strict evidence','Helpful evidence','Balanced judgement'],
    scaffold:['expects silence and neat work','notices problems and gives extra help','strict but attentive and committed'],
    model:'Miss Crane seems strict but probably effective. She expects silence and neat work, yet she also notices when Eli needs help and stays behind to support him. This suggests that her strictness is matched by care for her pupils.'
  },
  {
    id:'sai_language_effect', skill:'language', difficulty:3, skillLabel:'Language analysis', errorFocus:'labels_technique',
    passage:'The wind clawed at the shutters and squeezed a thin whistle through the gap beneath the door.',
    question:'How does the writer make the wind seem threatening?',
    action:'explain how language creates an effect', target:'the threatening impression of the wind',
    actionOptions:['explain how language creates an effect','name techniques only','retrieve the weather','give a personal opinion'],
    targetOptions:['the threatening impression of the wind','the material of the shutters','the size of the door','the narrator’s age'],
    evidence:[['“clawed”',true],['“squeezed a thin whistle”',true],['“shutters”',false],['“gap beneath the door”',false]],
    scaffoldLabels:['Quotation','Image','Effect'],
    scaffold:['“clawed”','makes the wind seem like an animal attacking','the weather feels aggressive and dangerous'],
    model:'The verb “clawed” personifies the wind as an attacking animal, making it seem aggressive and dangerous rather than simply strong.'
  },
  {
    id:'sai_creative_consistency', skill:'creative', difficulty:3, skillLabel:'Creative continuation', errorFocus:'creative_drift',
    passage:'Mr Ash paused outside the classroom before his first lesson. He checked the same page of notes twice, took a slow breath, and entered with a nervous smile.',
    question:'Imagine you are one of the pupils. Describe what happened during Mr Ash’s first lesson.',
    action:'continue consistently from a viewpoint', target:'a believable first lesson that fits Mr Ash’s nervous character',
    actionOptions:['continue consistently from a viewpoint','invent an unrelated adventure','analyse one word','list classroom objects'],
    targetOptions:['a believable first lesson that fits Mr Ash’s nervous character','Mr Ash becoming a completely different person','the history of the school','the building outside'],
    evidence:[['paused outside',true],['checked notes twice',true],['slow breath',true],['nervous smile',true]],
    scaffoldLabels:['Character at start','Problem','Response','Turning point','Ending'],
    scaffold:['Mr Ash is nervous','a pupil tests him','he hesitates but stays calm','he handles one small problem successfully','he becomes more confident without changing personality'],
    model:'At first Mr Ash kept glancing at his notes, and Ben at the back whispered loudly enough for everyone to hear. Mr Ash stopped, clearly uncertain, but instead of shouting he waited until Ben looked up. He asked him a simple question from the lesson. When Ben answered, Mr Ash nodded and continued. By the end his voice was steadier, although he still kept one hand on his notes.'
  }
);

// Strongest-answer choices. Wrong answers deliberately mirror real habits rather than random distractors.
const saiAnswerChoices = {
  lang1: [
    {text:'Tom is sad because the classroom is quiet and there is nobody he knows.', correct:false, tag:'unsupported_guess', feedback:'This sounds possible, but it adds ideas the passage does not actually prove.'},
    {text:'The writer uses personification.', correct:false, tag:'labels_technique', feedback:'Naming a technique is not enough. Explain what the words make us picture and what that suggests.'},
    {text:'Tom feels uncomfortable because he stops when everyone looks at him, grips his bag and avoids eye contact.', correct:true},
    {text:'Tom feels bad and scared.', correct:false, tag:'vague_wording', feedback:'The feeling may be right, but the wording is vague and there is no evidence.'}
  ],
  inf1: [
    {text:'She is waiting for a holiday because her family always travels by car.', correct:false, tag:'unsupported_guess', feedback:'That may be possible, but “her family always travels by car” is invented.'},
    {text:'She is probably waiting to be collected because her bag is ready and she reacts when a car slows outside.', correct:true},
    {text:'She is waiting for a car.', correct:false, tag:'literal_only', feedback:'That repeats the surface clue but does not infer why the car matters.'},
    {text:'She is excited.', correct:false, tag:'off_target', feedback:'The question asks WHAT she is waiting for, not simply how she feels.'}
  ],
  judge1: [
    {text:'Yes. He is nice.', correct:false, tag:'vague_wording', feedback:'“Nice” is too vague and the answer needs evidence.'},
    {text:'No, because he rarely praises pupils.', correct:false, tag:'one_sided', feedback:'That is relevant evidence, but it ignores the strong positive evidence.'},
    {text:'He would probably be effective because he is calm and gives careful feedback, although his lack of praise may discourage some pupils.', correct:true},
    {text:'He would be good because teachers who do not shout are always the best teachers.', correct:false, tag:'unsupported_guess', feedback:'Avoid general rules that are not proved by this passage.'}
  ],
  retr1: [
    {text:'The classroom is old, horrible and uncomfortable.', correct:false, tag:'vague_wording', feedback:'This gives general opinions instead of three precise comparisons.'},
    {text:'It has a coal stove, dip pens and forty-eight pupils on benches, unlike modern heating, writing equipment and usually smaller classes.', correct:true},
    {text:'The pupils probably dislike school because they have to use dip pens.', correct:false, tag:'unsupported_guess', feedback:'The passage does not tell us the pupils dislike school.'},
    {text:'The teacher probably wakes up earlier than teachers today.', correct:false, tag:'off_target', feedback:'This is not one of the classroom differences supported by the passage.'}
  ],
  lang2: [
    {text:'The writer uses personification and a simile.', correct:false, tag:'labels_technique', feedback:'Correct techniques, but the question asks HOW they make the house threatening.'},
    {text:'The house is scary because it is old and black.', correct:false, tag:'vague_wording', feedback:'This notices mood, but it needs precise word-level explanation.'},
    {text:'“Crouched” makes the house seem like an animal waiting to spring, while the “warning finger” makes approaching it feel dangerous.', correct:true},
    {text:'The path is narrow, so somebody might trip over.', correct:false, tag:'unsupported_guess', feedback:'That is a real-world possibility, not the literary effect created by the description.'}
  ],
  inf2: [
    {text:'Ella probably broke the cup and is hiding it, because she puts it at the back and blocks the cupboard when her father arrives.', correct:true},
    {text:'Ella is talking about school because something exciting happened there.', correct:false, tag:'off_target', feedback:'This follows the distraction in the passage instead of combining the important clues.'},
    {text:'Ella is bad because she broke something.', correct:false, tag:'vague_wording', feedback:'That is a judgement about Ella rather than an inference about what she is doing.'},
    {text:'Her father bought the cup and will be angry because it was expensive.', correct:false, tag:'unsupported_guess', feedback:'None of those details are given.'}
  ],
  judge2: [
    {text:'She is harsh because she criticises careless work.', correct:false, tag:'one_sided', feedback:'Relevant, but incomplete: the passage deliberately gives evidence on both sides.'},
    {text:'She is caring because she stays for twenty minutes.', correct:false, tag:'one_sided', feedback:'Relevant, but incomplete: do not ignore her strictness.'},
    {text:'She is both demanding and caring: she criticises careless work but gives extra time and patient help until Noor understands.', correct:true},
    {text:'She is a good teacher because she knows fractions.', correct:false, tag:'weak_evidence', feedback:'Knowing the subject is not the strongest evidence here; focus on how she treats and teaches pupils.'}
  ],
  creative1: [
    {text:'Miss Arden is nervous → pupils notice → someone laughs → she steadies herself → continues more confidently.', correct:true},
    {text:'Miss Arden is nervous → forgets where she is → starts teaching Spanish → plays football at break → gets fired.', correct:false, tag:'creative_drift', feedback:'This creates lots of events, but it stops being a believable continuation of the character and scene.'},
    {text:'Miss Arden is nervous → the school catches fire → she becomes a hero.', correct:false, tag:'creative_drift', feedback:'Possible in fiction, but not a close continuation of the passage.'},
    {text:'Describe the hall, microphone and pupils for the whole answer.', correct:false, tag:'off_target', feedback:'Description alone does not answer “what happened next”.'}
  ],
  lang3: [
    {text:'There is personification.', correct:false, tag:'labels_technique', feedback:'Go one step further: what is being made to seem alive, and what effect does that create?'},
    {text:'The weather is horrible and scary.', correct:false, tag:'vague_wording', feedback:'Too general. Zoom in on “swallowed”, “needled” or “maddening”.'},
    {text:'“Swallowed” makes the corridor seem actively consuming the light, while “needled” makes the rain feel sharp and hostile, creating an oppressive atmosphere.', correct:true},
    {text:'The playground is empty because everyone has gone home.', correct:false, tag:'unsupported_guess', feedback:'That explanation is possible, but the question is about the atmosphere created by the language.'}
  ],
  sai_target_room: [
    {text:'“Morning”, because it is one of the few things Mr Webb says.', correct:false, tag:'off_target', feedback:'This repeats a classic mistake: the TARGET is the room, not what a person says.'},
    {text:'“The low ceiling pressed down”, because “pressed” makes the room seem oppressive and cramped.', correct:true},
    {text:'“Mr Webb”, because he is inside the room.', correct:false, tag:'off_target', feedback:'The target is a phrase describing the room.'},
    {text:'The room is bad and gloomy.', correct:false, tag:'vague_wording', feedback:'A general label is weaker than selecting and explaining a precise phrase.'}
  ],
  sai_infer_sheet: [
    {text:'A history task about the school and the names of all the pupils and teachers.', correct:false, tag:'unsupported_guess', feedback:'This is imaginative but unsupported. Use the clues actually present.'},
    {text:'Probably an individual written exercise or quiz, because there is one worksheet per pupil and numbered questions.', correct:true},
    {text:'We cannot answer because the subject is not stated.', correct:false, tag:'literal_only', feedback:'Inference questions do not always give the exact answer. Make the safest conclusion the clues allow.'},
    {text:'A very difficult exam, because there are ten questions.', correct:false, tag:'unsupported_guess', feedback:'Ten questions do not prove that it is an exam or that it is difficult.'}
  ],
  sai_literal_colourless: [
    {text:'Her dress is probably beige.', correct:false, tag:'literal_only', feedback:'That stays at the literal colour and misses the impression created.'},
    {text:'She seems plain, subdued and lacking in liveliness or individuality.', correct:true},
    {text:'She looks tanned.', correct:false, tag:'literal_only', feedback:'“Colourless” does not mean tanned, and the surrounding clues point towards dullness.'},
    {text:'She is mean.', correct:false, tag:'vague_wording', feedback:'The passage does not show meanness, and the word is too imprecise.'}
  ],
  sai_judge_balance: [
    {text:'She would be a bad teacher because she is bossy and strict.', correct:false, tag:'one_sided', feedback:'This ignores evidence that she notices and helps pupils.'},
    {text:'She would be a good teacher because she lends Eli a ruler.', correct:false, tag:'weak_evidence', feedback:'That detail helps, but it is too narrow on its own.'},
    {text:'She seems strict but attentive: she expects high standards yet notices Eli’s difficulty and stays to help him.', correct:true},
    {text:'She is both good and bad.', correct:false, tag:'vague_wording', feedback:'The balance is promising, but use precise qualities such as strict, attentive, patient or demanding.'}
  ],
  sai_language_effect: [
    {text:'It is personification.', correct:false, tag:'labels_technique', feedback:'True, but incomplete. Explain what picture “clawed” creates.'},
    {text:'“Clawed” makes the wind seem like an attacking animal, so it feels aggressive and dangerous.', correct:true},
    {text:'The wind is scary.', correct:false, tag:'vague_wording', feedback:'Give the word, the image it creates, and the effect.'},
    {text:'The wind is strong because the shutters move.', correct:false, tag:'literal_only', feedback:'That gives literal meaning but misses the threatening image.'}
  ],
  sai_creative_consistency: [
    {text:'Mr Ash is nervous → pupil tests him → he hesitates → responds calmly → gains a little confidence.', correct:true},
    {text:'Mr Ash is nervous → forgets the subject → takes the class outside → gets dismissed that afternoon.', correct:false, tag:'creative_drift', feedback:'This adds dramatic events instead of developing the character already established.'},
    {text:'Mr Ash is nervous → turns into an extremely fierce teacher and frightens everyone.', correct:false, tag:'creative_drift', feedback:'A turning point can change confidence, but should not replace the original personality.'},
    {text:'Mr Ash is nervous → describe his clothes and the desks → lesson ends.', correct:false, tag:'off_target', feedback:'The question asks what happened during the lesson, so something needs to develop.'}
  ]
};

// Attach a likely coaching focus to the original bank too.
const focusById = {
  lang1:'weak_evidence', inf1:'unsupported_guess', judge1:'one_sided', retr1:'off_target',
  lang2:'labels_technique', inf2:'unsupported_guess', judge2:'one_sided',
  creative1:'creative_drift', lang3:'labels_technique'
};
questions.forEach(q => { if(!q.errorFocus && focusById[q.id]) q.errorFocus = focusById[q.id]; });

// Insert a new stage between evidence collection and scaffold writing.
const collectStage = document.querySelector('#collectStage');
const answerStage = document.createElement('section');
answerStage.id = 'answerChoiceStage';
answerStage.className = 'stage card locked';
answerStage.innerHTML = `
  <div class="stage-head">
    <span class="stage-no">3</span>
    <div><h3>Choose the strongest answer</h3><p>Some answers are deliberately tempting. Pick the one that best answers the exact question and is best supported by the text.</p></div>
  </div>
  <div id="saiAnswerChoices" class="choice-grid"></div>
  <button id="checkSaiAnswerBtn" class="primary">Check answer choice</button>
  <div id="saiAnswerFeedback" class="feedback hidden"></div>`;
collectStage.insertAdjacentElement('afterend', answerStage);

// Renumber the remaining visible stages.
const scaffoldNo = document.querySelector('#scaffoldStage .stage-no');
const writeNo = document.querySelector('#writeStage .stage-no');
if(scaffoldNo) scaffoldNo.textContent = '4';
if(writeNo) writeNo.textContent = '5';

let chosenSaiAnswer = null;
function shuffled(arr){
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function renderPersonalChoice(){
  chosenSaiAnswer = null;
  const panel = document.querySelector('#saiAnswerChoices');
  const choices = saiAnswerChoices[current && current.id];
  answerStage.classList.add('locked');
  document.querySelector('#saiAnswerFeedback').className='feedback hidden';
  if(!choices){ panel.innerHTML='<p>No answer-choice drill for this item.</p>'; return; }
  panel.innerHTML = shuffled(choices).map((c,i)=>`<button class="choice sai-answer-choice" data-text="${encodeURIComponent(c.text)}">${c.text}</button>`).join('');
  panel.querySelectorAll('.sai-answer-choice').forEach(btn=>{
    btn.onclick=()=>{
      panel.querySelectorAll('.sai-answer-choice').forEach(x=>x.classList.remove('selected'));
      btn.classList.add('selected');
      chosenSaiAnswer = choices.find(c=>c.text===decodeURIComponent(btn.dataset.text));
    };
  });
}

function checkPersonalChoice(){
  const fb=document.querySelector('#saiAnswerFeedback');
  if(!chosenSaiAnswer){
    fb.className='feedback bad'; fb.textContent='Choose the strongest answer first.'; return;
  }
  if(chosenSaiAnswer.correct){
    fb.className='feedback good';
    fb.textContent='Yes. This answer does the exact job, uses relevant evidence, and explains rather than guesses.';
    const focus=current.errorFocus;
    if(focus && (saiProfile[focus]||0)>0) bumpError(focus,-1);
    document.querySelector('#scaffoldStage').classList.remove('locked');
    document.querySelector('#writeStage').classList.remove('locked');
  } else {
    bumpError(chosenSaiAnswer.tag || current.errorFocus || 'weak_evidence',1);
    fb.className='feedback bad';
    fb.textContent=chosenSaiAnswer.feedback || 'This is plausible, but not the strongest answer. Check the ACTION, TARGET and evidence.';
  }
}
document.querySelector('#checkSaiAnswerBtn').onclick=checkPersonalChoice;

// Wrap the app's normal render so the new stage refreshes with each question.
const baseRenderQuestion = renderQuestion;
renderQuestion = function(){ baseRenderQuestion(); renderPersonalChoice(); };

// Evidence must be strong enough before the answer-choice stage opens.
const baseCheckEvidence = checkEvidence;
checkEvidence = function(){
  baseCheckEvidence();
  const scaffold=document.querySelector('#scaffoldStage');
  if(!scaffold.classList.contains('locked')){
    answerStage.classList.remove('locked');
    scaffold.classList.add('locked');
    document.querySelector('#writeStage').classList.add('locked');
  }
};
document.querySelector('#checkEvidenceBtn').onclick=checkEvidence;

// Adaptive selection: recurring error types are more likely to reappear until corrected.
const basePickQuestion = pickQuestion;
pickQuestion = function(){
  const skill=document.querySelector('#skillSelect').value;
  const diff=document.querySelector('#difficultySelect').value;
  let pool=questions.filter(q=>(skill==='all'||q.skill===skill)&&(diff==='all'||String(q.difficulty)===diff));
  if(!pool.length) pool=questions;
  const expanded=[];
  pool.forEach(q=>{
    const pressure=Math.min(5, saiProfile[q.errorFocus]||0);
    const copies=1+pressure;
    for(let i=0;i<copies;i++) expanded.push(q);
  });
  const alternatives=expanded.filter(q=>!current||q.id!==current.id);
  const source=alternatives.length?alternatives:expanded;
  current=source[Math.floor(Math.random()*source.length)];
  startedAt=Date.now(); selectedAction=''; selectedTarget='';
  renderQuestion();
};

// Rebind controls that stored the old function object.
document.querySelector('#newQuestionBtn').onclick=pickQuestion;
document.querySelector('#skillSelect').onchange=pickQuestion;
document.querySelector('#difficultySelect').onchange=pickQuestion;

// Progress-page coaching focus.
const progressCard=document.querySelector('#progressView .card');
const focusBox=document.createElement('div');
focusBox.id='saiFocusBox';
focusBox.style.marginTop='18px';
progressCard.appendChild(focusBox);
function renderSaiFocus(){
  const entries=Object.entries(saiProfile).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  if(!entries.length){
    focusBox.innerHTML='<h3>Current coaching focus</h3><p>No persistent error pattern recorded yet. The app will adapt as answers are chosen.</p>';
    return;
  }
  focusBox.innerHTML='<h3>Current coaching focus</h3><p>The app will show these patterns more often until they improve.</p><div class="evidence-list">'+entries.slice(0,5).map(([tag,n])=>`<div class="evidence-option"><span><strong>${errorLabels[tag]||tag}</strong><br><small>Current weight: ${n}</small></span></div>`).join('')+'</div>';
}

// Seed the profile lightly with the patterns already observed in Sai's St Paul's attempt.
// This does not mark anything as "wrong" forever: correct targeted choices reduce these weights.
if(!localStorage.getItem(SAI_PROFILE_KEY)){
  saiProfile={off_target:2, unsupported_guess:2, literal_only:1, labels_technique:1, vague_wording:1, one_sided:1, creative_drift:2};
  saveSaiProfile();
}

renderSaiFocus();
renderPersonalChoice();
