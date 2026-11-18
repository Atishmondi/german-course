// Re-checks key invariants of the compiled bundle dist/full-content.js. Run after: python3 compile-course.py [--partial]
const assert=require('assert'),fs=require('fs'),path=require('path');
const file=path.join(__dirname,'../dist/full-content.js');
if(!fs.existsSync(file)){console.log('content.cjs: no dist/full-content.js yet (run python3 compile-course.py --partial). Nothing to check; passing.');process.exit(0);}
const win={};new Function('window',fs.readFileSync(file,'utf8'))(win);
const data=win.GERMAN_FULL_DATA;assert.ok(data&&data.levels&&Array.isArray(data.lessons),'GERMAN_FULL_DATA missing');
let n=0;const bad=[];
function check(owner,field,q){
  n++;const e=m=>bad.push(`${owner} ${field}: ${m}`);
  if(!q||typeof q!=='object')return e('not a question');
  for(const k of ['prompt','hint','explanation'])if(typeof q[k]!=='string'||!q[k].trim())e(`missing ${k}`);
  if(q.type==='choice'){if(!Array.isArray(q.options)||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)e('bad choice answer');}
  else if(q.type==='build'){if(!Array.isArray(q.tokens)||!Array.isArray(q.answer)||[...q.tokens].sort().join('\u0000')!==[...q.answer].sort().join('\u0000'))e('tokens not a permutation of answer');}
  else if(q.type==='type'){if(!Array.isArray(q.answers)||!q.answers.length||q.answers.some(a=>!String(a).trim()))e('no answers');}
  else e('unknown type '+q.type);
}
const ids=new Set();const uniq=id=>{assert.ok(!ids.has(id),'duplicate id '+id);ids.add(id);};
for(const l of data.lessons){uniq(l.id);
  ['drills','check','retrieval'].forEach(s=>(l[s]||[]).forEach((q,i)=>check(l.id,`${s}[${i}]`,q)));check(l.id,'blind',l.blind);
  (l.media?.grammarVideos||[]).concat(l.media?.nicosWeg||[],l.media?.practice||[]).forEach(k=>assert.ok(data.resources.videos[k]||data.resources.nicosWeg[k]||data.resources.links[k],`${l.id} media ${k} not in resources`));}
for(const s of data.skillDays){uniq(s.id);['reading','listening'].forEach(p=>(s[p]?.questions||[]).forEach((q,i)=>check(s.id,`${p}[${i}]`,q)));(s.writing?.items||[]).forEach((q,i)=>check(s.id,`writing[${i}]`,q));}
for(const m of data.mocks){uniq(m.id);m.sections.forEach((sec,j)=>sec.questions.forEach((q,i)=>check(m.id,`sections[${j}][${i}]`,q)));}
assert.ok(!/atish|mondi/i.test(JSON.stringify(data.lessons.concat(data.skillDays,data.mocks))),"learner's name in content");
assert.deepStrictEqual(bad,[],bad.slice(0,20).join('\n'));
console.log(`content.cjs: ok (${data.lessons.length} lessons, ${data.skillDays.length} skill days, ${data.mocks.length} mocks, ${n} questions, partial ${data.partial})`);
