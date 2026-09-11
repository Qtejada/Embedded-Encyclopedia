Precision half-wave rectifier

An op-amp and two diodes rectify small signals without losing a full diode drop at the output.

Negative input voltage produces a positive output. The feedback resistor sets the magnitude of the inverting gain.

The second diode maintains a feedback path while the output diode blocks. This avoids driving the op-amp deeply into saturation.

Finite bandwidth and diode charge still affect the transition near zero input. Compare the smallest input with the larger inputs.

Extract every file into one folder. Open precision-rectifier.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open precision-rectifier.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
