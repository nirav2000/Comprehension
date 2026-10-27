// Learner-device pairing: a limited anonymous Firebase identity, approved by parent.
// It writes append-only answer documents and cannot read other family records.
import {firebaseConfig,OWNER_UID} from 'https://nirav2000.github.io/Next/firebase-config.js';
const OPT='comprehension-child-sync-v1', DONE='comprehension-child-synced-v1', FBASE=['families',OWNER_UID,'learners','sai'];
let sdk=null,user=null,busy=false,enabled=localStorage.getItem(OPT)==='yes',lastStatus='Not paired';
const status=s=>{lastStatus=s;window.dispatchEvent(new CustomEvent('comprehension-learner-status',{detail:{status:s,uid:user?.uid||'',approved:s.includes('Approved')}}))};
const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}};
function digest(value){const raw=JSON.stringify(value);let h=2166136261;for(let i=0;i<raw.length;i++)h=Math.imul(h^raw.charCodeAt(i),16777619);return (h>>>0).toString(36)}
function records(){
 const out=[];
 const main=readJSON('comprehension-answer-ladder-v1',[]);
 for(const r of main)if(r.answer&&r.lessonId){
   const base={title:r.title||'Answer Ladder',lessonId:r.lessonId,answer:r.answer,date:r.date||Date.now(),choice:r.choice??-1};
   out.push({...base,kind:'answer'});
   if(r.aiFeedback)out.push({...base,kind:'feedback',feedbackText:JSON.stringify(r.aiFeedback).slice(0,3000)});
 }
 const explain=readJSON('comprehension-explain-v2',null);
 for(const r of explain?.attempts||[])if(r.answer)out.push({title:'Explain: '+r.lessonId,lessonId:'explain-'+r.lessonId,answer:r.answer,date:r.timestamp||Date.now(),choice:r.choice??-1,kind:'answer'});
 const quick=readJSON('comprehension:quick-practice:v0.2.0',{});
 for(const [k,r] of Object.entries(quick))if(r.answer)out.push({title:'Quick practice '+(Number(k)+1),lessonId:'quick-'+k,answer:r.answer,date:r.answerAt||Date.now(),choice:r.choice??-1,kind:'answer'});
 return out;
}
async function getSDK(){if(sdk)return sdk;const [A,Auth,F]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js')]);const app=A.getApps().find(x=>x.name==='comprehension-learner')||A.initializeApp(firebaseConfig,'comprehension-learner');const auth=Auth.getAuth(app);await Auth.setPersistence(auth,Auth.browserLocalPersistence);await auth.authStateReady();sdk={Auth,F,auth,db:F.getFirestore(app)};return sdk}
async function init(){if(!enabled)return null;const x=await getSDK();user=x.auth.currentUser;if(!user){user=(await x.Auth.signInAnonymously(x.auth)).user}if(user.uid===OWNER_UID||!user.isAnonymous)throw Error('Use a learner device account, not the parent sign-in.');status('Device ID ready: '+user.uid);return user}
async function approved(){if(!enabled||!user)return false;const x=await getSDK();try{const d=await x.F.getDoc(x.F.doc(x.db,...FBASE,'approvedDevices',user.uid));if(d.exists()&&d.data()?.role==='learner'&&d.data()?.app==='comprehension'){status('Approved learner device · '+user.uid);return true}status('Awaiting parent approval · '+user.uid);return false}catch(e){status('Membership check unavailable · '+String(e.code||e.message).slice(0,80));return false}}
async function enable(){localStorage.setItem(OPT,'yes');enabled=true;try{await init();await approved();await sync();return user?.uid||''}catch(e){status('Pairing unavailable: '+String(e.code||e.message).slice(0,130));throw e}}
async function sync(){if(!enabled||busy)return;busy=true;try{await init();if(!await approved())return;const x=await getSDK(),done=readJSON(DONE,{}),queue=records();let count=0;for(const r of queue){const id='sai-'+user.uid.slice(0,12)+'-'+digest([r.kind,r.lessonId,r.date,r.answer,r.feedbackText||'']);if(done[id])continue;const data={app:'comprehension',schema:1,kind:r.kind,learner:'sai',title:String(r.title).slice(0,180),lessonId:String(r.lessonId).slice(0,120),answer:String(r.answer).slice(0,4000),date:Number(r.date)||Date.now(),choice:Number.isFinite(Number(r.choice))?Number(r.choice):-1,originUid:user.uid,createdAt:x.F.serverTimestamp()};if(r.kind==='feedback')data.feedbackText=r.feedbackText;try{await x.F.setDoc(x.F.doc(x.db,...FBASE,'events',id),data);done[id]=Date.now();localStorage.setItem(DONE,JSON.stringify(done));count++}catch(e){if(e.code==='permission-denied'){status('Sync blocked: parent approval or Firebase permission required');return}throw e}}status('Approved learner device · '+queue.length+' answers recorded'+(count?' · '+count+' uploaded':''))}catch(e){status('Learner sync unavailable: '+String(e.code||e.message).slice(0,130))}finally{busy=false}}
function device(){return {enabled,uid:user?.uid||'',status:lastStatus}}
async function getApprovedUser(){if(!enabled){return null}await init();return await approved()?user:null}
window.ComprehensionLearnerSync={enable,sync,device,getApprovedUser};
let syncDelay=null;window.addEventListener('comprehension-local-saved',()=>{if(enabled){clearTimeout(syncDelay);syncDelay=setTimeout(()=>sync().catch(()=>{}),3500)}});
window.addEventListener('online',()=>{if(enabled)sync().catch(()=>{})});
window.addEventListener('visibilitychange',()=>{if(!document.hidden&&enabled)sync().catch(()=>{})});
if(enabled)enable().catch(()=>{});
