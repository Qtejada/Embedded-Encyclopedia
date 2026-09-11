"""Schematic and netlist generation for the analog circuit library."""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[1]
WORK=ROOT/'tmp/ltspice-library'
DEST=ROOT/'static/simulations'
MODELS=[
 '.model Q_NPN NPN(Is=1e-14 Bf=150 Vaf=100 Cje=10p Cjc=4p Tf=300p)',
 '.model Q_PNP PNP(Is=1e-14 Bf=150 Vaf=100 Cje=10p Cjc=4p Tf=300p)',
 '.model M_NCHANNEL NMOS(Level=1 Vto=2 Kp=0.02 Lambda=0.01 Rd=0.1 Rs=0.1 Cbd=100p Cbs=100p)',
 '.model M_PCHANNEL PMOS(Level=1 Vto=-2 Kp=0.02 Lambda=0.01 Rd=0.1 Rs=0.1 Cbd=100p Cbs=100p)',
 '.model J_NCHANNEL NJF(Vto=-2 Beta=1.5m Lambda=0.005 Is=1f Cgs=5p Cgd=3p)',
 '.model D_SILICON D(Is=2n N=1.7 Rs=0.2 Cjo=10p Tt=20n)',
 '.model D_ZENER D(Is=2n N=1.7 Rs=2 BV=5.1 Ibv=1m)',
]
# Pin offsets and directions for short, named connection stubs.
PINS={
 'voltage':[(0,16,0,-32),(0,96,0,32)],
 'current':[(0,0,0,-32),(0,80,0,32)],
 'res':[(16,16,0,-32),(16,96,0,32)],
 'cap':[(16,0,0,-32),(16,64,0,32)],
 'ind':[(16,16,0,-32),(16,96,0,32)],
 'diode':[(16,0,0,-32),(16,64,0,32)],
 'npn':[(64,0,0,-32),(0,48,-48,0),(64,96,0,32)],
 'pnp':[(64,0,0,-32),(0,48,-48,0),(64,96,0,32)],
 'njf':[(48,0,0,-32),(0,64,-48,0),(48,96,0,32)],
 'nmos':[(48,0,0,-32),(0,80,-48,0),(48,96,0,32)],
 'pmos':[(48,0,0,-32),(0,80,-48,0),(48,96,0,32)],
 'OpAmps/UniversalOpamp2':[(-32,16,-48,0),(-32,-16,-48,0),(0,-32,0,-32),(0,32,0,32),(32,0,48,0)],
 'e':[(0,16,0,-32),(0,96,0,32),(-48,32,-32,0),(-48,80,-32,0)],
}

