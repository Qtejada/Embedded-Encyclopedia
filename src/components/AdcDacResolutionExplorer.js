import React, {useState} from 'react';

const MIN_BITS = 3;
const MAX_BITS = 16;
const MIN_SPAN = 1;
const MAX_SPAN = 10;
const VISIBLE_CODE_COUNT = 7;

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

  return `${trimFixed(value, 6)} V`;
}

function formatSignedVoltage(value) {
  if (Math.abs(value) < Number.EPSILON) {
    return '0 V';
  }

  return `${value > 0 ? '+' : '-'}${formatVoltage(Math.abs(value))}`;
}

function formatBinary(code, bitDepth) {
  return code.toString(2).padStart(bitDepth, '0');
}

function getVisibleCodeRange(selectedCode, numberOfCodes) {
  const visibleCount = Math.min(VISIBLE_CODE_COUNT, numberOfCodes);
  const maximumStart = numberOfCodes - visibleCount;
  const centeredStart = selectedCode - Math.floor(visibleCount / 2);
  const startCode = Math.max(0, Math.min(centeredStart, maximumStart));

  return {
    startCode,
    endCode: startCode + visibleCount - 1,
  };
}

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

function QuantizationTransferPlot({
  analogInput,
  bitDepth,
  numberOfCodes,
  lsbSize,
  selectedCode,
  quantizedVoltage,
  fullScaleSpan,
}) {
  const width = 780;
  const height = 410;
  const plotLeft = 92;
  const plotRight = 746;
  const plotTop = 48;
  const plotBottom = 322;
  const {startCode, endCode} = getVisibleCodeRange(
    selectedCode,
    numberOfCodes,
  );

  const visibleInputMinimum = Math.max(0, (startCode - 0.5) * lsbSize);
  const visibleInputMaximum =
    endCode === numberOfCodes - 1
      ? fullScaleSpan
      : Math.min(fullScaleSpan, (endCode + 0.5) * lsbSize);
  const visibleOutputMinimum = Math.max(0, (startCode - 0.75) * lsbSize);
  const visibleOutputMaximum = Math.min(
    fullScaleSpan,
    (endCode + 0.75) * lsbSize,
  );
  const inputRange = Math.max(
    visibleInputMaximum - visibleInputMinimum,
    lsbSize,
  );
  const outputRange = Math.max(
    visibleOutputMaximum - visibleOutputMinimum,
    lsbSize,
  );

  const mapInputToX = (voltage) =>
    plotLeft +
    ((voltage - visibleInputMinimum) / inputRange) *
      (plotRight - plotLeft);
  const mapOutputToY = (voltage) =>
    plotBottom -
    ((voltage - visibleOutputMinimum) / outputRange) *
      (plotBottom - plotTop);

  const visibleCodes = Array.from(
    {length: endCode - startCode + 1},
    (_, index) => startCode + index,
  );
  const staircaseSegments = visibleCodes.map((code) => {
    const levelVoltage = code * lsbSize;
    const lowerDecisionVoltage = Math.max(
      visibleInputMinimum,
      code === 0 ? 0 : (code - 0.5) * lsbSize,
    );
    const upperDecisionVoltage = Math.min(
      visibleInputMaximum,
      code === numberOfCodes - 1
        ? fullScaleSpan
        : (code + 0.5) * lsbSize,
    );

    return {
      code,
      levelVoltage,
      x1: mapInputToX(lowerDecisionVoltage),
      x2: mapInputToX(upperDecisionVoltage),
      y: mapOutputToY(levelVoltage),
    };
  });

  const inputX = mapInputToX(
    Math.max(visibleInputMinimum, Math.min(analogInput, visibleInputMaximum)),
  );
  const quantizedY = mapOutputToY(quantizedVoltage);
  const diagonalStart = Math.max(
    visibleInputMinimum,
    visibleOutputMinimum,
  );
  const diagonalEnd = Math.min(visibleInputMaximum, visibleOutputMaximum);
  const inputLabelAnchor =
    inputX < plotLeft + 70
      ? 'start'
      : inputX > plotRight - 70
        ? 'end'
        : 'middle';

  return (
    <div>
      <div className="diagram-scroll-hint">
        Scroll horizontally to inspect the transfer plot.
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
          aria-labelledby="adc-dac-transfer-title adc-dac-transfer-description"
          style={{
            display: 'block',
            width: '100%',
            minWidth: '700px',
            height: 'auto',
          }}
        >
          <title id="adc-dac-transfer-title">
            ADC quantization and DAC reconstruction transfer plot
          </title>
          <desc id="adc-dac-transfer-description">
            A staircase shows the digital codes near the selected analog input.
            The highlighted step is the nearest ADC code. A point marks the
            ideal DAC voltage for that code.
          </desc>

          <defs>
            <filter
              id="adc-dac-point-glow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            x={plotLeft}
            y={plotTop}
            width={plotRight - plotLeft}
            height={plotBottom - plotTop}
            fill="var(--hw-surface-1)"
            opacity="0.35"
          />

          {staircaseSegments.map((segment) => (
            <g key={segment.code}>
              <line
                x1={segment.x1}
                y1={plotTop}
                x2={segment.x1}
                y2={plotBottom}
                stroke="var(--hw-border-subtle)"
                strokeDasharray="3 6"
              />
              <text
                x={(segment.x1 + segment.x2) / 2}
                y={plotBottom + 25}
                textAnchor="middle"
                fill={
                  segment.code === selectedCode
                    ? 'var(--ifm-color-primary)'
                    : 'var(--hw-text-secondary)'
                }
                fontSize="11"
                fontWeight={segment.code === selectedCode ? '750' : '500'}
              >
                {segment.code}
              </text>
            </g>
          ))}

          <line
            x1={plotLeft}
            y1={plotTop - 10}
            x2={plotLeft}
            y2={plotBottom}
            stroke="var(--hw-text-secondary)"
            strokeWidth="1.5"
          />
          <line
            x1={plotLeft}
            y1={plotBottom}
            x2={plotRight + 10}
            y2={plotBottom}
            stroke="var(--hw-text-secondary)"
            strokeWidth="1.5"
          />
          <path
            d={`M ${plotRight + 10} ${plotBottom} l -9 -5 l 0 10 z`}
            fill="var(--hw-text-secondary)"
          />
          <path
            d={`M ${plotLeft} ${plotTop - 10} l -5 9 l 10 0 z`}
            fill="var(--hw-text-secondary)"
          />

          {diagonalEnd > diagonalStart && (
            <line
              x1={mapInputToX(diagonalStart)}
              y1={mapOutputToY(diagonalStart)}
              x2={mapInputToX(diagonalEnd)}
              y2={mapOutputToY(diagonalEnd)}
              stroke="var(--hw-text-secondary)"
              strokeWidth="1.5"
              strokeDasharray="7 7"
              opacity="0.65"
            />
          )}

          {staircaseSegments.map((segment, index) => (
            <g key={`step-${segment.code}`}>
              <line
                x1={segment.x1}
                y1={segment.y}
                x2={segment.x2}
                y2={segment.y}
                stroke={
                  segment.code === selectedCode
                    ? 'var(--ifm-color-primary)'
                    : 'var(--hw-accent-blue)'
                }
                strokeWidth={segment.code === selectedCode ? '6' : '3'}
                strokeLinecap="round"
              />
              {index < staircaseSegments.length - 1 && (
                <line
                  x1={segment.x2}
                  y1={segment.y}
                  x2={segment.x2}
                  y2={staircaseSegments[index + 1].y}
                  stroke="var(--hw-accent-blue)"
                  strokeWidth="3"
                />
              )}
            </g>
          ))}

          <line
            x1={inputX}
            y1={plotTop - 2}
            x2={inputX}
            y2={plotBottom}
            stroke="var(--hw-accent-teal)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <circle
            cx={inputX}
            cy={quantizedY}
            r="15"
            fill="var(--ifm-color-primary)"
            opacity="0.2"
            filter="url(#adc-dac-point-glow)"
          />
          <circle
            cx={inputX}
            cy={quantizedY}
            r="6.5"
            fill="var(--ifm-color-primary)"
            stroke="var(--hw-text-primary)"
            strokeWidth="2"
          />

          <text
            x={inputX}
            y={27}
            textAnchor={inputLabelAnchor}
            fill="var(--hw-accent-teal)"
            fontSize="12"
            fontWeight="700"
          >
            INPUT {formatVoltage(analogInput)}
          </text>
          <text
            x={(plotLeft + plotRight) / 2}
            y={height - 24}
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            ADC INPUT VOLTAGE - DECIMAL CODE SHOWN BELOW EACH STEP
          </text>
          <text
            x={25}
            y={(plotTop + plotBottom) / 2}
            transform={`rotate(-90 25 ${(plotTop + plotBottom) / 2})`}
            textAnchor="middle"
            fill="var(--hw-text-secondary)"
            fontSize="12"
          >
            QUANTIZED OR DAC VOLTAGE
          </text>
          <text
            x={plotRight - 4}
            y={plotTop + 18}
            textAnchor="end"
            fill="var(--hw-text-secondary)"
            fontSize="11"
          >
            DASHED LINE: IDEAL ANALOG TRANSFER
          </text>
          <text
            x={plotLeft + 12}
            y={plotBottom - 12}
            fill="var(--ifm-color-primary)"
            fontSize="12"
            fontWeight="700"
          >
            SELECTED CODE {selectedCode} / {formatBinary(selectedCode, bitDepth)}
          </text>
        </svg>
      </div>
    </div>
  );
}

