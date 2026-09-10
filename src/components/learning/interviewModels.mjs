export function registerField(value, low, width) {
  return (value >>> low) & ((1 << width) - 1);
}
export function motorPoint(voltage, resistance, constant, loadFraction) {
  const stallCurrent = voltage / resistance;
  const current = stallCurrent * loadFraction;
  const speed = (voltage - current * resistance) / constant;
  return {current, torque: constant * current, rpm: speed * 60 / (2 * Math.PI), stallCurrent};
}
// One normalized period. The capacitor voltage is the integral of its current.
export function buckPoint(phase, duty) {
  const p = ((phase % 1) + 1) % 1;
  const on = p < duty;
  const q = p - duty;
  const ic = on ? -1 + 2 * p / duty : 1 - 2 * q / (1 - duty);
  const integral = on ? -p + p * p / duty : q - q * q / (1 - duty);
  const mean = (1 - 2 * duty) / 6;
  return {on, switchNode: on ? 1 : 0, inductorVoltage: on ? 1 - duty : -duty,
    inductorCurrent: 2 + 0.8 * ic, capacitorCurrent: 0.8 * ic,
    capacitorVoltage: integral - mean};
}
