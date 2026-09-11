Practical integrator

A feedback capacitor converts input current into a changing output voltage.

The input resistor sets capacitor current. Output slope is approximately the negative input voltage divided by resistance and capacitance.

A large resistor across the capacitor provides a DC feedback path. It prevents unlimited DC gain.

Above the resistor-capacitor corner, gain falls by approximately 20 dB per decade. The phase approaches positive 90 degrees.

Extract every file into one folder. Open opamp-integrator.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open opamp-integrator.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
