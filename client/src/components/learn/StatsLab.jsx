import { useState } from 'react';

const DEFAULT = [2, 4, 4, 6, 9];

export default function StatsLab() {
  const [data, setData] = useState(DEFAULT);

  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const counts = {};
  data.forEach(v => counts[v] = (counts[v] || 0) + 1);
  const maxCount = Math.max(...Object.values(counts));
  const modes = maxCount > 1 ? Object.keys(counts).filter(k => counts[k] === maxCount).map(Number) : [];
  const range = sorted[n - 1] - sorted[0];

  const MAXV = 15;
  const W = 560, H = 230, PAD = 26;
  const x = v => PAD + (v - 1) * ((W - 2 * PAD) / (MAXV - 1));

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <h3 style={{ marginBottom: 6 }}>📊 Live dot plot — adjust the data!</h3>
        <div className="stats-ctl">
          {data.map((v, i) => (
            <div key={i} className="stats-chip">
              <button type="button" className="btn btn-ghost stepper-btn" aria-label={'dec ' + i}
                onClick={() => setData(d => d.map((x_, j) => j === i ? Math.max(1, x_ - 1) : x_))} disabled={v <= 1}>−</button>
              <span className="frac-frac">{v}</span>
              <button type="button" className="btn btn-ghost stepper-btn" aria-label={'inc ' + i}
                onClick={() => setData(d => d.map((x_, j) => j === i ? Math.min(MAXV, x_ + 1) : x_))} disabled={v >= MAXV}>+</button>
              {n > 3 && <button type="button" className="btn btn-ghost expr-del" aria-label={'remove ' + i}
                onClick={() => setData(d => d.filter((_, j) => j !== i))}>✕</button>}
            </div>
          ))}
          {n < 9 && (
            <button type="button" className="btn btn-ghost" onClick={() => setData(d => [...d, 5])}>＋ Add value</button>
          )}
        </div>

        <svg width={W} height={H}>
          {Array.from({ length: MAXV }, (_, i) => i + 1).map(v => (
            <g key={v}>
              <line x1={x(v)} y1={PAD - 8} x2={x(v)} y2={H - PAD} stroke="#e2e8f0" />
              <text x={x(v)} y={H - PAD + 14} fontSize="10" fill="#94a3b8" textAnchor="middle">{v}</text>
            </g>
          ))}
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#94a3b8" strokeWidth="2" />
          {(() => {
            const stacks = {};
            const dots = [];
            // walk the sorted values so each dot knows its rank (for the median highlight)
            sorted.forEach((v, rank) => {
              const level = stacks[v] || 0;
              stacks[v] = level + 1;
              const isMedian = rank === (n - 1) >> 1 || rank === n >> 1;
              const isMode = maxCount > 1 && counts[v] === maxCount;
              dots.push(
                <circle key={`${v}-${level}`} cx={x(v)} cy={H - PAD - 14 - level * 16} r="7"
                  fill={isMedian ? '#f59e0b' : '#4f46e5'} stroke={isMode ? '#16a34a' : '#fff'} strokeWidth={isMode ? 3 : 2} />
              );
            });
            return dots;
          })()}
          {/* mean balance marker */}
          <line x1={x(Math.min(Math.max(mean, 1), MAXV))} y1={PAD - 6} x2={x(Math.min(Math.max(mean, 1), MAXV))} y2={H - PAD}
            stroke="#dc2626" strokeWidth="2.5" strokeDasharray="5 4" />
          <polygon
            points={`${x(Math.min(Math.max(mean, 1), MAXV)) - 7},${PAD - 8} ${x(Math.min(Math.max(mean, 1), MAXV)) + 7},${PAD - 8} ${x(Math.min(Math.max(mean, 1), MAXV))},${PAD + 2}`}
            fill="#dc2626" />
          {/* range bracket */}
          <line x1={x(sorted[0])} y1={16} x2={x(sorted[n - 1])} y2={16} stroke="#0891b2" strokeWidth="2" />
          <text x={(x(sorted[0]) + x(sorted[n - 1])) / 2} y={12} fontSize="10" fill="#0891b2" textAnchor="middle">range</text>
        </svg>

        <div className="stats-readout">
          <div className="stat-pill"><span style={{ color: '#dc2626' }}>mean</span><strong>{Number.isInteger(mean) ? mean : mean.toFixed(2)}</strong></div>
          <div className="stat-pill"><span style={{ color: '#f59e0b' }}>median</span><strong>{Number.isInteger(median) ? median : median.toFixed(1)}</strong></div>
          <div className="stat-pill"><span style={{ color: '#16a34a' }}>mode</span><strong>{modes.length ? modes.join(', ') : 'none'}</strong></div>
          <div className="stat-pill"><span style={{ color: '#0891b2' }}>range</span><strong>{range}</strong></div>
        </div>
        <div className="frame-note">
          mean = ({sorted.join(' + ')}) ÷ {n} = {sum} ÷ {n} = <strong>{Number.isInteger(mean) ? mean : mean.toFixed(2)}</strong> — the <em>balance point</em> of the dots (red triangle) ⚖️
        </div>
      </section>

      <aside className="lesson-steps">
        <h4>💡 Reading the dots</h4>
        <div className="graph-facts">
          <p><strong>Mean</strong> — where the dot plot balances (the red marker tilts the whole line level).</p>
          <p><strong>Median</strong> — the middle dot once values are lined up (orange). With an even number of dots it's the average of the two middle ones.</p>
          <p><strong>Mode</strong> — the tallest stack (green ring). Can be more than one — or none!</p>
          <p><strong>Range</strong> — the spread from smallest to largest (cyan bracket).</p>
          <p>Try: push one value way up — watch the mean chase it while the median barely moves! 🎯</p>
        </div>
      </aside>
    </div>
  );
}
