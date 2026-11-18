const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
let checks=0;const ok=(v,message)=>{checks++;assert.ok(v,message);},equal=(a,b,message)=>{checks++;assert.deepEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)),message);};
const course={book:{chapters:Array.from({length:12},(_,i)=>({number:i+1,title:'Chapter '+(i+1),goal:'Use chapter '+(i+1)}))},words:[],lessons:[{id:'a1-01'}],fullLessons:[]};
const question=(id,n)=>({type:'type',prompt:id+' independent context '+n,answers:['Antwort '+n]});
for(let chapter=1;chapter<=12;chapter++)for(let n=1;n<=6;n++){
 const id='c'+String(chapter).padStart(2,'0')+'-'+String(n).padStart(2,'0'),wid=id+'-w';
 course.words.push({id:wid,de:'Wort',en:'word'});course.fullLessons.push({id,title:id,chapter,part:n<=3?1:2,words:[wid],retrieval:[0,1,2].map(i=>question(id,i)),blind:question(id,'main'),speaking:['one','two','three']});
}
for(const day of [7,14,21,28,29,30,31,32,33,34,35]){const id='m'+String(day).padStart(2,'0');course.fullLessons.push({id,title:id,kind:'mission',day,words:[],retrieval:[0,1,2].map(i=>question(id,i)),openWriting:{prompt:'Write the mission message.',minWords:35}});}
const context={window:{GERMAN_COURSE:course},Date};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/sprint.js'),'utf8'),context);const S=context.window.GERMAN_SPRINT;
const state=()=>({progress:{},skills:{reading:{},writing:{}},sprint:S.defaults()});
const makeReady=(s,d)=>{
 const v=s.sprint.days[d.number]=S.entry();v.draft=Array(d.minWords).fill('Wort').join(' ');v.speakingNotes='I spoke from memory and checked pronunciation.';v.speaking=[0,1,2];v.writingChecks=[0,1,2];v.retrieval=[0,1,2];
 for(const id of d.lessonIds){s.progress[id]={completedAt:'2026-11-05T00:00:00.000Z'};s.skills.reading[id]={correct:[0,1,2]};s.skills.writing[id]={passed:true};s.sprint.listening[id]={correct:[0,1,2]};}
 for(const id of d.wordIds)s.sprint.vocabulary[id]={passed:true,attempts:1};for(const t of S.reviewTasks(s,d))s.sprint.recall[t.key]={passed:true,attempts:1};return v;
};
ok(S.days.length===35,'35 days');ok(S.days.filter(d=>d.phase==='Learn').length===24,'24 instruction days');ok(S.days.filter(d=>d.phase==='Review').length===4,'four platform reviews');ok(S.days.filter(d=>d.phase==='Apply').length===4,'four application/repair days');ok(S.days.filter(d=>d.phase==='Check').length===3,'three mock/evidence days');
equal(S.days[0].lessonIds,['c01-01','c01-02','c01-03'],'first teaching half');equal(S.days[1].lessonIds,['c01-04','c01-05','c01-06'],'second teaching half');equal(S.days[7].lessonIds,['c04-01','c04-02','c04-03'],'chapter four starts day eight');equal(S.days[26].lessonIds,['c12-04','c12-05','c12-06'],'last instruction day');
ok(new Set(S.days.flatMap(d=>d.lessonIds)).size===83,'all 72 lessons and 11 missions scheduled once');
for(const d of S.days){ok(d.minutes===180,'180 minutes day '+d.number);ok(d.id==='a1-full35-d'+String(d.number).padStart(2,'0'),'stable day ID');ok(S.retrieval(d).length===3,'three daily blind tasks');ok(S.retrieval(d).every(q=>q.type==='type'&&q.answers.length),'valid daily blind questions');}
const empty=state();ok(S.reviewTasks(empty,1).length===0,'no review before teaching');ok(S.reviewTasks(empty,2).length===3,'day-one lessons recalled at +1');
const allTasks=S.reviewTasks(empty,35);ok(allTasks.length===216,'all 72 lessons have three delayed retrievals');ok(new Set(allTasks.map(t=>t.key)).size===216,'stable distinct review keys');equal(allTasks.filter(t=>t.lessonId==='c01-01').map(t=>t.scheduledDay),[2,4,8],'+1 +3 +7 plan-day schedule');equal(allTasks.filter(t=>t.lessonId==='c12-06').map(t=>t.scheduledDay),[28,30,34],'last chapter receives all three reviews');
empty.sprint.recall['c01-01@0']={passed:true};ok(S.reviewTasks(empty,35).length===215,'passed reviews removed without dropping backlog');ok(S.reviewTasks(empty,7).every(t=>t.scheduledDay<=7),'future reviews excluded');
for(const d of S.days){const s=state();ok(!S.finish(s,d.number),'empty day cannot finish');const v=makeReady(s,d);ok(S.ready(s,d),'fully evidenced day ready '+d.number);ok(S.finish(s,d.number,Date.UTC(2026,10,5)),'finish '+d.number);const first=v.completedAt;S.finish(s,d.number,Date.UTC(2026,10,6));ok(v.completedAt===first,'completion is idempotent');ok(S.missing(s,d).length===0,'no missing tasks when ready');}
const d=S.days[1];
const blockers=[
 ['unfinished lesson',s=>delete s.progress[d.lessonIds[0]],0],
 ['unrecalled vocabulary',s=>s.sprint.vocabulary[d.wordIds[0]].passed=false,0],
 ['due review',s=>s.sprint.recall['c01-01@0'].passed=false,0],
 ['reading checks',s=>s.skills.reading[d.readingIds[0]].correct=[0,1],1],
 ['listening checks',s=>s.sprint.listening[d.readingIds[0]].correct=[0,1],2],
 ['guided writing',s=>s.skills.writing[d.lessonIds[0]].passed=false,3],
 ['daily draft',s=>s.sprint.days[d.number].draft='Too short.',3],
 ['writing self-checks',s=>s.sprint.days[d.number].writingChecks=[0,1],3],
 ['speaking self-checks',s=>s.sprint.days[d.number].speaking=[0,1],4],
 ['speaking notes',s=>s.sprint.days[d.number].speakingNotes='Spoke.',4]
];
for(const [label,mutate,index]of blockers){const s=state();makeReady(s,d);mutate(s);ok(!S.statuses(s,d)[index],label+' status blocked');ok(!S.finish(s,d.number),label+' finish blocked');ok(S.missing(s,d).length>0,label+' actionable missing');}
{const s=state();makeReady(s,d);s.sprint.days[2].retrieval=[0,1,1];ok(!S.ready(s,d),'duplicate blind indices cannot satisfy gate');ok(!S.finish(s,2),'blind retrieval required independently');}
{const s=state();makeReady(s,d);ok(!s.sprint.days[2].book&&!s.sprint.days[2].native&&S.ready(s,d),'external PDF and native-audio checkboxes optional');}
const old={startedAt:'2026-10-01T00:00:00.000Z',days:{12:{draft:'My old day twelve draft',completedAt:'2026-10-13T00:00:00.000Z',writingChecks:[0,1,2]}},timer:{remaining:731,endsAt:null,mode:'focus'},listening:{'a1-01':{correct:[0,1,2]}},anythingElse:{keep:['all','legacy','evidence']}};
const migrated=S.clean(old);ok(migrated.planId===S.PLAN_ID,'migration names new plan');equal(migrated.days,{},'numeric old days never reused');equal(migrated.legacyPlans['a1-21-v1'],old,'entire original sprint archived');equal(migrated.timer,old.timer,'timer preserved');equal(migrated.listening,old.listening,'old listening retained for reference');equal(S.clean(migrated),migrated,'migration idempotent');
const s=state();makeReady(s,S.days[0]);s.sprint.resume={route:'writing/c01-01',kind:'writing',title:'Resume draft',lessonId:'c01-01',day:1};s.sprint.days[1].speakingNotes='Saved speaking performance notes remain after reload.';s.sprint.recall['c01-01@0']={passed:true,attempts:2,assisted:false,lastAt:'2026-11-05T00:00:00.000Z'};s.sprint.legacyPlans=migrated.legacyPlans;
const roundTrip=S.clean(JSON.parse(JSON.stringify(s.sprint)));equal(roundTrip.days,s.sprint.days,'all drafts and day evidence survive reload');equal(roundTrip.resume,s.sprint.resume,'resume survives reload');equal(roundTrip.recall,s.sprint.recall,'review evidence survives reload');equal(roundTrip.legacyPlans,s.sprint.legacyPlans,'legacy archive survives reload');ok(S.wordsForDay({sprint:roundTrip},1).length===3&&S.wordsForDay({sprint:roundTrip},1).every(w=>w.passed),'vocabulary includes passed words and metadata');
const bad=JSON.parse(JSON.stringify(s.sprint));bad.days[1].retrieval=[0,0,1,2,3,-1,'x'];bad.days[1].exam.reading='101';bad.days[36]={draft:'not a day'};bad.timer.remaining=99999;bad.recall.bad={passed:true};bad.vocabulary.bad={passed:true};bad.resume={route:5};const cleaned=S.clean(bad);equal(cleaned.days[1].retrieval,[0,1,2],'indices bounded and deduplicated');ok(cleaned.days[1].exam.reading===''&&!cleaned.days[36],'percentages and day numbers validated');ok(cleaned.timer.remaining===1500&&!cleaned.recall.bad&&!cleaned.vocabulary.bad&&cleaned.resume===null,'timer, IDs and resume validated');
{const s=state(),d=S.days[0];s.active=d.lessonIds[1];ok(S.nextTask(s,d).lessonId===d.lessonIds[1],'active unfinished lesson resumes');for(const id of d.lessonIds)s.progress[id]={completedAt:'done'};ok(S.nextTask(s,d).route==='vocabulary/1','next vocabulary route');for(const id of d.wordIds)s.sprint.vocabulary[id]={passed:true};ok(S.nextTask(s,d).route==='reading/'+d.readingIds[0],'next reading route');makeReady(s,d);s.sprint.days[1].retrieval=[];ok(S.nextTask(s,d).kind==='retrieval','blind retrieval follows all evidence');s.sprint.days[1].retrieval=[0,1,2];ok(S.nextTask(s,d).kind==='finish','finish route ready');}
ok(S.words('Hallo, ich heiße Anna. Ich wohne in Berlin.')===8,'German word counter');
console.log(checks+' focused checks passed: 35-day schedule, evidence gates, all delayed reviews, migration, drafts and next-task routes.');
