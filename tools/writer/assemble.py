import json,sys,glob,os
SP=os.path.dirname(os.path.abspath(__file__)); ROOT='/Users/atishmondi/Documents/german/sites/german-current'
nn,title,p0,p1=int(sys.argv[1]),sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
d=f'{SP}/drafts/ch{nn:02d}'
L=[json.load(open(p)) for p in sorted(glob.glob(f'{d}/lesson-*.json'))]
S=[json.load(open(p)) for p in sorted(glob.glob(f'{d}/day-*.json'))]
C={'level':'a1','chapter':nn,'title':title,'printedPages':[p0,p1],'lessons':L,'skillDays':S}
out=f'{ROOT}/content/a1/ch{nn:02d}.json'
json.dump(C,open(out,'w'),ensure_ascii=False,indent=1); open(out,'a').write('\n')
print(f'wrote {out}: {len(L)} lessons, {len(S)} skill days')
