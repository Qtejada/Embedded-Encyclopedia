"""Build the remaining analog circuit collection from explicit connections."""
from ltspice_library import Circuit, ROOT
import json

D='docs/01-Discrete-Components/03-Semicondctors/01-Diodes.md'
B='docs/01-Discrete-Components/03-Semicondctors/02-BJTs.md'
F='docs/01-Discrete-Components/03-Semicondctors/03-MOSFETs.mdx'
O='docs/03-Signal-Modulation/Amplifiers/01-op-amps.md'
DIFF='docs/03-Signal-Modulation/Amplifiers/02-differential-amps.md'
CMP='docs/03-Signal-Modulation/Amplifiers/comparators.md'
FILTER='docs/03-Signal-Modulation/Filters/Active-filters.md'
all_circuits=[]
def new(slug,title,article,intro,explanation):
 c=Circuit(slug,title,article,intro,explanation);all_circuits.append(c);return c
def volts(c,*pairs):
 return c.plot('Voltage','V',*[(key,label,1) for key,label in pairs])
def frequency(c,node='out'):
 return c.plot('Gain','dB',(f'db(V({node}))','Gain',1)).plot('Phase','degrees',(f'ph(V({node}))','Phase',1))

c=new('zener-regulator','Zener shunt regulator',D,'A series resistor supplies a Zener diode and a parallel load.',[
 'The source must supply both load current and Zener current. At low input voltage, the diode leaves breakdown and the output falls.',
 'A heavier load takes more current from the series resistor. This reduces the current available to maintain Zener breakdown.',
 'The series resistor also dissipates power. Compare its voltage drop with the current before selecting its power rating.'])
c.v('VIN','IN','0','12').r('RS','IN','OUT','330').d('DZ','0','OUT',True).r('RL','OUT','0','{Load}')
c.step('Load',['1k','2.2k','10k']).dc('VIN',0,15,.05)
volts(c,('V(in)','Input'),('V(out)','Output')).plot('Current','mA',('I(RS)','Series resistor',1000),('-I(DZ)','Zener current',1000))
c.check('V(out)','at',4.9,5.5,12)

c=new('diode-limiter-clamp','Diode limiter and DC clamp',D,'One path limits voltage. A separate capacitor and diode path shifts the waveform level.',[
 'The two limiter diodes conduct on opposite polarities. The series resistor limits their current.',
 'The clamp capacitor stores charge. Its diode holds the negative excursion near one forward diode drop below ground.',
 'The clamp load discharges the capacitor between cycles. A shorter time constant causes more waveform tilt.'])
c.v('VIN','IN','0','SINE(0 3 1k)','3 V peak, 1 kHz').r('RS','IN','LIMIT','1k').d('DP','LIMIT','0').d('DN','0','LIMIT')
c.cap('CC','IN','CLAMP','100n').d('DC','0','CLAMP').r('RL','CLAMP','0','{Load}')
c.step('Load',['10k','100k','1Meg']).tran(.01,1e-6,.008)
volts(c,('V(in)','Input'),('V(limit)','Limited'),('V(clamp)','Clamped'))
c.check('V(limit)','max',.4,.9).check('V(limit)','min',-.9,-.4).check('V(clamp)','max',3.5,6.5)

c=new('bjt-switch','BJT switch and base drive',B,'A base resistor controls a transistor that switches a resistor load.',[
 'A high input drives base current and lowers the collector voltage. The load connects between the supply and collector.',
 'Insufficient base current prevents a low collector voltage. The forced current gain is collector current divided by base current.',
 'Compare all base resistors at the same load. A small resistor increases base current and drives the transistor farther into saturation.'])
c.v('VCC','VCC','0','5').v('VIN','IN','0','PULSE(0 3.3 1m 2u 2u 1m 2m)','0 to 3.3 V').r('RB','IN','BASE','{Rb}').r('RL','VCC','OUT','100').q('Q1','OUT','BASE','0')
c.step('Rb',['1k','10k','100k']).tran(.006,2e-7)
volts(c,('V(in)','Input'),('V(out)','Collector')).plot('Current','mA',('Ic(Q1)','Collector',1000),('Ib(Q1)','Base',1000))
c.check('V(out)','at',[0,0,4],[.4,2,5],.0015)

c=new('emitter-follower','BJT emitter follower',B,'The emitter follows the base voltage with a base to emitter voltage difference.',[
 'The collector connects to the supply. The emitter supplies current to the load.',
 'The voltage gain is slightly below one. The transistor provides current gain, which reduces loading at the input.',
 'The base to emitter voltage changes with current. It is not a fixed voltage drop for every load.'])
c.v('VCC','VCC','0','8').v('VIN','IN','0','3').q('Q1','VCC','IN','OUT').r('RL','OUT','0','{Load}')
c.step('Load',['1k','10k','100k']).dc('VIN',0,5,.025)
volts(c,('V(in)','Base'),('V(out)','Emitter')).check('V(out)','at',2.1,2.7,3)

c=new('common-base-amplifier','Common-base amplifier',B,'A signal enters the emitter while the base stays at a fixed voltage.',[
 'An increase in emitter voltage reduces base to emitter voltage and collector current. The collector voltage then increases.',
 'The voltage gain is positive. The emitter presents a low input resistance, which can suit a low-impedance source.',
 'The input source includes the emitter bias. The output capacitor removes the collector DC voltage from the load.'])
