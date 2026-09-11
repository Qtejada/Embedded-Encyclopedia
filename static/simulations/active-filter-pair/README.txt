Active low-pass and high-pass filters

Op-amps buffer first-order filters and add voltage gain.

Each input filter feeds a noninverting amplifier with a gain of two.

The amplifier input draws little filter current. This reduces the change in corner frequency caused by the following load.

The active stage also has finite bandwidth. Its high-frequency limit appears beyond the filter corner.

Extract every file into one folder. Open active-filter-pair.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open active-filter-pair.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(low)), db(V(high))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
