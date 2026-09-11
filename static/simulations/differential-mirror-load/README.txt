Differential pair with mirror load

A PNP mirror combines the two branch-current changes into one output.

The left branch establishes the PNP mirror current. The right branch subtracts its NPN collector current from the mirrored current.

The resulting output current changes a load voltage. This converts the differential signal to a single-ended signal.

The resistor at the output sets a defined DC operating point and limits gain. An unloaded active-load stage can have much higher gain.

Extract every file into one folder. Open differential-mirror-load.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open differential-mirror-load.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
