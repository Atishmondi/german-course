
/* Reading, writing and plain-language theory for the introductory course.
   Writing checks assess the requested sentence patterns, not unrestricted German. */
(function () {
  'use strict';
  const T = (definition, rule, steps, watch, terms) => ({ definition, rule, steps, watch, terms: terms.map(([term, meaning]) => ({ term, meaning })) });
  const Q = (prompt, options, answer, explanation) => ({ type: 'choice', prompt, options, answer, explanation });
  const R = (title, text, translation, questions, glossary = []) => ({ title, text, translation, questions, glossary: glossary.map(([de, en]) => ({ de, en })) });
  const W = (prompt, answers, pattern, label, hint, explanation) => ({ type: 'writing', prompt, answers, checks: [{ label, pattern }], hint, explanation, model: answers[0] });
  const topics = [
    { id: 'alphabet-topic', section: 'intro', number: 1, title: 'Alphabet: ä, ü, ö and ß', lessonIds: ['umlauts', 'sound-pairs', 'alphabet'] },
    { id: 'greetings-topic', section: 'intro', number: 2, title: 'Basic greetings', lessonIds: ['hello', 'your-name', 'numbers'] },
    { id: 'nouns-topic', section: 'simple', number: 1, title: 'Noun gender and plurals', lessonIds: ['gender-articles', 'plurals', 'nominative'] },
    { id: 'nominative-topic', section: 'simple', number: 2, title: 'Nominative case: what are cases?', lessonIds: ['nominative'] },
    { id: 'pronouns-topic', section: 'simple', number: 3, title: 'Nominative pronouns', lessonIds: ['pronouns'] },
    { id: 'present-topic', section: 'simple', number: 4, title: 'Verbs in the present tense', lessonIds: ['sein', 'haben', 'present', 'modals', 'separable'] },
    { id: 'articles-topic', section: 'simple', number: 5, title: 'Definite and indefinite articles', lessonIds: ['gender-articles', 'negatives', 'possessives'] },
    { id: 'accusative-topic', section: 'simple', number: 6, title: 'Accusative case for nouns', lessonIds: ['accusative'] },
    { id: 'accusative-pronouns-topic', section: 'simple', number: 7, title: 'Accusative pronouns', lessonIds: ['accusative-pronouns'] },
    { id: 'word-order-topic', section: 'simple', number: 8, title: 'Word order in simple sentences', lessonIds: ['word-order'] },
    { id: 'questions-topic', section: 'simple', number: 9, title: 'How to ask questions', lessonIds: ['questions'] },
    { id: 'conjunctions-topic', section: 'beyond', number: 1, title: 'Coordinating and subordinating conjunctions', lessonIds: ['coordinating', 'subordinate'] },
    { id: 'subordinate-topic', section: 'beyond', number: 2, title: 'Subordinate-clause word order', lessonIds: ['subordinate'] },
    { id: 'dative-topic', section: 'beyond', number: 3, title: 'Dative case', lessonIds: ['dative'] },
    { id: 'dative-verbs-topic', section: 'beyond', number: 4, title: 'Dative verbs', lessonIds: ['dative-verbs'] },
    { id: 'two-objects-topic', section: 'beyond', number: 5, title: 'Verbs with two objects: geben', lessonIds: ['two-objects'] },
    { id: 'prepositions-topic', section: 'beyond', number: 6, title: 'Accusative, dative and two-way prepositions', lessonIds: ['acc-prepositions', 'dat-prepositions', 'two-way'] },
    { id: 'perfekt-topic', section: 'beyond', number: 7, title: 'Perfekt: the conversational past', lessonIds: ['perfekt'] },
    { id: 'praeteritum-topic', section: 'beyond', number: 8, title: 'Präteritum: the simple past', lessonIds: ['praeteritum'] },
    { id: 'genitive-topic', section: 'beyond', number: 9, title: 'Genitive case', lessonIds: ['genitive'] },
    { id: 'relative-topic', section: 'beyond', number: 10, title: 'Relative clauses', lessonIds: ['relative-clauses'] },
    { id: 'adjectives-topic', section: 'beyond', number: 11, title: 'Adjective declension', lessonIds: ['adjective-endings'] }
  ];
  const lessons = {
    'hello': {
      theory: T(
        'A greeting opens a conversation. A goodbye closes it. You can use a complete greeting on its own; you do not need a long sentence or a verb first. Your first goal is choosing a phrase that fits the moment.',
        'Use Hallo for a friendly hello, Guten Tag for a more formal daytime greeting, and Tschüss for an informal goodbye.',
        ['Decide whether you are arriving or leaving.', 'Choose the matching greeting or goodbye.', 'Write the phrase, then add a name if useful.'],
        'Tschüss is friendly and informal. Auf Wiedersehen is a more formal goodbye. Greetings vary by region, so these are useful starting choices.',
        [['greeting', 'Words used when meeting someone.'], ['informal', 'Friendly language for familiar or relaxed situations.']]
      ),
      reading: R('A tiny conversation', 'Leon: Hallo, Nico!\nNico: Hallo, Leon!\nLeon: Tschüss!\nNico: Tschüss, Leon!', 'Leon: Hello, Nico!\nNico: Hello, Leon!\nLeon: Bye!\nNico: Bye, Leon!', [
        Q('Who greets Nico first?', ['Nico', 'Leon', 'Nobody'], 1, 'Leon opens with Hallo, Nico!'),
        Q('What does Leon say when leaving?', ['Good morning', 'Thank you', 'Bye'], 2, 'Tschüss means bye.'),
        Q('How does Nico address Leon?', ['By his name', 'By a job title', 'By a family title'], 0, 'Nico includes Leon’s name after the greeting and goodbye.')
      ]),
      writing: W('Write a tiny informal message to Nico in two short lines. First say hello to Nico. Then say goodbye. Use the friendly greeting and goodbye taught here; no extra sentence is needed.', ['Hallo, Nico! Tschüss!', 'Hallo Nico! Tschuess!'], '^hallo nico (tschüss|tschuess)$', 'Say hello to Nico, then an informal goodbye.', 'Use the friendly hello, the name Nico, and the friendly goodbye.', 'Hallo opens the message; Tschüss closes it. This check covers those two requested phrases.')
    },
    'your-name': {
      theory: T(
        'Introducing yourself means telling someone what to call you. German uses the verb heißen for being called. For now, learn the whole phrase as a useful building block rather than trying to build every possible verb form.',
        'Say Ich heiße followed by your name. Ask one person informally Wie heißt du? Use Wie heißen Sie? in a formal conversation.',
        ['Start your introduction with Ich heiße.', 'Add your name after the verb.', 'Ask the other person’s name with the matching question.'],
        'Du is informal. Sie with a capital S is formal you, even for one person. Keep ß in heiße, or use ss if necessary.',
        [['verb', 'A word for an action or state.'], ['formal', 'Polite language used with unfamiliar adults in many situations.']]
      ),
      reading: R('Meeting Leon', 'Nico: Hallo! Wie heißt du?\nLeon: Ich heiße Leon. Wie heißt du?\nNico: Ich heiße Nico.\nLeon: Hallo, Nico!', 'Nico: Hello! What is your name?\nLeon: My name is Leon. What is your name?\nNico: My name is Nico.\nLeon: Hello, Nico!', [
        Q('What is the first speaker’s name?', ['Leon', 'Anna', 'Nico'], 2, 'Nico introduces himself with Ich heiße Nico.'),
        Q('What does Leon ask Nico?', ['His name', 'His age', 'His address'], 0, 'Wie heißt du? asks someone’s name.'),
        Q('How do the speakers address each other?', ['With formal Sie', 'With informal du', 'With no question'], 1, 'Both name questions use du.')
      ]),
      writing: W('Introduce yourself as Leon, then ask the other person’s name informally. Write two complete sentences using the name phrase and question from this lesson. Keep the message limited to these two ideas.', ['Ich heiße Leon. Wie heißt du?', 'Ich heisse Leon. Wie heisst du?'], '^ich hei(ss|ß)e leon wie hei(ss|ß)t du$', 'Introduce Leon and ask the informal name question.', 'Start with Ich. The question starts with Wie.', 'Ich heiße gives your name. Wie heißt du? asks the other person informally. Only these requested forms are checked.')
    },
    'umlauts': {
      theory: T(
        'German has extra written letters that change how a word sounds. Ä, ö and ü are vowels in their own right, not decorations on a, o and u. The letter ß represents an s sound; it is not the letter B.',
        'Read the dots as part of the letter. Keep ä, ö, ü and ß when writing a word. Without those keys, use ae, oe, ue and ss.',
        ['Look for dots or the letter ß.', 'Read the whole word together with its meaning.', 'Copy the word carefully, preserving its special letters.'],
        'This written activity checks letter recognition, not your pronunciation. For ü, round your lips while keeping the tongue near an i position; listen when available.',
        [['umlaut', 'One of the vowel letters ä, ö or ü.'], ['vowel', 'A speech sound made with an open vocal tract.']]
      ),
      reading: R('A street and a door', 'Das ist eine Straße. Das ist eine Tür. Hier sind fünf Häuser. Die Tür ist schön.', 'That is a street. That is a door. Here are five houses. The door is beautiful.', [
        Q('How many houses are there?', ['Four', 'Five', 'Six'], 1, 'Fünf means five.'),
        Q('What is described as beautiful?', ['The street', 'The houses', 'The door'], 2, 'Die Tür ist schön says the door is beautiful.'),
        Q('What does Straße name here?', ['A street', 'A door', 'A house'], 0, 'Straße means street.')
      ], [['Das ist', 'That is'], ['eine', 'a'], ['Hier sind', 'Here are'], ['Häuser', 'houses'], ['schön', 'beautiful']]),
      writing: W('Make a short label in German for a street and a door. Write the two nouns in that order, separated by “and”. Include their familiar definite articles and preserve the special letters, or use keyboard alternatives.', ['die Straße und die Tür', 'die Strasse und die Tuer'], '^die stra(ß|ss)e und die t(ü|ue)r$', 'Write both labels with their special letters.', 'Both labels use die. The joining word is und.', 'Straße uses ß and Tür uses ü. The check accepts ss and ue as keyboard alternatives and does not assess pronunciation.')
    },
    'sound-pairs': {
      theory: T(
        'Sometimes two or three written letters work as one sound team. Reading each letter separately can lead you away from the word. Start by noticing the team, then connect the whole written word with its meaning and an audio example when available.',
        'Distinguish ei in mein from ie in Miete. Recognize sch in Schule. Eu and äu usually represent the same vowel combination, as in heute and Häuser.',
        ['Find a letter team inside the word.', 'Compare it with one familiar word from the cards.', 'Write the whole word without swapping the letter order.'],
        'These are useful common patterns, not rules for every borrowed word. This exercise checks spelling and meaning; written answers cannot show whether you produced the sound accurately.',
        [['letter team', 'Letters that combine to represent a sound.'], ['spelling', 'The particular letters and order used in a word.']]
      ),
      reading: R('School today', 'Heute ist Schule. Das ist meine Schule. Die Miete ist hoch. Hier sind drei Häuser.', 'There is school today. That is my school. The rent is high. Here are three houses.', [
        Q('What takes place today?', ['A holiday', 'A journey', 'School'], 2, 'Heute ist Schule means there is school today.'),
        Q('What is high?', ['The rent', 'The door', 'The school'], 0, 'Die Miete ist hoch describes high rent.'),
        Q('How many houses are mentioned?', ['Two', 'Three', 'Five'], 1, 'Drei means three.')
      ], [['heute', 'today'], ['Das ist', 'That is'], ['ist', 'is'], ['meine Schule', 'my school'], ['hoch', 'high'], ['Hier sind', 'Here are'], ['drei', 'three']]),
      writing: W('Write a short German label meaning “my school”. Then add a second label meaning “the rent”. Keep the two labels in that order so you practise sch and ie in meaningful words.', ['meine Schule, die Miete'], '^meine schule die miete$', 'Use Schule and Miete in the two requested labels.', 'The phrases begin meine and die. Watch the order of i and e.', 'Schule contains sch; Miete contains ie. This checks the two requested written labels, not the sounds of your voice.')
    },
    'alphabet': {
      theory: T(
        'The alphabet is the set of letters used to write a language. German uses the familiar A–Z letters plus ä, ö, ü and ß. A letter’s name is different from the sound it can make inside a word.',
        'To spell a name, give its letters in order. Leon is L–E–O–N. Ask Wie schreibt man das? when you need to know how something is written.',
        ['Read the name as one complete word.', 'Separate it into letters in their original order.', 'Write each letter clearly without adding or dropping one.'],
        'German letter names differ from English names. This written task checks letter order only. Bitte buchstabieren Sie das politely asks someone to spell something aloud.',
        [['alphabet', 'The ordered set of letters used in writing.'], ['buchstabieren', 'To spell a word letter by letter.']]
      ),
      reading: R('Checking a name', 'Nico: Wie schreibt man das?\nLeon: L, E, O, N.\nNico: Leon?\nLeon: Ja, Leon. Danke!', 'Nico: How do you spell that?\nLeon: L, E, O, N.\nNico: Leon?\nLeon: Yes, Leon. Thank you!', [
        Q('Which name is being spelled?', ['Nico', 'Leon', 'Anna'], 1, 'The four letters form Leon.'),
        Q('What does Nico ask for?', ['A translation', 'A number', 'A spelling'], 2, 'Wie schreibt man das? asks how something is written.'),
        Q('Does Leon confirm Nico’s reading?', ['Yes', 'No', 'He asks to leave'], 0, 'Ja confirms that Nico has the name right.')
      ], [['ja', 'yes'], ['danke', 'thank you']]),
      writing: W('Write the polite German request “Please spell that.” Then spell the name Nico as separate capital letters. This is a writing task, so focus on the request and the correct sequence of letters.', ['Bitte buchstabieren Sie das. N I C O.'], '^bitte buchstabieren sie das n i c o$', 'Make the polite spelling request, then spell Nico.', 'Use Bitte, the verb buchstabieren, formal Sie, and das.', 'Bitte buchstabieren Sie das is the request. Nico has four letters: N, I, C, O. Spoken letter names are not assessed.')
    },
    'numbers': {
      theory: T(
        'A number word lets you read and write an amount without using a digit. Begin with zero through ten. Learning the written form alongside the amount makes numbers useful for messages, simple counts and checking details in a short text.',
        'The first words are null, eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun and zehn. Put a counting number before the things you are counting.',
        ['Read the amount or digit carefully.', 'Recall the German word for that amount.', 'Check the spelling before moving to the next number.'],
        'Eins becomes ein in some phrases before a noun. You will learn article endings separately. The written tasks focus on zero through ten, including the ü in fünf.',
        [['number word', 'A number written using letters rather than a digit.'], ['amount', 'How many of something there are.']]
      ),
      reading: R('Counting study things', 'Hier sind zwei Bücher. Hier sind fünf Stifte. Hier sind acht Karten. Das sind zehn Wörter.', 'Here are two books. Here are five pens. Here are eight cards. Those are ten words.', [
        Q('How many books are there?', ['Five', 'Eight', 'Two'], 2, 'Zwei Bücher means two books.'),
        Q('How many cards are there?', ['Eight', 'Ten', 'Five'], 0, 'Acht Karten means eight cards.'),
        Q('What comes in a group of ten?', ['Pens', 'Words', 'Books'], 1, 'Zehn Wörter means ten words.')
      ], [['Hier sind', 'Here are'], ['Bücher', 'books'], ['Stifte', 'pens'], ['Karten', 'cards'], ['Das sind', 'Those are'], ['Wörter', 'words']]),
      writing: W('Write a short German inventory message meaning “Here are five pens. Here are nine cards.” Use German number words rather than digits, and keep the two quantities with their matching items from the reading.', ['Hier sind fünf Stifte. Hier sind neun Karten.', 'Hier sind fuenf Stifte. Hier sind neun Karten.'], '^hier sind f(ü|ue)nf stifte hier sind neun karten$', 'Match five to pens and nine to cards in the two statements.', 'Use the reading’s Hier sind pattern. Pens are Stifte and cards are Karten.', 'Fünf Stifte means five pens; neun Karten means nine cards. This checks the two requested count statements, not number pronunciation.')
    },
    'pronouns': {
      theory: T(
        'A pronoun is a short word used instead of a name or noun phrase. Subject pronouns tell us who the sentence is about. They also help you choose the right verb form, so read the pronoun and its verb together.',
        'Ich means I, du means informal singular you, er/sie/es mean he/she/it, wir means we, ihr means informal plural you, and Sie means formal you.',
        ['Decide who is doing the action.', 'Choose the subject pronoun for that person or group.', 'Use the matching verb form shown in the cards.'],
        'Lowercase sie can mean she or they; the verb and context help. Capital Sie means formal you. At the start of a sentence, capitalization alone may not distinguish them.',
        [['pronoun', 'A word that stands in for a person or thing.'], ['subject', 'The person or thing the verb describes as doing or being something.']]
      ),
      reading: R('Who studies what?', 'Ich heiße Leon. Ich lerne Deutsch. Nico lernt auch Deutsch. Wir lernen zusammen. Ihr lernt Englisch.', 'My name is Leon. I am learning German. Nico is also learning German. We study together. You all are learning English.', [
        Q('Who is speaking about himself?', ['Nico', 'A teacher', 'Leon'], 2, 'The speaker says Ich heiße Leon.'),
        Q('Who learns German together?', ['Leon and Nico', 'Only Nico', 'Only the people addressed as ihr'], 0, 'Wir refers to Leon and Nico after both are introduced.'),
        Q('What are the people addressed as ihr learning?', ['German', 'English', 'No language'], 1, 'Ihr lernt Englisch says they are learning English.')
      ], [['auch', 'also'], ['zusammen', 'together'], ['Englisch', 'English']]),
      writing: W('Write two sentences about two groups: “We are learning German. You all are learning German.” Use the informal plural form for the second sentence. Keep both subjects explicit rather than replacing them with names.', ['Wir lernen Deutsch. Ihr lernt Deutsch.'], '^wir lernen deutsch ihr lernt deutsch$', 'Distinguish wir from ihr with their matching verbs.', 'We is wir; informal you all is ihr.', 'Wir takes lernen and ihr takes lernt here. The check covers these two requested pronoun–verb combinations.')
    },
    'sein': {
      theory: T(
        'Sein means to be. Use it to say what someone is or how and where someone is. Its present forms do not follow the ordinary beginner ending pattern, so learn each frequent subject and form as a small pair.',
        'Use ich bin, du bist, er/sie/es ist and wir sind. In a simple statement, put the form of sein after the subject.',
        ['Choose the person or group you are describing.', 'Select the matching form of sein.', 'Add a place or description after that verb.'],
        'Do not add an extra English-style “am” or another German verb. A describing word after sein, such as müde, does not get an adjective ending in this pattern.',
        [['infinitive', 'The dictionary form of a verb, such as sein.'], ['present tense', 'A verb form used for current states, habits and other present meanings.']]
      ),
      reading: R('At the study table', 'Ich bin Leon. Ich bin hier. Nico ist auch hier. Er ist müde. Wir sind hier.', 'I am Leon. I am here. Nico is here too. He is tired. We are here.', [
        Q('Who is tired?', ['Leon', 'Nico', 'Both speakers explicitly'], 1, 'Er refers to Nico, who is described as müde.'),
        Q('Where are Leon and Nico?', ['At home specifically', 'In India specifically', 'Here'], 2, 'The passage says hier without naming a specific place.'),
        Q('What does wir include here?', ['Leon and Nico', 'Only Leon', 'Only Nico'], 0, 'The final sentence groups Leon and Nico together.')
      ], [['auch', 'also']]),
      writing: W('Write two short statements meaning “You are here. We are tired.” Address one person informally in the first sentence. Use the present forms of sein and the describing word already taught in this lesson.', ['Du bist hier. Wir sind müde.', 'Du bist hier. Wir sind muede.'], '^du bist hier wir sind m(ü|ue)de$', 'Use bist for du and sind for wir.', 'Keep du with bist and wir with sind.', 'Du bist and wir sind are present forms of sein. Müde describes the group. Only this requested statement pair is checked.')
    },
    'haben': {
      theory: T(
        'Haben means to have. It can express possession, but also useful everyday ideas such as having time. The verb changes with its subject. You can first learn a few complete subject–verb pairs and reuse the same short object after them.',
        'Use ich habe, du hast, er/sie/es hat and wir haben. Place the thing someone has after the verb in these simple sentences.',
        ['Identify the person who has something.', 'Choose habe, hast, hat or haben for that subject.', 'Name the thing or time that person has.'],
        'Du hast and er hat lose the b found in haben. Ich habe Zeit needs no article before Zeit in this everyday expression. Articles will be practised separately.',
        [['possession', 'Having or owning something.'], ['object', 'A person or thing linked to the action or meaning of a verb.']]
      ),
      reading: R('Time to study', 'Ich habe ein Buch. Nico hat auch ein Buch. Du hast Zeit. Wir haben Zeit. Wir lernen Deutsch.', 'I have a book. Nico also has a book. You have time. We have time. We are learning German.', [
        Q('What do the speaker and Nico each have?', ['A car', 'A bag', 'A book'], 2, 'Both sentences mention ein Buch.'),
        Q('Does the person addressed have time?', ['Yes', 'No', 'The text says only Nico has time'], 0, 'Du hast Zeit says you have time.'),
        Q('What are the people doing?', ['Buying books', 'Learning German', 'Driving home'], 1, 'Wir lernen Deutsch gives the activity.')
      ], [['auch', 'also']]),
      writing: W('Write a two-sentence study message meaning “I have a book. You have time.” Address one person informally. Use haben in both sentences and keep the two ideas in the given order.', ['Ich habe ein Buch. Du hast Zeit.'], '^ich habe ein buch du hast zeit$', 'Use habe with ich and hast with du.', 'The first verb keeps b; the second form is hast.', 'Ich habe and du hast match their subjects. Zeit is used without an article here. This checks the requested two statements.')
    },
    'present': {
      theory: T(
        'The present tense describes what happens now or regularly, among other uses. A regular German verb has a stem and an ending. The stem carries the basic meaning, while the ending changes to match the sentence’s subject.',
        'For lernen, remove -en to get lern-. Add -e for ich, -st for du and -en for wir. Other common forms are er/sie/es lernt and ihr lernt.',
        ['Find the subject before choosing a verb ending.', 'Take the stem from the dictionary form.', 'Attach the ending that belongs to that subject.'],
        'Not every verb follows this pattern exactly. Sein and haben are important irregular verbs. The German present can translate English “learn” or “am learning”; no extra verb is needed.',
        [['stem', 'The main part of a verb before its changing ending.'], ['conjugate', 'Change a verb to fit its subject or tense.']]
      ),
      reading: R('A shared language goal', 'Ich komme aus Indien. Ich lerne Deutsch. Nico lernt auch Deutsch. Du lernst Englisch. Wir lernen jeden Tag.', 'I come from India. I am learning German. Nico is also learning German. You are learning English. We study every day.', [
        Q('Where does the speaker come from?', ['Germany', 'India', 'Austria'], 1, 'Aus Indien means from India.'),
        Q('What is the person addressed as du learning?', ['German', 'Hindi', 'English'], 2, 'Du lernst Englisch says you are learning English.'),
        Q('How often does the group study?', ['Every day', 'Only today', 'Once a week'], 0, 'Jeden Tag means every day.')
      ], [['auch', 'also'], ['Englisch', 'English'], ['jeden Tag', 'every day']]),
      writing: W('Write two sentences meaning “I am learning German. You are learning German.” Address one person informally. Use the single German present-tense verb in each sentence, without translating the English “am” or “are” separately.', ['Ich lerne Deutsch. Du lernst Deutsch.'], '^ich lerne deutsch du lernst deutsch$', 'Match lerne to ich and lernst to du.', 'Start with the stem lern-, then choose -e or -st.', 'German uses Ich lerne for both I learn and I am learning. The check covers the two specified regular present forms.')
    },
    'gender-articles': {
      theory: T(
        'A noun names a person, place, object or idea. Every German noun has a grammatical gender: masculine, feminine or neuter. An article is a small word before the noun. Learn the article and noun together so you remember their grammatical partnership.',
        'In the nominative singular, definite articles are der, die and das. Indefinite articles are ein, eine and ein. The definite article means the; the indefinite article means a/an.',
        ['Learn a noun together with der, die or das.', 'Decide whether you mean the specific thing or a thing.', 'Choose the matching definite or indefinite article.'],
        'These forms are for the nominative singular. Articles change in other cases. Gender is grammatical; it is not a reliable statement about a thing’s appearance or meaning.',
        [['gender', 'A noun category: masculine, feminine or neuter.'], ['article', 'A word such as der or ein placed before a noun.']]
      ),
      reading: R('A person and a book', 'Das ist ein Mann. Der Mann hat ein Buch. Das Buch ist neu. Das ist eine Frau. Die Frau lernt Deutsch.', 'That is a man. The man has a book. The book is new. That is a woman. The woman is learning German.', [
        Q('Who has a book?', ['The woman', 'The child', 'The man'], 2, 'Der Mann hat ein Buch gives the owner.'),
        Q('What is new?', ['The book', 'The man’s name', 'The woman’s language'], 0, 'Das Buch ist neu describes the book.'),
        Q('What is the woman doing?', ['Reading English', 'Learning German', 'Buying a book'], 1, 'Die Frau lernt Deutsch states her activity.')
      ], [['Das ist', 'That is'], ['neu', 'new']]),
      writing: W('Write two sentences introducing a book and a woman: “That is a book. That is a woman.” Use indefinite articles because you are introducing each for the first time. Keep the nouns in this order.', ['Das ist ein Buch. Das ist eine Frau.'], '^das ist ein buch das ist eine frau$', 'Use ein for Buch and eine for Frau.', 'Buch is neuter; Frau is feminine.', 'Ein Buch and eine Frau use the nominative indefinite articles. This checks the two introductions and their article choices.')
    },
    'plurals': {
      theory: T(
        'Singular means one; plural means more than one. German nouns form plurals in several ways. Some add an ending, some change a vowel with an umlaut, and some do both. Store each new noun with its own plural rather than relying on one universal ending.',
        'Learn das Buch → die Bücher, die Frau → die Frauen and die Stadt → die Städte. In the nominative and accusative, the definite plural article is die.',
        ['Notice whether you mean one item or several.', 'Recall the noun’s learned plural form.', 'Use die when a definite plural article is needed.'],
        'Die does not always mean a feminine singular noun; it can introduce any plural gender. After a number, a simple count often needs no article: zwei Bücher.',
        [['singular', 'The form referring to one person or thing.'], ['plural', 'The form referring to more than one person or thing.']]
      ),
      reading: R('A study group', 'Hier sind zwei Bücher. Die Bücher sind neu. Drei Frauen lernen Deutsch. Die Frauen haben Zeit.', 'Here are two books. The books are new. Three women are learning German. The women have time.', [
        Q('How many books are there?', ['Two', 'Three', 'Five'], 0, 'Zwei Bücher means two books.'),
        Q('What does the text say about the books?', ['They are old', 'They are lost', 'They are new'], 2, 'Die Bücher sind neu means the books are new.'),
        Q('How many women are learning German?', ['One', 'Three', 'Two'], 1, 'Drei Frauen means three women.')
      ], [['Hier sind', 'Here are'], ['neu', 'new'], ['drei', 'three']]),
      writing: W('Write a short count label meaning “two books and three women”. Use digits written as German words and the correct plural nouns. Keep the books first, and join the two groups with und.', ['zwei Bücher und drei Frauen', 'zwei Buecher und drei Frauen'], '^zwei b(ü|ue)cher und drei frauen$', 'Use Bücher and Frauen after the two number words.', 'Buch changes its vowel and adds -er; Frau adds -en.', 'Two and three require plural nouns. The check accepts Bücher or Buecher and the learned plural Frauen.')
    },
    'nominative': {
      theory: T(
        'A case is a grammatical form that marks a word’s job in a sentence. The nominative case is used for the subject: the person or thing the verb says is doing or being something. Changing position does not automatically change that job.',
        'Find the subject by asking who or what is doing the action. In the nominative, the definite articles are der for masculine, die for feminine, das for neuter and die for plural.',
        ['Find the action or state expressed by the verb.', 'Ask who or what does it or is described.', 'Give that subject its nominative article or pronoun.'],
        'The subject is not always the first word. After sein, a noun describing the subject can also be nominative. Case is a grammatical job, not simply word position.',
        [['case', 'A grammatical form showing a noun or pronoun’s job.'], ['nominative', 'The case used for the subject and some subject descriptions.']]
      ),
      reading: R('Who is learning?', 'Heute lernt der Mann Deutsch. Die Frau lernt auch Deutsch. Das Kind lernt Englisch. Heute lernen alle zusammen.', 'Today the man is learning German. The woman is also learning German. The child is learning English. Today everyone studies together.', [
        Q('What does the child learn?', ['German', 'English', 'Both languages explicitly'], 1, 'Das Kind lernt Englisch gives the child’s language.'),
        Q('Who learns German?', ['Only the child', 'Only the woman', 'The man and the woman'], 2, 'The first two sentences name the man and the woman.'),
        Q('How are they studying today?', ['Together', 'In separate cities', 'Only in the morning'], 0, 'Alle zusammen means everyone together.')
      ], [['auch', 'also'], ['Englisch', 'English'], ['alle zusammen', 'everyone together']]),
      writing: W('Write two statements meaning “Today the woman is learning German. The child is learning German.” Put today first in the first sentence. Use each noun with its correct nominative definite article.', ['Heute lernt die Frau Deutsch. Das Kind lernt Deutsch.'], '^heute lernt die frau deutsch das kind lernt deutsch$', 'Use die Frau and das Kind as the two subjects.', 'Heute comes first, so the verb comes before die Frau.', 'Die Frau remains the subject after the verb. Das Kind is the second subject. The check covers these nominative phrases and sentence order.')
    },
    'word-order': {
      theory: T(
        'German word order gives the conjugated verb a predictable place. A conjugated verb is the form that matches the subject, such as lerne or lernen. In a normal main-clause statement, one whole sentence element appears before that verb.',
        'Put the conjugated verb in position two. If the subject starts the sentence, the verb follows it. If heute starts it, put the verb next and then the subject.',
        ['Choose the single idea you want to put first.', 'Put the conjugated verb immediately after that first element.', 'Place the subject next if it has not appeared yet.'],
        'Position two means the second element, not always the second written word. This rule describes ordinary statements; yes/no questions and subordinate clauses use other patterns you will learn.',
        [['main clause', 'A clause that can stand as a complete statement.'], ['sentence element', 'A word or group functioning as one unit in the sentence.']]
      ),
      reading: R('Today’s study plan', 'Heute lerne ich Deutsch. Nico lernt heute auch Deutsch. Wir lernen zusammen. Heute haben wir Zeit. Wir sind hier.', 'Today I am learning German. Nico is also learning German today. We study together. Today we have time. We are here.', [
        Q('When does the speaker study German?', ['Tomorrow', 'Yesterday', 'Today'], 2, 'Heute means today.'),
        Q('Are the speaker and Nico studying together?', ['Yes', 'No', 'Nico is not studying'], 0, 'Wir lernen zusammen says they study together.'),
        Q('What do they have today?', ['A new car', 'Time', 'Two houses'], 1, 'Heute haben wir Zeit means they have time today.')
      ], [['auch', 'also'], ['zusammen', 'together']]),
      writing: W('Write two versions of “We are learning German today.” Begin the first with wir and the second with heute. Keep the meaning the same and give the conjugated verb its correct place in each statement.', ['Wir lernen heute Deutsch. Heute lernen wir Deutsch.', 'Wir lernen Deutsch heute. Heute lernen wir Deutsch.'], '^wir lernen (heute deutsch|deutsch heute) heute lernen wir deutsch$', 'Keep lernen second when either wir or heute comes first.', 'When heute moves to the front, wir moves after lernen.', 'Both statements keep the conjugated verb after the first element. This checks the requested word-order change and its meaning.')
    },
    'questions': {
      theory: T(
        'A question requests information. A yes/no question can be answered with yes or no. An information question asks for a detail such as a place or name. German signals these two common question types with a different order at the beginning.',
        'Start a yes/no question with the conjugated verb, then the subject. Start an information question with a question word such as wo, then the conjugated verb and subject.',
        ['Decide whether you need yes/no or a specific detail.', 'Start with the verb or the needed question word.', 'Add the subject and finish with a question mark.'],
        'Wo asks where something is. Wohin asks where to; do not treat them as interchangeable. A question mark helps readers but does not replace the correct verb position.',
        [['yes/no question', 'A question asking whether something is true.'], ['question word', 'A word such as wo, wie or was that requests a detail.']]
      ),
      reading: R('Questions before studying', 'Leon: Hast du Zeit?\nNico: Ja.\nLeon: Lernst du Deutsch?\nNico: Ja. Wo ist das Buch?\nLeon: Das Buch ist hier.', 'Leon: Do you have time?\nNico: Yes.\nLeon: Are you learning German?\nNico: Yes. Where is the book?\nLeon: The book is here.', [
        Q('Does Nico have time?', ['Yes', 'No', 'He does not answer'], 0, 'Nico answers Ja to Hast du Zeit?'),
        Q('What is Nico looking for?', ['A bus', 'A bag', 'A book'], 2, 'He asks Wo ist das Buch?'),
        Q('Where is the book?', ['At home specifically', 'Here', 'In India'], 1, 'Leon replies Das Buch ist hier.')
      ], [['ja', 'yes']]),
      writing: W('Write two questions to one person informally: “Do you have time?” and “Where is the book?” Use one yes/no question and one place question, keeping the two requests in the given order.', ['Hast du Zeit? Wo ist das Buch?'], '^hast du zeit wo ist das buch$', 'Use a verb-first question and a wo question.', 'Begin the first with Hast and the second with Wo.', 'Hast du Zeit? starts with the verb. Wo ist das Buch? starts with the requested place detail. These question patterns are checked.')
    },
    'accusative': {
      theory: T(
        'The accusative is another case, or grammatical job marker. Many verbs put their direct object in this case. The subject does the seeing, having or other action; the direct object is the person or thing the verb directly refers to.',
        'For a masculine singular direct object, der becomes den and ein becomes einen. Feminine die/eine, neuter das/ein and plural die look unchanged from their nominative article forms.',
        ['Find the verb and identify who does the action.', 'Ask who or what is directly seen, had or affected.', 'Choose that object’s accusative article using its noun gender.'],
        'Not every object is accusative. Some verbs require dative, and prepositions can determine case too. The masculine article change is visible; an unchanged article can still be accusative.',
        [['direct object', 'The person or thing directly linked to many verbs’ actions.'], ['accusative', 'The case used for many direct objects and certain prepositions.']]
      ),
      reading: R('Who sees whom?', 'Die Frau sieht den Mann. Der Mann sieht das Kind. Das Kind hat ein Buch. Ich sehe die Frau.', 'The woman sees the man. The man sees the child. The child has a book. I see the woman.', [
        Q('Who does the woman see?', ['The child', 'The man', 'The speaker'], 1, 'Den Mann is the person she sees.'),
        Q('What does the child have?', ['A bag', 'A car', 'A book'], 2, 'Das Kind hat ein Buch names the object.'),
        Q('Who does the speaker see?', ['The woman', 'The man', 'The child'], 0, 'Ich sehe die Frau says the speaker sees the woman.')
      ], [['sieht', 'sees']]),
      writing: W('Write two short statements meaning “I see a man. I have a book.” Use indefinite articles for both objects. Pay special attention to the masculine object, while keeping the neuter object’s article unchanged.', ['Ich sehe einen Mann. Ich habe ein Buch.'], '^ich sehe einen mann ich habe ein buch$', 'Use einen Mann and ein Buch as accusative objects.', 'Mann is masculine; Buch is neuter.', 'The masculine indefinite article becomes einen; neuter ein stays ein. This checks the two requested direct-object phrases.')
    },
    'accusative-pronouns': {
      theory: T(
        'An object pronoun replaces a longer object phrase when the person or thing is already clear. Its form depends on its grammatical job. The subject pronoun ich cannot simply be reused when another person sees or addresses me.',
        'For accusative objects, ich becomes mich, du becomes dich and er becomes ihn. Use ihn to replace a known masculine singular object such as den Mann.',
        ['Find the person or noun phrase that is the object.', 'Choose its accusative pronoun rather than its subject pronoun.', 'Keep the verb and subject clear when shortening the sentence.'],
        'A German noun’s grammatical gender controls its replacement pronoun; not every object uses ihn. Dative verbs need different pronouns, such as mir and dir, which come later.',
        [['object pronoun', 'A short replacement for a noun phrase used as an object.'], ['reference', 'The person or thing a pronoun points back to.']]
      ),
      reading: R('A clear view', 'Ich sehe den Mann. Nico sieht ihn auch. Der Mann sieht mich. Ich sehe dich. Du siehst den Mann.', 'I see the man. Nico sees him too. The man sees me. I see you. You see the man.', [
        Q('Who does ihn refer to?', ['Nico', 'The speaker', 'The man'], 2, 'Ihn replaces den Mann from the first sentence.'),
        Q('Who sees the speaker?', ['The man', 'Only Nico', 'Nobody'], 0, 'Der Mann sieht mich means the man sees me.'),
        Q('Does the speaker see the person addressed?', ['No', 'Yes', 'The text only mentions hearing'], 1, 'Ich sehe dich means I see you.')
      ], [['sieht', 'sees'], ['auch', 'also']]),
      writing: W('Write two sentences meaning “I see him. You see me.” The “him” refers to the man already mentioned in this lesson. Address one person informally and use object pronouns instead of repeating nouns.', ['Ich sehe ihn. Du siehst mich.'], '^ich sehe ihn du siehst mich$', 'Use ihn for him and mich for me.', 'The person doing the seeing stays ich or du.', 'Ihn and mich are accusative objects of sehen. This checks their requested references, plus the matching see-verb forms.')
    },
    'negatives': {
      theory: T(
        'Negation changes a statement into a negative one. English uses words such as not or no; German often uses nicht or kein. Choosing between them depends on what you are denying, so begin with these two common patterns instead of translating word by word.',
        'Use kein to deny having an indefinite noun: ein Buch → kein Buch. Use nicht before a simple description after sein: Ich bin nicht müde.',
        ['Identify whether you are denying a noun or a description.', 'Choose kein for the taught indefinite-noun pattern or nicht for the description.', 'Place the negative word where that pattern shows it.'],
        'Nicht has several positions in longer sentences. Kein also changes its ending with gender, number and case. This introduction practises neuter kein Buch and descriptions after sein.',
        [['negation', 'Making an idea negative, such as not or no.'], ['indefinite noun phrase', 'A phrase introducing a thing, such as ein Buch.']]
      ),
      reading: R('A corrected plan', 'Ich habe kein Buch. Nico hat ein Buch. Das Buch ist nicht neu. Ich bin nicht müde. Wir lernen Deutsch.', 'I do not have a book. Nico has a book. The book is not new. I am not tired. We are learning German.', [
        Q('Who has a book?', ['The speaker', 'Nico', 'Both people'], 1, 'The speaker has no book; Nico has one.'),
        Q('Is the book new?', ['Yes', 'The text does not say', 'No'], 2, 'Nicht neu means not new.'),
        Q('Is the speaker tired?', ['No', 'Yes', 'Only in the morning'], 0, 'Ich bin nicht müde denies being tired.')
      ], [['neu', 'new']]),
      writing: W('Write a two-sentence correction meaning “I do not have a book. I am not tired.” Use the negative word that fits each pattern. Keep the missing object first and the personal description second.', ['Ich habe kein Buch. Ich bin nicht müde.', 'Ich habe kein Buch. Ich bin nicht muede.'], '^ich habe kein buch ich bin nicht m(ü|ue)de$', 'Use kein before Buch and nicht before müde.', 'One sentence denies a noun; the other denies a description.', 'Kein replaces ein in the noun phrase. Nicht makes the description müde negative. These two target patterns are checked.')
    },
    'possessives': {
      theory: T(
        'A possessive word shows whose thing you mean. It stands before a noun, like English my or your. In German its beginning points to the owner, while its ending depends on the noun’s gender, number and case.',
        'For the nominative singular, use mein Buch and meine Tasche for my book and my bag. For one informal person’s things, use dein Buch and deine Tasche.',
        ['Decide whether the owner is me or the person addressed.', 'Choose mein- for my or dein- for your.', 'Use the ending that belongs with the noun in this pattern.'],
        'Do not choose meine merely because the owner is female. The ending follows the possessed noun. Other genders, plurals and cases need additional forms; this task uses Buch and Tasche.',
        [['possessive', 'A word showing whose person or thing is meant.'], ['owner', 'The person linked to a thing by my, your or a similar word.']]
      ),
      reading: R('Whose study things?', 'Das ist mein Buch. Das ist deine Tasche. Meine Tasche ist hier. Dein Buch ist auch hier. Wir haben Zeit.', 'That is my book. That is your bag. My bag is here. Your book is here too. We have time.', [
        Q('Whose book is introduced first?', ['The speaker’s', 'The other person’s', 'Nico’s specifically'], 0, 'Mein Buch means my book.'),
        Q('Whose bag is introduced second?', ['The speaker’s', 'A stranger’s', 'The other person’s'], 2, 'Deine Tasche means your bag.'),
        Q('Where is the speaker’s bag?', ['In a car', 'Here', 'At school specifically'], 1, 'Meine Tasche ist hier gives the location.')
      ], [['auch', 'also']]),
      writing: W('Write two sentences meaning “That is my bag. That is your book.” Speak informally to one person. Choose each possessive ending using the thing being described, and keep the two introductions in order.', ['Das ist meine Tasche. Das ist dein Buch.'], '^das ist meine tasche das ist dein buch$', 'Match meine to Tasche and dein to Buch.', 'Tasche is feminine; Buch is neuter.', 'Meine Tasche has -e because Tasche is feminine; dein Buch uses no ending here. This checks the requested possessive noun phrases.')
    },
    'modals': {
      theory: T(
        'A modal verb adds an idea such as ability, necessity or permission to another verb. Können means can or be able to. The modal changes to match the subject, while the second verb usually stays in its dictionary form.',
        'Use ich kann, du kannst and wir können. In a main statement, put that form in the ordinary verb position and the other verb’s infinitive at the end.',
        ['Choose who can do the action.', 'Use the matching form of können in position two.', 'Put the action verb in its infinitive at the end.'],
        'Do not conjugate both verbs for the subject. Other modals, such as müssen and wollen, have their own meanings and forms. This lesson checks können with a second infinitive.',
        [['modal verb', 'A verb adding ability, necessity, permission or a related meaning.'], ['infinitive', 'The dictionary verb form, such as lernen.']]
      ),
      reading: R('A place to learn', 'Ich kann hier lernen. Du kannst auch hier lernen. Wir können Deutsch lernen. Nico kann heute nicht lernen.', 'I can study here. You can study here too. We can learn German. Nico cannot study today.', [
        Q('Where can the speaker study?', ['At home specifically', 'Here', 'Only at school'], 1, 'Hier names the available place without specifying it.'),
        Q('Who cannot study today?', ['The speaker', 'The person addressed', 'Nico'], 2, 'Nico kann heute nicht lernen gives the exception.'),
        Q('What can the group learn?', ['German', 'Driving', 'Spelling only'], 0, 'Wir können Deutsch lernen gives their possible activity.')
      ], [['auch', 'also'], ['nicht', 'not']]),
      writing: W('Write two sentences meaning “You can learn German. We can study here.” Address one person informally. Put a form of können near the beginning and keep the action verb lernen at the end of each statement.', ['Du kannst Deutsch lernen. Wir können hier lernen.', 'Du kannst Deutsch lernen. Wir koennen hier lernen.'], '^du kannst deutsch lernen wir k(ö|oe)nnen hier lernen$', 'Use kannst and können, with lernen at each sentence end.', 'Du takes kannst; wir takes können.', 'The modal agrees with its subject; lernen stays in the infinitive at the end. Only these two requested modal statements are checked.')
    },
    'separable': {
      theory: T(
        'Some German verbs have a beginning that separates in ordinary main clauses. This beginning is called a separable prefix. The dictionary writes the whole verb together, but a present-tense statement places the prefix at the end of its clause.',
        'Aufstehen means to get up. With ich, write Ich stehe … auf. With du, write Du stehst … auf. A time phrase can go between the verb and auf.',
        ['Recognize the whole dictionary verb and its prefix.', 'Conjugate the main verb part for the subject.', 'Put the separated prefix at the end of this main clause.'],
        'Not every beginning is separable. Also, with a modal, the infinitive stays together: aufstehen. This task practises the split main-clause form rather than all prefix patterns.',
        [['prefix', 'A part attached at the beginning of a word.'], ['separable verb', 'A verb whose prefix moves away in certain sentence patterns.']]
      ),
      reading: R('Getting up to study', 'Ich stehe um acht auf. Nico steht um neun auf. Wir haben heute Zeit. Wir lernen Deutsch. Du stehst auch um acht auf.', 'I get up at eight. Nico gets up at nine. We have time today. We study German. You also get up at eight.', [
        Q('When does the speaker get up?', ['At seven', 'At nine', 'At eight'], 2, 'Um acht means at eight.'),
        Q('Who gets up at nine?', ['Nico', 'The speaker', 'The person addressed'], 0, 'Nico steht um neun auf gives his time.'),
        Q('Who shares the speaker’s getting-up time?', ['Only Nico', 'The person addressed', 'Nobody mentioned'], 1, 'Du stehst auch um acht auf gives the same time.')
      ], [['steht … auf', 'gets up'], ['um', 'at, with a clock time'], ['neun', 'nine'], ['auch', 'also']]),
      writing: W('Write two statements meaning “You get up at eight. We get up at eight.” Address one person informally in the first sentence. Split aufstehen correctly and keep each time phrase inside the verb frame.', ['Du stehst um acht auf. Wir stehen um acht auf.'], '^du stehst um acht auf wir stehen um acht auf$', 'Put auf at the end of each get-up statement.', 'Use stehst with du and stehen with wir.', 'Aufstehen splits into the conjugated verb plus final auf in these main clauses. The check covers those forms and the requested time.')
    },
    'coordinating': {
      theory: T(
        'A conjunction joins ideas. Coordinating conjunctions connect parts with the same grammatical status, including two complete main clauses. Each clause keeps its own ordinary verb position; the joining word does not become the first element inside the second clause.',
        'Und adds, aber contrasts, oder offers a choice and denn gives a reason. When joining complete statements with these words, keep the second clause’s conjugated verb in position two.',
        ['Write the first complete idea.', 'Choose a conjunction that expresses the intended connection.', 'Build the next clause with its normal subject and verb order.'],
        'Denn and weil both introduce reasons, but they use different word order. Weil sends the conjugated verb to the end of its clause. Commas are used before aber and denn here.',
        [['conjunction', 'A connecting word joining words, phrases or clauses.'], ['coordinating', 'Joining parts of equal grammatical status.']]
      ),
      reading: R('Tired but studying', 'Ich bin müde, aber ich lerne Deutsch. Nico lernt auch, denn er hat Zeit. Wir lernen Deutsch und du lernst Englisch.', 'I am tired, but I am studying German. Nico studies too because he has time. We are learning German and you are learning English.', [
        Q('Does being tired stop the speaker studying?', ['Yes', 'No', 'The speaker only sleeps'], 1, 'Aber connects being tired with continuing to study.'),
        Q('Why can Nico study?', ['He has a new book', 'He is at school', 'He has time'], 2, 'Denn er hat Zeit gives the reason.'),
        Q('What language does the person addressed study?', ['English', 'German', 'French'], 0, 'Du lernst Englisch supplies the detail.')
      ], [['auch', 'also'], ['Englisch', 'English'], ['er hat', 'he has']]),
      writing: W('Write two connected statements meaning “I am tired, but I am learning. I am learning because I have time.” Use aber for the contrast and denn for the reason, keeping normal statement order after both.', ['Ich bin müde, aber ich lerne. Ich lerne, denn ich habe Zeit.', 'Ich bin muede, aber ich lerne. Ich lerne, denn ich habe Zeit.'], '^ich bin m(ü|ue)de aber ich lerne ich lerne denn ich habe zeit$', 'Keep normal verb order after aber and denn.', 'After each connector, use ich followed by its conjugated verb.', 'Aber marks contrast; denn supplies a reason without moving habe to the end. This checks the requested connections and clause patterns.')
    },
    'dative': {
      theory: T(
        'The dative is a grammatical case used for several jobs. One common job is marking the recipient: the person who receives something. In a giving sentence, distinguish the giver, the thing given and the receiver before choosing articles.',
        'For a singular dative recipient, der becomes dem, die becomes der and das becomes dem. The thing being given usually stays a separate accusative object.',
        ['Find the thing that changes hands.', 'Ask who receives that thing.', 'Use the receiver’s dative article before the noun.'],
        'Dative does not always mean a recipient; some verbs and prepositions require it for other reasons. Dative plural uses den and usually adds -n to the noun if possible.',
        [['dative', 'A case used for recipients and after certain verbs or prepositions.'], ['recipient', 'The person or thing receiving something.']]
      ),
      reading: R('Passing on a book', 'Ich gebe dem Mann ein Buch. Der Mann gibt der Frau das Buch. Die Frau gibt dem Kind das Buch.', 'I give the man a book. The man gives the woman the book. The woman gives the child the book.', [
        Q('Who receives the book first?', ['The child', 'The woman', 'The man'], 2, 'Dem Mann is the first recipient.'),
        Q('Who gives the book to the woman?', ['The man', 'The child', 'The speaker directly'], 0, 'Der Mann gives the book in the second sentence.'),
        Q('Who receives it last?', ['The speaker', 'The child', 'The man'], 1, 'Dem Kind is the final recipient.')
      ], [['gibt', 'gives']]),
      writing: W('Write two giving statements meaning “I give the man a book. I give the woman a book.” Keep the receiver before the thing given. Choose the dative article for each receiver and keep ein Buch unchanged.', ['Ich gebe dem Mann ein Buch. Ich gebe der Frau ein Buch.'], '^ich gebe dem mann ein buch ich gebe der frau ein buch$', 'Use dem Mann and der Frau for the two recipients.', 'Masculine der becomes dem; feminine die becomes der.', 'Both receivers are dative; ein Buch is the thing given. This checks the recipient articles in the two specified giving statements.')
    },
    'dative-verbs': {
      theory: T(
        'Some verbs require a dative object because that is part of the verb’s grammar. You cannot reliably predict the case from an English translation. Learn each of these German verbs together with its required case and a short reusable example.',
        'Helfen means help and danken means thank. Both take dative for the person helped or thanked. Use dem Mann, der Frau, mir for me and dir for informal you.',
        ['Identify whether the verb requires dative.', 'Choose a dative noun phrase or pronoun for the person.', 'Conjugate the verb for the subject, not for its object.'],
        'English “help me” does not mean German should use mich. German helfen requires mir. Its present form also changes its vowel with du: du hilfst.',
        [['dative verb', 'A verb that requires a dative object in a particular use.'], ['required case', 'The grammatical form a verb or preposition selects.']]
      ),
      reading: R('Helping each other', 'Ich helfe dem Mann. Nico hilft der Frau. Du hilfst mir. Ich danke dir. Wir haben heute Zeit.', 'I help the man. Nico helps the woman. You help me. I thank you. We have time today.', [
        Q('Who does Nico help?', ['The man', 'The woman', 'The speaker'], 1, 'Nico hilft der Frau names the person helped.'),
        Q('Who helps the speaker?', ['Only Nico', 'The man', 'The person addressed'], 2, 'Du hilfst mir means you help me.'),
        Q('Whom does the speaker thank?', ['The person addressed', 'The woman explicitly', 'Nobody'], 0, 'Ich danke dir means I thank you.')
      ], [['hilft', 'helps'], ['du hilfst', 'you help'], ['mir', 'me, in the dative']]),
      writing: W('Write a two-sentence exchange from your point of view: “I help you. You help me.” Address one person informally. Use the dative pronouns and remember that the du form of helfen changes its vowel.', ['Ich helfe dir. Du hilfst mir.'], '^ich helfe dir du hilfst mir$', 'Use dir and mir after helfen, with du hilfst.', 'After helfen, me is mir and you is dir.', 'Helfen selects dative, so dir and mir are needed. Du takes hilfst. This checks those taught forms in the requested exchange.')
    },
    'two-objects': {
      theory: T(
        'A verb such as geben can connect a subject with two different objects. One object names what is given; the other names who receives it. Giving each object its correct case keeps these roles clear even when German offers different possible word orders.',
        'Use a dative receiver and an accusative thing with geben. In the beginner pattern here, place a noun receiver before a noun thing: dem Kind das Buch.',
        ['Identify the giver, receiver and thing separately.', 'Mark the receiver dative and the thing accusative.', 'Build the sentence using the receiver-first pattern practised here.'],
        'Object order becomes more flexible when emphasis or pronouns change. With two unstressed object pronouns, accusative commonly comes before dative. This task uses one receiver pronoun and a noun thing.',
        [['indirect object', 'Often the dative receiver in a two-object giving pattern.'], ['direct object', 'Here, the accusative thing being given.']]
      ),
      reading: R('Three recipients', 'Ich gebe dem Kind das Buch. Nico gibt dem Mann eine Tasche. Du gibst mir ein Buch. Ich gebe dir meine Tasche.', 'I give the child the book. Nico gives the man a bag. You give me a book. I give you my bag.', [
        Q('What does the child receive?', ['A bag', 'A car', 'The book'], 2, 'Das Buch is the thing given to dem Kind.'),
        Q('Who receives a bag from Nico?', ['The man', 'The child', 'The speaker'], 0, 'Dem Mann identifies Nico’s recipient.'),
        Q('What does the speaker give the person addressed?', ['A new book', 'The speaker’s bag', 'The child’s book'], 1, 'Meine Tasche means my bag.')
      ], [['gibt', 'gives'], ['du gibst', 'you give'], ['mir', 'me, in the dative'], ['eine Tasche', 'a bag'], ['meine Tasche', 'my bag']]),
      writing: W('Write two sentences meaning “I give you the book. I give the child the book.” Address one person informally. Use a dative pronoun in the first sentence and a dative noun phrase in the second.', ['Ich gebe dir das Buch. Ich gebe dem Kind das Buch.'], '^ich gebe dir das buch ich gebe dem kind das buch$', 'Distinguish each dative receiver from das Buch.', 'You as receiver is dir; the child as receiver is dem Kind.', 'Dir and dem Kind identify receivers; das Buch is the accusative thing given. This checks the two requested receiver-first giving sentences.')
    },
    'acc-prepositions': {
      theory: T(
        'A preposition is a small word that connects a noun phrase or pronoun to another idea, such as for someone or without something. Some German prepositions always require accusative, even when there is no direct object of a verb involved.',
        'Durch, für, gegen, ohne and um take accusative in their standard prepositional uses. After für, write für den Mann, für die Frau, für mich or für dich.',
        ['Find the preposition before the person or thing.', 'Recall that this preposition selects accusative.', 'Choose the accusative article or pronoun that follows it.'],
        'Case after a preposition comes from the preposition, not from the subject or verb. Für mich uses mich even though the English word “for” might suggest a recipient.',
        [['preposition', 'A connecting word such as for, with, in or without.'], ['prepositional phrase', 'A preposition together with its following noun phrase or pronoun.']]
      ),
      reading: R('Choosing presents', 'Das Buch ist für den Mann. Die Tasche ist für die Frau. Das ist für dich. Das Buch ist nicht für mich.', 'The book is for the man. The bag is for the woman. That is for you. The book is not for me.', [
        Q('Who is the book for?', ['The woman', 'The man', 'The speaker'], 1, 'Für den Mann identifies its intended recipient.'),
        Q('What is for the woman?', ['A car', 'A house', 'The bag'], 2, 'Die Tasche ist für die Frau names her item.'),
        Q('Is the book for the speaker?', ['No', 'Yes', 'Only today'], 0, 'Nicht für mich explicitly says it is not for me.')
      ], [['Tasche', 'bag'], ['nicht', 'not']]),
      writing: W('Write two sentences meaning “That is for the woman. That is for me.” Use für in both sentences, once followed by a noun phrase and once by a pronoun. Keep the two intended recipients distinct.', ['Das ist für die Frau. Das ist für mich.', 'Das ist fuer die Frau. Das ist fuer mich.'], '^das ist f(ü|ue)r die frau das ist f(ü|ue)r mich$', 'Use accusative after für in both statements.', 'The feminine article stays die; the pronoun for me is mich.', 'Für always selects accusative in this use. Die Frau looks unchanged, while mich visibly differs from ich. These requested phrases are checked.')
    },
    'dat-prepositions': {
      theory: T(
        'Some prepositions require dative every time they are used in their standard prepositional role. This requirement applies even if nobody receives anything. Learn each preposition with its case, so you can choose the following article or pronoun before building the full sentence.',
        'Aus, außer, bei, mit, nach, seit, von and zu take dative. Mit means with and also describes transport: mit dem Bus or mit dem Auto.',
        ['Find the preposition introducing the phrase.', 'Recognize that it belongs to the dative group.', 'Use the dative article or pronoun after it.'],
        'Do not use accusative just because a travel sentence involves movement. Mit always selects dative here. Some preposition–article pairs contract, such as zu dem becoming zum.',
        [['dative preposition', 'A preposition requiring the dative form after it.'], ['contraction', 'Two words combined into one form, such as zu dem → zum.']]
      ),
      reading: R('Travelling and studying', 'Ich fahre mit dem Bus. Nico fährt mit dem Auto. Heute lerne ich mit dir. Du lernst mit mir. Wir lernen Deutsch.', 'I travel by bus. Nico travels by car. Today I study with you. You study with me. We are learning German.', [
        Q('How does the speaker travel?', ['By car', 'On foot', 'By bus'], 2, 'Mit dem Bus means by bus.'),
        Q('How does Nico travel?', ['By car', 'By train', 'By bus'], 0, 'Mit dem Auto means by car.'),
        Q('Who studies with the speaker?', ['Only Nico explicitly', 'The person addressed', 'Nobody'], 1, 'Mit dir means with you.')
      ], [['fahre', 'travel / go by vehicle'], ['fährt', 'travels / goes by vehicle']]),
      writing: W('Write two statements meaning “I travel by car. I study with you.” Address one person informally. Use mit for both transport and company, and choose the dative forms that must follow this preposition.', ['Ich fahre mit dem Auto. Ich lerne mit dir.'], '^ich fahre mit dem auto ich lerne mit dir$', 'Use dem Auto and dir after mit.', 'The car is das Auto; informal you becomes dir after mit.', 'Mit requires dative, giving dem Auto and dir. This checks the two requested phrases, not every possible use of travel verbs.')
    },
    'two-way': {
      theory: T(
        'A two-way preposition can take either dative or accusative. In spatial descriptions, the choice reflects the relationship you mean: an existing location or a destination that changes that relationship. Do not reduce the choice to whether a person happens to be moving.',
        'With in, use dative for where something is: in dem Park becomes im Park. Use accusative for a destination: in den Park means into the park.',
        ['Ask whether the phrase describes where or where to.', 'Choose dative for location or accusative for the destination.', 'Apply the article ending, using im for in dem when appropriate.'],
        'Walking around inside the park still describes a location and uses dative. Other two-way prepositions are an, auf, hinter, neben, über, unter, vor and zwischen.',
        [['two-way preposition', 'A preposition whose spatial use can select dative or accusative.'], ['destination', 'A place something moves to or is placed into.']]
      ),
      reading: R('Into the park, then inside it', 'Ich gehe in den Park. Nico ist schon im Park. Ich gehe im Park spazieren. Wir sind jetzt im Park.', 'I go into the park. Nico is already in the park. I go for a walk in the park. We are now in the park.', [
        Q('Where does the speaker go first?', ['Into the park', 'Out of the park', 'To school'], 0, 'In den Park gives the destination.'),
        Q('Where is Nico when the speaker sets off?', ['At home', 'On a bus', 'Already in the park'], 2, 'Schon im Park means already in the park.'),
        Q('Where does the walk take place?', ['Outside the park', 'Inside the park', 'In a different city'], 1, 'Im Park describes the location of the walk.')
      ], [['schon', 'already'], ['spazieren gehen', 'to go for a walk'], ['jetzt', 'now']]),
      writing: W('Write two statements meaning “I go into the park. I am in the park.” The first names a destination; the second states a location. Choose the appropriate case after in and use the contraction for the location.', ['Ich gehe in den Park. Ich bin im Park.'], '^ich gehe in den park ich bin im park$', 'Contrast the destination in den Park with the location im Park.', 'The park is der Park. In dem contracts to im.', 'In den Park is the destination; im Park is the current location. This checks the intended spatial relationship rather than movement alone.')
    },
    'perfekt': {
      theory: T(
        'The Perfekt is a common way to talk about completed events, especially in conversation. It has two verb parts: a present-tense helper, called an auxiliary, and a past participle. Together they form the past meaning; the helper alone does not carry it.',
        'Put haben or sein in the ordinary conjugated-verb position and the participle at the end. Learn lernen → gelernt with haben and gehen → gegangen with sein.',
        ['Choose the past event you want to describe.', 'Use the verb’s learned helper in the correct subject form.', 'Place its past participle at the end of the main clause.'],
        'Do not choose sein simply for every moving activity. Helper choice belongs to the verb’s meaning and use. Participle formation has exceptions; learn new verbs with their past forms.',
        [['auxiliary', 'A helper verb used to build a tense.'], ['past participle', 'A verb form such as gelernt or gegangen used in the Perfekt.']]
      ),
      reading: R('After studying', 'Ich habe Deutsch gelernt. Nico hat auch Deutsch gelernt. Danach bin ich nach Hause gegangen. Wir haben heute viel gelernt.', 'I studied German. Nico studied German too. After that I went home. We learned a lot today.', [
        Q('What did the speaker study?', ['English', 'German', 'Maths'], 1, 'Deutsch is what the speaker learned.'),
        Q('Where did the speaker go afterwards?', ['To school', 'To the park', 'Home'], 2, 'Nach Hause gegangen means went home.'),
        Q('Did Nico also study German?', ['Yes', 'No', 'He only travelled'], 0, 'Auch means also in Nico’s sentence.')
      ], [['hat', 'has, here a past-tense helper'], ['auch', 'also'], ['danach', 'after that'], ['viel', 'a lot']]),
      writing: W('Write a two-sentence past update meaning “We studied German. I went home.” Use the Perfekt for both events, choosing the learned helper for each verb and placing each participle at the end.', ['Wir haben Deutsch gelernt. Ich bin nach Hause gegangen.'], '^wir haben deutsch gelernt ich bin nach hause gegangen$', 'Use haben … gelernt and bin … gegangen.', 'Lernen uses haben here; gehen uses sein.', 'Haben plus gelernt reports the learning event; bin plus gegangen reports going home. This checks those two taught Perfekt patterns.')
    },
    'praeteritum': {
      theory: T(
        'The Präteritum is a simple past tense: the main past meaning is carried by one conjugated verb form instead of a helper plus participle. It is frequent in written narratives, but some forms are also very common in everyday conversation.',
        'For ich, learn sein → war and haben → hatte. Ich war müde means I was tired; ich hatte Zeit means I had time. Keep ordinary main-clause verb position.',
        ['Decide whether the past meaning is was or had.', 'Choose war or hatte for an ich statement.', 'Place the past verb after the first sentence element.'],
        'Perfekt is not exclusively spoken, and Präteritum is not exclusively written. War and hatte are useful conversational forms. Other subjects and verbs need their own past-tense forms.',
        [['Präteritum', 'A simple past tense often used in written narratives.'], ['simple tense', 'A tense expressed without a separate tense-building helper verb.']]
      ),
      reading: R('Yesterday and today', 'Gestern war ich müde. Ich hatte Zeit, aber ich habe nicht gelernt. Heute bin ich hier. Heute lerne ich Deutsch.', 'Yesterday I was tired. I had time, but I did not study. Today I am here. Today I am learning German.', [
        Q('How did the speaker feel yesterday?', ['Tired', 'Happy explicitly', 'Hungry explicitly'], 0, 'Gestern war ich müde describes yesterday’s state.'),
        Q('Did the speaker study yesterday?', ['Yes, all day', 'Yes, briefly', 'No'], 2, 'Ich habe nicht gelernt says the learning did not happen.'),
        Q('What is happening today?', ['The speaker goes home', 'The speaker studies German', 'The speaker has no time'], 1, 'Heute lerne ich Deutsch gives today’s action.')
      ], [['gestern', 'yesterday'], ['nicht gelernt', 'did not study'], ['aber', 'but']]),
      writing: W('Write two past statements meaning “Yesterday I was here. Yesterday I had time.” Start both with gestern. Use the simple past forms of sein and haben rather than a helper plus participle.', ['Gestern war ich hier. Gestern hatte ich Zeit.'], '^gestern war ich hier gestern hatte ich zeit$', 'Use war and hatte after the opening time word.', 'After gestern, place the past verb before ich.', 'War and hatte are simple past forms. Both statements keep the conjugated verb second after gestern. These specific past statements are checked.')
    },
    'subordinate': {
      theory: T(
        'A subordinate clause adds an idea that depends on another clause, such as a reason or the content of a thought. A subordinating conjunction introduces it. Unlike an ordinary main clause, it places its conjugated verb at the end.',
        'Weil means because; dass introduces a that-clause. After either word, put the subject and other information before the final conjugated verb. Separate the clauses with a comma.',
        ['Write the main idea as an ordinary statement.', 'Add weil for a reason or dass for reported content.', 'Build the dependent clause with its conjugated verb last.'],
        'Denn also gives a reason but keeps main-clause order. If a subordinate clause comes first, the main clause’s conjugated verb follows the comma. This task starts with the main clause.',
        [['subordinate clause', 'A dependent clause that adds information to another clause.'], ['subordinating conjunction', 'A linking word introducing a dependent clause, such as weil.']]
      ),
      reading: R('Why we study', 'Ich lerne Deutsch, weil ich Zeit habe. Nico lernt, weil er Deutsch lernen will. Ich weiß, dass du hier bist.', 'I am studying German because I have time. Nico studies because he wants to learn German. I know that you are here.', [
        Q('Why is the speaker studying?', ['Because Nico asks', 'Because the speaker has time', 'Because a book is new'], 1, 'Weil ich Zeit habe supplies the reason.'),
        Q('What does Nico want?', ['To go home', 'To buy a book', 'To learn German'], 2, 'Deutsch lernen will means wants to learn German.'),
        Q('What does the speaker know?', ['That the person addressed is here', 'That Nico is tired', 'That everyone is at home'], 0, 'Dass du hier bist states what the speaker knows.')
      ], [['er … will', 'he wants to …'], ['ich weiß', 'I know']]),
      writing: W('Write two sentences meaning “I am learning because I have time. I know that you are here.” Use weil in the first and dass in the second. Put each dependent clause’s conjugated verb at the end.', ['Ich lerne, weil ich Zeit habe. Ich weiß, dass du hier bist.', 'Ich lerne, weil ich Zeit habe. Ich weiss, dass du hier bist.'], '^ich lerne weil ich zeit habe ich wei(ß|ss) dass du hier bist$', 'Put habe and bist at the ends of their dependent clauses.', 'The reason ends with habe; the known fact ends with bist.', 'Weil and dass introduce verb-final clauses. This checks the specified reason and known fact; the checker does not judge unrestricted subordinate writing.')
    },
    'relative-clauses': {
      theory: T(
        'A relative clause adds information about a noun already mentioned. A relative pronoun links the extra clause back to that noun. German marks off the relative clause with commas and puts its conjugated verb at the end.',
        'For a relative pronoun acting as the subject, use der with a masculine noun, die with a feminine noun and das with a neuter noun. Finish the relative clause with its verb.',
        ['Find the noun you want to describe more precisely.', 'Choose the relative pronoun for its gender and its clause role.', 'Write the added information with a final conjugated verb.'],
        'The relative pronoun’s case comes from its job inside the relative clause, not from the noun’s job outside it. These introductory tasks only use nominative subject relative pronouns.',
        [['relative clause', 'A clause giving extra information about a noun.'], ['relative pronoun', 'A word linking that clause to its noun, such as der, die or das.']]
      ),
      reading: R('People at the course', 'Das ist die Frau, die hier wohnt. Das ist der Mann, der Deutsch lernt. Das ist das Kind, das auch hier wohnt.', 'That is the woman who lives here. That is the man who is learning German. That is the child who also lives here.', [
        Q('Who is explicitly learning German?', ['The woman', 'The child', 'The man'], 2, 'Der Mann is described by der Deutsch lernt.'),
        Q('Who lives here?', ['The woman and the child', 'Only the man', 'All three explicitly'], 0, 'The woman and child each have a lives-here clause.'),
        Q('What detail is given about the child?', ['The child is tired', 'The child lives here too', 'The child has a book'], 1, 'Das auch hier wohnt gives that detail.')
      ], [['wohnt', 'lives'], ['auch', 'also']]),
      writing: W('Write two introductions meaning “That is the woman who lives here. That is the child who is learning German.” Choose a subject relative pronoun for each noun and place the relative-clause verb last.', ['Das ist die Frau, die hier wohnt. Das ist das Kind, das Deutsch lernt.'], '^das ist die frau die hier wohnt das ist das kind das deutsch lernt$', 'Use die for Frau and das for Kind in verb-final relative clauses.', 'Repeat die after Frau and das after Kind to begin their extra clauses.', 'Die and das are nominative relative subjects here; wohnt and lernt end their clauses. These specific introductory relative patterns are checked.')
    },
    'adjective-endings': {
      theory: T(
        'An adjective describes a noun, such as small or new. German usually adds an ending when an adjective stands directly before its noun. The ending depends on the article pattern, the noun’s gender and number, and its case.',
        'In the nominative singular, learn der kleine Tisch and das kleine Buch after definite articles. With indefinite ein and a masculine noun, use ein kleiner Tisch. After sein, write Der Tisch ist klein.',
        ['Check whether the adjective is directly before a noun.', 'Identify the article pattern and the noun’s case and gender.', 'Apply the particular ending learned for that combination.'],
        'Do not attach -e to every adjective automatically. Plurals and other cases need more endings. This introduction contrasts a few nominative patterns with the uninflected adjective after sein.',
        [['adjective', 'A describing word such as klein, meaning small.'], ['declension', 'Changing a word’s ending to match grammatical information.']]
      ),
      reading: R('A small study space', 'Das ist ein kleiner Tisch. Der kleine Tisch ist hier. Auf dem Tisch liegt das kleine Buch. Das Buch ist klein.', 'That is a small table. The small table is here. The small book is lying on the table. The book is small.', [
        Q('What is introduced first?', ['A small book', 'A small table', 'A large bag'], 1, 'Ein kleiner Tisch is a small table.'),
        Q('Where is the book?', ['In a bag', 'Under a chair', 'On the table'], 2, 'Auf dem Tisch gives its location.'),
        Q('How is the book described?', ['Small', 'Old', 'Expensive'], 0, 'Das kleine Buch and Das Buch ist klein both describe it as small.')
      ], [['auf dem Tisch', 'on the table'], ['liegt', 'is lying / is located']]),
      writing: W('Write two sentences meaning “That is a small table. The table is small.” Use an indefinite noun phrase in the first sentence. In the second, put the describing word after ist and choose its form accordingly.', ['Das ist ein kleiner Tisch. Der Tisch ist klein.'], '^das ist ein kleiner tisch der tisch ist klein$', 'Contrast ein kleiner Tisch with ist klein.', 'Before Tisch after ein, use kleiner. After ist, use klein.', 'Kleiner carries the masculine nominative ending before the noun; klein after sein has no ending. This checks just these two introductory adjective patterns.')
    },
    'genitive': {
      theory: T(
        'The genitive is a case often used to show a connection such as possession. A genitive noun phrase can identify whose book or bag we mean. It usually follows the possessed noun in the introductory pattern, like English “the book of the woman”.',
        'For singular possessors, use des with masculine and neuter nouns and der with feminine nouns. Masculine and neuter nouns usually add -(e)s: des Mannes, des Kindes. Feminine Frau stays Frau.',
        ['Name the thing that is possessed first.', 'Identify the owner’s noun gender.', 'Add the owner in the genitive, including any noun ending.'],
        'The owner’s gender controls des or der, not the possessed thing’s gender. Other genitive uses exist. Von plus dative is also common, especially in conversation, but has a different structure.',
        [['genitive', 'A case often expressing possession or another noun-to-noun relationship.'], ['possessor', 'The owner or associated person identified by the phrase.']]
      ),
      reading: R('Finding the owner', 'Das ist das Buch des Mannes. Das Buch der Frau ist hier. Die Tasche der Frau ist klein. Das Buch des Kindes ist neu.', 'That is the man’s book. The woman’s book is here. The woman’s bag is small. The child’s book is new.', [
        Q('Whose book is introduced first?', ['The child’s', 'The woman’s', 'The man’s'], 2, 'Des Mannes identifies the man as its owner.'),
        Q('What is said about the woman’s bag?', ['It is small', 'It is new', 'It is missing'], 0, 'Die Tasche der Frau ist klein describes her bag.'),
        Q('Whose book is new?', ['The man’s', 'The child’s', 'The woman’s'], 1, 'Des Kindes identifies the owner of the new book.')
      ], [['neu', 'new']]),
      writing: W('Write two sentences meaning “That is the child’s book. That is the woman’s bag.” Put the possessed thing first and follow it with the owner in the genitive. Include the noun ending where required.', ['Das ist das Buch des Kindes. Das ist die Tasche der Frau.'], '^das ist das buch des kindes das ist die tasche der frau$', 'Use des Kindes and der Frau after the possessed things.', 'Kind is neuter and adds -es here; Frau is feminine and stays unchanged.', 'Des Kindes marks the neuter owner; der Frau marks the feminine owner. This checks these two possession phrases, not all genitive constructions.')
    }
  };
  window.GERMAN_SKILLS = { topics, lessons };
}());

