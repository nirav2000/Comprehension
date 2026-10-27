import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LESSONS,LESSON_BY_ID,LEVELS,GLOSSARY} from '../explain-data.js';

const html=readFileSync(new URL('../explain.html',import.meta.url),'utf8');
const source=readFileSync(new URL('../explain.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../explain.css',import.meta.url),'utf8');

test('all lesson content is valid and progresses from easy to difficult',()=>{
  assert.ok(LESSONS.length>=12);
  assert.equal(Object.keys(LESSON_BY_ID).length,LESSONS.length);
  assert.deepEqual([...new Set(LESSONS.map(l=>l.level))],[1,2,3]);
  for(const l of LESSONS){
    assert.ok(l.id&&l.title&&l.quote&&l.question&&l.action&&l.target&&l.model,l.id);
    assert.ok(l.vocabulary.length>0,l.id);
    assert.ok(l.options.length>=3,l.id);
    assert.equal(l.options.filter(o=>o.correct).length,1,l.id);
    assert.ok(l.options.every(o=>o.text&&o.part&&o.why),l.id);
    assert.equal(l.sentence.length,4,l.id);
    assert.equal(l.rubric.length,3,l.id);
    assert.ok(l.hints.length>=3,l.id);
    assert.ok(l.whyBetter&&l.weak,l.id);
    for(const word of l.vocabulary)assert.ok(GLOSSARY[word.toLowerCase()],`No glossary definition for ${word} in ${l.id}`);
  }
});

test('language analysis uses an accurate worked example',()=>{
  const q=LESSON_BY_ID['dulwich-voice'];
  assert.ok(/simile/i.test(q.model));
  assert.ok(/hammer/i.test(q.model));
  assert.ok(/loud/i.test(q.model));
  assert.ok(/powerful/i.test(q.model));
  assert.ok(/metaphor/i.test(LESSON_BY_ID['dulwich-eyes'].model));
});

test('uses dark green theme, progressive stages and iOS speech fallbacks',()=>{
  assert.ok(css.includes('--green:#0eab83'));
  for(const label of ['Understand','Choose','Build','Speak & write'])assert.ok(html.includes(label));
  for(const feature of ['MediaRecorder','getUserMedia','webkitSpeechRecognition','Dictate to text','indexedDB','exportICS','addToNext','renderParent','startLearningSDK'])assert.ok(source.includes(feature)||html.includes(feature),feature);
  assert.ok(html.includes('https://nirav2000.github.io/Apps/apps-auth.js'));
  assert.ok(html.includes('explain.js'));
});

test('never locks a learner out for a wrong answer',()=>{
  assert.ok(source.includes('session.choiceHistory.push(session.choice)'));
  assert.ok(source.includes('Not quite — here is the right answer.'));
  assert.ok(source.includes('Show worked example'));
  assert.ok(source.includes('Show')&&source.includes('model answer'));
});