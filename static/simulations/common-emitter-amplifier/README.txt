Common-emitter amplifier

1. Extract all files into one folder.
2. Open common-emitter-amplifier.asc in LTspice.
3. Select Run. Three parameter steps appear in the plot.
4. Use View > Step Legend to identify each run.
5. If the plot is empty, select Plot Settings > Open Plot Settings File.
   Open common-emitter-amplifier.plt. You can also use Add Trace.

Default traces: V(in), V(out)
Parameter: Cbypass
Values: No bypass (1 pF), 1 uF, 100 uF

All component parameters are included in the files. No external model download is needed.
The ASC uses standard LTspice symbols. The CIR is an equivalent text netlist.
Equal node labels connect, even when no wire joins them on the drawing.
The CSV contains original simulator samples in seconds, volts, and amperes.
The website uses interpolated samples for its cursor and plots.
The validation record contains numeric checks and the schematic hash.

The actual ASC and a refined CIR ran in LTspice 24.1.9 on Windows.
Graphical layout and plot preset behavior remain part of your local trial.
Component values and simulation settings are listed in the schematic.

Files: ASC schematic, CIR netlist, PLT plot preset, CSV data, validation JSON,
and these instructions.

Cbypass changes AC degeneration. Total DC emitter resistance stays at 1 kilohm.
The input is 10 mV peak at 1 kHz. A 1 pF capacitor approximates no bypass.
Data begin at 40 ms. Gain and phase use the final ten periods.
