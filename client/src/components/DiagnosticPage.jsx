import { useMemo, useRef, useState } from 'react';
import { api } from '../api.js';
import { gradeLabel, fmtNum } from '../skills.js';

/* ============================================================
   Diagnostic (IXL-style): an adaptive check that estimates the grade a student is working at
   in a subject and in each of its strands. Questions move up a grade after a right answer and
   down after a wrong one, in smaller steps as it narrows in, rotating through the strands.
   No feedback during the check and no effect on SmartScores. The result is saved for the
   teacher and turned into recommended skills.
   ============================================================ */
const QUESTIONS = 20;
const usable = q => q && (q.type === 'mc' || q.type === 'num') && !q.listen;

export function useDiagnostic(subject, startGrade) {
  const grades = useMemo(() => subject.grades.filter(g => g.num >= 0 && g.num <= 12), [subject]);
  const lo = grades[0].num, hi = grades[grades.length - 1].num;
  const clamp = x => Math.max(lo, Math.min(hi, x));
  const state = useRef({ level: clamp(startGrade ?? 4), step: 2, lastRight: null, turn: 0, log: [] });

  // pick the next question: a strand present at the current level (rotating), a skill in it, a question
  const next = () => {
    const st = state.current;
    for (let tries = 0; tries < 30; tries++) {
      const g = grades.find(x => x.num === Math.round(st.level)) || grades.reduce((a, b) => (Math.abs(b.num - st.level) < Math.abs(a.num - st.level) ? b : a));
      const strands = [...new Set(g.sections.map(s => s.category).filter(Boolean))];
      const strand = strands[(st.turn + tries) % strands.length];
      const secs = g.sections.filter(s => s.category === strand);
      const sec = secs[Math.floor(Math.random() * secs.length)];
      const sk = sec.skills[Math.floor(Math.random() * sec.skills.length)];
      let q; try { q = sk.gen(); } catch { continue; }
      if (usable(q)) return { q, sk, grade: g.num, strand };
    }
    return null;
  };
  const answer = (item, right) => {
    const st = state.current;
    st.log.push({ grade: item.grade, strand: item.strand, right, skillId: item.sk.id });
    if (st.lastRight !== null && st.lastRight !== right) st.step = Math.max(0.5, st.step / 2);   // narrowing in
    st.level = clamp(st.level + (right ? st.step : -st.step));
    st.lastRight = right; st.turn++;
  };
  const result = () => {
    const { log, level } = state.current;
    const tail = log.slice(-6).map(x => x.grade + (x.right ? 0.5 : -0.5));
    const overall = clamp(Math.round(((tail.reduce((a, b) => a + b, 0) / tail.length + level) / 2) * 2) / 2);
    const strands = {};
    // per strand: a right answer at grade g says "at least g", a wrong one "below g"; take the midpoint
    // of those bounds, leaning on the overall level where only one side is known
    for (const s of [...new Set(log.map(x => x.strand))]) {
      const xs = log.filter(x => x.strand === s);
      const rights = xs.filter(x => x.right).map(x => x.grade), wrongs = xs.filter(x => !x.right).map(x => x.grade);
      const low = rights.length ? Math.max(...rights) : null, high = wrongs.length ? Math.min(...wrongs) : null;
      let est;
      if (low !== null && high !== null) est = low < high ? (low + high - 1) / 2 + 0.5 : (low + high) / 2;
      else if (low !== null) est = Math.max(low, overall);
      else est = Math.min(high - 1, overall);
      // few answers in a strand are weak evidence: pull toward the overall level (2 virtual answers)
      est = (xs.length * est + 2 * overall) / (xs.length + 2);
      strands[s] = clamp(Math.round(est * 2) / 2);
    }
    return { level: overall, strands, answered: log.length, correct: log.filter(x => x.right).length };
  };
  return { next, answer, result };
}

/** Skills to work on: in the weakest strands, unstarted/unmastered skills at the strand's level. */
function recommendations(subject, res, scoreOf) {
  const weakest = Object.entries(res.strands).sort((a, b) => a[1] - b[1]).slice(0, 3);
  const out = [];
  for (const [strand, lvl] of weakest) {
    const g = subject.grades.find(x => x.num === Math.floor(lvl)) || subject.grades.find(x => x.num === Math.round(res.level));
    if (!g) continue;
    const sks = g.sections.filter(s => s.category === strand).flatMap(s => s.skills).filter(sk => scoreOf(sk.id) < 70).slice(0, 2);
    sks.forEach(sk => out.push({ sk, strand, g }));
  }
  return out;
}