c.v('VCC','VCC','0','12').v('VB','BASE','0','1.3').v('VIN','EM','0','0.65 AC 1','0.65 V bias, AC 1')
c.q('Q1','COL','BASE','EM').r('RC','VCC','COL','{Rc}').cap('CO','COL','OUT','10u').r('RL','OUT','0','100k')
c.step('Rc',['1k','2.2k','3.3k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',[20,50,75],[45,100,150],1000)

c=new('emitter-degeneration','Emitter degeneration and current gain',B,'Two amplifier paths compare complete emitter bypass with partial emitter bypass.',[
 'Both paths use the same DC emitter resistance and bias network. The partially bypassed path retains 100 ohms in the signal path.',
 'The stepped forward current gain changes the transistor parameters in both paths.',
 'Emitter degeneration reduces signal gain. It also reduces dependence on the transistor and the bias network.'])
c.extra=['.model Q_VARIABLE NPN(Is=1e-14 Bf={Beta} Vaf=100)']
c.v('VCC','VCC','0','12').v('VIN','IN','0','0 AC 1','AC 1')
for s,re in [('A','1'),('B','100')]:
 c.r('RT'+s,'VCC','BASE'+s,'100k').r('RB'+s,'BASE'+s,'0','22k').cap('CI'+s,'IN','BASE'+s,'10u')
 c.part('npn','Q'+s,'COL'+s+' BASE'+s+' EM'+s,'Q_VARIABLE','NPN')
 c.r('RC'+s,'VCC','COL'+s,'3.3k').r('RE'+s,'EM'+s,'LOW'+s,re).r('RS'+s,'LOW'+s,'0',str(1000-int(re))).cap('CE'+s,'LOW'+s,'0','100u')
 c.cap('CO'+s,'COL'+s,'OUT'+s,'10u').r('RL'+s,'OUT'+s,'0','100k')
c.step('Beta',['50','150','300']).ac(10,1e7)
c.plot('Gain','dB',('db(V(outa))','Nearly complete bypass',1),('db(V(outb))','100 ohms unbypassed',1))
c.check('abs(V(outb))','at',15,35,1000).check('abs(V(outa))','at',75,225,1000)

c=new('mosfet-common-source','MOSFET common-source amplifier',F,'A drain resistor converts channel-current changes into an inverted output voltage.',[
 'The gate source voltage sets channel current. The source resistor provides feedback through the source voltage.',
 'This frequency sweep linearizes the circuit at its DC operating point. The AC source value of one makes the output equal to voltage gain.',
 'The drain needs enough voltage to keep the transistor in saturation. This region supports voltage amplification.'])
c.v('VDD','VDD','0','12').v('VIN','GATE','0','3 AC 1','3 V bias, AC 1').m('M1','OUT','GATE','SOURCE').r('RD','VDD','OUT','{Rd}').r('RS','SOURCE','0','470')
c.step('Rd',['1k','2.2k','3.3k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',[1,2,3],[3,6,8],100)

c=new('mosfet-source-follower','MOSFET source follower',F,'The source voltage follows the gate while the drain connects to the supply.',[
 'The source resistor establishes the operating current. The gate to source voltage supplies the required overdrive above threshold.',
 'The small-signal voltage gain is below one. Source feedback limits changes in gate to source voltage.',
 'This circuit requires voltage headroom. The source cannot reach the gate voltage while the transistor supplies load current.'])
c.v('VDD','VDD','0','12').v('VIN','GATE','0','5 AC 1','5 V bias, AC 1').m('M1','VDD','GATE','OUT').r('RS','OUT','0','{Rs}')
c.step('Rs',['470','1k','2.2k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',.7,1,100)

c=new('mosfet-gate-charging','MOSFET gate charging and switching energy',F,'A gate resistor controls how quickly gate capacitance receives charge.',[
 'The capacitor between gate and drain couples drain voltage changes into the gate. This produces the Miller portion of the transition.',
 'The drain resistor sets a resistive load. During a transition, the transistor can carry current while substantial drain voltage remains.',
 'The power plot multiplies drain voltage by drain current. Its time integral gives the energy dissipated during the selected interval.',
 'The explicit gate capacitors make the charge paths visible. Device data are required to predict the losses of a selected transistor.'])
c.extra=['.model M_POWER NMOS(Level=1 Vto=2 Kp=2 Lambda=0 Rd=0.02 Rs=0.02 Cbd=100p Cbs=100p)']
c.v('VDD','VDD','0','12').v('VIN','DRIVE','0','PULSE(0 8 2u 20n 20n 8u 16u)','0 to 8 V')
c.r('RG','DRIVE','GATE','{Rg}').part('nmos','M1','OUT GATE 0','M_POWER','N-channel').r('RL','VDD','OUT','12')
c.cap('CGS','GATE','0','2n').cap('CGD','GATE','OUT','500p')
c.step('Rg',['10','100','470']).tran(36e-6,5e-9,detail=[1e-6,6e-6])
volts(c,('V(gate)','Gate'),('V(out)','Drain')).plot('Power','W',('V(out)*Id(M1)','Transistor power',1))
c.check('V(out)','at',0,.2,9e-6).check('V(gate)','at',7.5,8.1,9e-6)

for mode in ['output','transfer']:
 c=new('jfet-'+mode+'-curves','JFET '+mode+' characteristics',F,'Separate gate and drain sources expose the JFET device characteristic.',[
  'A more negative gate to source voltage reduces drain current. The gate junction remains reverse biased during these sweeps.',
  'The output curves show the transition from the resistive region to saturation. The transfer curve shows current versus gate voltage.',
  'The channel-length modulation parameter gives the saturation region a finite slope.'])
 c.v('VD','DRAIN','0','{Drain}' if mode=='transfer' else '10').v('VG','GATE','0','{Gate}' if mode=='output' else '0').j('J1','DRAIN','GATE','0')
 if mode=='output':c.step('Gate',['0','-0.5','-1']).dc('VD',0,10,.05)
 else:c.step('Drain',['3','6','10']).dc('VG',-2,0,.01)
 c.plot('Drain current','mA',('Id(J1)','Drain current',1000))
 c.check('Id(J1)','at',[.005,.003,.0013] if mode=='output' else .005,[.007,.004,.0018] if mode=='output' else .007,10 if mode=='output' else 0)

c=new('jfet-common-source','JFET common-source amplifier',F,'The source resistor sets DC bias, and its bypass capacitor increases signal gain.',[
 'The gate resistor fixes the gate DC voltage near ground. The drain current raises the source voltage above ground.',
 'The source capacitor reduces source feedback at higher frequencies. It does not remove the DC source resistance.',
 'A larger drain resistor increases voltage gain while reducing drain voltage headroom.'])
c.v('VDD','VDD','0','12').v('VIN','GATE','0','0 AC 1','AC 1').j('J1','OUT','GATE','SOURCE').r('RD','VDD','OUT','{Rd}').r('RS','SOURCE','0','1k').cap('CS','SOURCE','0','10u')
c.step('Rd',['1k','2.2k','3.3k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',[2,4,6],[4,8,11],1000)

c=new('jfet-source-follower','JFET source follower',F,'A JFET supplies a source signal with high gate input resistance.',[
 'The gate sits at a 2 V DC bias. The source rises above this bias because the JFET needs a negative gate to source voltage.',
 'The source resistor supplies the current path to ground. Source feedback makes the signal gain positive and below one.',
 'The output can supply current through the JFET, but the resistor sets the available current in the other direction.'])
c.v('VDD','VDD','0','12').v('VIN','GATE','0','2 AC 1','2 V bias, AC 1').j('J1','VDD','GATE','OUT').r('RS','OUT','0','{Rs}')
c.step('Rs',['470','1k','2.2k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',.6,.95,100)

c=new('jfet-current-source','Two-terminal JFET current sink',F,'A JFET and source resistor form a current sink between the drain and ground.',[
 'The gate connects to ground. Source resistance creates the negative gate to source voltage that sets current.',
 'The current becomes nearly constant after the drain voltage provides sufficient headroom.',
 'The finite slope above this point represents output conductance. The resistor changes both current and required voltage.'])
c.v('VTEST','DRAIN','0','12').j('J1','DRAIN','0','SOURCE').r('RS','SOURCE','0','{Rs}')
c.step('Rs',['330','1k','2.2k']).dc('VTEST',0,12,.05).plot('Current','mA',('Id(J1)','Drain current',1000))
c.check('Id(J1)','at',[.002,.001,.0005],[.003,.0014,.0008],10)

# Current sources and mirrors.
c=new('pnp-current-mirror','PNP current mirror',B,'A PNP mirror supplies current from the positive rail into a load.',[
 'The reference resistor draws current from a diode-connected PNP transistor. Both transistor bases share this voltage.',
 'The output transistor supplies current while its collector stays sufficiently below its emitter.',
 'Collector current uses the SPICE sign convention. The plot reverses that sign to show supplied load current as positive.'])
c.v('VCC','VCC','0','5').r('RR','REF','0','{Rref}').q('Q1','REF','REF','VCC',True).q('Q2','OUT','REF','VCC',True).v('VTEST','OUT','0','1')
c.step('Rref',['1k','2.2k','4.7k']).dc('VTEST',0,5,.025).plot('Current','mA',('-Ic(Q2)','Output current',1000),('I(RR)','Reference current',1000))
c.check('-Ic(Q2)','at',[.004,.0018,.0008],[.0046,.0021,.001],2)

c=new('degenerated-current-mirror','Current mirror with emitter resistors',B,'Equal emitter resistors add local feedback to the two mirror transistors.',[
 'A transistor with more current develops a larger emitter voltage. This reduces its base to emitter voltage and opposes the increase.',
 'The resistors reduce sensitivity to transistor differences. They also consume voltage headroom.',
 'The reference uses a current source so the resistor comparison does not change the commanded reference current.'])
c.v('VCC','VCC','0','12').current('IREF','VCC','REF','1m').q('Q1','REF','REF','E1').q('Q2','OUT','REF','E2').r('RE1','E1','0','{Re}').r('RE2','E2','0','{Re}').v('VTEST','OUT','0','5')
c.step('Re',['1','100','470']).dc('VTEST',0,10,.05).plot('Current','mA',('Ic(Q2)','Output current',1000))
c.check('Ic(Q2)','at',.0009,.0011,5)

c=new('wilson-current-mirror','Wilson current mirror',B,'A third transistor feeds current back into the mirror base node.',[
 'The reference current enters the collector of Q2 and the base of Q3. Q3 supplies the diode-connected Q1 and the mirror base currents.',
 'This feedback reduces base-current error and increases output resistance.',
 'The additional transistor requires more output voltage than a basic two-transistor mirror. Examine the low-voltage portion of the sweep.'])
c.v('VCC','VCC','0','12').current('IREF','VCC','X','{Iset}').q('Q1','BASE','BASE','0').q('Q2','X','BASE','0').q('Q3','OUT','X','BASE').v('VTEST','OUT','0','5')
c.step('Iset',['250u','1m','2m']).dc('VTEST',0,10,.05).plot('Current','mA',('Ic(Q3)','Output current',1000))
c.check('Ic(Q3)','at',[.00023,.00093,.00185],[.00027,.00107,.00215],5)

c=new('cascode-current-mirror','Cascode current mirror',B,'A second transistor above each mirror branch holds the lower collector voltage nearly constant.',[
 'The reference branch establishes two base voltage levels. The upper output transistor uses the higher level.',
 'Changes at the output then have less effect on the lower transistor collector voltage. This reduces the Early-effect current change.',
 'The stacked transistors need additional voltage headroom. High output resistance does not remove this requirement.'])
c.v('VCC','VCC','0','12').current('IREF','VCC','HIGH','{Iset}').q('Q1','LOW','LOW','0').q('Q2','X','LOW','0').q('Q3','HIGH','HIGH','LOW').q('Q4','OUT','HIGH','X').v('VTEST','OUT','0','5')
c.step('Iset',['250u','1m','2m']).dc('VTEST',0,10,.05).plot('Current','mA',('Ic(Q4)','Output current',1000))
c.check('Ic(Q4)','at',[.00023,.00092,.00184],[.00027,.00108,.00216],5)

c=new('mosfet-current-mirror','MOSFET current mirror',F,'Two MOSFETs share gate and source voltages to copy a reference current.',[
 'The reference transistor connects its drain to its gate. The reference current sets the common gate voltage.',
 'The output transistor needs enough drain voltage to remain in saturation. Below that voltage, the current falls.',
 'Channel-length modulation gives the output curve a slope. Equal gate voltage alone does not guarantee identical current at different drain voltages.'])
c.v('VDD','VDD','0','12').current('IREF','VDD','REF','{Iset}').m('M1','REF','REF','0').m('M2','OUT','REF','0').v('VTEST','OUT','0','5')
c.step('Iset',['250u','1m','2m']).dc('VTEST',0,10,.05).plot('Current','mA',('Id(M2)','Output current',1000))
c.check('Id(M2)','at',[.00023,.00092,.00184],[.00028,.00112,.00224],5)

c=new('opamp-current-source','Op-amp controlled current sink',O,'An op-amp drives a MOSFET until the sense-resistor voltage equals the command voltage.',[
 'The sense resistor converts current to voltage. Negative feedback forces this voltage toward the command voltage.',
 'For a 100-ohm sense resistor, a 0.5 V command sets approximately 5 mA.',
 'The drain supply must provide the sense voltage and transistor headroom. The circuit cannot maintain current below this compliance voltage.'])
c.rails().v('VSET','SET','0','{Command}').v('VTEST','OUT','0','5').op('U1','SET','SOURCE','GATE').m('M1','OUT','GATE','SOURCE').r('RS','SOURCE','0','100')
c.step('Command',['0.1','0.5','1']).dc('VTEST',0,10,.05).plot('Current','mA',('Id(M1)','Load current',1000))
c.check('Id(M1)','at',[.00098,.0049,.0098],[.00102,.0051,.0102],5)

c=new('differential-pair','Differential pair with resistor tail',DIFF,'Two transistors share an emitter resistor and steer current between their collectors.',[
 'A positive differential input increases one collector current and reduces the other.',
 'The common emitter resistor also responds to common-mode voltage. Its current is not an ideal constant.',
 'Near zero differential input, the response is approximately linear. A larger input steers most of the current to one side.'])
c.rails().v('VIN','IN','0','0').q('Q1','C1','IN','TAIL').q('Q2','C2','0','TAIL').r('RT','TAIL','VN','{Rt}').r('RC1','VP','C1','4.7k').r('RC2','VP','C2','4.7k')
c.step('Rt',['5.6k','10k','22k']).dc('VIN',-.2,.2,.002).plot('Current','mA',('Ic(Q1)','Q1 collector',1000),('Ic(Q2)','Q2 collector',1000))
c.check('Ic(Q1)','at',[.0018,.001,.0004],[.0022,.0013,.0006],.15)

c=new('differential-pair-current-tail','Differential pair with current-source tail',DIFF,'A constant tail current fixes the total current available to a differential pair.',[
 'The differential input changes the division of current between the two transistors.',
 'At zero differential input, matched devices carry nearly equal currents. At large differential input, one transistor carries almost all the tail current.',
 'A practical tail source has finite output resistance and requires voltage headroom. The ideal source here isolates the current-steering relation.'])
c.rails().v('VIN','IN','0','0').q('Q1','C1','IN','TAIL').q('Q2','C2','0','TAIL').current('IT','TAIL','VN','{Tail}').r('RC1','VP','C1','4.7k').r('RC2','VP','C2','4.7k')
c.step('Tail',['500u','1m','2m']).dc('VIN',-.2,.2,.002).plot('Current','mA',('Ic(Q1)','Q1 collector',1000),('Ic(Q2)','Q2 collector',1000))
c.check('Ic(Q1)','at',[.00023,.00046,.00092],[.00027,.00054,.00108],0)

c=new('differential-mirror-load','Differential pair with mirror load',DIFF,'A PNP mirror combines the two branch-current changes into one output.',[
 'The left branch establishes the PNP mirror current. The right branch subtracts its NPN collector current from the mirrored current.',
 'The resulting output current changes a load voltage. This converts the differential signal to a single-ended signal.',
 'The resistor at the output sets a defined DC operating point and limits gain. An unloaded active-load stage can have much higher gain.'])
c.rails().v('VIN','IN','0','0 AC 1','AC 1').q('Q1','REF','IN','TAIL').q('Q2','OUT','0','TAIL').current('IT','TAIL','VN','1m').q('Q3','REF','REF','VP',True).q('Q4','OUT','REF','VP',True).r('RL','OUT','0','{Load}')
c.step('Load',['1k','4.7k','10k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',[10,50,100],[30,120,240],100)

c=new('bjt-cascode-amplifier','BJT cascode amplifier',B,'A common-base transistor sits above a common-emitter transistor.',[
 'The upper base stays at 3 V. Its emitter holds the lower collector near a fixed voltage.',
 'This reduces the voltage swing across the lower transistor collector junction and limits Miller feedback.',
 'The collector resistor converts current to output voltage. Both transistors still require suitable DC voltage headroom.'])
c.v('VCC','VCC','0','12').v('VIN','BASE','0','1.6 AC 1','1.6 V bias, AC 1').v('VB','BIAS','0','3').q('Q1','X','BASE','EM').q('Q2','OUT','BIAS','X').r('RE','EM','0','1k').r('RC','VCC','OUT','{Rc}')
c.step('Rc',['1k','2.2k','4.7k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',[.8,1.8,3.8],[1.2,2.7,5.5],100)

c=new('complementary-output-stage','Complementary output stage and class AB bias',B,'An NPN and a PNP transistor supply opposite halves of the load current.',[
 'Without base bias, neither transistor conducts near zero input. This produces crossover distortion.',
 'A voltage between the bases reduces the dead zone. More bias also increases quiescent current.',
 'Emitter resistors limit current imbalance. A physical bias network must track temperature to control idle current.'])
c.rails().v('VIN','IN','0','SINE(0 2 1k)','2 V peak, 1 kHz').v('VBH','BH','IN','{Bias}').v('VBL','IN','BL','{Bias}')
c.q('Q1','VP','BH','EN').q('Q2','VN','BL','EP',True).r('REN','EN','OUT','2.2').r('REP','EP','OUT','2.2').r('RL','OUT','0','100')
c.step('Bias',['0','0.55','0.65'],['Class B: no bias','0.55 V per base','0.65 V per base']).tran(.004,2e-7,.002)
volts(c,('V(in)','Input'),('V(out)','Output')).plot('Collector current','mA',('Ic(Q1)','NPN current',1000),('-Ic(Q2)','PNP current',1000))
c.check('V(out)','max',[1.1,1.7,1.8],[1.5,2.1,2.2])

# Op-amp building blocks and limits.
c=new('precision-rectifier','Precision half-wave rectifier',D,'An op-amp and two diodes rectify small signals without losing a full diode drop at the output.',[
 'Negative input voltage produces a positive output. The feedback resistor sets the magnitude of the inverting gain.',
 'The second diode maintains a feedback path while the output diode blocks. This avoids driving the op-amp deeply into saturation.',
 'Finite bandwidth and diode charge still affect the transition near zero input. Compare the smallest input with the larger inputs.'])
c.rails().v('VIN','IN','0','SINE(0 {Amplitude} 1k)','Sine input').r('RI','IN','SUM','10k').r('RF','OUT','SUM','10k').op('U1','0','SUM','DRIVE').d('D1','DRIVE','OUT').d('D2','SUM','DRIVE').r('RL','OUT','0','10k')
c.step('Amplitude',['20m','200m','2'],['20 mV peak','200 mV peak','2 V peak']).tran(.004,2e-7,.002)
volts(c,('V(in)','Input'),('V(out)','Rectified output')).check('V(out)','max',[.018,.19,1.98],[.022,.21,2.02])

c=new('opamp-gain-configurations','Inverting and noninverting amplifiers',O,'Two feedback networks demonstrate the sign and magnitude of closed-loop voltage gain.',[
 'The inverting stage has gain equal to the negative feedback-resistor ratio. Its input resistor carries signal current.',
 'The noninverting stage has gain equal to one plus the resistor ratio. Its input connects directly to the high-resistance op-amp input.',
 'Both stages lose closed-loop gain at high frequency. Their noise gains determine the approximate bandwidth.'])
c.rails().v('VIN','IN','0','0 AC 1','AC 1').r('RI','IN','SUM','10k').r('RF','INV','SUM','{Rf}').op('U1','0','SUM','INV')
c.r('RG','FB','0','10k').r('RF2','NONINV','FB','{Rf}').op('U2','IN','FB','NONINV')
c.step('Rf',['10k','20k','100k']).ac(10,1e7).plot('Gain','dB',('db(V(inv))','Inverting',1),('db(V(noninv))','Noninverting',1)).plot('Phase','degrees',('ph(V(inv))','Inverting',1),('ph(V(noninv))','Noninverting',1))
c.check('abs(V(inv))','at',[.98,1.96,9.8],[1.02,2.04,10.2],100).check('abs(V(noninv))','at',[1.96,2.94,10.78],[2.04,3.06,11.22],100)

c=new('opamp-buffer-loading','Buffer and source loading',O,'A voltage follower separates a high-resistance source from its load.',[
 'The direct path forms a voltage divider between the source resistance and load.',
 'The buffered path draws little current from the source. The op-amp supplies the load current instead.',
 'The buffer still has output-current and bandwidth limits. This frequency sweep examines its small-signal response.'])
c.rails().v('VIN','IN','0','0 AC 1','AC 1').r('RS1','IN','DIRECT','10k').r('RL1','DIRECT','0','{Load}').r('RS2','IN','BUFFERIN','10k').op('U1','BUFFERIN','OUT','OUT').r('RL2','OUT','0','{Load}')
c.step('Load',['100','1k','10k']).ac(10,1e7).plot('Gain','dB',('db(V(direct))','Direct load',1),('db(V(out))','Buffered load',1))
c.check('abs(V(direct))','at',[.0098,.090,.49],[.010,.092,.51],100).check('abs(V(out))','at',.98,1.02,100)

c=new('opamp-summing','Summing amplifier',O,'Two input resistors feed a common summing node.',[
 'Negative feedback holds the summing node near ground. Each input therefore produces a current through its resistor.',
 'The feedback resistor converts the sum of those currents to output voltage.',
 'Equal input and feedback resistors give the negative sum of the two input voltages. Here one input supplies a DC offset.'])
c.rails().v('V1','IN','0','SINE(0 0.2 1k)','200 mV peak').v('V2','OFFSET','0','{Offset}').r('R1','IN','SUM','10k').r('R2','OFFSET','SUM','10k').r('RF','OUT','SUM','10k').op('U1','0','SUM','OUT')
c.step('Offset',['-0.5','0','0.5']).tran(.004,1e-6,.002)
volts(c,('V(in)','Signal input'),('V(out)','Output')).check('V(out)','avg',[.49,-.01,-.51],[.51,.01,-.49]).check('V(out)','pp',.39,.41)

c=new('opamp-difference','Four-resistor difference amplifier',DIFF,'Matched resistor ratios reject a shared input voltage and amplify the difference.',[
 'The positive input receives one signal through a divider. The negative input receives the other signal through its input resistor.',
 'Equal resistor ratios make the output equal to the input difference. The common-mode voltage cancels within the amplifier limits.',
 'Resistor mismatch converts common-mode voltage into output error. The examples use equal resistor values to isolate the ideal ratio relation.'])
c.rails().v('V1','A','0','SINE({Common} 0.1 1k)','Common mode plus signal').v('V2','B','0','{Common}')
c.r('R1','B','SUM','10k').r('RF','OUT','SUM','10k').r('R2','A','PLUS','10k').r('R3','PLUS','0','10k').op('U1','PLUS','SUM','OUT')
c.step('Common',['0','2','5']).tran(.004,1e-6,.002)
volts(c,('V(out)','Difference output')).plot('Input voltage','V',('V(a)','Input A',1),('V(b)','Input B',1)).check('V(out)','pp',.198,.202).check('V(out)','avg',-.002,.002)

c=new('opamp-integrator','Practical integrator',O,'A feedback capacitor converts input current into a changing output voltage.',[
 'The input resistor sets capacitor current. Output slope is approximately the negative input voltage divided by resistance and capacitance.',
 'A large resistor across the capacitor provides a DC feedback path. It prevents unlimited DC gain.',
 'Above the resistor-capacitor corner, gain falls by approximately 20 dB per decade. The phase approaches positive 90 degrees.'])
c.rails().v('VIN','IN','0','0 AC 1','AC 1').r('RI','IN','SUM','10k').cap('CF','OUT','SUM','{Cf}').r('RF','OUT','SUM','1Meg').op('U1','0','SUM','OUT')
c.step('Cf',['10n','100n','1u']).ac(1,1e6);frequency(c)
c.check('abs(V(out))','at',[1.5,.15,.015],[1.7,.17,.017],1000)

c=new('opamp-differentiator','Band-limited differentiator',O,'An input capacitor converts changes in input voltage into current.',[
 'The feedback resistor converts capacitor current to output voltage. In the differentiating band, output is proportional to input slope.',
 'The series input resistor limits high-frequency gain. The feedback capacitor provides a second high-frequency limit.',
 'An unlimited differentiator strongly amplifies high-frequency noise. The extra components make the response practical.'])
c.rails().v('VIN','IN','0','0 AC 1','AC 1').cap('CI','IN','X','{Cin}').r('RI','X','SUM','1k').r('RF','OUT','SUM','100k').cap('CF','OUT','SUM','10p').op('U1','0','SUM','OUT')
c.step('Cin',['1n','10n','100n']).ac(1,1e7);frequency(c)
c.check('abs(V(out))','at',[.06,.60,6],[.066,.66,6.6],100)

c=new('transimpedance-amplifier','Transimpedance amplifier',O,'An op-amp converts input current to output voltage through a feedback resistor.',[
 'Negative feedback holds the input node near ground. Most input current flows through the feedback resistor.',
 'The low-frequency transimpedance is approximately the negative feedback resistance. Here its magnitude is 100 kilohms.',
 'Input capacitance affects loop stability. The feedback capacitor reduces high-frequency gain and improves phase margin.'])
c.rails().current('IIN','0','SUM','AC 1').cap('CI','SUM','0','100p').r('RF','OUT','SUM','100k').cap('CF','OUT','SUM','{Cf}').op('U1','0','SUM','OUT')
c.step('Cf',['10p','100p','1n']).ac(10,1e7)
c.plot('Transimpedance','dB ohms',('db(V(out))','Transimpedance',1)).plot('Phase','degrees',('ph(V(out))','Phase',1))
c.check('abs(V(out))','at',97000,103000,100)

c=new('opamp-gain-bandwidth','Closed-loop gain and bandwidth',O,'Higher closed-loop gain reduces the bandwidth of a dominant-pole op-amp.',[
 'The op-amp gain-bandwidth product is set to 1 MHz. The resistor choices produce nominal gains of 2, 10, and 100.',
 'The approximate bandwidth is gain-bandwidth product divided by noise gain.',
 'This relation applies to the dominant-pole response. Additional poles and loading can change the result.'])
c.rails().v('VIN','IN','0','0 AC 1','AC 1').r('RG','FB','0','1k').r('RF','OUT','FB','{Rf}').op('U1','IN','FB','OUT','Avol=1Meg GBW=1Meg Slew=10Meg')
c.step('Rf',['1k','9k','99k'],['Gain 2','Gain 10','Gain 100']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',[1.95,9.7,97],[2.05,10.3,103],100)

c=new('opamp-slew-rate','Slew-rate limiting',O,'A limited output slope prevents a fast, large signal from following the input.',[
 'The input is a 5 V peak sine wave at 100 kHz. Its maximum slope is approximately 3.14 V per microsecond.',
 'The three slew-rate settings lie below and above this requirement.',
 'A low slew rate produces an almost triangular output with reduced amplitude. This is a large-signal limit, not only a bandwidth limit.'])
c.rails().v('VIN','IN','0','SINE(0 5 100k)','5 V peak, 100 kHz').op('U1','IN','OUT','OUT','Avol=1Meg GBW=10Meg Slew={Rate}').r('RL','OUT','0','10k')
c.step('Rate',['100k','500k','10Meg'],['0.1 V/us','0.5 V/us','10 V/us']).tran(100e-6,20e-9,80e-6)
volts(c,('V(in)','Input'),('V(out)','Output')).check('V(out)','pp',[.35,2.1,9.7],[.7,2.9,10.1])

c=new('opamp-clipping','Output clipping',O,'An amplifier cannot produce output voltage beyond its available supply range.',[
 'The feedback network requests a gain of negative two. The input amplitude increases between runs.',
 'Once the requested output exceeds the available swing, the waveform clips near the output limits.',
 'Feedback no longer holds the input difference near zero during clipping. Recovery also depends on the amplifier dynamics.'])
c.rails().v('VIN','IN','0','SINE(0 {Amplitude} 1k)','1 kHz sine').r('RI','IN','SUM','10k').r('RF','OUT','SUM','20k').op('U1','0','SUM','OUT').r('RL','OUT','0','10k')
c.step('Amplitude',['1','5','10']).tran(.004,2e-7,.002)
volts(c,('V(in)','Input'),('V(out)','Output')).check('V(out)','max',[1.95,9.8,11.2],[2.05,10.2,11.7])

c=new('capacitive-load-compensation','Capacitive load and isolation resistor',O,'A series output resistor separates a capacitive load from the amplifier feedback node.',[
 'The load capacitance adds phase lag through the amplifier output impedance. This can cause overshoot and ringing.',
 'The feedback connects before the isolation resistor. The resistor reduces the capacitive loading seen inside the loop.',
 'A larger isolation resistor can reduce ringing, but it also slows the load voltage and creates a load-dependent voltage drop.'])
c.rails().v('VIN','IN','0','PULSE(0 1 2u 20n 20n 10u 20u)','0 to 1 V step').op('U1','IN','RAW','RAW').r('RISO','RAW','OUT','{Riso}').cap('CL','OUT','0','10n').r('RL','OUT','0','100k')
c.step('Riso',['0.1','22','100']).tran(40e-6,5e-9,detail=[1e-6,8e-6])
volts(c,('V(in)','Input'),('V(out)','Load output')).check('V(out)','max',.95,2.5).check('V(out)','at',.97,1.03,10e-6)

# Filters and timing.
c=new('rc-filter-pair','RC low-pass and high-pass filters',FILTER,'The same resistor and capacitor values produce opposite first-order filter responses.',[
 'The low-pass path takes its output across the capacitor. The high-pass path takes its output across the resistor.',
 'The corner frequency is one divided by two pi times resistance and capacitance.',
 'At the corner, each magnitude is approximately 0.707 of its passband value. Each response changes by 20 dB per decade in its stopband.'])
c.v('VIN','IN','0','AC 1','AC 1').r('RLP','IN','LOW','1k').cap('CLP','LOW','0','{C}').cap('CHP','IN','HIGH','{C}').r('RHP','HIGH','0','1k')
c.step('C',['10n','100n','1u']).ac(1,1e7).plot('Gain','dB',('db(V(low))','Low-pass',1),('db(V(high))','High-pass',1)).plot('Phase','degrees',('ph(V(low))','Low-pass',1),('ph(V(high))','High-pass',1))
c.check('abs(V(low))','at',[.99,.84,.15],[1.01,.86,.17],1000)

c=new('active-filter-pair','Active low-pass and high-pass filters',FILTER,'Op-amps buffer first-order filters and add voltage gain.',[
 'Each input filter feeds a noninverting amplifier with a gain of two.',
 'The amplifier input draws little filter current. This reduces the change in corner frequency caused by the following load.',
 'The active stage also has finite bandwidth. Its high-frequency limit appears beyond the filter corner.'])
c.rails().v('VIN','IN','0','AC 1','AC 1')
c.r('RLP','IN','LP','10k').cap('CLP','LP','0','{C}').r('RG1','FB1','0','10k').r('RF1','LOW','FB1','10k').op('U1','LP','FB1','LOW')
c.cap('CHP','IN','HP','{C}').r('RHP','HP','0','10k').r('RG2','FB2','0','10k').r('RF2','HIGH','FB2','10k').op('U2','HP','FB2','HIGH')
c.step('C',['1n','10n','100n']).ac(1,1e7).plot('Gain','dB',('db(V(low))','Low-pass',1),('db(V(high))','High-pass',1))
c.check('abs(V(low))','at',[1.97,1.67,.30],[2.03,1.72,.33],1000)

c=new('active-bandpass','Buffered band-pass filter',FILTER,'A high-pass stage rejects low frequencies, and a following low-pass stage rejects high frequencies.',[
 'The buffer separates the two resistor-capacitor networks. Their responses then multiply without substantial mutual loading.',
 'The lower corner is approximately 159 Hz. The upper corner changes with the selected low-pass capacitor.',
 'A wide gap between the corners gives a nearly flat middle band. Closely spaced corners reduce the peak gain.'])
c.rails().v('VIN','IN','0','AC 1','AC 1').cap('CH','IN','HP','100n').r('RH','HP','0','10k').op('U1','HP','BUF','BUF').r('RL','BUF','OUT','10k').cap('CL','OUT','0','{C}')
c.step('C',['1n','10n','100n']).ac(1,1e7);frequency(c)
c.check('abs(V(out))','at',[.97,.82,.15],[1,.86,.17],1000)

c=new('comparator-hysteresis','Comparator with positive feedback',CMP,'Positive feedback creates separate switching thresholds for rising and falling input.',[
 'The input connects to the inverting terminal. The output feeds the positive terminal through a resistor divider.',
 'A positive output raises the threshold. A negative output lowers it. The input must cross the opposite threshold to change state again.',
 'This circuit uses an op-amp as a slow comparator. Saturation recovery limits operation at high switching rates.'])
c.rails('5').v('VIN','IN','0','PULSE(-1 1 0 1m 1m 1u 2.002m)','Triangle from -1 to 1 V').r('RF','OUT','PLUS','100k').r('RG','PLUS','0','{Rg}').op('U1','PLUS','IN','OUT')
c.step('Rg',['1k','4.7k','10k']).tran(.006004,1e-7)
volts(c,('V(in)','Input'),('V(plus)','Threshold'),('V(out)','Output')).check('V(out)','max',4.4,4.6).check('V(out)','min',-4.6,-4.4)

c=new('transistor-schmitt-trigger','Transistor Schmitt trigger',B,'Two transistors share an emitter resistor that creates positive feedback.',[
 'When Q1 takes more current, its collector voltage falls and Q2 takes less current.',
 'The shared emitter voltage then changes in the direction that reinforces the transition.',
 'The emitter resistor changes the separation between switching thresholds. Base current and transistor gain also affect the thresholds.',
 'The low collector voltage includes the shared emitter voltage. A larger emitter resistor raises this low output level.'])
c.v('VCC','VCC','0','5').v('VIN','IN','0','PULSE(0 1.5 0 1m 1m 1u 2.002m)','Triangle from 0 to 1.5 V').r('RB','IN','BASE','1k').q('Q1','X','BASE','EM').q('Q2','OUT','X','EM').r('RC1','VCC','X','1k').r('RC2','VCC','OUT','1k').r('RE','EM','0','{Re}')
c.step('Re',['20','47','100']).tran(.006004,1e-7)
volts(c,('V(in)','Input'),('V(out)','Output')).check('V(out)','max',4.8,5.1).check('V(out)','min',.01,.9)

for extension in [False,True]:
 c=new('pulse-extension' if extension else 'short-pulse-generator','Transistor pulse extension' if extension else 'Short pulse from an input step',B,
  'A coupling capacitor briefly drives Q2 out of conduction and creates a positive collector pulse.',[
   'A rising input turns Q1 on and lowers its collector voltage. The capacitor transfers this falling edge to the base of Q2.',
   'The base resistor then restores Q2 conduction as the capacitor charges. Resistance and capacitance set the approximate pulse duration.',
   'Q3 holds the first collector low after a short input pulse ends. It releases that node when Q2 returns to conduction.' if extension else 'This version needs an input step that lasts longer than the desired output pulse.',
   'The coupling pulse drives the second base below ground. Check reverse base to emitter voltage when changing the supply.'])
 c.v('VCC','VCC','0','3.3').v('VIN','IN','0','PULSE(0 3.3 0.5m 1u 1u '+('100u 2m)' if extension else '2m 4m)'),'3.3 V pulse')
 c.r('RB1','IN','B1','10k').q('Q1','X','B1','0').r('RC1','VCC','X','1k').cap('CT','X','B2','{C}').r('RB2','VCC','B2','10k').q('Q2','OUT','B2','0').r('RC2','VCC','OUT','1k')
 if extension:c.q('Q3','X','B3','0').r('RB3','OUT','B3','20k')
 c.step('C',['22n','47n','100n']).tran(.005,2e-7,detail=[.0004,.0016])
 volts(c,('V(in)','Input'),('V(out)','Output')).plot('Base voltage','V',('V(b2)','Second base',1))
 c.check('V(out)','max',3.1,3.4)
 c.check('V(out)','width',[.00012,.00025,.00055],[.00025,.00055,.0012])

# Combined amplifier blocks.
c=new('discrete-feedback-amplifier','Discrete amplifier with negative feedback',B,'A differential pair, voltage-gain transistor, and emitter follower form a feedback amplifier.',[
 'Q1 and Q2 compare the input with a divided output voltage. Their shared current source fixes the available tail current.',
 'Q3 adds voltage gain. Q4 supplies output current while its emitter follows the preceding stage.',
 'The output divider requests a gain of ten. The compensation capacitor controls high-frequency loop behavior.',
 'Identify each block separately before following the complete feedback path. The AC sweep examines the linear response around the bias point.'])
c.rails().v('VIN','IN','0','0 AC 1','AC 1').q('Q1','C1','IN','TAIL').q('Q2','VP','FB','TAIL').current('IT','TAIL','VN','2m').r('RC','VP','C1','620')
c.q('Q3','VAS','C1','VP',True).current('IVAS','VAS','VN','1m').q('Q4','VP','VAS','OUT').current('IO','OUT','VN','2m').r('RF','OUT','FB','9k').r('RG','FB','0','1k').r('RL','OUT','0','10k').cap('CC','C1','VAS','{Cc}')
c.step('Cc',['100p','470p','2.2n']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',9.5,10.5,100)

c=new('jfet-bjt-feedback','JFET and BJT feedback amplifier',F,'A JFET input, PNP gain transistor, and NPN follower share a feedback path.',[
 'A rising gate voltage increases JFET current and lowers its drain voltage. The PNP transistor then raises the follower base voltage.',
 'The follower output returns through a resistor to the JFET source. This opposes the initial gate to source voltage change.',
 'The feedback resistor and source resistor largely set the gain. Changing this resistor also changes the DC operating point.'])
c.v('VDD','VDD','0','7.5').v('VIN','IN','0','0 AC 1','AC 1').j('J1','DRAIN','IN','SOURCE').r('RD','VDD','DRAIN','2.1k').r('RS','SOURCE','0','3.3k')
c.q('Q1','BASE','DRAIN','VDD',True).r('RB','BASE','0','10k').q('Q2','VDD','BASE','OUT').r('RL','OUT','0','22k').r('RF','OUT','SOURCE','{Rf}')
c.step('Rf',['1k','3.3k','10k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',[1.2,1.8,3.5],[1.45,2.2,4.5],100)

c=new('jfet-opamp-feedback','JFET input stage with op-amp feedback',F,'An op-amp holds the JFET drain voltage near a reference while returning feedback to its source.',[
 'A fixed drain voltage and drain resistor establish nearly constant drain current.',
 'The source must then follow input changes to keep the gate to source voltage nearly constant.',
 'The output supplies the required source correction through the feedback resistor. The resulting gain is approximately one plus the resistor ratio.',
 'A small capacitor adds a direct high-frequency feedback path around the op-amp.'])
c.rails().v('VIN','IN','0','0 AC 1','AC 1').v('VREF','REF','0','10').r('RD','VP','DRAIN','2k').j('J1','DRAIN','IN','SOURCE').r('RS','SOURCE','0','1k').r('RF','OUT','SOURCE','{Rf}').op('U1','REF','DRAIN','OUT').cap('CF','OUT','DRAIN','47p')
c.step('Rf',['3.3k','10k','22k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',[4.1,10.5,22],[4.5,11.5,24],100)

c=new('jfet-pair-feedback','JFET differential pair inside a feedback loop',F,'A JFET differential pair drives an op-amp, and the output returns to the second gate.',[
 'The first gate receives the input. A divided output voltage drives the second gate.',
 'The op-amp senses the difference between the two drain voltages. Its output moves until the gate voltages nearly agree.',
 'The resistor divider sets the closed-loop gain. The JFET pair provides high input resistance at the signal input.',
 'The compensation capacitor connects the output to the drain at the op-amp negative input. This supplies a direct negative-feedback path at high frequency.'])
c.rails().v('VIN','IN','0','0 AC 1','AC 1').j('J1','D1','IN','TAIL').j('J2','D2','FB','TAIL').current('IT','TAIL','VN','2m').r('RD1','VP','D1','2k').r('RD2','VP','D2','2k')
c.op('U1','D2','D1','OUT').r('RF','OUT','FB','{Rf}').r('RG','FB','0','1k').cap('CF','OUT','D1','100p')
c.step('Rf',['1k','9k','49k']).ac(10,1e7);frequency(c)
c.check('abs(V(out))','at',[1.94,9.7,48.5],[2.06,10.3,51.5],100)

# All items in the working plan are represented, with related variants paired.
if __name__=='__main__':
 specs=[c.write() for c in all_circuits]
 (ROOT/'scripts/ltspice-library-spec.json').write_text(json.dumps(specs,indent=2)+'\n',encoding='utf-8')
 print('Created',len(specs),'circuit files. Run LTspice and the exporter before using their results.')
