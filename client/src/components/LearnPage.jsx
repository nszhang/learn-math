import { useState } from 'react';
import LinearSolveAnimator from './learn/LinearSolveAnimator.jsx';
import ExpLogAnimator from './learn/ExpLogAnimator.jsx';
import LineGraph from './learn/LineGraph.jsx';
import CurveGraph from './learn/CurveGraph.jsx';

const TABS = [
  { id: 'linear', label: '🧮 Linear equations' },
  { id: 'explog', label: '🔢 Exp & log equations' },
  { id: 'linegraph', label: '📈 Lines' },
  { id: 'curvegraph', label: '📉 Curves' }
];

export default function LearnPage({ toast, fireConfetti }) {
  const [tab, setTab] = useState('linear');
  return (
    <main className="page">
      <div className="page-head">
        <h2>🎓 Learn</h2>
        <p className="muted">Watch equations get solved step by step, then play with lines and curves on the graph.</p>
      </div>
      <div className="auth-tabs" style={{ maxWidth: 560, marginBottom: 20 }}>
        {TABS.map(t => (
          <button key={t.id} type="button"
            className={'auth-tab' + (tab === t.id ? ' active' : '')}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'linear' && <LinearSolveAnimator toast={toast} fireConfetti={fireConfetti} />}
      {tab === 'explog' && <ExpLogAnimator toast={toast} fireConfetti={fireConfetti} />}
      {tab === 'linegraph' && <LineGraph toast={toast} fireConfetti={fireConfetti} />}
      {tab === 'curvegraph' && <CurveGraph />}
    </main>
  );
}
