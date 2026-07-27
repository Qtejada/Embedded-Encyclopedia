import React, {useMemo, useState} from 'react';

const INPUT_CENTER_V = 2.5;
const INPUT_AMPLITUDE_V = 1.8;
const SAMPLE_RATE_HZ = 400;
const SAMPLE_PERIOD_SECONDS = 1 / SAMPLE_RATE_HZ;
const HOLD_COMMAND_FRACTION = 0.45;
const PLOT_POINT_COUNT = 800;

const phaseColors = {
  acquire: 'var(--hw-accent-blue)',
  track: 'var(--hw-accent-teal)',
  transition: 'var(--ifm-color-primary)',
  hold: 'var(--hw-accent-purple)',
};

const controlRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '0.75rem',
  alignItems: 'center',
};

const valueStyle = {
  color: 'var(--ifm-color-primary)',
  fontFamily: 'var(--ifm-font-family-monospace)',
};

function trimFixed(value, digits) {
  return value
    .toFixed(digits)
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '');
}

function formatVoltage(value) {
  const magnitude = Math.abs(value);

  if (magnitude === 0) {
    return '0 V';
  }

  if (magnitude < 0.001) {
    return `${trimFixed(value * 1000000, 2)} uV`;
  }

  if (magnitude < 1) {
    return `${trimFixed(value * 1000, 3)} mV`;
  }

  return `${trimFixed(value, 5)} V`;
}

function formatSignedVoltage(value) {
  if (Math.abs(value) < Number.EPSILON) {
    return '0 V';
  }

  return `${value > 0 ? '+' : '-'}${formatVoltage(Math.abs(value))}`;
}

function formatTime(seconds) {
  if (seconds >= 0.001) {
    return `${trimFixed(seconds * 1000, 3)} ms`;
  }

  return `${trimFixed(seconds * 1000000, 2)} us`;
}

function inputVoltageAtTime(timeSeconds, inputFrequencyHz) {
  return (
    INPUT_CENTER_V +
    INPUT_AMPLITUDE_V *
      Math.sin(2 * Math.PI * inputFrequencyHz * timeSeconds)
  );
}

function trackedOutputAtTime(
  timeSeconds,
  inputFrequencyHz,
  timeConstantSeconds,
  initialOutputVoltage,
) {
  const angularFrequency = 2 * Math.PI * inputFrequencyHz;
  const omegaTau = angularFrequency * timeConstantSeconds;
  const denominator = 1 + omegaTau ** 2;
  const particular =
    (INPUT_AMPLITUDE_V / denominator) *
    (Math.sin(angularFrequency * timeSeconds) -
      omegaTau * Math.cos(angularFrequency * timeSeconds));
  const initialCorrection =
    initialOutputVoltage -
    INPUT_CENTER_V +
    (INPUT_AMPLITUDE_V * omegaTau) / denominator;

  return (
    INPUT_CENTER_V +
    particular +
    initialCorrection * Math.exp(-timeSeconds / timeConstantSeconds)
  );
}

