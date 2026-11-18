// Score rules for "Try again" and "Redo lesson": only first tries count. Run: node tests/player.cjs
const assert=require('assert'),path=require('path');
const ROOT=path.join(__dirname,'..');
require(path.join(ROOT,'dist/core.js'));require(path.join(ROOT,'dist/plan.js'));
const C=globalThis.KLEIN_CORE,P=globalThis.GERMAN_PLAN;

const q=a=>({type:'type',prompt:'p',answers:[a],hint:'h',explanation:'e'});
const L={id:'a1-c01-01',level:'a1',chapter:1,n:1,title:'T',drills:[q('a'),q('b')],blind:q('c'),check:[q('d'),q('e')],retrieval:[]};
const plan={lessonById:new Map([[L.id,L]])};
const keys=[...L.drills.map((_,i)=>C.qkey(L.id,'drills',i)),C.qkey(L.id,'blind',0),...L.check.map((_,i)=>C.qkey(L.id,'check',i))];
const s=C.defaults('x');

// First pass: drill 0 right, drill 1 wrong twice then revealed, rest right.
const k0=keys[0],k1=keys[1];
assert.ok(C.attempt(s,k0,L.drills[0],'a').correct);
C.attempt(s,k1,L.drills[1],'x');C.attempt(s,k1,L.drills[1],'y');assert.ok(C.reveal(s,k1));
keys.slice(2).forEach((k,i)=>C.attempt(s,k,[L.blind,...L.check][i],['c','d','e'][i]));
const first=JSON.stringify({stats:s.stats,drills:C.section(s,L.id,'drills',L.drills),check:C.section(s,L.id,'check',L.check),notYet:s.notYet});
assert.deepStrictEqual(C.section(s,L.id,'drills',L.drills),{done:true,right:1,total:2});

// Try again: not allowed on an open question; allowed after answer or reveal; clears the visible answer.
assert.strictEqual(C.retry(C.defaults('x'),k0),false);
assert.ok(C.retry(s,k0));assert.strictEqual(C.live(s,k0),'open');assert.strictEqual(C.record(s,k0).value,null);
assert.strictEqual(C.status(s,k0),'correct','first try stays the score');
C.attempt(s,k0,L.drills[0],'wrong');C.attempt(s,k0,L.drills[0],'wrong');assert.ok(C.reveal(s,k0));
assert.ok(C.retry(s,k1));assert.ok(C.attempt(s,k1,L.drills[1],'b').correct);
assert.strictEqual(C.status(s,k1),'revealed','a right retry does not turn a revealed first try into a right one');
assert.strictEqual(JSON.stringify({stats:s.stats,drills:C.section(s,L.id,'drills',L.drills),check:C.section(s,L.id,'check',L.check),notYet:s.notYet}),first,'retries change no score, stats or notYet');
assert.ok(C.retry(s,k1),'unlimited retries');

// Finish and redo: completedAt/completedOnDay never change; redo answers are not the score.
s.position.day=3;assert.ok(P.completeLesson(plan,s,L.id,new Date('2026-01-01')));
const rec=JSON.stringify([s.lessons[L.id].completedAt,s.lessons[L.id].completedOnDay]);
assert.strictEqual(C.startRedo(C.defaults('x'),L.id,keys),false,'only finished lessons can be redone');
assert.ok(C.startRedo(s,L.id,keys));
assert.ok(keys.every(k=>C.live(s,k)==='open'));assert.strictEqual(s.lessons[L.id].step,0);
keys.forEach(k=>C.attempt(s,k,{type:'type',answers:['zzz']},'nope'));
assert.deepStrictEqual(C.section(s,L.id,'check',L.check,true),{done:false,right:0,total:2},'redo score is separate');
assert.strictEqual(JSON.stringify({stats:s.stats,drills:C.section(s,L.id,'drills',L.drills),check:C.section(s,L.id,'check',L.check),notYet:s.notYet}),first);
s.position.day=9;assert.ok(P.completeLesson(plan,s,L.id,new Date('2026-05-05')));
assert.strictEqual(JSON.stringify([s.lessons[L.id].completedAt,s.lessons[L.id].completedOnDay]),rec);

// Saved state round-trips (redo in progress survives a reload), and old saves without the new fields still load.
const back=C.migrate(JSON.stringify(s),'x').state;
assert.strictEqual(back.lessons[L.id].redo,true);assert.deepStrictEqual(back.practice,s.practice);
assert.deepStrictEqual(C.migrate(JSON.stringify(back),'x').state,back,'migrate stays idempotent');
const old=C.defaults('x');delete old.practice;old.lessons.z={step:2,completedAt:null,completedOnDay:null};
const m=C.migrate(JSON.stringify(old),'x');assert.strictEqual(m.backup,null);assert.deepStrictEqual(m.state.practice,{});assert.strictEqual(m.state.lessons.z.redo,false);
// Reset answers (section / lesson): fresh for the learner, score, stats and completion untouched; unanswered questions are left alone.
C.endRedo(s,L.id);
const snap=()=>JSON.stringify({a:s.answers,stats:s.stats,notYet:s.notYet,d:[s.lessons[L.id].completedAt,s.lessons[L.id].completedOnDay],first:C.section(s,L.id,'check',L.check)});
const before=snap();
const dk=L.drills.map((_,i)=>C.qkey(L.id,'drills',i));
assert.strictEqual(C.resetKeys(s,dk),2);assert.ok(dk.every(k=>C.live(s,k)==='open'));assert.strictEqual(snap(),before,'reset keeps first-try score and completedAt');
C.attempt(s,dk[0],L.drills[0],'zzz');assert.strictEqual(snap(),before,'a try after reset is practice only');
const fresh2=C.defaults('x');assert.strictEqual(C.resetKeys(fresh2,dk),0,'unanswered questions get no practice entry');
assert.strictEqual(C.resetKeys(s,keys),keys.length);assert.strictEqual(snap(),before,'lesson-wide reset keeps the score');
assert.deepStrictEqual(C.migrate(JSON.stringify(s),'x').state.practice,s.practice);
C.endRedo(s,L.id);assert.strictEqual(s.lessons[L.id].redo,false);assert.ok(keys.every(k=>!s.practice[k]));
assert.strictEqual(C.status(s,k0),'correct');
console.log('player score rules: all passed');
