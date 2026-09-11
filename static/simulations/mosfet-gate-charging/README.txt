MOSFET gate charging and switching energy

A gate resistor controls how quickly gate capacitance receives charge.

The capacitor between gate and drain couples drain voltage changes into the gate. This produces the Miller portion of the transition.

The drain resistor sets a resistive load. During a transition, the transistor can carry current while substantial drain voltage remains.

The power plot multiplies drain voltage by drain current. Its time integral gives the energy dissipated during the selected interval.

The explicit gate capacitors make the charge paths visible. Device data are required to predict the losses of a selected transistor.

Extract every file into one folder. Open mosfet-gate-charging.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open mosfet-gate-charging.plt through Plot Settings > Open Plot Settings File.
Default traces: V(gate), V(out)

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
