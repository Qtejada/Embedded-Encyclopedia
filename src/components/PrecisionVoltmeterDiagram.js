import React from 'react';

const lineColor = 'var(--ifm-color-primary)';
const blueColor = 'var(--hw-accent-blue)';
const tealColor = 'var(--hw-accent-teal)';
const textColor = 'var(--hw-text-primary)';
const mutedColor = 'var(--hw-text-secondary)';
const panelColor = 'var(--hw-surface-2)';
const borderColor = 'var(--hw-border)';

function Arrow({x1, y1, x2, y2, color = lineColor}) {
  const direction = x2 >= x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 11 * direction} y2={y2} stroke={color} strokeWidth="3" />
      <path
        d={`M ${x2} ${y2} L ${x2 - 14 * direction} ${y2 - 8} L ${x2 - 14 * direction} ${y2 + 8} Z`}
        fill={color}
      />
    </g>
  );
}

function Block({x, y, width, height, title, lines, color = blueColor}) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx="12" fill={panelColor} stroke={color} strokeWidth="2.5" />
      <text x={x + width / 2} y={y + 30} textAnchor="middle" fill={color} fontSize="15" fontWeight="800">
        {title}
      </text>
      {lines.map((line, index) => (
        <text
          key={line}
          x={x + width / 2}
          y={y + 60 + index * 24}
          textAnchor="middle"
          fill={index === 0 ? textColor : mutedColor}
          fontSize="13"
          fontWeight={index === 0 ? '700' : '500'}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export default function PrecisionVoltmeterDiagram() {
  return (
    <figure className="component-wrapper" style={{padding: '1.25rem'}}>
      <svg
        role="img"
        aria-labelledby="precision-meter-title precision-meter-description"
        viewBox="0 0 900 430"
        style={{display: 'block', width: '100%', height: 'auto'}}
      >
        <title id="precision-meter-title">Functional diagram of the high-precision voltmeter</title>
        <desc id="precision-meter-description">
          Input protection drives a rail-to-rail operational amplifier. A precision output path and split feedback path control accuracy and stability.
        </desc>

        <text x="450" y="30" textAnchor="middle" fill={textColor} fontSize="19" fontWeight="800">
          High-precision voltmeter architecture
        </text>
        <text x="450" y="52" textAnchor="middle" fill={mutedColor} fontSize="13">
          0 mV to 10 mV input • 10 MΩ input resistance • +1.8 V minimum supply
        </text>

        <Block
          x={34}
          y={92}
          width={230}
          height={166}
          title="INPUT PROTECTION"
          lines={['R2: 10 kΩ current limit', 'PN4117 voltage clamps', 'R1: 10 MΩ bias return']}
        />
        <Arrow x1={264} y1={175} x2={324} y2={175} />

        <g>
          <path d="M 324 110 L 490 175 L 324 240 Z" fill={panelColor} stroke={blueColor} strokeWidth="3" />
          <text x="355" y="159" fill={textColor} fontSize="20" fontWeight="800">+</text>
          <text x="355" y="207" fill={textColor} fontSize="24" fontWeight="800">−</text>
          <text x="400" y="178" textAnchor="middle" fill={blueColor} fontSize="13" fontWeight="800">
            RAIL-TO-RAIL
          </text>
          <text x="400" y="196" textAnchor="middle" fill={blueColor} fontSize="13" fontWeight="800">
            OP-AMP
          </text>
        </g>

        <Arrow x1={490} y1={175} x2={548} y2={175} />
        <Block
          x={548}
          y={92}
          width={318}
          height={166}
          title="PRECISION OUTPUT PATH"
          lines={['R3: 10 kΩ meter protection', 'Meter movement', 'R4: 100 Ω, 0.1% scaling']}
          color={tealColor}
        />

        <rect x="240" y="305" width="530" height="88" rx="12" fill="var(--hw-surface-1)" stroke={borderColor} strokeWidth="2" />
        <text x="505" y="334" textAnchor="middle" fill={lineColor} fontSize="15" fontWeight="800">
          SPLIT FEEDBACK PATH
        </text>
        <text x="365" y="364" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="700">
          R5: 100 kΩ DC path
        </text>
        <text x="645" y="364" textAnchor="middle" fill={textColor} fontSize="13" fontWeight="700">
          C1: 10 nF high-frequency bypass
        </text>

        <path d="M 760 258 L 760 286 L 505 286 L 505 305" fill="none" stroke={tealColor} strokeWidth="3" />
        <path d="M 286 305 L 286 205 L 324 205" fill="none" stroke={blueColor} strokeWidth="3" />
        <path d="M 324 205 L 309 197 L 309 213 Z" fill={blueColor} />
        <text x="273" y="275" fill={mutedColor} fontSize="12" transform="rotate(-90 273 275)">
          Feedback to inverting input
        </text>
      </svg>
      <figcaption style={{marginTop: '0.75rem', textAlign: 'center', color: mutedColor, fontSize: '0.9rem'}}>
        R4 controls scaling. R3 protects the meter. R5 and C1 supply separate DC and high-frequency feedback paths.
      </figcaption>
    </figure>
  );
}
