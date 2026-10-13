import { useEffect, useRef, useState } from 'react';
import { Slider } from './CalculusLab.jsx';

/* Complex numbers lab. A complex number a + bi is a point (a, b) on a plane.
   1. What is i?   — i is the quarter turn; two quarter turns make −1
   2. Addition     — slide: walk along u, then along v
   3. Multiplication — stretch by the length, turn by the angle                */

const COLORS = { z: '#4f46e5', u: '#4f46e5', v: '#d97706', sum: '#16a34a', ghost: '#94a3b8', unit: '#0891b2' };
const S = 440, P = 28;
const LIM = 4;                   // how far a point can be dragged

/* ---------- complex arithmetic on {re, im} ---------- */
const C = (re, im) => ({ re, im });
const add = (p, q) => C(p.re + q.re, p.im + q.im);
const mul = (p, q) => C(p.re * q.re - p.im * q.im, p.re * q.im + p.im * q.re);
const modulus = p => Math.hypot(p.re, p.im);
const arg = p => Math.atan2(p.im, p.re);
const polar = (r, t) => C(r * Math.cos(t), r * Math.sin(t));
const I = C(0, 1);

const n = v => { const t = String(parseFloat((Math.round(v * 100) / 100).toFixed(2))); return t === '-0' ? '0' : t.replace('-', '−'); };
const deg = rad => (rad * 180) / Math.PI;
function cfmt(p) {
  const re = Math.round(p.re * 100) / 100, im = Math.round(p.im * 100) / 100;
  const imPart = Math.abs(im) === 1 ? 'i' : n(Math.abs(im)) + 'i';
  if (im === 0) return n(re);
  if (re === 0) return (im < 0 ? '−' : '') + imPart;
  return `${n(re)} ${im < 0 ? '−' : '+'} ${imPart}`;
}

// 0 → 1 over `ms`, driving a re-render each frame; returns [t | null, start]
function useAnim(ms) {
  const [t, setT] = useState(null);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const start = onDone => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const tick = now => {
      const k = Math.min(1, (now - t0) / ms);
      if (k < 1) { setT(k); raf.current = requestAnimationFrame(tick); } else { setT(null); onDone?.(); }
    };
    setT(0);
    raf.current = requestAnimationFrame(tick);
  };
  return [t, start];
}
const ease = k => k * k * (3 - 2 * k);

/* ---------- the Argand plane ---------- */
const niceR = need => [5, 10, 20, 40, 80].find(r => r >= need) || 160;

function Arrow({ sx, sy, from = C(0, 0), to, color, width = 3, dash }) {
  const x1 = sx(from.re), y1 = sy(from.im), x2 = sx(to.re), y2 = sy(to.im);
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 3) return null;
  const ux = (x2 - x1) / len, uy = (y2 - y1) / len, hl = Math.min(11, len * 0.5);
  const bx = x2 - ux * hl, by = y2 - uy * hl;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeDasharray={dash} />
      <polygon points={`${x2},${y2} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`} fill={color} />
    </g>
  );
}
// text next to a point; sits on the preferred side unless that would run off the plane
const Label = ({ sx, sy, at, side = 'right', dy = -9, color, children }) => {
  const x = sx(at.re), w = [children].flat().join('').length * 7.8 + 14;
  const left = side === 'left' ? x - w > 4 || x + w > S - 4 : x + w > S - 4;
  return <text x={x + (left ? -11 : 11)} y={sy(at.im) + dy} fill={color} textAnchor={left ? 'end' : 'start'} className="cx-label">{children}</text>;
};
const arcPath = (t0, t1, r, sx, sy) => {
  const m = Math.max(2, Math.ceil(Math.abs(t1 - t0) / 0.1));
  let d = '';
  for (let i = 0; i <= m; i++) { const t = t0 + ((t1 - t0) * i) / m; d += (i ? 'L' : 'M') + sx(r * Math.cos(t)).toFixed(1) + ' ' + sy(r * Math.sin(t)).toFixed(1) + ' '; }
  return d;
};

