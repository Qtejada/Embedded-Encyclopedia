Closed-loop gain and bandwidth

Higher closed-loop gain reduces the bandwidth of a dominant-pole op-amp.

The op-amp gain-bandwidth product is set to 1 MHz. The resistor choices produce nominal gains of 2, 10, and 100.

The approximate bandwidth is gain-bandwidth product divided by noise gain.

This relation applies to the dominant-pole response. Additional poles and loading can change the result.

Extract every file into one folder. Open opamp-gain-bandwidth.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open opamp-gain-bandwidth.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
