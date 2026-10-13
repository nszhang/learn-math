import { useEffect, useMemo, useRef, useState } from 'react';
import { parse } from '../../learn/parser.js';

/* Fundamental Theorem of Calculus lab: three linked views of one curve.
   1. slope  — a secant line that closes in on the tangent (the derivative)
   2. area   — FTC part 1: the area collected so far, A(x), has slope f(x)
   3. change — FTC part 2: ∫ₐᵇ f = F(b) − F(a) for any antiderivative F  */

const LO = -4, HI = 4;           // the default window
const N = 600;                    // samples per curve across the visible window
const W = 560, PAD = { l: 40, r: 12, t: 10, b: 22 };
const IW = W - PAD.l - PAD.r;
const MIN_SPAN = 0.004, MAX_SPAN = 80, MAX_CENTER = 80;
const DEFAULT_VIEW = { x0: LO, x1: HI };
const GAP_FRACTIONS = [0.25, 0.15, 0.09, 0.05, 0.025, 0.0125, 0.004, 0]; // secant gap h as a share of the window; 0 = the tangent itself

const COLORS = { f: '#4f46e5', area: '#4f46e5', neg: '#dc2626', tangent: '#16a34a', secant: '#d97706', deriv: '#0891b2' };

const PRESETS = [
  { id: 'sq', label: 'x²', text: 'x^2', Ftext: 'x³/3', F: x => x ** 3 / 3 },
  { id: 'cubic', label: 'x³ − 3x', text: 'x^3 - 3x', Ftext: 'x⁴/4 − 3x²/2', F: x => x ** 4 / 4 - 1.5 * x * x },
  { id: 'sin', label: 'sin x', text: 'sin(x)', Ftext: '−cos x', F: x => -Math.cos(x) },
  { id: 'cos', label: 'cos x', text: 'cos(x)', Ftext: 'sin x', F: Math.sin },
  { id: 'exp', label: 'eˣ', text: 'e^x', Ftext: 'eˣ', F: Math.exp },
  { id: 'atan', label: '1/(1 + x²)', text: '1/(1+x^2)', Ftext: 'arctan x', F: Math.atan },
  { id: 'custom', label: '✏️ Your own' }
];

const MODES = [
  { id: 'slope', label: '① Slope' },
  { id: 'area', label: '② Area builds a function' },
  { id: 'change', label: '③ Net change' }
];

/* ---------- numerics ---------- */
const fmt = v => (Number.isFinite(v) ? String(parseFloat(v.toFixed(3))).replace('-', '−') : 'undefined');

// Simpson's rule; NaN if f is undefined anywhere in [lo, hi]
function integrate(f, lo, hi) {
  if (lo === hi) return 0;
  const n = 200, h = (hi - lo) / n;
  let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}
const slope = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;

const linspace = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);

// running integral (trapezoid) along xs, starting from `base` at xs[0]
function cumulative(ys, xs, base) {
  const out = new Array(xs.length);
  out[0] = base;
  for (let i = 1; i < xs.length; i++) out[i] = out[i - 1] + ((ys[i] + ys[i - 1]) / 2) * (xs[i] - xs[i - 1]);
  return out;
}

// y-window that fits the visible samples (ignoring asymptote spikes); includes 0 when that costs little
function yRange(...arrays) {
  const vals = [];
  for (const a of arrays) for (const v of a) if (Number.isFinite(v) && Math.abs(v) < 1e12) vals.push(v);
  if (!vals.length) return [-1, 1];
  vals.sort((p, q) => p - q);
  let lo = vals[0], hi = vals[vals.length - 1];
  const at = q => vals[Math.min(vals.length - 1, Math.floor(q * vals.length))];
  if (hi - lo > 50 * (at(0.9) - at(0.1)) && at(0.9) > at(0.1)) { lo = at(0.03); hi = at(0.97); }
  const withZero = Math.max(hi, 0) - Math.min(lo, 0);
  if (withZero <= 3 * (hi - lo) || hi - lo === 0) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
  if (hi - lo < 1e-12 * (1 + Math.abs(hi))) { hi += 0.5; lo -= 0.5; }
  const pad = (hi - lo) * 0.08;
  return [lo - pad, hi + pad];
}
function niceStep(span, target = 5) {
  const raw = span / target, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 5, 10]) if (m * mag >= raw) return m * mag;
  return 10 * mag;
}
const fmtTick = (v, step) => {
  const dec = Math.min(12, Math.max(0, -Math.floor(Math.log10(step) + 1e-9)));
  let t = v.toFixed(dec);
  if (t.includes('.')) t = t.replace(/0+$/, '').replace(/\.$/, '');
  return t === '-0' || t === '' ? '0' : t.replace('-', '−');
};

