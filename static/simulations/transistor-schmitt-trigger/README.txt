Transistor Schmitt trigger

Two transistors share an emitter resistor that creates positive feedback.

When Q1 takes more current, its collector voltage falls and Q2 takes less current.

The shared emitter voltage then changes in the direction that reinforces the transition.

The emitter resistor changes the separation between switching thresholds. Base current and transistor gain also affect the thresholds.

The low collector voltage includes the shared emitter voltage. A larger emitter resistor raises this low output level.

Extract every file into one folder. Open transistor-schmitt-trigger.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open transistor-schmitt-trigger.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
