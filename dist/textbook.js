/* Original teaching and tasks, aligned with the supplied Netzwerk neu A1 PDF. */
(()=>{
 const course=window.GERMAN_COURSE;
 const X=(de,en,why)=>({de,en,why});
 const records=[
 {
  title:'Guten Tag!',pages:[8,17],goal:'Introduce yourself, spell your name and give contact details.',related:['hello','your-name','alphabet','umlauts','sound-pairs','numbers','pronouns','sein','present','questions'],
  focus:'Names, countries, languages, numbers 1–20, W-questions and personal pronouns.',
  passes:[['Say where you come from.','Ich komme aus means “I come from.” Aus introduces your country. The verb changes with the person: ich komme, du kommst. Most country names here have no article.',X('Ich komme aus Indien.','I come from India.','Ich is I; komme is the I-form; aus Indien gives the country.'),X('Kommst du aus Deutschland?','Do you come from Germany?','A yes/no question starts with the verb. Du uses kommst.')],['Say where you live.','Ich wohne in means “I live in.” Add the city. Wo asks where; woher asks where someone comes from. They ask different questions.',X('Ich wohne in Mumbai.','I live in Mumbai.','In Mumbai tells us where the person lives now.'),X('Wo wohnst du?','Where do you live?','Wo asks for a location; wohnst matches du.')]],
  drill:['Which question asks for someone’s country of origin?',['Wo wohnst du?','Woher kommst du?','Wie heißt du?'],1,'Woher asks where someone comes from.'],
  build:['Say you come from India.',['Indien.','aus','komme','Ich'],['Ich','komme','aus','Indien.']],
  gap:['Complete: Wo ___ du? (live)',['wohnst'],'Use the du-form of wohnen.'],
  blind:['Say “I live in Delhi.”',['Ich wohne in Delhi.']],
  reading:['A course registration','Hallo! Ich heiße Mira. Ich komme aus Indien und wohne in Berlin. Ich spreche Englisch und lerne Deutsch. Meine Telefonnummer ist 0176 12345678.','Hello! My name is Mira. I come from India and live in Berlin. I speak English and am learning German. My phone number is 0176 12345678.',[['Where does Mira live?',['Delhi','Berlin','Mumbai'],1],['Which language is she learning?',['German','English','French'],0],['Which number is given?',['A room number','A price','A phone number'],2]]],
  writing:['As Mira, write exactly these three details: your name, that you come from India, and that you live in Berlin.','Ich heiße Mira. Ich komme aus Indien. Ich wohne in Berlin.'],
  open:'Write a course profile: your name, country, city, languages and a made-up phone number. Use 12–25 words. Then spell your name aloud.',min:12,
  bookTask:'Read the introductions and contact forms on pp. 8–17. Complete the written tasks on names, countries, spelling and numbers. Write a fresh profile after closing the PDF.',
  speaking:['Introduce yourself without reading for 30 seconds.','Spell your first and last name. Say a made-up phone number digit by digit.','Ask and answer: Wie heißt du? Woher kommst du? Wo wohnst du?'],
  terms:[['personal pronoun','A short word naming a person, such as ich (I) or du (you).'],['conjugate','Change a verb so it matches its subject.']],
  glossary:[['wohnen','to live'],['aus','from'],['lernen','to learn'],['die Telefonnummer','phone number']]
 },
 {
  title:'Freunde, Kollegen und ich',pages:[18,37],goal:'Talk about hobbies, work and meeting a friend.',related:['haben','gender-articles','plurals','nominative','word-order'],
  focus:'Hobbies, weekdays, jobs, numbers above 20, irregular verbs, articles and plurals. Chapter 2 ends at p. 27; chapter 3 is on pp. 28–37.',
  passes:[['Say what you enjoy.','Gern after an activity means you like doing it. The verb still matches the person. Some verbs change their vowel with du and er/sie/es; learn these forms together.',X('Ich spiele gern Fußball.','I like playing football.','Spiele is the ich-form; gern tells us the activity is enjoyable.'),X('Sie liest gern.','She likes reading.','Lesen changes to liest with sie meaning she. Gern adds “likes doing it.”')],['Arrange a day.','Am goes before a weekday: am Montag. A time can begin the sentence, but the changed verb stays in second position. Treffen means meet: ich treffe, du triffst.',X('Am Montag spiele ich Fußball.','On Monday I play football.','Am Montag is one time chunk; spiele is still second.'),X('Wir treffen uns am Freitag.','We are meeting on Friday.','Wir uses treffen. Learn wir treffen uns as a useful meeting phrase.')]],
  drill:['What does gern add?',['A past event','Enjoyment of the activity','A negative'],1,'Gern means you enjoy doing the activity.'],
  build:['Say you like playing football.',['Fußball.','gern','Ich','spiele'],['Ich','spiele','gern','Fußball.']],
  gap:['Complete: Sie ___ gern. (reads)',['liest'],'Lesen changes its vowel with sie.'],
  blind:['Say “We are meeting on Monday.”',['Wir treffen uns am Montag.']],
  reading:['A new colleague','Ben ist Koch. Er arbeitet am Dienstag und am Mittwoch. Am Freitag hat er frei. Er spielt gern Fußball. Am Freitag trifft er Mira im Park.','Ben is a cook. He works on Tuesday and Wednesday. He is off on Friday. He likes playing football. On Friday he meets Mira in the park.',[['What is Ben’s job?',['Teacher','Cook','Doctor'],1],['When is Ben off work?',['Friday','Tuesday','Wednesday'],0],['Who does he meet?',['His boss','Nobody','Mira'],2]]],
  writing:['Write two sentences: you like playing football; you are meeting on Friday. Use Ich for the first and Wir treffen uns for the second.','Ich spiele gern Fußball. Wir treffen uns am Freitag.'],
  open:'Write a short message to a new classmate. Give your work or study subject, two hobbies, and a weekday when you can meet. Aim for 20–35 words.',min:20,
  bookTask:'Use chapter 2, pp. 18–27: read the hobby/job profiles, fill in a form and practise numbers above 20. Read prices and numbers aloud. Save chapter 3 for Day 3.',
  speaking:['Say your job or study subject and two hobbies.','Offer two weekdays for a meeting, then agree on one.','Say 21, 34, 57, 80 and 100. Check them in the book.'],
  terms:[['irregular verb','A verb whose forms do not follow the simplest pattern.'],['time chunk','A group of words giving one time detail.']],
  glossary:[['gern','enjoy doing'],['der Koch','cook'],['frei haben','to be off work'],['treffen','to meet']]
 },
 {
  title:'In Hamburg',pages:[28,37],goal:'Ask for places and understand simple directions.',related:['negatives','gender-articles'],focus:'City places, transport, directions, months and seasons; ein/kein, polite commands, adjectives after sein.',
  passes:[['Ask for a place.','Wo ist …? asks where a place is. Ist means is. Learn each place with its article. To say there is no such thing, use kein with the noun’s matching form.',X('Wo ist der Bahnhof?','Where is the station?','Der Bahnhof is masculine; der stays because it is the subject.'),X('Das ist keine Bank.','That is not a bank.','Die Bank is feminine, so “not a” is keine here.')],['Give polite directions.','A polite command uses the verb followed by Sie. Gehen Sie means go; fahren Sie means travel or drive. Geradeaus is straight ahead; links is left; rechts is right.',X('Gehen Sie geradeaus.','Go straight ahead.','Gehen comes first and Sie stays after it in a polite command.'),X('Gehen Sie nach rechts.','Go to the right.','Nach rechts tells the direction; this command still begins Gehen Sie.')]],
  drill:['Which direction is links?',['Right','Straight ahead','Left'],2,'Links is left; rechts is right.'],
  build:['Ask where the station is.',['Bahnhof?','ist','Wo','der'],['Wo','ist','der','Bahnhof?']],
  gap:['Complete the polite command: ___ Sie geradeaus.',['Gehen'],'Use gehen for go on foot.'],
  blind:['Tell someone politely “Go to the left.”',['Gehen Sie nach links.']],
  reading:['At the station','Mira ist am Bahnhof. Sie sucht die Bank. Ein Mann sagt: Gehen Sie geradeaus und dann nach links. Die Bank ist rechts. Das Hotel ist geschlossen.','Mira is at the station. She is looking for the bank. A man says: Go straight ahead and then left. The bank is on the right. The hotel is closed.',[['What is Mira looking for?',['A bank','A hotel','A school'],0],['After going straight, which way should she go?',['Right','Left','Back'],1],['What is closed?',['The station','The bank','The hotel'],2]]],
  writing:['Give two polite directions: go straight ahead, then go to the right. Use two sentences beginning Gehen Sie.','Gehen Sie geradeaus. Gehen Sie nach rechts.'],
  open:'Write directions from a station to a café: greet the visitor, name the place, and give two directions. Then say one place that is closed. Aim for 20–35 words.',min:20,
  bookTask:'Read pp. 28–37: match places and transport, follow a map and write directions. Use the seasons/months reference in the book. Do Plattform 1, pp. 38–43, as a first review.',
  speaking:['Ask where the station and a bank are.','Give three directions with a paper map.','Name your birthday month and the four seasons using the book.'],
  terms:[['imperative','A verb form used for a request or instruction.'],['negation','Saying no or not. Kein negates an indefinite noun.']],
  glossary:[['der Bahnhof','station'],['geradeaus','straight ahead'],['links / rechts','left / right'],['geschlossen','closed']]
 },
 {
  title:'Guten Appetit!',pages:[44,53],goal:'Buy food and order politely.',related:['accusative','umlauts'],focus:'Food, drinks, shopping, accusative objects, mögen and möchten.',
  passes:[['Order with möchte.','Ich möchte means I would like. It is a polite way to ask for something. A masculine direct object changes ein to einen. Feminine eine and neuter ein stay the same.',X('Ich möchte einen Kaffee.','I would like a coffee.','Der Kaffee is masculine; as the thing wanted it becomes einen Kaffee.'),X('Ich möchte eine Suppe.','I would like a soup.','Die Suppe is feminine; the object uses eine Suppe.')],['Ask the price.','Was kostet …? asks the price of one thing. Was kosten …? asks about several. German prices use a decimal comma. Zwei Euro fünfzig means €2.50.',X('Was kostet der Kaffee?','How much is the coffee?','One coffee uses kostet. Here der Kaffee is the subject of the price question.'),X('Die Äpfel kosten drei Euro.','The apples cost three euros.','Several apples use the plural verb kosten.')]],
  drill:['Choose “I would like a coffee.”',['Ich möchte ein Kaffee.','Ich möchte einen Kaffee.','Ich möchtest Kaffee.'],1,'A wanted masculine object takes einen.'],
  build:['Ask the price of the coffee.',['Kaffee?','kostet','der','Was'],['Was','kostet','der','Kaffee?']],
  gap:['Complete: Die Äpfel ___ drei Euro.',['kosten'],'Plural apples need the plural verb.'],
  blind:['Say politely “I would like a tea.” Der Tee is masculine.',['Ich möchte einen Tee.']],
  reading:['A café receipt','Mira bestellt einen Kaffee und eine Suppe. Der Kaffee kostet zwei Euro fünfzig. Die Suppe kostet vier Euro. Ben möchte nur Wasser. Mira bezahlt sechs Euro fünfzig.','Mira orders a coffee and a soup. The coffee costs €2.50. The soup costs €4. Ben only wants water. Mira pays €6.50.',[['What does Mira order?',['Tea and cake','Coffee and soup','Only water'],1],['What costs four euros?',['Coffee','Water','Soup'],2],['What does Ben want?',['Water','Soup','Coffee'],0]]],
  writing:['Order one coffee and one soup, using two sentences with Ich möchte.','Ich möchte einen Kaffee. Ich möchte eine Suppe.'],
  open:'Write a café order and a shopping list. Include three food/drink items, a quantity or price, and a polite question. Aim for 20–35 words.',min:20,
  bookTask:'Use pp. 44–53: read menus and food lists, complete accusative tasks, plan a purchase and write an order. Practise the book’s prices and quantities aloud.',
  speaking:['Order two items and ask the price.','Say what food you like and dislike.','Role-play paying a bill. Ask: Zusammen oder getrennt? (together or separately)'],
  terms:[['direct object','The thing directly wanted, bought, seen or acted on.'],['decimal comma','A comma separating euros and cents in German prices.']],
  glossary:[['möchte','would like'],['die Suppe','soup'],['kosten','to cost'],['bezahlen','to pay']]
 },
 {
  title:'Alltag und Familie',pages:[54,63],goal:'Tell the time, describe your family and arrange an appointment.',related:['possessives','modals'],focus:'Daily routines, clock times, family, am/um/von … bis, possessives and modal verbs.',
  passes:[['Tell the time.','Um means at before a clock time. Halb neun means half an hour before nine: 8:30. Official clock time gives the hour and minutes directly.',X('Der Kurs beginnt um acht Uhr dreißig.','The course starts at 8:30.','Um introduces the time; acht Uhr dreißig is official clock time.'),X('Wir essen um halb neun.','We eat at 8:30.','Halb neun points toward the coming hour, nine. It is not 9:30.')],['Put a modal around an action.','A modal verb adds can, must or want. Change the modal for the person; leave the main action in its dictionary form at the end. Possessives such as mein mean my.',X('Ich muss heute arbeiten.','I must work today.','Muss matches ich; arbeiten stays unchanged at the end.'),X('Meine Schwester kann morgen kommen.','My sister can come tomorrow.','Meine marks a feminine family noun; kommen goes to the end after kann.')]],
  drill:['What time is halb neun?',['9:30','8:30','9:00'],1,'German half-nine means half an hour before nine.'],
  build:['Say you must work today.',['arbeiten.','muss','heute','Ich'],['Ich','muss','heute','arbeiten.']],
  gap:['Complete: Meine Schwester ___ morgen kommen. (can)',['kann'],'Use kann for one sister.'],
  blind:['Say “I must learn today.” Use lernen.',['Ich muss heute lernen.']],
  reading:['A family timetable','Mein Bruder arbeitet von neun bis fünf. Meine Schwester hat um halb neun einen Kurs. Ich kann heute nicht kommen. Morgen habe ich um zehn Uhr Zeit.','My brother works from nine to five. My sister has a course at 8:30. I cannot come today. Tomorrow I have time at ten.',[['When is the sister’s course?',['9:30','10:00','8:30'],2],['Can the speaker come today?',['No','Yes','Only at five'],0],['When is the speaker free tomorrow?',['Nine','Ten','Five'],1]]],
  writing:['Write exactly: you must work today; your sister can come tomorrow.','Ich muss heute arbeiten. Meine Schwester kann morgen kommen.'],
  open:'Write to a friend about an appointment. Say when you are busy, offer a day and time, and mention a family member. Aim for 25–40 words.',min:25,
  bookTask:'Read pp. 54–63: match official and informal times, describe family and complete modal/possessive tasks. Write an appointment message and a short apology for being late.',
  speaking:['Say 8:30 in two ways, then 9:15 and 14:45 with the book.','Describe two family members using mein/meine.','Arrange an appointment and apologise for a five-minute delay.'],
  terms:[['modal verb','A verb adding ability, necessity, wish or permission to another action.'],['infinitive','A verb’s dictionary form, such as lernen.']],
  glossary:[['halb neun','8:30'],['müssen','must / have to'],['die Schwester','sister'],['Zeit haben','to have time']]
 },
 {
  title:'Zeit mit Freunden',pages:[64,73],goal:'Write an invitation and talk about dates.',related:['separable','accusative-pronouns','acc-prepositions','praeteritum'],focus:'Dates, birthdays, leisure, invitations, restaurant payments, separable verbs, mich/dich, für and war/hatte.',
  passes:[['Give the date of an event.','Am can introduce a date. Add the ordinal ending -en in these learned phrases: am dritten Mai means on May third. Ordinals tell position: first, second, third.',X('Die Party ist am dritten Mai.','The party is on May third.','Am dritten Mai is the date chunk; Mai is capitalised.'),X('Mein Geburtstag ist am zehnten Juni.','My birthday is on June tenth.','After am, this date uses zehnten. Learn the whole phrase first.')],['Invite someone.','Einladen means invite. In a simple present sentence, its ein part moves to the end. Dich means you as the person invited; für dich means for you.',X('Ich lade dich ein.','I invite you.','Lade changes for ich; ein waits at the end; dich is the person invited.'),X('Das Geschenk ist für dich.','The present is for you.','Für takes an accusative object, so use dich rather than du.')]],
  drill:['Which phrase means “on May third”?',['am drei Mai','am dritten Mai','um dritten Mai'],1,'Use am plus the ordinal date form.'],
  build:['Say you invite a friend.',['ein.','dich','Ich','lade'],['Ich','lade','dich','ein.']],
  gap:['Complete: Das Geschenk ist für ___. (you, one friend)',['dich'],'Für takes accusative.'],
  blind:['Invite Anna: “I invite Anna.”',['Ich lade Anna ein.']],
  reading:['An invitation','Hallo Ben! Ich lade dich ein. Meine Party ist am dritten Mai um acht Uhr. Bitte bring Wasser mit. Das Essen ist für alle. Kommst du? Liebe Grüße, Mira','Hello Ben! I invite you. My party is on May third at eight. Please bring water along. The food is for everyone. Are you coming? Best wishes, Mira.',[['When is the party?',['May third','June third','May tenth'],0],['What should Ben bring?',['Cake','Water','Flowers'],1],['Who is the food for?',['Only Ben','Only Mira','Everyone'],2]]],
  writing:['Invite a friend and say the party is on May third. Use two sentences.','Ich lade dich ein. Die Party ist am dritten Mai.'],
  open:'Write an invitation with a greeting, occasion, date, time and something to bring. Add a closing. Aim for 30–45 words.',min:30,
  bookTask:'Use pp. 64–73: interpret dates, write and answer an invitation, and practise restaurant dialogues. Do Plattform 2, pp. 74–79. Revisit war/hatte and separable verbs.',
  speaking:['Say your birthday using an ordinal date.','Invite a friend and accept or decline politely.','Ask for a bill and say you had a good evening: Der Abend war schön.'],
  terms:[['ordinal','A number showing order, such as third rather than three.'],['separable verb','A verb with a part that moves to the end in a simple main clause.']],
  glossary:[['einladen','to invite'],['das Geschenk','present'],['mitbringen','to bring along'],['für alle','for everyone']]
 },
 {
  title:'Arbeitsalltag',pages:[80,89],goal:'Describe work, locations and a simple formal message.',related:['coordinating','dative','dat-prepositions'],focus:'Office routines, local prepositions with dative, mit, und/oder/aber and letter writing.',
  passes:[['Say who you work with.','Mit always takes dative. Der becomes dem; die becomes der; das becomes dem. A case is a word form connected to its job, not a different real-world thing.',X('Ich arbeite mit dem Chef.','I work with the boss.','Der Chef becomes dem Chef after mit.'),X('Ich spreche mit der Kollegin.','I speak with the colleague.','Die Kollegin becomes der Kollegin after mit.')],['Write a polite message.','Guten Tag is a useful polite opening. Mit freundlichen Grüßen is a formal closing. Between them, state your request clearly. Können Sie …? politely asks whether someone can do something.',X('Guten Tag, ich habe eine Frage.','Good day, I have a question.','The greeting is followed by a comma; ich remains lower-case after it.'),X('Können Sie am Montag kommen?','Can you come on Monday?','Können begins the question; kommen, the main action, goes to the end.')]],
  drill:['Which form follows mit for der Chef?',['den Chef','dem Chef','des Chefs'],1,'Mit requires dative; masculine der changes to dem.'],
  build:['Say you work with the boss.',['Chef.','dem','Ich','mit','arbeite'],['Ich','arbeite','mit','dem','Chef.']],
  gap:['Complete: Ich spreche mit ___ Kollegin.',['der'],'Feminine die changes to der in dative.'],
  blind:['Say “I speak with the boss.”',['Ich spreche mit dem Chef.']],
  reading:['An office message','Guten Tag, Frau Weber, ich arbeite heute im Büro. Ich habe eine Frage zum Termin. Können Sie am Montag kommen? Am Dienstag habe ich keine Zeit. Mit freundlichen Grüßen, Ben Ali','Good day, Ms Weber, I am working in the office today. I have a question about the appointment. Can you come on Monday? I have no time on Tuesday. Kind regards, Ben Ali.',[['Where is Ben today?',['At home','At the station','In the office'],2],['Which day does he propose?',['Monday','Tuesday','Wednesday'],0],['Which day is he unavailable?',['Friday','Tuesday','Monday'],1]]],
  writing:['Write two sentences: you work with the boss; you ask formally whether the reader can come on Monday.','Ich arbeite mit dem Chef. Können Sie am Montag kommen?'],
  open:'Write a formal email about an appointment: polite greeting, reason for writing, one proposed day/time, one question, closing and your name. Aim for 30–45 words.',min:30,
  bookTask:'Read pp. 80–89: understand a workday blog and letters. Write a reply using a greeting and closing. Practise locations and mit + dative in the book’s tasks.',
  speaking:['Describe where you work/study and how you get there.','Ask a colleague for help using Können Sie …?','Explain a schedule using und, oder and aber.'],
  terms:[['dative','A case required by certain prepositions and verbs; sometimes marks a recipient.'],['formal address','Polite Sie, written with a capital S.']],
  glossary:[['der Chef','boss'],['die Kollegin','female colleague'],['der Termin','appointment'],['das Büro','office']]
 },
 {
  title:'Fit und gesund',pages:[90,99],goal:'Describe a symptom and understand an instruction.',related:['modals'],focus:'Body parts, illness, appointments, imperatives and sollen/müssen/dürfen.',
  passes:[['Describe how you feel.','Ich habe can introduce a symptom: I have … Learn Kopfschmerzen as a plural word meaning headache. Mir ist schlecht means I feel sick; learn this as a fixed phrase.',X('Ich habe Kopfschmerzen.','I have a headache.','Kopfschmerzen names the problem after habe. You do not add a here.'),X('Mir ist schlecht.','I feel sick.','German uses mir (to me) in this expression; do not translate I word for word.')],['Understand a simple instruction.','A command starts with the verb. Formal Sie stays after the verb. With one friend, a du-command usually drops du; some forms change, such as nehmen → nimm.',X('Trinken Sie Wasser.','Drink water. (formal)','Trinken Sie is a polite instruction. Wasser is the thing to drink.'),X('Nimm bitte die Tablette.','Please take the tablet. (one friend)','Nimm is the special du-command of nehmen. The example teaches the language form, not medical advice.')]],
  drill:['Which sentence describes a headache?',['Ich habe Kopfschmerzen.','Ich habe Hunger.','Ich bin im Büro.'],0,'Kopfschmerzen means headache.'],
  build:['Give the polite instruction “Drink water.”',['Wasser.','Sie','Trinken'],['Trinken','Sie','Wasser.']],
  gap:['Complete the fixed phrase: ___ ist schlecht.',['Mir'],'This expression uses mir.'],
  blind:['Politely instruct someone to drink tea. Use Tee.',['Trinken Sie Tee.']],
  reading:['A phone call to a practice','Guten Tag. Ich heiße Ben Ali. Ich habe Kopfschmerzen und brauche einen Termin. Heute um zehn Uhr kann ich kommen. Meine Telefonnummer ist 0176 12345678. Vielen Dank.','Good day. My name is Ben Ali. I have a headache and need an appointment. I can come today at ten. My phone number is 0176 12345678. Thank you.',[['Why does Ben call?',['To buy a coat','For an appointment','For directions'],1],['What symptom does he name?',['A headache','A broken arm','A cough'],0],['When can he come?',['Tomorrow at ten','Today at twelve','Today at ten'],2]]],
  writing:['Write two sentences: you have a headache; you need an appointment.','Ich habe Kopfschmerzen. Ich brauche einen Termin.'],
  open:'Write a fictional appointment request: give a name, one simple symptom, an available time and a contact number. Include a greeting and thanks. Aim for 30–45 words.',min:30,
  bookTask:'Read pp. 90–99: identify body parts and understand practice dialogues. Compare du/ihr/Sie commands. Write a fictional appointment request and complete modal tasks.',
  speaking:['Name five body parts with their articles.','Role-play requesting an appointment and giving an available time.','Change a polite instruction into a du-command, using the book’s table.'],
  terms:[['fixed phrase','A useful expression learned as a whole.'],['imperative','The verb form for a request or instruction.']],
  glossary:[['die Kopfschmerzen','headache'],['brauchen','to need'],['schlecht','bad / sick'],['trinken','to drink']]
 },
 {
  title:'Meine Wohnung',pages:[100,109],goal:'Describe a home and say where things are.',related:['two-way'],focus:'Rooms, furniture, colours, housing advertisements, sein + adjective and location/destination.',
  passes:[['Describe a room.','After sein, an adjective describes the subject and has no added noun ending. Groß means big; hell means bright. A noun such as die Küche keeps its capital letter.',X('Die Küche ist hell.','The kitchen is bright.','Hell comes after ist and takes no adjective ending here.'),X('Das Zimmer ist groß.','The room is big.','Groß describes the room after ist. It does not become große in this sentence.')],['Separate location from destination.','With a two-way preposition such as in, location uses dative and a destination uses accusative. Motion alone is not the test: ask where something is versus where it is going.',X('Ich bin in der Küche.','I am in the kitchen.','Where am I? Location: die Küche becomes in der Küche.'),X('Ich gehe in die Küche.','I go into the kitchen.','Where to? The kitchen is the destination, so in die Küche uses accusative.')]],
  drill:['Which sentence describes a location?',['Ich gehe in die Küche.','Ich bin in der Küche.','Ich möchte eine Küche.'],1,'Bin describes where I am, rather than a destination.'],
  build:['Say the kitchen is bright.',['hell.','Küche','ist','Die'],['Die','Küche','ist','hell.']],
  gap:['Complete: Ich bin in ___ Küche.',['der'],'Location after in needs dative.'],
  blind:['Say “The room is bright.” Use das Zimmer.',['Das Zimmer ist hell.']],
  reading:['A room advertisement','Zimmer frei! Das Zimmer ist hell und groß. Die Küche ist klein. Das Bad ist neben der Küche. Die Wohnung kostet 600 Euro im Monat. Der Bahnhof ist nah.','Room available! The room is bright and big. The kitchen is small. The bathroom is beside the kitchen. The flat costs €600 a month. The station is near.',[['What is small?',['The room','The station','The kitchen'],2],['How much does the flat cost per month?',['€600','€60','€1600'],0],['Where is the bathroom?',['At the station','Beside the kitchen','Outside'],1]]],
  writing:['Describe the bright kitchen, then say you are in the kitchen. Use two sentences.','Die Küche ist hell. Ich bin in der Küche.'],
  open:'Reply to a room advertisement. Say who you are, describe what you need, ask about the price and suggest a viewing time. Aim for 30–45 words.',min:30,
  bookTask:'Read housing advertisements on pp. 100–109. Describe a room and write a reply. Compare in + accusative with location prepositions + dative. Do Plattform 3, pp. 110–115.',
  speaking:['Describe your room with five short sentences.','Say where three objects are using a picture.','Ask about a room’s price and an appointment to see it.'],
  terms:[['adjective','A describing word, such as bright or big.'],['two-way preposition','A preposition whose case depends on location versus destination.']],
  glossary:[['die Küche','kitchen'],['hell','bright'],['das Bad','bathroom'],['im Monat','per month']]
 },
 {
  title:'Studium und Beruf',pages:[116,125],goal:'Talk about a day in the past.',related:['perfekt','present'],focus:'Study, jobs, daily activities, phone calls; Perfekt with haben/sein and participles.',
  passes:[['Build Perfekt with haben.','Perfekt often describes past events in conversation. Change haben for the subject and put the past participle at the end. Regular participles often use ge- plus a stem plus -t; verbs ending -ieren use -iert without ge-.',X('Ich habe gestern gelernt.','I studied yesterday.','Habe is the changed helper verb; gelernt is the past participle at the end.'),X('Sie hat in Berlin studiert.','She studied in Berlin.','Studieren ends in -ieren, so its participle is studiert, with no ge-.')],['Use sein for some past events.','Many verbs of travel or change use sein instead of haben in Perfekt. Learn the helper and participle as a pair. Gehen → ist gegangen; fahren → ist gefahren for travel.',X('Ich bin nach Berlin gefahren.','I travelled to Berlin.','This travel event uses bin, the ich-form of sein, plus gefahren.'),X('Er ist nach Hause gegangen.','He went home.','Gehen uses ist gegangen here. The participle goes at the end.')]],
  drill:['Which participle belongs to studieren?',['gestudiert','studiert','studieren'],1,'Verbs ending -ieren form this participle without ge-.'],
  build:['Say you studied yesterday.',['gelernt.','gestern','Ich','habe'],['Ich','habe','gestern','gelernt.']],
  gap:['Complete: Ich ___ nach Berlin gefahren.',['bin'],'Travel with fahren uses sein in this example.'],
  blind:['Say “We studied yesterday.” Use lernen.',['Wir haben gestern gelernt.']],
  reading:['Yesterday at university','Gestern habe ich Deutsch gelernt. Danach bin ich zur Uni gefahren. Ich habe mit Ben telefoniert. Am Abend habe ich gearbeitet. Heute bin ich müde, aber der Tag war gut.','Yesterday I studied German. Then I travelled to university. I spoke on the phone with Ben. In the evening I worked. Today I am tired, but the day was good.',[['What did the speaker study?',['Maths','German','English'],1],['Who did the speaker phone?',['Ben','Mira','A doctor'],0],['When did the speaker work?',['Morning','Afternoon','Evening'],2]]],
  writing:['Write two past sentences: you studied yesterday; you travelled to Berlin.','Ich habe gestern gelernt. Ich bin nach Berlin gefahren.'],
  open:'Write a short account of yesterday with three past activities, one place, a time phrase and a closing opinion. Use haben and sein appropriately. Aim for 30–45 words.',min:30,
  bookTask:'Use pp. 116–125: follow study/work reports, complete the Perfekt tasks and write a day report. Practise a phone call asking someone to repeat: Können Sie das bitte wiederholen?',
  speaking:['Describe yesterday in five short sentences.','Say the helper and participle for lernen, studieren, gehen and fahren.','Role-play a phone call and ask for repetition when needed.'],
  terms:[['past participle','A verb form used with a helper to form Perfekt.'],['helper verb','Haben or sein, changed for the person, supporting the past participle.']],
  glossary:[['gestern','yesterday'],['danach','after that'],['telefonieren','to phone'],['müde','tired']]
 },
 {
  title:'Die Jacke gefällt mir!',pages:[126,135],goal:'Ask about clothes and express an opinion.',related:['dative-verbs','dative'],focus:'Clothes, shops, welcher/dieser, dative pronouns and verbs; separable/inseparable past participles.',
  passes:[['Ask which item.','Welcher means which, and changes with gender. For subjects use welcher with der, welche with die, welches with das. Dieser/diese/dieses means this and follows the same pattern here.',X('Welche Jacke ist schön? Diese Jacke.','Which jacket is nice? This jacket.','Die Jacke is feminine, so both subject forms end in -e.'),X('Welcher Pullover ist schön? Dieser Pullover.','Which sweater is nice? This sweater.','Der Pullover is masculine; these subject forms end in -er.')],['Say what you like.','Gefallen works like “be pleasing to.” The item is the subject, and the person uses dative: mir means to me; dir means to you. One item gefällt, several gefallen.',X('Die Jacke gefällt mir.','I like the jacket.','The jacket is pleasing to me: die Jacke is the subject, mir the dative person.'),X('Die Schuhe gefallen dir.','You like the shoes.','Several shoes take gefallen. Dir refers to one familiar person.')]],
  drill:['Which word means “to me” with gefallen?',['mich','ich','mir'],2,'Gefallen chooses a dative person: mir.'],
  build:['Say you like the jacket.',['mir.','Jacke','Die','gefällt'],['Die','Jacke','gefällt','mir.']],
  gap:['Complete: ___ Pullover ist schön? (Which)',['Welcher'],'Der Pullover is masculine and the subject.'],
  blind:['Say “I like the sweater.” Use der Pullover.',['Der Pullover gefällt mir.']],
  reading:['In a clothes shop','Mira sucht eine Jacke. Die blaue Jacke kostet 50 Euro. Sie gefällt Mira, aber sie ist zu klein. Die rote Jacke passt gut. Mira kauft die rote Jacke.','Mira is looking for a jacket. The blue jacket costs €50. She likes it, but it is too small. The red jacket fits well. Mira buys the red jacket.',[['What costs €50?',['The blue jacket','The red jacket','The shoes'],0],['Why does Mira reject the blue jacket?',['Too expensive','Too small','Too big'],1],['What does she buy?',['A sweater','Blue shoes','The red jacket'],2]]],
  writing:['Write that you like the jacket, then ask which sweater is nice.','Die Jacke gefällt mir. Welcher Pullover ist schön?'],
  open:'Write to a friend about a clothing purchase: item, colour, price, whether it fits and whether you like it. Include a question. Aim for 30–45 words.',min:30,
  bookTask:'Read pp. 126–135: follow a shop conversation, compare welcher/dieser forms and write about clothes. Complete dative-pronoun tasks and review the new participles.',
  speaking:['Ask for an item, size and price in a shop.','Say which item fits you and which you like.','Describe what you bought yesterday, checking its participle in the book.'],
  terms:[['dative pronoun','A short person word in dative, such as mir or dir.'],['subject','The person or thing controlling the changed verb form.']],
  glossary:[['die Jacke','jacket'],['der Pullover','sweater'],['passen','to fit'],['zu klein','too small']]
 },
 {
  title:'Ab in den Urlaub!',pages:[136,145],goal:'Write a travel message and describe the weather.',related:['coordinating','dat-prepositions','perfekt'],focus:'Travel, sights, weather, postcards, man, denn, question words and time prepositions.',
  passes:[['Describe the weather.','Weather phrases often use es: es regnet means it is raining. Es ist plus a describing word gives the temperature or conditions. Learn the whole weather phrase.',X('Es regnet heute.','It is raining today.','German uses es as the subject of regnet.'),X('Heute ist es warm.','It is warm today.','Heute is first; ist stays second, followed by es. Warm takes no ending here.')],['Give a reason with denn.','Denn means because and joins two main clauses. Each clause keeps its normal verb position. The second clause can begin with its own subject. Put a comma before denn.',X('Ich bleibe hier, denn es regnet.','I am staying here because it is raining.','After denn, es is followed by regnet. The verb does not move to the end.'),X('Wir fahren morgen, denn heute arbeiten wir.','We are travelling tomorrow because today we are working.','Heute starts the second main clause, so arbeiten comes next, before wir.')]],
  drill:['After denn, where does a changed verb go?',['Always first','Normal main-clause position','Always last'],1,'Denn joins main clauses; it does not force the verb to the end.'],
  build:['Say it is warm today.',['warm.','ist','Heute','es'],['Heute','ist','es','warm.']],
  gap:['Complete: Ich bleibe hier, ___ es regnet.',['denn'],'Use the reason connector taught here.'],
  blind:['Say “It is raining tomorrow.” Use morgen.',['Es regnet morgen.','Morgen regnet es.']],
  reading:['A message from a trip','Hallo Ben! Wir sind in Berlin. Gestern haben wir das Museum besucht. Heute regnet es, aber morgen ist es warm. Am Freitag fahren wir nach Hause. Viele Grüße, Mira','Hello Ben! We are in Berlin. Yesterday we visited the museum. It is raining today, but tomorrow it will be warm. On Friday we travel home. Best wishes, Mira.',[['Where is Mira?',['Hamburg','Munich','Berlin'],2],['What did they visit yesterday?',['A museum','A station','A shop'],0],['When do they travel home?',['Monday','Friday','Tomorrow'],1]]],
  writing:['Write two sentences: it is warm today; you are staying here because it is raining.','Heute ist es warm. Ich bleibe hier, denn es regnet.'],
  open:'Write a postcard: greet someone, give your destination, one past activity, today’s weather and your return day. Add a closing. Aim for 30–45 words.',min:30,
  bookTask:'Use pp. 136–145: read travel accounts, follow directions and write a postcard. Complete denn/man/question-word tasks. Do Plattform 4, pp. 146–151, and use the grammar appendix on pp. 152–159.',
  speaking:['Describe a past trip and tomorrow’s plan.','Ask a traveller where, when and how they travel.','Give a reason with denn and describe two weather conditions.'],
  terms:[['main clause','A clause that can stand as a full sentence.'],['connector','A word joining ideas, such as und, aber or denn.']],
  glossary:[['regnen','to rain'],['warm','warm'],['bleiben','to stay'],['nach Hause','homeward']]
 }
 ];
 // Printed pages and PDF pages differ by one in the supplied 176-page scan.
 records[1].pages=[18,27];
 records[1].focus='Hobbies, weekdays, jobs, numbers above 20, irregular verbs, articles and plurals.';
 course.units.unshift({id:'textbook',title:'Netzwerk neu A1',subtitle:'12 chapter companions',icon:'book',color:'gray'});
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 for(let i=0;i<records.length;i++){
  const r=records[i],id='a1-'+String(i+1).padStart(2,'0');r.number=i+1;r.id=id;
  const examples=r.passes.map(([title,body,a,b])=>({title,body,visual:{type:'phrase',de:a.de,en:a.en},examples:[a,b]}));
  const qs=r.reading[3].map(([prompt,options,answer])=>({type:'choice',prompt,options,answer,explanation:'The passage gives '+options[answer]+'.'}));
  const model=r.writing[1];
  const writing={type:'writing',prompt:r.writing[0]+' This is a fixed scenario; use the forms taught here.',answers:[model],checks:[{label:'Include the requested details in the taught sentence pattern.',pattern:'^'+escape(model.normalize('NFC').toLocaleLowerCase('de').replace(/[.,!?;:„“"'’]/g,'').replace(/\s+/g,' ').trim())+'$'}],hint:'Return to the two learning passes and compare the sentence order.',explanation:'The requested forms and details are present. This fixed-pattern check does not grade unrestricted writing.',model};
  const lesson={id,unit:'textbook',title:r.title,subtitle:'Chapter '+r.number+' · printed pp. '+r.pages.join('–'),minutes:12,icon:'book',goal:r.goal,source:'netzwerk-neu',cards:examples,basePracticeCount:3,
   practice:[{type:'choice',prompt:r.drill[0],options:r.drill[1],answer:r.drill[2],explanation:r.drill[3]},{type:'build',prompt:r.build[0],tokens:r.build[1],answer:r.build[2],explanation:r.build[2].join(' ')},{type:'type',prompt:r.gap[0],answers:r.gap[1],hint:r.gap[2],explanation:r.gap[2]},{...qs[0],skill:'reading'},{...writing,skill:'writing'}],
   blind:{type:'type',prompt:r.blind[0],answers:r.blind[1],explanation:'You used the new pattern in a fresh sentence.'},takeaway:r.goal,words:[],
   theory:{definition:r.focus+' This chapter companion teaches one useful task at a time. Work through the assigned book pages for the rest of the chapter.',rule:r.passes.map(p=>p[1]).join(' '),steps:['Read learning pass 1 and explain both examples in your own words.','Read learning pass 2 and compare its two examples.','Do three drills, read, write, then answer the new blind question.'],watch:'The chapter companion is a short lesson. Complete the book assignments and all four skills in the daily plan as well.',terms:r.terms.map(([term,meaning])=>({term,meaning}))},
   reading:{title:r.reading[0],text:r.reading[1],translation:r.reading[2],questions:qs,glossary:r.glossary.map(([de,en])=>({de,en}))},writing};
  course.lessons.push(lesson);
  for(let n=0;n<r.glossary.length;n++){const [de,en]=r.glossary[n],wid=id+'-word-'+n;lesson.words.push(wid);course.words.push({id:wid,de,en,unit:'textbook',example:examples[0].examples[0].de});}
 }
 course.sources.unshift({id:'netzwerk-neu',title:'Netzwerk neu A1 · publisher resources and audio',url:'https://www.klett-sprachen.de/netzwerk-neu/r-4499/605'});
 course.book={title:'Netzwerk neu A1',chapters:records,pdfOffset:1,pdfPages:176,
  libraryURL:'https://chatgpt.com/library?file_id=libfile_aeafb0ea7ffc8191b1f251dc50401d60&account_id=personal',
  publisher:'https://www.klett-sprachen.de/netzwerk-neu/r-4499/605',
  practice:'https://www.goethe.de/ins/de/de/prf/gzsd1/ueb.html',
  laterIds:['subordinate','relative-clauses','adjective-endings','genitive','two-objects']};
 course.book.order=[...new Set(records.flatMap(r=>[...r.related,r.id]))];
})();
