# Deterministically move the right choice to varied positions; keep fixed-order sets (der/die/das, er/sie/es, ja/nein) as they are.
import json,sys,hashlib
FIXED={'der','die','das','den','dem','ein','eine','einen','kein','keine','keinen','er','sie','es','ich','du','wir','ihr','Sie','ja','nein','doch','mich','dich','ihn','uns','euch'}
for f in sys.argv[1:]:
    C=json.load(open(f)); moved=0
    def walk(x):
        global moved
        if isinstance(x,dict):
            o=x.get('options')
            if x.get('type')=='choice' and isinstance(o,list) and len(o)>1 and not all(s.strip('.?!').lower() in {w.lower() for w in FIXED} for s in o):
                ok=o[x['answer']]; rest=[s for i,s in enumerate(o) if i!=x['answer']]
                k=int(hashlib.md5(x['prompt'].encode()).hexdigest(),16)%len(o)
                x['options']=rest[:k]+[ok]+rest[k:]; x['answer']=k; moved+=1
            for v in x.values(): walk(v)
        elif isinstance(x,list):
            for v in x: walk(v)
    walk(C); json.dump(C,open(f,'w'),ensure_ascii=False,indent=1); open(f,'a').write('\n'); print(f,'reordered',moved)
