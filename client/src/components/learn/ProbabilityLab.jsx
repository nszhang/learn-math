import { useState } from 'react';
import { fmtNum } from '../../learn/learnLinear.js';

const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export default function ProbabilityLab() {
  const [exp, setExp] = useState('coin');
  const [red, setRed] = useState(3);
  const [blue, setBlue] = useState(5);
  const [results, setResults] = useState(null); // { label, successKey, counts, trials, targetKey }
  const [busy, setBusy] = useState(false);

  const setups = {
    coin: { outcomes: ['Heads', 'Tails'], target: 0, what: 'Heads', p: [1, 2] },
    die: { outcomes: ['1', '2', '3', '4', '5', '6'], target: null, what: 'each face', p: null },
    marbles: { outcomes: ['Red', 'Blue'], target: 0, what: 'Red', p: [red, red + blue] }
  };
  const S = setups[exp];

  function run(times) {
    setBusy(true);
    setTimeout(() => {
      if (exp === 'die') {
        const counts = Array(6).fill(0);
        for (let i = 0; i < times; i++) counts[ri(0, 5)]++;
        setResults({ counts, trials: times, targetKey: null });
      } else {
        const counts = [0, 0];
        const pRed = exp === 'coin' ? 0.5 : red / (red + blue);
        for (let i = 0; i < times; i++) counts[Math.random() < pRed ? 0 : 1]++;
        setResults({ counts, trials: times, targetKey: 0 });
      }
      setBusy(false);
    }, 180);
  }

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <div className="lesson-controls">
          <div className="level-tabs">
            <button type="button" className={'role-tab' + (exp === 'coin' ? ' active' : '')} onClick={() => { setExp('coin'); setResults(null); }}>🪙 Coin</button>
            <button type="button" className={'role-tab' + (exp === 'die' ? ' active' : '')} onClick={() => { setExp('die'); setResults(null); }}>🎲 Die</button>
            <button type="button" className={'role-tab' + (exp === 'marbles' ? ' active' : '')} onClick={() => { setExp('marbles'); setResults(null); }}>🔴 Bag of marbles</button>
          </div>
        </div>

        {exp === 'marbles' && (
          <div className="frac-row" style={{ marginBottom: 12 }}>
            <div className="frac-ctl">
              <span className="frac-label" style={{ color: '#dc2626' }}>red marbles</span>
              <div className="stepper">
                <button type="button" className="btn btn-ghost stepper-btn" onClick={() => setRed(r => Math.max(1, r - 1))} disabled={red <= 1}>−</button>
                <span className="frac-frac">{red}</span>
                <button type="button" className="btn btn-ghost stepper-btn" onClick={() => setRed(r => Math.min(9, r + 1))} disabled={red >= 9}>+</button>
              </div>
            </div>
            <div className="frac-ctl">
              <span className="frac-label" style={{ color: '#2563eb' }}>blue marbles</span>
              <div className="stepper">
                <button type="button" className="btn btn-ghost stepper-btn" onClick={() => setBlue(b => Math.max(1, b - 1))} disabled={blue <= 1}>−</button>
                <span className="frac-frac">{blue}</span>
                <button type="button" className="btn btn-ghost stepper-btn" onClick={() => setBlue(b => Math.min(9, b + 1))} disabled={blue >= 9}>+</button>
              </div>
            </div>
          </div>
        )}

        {exp === 'marbles' && (
          <div className="marble-row">
            {Array.from({ length: red }, (_, i) => <span key={'r' + i} className="marble red" />)}
            {Array.from({ length: blue }, (_, i) => <span key={'b' + i} className="marble blue" />)}
          </div>
        )}

        <div className="frame-note">
          {exp === 'die'
            ? <>Theoretical probability of each face: <strong>1/6</strong> (a fair die has 6 equally likely faces).</>
            : <>Theoretical P({S.what}) = <strong>{S.p[0]}/{S.p[1]}</strong> = {fmtNum(Math.round(S.p[0] / S.p[1] * 1000) / 10)}%</>}
        </div>

        <div className="anim-controls" style={{ margin: '12px 0' }}>
          <button type="button" className="btn btn-primary" onClick={() => run(1)} disabled={busy}>Run 1</button>
          <button type="button" className="btn btn-ghost" onClick={() => run(10)} disabled={busy}>Run 10</button>
          <button type="button" className="btn btn-ghost" onClick={() => run(100)} disabled={busy}>Run 100</button>
          <button type="button" className="btn btn-ghost" onClick={() => run(1000)} disabled={busy}>Run 1000 🚀</button>
        </div>

        {results && (
          <div className="prob-results">
            {S.outcomes.map((label, i) => {
              const count = results.counts[i];
              const pct = results.trials ? Math.round(count / results.trials * 1000) / 10 : 0;
              return (
                <div key={label} className="prob-row">
                  <span className="prob-label">{label}</span>
                  <div className="prob-bar">
                    <div className="prob-fill" style={{ width: pct + '%' }} />
                  </div>
                  <span className="prob-num">{pct}%</span>
                  <span className="muted">({count})</span>
                </div>
              );
            })}
            <div className="frame-note" style={{ marginTop: 10 }}>
              {results.trials >= 100
                ? `After ${results.trials} trials the experimental results hug the theoretical probability closer and closer — that's the <strong>law of large numbers</strong>! 💡`.replace(/<[^>]+>/g, '')
                : 'Run more trials and watch the bars settle toward theory…'}
            </div>
          </div>
        )}
      </section>

      <aside className="lesson-steps">
        <h4>💡 Probability intuition</h4>
        <div className="graph-facts">
          <p><strong>Theoretical probability</strong> = what <em>should</em> happen: favourable ÷ total.</p>
          <p><strong>Experimental probability</strong> = what <em>actually</em> happened when you ran it.</p>
          <p>Small samples can be wildly off — run 10 vs 1000 and see!</p>
          <p>All probabilities live between 0 (impossible) and 1 (certain).</p>
          <p>Try: set the bag to 1 red &amp; 9 blue — how close does 1000 trials get to 10%? 🎯</p>
        </div>
      </aside>
    </div>
  );
}
