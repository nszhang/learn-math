import { useState } from 'react';

function Sq({ label, v, onNudge, lo = 1, hi = 8, color }) {
  return (
    <div className="frac-ctl">
      <span className="frac-label" style={color ? { color } : {}}>{label}</span>
      <div className="stepper">
        <button type="button" className="btn btn-ghost stepper-btn" onClick={() => onNudge(Math.max(lo, v - 1))} disabled={v <= lo}>−</button>
        <span className="frac-frac">{v}</span>
        <button type="button" className="btn btn-ghost stepper-btn" onClick={() => onNudge(Math.min(hi, v + 1))} disabled={v >= hi}>+</button>
      </div>
    </div>
  );
}

const X = 4; // visual length representing x

export default function FactoringLab() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [reveal, setReveal] = useState(false);

  const U = 34;
  const W = (X + b) * U + 60;
  const H = (X + a) * U + 60;
  const ox = 44, oy = 30;

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <h3 style={{ marginBottom: 10 }}>🧩 Algebra tiles: (x + a)(x + b) — factoring you can <em>see</em></h3>

        <div className="frac-row">
          <Sq label="a (height)" v={a} onNudge={v => { setA(v); setReveal(false); }} color="#4f46e5" />
          <Sq label="b (width)" v={b} onNudge={v => { setB(v); setReveal(false); }} color="#dc2626" />
        </div>

        <div className="area-stage">
          <svg width={W} height={H}>
            {/* x² tile */}
            <rect x={ox} y={oy} width={X * U} height={X * U} fill="rgba(245,158,11,.35)" stroke="#b45309" strokeWidth="2.5" />
            <text x={ox + X * U / 2} y={oy + X * U / 2} textAnchor="middle" fontWeight="800" fill="#b45309">x²</text>

            {/* x·b tile (top-right) */}
            <rect x={ox + X * U} y={oy} width={b * U} height={X * U} fill="rgba(220,38,38,.18)" stroke="#dc2626" strokeWidth="2.5" />
            <text x={ox + X * U + b * U / 2} y={oy + X * U / 2} textAnchor="middle" fontWeight="800" fill="#dc2626">{b}x</text>

            {/* x·a tile (bottom-left) */}
            <rect x={ox} y={oy + X * U} width={X * U} height={a * U} fill="rgba(79,70,229,.18)" stroke="#4f46e5" strokeWidth="2.5" />
            <text x={ox + X * U / 2} y={oy + X * U + a * U / 2} textAnchor="middle" fontWeight="800" fill="#4f46e5">{a}x</text>

            {/* a·b tile (bottom-right) */}
            <rect x={ox + X * U} y={oy + X * U} width={b * U} height={a * U} fill="rgba(22,163,74,.2)" stroke="#16a34a" strokeWidth="2.5" />
            <text x={ox + X * U + b * U / 2} y={oy + X * U + a * U / 2} textAnchor="middle" fontWeight="800" fill="#16a34a">{a * b}</text>

            {/* dimension labels */}
            <text x={ox + X * U / 2} y={oy - 10} textAnchor="middle" fontWeight="700" fill="#64748b">x</text>
            <text x={ox + X * U + b * U / 2} y={oy - 10} textAnchor="middle" fontWeight="700" fill="#dc2626">+{b}</text>
            <text x={ox - 12} y={oy + X * U / 2} textAnchor="middle" fontWeight="700" fill="#64748b" transform={`rotate(-90 ${ox - 12} ${oy + X * U / 2})`}>x</text>
            <text x={ox - 12} y={oy + X * U + a * U / 2} textAnchor="middle" fontWeight="700" fill="#4f46e5" transform={`rotate(-90 ${ox - 12} ${oy + X * U + a * U / 2})`}>+{a}</text>
          </svg>
        </div>

        <div className="frame-note">
          Multiplying out (the whole rectangle's area):<br/>
          <strong>(x + {a})(x + {b}) = x² + {a + b}x + {a * b}</strong>
          <span className="tile-legend">
            <span style={{ color: '#b45309' }}>x²</span> + <span style={{ color: '#dc2626' }}>{b}x</span> + <span style={{ color: '#4f46e5' }}>{a}x</span> + <span style={{ color: '#16a34a' }}>{a * b}</span>
          </span>
        </div>

        <div className="anim-controls" style={{ marginTop: 10 }}>
          <button type="button" className="btn btn-primary" onClick={() => setReveal(r => !r)}>
            {reveal ? '🙈 Hide the reverse' : '🔄 Factor it back (reverse!)'}
          </button>
        </div>

        {reveal && (
          <div className="frame-note">
            💡 <strong>Factoring is the reverse</strong>: for x² + {a + b}x + {a * b}, find two numbers that
            <em> add to {a + b}</em> and <em>multiply to {a * b}</em>: that's <strong>{a} and {b}</strong> —
            the exact sizes of the green and strip tiles!
            <br/>x² + {a + b}x + {a * b} = <strong>(x + {a})(x + {b})</strong> ✓
          </div>
        )}
      </section>

      <aside className="lesson-steps">
        <h4>💡 Why factoring works</h4>
        <div className="graph-facts">
          <p>Multiplication IS area. The big rectangle splits into four tiles — the distributive law made visible.</p>
          <p>The two strips (<span style={{ color: '#dc2626' }}>{b}x</span> and <span style={{ color: '#4f46e5' }}>{a}x</span>) combine into {(a + b)}x because they're like terms.</p>
          <p>To factor x² + Sx + P: hunt for the two numbers with sum <strong>S</strong> and product <strong>P</strong> — they're literally the tile sizes.</p>
          <p>Try a = 4, b = 5: 4 + 5 = 9 and 4 × 5 = 20, so x² + 9x + 20 = (x + 4)(x + 5). 🎯</p>
        </div>
      </aside>
    </div>
  );
}
