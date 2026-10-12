import { useEffect, useState } from 'react';
import { fmtNum } from '../../learn/learnLinear.js';

const BASE_MIN = -12, BASE_MAX = 12;

export default function IntegerHopper() {
  const [start, setStart] = useState(-3);
  const [ops, setOps] = useState([
    { sign: +1, val: 5 },
    { sign: -1, val: 2 }
  ]);
  const [step, setStep] = useState(0);        // how many hops applied
  const [playing, setPlaying] = useState(false);

  const positions = [start];
  ops.forEach(o => positions.push(positions[positions.length - 1] + o.sign * o.val));
  const pos = positions[step];
  const done = step >= ops.length;
  // widen the number line if the hops would leave the default window
  const MIN = Math.min(BASE_MIN, ...positions) - 1, MAX = Math.max(BASE_MAX, ...positions) + 1;

  useEffect(() => {
    if (!playing || done) return;
    const t = setTimeout(() => setStep(s => Math.min(s + 1, ops.length)), 800);
    return () => clearTimeout(t);
  });

  function reset() {
    setStep(0); setPlaying(false);
  }

  const W = 640, PADX = 30;
  const x = v => PADX + (v - MIN) * ((W - 2 * PADX) / (MAX - MIN));
  const H = 150;

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <h3 style={{ marginBottom: 10 }}>🦘 Hopper: adding &amp; subtracting on the number line</h3>

        <div className="frac-row">
          <div className="frac-ctl">
            <span className="frac-label">start at</span>
            <div className="stepper">
              <button type="button" className="btn btn-ghost stepper-btn" onClick={() => { setStart(v => Math.max(-9, v - 1)); reset(); }} disabled={start <= -9}>−</button>
              <span className="frac-frac">{start}</span>
              <button type="button" className="btn btn-ghost stepper-btn" onClick={() => { setStart(v => Math.min(9, v + 1)); reset(); }} disabled={start >= 9}>+</button>
            </div>
          </div>
          {ops.map((o, i) => (
            <div key={i} className="frac-ctl">
              <span className="frac-label">hop {i + 1}</span>
              <div className="stepper">
                <button type="button" className="btn btn-ghost stepper-btn"
                  onClick={() => setOps(o_ => o_.map((x_, j) => j === i ? { ...x_, sign: -x_.sign } : x_))}
                  title="flip direction">{o.sign > 0 ? '➕' : '➖'}</button>
                <span className="frac-frac">{o.val}</span>
                <button type="button" className="btn btn-ghost stepper-btn"
                  onClick={() => setOps(o_ => o_.map((x_, j) => j === i ? { ...x_, val: Math.min(9, x_.val + 1) } : x_))} disabled={o.val >= 9}>+</button>
                <button type="button" className="btn btn-ghost stepper-btn"
                  onClick={() => setOps(o_ => o_.map((x_, j) => j === i ? { ...x_, val: Math.max(1, x_.val - 1) } : x_))} disabled={o.val <= 1}>−</button>
              </div>
            </div>
          ))}
        </div>

        <div className="anim-controls" style={{ margin: '10px 0' }}>
          <button type="button" className="btn btn-primary" onClick={() => { reset(); setPlaying(true); }} disabled={playing || done}>▶ Play hops</button>
          <button type="button" className="btn btn-ghost" onClick={() => setStep(s => Math.min(s + 1, ops.length))} disabled={playing || done}>⏭ One hop</button>
          <button type="button" className="btn btn-ghost" onClick={reset}>↺ Reset</button>
        </div>

        <svg width={W} height={H}>
          {Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i).map(v => (
            <g key={v}>
              <line x1={x(v)} y1={v % 5 === 0 ? 58 : 64} x2={x(v)} y2={74} stroke="#94a3b8" strokeWidth={v % 5 === 0 ? 2 : 1} />
              {v % 5 === 0 && <text x={x(v)} y={90} fontSize="11" fill="#94a3b8" textAnchor="middle">{v}</text>}
            </g>
          ))}
          <line x1={PADX - 10} y1={66} x2={W - PADX + 10} y2={66} stroke="#64748b" strokeWidth="2.5" />

          {/* hop arrows */}
          {ops.map((o, i) => step > i && (
            <g key={i}>
              <line x1={x(positions[i])} y1={48 - i * 14} x2={x(positions[i + 1])} y2={48 - i * 14}
                stroke={o.sign > 0 ? '#16a34a' : '#dc2626'} strokeWidth="2.5" markerEnd="url(#arrw)" />
              <text x={(x(positions[i]) + x(positions[i + 1])) / 2} y={44 - i * 14} fontSize="10"
                fill={o.sign > 0 ? '#16a34a' : '#dc2626'} textAnchor="middle">
                {o.sign > 0 ? '+' : '−'}{o.val}
              </text>
            </g>
          ))}
          <defs>
            <marker id="arrw" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#475569" />
            </marker>
          </defs>

          {/* the hopper */}
          <g style={{ transition: 'transform .45s ease' }} transform={`translate(${x(pos)}, 38)`}>
            <circle r="11" fill="#f59e0b" stroke="#b45309" strokeWidth="2.5" />
            <circle r="2.2" fill="#78350f" cx="-3.5" cy="-1.5" />
            <circle r="2.2" fill="#78350f" cx="3.5" cy="-1.5" />
          </g>
          <text x={x(pos)} y={20} fontSize="13" fontWeight="800" fill="#b45309" textAnchor="middle">{pos}</text>
        </svg>

        <div className="frame-note">
          Expression: <strong>{fmtNum(start)} {ops.map(o => `${o.sign > 0 ? '+' : '−'} ${o.val}`).join(' ')} = {fmtNum(positions[ops.length])}</strong>
          {!done && ' — hop along to get there!'} {done && ' ✓'}
        </div>
      </section>

      <aside className="lesson-steps">
        <h4>💡 Integer intuition</h4>
        <div className="graph-facts">
          <p><strong>Adding</strong> = hopping <em>right</em> (toward bigger numbers).</p>
          <p><strong>Subtracting</strong> = hopping <em>left</em>.</p>
          <p>Subtracting a <em>negative</em> flips the hop into a right-hop — two flips make a forward!</p>
          <p>Negative numbers aren't "less than nothing" — they're just steps to the <em>left of zero</em>.</p>
          <p>Try: start at −8, hop +5 then −2. Where do you land? 🎯</p>
        </div>
      </aside>
    </div>
  );
}
