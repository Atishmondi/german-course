"""Flag questions that give their own answer away (A1 + A2 content).
Usage: python3 tools/giveaways.py [files...]  -> prints flags, exit 1 if any."""
import json, re, sys, glob
def norm(s): return re.sub(r'[^\wäöüß ]', '', str(s).lower()).strip()
def words(s): return set(norm(s).split())
def qs(obj, path=''):
    if isinstance(obj, dict):
        if obj.get('type') in ('type', 'choice', 'build') and 'prompt' in obj: yield path, obj
        for k, v in obj.items(): yield from qs(v, f'{path}.{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj): yield from qs(v, f'{path}[{i}]')
def check(q):
    p = q['prompt']; out = []
    br = re.findall(r'\(([^()]*)\)\s*$', p.strip())
    if q['type'] == 'type':
        ans = [norm(a) for a in q.get('answers', [])]
        stem = re.sub(r'\([^()]*\)\s*$', '', p)
        if br and any(a and a == norm(br[0]) for a in ans): out.append('answer = bracket hint')
        if '___' in p and not p.lower().startswith(('write in german', 'translate')):
            for a in ans:
                if a and len(a.split()) == 1 and a in words(stem.replace('___', ' ')): out.append(f'answer "{a}" already in prompt')
    elif q['type'] == 'choice':
        right = q['options'][q['answer']] if isinstance(q.get('answer'), int) else None
        if right and len(norm(right)) > 3 and norm(right) in norm(p) and sum(norm(o) in norm(p) for o in q['options']) == 1:
            out.append('right option copied in prompt')
    return out
import os
OK = set(open(os.path.join(os.path.dirname(__file__), 'giveaways-ok.txt')).read().split('\n')) if os.path.exists(os.path.join(os.path.dirname(__file__), 'giveaways-ok.txt')) else set()
if __name__ == '__main__':
    files = sys.argv[1:] or sorted(glob.glob('content/a1/ch*.json') + glob.glob('content/a2/ch*.json'))
    n = 0
    for f in files:
        for path, q in qs(json.load(open(f))):
            if f'{f.split("/")[-2]}/{f.split("/")[-1]}{path}' in OK: continue
            for why in check(q):
                n += 1; print(f'{f.split("/")[-2]}/{f.split("/")[-1]}{path}: {why} :: {q["prompt"][:90]}')
    print(f'{n} giveaway flag(s)'); sys.exit(1 if n else 0)
