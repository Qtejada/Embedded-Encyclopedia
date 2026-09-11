# LTspice batch one: local review

Five new circuits are ready for the owner's trial. This batch has not been committed, pushed, or deployed. Publish only after the owner approves it.

Local review page: http://127.0.0.1:3000/Embedded-Encyclopedia/ltspice-batch-one

Combined download: static/simulations/ltspice-batch-one.zip

## Circuit changes

| Circuit | Article addition | Parameter cases | Main result |
| --- | --- | --- | --- |
| Half-wave rectifier | Diodes: reservoir charging and current pulses | 1 pF, 47 uF, 220 uF | Ripple falls from 3.311 V to 0.784 V between the two reservoir capacitors. |
| Full-wave bridge rectifier | Diodes: both current paths and recharge frequency | 1 pF, 47 uF, 220 uF | Ripple falls from 1.507 V to 0.338 V between the two reservoir capacitors. |
| JFET self bias | FETs: source feedback and supply headroom | 470, 1000, 2200 ohms | At 12 V, drain currents are 1.876, 1.131, and 0.617 mA. |
| N-channel and P-channel switches | FETs: gate voltage relative to source and load placement | 100, 330, 1000 ohms | With 100 ohms, each on current is 49.07 mA. The two loads switch in opposite states. |
| Common-emitter amplifier | BJTs: bias, bypass, gain, and phase | 1 pF, 1 uF, 100 uF | Gain magnitudes are 3.003, 14.35, and 25.53 V/V. Mean collector voltage stays near 7.573 V. |

The 1 pF cases approximate an absent reservoir or bypass capacitor. All models are component models at 27 degrees Celsius.

The rectifiers use a 12 V peak, 50 Hz source, 10-ohm source resistance, and a 1-kilohm load. The bridge input floats.

The JFET model has VTO=-2 V, BETA=1.5 mA/V squared, and LAMBDA=0. Its nominal IDSS is 6 mA.

The MOSFETs use symmetric LEVEL=1 models with thresholds of +2 and -2 V. Finite junction capacitance avoids an instantaneous idealized drain transition. The example does not predict production switching loss.

The amplifier uses a 10 mV peak, 1 kHz input. A 100-ohm emitter resistor stays unbypassed. A 900-ohm resistor receives the selected bypass capacitor.

## File changes

- Appended five sections to 01-Diodes.md, 02-BJTs.md, and 03-MOSFETs.mdx. Prior writing remains unchanged.
- Added SpiceBatchSimulation.js and its stylesheet. The shared viewer has parameter selection, voltage/current plots, a cursor, schematic enlargement, tables, and downloads.
- Added ltspice-batch-one.json with exported curves and schematic connectivity. Display values retain ten significant digits. CSV data retain the original saved precision.
- Added five folders under static/simulations. Each contains ASC, CIR, PLT, README, CSV, validation JSON, and its own ZIP.
- Added a combined ZIP with all five folders. It contains 30 files and no nested ZIP files.
- Added the ltspice-batch-one review page with subsection links and the combined download.
- Added create-ltspice-batch-one.py, the circuit specification, and the pre-batch article baseline.
- Added export-ltspice-batch-one.py to check simulator output and create all deliverables.
- Added verify-ltspice-batch-one.py to check article preservation, datasets, and archives.
- Updated the pilot verifier to permit append-only additions in the three semiconductor articles. The new verifier enforces the newer baseline.
- Refreshed the existing route report and ignored only the local batch simulation scratch directory.
- Added LTSPICE_CIRCUIT_PLAN.md with the complete working list and batch approval process.

## Validation

- All five ASC files generated the expected net connections and completed in LTspice 24.1.9 for Windows.
- All five portable CIR files completed with half the maximum time step or DC increment and tighter tolerances.
- All 15 parameter cases passed the exported waveform comparison. Maximum voltage difference is below 1.9 mV. Maximum plotted current difference is below 25 uA.
- Rectifiers passed load Ohm's law, current balance, polarity, and decreasing-ripple checks. Both bridge diode pairs carry the correct half cycle.
- JFET results passed the device equation and resistor equations. Increasing source resistance reduces current at 12 V.
- MOSFET results passed complementary state checks and load-current estimates. On currents are within 3 percent of the ideal switch estimate.
- Amplifier results passed bias, active-region, gain, phase, and increasing-bypass checks. The exporter restores the RAW time offset before comparing waveforms.
- All 70 pre-batch article prefixes are unchanged. Only the three specified articles have appended text.
- The previous current mirror package still passes its verification.
- Production build and automated prose checks passed. Historical links, image dimensions, 70 article routes, and 1551 local article links passed.
- The five individual downloads and combined download match their local archives byte for byte over HTTP. Archive integrity checks passed.
- Desktop browser checks covered all five tools, plot selection, parameter changes, cursor endpoints, and displayed results.
- Mobile checks covered the three article layouts at 390 pixels, including both themes across the browser review. Drawings and graphs scroll inside their containers.

The actual LTspice engine verified circuit connectivity and results. The owner should check native schematic layout and automatic plot loading during the trial.

## Reproduce

1. Run scripts/create-ltspice-batch-one.py from the repository root.
2. Run each ASC in tmp/ltspice-batch-one with LTspice switches -b -ascii -Run.
3. Run each corresponding refined CIR with -b -ascii.
4. Run scripts/export-ltspice-batch-one.py.
5. Run scripts/verify-ltspice-batch-one.py and node scripts/verify-ltspice-pilot.mjs.
6. Run npm run build and the existing article/link checks.

Use the installed LTspice executable. Run background processes with a hidden window. Each circuit's README explains normal interactive use.
