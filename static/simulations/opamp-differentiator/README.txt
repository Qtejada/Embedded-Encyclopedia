Band-limited differentiator

An input capacitor converts changes in input voltage into current.

The feedback resistor converts capacitor current to output voltage. In the differentiating band, output is proportional to input slope.

The series input resistor limits high-frequency gain. The feedback capacitor provides a second high-frequency limit.

An unlimited differentiator strongly amplifies high-frequency noise. The extra components make the response practical.

Extract every file into one folder. Open opamp-differentiator.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open opamp-differentiator.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
