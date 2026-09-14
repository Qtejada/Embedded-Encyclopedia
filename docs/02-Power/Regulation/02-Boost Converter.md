# Boost


import LearningEquation from '@site/src/components/LearningEquation';


## 1. Step-Up Conversion

A **boost converter** produces an output above its input voltage. During switch on-time, the input supplies energy to the inductor.

During off-time, the inductor and input supply current through the rectifier to the output. The output capacitor supplies the load during on-time.

The following equations assume ideal components and **continuous conduction mode (CCM)**. Inductor current remains positive throughout each cycle.

## 2. Voltage and Current Relations

<LearningEquation tex={"V_{out}=\\frac{V_{in}}{1-D}\\qquad\nD=1-\\frac{V_{in}}{V_{out}}"} />

**D** is duty cycle. For output current **Iout**, inductance **L**, and switching frequency **fs**:

<LearningEquation tex={"I_{L,avg}=\\frac{I_{out}}{1-D}\\qquad\n\\Delta I_L=\\frac{V_{in}D}{L f_s}"} />

The switch carries inductor current during on-time. Its current rating cannot be selected from output current alone.

import SwitchingConverterExplorer from '@site/src/components/SwitchingConverterExplorer';

<SwitchingConverterExplorer topology="boost" />

## 3. Worked Example: 5 V to 12 V

**Assumptions:** Output current is 0.2 A. Inductance is 22 µH. Frequency is 500 kHz.

1. Duty cycle is **58.3%**.
2. Average inductor current is **0.48 A**.
3. Ripple is about **0.265 A peak to peak**.
4. Peak inductor current is about **0.613 A**.

If the real converter has 90% efficiency, input power is about **2.67 W**. The corresponding average input current is about **0.533 A**.

The efficiency calculation estimates input current separately. It does not replace a loss model for the switching waveform.

## 4. Important Limits

A conventional diode boost has an input-to-output path through the inductor and diode. Disabling switching does not isolate its output.

* Check startup current into the output capacitor.
* Check output-short protection and true-disconnect features separately.
* Check switch and diode voltage stress, including overshoot.
* Check output-capacitor ripple current.

A CCM boost has a **right-half-plane zero** in its control response. Increasing duty cycle initially leaves less time to deliver energy to the output, even though the final output voltage will be higher. This initial response in the opposite direction limits how fast the feedback loop can safely react.

## 5. Verification

Measure input current at the lowest input voltage. Test the full load range and verify the controller's supported inductor and capacitor values.

**Reference:** [TI, boost power-stage calculations](https://www.ti.com/lit/an/slva372d/slva372d.pdf).


## Switching path and efficiency comparison

import ConverterPaths from '@site/src/components/learning/ConverterPaths';

<ConverterPaths mode="boost" />

With the switch on, the inductor connects between input and ground. Its current increases. The output capacitor supplies the load while the diode blocks.

With the switch off, inductor current continues through the diode into the output. The switch node rises above the input to maintain that current path.

A boost converter is not inherently less efficient than every [buck converter](<./01-Buck%20Converter.md#1-step-down-conversion>). Compare input range, conversion ratio, current, device loss, and control mode.

At high boost ratios, input current greatly exceeds output current. This raises conduction loss and component stress. A diode drop also matters at low output voltage.
