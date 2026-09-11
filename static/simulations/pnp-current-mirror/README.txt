PNP current mirror

A PNP mirror supplies current from the positive rail into a load.

The reference resistor draws current from a diode-connected PNP transistor. Both transistor bases share this voltage.

The output transistor supplies current while its collector stays sufficiently below its emitter.

Collector current uses the SPICE sign convention. The plot reverses that sign to show supplied load current as positive.

Extract every file into one folder. Open pnp-current-mirror.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open pnp-current-mirror.plt through Plot Settings > Open Plot Settings File.
Default traces: -Ic(Q2), I(RR)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
