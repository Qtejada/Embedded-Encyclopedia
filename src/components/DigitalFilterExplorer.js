import React, {useId, useMemo, useState} from 'react';

const TWO_PI = 2 * Math.PI;
const TIME_SAMPLE_COUNT = 72;
const WARMUP_SAMPLE_COUNT = 256;
const IMPULSE_SAMPLE_COUNT = 32;
const RESPONSE_POINT_COUNT = 401;
const RESPONSE_FLOOR_DB = -60;

const controlGridStyle = {
  display: 'grid',
  gridTemplateColumns:
    'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
  gap: '0.9rem',
  alignItems: 'end',
};

const valueStyle = {
  color: 'var(--ifm-color-primary)',
  fontFamily: 'var(--ifm-font-family-monospace)',
};

const selectStyle = {
  width: '100%',
  marginTop: '0.35rem',
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

const addedComponents = {
  none: {
    label: 'No added component',
    shortLabel: 'none',
    terms: [],
  },
  tone: {
    label: 'High-frequency tone at 0.36 fs',
    shortLabel: '0.36 fs tone',
    terms: [{frequencyRatio: 0.36, amplitude: 0.46, phase: 0.72}],
  },
  noise: {
    label: 'Deterministic noise mix from 0.23 fs to 0.46 fs',
    shortLabel: 'deterministic noise mix',
    terms: [
      {frequencyRatio: 0.23, amplitude: 0.25, phase: 0.28},
      {frequencyRatio: 0.34, amplitude: 0.19, phase: 1.17},
      {frequencyRatio: 0.46, amplitude: 0.14, phase: 2.03},
    ],
  },
};

function trimFixed(value, digits) {
  return value
    .toFixed(digits)
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '');
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function formatFrequency(frequencyHz) {
  if (frequencyHz >= 1000000) {
    return `${trimFixed(frequencyHz / 1000000, 2)} MHz`;
  }

  if (frequencyHz >= 1000) {
    return `${trimFixed(frequencyHz / 1000, 2)} kHz`;
  }

  return `${trimFixed(frequencyHz, 2)} Hz`;
}

function formatGainDb(magnitudeLinear) {
  if (magnitudeLinear <= 0.0001) {
    return '< -80 dB';
  }

  const gainDb = 20 * Math.log10(magnitudeLinear);
  const normalizedGainDb = Math.abs(gainDb) < 0.005 ? 0 : gainDb;
  return `${normalizedGainDb > 0 ? '+' : ''}${normalizedGainDb.toFixed(2)} dB`;
}

function getInputSample(
  sampleIndex,
  desiredFrequencyRatio,
  addedComponent,
) {
  const desiredSignal = Math.sin(
    TWO_PI * desiredFrequencyRatio * sampleIndex,
  );
  const addedSignal = addedComponent.terms.reduce(
    (sum, term) =>
      sum +
      term.amplitude *
        Math.sin(
          TWO_PI * term.frequencyRatio * sampleIndex + term.phase,
        ),
    0,
  );

  return desiredSignal + addedSignal;
}

function filterSamples(samples, mode, firTapCount, iirAlpha) {
  if (mode === 'fir') {
    return samples.map((_, sampleIndex) => {
      let sum = 0;

      for (let tapIndex = 0; tapIndex < firTapCount; tapIndex += 1) {
        const inputIndex = sampleIndex - tapIndex;
        sum += inputIndex >= 0 ? samples[inputIndex] : 0;
      }

      return sum / firTapCount;
    });
  }

  const output = [];
  let previousOutput = 0;

  samples.forEach((sample) => {
    const nextOutput =
      (1 - iirAlpha) * sample + iirAlpha * previousOutput;
    output.push(nextOutput);
    previousOutput = nextOutput;
  });

  return output;
}

function getMagnitudeAtFrequency(
  mode,
  normalizedFrequency,
  firTapCount,
  iirAlpha,
) {
  const angularFrequency = TWO_PI * normalizedFrequency;

  if (mode === 'fir') {
    if (Math.abs(angularFrequency) < Number.EPSILON) {
      return 1;
    }

    const denominator =
      firTapCount * Math.sin(angularFrequency / 2);

    if (Math.abs(denominator) < 1e-12) {
      return 0;
    }

    return Math.abs(
      Math.sin((firTapCount * angularFrequency) / 2) / denominator,
    );
  }

  const pole = iirAlpha;
  const denominatorMagnitude = Math.sqrt(
    1 +
      pole * pole -
      2 * pole * Math.cos(angularFrequency),
  );

  return (1 - iirAlpha) / denominatorMagnitude;
}

function getCutoffFrequencyRatio(mode, firTapCount, iirAlpha) {
  const cutoffMagnitude = 1 / Math.sqrt(2);
  let previousFrequency = 0;
  let previousMagnitude = 1;

  for (let index = 1; index <= 10000; index += 1) {
    const frequency = 0.5 * (index / 10000);
    const magnitude = getMagnitudeAtFrequency(
      mode,
      frequency,
      firTapCount,
      iirAlpha,
    );

    if (magnitude <= cutoffMagnitude) {
      const magnitudeSpan = previousMagnitude - magnitude;
      const interpolation =
        magnitudeSpan > 0
          ? (previousMagnitude - cutoffMagnitude) / magnitudeSpan
          : 0;

      return (
        previousFrequency +
        interpolation * (frequency - previousFrequency)
      );
    }

    previousFrequency = frequency;
    previousMagnitude = magnitude;
  }

  return null;
}

function getFirNullFrequencyRatios(firTapCount) {
  return Array.from(
    {length: Math.floor(firTapCount / 2)},
    (_, index) => (index + 1) / firTapCount,
  );
}

function getResponseFrequencyRatios(mode, firTapCount) {
  const frequencyRatios = Array.from(
    {length: RESPONSE_POINT_COUNT},
    (_, index) =>
      0.5 * (index / (RESPONSE_POINT_COUNT - 1)),
  );

  if (mode === 'fir') {
    frequencyRatios.push(...getFirNullFrequencyRatios(firTapCount));
  }

  frequencyRatios.sort((first, second) => first - second);

  return frequencyRatios.filter(
    (frequencyRatio, index) =>
      index === 0 ||
      Math.abs(frequencyRatio - frequencyRatios[index - 1]) >
        1e-12,
  );
}

function getAddedComponentGain(
  mode,
  addedComponent,
  firTapCount,
  iirAlpha,
) {
  if (addedComponent.terms.length === 0) {
    return null;
  }

  const inputPower = addedComponent.terms.reduce(
    (sum, term) => sum + (term.amplitude * term.amplitude) / 2,
    0,
  );
  const outputPower = addedComponent.terms.reduce((sum, term) => {
    const gain = getMagnitudeAtFrequency(
      mode,
      term.frequencyRatio,
      firTapCount,
      iirAlpha,
    );
    return sum + (term.amplitude * gain) ** 2 / 2;
  }, 0);

  return Math.sqrt(outputPower / inputPower);
}

function getModeButtonStyle(isSelected) {
  return {
    appearance: 'none',
    minWidth: '150px',
    border: `1px solid ${
      isSelected ? 'var(--ifm-color-primary)' : 'var(--hw-border)'
    }`,
    borderRadius: '8px',
    padding: '0.65rem 0.85rem',
    background: isSelected
      ? 'rgba(212, 160, 23, 0.14)'
      : 'var(--hw-surface-2)',
    color: isSelected
      ? 'var(--ifm-color-primary)'
      : 'var(--hw-text-primary)',
    font: 'inherit',
    fontWeight: 700,
    cursor: 'pointer',
  };
}

function makeLinePath(values, mapX, mapY) {
  return values
    .map(
      (value, index) =>
        `${index === 0 ? 'M' : 'L'} ${mapX(index).toFixed(2)} ${mapY(
          value,
        ).toFixed(2)}`,
    )
    .join(' ');
}

function ChartLegend({items}) {
  return (
    <div
      role="list"
      aria-label="Chart legend"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.65rem 1.1rem',
        margin: '0 0 0.65rem',
        color: 'var(--hw-text-secondary)',
        fontSize: '0.82rem',
      }}
    >
      {items.map((item) => (
        <span
          key={item.label}
          role="listitem"
          style={{display: 'inline-flex', alignItems: 'center', gap: '0.4rem'}}
        >
          <span
            aria-hidden="true"
            style={{
              width: '28px',
              borderTop: `${item.width ?? 2}px ${
                item.dashed ? 'dashed' : 'solid'
              } ${item.color}`,
            }}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function ChartFrame({children, minimumWidth = 620}) {
  return (
    <div>
      <div className="diagram-scroll-hint">
        Scroll horizontally to inspect the labeled plot.
      </div>
      <div
        style={{
          overflowX: 'auto',
          border: '1px solid var(--hw-border)',
          borderRadius: '10px',
          background: 'var(--hw-surface-0)',
        }}
      >
        <div style={{minWidth: `${minimumWidth}px`}}>{children}</div>
      </div>
    </div>
  );
}

function TimeSeriesPlot({
  inputSamples,
  outputSamples,
  titleId,
  descriptionId,
}) {
  const width = 860;
  const height = 310;
  const plotLeft = 70;
  const plotRight = 836;
  const plotTop = 42;
  const plotBottom = 242;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const maximumMagnitude = Math.max(
    1.5,
    ...inputSamples.map(Math.abs),
    ...outputSamples.map(Math.abs),
  );
  const amplitudeLimit =
    Math.ceil((maximumMagnitude * 1.12) / 0.25) * 0.25;
  const yTicks = [
    -amplitudeLimit,
    -amplitudeLimit / 2,
    0,
    amplitudeLimit / 2,
    amplitudeLimit,
  ];
  const xTicks = [0, 12, 24, 36, 48, 60, TIME_SAMPLE_COUNT - 1];
  const mapX = (sampleIndex) =>
    plotLeft +
    (sampleIndex / (TIME_SAMPLE_COUNT - 1)) * plotWidth;
  const mapY = (value) =>
    plotBottom -
    ((value + amplitudeLimit) / (2 * amplitudeLimit)) * plotHeight;
  const inputPath = makeLinePath(inputSamples, mapX, mapY);
  const outputPath = makeLinePath(outputSamples, mapX, mapY);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
      style={{display: 'block', width: '100%', height: 'auto'}}
    >
      <title id={titleId}>Sampled input and filtered output</title>
      <desc id={descriptionId}>
        A time plot compares the deterministic sampled input with the
        causal filter output. Every circle is one sample.
      </desc>

      <rect
        x={plotLeft}
        y={plotTop}
        width={plotWidth}
        height={plotHeight}
        fill="var(--hw-surface-1)"
      />

      {yTicks.map((tick) => {
        const y = mapY(tick);
        return (
          <g key={`time-y-${tick}`}>
            <line
              x1={plotLeft}
              y1={y}
              x2={plotRight}
              y2={y}
              stroke={
                tick === 0
                  ? 'var(--hw-border)'
                  : 'var(--hw-border-subtle)'
              }
              strokeWidth={tick === 0 ? 1.4 : 1}
            />
            <text
              x={plotLeft - 10}
              y={y + 4}
              textAnchor="end"
              fill="var(--hw-text-secondary)"
              fontSize="11"
            >
              {trimFixed(tick, 2)}
            </text>
          </g>
        );
      })}

      {xTicks.map((tick) => {
        const x = mapX(tick);
        const textAnchor =
          tick === 0
            ? 'start'
            : tick === TIME_SAMPLE_COUNT - 1
              ? 'end'
              : 'middle';
        return (
          <g key={`time-x-${tick}`}>
            <line
              x1={x}
              y1={plotTop}
              x2={x}
              y2={plotBottom}
              stroke="var(--hw-border-subtle)"
              strokeWidth="1"
            />
            <text
              x={x}
              y={plotBottom + 20}
              textAnchor={textAnchor}
              fill="var(--hw-text-secondary)"
              fontSize="11"
            >
              {tick}
            </text>
          </g>
        );
      })}

      <path
        d={inputPath}
        fill="none"
        stroke="var(--hw-accent-blue)"
        strokeWidth="1.7"
        strokeDasharray="5 4"
        strokeLinejoin="round"
      />
      {inputSamples.map((value, sampleIndex) => (
        <circle
          key={`input-sample-${sampleIndex}`}
          cx={mapX(sampleIndex)}
          cy={mapY(value)}
          r="1.9"
          fill="var(--hw-accent-blue)"
        />
      ))}

      <path
        d={outputPath}
        fill="none"
        stroke="var(--ifm-color-primary)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {outputSamples.map((value, sampleIndex) => (
        <circle
          key={`output-sample-${sampleIndex}`}
          cx={mapX(sampleIndex)}
          cy={mapY(value)}
          r="2.15"
          fill="var(--ifm-color-primary)"
        />
      ))}

      <text
        x={plotLeft}
        y={24}
        fill="var(--hw-text-secondary)"
        fontSize="11"
        fontWeight="700"
      >
        NORMALIZED AMPLITUDE
      </text>
      <text
        x={(plotLeft + plotRight) / 2}
        y={height - 15}
        textAnchor="middle"
        fill="var(--hw-text-secondary)"
        fontSize="11"
        fontWeight="700"
      >
        SAMPLE INDEX n
      </text>
    </svg>
  );
}

