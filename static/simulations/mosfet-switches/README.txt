N-channel and P-channel switches

1. Extract all files into one folder.
2. Open mosfet-switches.asc in LTspice.
3. Select Run. Three parameter steps appear in the plot.
4. Use View > Step Legend to identify each run.
5. If the plot is empty, select Plot Settings > Open Plot Settings File.
   Open mosfet-switches.plt. You can also use Add Trace.

Default traces: V(ctrl), V(nload), V(pload)
Parameter: Rload
Values: 100 ohms, 330 ohms, 1 kilohm

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

Both gates receive the same 0 to 5 V pulse. The loads switch in opposite states.
These LEVEL=1 models demonstrate polarity, not switching-loss accuracy.
