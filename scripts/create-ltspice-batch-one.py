"""Create five portable circuit schematics. Run before simulation.

Pin coordinates follow the installed standard LTspice symbols. Every generated
netlist is checked against the independent connection list during export.
"""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'static/simulations'
WORK = ROOT / 'tmp/ltspice-batch-one'
WORK.mkdir(parents=True, exist_ok=True)

PINS = {
    'voltage': [(0,16),(0,96)], 'res': [(16,16),(16,96)],
    'cap': [(16,0),(16,64)], 'diode': [(16,0),(16,64)],
    'npn': [(64,0),(0,48),(64,96)], 'njf': [(48,0),(0,64),(48,96)],
    'nmos': [(48,0),(0,80),(48,96)], 'pmos': [(48,0),(0,80),(48,96)],
}

class Circuit:
    def __init__(self, slug, title):
        self.slug, self.title = slug, title
        self.components, self.wires, self.flags, self.notes = [], [], [], []
        self.directives, self.expected = [], []

    def part(self, kind, name, value, nodes, x, y, rotation='R0', display=None):
        self.components.append(dict(kind=kind,name=name,value=value,nodes=nodes,x=x,y=y,rotation=rotation,display=display or value))
        # Standard three-pin MOS symbols tie bulk to source for LEVEL=1 models.
        pins = nodes + ([nodes[-1]] if kind in ['nmos','pmos','npn'] else [])
        self.expected.append(' '.join([name]+pins+[value]))

    def wire(self, *points):
        self.wires.extend([[*a,*b] for a,b in zip(points,points[1:])])

    def flag(self,x,y,name): self.flags.append([x,y,name])
    def note(self,x,y,text): self.notes.append([x,y,text])

    def finish(self, **meta):
        folder=DEST/self.slug
        folder.mkdir(parents=True,exist_ok=True)
        lines=['Version 4','SHEET 1 1280 1000']
        lines += [f'WIRE {a} {b} {c} {d}' for a,b,c,d in self.wires]
        lines += [f'FLAG {x} {y} {n}' for x,y,n in self.flags]
        for p in self.components:
            lines += [f"SYMBOL {p['kind']} {p['x']} {p['y']} {p['rotation']}",
                      f"SYMATTR InstName {p['name']}",f"SYMATTR Value {p['value']}"]
        lines += [f'TEXT 48 24 Left 3 ;{self.title}', 'TEXT 48 56 Left 2 ;Temperature: 27 C.']
        lines += [f'TEXT {x} {y} Left 2 ;{s}' for x,y,s in self.notes]
        lines += [f'TEXT 48 {624+i*32} Left 2 !{s}' for i,s in enumerate(self.directives)]
        asc='\n'.join(lines)+'\n'
        (folder/f'{self.slug}.asc').write_text(asc,encoding='ascii')
        (WORK/f'{self.slug}.asc').write_text(asc,encoding='ascii')
        # Q substrate is grounded by the default symbol, not tied to emitter.
        self.expected=[s.replace('Q1 COL BASE EM EM ', 'Q1 COL BASE EM 0 ') for s in self.expected]
        cir='* '+self.title+'\n'+'\n'.join(self.expected+self.directives)+ '\n.end\n'
        (folder/f'{self.slug}.cir').write_text(cir,encoding='ascii')
        refined=cir.replace('reltol=1e-5','reltol=1e-7 abstol=1e-13 vntol=1e-8')
        refined=refined.replace('.tran 0 200m 0 20u','.tran 0 200m 0 10u')
        refined=refined.replace('.tran 0 6m 0 500n','.tran 0 6m 0 250n')
        refined=refined.replace('.tran 0 60m 40m 2u','.tran 0 60m 40m 1u')
        refined=refined.replace('.dc VDD 0 12 0.05','.dc VDD 0 12 0.025')
        (WORK/f'{self.slug}-refined.cir').write_text(refined,encoding='ascii')
        meta.update(slug=self.slug,title=self.title,components=self.components,wires=self.wires,flags=self.flags,notes=self.notes,expected=self.expected)
        return meta

common=['.temp 27','.options reltol=1e-5 plotwinsize=0']
diode='.model D_SILICON D(Is=2n N=1.7 Rs=0.2 Cjo=10p Tt=2u BV=100 Ibv=10u)'
circuits=[]

