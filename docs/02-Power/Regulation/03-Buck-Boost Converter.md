# Buck-Boost 

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Select the Output Polarity

A **buck-boost converter** can produce an output magnitude above or below its input. The circuit topology determines the output polarity.

* A basic **inverting buck-boost** produces a negative output from a positive input.
* A **four-switch buck-boost** can regulate a positive output as the input passes above and below that output.

Do not apply the inverting voltage equation to every circuit with a buck-boost name.

## 2. Inverting Operation

During switch on-time, the input increases inductor current. During off-time, the inductor supplies the negative output through the rectifier.

For ideal **continuous conduction mode (CCM)**:

<LearningEquation tex={"V_{out}=-V_{in}\\frac{D}{1-D}\\qquad\nD=\\frac{|V_{out}|}{V_{in}+|V_{out}|}"} />

**D** is duty cycle. For switching frequency **fs** and inductance **L**:

<LearningEquation tex={"I_{L,avg}=\\frac{I_{out}}{1-D}\\qquad\n\\Delta I_L=\\frac{V_{in}D}{L f_s}"} />

Here, **Iout** is the positive magnitude of load current.

import SwitchingConverterExplorer from '@site/src/components/SwitchingConverterExplorer';

<SwitchingConverterExplorer topology="inverting" />

## 3. Worked Example: A Negative Rail

**Assumptions:** The input is 5 V. The output is −5 V at 0.2 A. Use 22 µH and 500 kHz.

1. Duty cycle is **50%**.
2. Average inductor current is **0.4 A**.
3. Current ripple is approximately **0.227 A peak to peak**.
4. Peak inductor current is approximately **0.514 A**.
5. Ideal switch blocking stress is **10 V**, before overshoot.

## 4. Four-Switch Operation

A four-switch circuit uses two bridge legs with an inductor between them. The controller selects buck, boost, or transition operation.

Check behavior near equal input and output voltages. Efficiency, ripple, and operating mode can change in this region.

## 5. Design Limits

The inverting topology has pulsed input and output currents. Keep both high-current switching loops compact.

Check the controller's ground reference before connecting enable or feedback signals. A controller used in an inverting arrangement can reference the negative output.

Verify startup, current limit, compensation, and voltage stress with the selected controller.

**References:** [TI, inverting buck-boost analysis](https://www.ti.com/lit/an/slva059a/slva059a.pdf), [TI, four-switch power stage](https://www.ti.com/document-viewer/lit/html/SLVAFJ5).
