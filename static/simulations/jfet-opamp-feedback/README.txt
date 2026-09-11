JFET input stage with op-amp feedback

An op-amp holds the JFET drain voltage near a reference while returning feedback to its source.

A fixed drain voltage and drain resistor establish nearly constant drain current.

The source must then follow input changes to keep the gate to source voltage nearly constant.

The output supplies the required source correction through the feedback resistor. The resulting gain is approximately one plus the resistor ratio.

A small capacitor adds a direct high-frequency feedback path around the op-amp.

Extract every file into one folder. Open jfet-opamp-feedback.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open jfet-opamp-feedback.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
