import React, {useId, useMemo, useState} from 'react';

const MAX_SCALE_VOLTAGE = 100;

const PRESETS = [
  {
    id: 'classic-ttl',
    name: 'Classic 5 V TTL',
    description: 'Driver 0.4 / 2.4 V · receiver 0.8 / 2.0 V',
    values: {
      scaleMaximum: 5,
      driverVol: 0.4,
      driverVoh: 2.4,
      receiverVil: 0.8,
      receiverVih: 2.0,
    },
  },
  {
    id: 'five-volt-cmos',
    name: '5 V CMOS example',
    description: 'Driver 0.1 / 4.9 V · receiver 1.5 / 3.5 V',
    values: {
      scaleMaximum: 5,
      driverVol: 0.1,
      driverVoh: 4.9,
      receiverVil: 1.5,
      receiverVih: 3.5,
    },
  },
  {
    id: 'ttl-to-cmos',
    name: 'TTL to normal-threshold 5 V CMOS (unsafe)',
    description: 'Driver 0.4 / 2.4 V · receiver 1.5 / 3.5 V',
    values: {
      scaleMaximum: 5,
      driverVol: 0.4,
      driverVoh: 2.4,
      receiverVil: 1.5,
      receiverVih: 3.5,
    },
  },
];

const FIELD_DEFINITIONS = [
  {
    key: 'scaleMaximum',
    label: 'VCC / scale maximum',
    shortLabel: 'VCC',
  },
  {
    key: 'driverVol',
    label: 'Driver VOL(max)',
    shortLabel: 'VOL(max)',
  },
  {
    key: 'driverVoh',
    label: 'Driver VOH(min)',
    shortLabel: 'VOH(min)',
  },
  {
    key: 'receiverVil',
    label: 'Receiver VIL(max)',
    shortLabel: 'VIL(max)',
  },
  {
    key: 'receiverVih',
    label: 'Receiver VIH(min)',
    shortLabel: 'VIH(min)',
  },
];

const initialValues = Object.fromEntries(
  Object.entries(PRESETS[0].values).map(([key, value]) => [key, String(value)]),
);

const inputStyle = {
  width: '100%',
  marginTop: '0.35rem',
  padding: '0.58rem 0.65rem',
  border: '1px solid var(--hw-border)',
  borderRadius: '7px',
  background: 'var(--hw-surface-0)',
  color: 'var(--hw-text-primary)',
  fontFamily: 'var(--ifm-font-family-monospace)',
  fontSize: '0.9rem',
};

const buttonStyle = {
  appearance: 'none',
  border: '1px solid var(--hw-border)',
  borderRadius: '8px',
  padding: '0.68rem 0.8rem',
  background: 'var(--hw-surface-2)',
  color: 'var(--hw-text-primary)',
  font: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
};

function formatVoltage(value) {
  const normalizedValue = Object.is(value, -0) ? 0 : value;

  if (
    normalizedValue !== 0 &&
    Math.abs(normalizedValue) < 0.001
  ) {
    return `${normalizedValue.toPrecision(3)} V`;
  }

  const maximumDecimals = Math.abs(normalizedValue) < 10 ? 3 : 2;
  const text = normalizedValue
    .toFixed(maximumDecimals)
    .replace(/\.?0+$/, '');
  return `${text} V`;
}

function parseAndValidate(rawValues) {
  const values = {};
  const errors = [];

  for (const field of FIELD_DEFINITIONS) {
    const rawValue = rawValues[field.key];
    const value =
      typeof rawValue === 'string' && rawValue.trim() === ''
        ? Number.NaN
        : Number(rawValue);

    if (!Number.isFinite(value)) {
      errors.push(`${field.label} must be a finite number.`);
    }

    values[field.key] = value;
  }

  if (errors.length > 0) {
    return {isValid: false, values, errors};
  }

  if (
    values.scaleMaximum <= 0 ||
    values.scaleMaximum > MAX_SCALE_VOLTAGE
  ) {
    errors.push(
      `VCC / scale maximum must be greater than 0 V and not more than ${MAX_SCALE_VOLTAGE} V.`,
    );
  }

  for (const field of FIELD_DEFINITIONS.slice(1)) {
    const value = values[field.key];
    if (value < 0 || value > values.scaleMaximum) {
      errors.push(
        `${field.label} must be from 0 V through the scale maximum.`,
      );
    }
  }

  if (values.driverVol >= values.driverVoh) {
    errors.push('Driver VOL(max) must be less than driver VOH(min).');
  }

  if (values.receiverVil >= values.receiverVih) {
    errors.push('Receiver VIL(max) must be less than receiver VIH(min).');
  }

  return {isValid: errors.length === 0, values, errors};
}

