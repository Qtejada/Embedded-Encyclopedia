import React, {useReducer} from 'react';

const INPUT_MIN = -5;
const INPUT_MAX = 5;
const OUTPUT_HIGH = 5;
const OUTPUT_LOW = 0;

const initialState = {
  inputVoltage: -1.5,
  centerThreshold: 0,
  hysteresisWidth: 2,
  outputHigh: false,
};

function getThresholds(centerThreshold, hysteresisWidth) {
  return {
    lowerThreshold: centerThreshold - hysteresisWidth / 2,
    upperThreshold: centerThreshold + hysteresisWidth / 2,
  };
}

function resolveOutput(
  inputVoltage,
  centerThreshold,
  hysteresisWidth,
  previousOutput,
) {
  const {lowerThreshold, upperThreshold} = getThresholds(
    centerThreshold,
    hysteresisWidth,
  );

  if (inputVoltage >= upperThreshold) {
    return true;
  }

  if (inputVoltage <= lowerThreshold) {
    return false;
  }

  return previousOutput;
}

function explorerReducer(state, action) {
  switch (action.type) {
    case 'set-input': {
      const inputVoltage = action.value;
      return {
        ...state,
        inputVoltage,
        outputHigh: resolveOutput(
          inputVoltage,
          state.centerThreshold,
          state.hysteresisWidth,
          state.outputHigh,
        ),
      };
    }

    case 'set-center': {
      const centerThreshold = action.value;
      return {
        ...state,
        centerThreshold,
        outputHigh: resolveOutput(
          state.inputVoltage,
          centerThreshold,
          state.hysteresisWidth,
          state.outputHigh,
        ),
      };
    }

    case 'set-width': {
      const hysteresisWidth = action.value;
      return {
        ...state,
        hysteresisWidth,
        outputHigh: resolveOutput(
          state.inputVoltage,
          state.centerThreshold,
          hysteresisWidth,
          state.outputHigh,
        ),
      };
    }

    case 'set-retained-output': {
      const {lowerThreshold, upperThreshold} = getThresholds(
        state.centerThreshold,
        state.hysteresisWidth,
      );
      const isInsideBand =
        state.inputVoltage > lowerThreshold &&
        state.inputVoltage < upperThreshold;

      return isInsideBand
        ? {...state, outputHigh: action.outputHigh}
        : state;
    }

    case 'reset':
      return initialState;

    default:
      return state;
  }
}

function formatVoltage(value) {
  const normalizedValue = Math.abs(value) < 0.005 ? 0 : value;
  return `${normalizedValue.toFixed(2)} V`;
}

function formatSignedVoltage(value) {
  const normalizedValue = Math.abs(value) < 0.005 ? 0 : value;
  const sign = normalizedValue > 0 ? '+' : '';
  return `${sign}${normalizedValue.toFixed(2)} V`;
}

const sliderRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '0.75rem',
  alignItems: 'center',
};

const valueStyle = {
  color: 'var(--ifm-color-primary)',
  fontFamily: 'var(--ifm-font-family-monospace)',
};

const buttonBaseStyle = {
  appearance: 'none',
  border: '1px solid var(--hw-border)',
  borderRadius: '7px',
  padding: '0.55rem 0.8rem',
  background: 'var(--hw-surface-2)',
  color: 'var(--hw-text-primary)',
  font: 'inherit',
  fontSize: '0.82rem',
  fontWeight: 650,
  cursor: 'pointer',
};

