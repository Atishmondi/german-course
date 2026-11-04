
(function(root){
  'use strict';
  const VERSION=1;
  const normalise=s=>String(s).normalize('NFC').toLocaleLowerCase('de').replace(/[.,!?;:„“"'’]/g,'').replace(/\s+/g,' ').trim();
  const defaults=()=>({version:VERSION,progress:{},active:null,saved:[],seen:[],reviews:{},days:{},skills:{reading:{},writing:{}},sprint:root.GERMAN_SPRINT.defaults(),settings:{goal:5,speed:0.8,focus:false,breaks:true,reduced:false}});
  function clean(input,course){
    const state=defaults();
    if(!input||typeof input!=='object'||input.version!==VERSION)throw new Error('This is not a German learning progress file.');
    const lessons=new Map(course.lessons.map(l=>[l.id,l]));
    const words=new Set(course.words.map(w=>w.id));
    for(const [id,p] of Object.entries(input.progress||{})){
      if(!lessons.has(id)||!p||typeof p!=='object')continue;
      const total=lessons.get(id).cards.length+lessons.get(id).practice.length+1;
      state.progress[id]={step:Math.max(0,Math.min(total,Math.trunc(Number(p.step)||0))),assisted:!!p.assisted,blindCorrect:!!p.blindCorrect,replaying:!!p.replaying,
        completedAt:typeof p.completedAt==='string'&&!Number.isNaN(Date.parse(p.completedAt))?p.completedAt:null,
        correct:Array.isArray(p.correct)?[...new Set(p.correct.filter(n=>Number.isInteger(n)&&n>=0&&n<lessons.get(id).practice.length))]:[],
        answer:typeof p.answer==='string'?p.answer.slice(0,1000):'',build:Array.isArray(p.build)?p.build.filter(n=>Number.isInteger(n)&&n>=0&&n<50):[]};
    }
    if(lessons.has(input.active)&&state.progress[input.active]&&(!state.progress[input.active].completedAt||state.progress[input.active].replaying))state.active=input.active;
    for(const key of ['saved','seen'])state[key]=[...new Set((Array.isArray(input[key])?input[key]:[]).filter(id=>words.has(id)))];
    for(const [id,r] of Object.entries(input.reviews||{})){
      if(words.has(id)&&r&&Number.isFinite(r.due))state.reviews[id]={due:r.due,level:Math.max(0,Math.min(4,Math.trunc(Number(r.level)||0)))};
    }
    for(const [date,day] of Object.entries(input.days||{})){
      if(/^\d{4}-\d{2}-\d{2}$/.test(date)&&day&&typeof day==='object')state.days[date]={minutes:Math.max(0,Math.min(1440,Number(day.minutes)||0)),lessons:Math.max(0,Number(day.lessons)||0)};
    }
    for(const [id,entry] of Object.entries(input.skills?.reading||{})){
      if(lessons.has(id)&&entry&&typeof entry==='object')state.skills.reading[id]={correct:[...new Set((Array.isArray(entry.correct)?entry.correct:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<3))],doneAt:typeof entry.doneAt==='string'?entry.doneAt:null};
    }
    for(const [id,entry] of Object.entries(input.skills?.writing||{})){
      if(lessons.has(id)&&entry&&typeof entry==='object')state.skills.writing[id]={draft:typeof entry.draft==='string'?entry.draft.slice(0,5000):'',passed:!!entry.passed,doneAt:typeof entry.doneAt==='string'?entry.doneAt:null};
    }
    state.sprint=root.GERMAN_SPRINT.clean(input.sprint);
    const setting=input.settings||{};
    state.settings={goal:[3,5,10].includes(setting.goal)?setting.goal:5,speed:[0.65,0.8,1].includes(setting.speed)?setting.speed:0.8,focus:!!setting.focus,breaks:setting.breaks!==false,reduced:!!setting.reduced};
    return state;
  }
  const dateKey=(d=new Date())=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  function due(state,now=Date.now()){return Object.keys(state.reviews).filter(id=>state.reviews[id].due<=now).sort((a,b)=>state.reviews[a].due-state.reviews[b].due);}
  function next(state,course){const order=course.book?.order||course.lessons.map(l=>l.id);return order.map(id=>course.lessons.find(l=>l.id===id)).find(l=>l&&!state.progress[l.id]?.completedAt)||course.lessons.find(l=>!state.progress[l.id]?.completedAt)||null;}
  function finish(state,lesson,now=Date.now()){
    const progress=state.progress[lesson.id];
    if(!progress||new Set(progress.correct).size!==lesson.practice.length||!progress.blindCorrect)return false;
    const first=!progress.completedAt;
    progress.step=lesson.cards.length+lesson.practice.length+1;
    progress.completedAt=progress.completedAt||new Date(now).toISOString();
    progress.replaying=false;
    state.active=null;
    if(first){const key=dateKey(new Date(now));state.days[key]??={minutes:0,lessons:0};state.days[key].lessons++;state.days[key].minutes+=lesson.minutes;}
    for(const id of lesson.words||[]){
      if(!state.seen.includes(id))state.seen.push(id);
      if(!state.reviews[id])state.reviews[id]={due:now+86400000,level:0};
    }
    return true;
  }
  function review(state,id,remembered,now=Date.now()){
    const current=state.reviews[id]||{level:0};
    const level=remembered?Math.min(4,current.level+1):0;
    const days=[0,1,3,7,14][level];
    state.reviews[id]={level,due:remembered?now+days*86400000:now+10*60000};
    if(!state.seen.includes(id))state.seen.push(id);
  }
  function isCorrect(question,value){
    if(question.type==='choice')return value===question.answer;
    if(question.type==='build')return normalise(value)===normalise(question.answer.join(' '));
    if(question.type==='writing')return writingFeedback(question,value).correct;
    return question.answers.some(a=>normalise(value)===normalise(a));
  }
  function writingFeedback(question,value){
    const answer=normalise(value),exact=question.answers.some(a=>normalise(a)===answer);
    const criteria=(question.checks||[]).map(c=>({label:c.label,passed:new RegExp(c.pattern,'u').test(answer)}));
    return {correct:!!answer&&(exact||(criteria.length>0&&criteria.every(c=>c.passed))),criteria};
  }
  root.KLEIN_CORE={VERSION,normalise,defaults,clean,dateKey,due,next,finish,review,isCorrect,writingFeedback};
})(typeof window==='undefined'?globalThis:window);

