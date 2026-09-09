# Resistors

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Resistance and Power

A **resistor** limits current and converts electrical energy to heat. Its resistance connects voltage and current through Ohm's law.

<LearningEquation tex={"V=IR \\qquad P=VI=I^2R=\\frac{V^2}{R}"} />

Here, **V** is voltage, **I** is current, **R** is resistance, and **P** is power dissipation.

* **Series connection:** Add the resistance values. The same current passes through each resistor.
* **Parallel connection:** Add the conductance values. Each resistor has the same voltage.

<LearningEquation tex={"R_{series}=\\sum R_i \\qquad \\frac{1}{R_{parallel}}=\\sum\\frac{1}{R_i}"} />

## 2. Tolerance and Temperature

**Tolerance** gives the permitted initial resistance range. The **temperature coefficient of resistance (TCR)** describes resistance change with temperature.

For a small temperature interval, use this linear estimate:

<LearningEquation tex={"R(T)\\approx R_0[1+\\alpha(T-T_0)]"} />

**α** is the TCR in inverse degrees Celsius. Divide a value in **parts per million (ppm)** by one million before this calculation.

Self-heating changes the resistor temperature. A small initial tolerance does not remove temperature drift, voltage dependence, or aging.

See [Vishay, resistor temperature and power coefficients](https://www.vishay.com/docs/60108/nonlinea.pdf) for these separate effects.

## 3. Voltage Divider and Loading

For an upper resistor **R1**, a lower resistor **R2**, and an output load **RL**, first calculate the parallel resistance.

<LearningEquation tex={"R_B=R_2\\parallel R_L \\qquad V_{out}=V_{in}\\frac{R_B}{R_1+R_B}"} />

The load decreases the output voltage. A high divider resistance reduces supply current, but it increases sensitivity to input current and interference.

import PassiveDesignExplorer from '@site/src/components/PassiveDesignExplorer';

<PassiveDesignExplorer mode="resistor" />

## 4. Worked Example: A Loaded Divider

**Assumptions:** The input is 5 V. Both divider resistors are 10 kΩ. The load is 100 kΩ. Ignore tolerance initially.

1. The lower equivalent resistance is **9.091 kΩ**.
2. The loaded output is **2.381 V**.
3. The unloaded output is **2.500 V**.
4. Loading causes a **119 mV decrease**, or approximately **4.76%** of the unloaded output.

For two independent 1% resistors without a load, the extreme outputs are **2.475 V** and **2.525 V**.

## 5. Selection Checks

1. Calculate the continuous dissipation at the highest applied voltage.
2. Check the package power rating at the actual temperature.
3. Check the working voltage and pulse rating separately.
4. Use the TCR and tolerance to calculate the required error limit.
5. Use separate sense connections for a low-resistance current shunt.

For example, 12 V across 1 kΩ gives **144 mW**. A nominal 125 mW resistor does not meet that dissipation requirement.
