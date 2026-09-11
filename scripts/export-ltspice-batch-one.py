"""Check actual LTspice results and publish local data, plots, and ZIP files.

Run only after both ASC and refined CIR simulations. Browser samples use linear
interpolation of saved output. CSV files preserve all original saved samples.
"""
from pathlib import Path
from bisect import bisect_right
from datetime import date
import csv
import hashlib
import json
import math
import re
import zipfile

ROOT=Path(__file__).resolve().parents[1]
WORK=ROOT/'tmp/ltspice-batch-one'
specs=json.loads((ROOT/'scripts/ltspice-batch-one-spec.json').read_text(encoding='utf-8'))
hashfile=lambda p: hashlib.sha256(p.read_bytes()).hexdigest()

def read_raw(p):
    header,body=p.read_text(encoding='ascii').split('Values:\n',1)
    names=[s.split()[1] for s in header.split('Variables:\n')[1].strip().splitlines()]
    n=len(names)
    count=int(re.search(r'No. Points:\s*(\d+)',header)[1])
    offset=float(re.search(r'Offset:\s*([^\s]+)',header)[1]) if 'Offset:' in header else 0
    lines=body.strip().splitlines()
    assert len(lines)==count*n
    runs=[[]]
    for i in range(0,len(lines),n):
        vals=[float(lines[i].split()[1])]+[float(s) for s in lines[i+1:i+n]]
        vals[0]+=offset
        assert all(map(math.isfinite,vals))
        row=dict(zip(names,vals))
        row['axis']=vals[0]
        if runs[-1] and vals[0]<runs[-1][-1]['axis']-1e-12: runs.append([])
        if runs[-1]: assert vals[0]>=runs[-1][-1]['axis']
        runs[-1].append(row)
    return names,runs

def interp(rows,t,key):
    # Cache the time array once per result set.
    if id(rows) not in axis_cache:
        axis_cache[id(rows)]=[r['axis'] for r in rows]
    axes=axis_cache[id(rows)]
    i=min(max(bisect_right(axes,t)-1,0),len(rows)-2)
    a,b=rows[i],rows[i+1]
    f=max(0,min(1,(t-a['axis'])/(b['axis']-a['axis'])))
    return a[key]+f*(b[key]-a[key])

def mean(a): return sum(a)/len(a)
def span(a): return max(a)-min(a)
def harmonic(rows,key):
    vals=[interp(rows,.05+i*.000005,key) for i in range(2000)]
    s=2/len(vals)*sum(v*math.sin(2*math.pi*1000*i*.000005) for i,v in enumerate(vals))
    c=2/len(vals)*sum(v*math.cos(2*math.pi*1000*i*.000005) for i,v in enumerate(vals))
    return math.hypot(s,c),math.degrees(math.atan2(c,s))

