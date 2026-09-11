JFET common-source amplifier

The source resistor sets DC bias, and its bypass capacitor increases signal gain.

The gate resistor fixes the gate DC voltage near ground. The drain current raises the source voltage above ground.

The source capacitor reduces source feedback at higher frequencies. It does not remove the DC source resistance.

A larger drain resistor increases voltage gain while reducing drain voltage headroom.

Extract every file into one folder. Open jfet-common-source.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open jfet-common-source.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
