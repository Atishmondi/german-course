#!/usr/bin/env python3
"""Cross-check every German string in content/ against three independent sources:
  1. LanguageTool (grammar + spelling, public API)
  2. macOS spell checker, German dictionary (local, via tools/spell-de.swift)
  3. German Wiktionary (noun gender + plural for every vocabulary noun; cached)
Writes active/german-report.md. Exit 1 if anything is flagged that isn't in tools/german-ok.txt.
Usage: python3 tools/check-german.py [content/a1/ch01.json ...]   (default: all content/*/ch*.json)
Network needed for 1 and 3; the compiler stays offline on purpose.
"""
import json, re, subprocess, sys, time, unicodedata, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / 'tools'
CACHE = TOOLS / '.cache'; CACHE.mkdir(exist_ok=True)
UA = {'User-Agent': 'german-course-checker/1.0 (personal study project)'}
OK = {l.strip() for l in (TOOLS / 'german-ok.txt').read_text(encoding='utf-8').splitlines()
      if l.strip() and not l.startswith('#')} if (TOOLS / 'german-ok.txt').exists() else set()
GERMAN_KEYS = {'de', 'text', 'script', 'model', 'wrong', 'right'}

def walk(v, path, out):
    """Collect (path, german_text). Keys in GERMAN_KEYS are German; type-question answers too."""
    if isinstance(v, dict):
        for k, x in v.items():
            p = f'{path}.{k}'
            if k == 'deeper' and isinstance(x, dict): walk(x.get('example'), f'{p}.example', out)  # deeper.text is English
            elif k in GERMAN_KEYS and isinstance(x, str): out.append((p, x))
            elif k == 'answers' and isinstance(x, list) and x and isinstance(x[0], str): out.append((f'{p}[0]', x[0]))  # [1:] are deliberate variants (ss, oe...)
            else: walk(x, p, out)
    elif isinstance(v, list):
        for i, x in enumerate(v): walk(x, f'{path}[{i}]', out)

def sentences(files):
    out = []
    for f in files:
        d = json.loads(Path(f).read_text(encoding='utf-8'))
        for L in (d if isinstance(d, list) else d.get('lessons', []) + d.get('skillDays', [])): walk(L, L['id'], out)  # list = mocks.json
    seen, uniq = set(), []
    for p, t in out:
        # listening scripts: drop "Mira:" speaker labels; skip deliberate wrong forms (mistake.wrong, ❌ examples)
        t = re.sub(r'^\s*[A-ZÄÖÜ][\wäöüß]*( [A-ZÄÖÜ][\wäöüß]*)?:\s*', '', t, flags=re.M).strip()
        if not t or p.endswith('.wrong') or '❌' in t: continue
        t = unicodedata.normalize('NFC', t).replace('\n\n', '\n').replace('\n', '\n\n')  # each line = own paragraph (notice headings)
        if t not in seen: seen.add(t); uniq.append((p, t))
    return uniq

def languagetool(items):
    flags = []
    chunk, size = [], 0
    def send(chunk):
        text = '\n\n'.join(t for _, t in chunk)
        data = urllib.parse.urlencode({'language': 'de-DE', 'text': text, 'disabledCategories': 'TYPOGRAPHY,STYLE,REDUNDANCY,COLLOQUIALISMS', 'disabledRules': 'UPPERCASE_SENTENCE_START,GERMAN_WORD_REPEAT_BEGINNING_RULE,DE_SENTENCE_WHITESPACE'}).encode()
        for attempt in range(3):
            try:
                r = json.load(urllib.request.urlopen(urllib.request.Request('https://api.languagetool.org/v2/check', data, UA), timeout=60)); break
            except Exception as e:
                if attempt == 2: flags.append(('?', '', f'LanguageTool unreachable: {e}')); return
                time.sleep(10)
        starts, pos = [], 0
        for p, t in chunk: starts.append((pos, p, t)); pos += len(t) + 2
        for m in r.get('matches', []):
            o = m['offset']; p, t, s0 = next(((p, t, s) for s, p, t in reversed(starts) if s <= o), starts[0][1:] + (0,))
            bad = t[o - s0:o - s0 + m['length']]
            if bad in OK: continue
            sug = ', '.join(x['value'] for x in m.get('replacements', [])[:3])
            flags.append((p, t, f"LanguageTool: \"{bad}\" — {m['message']}" + (f' (try: {sug})' if sug else '')))
        time.sleep(3.5)  # public API: max 20 requests/min
    for it in items:
        if size + len(it[1]) > 5000: send(chunk); chunk, size = [], 0
        chunk.append(it); size += len(it[1]) + 2
    if chunk: send(chunk)
    return flags

def macos_spell(items):
    words = sorted({w for _, t in items for w in re.findall(r"[A-Za-zÄÖÜäöüß]+", t) if len(w) > 1 and w not in OK})
    try:
        r = subprocess.run(['swift', str(TOOLS / 'spell-de.swift')], input='\n'.join(words), capture_output=True, text=True, timeout=300)
    except Exception as e:
        return [('?', '', f'macOS spell checker unavailable: {e}')]
    bad = set(r.stdout.split())
    return [(p, t, f'macOS spelling: "{w}"') for w in sorted(bad) for p, t in items[:] if re.search(rf'\b{re.escape(w)}\b', t)][:200]

