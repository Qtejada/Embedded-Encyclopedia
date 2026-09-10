# Common-Mode Chokes

Notes coming soon...


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Common-Mode and Differential-Mode Current

A **common-mode choke** has coupled windings on one core. Each line passes through a separate winding.

* **Differential-mode current** travels toward the load in one line and returns in the other line.
* **Common-mode current** travels in the same direction in both lines. It returns through another path, such as chassis capacitance.

With the intended winding polarity, differential flux largely cancels. Common-mode flux adds and produces a higher impedance.

For two line voltages measured against the same reference:

<LearningEquation tex={"V_{CM}=\\frac{V_1+V_2}{2}\\qquad V_{DM}=V_1-V_2"} />

## 2. Current-Path Explorer

Change the current mode to compare the magnetic effects. The arrows show current directions at one instant.

import PassiveDesignExplorer from '@site/src/components/PassiveDesignExplorer';

<PassiveDesignExplorer mode="choke" />

## 3. Selection and Limits

1. Find the frequency range of the unwanted common-mode current.
2. Check common-mode impedance in that range.
3. Check differential [insertion loss](<../../05-PCB-Layout/03-trace-impedance.md#distributed-loss-and-termination>) across the required signal bandwidth.
4. Check winding current, resistance, voltage, and temperature limits.
5. Check the component pinout and winding polarity before routing.

Real chokes have [leakage inductance](<./01-Transformers.md#3-real-transformer-limits>) and capacitance. They can attenuate or distort the wanted signal. Current imbalance can also reduce the available magnetic margin.

[Coilcraft, common-mode filter selection](https://www.coilcraft.com/en-us/resources/application-notes/selecting-common-mode-filter-chokes-for-high-speed/) explains the separate common-mode and differential-mode checks.

## 4. Worked Example: Separate the Modes

**Assumptions:** At one instant, line 1 is 3.0 V and line 2 is 2.0 V relative to local ground.

1. The [common-mode voltage](<../../03-Signal-Modulation/Amplifiers/02-differential-amps.md#common-mode-voltage>) is **2.5 V**.
2. The differential voltage is **1.0 V**.
3. An equal 0.4 V disturbance on both lines raises the common-mode voltage to **2.9 V**.
4. The differential voltage remains **1.0 V** in this ideal example.

A real receiver has finite [common-mode rejection](<../../03-Signal-Modulation/Amplifiers/02-differential-amps.md#2-common-mode-rejection-ratio>) and a limited input range. Equal interference can still cause a failure.

## 5. Layout and Verification

Keep the two routes balanced. Avoid a long branch between the connector, protection components, and choke.

Compare signal quality and emissions with the choke installed and bypassed. Use the interface compliance test to confirm that the choke does not damage the signal.

A choke does not replace surge protection or an insulation barrier.
