import React, {useState} from 'react';

function formatVoltage(value) {
  const magnitude = Math.abs(value);

  if (magnitude !== 0 && magnitude < 0.001) {
    return `${(value * 1000000).toFixed(2)} µV`;
  }

  if (magnitude !== 0 && magnitude < 1) {
    return `${(value * 1000).toFixed(3)} mV`;
  }

  return `${value.toFixed(4)} V`;
}

export default function InstrumentationAmpErrorExplorer() {
  const [differentialInputMv, setDifferentialInputMv] = useState(1);
  const [commonModeVoltage, setCommonModeVoltage] = useState(2.5);
  const [gain, setGain] = useState(100);
  const [cmrrDb, setCmrrDb] = useState(108);
  const [offsetUv, setOffsetUv] = useState(10);
  const [biasCurrentNa, setBiasCurrentNa] = useState(1);
  const [sourceMismatchKohm, setSourceMismatchKohm] = useState(10);

  const differentialInput = differentialInputMv / 1000;
  const offsetVoltage = offsetUv / 1000000;
  const biasCurrent = biasCurrentNa / 1000000000;
  const sourceMismatch = sourceMismatchKohm * 1000;
  const cmrrRatio = 10 ** (cmrrDb / 20);

  const signalOutput = gain * differentialInput;
  const commonModeError = gain * commonModeVoltage / cmrrRatio;
  const offsetError = gain * offsetVoltage;
  const biasMismatchError = gain * biasCurrent * sourceMismatch;
  const totalError = commonModeError + offsetError + biasMismatchError;
  const totalOutput = signalOutput + totalError;

  const controls = [
    {
      id: 'inamp-differential-input',
      label: 'Differential input',
      valueText: `${differentialInputMv.toFixed(2)} mV`,
      min: 0,
      max: 20,
      step: 0.01,
      value: differentialInputMv,
      setValue: setDifferentialInputMv,
    },
    {
      id: 'inamp-common-mode',
      label: 'Common-mode voltage',
      valueText: `${commonModeVoltage.toFixed(2)} V`,
      min: 0,
      max: 10,
      step: 0.01,
      value: commonModeVoltage,
      setValue: setCommonModeVoltage,
    },
    {
      id: 'inamp-gain',
      label: 'Gain',
      valueText: `${gain} V/V`,
      min: 1,
      max: 1000,
      step: 1,
      value: gain,
      setValue: setGain,
    },
    {
      id: 'inamp-cmrr',
      label: 'CMRR',
      valueText: `${cmrrDb} dB`,
      min: 40,
      max: 140,
      step: 1,
      value: cmrrDb,
      setValue: setCmrrDb,
    },
    {
      id: 'inamp-offset',
      label: 'Input offset',
      valueText: `${offsetUv} µV`,
      min: 0,
      max: 1000,
      step: 1,
      value: offsetUv,
      setValue: setOffsetUv,
    },
    {
      id: 'inamp-bias-current',
      label: 'Input bias current',
      valueText: `${biasCurrentNa.toFixed(1)} nA`,
      min: 0,
      max: 100,
      step: 0.1,
      value: biasCurrentNa,
      setValue: setBiasCurrentNa,
    },
    {
      id: 'inamp-source-mismatch',
      label: 'Source-resistance mismatch',
      valueText: `${sourceMismatchKohm.toFixed(1)} kΩ`,
      min: 0,
      max: 100,
      step: 0.1,
      value: sourceMismatchKohm,
      setValue: setSourceMismatchKohm,
    },
  ];

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">Instrumentation-amplifier error explorer</div>
      <div className="interactive-block__body">
        <div style={{display: 'grid', gap: '1rem'}}>
          {controls.map((control) => (
            <div
              key={control.id}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(180px, 1fr) minmax(180px, 2fr)',
                gap: '0.75rem',
                alignItems: 'center',
              }}
            >
              <label htmlFor={control.id}>
                {control.label}:{' '}
                <strong
                  style={{
                    color: 'var(--ifm-color-primary)',
                    fontFamily: 'var(--ifm-font-family-monospace)',
                  }}
                >
                  {control.valueText}
                </strong>
              </label>
              <input
                id={control.id}
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={control.value}
                onChange={(event) => control.setValue(Number(event.target.value))}
              />
            </div>
          ))}
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
            <span className="panel-header">Wanted signal</span>
            <p style={{marginBottom: 0}}>
              <strong>Ideal signal output:</strong><br />
              {formatVoltage(signalOutput)}
            </p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Input errors</span>
            <p><strong>CMRR error:</strong><br />{formatVoltage(commonModeError)}</p>
            <p><strong>Offset error:</strong><br />{formatVoltage(offsetError)}</p>
            <p style={{marginBottom: 0}}><strong>Bias-mismatch error:</strong><br />{formatVoltage(biasMismatchError)}</p>
          </div>

          <div className="tech-panel">
            <span className="panel-header">Combined result</span>
            <p><strong>Total modeled error:</strong><br />{formatVoltage(totalError)}</p>
            <p style={{marginBottom: 0}}><strong>Total output:</strong><br />{formatVoltage(totalOutput)}</p>
          </div>
        </div>

        <p style={{margin: '1rem 0 0', color: 'var(--hw-text-secondary)', fontSize: '0.88rem'}}>
          This first-order model does not include gain error, noise, drift, bandwidth, settling, or output saturation.
        </p>
      </div>
    </div>
  );
}
