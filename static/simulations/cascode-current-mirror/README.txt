Cascode current mirror

A second transistor above each mirror branch holds the lower collector voltage nearly constant.

The reference branch establishes two base voltage levels. The upper output transistor uses the higher level.

Changes at the output then have less effect on the lower transistor collector voltage. This reduces the Early-effect current change.

The stacked transistors need additional voltage headroom. High output resistance does not remove this requirement.

Extract every file into one folder. Open cascode-current-mirror.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open cascode-current-mirror.plt through Plot Settings > Open Plot Settings File.
Default traces: Ic(Q4)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
