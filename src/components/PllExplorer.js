import React, {useId, useMemo, useState} from 'react';

const inputStyle = {
  width: '100%',
  marginTop: '0.35rem',
  border: '1px solid var(--hw-border)',
  borderRadius: '7px',
  padding: '0.55rem 0.7rem',
  background: 'var(--hw-surface-2)',
  color: 'var(--hw-text-primary)',
  font: 'inherit',
};

const resultStyle = {
  margin: '0.25rem 0 0',
  color: 'var(--hw-text-primary)',
  fontFamily: 'var(--ifm-font-family-monospace)',
  fontSize: '1.05rem',
  fontWeight: 750,
};

const secondaryTextStyle = {
  color: 'var(--hw-text-secondary)',
  fontSize: '0.84rem',
};

function trimFixed(value, digits = 4) {
  if (!Number.isFinite(value)) {
    return 'Not available';
  }

  return value
    .toFixed(digits)
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '');
}

function formatFrequency(frequencyHz) {
  if (!Number.isFinite(frequencyHz) || frequencyHz <= 0) {
    return 'Not available';
  }

  if (frequencyHz >= 1e9) {
    return `${trimFixed(frequencyHz / 1e9)} GHz`;
  }

  if (frequencyHz >= 1e6) {
    return `${trimFixed(frequencyHz / 1e6)} MHz`;
  }

  if (frequencyHz >= 1e3) {
    return `${trimFixed(frequencyHz / 1e3)} kHz`;
  }

  if (frequencyHz >= 1) {
    return `${trimFixed(frequencyHz)} Hz`;
  }

  if (frequencyHz >= 1e-3) {
    return `${trimFixed(frequencyHz * 1e3)} mHz`;
  }

  return `${frequencyHz.toExponential(3)} Hz`;
}

