---
title: LED Blinker (STM32)
---

## Overview
Minimal timer-driven LED blink on STM32. Includes schematics snapshot, firmware outline, and fab outputs.

## Gallery
![Top render](images/top-render.png){ loading=lazy }
![Scope trace](images/scope-ch1.png){ loading=lazy }

## Files
- Download fab outputs: [Gerbers ZIP](downloads/gerbers.zip)
- Download firmware bundle: [Firmware ZIP](downloads/firmware.zip)

## Notes
- Clock: HSI @ 16 MHz, APB prescalers default.
- Timer: TIM2 at 1 Hz interrupt -> toggles LED GPIO.
- Toolchain: GCC + CMake; or CubeIDE.