function SignalPathDiagram() {
  return (
    <div>
      <div className="diagram-scroll-hint">
        Scroll horizontally to inspect the signal path.
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
          viewBox="0 0 800 250"
          role="img"
          aria-labelledby="sample-hold-path-title sample-hold-path-description"
          style={{
            display: 'block',
            width: '100%',
            minWidth: '700px',
            height: 'auto',
          }}
        >
          <title id="sample-hold-path-title">
            Basic sample-and-hold signal path
          </title>
          <desc id="sample-hold-path-description">
            The analog input passes through a controlled analog switch to a
            hold capacitor. A high-input-impedance buffer isolates the
            capacitor from the output load.
          </desc>

          <defs>
            <marker
              id="sample-hold-path-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path
                d="M 0 0 L 10 5 L 0 10 z"
                fill="var(--hw-text-secondary)"
              />
            </marker>
          </defs>

          <rect
            x="25"
            y="74"
            width="145"
            height="88"
            rx="10"
            fill="var(--hw-surface-1)"
            stroke="var(--hw-accent-blue)"
            strokeWidth="2"
          />
          <text
            x="97.5"
            y="105"
            textAnchor="middle"
            fill="var(--hw-accent-blue)"
            fontSize="13"
            fontWeight="750"
          >
            ANALOG INPUT
          </text>
          <path
            d="M 47 135 C 58 113, 69 113, 80 135 S 102 157, 113 135 S 135 113, 146 135"
            fill="none"
            stroke="var(--hw-text-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <line
            x1="170"
            y1="118"
            x2="221"
            y2="118"
            stroke="var(--hw-text-secondary)"
            strokeWidth="2"
            markerEnd="url(#sample-hold-path-arrow)"
          />

          <rect
            x="232"
            y="60"
            width="150"
            height="116"
            rx="10"
            fill="var(--hw-surface-1)"
            stroke="var(--ifm-color-primary)"
            strokeWidth="2"
          />
          <text
            x="307"
            y="86"
            textAnchor="middle"
            fill="var(--ifm-color-primary)"
            fontSize="13"
            fontWeight="750"
          >
            ANALOG SWITCH
          </text>
          <line
            x1="258"
            y1="124"
            x2="276"
            y2="124"
            stroke="var(--hw-text-primary)"
            strokeWidth="3"
          />
          <circle cx="280" cy="124" r="4" fill="var(--hw-text-primary)" />
          <line
            x1="283"
            y1="121"
            x2="327"
            y2="101"
            stroke="var(--hw-text-primary)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="334" cy="124" r="4" fill="var(--hw-text-primary)" />
          <line
            x1="338"
            y1="124"
            x2="356"
            y2="124"
            stroke="var(--hw-text-primary)"
            strokeWidth="3"
          />
          <text
            x="307"
            y="155"
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="11"
          >
            SHOWN OPEN: HOLD
          </text>

          <line
            x1="382"
            y1="118"
            x2="426"
            y2="118"
            stroke="var(--hw-text-secondary)"
            strokeWidth="2"
            markerEnd="url(#sample-hold-path-arrow)"
          />

          <circle
            cx="448"
            cy="118"
            r="5"
            fill="var(--hw-accent-teal)"
          />
          <line
            x1="448"
            y1="118"
            x2="448"
            y2="155"
            stroke="var(--hw-accent-teal)"
            strokeWidth="2.5"
          />
          <line
            x1="429"
            y1="157"
            x2="467"
            y2="157"
            stroke="var(--hw-text-primary)"
            strokeWidth="3"
          />
          <line
            x1="429"
            y1="166"
            x2="467"
            y2="166"
            stroke="var(--hw-text-primary)"
            strokeWidth="3"
          />
          <line
            x1="448"
            y1="168"
            x2="448"
            y2="194"
            stroke="var(--hw-text-secondary)"
            strokeWidth="2"
          />
          <line
            x1="431"
            y1="194"
            x2="465"
            y2="194"
            stroke="var(--hw-text-secondary)"
            strokeWidth="2"
          />
          <line
            x1="437"
            y1="201"
            x2="459"
            y2="201"
            stroke="var(--hw-text-secondary)"
            strokeWidth="2"
          />
          <line
            x1="443"
            y1="208"
            x2="453"
            y2="208"
            stroke="var(--hw-text-secondary)"
            strokeWidth="2"
          />
          <text
            x="448"
            y="53"
            textAnchor="middle"
            fill="var(--hw-accent-teal)"
            fontSize="13"
            fontWeight="750"
          >
            HOLD NODE
          </text>
          <text
            x="448"
            y="226"
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="11"
          >
            CHOLD STORES CHARGE
          </text>

          <line
            x1="453"
            y1="118"
            x2="515"
            y2="118"
            stroke="var(--hw-text-secondary)"
            strokeWidth="2"
            markerEnd="url(#sample-hold-path-arrow)"
          />

          <path
            d="M 530 72 L 530 164 L 628 118 Z"
            fill="var(--hw-surface-1)"
            stroke="var(--hw-accent-purple)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text
            x="566"
            y="112"
            textAnchor="middle"
            fill="var(--hw-accent-purple)"
            fontSize="13"
            fontWeight="750"
          >
            BUFFER
          </text>
          <text
            x="566"
            y="132"
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="10"
          >
            HIGH INPUT Z
          </text>

          <line
            x1="628"
            y1="118"
            x2="703"
            y2="118"
            stroke="var(--hw-text-secondary)"
            strokeWidth="2"
            markerEnd="url(#sample-hold-path-arrow)"
          />
          <rect
            x="714"
            y="85"
            width="62"
            height="66"
            rx="9"
            fill="var(--hw-surface-1)"
            stroke="var(--hw-accent-purple)"
            strokeWidth="2"
          />
          <text
            x="745"
            y="112"
            textAnchor="middle"
            fill="var(--hw-accent-purple)"
            fontSize="11"
            fontWeight="750"
          >
            HELD
          </text>
          <text
            x="745"
            y="130"
            textAnchor="middle"
            fill="var(--hw-text-primary)"
            fontSize="11"
          >
            OUTPUT
          </text>

          <text
            x="400"
            y="23"
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            SWITCH CLOSED: ACQUIRE AND TRACK - SWITCH OPEN: HOLD
          </text>
        </svg>
      </div>
    </div>
  );
}

