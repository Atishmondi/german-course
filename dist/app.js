// App shell: storage, hash router, sidebar + breadcrumb, and the Home / Chapters / Day / Progress / Grammar / Words / Settings screens.
// Players (lesson.js) and the plan (plan.js) are mounted through the interfaces in active/app-interfaces.md.
(function(){
  'use strict';
  const KEY='klein-german-v1', BACKUP='german-progress-v1-backup';
  const DATA=window.GERMAN_FULL_DATA||null, CORE=window.KLEIN_CORE, PL=window.GERMAN_PLAN,
    MOT=window.GERMAN_MOTIVATION, PLAYER=window.GERMAN_PLAYER;
  const LEVELS=(DATA&&DATA.levels)||null, planId=(LEVELS&&LEVELS.planId)||null;
  const appEl=document.getElementById('app'), toastsEl=document.getElementById('toasts');

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pct=(a,b)=>b?Math.round(a/b*100):0;

  function toast(msg,ms=4500){
    const t=document.createElement('div');t.className='toast';t.textContent=msg;
    toastsEl.appendChild(t);setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),160)},ms);
  }

  if(!CORE){appEl.innerHTML='<main class="empty" id="main"><h1>Something is missing</h1><p class="lede">core.js did not load. Please reload the page.</p></main>';return;}

  // ---------- Storage ----------
  function load(){
    let raw=null;try{raw=localStorage.getItem(KEY);}catch{}
    const res=CORE.migrate(raw,planId);
    if(res.backup!=null){
      try{if(!localStorage.getItem(BACKUP))localStorage.setItem(BACKUP,typeof res.backup==='string'?res.backup:JSON.stringify(res.backup));}catch{}
    }
    return res.state;
  }
  let state=load(), lastAnswered=state.stats.answered, saveWarned=false;
  function save(){
    if(state.stats.answered>lastAnswered){CORE.touchStreak(state);lastAnswered=state.stats.answered;paintStreak();}
    try{localStorage.setItem(KEY,JSON.stringify(state));saveWarned=false;}
    catch{if(!saveWarned){saveWarned=true;toast('This browser is not saving progress right now. Export it in Settings to keep it safe.',8000);}}
  }
  const getState=()=>state;
  MOT&&MOT.connect&&MOT.connect({getState,toast});

  // ---------- Plan ----------
  let plan=null, planError=null;
  if(DATA&&PL){try{plan=PL.build(DATA);}catch(e){planError=e;console.error('GERMAN_PLAN.build failed',e);}}
  const dayMap=new Map((plan&&plan.days||[]).map(d=>[d.n,d]));
  const dayAt=n=>dayMap.get(n);
  const days=()=>plan?plan.days:[];
  const findDay=fn=>days().find(fn);
  const levelEndWeek={};
  if(LEVELS){let w=0;for(const l of LEVELS.levels){w+=l.weeks;levelEndWeek[l.id]=w;}}
  const levelTitle=id=>(LEVELS&&LEVELS.levels.find(l=>l.id===id)||{}).title||String(id||'').toUpperCase();

  // ---------- Speech ----------
  function germanVoice(){
    const vs=window.speechSynthesis?speechSynthesis.getVoices():[];
    return vs.find(v=>/^de[-_]DE/i.test(v.lang))||vs.find(v=>/^de\b/i.test(v.lang))||null;
  }
  function speak(text,rate){
    if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){toast('Read-aloud is not available in this browser.');return null;}
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(String(text||''));
    u.lang='de-DE';u.rate=rate||state.settings.speed||0.85;
    const v=germanVoice();if(v)u.voice=v;
    speechSynthesis.speak(u);return u;
  }
  if(window.speechSynthesis)speechSynthesis.getVoices(); // warms the voice list in Chrome

  // ---------- Shell: fixed left sidebar + breadcrumb bar (laptop layout) ----------
  const I={
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>',
    chapters:'<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
    grammar:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M9 8h6"/>',
    words:'<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
    progress:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    back:'<path d="M15 18l-6-6 6-6"/>',
    sound:'<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>'
  };
  const icon=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k]}</svg>`;
  const NAV=[['home','Home'],['chapters','Chapters'],['grammar','Grammar'],['words','Words'],['progress','Progress'],['settings','Settings']];

  appEl.innerHTML=`<nav class="dock" aria-label="Main">${NAV.map(([k,l])=>`<a href="#/${k}" data-nav="${k}">${icon(k)}<span>${l}</span></a>`).join('')}</nav>
    <div class="stage">
      <nav class="crumbs" id="crumbs" aria-label="Where you are"></nav>
      <main id="main" tabindex="-1"></main>
      <p class="foot">Credits · Atish</p>
    </div>`;
  const mainEl=document.getElementById('main'), crumbsEl=document.getElementById('crumbs');

  function paintStreak(){paintTop();}
  function paintTop(){
    const d=dayAt(state.position.day)||days()[days().length-1];
    const sn=document.getElementById('sidenow');if(sn)sn.innerHTML=(d?`<span class="badge">${esc(levelTitle(d.level))}</span><span>${esc(d.kind==='learn'?chName(d.level,d.chapter):dayLabel(d))}</span>`:'');
  }
  const phaseByHour=()=>{const h=new Date().getHours();return h>=5&&h<8?'dawn':h>=8&&h<17?'day':h>=17&&h<20?'dusk':'night';};
  const FONTS=[["cormorant", "Cormorant Garamond"], ["playfair", "Playfair Display"], ["jersey15", "Jersey 15"], ["dotgothic16", "DotGothic16"], ["handjet", "Handjet"]];
  function applyFont(){document.documentElement.dataset.font=state.settings.font||'cormorant';}
  function applyPhase(){const p=state.settings.phase;document.documentElement.dataset.phase=p&&p!=='auto'?p:phaseByHour();}
  function applyReduced(){document.documentElement.classList.toggle('reduced',!!state.settings.reduced);}

  // ---------- Shared bits ----------
  const notice=(v,emoji,title,text,actions='')=>{v.innerHTML=`<section class="empty"><div class="big" aria-hidden="true">${emoji}</div><h1>${esc(title)}</h1><p class="lede">${text}</p><div class="row" style="justify-content:center">${actions}</div></section>`;};
  const homeBtn='<a class="btn primary" href="#/home">Go to Home →</a>';
  function needPlan(v){
    if(!DATA){notice(v,'✍️','Course content is being written','The lessons are on their way. Your saved progress is safe in this browser. Please check back soon.','<a class="btn" href="#/settings">Settings</a>');return false;}
    if(!PL){notice(v,'🧩','Not built yet','The course plan (plan.js) is not built yet. Please check back soon.');return false;}
    if(planError||!plan){notice(v,'🧩','The plan could not be built','Something in the course data needs fixing. Your progress is safe.');return false;}
    return true;
  }
  const isLocked=n=>!state.settings.openAll&&n>state.position.day; // openAll: temporary checking switch while the course is built
  const dayDoneAt=n=>state.days[n]&&state.days[n].doneAt;

  // Level › Chapter › Day naming. Chapter titles come from the lessons (chapterTitle).
  const chTitle=(lv,ch)=>{const l=(DATA&&DATA.lessons||[]).find(x=>x.level===lv&&x.chapter===ch&&x.chapterTitle);return l?l.chapterTitle:'';};
  const chName=(lv,ch)=>`Ch ${ch}${chTitle(lv,ch)?' '+chTitle(lv,ch):''}`;
  const chapterDays=(lv,ch)=>days().filter(d=>d.kind==='learn'&&d.level===lv&&d.chapter===ch);
  function dayLabel(d){
    if(d.kind==='learn'){const cd=chapterDays(d.level,d.chapter);return `Day ${cd.indexOf(d)+1}`;}
    return d.kind==='review'?`Week ${d.week} review`:d.kind==='mock'?'Practice mock':'Catch-up day';
  }
  function dayCrumbs(d){
    const c=[{t:levelTitle(d.level),h:`#/chapters/${d.level}`}];
    if(d.kind==='learn')c.push({t:chName(d.level,d.chapter),h:`#/chapters/${d.level}/${d.chapter}`});
    c.push({t:dayLabel(d),h:`#/day/${d.n}`});return c;
  }
  const lessonPos=(d,id)=>`Lesson ${d.lessonIds.indexOf(id)+1} of ${d.lessonIds.length}`;

  function partHref(p,n){
    return {recall:`#/recall/${n}`,review:`#/review/${n}`,lesson:`#/lesson/${encodeURIComponent(p.id)}`,
      skills:`#/skills/${encodeURIComponent(p.id)}`,mock:`#/mock/${encodeURIComponent(p.id)}`,checkpoint:`#/checkpoint/${n}`}[p.kind]||'#/home';
  }
  function partMin(d,p){
    if(p.minutes)return p.minutes;
    if(p.kind==='lesson')return (plan.lessonById.get(p.id)||{}).minutes||25;
    if(p.kind==='skills')return (plan.skillDayById.get(p.id)||{}).minutes||40;
    if(p.kind==='recall')return 10;
    if(p.kind==='checkpoint')return 25;
    return d.minutes||60;
  }
  const partLabel={recall:'Quick review',lesson:'Lesson',skills:'Practice',review:'Review',mock:'Practice mock',checkpoint:'Checkpoint'};
  function partName(d,p){
    if(p.kind==='lesson')return `${lessonPos(d,p.id)}: ${p.title}`;
    if(p.kind==='skills')return 'Practice: reading, listening, writing';
    if(p.kind==='recall')return 'Quick review of earlier lessons';
    return p.title||partLabel[p.kind];
  }

  // Right/total over every answer that belongs to this day's lessons, skill day, mock and review (first tries only).
  function dayScore(d){
    const owners=new Set([...(d.lessonIds||[]),d.skillDayId,d.mockId,`day-${d.n}`].filter(Boolean));
    let right=0,total=0;
    for(const [k,a] of Object.entries(state.answers)){if(owners.has(k.split('|')[0])){total++;if(a.correct)right++;}}
    return {right,total};
  }

  // The one next step for day n: {label, why, href} or {label, why, finish:n}; null when the day is not open.
  function nextStep(d){
    const n=d.n;
    if(isLocked(n)||d.available===false||dayDoneAt(n))return null;
    const parts=PL.dayParts(plan,state,n), next=parts.find(p=>!p.done);
    if(!next)return {label:`Finish ${dayLabel(d)}`,why:'Every part is done. This closes the day and opens the next one.',finish:n};
    const href=partHref(next,n);
    if(next.kind==='lesson'){
      const L=plan.lessonById.get(next.id)||{}, r=state.lessons[next.id]||{};
      return {label:`${r.step>0?'Continue':'Start'} ${lessonPos(d,next.id)}: ${L.title||next.title}`,title:L.title||next.title,verb:r.step>0?'Continue':'Start',pos:lessonPos(d,next.id),why:L.goal||'',href};
    }
    if(next.kind==='skills'){const r=state.skillDays[next.id]||{};
      return {label:`${r.step>0?'Continue':'Go to'} Practice`,why:'Use today’s lessons in a short text, a dialogue and some writing.',href};}
    if(next.kind==='recall')return {label:'Start quick Review',why:'A few questions from earlier lessons, so they stay in your head.',href};
    if(next.kind==='review')return {label:`Start ${d.title||'Review'}`,why:'Mixed questions from this week. Answers you revealed come back here.',href};
    return {label:'Start practice mock',why:'A test in the exam style. Passing is a good sign, not a certificate.',href};
  }
  const stepBtn=s=>s.finish?`<button class="btn primary go" type="button" data-finish="${s.finish}">${esc(s.label)} →</button>`
    :`<a class="btn primary go" href="${s.href}">${esc(s.label)} →</a>`;
  const meter=(label,a,b,unit)=>`<div class="meter"><p class="barlabel"><span>${esc(label)}</span><span>${a} of ${b} ${unit}</span></p>
    <div class="bar" role="progressbar" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="${b}" aria-valuenow="${a}"><i style="width:${pct(a,b)}%"></i></div></div>`;
  const redoBtn=id=>`<button type="button" class="btn small" data-redo="${esc(id)}">Redo lesson</button>`;

  function partList(d){
    const n=d.n, parts=PL.dayParts(plan,state,n), next=parts.find(p=>!p.done), locked=isLocked(n)||d.available===false;
    return `<ul class="list" aria-label="Parts of ${esc(dayLabel(d))}">${parts.map(p=>{
      const inner=`<span class="tick" aria-hidden="true">${p.done?'✓':''}</span>
        <span class="t"><b>${esc(partName(d,p))}</b><small>${p.done?'Done':p===next&&!locked?'Next up':locked?'Not open yet':'To do'} · about ${partMin(d,p)} min</small></span>`;
      const cls=`item ${p.done?'done':''} ${p===next&&!locked?'next':''} ${locked?'locked':''}`;
      return `<li class="${p.kind==='lesson'&&p.done?'has-redo':''}">${locked?`<span class="${cls}">${inner}</span>`:`<a class="${cls}" href="${partHref(p,n)}">${inner}</a>`}${p.kind==='lesson'&&p.done&&!locked?redoBtn(p.id):''}</li>`;}).join('')}</ul>`;
  }
  // Delegated: "Redo lesson" buttons and "Finish day" anywhere on a screen.
  function bindDayActions(v){
    v.addEventListener('click',e=>{
      const r=e.target.closest('[data-redo]');
      if(r){const L=plan.lessonById.get(r.dataset.redo);if(L&&CORE.startRedo(state,L.id,PLAYER.lessonKeys(L))){save();go(`#/lesson/${encodeURIComponent(L.id)}`);}return;}
      const f=e.target.closest('[data-finish]');if(f)finishDay(Number(f.dataset.finish),f);
    });
  }

  function endOfCourse(v){
    if(DATA.partial)return notice(v,'✍️','You are up to date','The next days are still being written. Lovely work so far.','<a class="btn" href="#/progress">See your progress</a>');
    return notice(v,'🏁','Course complete','You finished every day of the plan. Take the practice mocks again to check yourself honestly.','<a class="btn primary" href="#/chapters">Open Chapters →</a>');
  }

  // ---------- Day view (#/day/n) ----------
  function renderDay(v,n){
    const d=dayAt(n);
    if(!d)return notice(v,'🔎','Day not found','That day is not in the plan.',homeBtn);
    const where=d.kind==='learn'?`${chName(d.level,d.chapter)}, ${dayLabel(d)}`:dayLabel(d);
    if(isLocked(n))return notice(v,'🔒',`${where} is locked`,'It opens when you finish the day before it. One day at a time.',homeBtn);
    const head=`<h1>${esc(where)}</h1>`;
    if(d.available===false){v.innerHTML=head+`<div class="card hero soon"><h2>Coming soon</h2><p class="lede">The lessons for this day are still being written. Your progress is safe.</p>${homeBtn}</div>`;return;}
    const parts=PL.dayParts(plan,state,n), done=parts.filter(p=>p.done).length, s=nextStep(d);
    const hero=dayDoneAt(n)?`<div class="card hero"><h2>This day is done ✓</h2><p class="lede">You can open any part again, or redo a lesson.</p>${homeBtn}</div>`
      :`<div class="card hero">${stepBtn(s)}<p class="why">${esc(s.why)}</p></div>`;
    v.innerHTML=head+hero+`<div class="section">${meter('This day',done,parts.length,'parts')}</div><div class="section">${partList(d)}</div>`;
    bindDayActions(v);
  }

  async function finishDay(n,btn){
    const d=dayAt(n);if(!d)return;
    btn.disabled=true;
    const score=dayScore(d);
    if(!PL.finishDay(plan,state,n,new Date())){btn.disabled=false;toast('Finish every part first, then close the day.');return;}
    save();paintTop();
    const cel=(k,i)=>MOT?MOT.celebrate(k,Object.assign({},i)):Promise.resolve();
    await cel('day',{title:d.title,learned:d.title,right:score.right,total:score.total});
    if(d.dayInWeek===6)await cel('week',{title:`Week ${d.week}`,learned:`Week ${d.week} is done. Rest day next, then onwards.`});
    if(d.dayInWeek===6&&levelEndWeek[d.level]===d.week)await cel('level',{level:levelTitle(d.level),learned:`All of ${levelTitle(d.level)}. Take the practice mock again any time.`});
    go('#/home');
  }

  // ---------- Screens ----------
  const screens={
    home(v){
      if(!needPlan(v))return;
      const n=state.position.day, d=dayAt(n);
      if(!d)return days().length?endOfCourse(v):notice(v,'✍️','Course content is being written','Please check back soon.');
      const lvDays=days().filter(x=>x.level===d.level), lvDone=lvDays.filter(x=>dayDoneAt(x.n)).length;
      const parts=PL.dayParts(plan,state,n), pdone=parts.filter(p=>p.done).length, s=nextStep(d);
      const where=d.kind==='learn'?`${chName(d.level,d.chapter)} · ${dayLabel(d)}`:dayLabel(d);
      let sec=0;try{const k=new Date();sec=(JSON.parse(localStorage.getItem('german-study-time'))||{})[`${k.getFullYear()}-${String(k.getMonth()+1).padStart(2,'0')}-${String(k.getDate()).padStart(2,'0')}`]||0;}catch{}
      const m=Math.floor(sec/60), hr=new Date().getHours();
      const hello=hr>=5&&hr<11?'Guten Morgen':hr>=11&&hr<18?'Guten Tag':hr>=18&&hr<23?'Guten Abend':'Gute Nacht';
      const helloEn={'Guten Morgen':'good morning','Guten Tag':'good day','Guten Abend':'good evening','Gute Nacht':'good night'}[hello];
      // 24 blocks of 5 minutes = the 2-hour day
      const blocks=Array.from({length:24},(_,i)=>`<i class="${(i+1)*5<=m?'on':''}"></i>`).join('');
      let chLine='';
      if(d.kind==='learn'){const ids=chapterDays(d.level,d.chapter).flatMap(x=>x.lessonIds);chLine=` · ${ids.filter(id=>state.lessons[id]&&state.lessons[id].completedAt).length} of ${ids.length} lessons in Ch ${d.chapter}`;}
      // Word of the day: only words from finished lessons, same word all day
      const known=[];for(const l of DATA.lessons||[])if(state.lessons[l.id]&&state.lessons[l.id].completedAt)(l.vocabulary||[]).forEach(w=>known.push(w));
      const today=new Date(),seed=today.getFullYear()*400+today.getMonth()*32+today.getDate(),w=known.length?known[(seed*7919)%known.length]:null;
      const wDe=w?(w.article?w.article+' ':'')+w.de:'';
      const word=w?`<p class="hw-de" lang="de">${esc(wDe)}</p><p class="hw-en">${esc(w.en)}${w.plural?` · <span lang="de">${esc(w.plural)}</span>`:''}</p>
          <button class="hw-say" type="button" data-say="${esc(wDe)}">${icon('sound')}<span>Hear it</span></button>`
        :`<p class="hw-en">Your first word shows up here once you finish a lesson.</p>`;
      // This week's six days
      const wk=days().filter(x=>x.level===d.level&&x.week===d.week);
      const week=wk.map(x=>{const st=dayDoneAt(x.n)?'done':x.n===n?'now':'later';const lab=x.kind==='learn'?`Day ${x.dayInWeek}`:dayLabel(x);
        return `<li class="${st}"><span class="hk-sq" aria-hidden="true"></span><b>${esc(lab)}</b><small>${st==='done'?'Done':st==='now'?'Today':'Ahead'}</small></li>`;}).join('');
      // The whole path: one column per week, one square per day, flags on checkpoint days
      const LV=LEVELS?LEVELS.levels:[];
      const path=LV.map(lv=>{const ds=days().filter(x=>x.level===lv.id),wks=[...new Set(ds.map(x=>x.week))];
        return `<div class="hp-lv${lv.id===d.level?' cur':''}" style="--w:${wks.length}"><p class="hp-name">${esc(levelTitle(lv.id))}<span>${ds.filter(x=>dayDoneAt(x.n)).length}/${ds.length}</span></p><div class="hp-weeks">${wks.map(k=>{const col=ds.filter(x=>x.week===k);
          return `<div class="hp-wk${col.some(x=>x.checkpointOf&&x.checkpointOf.length)?' flag':''}">${col.map(x=>{const st=dayDoneAt(x.n)?'done':x.n===n?'now':isLocked(x.n)||x.available===false?'lock':'open';
            const t=`${levelTitle(lv.id)} · Week ${k} · ${dayLabel(x)}`;return st==='lock'?`<span class="hp-d ${st}" title="${esc(t)}"></span>`:`<a class="hp-d ${st}" href="#/day/${x.n}" title="${esc(t)}" aria-label="${esc(t)}"></a>`;}).join('')}</div>`;}).join('')}</div></div>`;}).join('');
      const PH=document.documentElement.dataset.phase||'night';
      v.innerHTML=`<section class="hh eh" aria-label="Today's lesson">
          <div class="eh-stage" aria-hidden="true">
            <img class="eh-bg" src="img/e-${PH}.jpg" alt="" decoding="async">
            <img class="eh-ghost" src="img/e-${PH}.jpg" alt="" decoding="async">
            <div class="eh-mist"></div>
            <p class="eh-word">${hello}</p>
            <div class="eh-subject" style="-webkit-mask-image:url(img/e-${PH}-m.png?v=2);mask-image:url(img/e-${PH}-m.png?v=2)"><img src="img/e-${PH}.jpg" alt="" decoding="async"></div>
          </div>
          <div class="hh-top"><span class="hh-brand">German</span><span class="hh-clock"><span>Berlin</span> <b id="hclock"></b></span></div>
          <div class="eh-copy">
            <p class="eh-hello" lang="de"><span class="sr-only">${hello}, </span><i>${helloEn}</i></p>
            <p class="hh-where"><span class="badge">${esc(levelTitle(d.level))}</span>${esc(where)}${s&&s.pos?` · ${esc(s.pos)}`:''}</p>
            <h1 class="hh-title">${s?esc(s.title||s.label):'Coming soon'}</h1>
            ${s?`${s.why?`<p class="hh-why">${esc(s.why)}</p>`:''}
              ${s.finish?`<button class="eh-go" type="button" data-finish="${s.finish}"><span>${esc(s.label)}</span><i aria-hidden="true">→</i></button>`:`<a class="eh-go" href="${s.href}"><span>${esc(s.verb||'Go')}</span><i aria-hidden="true">→</i></a>`}`
              :`<p class="hh-why">The lessons for this day are still being written. Your progress is safe.</p><a class="eh-go ghost" href="#/chapters/${d.level}"><span>Open Chapters</span><i aria-hidden="true">→</i></a>`}
          </div>
        </section>
        <div class="hb bento">
          ${d.available===false?'':`<section class="tile t-today" data-reveal aria-labelledby="ht-h">
            <div class="ht-head"><h2 id="ht-h">Today</h2><p class="ht-min">${pdone} of ${parts.length} parts done${chLine}</p></div>
            ${partList(d)}
          </section>
          <section class="tile t-time" data-reveal aria-labelledby="htm-h">
            <h2 id="htm-h">Study time</h2>
            <p class="t-big"><b>${m}</b><span>/ 120 min</span></p>
            <div class="ht-blocks" role="progressbar" aria-label="Study time today" aria-valuemin="0" aria-valuemax="120" aria-valuenow="${Math.min(m,120)}">${blocks}</div>
            ${m>=120?'<p class="ht-sub">Goal reached</p>':''}
          </section>`}
          <section class="tile t-word hw" data-reveal aria-labelledby="hw-h"><h2 id="hw-h">Word of the day</h2>${word}</section>
          <section class="tile t-week hk" data-reveal aria-labelledby="hk-h"><h2 id="hk-h">This week</h2><ol class="hk-days">${week}</ol></section>
          <section class="tile t-path hp" data-reveal aria-labelledby="hp-h">
            <div class="ht-head"><h2 id="hp-h">Your path</h2><p class="ht-min">${lvDone} of ${lvDays.length} days in ${esc(levelTitle(d.level))}</p></div>
            <div class="hp-map">${path}</div>
            <p class="hp-key"><span><i class="hp-d done"></i>Done</span><span><i class="hp-d now"></i>Today</span><span><i class="hp-d open"></i>Open</span><span><i class="hp-flag"></i>Checkpoint week</span></p>
          </section>
        </div>`;
      bindDayActions(v);
      v.querySelector('[data-say]')?.addEventListener('click',e=>speak(e.currentTarget.dataset.say));
      const reduce=!!state.settings.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(!reduce){ // photo drifts gently against the pointer: smooth, eased, paused off-screen
        const st=v.querySelector('.eh-stage'),word=v.querySelector('.eh-word');let mx=0,my=0,x=0,y=0,raf=0;
        const tick=()=>{x+=(mx-x)*.04;y+=(my-y)*.04;const sy=scrollY;
          st.style.setProperty('--px',`${x.toFixed(2)}px`);st.style.setProperty('--py',`${(y+sy*.12).toFixed(2)}px`);
          word.style.transform=`translate3d(${(x*-.5).toFixed(2)}px,${(y*-.35+sy*.12).toFixed(2)}px,0)`;
          raf=Math.abs(mx-x)+Math.abs(my-y)>.05?requestAnimationFrame(tick):0;};
        const kick=()=>{if(!raf)raf=requestAnimationFrame(tick);};
        const mv=e=>{mx=(e.clientX/innerWidth-.5)*-46;my=(e.clientY/innerHeight-.5)*-28;kick();};
        addEventListener('pointermove',mv,{passive:true});addEventListener('scroll',kick,{passive:true});
        homeStops.push(()=>{removeEventListener('pointermove',mv);removeEventListener('scroll',kick);cancelAnimationFrame(raf);});
      }
      const clock=()=>{const el=document.getElementById('hclock');if(!el)return false;el.textContent=new Date().toLocaleTimeString('de-DE',{timeZone:'Europe/Berlin',hour:'2-digit',minute:'2-digit'});return true;};
      clock();const ci=setInterval(()=>{if(!clock())clearInterval(ci);},10000);homeStops.push(()=>clearInterval(ci));
      if(!reduce){
        const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.15});
        v.querySelectorAll('[data-reveal]').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight)return;el.classList.add('pre');io.observe(el);});homeStops.push(()=>io.disconnect());
        const fb=setTimeout(()=>v.querySelectorAll('[data-reveal].pre').forEach(el=>el.classList.add('in')),2500);homeStops.push(()=>clearTimeout(fb));
      }
    },
    day(v,arg){if(!needPlan(v))return;renderDay(v,parseInt(arg,10)||0);},

    // #/chapters, #/chapters/<level>, #/chapters/<level>/<chapter>: level tabs, then chapters › days › lessons.
    chapters(v,arg){
      if(!needPlan(v))return;
      const [lvArg,chArg]=String(arg||'').split('/');
      const cur=dayAt(state.position.day)||{};
      const lv=LEVELS.levels.some(l=>l.id===lvArg)?lvArg:(cur.level||LEVELS.levels[0].id);
      const L=LEVELS.levels.find(l=>l.id===lv), openCh=chArg?Number(chArg):(cur.level===lv?cur.chapter:1);
      const lvDays=days().filter(d=>d.level===lv);
      const dayState=d=>dayDoneAt(d.n)?['done','Done']:d.available===false?['soon','Coming soon']:isLocked(d.n)?['locked','Locked']:d.n===state.position.day?['now','Today']:['open','Open'];
      const dayBlock=d=>{const [cls,txt]=dayState(d);
        return `<div class="dayrow ${cls}"><div class="dayhead"><a href="#/day/${d.n}">${esc(dayLabel(d))}</a><span class="pill ${cls}">${txt}</span></div>
          ${cls==='soon'?'<p class="muted">The lessons for this day are still being written.</p>':partList(d)}</div>`;};
      let html=`<h1>Chapters</h1>
        <div class="seg" role="group" aria-label="Level">${LEVELS.levels.map(l=>`<a href="#/chapters/${l.id}" aria-current="${l.id===lv?'page':'false'}">${esc(l.title)}</a>`).join('')}</div>
        <p class="lede section">${esc(L.book||'')}. A day opens when you finish the one before it.</p>`;
      for(const ch of Object.keys(L.chapterDays).map(Number)){
        const cd=chapterDays(lv,ch), ids=cd.flatMap(d=>d.lessonIds), ld=ids.filter(id=>state.lessons[id]&&state.lessons[id].completedAt).length;
        const allDone=cd.length&&cd.every(d=>dayDoneAt(d.n)), soon=cd.every(d=>d.available===false);
        html+=`<details class="chap${allDone?' done':''}" id="ch-${ch}"${ch===openCh?' open':''}>
          <summary><span class="chn">${ch}</span><span class="t"><b>${esc(chTitle(lv,ch)||`Chapter ${ch}`)}</b><small>${soon?'Coming soon':`${ld} of ${ids.length} lessons done`}</small></span>${allDone?'<span class="pill done">Done ✓</span>':''}</summary>
          <div class="chap-body">${cd.map(dayBlock).join('')}</div></details>`;
      }
      const other=lvDays.filter(d=>d.kind!=='learn');
      if(other.length)html+=`<h2 class="section">Review and test days</h2><div class="others">${other.map(d=>{const [cls,txt]=dayState(d);
        return cls==='locked'||cls==='soon'?`<span class="other ${cls}">${esc(dayLabel(d))}<small>${txt}</small></span>`:`<a class="other ${cls}" href="#/day/${d.n}">${esc(dayLabel(d))}<small>${txt}</small></a>`;}).join('')}</div>`;
      v.innerHTML=html;
      bindDayActions(v);
      if(chArg){const el=v.querySelector(`#ch-${CSS.escape(chArg)}`);if(el)requestAnimationFrame(()=>el.scrollIntoView({block:'start'}));}
    },

    progress(v){
      if(!needPlan(v))return;
      let s={};try{s=PL.stats(plan,state)||{};}catch(e){console.error(e);}
      const acc=s.accuracy==null?null:s.accuracy<=1?Math.round(s.accuracy*100):Math.round(s.accuracy);
      const tile=(b,l)=>`<div class="stat"><b>${b}</b><span>${l}</span></div>`;
      const totalWeeks=LEVELS.levels.reduce((a,l)=>a+l.weeks,0);
      const perWeek=Array.from({length:totalWeeks},()=>0);
      for(const d of days())if(dayDoneAt(d.n)&&perWeek[d.week-1]!=null)perWeek[d.week-1]++;
      const cur=(dayAt(state.position.day)||{}).week||0;
      const W=640,H=170,base=H-24,top=14,bw=W/totalWeeks;
      const bars=perWeek.map((c,i)=>{const h=c/6*(base-top), x=i*bw+1, w=bw-2, now=i+1===cur;
        const tip=`Week ${i+1}: ${c} of 6 days${now?' (this week)':''}`;
        return `<g class="wk${now?' now':''}" data-tip="${tip}"><rect class="hit" x="${i*bw}" y="${top}" width="${bw}" height="${base-top}"/>`
          +(c?`<path class="bar-m" d="M${x},${base} V${base-h+4} q0,-4 4,-4 h${w-8} q4,0 4,4 V${base} Z"/>`:`<rect class="bar-0" x="${x}" y="${base-2}" width="${w}" height="2" rx="1"/>`)
          +(now?`<rect class="pg-ring" x="${x-2}" y="${top-4}" width="${w+4}" height="${base-top+6}" rx="6"/>`:'')
          +((i===0||(i+1)%4===0)?`<text x="${x+w/2}" y="${H-6}" text-anchor="middle">${i+1}</text>`:'')+`<title>${tip}</title></g>`;}).join('');
      const summary=perWeek.map((c,i)=>c?`week ${i+1}: ${c}`:'').filter(Boolean).join(', ')||'no days finished yet';
      const total=days().length, fig=(b,l)=>`<li><b>${b}</b><span>${l}</span></li>`;
      v.innerHTML=`<h1>Progress</h1>
        <section class="pg-hero section"><p class="pg-big"><b>${s.daysDone??0}</b><span>of ${total} study days done</span></p>
          <ul class="pg-figs">${fig(s.lessonsDone??0,'lessons done')}${fig(acc==null?'–':acc+'%','answers right')}${fig(s.wordsSeen??0,'words seen')}</ul></section>
        <p class="pg-quiet">${state.stats.answered} answers given</p>
        <section class="section chart"><h2>Days finished per week</h2>
          <div class="pg-chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Days finished per week, out of 6: ${esc(summary)}">
            <line class="axis" x1="0" x2="${W}" y1="${base}" y2="${base}"/><line class="grid" x1="0" x2="${W}" y1="${top}" y2="${top}"/>${bars}</svg>
            <div class="pg-tip" hidden></div></div>
          <p class="muted pg-note">Each bar is one week of 6 study days, up to 6. The outlined bar is this week.</p>
          <table class="sr-only"><caption>Days finished per week</caption><tr><th>Week</th><th>Days</th></tr>${perWeek.map((c,i)=>`<tr><td>${i+1}</td><td>${c}</td></tr>`).join('')}</table></section>
        <section class="section"><h2>By level</h2><ul class="pg-levels">${LEVELS.levels.map(L=>{const b=(s.byLevel||{})[L.id]||{done:0,total:0};
          return `<li><span class="t">${esc(L.title)}</span><span class="line"><i style="width:${pct(b.done,b.total)}%"></i></span><span class="n">${b.done} of ${b.total} days</span></li>`;}).join('')}</ul></section>
        <p class="honest section">Lessons done ≠ exam ready: take the practice mocks.</p>`;
      const tipEl=v.querySelector('.pg-tip'), box=v.querySelector('.pg-chart');
      box.addEventListener('pointerover',e=>{const g=e.target.closest('.wk');if(!g){tipEl.hidden=true;return;}
        tipEl.textContent=g.dataset.tip;tipEl.hidden=false;const r=g.getBoundingClientRect(),b=box.getBoundingClientRect();
        tipEl.style.left=`${Math.min(b.width-150,Math.max(0,r.left-b.left+r.width/2-75))}px`;});
      box.addEventListener('pointerleave',()=>{tipEl.hidden=true;});
    },

    grammar(v,arg){
      if(!DATA)return needPlan(v);
      const res=(DATA.resources&&DATA.resources.videos)||{};
      const videoLinks=keys=>(keys||[]).map(k=>{const r=res[k]||{};const id=String(k).startsWith('yt:')?k.slice(3):r.id;
        const url=r.url||(id?`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`:null);
        return url?`<a href="${esc(url)}" target="_blank" rel="noopener">▶ ${esc(r.title||'Grammar video')}</a>`:'';}).join('');
      // cells are strings, or {t,g} with g = m|f|n|pl for gender colour
      const cell=c=>c&&typeof c==='object'?`<td class="g-${esc(c.g)}">${esc(c.t)}</td>`:`<td>${esc(c)}</td>`;
      const table=t=>t&&t.headers?`<table class="tbl"><thead><tr>${t.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${(t.rows||[]).map(r=>`<tr>${r.map(cell).join('')}</tr>`).join('')}</tbody></table>`:'';
      const GROUPS=['Articles & nouns','Pronouns','Verbs','Word order','Questions','Prepositions','Adjectives','Connectors','Numbers & time'];
      const gi=g=>{const i=GROUPS.indexOf(g);return i<0?GROUPS.length:i;};
      const core=(DATA.grammarTables||[]).map(t=>({t,text:CORE.normalise([t.title,t.why,t.group,t.chapter,...t.headers,...t.rows.flat().map(c=>c&&c.t||c),
        ...(t.notes||[]),...(t.examples||[]).flatMap(e=>[e.de,e.en])].join(' '))}));
      const embeds=keys=>{const h=(keys||[]).map(k=>PLAYER&&PLAYER.videoHtml?PLAYER.videoHtml(k,DATA.resources||{}):'').join('');
        return h?`<div class="vids">${h}</div>`:'<p class="soon-vid">Video coming soon</p>';};
      const coreHtml=(t,open)=>`<article class="card ref core"><h3><button type="button" class="ct-toggle" data-ct="${esc(t.id)}" aria-expanded="${open}" aria-controls="ct-${esc(t.id)}">${esc(t.title)}</button></h3>
        <div id="ct-${esc(t.id)}"${open?'':' hidden'}><p class="one">${esc(t.why)}</p>${table(t)}
          ${(t.notes||[]).length?`<ul class="notes">${t.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}
          ${(t.examples||[]).length?`<ul class="ex">${t.examples.map(e=>`<li><b lang="de">${esc(e.de)}</b><span class="muted">${esc(e.en)}</span></li>`).join('')}</ul>`:''}
          ${(t.lessons||[]).length?`<div class="learnin"><p class="learnin-h">Where you learn it</p><ul>${t.lessons.map(lessonLink).join('')}</ul></div>`:''}
          ${embeds(t.videos)}<div class="links"><span class="muted"><span class="badge">${esc(levelTitle(t.level))}</span> Taught in ${esc(t.chapter)}</span></div></div></article>`;
      function lessonLink(id){const L=plan&&plan.lessonById.get(id), d=plan&&dayAt(plan.dayOfLesson.get(id));if(!L||!d)return '';
        return `<li><a href="#/lesson/${encodeURIComponent(id)}"><span class="muted">${esc(levelTitle(d.level))} Ch ${d.chapter} · ${esc(dayLabel(d))} · Lesson ${(d.lessonIds||[]).indexOf(id)+1}</span> ${esc(L.title)} →</a></li>`;}
      // learning order: a table sits at the first day + lesson that teaches it (user: "the same order as i learn")
      for(const c of core){c.pos=Infinity;for(const id of c.t.lessons||[]){const dn=plan&&plan.dayOfLesson.get(id),D=dn!=null&&dayAt(dn);if(!D)continue;
        const k=dn*100+Math.max(0,(D.lessonIds||[]).indexOf(id));if(k<c.pos)c.pos=k;} c.day=isFinite(c.pos)?Math.floor(c.pos/100):null;}
      const today=state.position.day;
      const lvIds=(LEVELS?LEVELS.levels.map(l=>l.id):['a1','a2','b1']).filter(id=>core.some(c=>c.t.level===id));
      const curLv=(dayAt(state.position.day)||{}).level;
      let lvSel=lvIds.includes(curLv)?curLv:(lvIds[0]||'all'), openIds=null;
      const want=arg&&core.find(c=>c.t.id===arg);   // #/grammar/<tableId>: open that table
      if(want){lvSel=want.t.level;openIds=new Set([want.t.id]);}
      const items=(DATA.lessons||[]).map(l=>{const g=l.grammar||{},m=g.mistake||{};
        return {l,text:CORE.normalise([l.title,g.point,g.oneLine,m.wrong,m.right,m.why,...(l.cards||[]).map(c=>c.title)].join(' ')),
          html:`<article class="card ref"><h3>${esc(g.point||l.title)}</h3><p class="one">${esc(g.oneLine||'')}</p>
            ${m.wrong?`<p class="mistake"><s>${esc(m.wrong)}</s> → <b>${esc(m.right)}</b><br><span class="muted">${esc(m.why||'')}</span></p>`:''}
            ${(l.cards||[]).map(c=>table(c.table)).join('')}
            <div class="links">${videoLinks(l.media&&l.media.grammarVideos)}<a href="#/day/${plan&&plan.dayOfLesson?plan.dayOfLesson.get(l.id)||'':''}" class="muted">From: ${esc(l.title)}</a></div></article>`};});
      v.innerHTML=`<h1>Grammar</h1>
        <label class="sr-only" for="gq">Search grammar</label><input id="gq" class="search" type="search" placeholder="Search, e.g. accusative, den, verb" autocomplete="off">
        ${core.length?`<section class="section" aria-labelledby="ct-h"><h2 id="ct-h">Core tables</h2>
          <div class="ct-bar"><div class="seg" role="group" aria-label="Level">${[...lvIds,'all'].map(id=>`<button type="button" data-lv="${id}" aria-pressed="${id===lvSel}">${id==='all'?'All':esc(levelTitle(id))}</button>`).join('')}</div>
          <p class="legend" aria-label="Colour key"><span class="g-m">masculine</span><span class="g-f">feminine</span><span class="g-n">neuter</span><span class="g-pl">plural</span></p></div>
          <div id="clist"></div></section><h2 class="section">From your lessons</h2>`:''}
        <div id="glist" class="section"></div>`;
      const list=v.querySelector('#glist'), q=v.querySelector('#gq'), clist=v.querySelector('#clist');
      const paintCore=term=>{
        if(!clist)return;
        // while searching, look in every level so nothing is hidden by the level filter
        const hits=core.filter(c=>term?c.text.includes(term):lvSel==='all'||c.t.level===lvSel)
          .sort((a,b)=>(a.pos-b.pos)||lvIds.indexOf(a.t.level)-lvIds.indexOf(b.t.level)||gi(a.t.group)-gi(b.t.group));
        if(!hits.length){clist.innerHTML=`<p class="lede">${term?'No core table matches that search.':'No core tables for this level yet.'}</p>`;return;}
        if(!openIds){const past=hits.filter(c=>c.day!=null&&c.day<=today),d=past.length?past[past.length-1].day:hits[0].day;
          openIds=new Set(hits.filter(c=>c.day===d).map(c=>c.t.id));}
        let html='',grp;
        for(const c of hits){
          const D=c.day!=null&&dayAt(c.day), head=D?`${esc(levelTitle(D.level))} · Chapter ${D.chapter} · ${esc(dayLabel(D))}${c.day===today?' · <b>Today</b>':''}`:'Extra reference';
          if(head!==grp){grp=head;html+=`<p class="eyebrow section"${c.day===today?' id="ct-today"':''}>${head}</p>`;}
          html+=coreHtml(c.t,!!term||openIds.has(c.t.id));
        }
        clist.innerHTML=html;
      };
      v.addEventListener('click',e=>{
        const lb=e.target.closest('[data-lv]');
        if(lb){lvSel=lb.dataset.lv;openIds=null;v.querySelectorAll('[data-lv]').forEach(b=>b.setAttribute('aria-pressed',String(b===lb)));paint();return;}
        const tb=e.target.closest('[data-ct]');if(!tb)return;
        const open=tb.getAttribute('aria-expanded')!=='true',body=v.querySelector('#'+CSS.escape(tb.getAttribute('aria-controls')));
        tb.setAttribute('aria-expanded',String(open));if(body)body.hidden=!open;
        if(openIds)open?openIds.add(tb.dataset.ct):openIds.delete(tb.dataset.ct);
      });
      const paint=()=>{
        const term=CORE.normalise(q.value);
        paintCore(term);
        const hits=items.filter(i=>!term||i.text.includes(term));
        if(!items.length){list.innerHTML='<p class="lede">Grammar notes appear here as lessons are written.</p>';return;}
        if(!hits.length){list.innerHTML='<p class="lede">No grammar matches that search.</p>';return;}
        let html='',lv=null,ch=null;
        for(const i of hits){
          if(i.l.level!==lv){lv=i.l.level;ch=null;html+=`<h2 class="section"><span class="badge">${esc(levelTitle(lv))}</span></h2>`;}
          if(i.l.chapter!==ch){ch=i.l.chapter;html+=`<p class="eyebrow section">Chapter ${esc(ch)}</p>`;}
          html+=i.html;
        }
        list.innerHTML=html;
      };
      q.addEventListener('input',paint);paint();
      if(want)requestAnimationFrame(()=>{const el=v.querySelector('#ct-'+CSS.escape(want.t.id));if(el)el.closest('article').scrollIntoView({block:'start'});});
    },

    words(v){
      if(!DATA)return needPlan(v);
      const all=[],seen=new Set(); // the same word taught twice is listed once
      for(const l of DATA.lessons||[])if(state.lessons[l.id]&&state.lessons[l.id].completedAt)
        (l.vocabulary||[]).forEach((w,i)=>{const k=CORE.normalise(w.de+'|'+w.en);if(seen.has(k))return;seen.add(k);all.push({id:`${l.id}:${i}`,de:(w.article?w.article+' ':'')+w.de,en:w.en,extra:w.plural||w.forms||'',ex:(w.examples||[])[0]});});
      const isDue=w=>{const r=state.words[w.id];return !r||r.due<=Date.now();};
      const list=()=>{
        const due=all.filter(isDue).length;
        v.innerHTML=`<p class="eyebrow">${all.length} words from finished lessons</p><h1>Words</h1>
          ${all.length?`<button class="btn primary big" type="button" data-practice ${due?'':'disabled'}>${due?`Practise ${Math.min(due,20)} due word${due>1?'s':''}`:'Nothing due right now ✓'}</button>
          <div class="section"><label class="sr-only" for="wq">Search words</label><input id="wq" class="search" type="search" placeholder="Search German or English" autocomplete="off"></div>
          <ul class="words section" id="wl"></ul>`:'<div class="card section"><p class="lede">Words appear here after you finish your first lesson.</p></div>'}`;
        if(!all.length)return;
        const ul=v.querySelector('#wl'),q=v.querySelector('#wq');
        const paint=()=>{const t=CORE.normalise(q.value);
          const hits=all.filter(w=>!t||CORE.normalise(w.de+' '+w.en).includes(t));
          ul.innerHTML=hits.map(w=>`<li><span class="de">${esc(w.de)}${w.extra?` <span class="muted">· ${esc(w.extra)}</span>`:''}</span><span class="en">${esc(w.en)}</span></li>`).join('')||'<li class="muted">No words match.</li>';};
        q.addEventListener('input',paint);paint();
        v.querySelector('[data-practice]').addEventListener('click',()=>practise(all.filter(isDue).slice(0,20)));
      };
      const practise=queue=>{
        let i=0,known=0,shown=false;
        const card=()=>{
          if(i>=queue.length){v.innerHTML=`<section class="empty"><div class="big" aria-hidden="true">✨</div><h1>Practice done</h1><p class="lede">You knew ${known} of ${queue.length}. The rest come back soon.</p><button class="btn primary" type="button" data-back>Back to words</button></section>`;
            v.querySelector('[data-back]').addEventListener('click',list);v.querySelector('[data-back]').focus();return;}
          const w=queue[i];
          v.innerHTML=`<p class="barlabel"><span>Word ${i+1} of ${queue.length}</span><button class="btn" type="button" data-stop>Save &amp; pause</button></p>
            <div class="bar"><i style="width:${pct(i,queue.length)}%"></i></div>
            <div class="card flash section"><p class="eyebrow">What does this mean?</p><p class="q" lang="de">${esc(w.de)}</p>
              <button class="btn" type="button" data-say>🔊 Hear it</button>
              <p class="a" aria-live="polite">${shown?esc(w.en):''}</p>${shown&&w.ex?`<p class="muted" lang="de">${esc(w.ex.de)}</p>`:''}</div>
            <div class="row section">${shown?`<button class="btn primary" style="flex:1" type="button" data-yes>I knew it</button><button class="btn" style="flex:1" type="button" data-no>Not yet</button>`
              :`<button class="btn primary big" type="button" data-show>Show answer</button>`}</div>`;
          const on=(s,f)=>{const b=v.querySelector(s);if(b)b.addEventListener('click',f);return b;};
          on('[data-stop]',list);on('[data-say]',()=>speak(w.de));
          const grade=ok=>{CORE.reviewWord(state,w.id,ok);if(ok)known++;save();i++;shown=false;card();};
          (on('[data-show]',()=>{shown=true;card();})||on('[data-yes]',()=>grade(true))).focus();
          on('[data-no]',()=>grade(false));
        };
        card();
      };
      list();
    },

    settings(v){
      const s=state.settings;
      const sw=(k,l,sub)=>`<div class="set"><label for="s-${k}">${l}<small>${sub}</small></label><input class="switch" type="checkbox" id="s-${k}" data-k="${k}" ${s[k]?'checked':''}></div>`;
      const seg=(k,l,vals,fmt)=>`<div class="set"><span class="lbl" id="l-${k}">${l}</span><div class="seg" role="group" aria-labelledby="l-${k}">${vals.map(x=>`<button type="button" data-seg="${k}" data-v="${x}" aria-pressed="${s[k]===x}">${fmt(x)}</button>`).join('')}</div></div>`;
      const canAsk='Notification' in window&&Notification.permission==='default';
      v.innerHTML=`<h1>Settings</h1>
        <section class="section"><h2>Look</h2><p class="muted">The photo and colours follow the time of day, or pick one to keep.</p>
          <div class="looks" role="group" aria-label="Look">${[['auto','Auto','Follows your clock'],['dawn','Dawn','Lone pine'],['day','Day','Above the clouds'],['dusk','Dusk','Ember peak'],['night','Night','Star trails'],['lake','Lake','Forest lake'],['plain','Plain','Golden plain'],['alpen','Alpen','Alpenglow']].map(([k,l,sub])=>`<button type="button" class="look" data-phase-pick="${k}" aria-pressed="${(s.phase||'auto')===k}"><span class="look-img${k==='auto'?' auto':''}" ${k==='auto'?'':`style="background-image:url(img/e-${k}.jpg)"`}>${k==='auto'?['dawn','day','dusk','night'].map(p=>`<i style="background-image:url(img/e-${p}.jpg)"></i>`).join(''):''}</span><b>${l}</b><small>${sub}</small></button>`).join('')}</div></section>
        <section class="section"><h2>Heading font</h2><p class="muted">The font for titles, step buttons and the dock.</p>
          <div class="fonts" role="group" aria-label="Heading font">${FONTS.map(([k,n])=>`<button type="button" class="fontpick" data-font-pick="${k}" aria-pressed="${(s.font||'cormorant')===k}"><span style="font-family:'${n}'">Gute Nacht</span><small>${n}</small></button>`).join('')}</div></section>
        <section class="section"><h2>Motivation</h2>
          ${sw('reminders','Gentle reminders','A short encouraging note while you study')}
          ${seg('interval','Reminder every',[3,5,10],x=>x+' min')}
          ${canAsk?`<div class="set"><span class="lbl">Notifications<small>Show reminders when this tab is in the background</small></span><button class="btn" type="button" data-notify>Allow</button></div>`:''}
          ${sw('celebrate','Celebrations','A full-screen moment when you finish something')}
          ${sw('sound','Sound','A tiny chime with celebrations')}
          ${sw('reduced','Reduce motion','No confetti or moving effects')}</section>
        <section class="section"><h2>Checking</h2>
          ${sw('openAll','Open every day','For checking new chapters. Your progress stays as it is.')}</section>
        <section class="section"><h2>Listening</h2>
          ${seg('speed','Speech speed',[0.7,0.85,1],x=>x===1?'1×':x+'×')}
          <div class="set"><span class="lbl">Test the German voice</span><button class="btn" type="button" data-test>🔊 Play</button></div></section>
        <section class="section"><h2>Your progress file</h2>
          <p class="lede">Progress is saved in this browser only. Export it now and then to keep a copy.</p>
          <div class="row"><button class="btn" type="button" data-export>Export progress</button>
            <label class="btn" for="imp">Import progress</label><input id="imp" class="sr-only" type="file" accept="application/json,.json"></div></section>
        <section class="section"><h2>Reported questions</h2>
          <p class="lede">Questions you marked "Looks wrong". Download the list and give it to the next German check.</p>
          <div class="row"><button class="btn" type="button" data-reports>Download reports (${(()=>{try{return (JSON.parse(localStorage.getItem('german-reports'))||[]).length;}catch{return 0;}})()})</button></div></section>
        <section class="section card"><h2>Reset progress</h2><p class="lede">This deletes all progress in this browser. Your settings stay. Type <b>RESET</b> to confirm.</p>
          <label class="sr-only" for="rst">Type RESET to confirm</label><input id="rst" class="field" autocomplete="off" spellcheck="false">
          <div class="row" style="margin-top:12px"><button class="btn danger" type="button" data-reset disabled>Reset progress</button></div></section>`;
      v.addEventListener('change',e=>{
        const k=e.target.dataset&&e.target.dataset.k;
        if(k){s[k]=e.target.checked;save();if(k==='reduced')applyReduced();}
      });
      v.addEventListener('click',e=>{
        const b=e.target.closest('button');if(!b)return;
        if(b.dataset.fontPick){s.font=b.dataset.fontPick;save();applyFont();v.querySelectorAll('[data-font-pick]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));return;}
        if(b.dataset.phasePick){s.phase=b.dataset.phasePick;save();applyPhase();v.querySelectorAll('[data-phase-pick]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));return;}
        if(b.dataset.seg){s[b.dataset.seg]=Number(b.dataset.v);save();
          v.querySelectorAll(`[data-seg="${b.dataset.seg}"]`).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}
        else if('test' in b.dataset)speak('Hallo! Ich heiße Mira. Ich lerne Deutsch.');
        else if('notify' in b.dataset)Notification.requestPermission().then(p=>{toast(p==='granted'?'Notifications are on.':'Notifications stay off. Reminders show in the page.');route();});
        else if('export' in b.dataset){
          const blob=new Blob([JSON.stringify(state,null,1)],{type:'application/json'});
          const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`german-progress-${CORE.dateKey()}.json`;
          document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast('Progress exported.');
        }else if('reports' in b.dataset){
          let list='[]';try{list=localStorage.getItem('german-reports')||'[]';}catch{}
          const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([list],{type:'application/json'}));a.download=`german-reports-${CORE.dateKey()}.json`;
          document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);toast('Reports downloaded.');
        }else if('reset' in b.dataset){
          if(v.querySelector('#rst').value.trim().toUpperCase()!=='RESET')return;
          const keep=state.settings;state=CORE.defaults(planId);state.settings=keep;lastAnswered=0;save();toast('Progress reset. A fresh start.');go('#/home');
        }
      });
      const rst=v.querySelector('#rst');
      rst.addEventListener('input',()=>{v.querySelector('[data-reset]').disabled=rst.value.trim().toUpperCase()!=='RESET';});
      v.querySelector('#imp').addEventListener('change',e=>{
        const f=e.target.files&&e.target.files[0];if(!f)return;
        if(f.size>5e6){toast('That file is too big to be a progress export.');return;}
        f.text().then(text=>{
          let parsed;try{parsed=JSON.parse(text);}catch{toast('That file is not valid JSON.');return;}
          const res=CORE.migrate(parsed,planId);
          if(res.backup!=null){toast('That file is not a progress export from this course.');return;}
          if(!confirm('Replace the progress in this browser with the imported file?'))return;
          state=res.state;lastAnswered=state.stats.answered;save();applyReduced();toast('Progress imported.');go('#/home');
        }).catch(()=>toast('Could not read that file.'));
        e.target.value='';
      });
    }
  };

  // ---------- Players ----------
  function mountPlayer(kind,v,arg){
    if(!needPlan(v))return;
    if(!PLAYER)return notice(v,'🧩','Not built yet','The lesson player (lesson.js) is not built yet. Please check back soon.',homeBtn);
    let n,item,fn,label;
    if(kind==='lesson'){item=plan.lessonById.get(arg);n=plan.dayOfLesson.get(arg);fn='mountLesson';label='lesson';}
    else if(kind==='skills'){item=plan.skillDayById.get(arg);n=(findDay(d=>d.skillDayId===arg)||{}).n;fn='mountSkillDay';label='Practice';}
    else if(kind==='mock'){item=plan.mockById.get(arg);n=(findDay(d=>d.mockId===arg)||{}).n;fn='mountMock';label='practice mock';}
    else if(kind==='checkpoint'){n=parseInt(arg,10);item=dayAt(n)?PL.checkpointSet(plan,n):null;fn='mountCheckpoint';label='checkpoint';}
    else{n=parseInt(arg,10);fn='mountRecall';label='Review';
      if(dayAt(n))item=kind==='review'?PL.reviewSet(plan,state,n):PL.dueRecall(plan,state,n);}
    if(!item||n==null)return notice(v,'🔎','Not found',`That ${label} is not in the plan yet.`,homeBtn);
    if(isLocked(n))return notice(v,'🔒','Not open yet','This opens when you reach its day. One day at a time.',homeBtn);
    if(typeof PLAYER[fn]!=='function')return notice(v,'🧩','Not built yet',`The ${label} player is not built yet.`,homeBtn);
    if(Array.isArray(item)&&!item.length)return notice(v,'✨','Nothing to review right now','Everything due is already done. On to the next part.',homeBtn);
    if(!state.days[n])state.days[n]={startedAt:new Date().toISOString(),doneAt:null};
    save();
    const api={getState,save,core:CORE,plan,data:DATA,resources:DATA.resources||{},
      celebrate:(k,i)=>MOT?MOT.celebrate(k,i):Promise.resolve(),
      onDone:result=>onDone(kind,arg,result||{}),onExit:()=>go(`#/day/${n}`),speak,dayN:n};
    if(MOT)MOT.start({getState,toast});
    try{PLAYER[fn](v,item,api);}
    catch(e){console.error(e);notice(v,'🛠️','This part could not open','Your progress is safe. Please go back and try again.',homeBtn);}
  }

  async function onDone(kind,id,result){
    if(kind==='lesson'){
      const L=plan.lessonById.get(id), was=!!(state.lessons[id]&&state.lessons[id].completedAt);
      const ok=PL.completeLesson(plan,state,id,new Date());
      if(result.redo){CORE.endRedo(state,id);save();toast('Redo finished. Your first score is still saved.');return go(`#/day/${plan.dayOfLesson.get(id)}`);}
      for(const k of Object.keys(state.practice||{}))if(k.startsWith(id+'|'))delete state.practice[k]; // tidy "Try again" answers
      save();
      if(was)return go(`#/day/${plan.dayOfLesson.get(id)}`);
      if(ok&&MOT){
        const sec=CORE.section(state,id,'check',L.check||[]);
        await MOT.celebrate('lesson',{title:L.title,learned:(L.grammar&&L.grammar.oneLine)||L.title,
          right:result.right!=null?result.right:sec.right,total:result.total!=null?result.total:sec.total});
      }else if(!ok)toast('Nearly there: finish the drills, the new sentence on your own and the quiz to complete this lesson.');
    }else if(kind==='skills'){
      const r=state.skillDays[id]||(state.skillDays[id]={step:0,doneAt:null});
      if(!r.doneAt)r.doneAt=new Date().toISOString();save();toast('Practice done. Nice.');
    }else if(kind==='mock')toast('Practice mock finished. It is practice, not a certificate.');
    else if(kind==='checkpoint'){const n=parseInt(id,10);state.checkpoints=state.checkpoints||{};state.checkpoints[`checkpoint-${n}`]={score:result.score||null,doneAt:new Date().toISOString()};save();toast('Checkpoint saved. Look back at it before the next one.');return go(`#/day/${n}`);}
    go('#/home');
  }

  // ---------- Breadcrumb: Level › Chapter › Day › Lesson. Back always goes up one crumb. ----------
  function crumbsFor(name,arg){
    const TOP={home:'Home',chapters:'Chapters',grammar:'Grammar',words:'Words',progress:'Progress',settings:'Settings'};
    if(!plan||name==='home'||(TOP[name]&&name!=='chapters'))return [{t:TOP[name]||'Home',h:`#/${TOP[name]?name:'home'}`}];
    if(name==='chapters'){const [lv,ch]=String(arg||'').split('/');const L=LEVELS.levels.find(l=>l.id===lv);
      const c=[{t:'Chapters',h:'#/chapters'}];if(L)c.push({t:L.title,h:`#/chapters/${lv}`});if(L&&ch)c.push({t:chName(lv,Number(ch)),h:`#/chapters/${lv}/${ch}`});return c;}
    let d=null,last=null;
    if(name==='day')d=dayAt(parseInt(arg,10));
    else if(name==='lesson'){const n=plan.dayOfLesson.get(arg);d=dayAt(n);if(d)last={t:lessonPos(d,arg),h:`#/lesson/${encodeURIComponent(arg)}`};}
    else if(name==='skills'){d=findDay(x=>x.skillDayId===arg);last={t:'Practice',h:`#/skills/${encodeURIComponent(arg)}`};}
    else if(name==='recall'||name==='review'){d=dayAt(parseInt(arg,10));if(d&&d.kind==='learn')last={t:'Review',h:location.hash};}
    else if(name==='mock')d=findDay(x=>x.mockId===arg);
    else if(name==='checkpoint'){d=dayAt(parseInt(arg,10));last={t:'Checkpoint',h:location.hash};}
    if(!d)return [{t:'Home',h:'#/home'}];
    return [...dayCrumbs(d),...(last?[last]:[])];
  }
  function paintCrumbs(name,arg){
    const c=crumbsFor(name,arg), up=c.length>1?c[c.length-2]:name==='home'?null:{t:'Home',h:'#/home'};
    crumbsEl.innerHTML=`${up?`<a class="back" href="${up.h}">${icon('back')}<span>Back<span class="sr-only"> to ${esc(up.t)}</span></span></a>`:''}
      <ol>${c.map((x,i)=>`<li>${i===c.length-1?`<span aria-current="page">${esc(x.t)}</span>`:`<a href="${x.h}">${esc(x.t)}</a>`}</li>`).join('')}</ol>`;
  }

  // ---------- Router ----------
  const homeStops=[];
  function go(hash){if(location.hash===hash)route();else location.hash=hash;}
  function route(){
    if(MOT)MOT.stop();
    while(homeStops.length)homeStops.pop()();
    if(window.speechSynthesis)speechSynthesis.cancel();
    let [name,...rest]=(location.hash.replace(/^#\/?/,'')||'home').split('/');
    if(name==='today')name='home';if(name==='plan')name='chapters';   // old links keep working
    const arg=decodeURIComponent(rest.join('/'));
    const isPlayer=['lesson','skills','recall','review','mock','checkpoint'].includes(name);
    document.body.classList.toggle('playing',isPlayer);
    document.body.classList.toggle('at-home',name==='home');
    const navKey=isPlayer||name==='day'?'chapters':name;
    document.querySelectorAll('[data-nav]').forEach(a=>a.dataset.nav===navKey?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
    const v=document.createElement('div');mainEl.replaceChildren(v); // fresh node: players bind delegated events to it
    paintTop();
    if(isPlayer)mountPlayer(name,v,arg);
    else if(screens[name])screens[name](v,arg);
    else notice(v,'🔎','Page not found','That address does not exist.',homeBtn);
    paintCrumbs(name,arg);
    const h1=v.querySelector('h1');
    document.title=(h1?h1.textContent.trim()+' · ':'')+'German';
    window.scrollTo(0,0);mainEl.focus({preventScroll:true});
  }

  applyReduced();applyPhase();applyFont();
  window.addEventListener('hashchange',route);
  route();
  window.GERMAN_APP={getState,save,go,route,toast,speak};
})();
