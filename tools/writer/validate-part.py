# usage: validate-part.py NN 1 2 3 d1 -> compiles whatever drafts exist for chNN in a temp root; prints only lines about the given lessons/day
import json,sys,glob,os,subprocess,tempfile,shutil
SP=os.path.dirname(os.path.abspath(__file__)); ROOT='/Users/atishmondi/Documents/german/sites/german-current'
LV=os.environ.get('LEVEL','a1'); nn=int(sys.argv[1]); ids=[f'{LV}-c{nn:02d}-'+(a if a.startswith('d') else f'{int(a):02d}') for a in sys.argv[2:]]
d=f'{SP}/drafts/ch{nn:02d}' if LV=='a1' else f'{SP}/drafts/{LV}-ch{nn:02d}'; T=tempfile.mkdtemp()
os.makedirs(f'{T}/content/{LV}',exist_ok=True); os.makedirs(f'{T}/content/a1',exist_ok=True); os.makedirs(f'{T}/dist'); shutil.copy(f'{ROOT}/compile-course.py',T)
for f in glob.glob(f'{ROOT}/content/*.json'): shutil.copy(f,f'{T}/content/')
for f in glob.glob(f'{ROOT}/content/*/ch*.json')+glob.glob(f'{ROOT}/content/*/mocks.json'):
    lv=os.path.basename(os.path.dirname(f)); os.makedirs(f'{T}/content/{lv}',exist_ok=True)
    if lv!=LV or ('/ch' in f and int(os.path.basename(f)[2:4])<nn): shutil.copy(f,f'{T}/content/{lv}/')
L=[];S=[]
for p in sorted(glob.glob(f'{d}/lesson-*.json'))+sorted(glob.glob(f'{d}/day-*.json')):
    try: x=json.load(open(p))
    except Exception as e: print('JSON ERROR',p,e); continue
    (S if 'day-' in p else L).append(x)
json.dump({'level':LV,'chapter':nn,'title':'x','printedPages':[1,2],'lessons':L,'skillDays':S},open(f'{T}/content/{LV}/ch{nn:02d}.json','w'),ensure_ascii=False)
r=subprocess.run(['python3',f'{T}/compile-course.py','--partial','--root',T],capture_output=True,text=True)
out=[l for l in (r.stdout+r.stderr).splitlines() if any(i in l for i in ids)]
print('\n'.join(out) if out else 'no errors for '+' '.join(ids)); shutil.rmtree(T)
