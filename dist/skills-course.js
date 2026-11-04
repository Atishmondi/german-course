
/* Add explicit reading and writing to the main lesson, after its three drills. */
(()=>{
  const course=window.GERMAN_COURSE,content=window.GERMAN_SKILLS;
  if(!course||!content)return;
  course.topics=content.topics;
  for(const lesson of course.lessons){
    const skills=content.lessons[lesson.id];
    if(!skills)continue;
    lesson.theory=skills.theory;
    lesson.reading=skills.reading;
    lesson.writing=skills.writing;
    lesson.basePracticeCount=lesson.practice.length;
    lesson.practice.push({...skills.reading.questions[0],skill:'reading'});
    lesson.practice.push({...skills.writing,skill:'writing'});
    lesson.minutes+=3;
  }
  const chart=(title,headers,rows,note,url)=>({title,headers,rows,note,url});
  const caseSource='https://sites.lsa.umich.edu/german-resources/grammatik/basic-chart/';
  const articleChart=chart('Definite articles in all four cases',['Case','Masculine','Feminine','Neuter','Plural'],[['Nominative','der','die','das','die'],['Accusative','den','die','das','die'],['Dative','dem','der','dem','den'],['Genitive','des','der','des','der']],'Use this as a reference. Dative plural nouns often add -n; many masculine/neuter genitive nouns add -(e)s. Learn the noun pattern too.',caseSource);
  const pronounChart=chart('Personal pronouns: subject and object forms',['Meaning','Nominative','Accusative','Dative'],[['I / me','ich','mich','mir'],['you: one friend','du','dich','dir'],['he / him','er','ihn','ihm'],['she / her','sie','sie','ihr'],['it','es','es','ihm'],['we / us','wir','uns','uns'],['you: several friends','ihr','euch','euch'],['they / them','sie','sie','ihnen'],['you: formal','Sie','Sie','Ihnen']],'Formal Sie and Ihnen keep their capital letters. Practise the column relevant to the current lesson; you do not need every form at once.',caseSource);
  const indefinite=chart('Indefinite articles: a / an',['Case','Masculine','Feminine','Neuter'],[['Nominative','ein','eine','ein'],['Accusative','einen','eine','ein'],['Dative','einem','einer','einem'],['Genitive','eines','einer','eines']],'Ein has no plural form. For books, say Bücher; for no books, use keine Bücher.',caseSource);
  const verbs=chart('Present tense: three useful verbs',['Subject','lernen: learn','sein: be','haben: have'],[['ich','lerne','bin','habe'],['du','lernst','bist','hast'],['er / sie / es','lernt','ist','hat'],['wir','lernen','sind','haben'],['ihr','lernt','seid','habt'],['sie / Sie','lernen','sind','haben']],'Lernen shows a regular pattern. Sein and haben are irregular; learn their person-and-verb pairs.',null);
  const preps=chart('Common preposition groups',['Group','Examples','Case'],[['Accusative','durch, für, gegen, ohne, um','Accusative'],['Dative','aus, außer, bei, mit, nach, seit, von, zu','Dative'],['Two-way','an, auf, hinter, in, neben, über, unter, vor, zwischen','Location: dative. Destination: accusative.']],'With two-way prepositions, movement alone is not the rule: Ich gehe im Park spazieren describes an activity within the park, so it uses dative.', 'https://sites.lsa.umich.edu/german-resources/grammatik/prepositions/');
  const adjectiveSource='https://sites.lsa.umich.edu/german-resources/grammatik/adjektivendungen/';
  const adjectiveHeaders=['Case','Masculine','Feminine','Neuter','Plural'];
  const adjectiveCharts=[
    chart('After der/die/das: weak adjective endings',adjectiveHeaders,[['Nominative','-e','-e','-e','-en'],['Accusative','-en','-e','-e','-en'],['Dative','-en','-en','-en','-en'],['Genitive','-en','-en','-en','-en']],'Examples: der kleine Tisch; die kleinen Bücher. These endings belong to the adjective before its noun.',adjectiveSource),
    chart('After an ein-word: mixed adjective endings',adjectiveHeaders,[['Nominative','-er','-e','-es','-en'],['Accusative','-en','-e','-es','-en'],['Dative','-en','-en','-en','-en'],['Genitive','-en','-en','-en','-en']],'Examples: ein kleiner Tisch; ein kleines Buch. Ein has no plural; the plural column applies to forms such as meine or keine.',adjectiveSource),
    chart('Without an article: strong adjective endings',adjectiveHeaders,[['Nominative','-er','-e','-es','-e'],['Accusative','-en','-e','-es','-e'],['Dative','-em','-er','-em','-en'],['Genitive','-en','-er','-en','-er']],'Examples: frischer Kaffee; mit frischem Wasser. Use these tables for reference after the introductory examples make sense.',adjectiveSource)
  ];
  const alphabetChart=chart('The full alphabet',['Uppercase','Lowercase'],[...Array.from({length:26},(_,i)=>[String.fromCharCode(65+i),String.fromCharCode(97+i)]),['Ä','ä'],['Ö','ö'],['Ü','ü'],['ẞ','ß']],'German uses the 26 base letters A–Z, plus ä, ö, ü and ß. Their German letter names need an audio model; the written forms are shown here.','https://www.dw.com/nico/english');
  const refs={alphabet:[alphabetChart],umlauts:[alphabetChart],
    'gender-articles':[articleChart,indefinite],nominative:[articleChart],pronouns:[pronounChart],sein:[verbs],haben:[verbs],present:[verbs],accusative:[articleChart,indefinite],'accusative-pronouns':[pronounChart],dative:[articleChart,pronounChart],'dative-verbs':[pronounChart],'acc-prepositions':[preps],'dat-prepositions':[preps],'two-way':[preps],genitive:[articleChart,indefinite],'adjective-endings':adjectiveCharts,
    'relative-clauses':[chart('Relative pronouns: three common cases',adjectiveHeaders,[['Nominative','der','die','das','die'],['Accusative','den','die','das','die'],['Dative','dem','der','dem','denen']],'Gender and number come from the noun being described. Case comes from the pronoun’s job inside the relative clause. The clause’s conjugated verb goes at the end.','https://sites.lsa.umich.edu/german-resources/grammatik/relative/')]
  };
  for(const l of course.lessons)if(refs[l.id])l.theory.references=refs[l.id];
})();

