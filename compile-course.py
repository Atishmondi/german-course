"""Validate content/ against active/content-contract.md and levels.json rules, then write dist/full-content.js.

python3 compile-course.py [--partial] [--root DIR]
  --partial  allow missing chapters/mocks (still validates what exists); sets partial:true
  --root     project root holding content/ and dist/ (default: this file's folder; used by tests)
Stdlib only. Collects every error, prints them, exits 1 if any.
"""
import json, re, sys, unicodedata
from pathlib import Path

args = sys.argv[1:]
PARTIAL = '--partial' in args
ROOT = Path(args[args.index('--root') + 1]).resolve() if '--root' in args else Path(__file__).resolve().parent
CONTENT = ROOT / 'content'
NAME = re.compile(r'atish|mondi', re.I)

errors, warnings = [], []
import importlib.util as _ilu
_sp = _ilu.spec_from_file_location('giveaways', Path(__file__).resolve().parent / 'tools' / 'giveaways.py'); GIVEAWAYS = _ilu.module_from_spec(_sp); _sp.loader.exec_module(GIVEAWAYS)
STRICT_LEVELS = {'a1', 'a2', 'b1'}  # depth bar enforced on every level
def err(file, id_, field, msg): errors.append(f'{file} | {id_} | {field}: {msg}')
def warn(file, id_, field, msg): warnings.append(f'{file} | {id_} | {field}: {msg}')

