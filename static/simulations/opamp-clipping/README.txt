Output clipping

An amplifier cannot produce output voltage beyond its available supply range.

The feedback network requests a gain of negative two. The input amplitude increases between runs.

Once the requested output exceeds the available swing, the waveform clips near the output limits.

Feedback no longer holds the input difference near zero during clipping. Recovery also depends on the amplifier dynamics.

Extract every file into one folder. Open opamp-clipping.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open opamp-clipping.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
