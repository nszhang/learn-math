import { useEffect, useState } from 'react';
import { LESSON_KINDS, generateLesson } from '../../learn/learnExpLog.js';

const SPEEDS = {
  slow:   { label: '🐢 Slow',   ms: 3200 },
  normal: { label: '🚶 Normal', ms: 2200 },
  fast:   { label: '🐇 Fast',   ms: 1200 }
};

export default function LessonAnimator({ toast, fireConfetti }) {
  const [kind, setKind] = useState('exp1');
  const [lesson, setLesson] = useState(() => generateLesson('exp1'));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const done = idx >= lesson.frames.length - 1;

  function newLesson(k = kind) {
    setLesson(generateLesson(k));
    setIdx(0);
    setPlaying(false);
  }

  // autoplay
  useEffect(() => {
    if (!playing || done) return;
    const t = setTimeout(() => setIdx(i => Math.min(i + 1, lesson.frames.length - 1)), SPEEDS[speed].ms);
    return () => clearTimeout(t);
  });

  // celebrate when the last frame arrives (via play or stepping)
  useEffect(() => {
    if (done && lesson.frames.length > 1) {
      setPlaying(false);
      fireConfetti?.();
      toast?.('🎓', `Solved! x = ${lesson.solution}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const frame = lesson.frames[idx];

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <div className="lesson-controls">
          <div className="level-tabs">
            {LESSON_KINDS.map(k => (
              <button key={k.id} type="button"
                className={'role-tab' + (kind === k.id ? ' active' : '')}
                onClick={() => { setKind(k.id); newLesson(k.id); }}>
                {k.label}
              </button>
            ))}
          </div>
          <div className="level-tabs">
            {Object.entries(SPEEDS).map(([id, s]) => (
              <button key={id} type="button"
                className={'role-tab' + (speed === id ? ' active' : '')}
                onClick={() => setSpeed(id)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lesson-controls">
          <div className="anim-controls">
            <button className="btn btn-primary" type="button"
              onClick={() => (done && !playing ? newLesson() : setPlaying(!playing))}>
              {playing ? '⏸ Pause' : done ? '↺ New' : idx > 0 ? '▶ Resume' : '▶ Play'}
            </button>
            <button className="btn btn-ghost" type="button"
              onClick={() => { setPlaying(false); setIdx(i => Math.max(0, i - 1)); }}
              disabled={idx === 0}>⏮ Back</button>
            <button className="btn btn-ghost" type="button"
              onClick={() => { setPlaying(false); setIdx(i => Math.min(i + 1, lesson.frames.length - 1)); }}
              disabled={done}>⏭ Step</button>
            <button className="btn btn-ghost" type="button" onClick={() => newLesson()}>🎲 New equation</button>
          </div>
          <div className="anim-progress muted">
            {done ? 'Solved!' : `Step ${idx + 1} of ${lesson.frames.length}`}
          </div>
        </div>

        <div className="eq-stage">
          <div className="eq-row" key={idx}>
            <div className="eq-side">
              {frame.left.map((c, i) => <span className="term-chip" key={i}>{c}</span>)}
            </div>
            <span className="eq-equals">=</span>
            <div className="eq-side">
              {frame.right.map((c, i) => <span className="term-chip" key={i}>{c}</span>)}
            </div>
          </div>
          <div className="frame-note" key={'n' + idx}>
            <span dangerouslySetInnerHTML={{ __html: frame.note }} />
          </div>
        </div>

        {done && (
          <div className="feedback good lesson-done">
            <h3>🎉 Solved! x = {lesson.solution}</h3>
            <p className="explain">{lesson.check}</p>
          </div>
        )}
      </section>

      <aside className="lesson-steps">
        <h4>📋 {lesson.title}</h4>
        {lesson.frames.map((f, i) => (
          <div key={i}
            className={'lesson-step' + (i < idx ? ' step-done' : i === idx ? ' step-current' : '')}
            style={{ cursor: 'pointer' }}
            onClick={() => { setPlaying(false); setIdx(i); }}>
            <span className="step-num">{i < idx ? '✓' : i + 1}</span>
            <div className="step-text" style={{ fontSize: '.9rem' }}>
              <span dangerouslySetInnerHTML={{ __html: f.note }} />
            </div>
          </div>
        ))}
        {done && (
          <div className="lesson-step step-done">
            <span className="step-num">🏁</span>
            <div className="step-text"><strong>x = {lesson.solution}</strong></div>
          </div>
        )}
      </aside>
    </div>
  );
}
