import { useState } from 'react';

function Sq({ v, onNudge, lo = 1, hi = 14 }) {
  return (
    <div className="stepper">
      <button type="button" className="btn btn-ghost stepper-btn"
        onClick={() => onNudge(Math.max(lo, v - 1))} disabled={v <= lo}>−</button>
      <span className="frac-frac">{v}</span>
      <button type="button" className="btn btn-ghost stepper-btn"
        onClick={() => onNudge(Math.min(hi, v + 1))} disabled={v >= hi}>+</button>
    </div>
  );
}

export default function AreaExplorer() {
  const [shape, setShape] = useState('rect');
  const [l, setL] = useState(5);
  const [w, setW] = useState(3);
  const [b, setB] = useState(6);
  const [h, setH] = useState(4);

  const U = 28; // px per unit
  const rectArea = l * w, rectPer = 2 * (l + w);
  const triArea = b * h / 2;

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <div className="lesson-controls">
          <div className="level-tabs">
            <button type="button" className={'role-tab' + (shape === 'rect' ? ' active' : '')}
              onClick={() => setShape('rect')}>▭ Rectangle</button>
            <button type="button" className={'role-tab' + (shape === 'tri' ? ' active' : '')}
              onClick={() => setShape('tri')}>◺ Triangle</button>
          </div>
        </div>

        {shape === 'rect' ? (<>
          <div className="frac-row">
            <div className="frac-ctl"><span className="frac-label">length</span><Sq v={l} onNudge={setL} /></div>
            <div className="frac-ctl"><span className="frac-label">width</span><Sq v={w} onNudge={setW} /></div>
          </div>
          <div className="area-stage">
            <svg width={(l + 1) * U} height={(w + 1) * U}>
              {Array.from({ length: l }, (_, i) => Array.from({ length: w }, (_, j) => (
                <rect key={`${i},${j}`} x={i * U + U / 2} y={j * U + U / 2} width={U - 1} height={U - 1}
                  fill="#c7d2fe" stroke="#6366f1" strokeWidth="1" />
              )))}
              <rect x={U / 2} y={U / 2} width={l * U} height={w * U} fill="none" stroke="#4f46e5" strokeWidth="3" />
            </svg>
          </div>
          <div className="frame-note">
            <strong>Area = {l} × {w} = {rectArea} square units</strong> — each little square counts as 1! 🟦<br/>
            <strong>Perimeter = 2({l} + {w}) = {rectPer} units</strong> — the distance walking all the way around.
          </div>
        </>) : (<>
          <div className="frac-row">
            <div className="frac-ctl"><span className="frac-label">base</span><Sq v={b} onNudge={setB} /></div>
            <div className="frac-ctl"><span className="frac-label">height</span><Sq v={h} onNudge={setH} lo={2} /></div>
          </div>
          <div className="area-stage">
            <svg width={(b + 2) * U} height={(h + 1) * U}>
              <polygon points={`${U / 2},${(h + 1 / 2) * U} ${(b + 1 / 2) * U},${(h + 1 / 2) * U} ${U / 2},${U / 2}`}
                fill="rgba(220,38,38,.18)" stroke="#dc2626" strokeWidth="3" />
              <polygon points={`${U / 2},${(h + 1 / 2) * U} ${(b + 1 / 2) * U},${(h + 1 / 2) * U} ${U / 2},${U / 2} ${(b + 1 / 2) * U},${U / 2}`}
                fill="rgba(220,38,38,.30)" stroke="#fca5a5" strokeWidth="1" strokeDasharray="4 3" />
              <line x1={U / 2} y1={U / 4} x2={(b + 1 / 2) * U} y2={U / 4} stroke="#b91c1c" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
          </div>
          <div className="frame-note">
            <strong>Area = ½ × {b} × {h} = {triArea} square units</strong><br/>
            💡 Two copies of the triangle snap together into a {b}×{h} rectangle (dashed twin) — that's WHY the formula is ½ × base × height!
          </div>
        </>)}
      </section>

      <aside className="lesson-steps">
        <h4>💡 Area vs perimeter</h4>
        <div className="graph-facts">
          <p><strong>Area</strong> = how much <em>surface</em> — counted in square units. Picture tiling with unit squares.</p>
          <p><strong>Perimeter</strong> = the walk around the border — plain units.</p>
          <p>The rectangle's unit squares ARE multiplication: {shape === 'rect' ? `${l} rows of ${w}` : 'l rows of w'}.</p>
          <p>Try: 4×6 vs 3×8 — same <em>area</em>, different <em>perimeter</em>? 🤔</p>
        </div>
      </aside>
    </div>
  );
}
