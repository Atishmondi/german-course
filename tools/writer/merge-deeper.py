# usage: merge-deeper.py [--check] NN [NN...] -> sets cards[i].deeper (i>=1) from SP/deeper/chNN.json
import json,sys,os,re,unicodedata
SP=os.path.dirname(os.path.abspath(__file__)); ROOT='/Users/atishmondi/Documents/german/sites/german-current'
ROLES=set('subject verb verb2 object dative article noun adjective ending question negation time place preposition conjunction other verbend genitive reflexive relative konj2 zu'.split())
BANNED=re.compile(r'\b(blind|skill day|recall|retrieval)\b',re.I)
check='--check' in sys.argv; chs=[a for a in sys.argv[1:] if a!='--check']; bad=0
for nn in chs:
    src=f'{ROOT}/content/a1/ch{nn}.json'; C=json.load(open(src)); D=json.load(open(f'{SP}/deeper/ch{nn}.json'))
    for l in C['lessons']:
        cards=[c for c in l['cards'] if not c.get('intro')]; got=D.get(l['id'])
        if not got or len(got)!=len(cards): print(l['id'],f'need {len(cards)}, got {len(got or [])}'); bad+=1; continue
        for c,g in zip(cards,got):
            d=g.get('deeper') or {}; ex=d.get('example') or {}; w=len(d.get('text','').split()); P=ex.get('parts') or []
            de=unicodedata.normalize('NFC',ex.get('de',''))
            err=None
            if g.get('title')!=c['title']: err=f'title mismatch: {g.get("title")!r}'
            elif not 30<=w<=90: err=f'text has {w} words (40-80)'
            elif not (de and ex.get('en')): err='example needs de and en'
            elif any(len(p)!=2 or p[1] not in ROLES for p in P) or not P: err='bad parts roles'
            elif re.sub(r'[\W_]+','',''.join(p[0] for p in P).lower())!=re.sub(r'[\W_]+','',de.lower()): err=f'parts do not spell de: {de!r}'
            elif BANNED.search(d['text']): err='banned word'
            elif de in {e.get('de') for e in c.get('examples',[])}: err='example repeats a card example'
            if err: print(l['id'],c['title'],'->',err); bad+=1
            elif not check: ex['de']=de; c['deeper']={'text':d['text'].strip(),'example':ex}
    if not check and not bad:
        json.dump(C,open(src,'w'),ensure_ascii=False,indent=1); open(src,'a').write('\n'); print('merged',nn)
if check and not bad: print('clean for',' '.join(chs))
sys.exit(1 if bad else 0)
