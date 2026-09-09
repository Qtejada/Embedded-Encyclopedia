# Battery Charging

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Match the Battery Chemistry

A **battery charger** controls energy transfer into a rechargeable cell. The cell manufacturer's limits determine voltage, current, temperature, and termination requirements.

The sequence below describes a common lithium-ion charging method. It is not a universal procedure for every battery chemistry.

## 2. Charging States

1. **Qualification:** Check cell voltage and temperature before charging.
2. **Precharge:** Use a reduced current for a deeply discharged cell, when the cell specification permits recovery.
3. **Constant current:** Limit charging current while cell voltage rises.
4. **Constant voltage:** Hold the specified voltage while charging current decreases.
5. **Termination:** Stop charging when the specified conditions are satisfied.

Timers and temperature monitoring provide additional controls. A protection circuit does not replace the charger.

import ChargeProfileDiagram from '@site/src/components/ChargeProfileDiagram';

<ChargeProfileDiagram />

## 3. Charge Rate and Time

The **C-rate** relates current to rated capacity. For an assumed 2 Ah cell, a 0.5 C current is **1 A**.

An ideal charge estimate is:

<LearningEquation tex={"t=\\frac{\\Delta Q}{I}"} />

**ΔQ** is charge added in ampere-hours. **I** is current in amperes. The resulting time is in hours.

**Worked example:** Adding 1 Ah at a constant 1 A takes **1 hour** ideally.

Actual charging takes longer if the current decreases during voltage regulation or thermal control. Capacity also depends on age and test conditions.

## 4. Power-Path Management

A **power-path circuit** supplies the system while it controls battery charging. It can reduce charge current when the input source reaches its limit.

Without a separate system path, load current can interfere with termination detection. Check the charger architecture before powering a load from the battery node.

[TI, BQ24075-Q1](https://www.ti.com/lit/ds/symlink/bq24075-q1.pdf) illustrates precharge, current regulation, voltage regulation, and power-path management for its supported cells.

## 5. Design and Test Record

Record the exact cell specification. Include charge voltage tolerance, current, permitted temperature range, timer settings, and restart conditions.

For a series pack, also check each cell voltage and the balancing system. Pack voltage alone cannot identify an overcharged individual cell.

Test input removal, load changes, temperature faults, and an absent battery with the selected charger circuit.