function parseFinite(value) {
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function validateFrequencyPlan(values) {
  const parsed = {
    referenceMHz: parseFinite(values.referenceMHz),
    rDivider: parseFinite(values.rDivider),
    integerN: parseFinite(values.integerN),
    numerator: parseFinite(values.numerator),
    modulus: parseFinite(values.modulus),
    outputDivider: parseFinite(values.outputDivider),
  };

  const errors = {};

  if (parsed.referenceMHz === null || parsed.referenceMHz <= 0) {
    errors.referenceMHz = 'Enter a finite frequency greater than zero.';
  }

  for (const [name, label] of [
    ['rDivider', 'R'],
    ['modulus', 'MOD'],
    ['outputDivider', 'D'],
  ]) {
    const value = parsed[name];
    if (
      value === null ||
      !Number.isSafeInteger(value) ||
      value <= 0
    ) {
      errors[name] = `${label} must be a positive integer.`;
    }
  }

  if (
    parsed.integerN === null ||
    !Number.isSafeInteger(parsed.integerN) ||
    parsed.integerN < 0
  ) {
    errors.integerN = 'NINT must be a nonnegative integer.';
  }

  if (
    parsed.numerator === null ||
    !Number.isSafeInteger(parsed.numerator) ||
    parsed.numerator < 0
  ) {
    errors.numerator = 'NUM must be a nonnegative integer.';
  }

  if (
    !errors.numerator &&
    !errors.modulus &&
    parsed.numerator >= parsed.modulus
  ) {
    errors.numerator = 'NUM must be less than MOD.';
  }

  if (
    !errors.integerN &&
    !errors.numerator &&
    !errors.modulus &&
    parsed.integerN + parsed.numerator / parsed.modulus <= 0
  ) {
    errors.integerN = 'The total N value must be greater than zero.';
  }

  if (!errors.integerN && !errors.numerator && !errors.modulus) {
    const fractionalPart = parsed.numerator / parsed.modulus;
    const totalN = parsed.integerN + fractionalPart;
    const recoveredNumerator =
      (totalN - parsed.integerN) * parsed.modulus;
    const numeratorError = Math.abs(
      recoveredNumerator - parsed.numerator,
    );

    if (numeratorError > 1e-6) {
      errors.general =
        'Use smaller NINT or MOD values to preserve fractional precision.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return {errors, results: null};
  }

  const referenceHz = parsed.referenceMHz * 1e6;
  const pfdHz = referenceHz / parsed.rDivider;
  const totalN =
    parsed.integerN + parsed.numerator / parsed.modulus;
  const vcoHz = totalN * pfdHz;
  const outputHz = vcoHz / parsed.outputDivider;
  const fractionalStepHz =
    pfdHz / (parsed.modulus * parsed.outputDivider);

  if (
    ![referenceHz, pfdHz, totalN, vcoHz, outputHz, fractionalStepHz].every(
      (value) => Number.isFinite(value) && value > 0,
    )
  ) {
    return {
      errors: {
        general:
          'The entered values produce a result outside the calculator range.',
      },
      results: null,
    };
  }

  return {
    errors,
    results: {
      pfdHz,
      totalN,
      vcoHz,
      outputHz,
      fractionalStepHz,
    },
  };
}

function NumberField({
  id,
  label,
  unit,
  value,
  onChange,
  error,
  integer = false,
  min,
}) {
  const errorId = `${id}-error`;

  return (
    <div style={{minWidth: 0}}>
      <label htmlFor={id}>
        {label}
        {unit ? ` (${unit})` : ''}
      </label>
      <input
        id={id}
        type="number"
        inputMode={integer ? 'numeric' : 'decimal'}
        step={integer ? '1' : 'any'}
        min={min}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        style={{
          ...inputStyle,
          borderColor: error
            ? 'var(--hw-accent-purple)'
            : 'var(--hw-border)',
        }}
      />
      {error && (
        <span
          id={errorId}
          role="alert"
          style={{
            display: 'block',
            marginTop: '0.25rem',
            color: 'var(--hw-accent-purple)',
            fontSize: '0.77rem',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function PllBlockDiagram({idPrefix}) {
  const titleId = `${idPrefix}-diagram-title`;
  const descriptionId = `${idPrefix}-diagram-description`;
  const arrowId = `${idPrefix}-diagram-arrow`;

  const boxStyle = {
    fill: 'var(--hw-surface-2)',
    stroke: 'var(--hw-border)',
    strokeWidth: 2,
  };

  return (
    <div>
      <div className="diagram-scroll-hint">
        Scroll horizontally to inspect the complete feedback path.
      </div>
      <div
        role="region"
        aria-label="Charge-pump PLL block diagram"
        tabIndex={0}
        style={{
          overflowX: 'auto',
          border: '1px solid var(--hw-border)',
          borderRadius: '10px',
          background: 'var(--hw-surface-0)',
        }}
      >
        <svg
          viewBox="0 0 640 560"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
          style={{
            display: 'block',
            width: '100%',
            minWidth: '520px',
            height: 'auto',
          }}
        >
          <title id={titleId}>Charge-pump phase-locked loop block diagram</title>
          <desc id={descriptionId}>
            The reference passes through an optional R divider, a
            phase-frequency detector, a charge pump, a loop filter, and a
            voltage-controlled oscillator. The oscillator output returns to
            the detector through the N feedback divider. An optional D divider
            makes the final output frequency.
          </desc>

          <defs>
            <marker
              id={arrowId}
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--ifm-color-primary)" />
            </marker>
          </defs>

          <text
            x="320"
            y="34"
            textAnchor="middle"
            fill="var(--hw-text-primary)"
            fontSize="21"
            fontWeight="750"
          >
            PLL signal and feedback paths
          </text>

          <g
            fill="none"
            stroke="var(--ifm-color-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={`url(#${arrowId})`}
          >
            <line x1="138" y1="130" x2="170" y2="130" />
            <line x1="290" y1="130" x2="320" y2="130" />
            <path d="M 380 172 V 290 H 8 V 371 H 20" />
            <line x1="145" y1="371" x2="165" y2="371" />
            <line x1="290" y1="371" x2="310" y2="371" />
            <line x1="430" y1="371" x2="455" y2="371" />
            <line x1="570" y1="371" x2="612" y2="371" />
            <path d="M 442 371 V 510 H 618 V 240 H 590" />
            <path d="M 460 240 H 450 V 154 H 440" />
          </g>

          <g>
            <rect x="20" y="89" width="118" height="82" rx="10" style={boxStyle} />
            <rect x="170" y="89" width="120" height="82" rx="10" style={boxStyle} />
            <rect x="320" y="78" width="120" height="94" rx="10" style={boxStyle} />
            <rect x="20" y="326" width="125" height="90" rx="10" style={boxStyle} />
            <rect x="165" y="326" width="125" height="90" rx="10" style={boxStyle} />
            <rect x="310" y="326" width="120" height="90" rx="10" style={boxStyle} />
            <rect x="455" y="326" width="115" height="90" rx="10" style={boxStyle} />
            <rect x="460" y="203" width="130" height="74" rx="10" style={boxStyle} />
          </g>

          <g
            fill="var(--hw-text-primary)"
            textAnchor="middle"
            fontWeight="750"
          >
            <text x="79" y="124" fontSize="15">REFERENCE</text>
            <text x="79" y="148" fontSize="13" fill="var(--hw-text-secondary)">
              fREF
            </text>

            <text x="230" y="116" fontSize="15">R DIVIDER</text>
            <text x="230" y="139" fontSize="13" fill="var(--ifm-color-primary)">
              Optional
            </text>
            <text x="230" y="158" fontSize="11" fill="var(--hw-text-secondary)">
              fPFD = fREF / R
            </text>

            <text x="380" y="116" fontSize="16">PFD</text>
            <text x="380" y="140" fontSize="11" fill="var(--hw-text-secondary)">
              Phase / frequency
            </text>
            <text x="380" y="157" fontSize="11" fill="var(--hw-text-secondary)">
              comparison
            </text>

            <text x="82.5" y="357" fontSize="13">CHARGE PUMP</text>
            <text x="82.5" y="382" fontSize="11" fill="var(--hw-accent-purple)">
              Produces current
            </text>
            <text x="82.5" y="400" fontSize="11" fill="var(--hw-accent-purple)">
              pulses
            </text>

            <text x="227.5" y="357" fontSize="13">LOOP FILTER</text>
            <text x="227.5" y="382" fontSize="11" fill="var(--hw-accent-teal)">
              Produces control
            </text>
            <text x="227.5" y="400" fontSize="11" fill="var(--hw-accent-teal)">
              voltage
            </text>

            <text x="370" y="357" fontSize="15">VCO</text>
            <text x="370" y="382" fontSize="11" fill="var(--hw-text-secondary)">
              Voltage-controlled
            </text>
            <text x="370" y="400" fontSize="11" fill="var(--hw-text-secondary)">
              oscillator
            </text>

            <text x="512.5" y="357" fontSize="14">D DIVIDER</text>
            <text x="512.5" y="382" fontSize="11" fill="var(--ifm-color-primary)">
              Optional output
            </text>

            <text x="525" y="234" fontSize="15">N DIVIDER</text>
            <text x="525" y="258" fontSize="12" fill="var(--hw-text-secondary)">
              Feedback
            </text>
          </g>

          <g fill="var(--ifm-color-primary)" fontSize="13" fontWeight="700">
            <text x="442" y="354" textAnchor="middle">fVCO</text>
            <text x="617" y="355" textAnchor="end">fOUT</text>
            <text x="515" y="535" textAnchor="middle">Feedback path</text>
            <text x="175" y="281" textAnchor="middle">PFD output continues below</text>
          </g>

          <g fill="var(--hw-text-secondary)" fontSize="12">
            <text x="305" y="69" textAnchor="middle">PFD reference input</text>
            <text x="449" y="146">Feedback input</text>
          </g>

          <circle cx="442" cy="371" r="5" fill="var(--ifm-color-primary)" />
        </svg>
      </div>
    </div>
  );
}

function buildNoiseModel(loopBandwidthHz) {
  const minimumOffsetHz = 10;
  const maximumOffsetHz = 1e8;
  const pointCount = 180;

  return Array.from({length: pointCount}, (_, index) => {
    const fraction = index / (pointCount - 1);
    const logFrequency =
      Math.log10(minimumOffsetHz) +
      fraction *
        (Math.log10(maximumOffsetHz) - Math.log10(minimumOffsetHz));
    const frequencyHz = 10 ** logFrequency;
    const ratio = frequencyHz / loopBandwidthHz;
    const denominator = Math.sqrt(1 + ratio * ratio);

    return {
      frequencyHz,
      referenceMagnitude: 1 / denominator,
      vcoMagnitude: ratio / denominator,
    };
  });
}

function NoiseShapingPlot({idPrefix, loopBandwidthHz}) {
  const width = 640;
  const height = 390;
  const margin = {left: 62, right: 22, top: 58, bottom: 66};
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const minimumLogFrequency = 1;
  const maximumLogFrequency = 8;
  const points = useMemo(
    () => buildNoiseModel(loopBandwidthHz),
    [loopBandwidthHz],
  );
  const titleId = `${idPrefix}-noise-title`;
  const descriptionId = `${idPrefix}-noise-description`;

  const xForFrequency = (frequencyHz) =>
    margin.left +
    ((Math.log10(frequencyHz) - minimumLogFrequency) /
      (maximumLogFrequency - minimumLogFrequency)) *
      plotWidth;
  const yForMagnitude = (magnitude) =>
    margin.top + (1 - magnitude) * plotHeight;
  const pathFor = (key) =>
    points
      .map(
        (point, index) =>
          `${index === 0 ? 'M' : 'L'} ${xForFrequency(
            point.frequencyHz,
          ).toFixed(2)} ${yForMagnitude(point[key]).toFixed(2)}`,
      )
      .join(' ');

  const frequencyTicks = [
    {frequencyHz: 10, label: '10 Hz'},
    {frequencyHz: 1e3, label: '1 kHz'},
    {frequencyHz: 1e5, label: '100 kHz'},
    {frequencyHz: 1e7, label: '10 MHz'},
    {frequencyHz: 1e8, label: '100 MHz'},
  ];
  const magnitudeTicks = [0, 0.25, 0.5, 0.75, 1];
  const bandwidthX = xForFrequency(loopBandwidthHz);

  return (
    <div>
      <div className="diagram-scroll-hint">
        Scroll horizontally to inspect the complete noise plot.
      </div>
      <div
        role="region"
        aria-label="Conceptual PLL noise-shaping plot"
        tabIndex={0}
        style={{
          overflowX: 'auto',
          border: '1px solid var(--hw-border)',
          borderRadius: '8px',
          background: 'var(--hw-surface-0)',
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
          style={{
            display: 'block',
            width: '100%',
            minWidth: '520px',
            height: 'auto',
          }}
        >
      <title id={titleId}>Conceptual PLL noise-shaping plot</title>
      <desc id={descriptionId}>
        A first-order teaching model shows reference and phase-frequency
        detector noise with a low-pass response and oscillator noise with a
        high-pass response. Both responses have a magnitude of approximately
        zero point seven zero seven at the selected loop bandwidth.
      </desc>

      <rect
        x={margin.left}
        y={margin.top}
        width={plotWidth}
        height={plotHeight}
        fill="var(--hw-surface-0)"
        stroke="var(--hw-border)"
      />

      {magnitudeTicks.map((tick) => {
        const y = yForMagnitude(tick);
        return (
          <g key={tick}>
            <line
              x1={margin.left}
              y1={y}
              x2={width - margin.right}
              y2={y}
              stroke="var(--hw-border-subtle)"
              strokeWidth="1"
            />
            <text
              x={margin.left - 10}
              y={y + 4}
              textAnchor="end"
              fill="var(--hw-text-secondary)"
              fontSize="12"
            >
              {tick.toFixed(2)}
            </text>
          </g>
        );
      })}

      {frequencyTicks.map(({frequencyHz, label}) => {
        const x = xForFrequency(frequencyHz);
        return (
          <g key={frequencyHz}>
            <line
              x1={x}
              y1={margin.top}
              x2={x}
              y2={height - margin.bottom}
              stroke="var(--hw-border-subtle)"
              strokeWidth="1"
            />
            <text
              x={x}
              y={height - margin.bottom + 22}
              textAnchor="middle"
              fill="var(--hw-text-secondary)"
              fontSize="12"
            >
              {label}
            </text>
          </g>
        );
      })}

      <line
        x1={bandwidthX}
        y1={margin.top}
        x2={bandwidthX}
        y2={height - margin.bottom}
        stroke="var(--ifm-color-primary)"
        strokeWidth="2"
        strokeDasharray="7 5"
      />

      <path
        d={pathFor('referenceMagnitude')}
        fill="none"
        stroke="var(--hw-accent-blue)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d={pathFor('vcoMagnitude')}
        fill="none"
        stroke="var(--hw-accent-purple)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle
        cx={bandwidthX}
        cy={yForMagnitude(Math.SQRT1_2)}
        r="5"
        fill="var(--ifm-color-primary)"
      />
      <text
        x={bandwidthX}
        y={margin.top - 13}
        textAnchor="middle"
        fill="var(--ifm-color-primary)"
        fontSize="12"
        fontWeight="750"
      >
        BW = {formatFrequency(loopBandwidthHz)}
      </text>

      <text
        x={margin.left + plotWidth / 2}
        y={height - 14}
        textAnchor="middle"
        fill="var(--hw-text-secondary)"
        fontSize="13"
      >
        Offset frequency (log scale)
      </text>
      <text
        x="18"
        y={margin.top + plotHeight / 2}
        textAnchor="middle"
        fill="var(--hw-text-secondary)"
        fontSize="13"
        transform={`rotate(-90 18 ${margin.top + plotHeight / 2})`}
      >
        Normalized transfer magnitude
      </text>

      <g fontSize="12" fontWeight="700">
        <line
          x1={margin.left + 10}
          y1="25"
          x2={margin.left + 42}
          y2="25"
          stroke="var(--hw-accent-blue)"
          strokeWidth="4"
        />
        <text
          x={margin.left + 50}
          y="29"
          fill="var(--hw-text-primary)"
        >
          Reference / PFD low-pass
        </text>

        <line
          x1={margin.left + 238}
          y1="25"
          x2={margin.left + 270}
          y2="25"
          stroke="var(--hw-accent-purple)"
          strokeWidth="4"
        />
        <text
          x={margin.left + 278}
          y="29"
          fill="var(--hw-text-primary)"
        >
          VCO high-pass
        </text>
      </g>
        </svg>
      </div>
    </div>
  );
}

function ResultCard({label, value, detail}) {
  return (
    <div
      style={{
        minWidth: 0,
        borderTop: '1px solid var(--hw-border-subtle)',
        paddingTop: '0.7rem',
      }}
    >
      <strong>{label}</strong>
      <p style={resultStyle}>{value}</p>
      {detail && (
        <p style={{...secondaryTextStyle, margin: '0.35rem 0 0'}}>
          {detail}
        </p>
      )}
    </div>
  );
}

export default function PllExplorer() {
  const generatedId = useId().replace(/:/g, '');
  const [referenceMHz, setReferenceMHz] = useState('10');
  const [rDivider, setRDivider] = useState('1');
  const [integerN, setIntegerN] = useState('50');
  const [numerator, setNumerator] = useState('0');
  const [modulus, setModulus] = useState('1000');
  const [outputDivider, setOutputDivider] = useState('1');
  const [loopBandwidthLog, setLoopBandwidthLog] = useState(5);

  const {errors, results} = validateFrequencyPlan({
    referenceMHz,
    rDivider,
    integerN,
    numerator,
    modulus,
    outputDivider,
  });
  const loopBandwidthHz = 10 ** loopBandwidthLog;

  const fields = [
    {
      key: 'referenceMHz',
      label: 'Reference frequency, fREF',
      unit: 'MHz',
      value: referenceMHz,
      onChange: setReferenceMHz,
      min: '0',
    },
    {
      key: 'rDivider',
      label: 'Reference divider, R',
      value: rDivider,
      onChange: setRDivider,
      integer: true,
      min: '1',
    },
    {
      key: 'integerN',
      label: 'Integer feedback value, NINT',
      value: integerN,
      onChange: setIntegerN,
      integer: true,
      min: '0',
    },
    {
      key: 'numerator',
      label: 'Fractional numerator, NUM',
      value: numerator,
      onChange: setNumerator,
      integer: true,
      min: '0',
    },
    {
      key: 'modulus',
      label: 'Fractional modulus, MOD',
      value: modulus,
      onChange: setModulus,
      integer: true,
      min: '1',
    },
    {
      key: 'outputDivider',
      label: 'Output divider, D',
      value: outputDivider,
      onChange: setOutputDivider,
      integer: true,
      min: '1',
    },
  ];

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">
        PLL signal-flow guide and frequency-plan calculator
      </div>
      <div className="interactive-block__body">
        <section
          className="tech-panel"
          aria-labelledby={`${generatedId}-diagram-heading`}
          style={{minWidth: 0}}
        >
          <span id={`${generatedId}-diagram-heading`} className="panel-header">
            Signal path and feedback path
          </span>
          <PllBlockDiagram idPrefix={generatedId} />
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <section
            className="tech-panel"
            aria-labelledby={`${generatedId}-plan-heading`}
            style={{minWidth: 0}}
          >
            <span id={`${generatedId}-plan-heading`} className="panel-header">
              Frequency plan
            </span>
            <p style={{...secondaryTextStyle, marginTop: 0}}>
              Use N = NINT + NUM / MOD. The output divider D is after the
              VCO. Enter NUM = 0 for integer-N operation.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
                gap: '0.8rem',
              }}
            >
              {fields.map((field) => (
                <NumberField
                  key={field.key}
                  id={`${generatedId}-${field.key}`}
                  label={field.label}
                  unit={field.unit}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors[field.key]}
                  integer={field.integer}
                  min={field.min}
                />
              ))}
            </div>

            {errors.general && (
              <p
                role="alert"
                style={{
                  margin: '0.8rem 0 0',
                  color: 'var(--hw-accent-purple)',
                  fontSize: '0.82rem',
                }}
              >
                {errors.general}
              </p>
            )}

            <div
              aria-live="polite"
              aria-atomic="true"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
                gap: '0.8rem',
                marginTop: '1rem',
              }}
            >
              <ResultCard
                label="PFD frequency"
                value={results ? formatFrequency(results.pfdHz) : 'Check inputs'}
                detail="fPFD = fREF / R"
              />
              <ResultCard
                label="Total feedback value"
                value={results ? trimFixed(results.totalN, 6) : 'Check inputs'}
                detail="N = NINT + NUM / MOD"
              />
              <ResultCard
                label="VCO frequency"
                value={results ? formatFrequency(results.vcoHz) : 'Check inputs'}
                detail="fVCO = N x fPFD"
              />
              <ResultCard
                label="Output frequency"
                value={
                  results ? formatFrequency(results.outputHz) : 'Check inputs'
                }
                detail="fOUT = fVCO / D"
              />
              <ResultCard
                label="Ideal fractional output step"
                value={
                  results
                    ? formatFrequency(results.fractionalStepHz)
                    : 'Check inputs'
                }
                detail="fPFD / (MOD x D)"
              />
            </div>
          </section>

          <section
            className="tech-panel"
            aria-labelledby={`${generatedId}-noise-heading`}
            style={{minWidth: 0}}
          >
            <span id={`${generatedId}-noise-heading`} className="panel-header">
              Conceptual noise shaping
            </span>
            <label htmlFor={`${generatedId}-bandwidth`}>
              Loop bandwidth:{' '}
              <strong style={{color: 'var(--ifm-color-primary)'}}>
                {formatFrequency(loopBandwidthHz)}
              </strong>
            </label>
            <input
              id={`${generatedId}-bandwidth`}
              type="range"
              min="2"
              max="7"
              step="0.05"
              value={loopBandwidthLog}
              onChange={(event) =>
                setLoopBandwidthLog(Number(event.target.value))
              }
              aria-valuetext={formatFrequency(loopBandwidthHz)}
              aria-describedby={`${generatedId}-bandwidth-help`}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.75rem',
                color: 'var(--hw-text-secondary)',
                fontSize: '0.72rem',
              }}
            >
              <span>100 Hz</span>
              <span>10 MHz</span>
            </div>
            <p
              id={`${generatedId}-bandwidth-help`}
              style={{...secondaryTextStyle, margin: '0.7rem 0'}}
            >
              This first-order teaching model uses Href = 1 / sqrt(1 +
              (f / BW)^2) and Hvco = (f / BW) / sqrt(1 + (f / BW)^2).
            </p>
            <NoiseShapingPlot
              idPrefix={generatedId}
              loopBandwidthHz={loopBandwidthHz}
            />
            <p
              style={{
                margin: '0.65rem 0 0',
                color: 'var(--hw-text-secondary)',
                fontSize: '0.8rem',
              }}
            >
              The two curves cross at 0.707 at the selected bandwidth.
              The actual response depends on the loop order, damping, device
              noise, and implementation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
