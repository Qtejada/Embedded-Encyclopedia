# LDOs

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Linear Regulation

A **low-dropout regulator (LDO)** controls a series pass device to hold its output voltage. It dissipates excess input power as heat.

**Dropout voltage** is the required input-to-output difference under specified conditions. It depends on load current, temperature, and the device.

Below the required headroom, the regulator cannot maintain the specified output accuracy.

## 2. Power and Temperature

For output current **Iout** and ground current **IG**:

<LearningEquation tex={"P_D\\approx(V_{in}-V_{out})I_{out}+V_{in}I_G"} />

If ground current is small, efficiency is approximately **Vout/Vin**.

A first thermal estimate is:

<LearningEquation tex={"T_J\\approx T_A+P_D\\theta_{JA}"} />

**TJ** is junction temperature. **TA** is ambient temperature. **θJA** is junction-to-ambient thermal resistance for the specified board conditions.

Do not treat a data-sheet thermal resistance as independent of the printed circuit board.

import PowerBudgetExplorer from '@site/src/components/PowerBudgetExplorer';

<PowerBudgetExplorer mode="ldo" />

## 3. Worked Example: Heat Before Current Rating

**Assumptions:** An LDO converts 5 V to 3.3 V at 0.2 A. Ignore ground current initially.

1. Dissipation is **0.34 W**.
2. Estimated efficiency is **66%**.
3. With an assumed 100 °C/W thermal resistance, junction rise is **34 °C**.
4. At 50 °C ambient, the estimated junction temperature is **84 °C**.

The result needs confirmation with the actual package, copper area, and airflow. It does not establish a safe limit by itself.

## 4. Capacitors and Noise

Use the input and output capacitance range specified for stability. Include ceramic-capacitor loss of capacitance from bias and temperature.

**Power-supply rejection ratio (PSRR)** describes rejection of input ripple at a specified frequency. Output noise is a separate specification.

Check PSRR at the relevant frequency, current, and headroom. A low dropout specification does not guarantee good ripple rejection near dropout.

## 5. Startup and Reverse Current

Check current limit, startup overshoot, minimum load, and behavior with a precharged output. Some LDOs need external protection against reverse current.

**References:** [TI, LDO capacitor selection](https://www.ti.com/document-viewer/lit/html/SSZT654/GUID-310EE2AA-44D3-4067-97D9-F97CEDDFBBF8), [TI, TPS715 application and thermal guidance](https://www.ti.com/lit/gpn/tps715).
