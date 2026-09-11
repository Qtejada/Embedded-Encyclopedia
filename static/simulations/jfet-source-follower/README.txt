JFET source follower

A JFET supplies a source signal with high gate input resistance.

The gate sits at a 2 V DC bias. The source rises above this bias because the JFET needs a negative gate to source voltage.

The source resistor supplies the current path to ground. Source feedback makes the signal gain positive and below one.

The output can supply current through the JFET, but the resistor sets the available current in the other direction.

Extract every file into one folder. Open jfet-source-follower.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open jfet-source-follower.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
