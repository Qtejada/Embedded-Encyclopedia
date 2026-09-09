export const parallel = (a, b) => a * b / (a + b);
export function divider(vin, r1, r2, load) {
  const bottom = parallel(r2, load);
  return {voltage: vin * bottom / (r1 + bottom), unloaded: vin * r2 / (r1 + r2)};
}
export function converter(topology, vin, duty, inductance, frequency, load) {
  const voltage = topology === 'buck' ? vin * duty : topology === 'boost' ? vin / (1 - duty) : -vin * duty / (1 - duty);
  const average = topology === 'buck' ? load : load / (1 - duty);
  const ripple = (topology === 'buck' ? vin - voltage : vin) * duty / (inductance * frequency);
  return {voltage, average, ripple, peak: average + ripple / 2, valley: average - ripple / 2};
}
export function shunt(current, resistance, offset, gain, stray = 0) {
  return {drop: current * resistance, power: current * current * resistance, offsetError: offset / resistance,
    reading: current * (1 + stray / resistance) + offset / resistance, voltage: gain * (current * (resistance + stray) + offset)};
}
export const inrush = (capacitance, voltage, seconds) => capacitance * voltage / seconds;
export function ldo(vin, vout, current, thermal, ambient) {
  return {power: (vin - vout) * current, efficiency: 100 * vout / vin, junction: ambient + (vin - vout) * current * thermal};
}
export function rectifier(vrms, vf, current, frequency, capacitance) {
  const peak = vrms * Math.SQRT2 - 2 * vf;
  const ripple = current / (2 * frequency * capacitance);
  return {peak, ripple, valley: peak - ripple};
}
export function pullup(vdd, vol, sink, capacitance, riseLimit, resistance) {
  return {min: (vdd - vol) / sink, max: riseLimit / (0.8473 * capacitance), rise: 0.8473 * resistance * capacitance,
    lowCurrent: (vdd - vol) / resistance};
}
export function reflection(vs, source, line, load) {
  const gamma = load === Infinity ? 1 : (load - line) / (load + line);
  const incident = vs * line / (source + line);
  return {gamma, incident, reflected: gamma * incident, first: incident * (1 + gamma)};
}
export const drift = (ppm, days) => ppm * days * 86400 / 1e6;
export const noise = (a, b, bandwidth) => Math.hypot(a, b) * Math.sqrt(bandwidth);
export function bga(pitch, diameter, width, clearance, count) {
  const gap = pitch - diameter;
  const needed = count * width + (count + 1) * clearance;
  return {gap, needed, margin: gap - needed, fits: gap - needed >= -1e-10};
}
export function canArbitration(a, b) {
  const bitsA = a.toString(2).padStart(11, '0');
  const bitsB = b.toString(2).padStart(11, '0');
  return {bitsA, bitsB, difference: [...bitsA].findIndex((bit, index) => bit !== bitsB[index]), winner: Math.min(a, b)};
}
export const uartBits = value => [0, ...Array.from({length: 8}, (_, bit) => (value >> bit) & 1), 1];