axis_cache={}
all_data={}
all_reports=[]
for spec in specs:
    axis_cache.clear()
    slug,kind=spec['slug'],spec['kind']
    folder=ROOT/'static/simulations'/slug
    # LTspice normalizes ASCII u to a micro character in generated netlists.
    net=(WORK/f'{slug}.net').read_bytes().decode('utf-8',errors='replace').replace('\ufffd','u').replace('\u00b5','u').replace('\u03bc','u')
    netlines=[' '.join(s.lower().split()) for s in net.splitlines()]
    for line in spec['expected']:
        assert ' '.join(line.lower().split()) in netlines,(slug,'Unexpected wiring',line)
    for stem in [slug,slug+'-refined']:
        log=(WORK/f'{stem}.log').read_text(encoding='utf-8',errors='replace')
        assert 'Total elapsed time:' in log
        assert not re.search(r'(?im)^.*(?:fatal|singular matrix|failed|error:|timestep too small).*$',log),(stem,log)
        steps=[float(v) for v in re.findall(r'\.step '+spec['parameter'].lower()+r'=([^\s]+)',log)]
        assert steps==spec['values'],(slug,steps)
    names,runs=read_raw(WORK/f'{slug}.raw')
    _,tight=read_raw(WORK/f'{slug}-refined.raw')
    assert len(runs)==len(tight)==3
    cases,reports=[],[]
    for index,(value,rows,refined) in enumerate(zip(spec['values'],runs,tight)):
        for seq in [rows,refined]:
            for row in seq:
                if kind=='bridge': row['source']=row['V(raw)']-row['V(b)']
                if kind=='jfet': row['vgs']=row['V(gate)']-row['V(source)']
        start=spec.get('start',0)
        # Respect actual first/last saved times, including .tran Tstart rounding.
        start=max(start,rows[0]['axis'],refined[0]['axis'])
        stop=min(spec['stop'],rows[-1]['axis'],refined[-1]['axis'])
        step=spec['sampleStep']
        grid=[i*step for i in range(math.ceil((start-1e-12)/step),math.floor((stop+1e-12)/step)+1)]
        keys=list(dict.fromkeys(t[0] for g in spec['traceGroups'] for t in g['traces']))
        points=[[round(t*spec['axisScale'],9)]+[float(f'{interp(rows,t,k):.10g}') for k in keys] for t in grid]
        deltas={k:max(abs(interp(rows,t,k)-interp(refined,t,k)) for t in grid) for k in keys}
        for k,delta in deltas.items():
            limit=5e-5 if k.startswith(('I(','Id(')) else .01
            assert delta<limit,(slug,index,'Refinement discrepancy',k,delta,limit)
        check=dict(parameter=value,savedPoints=len(rows),maxRefinedDifference=deltas)
        stats=[]
        if kind in ['half','bridge']:
            cycle=[r for r in rows if r['axis']>=.18]
            # Check KCL at every original solver sample, not interpolated values.
            residual=max(abs((r['I(D1)']+(r['I(D2)'] if kind=='bridge' else 0))-r['I(RLOAD)']-r['I(CFILTER)']) for r in rows)
            assert residual<1e-6,(slug,residual)
            assert max(abs(r['V(out)']/1000-r['I(RLOAD)']) for r in rows)<1e-9
            out=[interp(rows,.18+i*.00001,'V(out)') for i in range(2001)]
            avg,ripple=mean(out),span(out)
            assert -.01<min(out) and max(out)<12.01
            if index==0:
                assert (3<avg<4) if kind=='half' else (6<avg<7.5)
            else: assert avg>7
            if kind=='bridge':
                assert max(abs(r['I(D1)']-r['I(D4)']) for r in rows)<1e-6
                assert max(abs(r['I(D2)']-r['I(D3)']) for r in rows)<1e-6
                positive=[r for r in cycle if r['source']>8]
                negative=[r for r in cycle if r['source']<-8]
                assert max(r['I(D1)'] for r in positive)>max(r['I(D2)'] for r in positive)
                assert max(r['I(D2)'] for r in negative)>max(r['I(D1)'] for r in negative)
            check.update(meanOutputV=avg,rippleV=ripple,maxKclResidualA=residual)
            stats=[['Mean output',avg,'V'],['Output ripple',ripple,'V peak to peak'],['Peak diode current',max(r['I(D1)'] for r in rows)*1000,'mA']]
        elif kind=='jfet':
            r=rows[-1]
            current=r['Id(J1)']; vgs=r['vgs']
            estimate=.0015*(2+vgs)**2
            assert abs(current-estimate)<1e-8
            assert max(abs(r['I(RD)']-r['Id(J1)']) for r in rows)<1e-8
            assert max(abs(r['V(source)']/value-r['I(RS)']) for r in rows)<1e-9
            assert r['V(drain)']-r['V(source)']>vgs+2
            check.update(currentAt12V_A=current,gateSourceAt12V_V=vgs,shockleyEstimate_A=estimate)
            stats=[['Drain current at 12 V',current*1000,'mA'],['Gate to source at 12 V',vgs,'V'],['Drain to source at 12 V',r['V(drain)']-r['V(source)'],'V']]
        elif kind=='mosfet':
            n_on=interp(rows,.0015,'I(RN)'); p_on=interp(rows,.0005,'I(RP)')
            assert abs(n_on/(5/value)-1)<.03 and abs(p_on/(5/value)-1)<.03
            assert abs(interp(rows,.0005,'I(RN)'))<1e-6
            assert abs(interp(rows,.0015,'I(RP)'))<1e-6
            assert interp(rows,.0015,'V(nload)')<.11
            assert interp(rows,.0005,'V(pload)')>4.89
            assert max(abs((5-r['V(nload)'])/value-r['I(RN)']) for r in rows)<1e-9
            assert max(abs(r['V(pload)']/value-r['I(RP)']) for r in rows)<1e-9
            check.update(nOnCurrentA=n_on,pOnCurrentA=p_on,idealLoadCurrentA=5/value)
            stats=[['N-channel on current',n_on*1000,'mA'],['P-channel on current',p_on*1000,'mA'],['Ideal load current',5/value*1000,'mA']]
        else:
            amp,phase=harmonic(rows,'V(out)')
            input_amp,_=harmonic(rows,'V(in)')
            gain=amp/input_amp
            bias=mean([interp(rows,.05+i*.00001,'V(col)') for i in range(1000)])
            assert all(r['V(col)']>r['V(base)'] for r in rows)
            assert 5<bias<9 and 2<gain<35
            if index==0: assert 2<gain<4
            if index==2: assert 20<gain<30 and abs(abs(phase)-180)<8
            assert max(abs((12-r['V(col)'])/3300-r['I(RC)']) for r in rows)<1e-9
            check.update(gainMagnitude=gain,phaseDegrees=phase,meanCollectorV=bias)
            stats=[['Gain magnitude at 1 kHz',gain,'V/V'],['Output phase',phase,'degrees'],['Mean collector voltage',bias,'V']]
        cases.append(dict(value=value,label=spec['labels'][index],points=points,stats=stats))
        reports.append(check)
    if kind in ['half','bridge']:
        assert reports[2]['rippleV']<reports[1]['rippleV']<reports[0]['rippleV']
    if kind=='jfet': assert reports[0]['currentAt12V_A']>reports[1]['currentAt12V_A']>reports[2]['currentAt12V_A']
    if kind=='ce': assert reports[0]['gainMagnitude']<reports[1]['gainMagnitude']<reports[2]['gainMagnitude']
    # Preserve every original saved variable and time sample in the CSV.
    with (folder/'results.csv').open('w',newline='',encoding='utf-8') as f:
        writer=csv.writer(f); writer.writerow([spec['parameter']]+names)
        for value,rows in zip(spec['values'],runs):
            writer.writerows([[value]+[r[n] for n in names] for r in rows])
    traces=spec['traceGroups'][0]['traces']
    expressions=[('V(raw,b)' if t[0]=='source' else t[0]) for t in traces]
    ids=[34603010+2*i for i in range(len(expressions))]
    plotname='DC transfer characteristic' if kind=='jfet' else 'Transient Analysis'
    plt='['+plotname+']\n{\n Npanes: 1\n {\n  traces: '+str(len(expressions))+' '+ ' '.join('{'+str(n)+',0,"'+s+'"}' for n,s in zip(ids,expressions))+'\n  X: (\' \',0,'+str(spec.get('start',0))+','+str(spec['stop']/5)+','+str(spec['stop'])+')\n  Y[0]: (\' \',0,-1,1,12)\n  Y[1]: (\'_\',0,1e+308,0,-1e+308)\n  Log: 0 0 0\n  GridStyle: 1\n }\n}\n'
    # Set useful axes for current and small-signal plots.
    if kind=='jfet': plt=plt.replace("Y[0]: (' ',0,-1,1,12)","Y[0]: ('m',0,0,0.0005,0.003)")
    if kind=='ce': plt=plt.replace("Y[0]: (' ',0,-1,1,12)","Y[0]: (' ',0,-0.3,0.1,0.3)")
    if kind in ['half','bridge']: plt=plt.replace("Y[0]: (' ',0,-1,1,12)","Y[0]: (' ',0,-14,2,14)")
    if kind=='mosfet': plt=plt.replace("Y[0]: (' ',0,-1,1,12)","Y[0]: (' ',0,-0.5,1,5.5)")
    (folder/f'{slug}.plt').write_text(plt,encoding='ascii')
    report=dict(slug=slug,simulator='LTspice 24.1.9',date=str(date.today()),temperatureC=27,
                ascSha256=hashfile(folder/f'{slug}.asc'),rawSha256=hashfile(WORK/f'{slug}.raw'),
                checks=reports,refinement='Half the maximum time step or DC step, with tighter tolerances.',
                browserData='Linear interpolation of saved LTspice samples. CSV retains original samples.',
                scope='Electrical simulation at 27 C.')
    (folder/'validation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    readme=f'''{spec['title']}

1. Extract all files into one folder.
2. Open {slug}.asc in LTspice.
3. Select Run. Three parameter steps appear in the plot.
4. Use View > Step Legend to identify each run.
5. If the plot is empty, select Plot Settings > Open Plot Settings File.
   Open {slug}.plt. You can also use Add Trace.

Default traces: {', '.join(expressions)}
Parameter: {spec['parameter']}
Values: {', '.join(spec['labels'])}

All component parameters are included in the files. No external model download is needed.
The ASC uses standard LTspice symbols. The CIR is an equivalent text netlist.
Equal node labels connect, even when no wire joins them on the drawing.
The CSV contains original simulator samples in seconds, volts, and amperes.
The website uses interpolated samples for its cursor and plots.
The validation record contains numeric checks and the schematic hash.

The actual ASC and a refined CIR ran in LTspice 24.1.9 on Windows.
Graphical layout and plot preset behavior remain part of your local trial.
Component values and simulation settings are listed in the schematic.

Files: ASC schematic, CIR netlist, PLT plot preset, CSV data, validation JSON,
and these instructions.
'''
    if kind in ['half','bridge']: readme+='\nA 1 pF capacitor approximates no reservoir capacitor. Input is 12 V peak at 50 Hz.\nThe source has 10 ohms of series resistance. The load is 1 kilohm.\n'
    if kind=='bridge': readme+='The source floats between RAW and B. Do not ground B. Output return is node 0.\nD1/D4 carry the positive path. D2/D3 carry the negative path.\n'
    if kind=='jfet': readme+='\nThe model has IDSS=6 mA and VGS(off)=-2 V at 27 C. Compare bias at VDD=12 V.\nLow supply voltage can place the JFET outside its saturation region.\n'
    if kind=='mosfet': readme+='\nBoth gates receive the same 0 to 5 V pulse. The loads switch in opposite states.\nThese LEVEL=1 models demonstrate polarity, not switching-loss accuracy.\n'
    if kind=='ce': readme+='\nCbypass changes AC degeneration. Total DC emitter resistance stays at 1 kilohm.\nThe input is 10 mV peak at 1 kHz. A 1 pF capacitor approximates no bypass.\nData begin at 40 ms. Gain and phase use the final ten periods.\n'
    (folder/'README.txt').write_text(readme,encoding='ascii')
    with zipfile.ZipFile(folder/f'{slug}.zip','w',zipfile.ZIP_DEFLATED) as z:
        for name in [f'{slug}.asc',f'{slug}.cir',f'{slug}.plt','README.txt','results.csv','validation.json']:
            z.write(folder/name,f'{slug}/{name}')
    all_data[slug]=dict(title=spec['title'],kind=kind,parameter=spec['parameter'],analysis=spec['analysis'],axis=spec['axis'],
                        keys=keys,groups=spec['traceGroups'],cases=cases,schematic={k:spec[k] for k in ['components','wires','flags']})
    all_reports.append(report)
    print(slug,json.dumps(reports))
(ROOT/'src/components/learning/data/ltspice-batch-one.json').write_text(json.dumps(all_data,separators=(',',':'))+'\n',encoding='utf-8')
bundle=ROOT/'static/simulations/ltspice-batch-one.zip'
with zipfile.ZipFile(bundle,'w',zipfile.ZIP_DEFLATED) as z:
    for spec in specs:
        folder=ROOT/'static/simulations'/spec['slug']
        for p in sorted(folder.iterdir()):
            if p.suffix!='.zip': z.write(p,f'{spec["slug"]}/{p.name}')
print('PASS: five circuits, three parameter cases each, independent checks, and refined solver agreement.')
