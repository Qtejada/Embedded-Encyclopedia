import React, {useId, useState} from 'react';

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

const valueStyle = {
  color: 'var(--ifm-color-primary)',
  fontFamily: 'var(--ifm-font-family-monospace)',
};

const resultStyle = {
  margin: 0,
  color: 'var(--hw-text-primary)',
  fontSize: '1.12rem',
  fontWeight: 750,
};

function parseFiniteNumber(value, allowNegative = false) {
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  if (!allowNegative && number < 0) {
    return null;
  }

  return number;
}

function trimFixed(value, digits = 3) {
  return value
    .toFixed(digits)
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/\.0+$/, '');
}

function NumberControl({
  id,
  label,
  unit,
  value,
  onChange,
  allowNegative = false,
  step = '0.1',
}) {
  const parsedValue = parseFiniteNumber(value, allowNegative);
  const isInvalid = parsedValue === null;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>
        {label} ({unit})
      </label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={allowNegative ? undefined : '0'}
        step={step}
        value={value}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        style={{
          ...inputStyle,
          borderColor: isInvalid
            ? 'var(--hw-accent-purple)'
            : 'var(--hw-border)',
        }}
      />
      {isInvalid && (
        <span
          id={errorId}
          role="alert"
          style={{
            display: 'block',
            marginTop: '0.25rem',
            color: 'var(--hw-accent-purple)',
            fontSize: '0.78rem',
          }}
        >
          Enter a finite{allowNegative ? '' : ', nonnegative'} number.
        </span>
      )}
    </div>
  );
}

