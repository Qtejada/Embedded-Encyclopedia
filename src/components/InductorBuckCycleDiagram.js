import React from 'react';

const text = 'var(--ifm-font-color-base)';
const muted = 'var(--ifm-color-emphasis-700)';
const panel = 'var(--ifm-background-surface-color)';
const border = 'var(--ifm-color-emphasis-300)';
const gold = 'var(--ifm-color-primary)';
const blue = '#3b82f6';
const teal = '#14b8a6';

function Arrow({x1, y1, x2, y2, color = gold}) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" strokeLinecap="round" />
      <polygon
        points={`${x2},${y2} ${x2 - 11},${y2 - 7} ${x2 - 11},${y2 + 7}`}
        fill={color}
      />
    </>
  );
}

function Coil({x, y, color = blue}) {
  return (
    <path
      d={`M ${x} ${y} q 12 -24 24 0 q 12 -24 24 0 q 12 -24 24 0 q 12 -24 24 0`}
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
    />
  );
}

export default function InductorBuckCycleDiagram() {
  return (
    <div style={{
      border: `1px solid ${border}`,
      borderRadius: '12px',
      background: panel,
      margin: '1.5rem 0',
      padding: '1.25rem',
    }}>
      <div style={{fontWeight: 700, textAlign: 'center', color: text, marginBottom: '0.25rem'}}>
        Buck-converter inductor cycle
      </div>
      <div style={{fontSize: '0.82rem', textAlign: 'center', color: muted, marginBottom: '0.85rem'}}>
        Inductor current increases during the ON cycle and continues through the load during the OFF cycle.
      </div>
      <div className="diagram-scroll-hint">Scroll horizontally to see the full diagram.</div>
      <div style={{overflowX: 'auto', paddingBottom: '0.25rem'}}>
        <svg
          viewBox="0 0 760 430"
          role="img"
          aria-label="Two-panel diagram of the ON and OFF cycles in a buck converter"
          style={{display: 'block', width: '100%', minWidth: '680px', height: 'auto'}}
        >
          <rect x="12" y="12" width="356" height="316" rx="12" fill="none" stroke={border} strokeWidth="2" />
          <rect x="392" y="12" width="356" height="316" rx="12" fill="none" stroke={border} strokeWidth="2" />

          <text x="190" y="44" fill={gold} fontSize="15" fontWeight="700" textAnchor="middle">SWITCH ON</text>
          <text x="570" y="44" fill={teal} fontSize="15" fontWeight="700" textAnchor="middle">SWITCH OFF</text>

          <circle cx="62" cy="135" r="24" fill="none" stroke={text} strokeWidth="3" />
          <text x="62" y="131" fill={text} fontSize="11" fontWeight="700" textAnchor="middle">DC</text>
          <text x="62" y="145" fill={text} fontSize="10" textAnchor="middle">input</text>
          <line x1="86" y1="135" x2="120" y2="135" stroke={text} strokeWidth="3" />
          <line x1="120" y1="135" x2="164" y2="135" stroke={gold} strokeWidth="5" strokeLinecap="round" />
          <circle cx="120" cy="135" r="4" fill={gold} />
          <circle cx="164" cy="135" r="4" fill={gold} />
          <text x="142" y="114" fill={muted} fontSize="10" textAnchor="middle">closed switch</text>
          <line x1="164" y1="135" x2="191" y2="135" stroke={text} strokeWidth="3" />
          <Coil x={191} y={135} />
          <line x1="287" y1="135" x2="326" y2="135" stroke={text} strokeWidth="3" />
          <rect x="320" y="110" width="30" height="50" rx="4" fill="none" stroke={text} strokeWidth="3" />
          <text x="335" y="181" fill={text} fontSize="11" textAnchor="middle">load</text>
          <Arrow x1={93} y1={87} x2={307} y2={87} />
          <text x="200" y="76" fill={gold} fontSize="11" fontWeight="700" textAnchor="middle">current increases</text>
          <text x="190" y="224" fill={text} fontSize="12" textAnchor="middle">Applied voltage increases current.</text>
          <text x="190" y="246" fill={text} fontSize="12" textAnchor="middle">The magnetic field stores energy.</text>

          <circle cx="442" cy="135" r="24" fill="none" stroke={muted} strokeWidth="3" opacity="0.55" />
          <text x="442" y="131" fill={muted} fontSize="11" fontWeight="700" textAnchor="middle">DC</text>
          <text x="442" y="145" fill={muted} fontSize="10" textAnchor="middle">input</text>
          <line x1="466" y1="135" x2="500" y2="135" stroke={muted} strokeWidth="3" opacity="0.55" />
          <line x1="500" y1="135" x2="538" y2="103" stroke={muted} strokeWidth="4" strokeLinecap="round" />
          <circle cx="500" cy="135" r="4" fill={muted} />
          <circle cx="544" cy="135" r="4" fill={muted} />
          <text x="521" y="88" fill={muted} fontSize="10" textAnchor="middle">open switch</text>
          <line x1="544" y1="135" x2="571" y2="135" stroke={teal} strokeWidth="3" />
          <Coil x={571} y={135} color={teal} />
          <line x1="667" y1="135" x2="706" y2="135" stroke={teal} strokeWidth="3" />
          <rect x="700" y="110" width="30" height="50" rx="4" fill="none" stroke={teal} strokeWidth="3" />
          <text x="715" y="181" fill={text} fontSize="11" textAnchor="middle">load</text>

          <line x1="544" y1="135" x2="544" y2="190" stroke={teal} strokeWidth="3" />
          <rect x="531" y="190" width="26" height="30" rx="4" fill="none" stroke={teal} strokeWidth="2" />
          <text x="544" y="210" fill={teal} fontSize="12" fontWeight="700" textAnchor="middle">D</text>
          <line x1="544" y1="220" x2="544" y2="258" stroke={teal} strokeWidth="3" />
          <line x1="715" y1="160" x2="715" y2="258" stroke={teal} strokeWidth="3" />
          <line x1="715" y1="258" x2="544" y2="258" stroke={teal} strokeWidth="3" />
          <polygon points="544,153 537,167 551,167" fill={teal} />
          <polygon points="604,258 618,251 618,265" fill={teal} />
          <polygon points="715,239 708,225 722,225" fill={teal} />
          <text x="525" y="209" fill={muted} fontSize="10" textAnchor="end">diode path</text>
          <Arrow x1={594} y1={87} x2={686} y2={87} color={teal} />
          <text x="640" y="76" fill={teal} fontSize="11" fontWeight="700" textAnchor="middle">current continues</text>
          <text x="570" y="286" fill={text} fontSize="12" textAnchor="middle">The collapsing field releases energy.</text>
          <text x="570" y="308" fill={text} fontSize="12" textAnchor="middle">The inductor supplies the load.</text>

          <line x1="72" y1="378" x2="688" y2="378" stroke={border} strokeWidth="2" />
          <path d="M 72 378 L 235 346 L 380 378 L 543 346 L 688 378" fill="none" stroke={blue} strokeWidth="4" />
          <line x1="380" y1="337" x2="380" y2="393" stroke={border} strokeWidth="2" strokeDasharray="5 5" />
          <text x="225" y="418" fill={gold} fontSize="12" fontWeight="700" textAnchor="middle">ON: current rises</text>
          <text x="535" y="418" fill={teal} fontSize="12" fontWeight="700" textAnchor="middle">OFF: current falls but continues</text>
        </svg>
      </div>
    </div>
  );
}
