/* A fixed 35-day plan. Completion records activity evidence, not proficiency. */
(function(root){
 'use strict';
 const PLAN_ID='a1-full35-v1',LEGACY_PLAN_ID='a1-21-v1';
 const course=root.GERMAN_COURSE;
 if(!course||!Array.isArray(course.fullLessons))throw new Error('The full A1 curriculum must load before the 35-day plan.');
 const full=new Map();
 for(const lesson of course.fullLessons){if(!lesson||typeof lesson.id!=='string'||full.has(lesson.id))throw new Error('Full A1 lessons need unique stable IDs.');full.set(lesson.id,lesson);}
 const getLesson=id=>{const lesson=full.get(id);if(!lesson)throw new Error('Missing full A1 lesson: '+id);return lesson;};
 const pad=n=>String(n).padStart(2,'0');
 const unique=values=>[...new Set(values)];
 const pool=l=>Array.isArray(l.retrieval)?l.retrieval:Array.isArray(l.retrieval3)?l.retrieval3:[];
 const typed=q=>q&&q.type==='type'&&typeof q.prompt==='string'&&q.prompt.trim()&&Array.isArray(q.answers)&&q.answers.length&&q.answers.every(a=>typeof a==='string'&&a.trim());
 const instructionDay=(chapter,part)=>Math.floor((chapter-1)/3)*7+((chapter-1)%3)*2+part;
 const regular=[];
 for(let chapter=1;chapter<=12;chapter++)for(let index=1;index<=6;index++){
  const lesson=getLesson('c'+pad(chapter)+'-'+pad(index));
  if(pool(lesson).length<3||!pool(lesson).slice(0,3).every(typed))throw new Error(lesson.id+' needs three independent typed retrieval variants.');
  regular.push({lesson,day:instructionDay(chapter,index<=3?1:2)});
 }
 const missionChapters={7:[1,2,3],14:[4,5,6],21:[7,8,9],28:[10,11,12],29:[1,2,3,4],30:[5,6,7,8],31:[9,10,11,12],32:[1,2,3,4,5,6,7,8,9,10,11,12],33:[1,2,3,4,5,6,7,8,9,10,11,12],34:[1,2,3,4,5,6,7,8,9,10,11,12],35:[1,2,3,4,5,6,7,8,9,10,11,12]};
 const missionTitles={7:'Platform review · Chapters 1–3',14:'Platform review · Chapters 4–6',21:'Platform review · Chapters 7–9',28:'Platform review · Chapters 10–12',29:'Use German · Meet people and make plans',30:'Use German · Everyday arrangements',31:'Use German · Home, shopping and travel',32:'Repair and connect your German',33:'A1 practice · First four-skill mock',34:'A1 practice · Repair and second mock',35:'A1 readiness · Four-skill evidence'};
 const days=[];
 for(let number=1;number<=35;number++){
  const teaching=regular.filter(x=>x.day===number).map(x=>x.lesson);
  const mission=!teaching.length?getLesson('m'+pad(number)):null;
  const lessons=mission?[mission]:teaching;
  if(mission&&(pool(mission).length<3||!pool(mission).slice(0,3).every(typed)))throw new Error(mission.id+' needs three typed daily retrieval questions.');
  const chapterNumbers=mission?missionChapters[number]:unique(lessons.map(l=>Number(l.chapter)));
  if(!chapterNumbers||chapterNumbers.some(n=>!Number.isInteger(n)||n<1||n>12))throw new Error('Invalid chapters for plan day '+number);
  const chapter=course.book?.chapters?.find(c=>c.number===chapterNumbers[0]);
  const openWriting=lessons.map(l=>l.openWriting).filter(x=>x&&typeof x==='object');
  const minWords=Math.max(number<=2?12:number<=7?20:number<=14?25:30,...openWriting.map(w=>Number(w.minWords)||0));
  const writingPrompt=openWriting.map(w=>w.prompt||w.task||'').filter(x=>typeof x==='string'&&x.trim()).join('\n\n')||'Write a short message using today’s German. Include the situation, two useful details, and a suitable opening and ending.';
  days.push({number,id:'a1-full35-d'+pad(number),title:mission?(mission.title||missionTitles[number]):(chapter?.title||'Chapter '+chapterNumbers[0])+' · Learn '+lessons[0].part+' of 2',chapterNumbers,lessonIds:lessons.map(l=>l.id),readingIds:lessons.map(l=>l.id),speakingIds:lessons.map(l=>l.id),minutes:180,phase:mission?(number<=28?'Review':number>=33?'Check':'Apply'):'Learn',goal:mission?(mission.goal||'Apply the chapter objectives, retrieve them without notes, and repair gaps across all four skills.'):(chapter?.goal||lessons[0].goal||'Learn and use today’s chapter objectives.'),wordIds:unique(lessons.flatMap(l=>Array.isArray(l.words)?l.words:[])),minWords,writingPrompt});
 }
 const allWordIds=new Set((course.words||[]).map(w=>w.id));
 for(const day of days)for(const id of day.wordIds)if(!allWordIds.has(id))throw new Error('Missing vocabulary '+id+' on day '+day.number);
 const recallTasks=regular.flatMap(({lesson,day})=>[1,3,7].map((delay,index)=>({key:lesson.id+'@'+index,lessonId:lesson.id,question:pool(lesson)[index],scheduledDay:day+delay,index}))).sort((a,b)=>a.scheduledDay-b.scheduledDay||a.lessonId.localeCompare(b.lessonId)||a.index-b.index);
 const recallKeys=new Set(recallTasks.map(t=>t.key));
 const validLessonIds=new Set([...(course.lessons||[]).map(l=>l.id),...full.keys()]);
 const defaults=()=>({planId:PLAN_ID,startedAt:null,days:{},bookPages:{},listening:{},recall:{},vocabulary:{},resume:null,timer:{remaining:1500,endsAt:null,mode:'focus'},legacyPlans:{}});
 const entry=()=>({book:false,native:false,speaking:[],writingChecks:[],draft:'',speakingNotes:'',retrieval:[],completedAt:null,exam:{reading:'',listening:'',writing:'',speaking:[]}});
 const indices=(a,max)=>unique((Array.isArray(a)?a:[]).filter(x=>Number.isInteger(x)&&x>=0&&x<max));
 const stamp=value=>typeof value==='string'&&!Number.isNaN(Date.parse(value))?value:null;
 const clone=value=>{try{return JSON.parse(JSON.stringify(value));}catch{return null;}};
 const evidence=value=>{const v=value===true?{passed:true}:value;if(!v||typeof v!=='object')return null;return {passed:v.passed===true,attempts:Math.max(0,Math.min(100000,Math.trunc(Number(v.attempts)||0))),assisted:v.assisted===true,lastAt:Number.isFinite(v.lastAt)&&v.lastAt>=0?v.lastAt:stamp(v.lastAt)};};
 function cleanTimer(t){t=t&&typeof t==='object'?t:{};return {remaining:Number.isFinite(Number(t.remaining))?Math.max(0,Math.min(1500,Math.trunc(Number(t.remaining)))):1500,endsAt:Number.isFinite(t.endsAt)&&t.endsAt>=0?t.endsAt:null,mode:t.mode==='break'?'break':'focus'};}
 function cleanListening(input){const out={};for(const [id,v]of Object.entries(input&&typeof input==='object'?input:{}))if(validLessonIds.has(id)&&v&&typeof v==='object')out[id]={correct:indices(v.correct,3)};return out;}
 function cleanResume(value){
  const route=s=>typeof s==='string'&&s.length<=200&&!/[\u0000-\u001f]/.test(s)?s:null;
  if(typeof value==='string')return route(value);
  if(!value||typeof value!=='object'||!route(value.route))return null;
  const out={route:value.route};for(const k of ['title','kind'])if(typeof value[k]==='string')out[k]=value[k].slice(0,200);
  if(validLessonIds.has(value.lessonId))out.lessonId=value.lessonId;
  if(Number.isInteger(value.day)&&value.day>=1&&value.day<=35)out.day=value.day;
  return out;
 }
 function clean(input){
  const out=defaults();if(!input||typeof input!=='object')return out;
  const archive=clone(input.legacyPlans);if(archive&&typeof archive==='object'&&!Array.isArray(archive))out.legacyPlans=archive;
  out.timer=cleanTimer(input.timer);out.listening=cleanListening(input.listening);
  if(input.planId!==PLAN_ID){
   const old=clone(input);if(old!==null){const key=!input.planId||['a1-21-v1','a1-21','old21'].includes(input.planId)?LEGACY_PLAN_ID:String(input.planId).slice(0,100);Object.defineProperty(out.legacyPlans,key,{value:old,enumerable:true,writable:true,configurable:true});}
   return out;
  }
  for (const [key, value] of Object.entries(input.bookPages || {})) {
   const page = Number(key);
   if (String(page) === key && Number.isInteger(page) && page >= 0 && page < 176 && value && typeof value === 'object')
    out.bookPages[page] = {done: value.done === true, note: typeof value.note === 'string' ? value.note.slice(0,8000) : ''};
  }
  out.startedAt=stamp(input.startedAt);out.resume=cleanResume(input.resume);
  for(const d of days){
   const x=input.days?.[d.number];if(!x||typeof x!=='object')continue;
   const v=entry();v.book=x.book===true;v.native=x.native===true;v.speaking=indices(x.speaking,3);v.writingChecks=indices(x.writingChecks,3);v.retrieval=indices(x.retrieval,3);v.draft=typeof x.draft==='string'?x.draft.slice(0,16000):'';v.speakingNotes=typeof x.speakingNotes==='string'?x.speakingNotes.slice(0,8000):'';v.completedAt=stamp(x.completedAt);
   for(const k of ['reading','listening','writing']){const s=String(x.exam?.[k]??'');v.exam[k]=/^\d{1,3}$/.test(s)&&Number(s)<=100?s:'';}v.exam.speaking=indices(x.exam?.speaking,4);out.days[d.number]=v;
  }
  for(const [key,value]of Object.entries(input.recall||{})){const v=evidence(value);if(recallKeys.has(key)&&v)out.recall[key]=v;}
  for(const [id,value]of Object.entries(input.vocabulary||{})){const v=evidence(value);if(allWordIds.has(id)&&v)out.vocabulary[id]=v;}
  return out;
 }
 const words=value=>(String(value??'').trim().match(/[\p{L}\p{N}]+(?:[’'-][\p{L}]+)*/gu)||[]).length;
 const data=(s,n)=>s?.sprint?.days?.[typeof n==='object'?n.number:n]||entry();
 const resolveDay=d=>typeof d==='number'?days.find(x=>x.number===d):d;
 const passed=v=>v===true||v?.passed===true;
 const reviewTasks=(s,d)=>{d=resolveDay(d);return d?recallTasks.filter(t=>t.scheduledDay<=d.number&&!passed(s?.sprint?.recall?.[t.key])):[];};
 // Return every current-day word, including passed entries, for progress and repair UI.
 const wordsForDay=(s,d)=>{d=resolveDay(d);return d?d.wordIds.map(id=>{const word=(course.words||[]).find(w=>w.id===id),v=s?.sprint?.vocabulary?.[id];return {...word,passed:passed(v),attempts:Number(v?.attempts)||0,assisted:v?.assisted===true,lastAt:v?.lastAt??null};}):[];};
 const remainingPages=(s,d)=>root.GERMAN_BOOK.dayPages[d.number-1].filter(page=>!s?.sprint?.bookPages?.[page]?.done);
 const completeIndices=(a,count)=>indices(a,count).length===count;
 function statuses(s,d){
  d=resolveDay(d);if(!d)return [false,false,false,false,false];const v=data(s,d.number);
  return [d.lessonIds.every(id=>!!s?.progress?.[id]?.completedAt)&&wordsForDay(s,d).every(w=>w.passed)&&reviewTasks(s,d).length===0,d.readingIds.every(id=>completeIndices(s?.skills?.reading?.[id]?.correct,3))&&remainingPages(s,d).length===0,d.readingIds.every(id=>completeIndices(s?.sprint?.listening?.[id]?.correct,3)),d.lessonIds.every(id=>s?.skills?.writing?.[id]?.passed===true)&&words(v.draft)>=d.minWords&&completeIndices(v.writingChecks,3),completeIndices(v.speaking,3)&&words(v.speakingNotes)>=6];
 }
 const ready=(s,d)=>{d=resolveDay(d);return !!d&&statuses(s,d).every(Boolean)&&completeIndices(data(s,d.number).retrieval,3);};
 const next=s=>days.find(d=>!data(s,d.number).completedAt)||days[34];
 function finish(s,n,now=Date.now()){
  const d=resolveDay(n);if(!s||!d||!ready(s,d))return false;
  s.sprint??=defaults();s.sprint.days??={};const v=s.sprint.days[d.number]??=entry();if(!v.completedAt)v.completedAt=new Date(now).toISOString();return true;
 }
 function retrieval(d){d=resolveDay(d);if(!d)return [];const lessons=d.lessonIds.map(getLesson);return lessons.length===1?pool(lessons[0]).slice(0,3):lessons.map(l=>l.dailyBlind||pool(l)[2]);}
 function missing(s,d){
  d=resolveDay(d);if(!d)return ['Choose a study day.'];const v=data(s,d.number),out=[];
  const lessons=d.lessonIds.filter(id=>!s?.progress?.[id]?.completedAt).length,vocab=wordsForDay(s,d).filter(w=>!w.passed).length,recall=reviewTasks(s,d).length,reading=d.readingIds.filter(id=>!completeIndices(s?.skills?.reading?.[id]?.correct,3)).length,listening=d.readingIds.filter(id=>!completeIndices(s?.sprint?.listening?.[id]?.correct,3)).length,writing=d.lessonIds.filter(id=>s?.skills?.writing?.[id]?.passed!==true).length;
  if(lessons)out.push('Study: finish '+lessons+' lesson'+(lessons===1?'':'s')+'.');if(vocab)out.push('Vocabulary: recall '+vocab+' word'+(vocab===1?'':'s')+'.');if(recall)out.push('Review: complete '+recall+' due recall task'+(recall===1?'':'s')+'.');
  if(remainingPages(s,d).length)out.push('Textbook: work through '+remainingPages(s,d).length+' assigned pages.');if(reading)out.push('Reading: complete 3 meaning checks for '+reading+' text'+(reading===1?'':'s')+'.');if(listening)out.push('Listening: complete 3 meaning checks for '+listening+' track'+(listening===1?'':'s')+'.');if(writing)out.push('Writing: finish '+writing+' guided task'+(writing===1?'':'s')+'.');
  if(words(v.draft)<d.minWords)out.push('Writing: add '+(d.minWords-words(v.draft))+' words to your saved draft.');if(!completeIndices(v.writingChecks,3))out.push('Writing: complete '+(3-indices(v.writingChecks,3).length)+' self-checks.');
  if(!completeIndices(v.speaking,3))out.push('Speaking: complete '+(3-indices(v.speaking,3).length)+' self-checks.');if(words(v.speakingNotes)<6)out.push('Speaking: save '+(6-words(v.speakingNotes))+' more words of performance notes.');if(!completeIndices(v.retrieval,3))out.push('Blind retrieval: answer '+(3-indices(v.retrieval,3).length)+' tasks correctly.');
  return out;
 }
 function nextTask(s,d){
  d=resolveDay(d)||next(s);const pending=d.lessonIds.filter(id=>!s?.progress?.[id]?.completedAt),active=pending.includes(s?.active)?s.active:pending[0];
  if(active)return {route:'lesson/'+active,title:'Continue '+getLesson(active).title,kind:'lesson',lessonId:active};
  if(wordsForDay(s,d).some(w=>!w.passed))return {route:'vocabulary/'+d.number,title:'Practise today’s vocabulary',kind:'vocabulary'};
  if(reviewTasks(s,d).length)return {route:'recall/'+d.number,title:'Retrieve earlier learning',kind:'recall'};
  for(const id of d.readingIds)if(!completeIndices(s?.skills?.reading?.[id]?.correct,3))return {route:'reading/'+id,title:'Read and check meaning',kind:'reading',lessonId:id};
  const unread=remainingPages(s,d);if(unread.length)return {route:'book-pages/'+unread[0],title:'Open textbook page '+unread[0],kind:'book'};
  for(const id of d.readingIds)if(!completeIndices(s?.sprint?.listening?.[id]?.correct,3))return {route:'listening/'+id,title:'Listen and check meaning',kind:'listening',lessonId:id};
  for(const id of d.lessonIds)if(s?.skills?.writing?.[id]?.passed!==true)return {route:'writing/'+id,title:'Complete guided writing',kind:'writing',lessonId:id};
  const v=data(s,d.number);if(words(v.draft)<d.minWords||!completeIndices(v.writingChecks,3))return {route:'day/'+d.number,title:'Write and check your message',kind:'writing'};
  if(!completeIndices(v.speaking,3)||words(v.speakingNotes)<6)return {route:'day/'+d.number,title:'Speak and save performance notes',kind:'speaking'};
  return {route:'day/'+d.number,title:completeIndices(v.retrieval,3)?'Finish today’s evidence':'Try today’s blind retrieval',kind:completeIndices(v.retrieval,3)?'finish':'retrieval'};
 }
 root.GERMAN_SPRINT={PLAN_ID,days,defaults,entry,clean,words,data,statuses,ready,next,finish,retrieval,reviewTasks,wordsForDay,missing,nextTask};
})(typeof window==='undefined'?globalThis:window);
