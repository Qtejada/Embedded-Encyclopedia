Discrete amplifier with negative feedback

A differential pair, voltage-gain transistor, and emitter follower form a feedback amplifier.

Q1 and Q2 compare the input with a divided output voltage. Their shared current source fixes the available tail current.

Q3 adds voltage gain. Q4 supplies output current while its emitter follows the preceding stage.

The output divider requests a gain of ten. The compensation capacitor controls high-frequency loop behavior.

Identify each block separately before following the complete feedback path. The AC sweep examines the linear response around the bias point.

Extract every file into one folder. Open discrete-feedback-amplifier.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open discrete-feedback-amplifier.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