function ImpulseResponsePlot({
  impulseResponse,
  mode,
  titleId,
  descriptionId,
}) {
  const width = 520;
  const height = 310;
  const plotLeft = 64;
  const plotRight = 496;
  const plotTop = 42;
  const plotBottom = 238;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const maximumCoefficient = Math.max(...impulseResponse);
  const yMaximum = Math.max(
    0.05,
    Math.ceil((maximumCoefficient * 1.15) / 0.05) * 0.05,
  );
  const yTicks = [0, yMaximum / 2, yMaximum];
  const xTicks = [0, 4, 8, 12, 16, 20, 24, 28, 31];
  const mapX = (sampleIndex) =>
    plotLeft +
    (sampleIndex / (IMPULSE_SAMPLE_COUNT - 1)) * plotWidth;
  const mapY = (value) =>
    plotBottom - (value / yMaximum) * plotHeight;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
      style={{display: 'block', width: '100%', height: 'auto'}}
    >
      <title id={titleId}>
        {mode === 'fir'
          ? 'Moving-average FIR coefficients'
          : 'One-pole IIR impulse response'}
      </title>
      <desc id={descriptionId}>
        Stem markers show the filter response to one unit impulse. The FIR
        response ends after its last tap. The IIR response decreases but
        continues indefinitely.
      </desc>

      <rect
        x={plotLeft}
        y={plotTop}
        width={plotWidth}
        height={plotHeight}
        fill="var(--hw-surface-1)"
      />

      {yTicks.map((tick) => {
        const y = mapY(tick);
        return (
          <g key={`impulse-y-${tick}`}>
            <line
              x1={plotLeft}
              y1={y}
              x2={plotRight}
              y2={y}
              stroke="var(--hw-border-subtle)"
              strokeWidth="1"
            />
            <text
              x={plotLeft - 9}
              y={y + 4}
              textAnchor="end"
              fill="var(--hw-text-secondary)"
              fontSize="10.5"
            >
              {trimFixed(tick, 3)}
            </text>
          </g>
        );
      })}

      {xTicks.map((tick) => {
        const x = mapX(tick);
        const textAnchor = tick === 0 ? 'start' : tick === 31 ? 'end' : 'middle';
        return (
          <text
            key={`impulse-x-${tick}`}
            x={x}
            y={plotBottom + 20}
            textAnchor={textAnchor}
            fill="var(--hw-text-secondary)"
            fontSize="10.5"
          >
            {tick}
          </text>
        );
      })}

      {impulseResponse.map((coefficient, sampleIndex) => {
        const x = mapX(sampleIndex);
        const y = mapY(coefficient);
        const isNonzero = coefficient > 1e-9;

        return (
          <g key={`impulse-${sampleIndex}`}>
            <line
              x1={x}
              y1={plotBottom}
              x2={x}
              y2={y}
              stroke={
                isNonzero
                  ? 'var(--hw-accent-teal)'
                  : 'var(--hw-border)'
              }
              strokeWidth={isNonzero ? 2 : 1}
            />
            <circle
              cx={x}
              cy={y}
              r={isNonzero ? 2.7 : 1.8}
              fill={
                isNonzero
                  ? 'var(--hw-accent-teal)'
                  : 'var(--hw-text-secondary)'
              }
            />
          </g>
        );
      })}

      <line
        x1={plotLeft}
        y1={plotBottom}
        x2={plotRight}
        y2={plotBottom}
        stroke="var(--hw-text-secondary)"
        strokeWidth="1.2"
      />
      <text
        x={plotLeft}
        y={24}
        fill="var(--hw-text-secondary)"
        fontSize="11"
        fontWeight="700"
      >
        {mode === 'fir' ? 'COEFFICIENT h[n]' : 'IMPULSE RESPONSE h[n]'}
      </text>
      <text
        x={(plotLeft + plotRight) / 2}
        y={height - 15}
        textAnchor="middle"
        fill="var(--hw-text-secondary)"
        fontSize="11"
        fontWeight="700"
      >
        SAMPLE INDEX n
      </text>
    </svg>
  );
}

