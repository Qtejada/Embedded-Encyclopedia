# LTspice pilot: BJT current mirror

The owner authorized creation and publication of one trial circuit. This update adds one circuit family, with three reference-resistor settings, to the BJT article.

## Changes

- Appended an LTspice current-mirror section to the BJT article. All 70 pre-pilot articles retain their original text.
- Added CurrentMirrorSimulation and its stylesheet. The viewer includes a schematic, actual DC curves, a voltage cursor, a low-voltage view, and a results table.
- Added current-mirror.json, exported from LTspice output. Browser controls select saved samples rather than executing a simulator.
- Added the downloadable ASC schematic, PLT plot settings, equivalent CIR netlist, CSV results, instructions, and validation record. The ZIP contains these six files.
- Added export-current-mirror.py to check connectivity, current balance, expected current, and numerical refinement before exporting data.
- Added ltspice-originals.json and verify-ltspice-pilot.mjs to preserve prior articles and check the exported artifacts.
- Refreshed interview-route-report.json with the new tool and links.
- Ignored only the local tmp/ltspice-mirror simulation directory. Raw simulator scratch files are not published.

## Circuit

A 5 V supply feeds RREF and a diode-connected NPN transistor Q1. Q2 shares the base voltage and has its emitter grounded. VTEST imposes Q2 collector voltage during the sweep.

Both devices use the embedded component model Q_NPN, with IS=1e-14, BF=100, and VAF=100. These are illustrative parameters, not a production-device model. The schematic uses standard LTspice symbols. The equivalent CIR has no library includes.

VTEST sweeps from 0 to 5 V in 10 mV increments. RREF steps through 2.2, 4.3, and 8.2 kilohms. Temperature is 27 degrees Celsius. The 1503 points come from LTspice 24.1.9 on Windows.

For 4.3 kilohms, output current is 0.994099 mA at 1 V and 1.033726 mA at 5 V. Negative collector current near zero output voltage is retained and explained. It arises from base-collector conduction under the imposed test voltage.

## Verification

- The actual ASC generated the expected circuit netlist and completed LTspice batch simulation.
- A second run used the self-contained CIR, 5 mV increments, and tighter tolerances. Maximum output-current difference at shared points was below 1e-9 A.
- Reference current satisfies the resistor equation and the base-node current balance.
- A first-order calculation with VBE=0.65 V and beta=100 agrees within 0.7 percent at 1 V across the three cases.
- All 70 pre-pilot article prefixes remain intact. Only the BJT article receives new text.
- Production build passed. The historical 490 subsection links and 44 image dimension checks passed.
- All 70 article routes, 30 local assets, and 1523 local article links passed.
- The HTTP ZIP matches the local package byte for byte. Archive integrity and the enclosed schematic hash passed.
- Browser checks covered resistor selection, both voltage ranges, voltage endpoints, the results table, light and dark themes, and a 390-pixel mobile viewport.

The native LTspice graphical layout and automatic plot-preset loading are provided for the owner's trial. Connectivity and simulation were checked in the actual LTspice batch engine. No physical circuit or production-device accuracy is claimed.

## Reproduce the data

Run commands from the repository root. Copy the downloadable ASC into tmp/ltspice-mirror and run LTspice with -b -ascii -Run and its absolute filename. Keep the generated NET, LOG, and RAW in that directory.

Copy the CIR to tmp/ltspice-mirror/refined.cir. Change the DC increment to 0.005 and the options to reltol=1e-8 abstol=1e-14 vntol=1e-9 plotwinsize=0. Run that netlist with -b -ascii.

Run python scripts/export-current-mirror.py, then node scripts/verify-ltspice-pilot.mjs and npm run build. The exporter stops if numerical or connectivity checks fail.

Live destination: https://qtejada.github.io/Embedded-Encyclopedia/docs/Discrete-Components/Semicondctors/BJTs#ltspice-example-a-basic-bjt-current-mirror
