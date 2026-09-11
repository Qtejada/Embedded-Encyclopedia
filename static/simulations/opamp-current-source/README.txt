Op-amp controlled current sink

An op-amp drives a MOSFET until the sense-resistor voltage equals the command voltage.

The sense resistor converts current to voltage. Negative feedback forces this voltage toward the command voltage.

For a 100-ohm sense resistor, a 0.5 V command sets approximately 5 mA.

The drain supply must provide the sense voltage and transistor headroom. The circuit cannot maintain current below this compliance voltage.

Extract every file into one folder. Open opamp-current-source.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open opamp-current-source.plt through Plot Settings > Open Plot Settings File.
Default traces: Id(M1)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
