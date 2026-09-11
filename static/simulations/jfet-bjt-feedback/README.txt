JFET and BJT feedback amplifier

A JFET input, PNP gain transistor, and NPN follower share a feedback path.

A rising gate voltage increases JFET current and lowers its drain voltage. The PNP transistor then raises the follower base voltage.

The follower output returns through a resistor to the JFET source. This opposes the initial gate to source voltage change.

The feedback resistor and source resistor largely set the gain. Changing this resistor also changes the DC operating point.

Extract every file into one folder. Open jfet-bjt-feedback.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open jfet-bjt-feedback.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
