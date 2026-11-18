// Plan engine tests on a synthetic full data set built from content/levels.json. Run: node tests/plan.cjs
const assert=require('assert'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..');
require(path.join(ROOT,'dist/core.js'));require(path.join(ROOT,'dist/plan.js'));
const C=globalThis.KLEIN_CORE,P=globalThis.GERMAN_PLAN;
const levels=JSON.parse(fs.readFileSync(path.join(ROOT,'content/levels.json'),'utf8'));
const pad=n=>String(n).padStart(2,'0');

const q=(p,grammar)=>({type:'type',prompt:p,answers:['ja'],hint:'h',explanation:'e',grammar});
function synth(skip=new Set()){
  const lessons=[],skillDays=[],mocks=[];
  for(const lv of levels.levels){
    for(const [ch,cd] of Object.entries(lv.chapterDays)){
      for(let n=1;n<=cd*3;n++){
        const id=`${lv.id}-c${pad(ch)}-${pad(n)}`;if(skip.has(id))continue;
        lessons.push({id,level:lv.id,chapter:+ch,n,title:'L '+id,chapterTitle:'Kapitel '+ch,
          drills:[q(id+' d0'),q(id+' d1')],blind:q(id+' b'),
          check:Array.from({length:10},(_,i)=>q(`${id} c${i}`,i<6)),
          retrieval:Array.from({length:4},(_,i)=>q(`${id} r${i}`))});
      }
      for(let k=1;k<=cd;k++)skillDays.push({id:`${lv.id}-c${pad(ch)}-d${k}`,level:lv.id,chapter:+ch,day:k});
    }
    for(let i=1;i<=lv.mockDays;i++)mocks.push({id:`${lv.id}-mock-${i}`,level:lv.id,title:'Mock',sections:[{skill:'grammar',questions:[q('m')]}]});
  }
  return {levels,lessons,skillDays,mocks,resources:{videos:{},nicosWeg:{},links:{}},partial:false};
}

const data=synth(),plan=P.build(data),D=plan.days;
// shape
assert.strictEqual(D.length,156);
D.forEach((d,i)=>{assert.strictEqual(d.n,i+1);assert.strictEqual(d.week,Math.floor(i/6)+1);assert.strictEqual(d.dayInWeek,i%6+1);assert.strictEqual(d.available,true);});
assert.strictEqual(D[155].week,26);
for(let w=1;w<=26;w++)assert.strictEqual(D.filter(d=>d.week===w).length,6);
const count=(lv,kind)=>D.filter(d=>d.level===lv&&d.kind===kind).length;
assert.deepStrictEqual([count('a1','learn'),count('a1','mock'),count('a1','buffer')],[33,2,0]);
assert.deepStrictEqual([count('a2','learn'),count('a2','mock'),count('a2','buffer')],[38,2,0]);
assert.deepStrictEqual([count('b1','learn'),count('b1','mock'),count('b1','buffer')],[50,3,2]);
assert.strictEqual(D.filter(d=>d.kind==='review').length,26);
D.filter(d=>d.dayInWeek===6).forEach(d=>assert.strictEqual(d.kind,'review'));
assert.deepStrictEqual(D[0].lessonIds,['a1-c01-01','a1-c01-02','a1-c01-03']);
assert.strictEqual(D[0].skillDayId,'a1-c01-d1');
assert.strictEqual(D[0].title,'A1 · Ch 1 · Kapitel 1 (day 1 of 2)');
assert.deepStrictEqual(D[5].reviewOf,D.slice(0,5).flatMap(d=>d.lessonIds));
assert.strictEqual(D[5].title,'Week 1 review');
const mock=D.find(d=>d.kind==='mock');assert.strictEqual(mock.mockId,'a1-mock-1');assert.strictEqual(mock.title,'A1 practice mock 1');
assert.strictEqual(plan.dayOfLesson.get('a1-c01-04'),2);
// every lesson appears once, in order
const all=D.flatMap(d=>d.lessonIds||[]);assert.strictEqual(all.length,data.lessons.length);assert.deepStrictEqual(all,data.lessons.map(l=>l.id));
// plattform: review of the week holding the last learn day of chapter 3/6/9/12
const lastOf=(lv,ch)=>D.filter(d=>d.level===lv&&d.kind==='learn'&&d.chapter===ch).pop();
const plattWeeks=new Set(levels.levels.flatMap(lv=>levels.plattformAfterChapters.map(ch=>lastOf(lv.id,ch).week)));
D.forEach(d=>assert.strictEqual(d.plattform,d.kind==='review'&&plattWeeks.has(d.week),'plattform day '+d.n));
assert.ok(D.filter(d=>d.plattform).length>=10);

// helpers
const fresh=()=>C.defaults(levels.planId);
const answerAll=(s,owner,sec,qs)=>qs.forEach((x,i)=>C.attempt(s,C.qkey(owner,sec,i),x,'ja'));
const finishLesson=(s,id)=>{const l=plan.lessonById.get(id);answerAll(s,id,'drills',l.drills);answerAll(s,id,'blind',[l.blind]);answerAll(s,id,'check',l.check);return P.completeLesson(plan,s,id,'2026-01-01T00:00:00Z');};

// completeLesson refuses unfinished, accepts answered/revealed
let s=fresh();const L1=plan.lessonById.get('a1-c01-01');
assert.strictEqual(P.completeLesson(plan,s,'a1-c01-01'),false);
answerAll(s,L1.id,'drills',L1.drills);answerAll(s,L1.id,'check',L1.check);
assert.strictEqual(P.completeLesson(plan,s,'a1-c01-01'),false,'blind still open');
const bk=C.qkey(L1.id,'blind',0);C.attempt(s,bk,L1.blind,'nein');C.attempt(s,bk,L1.blind,'nein');assert.ok(C.reveal(s,bk));
assert.strictEqual(P.completeLesson(plan,s,'a1-c01-01','2026-01-01T00:00:00Z'),true);
assert.strictEqual(s.lessons['a1-c01-01'].completedOnDay,1);assert.ok(s.lessons['a1-c01-01'].completedAt);

// review ladder in plan days, passed ones excluded
s=fresh();s.position.day=10;assert.ok(finishLesson(s,'a1-c01-04'));
const due=n=>P.dueRecall(plan,s,n).map(x=>x.rung);
assert.deepStrictEqual(due(10),[]);assert.deepStrictEqual(due(11),[0]);assert.deepStrictEqual(due(12),[0]);
assert.deepStrictEqual(due(13),[0,1]);assert.deepStrictEqual(due(17),[0,1,2]);assert.deepStrictEqual(due(30),[0,1,2]);assert.deepStrictEqual(due(31),[0,1,2,3]);
const item=P.dueRecall(plan,s,11)[0];assert.strictEqual(item.key,'a1-c01-04@0');assert.strictEqual(item.question,plan.lessonById.get('a1-c01-04').retrieval[0]);
P.markRecall(s,'a1-c01-04@0',false,true,'2026-01-02T00:00:00Z');assert.deepStrictEqual(due(13),[0,1],'revealed stays due');
P.markRecall(s,'a1-c01-04@0',true,false);assert.deepStrictEqual(due(13),[1]);

// reviewSet: grammar first, notYet included, max 40
s=fresh();const rv=D[5];const nyLesson=plan.lessonById.get(rv.reviewOf[0]);
const nk=C.qkey(nyLesson.id,'drills',1);C.attempt(s,nk,nyLesson.drills[1],'x');C.attempt(s,nk,nyLesson.drills[1],'x');C.reveal(s,nk);
const rs=P.reviewSet(plan,s,6);
assert.ok(rs.length>0&&rs.length<=40);
assert.ok(rs.some(x=>x.from===nk&&x.question===nyLesson.drills[1]),'notYet included');
const g=rs.map(x=>x.question.grammar===true);assert.ok(g.indexOf(false)===-1||g.slice(g.indexOf(false)).every(v=>!v),'grammar first');
assert.ok(g[0]);rs.forEach((x,i)=>assert.strictEqual(x.key,`day-6|review|${i}`));
assert.strictEqual(rs.length,rv.reviewOf.length*2+1);
const buf=D.find(d=>d.kind==='buffer');assert.strictEqual(P.reviewSet(plan,fresh(),buf.n).length,40);

// day flow: finishDay only when done, idempotent, position never goes back
s=fresh();assert.strictEqual(P.finishDay(plan,s,1),false);
D[0].lessonIds.forEach(id=>assert.ok(finishLesson(s,id)));
assert.strictEqual(P.dayDone(plan,s,1),false,'skills still open');
s.skillDays[D[0].skillDayId]={step:0,doneAt:'2026-01-01T00:00:00Z'};
assert.ok(P.dayDone(plan,s,1));
assert.deepStrictEqual(P.dayParts(plan,s,1).map(p=>p.kind),['lesson','lesson','lesson','skills']);
assert.ok(P.finishDay(plan,s,1,'2026-01-01T10:00:00Z'));const doneAt=s.days[1].doneAt;
assert.strictEqual(s.position.day,2);
assert.ok(P.finishDay(plan,s,1,'2026-02-01T10:00:00Z'));assert.strictEqual(s.days[1].doneAt,doneAt);assert.strictEqual(s.position.day,2);
s.position.day=9;assert.ok(P.finishDay(plan,s,1));assert.strictEqual(s.position.day,9,'never backwards');
// recall shows on day 2 for day-1 lessons; review day done via its section
s.position.day=2;assert.strictEqual(P.dayParts(plan,s,2)[0].kind,'recall');
const r6=P.reviewSet(plan,s,6);assert.strictEqual(P.dayDone(plan,s,6),false);
r6.forEach(x=>C.attempt(s,x.key,x.question,'ja'));
assert.ok(P.dayParts(plan,s,6).find(p=>p.kind==='review').done);
const st=P.stats(plan,s);assert.strictEqual(st.daysDone,1);assert.strictEqual(st.lessonsDone,3);assert.strictEqual(st.byLevel.a1.total,42);assert.strictEqual(st.week,1);

// partial data: full skeleton, missing content unavailable
const pdata=synth(new Set(['a1-c01-02']));pdata.partial=true;pdata.mocks=[];pdata.skillDays=pdata.skillDays.filter(x=>x.level==='a1');
const pp=P.build(pdata);
assert.strictEqual(pp.days.length,156);
assert.strictEqual(pp.days[0].available,false);assert.strictEqual(pp.days[1].available,true);
assert.ok(pp.days.filter(d=>d.kind==='mock').every(d=>d.available===false));
assert.ok(pp.days.filter(d=>d.kind==='learn'&&d.level!=='a1').every(d=>d.available===false));
assert.strictEqual(pp.days[5].available,false,'review of a week with a missing lesson');
assert.strictEqual(P.dayDone(pp,fresh(),1),false);

console.log('plan.cjs: all checks passed (156 days, 26 weeks, ladder, review, partial)');
