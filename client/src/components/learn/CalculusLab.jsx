import { useEffect, useMemo, useState } from 'react';
import { parse } from '../../learn/parser.js';

/* Fundamental Theorem of Calculus lab: three linked views of one curve.
   1. slope  — a secant line that closes in on the tangent (the derivative)
   2. area   — FTC part 1: the area collected so far, A(x), has slope f(x)
   3. change — FTC part 2: ∫ₐᵇ f = F(b) − F(a) for any antiderivative F  */

const LO = -4, HI = 4, N = 800;
const STEP = (HI - LO) / N;
const XS = Array.from({ length: N + 1 }, (_, i) => LO + i * STEP);
const W = 560, PAD = { l: 40, r: 12, t: 10, b: 22 };
const SLIDER_STEP = 0.05;
const GAPS = [2, 1.2, 0.7, 0.4, 0.2, 0.1, 0.03, 0]; // secant gap h; 0 = the tangent itself

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
const idx = x => Math.max(0, Math.min(N, Math.round((x - LO) / STEP)));

// Simpson's rule; NaN if f is undefined anywhere in [lo, hi]
function integrate(f, lo, hi) {
  if (lo === hi) return 0;
  const n = 200, h = (hi - lo) / n;
  let s = f(lo) + f(hi);
  for (let i = 1; i < n; i++) s += f(lo + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}
const slope = (f, x) => (f(x + 1e-4) - f(x - 1e-4)) / 2e-4;

// running integral (trapezoid) over the grid, starting from grid index i0 (value 0 there)
function cumulative(ys, i0) {
  const out = new Array(N + 1).fill(NaN);
  out[i0] = 0;
  for (let i = i0 + 1; i <= N; i++) out[i] = out[i - 1] + ((ys[i] + ys[i - 1]) / 2) * STEP;
  for (let i = i0 - 1; i >= 0; i--) out[i] = out[i + 1] - ((ys[i] + ys[i + 1]) / 2) * STEP;
  return out;
}

function yRange(...arrays) {
  let lo = 0, hi = 0;
  for (const a of arrays) for (const v of a) if (Number.isFinite(v) && Math.abs(v) < 1e4) { if (v < lo) lo = v; if (v > hi) hi = v; }
  if (hi - lo < 1) { hi += 0.5; lo -= 0.5; }
  const pad = (hi - lo) * 0.08;
  return [lo - pad, hi + pad];
}
function niceStep(span) {
  const raw = span / 5, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 5, 10]) if (m * mag >= raw) return m * mag;
  return 10 * mag;
}

/* ---------- drawing helpers ---------- */
function linePath(ys, sx, sy) {
  let d = '', pen = false;
  for (let i = 0; i <= N; i++) {
    const y = ys[i];
    if (!Number.isFinite(y) || Math.abs(y) > 1e6) { pen = false; continue; }
    d += (pen ? 'L' : 'M') + sx(XS[i]).toFixed(1) + ' ' + sy(y).toFixed(1) + ' ';
    pen = true;
  }
  return d;
}
// region between the curve and the x-axis from grid index i0 to i1, keeping only the positive or negative part
function areaPath(ys, i0, i1, sign, sx, sy) {
  if (i0 > i1) [i0, i1] = [i1, i0];
  let d = `M${sx(XS[i0]).toFixed(1)} ${sy(0).toFixed(1)} `;
  for (let i = i0; i <= i1; i++) {
    const v = Number.isFinite(ys[i]) ? ys[i] : 0;
    d += `L${sx(XS[i]).toFixed(1)} ${sy(sign > 0 ? Math.max(v, 0) : Math.min(v, 0)).toFixed(1)} `;
  }
  return d + `L${sx(XS[i1]).toFixed(1)} ${sy(0).toFixed(1)} Z`;
}

function Plot({ id, h, yr, label, children }) {
  const [y0, y1] = yr;
  const iw = W - PAD.l - PAD.r, ih = h - PAD.t - PAD.b;
  const sx = x => PAD.l + ((x - LO) / (HI - LO)) * iw;
  const sy = y => PAD.t + ((y1 - y) / (y1 - y0)) * ih;
  const ystep = niceStep(y1 - y0);
  const yt = [];
  for (let v = Math.ceil(y0 / ystep) * ystep; v <= y1 + 1e-9; v += ystep) yt.push(Math.round(v / ystep) * ystep);
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="ftc-svg" role="img" aria-label={label}>
      <defs><clipPath id={id}><rect x={PAD.l} y={PAD.t} width={iw} height={ih} /></clipPath></defs>
      {Array.from({ length: HI - LO + 1 }, (_, i) => LO + i).map(x => (
        <g key={'x' + x}>
          <line x1={sx(x)} x2={sx(x)} y1={PAD.t} y2={PAD.t + ih} className={x === 0 ? 'ftc-axis' : 'ftc-grid'} />
          <text x={sx(x)} y={h - 6} textAnchor="middle" className="ftc-tick">{x}</text>
        </g>
      ))}
      {yt.map(v => (
        <g key={'y' + v}>
          <line x1={PAD.l} x2={PAD.l + iw} y1={sy(v)} y2={sy(v)} className={Math.abs(v) < 1e-9 ? 'ftc-axis' : 'ftc-grid'} />
          <text x={PAD.l - 5} y={sy(v) + 4} textAnchor="end" className="ftc-tick">{parseFloat(v.toFixed(6))}</text>
        </g>
      ))}
      <g clipPath={`url(#${id})`}>{children(sx, sy)}</g>
    </svg>
  );
}

