MOSFET source follower

The source voltage follows the gate while the drain connects to the supply.

The source resistor establishes the operating current. The gate to source voltage supplies the required overdrive above threshold.

The small-signal voltage gain is below one. Source feedback limits changes in gate to source voltage.

This circuit requires voltage headroom. The source cannot reach the gate voltage while the transistor supplies load current.

Extract every file into one folder. Open mosfet-source-follower.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open mosfet-source-follower.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
