# LDOs


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Linear Regulation

A **low-dropout regulator (LDO)** controls a series pass device to hold its output voltage. It dissipates excess input power as heat.

**Dropout voltage** is the required input-to-output difference under specified conditions. It depends on load current, temperature, and the device.

If the input voltage gets too close to the output voltage, the regulator runs out of room to adjust and can no longer maintain its specified accuracy.

## 2. Power and Temperature

For output current **Iout** and ground current **IG**:

<LearningEquation tex={"P_D\\approx(V_{in}-V_{out})I_{out}+V_{in}I_G"} />

If ground current is small, efficiency is about **Vout/Vin**.

A first thermal estimate is:

<LearningEquation tex={"T_J\\approx T_A+P_D\\theta_{JA}"} />

**TJ** is [junction temperature](<../Entry%20Protection/fuses.md#junction-temperature-equation>). **TA** is ambient temperature. **θJA** is junction-to-ambient [thermal resistance](<../Entry%20Protection/fuses.md#thermal-resistance-chain>) for the specified board conditions.

A datasheet's thermal resistance was measured or calculated for a particular board setup. Your copper area and PCB construction affect the actual temperature rise.

import PowerBudgetExplorer from '@site/src/components/PowerBudgetExplorer';

<PowerBudgetExplorer mode="ldo" />

## 3. Worked Example: Heat Before Current Rating

**Assumptions:** An LDO converts 5 V to 3.3 V at 0.2 A. Ignore ground current initially.

1. Dissipation is **0.34 W**.
2. Estimated efficiency is **66%**.
3. With an assumed 100 °C/W thermal resistance, junction rise is **34 °C**.
4. At 50 °C ambient, the estimated junction temperature is **84 °C**.

The result needs confirmation with the actual package, copper area, and airflow. It does not prove a safe limit by itself.

## 4. Capacitors and Noise

Use the input and output capacitance range specified for stability. Include ceramic-capacitor loss of capacitance from bias and temperature.

**Power-supply rejection ratio (PSRR)** describes rejection of input ripple at a specified frequency. Output noise is a separate specification.

Check power-supply rejection ratio (PSRR) at your noise frequency, load current, and input-to-output voltage difference. An LDO may keep regulating near dropout while doing a poor job of removing input ripple.

## 5. Startup and Reverse Current

Check current limit, startup overshoot, minimum load, and behavior with a precharged output. Some LDOs need external protection against [reverse current](<../Entry%20Protection/ideal-diodes.md#4-body-diode-and-off-state>).

**References:** [TI, LDO capacitor selection](https://www.ti.com/document-viewer/lit/html/SSZT654/GUID-310EE2AA-44D3-4067-97D9-F97CEDDFBBF8), [TI, TPS715 application and thermal guidance](https://www.ti.com/lit/gpn/tps715).


## Light-load efficiency and the pass-element model

A linear regulator's pass device can resemble a controlled resistance at one operating point. Feedback changes its conduction to maintain the output.

That local model does not make the regulator a fixed resistor. Dropout, current limit, loop response, and thermal behavior need separate checks.

<LearningEquation tex={"\\eta=\\frac{V_{out}I_{out}}{V_{in}(I_{out}+I_q)}"} />

This estimate treats the ground current as Iq and leaves out other loads. When the useful load draws very little current, the regulator's own operating current can become the largest part of the total.

A low-quiescent-current LDO can outperform a switching converter when input and output voltages are close. Compare actual efficiency curves at the intended load.
