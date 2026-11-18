/* The scan has a front cover, printed pages 1–174, and a back cover. */
(function (root) {
  const titles = [
    'Front cover|Title page|Publication details|Using this book|Chapters 1–3|Chapters 4–6|Chapters 7–9|Chapters 10–12 and appendix',
    'Recognise familiar words|Match words to pictures|Greet a classmate|Introduce yourself formally|Ask where someone comes from|Numbers, letters and contact details|Countries and languages|Describe a speaker|Flatshare: meeting the residents|Check your introductions',
    'Identify leisure activities|Match hobbies to people|Say what you enjoy|Arrange a cinema visit|Identify occupations|Compare working hours|Learn articles with nouns|Register at a club|Flatshare: plans and jobs|Check hobbies, work and numbers',
    'Find places in Hamburg|Recognise city landmarks|Describe a taxi route|Ask what a building is|Identify transport and correct guesses|Give directions|Read Hamburg event notices|Compare seasons and activities|Flatshare: a city tour|Check places and directions',
    'Mixed conversation game|Continue the conversation game|Play with letters and vowels|Match people and professions|Locate D-A-CH cities|Identify city landmarks',
    'Describe breakfast|Compare food and drink|Plan a shopping trip|Speak to a shop assistant|Offer food and respond|Compare meals|Organise your food vocabulary|Read about a food-related job|Flatshare: food for a get-together|Check shopping and meals',
    'Describe a daily routine|Sequence a day in pictures|Tell the time|Compare family schedules|Describe family relationships|Arrange to meet|Make a telephone appointment|Explain a delay|Flatshare: timing and plans|Check time and family',
    'Describe leisure plans|Recognise leisure activities|Say a birthday date|Write a birthday invitation|Order in a restaurant|Read a menu and pay|Compare places to eat or drink|Find key details in event announcements|Flatshare: birthday preparations|Check invitations and events',
    'Shopping and invitations game|Continue the role-play game|Interview a partner about time|Describe what takes time|Identify regional dishes|Match food descriptions and ingredients',
    'Describe the working day|Recognise workplaces|Read about an internship|Understand workplace questions|Give destinations and locations|Describe a work sequence|Answer a club letter|Make small talk|Flatshare: a busy day|Check workplace language',
    'Discuss fitness and health|Identify everyday health habits|Give simple instructions|Give personal details at the gym|Describe an accident|Talk to a doctor|Understand and give everyday tips|Decode hospital job titles|Flatshare: asking for help|Check symptoms and instructions',
    'Name rooms and furniture|Read a floor plan|Understand a housing advert|Decide where furniture goes|Say where things are|Describe colours and preferences|Compare ways of living|Write about a home|Flatshare: room layout|Check housing language',
    'Review work, health and homes|Continue the mixed review|Interview a partner about habits|Listen for polite instructions|Identify words in a song|Compare housing preferences',
    'Describe work and study|Identify jobs and work settings|Tell the story of a day|Choose past-tense verb forms|Understand how people find work|Report work and study experiences|Clarify a detail by telephone|Compare seasonal jobs|Flatshare: a job conversation|Check work and the past',
    'Recognise items of clothing|Describe what people wear|Compare ways to buy clothes|Respond to compliments|Talk to a sales assistant|Find a department in a store|Read about Berlin|Find information for a Berlin visit|Flatshare: choose an outfit|Check shopping and clothing',
    'Choose holiday activities|Compare holiday destinations|Suggest a city tour|Give directions and write a postcard|Read short travel reports|Ask questions about a trip|Describe the weather|Discuss destinations in Germany|Flatshare: a holiday|Check travel language',
    'Plan a trip together|Role-play travel choices|Sequence a report with time words|Read a colleague’s holiday message|Explore Germany and Austria|Explore languages and places in Switzerland',
    'Sentence order and questions|Commands and joining clauses|Irregular and modal verbs|Past participles and the perfect|Nouns, gender and plural|Articles and possessives|Adjectives and pronouns|Time expressions and dates|Place expressions and irregular verbs|Irregular verbs continued',
    'Word list: how entries work|Word list: A–B|Word list: B–D|Word list: D–F|Word list: F–G|Word list: G–J|Word list: J–L|Word list: L–N|Word list: N–R|Word list: R–S|Word list: S–T|Word list: T–V|Word list: V–Z|Back cover'
  ].flatMap(group => group.split('|'));
  if (titles.length !== 176) throw new Error('Incomplete book reader');
  const starts = [8,18,28,44,54,64,80,90,100,116,126,136];
  const range = (from, to) => Array.from({length: to - from + 1}, (_, i) => from + i);
  const dayPages = [];
  for (let chapter = 0; chapter < starts.length; chapter++) {
    const start = starts[chapter];
    dayPages.push(range(start, start + 4), range(start + 5, start + 9));
    if (chapter % 3 === 2) dayPages.push(range(start + 10, start + 15));
  }
  dayPages.push(range(152,154), range(155,157), range(158,161), range(162,164),
                range(165,167), range(168,170), range(171,174));
  const dayFor = page => dayPages.findIndex(pages => pages.includes(page)) + 1;
  const label = page => page === 0 || page === 175 ? titles[page] : 'p. ' + page + ' · ' + titles[page];
  function assignment(d, state) {
    const pages = dayPages[d.number - 1];
    const done = pages.filter(p => state.sprint.bookPages[p]?.done);
    const next = pages.find(p => !done.includes(p)) ?? pages[0];
    return '<section class="book-assignment"><p class="eyebrow">Original textbook · ' + done.length + ' / ' + pages.length +
      ' pages reviewed</p><h3>Printed pages ' + pages[0] + '–' + pages.at(-1) +
      '</h3><p>Work through the numbered tasks on these pages. Save written answers or a phrase you said beside the scan.</p>' +
      '<a class="btn light" href="#book-pages/' + next + '">' + (done.length === pages.length ? 'Reopen pages' : 'Open ' + label(next)) + '</a>' +
      (d.number >= 29 ? ' <a class="text-link small" href="#appendix">Open the grammar and word reference</a>' : '') + '</section>';
  }
  function reader(api) {
    const {frame, intro, e, getState} = api;
    const raw = Number(location.hash.split('/')[1]);
    const page = Number.isInteger(raw) && raw >= 0 && raw < titles.length ? raw : 0;
    const d = dayFor(page), state = getState(), entry = state.sprint.bookPages[page] || {};
    const jump = '<label class="book-jump">Jump to page <select id="book-jump">' +
      titles.map((title, i) => '<option value="' + i + '"' + (i === page ? ' selected' : '') + '>' + e(label(i)) + '</option>').join('') + '</select></label>';
    const previous = page > 0 ? '<a class="btn light" href="#book-pages/' + (page-1) + '">Previous page</a>' : '';
    const next = page < 175 ? '<a class="btn light" href="#book-pages/' + (page+1) + '">Next page</a>' : '';
    const media = window.GERMAN_COURSE.book.publisher;
    const note = '<label class="eyebrow" for="page-notes">Your answers or notes</label><textarea id="page-notes" data-page="' + page +
      '" class="type-answer writing-answer" rows="4" placeholder="Use the exercise numbers to keep your answers together.">' + e(entry.note || '') + '</textarea>';
    return frame(intro('Netzwerk neu A1 · PDF page ' + (page + 1) + ' of 176', titles[page],
      d ? 'Printed page ' + page + ' · Assigned to Day ' + d : 'Book reference') +
      '<section class="panel source-reader"><div class="reader-toolbar">' + jump + (d ? '<a class="text-link" href="#day/' + d + '">Day ' + d + ' activities ↗</a>' : '') +
      '</div><details class="reader-help"><summary>How to work with this page</summary><p>Try the numbered tasks in order. For a partner task, say both parts aloud or practise with someone. For a recap, cover the models and make your own examples. On a word-list page, look up unfamiliar items and use them in a sentence.</p><p>Headphone and film symbols refer to the publisher’s recordings and videos. The course has separate original listening passages. <a class="text-link" href="' + e(media) + '" target="_blank" rel="noopener">Publisher media ↗</a></p></details>' +
      '<div class="reader-scroll"><img id="scan-page" alt="' + e(label(page)) + ', original scanned page" src="data:image/webp;base64,' +
      root.GERMAN_BOOK_SCANS[page] + '"></div><button class="text-link small" data-action="book-zoom" aria-pressed="false">Enlarge page</button>' +
      '<div class="reader-notes">' + note + (d ? '<label class="sprint-check"><input type="checkbox" data-book-page="' + page + '"' +
      (entry.done ? ' checked' : '') + '><span>I worked through this page.</span></label>' : '') + '</div><div class="theory-actions">' + previous + next +
      (d ? '<button class="btn" data-action="day-start" data-day="' + d + '">Continue Day ' + d + '</button>' : '') + '</div></section>');
  }
  root.GERMAN_BOOK = {dayPages, dayFor, titles, assignment, reader};
})(window);
