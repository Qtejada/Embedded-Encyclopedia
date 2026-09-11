JFET differential pair inside a feedback loop

A JFET differential pair drives an op-amp, and the output returns to the second gate.

The first gate receives the input. A divided output voltage drives the second gate.

The op-amp senses the difference between the two drain voltages. Its output moves until the gate voltages nearly agree.

The resistor divider sets the closed-loop gain. The JFET pair provides high input resistance at the signal input.

The compensation capacitor connects the output to the drain at the op-amp negative input. This supplies a direct negative-feedback path at high frequency.

Extract every file into one folder. Open jfet-pair-feedback.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open jfet-pair-feedback.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
