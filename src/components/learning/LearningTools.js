import React, {useId} from 'react';
import styles from './LearningTools.module.css';
export const accent = 'var(--ifm-color-primary)';
export const secondary = 'var(--hw-accent-teal, #47877e)';
export function Tool({title, children}) { return <section className={styles.tool} aria-label={title}><h3>{title}</h3>{children}</section>; }
export function Controls({children}) { return <div className={styles.controls}>{children}</div>; }
export function Range({label, value, set, min, max, step = 1, unit = '', digits = 0}) {
  return <label className={styles.control}><span><strong>{label}:</strong> {Number(value).toFixed(digits)} {unit}</span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} /></label>;
}
export function Choice({label, value, set, options}) { return <label className={styles.control}><strong>{label}</strong><select aria-label={label} value={value} onChange={e => set(e.target.value)}>{options.map(([v, text]) => <option key={v} value={v}>{text}</option>)}</select></label>; }
export function Actions({children}) { return <div className={styles.actions}>{children}</div>; }
export function Results({children}) { return <div className={styles.results} aria-live="polite" aria-atomic="true">{children}</div>; }
export function Note({children}) { return <p className={styles.note}>{children}</p>; }
export function Figure({title, description, children, height = 250, width = 600, dense = false, caption}) {
  const id = useId();
  return <figure className={styles.figure} tabIndex={dense ? 0 : undefined} aria-label={dense ? `${title}. Scroll horizontally to see the full drawing.` : undefined}>
    <svg className={dense ? styles.dense : undefined} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>{description}</desc>{children}
    </svg>{caption && <figcaption>{caption}</figcaption>}
  </figure>;
}
export function Box({x, y, w = 130, h = 60, label}) { return <g><rect x={x} y={y} width={w} height={h} rx="5" fill="none" stroke="currentColor" /><text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle">{label}</text></g>; }
export function Arrow({x1, y1, x2, y2, color = accent, dashed = false}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const points = [[x2, y2], [x2 - 9 * Math.cos(angle - .45), y2 - 9 * Math.sin(angle - .45)], [x2 - 9 * Math.cos(angle + .45), y2 - 9 * Math.sin(angle + .45)]].map(p => p.join(',')).join(' ');
  return <g stroke={color} fill={color}><line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" strokeDasharray={dashed ? '5 4' : undefined} /><polygon points={points} /></g>;
}
