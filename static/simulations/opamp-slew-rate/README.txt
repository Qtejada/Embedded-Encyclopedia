Slew-rate limiting

A limited output slope prevents a fast, large signal from following the input.

The input is a 5 V peak sine wave at 100 kHz. Its maximum slope is approximately 3.14 V per microsecond.

The three slew-rate settings lie below and above this requirement.

A low slew rate produces an almost triangular output with reduced amplitude. This is a large-signal limit, not only a bandwidth limit.

Extract every file into one folder. Open opamp-slew-rate.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open opamp-slew-rate.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
