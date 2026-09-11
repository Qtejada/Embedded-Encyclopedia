Comparator with positive feedback

Positive feedback creates separate switching thresholds for rising and falling input.

The input connects to the inverting terminal. The output feeds the positive terminal through a resistor divider.

A positive output raises the threshold. A negative output lowers it. The input must cross the opposite threshold to change state again.

This circuit uses an op-amp as a slow comparator. Saturation recovery limits operation at high switching rates.

Extract every file into one folder. Open comparator-hysteresis.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open comparator-hysteresis.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(plus), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
