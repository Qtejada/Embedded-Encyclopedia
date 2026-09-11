Two-terminal JFET current sink

A JFET and source resistor form a current sink between the drain and ground.

The gate connects to ground. Source resistance creates the negative gate to source voltage that sets current.

The current becomes nearly constant after the drain voltage provides sufficient headroom.

The finite slope above this point represents output conductance. The resistor changes both current and required voltage.

Extract every file into one folder. Open jfet-current-source.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open jfet-current-source.plt through Plot Settings > Open Plot Settings File.
Default traces: Id(J1)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
