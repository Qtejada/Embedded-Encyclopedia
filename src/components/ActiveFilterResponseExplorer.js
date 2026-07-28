import React, {useMemo, useState} from 'react';

const MIN_LOG_RATIO = -2;
const MAX_LOG_RATIO = 2;
const RESPONSE_POINT_COUNT = 480;
const BUTTERWORTH_Q = Math.SQRT1_2;

const controlStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '0.75rem',
  alignItems: 'center',
};

const valueStyle = {
  color: 'var(--ifm-color-primary)',
  fontFamily: 'var(--ifm-font-family-monospace)',
};

const selectStyle = {
  width: '100%',
  border: '1px solid var(--hw-border)',
  borderRadius: '7px',
  padding: '0.55rem 0.7rem',
  background: 'var(--hw-surface-2)',
  color: 'var(--hw-text-primary)',
  font: 'inherit',
};

const visuallyHiddenStyle = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function trimFixed(value, digits) {
  return value
    .toFixed(digits)
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '');
}

function formatFrequency(frequencyHz) {
  if (frequencyHz >= 1000000) {
    return `${trimFixed(frequencyHz / 1000000, 2)} MHz`;
  }

  if (frequencyHz >= 1000) {
    return `${trimFixed(frequencyHz / 1000, 2)} kHz`;
  }

  if (frequencyHz >= 1) {
    return `${trimFixed(frequencyHz, 2)} Hz`;
  }

  return `${trimFixed(frequencyHz * 1000, 2)} mHz`;
}

function formatSignedDegrees(phaseDegrees) {
  if (Math.abs(phaseDegrees) < 0.005) {
    return '0.00 deg';
  }

  return `${phaseDegrees > 0 ? '+' : ''}${phaseDegrees.toFixed(2)} deg`;
}

function getCutoffToNaturalRatio(filterType, qFactor) {
  const inverseQSquared = 1 / (qFactor * qFactor);
  const linearCoefficient =
    filterType === 'low-pass'
      ? -2 + inverseQSquared
      : 2 - inverseQSquared;
  const cutoffRatioSquared =
    (-linearCoefficient +
      Math.sqrt(linearCoefficient * linearCoefficient + 4)) /
    2;

  return Math.sqrt(cutoffRatioSquared);
}

function getResponseAtRatio({
  filterType,
  order,
  frequencyRatioToCutoff,
  cutoffToNaturalRatio,
  passbandGainLinear,
  qFactor,
}) {
  if (order === 1) {
    const denominatorMagnitude = Math.sqrt(
      1 + frequencyRatioToCutoff * frequencyRatioToCutoff,
    );

    if (filterType === 'low-pass') {
      return {
        magnitudeLinear: passbandGainLinear / denominatorMagnitude,
        phaseDegrees:
          (-Math.atan(frequencyRatioToCutoff) * 180) / Math.PI,
      };
    }

    return {
      magnitudeLinear:
        (passbandGainLinear * frequencyRatioToCutoff) /
        denominatorMagnitude,
      phaseDegrees:
        90 -
        (Math.atan(frequencyRatioToCutoff) * 180) / Math.PI,
    };
  }

  const normalizedFrequency =
    frequencyRatioToCutoff * cutoffToNaturalRatio;
  const denominatorReal =
    1 - normalizedFrequency * normalizedFrequency;
  const denominatorImaginary =
    normalizedFrequency / qFactor;
  const denominatorMagnitude = Math.hypot(
    denominatorReal,
    denominatorImaginary,
  );
  const denominatorPhaseDegrees =
    (Math.atan2(denominatorImaginary, denominatorReal) * 180) /
    Math.PI;

  if (filterType === 'low-pass') {
    return {
      magnitudeLinear: passbandGainLinear / denominatorMagnitude,
      phaseDegrees: -denominatorPhaseDegrees,
    };
  }

  return {
    magnitudeLinear:
      (passbandGainLinear *
        normalizedFrequency *
        normalizedFrequency) /
      denominatorMagnitude,
    phaseDegrees: 180 - denominatorPhaseDegrees,
  };
}

function getDampingDescription(qFactor) {
  if (Math.abs(qFactor - 0.5) < 0.0005) {
    return 'Critically damped';
  }

  if (qFactor < 0.5) {
    return 'Overdamped';
  }

  if (Math.abs(qFactor - BUTTERWORTH_Q) < 0.012) {
    return 'Near the second-order Butterworth value';
  }

  if (qFactor <= BUTTERWORTH_Q) {
    return 'Underdamped, with no gain peak above the passband';
  }

  return 'Underdamped, with resonant peaking';
}

