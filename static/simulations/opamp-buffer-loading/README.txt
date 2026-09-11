Buffer and source loading

A voltage follower separates a high-resistance source from its load.

The direct path forms a voltage divider between the source resistance and load.

The buffered path draws little current from the source. The op-amp supplies the load current instead.

The buffer still has output-current and bandwidth limits. This frequency sweep examines its small-signal response.

Extract every file into one folder. Open opamp-buffer-loading.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open opamp-buffer-loading.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(direct)), db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