/* ---------- view (x-window shared by every graph in the lab) ---------- */
function clampView(x0, x1) {
  let span = Math.min(MAX_SPAN, Math.max(MIN_SPAN, x1 - x0));
  const mid = Math.min(MAX_CENTER, Math.max(-MAX_CENTER, (x0 + x1) / 2));
  return { x0: mid - span / 2, x1: mid + span / 2 };
}
function zoomView(v, anchor, factor) {
  const span = v.x1 - v.x0;
  const newSpan = Math.min(MAX_SPAN, Math.max(MIN_SPAN, span * factor)), f = newSpan / span;
  const x0 = anchor - (anchor - v.x0) * f;
  return clampView(x0, x0 + newSpan);
}
const panView = (v, dx) => clampView(v.x0 + dx, v.x1 + dx);

/* ---------- drawing helpers ---------- */
function linePath(xs, ys, sx, sy) {
  let d = '', pen = false;
  for (let i = 0; i < xs.length; i++) {
    const y = ys[i];
    if (!Number.isFinite(y) || Math.abs(y) > 1e9) { pen = false; continue; }
    d += (pen ? 'L' : 'M') + sx(xs[i]).toFixed(1) + ' ' + sy(y).toFixed(1) + ' ';
    pen = true;
  }
  return d;
}
// region between f and the x-axis over [lo, hi] (cut to the window), keeping the positive or negative part
function regionPath(f, lo, hi, sign, view, sx, sy) {
  if (lo > hi) [lo, hi] = [hi, lo];
  lo = Math.max(lo, view.x0); hi = Math.min(hi, view.x1);
  if (!(hi > lo)) return '';
  const pts = linspace(lo, hi, 240);
  let d = `M${sx(lo).toFixed(1)} ${sy(0).toFixed(1)} `;
  for (const t of pts) {
    const v = f(t), y = Number.isFinite(v) ? v : 0;
    d += `L${sx(t).toFixed(1)} ${sy(sign > 0 ? Math.max(y, 0) : Math.min(y, 0)).toFixed(1)} `;
  }
  return d + `L${sx(hi).toFixed(1)} ${sy(0).toFixed(1)} Z`;
}