function MagnitudeResponsePlot({
  responsePoints,
  desiredFrequencyRatio,
  addedFrequencyRatios,
  firNullFrequencyRatios,
  titleId,
  descriptionId,
}) {
  const width = 520;
  const height = 310;
  const plotLeft = 64;
  const plotRight = 496;
  const plotTop = 42;
  const plotBottom = 238;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const yTicks = [0, -10, -20, -30, -40, -50, -60];
  const xTicks = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
  const mapFrequencyToX = (frequencyRatio) =>
    plotLeft + (frequencyRatio / 0.5) * plotWidth;
  const mapGainToY = (gainDb) =>
    plotTop +
    ((0 - clamp(gainDb, RESPONSE_FLOOR_DB, 0)) /
      (0 - RESPONSE_FLOOR_DB)) *
      plotHeight;
  const responsePath = responsePoints
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'} ${mapFrequencyToX(
          point.frequencyRatio,
        ).toFixed(2)} ${mapGainToY(point.gainDb).toFixed(2)}`,
    )
    .join(' ');
  const wantedX = mapFrequencyToX(desiredFrequencyRatio);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
      style={{display: 'block', width: '100%', height: 'auto'}}
    >
      <title id={titleId}>Digital-filter magnitude response</title>
      <desc id={descriptionId}>
        The response shows gain from zero frequency to the Nyquist
        frequency. One marker identifies the wanted tone. Separate markers
        identify each selected interference tone. Circular markers identify
        exact moving-average FIR nulls when FIR mode is active. Phase is not
        shown.
      </desc>

      <rect
        x={plotLeft}
        y={plotTop}
        width={plotWidth}
        height={plotHeight}
        fill="var(--hw-surface-1)"
      />

      {yTicks.map((tick) => {
        const y = mapGainToY(tick);
        return (
          <g key={`response-y-${tick}`}>
            <line
              x1={plotLeft}
              y1={y}
              x2={plotRight}
              y2={y}
              stroke="var(--hw-border-subtle)"
              strokeWidth="1"
            />
            <text
              x={plotLeft - 9}
              y={y + 4}
              textAnchor="end"
              fill="var(--hw-text-secondary)"
              fontSize="10.5"
            >
              {tick}
            </text>
          </g>
        );
      })}

      {xTicks.map((tick) => {
        const x = mapFrequencyToX(tick);
        const textAnchor = tick === 0 ? 'start' : tick === 0.5 ? 'end' : 'middle';
        return (
          <g key={`response-x-${tick}`}>
            <line
              x1={x}
              y1={plotTop}
              x2={x}
              y2={plotBottom}
              stroke="var(--hw-border-subtle)"
              strokeWidth="1"
            />
            <text
              x={x}
              y={plotBottom + 20}
              textAnchor={textAnchor}
              fill="var(--hw-text-secondary)"
              fontSize="10.5"
            >
              {trimFixed(tick, 1)}
            </text>
          </g>
        );
      })}

      <line
        x1={wantedX}
        y1={plotTop}
        x2={wantedX}
        y2={plotBottom}
        stroke="var(--hw-accent-blue)"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />

      {addedFrequencyRatios.map((frequencyRatio, index) => (
        <line
          key={`added-frequency-${frequencyRatio}`}
          x1={mapFrequencyToX(frequencyRatio)}
          y1={plotTop}
          x2={mapFrequencyToX(frequencyRatio)}
          y2={plotBottom}
          stroke="var(--hw-accent-purple)"
          strokeWidth="1.5"
          strokeDasharray={index % 2 === 0 ? '2 4' : '6 4'}
        />
      ))}

      <path
        d={responsePath}
        fill="none"
        stroke="var(--ifm-color-primary)"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />

      {firNullFrequencyRatios.map((frequencyRatio) => (
        <circle
          key={`fir-null-${frequencyRatio}`}
          cx={mapFrequencyToX(frequencyRatio)}
          cy={mapGainToY(RESPONSE_FLOOR_DB)}
          r="3.2"
          fill="var(--hw-surface-0)"
          stroke="var(--ifm-color-primary)"
          strokeWidth="1.8"
        />
      ))}

      <text
        x={plotLeft}
        y={24}
        fill="var(--hw-text-secondary)"
        fontSize="11"
        fontWeight="700"
      >
        GAIN (dB)
      </text>
      <text
        x={(plotLeft + plotRight) / 2}
        y={height - 15}
        textAnchor="middle"
        fill="var(--hw-text-secondary)"
        fontSize="11"
        fontWeight="700"
      >
        NORMALIZED FREQUENCY f/fs
      </text>
    </svg>
  );
}

export default function DigitalFilterExplorer() {
  const generatedId = useId().replace(/:/g, '');
  const [mode, setMode] = useState('fir');
  const [sampleRate, setSampleRate] = useState(8000);
  const [desiredFrequencyRatio, setDesiredFrequencyRatio] = useState(0.05);
  const [addedComponentKey, setAddedComponentKey] = useState('tone');
  const [firTapCount, setFirTapCount] = useState(9);
  const [iirAlpha, setIirAlpha] = useState(0.82);
  const addedComponent = addedComponents[addedComponentKey];

  const signalData = useMemo(() => {
    const totalSampleCount =
      WARMUP_SAMPLE_COUNT + TIME_SAMPLE_COUNT;
    const input = Array.from({length: totalSampleCount}, (_, index) =>
      getInputSample(
        index - WARMUP_SAMPLE_COUNT,
        desiredFrequencyRatio,
        addedComponent,
      ),
    );
    const output = filterSamples(
      input,
      mode,
      firTapCount,
      iirAlpha,
    );

    return {
      input: input.slice(-TIME_SAMPLE_COUNT),
      output: output.slice(-TIME_SAMPLE_COUNT),
    };
  }, [
    addedComponent,
    desiredFrequencyRatio,
    firTapCount,
    iirAlpha,
    mode,
  ]);

  const impulseResponse = useMemo(
    () =>
      Array.from({length: IMPULSE_SAMPLE_COUNT}, (_, sampleIndex) =>
        mode === 'fir'
          ? sampleIndex < firTapCount
            ? 1 / firTapCount
            : 0
          : (1 - iirAlpha) * iirAlpha ** sampleIndex,
      ),
    [firTapCount, iirAlpha, mode],
  );

  const firNullFrequencyRatios = useMemo(
    () =>
      mode === 'fir'
        ? getFirNullFrequencyRatios(firTapCount)
        : [],
    [firTapCount, mode],
  );

  const responsePoints = useMemo(
    () => {
      const frequencyRatios = getResponseFrequencyRatios(
        mode,
        firTapCount,
      );

      return frequencyRatios.map((frequencyRatio) => {
        const magnitude = getMagnitudeAtFrequency(
          mode,
          frequencyRatio,
          firTapCount,
          iirAlpha,
        );
        const gainDb =
          magnitude > 0
            ? 20 * Math.log10(magnitude)
            : RESPONSE_FLOOR_DB;

        return {
          frequencyRatio,
          gainDb: Math.max(RESPONSE_FLOOR_DB, gainDb),
        };
      });
    },
    [firTapCount, iirAlpha, mode],
  );

  const desiredGain = getMagnitudeAtFrequency(
    mode,
    desiredFrequencyRatio,
    firTapCount,
    iirAlpha,
  );
  const addedGain = getAddedComponentGain(
    mode,
    addedComponent,
    firTapCount,
    iirAlpha,
  );
  const addedFrequencyRatios = addedComponent.terms.map(
    (term) => term.frequencyRatio,
  );
  const addedGainLabel =
    addedComponentKey === 'noise'
      ? 'RMS gain of the three-tone interference mix'
      : addedComponentKey === 'tone'
        ? 'Added-tone gain'
        : 'Added-component gain';
  const cutoffFrequencyRatio = getCutoffFrequencyRatio(
    mode,
    firTapCount,
    iirAlpha,
  );
  const groupDelaySamples =
    mode === 'fir'
      ? (firTapCount - 1) / 2
      : iirAlpha / (1 - iirAlpha);
  const groupDelayMilliseconds =
    (groupDelaySamples / sampleRate) * 1000;
  const iirPole = iirAlpha;
  const filterName =
    mode === 'fir'
      ? `${firTapCount}-tap moving-average FIR`
      : `one-pole IIR, alpha ${iirAlpha.toFixed(2)}`;
  const formula =
    mode === 'fir'
      ? `y[n] = (1/${firTapCount}) sum(k=0 to ${
          firTapCount - 1
        }) x[n-k]`
      : `y[n] = ${(1 - iirAlpha).toFixed(
          2,
        )}x[n] + ${iirAlpha.toFixed(2)}y[n-1]`;
  const coefficientSummary =
    mode === 'fir'
      ? `${firTapCount} coefficients, each ${trimFixed(
          1 / firTapCount,
          5,
        )}`
      : `h[n] = ${(1 - iirAlpha).toFixed(
          2,
        )}(${iirAlpha.toFixed(2)})^n for n >= 0`;
  const delayLabel =
    mode === 'fir'
      ? 'Linear-phase FIR group delay'
      : 'Low-frequency IIR group delay';
  const delayScopeText =
    mode === 'fir'
      ? 'The FIR group delay is constant away from its response nulls. This explorer does not plot phase.'
      : 'This value is the group delay at zero frequency. IIR group delay varies with frequency, and this explorer does not plot phase.';
  const stabilityText =
    mode === 'fir'
      ? 'Stable: its finite impulse response is absolutely summable. Its coefficient sum of 1 gives unity DC gain.'
      : `Stable: pole ${iirPole.toFixed(
          2,
        )} is inside the unit circle.`;
  const cutoffText =
    cutoffFrequencyRatio === null
      ? 'No -3 dB point below Nyquist'
      : `${trimFixed(
          cutoffFrequencyRatio,
          4,
        )} fs (${formatFrequency(cutoffFrequencyRatio * sampleRate)})`;

  const sampleRateId = `${generatedId}-sample-rate`;
  const desiredFrequencyId = `${generatedId}-desired-frequency`;
  const addedComponentId = `${generatedId}-added-component`;
  const filterParameterId = `${generatedId}-filter-parameter`;
  const timeTitleId = `${generatedId}-time-title`;
  const timeDescriptionId = `${generatedId}-time-description`;
  const impulseTitleId = `${generatedId}-impulse-title`;
  const impulseDescriptionId = `${generatedId}-impulse-description`;
  const responseTitleId = `${generatedId}-response-title`;
  const responseDescriptionId = `${generatedId}-response-description`;

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">
        Digital-filter explorer
      </div>
      <div className="interactive-block__body">
        <div
          role="group"
          aria-label="Digital filter mode"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.65rem',
            marginBottom: '1.1rem',
          }}
        >
          <button
            type="button"
            aria-pressed={mode === 'fir'}
            style={getModeButtonStyle(mode === 'fir')}
            onClick={() => setMode('fir')}
          >
            Moving-average FIR
          </button>
          <button
            type="button"
            aria-pressed={mode === 'iir'}
            style={getModeButtonStyle(mode === 'iir')}
            onClick={() => setMode('iir')}
          >
            One-pole low-pass IIR
          </button>
        </div>

        <div style={controlGridStyle}>
          <div>
            <label htmlFor={sampleRateId}>
              Sample rate, fs:{' '}
              <strong style={valueStyle}>
                {formatFrequency(sampleRate)}
              </strong>
            </label>
            <input
              id={sampleRateId}
              type="range"
              min="1000"
              max="16000"
              step="500"
              value={sampleRate}
              aria-valuetext={formatFrequency(sampleRate)}
              onChange={(event) =>
                setSampleRate(Number(event.target.value))
              }
            />
          </div>

          <div>
            <label htmlFor={desiredFrequencyId}>
              Wanted tone:{' '}
              <strong style={valueStyle}>
                {trimFixed(desiredFrequencyRatio, 2)} fs ={' '}
                {formatFrequency(desiredFrequencyRatio * sampleRate)}
              </strong>
            </label>
            <input
              id={desiredFrequencyId}
              type="range"
              min="0.02"
              max="0.12"
              step="0.01"
              value={desiredFrequencyRatio}
              aria-valuetext={`${trimFixed(
                desiredFrequencyRatio,
                2,
              )} times the sample rate, ${formatFrequency(
                desiredFrequencyRatio * sampleRate,
              )}`}
              onChange={(event) =>
                setDesiredFrequencyRatio(Number(event.target.value))
              }
            />
          </div>

          <div>
            <label htmlFor={addedComponentId}>
              Added high-frequency component
            </label>
            <select
              id={addedComponentId}
              value={addedComponentKey}
              style={selectStyle}
              onChange={(event) =>
                setAddedComponentKey(event.target.value)
              }
            >
              {Object.entries(addedComponents).map(([key, option]) => (
                <option key={key} value={key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={filterParameterId}>
              {mode === 'fir' ? 'FIR tap count' : 'IIR alpha'}:{' '}
              <strong style={valueStyle}>
                {mode === 'fir' ? firTapCount : iirAlpha.toFixed(2)}
              </strong>
            </label>
            <input
              id={filterParameterId}
              type="range"
              min={mode === 'fir' ? 3 : 0.02}
              max={mode === 'fir' ? 31 : 0.98}
              step={mode === 'fir' ? 2 : 0.01}
              value={mode === 'fir' ? firTapCount : iirAlpha}
              aria-valuetext={
                mode === 'fir'
                  ? `${firTapCount} taps`
                  : `alpha ${iirAlpha.toFixed(2)}`
              }
              onChange={(event) => {
                const value = Number(event.target.value);
                if (mode === 'fir') {
                  setFirTapCount(value);
                } else {
                  setIirAlpha(value);
                }
              }}
            />
          </div>
        </div>

        <p
          aria-live="polite"
          aria-atomic="true"
          style={visuallyHiddenStyle}
        >
          Digital filter updated. {filterName}. Sample rate{' '}
          {formatFrequency(sampleRate)}. Wanted tone{' '}
          {trimFixed(desiredFrequencyRatio, 2)} times the sample rate.
          Added component: {addedComponent.shortLabel}.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
            margin: '1.35rem 0',
          }}
        >
          <div className="tech-panel">
            <span className="panel-header">Difference equation</span>
            <p
              style={{
                margin: '0 0 0.65rem',
                overflowWrap: 'anywhere',
                fontFamily: 'var(--ifm-font-family-monospace)',
                fontSize: '0.82rem',
              }}
            >
              {formula}
            </p>
            <p style={{marginBottom: 0, color: 'var(--hw-text-secondary)'}}>
              {coefficientSummary}
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Delay and magnitude corner</span>
            <p>
              <strong>{delayLabel}:</strong>
              <br />
              <span style={valueStyle}>
                {trimFixed(groupDelaySamples, 3)} samples ={' '}
                {trimFixed(groupDelayMilliseconds, 3)} ms
              </span>
            </p>
            <p style={{marginBottom: 0}}>
              <strong>-3 dB frequency:</strong>
              <br />
              {cutoffText}
            </p>
            <p
              style={{
                margin: '0.65rem 0 0',
                color: 'var(--hw-text-secondary)',
              }}
            >
              {delayScopeText}
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Live magnitude response</span>
            <p>
              <strong>Wanted-tone gain:</strong>
              <br />
              <span style={valueStyle}>{formatGainDb(desiredGain)}</span>
            </p>
            <p>
              <strong>{addedGainLabel}:</strong>
              <br />
              <span style={valueStyle}>
                {addedGain === null ? 'Not applicable' : formatGainDb(addedGain)}
              </span>
            </p>
            <p style={{marginBottom: 0, color: 'var(--hw-text-secondary)'}}>
              {stabilityText}
            </p>
          </div>
        </div>

        <section aria-labelledby={`${generatedId}-time-heading`}>
          <h4
            id={`${generatedId}-time-heading`}
            style={{fontSize: '1rem', margin: '1.5rem 0 0.65rem'}}
          >
            Sampled signal
          </h4>
          <ChartLegend
            items={[
              {
                label: `Input: wanted tone + ${addedComponent.shortLabel}`,
                color: 'var(--hw-accent-blue)',
                dashed: true,
              },
              {
                label: `Output: ${filterName}`,
                color: 'var(--ifm-color-primary)',
                width: 3,
              },
            ]}
          />
          <ChartFrame minimumWidth={650}>
            <TimeSeriesPlot
              inputSamples={signalData.input}
              outputSamples={signalData.output}
              titleId={timeTitleId}
              descriptionId={timeDescriptionId}
            />
          </ChartFrame>
          <p
            style={{
              margin: '0.65rem 0 0',
              color: 'var(--hw-text-secondary)',
              fontSize: '0.84rem',
            }}
          >
            The input is already in the sampled domain. A digital filter can
            reduce the added component. It cannot recover content that
            aliased when the ADC made the original samples.
          </p>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '1rem',
            marginTop: '1.35rem',
          }}
        >
          <section
            className="tech-panel"
            aria-labelledby={`${generatedId}-impulse-heading`}
            style={{minWidth: 0}}
          >
            <span
              id={`${generatedId}-impulse-heading`}
              className="panel-header"
            >
              Impulse response and coefficients
            </span>
            <ChartLegend
              items={[
                {
                  label:
                    mode === 'fir'
                      ? 'Finite coefficient sequence'
                      : 'Recursive impulse-response tail',
                  color: 'var(--hw-accent-teal)',
                  width: 2,
                },
              ]}
            />
            <ChartFrame minimumWidth={470}>
              <ImpulseResponsePlot
                impulseResponse={impulseResponse}
                mode={mode}
                titleId={impulseTitleId}
                descriptionId={impulseDescriptionId}
              />
            </ChartFrame>
            <p
              style={{
                margin: '0.65rem 0 0',
                color: 'var(--hw-text-secondary)',
                fontSize: '0.82rem',
              }}
            >
              {mode === 'fir'
                ? `The response ends after tap ${
                    firTapCount - 1
                  }. The equal coefficients give unity DC gain.`
                : 'The response continues indefinitely in theory. Its decreasing tail is absolutely summable and stable for the selected alpha range.'}
            </p>
          </section>

          <section
            className="tech-panel"
            aria-labelledby={`${generatedId}-magnitude-heading`}
            style={{minWidth: 0}}
          >
            <span
              id={`${generatedId}-magnitude-heading`}
              className="panel-header"
            >
              Magnitude response
            </span>
            <ChartLegend
              items={[
                {
                  label: 'Filter gain',
                  color: 'var(--ifm-color-primary)',
                  width: 3,
                },
                {
                  label: 'Wanted tone',
                  color: 'var(--hw-accent-blue)',
                  dashed: true,
                },
                ...(addedComponentKey === 'none'
                  ? []
                  : [
                      {
                        label:
                          addedComponentKey === 'tone'
                            ? 'Added tone'
                            : 'Three interference tones',
                        color: 'var(--hw-accent-purple)',
                        dashed: true,
                      },
                    ]),
              ]}
            />
            <ChartFrame minimumWidth={470}>
              <MagnitudeResponsePlot
                responsePoints={responsePoints}
                desiredFrequencyRatio={desiredFrequencyRatio}
                addedFrequencyRatios={addedFrequencyRatios}
                firNullFrequencyRatios={firNullFrequencyRatios}
                titleId={responseTitleId}
                descriptionId={responseDescriptionId}
              />
            </ChartFrame>
            <p
              style={{
                margin: '0.65rem 0 0',
                color: 'var(--hw-text-secondary)',
                fontSize: '0.82rem',
              }}
            >
              Apply a digital low-pass filter before decimation. It limits
              aliases that the lower output sample rate can create. Use an
              analog anti-alias filter before the ADC to limit aliases at
              the original sampling step. The plot shows magnitude only.
              {mode === 'fir'
                ? ' The circular markers show the exact moving-average nulls at k/L.'
                : ' The displayed IIR delay is only its low-frequency value.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
