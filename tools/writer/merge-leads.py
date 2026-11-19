# usage: merge-leads.py [--check] NN [NN...] -> sets cards[i].lead (i>=1) from SP/leads/chNN.json; --check only validates
import json,sys,os,re
SP=os.path.dirname(os.path.abspath(__file__)); ROOT='/Users/atishmondi/Documents/german/sites/german-current'
check='--check' in sys.argv; chs=[a for a in sys.argv[1:] if a!='--check']; bad=0
BANNED=re.compile(r'\b(blind|skill day|recall|retrieval)\b',re.I)
for nn in chs:
    src=f'{ROOT}/content/a1/ch{nn}.json'; C=json.load(open(src)); D=json.load(open(f'{SP}/leads/ch{nn}.json'))
    for l in C['lessons']:
        cards=[c for c in l['cards'] if not c.get('intro')]; got=D.get(l['id'])
        if not got or len(got)!=len(cards): print(l['id'],f'need {len(cards)} leads, got {len(got or [])}'); bad+=1; continue
        for c,g in zip(cards,got):
            w=len(g.get('lead','').split())
            if g.get('title')!=c['title']: print(l['id'],'title mismatch:',g.get('title'),'!=',c['title']); bad+=1
            elif not 12<=w<=45: print(l['id'],c['title'],f'lead has {w} words (12-45)'); bad+=1
            elif BANNED.search(g['lead']): print(l['id'],c['title'],'banned word'); bad+=1
            elif not check: c['lead']=g['lead'].strip()
    if not check and not bad:
        json.dump(C,open(src,'w'),ensure_ascii=False,indent=1); open(src,'a').write('\n'); print('merged',nn)
if check and not bad: print('clean for',' '.join(chs))
sys.exit(1 if bad else 0)
