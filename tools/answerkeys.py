"""Flag choice questions whose explanation quotes exactly one option and that option is not the marked answer
(likely a wrong answer key, e.g. after options were re-shuffled). Usage: python3 tools/answerkeys.py [files]"""
import json, re, sys, glob
def norm(s): return re.sub(r'\s+', ' ', re.sub(r'[^\wäöüßÄÖÜ ]', ' ', str(s).lower())).strip()
def qs(o, p=''):
    if isinstance(o, dict):
        if o.get('type') == 'choice' and isinstance(o.get('options'), list) and isinstance(o.get('answer'), int): yield p, o
        for k, v in o.items(): yield from qs(v, f'{p}.{k}')
    elif isinstance(o, list):
        for i, v in enumerate(o): yield from qs(v, f'{p}[{i}]')
n = 0
for f in sys.argv[1:] or sorted(glob.glob('content/*/ch*.json') + glob.glob('content/*/mocks.json')):
    for p, q in qs(json.load(open(f))):
        ex = norm(q.get('explanation', ''))
        opts = [norm(o) for o in q['options']]
        hit = [i for i, o in enumerate(opts) if len(o) > 2 and re.search(r'(^| )' + re.escape(o) + r'( |$)', ex)]
        # ignore options contained in other options
        hit = [i for i in hit if not any(j != i and opts[i] in opts[j] and j in hit for j in hit)]
        if len(hit) == 1 and hit[0] != q['answer']:
            n += 1; print(f'{f.split("content/")[1]}{p}: marked {q["answer"]} "{q["options"][q["answer"]][:30]}" but explanation names {hit[0]} "{q["options"][hit[0]][:30]}" :: {q["prompt"][:60]}')
print(f'{n} suspicious answer key(s)')
