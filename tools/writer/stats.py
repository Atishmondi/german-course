import json,sys
for f in sys.argv[1:]:
    C=json.load(open(f)); L=C['lessons']
    def avg(xs): return round(sum(xs)/max(1,len(xs)),1)
    cards=[len(l['cards']) for l in L]
    ex=[len(c.get('examples',[])) for l in L for c in l['cards']]
    partsEx=sum(1 for l in L for c in l['cards'] for e in c.get('examples',[]) if e.get('parts'))
    totEx=sum(ex)
    words=[len(c['body'].split()) for l in L for c in l['cards']]
    more=[len(c.get('more','').split()) for l in L for c in l['cards']]
    tables=sum(1 for l in L for c in l['cards'] if c.get('table'))
    steps=sum(1 for l in L for c in l['cards'] if c.get('steps'))
    q=lambda l: len(l['drills'])+len(l['check'])+1+len(l['retrieval'])
    types={}
    for l in L:
        for x in l['drills']+l['check']: types[x['type']]=types.get(x['type'],0)+1
    S=C['skillDays']
    rw=[len(s['reading']['text'].split()) for s in S]
    print(f"{f}: lessons={len(L)} days={len(S)} cards/lesson={avg(cards)} ex/card={avg(ex)} parts={partsEx}/{totEx} body_w={avg(words)} more_w={avg(more)} tables={tables} steps={steps}")
    print(f"   drills/l={avg([len(l['drills']) for l in L])} check/l={avg([len(l['check']) for l in L])} vocab/l={avg([len(l['vocabulary']) for l in L])} q/lesson={avg([q(l) for l in L])} types={types} videos/l={avg([len(l['media']['grammarVideos']) for l in L])} nw/l={avg([len(l['media'].get('nicosWeg',[])) for l in L])} practice/l={avg([len(l['media'].get('practice',[])) for l in L])}")
    print(f"   reading words={rw} skillQ={[len(s['reading']['questions'])+len(s['listening']['questions'])+len(s['writing']['items']) for s in S]} minutes={[l.get('minutes') for l in L]}")