export default function DiagnosticPage({ subject, me, onExit, onStartSkill }) {
  const scoreOf = id => me?.skillProgress?.find(p => p.skill_id === id)?.score || 0;
  const diag = useDiagnostic(subject, me?.user?.grade);
  const [item, setItem] = useState(() => diag.next());
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState(null);
  const [res, setRes] = useState(null);
  const saved = useRef(false);

  function submit() {
    const q = item.q;
    const right = q.type === 'num' ? Math.abs(Number(input) - q.answer) < 1e-9 && input.trim() !== '' : selected === q.answer;
    diag.answer(item, right);
    const n = count + 1;
    setCount(n); setInput(''); setSelected(null);
    if (n >= QUESTIONS) {
      const r = diag.result(); setRes(r);
      if (!saved.current) { saved.current = true; api('POST', '/api/diagnostic', { subject: subject.id, ...r }).catch(() => {}); }
    } else setItem(diag.next());
  }

  if (res) {
    const recs = recommendations(subject, res, scoreOf);
    return (
      <main className="page">
        <div className="page-head"><h2>🎯 {subject.name} diagnostic — your results</h2></div>
        <div className="diag-result">
          <div className="diag-level">You're working at about <strong>{gradeLabel(Math.round(res.level))}</strong> in {subject.name}.</div>
          <p className="muted">{res.correct} of {res.answered} answered correctly. The questions got harder or easier to find your level — getting some wrong is expected! Your teacher can see this result.</p>
          <h3>By topic</h3>
          <div className="diag-strands">
            {Object.entries(res.strands).sort((a, b) => b[1] - a[1]).map(([s, l]) => (
              <div className="diag-strand" key={s}><span>{s}</span><div className="dash-bar"><div className="dash-bar-fill" style={{ width: `${Math.max(4, ((l + 1) / 13) * 100)}%` }} /></div><strong>{gradeLabel(Math.round(l))}</strong></div>
            ))}
          </div>
          {recs.length > 0 && (<>
            <h3>Recommended next</h3>
            <div className="recs-grid">
              {recs.map(({ sk, strand, g }) => (
                <button type="button" className="rec-card" key={sk.id} onClick={() => onStartSkill(sk.id)}>
                  <div className="rec-reason">🎯 {strand}</div><div className="rec-name">{sk.title}</div><div className="rec-meta muted">{g.name} · {sk.code}</div>
                </button>
              ))}
            </div>
          </>)}
          <div className="practice-actions" style={{ marginTop: 18 }}><button type="button" className="btn btn-primary" onClick={onExit}>Done</button></div>
        </div>
      </main>
    );
  }

  const q = item?.q;
  return (
    <main className="page">
      <div className="page-head"><h2>🎯 {subject.name} diagnostic</h2>
        <p className="muted">Answer as well as you can — skip nothing, guess if you must. Questions adjust to you; you won't see right or wrong until the end.</p></div>
      <div className="question-panel diag-panel">
        <div className="diag-progress"><div className="dash-bar"><div className="dash-bar-fill" style={{ width: `${(count / QUESTIONS) * 100}%` }} /></div><span className="muted">Question {count + 1} of {QUESTIONS}</span></div>
        {!q ? <p>Could not load a question. <button type="button" className="btn btn-ghost" onClick={onExit}>Back</button></p> : (<>
          <div className="question-prompt" dangerouslySetInnerHTML={{ __html: q.prompt }} />
          {q.type === 'num' ? (
            <input className="answer-input" inputMode="decimal" value={input} autoFocus onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && input.trim() && submit()} placeholder="?" />
          ) : (
            <div className="choices">
              {q.choices.map(c => (
                <button type="button" key={c} className={'choice-btn' + (selected === c ? ' selected' : '')} onClick={() => setSelected(c)}
                  dangerouslySetInnerHTML={{ __html: typeof c === 'number' ? fmtNum(c) : c }} />
              ))}
            </div>
          )}
          <div className="practice-actions" style={{ marginTop: 18 }}>
            <button type="button" className="btn btn-primary btn-lg" disabled={q.type === 'num' ? !input.trim() : selected === null} onClick={submit}>Next ➜</button>
            <button type="button" className="btn btn-ghost" onClick={onExit}>Stop</button>
          </div>
        </>)}
      </div>
    </main>
  );
}
