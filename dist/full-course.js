/* Expand the course without changing any legacy lesson or progress IDs. */
(()=>{
 'use strict';
 const C=window.GERMAN_COURSE,D=window.GERMAN_FULL_DATA;
 if(!D?.lessons?.length)throw new Error('Full A1 course content is missing.');
 const norm=s=>String(s).normalize('NFC').toLocaleLowerCase('de').replace(/[.,!?;:„“"'’]/g,'').replace(/\s+/g,' ').trim();
 const regex=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 C.fullLessons=[];
 const newUnits=C.book.chapters.map(c=>({id:'chapter-'+c.number,title:'Chapter '+c.number+' · '+c.title,subtitle:c.goal,icon:'book',color:'gray'}));
 C.units=[...newUnits,{id:'missions',title:'Practical missions & reviews',subtitle:'Use your German in new situations',icon:'path',color:'gray'},...C.units];
 for(const r of D.lessons){
  const writing={...r.writing,checks:r.writing.checks?.length?r.writing.checks:[{label:'Use the requested details and taught sentence pattern.',pattern:'^(?:'+r.writing.answers.map(a=>regex(norm(a))).join('|')+')$'}]};
  const cards=r.cards.map(c=>({...c,visual:c.visual||{type:'phrase',de:c.examples[0].de,en:c.examples[0].en}}));
  const words=r.vocabulary.map((w,i)=>{const id=r.id+'-v'+i;const record={...w,id,unit:r.kind==='mission'?'missions':'chapter-'+r.chapter,article:w.article||'',plural:w.plural||'',example:w.examples[0].de,exampleTranslation:w.examples[0].en,example2:w.examples[1].de,example2Translation:w.examples[1].en,lessonId:r.id};C.words.push(record);return id;});
  const l={...r,full:true,requireTeachingEvidence:true,unit:r.kind==='mission'?'missions':'chapter-'+r.chapter,subtitle:(r.kind==='mission'?'Practical mission':'Chapter '+r.chapter+' · Part '+r.part),icon:'book',cards,basePracticeCount:3,practice:[...r.practice.slice(0,3),{...r.reading.questions[0],skill:'reading'},{...writing,skill:'writing'}],writing,words,source:'netzwerk-neu',takeaway:r.goal,
   theory:{definition:r.cards[0].body,rule:r.cards[1].body,terms:r.terms||[],steps:['Read the first explanation and compare its two examples.','Learn the idea again from the second angle and its two new examples.','Use it in three drills, reading and writing, then answer a fresh question without hints.'],watch:r.watch||'Match the person, verb and requested details before submitting.',references:r.references||[]},
   speaking:r.speaking,reading:r.reading,listening:r.listening,vocabulary:r.vocabulary,
   objectives:r.objectives.map((o,i)=>({...o,id:r.id+'-o'+(i+1)}))};
  C.lessons.push(l);C.fullLessons.push(l);
 }
 const dayOf=l=>l.day||(Math.floor((l.chapter-1)/3)*7+((l.chapter-1)%3)*2+l.part);
 C.fullLessons.sort((a,b)=>dayOf(a)-dayOf(b)||a.id.localeCompare(b.id));
 for(const l of C.fullLessons)l.planDay=dayOf(l);
 C.book.order=C.fullLessons.map(l=>l.id);
 C.fullScope=D.scope;
 const tokens=s=>norm(s).split(/[^\p{L}\p{N}]+/u).filter(s=>s.length>2);
 C.coverage=[];
 for(const ch of D.scope.chapters){
  const lessons=C.fullLessons.filter(l=>l.chapter===ch.number&&l.kind!=='mission');
  for(const goal of ch.goals){
   const keys=[...(goal.keywords||[]),...tokens(goal.title)];
   const scored=lessons.map(l=>{const objectiveText=norm(l.objectives.map(o=>o.title).join(' '));const teaching=norm(JSON.stringify([l.cards,l.theory.references,l.vocabulary,l.speaking]));let score=0;for(const key of keys){if(key&&objectiveText.includes(norm(key)))score+=4;if(key&&teaching.includes(norm(key)))score++;}if(l.objectives.some(o=>o.category===goal.category))score++;return {l,score};}).sort((a,b)=>b.score-a.score);
   const selected=scored.filter(x=>x.score>1).slice(0,3).map(x=>x.l.id);
   C.coverage.push({...goal,chapter:ch.number,sourcePages:ch.pages,lessonIds:selected,mapped:selected.length>0});
  }
 }
 C.coverageCategories=['function','grammar','vocabulary','pronunciation','strategy','culture'];
})();
