import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api.js';
import { SUBJECTS, STUDENT_GRADES, gradeLabel, studentLevelFor } from '../skills.js';
import { niceDate, skillName } from '../homework.js';
import { clickable } from '../a11y.js';
import { ClassOverview, StudentActivity, downloadCsv, summarize, agoText, REPORTS_START } from './StudentReport.jsx';

function StudentCard({ s, r, open, setOpen, onGrade }) {
  const pct = s.stats.answered ? Math.round(100 * s.stats.correct / s.stats.answered) : 0;
  const mastered = s.skillProgress.filter(p => p.score >= 100).length;
  const total = s.skillProgress.reduce((sum, p) => sum + p.score, 0);
  const scoreOf = id => s.skillProgress.find(p => p.skill_id === id)?.score || 0;

  return (
    <div className={'student-card' + (open ? ' open' : '')}>
      <div className="student-head" {...clickable(() => setOpen(!open))}>
        <strong>{s.displayName}</strong> <span className="muted">@{s.username}</span>
        <span className="muted report-seen">· practised {agoText(r.lastActive)}{r.flags.length ? ` · ⚠️ ${r.flags.length}` : ''}</span>
        <span className={'grade-tag ' + (s.grade === null ? 'above' : 'mine')} style={{ margin: '0 6px' }}>{s.grade === null ? '⚠️ no grade' : gradeLabel(s.grade)}</span>
        <span className="student-stats">
          📊 {total} &nbsp;•&nbsp; 🥇 {mastered} mastered &nbsp;•&nbsp; 🎯 {pct}% &nbsp;•&nbsp;
          ⏱️ {Math.floor(s.stats.time_sec / 60)}m &nbsp;•&nbsp; 📝 {s.stats.homework_done} homeworks &nbsp;•&nbsp; ⭐ {s.stars}
        </span>
        <span className="topic-caret">▶</span>
      </div>
      {open && (
        <div className="student-detail">
          <StudentActivity s={s} r={r} />
          <h4 style={{ margin: '18px 0 8px' }}>Settings and overall progress</h4>
          <label className="muted" style={{ display: 'block', marginBottom: 10 }}>Grade:{' '}
            <select className="grade-select" value={s.grade ?? ''} onChange={e => onGrade(s, e.target.value)}>
              <option value="">— not set —</option>
              {STUDENT_GRADES.map(g => <option key={g} value={g}>{gradeLabel(g)}</option>)}
            </select>
          </label>
          {s.grade === null && <p className="muted">Set a grade to see the student's progress at their grade.</p>}
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
  const [n, setN] = useState(7);            // report period in days
  const [openId, setOpenId] = useState(null);
  const cards = useRef({});
  const rows = useMemo(() => (students || []).map(s => ({ s, r: summarize(s, n) })), [students, n]);
  const attention = rows.filter(x => x.r.flags.length).length;
  const openStudent = id => { setOpenId(id); setTimeout(() => cards.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50); };
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

  return (
    <main className="page">
      <div className="page-head">
        <h2>👥 Student Progress</h2>
        <p className="muted">Activity for each student over the last {n} days. Click a student for their full report, grade settings and homework.
          {' '}Day-by-day history is recorded from {new Date(REPORTS_START + 'T12:00:00').toLocaleDateString()}.</p>
      </div>
      {rows.length > 0 && (<>
        <div className="report-toolbar no-print">
          <div className="seg" role="group" aria-label="Report period">
            {[7, 30].map(d => <button key={d} type="button" className={'btn ' + (n === d ? 'btn-primary' : 'btn-ghost')} aria-pressed={n === d} onClick={() => setN(d)}>Last {d} days</button>)}
          </div>
          <span className={attention ? 'report-flag' : 'report-good'}>{attention ? `⚠️ ${attention} of ${rows.length} need attention` : `✓ All ${rows.length} on track`}</span>
          <span style={{ flex: 1 }} />
          <button type="button" className="btn btn-ghost" onClick={() => downloadCsv(rows, n)}>⬇️ Download CSV</button>
          <button type="button" className="btn btn-ghost" onClick={() => window.print()}>🖨️ Print</button>
        </div>
        <ClassOverview rows={rows} onOpen={openStudent} />
        <h3 style={{ margin: '24px 0 10px' }}>Student reports</h3>
      </>)}
      {students === null
        ? <p className="muted">Loading…</p>
        : students.length === 0
          ? <p className="muted">No students in your roster yet. Ask an admin to add students to your roster.</p>
          : rows.map(({ s, r }) => (
            <div key={s.id} ref={el => { cards.current[s.id] = el; }}>
              <StudentCard s={s} r={r} open={openId === s.id} setOpen={o => setOpenId(o ? s.id : null)} onGrade={setGrade} />
            </div>))}
    </main>
  );
}
