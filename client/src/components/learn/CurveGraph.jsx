import { useEffect, useRef, useState } from 'react';
import { fmtNum, sub } from '../../learn/learnExpLog.js';

const BASE_RANGE = 10;
const SIZE = 440;
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 1000;
const ZOOM_STEP = 1.25;

function niceStep(span) {
  const raw = span / 10;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const mult of [1, 2, 5, 10]) if (mult * mag >= raw) return mult * mag;
  return 10 * mag;
}
function ticks(range, step) {
  const out = [];
  const n = Math.ceil(range / step);
  for (let i = -n; i <= n; i++) {
    const v = i * step;
    if (Math.abs(v) <= range + 1e-9) out.push(v);
  }
  return out;
}
function fmtTick(v, step) {
  const decimals = Math.max(0, -Math.floor(Math.log10(step) + 1e-9));
  return String(Number(v.toFixed(Math.min(decimals, 12))));
}
function fmtZoom(z) {
  return z >= 10 ? String(Math.round(z)) : String(Number(z.toFixed(2)));
}

// sample y = fn(x) into an SVG path, breaking when out of view / undefined
function plotPath(fn, range, scale) {
  const N = 300;
  const toX = x => (x + range) * scale;
  const toY = y => (range - y) * scale;
  let d = '', pen = false;
  for (let i = 0; i <= N; i++) {
    const x = -range + (2 * range * i) / N;
    const y = fn(x);
    if (!isFinite(y) || Math.abs(y) > range) { pen = false; continue; }
    d += (pen ? 'L' : 'M') + toX(x).toFixed(1) + ' ' + toY(y).toFixed(1) + ' ';
    pen = true;
  }
  return d;
}

const FNS = {
  exp: {
    label: 'y = a · bˣ',
    fn: (a, b) => x => a * Math.pow(b, x),
    eqText: (a, b) => `y = ${fmtNum(a)} · ${fmtNum(b)}ˣ`,
    points: (a, b) => [[0, a, `(0, ${fmtNum(a)})`], [1, a * b, `(1, ${fmtNum(Number((a * b).toFixed(2)))})`]],
    facts: [
      '📈 When b > 1 the curve grows exponentially — it explodes upward fast!',
      '📉 When 0 < b < 1 the curve decays toward 0 (the x-axis is an asymptote).',
      '📍 a is the starting value: every exponential y = a·bˣ passes through (0, a).',
      '🪞 Negative a flips the curve below the x-axis.'
    ]
  },
  log: {
    label: 'y = a · log_b(x)',
    fn: (a, b) => x => (x > 0 ? a * Math.log(x) / Math.log(b) : NaN),
    eqText: (a, b) => `y = ${fmtNum(a)} · log${sub(b)}(x)`,
    points: (a, b) => [[1, 0, '(1, 0)'], [b, a, `(${fmtNum(b)}, ${fmtNum(a)})`]],
    facts: [
      '📍 Every log curve passes through (1, 0) — because log of 1 is always 0.',
      `📍 The curve passes through (b, a) — since log_b(b) = 1.`,
      '🧱 The y-axis (x = 0) is a vertical asymptote: logs are only defined for x > 0.',
      '📈 Bigger base b → slower growth. Negative a flips the curve downward.'
    ]
  }
};

