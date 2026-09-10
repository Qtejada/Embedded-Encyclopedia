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

For a series pack, also check each cell voltage and the [balancing system](<../Entry%20Protection/fuses.md#cell-balancing>). Pack voltage alone cannot identify an overcharged individual cell.

Test input removal, load changes, temperature faults, and an absent battery with the selected charger circuit.


## Chemistry and stored energy

| Chemistry | Typical use | Main trade-off |
| --- | --- | --- |
| Primary alkaline | Replaceable general-purpose cells | Do not recharge ordinary primary cells |
| Primary lithium | Long storage and selected low-power loads | Chemistry-specific pulse and temperature limits |
| Nickel-metal hydride | Rechargeable consumer cells | Lower cell voltage and a different charge method |
| Lead-acid | Backup and starting applications | High mass and chemistry-specific maintenance |
| Lithium-ion | Portable rechargeable equipment | Requires matched charge and protection limits |
| Lithium iron phosphate | Selected rechargeable power systems | Different voltage curve and charger limits from many other lithium-ion cells |

**Lithium polymer (LiPo)** commonly describes a lithium-ion pouch cell with a polymer-related electrolyte structure. The label alone does not define its full chemistry.

A typical cell contains a cathode, anode, electrolyte, separator, and current collectors. Many use a graphite anode and a lithium-containing cathode material.

Many consumer lithium-ion cells have a nominal voltage near 3.6 or 3.7 V and a 4.2 V charge limit. Other cells require different limits.

Use the exact cell specification for charge voltage, cutoff voltage, current, and temperature. A nominal voltage is not a safe charging setpoint.

Capacity measures charge, commonly in ampere-hours. Energy measures the integral of voltage times current over time, commonly in watt-hours.

For an assumed 2 Ah cell at 3.7 V nominal, approximate energy is 7.4 Wh. Actual usable energy depends on load, temperature, and cutoff.

## State of charge and aging

**State of charge (SoC)** estimates remaining charge relative to a defined full capacity. **State of health (SoH)** describes degradation against a reference condition.

Voltage alone gives an uncertain SoC estimate under load. Internal impedance, temperature, hysteresis, and chemistry change the voltage relation.

Coulomb counting integrates current but accumulates offset error. A fuel gauge combines measurements with a cell model and correction opportunities.

See [TI fuel-gauge modeling](https://www.ti.com/lit/wp/slpy002/slpy002.pdf) for impedance and capacity estimation.

Aging can reduce capacity and increase resistance. Cold conditions can increase voltage sag. High temperature can accelerate degradation.

Battery impedance depends on frequency and state. A short current pulse and a steady discharge do not necessarily produce the same resistance estimate.

Accurate SoC helps prevent unexpected shutdown and improves runtime prediction. A simple low-battery indicator might tolerate more error than a critical runtime estimate.

## Physical and electrical limits

Monitor cell voltage, current, and temperature. A battery management system can coordinate protection, measurement, balancing, and communication.

Charge acceptance usually decreases during the constant-voltage phase. The permitted maximum charge current comes from the cell specification, not from the charger rating alone.

Overcharge can cause internal reactions, gas, and excessive heat. Deep overdischarge can damage a cell and make later charging unsafe.

A short circuit can release large current and heat. A puncture can damage the separator and create an internal short that external switching cannot remove.

Use mechanical protection, a matched charger, and suitable fault protection. Do not charge a damaged or swollen cell.

For storage, follow the manufacturer's specified charge state and temperature. Storage settings differ from normal full-charge settings.

Protect terminals during handling and use an appropriate battery collection process. Do not puncture or crush a cell to reduce its size.


See the [Panasonic lithium-ion handbook](https://eu.industrial.panasonic.com/sites/default/pidseu/files/downloads/files/panasonic_li-ion_handbook.pdf) for cell behavior and handling principles. Use the selected cell specification for numerical limits.
