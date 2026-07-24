import React from 'react';

export default function AdcDriverIsolation() {
  const lineColor = 'var(--ifm-color-primary)';
  const sourceColor = 'var(--hw-accent-blue)';
  const textColor = 'var(--hw-text-primary)';
  const mutedColor = 'var(--hw-text-secondary)';

  return (
    <figure className="component-wrapper" style={{padding: '1.25rem'}}>
      <svg
        role="img"
        aria-labelledby="adc-driver-title adc-driver-description"
        viewBox="0 0 820 340"
        style={{display: 'block', width: '100%', height: 'auto'}}
      >
        <title id="adc-driver-title">Operational-amplifier isolation circuit for a SAR ADC</title>
        <desc id="adc-driver-description">
          A series isolation resistor connects an operational-amplifier output to an external capacitor and a SAR ADC input.
        </desc>

        <text x="410" y="28" textAnchor="middle" fill={textColor} fontSize="19" fontWeight="800">
          R-C isolation for a SAR ADC driver
        </text>

        <line x1="44" y1="150" x2="112" y2="150" stroke={lineColor} strokeWidth="3" />
        <text x="44" y="132" fill={mutedColor} fontSize="14">Input</text>

        <path d="M 112 88 L 270 170 L 112 252 Z" fill="var(--hw-surface-2)" stroke={sourceColor} strokeWidth="3" />
        <text x="148" y="145" fill={textColor} fontSize="20" fontWeight="800">+</text>
        <text x="148" y="211" fill={textColor} fontSize="24" fontWeight="800">−</text>
        <text x="177" y="176" textAnchor="middle" fill={sourceColor} fontSize="16" fontWeight="800">OP-AMP</text>

        <line x1="270" y1="170" x2="332" y2="170" stroke={lineColor} strokeWidth="3" />
        <polyline
          points="332,170 344,156 360,184 376,156 392,184 408,156 424,170"
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <text x="378" y="136" textAnchor="middle" fill={textColor} fontSize="15" fontWeight="800">Riso</text>

        <line x1="424" y1="170" x2="710" y2="170" stroke={lineColor} strokeWidth="3" />
        <circle cx="474" cy="170" r="6" fill={lineColor} />
        <text x="474" y="150" textAnchor="middle" fill={textColor} fontSize="14">ADC input</text>

        <line x1="474" y1="170" x2="474" y2="220" stroke={lineColor} strokeWidth="3" />
        <line x1="440" y1="220" x2="508" y2="220" stroke={lineColor} strokeWidth="4" />
        <line x1="440" y1="240" x2="508" y2="240" stroke={lineColor} strokeWidth="4" />
        <line x1="474" y1="240" x2="474" y2="278" stroke={lineColor} strokeWidth="3" />
        <line x1="450" y1="278" x2="498" y2="278" stroke={mutedColor} strokeWidth="3" />
        <line x1="457" y1="288" x2="491" y2="288" stroke={mutedColor} strokeWidth="3" />
        <line x1="465" y1="298" x2="483" y2="298" stroke={mutedColor} strokeWidth="3" />
        <text x="526" y="237" fill={textColor} fontSize="15" fontWeight="800">Cext</text>
        <text x="526" y="257" fill={mutedColor} fontSize="13">Charge reservoir</text>

        <rect x="618" y="100" width="148" height="140" rx="12" fill="var(--hw-surface-2)" stroke={sourceColor} strokeWidth="3" />
        <text x="692" y="136" textAnchor="middle" fill={sourceColor} fontSize="16" fontWeight="800">SAR ADC</text>
        <line x1="710" y1="170" x2="710" y2="192" stroke={lineColor} strokeWidth="3" />
        <line x1="684" y1="192" x2="736" y2="192" stroke={lineColor} strokeWidth="4" />
        <line x1="684" y1="210" x2="736" y2="210" stroke={lineColor} strokeWidth="4" />
        <text x="672" y="207" textAnchor="end" fill={textColor} fontSize="14" fontWeight="800">CSH</text>

        <path d="M 302 170 L 302 308 L 82 308 L 82 214 L 112 214" fill="none" stroke={mutedColor} strokeWidth="2.5" />
        <text x="190" y="329" textAnchor="middle" fill={mutedColor} fontSize="13">Negative-feedback path</text>
      </svg>
      <figcaption style={{marginTop: '0.75rem', textAlign: 'center', color: mutedColor, fontSize: '0.9rem'}}>
        The isolation resistor separates the op-amp output from the external capacitor. The capacitor supplies the transient current to the ADC.
      </figcaption>
    </figure>
  );
}
