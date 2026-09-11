Transimpedance amplifier

An op-amp converts input current to output voltage through a feedback resistor.

Negative feedback holds the input node near ground. Most input current flows through the feedback resistor.

The low-frequency transimpedance is approximately the negative feedback resistance. Here its magnitude is 100 kilohms.

Input capacitance affects loop stability. The feedback capacitor reduces high-frequency gain and improves phase margin.

Extract every file into one folder. Open transimpedance-amplifier.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open transimpedance-amplifier.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
