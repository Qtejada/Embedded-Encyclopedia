# AC-to-DC Converters

:::danger Design Trap: Peak Currents
Large [bulk capacitors](<../../01-Discrete-Components/01-Passives/02-Capacitors.md#bulk-capacitance>) reduce ripple, but they cause **high diode peak/charging currents** because the diode only conducts for a tiny fraction of time (when AC voltage > Cap voltage).
For cleaner, more stable DC, a **linear regulator/[LDO](<./04-LDOs.md#1-linear-regulation>)** (or a switching regulator) after the rectifier is usually better than "just a big cap."
:::


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Conversion Stages

An **alternating-current (AC) to direct-current (DC) converter** rectifies an alternating input. A filter stores energy between rectifier charging intervals.

A regulator can then control the output voltage. Rectification alone does not provide electrical isolation.

The numerical example below uses an isolated low-voltage secondary. It does not describe a mains-connected construction.

## 2. Full-Wave Rectification

A bridge rectifier uses two conducting diodes during each half-cycle. For a sinusoidal secondary voltage:

<LearningEquation tex={"V_{peak}=\\sqrt{2}V_{RMS}\\qquad V_{C,max}\\approx V_{peak}-2V_F"} />

**VRMS** is root-mean-square voltage. **VF** is the forward drop of one diode at the charging current.

The capacitor voltage decreases while it supplies the load. For small ripple and about constant load current:

<LearningEquation tex={"\\Delta V\\approx\\frac{I_{load}}{2f_{line}C}"} />

**fline** is the AC frequency. Full-wave charging happens twice during each AC cycle.

import PowerBudgetExplorer from '@site/src/components/PowerBudgetExplorer';

<PowerBudgetExplorer mode="rectifier" />

## 3. Worked Example: An Isolated Secondary

**Assumptions:** The secondary is 9 V root mean square at 50 Hz. The load is 0.1 A. Capacitance is 1000 µF.

Assume each conducting diode drops 0.7 V.

1. The secondary peak is about **12.73 V**.
2. The estimated capacitor peak is **11.33 V**.
3. Estimated ripple is **1.0 V peak to peak**.
4. The estimated valley is **10.33 V**.

Check that the ripple's lowest point still leaves enough voltage for the regulator. Include low input voltage, [transformer](<../../01-Discrete-Components/02-Magnetics/01-Transformers.md#1-magnetic-coupling>) voltage sag under load, capacitor tolerance, and the way diode drop changes with current.

## 4. Ratings and Measurements

* Check rectifier reverse voltage and surge current.
* Check capacitor voltage, ripple-current rating, and temperature.
* Check transformer winding current with the actual pulsed load.
* Check [inrush current](<../Power%20Control/Load-Switches.md#2-inrush-current>) and stored energy after disconnection.

A mains supply also needs an appropriate insulation system, spacing, protective components, and test method. Those requirements depend on the product and installation.

**Related explanation:** [Diodes and rectification](../../01-Discrete-Components/03-Semicondctors/01-Diodes.md). The existing power-supply notes also cover offline conversion and isolation.
