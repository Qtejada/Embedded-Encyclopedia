"""Validate independent circuit checks and refined runs before exporting data."""
from pathlib import Path
from bisect import bisect_right
import math, cmath, json, csv, re, hashlib, zipfile
from ltspice_library import ROOT, WORK, DEST

def raw(path):
 head,body=path.read_text(encoding='ascii').split('Values:\n',1)
 names=[s.split()[1].lower() for s in head.split('Variables:\n')[1].strip().splitlines()]
 offset=float(re.search(r'Offset:\s*(\S+)',head)[1]) if 'Offset:' in head else 0
 n=len(names);lines=body.strip().splitlines();assert len(lines)%n==0
 runs=[[]]
 def val(s):
  s=s.strip().strip('()')
  return complex(*map(float,s.split(','))) if ',' in s else complex(float(s))
 for i in range(0,len(lines),n):
  values=[val(lines[i].split()[1])]+[val(s) for s in lines[i+1:i+n]]
  values[0]+=offset
  assert all(math.isfinite(v.real) and math.isfinite(v.imag) for v in values)
  row=dict(zip(names,values));row['axis']=values[0].real
  if runs[-1] and row['axis']<runs[-1][-1]['axis']-1e-12:runs.append([])
  runs[-1].append(row)
 return names,runs

def value(row,key):
 key=key.lower()
 if key.startswith('-'):return -value(row,key[1:])
 if '*' in key:
  a,b=key.split('*',1);return value(row,a)*value(row,b)
 for prefix in ['db','ph','abs']:
  if key.startswith(prefix+'('):
   v=value(row,key[len(prefix)+1:-1])
   return 20*math.log10(max(abs(v),1e-30)) if prefix=='db' else math.degrees(cmath.phase(v)) if prefix=='ph' else abs(v)
 if key.startswith('v(') and ',' in key:
  a,b=key[2:-1].split(',');return row.get('v('+a+')',0)-row.get('v('+b+')',0)
 return row[key]

class Interpolator:
 def __init__(self,rows):self.rows=rows;self.axes=[r['axis'] for r in rows]
 def at(self,t,key):
  for prefix in ['db','ph','abs']:
   if key.lower().startswith(prefix+'('):
    v=self.at(t,key[len(prefix)+1:-1])
    return 20*math.log10(max(abs(v),1e-30)) if prefix=='db' else math.degrees(cmath.phase(v)) if prefix=='ph' else abs(v)
  i=min(max(bisect_right(self.axes,t)-1,0),len(self.rows)-2)
  a,b=self.rows[i:i+2];delta=b['axis']-a['axis']
  f=max(0,min(1,(t-a['axis'])/delta)) if delta else 0
  return value(a,key)+f*(value(b,key)-value(a,key))

def scalar(v):return v.real if isinstance(v,complex) else v
def num(s):
 if isinstance(s,(int,float)):return float(s)
 m=re.fullmatch(r'([\d.eE+\-]+)([a-zA-Z]*)',s)
 return float(m[1])*{'':1,'k':1e3,'meg':1e6,'m':1e-3,'u':1e-6,'n':1e-9,'p':1e-12}[m[2].lower()]
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()