function Argand({ R, handles, snap, label, children }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(null);
  const sx = x => P + ((x + R) / (2 * R)) * (S - 2 * P);
  const sy = y => P + ((R - y) / (2 * R)) * (S - 2 * P);
  const toData = e => {
    const r = ref.current.getBoundingClientRect();
    const px = ((e.clientX - r.left) * S) / r.width, py = ((e.clientY - r.top) * S) / r.height;
    return C(((px - P) / (S - 2 * P)) * 2 * R - R, R - ((py - P) / (S - 2 * P)) * 2 * R);
  };
  const onMove = e => {
    if (!drag) return;
    const h = handles.find(k => k.id === drag);
    if (!h) return;
    const q = snap ? 0.5 : 0.1, z = toData(e);
    const fix = v => Math.max(-LIM, Math.min(LIM, Math.round(v / q) * q + 0));
    h.set(C(fix(z.re), fix(z.im)));
  };
  const step = R <= 5 ? 1 : R <= 10 ? 2 : R <= 20 ? 5 : R <= 40 ? 10 : 20;
  const ticks = [];
  for (let v = -Math.floor(R / step) * step; v <= R; v += step) if (v !== 0) ticks.push(v);
  return (
    <svg ref={ref} viewBox={`0 0 ${S} ${S}`} className="cx-svg" role="img" aria-label={label}
      onPointerMove={onMove} onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}>
      {ticks.map(v => (
        <g key={v}>
          <line x1={sx(v)} x2={sx(v)} y1={P} y2={S - P} className="ftc-grid" />
          <line x1={P} x2={S - P} y1={sy(v)} y2={sy(v)} className="ftc-grid" />
          <text x={sx(v)} y={sy(0) + 15} textAnchor="middle" className="ftc-tick">{n(v)}</text>
          <text x={sx(0) - 6} y={sy(v) + 4} textAnchor="end" className="ftc-tick">{v === 1 ? 'i' : v === -1 ? '−i' : n(v) + 'i'}</text>
        </g>
      ))}
      <line x1={P} x2={S - P} y1={sy(0)} y2={sy(0)} className="ftc-axis" />
      <line x1={sx(0)} x2={sx(0)} y1={P} y2={S - P} className="ftc-axis" />
      <text x={S - P} y={sy(0) - 6} textAnchor="end" className="cx-axis-name">real</text>
      <text x={sx(0) + 6} y={P + 10} className="cx-axis-name">imaginary</text>
      {children(sx, sy)}
      {handles.map(h => (
        <g key={h.id} className="cx-handle" onPointerDown={e => { e.currentTarget.setPointerCapture?.(e.pointerId); setDrag(h.id); }}>
          <circle cx={sx(h.z.re)} cy={sy(h.z.im)} r="18" fill="transparent" />
          <circle cx={sx(h.z.re)} cy={sy(h.z.im)} r="7" fill={h.color} stroke="#fff" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

const TABS = [
  { id: 'plane', label: '① What is i?' },
  { id: 'add', label: '② Adding' },
  { id: 'mul', label: '③ Multiplying' }
];

/* a pair of real/imaginary sliders for one complex number */
function PartSliders({ name, z, set }) {
  return (
    <div className="ftc-controls">
      <Slider label={`${name} real`} value={z.re} min={-LIM} max={LIM} step={0.5} onChange={v => set(C(v, z.im))} />
      <Slider label={`${name} imag.`} value={z.im} min={-LIM} max={LIM} step={0.5} onChange={v => set(C(z.re, v))} />
    </div>
  );
}

export default function ComplexLab() {
  const [tab, setTab] = useState('plane');
  const [snap, setSnap] = useState(true);
  const [z, setZ] = useState(C(3, 2));
  const [u, setU] = useState(C(3, 1));
  const [v, setV] = useState(C(1, 2));
  const [p, setP] = useState(C(2, 1));
  const [q, setQ] = useState(C(1, 1));
  const [turn, startTurn] = useAnim(550);
  const [walk, startWalk] = useAnim(1800);
  const [morph, startMorph] = useAnim(1800);

  let body = null, aside = null;

  if (tab === 'plane') {
    const shown = turn === null ? z : mul(z, polar(1, (Math.PI / 2) * ease(turn)));
    const ghosts = [1, 2, 3].map(k => mul(z, [I, C(-1, 0), C(0, -1)][k - 1]));
    const names = ['i · z', 'i² · z = −z', 'i³ · z = −i·z'];
    const r = modulus(z), th = arg(z);
    body = (<>
      <PartSliders name="a" z={z} set={setZ} />
      <Argand R={5} snap={snap} label="The complex plane with the number z and its three quarter turns"
        handles={[{ id: 'z', z: shown, color: COLORS.z, set: setZ }]}>
        {(sx, sy) => (<>
          {r > 0 && <path d={arcPath(0, 2 * Math.PI, r, sx, sy)} fill="none" stroke={COLORS.ghost} strokeDasharray="4 4" />}
          {r > 0 && <polygon points={[z, ...ghosts].map(g => `${sx(g.re)},${sy(g.im)}`).join(' ')} fill="rgba(79,70,229,.06)" stroke="none" />}
          {ghosts.map((g, i) => (<g key={i}>
            <circle cx={sx(g.re)} cy={sy(g.im)} r="5" fill={COLORS.ghost} />
            <Label sx={sx} sy={sy} at={g} color="#64748b">{names[i]}</Label>
          </g>))}
          {/* z split into "a steps right" and "b steps up" */}
          <line x1={sx(0)} y1={sy(0)} x2={sx(shown.re)} y2={sy(0)} stroke={COLORS.z} strokeWidth="2" strokeDasharray="5 4" />
          <line x1={sx(shown.re)} y1={sy(0)} x2={sx(shown.re)} y2={sy(shown.im)} stroke={COLORS.v} strokeWidth="2" strokeDasharray="5 4" />
          <Arrow sx={sx} sy={sy} to={shown} color={COLORS.z} />
          <Label sx={sx} sy={sy} at={shown} color={COLORS.z}>z = {cfmt(shown)}</Label>
          {r > 0 && <path d={arcPath(0, th, 0.7, sx, sy)} fill="none" stroke={COLORS.sum} strokeWidth="2" />}
        </>)}
      </Argand>
      <div className="ftc-controls">
        <button type="button" className="btn" disabled={turn !== null}
          onClick={() => startTurn(() => setZ(w => C(-w.im, w.re)))}>↻ Multiply z by i</button>
        <button type="button" className="btn btn-ghost" onClick={() => setZ(C(3, 2))}>⟲ Reset</button>
        <label className="ftc-check"><input type="checkbox" checked={snap} onChange={e => setSnap(e.target.checked)} /> snap to grid</label>
      </div>
      <div className="frame-note">
        <strong>z = {n(z.re)} + {n(z.im)}i</strong> means: <span style={{ color: COLORS.z }}>{n(z.re)} step{Math.abs(z.re) === 1 ? '' : 's'} right</span>, then <span style={{ color: COLORS.v }}>{n(z.im)} step{Math.abs(z.im) === 1 ? '' : 's'} up</span>.<br />
        Distance from 0: |z| = √({n(z.re)}² + {n(z.im)}²) = <strong>{n(r)}</strong> &nbsp;|&nbsp; angle: <strong>{r > 0 ? n(deg(th)) + '°' : '—'}</strong><br />
        i · z = i({cfmt(z)}) = {n(z.re)}i + {n(z.im)}i² = <strong>{cfmt(C(-z.im, z.re))}</strong> — same length, turned 90°.
      </div>
    </>);
    aside = (<>
      <h4>💡 Where do complex numbers come from?</h4>
      <div className="graph-facts">
        <p>Ordinary numbers live on a <strong>line</strong>: they only move you left or right.</p>
        <p>A complex number <strong>a + bi</strong> lives on a <strong>plane</strong>: <em>a</em> steps right, <em>b</em> steps up. The <strong>i</strong> just means "this part goes up".</p>
        <p>Multiplying by <strong>−1</strong> flips a number to the other side of 0 — a <strong>half turn</strong>.</p>
        <p>What could make a <strong>quarter turn</strong>? Call it <strong>i</strong>. Do it twice and you've made a half turn: <strong>i · i = −1</strong>.</p>
        <p>Press <strong>↻ Multiply z by i</strong> four times — you're back where you started: i⁴ = 1.</p>
        <p>Drag z, or use the sliders. Nothing "imaginary" about it — i is just the <em>up</em> direction. 🧭</p>
      </div>
    </>);
  }

  if (tab === 'add') {
    const sum = add(u, v);
    // the "walk": 0 → u, then u → u + v
    const k = walk === null ? null : ease(walk) * 2;
    const walker = k === null ? null : k <= 1 ? C(u.re * k, u.im * k) : C(u.re + v.re * (k - 1), u.im + v.im * (k - 1));
    body = (<>
      <PartSliders name="u" z={u} set={setU} />
      <PartSliders name="v" z={v} set={setV} />
      <Argand R={niceR(Math.max(Math.abs(sum.re), Math.abs(sum.im)) * 1.1)} snap={snap} label="Adding two complex numbers u and v on the plane"
        handles={[{ id: 'u', z: u, color: COLORS.u, set: setU }, { id: 'v', z: v, color: COLORS.v, set: setV }]}>
        {(sx, sy) => (<>
          <polygon points={[C(0, 0), u, sum, v].map(g => `${sx(g.re)},${sy(g.im)}`).join(' ')} fill="rgba(22,163,74,.10)" />
          <Arrow sx={sx} sy={sy} from={u} to={sum} color={COLORS.v} width={2} dash="6 4" />
          <Arrow sx={sx} sy={sy} from={v} to={sum} color={COLORS.u} width={2} dash="6 4" />
          <Arrow sx={sx} sy={sy} to={u} color={COLORS.u} />
          <Arrow sx={sx} sy={sy} to={v} color={COLORS.v} />
          <Arrow sx={sx} sy={sy} to={sum} color={COLORS.sum} width={4} />
          <Label sx={sx} sy={sy} at={u} color={COLORS.u}>u = {cfmt(u)}</Label>
          <Label sx={sx} sy={sy} at={v} side="left" color={COLORS.v}>v = {cfmt(v)}</Label>
          <Label sx={sx} sy={sy} at={sum} color={COLORS.sum}>u + v = {cfmt(sum)}</Label>
          {walker && <circle cx={sx(walker.re)} cy={sy(walker.im)} r="8" fill="#0f172a" stroke="#fff" strokeWidth="2" />}
        </>)}
      </Argand>
      <div className="ftc-controls">
        <button type="button" className="btn" disabled={walk !== null} onClick={() => startWalk()}>🚶 Walk: u, then v</button>
        <label className="ftc-check"><input type="checkbox" checked={snap} onChange={e => setSnap(e.target.checked)} /> snap to grid</label>
      </div>
      <div className="frame-note">
        (<span style={{ color: COLORS.u }}>{cfmt(u)}</span>) + (<span style={{ color: COLORS.v }}>{cfmt(v)}</span>)
        = ({n(u.re)} + {n(v.re)}) + ({n(u.im)} + {n(v.im)})i = <strong style={{ color: COLORS.sum }}>{cfmt(sum)}</strong><br />
        Real parts add. Imaginary parts add. Nothing else happens.
      </div>
    </>);
    aside = (<>
      <h4>💡 Adding = sliding</h4>
      <div className="graph-facts">
        <p>Think of each number as a <strong>trip</strong> from 0: <span style={{ color: COLORS.u }}>u</span> is one trip, <span style={{ color: COLORS.v }}>v</span> is another.</p>
        <p><strong>u + v</strong> is the two trips back to back: go along u, then from there go along v. Press <strong>🚶 Walk</strong> to watch.</p>
        <p>Going v-then-u ends at the same place — that's the <strong>parallelogram</strong>. So u + v = v + u.</p>
        <p>Adding a complex number <strong>slides</strong> every point the same distance in the same direction.</p>
        <p>Try it: make v = −u. Where does the walk end? 🤔</p>
      </div>
    </>);
  }

  if (tab === 'mul') {
    const prod = mul(p, q);
    const rp = modulus(p), rq = modulus(q), tp = arg(p), tq = arg(q);
    // the multiplier shrinks into place: factor(t) goes from 1 (do nothing) to q
    const t = morph === null ? 1 : ease(morph);
    const factor = rq > 1e-9 ? polar(Math.pow(rq, t), tq * t) : C(1 - t, 0);
    const moved = mul(p, factor);
    const square = [C(0, 0), C(1, 0), C(1, 1), C(0, 1)].map(g => mul(g, factor));
    const sumDeg = deg(tp) + deg(tq), prodDeg = deg(arg(prod));
        const R = niceR(Math.max(Math.abs(prod.re), Math.abs(prod.im), 1) * 1.1);
    body = (<>
      <PartSliders name="p" z={p} set={setP} />
      <PartSliders name="q" z={q} set={setQ} />
      <div className="ftc-controls">
        <span className="frac-label">multiply by</span>
        {[['i', C(0, 1)], ['−1', C(-1, 0)], ['2', C(2, 0)], ['½', C(0.5, 0)], ['1 + i', C(1, 1)]].map(([lab, val]) => (
          <button key={lab} type="button" className="btn btn-ghost" onClick={() => setQ(val)}>{lab}</button>
        ))}
        <button type="button" className="btn" disabled={morph !== null} onClick={() => startMorph()}>▶ Stretch &amp; turn</button>
      </div>
      <Argand R={R} snap={snap} label="Multiplying p by q: the length multiplies and the angles add"
        handles={[{ id: 'p', z: p, color: COLORS.u, set: setP }, { id: 'q', z: q, color: COLORS.v, set: setQ }]}>
        {(sx, sy) => (<>
          {/* where multiplying by q sends the unit square: 1 lands on q, i lands on i·q */}
          <polygon points={square.map(g => `${sx(g.re)},${sy(g.im)}`).join(' ')} fill="rgba(217,119,6,.14)" stroke={COLORS.v} strokeDasharray="4 3" />
          <polygon points={[C(0, 0), C(1, 0), C(1, 1), C(0, 1)].map(g => `${sx(g.re)},${sy(g.im)}`).join(' ')} fill="rgba(100,116,139,.10)" stroke={COLORS.ghost} />
          <path d={arcPath(0, 2 * Math.PI, 1, sx, sy)} fill="none" stroke={COLORS.unit} strokeDasharray="3 4" />
          {rp > 0 && <path d={arcPath(0, tp, 0.55, sx, sy)} fill="none" stroke={COLORS.u} strokeWidth="2.5" />}
          {rp > 0 && rq > 0 && <path d={arcPath(tp, tp + tq, 0.8, sx, sy)} fill="none" stroke={COLORS.v} strokeWidth="2.5" />}
          <Arrow sx={sx} sy={sy} to={p} color={COLORS.u} />
          <Arrow sx={sx} sy={sy} to={q} color={COLORS.v} />
          <Arrow sx={sx} sy={sy} to={moved} color={COLORS.sum} width={4} />
          <Label sx={sx} sy={sy} at={p} color={COLORS.u}>p = {cfmt(p)}</Label>
          <Label sx={sx} sy={sy} at={q} side="left" color={COLORS.v}>q = {cfmt(q)}</Label>
          <Label sx={sx} sy={sy} at={moved} color={COLORS.sum}>p·q = {cfmt(moved)}</Label>
        </>)}
      </Argand>
      <label className="ftc-check"><input type="checkbox" checked={snap} onChange={e => setSnap(e.target.checked)} /> snap to grid</label>
      <div className="frame-note">
        <strong>Lengths multiply:</strong> |p|·|q| = {n(rp)} × {n(rq)} = <strong>{n(rp * rq)}</strong> = |p·q| = {n(modulus(prod))}<br />
        {rp > 0 && rq > 0
          ? <><strong>Angles add:</strong> {n(deg(tp))}° + {n(deg(tq))}° = <strong>{n(sumDeg)}°</strong>{Math.abs(sumDeg - prodDeg) > 1e-6 ? ` (the same direction as ${n(prodDeg)}°)` : ''} — the direction of p·q ✅<br /></>
          : <><strong>Angles add:</strong> the number 0 has no direction, so the product is just 0.<br /></>}
        <strong>Algebra:</strong> ({cfmt(p)})({cfmt(q)}) = {n(p.re * q.re)} + {n(p.re * q.im)}i + {n(p.im * q.re)}i + {n(p.im * q.im)}i²
        = ({n(p.re * q.re)} − {n(p.im * q.im)}) + ({n(p.re * q.im)} + {n(p.im * q.re)})i = <strong>{cfmt(prod)}</strong>
      </div>
    </>);
    aside = (<>
      <h4>💡 Multiplying = stretch + turn</h4>
      <div className="graph-facts">
        <p>Every complex number has a <strong>length</strong> (how far from 0) and an <strong>angle</strong> (which way it points).</p>
        <p>Multiplying by <span style={{ color: COLORS.v }}>q</span> does two things to <span style={{ color: COLORS.u }}>p</span>: <strong>stretches</strong> it by |q| and <strong>turns</strong> it by q's angle. So lengths <em>multiply</em> and angles <em>add</em>.</p>
        <p>The shaded square shows what happens to the whole plane: <strong>1</strong> lands on <strong>q</strong>, and <strong>i</strong> lands on <strong>i·q</strong> — a rotated, scaled copy.</p>
        <p>Check <strong>× i</strong>: length 1 (no stretch), angle 90° (a quarter turn). Do it twice: 90° + 90° = 180°, so <strong>i² = −1</strong>.</p>
        <p>Check <strong>× 2</strong> (stretch only) and <strong>× −1</strong> (turn 180° only).</p>
        <p>Press <strong>▶ Stretch &amp; turn</strong> to watch the multiplication happen gradually.</p>
      </div>
    </>);
  }

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <div className="lesson-controls">
          <div className="level-tabs" role="group" aria-label="Lesson step">
            {TABS.map(t => (
              <button key={t.id} type="button" className={'role-tab' + (tab === t.id ? ' active' : '')}
                aria-pressed={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
        </div>
        <p className="muted cx-hint">Drag the dots on the plane, or use the sliders.</p>
        {body}
      </section>
      <aside className="lesson-steps">{aside}</aside>
    </div>
  );
}
