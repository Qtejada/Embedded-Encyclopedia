# Voltage dividers

[TOC]

## Basics
- Set a fraction of a voltage source, $V_{out} = V_{in}\,\dfrac{R_2}{R_1 + R_2}$

## With load
- With load: If $R_L$ is not $>> R_{th}$, $V_{out}$ sags. 

## Thevenin view
- $R_{TH}$ Is the parallel resistance of $R_1$ and $R_2$

## Efficiency
- Inefficient: current through $R_1$ and $R_2$ flows all the time. To reduce sag you make $R_{th}$ small, which increases wasted current.

## Rule of thumb
- Rule of thumb: make divider current 5–10x the maximum load current if you must use a divider as a reference..

## Buffering
- Can use a unity op-amp to reduce voltage sag



# Zeners

[TOC]

## How they work:
- Zeners are diodes that are meant to be reverse biased. When done so, they maintain a constant voltage across them $V_z$
- If the Zener is forward biased, it'll act like normal diode
- Zeners require a small current to "activate" once done so they have their typical voltage drop.
- The Zener's $r_z$ will determine how much the output voltage will change with a change in Zener current.
- Line regulation: change in $V_{out}$ = Change in the voltage source * $\dfrac{r_z}{R_s + r_z}$

## Notes: 
- Zeners are noisy. Adding a small cap across the Zener to ground some noise and improve transient behavior
- Pay attention to the temperature coefficient, it has a big influence
- Efficiency is poor when load current is small relative to Zener current