function TransferPlot({
  inputVoltage,
  lowerThreshold,
  upperThreshold,
  centerThreshold,
  outputHigh,
}) {
  const width = 720;
  const height = 360;
  const plotLeft = 76;
  const plotRight = 686;
  const plotTop = 42;
  const axisY = 286;
  const highY = 88;
  const lowY = 232;
  const outputColor = outputHigh
    ? 'var(--hw-accent-teal)'
    : 'var(--hw-accent-purple)';

  const mapInputToX = (value) =>
    plotLeft +
    ((value - INPUT_MIN) / (INPUT_MAX - INPUT_MIN)) *
      (plotRight - plotLeft);

  const lowerX = mapInputToX(lowerThreshold);
  const upperX = mapInputToX(upperThreshold);
  const centerX = mapInputToX(centerThreshold);
  const inputX = mapInputToX(inputVoltage);
  const inputLabelAnchor =
    inputX < plotLeft + 55
      ? 'start'
      : inputX > plotRight - 55
        ? 'end'
        : 'middle';

  return (
    <div>
      <div className="diagram-scroll-hint">Scroll horizontally to inspect the plot.</div>
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
          aria-labelledby="comparator-transfer-title comparator-transfer-description"
          style={{
            display: 'block',
            width: '100%',
            minWidth: '620px',
            height: 'auto',
          }}
        >
          <title id="comparator-transfer-title">
            Comparator transfer plot with hysteresis
          </title>
          <desc id="comparator-transfer-description">
            The output switches high at the upper threshold while the input
            increases. It switches low at the lower threshold while the input
            decreases. The highlighted point shows the current input and output.
          </desc>

          <defs>
            <marker
              id="comparator-arrow-increasing"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--hw-accent-blue)" />
            </marker>
            <marker
              id="comparator-arrow-decreasing"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--hw-accent-purple)" />
            </marker>
            <filter id="comparator-current-point-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            x={lowerX}
            y={plotTop}
            width={upperX - lowerX}
            height={axisY - plotTop}
            fill="rgba(212, 160, 23, 0.07)"
          />
          <text
            x={(lowerX + upperX) / 2}
            y={plotTop + 17}
            textAnchor="middle"
            fill="var(--ifm-color-primary)"
            fontSize="12"
            fontWeight="700"
          >
            RETAINED-STATE BAND
          </text>

          {[highY, lowY].map((yPosition) => (
            <line
              key={yPosition}
              x1={plotLeft}
              y1={yPosition}
              x2={plotRight}
              y2={yPosition}
              stroke="var(--hw-border)"
              strokeDasharray="4 6"
            />
          ))}

          <line
            x1={plotLeft}
            y1={plotTop - 8}
            x2={plotLeft}
            y2={axisY}
            stroke="var(--hw-text-secondary)"
            strokeWidth="1.5"
          />
          <line
            x1={plotLeft}
            y1={axisY}
            x2={plotRight + 10}
            y2={axisY}
            stroke="var(--hw-text-secondary)"
            strokeWidth="1.5"
          />
          <path
            d={`M ${plotRight + 10} ${axisY} l -9 -5 l 0 10 z`}
            fill="var(--hw-text-secondary)"
          />
          <path
            d={`M ${plotLeft} ${plotTop - 8} l -5 9 l 10 0 z`}
            fill="var(--hw-text-secondary)"
          />

          <line
            x1={lowerX}
            y1={plotTop}
            x2={lowerX}
            y2={axisY}
            stroke="var(--hw-accent-purple)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            opacity="0.8"
          />
          <line
            x1={upperX}
            y1={plotTop}
            x2={upperX}
            y2={axisY}
            stroke="var(--hw-accent-blue)"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            opacity="0.8"
          />
          <line
            x1={centerX}
            y1={plotTop + 24}
            x2={centerX}
            y2={axisY}
            stroke="var(--ifm-color-primary)"
            strokeWidth="1"
            strokeDasharray="2 7"
            opacity="0.55"
          />

          <g
            fill="none"
            stroke="var(--ifm-color-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1={plotLeft} y1={lowY} x2={upperX} y2={lowY} />
            <line x1={upperX} y1={lowY} x2={upperX} y2={highY} />
            <line x1={lowerX} y1={highY} x2={plotRight} y2={highY} />
            <line x1={lowerX} y1={highY} x2={lowerX} y2={lowY} />
          </g>

          <g
            fill="none"
            stroke="var(--hw-accent-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
            markerEnd="url(#comparator-arrow-increasing)"
          >
            <line
              x1={plotLeft + (upperX - plotLeft) * 0.46}
              y1={lowY}
              x2={plotLeft + (upperX - plotLeft) * 0.72}
              y2={lowY}
            />
            <line
              x1={upperX}
              y1={lowY - 22}
              x2={upperX}
              y2={highY + 22}
            />
            <line
              x1={upperX + (plotRight - upperX) * 0.18}
              y1={highY}
              x2={upperX + (plotRight - upperX) * 0.46}
              y2={highY}
            />
          </g>

          <g
            fill="none"
            stroke="var(--hw-accent-purple)"
            strokeWidth="2.5"
            strokeLinecap="round"
            markerEnd="url(#comparator-arrow-decreasing)"
          >
            <line
              x1={plotRight - (plotRight - lowerX) * 0.18}
              y1={highY}
              x2={plotRight - (plotRight - lowerX) * 0.46}
              y2={highY}
            />
            <line
              x1={lowerX}
              y1={highY + 22}
              x2={lowerX}
              y2={lowY - 22}
            />
            <line
              x1={lowerX - (lowerX - plotLeft) * 0.18}
              y1={lowY}
              x2={lowerX - (lowerX - plotLeft) * 0.46}
              y2={lowY}
            />
          </g>

          <line
            x1={inputX}
            y1={plotTop - 2}
            x2={inputX}
            y2={axisY}
            stroke={outputColor}
            strokeWidth="1.5"
            strokeDasharray="3 5"
            opacity="0.85"
            style={{transition: 'all 120ms ease-out'}}
          />
          <circle
            cx={inputX}
            cy={outputHigh ? highY : lowY}
            r="13"
            fill={outputColor}
            opacity="0.2"
            filter="url(#comparator-current-point-glow)"
            style={{transition: 'all 120ms ease-out'}}
          />
          <circle
            cx={inputX}
            cy={outputHigh ? highY : lowY}
            r="6.5"
            fill={outputColor}
            stroke="var(--hw-text-primary)"
            strokeWidth="2"
            style={{transition: 'all 120ms ease-out'}}
          />
          <text
            x={inputX}
            y={20}
            textAnchor={inputLabelAnchor}
            fill={outputColor}
            fontSize="13"
            fontWeight="700"
            style={{transition: 'all 120ms ease-out'}}
          >
            Vin {formatSignedVoltage(inputVoltage)}
          </text>

          <text
            x={plotLeft - 14}
            y={highY + 5}
            textAnchor="end"
            fill="var(--hw-accent-teal)"
            fontSize="13"
            fontWeight="700"
          >
            HIGH
          </text>
          <text
            x={plotLeft - 14}
            y={lowY + 5}
            textAnchor="end"
            fill="var(--hw-accent-purple)"
            fontSize="13"
            fontWeight="700"
          >
            LOW
          </text>
          <text
            x={plotLeft - 50}
            y={plotTop + 42}
            transform={`rotate(-90 ${plotLeft - 50} ${plotTop + 42})`}
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            OUTPUT STATE
          </text>
          <text
            x={plotRight + 4}
            y={axisY + 25}
            textAnchor="end"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            INPUT VOLTAGE
          </text>

          <text
            x={lowerX - 7}
            y={axisY + 25}
            textAnchor="end"
            fill="var(--hw-accent-purple)"
            fontSize="12"
            fontWeight="700"
          >
            VTL {formatSignedVoltage(lowerThreshold)}
          </text>
          <text
            x={upperX + 7}
            y={axisY + 25}
            textAnchor="start"
            fill="var(--hw-accent-blue)"
            fontSize="12"
            fontWeight="700"
          >
            VTH {formatSignedVoltage(upperThreshold)}
          </text>
          <text
            x={centerX}
            y={axisY + 51}
            textAnchor="middle"
            fill="var(--ifm-color-primary)"
            fontSize="11"
          >
            CENTER {formatSignedVoltage(centerThreshold)}
          </text>
        </svg>
      </div>

      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.65rem 1.2rem',
          marginTop: '0.75rem',
          color: 'var(--hw-text-secondary)',
          fontSize: '0.78rem',
        }}
      >
        <span>
          <span style={{color: 'var(--hw-accent-blue)'}}>●</span>{' '}
          Increasing input
        </span>
        <span>
          <span style={{color: 'var(--hw-accent-purple)'}}>●</span>{' '}
          Decreasing input
        </span>
        <span>
          <span style={{color: outputColor}}>●</span> Current operating point
        </span>
      </div>
    </div>
  );
}

