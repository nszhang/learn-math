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

  const U = 18;
  const total = a + b + 3;
  const W = total * U + 2 * a; // room for the square on leg a (drawn left)
  const H = (a + b + 3) * U;

  // right triangle: right angle at (ox, oy); leg a goes up, leg b goes right
  const ox = 2 * a * U / 2 + U, oy = H - U - b * U; // leave room for b-square below
  const A = [ox, oy];                    // top of vertical leg
  const B = [ox, oy + b * U];            // right angle corner... wait: vertical leg length a
  // Simpler geometry: corner C at (ox, oyC); vertical leg to A = (ox, oyC - a*U); horizontal leg to Bp = (ox + b*U, oyC)
  const oyC = H - U - b * U + b * U; // bottom area reserved for b-square of side b*U
  const C = [ox, oyC];
  const Ptop = [ox, oyC - a * U];
  const Pright = [ox + b * U, oyC];

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <h3 style={{ marginBottom: 12 }}>📐 Watch a² + b² = c² come alive</h3>
        <div className="frac-row">
          <Sq label="leg a" v={a} onNudge={setA} />
          <Sq label="leg b" v={b} onNudge={setB} />
        </div>

        <div className="area-stage">
          <svg width={W} height={H}>
            {/* square on leg a (left of vertical leg) */}
            <rect x={ox - a * U} y={oyC - a * U} width={a * U} height={a * U}
              fill="rgba(79,70,229,.22)" stroke="#4f46e5" strokeWidth="2.5" />
            <text x={ox - a * U / 2} y={oyC - a * U / 2} textAnchor="middle" fontWeight="800" fill="#4f46e5">a² = {a * a}</text>

            {/* square on leg b (below horizontal leg) */}
            <rect x={ox} y={oyC} width={b * U} height={b * U}
              fill="rgba(220,38,38,.18)" stroke="#dc2626" strokeWidth="2.5" />
            <text x={ox + b * U / 2} y={oyC + b * U / 2} textAnchor="middle" fontWeight="800" fill="#dc2626">b² = {b * b}</text>

            {/* square on hypotenuse (rotated) */}
            <polygon
              points={[
                `${Ptop[0]},${Ptop[1]}`, `${Pright[0]},${Pright[1]}`,
                `${Pright[0] - a * U},${Pright[1] - a * U}`, `${Ptop[0] - a * U},${Ptop[1] - a * U}`
              ].join(' ')}
              fill="rgba(22,163,74,.18)" stroke="#16a34a" strokeWidth="2.5" />
            <text x={(Ptop[0] + Pright[0] - a * U) / 2} y={(Ptop[1] + Pright[1] - a * U) / 2}
              textAnchor="middle" fontWeight="800" fill="#16a34a">c² = {c2}</text>

            {/* the triangle itself */}
            <polygon points={`${Ptop[0]},${Ptop[1]} ${Pright[0]},${Pright[1]} ${C[0]},${C[1]}`}
              fill="rgba(245,158,11,.4)" stroke="#b45309" strokeWidth="3" />
            <rect x={C[0]} y={C[1] - U * 0.5} width={U * 0.5} height={U * 0.5} fill="#b45309" />
          </svg>
        </div>

        <div className="frame-note">
          <strong>a² + b² = c²</strong>: {a * a} + {b * b} = <strong>{c2}</strong>, so c = √{c2} = <strong>{fmtNum(Number(c.toFixed(3)))}</strong>.<br/>
          {isTriple
            ? `💡 (${a}, ${b}, ${c}) is a <strong>Pythagorean triple</strong> — all three sides are whole numbers!`.replace(/<[^>]+>/g, '')
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
