Complementary output stage and class AB bias

An NPN and a PNP transistor supply opposite halves of the load current.

Without base bias, neither transistor conducts near zero input. This produces crossover distortion.

A voltage between the bases reduces the dead zone. More bias also increases quiescent current.

Emitter resistors limit current imbalance. A physical bias network must track temperature to control idle current.

Extract every file into one folder. Open complementary-output-stage.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open complementary-output-stage.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
