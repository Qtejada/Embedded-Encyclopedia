# Transformers

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Magnetic Coupling

A **transformer** transfers energy between windings through a changing magnetic flux. The **primary winding** receives power. The **secondary winding** supplies the load.

For an ideal transformer, use the turns ratio **n**:

<LearningEquation tex={"n=\\frac{N_s}{N_p}\\qquad \\frac{V_s}{V_p}=n\\qquad \\frac{I_s}{I_p}=\\frac{1}{n}"} />

**N** is the number of turns. Subscripts **p** and **s** identify the primary and secondary. The current relation uses magnitudes at the load.

A load resistance appears at the primary as a **reflected resistance**:

<LearningEquation tex={"R_{in}=R_L\\left(\\frac{N_p}{N_s}\\right)^2"} />

## 2. Flux and Excitation

Voltage changes the core flux. A winding cannot support a continuous direct-current voltage without an increasing magnetizing current.

<LearningEquation tex={"\\Delta B=\\frac{V\\Delta t}{N A_e}"} />

**B** is flux density. **Ae** is the effective core area. This equation assumes a constant winding voltage during **Δt**.

The drive circuit must provide sufficient flux reset. Check the applied **volt-seconds**, frequency, and temperature against the transformer specification.

[Coilcraft, TX1 transformer design guidance](https://www.coilcraft.com/getmedia/522af81d-ddef-4e7f-b314-0ea02bf65b97/Doc1732_Push-Pull_TechBull_TX1.pdf) connects turns ratio and volt-second selection to a specific driver.

import PassiveDesignExplorer from '@site/src/components/PassiveDesignExplorer';

<PassiveDesignExplorer mode="transformer" />

## 3. Real Transformer Limits

* **[Winding resistance](<../01-Passives/03-Inductors.md#winding-losses-and-a-practical-model>)** causes copper loss.
* **Leakage inductance** stores energy that does not couple fully to the other winding.
* **Magnetizing inductance** draws excitation current even with no load.
* **Interwinding capacitance** transfers displacement current across the windings.
* **Core loss** depends on material, frequency, flux swing, and temperature.

Separate windings do not establish a safety rating. Use a transformer with the required insulation system for an isolation barrier.

## 4. Worked Example: Voltage and Load Reflection

**Assumptions:** An ideal transformer has 100 primary turns and 25 secondary turns. Apply 12 V root mean square to the primary.

1. The turns ratio is **0.25**.
2. The secondary voltage is **3 V root mean square**.
3. A 6 Ω load draws **0.5 A** and receives **1.5 W**.
4. The primary load current is **0.125 A**.
5. The reflected load is **96 Ω**.

This example excludes excitation current and losses. A rectifier and capacitor change the winding current waveform and require a separate rating check.

## 5. Design Checks

Check winding polarity, insulation rating, temperature rise, flux reset, and leakage-energy control. Measure the actual winding waveform before the final power test.
