Capacitive load and isolation resistor

A series output resistor separates a capacitive load from the amplifier feedback node.

The load capacitance adds phase lag through the amplifier output impedance. This can cause overshoot and ringing.

The feedback connects before the isolation resistor. The resistor reduces the capacitive loading seen inside the loop.

A larger isolation resistor can reduce ringing, but it also slows the load voltage and creates a load-dependent voltage drop.

Extract every file into one folder. Open capacitive-load-compensation.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open capacitive-load-compensation.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
