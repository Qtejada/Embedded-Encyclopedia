---
title: Fields and Materials
sidebar_position: 4
---

import LearningEquation from '@site/src/components/LearningEquation';

# Fields and Materials

## Charge and energy

**Electric charge** produces an electric field. Voltage describes electric potential difference. Current describes the rate of charge transfer.

An electric field exerts force on charge. A source supplies energy that a circuit transfers into heat, motion, light, or stored field energy.

The signal travels through a circuit much faster than individual electrons drift along a wire. The electromagnetic field carries the change through the circuit.

A **conductor** lets charge carriers move easily. An **insulator** makes that movement very difficult under normal conditions. A **semiconductor** falls between them, and its conductivity changes greatly with factors such as doping, temperature, and light.

## Energy bands and doping

Electrons in a solid can occupy certain ranges of energy, called **bands**. Electrons in the **valence band** take part in bonding. Electrons in the **conduction band** can move through the material and carry current.

A **band gap** separates these bands in an ideal semiconductor or insulator. Temperature and light can supply energy that creates mobile electrons and holes.

A **hole** represents a missing electron in an otherwise occupied band. Its motion acts like a positive charge carrier.

**Doping** adds selected impurity atoms. Donors such as phosphorus add electrons in silicon. Acceptors such as boron create holes.

Electrons are the majority carriers in **N-type** material. Holes are the majority carriers in **P-type** material. Each material also contains minority carriers.

**Mobility** relates carrier drift velocity to electric field in the low-field region. Silicon electrons usually have greater mobility than holes under comparable conditions.

<LearningEquation tex={"\\sigma=q(n\\mu_n+p\\mu_p),\\qquad \\rho=\\frac{1}{\\sigma}"} />

Here, n and p are carrier concentrations. Mobility and concentration both affect conductivity. N-type material is not always less resistive than P-type material.

More doping can reduce bulk resistance. It can also reduce mobility and breakdown voltage or increase leakage. Device design balances these effects.

Silicon is common in logic and power devices. Gallium arsenide suits some radio-frequency and optical devices. Silicon carbide and gallium nitride support demanding power applications.

Wide-band-gap power devices can reduce some switching losses and tolerate high fields. Gate drive, layout, cost, and device-specific reverse conduction still require careful design.

See [MIT semiconductor fundamentals](https://ocw.mit.edu/courses/3-091sc-introduction-to-solid-state-chemistry-fall-2010/pages/electronic-materials/14-semiconductors/) for bands, dopants, and carriers.

## Junctions and light

When P-type and N-type regions meet, electrons and holes spread across the junction and recombine. This leaves charged dopant atoms near the junction. These atoms stay fixed in the material.

The area left with few mobile carriers is the **depletion region**. Its electric field opposes further spreading of carriers. Forward bias lowers this barrier, allowing more carriers to cross the junction.

Reverse bias widens the depletion region and limits current until leakage or breakdown dominates. Junction capacitance changes with the depletion width.

A diode has no exact forward-voltage threshold. Its voltage depends on current, temperature, material, and device area. A 0.7 V silicon model is an approximation.

The **photoelectric effect** converts photon energy into an electronic response. External photoemission releases electrons from a surface. Internal conversion creates mobile carriers within a material.

A [photodiode](<../04-Digital-Interfaces/DigitalGeneral.md#iii-detectors>) collects light-generated carriers near its junction. Its response depends on wavelength, optical power, collection efficiency, and electrical bandwidth.

See [Hamamatsu photodetector principles](https://hub.hamamatsu.com/us/en/technical-notes/detector-selection/the-wits-guide-to-selecting-a-photodetector.html) for detector selection and spectral response.

## Dielectrics and conductor losses

A **dielectric** polarizes in an electric field and normally limits conduction. It stores electric energy between capacitor electrodes.

<LearningEquation tex={"C\\approx\\frac{\\epsilon A}{d}"} />

This parallel-plate approximation uses permittivity epsilon, overlap area A, and separation d. Fringing fields and the actual structure change the result.

In an alternating field, the dielectric's polarization may lag behind the field, which wastes some energy as heat. Leakage adds more loss. The **loss tangent** compares this energy loss with the material's energy-storage response.

The **skin effect** concentrates alternating current near a conductor's surface. **Proximity effect** changes the distribution because of nearby conductors.

Both effects can increase [winding resistance](<../01-Discrete-Components/01-Passives/03-Inductors.md#winding-losses-and-a-practical-model>) with frequency. A direct-current resistance measurement does not include these additional losses.

## Electrical breakdown

A strong electric field can make an insulating path conductive. Geometry, pressure, contamination, and material properties affect the breakdown condition.

During a thunderstorm, collisions and moving air separate electric charge. If the electric field becomes strong enough, it turns part of the air into a conducting path. Charge then flows through that path as a discharge.

Lightning demonstrates electrical breakdown on a large scale. A component's small-signal protection rating does not imply protection against a direct lightning strike.


See [National Weather Service lightning science](https://www.weather.gov/safety/lightning-science-overview) for atmospheric breakdown.
