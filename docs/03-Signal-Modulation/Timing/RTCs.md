# RTCs

Notes coming soon...

import LearningEquation from '@site/src/components/LearningEquation';


## 1. Timekeeping

A **real-time clock (RTC)** maintains time while the main processor sleeps or loses power. It combines an oscillator, divider, time registers, and control functions.

A backup supply can maintain timekeeping. It does not necessarily keep the serial interface or every output active.

## 2. Frequency Error and Time Error

Oscillator error often uses **parts per million (ppm)**. For constant fractional frequency error:

<LearningEquation tex={"\\Delta t=t\\frac{error_{ppm}}{10^6}"} />

Positive frequency error makes the clock gain time. Negative frequency error makes it lose time.

import RtcDriftExplorer from '@site/src/components/RtcDriftExplorer';

<RtcDriftExplorer />

## 3. Worked Example: A Month Without Correction

**Assumptions:** The oscillator has a constant +20 ppm frequency error. The interval is 30 days.

1. Elapsed real time is **2592000 s**.
2. Time gain is **51.84 s**.
3. A constant +2 ppm error would produce **5.184 s** of gain.

Temperature changes and aging make real error vary. A calibration performed at one temperature may not correct the full operating range.

## 4. Read a Valid Timestamp

Time registers can change while the processor reads them. Use the device's snapshot or coherent-read method.

Some devices store digits in **binary-coded decimal (BCD)**. For example, hexadecimal 0x25 represents decimal 25 in BCD, not decimal 37.

Check oscillator-stop and power-loss flags before trusting a timestamp. Set a known time before clearing a flag that indicates invalid timekeeping.

## 5. Backup and Alarm Checks

1. Use the permitted backup-voltage range.
2. Check whether the device includes a charging path.
3. Do not charge a primary cell through an enabled charging circuit.
4. Include leakage and backup current in the retention estimate.
5. Check alarm polarity, pull-ups, and the method to clear an alarm.

The [Analog Devices DS3231 data sheet](https://www.analog.com/media/en/technical-documentation/data-sheets/ds3231.pdf) describes battery switchover, status flags, and time registers for one RTC.

## 6. Verification

Compare the clock with a known time reference across temperature. Test main-power removal, backup replacement, month rollover, and alarm recovery.

Keep calendar handling and time-zone conversion separate from oscillator accuracy.
