# AC-to-DC Converters

:::danger Design Trap: Peak Currents
Large bulk capacitors reduce ripple, but they cause **high diode peak/charging currents** because the diode only conducts for a tiny fraction of time (when AC voltage > Cap voltage).
For cleaner, more stable DC, a **linear regulator/LDO** (or a switching regulator) after the rectifier is usually better than "just a big cap."
:::
