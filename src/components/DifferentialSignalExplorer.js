import React, {useState} from 'react';

function formatVoltage(value) {
  const magnitude = Math.abs(value);

  if (magnitude !== 0 && magnitude < 0.001) {
    return `${(value * 1000000).toFixed(2)} µV`;
  }

  if (magnitude !== 0 && magnitude < 1) {
    return `${(value * 1000).toFixed(2)} mV`;
  }

  return `${value.toFixed(3)} V`;
}

export default function DifferentialSignalExplorer() {
  const [inputOne, setInputOne] = useState(2.501);
  const [inputTwo, setInputTwo] = useState(2.499);
  const [differentialGain, setDifferentialGain] = useState(100);
  const [cmrrDb, setCmrrDb] = useState(80);

  const differentialVoltage = inputOne - inputTwo;
  const commonModeVoltage = (inputOne + inputTwo) / 2;
  const cmrrRatio = 10 ** (cmrrDb / 20);
  const commonModeGain = differentialGain / cmrrRatio;
  const differentialOutput = differentialGain * differentialVoltage;
  const commonModeError = commonModeGain * commonModeVoltage;
  const totalOutput = differentialOutput + commonModeError;

  const controlStyle = {
    display: 'grid',
    gridTemplateColumns: 'minmax(150px, 1fr) minmax(180px, 2fr)',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '1rem',
  };

  const valueStyle = {
    color: 'var(--ifm-color-primary)',
    fontFamily: 'var(--ifm-font-family-monospace)',
  };

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">Differential and common-mode signal explorer</div>
      <div className="interactive-block__body">
        <div style={controlStyle}>
          <label htmlFor="diff-input-one">
            Input 1: <strong style={valueStyle}>{inputOne.toFixed(3)} V</strong>
          </label>
          <input
            id="diff-input-one"
            type="range"
            min="-5"
            max="5"
            step="0.001"
            value={inputOne}
            onChange={(event) => setInputOne(Number(event.target.value))}
          />
        </div>

        <div style={controlStyle}>
          <label htmlFor="diff-input-two">
            Input 2: <strong style={valueStyle}>{inputTwo.toFixed(3)} V</strong>
          </label>
          <input
            id="diff-input-two"
            type="range"
            min="-5"
            max="5"
            step="0.001"
            value={inputTwo}
            onChange={(event) => setInputTwo(Number(event.target.value))}
          />
        </div>

        <div style={controlStyle}>
          <label htmlFor="diff-gain">
            Differential gain: <strong style={valueStyle}>{differentialGain} V/V</strong>
          </label>
          <input
            id="diff-gain"
            type="range"
            min="1"
            max="500"
            step="1"
            value={differentialGain}
            onChange={(event) => setDifferentialGain(Number(event.target.value))}
          />
        </div>

        <div style={controlStyle}>
          <label htmlFor="diff-cmrr">
            CMRR: <strong style={valueStyle}>{cmrrDb} dB</strong>
          </label>
          <input
            id="diff-cmrr"
            type="range"
            min="20"
            max="140"
            step="1"
            value={cmrrDb}
            onChange={(event) => setCmrrDb(Number(event.target.value))}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            marginTop: '1.5rem',
          }}
        >
          <div className="tech-panel">
            <span className="panel-header">Input decomposition</span>
            <p><strong>Differential voltage:</strong><br />{formatVoltage(differentialVoltage)}</p>
            <p style={{marginBottom: 0}}><strong>Common-mode voltage:</strong><br />{formatVoltage(commonModeVoltage)}</p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Output contributions</span>
            <p><strong>Differential output:</strong><br />{formatVoltage(differentialOutput)}</p>
            <p style={{marginBottom: 0}}><strong>Common-mode error:</strong><br />{formatVoltage(commonModeError)}</p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Ideal linear result</span>
            <p><strong>Total output:</strong><br />{formatVoltage(totalOutput)}</p>
            <p style={{marginBottom: 0}}><strong>Common-mode gain:</strong><br />{commonModeGain.toExponential(3)} V/V</p>
          </div>
        </div>

        <p style={{margin: '1rem 0 0', color: 'var(--hw-text-secondary)', fontSize: '0.88rem'}}>
          This model does not include input-range, output-swing, bandwidth, offset, or noise limits.
        </p>
      </div>
    </div>
  );
}
