# Load Switches


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Controlled Power Connection

A **load switch** connects a supply to a load under logic control. It can reduce standby consumption and control supply startup.

Features vary. Check the data sheet for [current limiting](<../Entry%20Protection/fuses.md#overcurrent-protection>), [reverse blocking](<../Entry%20Protection/ideal-diodes.md#4-body-diode-and-off-state>), output discharge, and thermal protection.

An enable input does not imply that every protection function exists.

## 2. Inrush Current

A discharged load capacitor draws current while its voltage rises:

<LearningEquation tex={"I_C=C_{load}\\frac{dV}{dt}"} />

For a linear ramp from zero to **Vout** in time **tr**:

<LearningEquation tex={"I_{inrush}\\approx\\frac{C_{load}V_{out}}{t_r}"} />

Add the load's operating current to obtain the total switch current during startup.

import PowerBudgetExplorer from '@site/src/components/PowerBudgetExplorer';

<PowerBudgetExplorer mode="inrush" />

## 3. Worked Example: Ramp Time

**Assumptions:** The load has 100 µF of capacitance. The supply is 5 V. The allowed capacitor charging current is 0.1 A.

1. The required linear ramp time is **5 ms**.
2. A 50 mA operating load increases total startup current to about **150 mA**.
3. A 1 ms ramp would require **0.5 A** for the capacitor alone.

Real ramp shapes and capacitance tolerance change the peak current. Verify the waveform with the complete load connected.

## 4. Dissipation and Discharge

During normal conduction:

<LearningEquation tex={"P_{switch}\\approx I^2R_{on}"} />

During a slow startup, the switch can carry a large current while a large voltage remains across it. That can produce much more heat than normal operation. Check the startup limits and allowed load capacitance.

Output discharge drains stored charge after shutdown. Check whether another connected source can still drive the output, because the discharge path would then draw current from that source too.

## 5. Design Checks

1. Check enable behavior while the input supply is absent.
2. Check maximum input voltage and on-resistance at temperature.
3. Check reverse current with the output precharged.
4. Check fault recovery and repeated startup.
5. Check the load's minimum allowed ramp rate.

**References:** [TI, managing inrush current](https://www.ti.com/lit/an/slva670a/slva670a.pdf), [TI, reverse-current protection](https://www.ti.com/lit/an/slva730/slva730.pdf).
