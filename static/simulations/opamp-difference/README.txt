Four-resistor difference amplifier

Matched resistor ratios reject a shared input voltage and amplify the difference.

The positive input receives one signal through a divider. The negative input receives the other signal through its input resistor.

Equal resistor ratios make the output equal to the input difference. The common-mode voltage cancels within the amplifier limits.

Resistor mismatch converts common-mode voltage into output error. The examples use equal resistor values to isolate the ideal ratio relation.

Extract every file into one folder. Open opamp-difference.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open opamp-difference.plt through Plot Settings > Open Plot Settings File.
Default traces: V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
