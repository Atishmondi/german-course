/* The plan separates app checks, textbook work and self-assessed performance. */
(()=>{
 const book=window.GERMAN_COURSE.book;
 const days=book.chapters.map(c=>({number:c.number,title:c.title,chapterNumbers:[c.number],lessonIds:[...c.related,c.id],readingIds:[c.id],minutes:260,phase:'Learn',goal:c.goal}));
 const pairs=[[1,2],[3,4],[5,6],[7,8],[9,10],[11,12]];
 pairs.forEach((ns,i)=>days.push({number:13+i,title:['Meet people & make plans','Find places & buy food','Arrange times & invite friends','Work messages & appointments','Homes & yesterday','Shopping & travel'][i],chapterNumbers:ns,lessonIds:ns.map(n=>'a1-'+String(n).padStart(2,'0')),readingIds:ns.map(n=>'a1-'+String(n).padStart(2,'0')),minutes:260,phase:'Review',goal:'Retrieve chapters '+ns.join(' + ')+' without notes, then repair the weakest points.'}));
 for(let n=19;n<=21;n++)days.push({number:n,title:n===19?'First timed A1 practice':n===20?'Repair & second practice':'Four-skill readiness check',chapterNumbers:n===19?[1,4,7]:n===20?[5,8,10]:[9,11,12],lessonIds:[],readingIds:[],minutes:260,phase:'Check',goal:n===21?'Record evidence in all four skills and choose what to revise next.':'Use an official Goethe practice paper, record results, and rework every error.'});
 const defaults=()=>({startedAt:null,days:{},listening:{},timer:{remaining:1500,endsAt:null,mode:'focus'}});
 const entry=()=>({book:false,native:false,speaking:[],writingChecks:[],draft:'',retrieval:[],completedAt:null,exam:{reading:'',listening:'',writing:'',speaking:[]}});
 function clean(input){
  const out=defaults();if(!input||typeof input!=='object')return out;
  if(typeof input.startedAt==='string'&&!Number.isNaN(Date.parse(input.startedAt)))out.startedAt=input.startedAt;
  const indices=(a,max)=>[...new Set((Array.isArray(a)?a:[]).filter(x=>Number.isInteger(x)&&x>=0&&x<max))];
  for(const d of days){const x=input.days?.[d.number];if(!x||typeof x!=='object')continue;const v=entry();v.book=!!x.book;v.native=!!x.native;v.speaking=indices(x.speaking,3);v.writingChecks=indices(x.writingChecks,3);v.retrieval=indices(x.retrieval,3);v.draft=typeof x.draft==='string'?x.draft.slice(0,8000):'';v.completedAt=typeof x.completedAt==='string'&&!Number.isNaN(Date.parse(x.completedAt))?x.completedAt:null;for(const k of ['reading','listening','writing']){const s=String(x.exam?.[k]??'');v.exam[k]=/^\d{1,3}$/.test(s)&&Number(s)<=100?s:'';}v.exam.speaking=indices(x.exam?.speaking,4);out.days[d.number]=v;}
  for(const c of book.chapters){const x=input.listening?.[c.id];if(x)out.listening[c.id]={correct:indices(x.correct,3)};}
  const t=input.timer||{};out.timer={remaining:Math.max(0,Math.min(1500,Math.trunc(Number(t.remaining)||0))),endsAt:Number.isFinite(t.endsAt)?t.endsAt:null,mode:t.mode==='break'?'break':'focus'};
  return out;
 }
 const words=s=>(s.trim().match(/[\p{L}\p{N}]+(?:[’'-][\p{L}]+)*/gu)||[]).length;
 const data=(s,n)=>s.sprint.days[n]||entry();
 function statuses(s,d){const v=data(s,d.number);if(d.phase==='Check')return [v.book&&v.retrieval.length===3,v.exam.reading!==''&&v.exam.listening!=='',v.native,v.draft.trim().length>0&&words(v.draft)>=30&&v.writingChecks.length===3&&v.exam.writing!=='',v.exam.speaking.length===4];return [d.lessonIds.every(id=>!!s.progress[id]?.completedAt),v.book&&d.readingIds.every(id=>s.skills.reading[id]?.correct.length===3),v.native&&d.readingIds.every(id=>s.sprint.listening[id]?.correct.length===3),d.readingIds.every(id=>s.skills.writing[id]?.passed)&&words(v.draft)>=(d.number<=12?book.chapters[d.number-1].min:30)&&v.writingChecks.length===3,v.speaking.length===3];}
 const ready=(s,d)=>statuses(s,d).every(Boolean)&&data(s,d.number).retrieval.length===3;
 const next=s=>days.find(d=>!data(s,d.number).completedAt)||days[20];
 function finish(s,n,now=Date.now()){const d=days.find(x=>x.number===n);if(!d||!ready(s,d))return false;const v=s.sprint.days[n]??=entry();v.completedAt??=new Date(now).toISOString();return true;}
 function retrieval(d){return d.chapterNumbers.flatMap(n=>{const l=window.GERMAN_COURSE.lessons.find(l=>l.id==='a1-'+String(n).padStart(2,'0'));return [l.blind,...l.practice.filter(q=>q.type==='type')];}).slice(0,3);}
 // One chapter has two distinct questions; add a third taught transfer task.
 const extra=[['Say “I come from Germany.”',['Ich komme aus Deutschland.']],['Say “I like reading.”',['Ich lese gern.']],['Ask “Where is the bank?”',['Wo ist die Bank?']],['Ask the price of the tea.',['Was kostet der Tee?']],['Say “My sister can come today.”',['Meine Schwester kann heute kommen.']],['Say “The present is for Anna.”',['Das Geschenk ist für Anna.']],['Say “I work with the colleague.” (die Kollegin)',['Ich arbeite mit der Kollegin.']],['Say “I need an appointment.”',['Ich brauche einen Termin.']],['Say “The kitchen is big.”',['Die Küche ist groß.']],['Say “He studied yesterday.” (lernen)',['Er hat gestern gelernt.']],['Ask “Which jacket is nice?”',['Welche Jacke ist schön?']],['Say “It is warm tomorrow.”',['Morgen ist es warm.','Es ist morgen warm.']]];
 const getRetrieval=d=>{const qs=retrieval(d);if(qs.length<3){const x=extra[d.chapterNumbers[0]-1];qs.push({type:'type',prompt:x[0],answers:x[1]});}return qs;};
 window.GERMAN_SPRINT={days,defaults,entry,clean,words,data,statuses,ready,next,finish,retrieval:getRetrieval};
})();
