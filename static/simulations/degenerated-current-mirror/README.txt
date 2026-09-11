Current mirror with emitter resistors

Equal emitter resistors add local feedback to the two mirror transistors.

A transistor with more current develops a larger emitter voltage. This reduces its base to emitter voltage and opposes the increase.

The resistors reduce sensitivity to transistor differences. They also consume voltage headroom.

The reference uses a current source so the resistor comparison does not change the commanded reference current.

Extract every file into one folder. Open degenerated-current-mirror.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open degenerated-current-mirror.plt through Plot Settings > Open Plot Settings File.
Default traces: Ic(Q2)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