c=Circuit('half-wave-rectifier','Half-wave rectifier')
c.part('voltage','VIN','SINE(0 12 50)',['RAW','0'],128,144,display='12 V peak, 50 Hz')
c.part('res','RSER','10',['RAW','AC'],240,112)
c.part('diode','D1','D_SILICON',['AC','OUT'],240,272)
c.part('res','RLOAD','1k',['OUT','0'],496,352)
c.part('cap','CFILTER','{Cfilter}',['OUT','0'],688,368)
c.wire((128,160),(128,96),(256,96),(256,128))
c.wire((256,208),(256,272))
c.wire((256,336),(256,352),(512,352),(704,352),(704,368))
c.wire((512,352),(512,368))
c.wire((128,240),(128,496)); c.wire((512,448),(512,496)); c.wire((704,432),(704,496))
for x,y,n in [(128,96,'RAW'),(256,240,'AC'),(512,352,'OUT'),(128,496,'0'),(512,496,'0'),(704,496,'0')]: c.flag(x,y,n)
c.note(432,128,'RSER represents source resistance.')
c.note(432,176,'Cfilter = 1p, 47u, or 220u.')
c.note(432,224,'1 pF represents no reservoir capacitor.')
c.directives=['.tran 0 200m 0 20u','.step param Cfilter list 1p 47u 220u',diode,*common,'.save V(raw) V(ac) V(out) I(D1) I(RLOAD) I(CFILTER)']
circuits.append(c.finish(parameter='Cfilter',values=[1e-12,47e-6,220e-6],labels=['No reservoir (1 pF)','47 uF','220 uF'],kind='half',analysis='Transient',axis='Time (ms)',axisScale=1000,stop=.2,sampleStep=.0001,traceGroups=[dict(label='Voltage',unit='V',traces=[['V(raw)','Source voltage',1],['V(out)','Output voltage',1]]),dict(label='Current',unit='mA',traces=[['I(D1)','Diode current',1000],['I(RLOAD)','Load current',1000]])]))

c=Circuit('bridge-rectifier','Full-wave bridge rectifier')
c.part('voltage','VIN','SINE(0 12 50)',['RAW','B'],128,160,display='12 V peak, 50 Hz')
c.part('res','RSER','10',['RAW','A'],240,112)
c.part('diode','D1','D_SILICON',['A','OUT'],384,176)
c.part('diode','D2','D_SILICON',['B','OUT'],608,176)
c.part('diode','D3','D_SILICON',['0','A'],384,384)
c.part('diode','D4','D_SILICON',['0','B'],608,384)
c.part('res','RLOAD','1k',['OUT','0'],832,288)
c.part('cap','CFILTER','{Cfilter}',['OUT','0'],1024,304)
c.wire((128,176),(128,96),(256,96),(256,128))
c.wire((128,256),(128,288)); c.flag(128,288,'B')
c.wire((256,208),(256,240)); c.flag(256,240,'A')
c.wire((400,176),(400,128)); c.flag(400,128,'A')
c.wire((624,176),(624,128)); c.flag(624,128,'B')
c.wire((400,240),(400,272),(624,272),(848,272),(1040,272),(1040,304))
c.wire((624,240),(624,272)); c.wire((848,272),(848,304)); c.flag(848,272,'OUT')
c.wire((400,384),(400,352),(624,352),(624,384)); c.flag(400,352,'0')
c.wire((400,448),(400,480)); c.flag(400,480,'A')
c.wire((624,448),(624,480)); c.flag(624,480,'B')
c.wire((848,384),(848,496)); c.flag(848,496,'0')
c.wire((1040,368),(1040,496)); c.flag(1040,496,'0')
c.flag(128,96,'RAW')
c.note(48,552,'Equal node labels connect. A and B are floating AC terminals.')
c.note(48,584,'D1/D4 conduct on positive half cycles. D2/D3 conduct on negative half cycles.')
c.directives=['.tran 0 200m 0 20u','.step param Cfilter list 1p 47u 220u',diode,*common,'.save V(raw) V(a) V(b) V(out) I(D1) I(D2) I(D3) I(D4) I(RLOAD) I(CFILTER)']
circuits.append(c.finish(parameter='Cfilter',values=[1e-12,47e-6,220e-6],labels=['No reservoir (1 pF)','47 uF','220 uF'],kind='bridge',analysis='Transient',axis='Time (ms)',axisScale=1000,stop=.2,sampleStep=.0001,traceGroups=[dict(label='Voltage',unit='V',traces=[['source','Source voltage',1],['V(out)','Output voltage',1]]),dict(label='Diode current',unit='mA',traces=[['I(D1)','D1 and D4 path',1000],['I(D2)','D2 and D3 path',1000]])]))

