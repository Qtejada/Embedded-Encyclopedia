# Resistors


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Resistance and Power

A **resistor** limits current and converts electrical energy to heat. Its resistance connects voltage and current through Ohm's law.

<LearningEquation tex={"V=IR \\qquad P=VI=I^2R=\\frac{V^2}{R}"} />

Here, **V** is voltage, **I** is current, **R** is resistance, and **P** is power dissipation.

* **Series connection:** Add the resistance values. The same current passes through each resistor.
* **Parallel connection:** Add the conductance values. Each resistor has the same voltage.

<LearningEquation tex={"R_{series}=\\sum R_i \\qquad \\frac{1}{R_{parallel}}=\\sum\\frac{1}{R_i}"} />

## 2. Tolerance and Temperature

**Tolerance** gives the allowed initial resistance range. The **temperature coefficient of resistance (TCR)** describes resistance change with temperature.

For a small temperature interval, use this linear estimate:

<LearningEquation tex={"R(T)\\approx R_0[1+\\alpha(T-T_0)]"} />

**α** is the TCR in inverse degrees Celsius. Divide a value in **parts per million (ppm)** by one million before this calculation.

A resistor warms up as it dissipates power, and its resistance changes with that temperature. A tight initial tolerance does not remove drift with temperature or age, or changes caused by applied voltage.

See [Vishay, resistor temperature and power coefficients](https://www.vishay.com/docs/60108/nonlinea.pdf) for these separate effects.

## 3. Voltage Divider and Loading

For an upper resistor **R1**, a lower resistor **R2**, and an output load **RL**, first calculate the parallel resistance.

<LearningEquation tex={"R_B=R_2\\parallel R_L \\qquad V_{out}=V_{in}\\frac{R_B}{R_1+R_B}"} />

Connecting the load lowers the divider's output voltage. Larger divider resistors save supply current, but make the output more sensitive to current drawn by the next circuit and to interference.

import PassiveDesignExplorer from '@site/src/components/PassiveDesignExplorer';

<PassiveDesignExplorer mode="resistor" />

## 4. Worked Example: A Loaded Divider

**Assumptions:** The input is 5 V. Both divider resistors are 10 kΩ. The load is 100 kΩ. Ignore tolerance initially.

1. The lower equivalent resistance is **9.091 kΩ**.
2. The loaded output is **2.381 V**.
3. The unloaded output is **2.500 V**.
4. Loading causes a **119 mV decrease**, or about **4.76%** of the unloaded output.

For two independent 1% resistors without a load, the extreme outputs are **2.475 V** and **2.525 V**.

## 5. Selection Checks

1. Calculate the continuous dissipation at the highest applied voltage.
2. Check the package power rating at the actual temperature.
3. Check the working voltage and pulse rating separately.
4. Use the TCR and tolerance to calculate the required error limit.
5. Use separate sense connections for a low-resistance [current shunt](<../../02-Power/Measurment/Current-sense.md#1-convert-current-to-voltage>).

For example, 12 V across 1 kΩ gives **144 mW**. A nominal 125 mW resistor does not meet that dissipation requirement.


## Construction, preferred values, and failure

For a uniform conductor, resistance is about resistivity times length divided by cross-sectional area. Material, geometry, and temperature all affect the result.

A real resistor includes connection inductance and stray capacitance. A wirewound structure can have substantial inductance. A low-inductance layout reduces loop area.

import PassiveModels from '@site/src/components/learning/PassiveModels';

<PassiveModels kind="resistor" />

Preferred-value series space resistor values by roughly equal ratios, rather than equal differences, within each factor of ten. E12 includes 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, and 8.2.

Multiply those values by powers of ten. E24, E96, and other series provide more choices. See [Vishay preferred values](https://www.vishay.com/docs/28372/e-series.pdf).

Common imperial surface-mount codes include 0402, 0603, and 0805. Their approximate bodies are 1.0 × 0.5, 1.6 × 0.8, and 2.0 × 1.25 mm.

Confirm the coding system and footprint drawing. Metric codes can look similar. Package size alone does not prove power or pulse capability.

Overload can change resistance or open the resistive element. Board flex and solder fatigue can break connections. Contamination can create an unintended parallel leakage path.

Check pulse energy, working voltage, temperature derating, and mechanical conditions. A correct average power calculation does not prove pulse survival.
