// Compiler fixture test: a valid partial chapter compiles; a broken copy is rejected. Run: node tests/compiler.cjs
const assert=require('assert'),fs=require('fs'),os=require('os'),path=require('path'),{spawnSync}=require('child_process');
const ROOT=path.join(__dirname,'..'),FIX=path.join(__dirname,'fixtures');
const copy=()=>{const d=fs.mkdtempSync(path.join(os.tmpdir(),'german-fix-'));fs.cpSync(FIX,d,{recursive:true});return d;};
const run=(dir,...flags)=>spawnSync('python3',[path.join(ROOT,'compile-course.py'),'--root',dir,...flags],{encoding:'utf8'});
const chFile=d=>path.join(d,'content/zz/ch01.json');

// valid partial build
let d=copy(),r=run(d,'--partial');
assert.strictEqual(r.status,0,r.stdout+r.stderr);
const src=fs.readFileSync(path.join(d,'dist/full-content.js'),'utf8');
const win={};new Function('window',src)(win);
const data=win.GERMAN_FULL_DATA;
assert.strictEqual(data.partial,true);assert.strictEqual(data.lessons.length,3);assert.strictEqual(data.skillDays.length,1);
assert.strictEqual(data.lessons[0].chapterTitle,'Hallo!');
// non-partial: missing chapter 2 and mocks are errors
r=run(d);assert.strictEqual(r.status,1);assert.match(r.stdout,/ch02\.json \| - \| -: chapter file missing/);assert.match(r.stdout,/mocks/);

// broken copy: missing hint, bad choice index, learner name, retrieval same as a drill prompt
d=copy();const ch=JSON.parse(fs.readFileSync(chFile(d),'utf8'));
delete ch.lessons[0].drills[0].hint;
ch.lessons[1].check[1].answer=5;
ch.lessons[2].goal='Greet Atish.';
ch.lessons[2].retrieval[0].prompt=ch.lessons[2].drills[0].prompt;
ch.skillDays[0].reading.questions.pop();
fs.writeFileSync(chFile(d),JSON.stringify(ch));
r=run(d,'--partial');
assert.strictEqual(r.status,1,'broken copy must fail');
assert.match(r.stdout,/zz-c01-01 \| drills\[0\]\.hint: missing or empty/);
assert.match(r.stdout,/zz-c01-02 \| check\[1\]\.answer: invalid choice index 5/);
assert.match(r.stdout,/zz-c01-03 \| goal: contains the learner's name/);
assert.match(r.stdout,/zz-c01-03 \| retrieval\[0\]\.prompt: identical/);
assert.match(r.stdout,/zz-c01-d1 \| reading\.questions: has 1 questions, need exactly 2/);
assert.ok(!fs.existsSync(path.join(d,'dist/full-content.js')),'nothing written on error');
console.log('compiler.cjs: all checks passed (valid fixture compiles, 5 planted errors detected)');