// a straight line y = y0 + m(t − x0) across the whole plot
const Line = ({ sx, sy, x0, y0, m, color, dash, width = 2 }) => (
  <line x1={sx(LO)} y1={sy(y0 + m * (LO - x0))} x2={sx(HI)} y2={sy(y0 + m * (HI - x0))}
    stroke={color} strokeWidth={width} strokeDasharray={dash} />
);
const Dot = ({ sx, sy, x, y, color, r = 5 }) => (
  Number.isFinite(y) ? <circle cx={sx(x)} cy={sy(y)} r={r} fill={color} stroke="#fff" strokeWidth="1.5" /> : null
);

// module-level so the <input> isn't remounted while dragging
function Slider({ label, value, min, max, step, onChange, shown }) {
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
  const [x, setX] = useState(1);
  const [a, setA] = useState(0);
  const [b, setB] = useState(2);
  const [gapIdx, setGapIdx] = useState(1);
  const [C, setC] = useState(0);
  const [playing, setPlaying] = useState(false);

  const preset = PRESETS.find(p => p.id === presetId);
  const parsed = useMemo(() => parse(preset.id === 'custom' ? custom : preset.text), [preset, custom]);
  const f = parsed.fn;

  const ys = useMemo(() => (f ? XS.map(f) : null), [f]);
  const dys = useMemo(() => (f && mode === 'slope' ? XS.map(t => slope(f, t)) : null), [f, mode]);
  const areaYs = useMemo(() => (ys && mode === 'area' ? cumulative(ys, idx(a)) : null), [ys, mode, a]);
  // antiderivative over the grid: exact for presets, numerical (starting at x = −4) for your own curve
  const Fys = useMemo(() => {
    if (!ys || mode !== 'change') return null;
    return preset.F ? XS.map(preset.F) : cumulative(ys, 0);
  }, [ys, mode, preset]);

  useEffect(() => {
    if (!playing) return undefined;
    const t = setInterval(() => setX(v => Math.min(HI, parseFloat((v + SLIDER_STEP).toFixed(2)))), 40);
    return () => clearInterval(t);
  }, [playing]);
  useEffect(() => { if (playing && x >= HI) setPlaying(false); }, [playing, x]);

  const pickMode = m => { setPlaying(false); setMode(m); };
  const togglePlay = () => { if (!playing && x >= HI) setX(LO); setPlaying(p => !p); };

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

  let view = <div className="frame-note">Type a function of x above — for example <strong>x^2 - 2x</strong> or <strong>sin(2x)</strong>.</div>;
  let aside = null;

  if (f && mode === 'slope') {
    const h = GAPS[gapIdx];
    const fx = f(x), m = slope(f, x);
    const secant = h > 0 ? (f(x + h) - fx) / h : m;
    const [yr1, yr2] = [yRange(ys), yRange(dys)];
    view = (<>
      <div className="ftc-controls">
        <Slider label="point x" value={x} min={LO} max={HI} step={SLIDER_STEP} onChange={setX} />
        <Slider label="gap h" value={gapIdx} min={0} max={GAPS.length - 1} step={1} onChange={setGapIdx}
          shown={h > 0 ? String(h) : '→ 0'} />
      </div>
      <Plot id="ftc-slope-f" h={250} yr={yr1} label="The curve f with a secant and tangent line">
        {(sx, sy) => (<>
          <path d={linePath(ys, sx, sy)} fill="none" stroke={COLORS.f} strokeWidth="2.5" />
          <Line sx={sx} sy={sy} x0={x} y0={fx} m={m} color={COLORS.tangent} dash="6 4" />
          {h > 0 && Number.isFinite(secant) && <Line sx={sx} sy={sy} x0={x} y0={fx} m={secant} color={COLORS.secant} />}
          {h > 0 && <Dot sx={sx} sy={sy} x={x + h} y={f(x + h)} color={COLORS.secant} />}
          <Dot sx={sx} sy={sy} x={x} y={fx} color={COLORS.f} r={6} />
        </>)}
      </Plot>
      <div className="ftc-cap">The slope of f(x)'s tangent, plotted as its own curve — this is the derivative f′:</div>
      <Plot id="ftc-slope-d" h={170} yr={yr2} label="The derivative f prime">
        {(sx, sy) => (<>
          <path d={linePath(dys, sx, sy)} fill="none" stroke={COLORS.deriv} strokeWidth="2.5" />
          <line x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(m)} stroke={COLORS.deriv} strokeDasharray="4 3" />
          <Dot sx={sx} sy={sy} x={x} y={m} color={COLORS.deriv} r={6} />
        </>)}
      </Plot>
      <div className="frame-note">
        {h > 0 && <>🟠 <strong>Secant slope</strong> (over a gap of {h}) = {fmt(secant)}<br /></>}
        🟢 <strong>Tangent slope</strong> f′({fmt(x)}) ≈ {fmt(m)}
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
    const ia = idx(a), ix = idx(x);
    view = (<>
      <div className="ftc-controls">
        <Slider label="start a" value={a} min={LO} max={HI} step={SLIDER_STEP} onChange={setA} />
        <Slider label="end x" value={x} min={LO} max={HI} step={SLIDER_STEP} onChange={v => { setPlaying(false); setX(v); }} />
        <button type="button" className="btn btn-ghost" onClick={togglePlay}>{playing ? '⏸ Pause' : '▶ Sweep x'}</button>
      </div>
      <div className="ftc-cap">The curve f, with the signed area from a to x shaded:</div>
      <Plot id="ftc-area-f" h={230} yr={yRange(ys)} label="The curve f with the area from a to x shaded">
        {(sx, sy) => (<>
          <path d={areaPath(ys, ia, ix, 1, sx, sy)} fill={COLORS.area} fillOpacity=".22" />
          <path d={areaPath(ys, ia, ix, -1, sx, sy)} fill={COLORS.neg} fillOpacity=".25" />
          <path d={linePath(ys, sx, sy)} fill="none" stroke={COLORS.f} strokeWidth="2.5" />
          <line x1={sx(a)} x2={sx(a)} y1={sy(0) - 8} y2={sy(0) + 8} stroke="#334155" strokeWidth="2" />
          {Number.isFinite(fx) && <line x1={sx(x)} x2={sx(x)} y1={sy(0)} y2={sy(fx)} stroke={COLORS.tangent} strokeWidth="2.5" />}
          <Dot sx={sx} sy={sy} x={x} y={fx} color={COLORS.tangent} r={6} />
        </>)}
      </Plot>
      <div className="ftc-cap">A(x) = area collected so far. The green tangent to A has the same slope as the green height of f:</div>
      <Plot id="ftc-area-a" h={200} yr={yRange(areaYs)} label="The accumulated area A with its tangent line">
        {(sx, sy) => (<>
          <path d={linePath(areaYs, sx, sy)} fill="none" stroke={COLORS.area} strokeWidth="2.5" />
          {Number.isFinite(Ax) && Number.isFinite(fx) && <Line sx={sx} sy={sy} x0={x} y0={Ax} m={fx} color={COLORS.tangent} dash="6 4" />}
          <Dot sx={sx} sy={sy} x={x} y={Ax} color={COLORS.tangent} r={6} />
        </>)}
      </Plot>
      <div className="frame-note">
        <strong>A(x) = ∫<sub>{fmt(a)}</sub><sup>{fmt(x)}</sup> f(t) dt = {fmt(Ax)}</strong><br />
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
    const ia = idx(a), ib = idx(b);
    const shifted = Fys.map(v => v + C);
    const match = Number.isFinite(I) && Number.isFinite(diff) && Math.abs(I - diff) < 1e-4 * (1 + Math.abs(I));
    view = (<>
      <div className="ftc-controls">
        <Slider label="lower a" value={a} min={LO} max={HI} step={SLIDER_STEP} onChange={setA} />
        <Slider label="upper b" value={b} min={LO} max={HI} step={SLIDER_STEP} onChange={setB} />
        <Slider label="constant C" value={C} min={-3} max={3} step={0.5} onChange={setC} />
      </div>
      <div className="ftc-cap">The area under f from a to b:</div>
      <Plot id="ftc-change-f" h={220} yr={yRange(ys)} label="The curve f with the area from a to b shaded">
        {(sx, sy) => (<>
          <path d={areaPath(ys, ia, ib, 1, sx, sy)} fill={COLORS.area} fillOpacity=".22" />
          <path d={areaPath(ys, ia, ib, -1, sx, sy)} fill={COLORS.neg} fillOpacity=".25" />
          <path d={linePath(ys, sx, sy)} fill="none" stroke={COLORS.f} strokeWidth="2.5" />
          {[a, b].map((t, i) => <line key={i} x1={sx(t)} x2={sx(t)} y1={sy(0) - 8} y2={sy(0) + 8} stroke="#334155" strokeWidth="2" />)}
        </>)}
      </Plot>
      <div className="ftc-cap">Any antiderivative F(x) + C — only the <em>rise</em> from a to b matters:</div>
      <Plot id="ftc-change-F" h={210} yr={yRange(shifted)} label="An antiderivative F with the rise from a to b marked">
        {(sx, sy) => (<>
          <path d={linePath(shifted, sx, sy)} fill="none" stroke={COLORS.deriv} strokeWidth="2.5" />
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
        ∫<sub>{fmt(a)}</sub><sup>{fmt(b)}</sup> f(x) dx, summed up as thin strips = <strong>{fmt(I)}</strong>
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
        {view}
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
