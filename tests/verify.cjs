const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');process.chdir(path.join(__dirname,'..'));
let checks=0;function ok(value,message){checks++;assert.ok(value,message)}
const files=['curriculum','skills-content','skills-course','textbook','sprint','core'];
const context={console,Date,URL,Blob,setTimeout:()=>0,clearTimeout:()=>{},setInterval:()=>0};context.window=context;
vm.createContext(context);for(const f of files)vm.runInContext(fs.readFileSync('dist/'+f+'.js','utf8'),context,{filename:f});
const course=context.GERMAN_COURSE,C=context.KLEIN_CORE,S=context.GERMAN_SPRINT;
ok(course.lessons.length===46,'46 complete lessons');ok(course.topics.length===22,'22 requested theory topics');ok(S.days.length===21,'21 study days');
ok(new Set(course.lessons.map(l=>l.id)).size===46,'unique IDs');
ok(course.book.chapters[2].title==='In Hamburg','correct uploaded edition');ok(course.book.pdfPages===176,'PDF verified page count');
const state=C.defaults();
for(const l of course.lessons){
 ok(l.cards.length===2,l.id+' has two teaching passes');
 for(const c of l.cards){ok(c.examples.length>=2,l.id+' two examples per pass');for(const x of c.examples)ok(x.de&&x.en&&x.why,l.id+' explained example');}
 ok(l.practice.length===5&&l.basePracticeCount===3,l.id+' three drills + reading + writing');
 ok(l.practice[3].skill==='reading'&&l.practice[4].skill==='writing',l.id+' four-skill lesson flow');
 ok(l.theory&&l.reading.questions.length===3&&l.writing,l.id+' theory and labs');
 state.progress[l.id]={step:7,correct:[],blindCorrect:true,completedAt:null};
 ok(!C.finish(state,l),l.id+' blocked before practice');
 state.progress[l.id].correct=[0,1,2,3,4];state.progress[l.id].blindCorrect=false;
 ok(!C.finish(state,l),l.id+' blocked before blind answer');
 for(const q of [...l.practice,l.blind]){const a=q.type==='choice'?q.answer:q.type==='build'?q.answer.join(' '):q.answers[0];ok(C.isCorrect(q,a),l.id+' canonical answer');if(q.type!=='choice')ok(!C.isCorrect(q,'unrelated answer'),l.id+' rejects unrelated answer');}
 for(const q of l.reading.questions)ok(C.isCorrect(q,q.answer),l.id+' reading meaning');
 for(const a of l.writing.answers)ok(C.writingFeedback(l.writing,a).correct,l.id+' accepted writing form');
 state.progress[l.id].blindCorrect=true;ok(C.finish(state,l),l.id+' finishes only after all checks');
 const count=Object.values(state.days).reduce((n,d)=>n+d.lessons,0);C.finish(state,l);ok(count===Object.values(state.days).reduce((n,d)=>n+d.lessons,0),'repeat does not inflate lessons');
}
const legacy=JSON.parse(JSON.stringify(state));delete legacy.sprint;const migrated=C.clean(legacy,course);
ok(Object.keys(migrated.progress).length===46,'legacy progress preserved');ok(migrated.sprint.timer.remaining===1500,'new plan migrates without reset');
for(const d of S.days){
 ok(d.minutes===260,'explicit daily time budget');
 ok(d.lessonIds.every(id=>course.lessons.some(l=>l.id===id)),'all daily lessons exist');
 ok(!d.lessonIds.some(id=>course.book.laterIds.includes(id)),'advanced material outside A1 route');
 const qs=S.retrieval(d);ok(qs.length===3,'three daily retrieval tasks');for(const q of qs)ok(C.isCorrect(q,q.answers[0]),'retrieval canonical answer');
 const v=state.sprint.days[d.number]=S.entry();ok(!S.finish(state,d.number),'day cannot finish from lesson count');
 v.book=true;v.native=true;v.speaking=[0,1,2];v.writingChecks=[0,1,2];v.draft='Hallo Ben. Ich lerne Deutsch und wohne in Berlin. Am Montag habe ich einen Kurs. Können wir uns am Freitag treffen? Ich habe um zehn Uhr Zeit. Bitte schreib mir bald. Viele Grüße, Atish';
 for(const id of d.readingIds){state.skills.reading[id]={correct:[0,1,2],doneAt:null};state.skills.writing[id]={draft:'x',passed:true,doneAt:null};state.sprint.listening[id]={correct:[0,1,2]};}
 v.exam={reading:'80',listening:'80',writing:'80',speaking:[0,1,2,3]};
 ok(!S.finish(state,d.number),'daily blind answers required separately');v.retrieval=[0,1,2];ok(S.finish(state,d.number),'complete day can finish');
 v.native=false;ok(!S.ready(state,d),'native practice required');v.native=true;
 if(d.phase!=='Check'){v.speaking=[];ok(!S.ready(state,d),'speaking is required');v.speaking=[0,1,2];}
}
const restored=C.clean(JSON.parse(JSON.stringify(state)),course);ok(Object.keys(restored.sprint.days).length===21,'daily progress export round trip');ok(S.data(restored,21).exam.speaking.length===4,'speaking evidence preserved');
const corrupt=JSON.parse(JSON.stringify(state));corrupt.sprint.days[1].retrieval=[0,0,1,2,3,-1,'x'];corrupt.sprint.days[21].exam.reading='101';corrupt.sprint.timer.remaining=999999;
const cleaned=C.clean(corrupt,course);ok(cleaned.sprint.days[1].retrieval.length===3,'import validates retrieval IDs');ok(cleaned.sprint.days[21].exam.reading==='','import validates percentages');ok(cleaned.sprint.timer.remaining===1500,'import bounds timer');
// Run the actual application event handlers without a browser. UI QA is separate.
const elements=new Map(),events={},rootEvents={};
const element=id=>{if(!elements.has(id))elements.set(id,{id,value:'',innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){}},setAttribute(){},focus(){},click(){},setSelectionRange(){},querySelector(){return null},querySelectorAll(){return []},addEventListener(name,fn){(id==='app'?rootEvents:events)[name]=fn}});return elements.get(id)};
let hash='';context.location={get hash(){return hash},set hash(v){hash=v.startsWith('#')?v:'#'+v;events.hashchange?.()}};
context.document={getElementById:element,body:{classList:{toggle(){}}},querySelector:()=>null,querySelectorAll:()=>[],addEventListener(name,fn){events['doc-'+name]=fn}};
context.addEventListener=(name,fn)=>events[name]=fn;context.scrollTo=()=>{};context.requestAnimationFrame=fn=>fn();
const store=new Map();context.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
vm.runInContext(fs.readFileSync('dist/sprint-ui.js','utf8'),context);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),context);
const html=()=>element('app').innerHTML;
const click=(action,dataset={})=>rootEvents.click({target:{closest:()=>({dataset:{action,...dataset},disabled:false})}});
const goto=r=>context.location.hash=r;
const saved=()=>JSON.parse(store.get('klein-german-v1'));
ok(html().includes('A1. One day at a time.'),'new home renders');click('sprint-start');ok(hash==='#lesson/hello','Start goes directly to first lesson');
for(const l of course.lessons){
 click('start',{id:l.id});
 // It may be the already-active first lesson, but no lesson has completed yet.
 ok(html().includes('Learn 1 of 2'),'first teaching pass rendered');click('next-step');ok(html().includes('Learn 2 of 2'),'second pass rendered');click('next-step');
 for(let i=0;i<l.practice.length;i++){
  const q=l.practice[i],before=saved().progress[l.id].step;
  click('next-step');ok(saved().progress[l.id].step===before,'cannot skip practice via handler');
  if(q.type==='choice')click('choice',{value:String(q.answer)});
  else if(q.type==='build'){const used=[];for(const token of q.answer){const idx=q.tokens.findIndex((t,i)=>t===token&&!used.includes(i));used.push(idx);click('add-token',{value:String(idx)});}}
  else element('type-answer').value=q.answers[0];
  click('check');ok(saved().progress[l.id].correct.includes(i),l.id+' practice '+i+' '+q.type+' correct answer recorded');click('next-step');
 }
 ok(html().includes('Blind try · Just you'),'blind stage reached');ok(!html().includes('data-action="hint"')&&!html().includes('data-action="reveal"'),'blind stage has no hints');
 element('type-answer').value='not correct';click('check');click('next-step');ok(!saved().progress[l.id].completedAt,'wrong blind cannot finish');
 element('type-answer').value=l.blind.answers[0];click('check');click('next-step');ok(saved().progress[l.id].completedAt,'full lesson sequence finishes');
}
for(const r of ['today','plan','textbook','more','theory','reading','writing','listening','review','settings',...S.days.map(d=>'day/'+d.number),...course.book.chapters.map(c=>'textbook/'+c.number),...course.book.chapters.map(c=>'listening/'+c.id),...course.lessons.flatMap(l=>['theory/'+l.id,'reading/'+l.id,'writing/'+l.id])]){goto(r);ok(html().length>500,r+' renders');ok(!html().includes('undefined'),r+' no missing content');}
goto('day/1');element('day-draft').value='Hallo, ich lerne Deutsch.';element('day-draft').dataset={day:'1'};rootEvents.input({target:element('day-draft')});ok(saved().sprint.days[1].draft==='Hallo, ich lerne Deutsch.','daily draft saves');
click('timer-toggle');ok(saved().sprint.timer.endsAt>Date.now(),'timer starts');click('timer-toggle');ok(saved().sprint.timer.endsAt===null,'timer pauses');click('timer-break');ok(saved().sprint.timer.remaining===300,'break is five minutes');
const htmlFile=fs.readFileSync('dist/index.html','utf8');for(const match of htmlFile.matchAll(/(?:src|href)="([\w-]+\.(?:css|js))"/g))ok(fs.existsSync('dist/'+match[1]),'runtime asset exists: '+match[1]);
console.log(`${checks} checks passed: 46 full lesson flows, 21-day gates, all views, migration, drafts and timer.`);
