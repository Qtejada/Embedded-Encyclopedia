---
title: Sensors and Measurement Chains
sidebar_position: 20
---

import LearningEquation from '@site/src/components/LearningEquation';

# Sensors and Measurement Chains

A **sensor** detects a physical quantity and produces a usable signal. A **transducer** converts one form of energy or physical effect into another.

Common sensor measurements include temperature, pressure, light, acceleration, angular rate, and magnetic field. Choose a sensor that covers the range and speed you need, with acceptable error and power use, in the conditions where it will operate.

## Inertial sensing

An **accelerometer** measures specific force along each sensing axis. This is why a sensor resting on a table still registers the effect associated with gravity, even though it is not moving. It does not directly measure position.

A **gyroscope** measures angular rate. Integrating that rate estimates orientation change. Offset and noise cause the estimate to drift.

An **inertial measurement unit (IMU)** combines inertial sensors. A six-axis IMU commonly contains three accelerometer axes and three gyroscope axes.

To estimate movement, first express the measurements in the same coordinate system and account for gravity. Then integrate acceleration to estimate velocity, and integrate velocity to estimate position.

An assumed constant acceleration error of 0.01 m/s² produces 0.1 m/s velocity error after 10 s. Its position error reaches 0.5 m.

**Sensor fusion** combines measurements with different strengths. A gyroscope follows rapid rotation. An accelerometer can constrain tilt when other acceleration is small.

Position measurements, magnetic measurements, or camera data can help correct other errors. Combining sensors only helps when their calibration and timestamps are accurate enough.

See [Analog Devices gyro drift](https://www.analog.com/en/resources/analog-dialogue/raqs/raq-issue-139.html) for the role of bias and accelerometer feedback.

## Light measurement

Optical power, wavelength, direction, and timing describe different properties of light. A single detector does not measure all of them independently.

**Irradiance** measures incident power per area. **Illuminance** weights visible light for human vision. A lux value is not the same as optical watts.

A [photoresistor](<../04-Digital-Interfaces/DigitalGeneral.md#iii-detectors>) changes resistance with light and can suit slow ambient sensing. A photodiode produces current and can support faster, more linear measurements.

Optical filters or several detector channels can show how the light is distributed across wavelengths. Lenses or arrays of detectors can show where the light comes from and how it varies across a scene.

Light sensing can control display brightness, detect objects, or monitor an optical link. Combine ambient and proximity measurements to distinguish several use conditions.

## Camera signal path

A lens forms an image on a sensor. Pixels collect charge during exposure. Readout circuits convert that charge into electrical values and digital samples.

A typical color-processing pipeline corrects the black level and defective pixels, reconstructs full color from the sensor's color-filter pattern (demosaicing), adjusts white balance and color, reduces noise, and encodes the output. The exact order varies.

Before capture, a phone can continuously estimate exposure, focus, and scene motion. A capture command can select buffered frames and start additional exposures.

Longer exposure collects more photons but increases motion blur. Higher gain brightens the output but does not create more captured light.

Combining several aligned frames can reduce noise that changes randomly from one frame to the next. Movement, poor alignment, and changing light can instead produce unwanted marks or blur. Night modes have to balance these effects.

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

Other optical distance measurements use the phase or frequency of a modulated signal. They need different processing, and different distances can sometimes produce the same reading. Their limits are different from those of a simple pulse measurement.

A LiDAR can produce a **point cloud**: a set of measured positions, often with intensity and time recorded for each point. A conventional camera records image brightness or color and needs more information to work out depth.

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

Report measurement uncertainty along with bandwidth and averaging time. More decimal places do not make a reading more accurate. Keep the calibration date and identity with the device's data.