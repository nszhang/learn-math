import { useState } from 'react';
import LinearSolveAnimator from './learn/LinearSolveAnimator.jsx';
import ExpLogAnimator from './learn/ExpLogAnimator.jsx';
import LineGraph from './learn/LineGraph.jsx';
import CurveGraph from './learn/CurveGraph.jsx';
import FractionLab from './learn/FractionLab.jsx';
import AreaExplorer from './learn/AreaExplorer.jsx';
import StatsLab from './learn/StatsLab.jsx';
import ProbabilityLab from './learn/ProbabilityLab.jsx';
import TriangleLab from './learn/TriangleLab.jsx';
import IntegerHopper from './learn/IntegerHopper.jsx';
import FactoringLab from './learn/FactoringLab.jsx';
import CalculusLab from './learn/CalculusLab.jsx';
import ComplexLab from './learn/ComplexLab.jsx';
import BedmasLab from './learn/BedmasLab.jsx';
import { clickable } from '../a11y.js';

const GROUPS = [
  {
    name: '🔢 Numbers & operations', lessons: [
      { id: 'fractions', emoji: '🍕', title: 'Fraction lab', desc: 'Compare, simplify & add fractions with live bars' },
      { id: 'integers', emoji: '🦘', title: 'Integer hopper', desc: 'Hop along the number line to add & subtract' },
      { id: 'bedmas', emoji: '🧮', title: 'BEDMAS: order of operations', desc: 'Watch expressions simplify step by step — then pick the next step yourself' },
      { id: 'linear', emoji: '🧮', title: 'Linear equations', desc: 'Animated balance-scale solver, step by step' }
    ]
  },
  {
    name: '📐 Geometry & measurement', lessons: [
      { id: 'area', emoji: '▭', title: 'Area & perimeter', desc: 'Count unit squares; see why the formulas work' },
      { id: 'pythagoras', emoji: '📐', title: 'Pythagoras explorer', desc: 'Watch a² + b² = c² as living squares' },
      { id: 'lines', emoji: '📈', title: 'Lines playground', desc: 'y = mx + b with slope triangle & match game' }
    ]
  },
  {
    name: '📊 Data & chance', lessons: [
      { id: 'stats', emoji: '📊', title: 'Statistics lab', desc: 'Dot plot with live mean, median, mode & range' },
      { id: 'probability', emoji: '🎲', title: 'Probability lab', desc: 'Flip, roll & draw — watch experiment meet theory' }
    ]
  },
  {
    name: '🧬 Algebra & beyond', lessons: [
      { id: 'factoring', emoji: '🧩', title: 'Factoring tiles', desc: 'See (x + a)(x + b) as area — and factor it back' },
      { id: 'explog', emoji: '🔢', title: 'Exp & log equations', desc: 'Animated steps from bˣ = v to x' },
      { id: 'curves', emoji: '📉', title: 'Curves playground', desc: 'y = a·bˣ, logs & the Desmos-style grapher' },
      { id: 'complex', emoji: '🧭', title: 'Complex numbers', desc: 'What i really is — and what adding and multiplying do on the plane' }
    ]
  },
  {
    name: '∫ Calculus', lessons: [
      { id: 'ftc', emoji: '∫', title: 'Fundamental Theorem of Calculus', desc: 'Pick a curve; see its tangent, the area under it, and why they undo each other' }
    ]
  }
];

const LESSONS = {};
GROUPS.forEach(g => g.lessons.forEach(l => { LESSONS[l.id] = { ...l, group: g.name }; }));

export default function LearnPage({ toast, fireConfetti, initialOpen = null, myGrade = null, onPractice = null }) {
  const [open, setOpen] = useState(initialOpen);

  if (open) {
    const L = LESSONS[open];
    const props = { toast, fireConfetti };
    return (
      <main className="page">
        <div className="page-head grade-head">
          <button className="btn btn-ghost" type="button" onClick={() => setOpen(null)}>← All lessons</button>
          <div>
            <h2>{L.emoji} {L.title}</h2>
            <p className="muted">{L.desc}</p>
          </div>
        </div>
        {open === 'linear' && <LinearSolveAnimator {...props} />}
        {open === 'explog' && <ExpLogAnimator {...props} />}
        {open === 'lines' && <LineGraph {...props} />}
        {open === 'curves' && <CurveGraph />}
        {open === 'fractions' && <FractionLab />}
        {open === 'area' && <AreaExplorer />}
        {open === 'stats' && <StatsLab />}
        {open === 'probability' && <ProbabilityLab />}
        {open === 'pythagoras' && <TriangleLab />}
        {open === 'integers' && <IntegerHopper />}
        {open === 'factoring' && <FactoringLab />}
        {open === 'ftc' && <CalculusLab />}
        {open === 'complex' && <ComplexLab />}
        {open === 'bedmas' && <BedmasLab {...props} myGrade={myGrade} onPractice={onPractice} />}
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-head">
        <h2>🎓 Learn</h2>
        <p className="muted">Interactive labs and animated lessons — play with the math until it makes sense.</p>
      </div>
      {GROUPS.map(g => (
        <div key={g.name} style={{ marginBottom: 18 }}>
          <h3 className="section-title">{g.name}</h3>
          <div className="grade-grid">
            {g.lessons.map(l => (
              <div className="grade-card" key={l.id} {...clickable(() => setOpen(l.id))}>
                <div className="lesson-card-emoji">{l.emoji}</div>
                <div className="grade-card-top">
                  <span className="grade-num" style={{ fontSize: '1.05rem' }}>{l.title}</span>
                </div>
                <p className="grade-includes muted">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
