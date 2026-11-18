// The reference uses the printed page numbers of the learner's full-volume copy.
(() => {
  'use strict';
  const verbRows = `abfahren|fährt ab|ist abgefahren|depart
anfangen|fängt an|hat angefangen|begin
ankommen|kommt an|ist angekommen|arrive
annehmen|nimmt an|hat angenommen|accept
ansehen|sieht an|hat angesehen|look at
anziehen|zieht an|hat angezogen|put on clothes
aufschreiben|schreibt auf|hat aufgeschrieben|write down
aufstehen|steht auf|ist aufgestanden|get up
ausgehen|geht aus|ist ausgegangen|go out
aussehen|sieht aus|hat ausgesehen|look or appear
aussteigen|steigt aus|ist ausgestiegen|get off
ausziehen|zieht aus|ist ausgezogen|move out
bekommen|bekommt|hat bekommen|receive
beschreiben|beschreibt|hat beschrieben|describe
bleiben|bleibt|ist geblieben|stay
bringen|bringt|hat gebracht|bring
denken|denkt|hat gedacht|think
drankommen|kommt dran|ist drangekommen|get one's turn
einfallen|fällt ein|ist eingefallen|come to mind
eingeben|gibt ein|hat eingegeben|enter data
einladen|lädt ein|hat eingeladen|invite
einschlafen|schläft ein|ist eingeschlafen|fall asleep
einsteigen|steigt ein|ist eingestiegen|get aboard
empfehlen|empfiehlt|hat empfohlen|recommend
erschließen|erschließt|hat erschlossen|work out a meaning
essen|isst|hat gegessen|eat
fahren|fährt|ist gefahren|travel by vehicle
fernsehen|sieht fern|hat ferngesehen|watch television
finden|findet|hat gefunden|find
fliegen|fliegt|ist geflogen|fly
freihaben|hat frei|hat freigehabt|have time off
geben|gibt|hat gegeben|give
gefallen|gefällt|hat gefallen|appeal to someone
gehen|geht|ist gegangen|go
genießen|genießt|hat genossen|enjoy
heißen|heißt|hat geheißen|be called
helfen|hilft|hat geholfen|help
hochfahren|fährt hoch|hat hochgefahren|boot up a computer
kennen|kennt|hat gekannt|know a person or place
klingen|klingt|hat geklungen|sound
kommen|kommt|ist gekommen|come
laufen|läuft|ist gelaufen|run or walk
leidtun|tut leid|hat leidgetan|be sorry
lesen|liest|hat gelesen|read
liegen|liegt|hat gelegen|lie or be situated
los sein|ist los|ist los gewesen|be happening
losfahren|fährt los|ist losgefahren|set off by vehicle
losgehen|geht los|ist losgegangen|start or set out
mitbringen|bringt mit|hat mitgebracht|bring along
mitkommen|kommt mit|ist mitgekommen|come along
mitlesen|liest mit|hat mitgelesen|read along
mitnehmen|nimmt mit|hat mitgenommen|take along
mitsprechen|spricht mit|hat mitgesprochen|say along
nachsprechen|spricht nach|hat nachgesprochen|repeat after someone
nehmen|nimmt|hat genommen|take
nennen|nennt|hat genannt|name
raten|rät|hat geraten|advise or guess
rausgehen|geht raus|ist rausgegangen|go outside
riechen|riecht|hat gerochen|smell
scheinen|scheint|hat geschienen|shine or seem
schlafen|schläft|hat geschlafen|sleep
schließen|schließt|hat geschlossen|close
schneiden|schneidet|hat geschnitten|cut
schreiben|schreibt|hat geschrieben|write
schwimmen|schwimmt|ist geschwommen|swim
sehen|sieht|hat gesehen|see
singen|singt|hat gesungen|sing
sitzen|sitzt|hat gesessen|sit
sprechen|spricht|hat gesprochen|speak
stattfinden|findet statt|hat stattgefunden|take place
stehen|steht|hat gestanden|stand
tragen|trägt|hat getragen|carry or wear
treffen|trifft|hat getroffen|meet
trinken|trinkt|hat getrunken|drink
tun|tut|hat getan|do
überweisen|überweist|hat überwiesen|transfer money
umsteigen|steigt um|ist umgestiegen|change trains or buses
umziehen|zieht um|ist umgezogen|move house
unterschreiben|unterschreibt|hat unterschrieben|sign
unterstreichen|unterstreicht|hat unterstrichen|underline
verbinden|verbindet|hat verbunden|connect
vergessen|vergisst|hat vergessen|forget
vergleichen|vergleicht|hat verglichen|compare
verstehen|versteht|hat verstanden|understand
vorlesen|liest vor|hat vorgelesen|read aloud
waschen|wäscht|hat gewaschen|wash
wehtun|tut weh|hat wehgetan|hurt
wiedergeben|gibt wieder|hat wiedergegeben|report or reproduce
wiegen|wiegt|hat gewogen|weigh
wissen|weiß|hat gewusst|know a fact
ziehen|zieht|hat gezogen|pull
zuhaben|hat zu|hat zugehabt|be closed
zurückfahren|fährt zurück|ist zurückgefahren|travel back
zurückfinden|findet zurück|hat zurückgefunden|find the way back
haben|hat|hat gehabt|have
sein|ist|ist gewesen|be
werden|wird|ist geworden|become
dürfen|darf|hat gedurft|be allowed to
können|kann|hat gekonnt|be able to
müssen|muss|hat gemusst|have to
sollen|soll|hat gesollt|be supposed to
wollen|will|hat gewollt|want to
möchten|möchte|see mögen|would like
mögen|mag|hat gemocht|like`.split('\n').map(row => row.split('|'));

  const pronouns = ['ich','du','er / sie / es','wir','ihr','sie / Sie'];
  const table = (headers, rows) => ({headers,rows});
  const paradigm = rows => table(['Verb','ich','du','er / sie / es','wir','ihr','sie / Sie'],rows.map(s=>s.split('|')));
  const ordinals = 'ersten zweiten dritten vierten fünften sechsten siebten achten neunten zehnten elften zwölften dreizehnten vierzehnten fünfzehnten sechzehnten siebzehnten achtzehnten neunzehnten zwanzigsten einundzwanzigsten zweiundzwanzigsten dreiundzwanzigsten vierundzwanzigsten fünfundzwanzigsten sechsundzwanzigsten siebenundzwanzigsten achtundzwanzigsten neunundzwanzigsten dreißigsten einunddreißigsten'.split(' ');
  const articleHeaders=['Case','Masculine','Feminine','Neuter','Plural'];
  const chapters = [
    {title:'Build a statement, question or instruction', page:152,
     explain:['Find the verb that changes with the speaker. In a statement it goes in the second slot. A whole time phrase can fill the first slot.','If a question needs yes or no, move the verb to the beginning. A question word takes the first slot instead. A second verb part stays at the end.'],
     examples:[['Wir kochen heute.','We cook today. Wir fills the first slot, kochen the second.'],['Am Montag kochen wir.','On Monday we cook. The two words Am Montag form one time phrase, so kochen still comes second.'],['Wann rufst du an?','When will you call? Wann opens the question. The prefix an closes it.'],['Hast du keine Zeit? – Doch!','Don’t you have time? – Yes, I do! Doch contradicts the negative suggestion.']],
     tables:[table(['Pattern','Example','What to notice'],[['Yes/no question','Können wir bezahlen?','Changed verb first, infinitive last'],['Command','Nehmen Sie Platz!','Verb first, polite Sie included'],['Two clauses','Ich lese, aber Ben schläft.','After und, oder, aber or denn the new clause keeps ordinary word order'],['Reason','Wir bleiben hier, denn es regnet.','Denn gives a reason'],['Past','Hat Kim den Bus genommen?','Auxiliary first in the question, participle last']])],
     checks:[['Complete: Heute ___ ich (cook).','koche'],['Complete the phone question: Wann rufst du ___?','an'],['Contradict “Hast du kein Fahrrad?” with a single German word.','Doch'],['Turn “Sie arbeiten hier.” into a yes/no question addressed formally.','Arbeiten Sie hier?']]},
    {title:'Choose a present-tense verb ending',page:153,
     explain:['Start with the speaker, then choose a verb ending. Ordinary verbs lose -en before the ending. After a difficult stem such as arbeit-, German inserts an e in du arbeitest.','Some frequent verbs also change their vowel for du and er/sie/es. With a separable verb, conjugate the stem and send the prefix to the end.'],
     examples:[['Wir wohnen im Norden.','We live in the north. Wir takes -en.'],['Ihr arbeitet heute.','You all work today. The extra e makes the -t ending pronounceable.'],['Sie liest am Abend.','She reads in the evening. Lesen changes e to ie in liest.'],['Ich hole Deniz ab.','I pick Deniz up. Abholen separates into hole and ab.']],
     tables:[paradigm(['wohnen|wohne|wohnst|wohnt|wohnen|wohnt|wohnen','arbeiten|arbeite|arbeitest|arbeitet|arbeiten|arbeitet|arbeiten','heißen|heiße|heißt|heißt|heißen|heißt|heißen','sprechen|spreche|sprichst|spricht|sprechen|sprecht|sprechen','lesen|lese|liest|liest|lesen|lest|lesen','fahren|fahre|fährst|fährt|fahren|fahrt|fahren','laufen|laufe|läufst|läuft|laufen|lauft|laufen','nehmen|nehme|nimmst|nimmt|nehmen|nehmt|nehmen','abholen|hole … ab|holst … ab|holt … ab|holen … ab|holt … ab|holen … ab'])],
     checks:[['Du ___ bei der Bank. (arbeiten)','arbeitest'],['Wie ___ du? (heißen)','heißt'],['Er ___ den Zug. (nehmen)','nimmt'],['Fill both verb parts: Wir ___ Eva ___. (abholen; enter the two parts separated by a space)','holen ab']]},
    {title:'Say what changes and what someone knows',page:154,
     explain:['Werden describes a change. With an age it means turning that age. Wissen is for knowing a fact or answer. Both verbs have special present forms.','Begin with the subject before selecting a form. Use wirst for du and wird for one other person. With wissen the forms for ich and er/sie/es are both weiß.'],
     examples:[['Morgen werde ich achtzehn.','I turn eighteen tomorrow. The new age follows werde.'],['Ich weiß die Adresse.','I know the address. An address is a piece of information.'],['Wann wirst du vierzig?','When do you turn forty? Du takes wirst.'],['Nora weiß das nicht.','Nora does not know that. The third-person form is weiß, with no -t.']],
     tables:[paradigm(['werden|werde|wirst|wird|werden|werdet|werden','wissen|weiß|weißt|weiß|wissen|wisst|wissen','sein|bin|bist|ist|sind|seid|sind','haben|habe|hast|hat|haben|habt|haben'])],
     checks:[['Ich ___ morgen dreißig. (werden)','werde'],['___ ihr die Antwort? (wissen)','Wisst'],['Du ___ bald zwanzig. (werden)','wirst'],['Your sister knows the number. Complete: Meine Schwester ___ die Nummer.','weiß']]},
    {title:'Give instructions and report an event',page:154,
     explain:['A modal gives an attitude to an action. Change the modal for the person and put the action at the end. In a command, choose the form for one friend, several friends, or a customer.','For a finished event use the changed helper and a participle. Learn the helper with each verb. For past states and possession, war and hatte are common in conversation.'],
     examples:[['Wir dürfen hier parken.','We may park here. Dürfen gives permission and parken closes the sentence.'],['Nimm den Schlüssel!','Take the key! Nimm addresses one friend and has no du.'],['Wir sind spät angekommen.','We arrived late. Ankommen takes sein, here sind for wir.'],['Gestern hatte ich frei.','I had yesterday off. Hatte gives a past state without a second verb.']],
     tables:[paradigm(['müssen|muss|musst|muss|müssen|müsst|müssen','können|kann|kannst|kann|können|könnt|können','wollen|will|willst|will|wollen|wollt|wollen','dürfen|darf|darfst|darf|dürfen|dürft|dürfen','sollen|soll|sollst|soll|sollen|sollt|sollen','möchten|möchte|möchtest|möchte|möchten|möchtet|möchten','mögen|mag|magst|mag|mögen|mögt|mögen','sein (past)|war|warst|war|waren|wart|waren','haben (past)|hatte|hattest|hatte|hatten|hattet|hatten']),
     table(['Verb','du','ihr','Sie'],[['kommen','Komm!','Kommt!','Kommen Sie!'],['aufstehen','Steh auf!','Steht auf!','Stehen Sie auf!'],['anfangen','Fang an!','Fangt an!','Fangen Sie an!'],['sein','Sei leise!','Seid leise!','Seien Sie leise!']]),
     table(['Participle type','Examples'],[['Regular, ge- … -(e)t','gekocht, gearbeitet'],['Irregular, often ge- … -en','gefahren, geschrieben'],['Mixed','gedacht, gebracht'],['-ieren, no ge-','telefoniert, studiert'],['Separable prefix, ge inside','eingekauft, abgefahren'],['Inseparable prefix, no extra ge-','bezahlt, verstanden']])],
     checks:[['Ihr ___ hier spielen. (dürfen)','dürft'],['We were at home. Wir ___ zu Hause.','waren'],['Complete a command to several friends: ___ leise! (sein)','Seid'],['Lina has studied. Complete: Lina ___ studiert.','hat']]},
    {title:'Find the article and plural',page:156,
     explain:['Learn a noun together with its article and plural. The subject uses nominative. A direct object after a verb such as suchen uses accusative.','Look to the verb or preposition for dative: helfen and mit are reliable clues. Plural dative usually adds -n to the noun unless it already ends in -n or -s.'],
     examples:[['Der Schlüssel fehlt.','The key is missing. Schlüssel is the masculine subject.'],['Ich suche einen Schlüssel.','I am looking for a key. A masculine direct object takes einen.'],['Ich helfe den Kindern.','I help the children. Helfen needs dative and Kinder gains -n.'],['Wir fahren mit den Autos.','We travel in the cars. Autos already ends in -s, so it gains no -n.']],
     tables:[table(['Plural family','Examples'],[['No ending; vowel may change','Zimmer → Zimmer, Apfel → Äpfel'],['-(e)n','Tasche → Taschen, Mensch → Menschen'],['-e; vowel may change','Tag → Tage, Arzt → Ärzte'],['-er; vowel may change','Bild → Bilder, Buch → Bücher'],['-s','Hotel → Hotels']]),
     table(articleHeaders,[['Nominative','der / ein / kein','die / eine / keine','das / ein / kein','die / — / keine'],['Accusative','den / einen / keinen','die / eine / keine','das / ein / kein','die / — / keine'],['Dative','dem / einem / keinem','der / einer / keiner','dem / einem / keinem','den / — / keinen']])],
     checks:[['Ich brauche ___ Stift. (a)','einen'],['Write the plural of Buch.','Bücher'],['Mit ___ Frau. (the)','der'],['Complete the negative: Wir helfen ___ Kindern. (no children)','keinen']]},
    {title:'Indicate whose item, which one or this one',page:157,
     explain:['Choose the possessive stem for the owner. Then choose the ending for the item and its case. Use mein- for my, dein- for your and unser- for our.','Question words such as welcher and pointers such as dieser follow the same case endings as the definite articles. Identify the noun before finishing the word.'],
     examples:[['Unser Bus kommt.','Our bus is coming. Bus is masculine and the subject, so unser has no extra ending.'],['Wir sehen unseren Bus.','We see our bus. The masculine direct object needs -en.'],['Welche Tasche meinst du?','Which bag do you mean? Tasche is feminine and takes welche.'],['Mit diesem Bus fahre ich.','I travel by this bus. Mit requires dative, giving diesem.']],
     tables:[table(['Owner','Possessive stem'],[['ich / du','mein- / dein-'],['er / es / sie (she)','sein- / sein- / ihr-'],['wir / ihr','unser- / euer- (eure, euren)'],['sie (they) / Sie (formal you)','ihr- / Ihr-']]),
     table(articleHeaders,[['Nominative','mein','meine','mein','meine'],['Accusative','meinen','meine','mein','meine'],['Nominative','welcher / dieser','welche / diese','welches / dieses','welche / diese'],['Accusative','welchen / diesen','welche / diese','welches / dieses','welche / diese'],['Dative','welchem / diesem','welcher / dieser','welchem / diesem','welchen / diesen']])],
     checks:[['Ich besuche ___ Vater. (my)','meinen'],['___ Kleid passt? (which)','Welches'],['Mit ___ Schuhen? (which)','welchen'],['Choose this in “Ich kaufe ___ Mantel.”','diesen']]},
    {title:'Refer back to people and describe things',page:158,
     explain:['A pronoun replaces a noun. Choose er, sie or es from the noun’s grammatical gender. Then choose the form for its job in the sentence.','For people in general, man takes the same verb form as er. After sein an adjective keeps its basic form. Nicht negates it, sehr strengthens it, and zu means excessively.'],
     examples:[['Wo ist die Karte? Hier ist sie.','Where is the map? Here it is. Karte has the article die, so sie refers back to it.'],['Der Hut passt mir.','The hat fits me. The person it fits is dative, so ich becomes mir.'],['Man kann hier baden.','People can swim here. Man takes singular kann.'],['Die Stühle sind zu klein.','The chairs are too small. Klein has no ending after sind, even with a plural subject.']],
     tables:[table(['Subject','Accusative','Dative'],[['ich','mich','mir'],['du','dich','dir'],['er','ihn','ihm'],['sie (she)','sie','ihr'],['es','es','ihm'],['wir','uns','uns'],['ihr','euch','euch'],['sie (they)','sie','ihnen'],['Sie','Sie','Ihnen']])],
     checks:[['I see him: Ich sehe ___.','ihn'],['I speak with her: Ich spreche mit ___.','ihr'],['People can learn here: ___ kann hier lernen.','Man'],['The rooms are very quiet. Fill both words: Die Zimmer sind ___.','sehr ruhig']]},
    {title:'Use a preposition for place or time',page:159,
     explain:['Some prepositions set the case: für takes accusative, mit and zu take dative. Nine other prepositions distinguish location from destination. Ask wo for an established location and wohin for a new destination.','For time, match the unit: am for a day, um for a clock time, im for months. For place, identify the relationship: zu for going to someone, bei for being with someone, von for coming from someone.'],
     examples:[['Das Heft ist für den Kurs.','The notebook is for the class. Für requires accusative den.'],['Die Tasse steht auf dem Tisch.','The cup is on the table. Its location is fixed, so auf takes dative.'],['Ich stelle die Tasse auf den Tisch.','I put the cup onto the table. Its new destination takes accusative.'],['Am Mittwoch bin ich beim Arzt.','On Wednesday I am at the doctor’s. Am means an dem; beim means bei dem.']],
     tables:[table(['Use','Forms and examples'],[['Location or destination','an (at), auf (on), hinter (behind), in (in), neben (beside), über (above), unter (under), vor (in front of), zwischen (between)'],['With dative','mit dem Rad, zu einer Freundin, bei der Arbeit, aus dem Haus, von der Schule'],['Contractions','im = in dem, ins = in das, am = an dem, zum = zu dem, zur = zu der, beim = bei dem, vom = von dem'],['When or how long','am Abend, um acht, von elf bis zwölf, im April'],['Time with dative','ab diesem Montag, nach dem Essen, seit einer Woche, vor der Reise']])],
     checks:[['To the pharmacy: ___ Apotheke. (contract zu + der)','zur'],['The book is lying in the backpack: Das Buch liegt ___ Rucksack. (in + dem)','im'],['At twelve o’clock: ___ zwölf Uhr.','um'],['Put it into the car: Leg es ___ Auto. (in + das)','ins']]},
    {title:'Ask for a detail or give a date',page:160,
     explain:['Pick the question word for the missing information. Wer asks for a person as subject. Wen asks for a direct object. Wem asks for the dative person.','For a date with am, use a number ending in -ten through 19, then -sten from 20. Watch the special forms ersten, dritten, siebten and achten.'],
     examples:[['Wem schreibst du?','Whom are you writing to? The recipient is dative.'],['Wie viele Gäste kommen?','How many guests are coming? Countable guests use wie viele.'],['Am dritten Mai geht es los.','It starts on May third. Drei changes to dritten after am.'],['Wir kommen am zwanzigsten Juni.','We arrive on June twentieth. From twenty the ending is -sten.']],
     tables:[table(['Ask about','Question'],[['Person: subject, direct object, recipient','Wer? Wen? Wem?'],['Thing or action','Was?'],['Location, destination, origin','Wo? Wohin? Woher?'],['Time or duration','Wann? Wie lange?'],['Manner or reason','Wie? Warum?'],['Amount or number','Wie viel Wasser? Wie viele Flaschen?']]),table(['Date','Spoken after am','Date','Spoken after am'],Array.from({length:16},(_,i)=>[String(i+1)+'.',ordinals[i],i<15?String(i+17)+'.':'',ordinals[i+16]||'']))],
     checks:[['Ask how much water: ___ Wasser?','Wie viel'],['Ask whom someone visits: ___ besuchst du?','Wen'],['Write 8 in “am ___ Mai”.','achten'],['Write the date as words: am 31. Juli','am einunddreißigsten Juli']]},
    {title:'Read an irregular-verb entry',page:160,
     explain:['Read a verb entry across: infinitive, the present form for er/sie/es, then the perfect with its helper. The middle form reveals vowel changes.','Look up the whole infinitive including its prefix. In a sentence the present-tense prefix can separate. In the participle the prefix and stem stay together.'],
     examples:[['lesen → liest → hat gelesen','Read: the present vowel changes, but the perfect uses gelesen with haben.'],['kommen → kommt → ist gekommen','Come: the past uses sein. With wir, change ist to sind.'],['einladen → lädt ein → hat eingeladen','Invite: ein goes to the end in the present, and ge goes inside the participle.'],['Der Bus ist abgefahren.','The bus has departed. Find abfahren under A to recover its own helper and participle.']],
     tables:[],
     checks:[['Third-person form of nehmen?','nimmt'],['Complete the past of bleiben: Sie ___ geblieben.','ist'],['Enter third-person present of aufstehen, including its prefix.','steht auf'],['Yesterday the film took place. Complete: Der Film ___ stattgefunden.','hat']]},
    {title:'Read the alphabetical word list',page:162,
     explain:['An entry shows a headword, then the noun’s article and a plural marker or the verb’s changed forms. A number like 9/1a means chapter 9, task 1a. The letter before a slash in ÜB is not a page number: ÜB marks the practice book.','Check the printed marks when pronunciation matters. A line below a vowel marks length; a dot marks a short vowel. Bold entries are singled out for exam study. Sg. and Pl. identify singular-only and plural-only entries in the list.'],
     examples:[['Balkon, der, -e → die Balkone','The article belongs before the headword in a sentence. The -e gives the plural ending.'],['bekommen → bekommt → hat bekommen','For an irregular verb, the extra forms help you construct a sentence in either tense.'],['9/1a → Kapitel 9, Aufgabe 1a','Use both parts to find a word in context, first its chapter, then its activity.'],['das Wasser (Sg.)','Read Sg. as singular in this entry. Learn das Wasser as one expression.']],
     tables:[],
     checks:[['In the index code 5/2a, which chapter number should you open?','5'],['Which marker means plural: Sg. or Pl.?','Pl.'],['If the vowel has a line beneath it, is it long or short?','long'],['Use the entry “Balkon, der, -e”. Enter its plural with the article.','die Balkone']]}
  ];