function SegmentLabel({x1, x2, y, children}) {
  if (x2 - x1 < 92) {
    return null;
  }

  return (
    <text
      x={(x1 + x2) / 2}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fill="var(--hw-text-primary)"
      fontSize="12"
      fontWeight="700"
    >
      {children}
    </text>
  );
}

function VoltageRangeGraphic({
  values,
  isCompatible,
  lowNoiseMargin,
  highNoiseMargin,
  idPrefix,
}) {
  const width = 760;
  const height = 360;
  const plotLeft = 104;
  const plotRight = 720;
  const plotWidth = plotRight - plotLeft;
  const driverTop = 70;
  const receiverTop = 218;
  const bandHeight = 38;
  const axisY = 320;
  const scaleX = (voltage) =>
    plotLeft + (voltage / values.scaleMaximum) * plotWidth;

  const driverVolX = scaleX(values.driverVol);
  const driverVohX = scaleX(values.driverVoh);
  const receiverVilX = scaleX(values.receiverVil);
  const receiverVihX = scaleX(values.receiverVih);
  const patternId = `${idPrefix}-unspecified-pattern`;
  const driverClipId = `${idPrefix}-driver-band-clip`;
  const receiverClipId = `${idPrefix}-receiver-band-clip`;

  const statusText = isCompatible
    ? `Both margins are zero or positive. The low noise margin is ${formatVoltage(
        lowNoiseMargin,
      )}, and the high noise margin is ${formatVoltage(highNoiseMargin)}.`
    : `At least one margin is negative. The low noise margin is ${formatVoltage(
        lowNoiseMargin,
      )}, and the high noise margin is ${formatVoltage(highNoiseMargin)}.`;

  return (
    <div>
      <div className="diagram-scroll-hint">
        Scroll horizontally to inspect the full voltage-range diagram.
      </div>
      <div
        tabIndex="0"
        role="region"
        aria-label="Scrollable voltage-level compatibility diagram"
        style={{
          overflowX: 'auto',
          border: '1px solid var(--hw-border)',
          borderRadius: '10px',
          background: 'var(--hw-surface-0)',
          outlineOffset: '4px',
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-labelledby={`${idPrefix}-range-title ${idPrefix}-range-description`}
          style={{
            display: 'block',
            width: '100%',
            minWidth: `${width}px`,
            height: 'auto',
          }}
        >
          <title id={`${idPrefix}-range-title`}>
            Driver and receiver logic-voltage ranges
          </title>
          <desc id={`${idPrefix}-range-description`}>
            The first row shows the output voltages that the driver guarantees.
            The second row shows the voltages that the receiver accepts.{' '}
            {statusText}
          </desc>

          <defs>
            <pattern
              id={patternId}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect
                width="10"
                height="10"
                fill="var(--hw-surface-2)"
              />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="10"
                stroke="var(--hw-border)"
                strokeWidth="4"
              />
            </pattern>
            <clipPath id={driverClipId}>
              <rect
                x={plotLeft}
                y={driverTop}
                width={plotWidth}
                height={bandHeight}
                rx="6"
              />
            </clipPath>
            <clipPath id={receiverClipId}>
              <rect
                x={plotLeft}
                y={receiverTop}
                width={plotWidth}
                height={bandHeight}
                rx="6"
              />
            </clipPath>
          </defs>

          <text
            x="28"
            y="36"
            fill="var(--hw-text-primary)"
            fontSize="18"
            fontWeight="800"
          >
            Driver output guarantee
          </text>
          <text
            x="28"
            y="56"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            Blue = guaranteed LOW · striped = not guaranteed · teal =
            guaranteed HIGH
          </text>

          <g clipPath={`url(#${driverClipId})`}>
            <rect
              x={plotLeft}
              y={driverTop}
              width={driverVolX - plotLeft}
              height={bandHeight}
              fill="var(--hw-accent-blue)"
              opacity="0.8"
            />
            <rect
              x={driverVolX}
              y={driverTop}
              width={driverVohX - driverVolX}
              height={bandHeight}
              fill={`url(#${patternId})`}
            />
            <rect
              x={driverVohX}
              y={driverTop}
              width={plotRight - driverVohX}
              height={bandHeight}
              fill="var(--hw-accent-teal)"
              opacity="0.82"
            />
          </g>
          <rect
            x={plotLeft}
            y={driverTop}
            width={plotWidth}
            height={bandHeight}
            rx="6"
            fill="none"
            stroke="var(--hw-border)"
            strokeWidth="1.5"
          />
          <SegmentLabel
            x1={driverVolX}
            x2={driverVohX}
            y={driverTop + bandHeight / 2}
          >
            NOT GUARANTEED
          </SegmentLabel>
          <SegmentLabel
            x1={driverVohX}
            x2={plotRight}
            y={driverTop + bandHeight / 2}
          >
            HIGH
          </SegmentLabel>

          <line
            x1={driverVolX}
            y1={driverTop - 7}
            x2={driverVolX}
            y2={driverTop + bandHeight + 7}
            stroke="var(--ifm-color-primary)"
            strokeWidth="2"
          />
          <line
            x1={driverVohX}
            y1={driverTop - 7}
            x2={driverVohX}
            y2={driverTop + bandHeight + 7}
            stroke="var(--hw-accent-purple)"
            strokeWidth="2"
          />
          <text
            x={plotLeft}
            y="134"
            fill="var(--ifm-color-primary)"
            fontSize="13"
            fontWeight="700"
          >
            VOL(max) = {formatVoltage(values.driverVol)}
          </text>
          <text
            x={plotRight}
            y="134"
            textAnchor="end"
            fill="var(--hw-accent-purple)"
            fontSize="13"
            fontWeight="700"
          >
            VOH(min) = {formatVoltage(values.driverVoh)}
          </text>

          <text
            x="28"
            y="184"
            fill="var(--hw-text-primary)"
            fontSize="18"
            fontWeight="800"
          >
            Receiver input interpretation
          </text>
          <text
            x="28"
            y="204"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            Blue = accepted LOW · striped = undefined · teal = accepted HIGH
          </text>

          <g clipPath={`url(#${receiverClipId})`}>
            <rect
              x={plotLeft}
              y={receiverTop}
              width={receiverVilX - plotLeft}
              height={bandHeight}
              fill="var(--hw-accent-blue)"
              opacity="0.8"
            />
            <rect
              x={receiverVilX}
              y={receiverTop}
              width={receiverVihX - receiverVilX}
              height={bandHeight}
              fill={`url(#${patternId})`}
            />
            <rect
              x={receiverVihX}
              y={receiverTop}
              width={plotRight - receiverVihX}
              height={bandHeight}
              fill="var(--hw-accent-teal)"
              opacity="0.82"
            />
          </g>
          <rect
            x={plotLeft}
            y={receiverTop}
            width={plotWidth}
            height={bandHeight}
            rx="6"
            fill="none"
            stroke="var(--hw-border)"
            strokeWidth="1.5"
          />
          <SegmentLabel
            x1={plotLeft}
            x2={receiverVilX}
            y={receiverTop + bandHeight / 2}
          >
            LOW
          </SegmentLabel>
          <SegmentLabel
            x1={receiverVilX}
            x2={receiverVihX}
            y={receiverTop + bandHeight / 2}
          >
            UNDEFINED
          </SegmentLabel>
          <SegmentLabel
            x1={receiverVihX}
            x2={plotRight}
            y={receiverTop + bandHeight / 2}
          >
            HIGH
          </SegmentLabel>

          <line
            x1={receiverVilX}
            y1={receiverTop - 7}
            x2={receiverVilX}
            y2={receiverTop + bandHeight + 7}
            stroke="var(--ifm-color-primary)"
            strokeWidth="2"
          />
          <line
            x1={receiverVihX}
            y1={receiverTop - 7}
            x2={receiverVihX}
            y2={receiverTop + bandHeight + 7}
            stroke="var(--hw-accent-purple)"
            strokeWidth="2"
          />
          <text
            x={plotLeft}
            y="282"
            fill="var(--ifm-color-primary)"
            fontSize="13"
            fontWeight="700"
          >
            VIL(max) = {formatVoltage(values.receiverVil)}
          </text>
          <text
            x={plotRight}
            y="282"
            textAnchor="end"
            fill="var(--hw-accent-purple)"
            fontSize="13"
            fontWeight="700"
          >
            VIH(min) = {formatVoltage(values.receiverVih)}
          </text>

          <line
            x1={plotLeft}
            y1={axisY}
            x2={plotRight}
            y2={axisY}
            stroke="var(--hw-text-secondary)"
            strokeWidth="1.5"
          />
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const x = plotLeft + fraction * plotWidth;
            const voltage = fraction * values.scaleMaximum;
            return (
              <g key={fraction}>
                <line
                  x1={x}
                  y1={axisY - 5}
                  x2={x}
                  y2={axisY + 5}
                  stroke="var(--hw-text-secondary)"
                />
                <text
                  x={x}
                  y={axisY + 21}
                  textAnchor="middle"
                  fill="var(--hw-text-secondary)"
                  fontSize="11"
                >
                  {formatVoltage(voltage)}
                </text>
              </g>
            );
          })}
          <text
            x={(plotLeft + plotRight) / 2}
            y="354"
            textAnchor="middle"
            fill="var(--hw-text-primary)"
            fontSize="12"
            fontWeight="700"
          >
            Signal voltage
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function LogicLevelExplorer() {
  const generatedId = useId().replace(/:/g, '');
  const [rawValues, setRawValues] = useState(initialValues);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].id);
  const validation = useMemo(
    () => parseAndValidate(rawValues),
    [rawValues],
  );

  const results = useMemo(() => {
    if (!validation.isValid) {
      return null;
    }

    const {driverVol, driverVoh, receiverVil, receiverVih} =
      validation.values;
    const lowNoiseMargin = receiverVil - driverVol;
    const highNoiseMargin = driverVoh - receiverVih;

    return {
      lowNoiseMargin,
      highNoiseMargin,
      isCompatible: lowNoiseMargin >= 0 && highNoiseMargin >= 0,
    };
  }, [validation]);

  const applyPreset = (preset) => {
    setRawValues(
      Object.fromEntries(
        Object.entries(preset.values).map(([key, value]) => [
          key,
          String(value),
        ]),
      ),
    );
    setSelectedPreset(preset.id);
  };

  const updateValue = (key, value) => {
    setRawValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
    setSelectedPreset(null);
  };

  const compatibleColor = 'var(--hw-accent-teal)';
  const incompatibleColor = 'var(--ifm-color-danger, #ef4444)';
  const statusColor = results?.isCompatible
    ? compatibleColor
    : incompatibleColor;

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">
        Logic-level compatibility explorer
      </div>
      <div className="interactive-block__body">
        <p style={{marginTop: 0}}>
          Select an example or enter guaranteed data-sheet limits. The explorer
          compares the worst-case LOW and HIGH voltage levels.
        </p>

        <div
          role="group"
          aria-labelledby={`${generatedId}-presets-heading`}
          style={{marginBottom: '1.25rem'}}
        >
          <span
            id={`${generatedId}-presets-heading`}
            className="panel-header"
          >
            Teaching presets
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '0.65rem',
            }}
          >
            {PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => applyPreset(preset)}
                  style={{
                    ...buttonStyle,
                    borderColor: isSelected
                      ? 'var(--ifm-color-primary)'
                      : 'var(--hw-border)',
                    boxShadow: isSelected
                      ? 'inset 0 0 0 1px var(--ifm-color-primary)'
                      : 'none',
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      color: isSelected
                        ? 'var(--ifm-color-primary)'
                        : 'var(--hw-text-primary)',
                    }}
                  >
                    {preset.name}
                  </strong>
                  <span
                    style={{
                      display: 'block',
                      marginTop: '0.25rem',
                      color: 'var(--hw-text-secondary)',
                      fontSize: '0.76rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          role="group"
          aria-labelledby={`${generatedId}-limits-heading`}
          style={{marginBottom: '1.25rem'}}
        >
          <span id={`${generatedId}-limits-heading`} className="panel-header">
            Guaranteed voltage limits
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {FIELD_DEFINITIONS.map((field) => {
              const fieldErrors = validation.errors.filter((error) =>
                error
                  .toLowerCase()
                  .includes(field.label.toLowerCase()),
              );
              const errorId = `${generatedId}-${field.key}-error`;

              return (
                <label
                  key={field.key}
                  htmlFor={`${generatedId}-${field.key}`}
                  style={{
                    color: 'var(--hw-text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 650,
                  }}
                >
                  {field.label}
                  <input
                    id={`${generatedId}-${field.key}`}
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max={
                      field.key === 'scaleMaximum'
                        ? MAX_SCALE_VOLTAGE
                        : rawValues.scaleMaximum
                    }
                    step="0.01"
                    value={rawValues[field.key]}
                    aria-invalid={fieldErrors.length > 0 || undefined}
                    aria-describedby={
                      fieldErrors.length > 0 ? errorId : undefined
                    }
                    onChange={(event) =>
                      updateValue(field.key, event.target.value)
                    }
                    style={inputStyle}
                  />
                  {fieldErrors.length > 0 && (
                    <span id={errorId} className="sr-only">
                      {fieldErrors.join(' ')}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {!validation.isValid ? (
          <div
            className="tech-panel"
            role="alert"
            style={{
              margin: '1.25rem 0',
              borderColor: incompatibleColor,
            }}
          >
            <span className="panel-header">Check the voltage limits</span>
            <ul style={{marginBottom: 0}}>
              {validation.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(165px, 1fr))',
                gap: '0.75rem',
                margin: '1.25rem 0',
              }}
            >
              <div className="tech-panel">
                <span className="panel-header">LOW noise margin</span>
                <p
                  style={{
                    margin: '0 0 0.45rem',
                    color:
                      results.lowNoiseMargin >= 0
                        ? compatibleColor
                        : incompatibleColor,
                    fontSize: '1.35rem',
                    fontWeight: 800,
                  }}
                >
                  NML = {formatVoltage(results.lowNoiseMargin)}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--hw-text-secondary)',
                    fontSize: '0.82rem',
                  }}
                >
                  VIL(max) − VOL(max)
                </p>
              </div>

              <div className="tech-panel">
                <span className="panel-header">HIGH noise margin</span>
                <p
                  style={{
                    margin: '0 0 0.45rem',
                    color:
                      results.highNoiseMargin >= 0
                        ? compatibleColor
                        : incompatibleColor,
                    fontSize: '1.35rem',
                    fontWeight: 800,
                  }}
                >
                  NMH = {formatVoltage(results.highNoiseMargin)}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--hw-text-secondary)',
                    fontSize: '0.82rem',
                  }}
                >
                  VOH(min) − VIH(min)
                </p>
              </div>

              <div
                className="tech-panel"
                aria-live="polite"
                aria-atomic="true"
                style={{borderColor: statusColor}}
              >
                <span className="panel-header">Voltage result</span>
                <p
                  style={{
                    margin: '0 0 0.45rem',
                    color: statusColor,
                    fontSize: '1.35rem',
                    fontWeight: 800,
                  }}
                >
                  {results.isCompatible ? 'COMPATIBLE' : 'INCOMPATIBLE'}
                </p>
                <p style={{margin: 0, fontSize: '0.82rem'}}>
                  {results.isCompatible
                    ? 'Both specified noise margins are zero or positive.'
                    : 'One or both specified noise margins are negative.'}
                </p>
              </div>
            </div>

            <VoltageRangeGraphic
              values={validation.values}
              isCompatible={results.isCompatible}
              lowNoiseMargin={results.lowNoiseMargin}
              highNoiseMargin={results.highNoiseMargin}
              idPrefix={generatedId}
            />
          </>
        )}

        <p
          style={{
            margin: '1rem 0 0',
            color: 'var(--hw-text-secondary)',
            fontSize: '0.82rem',
          }}
        >
          The presets are illustrative. Voltage margins alone do not check
          output current, input current, component tolerance, edge rate, or
          power sequencing. Use the guaranteed limits and operating conditions
          in the applicable data sheets.
        </p>
      </div>
    </div>
  );
}
