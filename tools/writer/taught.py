import json,sys
for f in sys.argv[1:]:
    C=json.load(open(f))
    print(f"=== ch{C['chapter']:02d} {C['title']}")
    for l in C['lessons']:
        g=l['grammar']
        print(f"- {l['id']} {l['title']}\n  grammar: {g['point']} | {g['oneLine']}")
        print("  terms:", '; '.join(t['term'] for t in l.get('terms',[])))
        print("  cards:", ' / '.join(c['title'] for c in l['cards']))
        print("  vocab:", ', '.join((w.get('article','')+' '+w['de']).strip() for w in l['vocabulary']))
