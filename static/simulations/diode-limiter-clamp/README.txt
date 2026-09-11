Diode limiter and DC clamp

One path limits voltage. A separate capacitor and diode path shifts the waveform level.

The two limiter diodes conduct on opposite polarities. The series resistor limits their current.

The clamp capacitor stores charge. Its diode holds the negative excursion near one forward diode drop below ground.

The clamp load discharges the capacitor between cycles. A shorter time constant causes more waveform tilt.

Extract every file into one folder. Open diode-limiter-clamp.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open diode-limiter-clamp.plt through Plot Settings > Open Plot Settings File.
Default traces: V(in), V(limit), V(clamp)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