function PhaseKey() {
  const phases = [
    {
      name: 'ACQUIRE',
      color: phaseColors.acquire,
      text: 'The switch closes. The model shows an illustrative five time constants of settling.',
    },
    {
      name: 'TRACK',
      color: phaseColors.track,
      text: 'The same one-pole model continues to follow the changing input.',
    },
    {
      name: 'COMMAND DELAY',
      color: phaseColors.transition,
      text: 'The hold command precedes the effective sample instant. Aperture time is not modeled.',
    },
    {
      name: 'HOLD',
      color: phaseColors.hold,
      text: 'The open switch isolates the stored capacitor voltage.',
    },
  ];

  return (
    <div
      aria-label="Sample-and-hold phase definitions"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: '0.6rem',
        margin: '1rem 0',
      }}
    >
      {phases.map((phase) => (
        <div
          key={phase.name}
          style={{
            border: '1px solid var(--hw-border)',
            borderTop: `3px solid ${phase.color}`,
            borderRadius: '8px',
            padding: '0.7rem',
            background: 'var(--hw-surface-1)',
          }}
        >
          <strong
            style={{
              display: 'block',
              marginBottom: '0.25rem',
              color: phase.color,
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
            }}
          >
            {phase.name}
          </strong>
          <span
            style={{
              color: 'var(--hw-text-secondary)',
              fontSize: '0.78rem',
              lineHeight: 1.4,
            }}
          >
            {phase.text}
          </span>
        </div>
      ))}
    </div>
  );
}

