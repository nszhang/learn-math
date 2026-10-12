import { useState } from 'react';
import { fmtNum } from '../../learn/learnLinear.js';

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

function Bar({ n, d, color }) {
  return (
    <div className="frac-bar" style={{ background: '#e2e8f0' }}>
      {Array.from({ length: d }, (_, i) => (
        <div key={i} className={'frac-seg' + (i < n ? ' filled' : '')}
          style={i < n ? { background: color } : {}} />
      ))}
    </div>
  );
}

function FracSteppers({ label, n, d, setN, setD, color }) {
  const nudge = (setter, v, lo, hi) => setter(Math.min(hi, Math.max(lo, v)));
  return (
    <div className="frac-ctl">
      <span className="frac-label" style={{ color }}>{label}</span>
      <div className="stepper">
        <button type="button" className="btn btn-ghost stepper-btn" onClick={() => nudge(setN, n - 1, 0, d)} disabled={n <= 0}>−</button>
        <span className="frac-frac">{n}</span>
        <button type="button" className="btn btn-ghost stepper-btn" onClick={() => nudge(setN, n + 1, 0, d)} disabled={n >= d}>+</button>
      </div>
      <div className="stepper">
        <button type="button" className="btn btn-ghost stepper-btn" onClick={() => nudge(setD, d - 1, 1, 12)} disabled={d <= 1}>−</button>
        <span className="frac-frac">{d}</span>
        <button type="button" className="btn btn-ghost stepper-btn" onClick={() => nudge(setD, d + 1, 1, 12)} disabled={d >= 12}>+</button>
      </div>
    </div>
  );
}

export default function FractionLab() {
  const [n1, setN1] = useState(1), [d1, setD1] = useState(2);
  const [n2, setN2] = useState(2), [d2, setD2] = useState(3);

  const simp = (n, d) => { const g = gcd(n, d) || 1; return `${n / g}/${d / g}`; };
  const cmp = n1 * d2 === n2 * d1 ? '=' : n1 * d2 > n2 * d1 ? '>' : '<';
  const sumN = n1 * d2 + n2 * d1, sumD = d1 * d2;
  const sumSimple = simp(sumN, sumD);
  const [sumN2, sumD2] = sumSimple.split('/').map(Number);
  const dec1 = (n1 / d1).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  const pct1 = Math.round(n1 / d1 * 100);

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <h3 style={{ marginBottom: 12 }}>🍕 Compare, simplify, and add fractions</h3>
        <div className="frac-row">
          <FracSteppers label="Fraction 1" n={n1} d={d1} setN={setN1} setD={setD1} color="#4f46e5" />
          <FracSteppers label="Fraction 2" n={n2} d={d2} setN={setN2} setD={setD2} color="#dc2626" />
        </div>

        <div className="frac-bars">
          <div>
            <Bar n={n1} d={d1} color="#4f46e5" />
            <div className="frac-note">{n1}/{d1} = {dec1} ≈ {pct1}%{simp(n1, d1) !== `${n1}/${d1}` && <> · simplified: <strong>{simp(n1, d1)}</strong></>}</div>
          </div>
          <div>
            <Bar n={n2} d={d2} color="#dc2626" />
            <div className="frac-note">{n2}/{d2}{simp(n2, d2) !== `${n2}/${d2}` && <> · simplified: <strong>{simp(n2, d2)}</strong>}</>}</div>
          </div>
        </div>

        <div className="frame-note">
          <strong>{n1}/{d1} {cmp} {n2}/{d2}</strong> — cross-multiply to compare: {n1}×{d2} = {n1 * d2} vs {n2}×{d1} = {n2 * d1}.
          {cmp === '=' && ' Same value — they are equivalent fractions! 💡'}
        </div>

        <div className="frac-sum">
          <h4>Addition</h4>
          <div className="frac-math">
            {n1}/{d1} + {n2}/{d2} = {n1 * d2}/{sumD} + {n2 * d1}/{sumD} = <strong>{sumN}/{sumD}</strong>
            {sumSimple !== `${sumN}/${sumD}` && <> = <strong>{sumSimple}</strong></>}
          </div>
          {sumD2 <= 12 && sumN2 <= sumD2 && (
            <div>
              <Bar n={sumN2} d={sumD2} color="#16a34a" />
              <div className="frac-note">💡 Common denominator first — then just add the numerators!</div>
            </div>
          )}
        </div>
      </section>

      <aside className="lesson-steps">
        <h4>💡 Fraction intuition</h4>
        <div className="graph-facts">
          <p>The <strong>denominator</strong> sets the size of the pieces — more pieces = smaller pieces!</p>
          <p>The <strong>numerator</strong> counts how many pieces you have.</p>
          <p>Equivalent fractions look different but fill the <em>same amount</em> of the bar.</p>
          <p>To add, rewrite both with a <strong>common denominator</strong> (same piece size), then add counts.</p>
          <p>Try: make 1/2 and 2/4 — do the bars match? 🎯</p>
        </div>
      </aside>
    </div>
  );
}