function DiagramFrame({children, hint}) {
  return (
    <div>
      <div className="diagram-scroll-hint">{hint}</div>
      <div
        style={{
          overflowX: 'auto',
          border: '1px solid var(--hw-border)',
          borderRadius: '10px',
          background: 'var(--hw-surface-0)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function QuartzEquivalentCircuit({idPrefix}) {
  const titleId = `${idPrefix}-quartz-title`;
  const descriptionId = `${idPrefix}-quartz-description`;

  return (
    <DiagramFrame hint="Scroll horizontally to inspect the labeled circuit.">
      <svg
        viewBox="0 0 860 360"
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
        style={{
          display: 'block',
          width: '100%',
          minWidth: '540px',
          height: 'auto',
        }}
      >
        <title id={titleId}>Quartz crystal electrical equivalent circuit</title>
        <desc id={descriptionId}>
          A series branch that contains motional resistance R m, motional
          inductance L m, and motional capacitance C m is connected in
          parallel with shunt capacitance C zero between the two crystal
          terminals.
        </desc>

        <text
          x="430"
          y="34"
          textAnchor="middle"
          fill="var(--hw-text-primary)"
          fontSize="21"
          fontWeight="750"
        >
          Quartz electrical model
        </text>
        <text
          x="430"
          y="58"
          textAnchor="middle"
          fill="var(--hw-text-secondary)"
          fontSize="14"
        >
          The motional branch is in parallel with the package shunt
          capacitance.
        </text>

        <g
          fill="none"
          stroke="var(--hw-text-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="56" y1="180" x2="100" y2="180" />
          <line x1="100" y1="105" x2="100" y2="255" />
          <line x1="760" y1="105" x2="760" y2="255" />
          <line x1="760" y1="180" x2="804" y2="180" />

          <line x1="100" y1="105" x2="138" y2="105" />
          <path d="M 138 105 l 12 -17 l 20 34 l 20 -34 l 20 34 l 20 -34 l 20 34 l 12 -17" />
          <line x1="262" y1="105" x2="294" y2="105" />
          <path d="M 294 105 c 0 -25 34 -25 34 0 c 0 -25 34 -25 34 0 c 0 -25 34 -25 34 0 c 0 -25 34 -25 34 0" />
          <line x1="430" y1="105" x2="496" y2="105" />
          <line x1="496" y1="75" x2="496" y2="135" />
          <line x1="520" y1="75" x2="520" y2="135" />
          <line x1="520" y1="105" x2="760" y2="105" />

          <line x1="100" y1="255" x2="408" y2="255" />
          <line x1="408" y1="225" x2="408" y2="285" />
          <line x1="432" y1="225" x2="432" y2="285" />
          <line x1="432" y1="255" x2="760" y2="255" />
        </g>

        <g fill="var(--ifm-color-primary)">
          <circle cx="100" cy="105" r="5" />
          <circle cx="100" cy="255" r="5" />
          <circle cx="760" cy="105" r="5" />
          <circle cx="760" cy="255" r="5" />
        </g>

        <g
          fill="var(--ifm-color-primary)"
          fontSize="17"
          fontWeight="750"
          textAnchor="middle"
        >
          <text x="200" y="151">
            Rm
          </text>
          <text x="362" y="151">
            Lm
          </text>
          <text x="508" y="151">
            Cm
          </text>
          <text x="420" y="318">
            C0
          </text>
        </g>

        <g
          fill="var(--hw-text-secondary)"
          fontSize="13"
          textAnchor="middle"
        >
          <text x="200" y="167">
            mechanical loss
          </text>
          <text x="362" y="167">
            effective mass
          </text>
          <text x="508" y="167">
            elasticity
          </text>
          <text x="420" y="335">
            electrodes + package
          </text>
        </g>

        <g
          fill="var(--hw-accent-blue)"
          fontSize="13"
          fontWeight="700"
        >
          <text x="56" y="202" textAnchor="start">
            TERMINAL 1
          </text>
          <text x="804" y="202" textAnchor="end">
            TERMINAL 2
          </text>
        </g>

        <rect
          x="118"
          y="79"
          width="436"
          height="98"
          rx="10"
          fill="none"
          stroke="var(--hw-accent-teal)"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          opacity="0.75"
        />
        <text
          x="336"
          y="92"
          textAnchor="middle"
          fill="var(--hw-accent-teal)"
          fontSize="13"
          fontWeight="750"
        >
          SERIES MOTIONAL BRANCH
        </text>
      </svg>
    </DiagramFrame>
  );
}

function PierceOscillatorDiagram({idPrefix}) {
  const titleId = `${idPrefix}-pierce-title`;
  const descriptionId = `${idPrefix}-pierce-description`;

  return (
    <DiagramFrame hint="Scroll horizontally to inspect the labeled circuit.">
      <svg
        viewBox="0 0 860 520"
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
        style={{
          display: 'block',
          width: '100%',
          minWidth: '540px',
          height: 'auto',
        }}
      >
        <title id={titleId}>Simplified Pierce crystal oscillator</title>
        <desc id={descriptionId}>
          An inverting amplifier connects the XIN node to the XOUT node.
          Feedback resistor R f connects XOUT to XIN. A crystal and optional
          series drive resistor R d form a second feedback path. Load
          capacitors C1 and C2 connect the two crystal nodes to ground.
        </desc>

        <text
          x="430"
          y="34"
          textAnchor="middle"
          fill="var(--hw-text-primary)"
          fontSize="21"
          fontWeight="750"
        >
          Simplified Pierce oscillator
        </text>
        <text
          x="430"
          y="57"
          textAnchor="middle"
          fill="var(--hw-text-secondary)"
          fontSize="14"
        >
          Check the device and crystal data sheets before you select component
          values.
        </text>

        <g
          fill="none"
          stroke="var(--hw-text-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="170" y1="185" x2="278" y2="185" />
          <path d="M 278 125 L 278 245 L 535 185 Z" />
          <circle cx="548" cy="185" r="13" />
          <line x1="561" y1="185" x2="690" y2="185" />

          <line x1="170" y1="185" x2="170" y2="92" />
          <line x1="170" y1="92" x2="282" y2="92" />
          <path d="M 282 92 l 12 -15 l 20 30 l 20 -30 l 20 30 l 20 -30 l 20 30 l 20 -30 l 20 30 l 12 -15" />
          <line x1="446" y1="92" x2="690" y2="92" />
          <line x1="690" y1="92" x2="690" y2="185" />

          <line x1="170" y1="185" x2="170" y2="305" />
          <line x1="170" y1="305" x2="296" y2="305" />
          <line x1="296" y1="275" x2="296" y2="335" />
          <rect x="310" y="278" width="58" height="54" rx="3" />
          <line x1="382" y1="275" x2="382" y2="335" />
          <line x1="382" y1="305" x2="456" y2="305" />
          <path d="M 456 305 l 12 -15 l 20 30 l 20 -30 l 20 30 l 20 -30 l 20 30 l 12 -15" />
          <line x1="580" y1="305" x2="690" y2="305" />
          <line x1="690" y1="305" x2="690" y2="185" />

          <line x1="170" y1="305" x2="170" y2="374" />
          <line x1="138" y1="374" x2="202" y2="374" />
          <line x1="138" y1="396" x2="202" y2="396" />
          <line x1="170" y1="396" x2="170" y2="431" />
          <line x1="145" y1="431" x2="195" y2="431" />
          <line x1="153" y1="443" x2="187" y2="443" />
          <line x1="161" y1="455" x2="179" y2="455" />

          <line x1="690" y1="305" x2="690" y2="374" />
          <line x1="658" y1="374" x2="722" y2="374" />
          <line x1="658" y1="396" x2="722" y2="396" />
          <line x1="690" y1="396" x2="690" y2="431" />
          <line x1="665" y1="431" x2="715" y2="431" />
          <line x1="673" y1="443" x2="707" y2="443" />
          <line x1="681" y1="455" x2="699" y2="455" />
        </g>

        <g fill="var(--ifm-color-primary)">
          <circle cx="170" cy="185" r="6" />
          <circle cx="690" cy="185" r="6" />
          <circle cx="170" cy="305" r="5" />
          <circle cx="690" cy="305" r="5" />
        </g>

        <g
          fill="var(--ifm-color-primary)"
          fontSize="16"
          fontWeight="750"
        >
          <text x="148" y="169" textAnchor="end">
            XIN
          </text>
          <text x="712" y="169">
            XOUT
          </text>
          <text x="364" y="79" textAnchor="middle">
            Rf
          </text>
          <text x="339" y="355" textAnchor="middle">
            CRYSTAL
          </text>
          <text x="518" y="355" textAnchor="middle">
            Rd
          </text>
          <text x="116" y="389" textAnchor="end">
            C1
          </text>
          <text x="744" y="389">
            C2
          </text>
        </g>

        <g
          fill="var(--hw-text-secondary)"
          fontSize="13"
          textAnchor="middle"
        >
          <text x="364" y="119">
            DC bias feedback
          </text>
          <text x="518" y="371">
            optional drive-limit resistor
          </text>
          <text x="170" y="479">
            load capacitor
          </text>
          <text x="690" y="479">
            load capacitor
          </text>
        </g>

        <g
          fill="var(--hw-accent-blue)"
          fontSize="14"
          fontWeight="750"
          textAnchor="middle"
        >
          <text x="399" y="160">
            INVERTING
          </text>
          <text x="399" y="178">
            AMPLIFIER
          </text>
          <text x="399" y="196">
            OR UNBUFFERED
          </text>
          <text x="399" y="214">
            INVERTER
          </text>
        </g>

        <text
          x="430"
          y="506"
          textAnchor="middle"
          fill="var(--hw-text-secondary)"
          fontSize="13"
        >
          C1, C2, and parasitic capacitance set the load seen by the crystal.
        </text>
      </svg>
    </DiagramFrame>
  );
}

export default function CrystalOscillatorExplorer() {
  const generatedId = useId().replace(/:/g, '');
  const [targetLoad, setTargetLoad] = useState('12.5');
  const [strayCapacitance, setStrayCapacitance] = useState('2');
  const [capacitorOne, setCapacitorOne] = useState('21');
  const [capacitorTwo, setCapacitorTwo] = useState('21');
  const [frequencyErrorPpm, setFrequencyErrorPpm] = useState('20');

  const targetLoadNumber = parseFiniteNumber(targetLoad);
  const strayCapacitanceNumber = parseFiniteNumber(strayCapacitance);
  const capacitorOneNumber = parseFiniteNumber(capacitorOne);
  const capacitorTwoNumber = parseFiniteNumber(capacitorTwo);
  const frequencyErrorNumber = parseFiniteNumber(
    frequencyErrorPpm,
    true,
  );

  let equalCapacitorRecommendation = null;
  let recommendationMessage = 'Enter valid load-capacitance values.';

  if (
    targetLoadNumber !== null &&
    strayCapacitanceNumber !== null
  ) {
    if (targetLoadNumber >= strayCapacitanceNumber) {
      equalCapacitorRecommendation =
        2 * (targetLoadNumber - strayCapacitanceNumber);
      recommendationMessage =
        equalCapacitorRecommendation === 0
          ? 'No added load capacitor is required in this ideal calculation.'
          : 'Use the nearest suitable standard value, then verify the frequency.';
    } else {
      recommendationMessage =
        'The stray capacitance is greater than the target load. Positive load capacitors cannot correct this condition.';
    }
  }

  let effectiveLoadCapacitance = null;

  if (
    capacitorOneNumber !== null &&
    capacitorTwoNumber !== null &&
    strayCapacitanceNumber !== null
  ) {
    const capacitorSum = capacitorOneNumber + capacitorTwoNumber;
    const seriesCapacitance =
      capacitorSum > 0
        ? (capacitorOneNumber * capacitorTwoNumber) / capacitorSum
        : 0;
    effectiveLoadCapacitance =
      seriesCapacitance + strayCapacitanceNumber;
  }

  const secondsPerDay =
    frequencyErrorNumber === null
      ? null
      : Math.abs(frequencyErrorNumber) * 0.0864;
  const ppmDirection =
    frequencyErrorNumber === null || frequencyErrorNumber === 0
      ? null
      : frequencyErrorNumber > 0
        ? 'fast'
        : 'slow';

  const targetLoadId = `${generatedId}-target-load`;
  const strayCapacitanceId = `${generatedId}-stray-capacitance`;
  const capacitorOneId = `${generatedId}-capacitor-one`;
  const capacitorTwoId = `${generatedId}-capacitor-two`;
  const ppmId = `${generatedId}-ppm`;

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">
        Crystal-oscillator visual guide and calculators
      </div>
      <div className="interactive-block__body">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 620px), 1fr))',
            gap: '1rem',
          }}
        >
          <section
            className="tech-panel"
            aria-labelledby={`${generatedId}-equivalent-heading`}
            style={{minWidth: 0}}
          >
            <span
              id={`${generatedId}-equivalent-heading`}
              className="panel-header"
            >
              Quartz equivalent circuit
            </span>
            <QuartzEquivalentCircuit idPrefix={generatedId} />
          </section>

          <section
            className="tech-panel"
            aria-labelledby={`${generatedId}-pierce-heading`}
            style={{minWidth: 0}}
          >
            <span
              id={`${generatedId}-pierce-heading`}
              className="panel-header"
            >
              Pierce oscillator connections
            </span>
            <PierceOscillatorDiagram idPrefix={generatedId} />
          </section>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <section
            className="tech-panel"
            aria-labelledby={`${generatedId}-load-heading`}
          >
            <span
              id={`${generatedId}-load-heading`}
              className="panel-header"
            >
              Load-capacitance calculator
            </span>
            <p
              style={{
                marginTop: 0,
                color: 'var(--hw-text-secondary)',
                fontSize: '0.84rem',
              }}
            >
              For this two-capacitor model, CL = (C1 x C2) / (C1 + C2) +
              Cstray.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '0.8rem',
              }}
            >
              <NumberControl
                id={targetLoadId}
                label="Target CL"
                unit="pF"
                value={targetLoad}
                onChange={setTargetLoad}
              />
              <NumberControl
                id={strayCapacitanceId}
                label="Estimated Cstray"
                unit="pF"
                value={strayCapacitance}
                onChange={setStrayCapacitance}
              />
              <NumberControl
                id={capacitorOneId}
                label="C1"
                unit="pF"
                value={capacitorOne}
                onChange={setCapacitorOne}
              />
              <NumberControl
                id={capacitorTwoId}
                label="C2"
                unit="pF"
                value={capacitorTwo}
                onChange={setCapacitorTwo}
              />
            </div>

            <div
              aria-live="polite"
              aria-atomic="true"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '0.75rem',
                marginTop: '1rem',
              }}
            >
              <div
                style={{
                  borderTop: '1px solid var(--hw-border-subtle)',
                  paddingTop: '0.75rem',
                }}
              >
                <strong>Equal C1 and C2 recommendation</strong>
                <p style={resultStyle}>
                  {equalCapacitorRecommendation === null
                    ? 'Not available'
                    : `${trimFixed(
                        equalCapacitorRecommendation,
                      )} pF each`}
                </p>
                <p
                  style={{
                    margin: '0.35rem 0 0',
                    color: 'var(--hw-text-secondary)',
                    fontSize: '0.78rem',
                  }}
                >
                  {recommendationMessage}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--hw-border-subtle)',
                  paddingTop: '0.75rem',
                }}
              >
                <strong>Effective CL from C1 and C2</strong>
                <p style={resultStyle}>
                  {effectiveLoadCapacitance === null
                    ? 'Not available'
                    : `${trimFixed(effectiveLoadCapacitance)} pF`}
                </p>
                <p
                  style={{
                    margin: '0.35rem 0 0',
                    color: 'var(--hw-text-secondary)',
                    fontSize: '0.78rem',
                  }}
                >
                  This result includes the entered stray capacitance.
                </p>
              </div>
            </div>
          </section>

          <section
            className="tech-panel"
            aria-labelledby={`${generatedId}-ppm-heading`}
          >
            <span
              id={`${generatedId}-ppm-heading`}
              className="panel-header"
            >
              PPM time-error calculator
            </span>
            <p
              style={{
                marginTop: 0,
                color: 'var(--hw-text-secondary)',
                fontSize: '0.84rem',
              }}
            >
              The magnitude of the daily time error is |ppm| x 0.0864 seconds.
            </p>

            <NumberControl
              id={ppmId}
              label="Frequency error"
              unit="ppm"
              value={frequencyErrorPpm}
              onChange={setFrequencyErrorPpm}
              allowNegative
            />

            <div
              aria-live="polite"
              aria-atomic="true"
              style={{
                marginTop: '1rem',
                borderTop: '1px solid var(--hw-border-subtle)',
                paddingTop: '0.75rem',
              }}
            >
              <strong>Time-error magnitude per day</strong>
              <p style={{...resultStyle, color: 'var(--hw-accent-teal)'}}>
                {secondsPerDay === null
                  ? 'Not available'
                  : `${trimFixed(secondsPerDay, 4)} seconds/day`}
              </p>
              <p
                style={{
                  margin: '0.35rem 0 0',
                  color: 'var(--hw-text-secondary)',
                  fontSize: '0.82rem',
                }}
              >
                {ppmDirection
                  ? `With this sign convention, a positive error runs fast and a negative error runs slow. The entered value runs ${ppmDirection}.`
                  : frequencyErrorNumber === 0
                    ? 'A zero ppm error gives zero accumulated time error in this ideal calculation.'
                    : 'Enter a valid frequency error.'}
              </p>
            </div>
          </section>
        </div>

        <p
          style={{
            margin: '1rem 0 0',
            color: 'var(--hw-text-secondary)',
            fontSize: '0.82rem',
          }}
        >
          These calculations use ideal lumped values. Pin capacitance, board
          parasitics, the crystal model, drive level, and the oscillator
          amplifier can change the measured result.
        </p>
      </div>
    </div>
  );
}