def wiktionary(files):
    cache_f = CACHE / 'wiktionary.json'
    cache = json.loads(cache_f.read_text()) if cache_f.exists() else {}
    flags, gmap = [], {'m': 'der', 'f': 'die', 'n': 'das'}
    for f in files:
        d = json.loads(Path(f).read_text(encoding='utf-8'))
        for L in (d.get('lessons', []) if isinstance(d, dict) else []):
            for i, v in enumerate(L.get('vocabulary', [])):
                w, art = v.get('de'), v.get('article')
                if not (w and art in gmap.values()) or ' ' in w or w in OK: continue  # OK = checked by hand
                if not cache.get(w):  # empty = earlier failure (rate limit); never trust a cached miss
                    q = urllib.parse.urlencode({'action': 'parse', 'page': w, 'prop': 'wikitext', 'format': 'json', 'redirects': 1})
                    for attempt in range(4):
                        try:
                            r = json.load(urllib.request.urlopen(urllib.request.Request(f'https://de.wiktionary.org/w/api.php?{q}', headers=UA), timeout=30))
                            if 'parse' in r: cache[w] = r['parse']['wikitext']['*']; break
                            if r.get('error', {}).get('code') == 'missingtitle': cache[w] = ''; break
                        except Exception as e: err_msg = str(e)
                        time.sleep(3 * (attempt + 1))
                    else: flags.append((L['id'], w, 'Wiktionary unreachable (rate limited), run again later')); continue
                    time.sleep(1)
                wt = cache.get(w, '')
                box = re.search(r'\{\{Deutsch Substantiv Übersicht(.*?)\}\}', wt, re.S)
                where = f"{L['id']}.vocabulary[{i}]"
                if not box: flags.append((where, w, 'Wiktionary: no German noun entry found (check spelling/capital letter)')); continue
                genera = {gmap[g] for g in re.findall(r'Genus(?: \d)?\s*=\s*([mfn])', box.group(1))}
                if genera and art not in genera: flags.append((where, w, f'Wiktionary: gender is {"/".join(sorted(genera))}, lesson says {art}'))
                pl = re.findall(r'Nominativ Plural(?: \d)?\s*=\s*([^\n|]+)', box.group(1))
                mine = re.sub(r'^die\s+', '', v.get('plural') or '').strip()
                pls = {p.strip() for p in pl if p.strip() and p.strip() != '—'}
                if mine and pls and mine not in pls and f'{w} (no plural)' not in OK:
                    flags.append((where, w, f'Wiktionary: plural is {" / ".join(sorted(pls))}, lesson says {mine}'))
    cache_f.write_text(json.dumps(cache, ensure_ascii=False))
    return flags

def articles(items):
    """der/die/das + a course noun whose gender (from the vocabulary lists) can't take that article in any case."""
    gender, plurals = {}, set()
    for f in sorted((ROOT / 'content').glob('*/ch*.json')):
        for L in json.loads(f.read_text(encoding='utf-8')).get('lessons', []):
            for v in L.get('vocabulary', []):
                if v.get('article') in ('der', 'die', 'das') and ' ' not in v.get('de', ''): gender[v['de']] = v['article']
                plurals.add(re.sub(r'^die\s+', '', v.get('plural') or '').strip())
    flags = []
    for p, t in items:
        for m in re.finditer(r'\b(der|die|das|Der|Die|Das)\s+([A-ZÄÖÜ][a-zäöüß]+)\b', t):
            art, noun = m.group(1).lower(), m.group(2)
            start = not re.search(r'[^.!?:\s]', t[:m.start()].rsplit('.', 1)[-1].split('?')[-1].split('!')[-1].split(':')[-1])
            g = gender.get(noun)
            if not g or g == art or noun in plurals: continue
            if re.search(r',\s*$', t[:m.start()]): continue  # ", das Frau Weber mag": relative pronoun, not the noun's article
            # das never fits m/f; der fits f only as dative/genitive (not sentence-initial); die fits m/n only in plural
            if art == 'das' or art == 'die' or (art == 'der' and (g == 'das' or start)):
                flags.append((p, t, f'article: "{m.group(1)} {noun}" but {noun} is {g}'))
    return flags

def main():
    files = sys.argv[1:] or sorted(str(p) for p in (ROOT / 'content').glob('*/ch*.json')) + sorted(str(p) for p in (ROOT / 'content').glob('*/mocks.json'))
    items = sentences(files)
    print(f'{len(items)} German strings from {len(files)} file(s)')
    groups = {'LanguageTool (grammar + spelling)': languagetool(items),
              'macOS German spell checker': macos_spell(items),
              'Wiktionary (noun gender + plural)': wiktionary(files),
              'Article + noun gender in sentences': articles(items)}
    lines = ['# German check report', '', f'{len(items)} strings checked. Three independent sources; a string flagged by 2+ sources is most likely wrong.',
             'Add false alarms (names, chosen spellings) to tools/german-ok.txt, one word per line.', '']
    hits = {}
    for name, fl in groups.items():
        lines += [f'## {name}: {len(fl)} flag(s)', ''] + [f'- `{p}` {msg}' + (f' — “{t}”' if t and t != msg else '') for p, t, msg in fl] + ['']
        for p, t, _ in fl: hits.setdefault(t, set()).add(name)
    multi = [t for t, s in hits.items() if len(s) > 1]
    lines[3:3] = ['', f'**Flagged by 2+ sources: {len(multi)}**'] + [f'- “{t}”' for t in multi]
    (ROOT / 'active' / 'german-report.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    total = sum(len(v) for v in groups.values())
    print(f'{total} flag(s) ({len(multi)} by 2+ sources) → active/german-report.md')
    sys.exit(1 if total else 0)

if __name__ == '__main__':
    main()