function Plot({ id, h, yr, label, view, setView, children }) {
  const [y0, y1] = yr;
  const ih = h - PAD.t - PAD.b;
  const sx = x => PAD.l + ((x - view.x0) / (view.x1 - view.x0)) * IW;
  const sy = y => PAD.t + ((y1 - y) / (y1 - y0)) * ih;
  const ref = useRef(null);
  const viewRef = useRef(view);
  viewRef.current = view;
  const pointers = useRef(new Map());

  // client x → data x, using the window as it is right now
  const toData = clientX => {
    const r = ref.current.getBoundingClientRect(), v = viewRef.current;
    return v.x0 + ((((clientX - r.left) * W) / r.width - PAD.l) / IW) * (v.x1 - v.x0);
  };
  useEffect(() => {
    const el = ref.current;
    const onWheel = e => {
      e.preventDefault();
      const anchor = toData(e.clientX);
      setView(v => zoomView(v, anchor, e.deltaY < 0 ? 1 / 1.25 : 1.25));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [setView]);

  const onPointerDown = e => {
    ref.current.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX });
  };
  const onPointerMove = e => {
    const m = pointers.current;
    if (!m.has(e.pointerId)) return;
    const r = ref.current.getBoundingClientRect(), prev = m.get(e.pointerId);
    if (m.size === 1) {
      const span = viewRef.current.x1 - viewRef.current.x0;
      const dx = -((e.clientX - prev.x) * W / r.width / IW) * span;
      setView(v => panView(v, dx));
    } else if (m.size === 2) {                         // pinch
      const other = [...m.entries()].find(([k]) => k !== e.pointerId)[1];
      const before = Math.abs(prev.x - other.x), after = Math.abs(e.clientX - other.x);
      if (before > 4 && after > 4) {
        const anchor = toData((e.clientX + other.x) / 2);
        setView(v => zoomView(v, anchor, before / after));
      }
    }
    m.set(e.pointerId, { x: e.clientX });
  };
  const onPointerUp = e => pointers.current.delete(e.pointerId);
  const onKeyDown = e => {
    const mid = (viewRef.current.x0 + viewRef.current.x1) / 2, span = viewRef.current.x1 - viewRef.current.x0;
    if (e.key === '+' || e.key === '=') setView(v => zoomView(v, mid, 1 / 1.4));
    else if (e.key === '-') setView(v => zoomView(v, mid, 1.4));
    else if (e.key === 'ArrowLeft') setView(v => panView(v, -span / 8));
    else if (e.key === 'ArrowRight') setView(v => panView(v, span / 8));
    else if (e.key === '0') setView(DEFAULT_VIEW);
    else return;
    e.preventDefault();
  };

  const xstep = niceStep(view.x1 - view.x0), ystep = niceStep(y1 - y0);
  const xt = [], yt = [];
  for (let i = Math.ceil(view.x0 / xstep); i <= Math.floor(view.x1 / xstep); i++) xt.push(i * xstep);
  for (let i = Math.ceil(y0 / ystep); i <= Math.floor(y1 / ystep); i++) yt.push(i * ystep);
  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${h}`} className="ftc-svg" role="img" tabIndex={0} aria-label={`${label}. Scroll or pinch to zoom, drag to pan; plus, minus and arrow keys also work.`}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
      onDoubleClick={() => setView(DEFAULT_VIEW)} onKeyDown={onKeyDown}>
      <defs><clipPath id={id}><rect x={PAD.l} y={PAD.t} width={IW} height={ih} /></clipPath></defs>
      {xt.map(v => (
        <g key={'x' + v}>
          <line x1={sx(v)} x2={sx(v)} y1={PAD.t} y2={PAD.t + ih} className={Math.abs(v) < xstep * 1e-6 ? 'ftc-axis' : 'ftc-grid'} />
          <text x={sx(v)} y={h - 6} textAnchor="middle" className="ftc-tick">{fmtTick(v, xstep)}</text>
        </g>
      ))}
      {yt.map(v => (
        <g key={'y' + v}>
          <line x1={PAD.l} x2={PAD.l + IW} y1={sy(v)} y2={sy(v)} className={Math.abs(v) < ystep * 1e-6 ? 'ftc-axis' : 'ftc-grid'} />
          <text x={PAD.l - 5} y={sy(v) + 4} textAnchor="end" className="ftc-tick">{fmtTick(v, ystep)}</text>
        </g>
      ))}
      <g clipPath={`url(#${id})`}>{children(sx, sy, view)}</g>
    </svg>
  );
}

// a straight line y = y0 + m(t − x0) across the whole plot
const Line = ({ sx, sy, v, x0, y0, m, color, dash, width = 2 }) => (
  <line x1={sx(v.x0)} y1={sy(y0 + m * (v.x0 - x0))} x2={sx(v.x1)} y2={sy(y0 + m * (v.x1 - x0))}
    stroke={color} strokeWidth={width} strokeDasharray={dash} />
);
const Dot = ({ sx, sy, x, y, color, r = 5 }) => (
  Number.isFinite(y) ? <circle cx={sx(x)} cy={sy(y)} r={r} fill={color} stroke="#fff" strokeWidth="1.5" /> : null
);

// module-level so the <input> isn't remounted while dragging
export function Slider({ label, value, min, max, step, onChange, shown }) {
  return (
    <label className="ftc-slider">
      <span className="frac-label">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} aria-label={label} />
      <span className="ftc-val">{shown ?? fmt(value)}</span>
    </label>
  );
}

