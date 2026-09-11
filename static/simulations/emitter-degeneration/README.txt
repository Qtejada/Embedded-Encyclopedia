Emitter degeneration and current gain

Two amplifier paths compare complete emitter bypass with partial emitter bypass.

Both paths use the same DC emitter resistance and bias network. The partially bypassed path retains 100 ohms in the signal path.

The stepped forward current gain changes the transistor parameters in both paths.

Emitter degeneration reduces signal gain. It also reduces dependence on the transistor and the bias network.

Extract every file into one folder. Open emitter-degeneration.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open emitter-degeneration.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(outa)), db(V(outb))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
