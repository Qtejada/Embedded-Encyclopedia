Full-wave bridge rectifier

1. Extract all files into one folder.
2. Open bridge-rectifier.asc in LTspice.
3. Select Run. Three parameter steps appear in the plot.
4. Use View > Step Legend to identify each run.
5. If the plot is empty, select Plot Settings > Open Plot Settings File.
   Open bridge-rectifier.plt. You can also use Add Trace.

Default traces: V(raw,b), V(out)
Parameter: Cfilter
Values: No reservoir (1 pF), 47 uF, 220 uF

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

A 1 pF capacitor approximates no reservoir capacitor. Input is 12 V peak at 50 Hz.
The source has 10 ohms of series resistance. The load is 1 kilohm.
The source floats between RAW and B. Do not ground B. Output return is node 0.
D1/D4 carry the positive path. D2/D3 carry the negative path.