function FilterResponsePlot({
  filterType,
  order,
  cutoffHz,
  passbandGainDb,
  passbandGainLinear,
  qFactor,
  cutoffToNaturalRatio,
  naturalFrequencyHz,
  peakData,
}) {
  const width = 860;
  const height = 710;
  const plotLeft = 82;
  const plotRight = 828;
  const magnitudeTop = 55;
  const magnitudeBottom = 315;
  const phaseTop = 390;
  const phaseBottom = 630;
  const plotWidth = plotRight - plotLeft;
  const magnitudeMaximum = passbandGainDb + 15;
  const magnitudeMinimum = passbandGainDb - 105;
  const phaseMinimum =
    filterType === 'low-pass'
      ? order === 1
        ? -100
        : -190
      : -10;
  const phaseMaximum =
    filterType === 'high-pass'
      ? order === 1
        ? 100
        : 190
      : 10;

  const mapLogRatioToX = (logRatio) =>
    plotLeft +
    ((logRatio - MIN_LOG_RATIO) /
      (MAX_LOG_RATIO - MIN_LOG_RATIO)) *
      plotWidth;
  const mapMagnitudeToY = (magnitudeDb) =>
    magnitudeBottom -
    ((magnitudeDb - magnitudeMinimum) /
      (magnitudeMaximum - magnitudeMinimum)) *
      (magnitudeBottom - magnitudeTop);
  const mapPhaseToY = (phaseDegrees) =>
    phaseBottom -
    ((phaseDegrees - phaseMinimum) /
      (phaseMaximum - phaseMinimum)) *
      (phaseBottom - phaseTop);

  const responsePoints = useMemo(
    () =>
      Array.from({length: RESPONSE_POINT_COUNT + 1}, (_, index) => {
        const logRatio =
          MIN_LOG_RATIO +
          (index / RESPONSE_POINT_COUNT) *
            (MAX_LOG_RATIO - MIN_LOG_RATIO);
        const frequencyRatioToCutoff = 10 ** logRatio;
        const response = getResponseAtRatio({
          filterType,
          order,
          frequencyRatioToCutoff,
          cutoffToNaturalRatio,
          passbandGainLinear,
          qFactor,
        });

        return {
          logRatio,
          magnitudeDb:
            20 * Math.log10(Math.max(response.magnitudeLinear, 1e-12)),
          phaseDegrees: response.phaseDegrees,
        };
      }),
    [
      cutoffToNaturalRatio,
      filterType,
      order,
      passbandGainLinear,
      qFactor,
    ],
  );

  const magnitudePath = responsePoints
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${mapLogRatioToX(point.logRatio).toFixed(2)} ${mapMagnitudeToY(point.magnitudeDb).toFixed(2)}`,
    )
    .join(' ');
  const phasePath = responsePoints
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${mapLogRatioToX(point.logRatio).toFixed(2)} ${mapPhaseToY(point.phaseDegrees).toFixed(2)}`,
    )
    .join(' ');

  const frequencyTicks = [-2, -1, 0, 1, 2];
  const magnitudeTicks = [
    passbandGainDb + 10,
    passbandGainDb,
    passbandGainDb - 20,
    passbandGainDb - 40,
    passbandGainDb - 60,
    passbandGainDb - 80,
    passbandGainDb - 100,
  ];
  const phaseTicks =
    filterType === 'low-pass'
      ? order === 1
        ? [0, -45, -90]
        : [0, -45, -90, -135, -180]
      : order === 1
        ? [90, 45, 0]
        : [180, 135, 90, 45, 0];
  const cutoffResponse = getResponseAtRatio({
    filterType,
    order,
    frequencyRatioToCutoff: 1,
    cutoffToNaturalRatio,
    passbandGainLinear,
    qFactor,
  });
  const cutoffMagnitudeDb =
    20 * Math.log10(cutoffResponse.magnitudeLinear);
  const cutoffPhaseDegrees = cutoffResponse.phaseDegrees;
  const cutoffX = mapLogRatioToX(0);
  const naturalLogRatio = Math.log10(
    naturalFrequencyHz / cutoffHz,
  );
  const naturalX = mapLogRatioToX(naturalLogRatio);

  return (
    <div>
      <div className="diagram-scroll-hint">
        Scroll horizontally to inspect both Bode plots.
      </div>
      <div
        style={{
          overflowX: 'auto',
          border: '1px solid var(--hw-border)',
          borderRadius: '10px',
          background: 'var(--hw-surface-0)',
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby="active-filter-bode-title active-filter-bode-description"
          style={{
            display: 'block',
            width: '100%',
            minWidth: '700px',
            height: 'auto',
          }}
        >
          <title id="active-filter-bode-title">
            Ideal active-filter magnitude and phase response
          </title>
          <desc id="active-filter-bode-description">
            Logarithmic Bode plots show the exact magnitude and phase response
            from one hundredth of the selected cutoff frequency to one hundred
            times that frequency.{' '}
            {order === 2
              ? 'The cutoff and natural frequencies are marked.'
              : 'The cutoff frequency is marked.'}
          </desc>

          <rect
            x={plotLeft}
            y={magnitudeTop}
            width={plotWidth}
            height={magnitudeBottom - magnitudeTop}
            fill="var(--hw-surface-1)"
            opacity="0.4"
          />
          <rect
            x={plotLeft}
            y={phaseTop}
            width={plotWidth}
            height={phaseBottom - phaseTop}
            fill="var(--hw-surface-1)"
            opacity="0.4"
          />

          {frequencyTicks.map((logRatio) => {
            const x = mapLogRatioToX(logRatio);
            const ratio = 10 ** logRatio;
            const ratioLabel =
              logRatio === 0
                ? 'fc'
                : `${trimFixed(ratio, 2)} fc`;

            return (
              <g key={logRatio}>
                <line
                  x1={x}
                  y1={magnitudeTop}
                  x2={x}
                  y2={magnitudeBottom}
                  stroke="var(--hw-border-subtle)"
                  strokeDasharray="3 6"
                />
                <line
                  x1={x}
                  y1={phaseTop}
                  x2={x}
                  y2={phaseBottom}
                  stroke="var(--hw-border-subtle)"
                  strokeDasharray="3 6"
                />
                <text
                  x={x}
                  y={phaseBottom + 25}
                  textAnchor="middle"
                  fill={
                    logRatio === 0
                      ? 'var(--ifm-color-primary)'
                      : 'var(--hw-text-secondary)'
                  }
                  fontSize="11"
                  fontWeight={logRatio === 0 ? '750' : '500'}
                >
                  {ratioLabel}
                </text>
                <text
                  x={x}
                  y={phaseBottom + 42}
                  textAnchor="middle"
                  fill="var(--hw-text-secondary)"
                  fontSize="10"
                >
                  {formatFrequency(cutoffHz * ratio)}
                </text>
              </g>
            );
          })}

          {magnitudeTicks.map((magnitudeDb) => (
            <g key={magnitudeDb}>
              <line
                x1={plotLeft}
                y1={mapMagnitudeToY(magnitudeDb)}
                x2={plotRight}
                y2={mapMagnitudeToY(magnitudeDb)}
                stroke="var(--hw-border-subtle)"
                strokeDasharray="3 6"
              />
              <text
                x={plotLeft - 12}
                y={mapMagnitudeToY(magnitudeDb) + 4}
                textAnchor="end"
                fill="var(--hw-text-secondary)"
                fontSize="11"
              >
                {trimFixed(magnitudeDb, 1)}
              </text>
            </g>
          ))}

          {phaseTicks.map((phaseDegrees) => (
            <g key={phaseDegrees}>
              <line
                x1={plotLeft}
                y1={mapPhaseToY(phaseDegrees)}
                x2={plotRight}
                y2={mapPhaseToY(phaseDegrees)}
                stroke="var(--hw-border-subtle)"
                strokeDasharray="3 6"
              />
              <text
                x={plotLeft - 12}
                y={mapPhaseToY(phaseDegrees) + 4}
                textAnchor="end"
                fill="var(--hw-text-secondary)"
                fontSize="11"
              >
                {phaseDegrees}
              </text>
            </g>
          ))}

          <line
            x1={plotLeft}
            y1={mapMagnitudeToY(passbandGainDb)}
            x2={plotRight}
            y2={mapMagnitudeToY(passbandGainDb)}
            stroke="var(--hw-accent-teal)"
            strokeWidth="1.5"
            strokeDasharray="7 6"
            opacity="0.65"
          />

          <line
            x1={cutoffX}
            y1={magnitudeTop}
            x2={cutoffX}
            y2={magnitudeBottom}
            stroke="var(--ifm-color-primary)"
            strokeWidth="2"
          />
          <line
            x1={cutoffX}
            y1={phaseTop}
            x2={cutoffX}
            y2={phaseBottom}
            stroke="var(--ifm-color-primary)"
            strokeWidth="2"
          />

          {order === 2 && Math.abs(naturalLogRatio) > 0.015 && (
            <>
              <line
                x1={naturalX}
                y1={magnitudeTop}
                x2={naturalX}
                y2={magnitudeBottom}
                stroke="var(--hw-accent-purple)"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />
              <line
                x1={naturalX}
                y1={phaseTop}
                x2={naturalX}
                y2={phaseBottom}
                stroke="var(--hw-accent-purple)"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />
              <text
                x={naturalX}
                y={magnitudeTop - 11}
                textAnchor="middle"
                fill="var(--hw-accent-purple)"
                fontSize="10"
                fontWeight="700"
              >
                f0
              </text>
            </>
          )}

          <path
            d={magnitudePath}
            fill="none"
            stroke="var(--hw-accent-blue)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={phasePath}
            fill="none"
            stroke="var(--hw-accent-purple)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx={cutoffX}
            cy={mapMagnitudeToY(cutoffMagnitudeDb)}
            r="6"
            fill="var(--ifm-color-primary)"
            stroke="var(--hw-text-primary)"
            strokeWidth="2"
          />
          <circle
            cx={cutoffX}
            cy={mapPhaseToY(cutoffPhaseDegrees)}
            r="6"
            fill="var(--ifm-color-primary)"
            stroke="var(--hw-text-primary)"
            strokeWidth="2"
          />

          {peakData && (
            <circle
              cx={mapLogRatioToX(
                Math.log10(peakData.frequencyHz / cutoffHz),
              )}
              cy={mapMagnitudeToY(
                passbandGainDb + peakData.peakingDb,
              )}
              r="5"
              fill="var(--hw-accent-teal)"
              stroke="var(--hw-text-primary)"
              strokeWidth="1.5"
            />
          )}

          <text
            x={plotLeft}
            y={29}
            fill="var(--hw-accent-blue)"
            fontSize="13"
            fontWeight="750"
          >
            MAGNITUDE
          </text>
          <text
            x={plotRight}
            y={29}
            textAnchor="end"
            fill="var(--hw-text-secondary)"
            fontSize="11"
          >
            GAIN IN dB
          </text>
          <text
            x={plotLeft}
            y={367}
            fill="var(--hw-accent-purple)"
            fontSize="13"
            fontWeight="750"
          >
            PHASE
          </text>
          <text
            x={plotRight}
            y={367}
            textAnchor="end"
            fill="var(--hw-text-secondary)"
            fontSize="11"
          >
            PHASE IN DEGREES
          </text>
          <text
            x={(plotLeft + plotRight) / 2}
            y={height - 17}
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            LOGARITHMIC FREQUENCY AXIS
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function ActiveFilterResponseExplorer() {
  const [filterType, setFilterType] = useState('low-pass');
  const [order, setOrder] = useState(2);
  const [cutoffLogHz, setCutoffLogHz] = useState(3);
  const [passbandGainDb, setPassbandGainDb] = useState(0);
  const [qFactor, setQFactor] = useState(0.707);

  const cutoffHz = 10 ** cutoffLogHz;
  const passbandGainLinear = 10 ** (passbandGainDb / 20);
  const cutoffToNaturalRatio =
    order === 2
      ? getCutoffToNaturalRatio(filterType, qFactor)
      : 1;
  const naturalFrequencyHz = cutoffHz / cutoffToNaturalRatio;
  const cutoffResponse = getResponseAtRatio({
    filterType,
    order,
    frequencyRatioToCutoff: 1,
    cutoffToNaturalRatio,
    passbandGainLinear,
    qFactor,
  });
  const cutoffMagnitudeDb =
    20 * Math.log10(cutoffResponse.magnitudeLinear);
  const cutoffRelativeMagnitudeDb =
    cutoffMagnitudeDb - passbandGainDb;
  const cutoffPhaseDegrees = cutoffResponse.phaseDegrees;
  const dampingRatio = 1 / (2 * qFactor);
  const hasResonantPeak = order === 2 && qFactor > BUTTERWORTH_Q;
  let peakData = null;

  if (hasResonantPeak) {
    const peakRatioToNatural =
      filterType === 'low-pass'
        ? Math.sqrt(1 - 1 / (2 * qFactor * qFactor))
        : 1 / Math.sqrt(1 - 1 / (2 * qFactor * qFactor));
    const peakMagnitudeRatio =
      qFactor / Math.sqrt(1 - 1 / (4 * qFactor * qFactor));

    peakData = {
      frequencyHz: naturalFrequencyHz * peakRatioToNatural,
      peakingDb: 20 * Math.log10(peakMagnitudeRatio),
    };
  }

  const rolloffText =
    filterType === 'low-pass'
      ? `-${20 * order} dB/decade above the transition`
      : `+${20 * order} dB/decade below the transition as frequency increases`;
  const transferFunctionText =
    order === 1
      ? filterType === 'low-pass'
        ? 'H(s) = K / (1 + s/wc)'
        : 'H(s) = K(s/wc) / (1 + s/wc)'
      : filterType === 'low-pass'
        ? 'H(s) = K w0^2 / (s^2 + (w0/Q)s + w0^2)'
        : 'H(s) = K s^2 / (s^2 + (w0/Q)s + w0^2)';

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">
        Ideal active-filter response explorer
      </div>
      <div className="interactive-block__body">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '0.85rem',
          }}
        >
          <div>
            <label htmlFor="active-filter-type">
              Filter type
            </label>
            <select
              id="active-filter-type"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value)}
              style={{...selectStyle, marginTop: '0.35rem'}}
            >
              <option value="low-pass">Low-pass</option>
              <option value="high-pass">High-pass</option>
            </select>
          </div>

          <div>
            <label htmlFor="active-filter-order">
              Filter order
            </label>
            <select
              id="active-filter-order"
              value={order}
              onChange={(event) => setOrder(Number(event.target.value))}
              style={{...selectStyle, marginTop: '0.35rem'}}
            >
              <option value={1}>First order</option>
              <option value={2}>Second order</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gap: '1rem',
            marginTop: '1.15rem',
            paddingTop: '1.15rem',
            borderTop: '1px solid var(--hw-border-subtle)',
          }}
        >
          <div style={controlStyle}>
            <label htmlFor="active-filter-cutoff">
              -3 dB cutoff frequency, fc:{' '}
              <strong style={valueStyle}>{formatFrequency(cutoffHz)}</strong>
            </label>
            <input
              id="active-filter-cutoff"
              type="range"
              min="1"
              max="5"
              step="0.05"
              value={cutoffLogHz}
              aria-valuetext={formatFrequency(cutoffHz)}
              onChange={(event) =>
                setCutoffLogHz(Number(event.target.value))
              }
            />
          </div>

          <div style={controlStyle}>
            <label htmlFor="active-filter-passband-gain">
              Passband gain:{' '}
              <strong style={valueStyle}>
                {trimFixed(passbandGainDb, 1)} dB
              </strong>
            </label>
            <input
              id="active-filter-passband-gain"
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={passbandGainDb}
              aria-valuetext={`${trimFixed(passbandGainDb, 1)} dB`}
              onChange={(event) =>
                setPassbandGainDb(Number(event.target.value))
              }
            />
          </div>

          {order === 2 && (
            <div style={controlStyle}>
              <label htmlFor="active-filter-q">
                Quality factor, Q:{' '}
                <strong style={valueStyle}>{qFactor.toFixed(3)}</strong>
              </label>
              <input
                id="active-filter-q"
                type="range"
                min="0.35"
                max="3"
                step="0.001"
                value={qFactor}
                aria-valuetext={qFactor.toFixed(3)}
                onChange={(event) =>
                  setQFactor(Number(event.target.value))
                }
              />
            </div>
          )}
        </div>

        <p
          aria-live="polite"
          aria-atomic="true"
          style={visuallyHiddenStyle}
        >
          Filter response updated. {filterType},{' '}
          {order === 1 ? 'first order' : 'second order'}, cutoff{' '}
          {formatFrequency(cutoffHz)}, passband gain{' '}
          {trimFixed(passbandGainDb, 1)} dB
          {order === 2 ? `, Q ${qFactor.toFixed(3)}` : ''}.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '0.75rem',
            margin: '1.5rem 0',
          }}
        >
          <div className="tech-panel">
            <span className="panel-header">At the selected cutoff</span>
            <p>
              <strong>Magnitude:</strong>
              <br />
              <span style={valueStyle}>
                {cutoffMagnitudeDb.toFixed(2)} dB
              </span>
              <br />
              <span
                style={{
                  color: 'var(--hw-text-secondary)',
                  fontSize: '0.82rem',
                }}
              >
                {cutoffRelativeMagnitudeDb.toFixed(2)} dB from passband
              </span>
            </p>
            <p style={{marginBottom: 0}}>
              <strong>Phase:</strong>
              <br />
              <span style={valueStyle}>
                {formatSignedDegrees(cutoffPhaseDegrees)}
              </span>
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Exact ideal model</span>
            <p
              style={{
                margin: '0 0 0.6rem',
                overflowWrap: 'anywhere',
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: '0.8rem',
              }}
            >
              {transferFunctionText}
            </p>
            <p style={{marginBottom: 0}}>
              <strong>Passband K:</strong>
              <br />
              {trimFixed(passbandGainLinear, 4)} V/V
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Asymptotic slope</span>
            <p style={{marginBottom: 0}}>
              <strong>{rolloffText}</strong>
              <br />
              <span
                style={{
                  color: 'var(--hw-text-secondary)',
                  fontSize: '0.82rem',
                }}
              >
                {filterType === 'low-pass'
                  ? 'Each pole adds -20 dB/decade above the transition.'
                  : 'Each zero at the origin adds +20 dB/decade below the transition.'}
              </span>
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">
              {order === 2 ? 'Damping and peaking' : 'One-pole response'}
            </span>
            {order === 2 ? (
              <>
                <p>
                  <strong>Damping ratio:</strong>
                  <br />
                  <span style={valueStyle}>
                    {dampingRatio.toFixed(3)}
                  </span>
                  <br />
                  <span
                    style={{
                      color: 'var(--hw-text-secondary)',
                      fontSize: '0.82rem',
                    }}
                  >
                    {getDampingDescription(qFactor)}
                  </span>
                </p>
                <p>
                  <strong>Natural frequency, f0:</strong>
                  <br />
                  <span style={valueStyle}>
                    {formatFrequency(naturalFrequencyHz)}
                  </span>
                </p>
                <p style={{marginBottom: 0}}>
                  <strong>Response peak:</strong>
                  <br />
                  {peakData ? (
                    <>
                      <span style={valueStyle}>
                        +{peakData.peakingDb.toFixed(2)} dB
                      </span>
                      <br />
                      <span
                        style={{
                          color: 'var(--hw-text-secondary)',
                          fontSize: '0.82rem',
                        }}
                      >
                        at {formatFrequency(peakData.frequencyHz)}
                      </span>
                    </>
                  ) : (
                    'No peak above the passband gain'
                  )}
                </p>
              </>
            ) : (
              <p style={{marginBottom: 0}}>
                The first-order response has one pole. Its magnitude is 3.01
                dB below the passband at fc. Its phase is{' '}
                {filterType === 'low-pass' ? '-45 deg' : '+45 deg'} at fc.
              </p>
            )}
          </div>
        </div>

        <FilterResponsePlot
          filterType={filterType}
          order={order}
          cutoffHz={cutoffHz}
          passbandGainDb={passbandGainDb}
          passbandGainLinear={passbandGainLinear}
          qFactor={qFactor}
          cutoffToNaturalRatio={cutoffToNaturalRatio}
          naturalFrequencyHz={naturalFrequencyHz}
          peakData={peakData}
        />

        <p
          style={{
            margin: '1rem 0 0',
            color: 'var(--hw-text-secondary)',
            fontSize: '0.84rem',
          }}
        >
          These normalized transfer functions use ideal components and an
          ideal amplifier. The selected fc is the -3 dB frequency relative to
          the passband gain. For a second-order response, the model calculates
          f0 from fc and Q. It does not include op-amp bandwidth, slew rate,
          noise, loading, or component tolerances. This explorer is not a
          component-value model of the pictured unity-gain Sallen-Key circuit.
          Its independent K and Q settings are not all possible with that
          circuit.
        </p>
      </div>
    </div>
  );
}