c=Circuit('jfet-self-bias','JFET self bias')
c.part('voltage','VDD','12',['VDD','0'],128,144)
c.part('res','RD','1k',['VDD','DRAIN'],384,112)
c.part('njf','J1','J_NCHANNEL',['DRAIN','GATE','SOURCE'],352,256)
c.part('res','RS','{Rsource}',['SOURCE','0'],384,384)
c.part('res','RG','1Meg',['GATE','0'],176,352)
c.wire((128,160),(128,96),(400,96),(400,128)); c.flag(400,96,'VDD')
c.wire((400,208),(400,256)); c.flag(400,240,'DRAIN')
c.wire((352,320),(192,320),(192,368)); c.flag(192,320,'GATE')
c.wire((400,352),(400,400)); c.flag(400,368,'SOURCE')
for x,y in [(128,240),(192,448),(400,480)]: c.wire((x,y),(x,528)); c.flag(x,528,'0')
c.note(624,144,'Drain resistance: 1 kilohm.')
c.note(624,192,'Source resistance: 470, 1000, or 2200 ohms.')
c.note(624,240,'Gate current is very small in normal operation.')
c.note(624,288,'VGS = V(GATE) - V(SOURCE).')
c.note(624,336,'Use the 12 V point to compare the bias.')
c.directives=['.dc VDD 0 12 0.05','.step param Rsource list 470 1k 2.2k','.model J_NCHANNEL NJF(Vto=-2 Beta=1.5m Lambda=0 Is=1f)',*common,'.save V(gate) V(source) V(drain) Id(J1) Ig(J1) I(RD) I(RS)']
circuits.append(c.finish(parameter='Rsource',values=[470,1000,2200],labels=['470 ohms','1 kilohm','2.2 kilohms'],kind='jfet',analysis='DC sweep',axis='Supply voltage (V)',axisScale=1,stop=12,sampleStep=.05,traceGroups=[dict(label='Current',unit='mA',traces=[['Id(J1)','Drain current',1000]]),dict(label='Voltage',unit='V',traces=[['V(drain)','Drain voltage',1],['V(source)','Source voltage',1],['vgs','Gate to source voltage',1]])]))

c=Circuit('mosfet-switches','N-channel and P-channel switches')
c.part('voltage','VDD','5',['VDD','0'],80,144)
c.part('res','RN','{Rload}',['VDD','NLOAD'],304,128)
c.part('nmos','MN','M_NCHANNEL',['NLOAD','CTRL','0'],272,288)
c.part('pmos','MP','M_PCHANNEL',['PLOAD','CTRL','VDD'],736,240,'R180')
c.part('res','RP','{Rload}',['PLOAD','0'],672,304)
c.part('voltage','VG','PULSE(0 5 1m 10u 10u 1m 2m)',['CTRL','0'],976,288,display='0 to 5 V pulse')
c.wire((80,160),(80,96),(320,96),(688,96),(688,144))
c.wire((320,96),(320,144)); c.flag(320,96,'VDD')
c.wire((320,224),(320,288)); c.flag(320,256,'NLOAD')
c.wire((688,240),(688,320)); c.flag(688,272,'PLOAD')
c.wire((272,368),(224,368)); c.flag(224,368,'CTRL')
c.wire((736,160),(816,160)); c.flag(816,160,'CTRL')
c.wire((976,304),(976,256)); c.flag(976,256,'CTRL')
for x,y in [(80,240),(320,384),(688,400),(976,384)]: c.wire((x,y),(x,496)); c.flag(x,496,'0')
c.note(208,544,'N-channel: gate high turns the load on.')
c.note(624,544,'P-channel: gate low turns the load on.')
c.directives=['.tran 0 6m 0 500n','.step param Rload list 100 330 1k','.model M_NCHANNEL NMOS(Level=1 Vto=2 Kp=0.2 Lambda=0 Rd=0.1 Rs=0.1 Cgso=1n Cgdo=200p Cbd=1n Cbs=1n)', '.model M_PCHANNEL PMOS(Level=1 Vto=-2 Kp=0.2 Lambda=0 Rd=0.1 Rs=0.1 Cgso=1n Cgdo=200p Cbd=1n Cbs=1n)',*common,'.save V(ctrl) V(nload) V(pload) I(RN) I(RP) Id(MN) Id(MP)']
circuits.append(c.finish(parameter='Rload',values=[100,330,1000],labels=['100 ohms','330 ohms','1 kilohm'],kind='mosfet',analysis='Transient',axis='Time (ms)',axisScale=1000,stop=.006,sampleStep=.000002,traceGroups=[dict(label='Voltage',unit='V',traces=[['V(ctrl)','Gate control',1],['V(nload)','N-channel drain',1],['V(pload)','P-channel drain',1]]),dict(label='Load current',unit='mA',traces=[['I(RN)','N-channel load',1000],['I(RP)','P-channel load',1000]])]))

