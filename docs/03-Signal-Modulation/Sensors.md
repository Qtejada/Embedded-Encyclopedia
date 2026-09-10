---
title: Sensors and Measurement Chains
sidebar_position: 20
---

import LearningEquation from '@site/src/components/LearningEquation';

# Sensors and Measurement Chains

A **sensor** detects a physical quantity and produces a usable signal. A **transducer** converts one form of energy or physical effect into another.

Temperature, pressure, light, acceleration, angular rate, and magnetic field are common measured quantities. Select the sensor from range, bandwidth, error, power, and environment.

## Inertial sensing

An **accelerometer** measures specific force along its axes. A stationary supported sensor measures the effect associated with gravity. It does not directly output position.

A **gyroscope** measures angular rate. Integrating that rate estimates orientation change. Offset and noise cause the estimate to drift.

An **inertial measurement unit (IMU)** combines inertial sensors. A six-axis IMU commonly contains three accelerometer axes and three gyroscope axes.

To estimate translation, rotate measurements into a common coordinate frame and account for gravity. Integrate acceleration for velocity, then velocity for position.

An assumed constant acceleration error of 0.01 m/s² produces 0.1 m/s velocity error after 10 s. Its position error reaches 0.5 m.

**Sensor fusion** combines measurements with different strengths. A gyroscope follows rapid rotation. An accelerometer can constrain tilt when other acceleration is small.

External position, magnetic, or visual measurements can constrain other errors. Timestamp errors and calibration errors can defeat the fusion process.

See [Analog Devices gyro drift](https://www.analog.com/en/resources/analog-dialogue/raqs/raq-issue-139.html) for the role of bias and accelerometer feedback.

## Light measurement

Optical power, wavelength, direction, and timing describe different properties of light. A single detector does not measure all of them independently.

**Irradiance** measures incident power per area. **Illuminance** weights visible light for human vision. A lux value is not the same as optical watts.

A [photoresistor](<../04-Digital-Interfaces/DigitalGeneral.md#iii-detectors>) changes resistance with light and can suit slow ambient sensing. A photodiode produces current and can support faster, more linear measurements.

Use optical filters or multiple detector channels to estimate spectral properties. Use lenses or detector arrays to resolve direction and spatial structure.

Light sensing can control display brightness, detect objects, or monitor an optical link. Combine ambient and proximity measurements to distinguish several use conditions.

## Camera signal path

A lens forms an image on a sensor. Pixels collect charge during exposure. Readout circuits convert that charge into electrical values and digital samples.

A typical color pipeline performs black-level correction, defect correction, demosaicing, white balance, color correction, noise reduction, and output encoding. The exact order varies.

Before capture, a phone can continuously estimate exposure, focus, and scene motion. A capture command can select buffered frames and start additional exposures.

Longer exposure collects more photons but increases motion blur. Higher gain brightens the output but does not create more captured light.

Multiple aligned frames can reduce uncorrelated noise. Motion, misalignment, and changing illumination can create artifacts. Night capture modes balance these effects.

**Optical image stabilization (OIS)** moves a lens or sensor to reduce image motion. **Electronic image stabilization (EIS)** transforms or crops recorded images.

OIS can reduce shake during exposure. EIS needs image margin and cannot fully recover detail lost to blur. Neither automatically removes subject motion.

A rolling shutter exposes rows at different times. A global shutter uses a common exposure interval. Motion can distort a rolling-shutter image.

See [Basler shutter types](https://docs.baslerweb.com/electronic-shutter-types) and [image quality adjustment](https://docs.baslerweb.com/optimizing-image-quality).

Measure resolution, noise, dynamic range, color error, distortion, frame timing, and low-light behavior. Keep illumination, target distance, exposure, and processing settings controlled.

## Distance and three-dimensional data

**Light detection and ranging (LiDAR)** measures distance with emitted light. A pulsed time-of-flight system measures the return delay.

<LearningEquation tex={"d=\\frac{c\\,\\Delta t}{2}"} />

The factor of two accounts for the outward and return paths. Here, c is light speed in the propagation medium.

An assumed 20 ns round-trip delay corresponds to about 3 m in air. Timing offsets must be calibrated before interpreting that delay.

Other optical ranging methods use modulation phase or frequency. Their ambiguity and processing limits differ from a simple pulse measurement.

A LiDAR can produce a **point cloud** with position, intensity, and time information. A conventional camera produces image intensity or color and needs additional information for depth.

Mechanical scanning, beam steering, or several sensors can cover a wide field. Full surrounding coverage also needs treatment of blind areas and mounting obstructions.

Reflectivity, sunlight, rain, fog, multipath, timing noise, and motion affect results. Synchronize sensors before combining their data.

See [Analog Devices optical time of flight](https://www.analog.com/en/resources/technical-articles/tof-system-for-distance-measurement-and-object-detection.html).

## Calibration and validation

**Calibration** estimates the relation between sensor output and a reference. **Validation** checks whether the complete system meets its requirements.

1. Select references with suitable uncertainty.
2. Sweep the required input range in both directions.
3. Repeat measurements at controlled temperatures and supply voltages.
4. Estimate offset, gain, nonlinearity, hysteresis, noise, and drift.
5. Fit a correction only within its justified range.
6. Validate with independent measurements.

Report uncertainty together with bandwidth and averaging time. More decimal places do not establish accuracy. Store calibration identity and date with the device data.
