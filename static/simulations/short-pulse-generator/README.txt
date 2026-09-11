Short pulse from an input step

A coupling capacitor briefly drives Q2 out of conduction and creates a positive collector pulse.

A rising input turns Q1 on and lowers its collector voltage. The capacitor transfers this falling edge to the base of Q2.

The base resistor then restores Q2 conduction as the capacitor charges. Resistance and capacitance set the approximate pulse duration.

This version needs an input step that lasts longer than the desired output pulse.

The coupling pulse drives the second base below ground. Check reverse base to emitter voltage when changing the supply.

Extract every file into one folder. Open short-pulse-generator.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open short-pulse-generator.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
