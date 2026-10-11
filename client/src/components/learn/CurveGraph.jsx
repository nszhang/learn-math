import { useEffect, useMemo, useRef, useState } from 'react';
import { fmtNum, sub } from '../../learn/learnExpLog.js';
import { parse } from '../../learn/parser.js';

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

const EXPR_COLORS = ['#4f46e5', '#dc2626', '#16a34a', '#d97706', '#0891b2', '#9333ea'];

export default function GraphPlayground() {
  const [fnKind, setFnKind] = useState('exp');
  const [a, setA] = useState(1);
  const [b, setB] = useState(2);
  const [zoom, setZoom] = useState(1);
  const [exprs, setExprs] = useState(() => [{ id: 1, text: 'x^2' }]);
  const nextExprId = useRef(2);
  const svgRef = useRef(null);

  const range = BASE_RANGE / zoom;
  const scale = SIZE / (range * 2);
  const step = Math.min(100, Math.max(0.1, niceStep(range * 2)));
  const toX = x => (x + range) * scale;
  const toY = y => (range - y) * scale;

  const F = FNS[fnKind] || FNS.exp;
  const fn = F.fn(a, b);

  // custom expressions: parse each row, keep colors stable per row index
  const customPlots = useMemo(() =>
    exprs.map((e, i) => ({ ...e, color: EXPR_COLORS[i % EXPR_COLORS.length], ...parse(e.text) })),
    [exprs]);

  const updateExpr = (id, text) =>
    setExprs(list => list.map(e => (e.id === id ? { ...e, text } : e)));
  const removeExpr = id => setExprs(list => list.filter(e => e.id !== id));
  const addExpr = () => setExprs(list => [...list, { id: nextExprId.current++, text: '' }]);

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
            <button type="button"
              className={'role-tab' + (fnKind === 'custom' ? ' active' : '')}
              onClick={() => setFnKind('custom')}>
              ✏️ f(x) = ?
            </button>
          </div>
        </div>

        <div className="graph-wrap">
          {fnKind === 'custom' && (
            <div className="expr-list">
              {customPlots.map((ex, i) => (
                <div className="expr-row" key={ex.id}>
                  <span className="expr-dot" style={{ background: ex.color }} />
                  <span className="expr-y">y =</span>
                  <input
                    className={'expr-input' + (ex.error && ex.text.trim() ? ' invalid' : '')}
                    value={ex.text}
                    onChange={e => updateExpr(ex.id, e.target.value)}
                    placeholder="e.g. x^2, sin(x), 2x+1, 1/x"
                    spellCheck={false}
                    autoComplete="off"
                    aria-label={'expression ' + (i + 1)}
                  />
                  {exprs.length > 1 && (
                    <button type="button" className="btn btn-ghost expr-del"
                      onClick={() => removeExpr(ex.id)} aria-label="remove">✕</button>
                  )}
                  {ex.error && ex.text.trim() !== '' && (
                    <div className="expr-error">⚠ {ex.error}</div>
                  )}
                </div>
              ))}
              {exprs.length < 6 && (
                <button type="button" className="btn btn-ghost expr-add" onClick={addExpr}>
                  ＋ Add expression
                </button>
              )}
            </div>
          )}
          <svg ref={svgRef} width={SIZE} height={SIZE} className="graph-svg" aria-label="coordinate plane">
            {ticks(range, step).map(v => (<g key={v}>
              <line x1={toX(v)} y1={0} x2={toX(v)} y2={SIZE} stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 2 : 1} />
              <line x1={0} y1={toY(v)} x2={SIZE} y2={toY(v)} stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 2 : 1} />
              {v !== 0 && (<>
                <text x={toX(v)} y={toY(0) + 14} fontSize="10" fill="#94a3b8" textAnchor="middle">{fmtTick(v, step)}</text>
                <text x={toX(0) + 5} y={toY(v) + 3} fontSize="10" fill="#94a3b8">{fmtTick(v, step)}</text>
              </>)}
            </g>))}

            {/* curves */}
            {fnKind === 'custom'
              ? customPlots.map(ex => ex.fn && (
                  <path key={ex.id} d={plotPath(ex.fn, range, scale)} fill="none"
                    stroke={ex.color} strokeWidth="3.5" strokeLinecap="round" />
                ))
              : <path d={plotPath(fn, range, scale)} fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" />}

            {/* key points */}
            {fnKind !== 'custom' && F.points(a, b).map(([px, py, label]) => (
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

          <div className="graph-eq">{fnKind === 'custom' ? '' : F.eqText(a, b)}</div>
        </div>
      </section>

      <aside className="lesson-steps">
        {fnKind === 'custom' ? (<>
          <h4>⌨️ What you can type</h4>
          <div className="graph-facts">
            <p><strong>Basics:</strong> <code>2x+3</code>, <code>x^2</code>, <code>1/x</code>, <code>(x+1)(x-1)</code></p>
            <p><strong>Powers:</strong> <code>x^3</code>, <code>2^x</code>, <code>x^(1/2)</code>, <code>e^x</code></p>
            <p><strong>Trig:</strong> <code>sin(x)</code> <code>cos(x)</code> <code>tan(x)</code> <code>asin(x)</code> <code>atan(x)</code></p>
            <p><strong>More:</strong> <code>sqrt(x)</code> <code>abs(x)</code> <code>ln(x)</code> <code>log(x)</code> <code>log2(x)</code> <code>exp(x)</code> <code>floor(x)</code> <code>ceil(x)</code></p>
            <p><strong>Constants:</strong> <code>pi</code> and <code>e</code> — try <code>sin(pi x)</code></p>
            <p>💡 Multiplication can be implicit: <code>2x</code>, <code>2(x+1)</code>, <code>2sin(x)</code>. Add up to 6 expressions to compare curves!</p>
          </div>
        </>) : (<>
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
        </>)}
      </aside>
    </div>
  );
}
