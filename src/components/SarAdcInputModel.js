import React, {useState} from 'react';

export default function SarAdcInputModel() {
  const [phase, setPhase] = useState('track');
  const isTrack = phase === 'track';
  const lineColor = 'var(--ifm-color-primary)';
  const sourceColor = 'var(--hw-accent-blue)';
  const activeColor = 'var(--hw-accent-teal)';
  const inactiveColor = 'var(--hw-text-muted)';
  const textColor = 'var(--hw-text-primary)';
  const mutedColor = 'var(--hw-text-secondary)';

  const buttonStyle = (active) => ({
    border: `1px solid ${active ? activeColor : 'var(--hw-border)'}`,
    borderRadius: '6px',
    padding: '0.45rem 0.8rem',
    background: active ? 'rgba(20, 184, 166, 0.12)' : 'var(--hw-surface-2)',
    color: active ? activeColor : mutedColor,
    cursor: 'pointer',
    fontWeight: 700,
  });

  return (
    <div className="interactive-block">
      <div className="interactive-block__header">SAR ADC input model</div>
      <div className="interactive-block__body">
        <div style={{display: 'flex', gap: '0.6rem', justifyContent: 'center', marginBottom: '1rem'}}>
          <button type="button" style={buttonStyle(isTrack)} onClick={() => setPhase('track')}>
            Track phase
          </button>
          <button type="button" style={buttonStyle(!isTrack)} onClick={() => setPhase('hold')}>
            Hold and reset phase
          </button>
        </div>

        <svg
          role="img"
          aria-label={isTrack
            ? 'The sample switch is closed and the reset switch is open.'
            : 'The sample switch is open and the reset switch is closed.'}
          viewBox="0 0 760 330"
          style={{display: 'block', width: '100%', height: 'auto'}}
        >
          <rect x="390" y="36" width="310" height="248" rx="14" fill="var(--hw-surface-2)" stroke="var(--hw-border)" strokeWidth="2" />
          <text x="545" y="67" textAnchor="middle" fill={textColor} fontSize="17" fontWeight="800">
            SAR ADC input
          </text>

          <path d="M 70 114 L 150 160 L 70 206 Z" fill="var(--hw-surface-2)" stroke={sourceColor} strokeWidth="3" />
          <text x="101" y="165" textAnchor="middle" fill={sourceColor} fontSize="15" fontWeight="800">A</text>
          <text x="93" y="226" textAnchor="middle" fill={mutedColor} fontSize="13">Op-amp</text>
          <line x1="150" y1="160" x2="260" y2="160" stroke={lineColor} strokeWidth="3" />
          <text x="202" y="144" textAnchor="middle" fill={textColor} fontSize="14">VADCIN</text>

          <circle cx="282" cy="160" r="6" fill={lineColor} />
          <circle cx="352" cy="160" r="6" fill={lineColor} />
          <line
            x1="288"
            y1="160"
            x2={isTrack ? 346 : 336}
            y2={isTrack ? 160 : 132}
            stroke={isTrack ? activeColor : inactiveColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="317" y="115" textAnchor="middle" fill={isTrack ? activeColor : mutedColor} fontSize="14" fontWeight="700">
            SWSH
          </text>
          <line x1="358" y1="160" x2="470" y2="160" stroke={lineColor} strokeWidth="3" />

          {isTrack && (
            <g>
              <line x1="248" y1="190" x2="378" y2="190" stroke="var(--hw-accent-red)" strokeWidth="3" />
              <path d="M 390 190 L 374 181 L 374 199 Z" fill="var(--hw-accent-red)" />
              <text x="320" y="216" textAnchor="middle" fill="var(--hw-accent-red)" fontSize="13" fontWeight="700">
                Transient current
              </text>
            </g>
          )}

          <circle cx="470" cy="160" r="6" fill={lineColor} />
          <text x="484" y="150" fill={textColor} fontSize="14">VSH</text>

          <line x1="470" y1="160" x2="470" y2="202" stroke={lineColor} strokeWidth="3" />
          <line x1="438" y1="202" x2="502" y2="202" stroke={lineColor} strokeWidth="4" />
          <line x1="438" y1="220" x2="502" y2="220" stroke={lineColor} strokeWidth="4" />
          <line x1="470" y1="220" x2="470" y2="258" stroke={lineColor} strokeWidth="3" />
          <line x1="446" y1="258" x2="494" y2="258" stroke={mutedColor} strokeWidth="3" />
          <line x1="453" y1="268" x2="487" y2="268" stroke={mutedColor} strokeWidth="3" />
          <line x1="461" y1="278" x2="479" y2="278" stroke={mutedColor} strokeWidth="3" />
          <text x="520" y="218" fill={textColor} fontSize="14" fontWeight="700">CSH</text>

          <line x1="470" y1="160" x2="470" y2="106" stroke={lineColor} strokeWidth="3" />
          <circle cx="470" cy="100" r="6" fill={lineColor} />
          <circle cx="470" cy="46" r="6" fill={lineColor} />
          <line
            x1="470"
            y1="94"
            x2={isTrack ? 500 : 470}
            y2={isTrack ? 62 : 52}
            stroke={!isTrack ? activeColor : inactiveColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="536" y="100" fill={!isTrack ? activeColor : mutedColor} fontSize="14" fontWeight="700">
            SWRST
          </text>
          <line x1="470" y1="40" x2="470" y2="20" stroke={sourceColor} strokeWidth="3" />
          <text x="470" y="15" textAnchor="middle" fill={sourceColor} fontSize="14" fontWeight="700">VRST</text>

          <rect x="580" y="116" width="82" height="88" rx="8" fill="var(--hw-surface-1)" stroke={sourceColor} strokeWidth="2" />
          <text x="621" y="151" textAnchor="middle" fill={sourceColor} fontSize="14" fontWeight="800">SAR</text>
          <text x="621" y="173" textAnchor="middle" fill={sourceColor} fontSize="14" fontWeight="800">CORE</text>
          <line x1="470" y1="160" x2="580" y2="160" stroke={lineColor} strokeWidth="3" />
        </svg>

        <p style={{margin: '0.5rem 0 0', textAlign: 'center', color: mutedColor}}>
          {isTrack
            ? 'The sample switch is closed. The reset switch is open.'
            : 'The sample switch is open. The reset switch sets the sample capacitor to the reset voltage.'}
        </p>
      </div>
    </div>
  );
}
