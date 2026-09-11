Differential pair with current-source tail

A constant tail current fixes the total current available to a differential pair.

The differential input changes the division of current between the two transistors.

At zero differential input, matched devices carry nearly equal currents. At large differential input, one transistor carries almost all the tail current.

A practical tail source has finite output resistance and requires voltage headroom. The ideal source here isolates the current-steering relation.

Extract every file into one folder. Open differential-pair-current-tail.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open differential-pair-current-tail.plt through Plot Settings > Open Plot Settings File.
Default traces: Ic(Q1), Ic(Q2)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
