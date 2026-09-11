JFET self bias

1. Extract all files into one folder.
2. Open jfet-self-bias.asc in LTspice.
3. Select Run. Three parameter steps appear in the plot.
4. Use View > Step Legend to identify each run.
5. If the plot is empty, select Plot Settings > Open Plot Settings File.
   Open jfet-self-bias.plt. You can also use Add Trace.

Default traces: Id(J1)
Parameter: Rsource
Values: 470 ohms, 1 kilohm, 2.2 kilohms

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

The model has IDSS=6 mA and VGS(off)=-2 V at 27 C. Compare bias at VDD=12 V.
Low supply voltage can place the JFET outside its saturation region.
