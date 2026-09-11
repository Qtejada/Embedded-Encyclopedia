Differential pair with resistor tail

Two transistors share an emitter resistor and steer current between their collectors.

A positive differential input increases one collector current and reduces the other.

The common emitter resistor also responds to common-mode voltage. Its current is not an ideal constant.

Near zero differential input, the response is approximately linear. A larger input steers most of the current to one side.

Extract every file into one folder. Open differential-pair.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open differential-pair.plt through Plot Settings > Open Plot Settings File.
Default traces: Ic(Q1), Ic(Q2)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
