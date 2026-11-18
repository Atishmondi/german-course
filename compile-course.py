"""Compile validated original A1 teaching assets into a buildless browser bundle."""
from pathlib import Path
import json,re

root=Path(__file__).parent
records=[]
for name in ['chapters-01-04.json','chapters-05-08.json','chapters-09-12.json','missions.json']:
    obj=json.loads((root/'content'/name).read_text())
    rows=obj if isinstance(obj,list) else obj.get('lessons',obj.get('records',[]))
    assert rows,name+' has no records'
    records.extend(rows)
ids=[r['id'] for r in records]
assert len(ids)==len(set(ids)),'Duplicate lesson IDs'
assert len([r for r in records if r['id'].startswith('c')])==72
for r in records:
    assert len(r['cards'])==2,r['id']
    assert all(len(c['examples'])>=2 and c['body'] for c in r['cards']),r['id']
    assert len(r['practice'])>=3 and len(r['retrieval'])>=3,r['id']
    assert len(r['reading']['questions'])==3 and len(r['listening']['questions'])==3,r['id']
    assert r['reading']['text']!=r['listening']['text'],r['id']+' same listening'
    assert len(r['vocabulary'])>=8,r['id']+' insufficient vocabulary'
    for w in r['vocabulary']:
        assert len(w['examples'])>=2 and w['en'],r['id']+' unexplained vocabulary'
    for q in [*r['practice'],r['blind'],*r['retrieval'],*r['reading']['questions'],*r['listening']['questions']]:
        if q['type']=='choice':assert 0<=q['answer']<len(q['options'])
        elif q['type']=='build':assert sorted(q['tokens'])==sorted(q['answer'])
        else:assert q['answers'],r['id']+' empty answer'
    assert r['writing']['answers'] and r['writing']['model'] in r['writing']['answers']
    assert not re.search('atish|mondi',json.dumps(r,ensure_ascii=False),re.I)
scope=json.loads((root/'content/scope-audit.json').read_text())
payload={'lessons':records,'scope':scope}
text='window.GERMAN_FULL_DATA='+json.dumps(payload,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n'
(root/'dist/full-content.js').write_text(text)
print(f'Compiled {len(records)} original lessons, {sum(len(r["vocabulary"]) for r in records)} vocabulary teaching entries.')
