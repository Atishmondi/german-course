# usage: validate-mock.py N [N...] -> compiles SP/mocks/mock-N.json files as content/a1/mocks.json in a temp root; prints mock lines
import json,sys,os,glob,subprocess,tempfile,shutil
SP=os.path.dirname(os.path.abspath(__file__)); ROOT='/Users/atishmondi/Documents/german/sites/german-current'
ns=sys.argv[1:]; T=tempfile.mkdtemp(); os.makedirs(f'{T}/content/a1'); os.makedirs(f'{T}/dist'); shutil.copy(f'{ROOT}/compile-course.py',T)
for f in glob.glob(f'{ROOT}/content/*.json'): shutil.copy(f,f'{T}/content/')
for f in glob.glob(f'{ROOT}/content/a1/ch*.json'): shutil.copy(f,f'{T}/content/a1/')
M=[]
for n in sorted(set(ns)|{str(i) for i in range(1,int(max(ns))+1)}, key=int):
    p=f'{SP}/mocks/mock-{n}.json'
    if os.path.exists(p): M.append(json.load(open(p)))
    else: M.append({'id':f'a1-mock-{n}','level':'a1','title':'placeholder','sections':[]})
json.dump(M,open(f'{T}/content/a1/mocks.json','w'),ensure_ascii=False)
r=subprocess.run(['python3',f'{T}/compile-course.py','--partial','--root',T],capture_output=True,text=True)
out=[l for l in (r.stdout+r.stderr).splitlines() if any(f'a1-mock-{n}' in l for n in ns)]
print('\n'.join(out) if out else 'clean for mock '+' '.join(ns)); shutil.rmtree(T)
