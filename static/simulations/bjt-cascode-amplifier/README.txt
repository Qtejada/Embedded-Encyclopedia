BJT cascode amplifier

A common-base transistor sits above a common-emitter transistor.

The upper base stays at 3 V. Its emitter holds the lower collector near a fixed voltage.

This reduces the voltage swing across the lower transistor collector junction and limits Miller feedback.

The collector resistor converts current to output voltage. Both transistors still require suitable DC voltage headroom.

Extract every file into one folder. Open bjt-cascode-amplifier.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open bjt-cascode-amplifier.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
