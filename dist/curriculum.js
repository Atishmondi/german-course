
/* Original short lessons. Introductory practice, not a CEFR certification course. */
(() => {
  const phrase = (de, en) => ({type:'phrase',de,en});
  const contrast = (leftDe,leftEn,rightDe,rightEn) => ({type:'contrast',de:leftDe+' / '+rightDe,en:leftEn+' / '+rightEn,left:{de:leftDe,en:leftEn},right:{de:rightDe,en:rightEn}});
  const letters = (de,en) => ({type:'letters',de,en});
  const tokens = (items,en) => ({type:'tokens',de:items.map(x=>x[0]).join(' '),en,tokens:items.map(([text,role])=>({text,role}))});
  const C = (title,body,visual) => ({title,body,visual});
  const Q = (prompt,options,answer,explanation) => ({type:'choice',prompt,options,answer,explanation});
  const B = (prompt,answer,explanation) => ({type:'build',prompt,tokens:answer.slice().reverse(),answer,explanation});
  const T = (prompt,answers,hint,explanation) => ({type:'type',prompt,answers,hint,explanation});
  const L = (id,unit,title,subtitle,minutes,goal,icon,cards,practice,takeaway,words,source) => ({id,unit,title,subtitle,minutes,goal,icon,cards,practice,takeaway,words,source});
  const units = [
    {id:'first',title:'First contact',description:'Say hello. Hear the sounds. Make a small start.',color:'lime',icon:'sun'},
    {id:'sentences',title:'Build a sentence',description:'Give words small jobs, then put them together.',color:'peach',icon:'blocks'},
    {id:'everyday',title:'Everyday German',description:'Ask for things, talk about places and tell a short story.',color:'lavender',icon:'bag'},
    {id:'connected',title:'Connect your ideas',description:'Give a reason and add a little more detail.',color:'blue',icon:'link'}
  ];
  const lessons = [
    L('hello','first','Your first hello','Two words you can use today',3,'Greet someone and say goodbye.','hand',[
      C('Open with one word.','Hallo is a friendly, everyday greeting. Listen once, then say it aloud.',phrase('Hallo!','Hello!')),
      C('And one word to leave.','Tschüss is a friendly goodbye. You can use it with someone you know.',phrase('Tschüss!','Bye!'))
    ],[
      Q('Which word means “hello”?',['Danke','Hallo','Bitte'],1,'Hallo greets someone. Danke means thank you; bitte can mean please.'),
      B('Greet Leon.',['Hallo,','Leon!'],'Hallo, Leon! is a friendly greeting with a name.'),
      T('Say “bye” informally.',['Tschüss','Tschuess'],'It starts with Tsch.','Tschüss is the informal goodbye. Tschuess is a keyboard fallback.')
    ],'Hallo starts a conversation. Tschüss ends it.',['hello','bye'],'dw-intro'),
    L('your-name','first','Say your name','A sentence that belongs to you',3,'Introduce yourself and ask a name.','name',[
      C('Put your name here.','Ich heiße means “my name is.” Add your name. Learn the whole phrase for now.',phrase('Ich heiße Leon.','My name is Leon.')),
      C('Ask the other person.','Wie heißt du? asks one person their name informally. The ending changes: heiße with ich, heißt with du.',phrase('Wie heißt du?','What is your name?'))
    ],[
      Q('What does “Ich heiße Leon” tell you?',['My country','My address','My name'],2,'The phrase gives your name.'),
      B('Say your name is Leon.',['Ich','heiße','Leon.'],'Ich heiße Leon. Keep the verb heiße after ich.'),
      T('Complete: Ich ___ Leon.',['heiße','heisse'],'The verb is heißen.','Ich heiße Leon. Use heiße with ich.')
    ],'Ich heiße … gives your name. Wie heißt du? asks a name.',['name-phrase','name'],'dw-intro'),
    L('umlauts','first','Meet ä, ö, ü and ß','Small marks, different sounds',4,'Notice special German letters and listen carefully.','sound',[
      C('The dots change the vowel.','Ä, ö and ü are distinct vowels. Listen to each. For ü, try an i tongue position with rounded lips. Sound practice needs listening, not just spelling.',letters('ä · ö · ü','Three vowels with umlauts')),
      C('This is a sharp s.','ß represents an s sound; it is not a b. In Straße, it follows a long vowel. Hear the word and copy the speaker.',phrase('Straße','street'))
    ],[
      Q('Which letter is u with an umlaut?',['ü','ö','ä'],0,'Ü is the u with two dots. Listen to its sound, too.'),
      Q('Which symbol is called sharp s?',['ö','ß','ü'],1,'ß is the sharp s. It is not the letter b.'),
      T('Type o with an umlaut.',['ö'],'Use the ö key above the answer field.','Ö is a separate vowel sound. Compare a German audio model.')
    ],'Listen to ä, ö, ü and ß in real words; spelling checks do not measure pronunciation.',['street','door'],'dw-sounds'),
    L('sound-pairs','first','Read letter teams','ei and ie are different',4,'Recognise common German letter combinations.','sound',[
      C('Same letters, new order.','Ei and ie usually make different vowel sounds. Listen to mein and Miete. Copy the audio instead of guessing from English spelling.',contrast('mein','my','Miete','rent')),
      C('Some letters work together.','Sch usually forms one sound. Eu and äu usually share a sound. Hear Schule, neu and Häuser, then repeat one word at a time.',letters('sch · eu · äu','Schule · neu · Häuser'))
    ],[
      Q('Which word contains ie?',['mein','Haus','Miete'],2,'Miete contains ie. Mein contains ei.'),
      Q('Which pair usually shares a sound?',['eu / äu','ei / ie','a / ü'],0,'Eu and äu usually share a sound. Use native audio to hear it.'),
      T('Write the German word for “my” shown here.',['mein'],'The vowels are e, then i.','Mein means my. Its vowel team is ei.')
    ],'Look at the order in ei and ie. Learn letter teams with audio.',['my'],'dw-sounds'),
    L('alphabet','first','Spell your name','Four letters, one small win',4,'Recognise and order the letters in your name.','letters',[
      C('Spell this four-letter name.','German uses the familiar A–Z letters with German letter names. Play the model and practise saying each letter separately.',letters('L · E · O · N','The letters in Leon')),
      C('Ask how something is written.','Wie schreibt man das? asks how to write or spell something. Buchstabieren means to spell a word letter by letter.',phrase('Wie schreibt man das?','How do you spell that?'))
    ],[
      B('Put the letters of Leon in order.',['L','E','O','N'],'Leon is spelled L, E, O, N. Practise the German letter names with audio.'),
      Q('Which letter begins Leon?',['N','L','E'],1,'L is the first letter.'),
      T('Which German verb means “to spell”?',['buchstabieren'],'It begins buchst.','Buchstabieren means to spell a word letter by letter.')
    ],'Practise spelling your name with German letter names, not only recognising the written letters.',['spell'],'dw-alphabet'),
    L('numbers','first','Count to ten','Numbers you can hear and use',4,'Recognise the numbers zero to ten.','number',[
      C('Start with zero to five.','Listen and point: null, eins, zwei, drei, vier, fünf. Pause after each number and repeat it.',letters('0 · 1 · 2 · 3 · 4 · 5','null · eins · zwei · drei · vier · fünf')),
      C('Add five more.','Now try sechs, sieben, acht, neun, zehn. Say a number while showing the matching fingers.',letters('6 · 7 · 8 · 9 · 10','sechs · sieben · acht · neun · zehn'))
    ],[
      Q('Which number is drei?',['2','3','4'],1,'Drei means three.'),
      Q('Which word means five?',['vier','acht','fünf'],2,'Fünf means five. Remember the umlaut.'),
      T('Write the German word for two.',['zwei'],'It begins zw.','Zwei means two.')
    ],'Count aloud slowly. Then recognise numbers out of order.',['one','two','three','five'],'dw-course'),
    L('pronouns','sentences','Who are we talking about?','Meet ich, du and wir',4,'Use three subject pronouns.','person',[
      C('A small word for a person.','A pronoun can stand in for a name. Ich means I. Du means you when speaking informally to one person.',contrast('ich','I','du','you, informal singular')),
      C('More people, more pronouns.','Wir means we; ihr means you to several familiar people. Er/sie/es mean he/she/it. Lowercase sie can also mean they. Capitalised Sie is formal you.',phrase('Wir lernen Deutsch.','We are learning German.'))
    ],[
      Q('Which pronoun means “I”?',['du','wir','ich'],2,'Ich means I.'),
      B('Build “We are learning German.”',['Wir','lernen','Deutsch.'],'Wir means we; lernen is the matching verb form.'),
      T('Write “you” for one friend.',['du'],'Two letters.','Du addresses one person informally. Formal you is Sie.')
    ],'Ich = I. Du = one familiar you. Wir = we.',['i','you','we','german'],'ou-pronouns'),
    L('sein','sentences','Say “I am”','A very useful irregular verb',4,'Use bin, bist and ist.','person',[
      C('Sein means to be.','Some verbs have special forms. With ich, say bin. With du, say bist. Learn the little pairs together.',contrast('ich bin','I am','du bist','you are')),
      C('One more useful pair.','With er, sie or es, use ist. With wir, use sind. You can use sein to describe how someone feels.',phrase('Ich bin müde.','I am tired.'))
    ],[
      Q('Complete: Ich ___ hier.',['bin','bist','ist'],0,'Ich goes with bin: Ich bin hier.'),
      B('Build “You are here.”',['Du','bist','hier.'],'Du bist hier. Bist is the du form of sein.'),
      T('Complete: Er ___ müde.',['ist'],'Three letters.','Er ist müde means he is tired.')
    ],'Learn sein in small pairs: ich bin, du bist, er/sie/es ist, wir sind.',['be','tired','here'],'umich-tenses'),
    L('haben','sentences','Say what you have','Meet haben',4,'Use habe, hast and hat.','bag',[
      C('Haben means to have.','Start with ich habe: I have. Time is Zeit, so Ich habe Zeit means I have time.',phrase('Ich habe Zeit.','I have time.')),
      C('The person changes the verb.','With du, say hast. With er, sie or es, say hat. With wir, say haben.',contrast('du hast','you have','er hat','he has'))
    ],[
      Q('Complete: Du ___ Zeit.',['hat','habe','hast'],2,'Du goes with hast.'),
      B('Build “I have time.”',['Ich','habe','Zeit.'],'Ich habe Zeit. Habe belongs to ich.'),
      T('Complete: Sie ___ ein Buch. Here sie means she.',['hat'],'Use the she/he/it form.','Sie hat ein Buch means she has a book.')
    ],'Haben changes with the subject: ich habe, du hast, er hat.',['have','time','book'],'umich-tenses'),
    L('present','sentences','Make a verb fit','Present tense, one pattern',5,'Change a regular verb for ich, du and wir.','blocks',[
      C('Take off the ending, add a new one.','Lernen means to learn. Remove en to get lern. Add e for ich or st for du.',contrast('ich lerne','I learn / I am learning','du lernst','you learn / you are learning')),
      C('Use it about yourself.','With wir, use lernen. The same present-tense form can describe “learn” or “am learning.” Kommen means to come.',tokens([['Ich','subject'],['komme','verb'],['aus Indien.','extra']],'I come from India.'))
    ],[
      Q('Complete: Ich ___ Deutsch.',['lernen','lerne','lernst'],1,'Ich uses lerne.'),
      B('Build “I come from India.”',['Ich','komme','aus','Indien.'],'Ich komme aus Indien. Komme is the ich form of kommen.'),
      T('Complete: Du ___ Deutsch. Use lernen.',['lernst'],'Use lern + st.','Du lernst Deutsch means you are learning German.')
    ],'For many regular verbs: ich + e, du + st, wir + en.',['learn','come','india','german'],'umich-present'),
    L('gender-articles','sentences','Learn nouns with their labels','Der, die and das',5,'Keep a noun and its article together.','book',[
      C('A noun names something.','Buch names a book. German nouns have a grammatical gender. Learn das Buch as one package, rather than Buch alone.',phrase('das Buch','the book')),
      C('The and a are small companions.','Der, die and das can mean the. In these basic singular forms, ein goes with masculine or neuter; eine goes with feminine.',contrast('die Frau → eine Frau','the woman → a woman','das Buch → ein Buch','the book → a book'))
    ],[
      Q('Which is “the book”?',['der Buch','das Buch','die Buch'],1,'The noun Buch is neuter: das Buch.'),
      Q('Which is “a woman”?',['ein Frau','einen Frau','eine Frau'],2,'Frau is feminine. In this basic form, say eine Frau.'),
      T('Complete: ___ Buch. Use “the.”',['das'],'Buch is neuter.','Das Buch is the package to remember.')
    ],'Learn each noun with its article. Grammatical gender belongs to the word.',['book','woman','man'],'umich-chart'),
    L('plurals','sentences','One book, two books','Learn the plural with the noun',4,'Recognise several useful plural forms.','book',[
      C('Plural means more than one.','German has several plural patterns. Book becomes Bücher. The nominative plural article is die for all genders.',contrast('das Buch','the book','die Bücher','the books')),
      C('Save the full word family.','Learn singular and plural together. Do not assume every noun simply adds s. Stadt becomes Städte; Frau becomes Frauen.',contrast('die Stadt → die Städte','city → cities','die Frau → die Frauen','woman → women'))
    ],[
      Q('Which means “the books”?',['die Bücher','das Bücher','der Bücher'],0,'Bücher is plural. Here the article is die.'),
      Q('What is the plural of Frau?',['Fraus','Frauen','Fräuer'],1,'Frau becomes Frauen.'),
      T('Complete: das Buch → die ___.',['Bücher','Buecher'],'The vowel changes to ü.','Buch becomes Bücher. Save the pair together.')
    ],'Store article + singular + plural together: das Buch, die Bücher.',['book','city','woman'],'umich-chart'),
    L('nominative','sentences','Find the subject','Your first case: nominative',5,'Identify who a simple sentence is about.','person',[
      C('Case shows a word’s job.','In a simple action sentence, ask who does the action. That subject uses the nominative case.',tokens([['Der Mann','subject'],['lernt.','verb']],'The man is learning.')),
      C('Look for the subject, not the first word.','The subject can appear after the verb. In Heute lernt der Mann, der Mann is still the person learning.',tokens([['Heute','extra'],['lernt','verb'],['der Mann.','subject']],'Today the man is learning.'))
    ],[
      Q('Who is the subject in “Die Frau lernt”?',['lernt','Die Frau','No one'],1,'Die Frau is the person learning.'),
      B('Build “The child is learning.”',['Das','Kind','lernt.'],'Das Kind is the subject in the nominative.'),
      T('Which case does the subject use?',['Nominativ','nominative'],'It starts nomin.','The subject uses nominative, called Nominativ in German.')
    ],'Nominative is the subject’s case. A case is a grammatical form linked to a word’s role.',['man','woman','child','today'],'umich-cases'),
    L('word-order','sentences','Give the verb a place','Position two in statements',5,'Keep the conjugated verb in the second slot.','blocks',[
      C('Build a simple statement.','In a normal main-clause statement, the conjugated verb takes the second slot. A slot can contain several words.',tokens([['Ich','subject'],['lerne','verb'],['Deutsch.','object']],'I am learning German.')),
      C('You can start with today.','Put Heute first, keep lerne second, and move ich after the verb. Second slot does not always mean second word.',tokens([['Heute','extra'],['lerne','verb'],['ich','subject'],['Deutsch.','object']],'Today I am learning German.'))
    ],[
      Q('Which statement has the right order?',['Heute ich lerne Deutsch.','Heute lerne ich Deutsch.','Lerne heute ich Deutsch.'],1,'Heute takes slot one; lerne remains in slot two.'),
      B('Start with Heute.',['Heute','lerne','ich','Deutsch.'],'Heute | lerne | ich | Deutsch. The conjugated verb stays second.'),
      T('In a normal statement, which slot holds the conjugated verb?',['2','two','second'],'Count the first two slots.','The conjugated verb normally takes slot two.')
    ],'In a main-clause statement, keep the conjugated verb in slot two.',['today','learn','german'],'umich-order'),
    L('questions','sentences','Ask a real question','Two simple question patterns',5,'Form a yes/no question and a W-question.','question',[
      C('For yes or no, lead with the verb.','Du lernst Deutsch is a statement. Lernst du Deutsch? asks whether it is true.',contrast('Du lernst Deutsch.','You are learning German.','Lernst du Deutsch?','Are you learning German?')),
      C('For details, add a question word.','Wo means where. Put it first, then the verb, then the subject. Wo wohnst du? asks where you live.',tokens([['Wo','extra'],['wohnst','verb'],['du?','subject']],'Where do you live?'))
    ],[
      Q('Which asks “Are you learning German?”',['Du lernst Deutsch.','Deutsch du lernst?','Lernst du Deutsch?'],2,'A yes/no question begins with the conjugated verb.'),
      B('Ask “Where do you live?”',['Wo','wohnst','du?'],'Wo | wohnst | du? The question word comes first.'),
      T('Which question word means where?',['wo'],'Two letters.','Wo asks where something or someone is.')
    ],'Yes/no: verb first. W-question: question word, verb, subject.',['where','live','you'],'umich-order'),
    L('accusative','sentences','Who or what gets the action?','Meet the accusative',5,'Recognise a direct object and the masculine article change.','bag',[
      C('A sentence can have two jobs.','In Ich sehe den Mann, ich is the subject. Den Mann is the direct object: the person I see.',tokens([['Ich','subject'],['sehe','verb'],['den Mann.','object']],'I see the man.')),
      C('Watch masculine der change.','For these basic definite articles, masculine der becomes den in the accusative. Die and das stay the same. Ein becomes einen for a masculine direct object.',contrast('der Mann → den Mann','subject form → direct-object form','ein Mann → einen Mann','a man, nominative → accusative'))
    ],[
      Q('Complete: Ich sehe ___ Mann.',['der','den','dem'],1,'Sehen takes a direct object here. Masculine der changes to den.'),
      B('Build “I have a book.”',['Ich','habe','ein','Buch.'],'Buch is neuter, so ein stays ein in the accusative.'),
      T('Complete: Ich sehe einen ___. Use Mann.',['Mann'],'Keep the noun Mann.','Ich sehe einen Mann. The article carries the accusative change here.')
    ],'The accusative often marks the direct object. Start with der → den and ein → einen for masculine nouns.',['see','man','book','have'],'umich-cases'),
    L('accusative-pronouns','sentences','Say me, you and him','Short words for direct objects',5,'Use mich, dich and ihn in familiar sentences.','person',[
      C('I becomes me.','Pronouns also change with their job. Ich becomes mich as a direct object; du becomes dich.',contrast('ich → mich','I → me','du → dich','you, subject → object')),
      C('Replace a known noun.','Der Mann can be replaced by er as a subject. In the direct-object role, use ihn.',contrast('Ich sehe den Mann.','I see the man.','Ich sehe ihn.','I see him.'))
    ],[
      Q('Complete: Sie sieht ___. Meaning: She sees me.',['ich','mir','mich'],2,'Mich is the accusative form of ich.'),
      B('Build “I see you.”',['Ich','sehe','dich.'],'Dich is the direct-object form of informal du.'),
      T('Replace den Mann: Ich sehe ___.',['ihn'],'Three letters.','Ihn replaces a masculine singular direct object here.')
    ],'As direct objects: ich → mich, du → dich, er → ihn.',['i','you','see'],'umich-chart'),
    L('negatives','everyday','Say no, clearly','Nicht and kein',4,'Negate a familiar statement or noun.','blocks',[
      C('No book? Use kein.','Kein negates a noun used with an indefinite article or no article. Ich habe ein Buch becomes Ich habe kein Buch.',contrast('Ich habe ein Buch.','I have a book.','Ich habe kein Buch.','I do not have a book.')),
      C('Not tired? Use nicht.','Nicht negates many other elements, including descriptions. Ich bin nicht müde means I am not tired. Its position depends on what you negate.',phrase('Ich bin nicht müde.','I am not tired.'))
    ],[
      Q('Complete: Ich habe ___ Auto. Meaning: no car.',['kein','nicht','nein'],0,'Kein negates the noun here: kein Auto.'),
      B('Build “I am not tired.”',['Ich','bin','nicht','müde.'],'Put nicht before müde to negate this description.'),
      T('Complete: Ich habe ___ Buch. Meaning: no book.',['kein'],'Use the noun-negating word.','Ich habe kein Buch means I do not have a book.')
    ],'Start with kein + noun and nicht + description. Learn other positions through examples.',['no','not','car','tired'],'umich-negation'),
    L('possessives','everyday','Say whose it is','Mein and dein',4,'Use my and your with familiar nouns.','book',[
      C('Mein means my.','In the basic form, say mein Buch. With a feminine noun such as Tasche, use meine Tasche.',contrast('mein Buch','my book','meine Tasche','my bag')),
      C('Dein means your.','Use dein for one familiar person’s possession. The ending follows the noun’s gender, number and case, not the owner’s gender.',contrast('dein Buch','your book','deine Tasche','your bag'))
    ],[
      Q('Which means my bag?',['mein Tasche','meine Tasche','meinen Tasche'],1,'Tasche is feminine: meine Tasche.'),
      B('Build “That is my book.”',['Das','ist','mein','Buch.'],'Das ist mein Buch. Buch uses mein in this nominative example.'),
      T('Complete: Das ist ___ Buch. Meaning: your, to a friend.',['dein'],'It begins d.','Dein Buch means your book when speaking to one person informally.')
    ],'Mein/dein mean my/your. Their endings fit the noun phrase.',['my','your','book','bag'],'umich-chart'),
    L('modals','everyday','Say what you can do','Two verbs, two places',5,'Use können with an infinitive.','blocks',[
      C('A modal adds a new meaning.','Können means can or be able to. Say ich kann. The other verb stays in its base form, called the infinitive.',phrase('Ich kann Deutsch lernen.','I can learn German.')),
      C('Keep the action at the end.','In this main clause, kann takes the second slot. Lernen waits at the end. Müssen and wollen follow the same sentence pattern.',tokens([['Ich','subject'],['kann','verb'],['Deutsch','object'],['lernen.','verb']],'I can learn German.'))
    ],[
      Q('Which verb form goes with ich?',['können','kannst','kann'],2,'Ich kann means I can.'),
      B('Build “I can learn German.”',['Ich','kann','Deutsch','lernen.'],'Kann is conjugated; lernen stays in the infinitive at the end.'),
      T('Complete: Ich kann Deutsch ___. Use lernen.',['lernen'],'Keep the infinitive.','The infinitive lernen goes at the end of this main clause.')
    ],'Modal near the start, infinitive at the end: Ich kann Deutsch lernen.',['can','learn'],'umich-order'),
    L('separable','everyday','A verb that splits','Meet aufstehen',5,'Place a separable prefix at the end of a main clause.','clock',[
      C('Aufstehen means to get up.','Some verbs have a detachable beginning. In a simple main clause, aufstehen splits into stehe and auf.',contrast('aufstehen','to get up','Ich stehe auf.','I get up.')),
      C('The prefix closes the sentence.','Add the time between the two verb parts. The conjugated part stays second; the prefix goes at the end.',tokens([['Ich','subject'],['stehe','verb'],['um acht','extra'],['auf.','verb']],'I get up at eight.'))
    ],[
      Q('Which sentence uses aufstehen correctly?',['Ich stehe um acht auf.','Ich auf um acht stehe.','Ich um acht aufstehe.'],0,'Stehe is conjugated in position two; auf goes at the end.'),
      B('Build “I get up at eight.”',['Ich','stehe','um','acht','auf.'],'Ich stehe um acht auf.'),
      T('Complete: Ich stehe ___.',['auf'],'Use the detachable beginning of aufstehen.','The prefix auf goes at the end of this main clause.')
    ],'With a separable verb in a simple main clause, the prefix usually goes at the end.',['get-up','today'],'umich-order'),
    L('coordinating','everyday','Join two ideas','Und, aber and denn',4,'Join familiar main clauses.','link',[
      C('Und adds. Aber contrasts.','Und means and; aber means but. You can connect two main clauses while keeping their normal verb order.',phrase('Ich lerne Deutsch und du lernst Englisch.','I am learning German and you are learning English.')),
      C('Denn gives a reason.','Denn means because or for in this use. After denn, keep normal main-clause order. It works differently from weil, which comes later.',tokens([['Ich lerne,','extra'],['denn','extra'],['ich','subject'],['habe','verb'],['Zeit.','object']],'I am studying because I have time.'))
    ],[
      Q('Which connector means but?',['und','aber','denn'],1,'Aber introduces a contrast.'),
      B('Give a reason with denn.',['Ich','lerne,','denn','ich','habe','Zeit.'],'After denn, ich is followed by habe in normal main-clause order.'),
      T('Which connector means and?',['und'],'Three letters.','Und joins words or clauses.')
    ],'Und adds, aber contrasts, denn gives a reason. Keep ordinary main-clause word order after them.',['and','but','because-denn','time'],'umich-order'),
    L('dative','everyday','Who receives it?','A first look at dative',5,'Recognise a recipient in a giving sentence.','person',[
      C('A person can receive something.','In this giving sentence, die Frau becomes der Frau in the dative. It names the recipient. Das Buch is the thing given, in the accusative.',tokens([['Ich','subject'],['gebe','verb'],['der Frau','extra'],['das Buch.','object']],'I give the woman the book.')),
      C('Articles help show the job.','In the dative singular, der and das become dem; die becomes der. Start with one familiar sentence before learning the full chart.',contrast('dem Mann','to the man, in this giving pattern','der Frau','to the woman, in this giving pattern'))
    ],[
      Q('Complete: Ich gebe ___ Mann das Buch.',['den','der','dem'],2,'The recipient is dative: dem Mann.'),
      B('Build “I give the woman the book.”',['Ich','gebe','der','Frau','das','Buch.'],'Der Frau is the recipient; das Buch is the thing given.'),
      T('Complete: Ich gebe ___ Kind das Buch.',['dem'],'Kind is neuter.','The neuter dative article is dem.')
    ],'In a giving sentence, the recipient is dative and the thing given is accusative.',['give','woman','man','child','book'],'umich-cases'),
    L('dative-verbs','everyday','Some verbs choose dative','Helfen and danken',5,'Use a dative object with helfen.','hand',[
      C('Learn a verb with its pattern.','Helfen means to help and takes a dative object. Say Ich helfe dem Mann, even though English simply says I help the man.',tokens([['Ich','subject'],['helfe','verb'],['dem Mann.','object']],'I help the man.')),
      C('Pronouns can be dative too.','Mir means to me in many patterns; dir means to you informally. With helfen, Ich helfe dir means I help you. Danken also takes dative.',phrase('Ich helfe dir.','I help you.'))
    ],[
      Q('Complete: Ich helfe ___. Meaning: I help you.',['dich','du','dir'],2,'Helfen takes a dative object, so use dir.'),
      B('Build “I help the man.”',['Ich','helfe','dem','Mann.'],'Helfen takes dative: dem Mann.'),
      T('Complete: Du hilfst ___. Meaning: You help me.',['mir'],'Use the dative form of ich.','Du hilfst mir means you help me.')
    ],'Learn helfen + dative as a pair: Ich helfe dir.',['help','to-me','to-you'],'umich-cases'),
    L('two-objects','everyday','One action, two objects','Give someone something',5,'Tell the recipient and the thing apart.','bag',[
      C('Ask two different questions.','What is given? Das Buch. Who receives it? Dem Mann. The two phrases have different jobs and cases.',tokens([['Ich','subject'],['gebe','verb'],['dem Mann','extra'],['das Buch.','object']],'I give the man the book.')),
      C('Use a short recipient word.','You can replace dem Mann with ihm, or use dir for you. With two noun objects, dative often comes before accusative; pronoun order needs more practice.',phrase('Ich gebe dir das Buch.','I give you the book.'))
    ],[
      Q('In “Ich gebe dir das Buch”, what is given?',['Ich','dir','das Buch'],2,'Das Buch is the thing given. Dir is the recipient.'),
      B('Build “I give you the book.”',['Ich','gebe','dir','das','Buch.'],'Dir is dative; das Buch is accusative.'),
      T('Complete: Ich gebe ___ das Buch. Meaning: to you, informally.',['dir'],'Use the dative form of du.','Ich gebe dir das Buch. Dir is the recipient.')
    ],'For geben, identify who receives something and what is given.',['give','to-you','book'],'umich-order'),
    L('acc-prepositions','everyday','After für, use accusative','Learn a useful pair',4,'Use für with a noun or pronoun.','bag',[
      C('Some small words choose a case.','Für means for and takes the accusative. A masculine der noun therefore appears with den after für.',phrase('Das ist für den Mann.','That is for the man.')),
      C('Try it with you.','Für du becomes für dich because du changes to its accusative form. Ohne, durch, gegen and um also take accusative in their usual prepositional uses.',phrase('Das ist für dich.','That is for you.'))
    ],[
      Q('Complete: Das ist für ___. Meaning: for you.',['dir','dich','du'],1,'Für takes accusative, so use dich.'),
      B('Build “That is for the man.”',['Das','ist','für','den','Mann.'],'Für + accusative: für den Mann.'),
      T('Complete: für ___ Mann. Use the definite article.',['den'],'Masculine accusative.','Für takes the accusative article den with Mann.')
    ],'Für takes accusative: für den Mann, für dich.',['for','without','man','you'],'umich-cases'),
    L('dat-prepositions','everyday','After mit, use dative','Another useful pair',4,'Use mit and aus with dative.','bag',[
      C('Mit means with.','Mit takes dative. The masculine noun Bus therefore uses dem: mit dem Bus.',phrase('Ich fahre mit dem Bus.','I travel by bus.')),
      C('Keep the word and case together.','Aus, bei, mit, nach, seit, von and zu commonly take dative. Learn small phrases: mit dir, aus Indien, zum Bahnhof. Zum combines zu and dem.',contrast('mit dir','with you','zum Bahnhof','to the station'))
    ],[
      Q('Complete: mit ___ Bus.',['den','der','dem'],2,'Mit takes dative; der Bus becomes dem Bus.'),
      B('Build “I travel by bus.”',['Ich','fahre','mit','dem','Bus.'],'Mit dem Bus is the phrase to remember.'),
      T('Complete: mit ___. Meaning: with you, informally.',['dir'],'Use the dative form of du.','Mit takes dative: mit dir.')
    ],'Learn mit + dative: mit dem Bus, mit dir.',['with','bus','station','india'],'umich-cases'),
    L('two-way','everyday','Where, or where to?','Two-way prepositions',5,'Distinguish a location from a destination with in.','bag',[
      C('Where is it happening?','With two-way in, dative marks the location where something is or happens. Im combines in and dem.',phrase('Ich bin im Park.','I am in the park.')),
      C('Where is someone going?','Accusative marks a destination with this use of in. Movement alone is not the rule: walking within a park can still use im Park.',contrast('Ich gehe in den Park.','I go into the park.','Ich gehe im Park spazieren.','I take a walk in the park.'))
    ],[
      Q('Complete: Ich bin ___ Park.',['in den','im','zum'],1,'This gives a location: in dem Park, shortened to im Park.'),
      B('Build “I go into the park.”',['Ich','gehe','in','den','Park.'],'The park is the destination, so use in den Park.'),
      T('Complete: Ich gehe in ___ Park. Meaning: into the park.',['den'],'The destination takes accusative here.','Der Park becomes den Park in this accusative destination phrase.')
    ],'With two-way prepositions, ask location or destination. Do not use movement alone to choose the case.',['park','go','here'],'umich-cases'),
    L('perfekt','everyday','Say what happened','Build the Perfekt',5,'Use a common haben + participle pattern.','clock',[
      C('Two parts tell a past event.','Perfekt often uses haben plus a past participle. For lernen, the participle is gelernt. It waits at the end of a main clause.',tokens([['Ich','subject'],['habe','verb'],['Deutsch','object'],['gelernt.','verb']],'I learned German / I have learned German.')),
      C('Some verbs use sein.','Many verbs describing a change of place use sein, such as gehen → gegangen. Learn each new verb with its past pattern; not every verb follows one simple rule.',phrase('Ich bin nach Hause gegangen.','I went home.'))
    ],[
      Q('Complete: Ich habe Deutsch ___.',['lernen','gelernt','lerne'],1,'The past participle of lernen is gelernt.'),
      B('Build “I learned German.”',['Ich','habe','Deutsch','gelernt.'],'Habe is conjugated; gelernt goes at the end.'),
      T('Complete: Ich ___ nach Hause gegangen.',['bin'],'Gehen uses sein in the Perfekt here.','Ich bin gegangen is the Perfekt pattern of gehen.')
    ],'Perfekt uses a helper and participle: habe gelernt, bin gegangen. Learn both parts with each verb.',['learn','go','yesterday','home'],'umich-tenses'),
    L('praeteritum','everyday','Two useful past words','War and hatte',5,'Recognise common Präteritum forms.','clock',[
      C('Bin becomes war.','Präteritum is another past tense. Ich war means I was. These common forms are useful in conversation as well as writing.',contrast('Ich bin hier.','I am here.','Ich war hier.','I was here.')),
      C('Habe becomes hatte.','Ich hatte Zeit means I had time. Perfekt and Präteritum both appear in speech and writing; usage varies with the verb, context and region.',contrast('Ich habe Zeit.','I have time.','Ich hatte Zeit.','I had time.'))
    ],[
      Q('Which means “I was here”?',['Ich bin hier.','Ich war hier.','Ich habe hier.'],1,'War is a Präteritum form of sein.'),
      B('Build “I had time.”',['Ich','hatte','Zeit.'],'Hatte is the ich past form of haben.'),
      T('Complete: Gestern ___ ich müde. Use sein in Präteritum.',['war'],'Think I was.','Gestern war ich müde means yesterday I was tired.')
    ],'Learn ich war and ich hatte early. Präteritum is not restricted to writing.',['yesterday','tired','time','be'],'umich-tenses'),
    L('subordinate','connected','Give a reason with weil','The verb waits at the end',5,'Build one simple subordinate clause.','link',[
      C('Weil means because.','A subordinate clause depends on another clause. With weil, the conjugated verb usually goes at the end in standard German.',tokens([['Ich lerne,','extra'],['weil','extra'],['ich','subject'],['Zeit','object'],['habe.','verb']],'I am studying because I have time.')),
      C('The same pattern helps with dass.','Dass means that in this kind of clause. Keep the conjugated verb at the end. Use a comma between these clauses.',phrase('Ich weiß, dass du Deutsch lernst.','I know that you are learning German.'))
    ],[
      Q('Which ending fits “weil ich Zeit …”?',['habe','ich','weil'],0,'With weil, the conjugated verb habe goes at the end here.'),
      B('Give a reason with weil.',['Ich','lerne,','weil','ich','Zeit','habe.'],'Weil sends habe to the end of its clause.'),
      T('Complete: Ich weiß, dass du Deutsch ___. Use lernen.',['lernst'],'Use the du form at the end.','Dass du Deutsch lernst follows subordinate-clause order.')
    ],'With weil and dass, put the conjugated verb at the end of the subordinate clause.',['because-weil','that','know','time'],'umich-order'),
    L('relative-clauses','connected','Add a detail about someone','Your first relative clause',5,'Recognise a relative clause describing a noun.','link',[
      C('A clause can describe a noun.','A relative clause adds information about a person or thing. Here der refers back to der Mann. The relative clause’s verb comes at the end.',phrase('Das ist der Mann, der hier wohnt.','That is the man who lives here.')),
      C('Match the noun, then its job.','For a feminine subject in this pattern, use die. Relative pronouns also change for case, which we will practise in further lessons.',phrase('Das ist die Frau, die Deutsch lernt.','That is the woman who is learning German.'))
    ],[
      Q('Complete: die Frau, ___ hier wohnt',['der','das','die'],2,'Frau is feminine, and the relative pronoun is the subject here: die.'),
      B('Describe the man who lives here.',['Das','ist','der','Mann,','der','hier','wohnt.'],'Der refers back to Mann; wohnt closes the relative clause.'),
      T('Complete: der Mann, der hier ___. Use wohnen.',['wohnt'],'Use the er form at the end.','Wohnt goes at the end of this relative clause.')
    ],'Relative clauses describe a noun. Their verb goes at the end; the pronoun also has a case.',['man','woman','live','here'],'umich-order'),
    L('adjective-endings','connected','Give a noun a description','Small endings, useful patterns',5,'Recognise two basic adjective-ending patterns.','book',[
      C('Before a noun, an adjective gets an ending.','Klein means small. In der kleine Tisch, the adjective ends in e. The noun’s gender, case, number and article help choose the ending.',phrase('der kleine Tisch','the small table')),
      C('Compare two small patterns.','With a masculine nominative ein, say ein kleiner Tisch. After ist, the adjective stays klein: Der Tisch ist klein. Learn small contrasts before the full chart.',contrast('ein kleiner Tisch','a small table','Der Tisch ist klein.','The table is small.'))
    ],[
      Q('Complete: der ___ Tisch. Use klein.',['kleinen','kleine','kleiner'],1,'In this masculine nominative phrase with der, use kleine.'),
      B('Build “The table is small.”',['Der','Tisch','ist','klein.'],'After ist in this description, klein has no added adjective ending.'),
      T('Complete: ein ___ Tisch. Use klein in nominative.',['kleiner'],'This masculine nominative adjective ends in er.','Ein kleiner Tisch uses the ending er on klein.')
    ],'Before nouns, adjective endings change. Start with der kleine Tisch, ein kleiner Tisch, and Der Tisch ist klein.',['small','table','book'],'umich-adjectives'),
    L('genitive','connected','Say whose book it is','A first look at genitive',5,'Recognise a common possession pattern.','book',[
      C('A noun phrase can show ownership.','Genitive can link a thing to its owner. In das Buch des Mannes, des Mannes means of the man or the man’s.',phrase('das Buch des Mannes','the man’s book')),
      C('The article and noun can both change.','Masculine der becomes des here; Mann adds es. Feminine die becomes der: das Buch der Frau. These are starter patterns, not the whole case system.',contrast('des Mannes','of the man','der Frau','of the woman'))
    ],[
      Q('Which means “the woman’s book”?',['das Buch die Frau','das Buch der Frau','das Buch dem Frau'],1,'Der Frau is feminine genitive in this phrase.'),
      B('Build “the man’s book”.',['das','Buch','des','Mannes'],'Des Mannes identifies the owner in this genitive phrase.'),
      T('Complete: das Buch ___ Mannes.',['des'],'Use the masculine genitive definite article.','Des Mannes is the genitive form in this example.')
    ],'Genitive can mark possession: das Buch des Mannes, das Buch der Frau.',['book','man','woman'],'umich-cases')
  ];
  const words = [
    {id:'hello',de:'Hallo',en:'hello',example:'Hallo, Leon!',unit:'first'},
    {id:'bye',de:'Tschüss',en:'bye',example:'Tschüss, bis bald!',unit:'first'},
    {id:'thanks',de:'danke',en:'thank you',example:'Danke für deine Hilfe.',unit:'first'},
    {id:'please',de:'bitte',en:'please / you are welcome',example:'Noch einmal bitte.',unit:'first'},
    {id:'name-phrase',de:'Ich heiße Leon.',en:'My name is Leon.',example:'Hallo! Ich heiße Leon.',unit:'first'},
    {id:'repeat',de:'Noch einmal bitte.',en:'Again, please.',example:'Noch einmal bitte.',unit:'first'},
    {id:'slow',de:'Langsam bitte.',en:'Slowly, please.',example:'Langsam bitte.',unit:'first'},
    {id:'name',de:'Name',en:'name',article:'der',plural:'Namen',example:'Mein Name ist Leon.',unit:'first'},
    {id:'street',de:'Straße',en:'street',article:'die',plural:'Straßen',example:'Die Straße ist hier.',unit:'first'},
    {id:'door',de:'Tür',en:'door',article:'die',plural:'Türen',example:'Die Tür ist offen.',unit:'first'},
    {id:'spell',de:'buchstabieren',en:'to spell',example:'Bitte buchstabieren Sie das.',unit:'first'},
    {id:'one',de:'eins',en:'one',example:'Eins, zwei, drei.',unit:'first'},
    {id:'two',de:'zwei',en:'two',example:'Ich habe zwei Bücher.',unit:'first'},
    {id:'three',de:'drei',en:'three',example:'Drei Bücher liegen hier.',unit:'first'},
    {id:'five',de:'fünf',en:'five',example:'Es ist fünf Uhr.',unit:'first'},
    {id:'i',de:'ich',en:'I',example:'Ich lerne Deutsch.',unit:'sentences'},
    {id:'you',de:'du',en:'you, informal singular',example:'Du lernst Deutsch.',unit:'sentences'},
    {id:'we',de:'wir',en:'we',example:'Wir lernen Deutsch.',unit:'sentences'},
    {id:'german',de:'Deutsch',en:'German, the language',example:'Ich lerne Deutsch.',unit:'sentences'},
    {id:'be',de:'sein',en:'to be',example:'Ich bin hier.',unit:'sentences'},
    {id:'tired',de:'müde',en:'tired',example:'Ich bin müde.',unit:'sentences'},
    {id:'here',de:'hier',en:'here',example:'Das Buch ist hier.',unit:'sentences'},
    {id:'have',de:'haben',en:'to have',example:'Ich habe Zeit.',unit:'sentences'},
    {id:'time',de:'Zeit',en:'time',article:'die',plural:'Zeiten',example:'Ich habe Zeit.',unit:'sentences'},
    {id:'book',de:'Buch',en:'book',article:'das',plural:'Bücher',example:'Ich habe ein Buch.',unit:'sentences'},
    {id:'learn',de:'lernen',en:'to learn',example:'Ich lerne Deutsch.',unit:'sentences'},
    {id:'come',de:'kommen',en:'to come',example:'Ich komme aus Indien.',unit:'sentences'},
    {id:'india',de:'Indien',en:'India',example:'Ich komme aus Indien.',unit:'sentences'},
    {id:'woman',de:'Frau',en:'woman',article:'die',plural:'Frauen',example:'Die Frau lernt.',unit:'sentences'},
    {id:'man',de:'Mann',en:'man',article:'der',plural:'Männer',example:'Der Mann lernt.',unit:'sentences'},
    {id:'city',de:'Stadt',en:'city',article:'die',plural:'Städte',example:'Die Stadt ist groß.',unit:'sentences'},
    {id:'child',de:'Kind',en:'child',article:'das',plural:'Kinder',example:'Das Kind lernt.',unit:'sentences'},
    {id:'today',de:'heute',en:'today',example:'Heute lerne ich Deutsch.',unit:'sentences'},
    {id:'where',de:'wo',en:'where',example:'Wo wohnst du?',unit:'sentences'},
    {id:'live',de:'wohnen',en:'to live / reside',example:'Wo wohnst du?',unit:'sentences'},
    {id:'see',de:'sehen',en:'to see',example:'Ich sehe dich.',unit:'sentences'},
    {id:'no',de:'nein',en:'no',example:'Nein, danke.',unit:'everyday'},
    {id:'not',de:'nicht',en:'not',example:'Ich bin nicht müde.',unit:'everyday'},
    {id:'car',de:'Auto',en:'car',article:'das',plural:'Autos',example:'Ich habe kein Auto.',unit:'everyday'},
    {id:'my',de:'mein',en:'my',example:'Das ist mein Buch.',unit:'everyday'},
    {id:'your',de:'dein',en:'your, informal singular',example:'Ist das dein Buch?',unit:'everyday'},
    {id:'bag',de:'Tasche',en:'bag',article:'die',plural:'Taschen',example:'Das ist meine Tasche.',unit:'everyday'},
    {id:'can',de:'können',en:'can / to be able to',example:'Ich kann Deutsch lernen.',unit:'everyday'},
    {id:'get-up',de:'aufstehen',en:'to get up',example:'Ich stehe um acht auf.',unit:'everyday'},
    {id:'and',de:'und',en:'and',example:'Ich lerne und du liest.',unit:'everyday'},
    {id:'but',de:'aber',en:'but',example:'Ich bin müde, aber ich lerne.',unit:'everyday'},
    {id:'because-denn',de:'denn',en:'because / for',example:'Ich lerne, denn ich habe Zeit.',unit:'everyday'},
    {id:'give',de:'geben',en:'to give',example:'Ich gebe dir das Buch.',unit:'everyday'},
    {id:'help',de:'helfen',en:'to help',example:'Ich helfe dir.',unit:'everyday'},
    {id:'to-me',de:'mir',en:'me / to me, dative',example:'Du hilfst mir.',unit:'everyday'},
    {id:'to-you',de:'dir',en:'you / to you, informal dative',example:'Ich gebe dir das Buch.',unit:'everyday'},
    {id:'for',de:'für',en:'for, with accusative',example:'Das ist für dich.',unit:'everyday'},
    {id:'without',de:'ohne',en:'without, with accusative',example:'Ich komme ohne Auto.',unit:'everyday'},
    {id:'with',de:'mit',en:'with, with dative',example:'Ich fahre mit dem Bus.',unit:'everyday'},
    {id:'bus',de:'Bus',en:'bus',article:'der',plural:'Busse',example:'Ich fahre mit dem Bus.',unit:'everyday'},
    {id:'station',de:'Bahnhof',en:'railway station',article:'der',plural:'Bahnhöfe',example:'Ich gehe zum Bahnhof.',unit:'everyday'},
    {id:'park',de:'Park',en:'park',article:'der',plural:'Parks',example:'Ich gehe in den Park.',unit:'everyday'},
    {id:'go',de:'gehen',en:'to go / walk',example:'Ich bin nach Hause gegangen.',unit:'everyday'},
    {id:'yesterday',de:'gestern',en:'yesterday',example:'Gestern war ich müde.',unit:'everyday'},
    {id:'home',de:'nach Hause',en:'home, as a destination',example:'Ich gehe nach Hause.',unit:'everyday'},
    {id:'because-weil',de:'weil',en:'because, introducing a subordinate clause',example:'Ich lerne, weil ich Zeit habe.',unit:'connected'},
    {id:'that',de:'dass',en:'that, introducing a subordinate clause',example:'Ich weiß, dass du lernst.',unit:'connected'},
    {id:'know',de:'wissen',en:'to know a fact',example:'Ich weiß, dass du hier bist.',unit:'connected'},
    {id:'small',de:'klein',en:'small',example:'Der Tisch ist klein.',unit:'connected'},
    {id:'table',de:'Tisch',en:'table',article:'der',plural:'Tische',example:'Das ist ein kleiner Tisch.',unit:'connected'}
  ];
  const sources = [
    {id:'dw-course',title:'DW Nicos Weg: A1–B1 course',url:'https://www.dw.com/nico/english'},
    {id:'dw-intro',title:'DW: Von A bis Z — introductions and spelling',url:'https://static.dw.com/downloads/52719090/nicos-weg-a1-e0-l4-manuskript-und-wortschatz-englisch.pdf'},
    {id:'dw-sounds',title:'DW: Pronunciation — the alphabet',url:'https://www.dw.com/downloads/26294179/lektion1-learner-pronunciation.pdf'},
    {id:'dw-alphabet',title:'DW: Von A bis Z — alphabet and vocabulary',url:'https://static.dw.com/downloads/52719090/nicos-weg-a1-e0-l4-manuskript-und-wortschatz-englisch.pdf'},
    {id:'ou-pronouns',title:'Open University: personal pronouns',url:'https://www.open.edu/openlearn/languages/german/beginners-german-places-and-people/content-section-2.3'},
    {id:'umich-chart',title:'University of Michigan: articles and pronouns',url:'https://sites.lsa.umich.edu/german-resources/grammatik/basic-chart/'},
    {id:'umich-cases',title:'University of Michigan: case overview',url:'https://sites.lsa.umich.edu/german-resources/grammatik/standard-case-overview/'},
    {id:'umich-order',title:'University of Michigan: word order',url:'https://sites.lsa.umich.edu/german-resources/grammatik/wortstellung/'},
    {id:'umich-tenses',title:'University of Michigan: verb tenses',url:'https://sites.lsa.umich.edu/german-resources/grammatik/tenses/'},
    {id:'umich-present',title:'University of Michigan: verb forms and present tense',url:'https://sites.lsa.umich.edu/german-resources/grammatik/tensesmore/'},
    {id:'umich-negation',title:'University of Michigan: negation and word order',url:'https://sites.lsa.umich.edu/german-resources/grammatik/wortstellung/#nicht'},
    {id:'umich-adjectives',title:'University of Michigan: adjective endings',url:'https://sites.lsa.umich.edu/german-resources/grammatik/adjektivendungen/'}
  ];
  const E = (de,en,why) => ({de,en,why});
  const explainedExamples = {
    'hello':[
      [E('Hallo!','Hello!','One friendly word opens a conversation.'),E('Guten Tag!','Good day!','This is a polite daytime greeting. Learn both words as one phrase.')],
      [E('Tschüss, Leon!','Bye, Leon!','Tschüss is a friendly goodbye; you can add a name.'),E('Auf Wiedersehen!','Goodbye!','This is a more formal goodbye. Learn it as a complete phrase.')]
    ],
    'your-name':[
      [E('Ich heiße Leon.','My name is Leon.','Ich heiße stays together; put your name after it.'),E('Ich heiße Nico.','My name is Nico.','The same sentence works with a different name.')],
      [E('Wie heißt du?','What is your name?','Use heißt with du when asking one person informally.'),E('Wie heißen Sie?','What is your name? (formal)','Use heißen Sie when speaking formally. Learn this question as a phrase.')]
    ],
    'umlauts':[
      [E('die Tür','the door','The two dots belong to ü and change the vowel sound.'),E('fünf','five','This word also contains ü. Listen and compare its vowel with Tür.')],
      [E('die Straße','the street','ß is an s sound, not a b. Listen to the complete word.'),E('grüßen','to greet','This word has both ü and ß. Practise each sound with the model.')]
    ],
    'sound-pairs':[
      [E('mein','my','Here ei forms a vowel team. Listen to its sound.'),E('die Miete','the rent','Here the letters are ie, in the opposite order. Its vowel sound differs from mein.')],
      [E('die Schule','the school','Sch works together at the beginning of this word.'),E('die Häuser','the houses','Äu is one vowel team; it usually shares a sound with eu.')]
    ],
    'alphabet':[
      [E('Leon','Leon','Say its four German letter names in order: L, E, O, N.'),E('Nico','Nico','A different name has different letters: N, I, C, O. Use German letter names.')],
      [E('Wie schreibt man das?','How do you spell that?','Ask this when you need to know the written letters.'),E('Bitte buchstabieren Sie das.','Please spell that.','Buchstabieren asks for the letters one at a time; Sie makes this request formal.')]
    ],
    'numbers':[
      [E('zwei','two','Point to two fingers while saying zwei.'),E('fünf','five','Fünf names five. Keep the two dots on ü.')],
      [E('acht','eight','Acht names eight; it is different from five, fünf.'),E('zehn','ten','Zehn names ten. Practise recognising it out of counting order.')]
    ],
    'pronouns':[
      [E('Ich lerne Deutsch.','I am learning German.','Ich names the speaker. Lerne is the matching verb form.'),E('Du lernst Deutsch.','You are learning German.','Du addresses one familiar person. Lernst matches du.')],
      [E('Wir lernen Deutsch.','We are learning German.','Wir includes the speaker and at least one other person.'),E('Ihr lernt Deutsch.','You are learning German. (several familiar people)','Ihr addresses several people informally. Lernt matches ihr.')]
    ],
    'sein':[
      [E('Ich bin hier.','I am here.','With ich, the verb sein becomes bin.'),E('Du bist hier.','You are here.','With du, use bist instead of bin.')],
      [E('Er ist müde.','He is tired.','Er goes with ist.'),E('Wir sind hier.','We are here.','Wir goes with sind. Learn the pair wir sind together.')]
    ],
    'haben':[
      [E('Ich habe Zeit.','I have time.','Habe is the ich form of haben.'),E('Ich habe ein Buch.','I have a book.','Keep ich habe and change the thing you have.')],
      [E('Du hast Zeit.','You have time.','Du needs hast.'),E('Wir haben Zeit.','We have time.','Wir uses haben. The subject chooses the verb form.')]
    ],
    'present':[
      [E('Ich lerne Deutsch.','I am learning German.','The stem lern takes e with ich.'),E('Du lernst Deutsch.','You are learning German.','The stem lern takes st with du.')],
      [E('Ich komme aus Indien.','I come from India.','Komm takes e with ich; aus Indien gives the country.'),E('Wir lernen Deutsch.','We are learning German.','With wir, use the en form lernen.')]
    ],
    'gender-articles':[
      [E('das Buch','the book','Buch has neuter grammatical gender. Learn das with it.'),E('der Mann','the man','Mann has masculine grammatical gender. Learn der with it.')],
      [E('ein Buch','a book','In this basic form, neuter Buch uses ein.'),E('eine Frau','a woman','Feminine Frau uses eine in this basic form.')]
    ],
    'plurals':[
      [E('das Buch','the book','This is one book, with its singular article das.'),E('die Bücher','the books','The plural changes Buch to Bücher and uses die here.')],
      [E('die Frauen','the women','Frau makes its plural by adding en.'),E('die Städte','the cities','Stadt changes its vowel and adds e. Learn the whole plural Städte.')]
    ],
    'nominative':[
      [E('Der Mann lernt.','The man is learning.','Der Mann is the subject: the person doing the learning.'),E('Das Kind lernt.','The child is learning.','Das Kind is the subject and uses the nominative.')],
      [E('Heute lernt der Mann.','Today the man is learning.','The subject is still der Mann, even though it follows the verb.'),E('Heute lernt die Frau.','Today the woman is learning.','Die Frau is the subject. First position alone does not identify a subject.')]
    ],
    'word-order':[
      [E('Ich lerne Deutsch.','I am learning German.','Ich fills slot one; the conjugated verb lerne fills slot two.'),E('Wir lernen Deutsch.','We are learning German.','The same slot pattern works with wir and lernen.')],
      [E('Heute lerne ich Deutsch.','Today I am learning German.','Heute takes slot one; lerne stays second, so ich follows it.'),E('Heute lernen wir Deutsch.','Today we are learning German.','Keep lernen second even when Heute opens the statement.')]
    ],
    'questions':[
      [E('Lernst du Deutsch?','Are you learning German?','A yes/no question starts with the conjugated verb lernst.'),E('Hast du Zeit?','Do you have time?','Hast moves before du to ask a yes/no question.')],
      [E('Wo wohnst du?','Where do you live?','Wo asks for a location; wohnst follows it.'),E('Wo ist das Buch?','Where is the book?','Wo comes first, then ist, then the subject das Buch.')]
    ],
    'accusative':[
      [E('Ich sehe den Mann.','I see the man.','Den Mann is the direct object. Masculine der changes to den.'),E('Ich sehe die Frau.','I see the woman.','Die Frau is also a direct object, but feminine die stays die.')],
      [E('Ich sehe einen Mann.','I see a man.','Masculine ein becomes einen for this direct object.'),E('Ich habe ein Buch.','I have a book.','Neuter ein stays ein in the accusative; das also stays das.')]
    ],
    'accusative-pronouns':[
      [E('Du siehst mich.','You see me.','Use mich for the direct object me. Sehen becomes siehst with du.'),E('Ich sehe dich.','I see you.','Use dich for the direct object referring to one familiar person.')],
      [E('Ich sehe den Mann.','I see the man.','Den Mann is a masculine singular direct object.'),E('Ich sehe ihn.','I see him.','Ihn replaces the whole phrase den Mann.')]
    ],
    'negatives':[
      [E('Ich habe kein Buch.','I do not have a book.','Kein replaces ein to negate this noun.'),E('Ich habe kein Auto.','I do not have a car.','Auto is neuter; kein negates it in this direct-object phrase.')],
      [E('Ich bin nicht müde.','I am not tired.','Nicht negates the description müde.'),E('Das Buch ist nicht neu.','The book is not new.','Neu means new. Put nicht before the description you negate here.')]
    ],
    'possessives':[
      [E('Das ist mein Buch.','That is my book.','Neuter Buch uses mein in this basic form.'),E('Das ist meine Tasche.','That is my bag.','Feminine Tasche needs the e ending: meine.')],
      [E('Das ist dein Buch.','That is your book.','Dein means your when speaking to one person informally.'),E('Das ist deine Tasche.','That is your bag.','Dein takes e before feminine Tasche in this nominative pattern.')]
    ],
    'modals':[
      [E('Ich kann Deutsch lernen.','I can learn German.','Kann carries the meaning can; lernen stays in its infinitive form.'),E('Ich kann hier lernen.','I can study here.','The same two-verb pattern works when hier replaces Deutsch.')],
      [E('Du kannst Deutsch lernen.','You can learn German.','Use kannst with du. The infinitive lernen still ends the clause.'),E('Wir können Deutsch lernen.','We can learn German.','Use können with wir; keep the action lernen at the end.')]
    ],
    'separable':[
      [E('Ich stehe auf.','I get up.','Aufstehen splits: stehe is conjugated and auf goes at the end.'),E('Du stehst auf.','You get up.','With du, stehe changes to stehst; auf still finishes the clause.')],
      [E('Ich stehe um acht auf.','I get up at eight.','Put um acht between stehe and its prefix auf.'),E('Wir stehen um acht auf.','We get up at eight.','Wir uses stehen. The separable prefix auf remains at the end.')]
    ],
    'coordinating':[
      [E('Ich lerne Deutsch und du lernst Englisch.','I am learning German and you are learning English.','Und joins two main clauses while their verbs keep their usual positions.'),E('Ich bin müde, aber ich lerne.','I am tired, but I am studying.','Aber adds a contrast. Ich lerne keeps normal main-clause order.')],
      [E('Ich lerne, denn ich habe Zeit.','I am studying because I have time.','Denn gives a reason. After it, ich comes before habe.'),E('Ich bin hier, denn ich lerne.','I am here because I am studying.','Denn does not send lerne to the end of a subordinate clause.')]
    ],
    'dative':[
      [E('Ich gebe der Frau das Buch.','I give the woman the book.','Der Frau is the dative recipient; das Buch is the accusative thing given.'),E('Ich gebe dem Kind das Buch.','I give the child the book.','Neuter das Kind becomes dem Kind when it is the recipient.')],
      [E('Ich gebe dem Mann das Buch.','I give the man the book.','Masculine der Mann becomes dem Mann in the dative.'),E('Ich gebe der Frau ein Buch.','I give the woman a book.','Changing the thing to ein Buch does not change the recipient der Frau.')]
    ],
    'dative-verbs':[
      [E('Ich helfe dem Mann.','I help the man.','Helfen requires a dative object, so use dem Mann.'),E('Ich helfe der Frau.','I help the woman.','Feminine die Frau becomes der Frau after helfen.')],
      [E('Ich helfe dir.','I help you.','Use the dative pronoun dir with helfen.'),E('Ich danke dir.','I thank you.','Danken also takes a dative object, so use dir again.')]
    ],
    'two-objects':[
      [E('Ich gebe dem Mann das Buch.','I give the man the book.','Dem Mann receives it; das Buch is what is given.'),E('Ich gebe dem Kind das Buch.','I give the child the book.','The child is the dative recipient. The book is still the accusative object.')],
      [E('Ich gebe dir das Buch.','I give you the book.','Dir replaces a recipient phrase referring to one familiar person.'),E('Ich gebe ihm das Buch.','I give him the book.','Ihm replaces the masculine recipient dem Mann here.')]
    ],
    'acc-prepositions':[
      [E('Das ist für den Mann.','That is for the man.','Für requires accusative; masculine der becomes den.'),E('Das ist für die Frau.','That is for the woman.','Für still requires accusative, but feminine die stays die.')],
      [E('Das ist für dich.','That is for you.','Für requires the accusative pronoun dich, rather than du or dir.'),E('Das ist für mich.','That is for me.','Ich becomes mich after the accusative preposition für.')]
    ],
    'dat-prepositions':[
      [E('Ich fahre mit dem Bus.','I travel by bus.','Mit requires dative; der Bus becomes dem Bus.'),E('Ich fahre mit dem Auto.','I travel by car.','Neuter das Auto also uses dem after mit.')],
      [E('Ich lerne mit dir.','I study with you.','After mit, use dative dir for one familiar person.'),E('Du lernst mit mir.','You study with me.','After mit, use dative mir for me.')]
    ],
    'two-way':[
      [E('Ich bin im Park.','I am in the park.','This describes a location. Im combines in with dative dem.'),E('Das Buch ist im Park.','The book is in the park.','The book’s location also uses im Park.')],
      [E('Ich gehe in den Park.','I go into the park.','The park is the destination, so in takes accusative den Park.'),E('Ich gehe im Park spazieren.','I take a walk in the park.','The walking happens within the park. It is a location, so use dative im.')]
    ],
    'perfekt':[
      [E('Ich habe Deutsch gelernt.','I learned German.','Habe is the helper; gelernt is the participle at the end.'),E('Du hast Deutsch gelernt.','You learned German.','With du, change the helper to hast; gelernt stays the same.')],
      [E('Ich bin nach Hause gegangen.','I went home.','Gehen uses sein in this past pattern: bin gegangen.'),E('Wir sind nach Hause gegangen.','We went home.','With wir, change the helper to sind; keep gegangen at the end.')]
    ],
    'praeteritum':[
      [E('Ich war hier.','I was here.','War is the ich Präteritum form of sein.'),E('Gestern war ich müde.','Yesterday I was tired.','Gestern takes slot one, so war remains second and ich follows it.')],
      [E('Ich hatte Zeit.','I had time.','Hatte is the ich Präteritum form of haben.'),E('Gestern hatte ich Zeit.','Yesterday I had time.','Start with Gestern and keep hatte in the second slot.')]
    ],
    'subordinate':[
      [E('Ich lerne, weil ich Zeit habe.','I am studying because I have time.','Weil starts a subordinate clause, so habe ends that clause.'),E('Ich bin müde, weil ich lerne.','I am tired because I am studying.','The conjugated verb lerne goes last in this weil clause.')],
      [E('Ich weiß, dass du Deutsch lernst.','I know that you are learning German.','Dass starts a subordinate clause; lernst goes to its end.'),E('Ich weiß, dass du hier bist.','I know that you are here.','Bist is the conjugated verb and ends the dass clause.')]
    ],
    'relative-clauses':[
      [E('Das ist der Mann, der hier wohnt.','That is the man who lives here.','Der refers back to masculine Mann and is the relative clause’s subject.'),E('Das ist das Kind, das Deutsch lernt.','That is the child who is learning German.','Neuter Kind uses subject relative pronoun das. Lernt finishes the relative clause.')],
      [E('Das ist die Frau, die Deutsch lernt.','That is the woman who is learning German.','Feminine Frau uses subject relative pronoun die.'),E('Das ist die Frau, die hier wohnt.','That is the woman who lives here.','Change the added information; die still refers to Frau and wohnt goes last.')]
    ],
    'adjective-endings':[
      [E('der kleine Tisch','the small table','After masculine nominative der, klein takes e.'),E('das kleine Buch','the small book','After neuter nominative das, klein also takes e.')],
      [E('ein kleiner Tisch','a small table','With masculine nominative ein, the adjective carries er: kleiner.'),E('Der Tisch ist klein.','The table is small.','When klein describes the noun after ist, it does not take an adjective ending.')]
    ],
    'genitive':[
      [E('das Buch des Mannes','the man’s book','Des Mannes names the owner. Masculine der becomes des and Mann adds es.'),E('das Buch des Kindes','the child’s book','Neuter das also becomes des here; Kind adds es to become Kindes.')],
      [E('das Buch der Frau','the woman’s book','The feminine genitive article is der. Frau does not add es.'),E('die Tasche der Frau','the woman’s bag','Change the owned thing to Tasche; the owner stays der Frau.')]
    ]
  };
  const blindTasks = {
    'hello':{prompt:'Greet someone with the polite German phrase for “good day”.',answers:['Guten Tag','Guten Tag!'],explanation:'Guten Tag is the polite daytime greeting taught in the first examples.'},
    'your-name':{prompt:'Ask a friend “What is your name?” in German.',answers:['Wie heißt du?','Wie heisst du?'],explanation:'Wie heißt du? asks one familiar person their name.'},
    'umlauts':{prompt:'Write the German noun for “street”, without its article.',answers:['Straße','Strasse'],explanation:'Straße is the word from the ß examples. Strasse is a fallback when ß is unavailable.'},
    'sound-pairs':{prompt:'Write the German plural noun for “houses”, without its article.',answers:['Häuser','Haeuser'],explanation:'Häuser contains the vowel team äu. The sound practice itself needs listening.'},
    'alphabet':{prompt:'Ask “How do you spell that?” in German.',answers:['Wie schreibt man das?'],explanation:'Wie schreibt man das? is the spelling question from the examples.'},
    'numbers':{prompt:'Write the German word for the number eight.',answers:['acht'],explanation:'Acht means eight. This checks written recall; listen and say it aloud too.'},
    'pronouns':{prompt:'Which German pronoun means “you” when speaking informally to two friends?',answers:['ihr'],explanation:'Ihr addresses several people informally. Du addresses one person.'},
    'sein':{prompt:'Translate into German: We are here.',answers:['Wir sind hier.'],explanation:'Wir goes with sind: Wir sind hier.'},
    'haben':{prompt:'Translate into German: We have time.',answers:['Wir haben Zeit.'],explanation:'Wir uses haben. Zeit means time.'},
    'present':{prompt:'Translate into German: We are learning German.',answers:['Wir lernen Deutsch.'],explanation:'With wir, use lernen. The German present covers are learning here.'},
    'gender-articles':{prompt:'Translate the phrase “a man” into German.',answers:['ein Mann'],explanation:'Mann is masculine. In this basic nominative form, use ein Mann.'},
    'plurals':{prompt:'Translate the phrase “the cities” into German.',answers:['die Städte','die Staedte'],explanation:'Stadt becomes Städte in the plural. Use the plural article die here.'},
    'nominative':{prompt:'For “The man is learning”, write only the German subject phrase.',answers:['der Mann'],explanation:'Der Mann is the person learning, so it is the nominative subject.'},
    'word-order':{prompt:'Translate “Today we are learning German”, beginning with the word for today.',answers:['Heute lernen wir Deutsch.'],explanation:'Heute takes slot one. Lernen stays second, followed by the subject wir.'},
    'questions':{prompt:'Ask one friend “Do you have time?” in German.',answers:['Hast du Zeit?'],explanation:'For this yes/no question, put the conjugated verb hast before du.'},
    'accusative':{prompt:'Translate into German: I see the book.',answers:['Ich sehe das Buch.'],explanation:'Das Buch is the direct object. Neuter das stays das in the accusative.'},
    'accusative-pronouns':{prompt:'Translate into German: You see me. Speak to one friend.',answers:['Du siehst mich.'],explanation:'Use siehst with du, and accusative mich for the person being seen.'},
    'negatives':{prompt:'Translate into German: I do not have a car.',answers:['Ich habe kein Auto.'],explanation:'Kein negates the neuter noun Auto in this direct-object phrase.'},
    'possessives':{prompt:'Translate into German: That is your bag. Speak to one friend.',answers:['Das ist deine Tasche.'],explanation:'Tasche is feminine, so dein needs the e ending: deine Tasche.'},
    'modals':{prompt:'Translate into German: You can learn German. Speak to one friend.',answers:['Du kannst Deutsch lernen.'],explanation:'Du takes kannst. The infinitive lernen goes at the end.'},
    'separable':{prompt:'Translate into German: We get up at eight.',answers:['Wir stehen um acht auf.'],explanation:'Wir takes stehen. Put the time in the middle and the prefix auf at the end.'},
    'coordinating':{prompt:'Translate into German: I am tired, but I am studying.',answers:['Ich bin müde, aber ich lerne.','Ich bin muede, aber ich lerne.'],explanation:'Aber adds the contrast. Each part keeps ordinary main-clause verb order.'},
    'dative':{prompt:'Translate into German: I give the child the book.',answers:['Ich gebe dem Kind das Buch.'],explanation:'The recipient is dem Kind, in the dative. Das Buch is the accusative thing given.'},
    'dative-verbs':{prompt:'Translate into German: I thank you. Speak to one friend.',answers:['Ich danke dir.'],explanation:'Danken takes dative, so use dir rather than dich.'},
    'two-objects':{prompt:'Translate into German: I give him the book.',answers:['Ich gebe ihm das Buch.'],explanation:'Ihm is the dative recipient. Das Buch is the accusative thing given.'},
    'acc-prepositions':{prompt:'Translate into German: That is for me.',answers:['Das ist für mich.','Das ist fuer mich.'],explanation:'Für takes accusative, so the pronoun is mich.'},
    'dat-prepositions':{prompt:'Write the German phrase meaning “with me”.',answers:['mit mir'],explanation:'Mit takes dative. The dative form of ich is mir.'},
    'two-way':{prompt:'Translate into German: The book is in the park.',answers:['Das Buch ist im Park.','Das Buch ist in dem Park.'],explanation:'This describes a location, so use dative in dem Park, normally shortened to im Park.'},
    'perfekt':{prompt:'Translate into German: You learned German. Speak to one friend and use the Perfekt.',answers:['Du hast Deutsch gelernt.'],explanation:'Use helper hast with du and keep participle gelernt at the end.'},
    'praeteritum':{prompt:'Translate “Yesterday I had time” into German, starting with yesterday.',answers:['Gestern hatte ich Zeit.'],explanation:'Gestern takes slot one, hatte remains second, and ich follows the verb.'},
    'subordinate':{prompt:'Translate into German: I am tired because I am studying. Use a subordinate clause.',answers:['Ich bin müde, weil ich lerne.','Ich bin muede, weil ich lerne.'],explanation:'Weil begins the reason clause and sends its conjugated verb lerne to the end.'},
    'relative-clauses':{prompt:'Translate into German: That is the child who is learning German.',answers:['Das ist das Kind, das Deutsch lernt.'],explanation:'Neuter Kind uses das as the relative subject. Lernt comes at the end.'},
    'adjective-endings':{prompt:'Translate the noun phrase “the small book” into German, in nominative.',answers:['das kleine Buch'],explanation:'With nominative das Buch, klein takes the weak ending e: das kleine Buch.'},
    'genitive':{prompt:'Translate the noun phrase “the child’s book” into German, using genitive.',answers:['das Buch des Kindes'],explanation:'Neuter das becomes genitive des here. Kind also adds es: des Kindes.'}
  };
  for (const lesson of lessons) {
    lesson.cards.forEach((card,index) => { card.examples = explainedExamples[lesson.id][index]; });
    lesson.blind = {type:'type',...blindTasks[lesson.id]};
  }
  window.GERMAN_COURSE = {units,lessons,words,sources};
})();

