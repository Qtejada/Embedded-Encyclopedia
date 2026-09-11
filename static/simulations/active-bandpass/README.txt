Buffered band-pass filter

A high-pass stage rejects low frequencies, and a following low-pass stage rejects high frequencies.

The buffer separates the two resistor-capacitor networks. Their responses then multiply without substantial mutual loading.

The lower corner is approximately 159 Hz. The upper corner changes with the selected low-pass capacitor.

A wide gap between the corners gives a nearly flat middle band. Closely spaced corners reduce the peak gain.

Extract every file into one folder. Open active-bandpass.asc and select Run.
Use View > Step Legend to identify parameter steps.
If no plot appears, open active-bandpass.plt through Plot Settings > Open Plot Settings File.
Default traces: db(V(out))

Equal node labels connect. All semiconductor parameters are in the schematic.
Op-amp circuits use UniversalOpamp2, supplied with LTspice. No separate download is needed.
The CIR is the equivalent netlist. The CSV contains original saved samples.
AC data use real and imaginary columns. Time values include the RAW offset.
The website interpolates saved samples. It does not execute LTspice.
