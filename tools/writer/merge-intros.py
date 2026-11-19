# usage: merge-intros.py [--check] NN [NN...]  -> inserts SP/intros/chNN.json cards at cards[0] (replaces an existing intro); --check validates in a temp copy only
import json,sys,os,subprocess,tempfile,shutil
SP=os.path.dirname(os.path.abspath(__file__)); ROOT='/Users/atishmondi/Documents/german/sites/german-current'
check='--check' in sys.argv; chs=[a for a in sys.argv[1:] if a!='--check']
T=tempfile.mkdtemp() if check else None
if check:
    os.makedirs(f'{T}/content/a1'); shutil.copy(f'{ROOT}/compile-course.py',T)
    for f in os.listdir(f'{ROOT}/content'):
        if f.endswith('.json'): shutil.copy(f'{ROOT}/content/{f}',f'{T}/content/')
for nn in chs:
    src=f'{ROOT}/content/a1/ch{nn}.json'; C=json.load(open(src)); I=json.load(open(f'{SP}/intros/ch{nn}.json'))
    for l in C['lessons']:
        card=I.get(l['id'])
        if not card: print('MISSING intro for',l['id']); continue
        card['intro']=True
        if l['cards'] and l['cards'][0].get('intro'): l['cards'][0]=card
        else: l['cards'].insert(0,card)
    out=f'{T}/content/a1/ch{nn}.json' if check else src
    json.dump(C,open(out,'w'),ensure_ascii=False,indent=1); open(out,'a').write('\n')
if check:
    r=subprocess.run(['python3',f'{T}/compile-course.py','--partial','--root',T],capture_output=True,text=True)
    print('\n'.join(l for l in r.stdout.splitlines() if any(f'ch{nn}' in l for nn in chs) and 'first card must be' not in l) or 'clean for '+' '.join(chs))
    shutil.rmtree(T)
else: print('merged',chs)