export default function ComparatorHysteresisExplorer() {
  const [state, dispatch] = useReducer(explorerReducer, initialState);
  const {
    inputVoltage,
    centerThreshold,
    hysteresisWidth,
    outputHigh,
  } = state;
  const {lowerThreshold, upperThreshold} = getThresholds(
    centerThreshold,
    hysteresisWidth,
  );
  const isInsideBand =
    inputVoltage > lowerThreshold && inputVoltage < upperThreshold;
  const outputVoltage = outputHigh ? OUTPUT_HIGH : OUTPUT_LOW;
  const outputColor = outputHigh
    ? 'var(--hw-accent-teal)'
    : 'var(--hw-accent-purple)';

  let stateReason;
  if (inputVoltage >= upperThreshold) {
    stateReason = 'The input is at or above the upper threshold.';
  } else if (inputVoltage <= lowerThreshold) {
    stateReason = 'The input is at or below the lower threshold.';
  } else {
    stateReason = 'The input is between the thresholds, so the prior output is retained.';
  }

  const controls = [
    {
      id: 'comparator-input-voltage',
      label: 'Input voltage',
      valueText: formatSignedVoltage(inputVoltage),
      min: INPUT_MIN,
      max: INPUT_MAX,
      step: 0.05,
      value: inputVoltage,
      actionType: 'set-input',
    },
    {
      id: 'comparator-center-threshold',
      label: 'Center threshold',
      valueText: formatSignedVoltage(centerThreshold),
      min: -2,
      max: 2,
      step: 0.05,
      value: centerThreshold,
      actionType: 'set-center',
    },
    {
      id: 'comparator-hysteresis-width',
      label: 'Hysteresis width',
      valueText: formatVoltage(hysteresisWidth),
      min: 0.5,
      max: 4,
      step: 0.1,
      value: hysteresisWidth,
      actionType: 'set-width',
    },
  ];

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">
        Comparator hysteresis explorer
      </div>
      <div className="interactive-block__body">
        <div style={{display: 'grid', gap: '1rem'}}>
          {controls.map((control) => (
            <div key={control.id} style={sliderRowStyle}>
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
                onChange={(event) =>
                  dispatch({
                    type: control.actionType,
                    value: Number(event.target.value),
                  })
                }
              />
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.55rem',
            marginTop: '1.15rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--hw-border-subtle)',
          }}
        >
          <span
            style={{
              marginRight: '0.25rem',
              color: 'var(--hw-text-secondary)',
              fontSize: '0.82rem',
            }}
          >
            State inside the hysteresis band:
          </span>
          <button
            type="button"
            disabled={!isInsideBand}
            aria-pressed={isInsideBand && !outputHigh}
            title={
              isInsideBand
                ? 'Model an input that entered the band from below.'
                : 'Move the input between the thresholds to set a retained state.'
            }
            onClick={() =>
              dispatch({type: 'set-retained-output', outputHigh: false})
            }
            style={{
              ...buttonBaseStyle,
              borderColor:
                isInsideBand && !outputHigh
                  ? 'var(--hw-accent-purple)'
                  : 'var(--hw-border)',
              opacity: isInsideBand ? 1 : 0.45,
              cursor: isInsideBand ? 'pointer' : 'not-allowed',
            }}
          >
            Assume prior LOW
          </button>
          <button
            type="button"
            disabled={!isInsideBand}
            aria-pressed={isInsideBand && outputHigh}
            title={
              isInsideBand
                ? 'Model an input that entered the band from above.'
                : 'Move the input between the thresholds to set a retained state.'
            }
            onClick={() =>
              dispatch({type: 'set-retained-output', outputHigh: true})
            }
            style={{
              ...buttonBaseStyle,
              borderColor:
                isInsideBand && outputHigh
                  ? 'var(--hw-accent-teal)'
                  : 'var(--hw-border)',
              opacity: isInsideBand ? 1 : 0.45,
              cursor: isInsideBand ? 'pointer' : 'not-allowed',
            }}
          >
            Assume prior HIGH
          </button>
          <button
            type="button"
            onClick={() => dispatch({type: 'reset'})}
            style={{...buttonBaseStyle, marginLeft: 'auto'}}
          >
            Reset example
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
            gap: '0.75rem',
            margin: '1.5rem 0',
          }}
        >
          <div className="tech-panel">
            <span className="panel-header">Threshold window</span>
            <p>
              <strong>Upper threshold (VTH):</strong>
              <br />
              <span style={{color: 'var(--hw-accent-blue)'}}>
                {formatSignedVoltage(upperThreshold)}
              </span>
            </p>
            <p style={{marginBottom: 0}}>
              <strong>Lower threshold (VTL):</strong>
              <br />
              <span style={{color: 'var(--hw-accent-purple)'}}>
                {formatSignedVoltage(lowerThreshold)}
              </span>
            </p>
          </div>

          <div
            className="tech-panel"
            aria-live="polite"
            style={{borderColor: outputColor}}
          >
            <span className="panel-header">Current output</span>
            <p
              style={{
                margin: '0 0 0.5rem',
                color: outputColor,
                fontSize: '1.35rem',
                fontWeight: 800,
              }}
            >
              {outputHigh ? 'HIGH' : 'LOW'} — {formatVoltage(outputVoltage)}
            </p>
            <p style={{marginBottom: 0, fontSize: '0.85rem'}}>
              {stateReason}
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Next state change</span>
            <p style={{marginBottom: 0}}>
              {outputHigh ? (
                <>
                  The output changes to <strong>LOW</strong> when the input falls
                  to <strong>{formatSignedVoltage(lowerThreshold)}</strong>.
                </>
              ) : (
                <>
                  The output changes to <strong>HIGH</strong> when the input rises
                  to <strong>{formatSignedVoltage(upperThreshold)}</strong>.
                </>
              )}
            </p>
          </div>
        </div>

        <TransferPlot
          inputVoltage={inputVoltage}
          lowerThreshold={lowerThreshold}
          upperThreshold={upperThreshold}
          centerThreshold={centerThreshold}
          outputHigh={outputHigh}
        />

        <p
          style={{
            margin: '1rem 0 0',
            color: 'var(--hw-text-secondary)',
            fontSize: '0.84rem',
          }}
        >
          Move the input above and below both thresholds. Then stop inside the
          shaded band. The output keeps the state that it had when the input
          entered the band. The 0 V and 5 V output levels are illustrative.
        </p>
      </div>
    </div>
  );
}