specs=json.loads((ROOT/'scripts/ltspice-library-spec.json').read_text(encoding='utf-8'))
registry={}; failures=[]
for spec in specs:
 slug=spec['slug'];folder=DEST/slug
 try:
  net=(WORK/(slug+'.net')).read_bytes().decode('utf-8',errors='replace').replace('\ufffd','u').replace('\u00b5','u').replace('\u00a7','')
  lines=[' '.join(s.lower().split()) for s in net.splitlines()]
  for expected in spec['expected']:
   assert ' '.join(expected.lower().split()) in lines,('connectivity',expected)
  for stem in [slug,slug+'-refined']:
   log=(WORK/(stem+'.log')).read_text(encoding='cp1252')
   assert 'Total elapsed time:' in log
   # LTspice can recover from a failed initial Newton/Gmin attempt through source stepping.
   fatal_log='\n'.join(line for line in log.splitlines() if not line.startswith(('Direct Newton iteration failed','Gmin stepping failed')))
   assert not re.search(r'(?im)^.*(?:fatal|singular matrix|failed|error:|timestep too small).*$',fatal_log),log
  names,runs=raw(WORK/(slug+'.raw'));_,tight=raw(WORK/(slug+'-refined.raw'))
  assert len(runs)==len(tight)==(len(spec['sweep']['values']) if spec['sweep'] else 1)
  # Confirm that saved results correspond to the exact inputs that were run.
  for file in [slug+'.asc',slug+'-refined.cir']:
   assert digest(WORK/file).upper()==(WORK/(file+'.verified-input-hash')).read_text().strip()
  keys=list(dict.fromkeys(t[0] for g in spec['groups'] for t in g['traces']))
  cases=[];checks=[]
  for index,(rows,refined) in enumerate(zip(runs,tight)):
   normal,fine=Interpolator(rows),Interpolator(refined)
   start=max(spec['start'],rows[0]['axis'],refined[0]['axis'])
   stop=min(spec['stop'],rows[-1]['axis'],refined[-1]['axis'])
   if spec['analysis']=='ac':grid=[10**(math.log10(start)+i/600*math.log10(stop/start)) for i in range(601)]
   elif spec['analysis']=='dc':grid=[r['axis'] for r in rows]
   else:grid=[start+(stop-start)*i/2000 for i in range(2001)]
   deltas={}
   for key in keys:
    a=[normal.at(t,key) for t in grid];b=[fine.at(t,key) for t in grid]
    # Phase is periodic. Compare its shortest angular difference.
    differences=[abs((scalar(u)-scalar(v)+180)%360-180) if key.lower().startswith('ph(') else abs(u-v) for u,v in zip(a,b)]
    scale=max(max(abs(v) for v in a),max(abs(v) for v in b),1e-5)
    rms=math.sqrt(sum(d*d for d in differences)/len(grid))
    limit=.015 if spec['analysis']=='tran' else .003
    assert rms/scale<limit,(key,'refinement RMS',rms/scale)
    deltas[key]=dict(max=max(differences),normalizedRms=rms/scale)
   stats=[];results=[]
   for test in spec['checks']:
    key,metric=test['trace'],test['metric']
    lo=test['lo'][index] if isinstance(test['lo'],list) else test['lo'];hi=test['hi'][index] if isinstance(test['hi'],list) else test['hi']
    if metric=='at': measured=scalar(normal.at(test['at'],key))
    elif metric=='width':
     vals=[scalar(value(r,key)) for r in rows];threshold=(max(vals)+min(vals))/2
     edges=[]
     for a,b,va,vb in zip(rows,rows[1:],vals,vals[1:]):
      if (va<threshold<=vb) or (va>=threshold>vb):
       edges.append((a['axis']+(b['axis']-a['axis'])*(threshold-va)/(vb-va),vb>va))
     rise=next(t for t,up in edges if up);fall=next(t for t,up in edges if not up and t>rise)
     measured=fall-rise
    else:
     sample=[scalar(normal.at(start+(stop-start)*(.5+i/2000),key)) for i in range(1001)]
     measured=max(sample) if metric=='max' else min(sample) if metric=='min' else max(sample)-min(sample) if metric=='pp' else sum(sample)/len(sample)
    assert lo<=measured<=hi,(key,metric,measured,'expected',lo,hi)
    results.append(dict(**test,value=measured))
    label=key+' '+('at '+str(test['at']) if metric=='at' else {'pp':'peak to peak','max':'maximum','min':'minimum','avg':'mean','width':'pulse width'}[metric])
    unit='s' if metric=='width' else 'A' if key.lower().startswith(('i(','id(','ic(','ib(','-i(')) else 'V/V' if key.startswith('abs(') else 'V'
    if slug=='transimpedance-amplifier' and key.startswith('abs('):unit='ohms'
    stats.append([label,measured,unit])
   points=[[float(f'{t*(1000 if spec["analysis"]=="tran" else 1):.10g}')]+[float(f'{scalar(normal.at(t,k)):.10g}') for k in keys] for t in grid]
   for column,key in enumerate(keys,1):
    if key.lower().startswith('ph('):
     for i in range(1,len(points)):
      while points[i][column]-points[i-1][column]>180:points[i][column]-=360
      while points[i][column]-points[i-1][column]<-180:points[i][column]+=360
   label=spec['sweep']['labels'][index] if spec['sweep'] else 'Nominal'
   cases.append(dict(value=num(spec['sweep']['values'][index]) if spec['sweep'] else 0,label=str(label),points=points,stats=stats))
   checks.append(dict(case=label,savedPoints=len(rows),refinement=deltas,checks=results))
  viewer=dict(title=spec['title'],kind='library',intro=spec['intro'],observation=spec['explanation'][0],parameter=spec['sweep']['name'] if spec['sweep'] else 'Run',
   analysis={'ac':'AC sweep','dc':'DC sweep','tran':'Transient'}[spec['analysis']],axis={'ac':'Frequency (Hz)','dc':'Source voltage (V)','tran':'Time (ms)'}[spec['analysis']],
   axisLabel={'ac':'Frequency','dc':'Source voltage','tran':'Time'}[spec['analysis']],axisUnit={'ac':'Hz','dc':'V','tran':'ms'}[spec['analysis']],logarithmic=spec['analysis']=='ac',
   keys=keys,groups=spec['groups'],cases=cases,schematic=spec['schematic'],detail=[v*1000 for v in spec['detail']] if spec['detail'] else None)
  (folder/'viewer.json').write_text(json.dumps(viewer,separators=(',',':'))+'\n',encoding='utf-8')
  with (folder/'results.csv').open('w',newline='',encoding='utf-8') as f:
   writer=csv.writer(f);complex_mode=spec['analysis']=='ac'
   writer.writerow(['case']+[n+suffix for n in names for suffix in (['_real','_imag'] if complex_mode else [''])])
   for index,rows in enumerate(runs):
    writer.writerows([[index+1]+[part for n in names for part in ([r[n].real,r[n].imag] if complex_mode else [r[n].real])] for r in rows])
  report=dict(simulator='LTspice 24.1.9',temperatureC=27,ascSha256=digest(folder/(slug+'.asc')),rawSha256=digest(WORK/(slug+'.raw')),cases=checks)
  (folder/'validation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
  expressions=[t[0] for t in spec['groups'][0]['traces']]
  traces=' '.join('{'+str(34603010+2*i)+',0,"'+s+'"}' for i,s in enumerate(expressions))
  columns=[keys.index(e)+1 for e in expressions]
  low=min(p[i] for c in cases for p in c['points'] for i in columns);high=max(p[i] for c in cases for p in c['points'] for i in columns)
  margin=(high-low or 1)*.15
  plt='['+{'ac':'AC Analysis','dc':'DC transfer characteristic','tran':'Transient Analysis'}[spec['analysis']]+']\n{\n Npanes: 1\n {\n  traces: '+str(len(expressions))+' '+traces+'\n'
  plt+=f"  X: (' ',0,{spec['start']},{(spec['stop']-spec['start'])/5},{spec['stop']})\n  Y[0]: (' ',0,{low-margin},{(high-low+2*margin)/5},{high+margin})\n"
  plt+="  Y[1]: ('_',0,1e+308,0,-1e+308)\n  Log: "+('1' if spec['analysis']=='ac' else '0')+' 0 0\n  GridStyle: 1\n }\n}\n'
  (folder/(slug+'.plt')).write_text(plt,encoding='ascii')
  readme=spec['title']+'\n\n'+spec['intro']+'\n\n'+'\n\n'.join(spec['explanation'])+'\n\n'
  readme+='Extract every file into one folder. Open '+slug+'.asc and select Run.\nUse View > Step Legend to identify parameter steps.\nIf no plot appears, open '+slug+'.plt through Plot Settings > Open Plot Settings File.\nDefault traces: '+', '.join(expressions)+'\n\n'
  readme+='Equal node labels connect. All semiconductor parameters are in the schematic.\nOp-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.\nThe CIR is the equivalent netlist. The CSV contains original saved samples.\nAC data use real and imaginary columns. Time values include the RAW offset.\nThe website interpolates saved samples. It does not execute LTspice.\n'
  (folder/'README.txt').write_text(readme,encoding='ascii')
  with zipfile.ZipFile(folder/(slug+'.zip'),'w',zipfile.ZIP_DEFLATED) as z:
   for name in [slug+'.asc',slug+'.cir',slug+'.plt','README.txt','results.csv','validation.json']:z.write(folder/name,slug+'/'+name)
  registry[slug]={k:spec[k] for k in ['title','article','intro','explanation']}
  print('PASS',slug)
 except Exception as exc:
  failures.append([slug,str(exc)]);print('FAIL',slug,str(exc))
(WORK/'export-status.json').write_text(json.dumps(dict(passed=list(registry),failed=failures),indent=2)+'\n',encoding='utf-8')
if failures:raise SystemExit(str(len(failures))+' circuits need correction. Registry not updated.')
(ROOT/'src/components/learning/data/circuit-library.json').write_text(json.dumps(registry,indent=2)+'\n',encoding='utf-8')
print('All',len(registry),'circuits passed.')
