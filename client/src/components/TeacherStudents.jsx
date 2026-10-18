import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { SUBJECTS, STUDENT_GRADES, HSK_LEVELS, gradeLabel, hskLabel, studentLevelFor, hskReadiness } from '../skills.js';
import { niceDate, skillName } from '../homework.js';
import { clickable } from '../a11y.js';

function StudentCard({ s, onGrade, onHsk }) {
  const [open, setOpen] = useState(false);
  const pct = s.stats.answered ? Math.round(100 * s.stats.correct / s.stats.answered) : 0;
  const mastered = s.skillProgress.filter(p => p.score >= 100).length;
  const total = s.skillProgress.reduce((sum, p) => sum + p.score, 0);
  const scoreOf = id => s.skillProgress.find(p => p.skill_id === id)?.score || 0;

  return (
    <div className={'student-card' + (open ? ' open' : '')}>
      <div className="student-head" {...clickable(() => setOpen(!open))}>
        <strong>{s.displayName}</strong> <span className="muted">@{s.username}</span>
        <span className={'grade-tag ' + (s.grade === null ? 'above' : 'mine')} style={{ margin: '0 6px' }}>{s.grade === null ? '⚠️ no grade' : gradeLabel(s.grade)}</span>
        <span className="grade-tag mine" style={{ marginRight: 6 }} title="Chinese HSK level">🀄 {hskLabel(s.hskLevel ?? 1)}{s.wordsKnown ? ` · 🧠 ${s.wordsKnown} words` : ''}</span>
        <span className="student-stats">
          📊 {total} &nbsp;•&nbsp; 🥇 {mastered} mastered &nbsp;•&nbsp; 🎯 {pct}% &nbsp;•&nbsp;
          ⏱️ {Math.floor(s.stats.time_sec / 60)}m &nbsp;•&nbsp; 📝 {s.stats.homework_done} homeworks &nbsp;•&nbsp; ⭐ {s.stars}
        </span>
        <span className="topic-caret">▶</span>
      </div>
      {open && (
        <div className="student-detail">
          <label className="muted" style={{ display: 'block', marginBottom: 10 }}>Grade:{' '}
            <select className="grade-select" value={s.grade ?? ''} onChange={e => onGrade(s, e.target.value)}>
              <option value="">— not set —</option>
              {STUDENT_GRADES.map(g => <option key={g} value={g}>{gradeLabel(g)}</option>)}
            </select>
          </label>
          <label className="muted" style={{ display: 'block', marginBottom: 10 }}>Chinese level (independent of grade — students can also move themselves up):{' '}
            <select className="grade-select" value={s.hskLevel ?? 1} onChange={e => onHsk(s, e.target.value)}>
              {HSK_LEVELS.map(l => <option key={l} value={l}>{hskLabel(l)}</option>)}
            </select>
            {hskReadiness(s.hskLevel ?? 1, scoreOf).ready && (s.hskLevel ?? 1) < 6 && <span className="grade-tag mine" style={{ marginLeft: 8 }}>✅ ready for {hskLabel((s.hskLevel ?? 1) + 1)}</span>}
          </label>
          {s.grade === null && <p className="muted">Set a grade to see Math, English and Science progress at the student's level.</p>}
          {SUBJECTS.map(sub => {
              const level = studentLevelFor(sub, s);
              const g = level === null ? null : sub.grades.find(x => x.num === level);
              if (!g) return null;
              const skills = g.sections.flatMap(sec => sec.skills);
              const avg = Math.round(skills.reduce((sum, sk) => sum + scoreOf(sk.id), 0) / skills.length);
              const done = skills.filter(sk => scoreOf(sk.id) >= 100).length;
              const started = skills.filter(sk => scoreOf(sk.id) > 0).length;
              return (
                <div className="dash-row" style={{ cursor: 'default' }} key={sub.id}>
                  <span style={{ minWidth: 220 }}>{sub.emoji} {sub.name} — {g.name}</span>
                  <div className="dash-bar"><div className="dash-bar-fill" style={{ width: avg + '%' }} /></div>
                  <span className="dash-score">{avg}%</span>
                  <span className="muted" style={{ minWidth: 150 }}>{started}/{skills.length} started · 🥇 {done}</span>
                </div>
              );
            })}
          <h4 style={{ margin: '14px 0 6px' }}>Assignments</h4>
          {s.assignments.length === 0
            ? <p className="muted">No assignments yet — use the Assign tab.</p>
            : s.assignments.map(a => (
              <div className="hw-mini" key={a.id}>
                due {niceDate(a.due)} — {a.items.map(i => skillName(i.skillId)).join(', ')}:{' '}
                {a.completed ? '✅ done' : a.done > 0 ? `⏳ ${a.done}/${a.total}` : '⬜ not started'}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default function TeacherStudents({ toast }) {
  const [students, setStudents] = useState(null);
  const load = () => api('GET', '/api/students').then(setStudents).catch(() => setStudents([]));
  useEffect(() => { load(); }, []);

  async function setGrade(s, value) {
    const grade = value === '' ? null : Number(value);
    try {
      await api('PUT', `/api/students/${s.id}/grade`, { grade });
      toast?.('🎓', `${s.displayName} is now in ${gradeLabel(grade)}`);
      load();
    } catch (e) { toast?.('⚠️', e.message); }
  }
  async function setHsk(s, value) {
    try {
      await api('PUT', `/api/students/${s.id}/hsk-level`, { level: Number(value) });
      toast?.('🀄', `${s.displayName} is now studying ${hskLabel(Number(value))}`);
      load();
    } catch (e) { toast?.('⚠️', e.message); }
  }

  return (
    <main className="page">
      <div className="page-head">
        <h2>👥 Student Progress</h2>
        <p className="muted">Click a student to set their grade and see their progress and homework.</p>
      </div>
      {students === null
        ? <p className="muted">Loading…</p>
        : students.length === 0
          ? <p className="muted">No students in your roster yet. Ask an admin to add students to your roster.</p>
          : students.map(s => <StudentCard key={s.id} s={s} onGrade={setGrade} onHsk={setHsk} />)}
    </main>
  );
}
