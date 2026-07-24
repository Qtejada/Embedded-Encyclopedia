import React from 'react';

const text = 'var(--ifm-font-color-base)';
const muted = 'var(--ifm-color-emphasis-700)';
const border = 'var(--ifm-color-emphasis-300)';
const surface = 'var(--ifm-background-surface-color)';
const gold = 'var(--ifm-color-primary)';
const blue = '#3b82f6';

function Step({x, label, detail, accent = gold}) {
  return (
    <g>
      <rect x={x} y="78" width="112" height="78" rx="10" fill="none" stroke={accent} strokeWidth="2" />
      <text x={x + 56} y="108" fill={accent} fontSize="13" fontWeight="700" textAnchor="middle">{label}</text>
      <text x={x + 56} y="132" fill={text} fontSize="11" textAnchor="middle">{detail}</text>
    </g>
  );
}

function Arrow({x1, x2}) {
  return (
    <g>
      <line x1={x1} y1="117" x2={x2} y2="117" stroke={muted} strokeWidth="2" />
      <polygon points={`${x2},117 ${x2 - 9},111 ${x2 - 9},123`} fill={muted} />
    </g>
  );
}

export default function BJTFeedbackLoopDiagram() {
  return (
    <div style={{
      border: `1px solid ${border}`,
      borderRadius: '12px',
      background: surface,
      margin: '1.5rem 0',
      padding: '1.25rem',
    }}>
      <div style={{fontWeight: 700, textAlign: 'center', color: text, marginBottom: '0.25rem'}}>
        Emitter-resistor negative feedback
      </div>
      <div style={{fontSize: '0.82rem', textAlign: 'center', color: muted, marginBottom: '0.85rem'}}>
        The emitter resistor converts a current increase into a change that decreases base-emitter voltage.
      </div>
      <div className="diagram-scroll-hint">Scroll horizontally to see the full diagram.</div>
      <div style={{overflowX: 'auto', paddingBottom: '0.25rem'}}>
        <svg
          viewBox="0 0 790 225"
          role="img"
          aria-label="Negative-feedback sequence from an increase in collector current to a corrective decrease in collector current"
          style={{display: 'block', width: '100%', minWidth: '720px', height: 'auto'}}
        >
          <Step x={10} label="IC increases" detail="Current rises" />
          <Arrow x1={122} x2={140} />
          <Step x={140} label="IE increases" detail="Emitter current" accent={blue} />
          <Arrow x1={252} x2={270} />
          <Step x={270} label="VRE increases" detail="Across RE" />
          <Arrow x1={382} x2={400} />
          <Step x={400} label="VE increases" detail="Emitter voltage" accent={blue} />
          <Arrow x1={512} x2={530} />
          <Step x={530} label="VBE decreases" detail="Less drive" />
          <Arrow x1={642} x2={660} />
          <Step x={660} label="IC decreases" detail="Correction" accent={blue} />

          <path
            d="M 716 156 C 716 204, 66 204, 66 156"
            fill="none"
            stroke={gold}
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          <polygon points="66,156 60,168 72,168" fill={gold} />
          <text x="391" y="216" fill={gold} fontSize="12" fontWeight="700" textAnchor="middle">
            The loop opposes the original current increase.
          </text>
        </svg>
      </div>
    </div>
  );
}
