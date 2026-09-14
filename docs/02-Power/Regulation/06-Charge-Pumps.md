---
title: Charge Pumps
sidebar_position: 7
---

import LearningEquation from '@site/src/components/LearningEquation';
import ConverterPaths from '@site/src/components/learning/ConverterPaths';

# Charge Pumps

A **charge pump** moves charge through switched capacitors. It can invert, multiply, or divide a voltage without an inductor.

## Two-phase voltage doubler

<ConverterPaths mode="charge" />

In phase one, switches charge the flying capacitor to the input voltage. In phase two, switches place its lower terminal at the input voltage.

The upper terminal then approaches twice the input voltage, and another switch transfers charge to the output capacitor. The two phases must not overlap in a way that connects incompatible nodes together.

The ideal no-load conversion ratio is two. Load current, switch resistance, capacitor resistance, and incomplete charging reduce the output.

<LearningEquation tex={"V_{out}\\approx 2V_{in}-I_{out}R_{eq}"} />

This equivalent output resistance model applies around a defined operating condition. It does not describe every startup or current-limit state.

## Capacitor and loss limits

Transferred charge follows Q = C times the capacitor voltage change. Increasing switching frequency or flying capacitance can reduce charge-transfer voltage loss.

Increasing capacitance or switching frequency eventually gives less benefit because switch resistance still limits current flow. Some capacitors also lose capacitance when a DC voltage is applied. Check their pulse-current and startup-surge ratings, not just the capacitance printed on the part.

The output capacitor supplies the load between transfer intervals. Its voltage ripple depends on current, interval length, capacitance, and [equivalent series resistance](<../../01-Discrete-Components/01-Passives/02-Capacitors.md#equivalent-series-resistance>).

For an ideal-ratio doubler, input current is about twice output current before additional losses. Efficiency is about output voltage divided by twice input voltage.

For an assumed 3 V input and 5 V output, that approximation gives 83%. Switching and control losses reduce the result further.

A regulated charge pump wastes extra voltage as heat if its conversion ratio gives much more output than needed. Some devices switch between ratios to reduce that loss.

Charge pumps suit bias rails, gate drive, and selected battery-charging architectures. Their pulsed currents require compact loops and appropriate filtering.

See [TI charge-pump design limits](https://www.ti.com/document-viewer/lit/html/SSZTBK7/GUID-87B841CB-3D33-44AE-8B68-83C69BB8491F).