class Circuit:
 def __init__(self,slug,title,article,intro,explanation):
  self.slug,self.title,self.article,self.intro,self.explanation=slug,title,article,intro,explanation
  self.parts=[]; self.extra=[]; self.groups=[]; self.checks=[]; self.sweep=None
  self.analysis='tran'; self.stop=.01; self.start=0; self.dt=2e-6
  self.detail=None; self.coverage=[]
 def part(self,kind,name,nodes,value,display=None,params=None):
  self.parts.append(dict(kind=kind,name=name,nodes=nodes.split(),value=value,display=display or value,params=params or ''))
  return self
 def v(self,name,p,n,value,display=None): return self.part('voltage',name,f'{p} {n}',value,display)
 def r(self,name,p,n,value): return self.part('res',name,f'{p} {n}',value)
 def cap(self,name,p,n,value): return self.part('cap',name,f'{p} {n}',value)
 def q(self,name,col,base,emit,pnp=False): return self.part('pnp' if pnp else 'npn',name,f'{col} {base} {emit}','Q_PNP' if pnp else 'Q_NPN','PNP' if pnp else 'NPN')
 def m(self,name,drain,gate,source,p=False): return self.part('pmos' if p else 'nmos',name,f'{drain} {gate} {source}','M_PCHANNEL' if p else 'M_NCHANNEL','P-channel' if p else 'N-channel')
 def j(self,name,d,g,s): return self.part('njf',name,f'{d} {g} {s}','J_NCHANNEL','N-channel JFET')
 def d(self,name,a,k,zener=False): return self.part('diode',name,f'{a} {k}','D_ZENER' if zener else 'D_SILICON','5.1 V Zener' if zener else 'Silicon diode')
 def current(self,name,p,n,value): return self.part('current',name,f'{p} {n}',value)
 def op(self,name,p,n,out,params='Avol=1Meg GBW=10Meg Slew=10Meg'):
  return self.part('OpAmps/UniversalOpamp2',name,f'{p} {n} VP VN {out}','level2','Op-amp',params)
 def rails(self,v='12'):
  self.v('VP','VP','0',v);self.v('VN','VN','0','-'+v);return self
 def step(self,name,values,labels=None):
  self.sweep=dict(name=name,values=values,labels=labels or values);return self
 def tran(self,stop,dt,start=0,detail=None):
  self.analysis='tran';self.stop=stop;self.dt=dt;self.start=start;self.detail=detail;return self
 def dc(self,source,lo,hi,step):
  self.analysis='dc';self.dcsource=source;self.start=lo;self.stop=hi;self.dt=step;return self
 def ac(self,lo=10,hi=1e7):
  self.analysis='ac';self.start=lo;self.stop=hi;self.dt=60;return self
 def plot(self,label,unit,*traces):
  self.groups.append(dict(label=label,unit=unit,traces=[list(t) for t in traces]));return self
 def check(self,trace,metric,lo,hi,at=None):
  self.checks.append(dict(trace=trace,metric=metric,lo=lo,hi=hi,at=at));return self
 def write(self):
  folder=DEST/self.slug;folder.mkdir(parents=True,exist_ok=True);WORK.mkdir(parents=True,exist_ok=True)
  wires=[];flags=[];symbols=[];expected=[];graph=[]
  for i,p in enumerate(self.parts):
   x=144+(i%4)*384; y=160+(i//4)*256
   pins=PINS[p['kind']];assert len(pins)==len(p['nodes']),p
   for (px,py,dx,dy),node in zip(pins,p['nodes']):
    wires.append([x+px,y+py,x+px+dx,y+py+dy]);flags.append([x+px+dx,y+py+dy,node])
   sy=[f"SYMBOL {p['kind']} {x} {y} R0",f"SYMATTR InstName {p['name']}"]
   if p['kind'].startswith('OpAmps'):
    sy += ['SYMATTR SpiceModel level2',f"SYMATTR Value2 {p['params']}",'SYMATTR SpiceLine Ilimit=100m Rail=0.5 Vos=0','SYMATTR SpiceLine2 En=0 Enk=0 In=0 Ink=0 Rin=1G']
    line='X'+p['name']+' '+' '.join(p['nodes'])+' level2 '+p['params']+' Ilimit=100m Rail=0.5 Vos=0 En=0 Enk=0 In=0 Ink=0 Rin=1G'
   else:
    sy += [f"SYMATTR Value {p['value']}"]
    nodes=p['nodes']+(['0'] if p['kind'] in ['npn','pnp'] else [p['nodes'][-1]] if p['kind'] in ['nmos','pmos'] else [])
    line=' '.join([p['name']]+nodes+[p['value']])
   symbols+=sy;expected.append(line)
   graph.append(dict(**p,x=x,y=y,rotation='R0'))
  top=208+((len(self.parts)+3)//4)*256
  analysis=f'.tran 0 {self.stop} {self.start} {self.dt}' if self.analysis=='tran' else f'.dc {self.dcsource} {self.start} {self.stop} {self.dt}' if self.analysis=='dc' else f'.ac dec 60 {self.start} {self.stop}'
  directives=[analysis,'.temp 27','.options reltol=1e-5 plotwinsize=0']
  if self.sweep:directives.append('.step param '+self.sweep['name']+' list '+' '.join(map(str,self.sweep['values'])))
  directives+=self.extra
  usedmodels={p['value'] for p in self.parts}
  directives += [m for m in MODELS if m.split()[1] in usedmodels]
  hasop=any(p['kind'].startswith('OpAmps') for p in self.parts)
  # The standard op-amp is supplied with LTspice. Do not redistribute its library.
  cirlibs=['.lib UniversalOpAmp2.lib'] if hasop else []
  # Save nodes used by plots and checks; keep all terminal currents for auditing.
  nodes=sorted({n for p in self.parts for n in p['nodes'] if n!='0'})
  saves=['V('+n+')' for n in nodes]
  for p in self.parts:
   if p['kind'] in ['npn','pnp']:saves += [f"Ic({p['name']})",f"Ib({p['name']})"]
   elif p['kind'] in ['njf','nmos','pmos']:saves += [f"Id({p['name']})"]
   elif not p['kind'].startswith('OpAmps'):saves += [f"I({p['name']})"]
  directives.append('.save '+' '.join(saves))
  asc=['Version 4',f'SHEET 1 1740 {top+len(directives)*32+120}']
  asc += [f'WIRE {a} {b} {c} {d}' for a,b,c,d in wires]+[f'FLAG {x} {y} {n}' for x,y,n in flags]+symbols
  asc += [f'TEXT 64 32 Left 3 ;{self.title}','TEXT 64 72 Left 2 ;Equal node labels connect. Temperature: 27 C.']
  asc += [f'TEXT 64 {top+i*32} Left 2 !{s}' for i,s in enumerate(directives)]
  asc='\n'.join(asc)+'\n'
  cir='* '+self.title+'\n'+'\n'.join(expected+cirlibs+directives)+'\n.end\n'
  # All files are ASCII-compatible with LTspice's native Windows encoding.
  (folder/f'{self.slug}.asc').write_text(asc,encoding='ascii');(WORK/f'{self.slug}.asc').write_text(asc,encoding='ascii')
  (folder/f'{self.slug}.cir').write_text(cir,encoding='ascii')
  refined=cir.replace('reltol=1e-5','reltol=1e-7 abstol=1e-13 vntol=1e-8')
  if self.analysis=='tran':refined=refined.replace(analysis,f'.tran 0 {self.stop} {self.start} {self.dt/2}')
  elif self.analysis=='dc':refined=refined.replace(analysis,f'.dc {self.dcsource} {self.start} {self.stop} {self.dt/2}')
  else:refined=refined.replace('.ac dec 60 ','.ac dec 120 ')
  (WORK/f'{self.slug}-refined.cir').write_text(refined,encoding='ascii')
  return dict(slug=self.slug,title=self.title,article=self.article,intro=self.intro,explanation=self.explanation,analysis=self.analysis,start=self.start,stop=self.stop,dt=self.dt,detail=self.detail,sweep=self.sweep,groups=self.groups,checks=self.checks,expected=expected,coverage=self.coverage,schematic=dict(components=graph,wires=wires,flags=flags,width=1740,height=top-100))
