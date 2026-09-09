# Buck Converter

Notes coming soon...


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Step-Down Conversion

A **buck converter** produces a lower positive voltage from a positive input. A switch applies pulses to an inductor and output capacitor.

During the main switch on-time, the inductor current increases. During the off-time, current continues through a diode or synchronous switch.

**Continuous conduction mode (CCM)** means that inductor current does not reach zero during the cycle. The equations below assume ideal components and steady CCM operation.

## 2. Duty Cycle and Ripple

**Duty cycle D** is the switch on-time divided by the switching period. **fs** is switching frequency. **L** is inductance.

<LearningEquation tex={"D=\\frac{V_{out}}{V_{in}}\\qquad\n\\Delta I_L=\\frac{(V_{in}-V_{out})D}{L f_s}"} />

The inductor's average current equals the output current in this model.

<LearningEquation tex={"I_{peak}=I_{out}+\\frac{\\Delta I_L}{2}\\qquad\nI_{valley}=I_{out}-\\frac{\\Delta I_L}{2}"} />

If the calculated valley is zero or negative, a diode converter does not satisfy the CCM assumption.

import SwitchingConverterExplorer from '@site/src/components/SwitchingConverterExplorer';

<SwitchingConverterExplorer topology="buck" />

## 3. Worked Example: 12 V to 5 V

**Assumptions:** Input is 12 V. Output is 5 V at 1 A. Inductance is 22 µH. Frequency is 500 kHz.

1. Duty cycle is **41.7%**.
2. Inductor ripple is approximately **0.265 A peak to peak**.
3. Peak current is approximately **1.133 A**.
4. Valley current is approximately **0.867 A**.

The positive valley supports the CCM assumption. Select the current rating with additional margin for tolerance, startup, and transients.

## 4. Output Ripple and Component Limits

For triangular ripple and an ideal output capacitor **C**:

<LearningEquation tex={"\\Delta V_C\\approx\\frac{\\Delta I_L}{8 f_s C}"} />

Equivalent series resistance adds a ripple component. The regulator's stability requirements also constrain the capacitor and inductor values.

Check minimum on-time at high input voltage. Check maximum duty cycle at low input voltage. Use the minimum current-limit specification when checking load capacity.

## 5. Layout and Verification

Keep the input-capacitor switching loop compact. Keep the feedback trace away from the switch node.

Test input extremes, light load, full load, startup, and load steps. Check both output ripple and component temperature.

**Reference:** [TI, buck power-stage calculations](https://www.ti.com/lit/an/slva477b/slva477b.pdf). The explorer uses ideal equations, without the report's loss adjustment.