export default function GraphPlayground() {
  const [fnKind, setFnKind] = useState('exp');
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [zoom, setZoom] = useState(1);
  const svgRef = useRef(null);

  const range = BASE_RANGE / zoom;
  const scale = SIZE / (range * 2);
  const step = Math.min(100, Math.max(0.1, niceStep(range * 2)));
  const toX = x => (x + range) * scale;
  const toY = y => (range - y) * scale;

  const F = FNS[fnKind];
  const fn = F.fn(a, b);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = e => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      setZoom(z => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * factor * 1000) / 1000)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const zoomBy = f => setZoom(z => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * f * 1000) / 1000)));

  function Stepper({ value, set, step: st, min, max, snap }) {
    const apply = v => set(snap ? snap(Math.min(max, Math.max(min, v))) : Math.min(max, Math.max(min, v)));
    const nudge = dir => apply(Math.round((value + dir * st) * 100) / 100);
    return (
      <div className="stepper">
        <button type="button" className="btn btn-ghost stepper-btn"
          onClick={() => nudge(-1)} disabled={value <= min} aria-label="decrease">−</button>
        <input type="range" min={min} max={max} step={st} value={value}
          onChange={e => apply(Number(e.target.value))} aria-label="slider" />
        <button type="button" className="btn btn-ghost stepper-btn"
          onClick={() => nudge(1)} disabled={value >= max} aria-label="increase">+</button>
      </div>
    );
  }

  // base b must stay positive and ≠ 1
  const snapB = v => (v > 0.9 && v < 1.1 ? (v >= 1 ? 1.1 : 0.9) : v);

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <div className="lesson-controls">
          <div className="level-tabs">
            {Object.entries(FNS).map(([id, f]) => (
              <button key={id} type="button"
                className={'role-tab' + (fnKind === id ? ' active' : '')}
                onClick={() => setFnKind(id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="graph-wrap">
          <svg ref={svgRef} width={SIZE} height={SIZE} className="graph-svg" aria-label="coordinate plane">
            {ticks(range, step).map(v => (<g key={v}>
              <line x1={toX(v)} y1={0} x2={toX(v)} y2={SIZE} stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 2 : 1} />
              <line x1={0} y1={toY(v)} x2={SIZE} y2={toY(v)} stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 2 : 1} />
              {v !== 0 && (<>
                <text x={toX(v)} y={toY(0) + 14} fontSize="10" fill="#94a3b8" textAnchor="middle">{fmtTick(v, step)}</text>
                <text x={toX(0) + 5} y={toY(v) + 3} fontSize="10" fill="#94a3b8">{fmtTick(v, step)}</text>
              </>)}
            </g>))}

            {/* the curve */}
            <path d={plotPath(fn, range, scale)} fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />

            {/* key points */}
            {F.points(a, b).map(([px, py, label]) => (
              Math.abs(px) <= range && Math.abs(py) <= range && (
                <g key={label}>
                  <circle cx={toX(px)} cy={toY(py)} r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                  <text x={toX(px) + 9} y={toY(py) - 9} fontSize="12" fontWeight="700" fill="#b45309">{label}</text>
                </g>
              )
            ))}
          </svg>

          <div className="zoom-bar">
            <button type="button" className="btn btn-ghost stepper-btn" aria-label="zoom out"
              onClick={() => zoomBy(1 / ZOOM_STEP)} disabled={zoom <= ZOOM_MIN}>−</button>
            <span className="zoom-label">🔍 {fmtZoom(zoom)}×</span>
            <button type="button" className="btn btn-ghost stepper-btn" aria-label="zoom in"
              onClick={() => zoomBy(ZOOM_STEP)} disabled={zoom >= ZOOM_MAX}>+</button>
            <button type="button" className="btn btn-ghost" onClick={() => setZoom(1)}
              disabled={zoom === 1}>Reset</button>
            <span className="muted zoom-hint">scroll over the graph to zoom</span>
          </div>

          <div className="graph-eq">{F.eqText(a, b)}</div>
        </div>
      </section>

      <aside className="lesson-steps">
        <h4>🎛️ Controls</h4>
        <label className="slider-row">
          <span><strong>a</strong> (scale) = <strong className="slider-val">{fmtNum(a)}</strong></span>
          <Stepper value={a} set={setA} step={0.5} min={-5} max={5} />
        </label>
        <label className="slider-row">
          <span><strong>b</strong> (base) = <strong className="slider-val">{fmtNum(b)}</strong></span>
          <Stepper value={b} set={setB} step={0.1} min={0.2} max={10} snap={snapB} />
        </label>
        <div className="graph-facts">
          {F.facts.map((f, i) => <p key={i}>{f}</p>)}
        </div>
      </aside>
    </div>
  );
}
