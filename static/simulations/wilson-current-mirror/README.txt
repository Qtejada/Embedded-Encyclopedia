Wilson current mirror

A third transistor feeds current back into the mirror base node.

The reference current enters the collector of Q2 and the base of Q3. Q3 supplies the diode-connected Q1 and the mirror base currents.

This feedback reduces base-current error and increases output resistance.

The additional transistor requires more output voltage than a basic two-transistor mirror. Examine the low-voltage portion of the sweep.

Extract every file into one folder. Open wilson-current-mirror.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open wilson-current-mirror.plt through Plot Settings > Open Plot Settings File.
Default traces: Ic(Q3)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
