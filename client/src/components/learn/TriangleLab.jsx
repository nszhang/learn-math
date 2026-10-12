import { useState } from 'react';
import { fmtNum } from '../../learn/learnLinear.js';

function Sq({ label, v, onNudge, lo = 1, hi = 10 }) {
  return (
    <div className="frac-ctl">
      <span className="frac-label">{label}</span>
      <div className="stepper">
        <button type="button" className="btn btn-ghost stepper-btn" onClick={() => onNudge(Math.max(lo, v - 1))} disabled={v <= lo}>−</button>
        <span className="frac-frac">{v}</span>
        <button type="button" className="btn btn-ghost stepper-btn" onClick={() => onNudge(Math.min(hi, v + 1))} disabled={v >= hi}>+</button>
      </div>
    </div>
  );
}

export default function TriangleLab() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c2 = a * a + b * b;
  const c = Math.sqrt(c2);
  const isTriple = Number.isInteger(c);

  // Right angle at C. Leg a goes up from C to P, leg b goes right from C to Q.
  // Squares are drawn outward on each side; the hypotenuse P→Q = (b, a)·U, so its
  // outward (up-right) normal of the same length c·U is n = (a, −b)·U.
  const U = 20, pad = 12;
  const W = (2 * a + b) * U + 2 * pad;
  const H = (a + 2 * b) * U + 2 * pad;
  const cx = a * U + pad, cy = (a + b) * U + pad;
  const P = [cx, cy - a * U];
  const Q = [cx + b * U, cy];
  const n = [a * U, -b * U];
  const hypSquare = [P, Q, [Q[0] + n[0], Q[1] + n[1]], [P[0] + n[0], P[1] + n[1]]];
  const hypCenter = [(P[0] + Q[0] + n[0]) / 2, (P[1] + Q[1] + n[1]) / 2];

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <h3 style={{ marginBottom: 12 }}>📐 Watch a² + b² = c² come alive</h3>
        <div className="frac-row">
          <Sq label="leg a" v={a} onNudge={setA} />
          <Sq label="leg b" v={b} onNudge={setB} />
        </div>

        <div className="area-stage">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }} role="img"
            aria-label={`Right triangle with legs ${a} and ${b} and a square on each side`}>
            {/* square on leg a (left of the vertical leg) */}
            <rect x={cx - a * U} y={cy - a * U} width={a * U} height={a * U}
              fill="rgba(79,70,229,.22)" stroke="#4f46e5" strokeWidth="2.5" />
            <text x={cx - a * U / 2} y={cy - a * U / 2} textAnchor="middle" dominantBaseline="middle"
              fontWeight="800" fill="#4f46e5">a² = {a * a}</text>

            {/* square on leg b (below the horizontal leg) */}
            <rect x={cx} y={cy} width={b * U} height={b * U}
              fill="rgba(220,38,38,.18)" stroke="#dc2626" strokeWidth="2.5" />
            <text x={cx + b * U / 2} y={cy + b * U / 2} textAnchor="middle" dominantBaseline="middle"
              fontWeight="800" fill="#dc2626">b² = {b * b}</text>

            {/* square on the hypotenuse (tilted, side length c) */}
            <polygon points={hypSquare.map(p => p.join(',')).join(' ')}
              fill="rgba(22,163,74,.18)" stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round" />
            <text x={hypCenter[0]} y={hypCenter[1]} textAnchor="middle" dominantBaseline="middle"
              fontWeight="800" fill="#16a34a">c² = {c2}</text>

            {/* the triangle itself, with its right-angle marker at C */}
            <polygon points={`${P} ${Q} ${cx},${cy}`}
              fill="rgba(245,158,11,.4)" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
            <rect x={cx} y={cy - U * 0.5} width={U * 0.5} height={U * 0.5} fill="none" stroke="#b45309" strokeWidth="2" />
          </svg>
        </div>

        <div className="frame-note">
          <strong>a² + b² = c²</strong>: {a * a} + {b * b} = <strong>{c2}</strong>, so c = √{c2} = <strong>{fmtNum(Number(c.toFixed(3)))}</strong>.<br/>
          {isTriple
            ? <>💡 ({a}, {b}, {c}) is a <strong>Pythagorean triple</strong> — all three sides are whole numbers!</>
            : '💡 Square root undoes the square — that inverse gives us c.'}
        </div>
      </section>

      <aside className="lesson-steps">
        <h4>💡 See it, don't memorize it</h4>
        <div className="graph-facts">
          <p>Each side of the right triangle <em>carries a square</em>. The two smaller squares (indigo a² and red b²) hold exactly enough area to fill the big green square (c²).</p>
          <p>Area never lies: that's why a² + b² = c² works for <em>every</em> right triangle.</p>
          <p>Famous triples to try: (3,4,5), (6,8,10), (5,12,13) — the last needs bigger legs, so trust the numbers! 🎯</p>
          <p>The little corner square marks the <strong>right angle</strong> — the theorem only applies when it's there.</p>
        </div>
      </aside>
    </div>
  );
}
