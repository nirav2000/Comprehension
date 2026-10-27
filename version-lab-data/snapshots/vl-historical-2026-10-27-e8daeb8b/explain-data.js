/* Beginner-first, self-contained lesson material. No user data in this file. */
export const GLOSSARY = {
  the:['definite article / determiner','Points to a particular thing the reader can identify.','The door was open. Compare: A door was open.'],
  a:['indefinite article / determiner','Introduces one non-specific person or thing.','A door stood open.'],
  door:['noun','A thing that opens or closes an entrance.','She opened the door.'],
  slammed:['verb','Closed suddenly and forcefully, usually with a loud bang.','The car door slammed.'],
  closed:['verb','Moved something shut; it does not tell us how noisily or quickly.','He closed the book.'],
  her:['possessive determiner','Shows that something belongs to or is connected with a girl or woman.','Her hands were cold.'],
  hands:['plural noun','The parts of the body at the ends of the arms.','She held out her hands.'],
  trembled:['verb','Shook a little without meaning to.','His knees trembled in the cold.'],
  frightened:['adjective','Feeling afraid of something.','The frightened child hid.'],
  nervous:['adjective','Worried or uneasy about what might happen.','He felt nervous before the exam.'],
  whispered:['verb','Spoke very quietly, often to avoid being heard.','She whispered the secret.'],
  whisper:['noun or verb','A very quiet way of speaking.','Please whisper in the library.'],
  growled:['verb','Made a low, rough sound, like an angry animal.','The dog growled at the stranger.'],
  growl:['noun or verb','A low, rough, rumbling sound, often made by an animal.','The bear gave a deep growl.'],
  voice:['noun','The sound a person makes when speaking.','Her voice was calm.'],
  thunder:['noun','A loud rumbling or crashing sound during a storm.','Thunder rolled across the hills.'],
  hammer:['noun','A heavy tool used to hit or shape something.','The worker picked up a hammer.'],
  striking:['verb form','Hitting something.','The hammer was striking metal.'],
  anvil:['noun','A heavy metal block that a blacksmith hits metal against.','The blacksmith worked over an anvil.'],
  cold:['adjective','Having a low temperature; in describing eyes it can suggest little warmth or kindness.','The cold water made him shiver.'],
  forest:['noun','A large area covered with trees.','A narrow path crossed the forest.'],
  pools:['plural noun','Small areas of still water.','There were pools beside the stream.'],
  pupil:['noun','The dark opening in the middle of the eye.','Her pupils became wider in the dark.'],
  mysterious:['adjective','Hard to understand or explain.','The stranger gave a mysterious smile.'],
  ridged:['adjective','Having raised lines, edges or prominent bony shapes.','The shell had a ridged surface.'],
  cheekbones:['plural noun','Bones forming the upper part of the cheeks below the eyes.','His cheekbones stood out.'],
  arched:['adjective or verb','Curved upwards like an arch.','She raised one arched eyebrow.'],
  eyebrows:['plural noun','Strips of hair above the eyes.','His eyebrows lifted in surprise.'],
  pointed:['adjective','Narrowing to a sharp end or point.','He wore a pointed hat.'],
  beard:['noun','Hair growing on a man\'s chin and cheeks.','His beard was short.'],
  devilish:['adjective','Looking wicked or mischievous; sometimes strangely attractive.','He gave a devilish grin.'],
  determinedly:['adverb','In a very decided or deliberate way.','She walked determinedly forward.'],
  appealing:['adjective','Attractive or pleasing to someone.','The idea sounded appealing.'],
  handsome:['adjective','Good-looking or attractive.','He had a handsome face.'],
  severe:['adjective','Very serious, strict or harsh-looking.','The teacher had a severe expression.'],
  sinister:['adjective','Making you feel that something harmful or frightening might happen.','A sinister shadow crossed the wall.'],
  menacing:['adjective','Appearing threatening or dangerous.','He took a menacing step forwards.'],
  hard:['adjective','Firm or unyielding; in a description of a voice, it can suggest strictness.','His hard voice silenced the room.'],
  compare:['verb','Show how two things are similar or different.','Compare a whisper with a shout.'],
  simile:['writing technique','A comparison that uses like or as.','Her voice was like thunder.'],
  metaphor:['writing technique','A direct comparison saying one thing is another.','Her voice was thunder.'],
  adjective:['word class','A word that describes a noun.','The narrow path. Narrow is an adjective.'],
  verb:['word class','A word that expresses an action or state.','The door slammed. Slammed is a verb.'],
  noun:['word class','A word naming a person, place, thing or idea.','The door slammed. Door is a noun.'],
  effect:['exam word','The impression, picture or feeling created by a writer\'s choice.','The word slammed creates a sense of sudden noise.'],
  explain:['exam word','Say how or why something works. Give the connecting reason.','It suggests fear because trembling is shaking.'],
  suggests:['exam word','Makes us think something is likely, without always proving it.','Shaking hands suggest she may be nervous.'],
  conveys:['exam word','Communicates an impression or feeling.','The description conveys danger.'],
  impression:['exam word','The idea or feeling you form about someone or something.','He gave a frightening impression.'],
  alliteration:['writing technique','Repetition of the same starting consonant sound in nearby words.','Determinedly devilish repeats the d sound.'],
  contrast:['writing technique','A noticeable difference between two ideas.','He looked frightening, yet Ellen found him appealing.'],
  exaggeration:['writing technique','Making something seem bigger or more extreme than it really is.','His eyes appeared almost entirely black.'],
  personification:['writing technique','Describing a non-human thing as if it acts or feels like a person.','The wind whispered through the trees.'],
  evidence:['exam word','The word or detail that supports your idea.','"Trembled" is evidence of shaking.'],
  inference:['exam word','A reasonable conclusion drawn from clues rather than a fact stated directly.','Her shaking hands may suggest fear.'],
  analysis:['exam word','Looking closely at language and explaining how its choices work.','The writer chooses slammed to create a sudden loud sound.']
};

