MOSFET current mirror

Two MOSFETs share gate and source voltages to copy a reference current.

The reference transistor connects its drain to its gate. The reference current sets the common gate voltage.

The output transistor needs enough drain voltage to remain in saturation. Below that voltage, the current falls.

Channel-length modulation gives the output curve a slope. Equal gate voltage alone does not guarantee identical current at different drain voltages.

Extract every file into one folder. Open mosfet-current-mirror.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open mosfet-current-mirror.plt through Plot Settings > Open Plot Settings File.
Default traces: Id(M2)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