def load(path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except Exception as e:
        err(path.relative_to(ROOT), '-', '-', f'cannot read JSON ({e})'); return None

def strings(v, path=''):
    if isinstance(v, str): yield path, v
    elif isinstance(v, dict):
        for k, x in v.items(): yield from strings(x, f'{path}.{k}' if path else k)
    elif isinstance(v, list):
        for i, x in enumerate(v): yield from strings(x, f'{path}[{i}]')

def text_checks(f, id_, rec):
    for p, s in strings(rec):
        if unicodedata.normalize('NFC', s) != s: err(f, id_, p, 'text is not NFC-normalised')
        if NAME.search(s): err(f, id_, p, "contains the learner's name")

nonempty = lambda v: isinstance(v, str) and v.strip() != ''
norm = lambda s: re.sub(r'\s+', ' ', str(s or '')).strip().casefold()
words = lambda s: len(str(s or '').split())

def question(f, id_, field, q):
    if not isinstance(q, dict): return err(f, id_, field, 'question is not an object')
    t = q.get('type')
    for k in ('prompt', 'hint', 'explanation'):
        if not nonempty(q.get(k)): err(f, id_, f'{field}.{k}', 'missing or empty')
    if 'grammar' in q and not isinstance(q['grammar'], bool): err(f, id_, f'{field}.grammar', 'must be true/false')
    if t == 'choice':
        o, a = q.get('options'), q.get('answer')
        if not (isinstance(o, list) and 2 <= len(o) <= 4 and all(nonempty(x) for x in o)): err(f, id_, f'{field}.options', 'need 2-4 non-empty options')
        elif not (isinstance(a, int) and not isinstance(a, bool) and 0 <= a < len(o)): err(f, id_, f'{field}.answer', f'invalid choice index {a!r}')
    elif t == 'build':
        tok, a = q.get('tokens'), q.get('answer')
        if not (isinstance(tok, list) and isinstance(a, list) and a and all(isinstance(x, str) for x in tok + a)): err(f, id_, field, 'build needs tokens and answer lists of strings')
        elif sorted(tok) != sorted(a): err(f, id_, f'{field}.tokens', 'tokens are not a permutation of answer')
    elif t == 'type':
        a = q.get('answers')
        if not (isinstance(a, list) and a and all(nonempty(x) for x in a)): err(f, id_, f'{field}.answers', 'need a non-empty list of answers')
    else:
        err(f, id_, f'{field}.type', f'unknown type {t!r}')

def questions(f, id_, field, qs, count=None, minimum=None):
    if not isinstance(qs, list): err(f, id_, field, 'must be a list'); return []
    if count is not None and len(qs) != count: err(f, id_, field, f'has {len(qs)} questions, need exactly {count}')
    if minimum is not None and len(qs) < minimum: err(f, id_, field, f'has {len(qs)} questions, need at least {minimum}')
    for i, q in enumerate(qs): question(f, id_, f'{field}[{i}]', q)
    return qs

# ---------- resources
res_path = CONTENT / 'resources.json'
HAVE_RES = res_path.exists()
resources = (load(res_path) if HAVE_RES else None) or {}
PART_ROLES = {'subject', 'verb', 'verb2', 'object', 'dative', 'article', 'noun', 'adjective', 'ending',
              'question', 'negation', 'time', 'place', 'preposition', 'conjunction', 'other',
              'verbend', 'genitive', 'reflexive', 'relative', 'konj2', 'zu'}  # A2/B1 roles  # colour keys the player knows
def bad_parts(pa, de=None):
    if not (isinstance(pa, list) and pa and all(isinstance(p, list) and len(p) == 2 and nonempty(p[0]) and p[1] in PART_ROLES for p in pa)):
        return f'need [[text, role], ...] with role in {sorted(PART_ROLES)}'
    squash = lambda t: re.sub(r'[\W_]+', '', t.lower())
    if de is not None and squash(''.join(p[0] for p in pa)) != squash(de): return 'parts do not spell the sentence in "de"'
MEDIA = {'grammarVideos': 'videos', 'nicosWeg': 'nicosWeg', 'practice': 'links'}
used = {g: set() for g in MEDIA.values()}
gaps = set(resources.get('gaps') or [])

def media(f, lid, lesson):
    m = lesson.get('media')
    if not isinstance(m, dict): return err(f, lid, 'media', 'missing')
    for field, group in MEDIA.items():
        keys = m.get(field, [])
        if not isinstance(keys, list): err(f, lid, f'media.{field}', 'must be a list'); continue
        if field != 'grammarVideos' and len(keys) > 2: err(f, lid, f'media.{field}', 'at most 2')
        for k in keys:
            entry = (resources.get(group) or {}).get(k)
            if HAVE_RES and not (isinstance(entry, dict) and entry.get('ok') is True):
                err(f, lid, f'media.{field}', f'{k!r} is not an ok entry in resources.json {group}')
            elif entry: used[group].add(k)
    if not m.get('grammarVideos'):
        topic = (lesson.get('grammar') or {}).get('topic')
        if topic in gaps or not HAVE_RES: warn(f, lid, 'media.grammarVideos', f'no grammar video (topic {topic!r} has none in resources)')
        else: err(f, lid, 'media.grammarVideos', 'need at least 1 grammar video')

# ---------- lessons and skill days
def lesson(f, lv, ch, n, L, R):
    lid = L.get('id', f'?{n}')
    want = f'{lv}-c{ch:02d}-{n:02d}'
    if lid != want: err(f, lid, 'id', f'expected {want} (pattern <level>-c<NN>-<NN>, in n order)')
    if L.get('level') != lv or L.get('chapter') != ch or L.get('n') != n: err(f, lid, 'level/chapter/n', f'expected {lv}/{ch}/{n}')
    for k in ('title', 'goal'):
        if not nonempty(L.get(k)): err(f, lid, k, 'missing')
    if not isinstance(L.get('minutes'), (int, float)): err(f, lid, 'minutes', 'missing')
    g = L.get('grammar') or {}
    for k in ('topic', 'point', 'oneLine'):
        if not nonempty(g.get(k)): err(f, lid, f'grammar.{k}', 'missing')
    mk = g.get('mistake') or {}
    for k in ('wrong', 'right', 'why'):
        if not nonempty(mk.get(k)): err(f, lid, f'grammar.mistake.{k}', 'missing')
    if not isinstance(L.get('terms'), list): err(f, lid, 'terms', 'missing list')
    cards = L.get('cards')
    if not (isinstance(cards, list) and len(cards) >= R['cards']): err(f, lid, 'cards', f"need at least {R['cards']} teaching cards")
    if isinstance(cards, list) and cards and isinstance(cards[0], dict):
        c0 = cards[0]
        if c0.get('intro') is not True: err(f, lid, 'cards[0]', 'first card must be the introduction ("intro": true): why it matters, what you know, what is new')
        elif not (isinstance(c0.get('steps'), list) and len(c0['steps']) >= 3): err(f, lid, 'cards[0].steps', 'introduction needs 3+ steps: You already know / New today / By the end')
        if any(isinstance(c, dict) and c.get('intro') for c in cards[1:]): err(f, lid, 'cards', 'only the first card can be the introduction')
    for i, c in enumerate(cards if isinstance(cards, list) else []):
        if not (nonempty(c.get('title')) and nonempty(c.get('body'))): err(f, lid, f'cards[{i}]', 'title and body required')
        elif len(c['body'].split()) > 60: err(f, lid, f'cards[{i}].body', 'over 60 words; split the idea into another card')
        st, pa = c.get('steps'), c.get('parts')
        if st is not None and not (isinstance(st, list) and len(st) >= 2 and all(nonempty(s) for s in st)):
            err(f, lid, f'cards[{i}].steps', 'need a list of at least 2 strings')
        if pa is not None and bad_parts(pa): err(f, lid, f'cards[{i}].parts', bad_parts(pa))
        if i and not c.get('intro') and not (nonempty(c.get('lead')) and 12 <= len(c['lead'].split()) <= 45):
            err(f, lid, f'cards[{i}].lead', 'every teaching card needs "lead" (What this card teaches): 12-45 words, bridge from the last card + what this card teaches')
        dp = c.get('deeper')
        if i and not c.get('intro'):
            if not (isinstance(dp, dict) and nonempty(dp.get('text')) and 30 <= len(dp['text'].split()) <= 90 and isinstance(dp.get('example'), dict) and nonempty(dp['example'].get('de')) and nonempty(dp['example'].get('en'))):
                err(f, lid, f'cards[{i}].deeper', 'every teaching card needs "deeper" (A bit deeper): {"text": 40-80 words, "example": {de, en, parts}}')
            elif dp['example'].get('parts') is not None and bad_parts(dp['example']['parts'], dp['example']['de']):
                err(f, lid, f'cards[{i}].deeper.example.parts', bad_parts(dp['example']['parts'], dp['example']['de']))
        mo = c.get('more')
        if not (nonempty(mo) and len(mo.split()) <= 150): err(f, lid, f'cards[{i}].more', 'every card needs "more" (Explain it more simply), at most 150 words')
        if not any(c.get(k) for k in ('table', 'steps', 'parts')):
            err(f, lid, f'cards[{i}]', 'needs a visual: table, steps or parts')
        ex = c.get('examples')
        if not (isinstance(ex, list) and len(ex) >= 2 and all(nonempty(e.get('de')) and nonempty(e.get('en')) for e in ex)):
            err(f, lid, f'cards[{i}].examples', 'need at least 2 examples with de and en')
        for j, e in enumerate(ex if isinstance(ex, list) else []):
            if isinstance(e, dict) and e.get('parts') is not None and bad_parts(e['parts'], e.get('de', '')):
                err(f, lid, f'cards[{i}].examples[{j}].parts', bad_parts(e['parts'], e.get('de', '')))
    exs = [e for c in (cards if isinstance(cards, list) else []) if isinstance(c, dict) for e in (c.get('examples') or []) if isinstance(e, dict)]
    if exs and sum(1 for e in exs if e.get('parts')) * 2 < len(exs):
        err(f, lid, 'cards', 'colour-code at least half of the examples with "parts"')
    if isinstance(cards, list) and not any(isinstance(c, dict) and c.get('more') for c in cards):
        err(f, lid, 'cards', 'at least one card needs "more": the hard part explained simply')
    if lv in STRICT_LEVELS:  # depth bar (user 2026-11-22: "no compromises"); add a level once it is upgraded
        for i, c in enumerate(cards if isinstance(cards, list) else []):
            if not isinstance(c, dict) or c.get('intro'): continue
            if len((c.get('more') or '').split()) < 55: err(f, lid, f'cards[{i}].more', 'depth bar: "more" needs 55+ words with a new angle')
            if len(((c.get('deeper') or {}).get('text') or '').split()) < 40: err(f, lid, f'cards[{i}].deeper', 'depth bar: deeper.text needs 40+ words with a real new point')
        md = L.get('media') or {}
        if len(md.get('grammarVideos') or []) < 2: err(f, lid, 'media.grammarVideos', 'depth bar: at least 2 grammar videos')
        if len(md.get('nicosWeg') or []) < 1: err(f, lid, 'media.nicosWeg', "depth bar: at least 1 Nicos Weg episode")
        for path, q in GIVEAWAYS.qs(L):
            if f'{Path(f).parent.name}/{Path(f).name}.lessons[{n-1}]{path}' in GIVEAWAYS.OK: continue
            for why in GIVEAWAYS.check(q): err(f, lid, path.lstrip('.'), f'giveaway: {why}')
    media(f, lid, L)
    drills = questions(f, lid, 'drills', L.get('drills'), minimum=R['drills'])
    check = questions(f, lid, 'check', L.get('check'), minimum=R['check'])
    if sum(1 for q in check if isinstance(q, dict) and q.get('grammar') is True) < R['checkGrammar']:
        err(f, lid, 'check', f'need at least {R["checkGrammar"]} questions with grammar:true')
    blind = L.get('blind')
    question(f, lid, 'blind', blind)
    if isinstance(blind, dict) and blind.get('type') != 'type': err(f, lid, 'blind.type', 'must be "type"')
    retr = questions(f, lid, 'retrieval', L.get('retrieval'), count=R['retrieval'])
    seen = {norm(q.get('prompt')) for q in drills + check if isinstance(q, dict)}
    if isinstance(blind, dict) and norm(blind.get('prompt')) in seen: err(f, lid, 'blind.prompt', 'identical to a drill/check prompt')
    for i, q in enumerate(retr):
        if not isinstance(q, dict): continue
        if q.get('type') != 'type': err(f, lid, f'retrieval[{i}].type', 'must be "type"')
        p = norm(q.get('prompt'))
        if p in seen or (isinstance(blind, dict) and p == norm(blind.get('prompt'))): err(f, lid, f'retrieval[{i}].prompt', 'identical to a drill/check/blind prompt')
    sp = L.get('speaking') or {}
    if not (isinstance(sp.get('prompts'), list) and len(sp['prompts']) == R['speaking'] and all(nonempty(p) for p in sp['prompts'])):
        err(f, lid, 'speaking.prompts', f'need exactly {R["speaking"]} prompts')
    if not isinstance(sp.get('examples'), list): err(f, lid, 'speaking.examples', 'missing list')
    voc = L.get('vocabulary')
    lo, hi = R['vocab']
    if not (isinstance(voc, list) and lo <= len(voc) <= hi): err(f, lid, 'vocabulary', f'need {lo}-{hi} words, has {len(voc) if isinstance(voc, list) else 0}')
    for i, w in enumerate(voc if isinstance(voc, list) else []):
        if not (nonempty(w.get('de')) and nonempty(w.get('en'))): err(f, lid, f'vocabulary[{i}]', 'de and en required')
        elif w.get('article') and w['de'].startswith(w['article'] + ' '): err(f, lid, f'vocabulary[{i}].de', 'article is in "article"; do not repeat it in "de" (the player would show "der der …")')
        ex = w.get('examples')
        if not (isinstance(ex, list) and len(ex) >= 2 and all(nonempty(e.get('de')) and nonempty(e.get('en')) for e in ex)):
            err(f, lid, f'vocabulary[{i}].examples', 'need 2 examples with de and en')
    text_checks(f, lid, L)

def skillday(f, lv, ch, k, S, R):
    sid = S.get('id', f'?d{k}')
    want = f'{lv}-c{ch:02d}-d{k}'
    if sid != want: err(f, sid, 'id', f'expected {want} (pattern <level>-c<NN>-d<N>)')
    if S.get('level') != lv or S.get('chapter') != ch or S.get('day') != k: err(f, sid, 'level/chapter/day', f'expected {lv}/{ch}/{k}')
    rd, ls, wr = S.get('reading') or {}, S.get('listening') or {}, S.get('writing') or {}
    lo, hi = R['readingWords']
    if not (lo <= words(rd.get('text')) <= hi): err(f, sid, 'reading.text', f'{words(rd.get("text"))} words, need {lo}-{hi}')
    if not nonempty(rd.get('title')): err(f, sid, 'reading.title', 'missing')
    if not isinstance(rd.get('glossary'), list): err(f, sid, 'reading.glossary', 'missing list')
    questions(f, sid, 'reading.questions', rd.get('questions'), count=R['skillQuestions'])
    if not nonempty(ls.get('script')): err(f, sid, 'listening.script', 'missing')
    questions(f, sid, 'listening.questions', ls.get('questions'), count=R['skillQuestions'])
    questions(f, sid, 'writing.items', wr.get('items'), count=R['writingItems'])
    fr = wr.get('free')
    if not isinstance(fr, dict) or not nonempty(fr.get('prompt')) or not nonempty(fr.get('model')):
        err(f, sid, 'writing.free', 'free writing with prompt and model required')
    else:
        lo, hi = R['freeWritingWords']
        mw = fr.get('minWords')
        if not (isinstance(mw, int) and lo <= mw <= hi): err(f, sid, 'writing.free.minWords', f'need an integer in {lo}-{hi}')
        elif words(fr['model']) < mw: err(f, sid, 'writing.free.model', f'model has fewer than minWords ({mw}) words')
        for i, c in enumerate(fr.get('checks') or []):
            try: re.compile(c.get('pattern', ''))
            except re.error as e: err(f, sid, f'writing.free.checks[{i}].pattern', f'bad regex ({e})')
    text_checks(f, sid, S)

# ---------- main
levels = load(CONTENT / 'levels.json')
if not levels:
    print('\n'.join(errors)); sys.exit(1)
out_lessons, out_skills, out_mocks, ids, summary = [], [], [], set(), []

def unique(f, i):
    if i in ids: err(f, i, 'id', 'duplicate id')
    ids.add(i)

for LV in levels['levels']:
    lv, R = LV['id'], LV['rules']
    chapter_days = {int(k): v for k, v in LV['chapterDays'].items()}
    ln = sk = 0
    for ch in sorted(chapter_days):
        path = CONTENT / lv / f'ch{ch:02d}.json'
        f = path.relative_to(ROOT)
        if not path.exists():
            if not PARTIAL: err(f, '-', '-', 'chapter file missing')
            continue
        C = load(path)
        if not isinstance(C, dict): continue
        if C.get('level') != lv or C.get('chapter') != ch: err(f, '-', 'level/chapter', f'expected {lv}/{ch}')
        if not nonempty(C.get('title')): err(f, '-', 'title', 'missing chapter title')
        L, S, cd = C.get('lessons') or [], C.get('skillDays') or [], chapter_days[ch]
        if len(L) != cd * 3: err(f, '-', 'lessons', f'has {len(L)}, need chapterDays×3 = {cd * 3}')
        if len(S) != cd: err(f, '-', 'skillDays', f'has {len(S)}, need chapterDays = {cd}')
        for n, x in enumerate(L, 1):
            if not isinstance(x, dict): err(f, f'#{n}', '-', 'lesson is not an object'); continue
            lesson(f, lv, ch, n, x, R); unique(f, x.get('id'))
            out_lessons.append({**x, 'chapterTitle': C.get('title')})
        for k, x in enumerate(S, 1):
            if not isinstance(x, dict): err(f, f'#d{k}', '-', 'skill day is not an object'); continue
            skillday(f, lv, ch, k, x, R); unique(f, x.get('id'))
            out_skills.append(x)
        ln += len(L); sk += len(S)
    mpath = CONTENT / lv / 'mocks.json'
    f = mpath.relative_to(ROOT)
    M = load(mpath) if mpath.exists() else []
    if not mpath.exists() and not PARTIAL: err(f, '-', '-', 'mocks file missing')
    if not isinstance(M, list): err(f, '-', '-', 'must be an array'); M = []
    if not PARTIAL and len(M) != LV['mockDays']: err(f, '-', '-', f'has {len(M)} mocks, need mockDays = {LV["mockDays"]}')
    for i, m in enumerate(M, 1):
        mid = m.get('id') if isinstance(m, dict) else None
        if mid != f'{lv}-mock-{i}': err(f, mid, 'id', f'expected {lv}-mock-{i}')
        if not isinstance(m, dict): continue
        unique(f, mid)
        if m.get('level') != lv: err(f, mid, 'level', f'expected {lv}')
        if not nonempty(m.get('title')): err(f, mid, 'title', 'missing')
        secs = m.get('sections') if isinstance(m.get('sections'), list) else []
        if not any(s.get('skill') == 'grammar' for s in secs): err(f, mid, 'sections', 'grammar section required')
        total = 0
        for si, s in enumerate(secs):
            if s.get('skill') not in ('reading', 'listening', 'writing', 'grammar'): err(f, mid, f'sections[{si}].skill', f'unknown skill {s.get("skill")!r}')
            total += len(questions(f, mid, f'sections[{si}].questions', s.get('questions'), minimum=1))
        if total < 40: err(f, mid, 'sections', f'{total} questions, need at least 40')
        text_checks(f, mid, m)
        out_mocks.append(m)
    summary.append(f'{lv}: {ln} lessons, {sk} skill days, {len(M)} mocks')

# ---------- core grammar tables (optional file)
gt_path = CONTENT / 'grammar-tables.json'
grammar_tables = (load(gt_path) if gt_path.exists() else None) or []
f = gt_path.relative_to(ROOT)
if not isinstance(grammar_tables, list): err(f, '-', '-', 'must be an array'); grammar_tables = []
level_ids, gt_ids = {L['id'] for L in levels['levels']}, set()
is_cell = lambda c: nonempty(c) or c in ('', '—') or (isinstance(c, dict) and set(c) == {'t', 'g'} and nonempty(c['t']) and c['g'] in ('m', 'f', 'n', 'pl'))
for i, T in enumerate(grammar_tables):
    if not isinstance(T, dict): err(f, f'#{i}', '-', 'table is not an object'); continue
    tid = T.get('id')
    for lid_ in T.get('lessons') or []:
        if lid_ not in ids: err(f, tid, 'lessons', f'unknown lesson {lid_}')
    if not nonempty(tid) or tid in gt_ids: err(f, tid, 'id', 'missing or duplicate id')
    gt_ids.add(tid)
    if T.get('level') not in level_ids: err(f, tid, 'level', f'unknown level {T.get("level")!r}')
    for k in ('group', 'title', 'why', 'chapter'):
        if not nonempty(T.get(k)): err(f, tid, k, 'missing or empty')
    H, rows = T.get('headers'), T.get('rows')
    if not (isinstance(H, list) and H and all(nonempty(h) for h in H)): err(f, tid, 'headers', 'need a list of non-empty strings'); H = []
    if not (isinstance(rows, list) and rows): err(f, tid, 'rows', 'need at least one row'); rows = []
    for r, row in enumerate(rows):
        if not (isinstance(row, list) and len(row) == len(H)): err(f, tid, f'rows[{r}]', f'need {len(H)} cells like the headers')
        elif not all(is_cell(c) for c in row): err(f, tid, f'rows[{r}]', 'cell must be a string or {"t":text,"g":"m|f|n|pl"}')
    if not (isinstance(T.get('notes'), list) and all(nonempty(x) for x in T['notes'])): err(f, tid, 'notes', 'need a list of strings')
    exs = T.get('examples')
    if not (isinstance(exs, list) and len(exs) == 2 and all(isinstance(e, dict) and nonempty(e.get('de')) and nonempty(e.get('en')) for e in exs)):
        err(f, tid, 'examples', 'need exactly 2 {de, en} examples')
    vids = T.get('videos', [])
    if not (isinstance(vids, list) and len(vids) <= 2): err(f, tid, 'videos', 'need a list of at most 2 keys'); vids = []
    for k in vids:
        entry = (resources.get('videos') or {}).get(k)
        if not (isinstance(entry, dict) and entry.get('ok') is True): err(f, tid, 'videos', f'{k!r} is not an ok entry in resources.json videos')
        else: used['videos'].add(k)
    text_checks(f, tid, T)
if grammar_tables: summary.append(f'grammar tables: {len(grammar_tables)}')

for w in warnings: print('WARNING', w)
if errors:
    print('\n'.join(errors)); print(f'\n{len(errors)} error(s). Nothing written.'); sys.exit(1)

def qcount(x):
    if isinstance(x, dict): return (1 if x.get('type') in ('choice', 'build', 'type') and 'prompt' in x else 0) + sum(qcount(v) for v in x.values())
    if isinstance(x, list): return sum(qcount(v) for v in x)
    return 0

data = {'levels': levels, 'lessons': out_lessons, 'skillDays': out_skills, 'mocks': out_mocks,
        'resources': {g: {k: resources[g][k] for k in sorted(used[g])} for g in MEDIA.values()}, 'partial': PARTIAL, 'grammarTables': grammar_tables}
js = 'window.GERMAN_FULL_DATA=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n'
(ROOT / 'dist').mkdir(exist_ok=True)
(ROOT / 'dist' / 'full-content.js').write_text(js, encoding='utf-8')
# cache-busting: stamp each local script/css in index.html with a hash of its content, so browsers load new versions
import hashlib
idx = ROOT / 'dist' / 'index.html'
if idx.exists():
    h = idx.read_text(encoding='utf-8')
    h = re.sub(r'(src|href)="([\w-]+\.(?:js|css))(?:\?v=\w+)?"', lambda m: f'{m[1]}="{m[2]}?v={hashlib.md5((ROOT / "dist" / m[2]).read_bytes()).hexdigest()[:8]}"' if (ROOT / 'dist' / m[2]).exists() else m[0], h)
    h = re.sub(r'name="build" content="\w+"', 'name="build" content="' + hashlib.md5(''.join(re.findall(r'\?v=(\w+)', h)).encode()).hexdigest()[:8] + '"', h)
    idx.write_text(h, encoding='utf-8')
print('\n'.join(summary))
print(f'vocab {sum(len(l.get("vocabulary") or []) for l in out_lessons)} | questions {qcount(out_lessons) + qcount(out_skills) + qcount(out_mocks)} | partial {PARTIAL}')
print(f'wrote dist/full-content.js ({len(js.encode())} bytes)')
