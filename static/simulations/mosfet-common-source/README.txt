MOSFET common-source amplifier

A drain resistor converts channel-current changes into an inverted output voltage.

The gate source voltage sets channel current. The source resistor provides feedback through the source voltage.

This frequency sweep linearizes the circuit at its DC operating point. The AC source value of one makes the output equal to voltage gain.

The drain needs enough voltage to keep the transistor in saturation. This region supports voltage amplification.

Extract every file into one folder. Open mosfet-common-source.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open mosfet-common-source.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