const lessons = [
  {
    id:'door',title:'A single powerful word',level:1,concept:'word-effect',minutes:5,
    quote:'The door slammed.',question:'Which word tells us HOW the door closed?',action:'identify and explain',target:'the word that describes how the door closed',
    vocabulary:['the','door','slammed'],
    options:[
      {text:'The',correct:false,part:'Definite article (determiner)',why:'"The" tells us WHICH door we are talking about. It does not tell us what noise the door made.'},
      {text:'door',correct:false,part:'Noun',why:'"Door" names a thing. A noun does not tell us how this door closed.'},
      {text:'slammed',correct:true,part:'Verb',why:'"Slammed" tells us the action. It helps us hear a sudden, loud bang, unlike the weaker word "closed".'}
    ],
    hints:['A noun names a thing. Which word names the thing?','The important word is the action word - the verb.','Picture the difference between closing a door gently and slamming it.'],
    sentence:['The writer','chooses the verb "slammed"','to describe how the door shuts','making us imagine a sudden loud bang.'],
    model:'The writer chooses the verb "slammed" to make us imagine the door closing suddenly with a loud bang.',
    weak:'"The door makes a noise."',whyBetter:'That idea is true, but it does not identify the writer\'s word or show how we know.',
    rubric:[['writer','verb'],['slammed','door'],['bang','loud','noise','sudden','force','quick']],exampleReason:'A stronger verb creates a clearer picture and sound.'
  },
  {
    id:'trembled',title:'Find the hidden feeling',level:1,concept:'word-inference',minutes:6,
    quote:'Her hands trembled.',question:'What MIGHT "trembled" suggest about the girl?',action:'infer from a word',target:'the girl\'s possible feelings',
    vocabulary:['her','hands','trembled','nervous','frightened'],
    options:[
      {text:'She might be frightened or nervous.',correct:true,part:'Supported inference',why:'"Trembled" means shook. People sometimes shake when frightened or nervous. We say "might" because cold can also make hands shake.'},
      {text:'She is definitely happy.',correct:false,part:'Unsupported certainty',why:'The sentence does not tell us that she is happy. "Definitely" is too strong when we have only one clue.'},
      {text:'She is running fast.',correct:false,part:'Unsupported action',why:'Running is not mentioned. Trembling is small shaking, not running.'}
    ],
    hints:['Find out what "trembled" means before guessing a feeling.','Shaking hands can be a sign of nerves, fear or cold.','Choose an answer that says "might" rather than claiming certainty.'],
    sentence:['The writer','uses the verb "trembled"','to show that her hands are shaking','which suggests that she might be frightened or nervous.'],
    model:'The writer uses the verb "trembled" to show that the girl\'s hands are shaking, suggesting that she might be nervous or frightened.',
    weak:'"The girl is scared."',whyBetter:'We need the clue, the link from shaking to a feeling, and careful wording because she might be cold.',
    rubric:[['writer','verb'],['trembl','shak','hands'],['nerv','fright','afraid','fear']],exampleReason:'An inference should be linked to a clue, not treated as a proven fact.'
  },
  {
    id:'whisper',title:'Hear the writer\'s words',level:1,concept:'word-effect',minutes:5,
    quote:'"Come here," she whispered.',question:'What does "whispered" tell us about her voice?',action:'explain a word',target:'the sound of her voice',
    vocabulary:['whisper','whispered','voice'],
    options:[
      {text:'She spoke very quietly.',correct:true,part:'Meaning of the verb',why:'Whispering means speaking very softly. The word tells us HOW she spoke.'},
      {text:'She shouted very loudly.',correct:false,part:'Opposite meaning',why:'Shouting is loud. Whispering is very quiet.'},
      {text:'She sang beautifully.',correct:false,part:'Different action',why:'Singing is not the same as whispering. We have no evidence that she sang.'}
    ],
    hints:['Think of your voice in a library.','A whisper is so quiet that someone far away may not hear it.','The answer is about volume, not how pretty the voice is.'],
    sentence:['The writer','uses the verb "whispered"','instead of the more ordinary "said"','to show that her voice is very quiet.'],
    model:'The writer chooses "whispered" rather than "said" to show that the woman is speaking very quietly.',
    weak:'"She speaks."',whyBetter:'It gives the action but not the special sound made by the word "whispered".',
    rubric:[['writer','verb'],['whisper','said'],['quiet','soft','low']],exampleReason:'Ask how the stronger word differs from the ordinary word said.'
  },
  {
    id:'growl',title:'What does growl mean?',level:1,concept:'vocabulary-inference',minutes:6,
    quote:'The man growled his reply.',question:'What sound does "growled" help us imagine?',action:'explain word effect',target:'the sound of the man\'s reply',
    vocabulary:['growl','growled','voice'],
    options:[
      {text:'A low, rough, angry-sounding voice.',correct:true,part:'Sound and possible emotion',why:'A growl is a low, rough rumbling sound. Comparing a voice to a growl makes it sound unfriendly or threatening.'},
      {text:'A soft and gentle whisper.',correct:false,part:'Different sound',why:'A whisper is quiet speech. A growl has a rough, rumbling quality.'},
      {text:'A high, cheerful singing voice.',correct:false,part:'Contrasting mood',why:'Growling does not suggest cheerful singing. It suggests something rough and low.'}
    ],
    hints:['Animals such as dogs sometimes growl. What does that sound like?','Think of a low, rough GRRR sound.','Now imagine a person speaking in that rough way.'],
    sentence:['The writer','uses the verb "growled"','to make the man\'s voice sound low and rough','suggesting that he might be angry or threatening.'],
    model:'The writer uses "growled" to make the man\'s voice sound low and rough, suggesting that he is angry or threatening.',
    weak:'"The man is angry."',whyBetter:'We need to show that the rough sound of a growl is the clue that suggests his mood.',
    rubric:[['growl','writer','verb'],['rough','low','rumbl'],['angry','threat','unfriendly']],exampleReason:'Understanding the literal sound is the bridge to the implied feeling.'
  },
  {
    id:'like-thunder',title:'Meet the simile',level:2,concept:'simile',minutes:7,
    quote:'His voice was like thunder.',question:'What two things does the writer compare?',action:'identify a comparison',target:'voice and thunder',
    vocabulary:['voice','thunder','simile','compare'],
    options:[
      {text:'His voice and thunder.',correct:true,part:'Simile',why:'The word "like" compares the man\'s voice with the sound of thunder. Both can sound very loud and powerful.'},
      {text:'His face and thunder.',correct:false,part:'Wrong target',why:'The sentence mentions his VOICE, not his face.'},
      {text:'The man and the sky.',correct:false,part:'Wrong comparison',why:'The writer compares the SOUNDS. It does not compare the person with the sky.'}
    ],
    hints:['Find the word "like". It joins two things.','One side is his voice. What comes after "like"?','Thunder is a loud sound. What might that tell you about his voice?'],
    sentence:['The writer','uses a simile to compare his voice with thunder','so we imagine a very loud sound','making the man seem powerful.'],
    model:'The writer uses a simile to compare his voice to thunder. This suggests that his voice is very loud and powerful.',
    weak:'"The writer uses a simile."',whyBetter:'Naming the technique is only the start. Explain the two things compared and the effect.',
    rubric:[['simile','like','compare'],['voice','thunder'],['loud','power','booming']],exampleReason:'Say what is compared, then what the comparison makes us imagine.'
  },
  {
    id:'is-thunder',title:'Meet the metaphor',level:2,concept:'metaphor',minutes:7,
    quote:'His voice was thunder.',question:'Why is this a metaphor rather than a simile?',action:'name and explain',target:'the direct comparison',
    vocabulary:['voice','thunder','metaphor','simile'],
    options:[
      {text:'It directly describes his voice as thunder.',correct:true,part:'Metaphor',why:'A metaphor says one thing IS another. There is no "like" or "as".'},
      {text:'It uses the word "like".',correct:false,part:'Simile confusion',why:'There is no "like" in this sentence. "His voice was LIKE thunder" would be a simile.'},
      {text:'It does not compare anything.',correct:false,part:'Missed comparison',why:'It compares the voice with thunder, even though a voice cannot literally be weather.'}
    ],
    hints:['Is the voice literally a storm? No.','The writer says the voice WAS thunder, not LIKE thunder.','This is a direct comparison: a metaphor.'],
    sentence:['The writer','uses a metaphor, describing his voice as thunder','to make us imagine a loud crashing sound','so the man seems forceful.'],
    model:'The writer uses a metaphor, describing his voice as thunder. This makes us imagine a loud, powerful sound.',
    weak:'"His voice is actually thunder."',whyBetter:'The comparison is imaginative rather than literally true.',
    rubric:[['metaphor','compare','describ'],['voice','thunder'],['loud','power','strong','crash']],exampleReason:'In a metaphor, we do not need to define the term in the answer; show how the comparison works.'
  },
  {
    id:'the-door-burst',title:'Why does one word matter?',level:2,concept:'word-effect',minutes:7,
    quote:'The door burst open.',question:'Why is "burst" stronger than simply saying "opened"?',action:'compare word choices',target:'the effect of burst',
    vocabulary:['the','door','closed','slammed','effect'],
    options:[
      {text:'It makes the opening seem sudden and forceful.',correct:true,part:'Word effect',why:'"Burst" suggests something forceful and quick. "Opened" gives fewer details about HOW the door moved.'},
      {text:'It tells us the colour of the door.',correct:false,part:'Irrelevant detail',why:'There is no colour word here.'},
      {text:'It proves the door is made of wood.',correct:false,part:'Unsupported guess',why:'Nothing tells us what the door is made of.'}
    ],
    hints:['Imagine opening a door slowly and gently.','Now imagine a door bursting open. Which feels faster?','Ask what burst adds that opened does not.'],
    sentence:['The writer','uses the verb "burst" instead of "opened"','to show a sudden, forceful movement','making the moment seem surprising.'],
    model:'The writer uses the verb "burst" to make the door\'s opening seem sudden and forceful, which creates a moment of surprise.',
    weak:'"The door opens."',whyBetter:'The answer must explain the extra impression produced by the specific word burst.',
    rubric:[['burst','verb','writer'],['sudden','quick','fast','force'],['surpris','shock']],exampleReason:'Comparing a powerful word with a simple alternative reveals its effect.'
  },
  {
    id:'wind-clawed',title:'Give the wind a character',level:2,concept:'personification',minutes:8,
    quote:'The wind clawed at the shutters.',question:'What picture does "clawed" create?',action:'explain imagery',target:'the threatening impression of the wind',
    vocabulary:['personification','effect','verb'],
    options:[
      {text:'An animal scratching or attacking.',correct:true,part:'Image',why:'Claws belong to animals. The word makes the wind seem as if it is attacking the shutters.'},
      {text:'A very gentle breeze.',correct:false,part:'Opposite effect',why:'Clawing is rough and violent rather than gentle.'},
      {text:'Someone cleaning the windows.',correct:false,part:'Unsupported action',why:'Nothing here refers to cleaning. The key idea is scratching or attacking.'}
    ],
    hints:['Which animals have claws?','What might they do with claws when angry?','Imagine the wind as an animal trying to break in.'],
    sentence:['The writer','uses the verb "clawed" to describe the wind','as if it were an attacking animal','making it seem aggressive and threatening.'],
    model:'The writer uses "clawed" to make the wind seem like an animal attacking the shutters, creating a threatening impression.',
    weak:'"The wind is blowing hard."',whyBetter:'That misses the picture of scratching claws, which is how the writer makes the wind seem aggressive.',
    rubric:[['claw','verb','writer'],['animal','scratch','attack'],['threat','danger','aggress']],exampleReason:'The effect comes from imagining the animal action, not simply naming a technique.'
  },
  {
    id:'dulwich-voice',title:'Dulwich Q2(c): the voice',level:3,concept:'simile',minutes:10,source:'Dulwich College specimen paper A, question 2(c)',
    quote:'His voice sounded like a hammer striking an anvil.',question:'How does the writer make the man\'s voice sound powerful?',action:'explain how',target:'the sound and impression of the man\'s voice',
    vocabulary:['voice','hammer','striking','anvil','simile'],
    options:[
      {text:'A loud, harsh ringing voice that sounds commanding.',correct:true,part:'Strong explanation',why:'A hammer hitting an anvil makes a loud metallic clang. That sound makes his voice seem harsh and forceful.'},
      {text:'His voice was made of metal.',correct:false,part:'Too literal',why:'A simile compares sounds; it does not mean the voice literally contains metal.'},
      {text:'The writer uses a simile.',correct:false,part:'Only names technique',why:'That is true, but it does not EXPLAIN what the simile achieves. Name the comparison and its effect.'}
    ],
    hints:['Do you know what an anvil is? Tap "anvil" above.','What noise happens when metal is hit with a hammer?','Connect that loud clang to the man\'s voice, then his character.'],
    sentence:['The writer','uses a simile comparing the man\'s voice to a hammer striking an anvil','making us hear a loud, harsh metallic sound','which makes him seem powerful and commanding.'],
    model:'The writer uses a simile comparing the man\'s voice to a hammer striking an anvil. This makes his voice sound loud and harsh, suggesting that he is powerful and commanding.',
    weak:'"His voice is very loud."',whyBetter:'It gives the effect but misses the comparison, the metallic sound and how that creates the impression.',
    rubric:[['simile','compare','like'],['hammer','anvil','metal'],['loud','harsh','clang','ring','power','command']],exampleReason:'First name the comparison, then the sound, then the character impression.'
  },
  {
    id:'dulwich-eyes',title:'Dulwich Q2(b): the eyes',level:3,concept:'metaphor',minutes:10,source:'Dulwich College specimen paper A, question 2(b)',
    quote:'His eyes seemed to be all pupil, cold, black forest pools.',question:'How does the writer make the man\'s eyes seem unsettling?',action:'explain how',target:'the impression created by the description of his eyes',
    vocabulary:['pupil','cold','forest','pools','metaphor','exaggeration'],
    options:[
      {text:'They seem dark, cold and hard to understand.',correct:true,part:'Reasonable effect',why:'Dark forest pools can be deep and difficult to see into. His eyes seem mysterious and unsettling.'},
      {text:'He lives in a forest.',correct:false,part:'Literal misunderstanding',why:'The writer compares his eyes to pools. It is not evidence that he lives in a forest.'},
      {text:'The writer has told us his favourite colour.',correct:false,part:'Irrelevant conclusion',why:'The description concerns his eyes, not his favourite colour.'}
    ],
    hints:['Picture a very dark, still forest pool.','Can you see into the bottom of it easily?','What might eyes like that tell us about the man\'s expression?'],
    sentence:['The writer','uses a metaphor comparing the man\'s eyes with dark forest pools','making them seem deep, cold and difficult to read','so the man seems mysterious and threatening.'],
    model:'The writer uses a metaphor comparing the man\'s eyes to dark forest pools. This makes them seem cold, deep and difficult to read, so he appears mysterious and threatening.',
    weak:'"The man has black eyes."',whyBetter:'The colour alone misses the metaphor and the mystery of dark pools that are hard to see into.',
    rubric:[['metaphor','compare','pools'],['eyes','black','dark','forest'],['myster','cold','deep','threat','fright','read']],exampleReason:'Move from the picture of the pool to what it suggests about the man.'
  },
  {
    id:'dulwich-face',title:'Dulwich Q2(a): his face',level:3,concept:'adjectives-contrast',minutes:12,source:'Dulwich College specimen paper A, question 2(a)',
    quote:'His ridged cheekbones, arched eyebrows and pointed beard gave him a determinedly devilish aspect that Ellen found rather appealing.',
    question:'How do the describing words make the man seem dangerous but attractive?',action:'explain how',target:'the contrasting impression of the man\'s appearance',
    vocabulary:['ridged','cheekbones','arched','eyebrows','pointed','beard','determinedly','devilish','appealing','contrast','alliteration'],
    options:[
      {text:'His sharp-looking features seem slightly dangerous, yet Ellen likes his appearance.',correct:true,part:'Contrast',why:'"Ridged", "arched" and "pointed" create sharp shapes. "Appealing" tells us Ellen still finds him attractive.'},
      {text:'He is definitely the Devil.',correct:false,part:'Too literal',why:'"Devilish" describes an impression. It does not literally prove he is the Devil.'},
      {text:'He is ugly and nobody likes him.',correct:false,part:'Contradicted by the text',why:'The writer says Ellen finds him "appealing", which means attractive.'}
    ],
    hints:['Picture a sharp point and a soft circle. Which looks harsher?','The adjectives give his face sharp shapes. Does Ellen dislike him?','"Appealing" means attractive: can he seem dangerous AND handsome?'],
    sentence:['The writer','uses adjectives such as "ridged", "arched" and "pointed"','to make his face seem sharp and threatening','but Ellen still finds him "appealing", showing a contrast.'],
    model:'The writer uses adjectives such as "ridged", "arched" and "pointed" to make the man\'s face seem sharp and threatening. However, Ellen finds him "appealing", so he seems both dangerous and attractive.',
    weak:'"The man is scary."',whyBetter:'A better answer quotes the adjectives, explains what shape they suggest and notices the surprising word appealing.',
    rubric:[['ridged','arched','pointed','adjective'],['sharp','threat','danger','stern','fright'],['appeal','attract','handsome','contrast','yet','however']],exampleReason:'It is okay to notice two different impressions at once.'
  },
  {
    id:'dulwich-overall',title:'Dulwich Q2(d): overall impression',level:3,concept:'overall-judgement',minutes:12,source:'Dulwich College specimen paper A, question 2(d)',
    quote:'His vast ruff and tall black hat, its huge feathers nodding, the plume of some Greek warrior.',question:'What overall impression do these clothes give of the man?',action:'give an overall impression',target:'his showy appearance and apparent importance',
    vocabulary:['impression','handsome','severe'],
    options:[
      {text:'He wants to look grand, important and rather dramatic.',correct:true,part:'Supported judgement',why:'The unusually large ruff, tall hat and feathers make his appearance theatrical and attention-grabbing.'},
      {text:'He is a poor farmer wearing plain work clothes.',correct:false,part:'Contradicted description',why:'The extravagant clothes suggest showiness, not plain farming clothes.'},
      {text:'The hat proves he is a Greek warrior.',correct:false,part:'Takes comparison literally',why:'The plume is compared to that of a Greek warrior; it does not establish his identity.'}
    ],
    hints:['Imagine a hat with giant feathers. Would it attract attention?','Does his outfit seem plain or grand?','What might he want other people to think of him?'],
    sentence:['The writer','describes his tall hat and huge feathers','to show that he dresses in a dramatic, attention-seeking way','making him seem proud and important.'],
    model:'The writer describes the man\'s tall hat and huge feathers to make him look dramatic and important, as though he enjoys showing off his authority.',
    weak:'"He wears a hat."',whyBetter:'We need the extraordinary detail of the hat and why it affects our impression.',
    rubric:[['hat','feather','ruff','plume'],['big','huge','tall','vast','dramatic','grand'],['important','show','proud','authorit','attention']],exampleReason:'An overall impression combines several details into one supported idea.'
  }
];
export const LESSONS = lessons;
export const LEVELS = {1:'Start here',2:'Build the skill',3:'Dulwich exam practice'};
export const LESSON_BY_ID = Object.fromEntries(lessons.map(x=>[x.id,x]));