function SampleHoldTimePlot({
  inputFrequencyHz,
  acquisitionTimeSeconds,
  apertureJitterSeconds,
  droopRateVPerSecond,
  samplePeriodSeconds,
  holdCommandTime,
  nominalSampleTime,
  acquisitionTau,
  previousHeldVoltage,
  heldVoltage,
  endOfHoldVoltage,
}) {
  const width = 820;
  const height = 465;
  const plotLeft = 76;
  const plotRight = 790;
  const phaseTop = 20;
  const phaseBottom = 58;
  const plotTop = 92;
  const plotBottom = 374;
  const yMinimum = 0;
  const yMaximum = 5;
  const acquisitionEnd = acquisitionTimeSeconds;

  const mapTimeToX = (timeSeconds) =>
    plotLeft +
    (timeSeconds / samplePeriodSeconds) * (plotRight - plotLeft);
  const mapVoltageToY = (voltage) =>
    plotBottom -
    ((voltage - yMinimum) / (yMaximum - yMinimum)) *
      (plotBottom - plotTop);

  const traceData = useMemo(() => {
    const keyTimes = [
      0,
      acquisitionEnd,
      holdCommandTime,
      Math.max(0, nominalSampleTime - apertureJitterSeconds),
      nominalSampleTime,
      Math.min(
        samplePeriodSeconds,
        nominalSampleTime + apertureJitterSeconds,
      ),
      samplePeriodSeconds,
    ];
    const times = Array.from(
      {length: PLOT_POINT_COUNT + 1},
      (_, index) => (index / PLOT_POINT_COUNT) * samplePeriodSeconds,
    );

    keyTimes.forEach((time) => times.push(time));
    times.sort((first, second) => first - second);

    const uniqueTimes = times.filter(
      (time, index) =>
        index === 0 || Math.abs(time - times[index - 1]) > 1e-12,
    );

    return uniqueTimes.map((time) => {
      const input = inputVoltageAtTime(time, inputFrequencyHz);
      const heldOutput =
        time <= nominalSampleTime
          ? trackedOutputAtTime(
              time,
              inputFrequencyHz,
              acquisitionTau,
              previousHeldVoltage,
            )
          : heldVoltage -
            droopRateVPerSecond * (time - nominalSampleTime);

      return {
        time,
        input,
        output: heldOutput,
      };
    });
  }, [
    acquisitionEnd,
    acquisitionTau,
    apertureJitterSeconds,
    droopRateVPerSecond,
    heldVoltage,
    holdCommandTime,
    inputFrequencyHz,
    nominalSampleTime,
    previousHeldVoltage,
    samplePeriodSeconds,
  ]);

  const inputPath = traceData
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${mapTimeToX(point.time).toFixed(2)} ${mapVoltageToY(point.input).toFixed(2)}`,
    )
    .join(' ');
  const outputPath = traceData
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${mapTimeToX(point.time).toFixed(2)} ${mapVoltageToY(point.output).toFixed(2)}`,
    )
    .join(' ');

  const phaseRanges = [
    {
      name: 'ACQUIRE',
      start: 0,
      end: acquisitionEnd,
      color: phaseColors.acquire,
    },
    {
      name: 'TRACK',
      start: acquisitionEnd,
      end: holdCommandTime,
      color: phaseColors.track,
    },
    {
      name: 'COMMAND DELAY',
      start: holdCommandTime,
      end: nominalSampleTime,
      color: phaseColors.transition,
    },
    {
      name: 'HOLD',
      start: nominalSampleTime,
      end: samplePeriodSeconds,
      color: phaseColors.hold,
    },
  ];
  const jitterStart = Math.max(
    0,
    nominalSampleTime - apertureJitterSeconds,
  );
  const jitterEnd = Math.min(
    samplePeriodSeconds,
    nominalSampleTime + apertureJitterSeconds,
  );
  const timeTicks = [0, 0.25, 0.5, 0.75, 1];
  const voltageTicks = [0, 1, 2, 3, 4, 5];

  return (
    <div>
      <div className="diagram-scroll-hint">
        Scroll horizontally to inspect the timing plot.
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
          aria-labelledby="sample-hold-plot-title sample-hold-plot-description"
          style={{
            display: 'block',
            width: '100%',
            minWidth: '720px',
            height: 'auto',
          }}
        >
          <title id="sample-hold-plot-title">
            Sample-and-hold input and output timing
          </title>
          <desc id="sample-hold-plot-description">
            The input is a sine wave. The held output settles during
            acquisition, continues through one-pole tracking, and decreases
            at the selected droop rate after the sample instant. The shaded
            aperture-jitter interval shows plus or minus one RMS standard
            deviation around the nominal sample time. Aperture time is not
            modeled.
          </desc>

          {phaseRanges.map((phase) => {
            const startX = mapTimeToX(phase.start);
            const endX = mapTimeToX(phase.end);
            const phaseWidth = Math.max(0, endX - startX);

            return (
              <g key={phase.name}>
                <rect
                  x={startX}
                  y={phaseTop}
                  width={phaseWidth}
                  height={phaseBottom - phaseTop}
                  fill={phase.color}
                  opacity="0.18"
                  stroke={phase.color}
                  strokeWidth="1"
                />
                {phaseWidth >= 68 && (
                  <text
                    x={(startX + endX) / 2}
                    y={44}
                    textAnchor="middle"
                    fill={phase.color}
                    fontSize="11"
                    fontWeight="750"
                  >
                    {phase.name}
                  </text>
                )}
              </g>
            );
          })}

          <rect
            x={plotLeft}
            y={plotTop}
            width={plotRight - plotLeft}
            height={plotBottom - plotTop}
            fill="var(--hw-surface-1)"
            opacity="0.35"
          />

          {phaseRanges.map((phase) => (
            <rect
              key={`plot-${phase.name}`}
              x={mapTimeToX(phase.start)}
              y={plotTop}
              width={Math.max(
                0,
                mapTimeToX(phase.end) - mapTimeToX(phase.start),
              )}
              height={plotBottom - plotTop}
              fill={phase.color}
              opacity="0.035"
            />
          ))}

          {voltageTicks.map((voltage) => (
            <g key={voltage}>
              <line
                x1={plotLeft}
                y1={mapVoltageToY(voltage)}
                x2={plotRight}
                y2={mapVoltageToY(voltage)}
                stroke="var(--hw-border-subtle)"
                strokeDasharray="3 6"
              />
              <text
                x={plotLeft - 12}
                y={mapVoltageToY(voltage) + 4}
                textAnchor="end"
                fill="var(--hw-text-secondary)"
                fontSize="11"
              >
                {voltage} V
              </text>
            </g>
          ))}

          {timeTicks.map((fraction) => {
            const time = fraction * samplePeriodSeconds;
            const x = mapTimeToX(time);

            return (
              <g key={fraction}>
                <line
                  x1={x}
                  y1={plotTop}
                  x2={x}
                  y2={plotBottom}
                  stroke="var(--hw-border-subtle)"
                  strokeDasharray="3 6"
                />
                <text
                  x={x}
                  y={plotBottom + 24}
                  textAnchor="middle"
                  fill="var(--hw-text-secondary)"
                  fontSize="11"
                >
                  {trimFixed(time * 1000, 3)} ms
                </text>
              </g>
            );
          })}

          <line
            x1={plotLeft}
            y1={plotTop}
            x2={plotLeft}
            y2={plotBottom}
            stroke="var(--hw-text-secondary)"
            strokeWidth="1.5"
          />
          <line
            x1={plotLeft}
            y1={plotBottom}
            x2={plotRight}
            y2={plotBottom}
            stroke="var(--hw-text-secondary)"
            strokeWidth="1.5"
          />

          <rect
            x={mapTimeToX(jitterStart)}
            y={plotTop}
            width={Math.max(
              1,
              mapTimeToX(jitterEnd) - mapTimeToX(jitterStart),
            )}
            height={plotBottom - plotTop}
            fill="var(--ifm-color-primary)"
            opacity="0.12"
          />

          <line
            x1={mapTimeToX(holdCommandTime)}
            y1={phaseTop}
            x2={mapTimeToX(holdCommandTime)}
            y2={plotBottom}
            stroke={phaseColors.transition}
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <line
            x1={mapTimeToX(nominalSampleTime)}
            y1={phaseTop}
            x2={mapTimeToX(nominalSampleTime)}
            y2={plotBottom}
            stroke={phaseColors.hold}
            strokeWidth="2"
          />

          <path
            d={inputPath}
            fill="none"
            stroke="var(--hw-accent-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={outputPath}
            fill="none"
            stroke="var(--hw-accent-teal)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <circle
            cx={mapTimeToX(nominalSampleTime)}
            cy={mapVoltageToY(heldVoltage)}
            r="6"
            fill="var(--ifm-color-primary)"
            stroke="var(--hw-text-primary)"
            strokeWidth="2"
          />
          <circle
            cx={mapTimeToX(samplePeriodSeconds)}
            cy={mapVoltageToY(endOfHoldVoltage)}
            r="5"
            fill="var(--hw-accent-purple)"
            stroke="var(--hw-text-primary)"
            strokeWidth="1.5"
          />

          <text
            x={mapTimeToX(holdCommandTime) - 6}
            y={76}
            textAnchor="end"
            fill={phaseColors.transition}
            fontSize="10"
            fontWeight="700"
          >
            HOLD COMMAND
          </text>
          <text
            x={mapTimeToX(nominalSampleTime) + 6}
            y={76}
            textAnchor="start"
            fill={phaseColors.hold}
            fontSize="10"
            fontWeight="700"
          >
            SAMPLE
          </text>

          <g transform={`translate(${plotLeft + 13} ${plotTop + 19})`}>
            <line
              x1="0"
              y1="0"
              x2="28"
              y2="0"
              stroke="var(--hw-accent-blue)"
              strokeWidth="2.5"
            />
            <text
              x="36"
              y="4"
              fill="var(--hw-text-secondary)"
              fontSize="11"
            >
              INPUT
            </text>
            <line
              x1="95"
              y1="0"
              x2="123"
              y2="0"
              stroke="var(--hw-accent-teal)"
              strokeWidth="3.5"
            />
            <text
              x="131"
              y="4"
              fill="var(--hw-text-secondary)"
              fontSize="11"
            >
              HELD OUTPUT
            </text>
          </g>

          <text
            x={(plotLeft + plotRight) / 2}
            y={height - 24}
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            TIME THROUGH ONE SAMPLE PERIOD
          </text>
          <text
            x="22"
            y={(plotTop + plotBottom) / 2}
            transform={`rotate(-90 22 ${(plotTop + plotBottom) / 2})`}
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            VOLTAGE
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function SampleHoldCycleExplorer() {
  const [inputFrequencyHz, setInputFrequencyHz] = useState(100);
  const [acquisitionTimeUs, setAcquisitionTimeUs] = useState(120);
  const [apertureDelayUs, setApertureDelayUs] = useState(20);
  const [apertureJitterNs, setApertureJitterNs] = useState(500);
  const [droopRateMvPerMs, setDroopRateMvPerMs] = useState(8);

  const samplePeriodSeconds = SAMPLE_PERIOD_SECONDS;
  const acquisitionTimeSeconds = acquisitionTimeUs / 1000000;
  const apertureDelaySeconds = apertureDelayUs / 1000000;
  const apertureJitterSeconds = apertureJitterNs / 1000000000;
  const droopRateVPerSecond = droopRateMvPerMs;
  const holdCommandTime = samplePeriodSeconds * HOLD_COMMAND_FRACTION;
  const nominalSampleTime = Math.min(
    samplePeriodSeconds,
    holdCommandTime + apertureDelaySeconds,
  );
  const holdDuration = samplePeriodSeconds - nominalSampleTime;
  const previousSampledVoltage = inputVoltageAtTime(
    nominalSampleTime - samplePeriodSeconds,
    inputFrequencyHz,
  );
  const previousHeldVoltage =
    previousSampledVoltage - droopRateVPerSecond * holdDuration;
  const acquisitionTau = Math.max(acquisitionTimeSeconds / 5, 1e-9);
  const heldVoltage = trackedOutputAtTime(
    nominalSampleTime,
    inputFrequencyHz,
    acquisitionTau,
    previousHeldVoltage,
  );
  const droopDuringHold = droopRateVPerSecond * holdDuration;
  const endOfHoldVoltage = heldVoltage - droopDuringHold;
  const inputSlewAtSample =
    2 *
    Math.PI *
    inputFrequencyHz *
    INPUT_AMPLITUDE_V *
    Math.cos(2 * Math.PI * inputFrequencyHz * nominalSampleTime);
  const apertureVoltageUncertainty =
    Math.abs(inputSlewAtSample) * apertureJitterSeconds;

  const controls = [
    {
      id: 'sample-hold-input-frequency',
      label: 'Input frequency',
      valueText: `${inputFrequencyHz} Hz`,
      min: 20,
      max: 180,
      step: 5,
      value: inputFrequencyHz,
      onChange: (event) => setInputFrequencyHz(Number(event.target.value)),
    },
    {
      id: 'sample-hold-acquisition-time',
      label: 'Illustrative 5-tau acquisition interval',
      valueText: `${acquisitionTimeUs} us`,
      min: 20,
      max: 300,
      step: 5,
      value: acquisitionTimeUs,
      onChange: (event) => setAcquisitionTimeUs(Number(event.target.value)),
    },
    {
      id: 'sample-hold-aperture-delay',
      label: 'Aperture delay',
      valueText: `${trimFixed(apertureDelayUs, 1)} us`,
      min: 0,
      max: 50,
      step: 0.5,
      value: apertureDelayUs,
      onChange: (event) => setApertureDelayUs(Number(event.target.value)),
    },
    {
      id: 'sample-hold-aperture-jitter',
      label: 'Aperture jitter, RMS',
      valueText: `${apertureJitterNs} ns`,
      min: 0,
      max: 5000,
      step: 50,
      value: apertureJitterNs,
      onChange: (event) => setApertureJitterNs(Number(event.target.value)),
    },
    {
      id: 'sample-hold-droop-rate',
      label: 'Downward droop rate',
      valueText: `${trimFixed(droopRateMvPerMs, 1)} mV/ms`,
      min: 0,
      max: 25,
      step: 0.5,
      value: droopRateMvPerMs,
      onChange: (event) => setDroopRateMvPerMs(Number(event.target.value)),
    },
  ];

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">
        Sample-and-hold cycle explorer
      </div>
      <div className="interactive-block__body">
        <SignalPathDiagram />

        <div
          style={{
            display: 'grid',
            gap: '1rem',
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--hw-border-subtle)',
          }}
        >
          {controls.map((control) => (
            <div key={control.id} style={controlRowStyle}>
              <label htmlFor={control.id}>
                {control.label}:{' '}
                <strong style={valueStyle}>{control.valueText}</strong>
              </label>
              <input
                id={control.id}
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                aria-valuetext={control.valueText}
                onChange={control.onChange}
              />
            </div>
          ))}
        </div>

        <div
          aria-live="polite"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
            gap: '0.75rem',
            margin: '1.5rem 0 1rem',
          }}
        >
          <div className="tech-panel">
            <span className="panel-header">Timing</span>
            <p>
              <strong>Fixed sample rate:</strong>
              <br />
              <span style={valueStyle}>{SAMPLE_RATE_HZ} samples/s</span>
            </p>
            <p>
              <strong>Sample period:</strong>
              <br />
              <span style={valueStyle}>
                {formatTime(samplePeriodSeconds)}
              </span>
            </p>
            <p style={{marginBottom: 0}}>
              <strong>Nominal sample instant:</strong>
              <br />
              <span style={valueStyle}>{formatTime(nominalSampleTime)}</span>
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Held value</span>
            <p>
              <strong>Voltage at the sample instant:</strong>
              <br />
              <span style={valueStyle}>{formatVoltage(heldVoltage)}</span>
            </p>
            <p style={{marginBottom: 0}}>
              The effective sampling instant occurs after the selected
              aperture delay.
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Hold droop</span>
            <p>
              <strong>Change during hold:</strong>
              <br />
              <span style={valueStyle}>
                {formatSignedVoltage(-droopDuringHold)}
              </span>
            </p>
            <p style={{marginBottom: 0}}>
              <strong>Value at the end of hold:</strong>
              <br />
              <span style={valueStyle}>
                {formatVoltage(endOfHoldVoltage)}
              </span>
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Aperture jitter, RMS</span>
            <p>
              <strong>Illustrative +/- 1 sigma interval:</strong>
              <br />
              <span style={valueStyle}>
                +/- {formatTime(apertureJitterSeconds)}
              </span>
            </p>
            <p style={{marginBottom: 0}}>
              <strong>Local RMS voltage estimate:</strong>
              <br />
              <span style={valueStyle}>
                {formatVoltage(apertureVoltageUncertainty)}
              </span>
            </p>
          </div>
        </div>

        <PhaseKey />

        <SampleHoldTimePlot
          inputFrequencyHz={inputFrequencyHz}
          acquisitionTimeSeconds={acquisitionTimeSeconds}
          apertureJitterSeconds={apertureJitterSeconds}
          droopRateVPerSecond={droopRateVPerSecond}
          samplePeriodSeconds={samplePeriodSeconds}
          holdCommandTime={holdCommandTime}
          nominalSampleTime={nominalSampleTime}
          acquisitionTau={acquisitionTau}
          previousHeldVoltage={previousHeldVoltage}
          heldVoltage={heldVoltage}
          endOfHoldVoltage={endOfHoldVoltage}
        />

        <p
          style={{
            margin: '1rem 0 0',
            color: 'var(--hw-text-secondary)',
            fontSize: '0.84rem',
          }}
        >
          This first-order view labels the first five time constants as an
          illustrative acquisition interval. A fixed input step would still
          have approximately 0.67% of its initial error after this interval.
          The one-pole response continues without a voltage snap during track.
          The model sends the hold command at 45% of the sample period and
          treats aperture delay as command-to-effective-sample delay. It does
          not model the finite aperture time. The input-frequency range stays
          below the 200 Hz Nyquist limit for the fixed 400 samples/s rate.
          Real switches can also add charge injection, clock feedthrough,
          leakage, and nonlinear on-resistance.
        </p>
      </div>
    </div>
  );
}
