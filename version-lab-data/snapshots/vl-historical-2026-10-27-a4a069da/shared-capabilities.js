// Shared libraries installed in migration-safe shadow mode.
// Existing app-specific Firebase parent/learner authorities remain the source of truth.
import {Auth} from 'https://nirav2000.github.io/Apps/auth/v1/index.js';
import {LearningSync} from 'https://nirav2000.github.io/Apps/learning-sync/v1/index.js';
import {createLearningStore} from 'https://nirav2000.github.io/Apps/learning/v1/index.js';
const APP='comprehension', LEARNER='sai';
const LS_KEY='comprehension-shared-learning-captured-v1';
const META='comprehension-shared-learning-status';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch{return f}};
const status=(message)=>{window.ComprehensionSharedStatus={message,auth:Auth.snapshot(),learningSync:sync?.status?.()||null};window.dispatchEvent(new CustomEvent('comprehension-shared-status',{detail:window.ComprehensionSharedStatus}))};
let sync=null,store=null,previous=new Set(read(LS_KEY,[]));
function rows(){
 const out=[];
 const explain=read('comprehension-explain-v2',{}).attempts||[];
 for(const a of explain)if(a.id)out.push({key:'explain:'+a.id,concept:'english:'+(a.concept||a.lessonId||'explain'),correct:!!a.independent,hints:Number(a.hints)||0,durationMs:Number(a.seconds||0)*1000,mode:'explain',context:{lessonId:a.lessonId||'',entryMode:a.entryMode||''}});
 const ladder=read('comprehension-answer-ladder-v1',[]);
 for(const a of ladder)if(a.answer)out.push({key:'ladder:'+[a.lessonId,a.date,a.answer].join(':'),concept:'english:'+(a.lessonId||'explain'),correct:false,hints:0,mode:'answer-draft',context:{lessonId:a.lessonId||'',feedback:!!a.aiFeedback}});
 const quick=read('comprehension:quick-practice:v0.2.0',{});
 for(const [k,a] of Object.entries(quick))if(a.answer)out.push({key:'quick:'+k+':'+a.answerAt+':'+a.answer,concept:'english:quick-'+k,correct:false,hints:0,mode:'quick-draft',context:{question:k}});
 return out;
}
function capture(){
 if(!store||!sync)return;
 const newest=rows().filter(r=>!previous.has(r.key));
 if(!newest.length)return;
 for(const r of newest){
   store.record({concept:r.concept,correct:r.correct,hints:r.hints,durationMs:r.durationMs||0,mode:r.mode,context:r.context});
   previous.add(r.key);
 }
 sync.capture(store.getState());
 localStorage.setItem(LS_KEY,JSON.stringify([...previous].slice(-4500)));
 status('Shared learning evidence captured locally; cloud transport remains restricted to authenticated matching-owner accounts.');
}
async function boot(){
 try{
   const legacy=window.AppsAuth?.snapshot?.()?.effectiveUser||null;
   await Auth.init({appId:APP,mode:'shadow',migration:{phase:'shadow',authority:'legacy'},appAdapter:{init:()=>({user:legacy,roles:[]}),onChange:(callback)=>{const on=e=>callback(e.detail?.effectiveUser||null,[]);window.addEventListener('apps-auth:change',on);return()=>window.removeEventListener('apps-auth:change',on)}}});
   store=createLearningStore({appId:APP,learnerId:LEARNER});
   sync=LearningSync.create({appId:APP,learnerId:LEARNER,accountId:'guest'});
   // Existing Learning SDK storage may predate Learning Sync; capture safely without
   // importing prior guest data into a newly authenticated owner.
   sync.capture(store.getState());
   capture();
   window.addEventListener('comprehension-local-saved',capture);
   window.addEventListener('comprehension-history-loaded',capture);
   status('Shared Auth shadow mode, Learning SDK and Learning Sync enabled locally');
 }catch(e){status('Shared integration unavailable; original answer storage retained. '+String(e.message||e))}
}
window.ComprehensionShared={get auth(){return Auth},get learningStore(){return store},get learningSync(){return sync},capture,status:()=>window.ComprehensionSharedStatus};
boot();