export default function CalculusLab() {
  const [mode, setMode] = useState('area');
  const [presetId, setPresetId] = useState('sq');
  const [custom, setCustom] = useState('x^3 - 2x');
  const [xRaw, setX] = useState(1);
  const [aRaw, setA] = useState(0);
  const [bRaw, setB] = useState(2);
  const [gapIdx, setGapIdx] = useState(1);
  const [C, setC] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState(DEFAULT_VIEW);

  // The sliders always span the visible window. A point that falls outside it is held at the edge
  // (and returns to where it was when you zoom back out).
  const span = view.x1 - view.x0;
  const sStep = niceStep(span, 160);
  const sMin = parseFloat((Math.ceil(view.x0 / sStep) * sStep).toFixed(12));
  const sMax = parseFloat((Math.floor(view.x1 / sStep) * sStep).toFixed(12));
  const inView = v => Math.min(sMax, Math.max(sMin, v));
  const [x, a, b] = [inView(xRaw), inView(aRaw), inView(bRaw)];
  const fmtX = v => fmtTick(v, niceStep(span, 400));

  const preset = PRESETS.find(p => p.id === presetId);
  const parsed = useMemo(() => parse(preset.id === 'custom' ? custom : preset.text), [preset, custom]);
  const f = parsed.fn;

  const XS = useMemo(() => linspace(view.x0, view.x1, N), [view]);
  const ys = useMemo(() => (f ? XS.map(f) : null), [f, XS]);
  const dys = useMemo(() => (f && mode === 'slope' ? XS.map(t => slope(f, t)) : null), [f, mode, XS]);
  const areaYs = useMemo(() => (ys && mode === 'area' ? cumulative(ys, XS, integrate(f, a, XS[0])) : null), [f, ys, XS, mode, a]);
  // antiderivative along the window: exact for presets, numerical (zero at x = −4) for your own curve
  const Fys = useMemo(() => {
    if (!ys || mode !== 'change') return null;
    return preset.F ? XS.map(preset.F) : cumulative(ys, XS, integrate(f, LO, XS[0]));
  }, [f, ys, XS, mode, preset]);
  const zoom = (HI - LO) / span;
  const zoomBy = k => setView(v => zoomView(v, (v.x0 + v.x1) / 2, k));
  const focusX = mode === 'change' ? (aRaw + bRaw) / 2 : xRaw;
  const centerOn = () => setView(v => { const half = (v.x1 - v.x0) / 2; return clampView(focusX - half, focusX + half); });

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => setX(v => Math.min(sMax, v + sStep)), 40);
    return () => clearInterval(t);
  }, [playing, sStep, sMax]);
  useEffect(() => { if (playing && xRaw >= sMax) setPlaying(false); }, [playing, xRaw, sMax]);

  const pickMode = m => { setPlaying(false); setMode(m); };
  const togglePlay = () => { if (!playing) setX(x >= sMax ? sMin : x); setPlaying(p => !p); };

  const curvePicker = (
    <div className="ftc-picker">
      <div className="level-tabs" role="group" aria-label="Choose a curve">
        {PRESETS.map(p => (
          <button key={p.id} type="button" className={'role-tab' + (presetId === p.id ? ' active' : '')}
            aria-pressed={presetId === p.id} onClick={() => setPresetId(p.id)}>{p.label}</button>
        ))}
      </div>
      {preset.id === 'custom' && (
        <div className="ftc-custom">
          <label className="frac-label" htmlFor="ftc-expr">f(x) =</label>
          <input id="ftc-expr" className="ftc-input" value={custom} spellCheck={false} placeholder="e.g. x^2 - 2x, sin(2x), abs(x)"
            onChange={e => setCustom(e.target.value)} />
          {parsed.error && <span className="ftc-err">⚠️ {parsed.error}</span>}
        </div>
      )}
      {f && <div className="ftc-fx"><strong>f(x) = {preset.id === 'custom' ? custom : preset.label}</strong></div>}
    </div>
  );

  let body = <div className="frame-note">Type a function of x above — for example <strong>x^2 - 2x</strong> or <strong>sin(2x)</strong>.</div>;
  let aside = null;

  if (f && mode === 'slope') {
    const h = GAP_FRACTIONS[gapIdx] * span;
    const fx = f(x), m = slope(f, x);
    const secant = h > 0 ? (f(x + h) - fx) / h : m;
    const [yr1, yr2] = [yRange(ys), yRange(dys)];
    body = (<>
      <div className="ftc-controls">
        <Slider label="point x" value={x} min={sMin} max={sMax} step={sStep} shown={fmtX(x)} onChange={setX} />
        <Slider label="gap h" value={gapIdx} min={0} max={GAP_FRACTIONS.length - 1} step={1} onChange={setGapIdx}
          shown={h > 0 ? fmtX(h) : '→ 0'} />
      </div>
      <Plot view={view} setView={setView} id="ftc-slope-f" h={250} yr={yr1} label="The curve f with a secant and tangent line">
        {(sx, sy, v) => (<>
          <path d={linePath(XS, ys, sx, sy)} fill="none" stroke={COLORS.f} strokeWidth="2.5" />
          <Line sx={sx} sy={sy} v={v} x0={x} y0={fx} m={m} color={COLORS.tangent} dash="6 4" />
          {h > 0 && Number.isFinite(secant) && <Line sx={sx} sy={sy} v={v} x0={x} y0={fx} m={secant} color={COLORS.secant} />}
          {h > 0 && <Dot sx={sx} sy={sy} x={x + h} y={f(x + h)} color={COLORS.secant} />}
          <Dot sx={sx} sy={sy} x={x} y={fx} color={COLORS.f} r={6} />
        </>)}
      </Plot>
      <div className="ftc-cap">The slope of f(x)'s tangent, plotted as its own curve — this is the derivative f′:</div>
      <Plot view={view} setView={setView} id="ftc-slope-d" h={170} yr={yr2} label="The derivative f prime">
        {(sx, sy, v) => (<>
          <path d={linePath(XS, dys, sx, sy)} fill="none" stroke={COLORS.deriv} strokeWidth="2.5" />
          <line x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(m)} stroke={COLORS.deriv} strokeDasharray="4 3" />
          <Dot sx={sx} sy={sy} x={x} y={m} color={COLORS.deriv} r={6} />
        </>)}
      </Plot>
      <div className="frame-note">
        {h > 0 && <>🟠 <strong>Secant slope</strong> (over a gap of {fmtX(h)}) = {fmt(secant)}<br /></>}
        🟢 <strong>Tangent slope</strong> f′({fmtX(x)}) ≈ {fmt(m)}
        {m === 0 && ' — flat! The curve is at a peak, a valley or a plateau.'}
      </div>
    </>);
    aside = (<>
      <h4>💡 What you're seeing</h4>
      <div className="graph-facts">
        <p>The <strong>derivative</strong> is the slope of the tangent line: f′(x) = lim<sub>h→0</sub> [f(x+h) − f(x)] / h.</p>
        <p>Drag <strong>gap h</strong> toward 0: the orange secant swings round until it lies on the green tangent.</p>
        <p>Where the curve rises, f′ is above the axis; where it falls, f′ is below. Where the tangent is flat, f′ = 0.</p>
        <p>Try it: slide <strong>x</strong> along sin x. The slope curve looks just like cos x! 🤔</p>
      </div>
    </>);
  }

  if (f && mode === 'area') {
    const Ax = integrate(f, a, x);
    const fx = f(x), d = 1e-3;
    const measured = (integrate(f, a, x + d) - integrate(f, a, x - d)) / (2 * d);
    body = (<>
      <div className="ftc-controls">
        <Slider label="start a" value={a} min={sMin} max={sMax} step={sStep} shown={fmtX(a)} onChange={setA} />
        <Slider label="end x" value={x} min={sMin} max={sMax} step={sStep} shown={fmtX(x)} onChange={v => { setPlaying(false); setX(v); }} />
        <button type="button" className="btn btn-ghost" onClick={togglePlay}>{playing ? '⏸ Pause' : '▶ Sweep x'}</button>
      </div>
      <div className="ftc-cap">The curve f, with the signed area from a to x shaded:</div>
      <Plot view={view} setView={setView} id="ftc-area-f" h={230} yr={yRange(ys)} label="The curve f with the area from a to x shaded">
        {(sx, sy, v) => (<>
          <path d={regionPath(f, a, x, 1, v, sx, sy)} fill={COLORS.area} fillOpacity=".22" />
          <path d={regionPath(f, a, x, -1, v, sx, sy)} fill={COLORS.neg} fillOpacity=".25" />
          <path d={linePath(XS, ys, sx, sy)} fill="none" stroke={COLORS.f} strokeWidth="2.5" />
          <line x1={sx(a)} x2={sx(a)} y1={sy(0) - 8} y2={sy(0) + 8} stroke="#334155" strokeWidth="2" />
          {Number.isFinite(fx) && <line x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(fx)} stroke={COLORS.tangent} strokeWidth="2.5" />}
          <Dot sx={sx} sy={sy} x={x} y={fx} color={COLORS.tangent} r={6} />
        </>)}
      </Plot>
      <div className="ftc-cap">A(x) = area collected so far. The green tangent to A has the same slope as the green height of f:</div>
      <Plot view={view} setView={setView} id="ftc-area-a" h={200} yr={yRange(areaYs)} label="The accumulated area A with its tangent line">
        {(sx, sy, v) => (<>
          <path d={linePath(XS, areaYs, sx, sy)} fill="none" stroke={COLORS.area} strokeWidth="2.5" />
          {Number.isFinite(Ax) && Number.isFinite(fx) && <Line sx={sx} sy={sy} v={v} x0={x} y0={Ax} m={fx} color={COLORS.tangent} dash="6 4" />}
          <Dot sx={sx} sy={sy} x={x} y={Ax} color={COLORS.tangent} r={6} />
        </>)}
      </Plot>
      <div className="frame-note">
        <strong>A(x) = ∫<sub>{fmtX(a)}</sub><sup>{fmtX(x)}</sup> f(t) dt = {fmt(Ax)}</strong><br />
        Slope of the tangent to A at x: <strong>{fmt(measured)}</strong> &nbsp;|&nbsp; Height of f at x: <strong>{fmt(fx)}</strong>
        {Number.isFinite(measured) && Number.isFinite(fx) && Math.abs(measured - fx) < 0.01 * (1 + Math.abs(fx)) && ' ✅ equal!'}
      </div>
    </>);
    aside = (<>
      <h4>💡 Fundamental Theorem, part 1</h4>
      <div className="graph-facts">
        <p>Let <strong>A(x) = ∫<sub>a</sub><sup>x</sup> f(t) dt</strong> — the area gathered between a and x.</p>
        <p>Then <strong>A′(x) = f(x)</strong>. The rate the area grows is exactly the height of the curve there. Taller curve → area piles up faster.</p>
        <p>Blue area counts positive, <span style={{ color: COLORS.neg }}>red area counts negative</span>.</p>
        <p>Try it: press <strong>▶ Sweep x</strong> on sin x. When f dips below the axis, A turns around and falls. Where f = 0, A has a peak or valley (tangent slope 0).</p>
        <p>Move the start <strong>a</strong>: the whole A curve slides up or down, but its slope at each x doesn't change.</p>
      </div>
    </>);
  }

  if (f && mode === 'change') {
    const I = integrate(f, a, b);
    const Fv = t => (preset.F ? preset.F(t) : integrate(f, LO, t));
    const Fa = Fv(a) + C, Fb = Fv(b) + C, diff = Fb - Fa;
    const shifted = Fys.map(v => v + C);
    const match = Number.isFinite(I) && Number.isFinite(diff) && Math.abs(I - diff) < 1e-4 * (1 + Math.abs(I));
    body = (<>
      <div className="ftc-controls">
        <Slider label="lower a" value={a} min={sMin} max={sMax} step={sStep} shown={fmtX(a)} onChange={setA} />
        <Slider label="upper b" value={b} min={sMin} max={sMax} step={sStep} shown={fmtX(b)} onChange={setB} />
        <Slider label="constant C" value={C} min={-3} max={3} step={0.5} onChange={setC} />
      </div>
      <div className="ftc-cap">The area under f from a to b:</div>
      <Plot view={view} setView={setView} id="ftc-change-f" h={220} yr={yRange(ys)} label="The curve f with the area from a to b shaded">
        {(sx, sy, v) => (<>
          <path d={regionPath(f, a, b, 1, v, sx, sy)} fill={COLORS.area} fillOpacity=".22" />
          <path d={regionPath(f, a, b, -1, v, sx, sy)} fill={COLORS.neg} fillOpacity=".25" />
          <path d={linePath(XS, ys, sx, sy)} fill="none" stroke={COLORS.f} strokeWidth="2.5" />
          {[a, b].map((t, i) => <line key={i} x1={sx(t)} x2={sx(t)} y1={sy(0) - 8} y2={sy(0) + 8} stroke="#334155" strokeWidth="2" />)}
        </>)}
      </Plot>
      <div className="ftc-cap">Any antiderivative F(x) + C — only the <em>rise</em> from a to b matters:</div>
      <Plot view={view} setView={setView} id="ftc-change-F" h={210} yr={yRange(shifted)} label="An antiderivative F with the rise from a to b marked">
        {(sx, sy, v) => (<>
          <path d={linePath(XS, shifted, sx, sy)} fill="none" stroke={COLORS.deriv} strokeWidth="2.5" />
          {Number.isFinite(diff) && (<>
            <line x1={sx(a)} x2={sx(b)} y1={sy(Fa)} y2={sy(Fa)} stroke="#64748b" strokeDasharray="5 4" />
            <line x1={sx(b)} x2={sx(b)} y1={sy(Fa)} y2={sy(Fb)} stroke={COLORS.secant} strokeWidth="6" />
            <text x={sx(b) + (b > 3 ? -10 : 10)} y={sy((Fa + Fb) / 2) + 4} textAnchor={b > 3 ? 'end' : 'start'} className="ftc-rise">rise</text>
          </>)}
          <Dot sx={sx} sy={sy} x={a} y={Fa} color="#334155" />
          <Dot sx={sx} sy={sy} x={b} y={Fb} color="#334155" />
        </>)}
      </Plot>
      <div className="frame-note">
        <strong>{preset.F ? `F(x) = ${preset.Ftext} + C` : 'F(x) = (numerical antiderivative) + C'}</strong> &nbsp; (C = {fmt(C)})<br />
        F(b) − F(a) = {fmt(Fb)} − ({fmt(Fa)}) = <strong>{fmt(diff)}</strong><br />
        ∫<sub>{fmtX(a)}</sub><sup>{fmtX(b)}</sup> f(x) dx, summed up as thin strips = <strong>{fmt(I)}</strong>
        {match && ' ✅ same answer!'}
      </div>
    </>);
    aside = (<>
      <h4>💡 Fundamental Theorem, part 2</h4>
      <div className="graph-facts">
        <p>If <strong>F′(x) = f(x)</strong> (F is an <em>antiderivative</em> of f), then <strong>∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)</strong>.</p>
        <p>Why? F's slope is f — so F's total rise from a to b adds up all the little bits f · dx, which is exactly the area.</p>
        <p>Slide <strong>C</strong>: the F curve moves up and down, but the orange rise F(b) − F(a) never changes. That's why the +C vanishes in definite integrals.</p>
        <p>Move <strong>b</strong> left of <strong>a</strong>: the signed area and the rise both flip sign together.</p>
        {!preset.F && <p>For your own curve the lab builds F numerically, since there's no formula to look up.</p>}
      </div>
    </>);
  }

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <div className="lesson-controls">
          <div className="level-tabs" role="group" aria-label="Lesson step">
            {MODES.map(m => (
              <button key={m.id} type="button" className={'role-tab' + (mode === m.id ? ' active' : '')}
                aria-pressed={mode === m.id} onClick={() => pickMode(m.id)}>{m.label}</button>
            ))}
          </div>
        </div>
        {curvePicker}
        <div className="ftc-zoombar">
          <button type="button" className="btn btn-ghost stepper-btn" onClick={() => zoomBy(1 / 1.6)} aria-label="Zoom in">＋</button>
          <button type="button" className="btn btn-ghost stepper-btn" onClick={() => zoomBy(1.6)} aria-label="Zoom out">−</button>
          <button type="button" className="btn btn-ghost" onClick={centerOn}>🎯 Center on {mode === 'change' ? 'a–b' : 'x'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => setView(DEFAULT_VIEW)}>⟲ Reset</button>
          <span className="ftc-zoomlabel">🔍 ×{zoom >= 10 ? Math.round(zoom) : parseFloat(zoom.toFixed(2))}</span>
          <span className="muted ftc-hint">scroll to zoom · drag to pan · double-click to reset</span>
        </div>
        {body}
      </section>
      <aside className="lesson-steps">
        {aside}
        <div className="graph-facts ftc-big">
          <p><strong>The big idea:</strong> differentiating and integrating are opposites. Slope ↔ area.</p>
        </div>
      </aside>
    </div>
  );
}