export default function AdcDacResolutionExplorer() {
  const [bitDepth, setBitDepth] = useState(12);
  const [fullScaleSpan, setFullScaleSpan] = useState(5);
  const [analogInput, setAnalogInput] = useState(2.417);

  const numberOfCodes = 2 ** bitDepth;
  const maximumCode = numberOfCodes - 1;
  const lsbSize = fullScaleSpan / numberOfCodes;
  const selectedCode = Math.max(
    0,
    Math.min(maximumCode, Math.round(analogInput / lsbSize)),
  );
  const quantizedVoltage = selectedCode * lsbSize;
  const quantizationError = quantizedVoltage - analogInput;
  const dacOutput = selectedCode * lsbSize;
  const inputStep = lsbSize / 4;
  const isAtPositiveFullScale = analogInput >= fullScaleSpan;

  const handleSpanChange = (event) => {
    const nextSpan = Number(event.target.value);
    setFullScaleSpan(nextSpan);
    setAnalogInput((currentInput) => Math.min(currentInput, nextSpan));
  };

  const controls = [
    {
      id: 'adc-dac-bit-depth',
      label: 'Bit depth',
      valueText: `${bitDepth} bits`,
      min: MIN_BITS,
      max: MAX_BITS,
      step: 1,
      value: bitDepth,
      onChange: (event) => setBitDepth(Number(event.target.value)),
    },
    {
      id: 'adc-dac-full-scale-span',
      label: 'Full-scale span / reference',
      valueText: `${trimFixed(fullScaleSpan, 1)} V`,
      min: MIN_SPAN,
      max: MAX_SPAN,
      step: 0.1,
      value: fullScaleSpan,
      onChange: handleSpanChange,
    },
    {
      id: 'adc-dac-analog-input',
      label: 'Analog input',
      valueText: formatVoltage(analogInput),
      min: 0,
      max: fullScaleSpan,
      step: inputStep,
      value: analogInput,
      onChange: (event) => setAnalogInput(Number(event.target.value)),
    },
  ];

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">
        ADC and DAC resolution explorer
      </div>
      <div className="interactive-block__body">
        <div style={{display: 'grid', gap: '1rem'}}>
          {controls.map((control) => (
            <div key={control.id} style={controlStyle}>
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
            margin: '1.5rem 0',
          }}
        >
          <div className="tech-panel">
            <span className="panel-header">Resolution</span>
            <p>
              <strong>Number of codes:</strong>
              <br />
              <span style={valueStyle}>
                {numberOfCodes.toLocaleString('en-US')}
              </span>
            </p>
            <p style={{marginBottom: 0}}>
              <strong>Ideal 1-LSB size:</strong>
              <br />
              <span style={valueStyle}>{formatVoltage(lsbSize)}</span>
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">ADC result</span>
            <p>
              <strong>Nearest ADC code:</strong>
              <br />
              <span style={valueStyle}>
                {selectedCode} / {formatBinary(selectedCode, bitDepth)}
              </span>
            </p>
            <p style={{marginBottom: 0}}>
              <strong>Quantized voltage:</strong>
              <br />
              <span style={valueStyle}>
                {formatVoltage(quantizedVoltage)}
              </span>
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Conversion difference</span>
            <p>
              <strong>Signed quantization error:</strong>
              <br />
              <span
                style={{
                  ...valueStyle,
                  color:
                    quantizationError === 0
                      ? 'var(--hw-accent-teal)'
                      : 'var(--ifm-color-primary)',
                }}
              >
                {formatSignedVoltage(quantizationError)}
              </span>
            </p>
            <p style={{marginBottom: 0}}>
              <strong>DAC output from this code:</strong>
              <br />
              <span style={valueStyle}>{formatVoltage(dacOutput)}</span>
            </p>
          </div>
        </div>

        <QuantizationTransferPlot
          analogInput={analogInput}
          bitDepth={bitDepth}
          numberOfCodes={numberOfCodes}
          lsbSize={lsbSize}
          selectedCode={selectedCode}
          quantizedVoltage={quantizedVoltage}
          fullScaleSpan={fullScaleSpan}
        />

        <p
          style={{
            margin: '1rem 0 0',
            color: 'var(--hw-text-secondary)',
            fontSize: '0.86rem',
          }}
        >
          The ADC rounds the input to the nearest available code. The matched
          ideal DAC converts that code back to the quantized voltage. The
          signed error is the quantized voltage minus the analog input.
        </p>

        {isAtPositiveFullScale && (
          <p
            role="status"
            style={{
              margin: '0.65rem 0 0',
              color: 'var(--ifm-color-primary)',
              fontSize: '0.86rem',
              fontWeight: 650,
            }}
          >
            The input is at positive full scale. The largest binary code is one
            LSB below the full-scale span in this ideal model.
          </p>
        )}
      </div>
    </div>
  );
}
