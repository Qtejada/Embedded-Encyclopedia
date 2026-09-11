RC low-pass and high-pass filters

The same resistor and capacitor values produce opposite first-order filter responses.

The low-pass path takes its output across the capacitor. The high-pass path takes its output across the resistor.

The corner frequency is one divided by two pi times resistance and capacitance.

At the corner, each magnitude is approximately 0.707 of its passband value. Each response changes by 20 dB per decade in its stopband.

Extract every file into one folder. Open rc-filter-pair.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open rc-filter-pair.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(low)), db(V(high))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
