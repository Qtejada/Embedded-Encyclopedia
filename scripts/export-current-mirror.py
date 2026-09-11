"""Validate LTspice output, then export the pilot's curves and download package.

Run from the repository after the two documented LTspice runs. No simulator
output is synthesized by this exporter. All plotted values come from .raw.
"""
from pathlib import Path
import csv
import hashlib
import json
import math
import re
import zipfile

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / 'tmp/ltspice-mirror'
DEST = ROOT / 'static/simulations/bjt-current-mirror'


def read_raw(file):
    text = file.read_text(encoding='ascii')
    header, values = text.split('Values:\n', 1)
    count = int(re.search(r'No. Variables:\s*(\d+)', header)[1])
    points = int(re.search(r'No. Points:\s*(\d+)', header)[1])
    names = [line.split()[1] for line in header.split('Variables:\n')[1].strip().splitlines()]
    lines = values.strip().splitlines()
    assert len(lines) == count * points
    rows = []
    for offset in range(0, len(lines), count):
        row = [float(lines[offset].split()[1])] + [float(v.strip()) for v in lines[offset+1:offset+count]]
        assert all(math.isfinite(v) for v in row)
        rows.append(dict(zip(names, row)))
    runs = [[]]
    for row in rows:
        if runs[-1] and row['VTEST'] < runs[-1][-1]['VTEST']:
            runs.append([])
        runs[-1].append(row)
    return runs


net = (WORK/'bjt-current-mirror.net').read_text()
for line in ['VCC VCC 0 5', 'RREF VCC BASE {Rref}', 'Q1 BASE BASE 0 0 Q_NPN',
             'Q2 OUT BASE 0 0 Q_NPN', 'VTEST OUT 0 1']:
    assert line in net.splitlines(), f'Incorrect generated connectivity: {line}'
for stem in ['bjt-current-mirror', 'refined']:
    log = (WORK/f'{stem}.log').read_text()
    assert 'Total elapsed time:' in log
    assert not re.search(r'(?im)^.*(?:fatal|singular matrix|failed|unknown subcircuit|error:).*$', log)
    assert [int(v) for v in re.findall(r'\.step rref=(\d+)', log)] == [2200, 4300, 8200]

runs, refined = read_raw(WORK/'bjt-current-mirror.raw'), read_raw(WORK/'refined.raw')
assert len(runs) == len(refined) == 3
cases, report, csv_rows = [], [], []
largest_delta = 0
for resistance, rows, tight in zip([2200, 4300, 8200], runs, refined):
    assert len(rows) == 501 and len(tight) == 1001
    max_kcl = 0
    for index, row in enumerate(rows):
        assert abs(row['VTEST'] - index/100) < 1e-10
        delta = abs(row['Ic(Q2)'] - tight[index*2]['Ic(Q2)'])
        largest_delta = max(largest_delta, delta)
        assert delta < 1e-9, 'Results depend on voltage step or solver tolerance'
        max_kcl = max(max_kcl, abs(row['I(RREF)']-row['Ic(Q1)']-row['Ib(Q1)']-row['Ib(Q2)']))
        assert abs(row['I(RREF)'] - (5-row['V(base)'])/resistance) < 1e-10
        csv_rows.append([resistance, row['VTEST'], row['Ic(Q2)'], row['I(RREF)'], row['V(base)'], row['Ic(Q1)']])
    assert max_kcl < 1e-9
    one, five = rows[100], rows[500]
    # Independent first-order calculation: 0.65 V VBE, beta = 100,
    # neglect Early effect. It must agree within 2% at VOUT = 1 V.
    estimate = (5-.65)/resistance * 100/102
    error = abs(one['Ic(Q2)']/estimate-1)
    assert error < .02
    assert five['Ic(Q2)'] > one['Ic(Q2)'] > 0
    assert rows[0]['Ic(Q2)'] < 0  # Preserve real reverse-current behavior.
    cases.append({'resistance':resistance, 'points':[[round(row[key]*scale, 9) for key,scale in
        [('VTEST',1),('Ic(Q2)',1000),('I(RREF)',1000),('V(base)',1),('Ic(Q1)',1000)]] for row in rows]})
    report.append({'resistanceOhms':resistance, 'outputAt1V_A':one['Ic(Q2)'],
                   'outputAt5V_A':five['Ic(Q2)'], 'handEstimateAt1V_A':estimate,
                   'handEstimateRelativeError':error, 'maxKclResidual_A':max_kcl})

result = {'simulator':'LTspice 24.1.9', 'temperatureC':27,
          'columns':['outputV','output_mA','reference_mA','baseV','q1Collector_mA'], 'cases':cases}
data_dir = ROOT/'src/components/learning/data'
data_dir.mkdir(exist_ok=True)
(data_dir/'current-mirror.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
with (DEST/'results.csv').open('w',newline='') as f:
    writer=csv.writer(f)
    writer.writerow(['Rref_ohm','Vout_V','Ic_Q2_A','I_RREF_A','Vbase_V','Ic_Q1_A'])
    writer.writerows(csv_rows)
validation={'simulator':result['simulator'],'date':'2026-09-11','temperatureC':27,
            'sweep':'VTEST 0 to 5 V, 0.01 V steps; Rref 2200, 4300, 8200 ohms',
            'refinement':'0.005 V steps; reltol 1e-8, abstol 1e-14, vntol 1e-9',
            'maxRefinedDifference_A':largest_delta,'checks':report,
            'ascSha256':hashlib.sha256((DEST/'bjt-current-mirror.asc').read_bytes()).hexdigest(),
            'rawSha256':hashlib.sha256((WORK/'bjt-current-mirror.raw').read_bytes()).hexdigest(),
            'scope':'DC sweep at 27 C.'}
(DEST/'validation.json').write_text(json.dumps(validation,indent=2)+'\n')
with zipfile.ZipFile(DEST/'bjt-current-mirror.zip','w',zipfile.ZIP_DEFLATED) as z:
    for name in ['bjt-current-mirror.asc','bjt-current-mirror.plt','bjt-current-mirror.cir','README.txt','results.csv','validation.json']:
        info=zipfile.ZipInfo('bjt-current-mirror/'+name,date_time=(2026,9,11,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(info,(DEST/name).read_bytes())
print(json.dumps(validation,indent=2))