c=Circuit('common-emitter-amplifier','Common-emitter amplifier')
c.part('voltage','VCC','12',['VCC','0'],80,144)
c.part('voltage','VIN','SINE(0 10m 1k)',['IN','0'],80,352,display='10 mV peak, 1 kHz')
c.part('res','RTOP','100k',['VCC','BASE'],288,112)
c.part('res','RBOT','22k',['BASE','0'],288,368)
c.part('cap','CIN','10u',['IN','BASE'],160,288)
c.part('res','RC','3.3k',['VCC','COL'],512,112)
c.part('npn','Q1','Q_NPN',['COL','BASE','EM'],464,256)
c.part('res','RE1','100',['EM','LOW'],512,352)
c.part('res','RE2','900',['LOW','0'],512,480)
c.part('cap','CE','{Cbypass}',['LOW','0'],704,496)
c.part('cap','COUT','10u',['COL','OUT'],896,240)
c.part('res','RL','47k',['OUT','0'],896,384)
c.wire((80,160),(80,96),(304,96),(528,96),(528,128)); c.wire((304,96),(304,128)); c.flag(528,96,'VCC')
c.wire((80,240),(80,256)); c.flag(80,256,'0')
c.wire((304,208),(304,304),(464,304)); c.wire((304,304),(304,384)); c.flag(304,304,'BASE')
c.wire((176,288),(176,256)); c.flag(176,256,'IN')
c.wire((176,352),(240,352),(240,304),(304,304))
c.wire((80,368),(80,320)); c.flag(80,320,'IN'); c.wire((80,448),(80,464)); c.flag(80,464,'0')
c.wire((528,208),(528,240),(528,256)); c.flag(528,240,'COL')
c.wire((528,352),(528,368)); c.flag(528,352,'EM')
c.wire((528,448),(528,464),(720,464),(720,496)); c.wire((528,464),(528,496)); c.flag(528,464,'LOW')
c.wire((912,240),(912,208)); c.flag(912,208,'COL')
c.wire((912,304),(912,400)); c.flag(912,352,'OUT')
for x,y in [(304,464),(528,576),(720,560),(912,480)]: c.wire((x,y),(x,592)); c.flag(x,592,'0')
c.note(672,96,'Cbypass = 1p, 1u, or 100u.')
c.note(672,144,'The 100-ohm emitter resistor stays unbypassed.')
c.directives=['.tran 0 60m 40m 2u','.step param Cbypass list 1p 1u 100u','.model Q_NPN NPN(Is=1e-14 Bf=150 Vaf=100 Cje=10p Cjc=4p Tf=300p)',*common,'.save V(in) V(base) V(em) V(low) V(col) V(out) Ic(Q1) Ib(Q1) Ie(Q1) I(RC) I(RE1)']
circuits.append(c.finish(parameter='Cbypass',values=[1e-12,1e-6,100e-6],labels=['No bypass (1 pF)','1 uF','100 uF'],kind='ce',analysis='Transient',axis='Time (ms)',axisScale=1000,start=.04,stop=.06,sampleStep=.00001,traceGroups=[dict(label='Signal',unit='V',traces=[['V(in)','Input voltage',1],['V(out)','Output voltage',1]]),dict(label='Bias',unit='V',traces=[['V(base)','Base voltage',1],['V(em)','Emitter voltage',1],['V(col)','Collector voltage',1]])]))

(ROOT/'scripts/ltspice-batch-one-spec.json').write_text(json.dumps(circuits,indent=2)+'\n',encoding='utf-8')
baseline=ROOT/'scripts/ltspice-batch-one-originals.json'
if not baseline.exists():
    originals=[]
    for p in sorted((ROOT/'docs').rglob('*')):
        if p.suffix in ['.md','.mdx']:
            text=p.read_text(encoding='utf-8')
            originals.append(dict(path=p.relative_to(ROOT).as_posix(),length=len(text),sha256=hashlib.sha256(text.encode()).hexdigest()))
    baseline.write_text(json.dumps(originals,indent=2)+'\n',encoding='utf-8')
print('Created five schematics and reference netlists. Simulation is still required.')
