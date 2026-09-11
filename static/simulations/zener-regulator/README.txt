Zener shunt regulator

A series resistor supplies a Zener diode and a parallel load.

The source must supply both load current and Zener current. At low input voltage, the diode leaves breakdown and the output falls.

A heavier load takes more current from the series resistor. This reduces the current available to maintain Zener breakdown.

The series resistor also dissipates power. Compare its voltage drop with the current before selecting its power rating.

Extract every file into one folder. Open zener-regulator.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open zener-regulator.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
