Inverting and noninverting amplifiers

Two feedback networks demonstrate the sign and magnitude of closed-loop voltage gain.

The inverting stage has gain equal to the negative feedback-resistor ratio. Its input resistor carries signal current.

The noninverting stage has gain equal to one plus the resistor ratio. Its input connects directly to the high-resistance op-amp input.

Both stages lose closed-loop gain at high frequency. Their noise gains determine the approximate bandwidth.

Extract every file into one folder. Open opamp-gain-configurations.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open opamp-gain-configurations.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(inv)), db(V(noninv))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
