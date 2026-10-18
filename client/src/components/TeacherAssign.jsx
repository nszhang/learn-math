import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { SUBJECTS, SKILL_INDEX, STUDENT_GRADES, HSK_LEVELS, gradeLabel, hskLabel, isHsk, studentLevelFor, isStudentLevel, isAboveLevel } from '../skills.js';
import { distinctQuestions } from '../questionPool.js';
import { localDateStr, niceDate, skillName, isAboveGrade } from '../homework.js';
import Fold from './Fold.jsx';

export default function TeacherAssign({ toast }) {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [due, setDue] = useState(localDateStr());
  const [count, setCount] = useState(5);
  const [checked, setChecked] = useState(() => new Set());
  const [assignments, setAssignments] = useState([]);
  const [showAll, setShowAll] = useState(false);

  async function load() {
    try {
      const [stu, list] = await Promise.all([
        api('GET', '/api/students'),
        api('GET', '/api/assignments')
      ]);
      setStudents(stu);
      if (!studentId && stu.length) setStudentId(String(stu[0].id));
      setAssignments(list);
    } catch (e) { toast('⚠️', e.message); }
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const student = students.find(s => String(s.id) === String(studentId));
  const grade = student?.grade ?? null;
  const hskLevel = student?.hskLevel ?? 1;
  const scoreOf = id => student?.skillProgress?.find(p => p.skill_id === id)?.score || 0;

  // subject × level folds; show the student's own level first (others on request).
  // Chinese goes by the student's HSK level, which is always known; the rest by school grade.
  const folds = useMemo(() => {
    const all = SUBJECTS.flatMap(sub => sub.grades.map(g => ({ sub, grade: g })));
    const mine = all.filter(f => isStudentLevel(f.sub, f.grade.num, student));
    if (grade === null && !showAll) return [...mine, ...all.filter(f => !isHsk(f.sub))];
    return showAll ? [...mine, ...all.filter(f => !mine.includes(f))] : mine;
  }, [student, grade, showAll]);

  const aboveSelected = [...checked].filter(id => isAboveGrade(id, student));
  // skills whose question bank is smaller than the questions asked — some would have to repeat
  const smallBank = useMemo(() => [...checked]
    .map(id => ({ id, n: distinctQuestions(SKILL_INDEX[id].skill, count) }))
    .filter(x => x.n < count), [checked, count]);

  function toggleSkill(id) {
    setChecked(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  // Suggest: per subject at the student's level, the two weakest skills that are not yet mastered
  function suggest() {
    const pickedNow = new Set(checked);
    let added = 0;
    for (const sub of SUBJECTS) {
      const level = studentLevelFor(sub, student);
      if (level === null) continue;
      const g = sub.grades.find(x => x.num === level);
      if (!g) continue;
      const skills = g.sections.flatMap(s => s.skills)
        .filter(s => scoreOf(s.id) < 100 && !pickedNow.has(s.id))
        .map(s => ({ s, score: scoreOf(s.id), r: Math.random() }))
        // started-but-unfinished first (score > 0), then the rest; random among equals
        .sort((a, b) => (b.score > 0) - (a.score > 0) || a.score - b.score || a.r - b.r)
        .slice(0, 2);
      skills.forEach(({ s }) => { pickedNow.add(s.id); added++; });
    }
    setChecked(pickedNow);
    toast('✨', added ? `Suggested ${added} skill(s) at ${grade === null ? hskLabel(hskLevel) : `${gradeLabel(grade)} (Chinese: ${hskLabel(hskLevel)})`}`
      : 'Everything at this level is mastered!');
    if (grade === null) toast('⚠️', 'Set the student\'s grade to get Math, English and Science suggestions too.');
  }

  async function changeHsk(value) {
    try {
      await api('PUT', `/api/students/${studentId}/hsk-level`, { level: Number(value) });
      toast('🀄', `${student.displayName} is now studying ${hskLabel(Number(value))}`);
      load();
    } catch (err) { toast('⚠️', err.message); }
  }

  async function changeGrade(value) {
    const g = value === '' ? null : Number(value);
    try {
      await api('PUT', `/api/students/${studentId}/grade`, { grade: g });
      toast('🎓', `${student.displayName} is now in ${gradeLabel(g)}`);
      load();
    } catch (err) { toast('⚠️', err.message); }
  }

  async function submit(e) {
    e.preventDefault();
    if (!studentId) return toast('⚠️', 'No student accounts available.');
    if (!checked.size) return toast('⚠️', 'Pick at least one skill.');
    if (aboveSelected.length && !window.confirm(
      `${aboveSelected.length} selected skill(s) are above ${student.displayName}'s level (${gradeLabel(grade)}, Chinese ${hskLabel(hskLevel)}):\n\n` +
      aboveSelected.map(id => '• ' + skillName(id)).join('\n') + '\n\nAssign them anyway?')) return;
    try {
      await api('POST', '/api/assignments', {
        studentId: Number(studentId), due,
        // never more questions than the skill has different ones, so nothing repeats
        items: [...checked].map(skillId => ({ skillId, count: Math.min(count, distinctQuestions(SKILL_INDEX[skillId].skill, count)) }))
      });
      toast('📝', `Assigned ${checked.size} skill(s) to ${student?.displayName || 'student'}, due ${niceDate(due)}`);
      setChecked(new Set());
      load();
    } catch (err) { toast('⚠️', err.message); }
  }

  async function remove(id) {
    try {
      await api('DELETE', `/api/assignments/${id}`);
      toast('🗑️', 'Assignment deleted');
      load();
    } catch (e) { toast('⚠️', e.message); }
  }

  return (
    <main className="page">
      <div className="page-head">
        <h2>📝 Assign Exercises</h2>
        <p className="muted">Choose a student, a due date, and the skills to practice. Skills come from the student's grade (Chinese: their HSK level); anything above it is flagged.</p>
      </div>

      <form className="assign-card" onSubmit={submit}>
        <div className="assign-grid">
          <label>Student
            <select value={studentId} onChange={e => { setStudentId(e.target.value); setChecked(new Set()); }}>
              {students.map(s => <option key={s.id} value={s.id}>{s.displayName} (@{s.username}) — {gradeLabel(s.grade)} · {hskLabel(s.hskLevel ?? 1)}</option>)}
            </select>
          </label>
          <label>Grade
            <select className="grade-select" value={grade ?? ''} onChange={e => changeGrade(e.target.value)} disabled={!student}>
              <option value="">— not set —</option>
              {STUDENT_GRADES.map(g => <option key={g} value={g}>{gradeLabel(g)}</option>)}
            </select>
          </label>
          <label>Chinese level
            <select className="grade-select" value={hskLevel} onChange={e => changeHsk(e.target.value)} disabled={!student}>
              {HSK_LEVELS.map(l => <option key={l} value={l}>{hskLabel(l)}</option>)}
            </select>
          </label>
          <label>Due date
            <input type="date" required value={due} onChange={e => setDue(e.target.value)} />
          </label>
          <label>Questions per skill
            <input type="number" min="1" max="20" value={count}
              onChange={e => setCount(Number(e.target.value))} />
          </label>
        </div>

        {student && grade === null && (
          <div className="warn-box">⚠️ {student.displayName} has no grade yet. Set one above to see grade-level skills and suggestions (Chinese uses their HSK level and works without a grade).</div>
        )}

        <div className="anim-controls" style={{ margin: '10px 0' }}>
          <button type="button" className="btn btn-ghost" onClick={suggest} disabled={!student}>✨ Suggest skills for {grade === null ? hskLabel(hskLevel) : `${gradeLabel(grade)} · ${hskLabel(hskLevel)}`}</button>
          <button type="button" className="btn btn-ghost" onClick={() => setShowAll(v => !v)}>
            {showAll ? 'Show only the student\'s level' : 'Show all grades and levels'}
          </button>
          {checked.size > 0 && <button type="button" className="btn btn-ghost" onClick={() => setChecked(new Set())}>Clear ({checked.size})</button>}
        </div>

        <div>
          {folds.map(({ sub, grade: g }) => {
            const picked = g.sections.reduce((n, sec) => n + sec.skills.filter(s => checked.has(s.id)).length, 0);
            const above = isAboveLevel(sub, g.num, student);
            const mine = isStudentLevel(sub, g.num, student);
            return (
              <Fold className="assign-topic fold" key={sub.id + g.id} open={picked > 0 || (mine && !showAll)} summary={<>
                <strong>{sub.emoji} {sub.name} — {g.name}</strong>
                {mine && <span className="grade-tag mine" style={{ marginLeft: 8 }}>⭐ student's {isHsk(sub) ? 'HSK level' : 'grade'}</span>}
                {above && <span className="grade-tag above" style={{ marginLeft: 8 }}>⚠️ above {isHsk(sub) ? 'HSK level' : 'grade'}</span>}
                {picked > 0 && <span className="muted"> ({picked} selected)</span>}</>}>
                {g.sections.map(section => section.skills.map(s => (
                  <label className="assign-skill" key={s.id}>
                    <input type="checkbox" checked={checked.has(s.id)} onChange={() => toggleSkill(s.id)} />
                    {s.code} {s.title}
                    {scoreOf(s.id) >= 100 ? ' 🥇' : scoreOf(s.id) > 0 ? <span className="muted"> ({scoreOf(s.id)})</span> : ''}
                  </label>
                )))}
              </Fold>
            );
          })}
        </div>

        {aboveSelected.length > 0 && (
          <div className="warn-box">⚠️ {aboveSelected.length} selected skill(s) are above {student.displayName}'s level: {aboveSelected.map(skillName).join(', ')}. You'll be asked to confirm.</div>
        )}
        {smallBank.length > 0 && (
          <div className="warn-box">🔁 So that no question repeats, these skills will get fewer than {count} questions: {smallBank.map(x => `${skillName(x.id)} → ${x.n}`).join('; ')}.</div>
        )}
        <button className="btn btn-primary btn-lg" type="submit">Assign homework</button>
      </form>

      <h3 className="section-title">Assignments</h3>
      <div>
        {assignments.length === 0 && <p className="muted">No assignments yet — create one above!</p>}
        {assignments.map(a => (
          <div className="assign-row" key={a.id}>
            <span>👤 <strong>{a.studentName}</strong></span>
            <span>📅 {niceDate(a.due)}</span>
            <span>{a.items.map(i => skillName(i.skillId)).join(', ')} ({a.total} questions)</span>
            <span>{a.completed ? '✅ done' : a.done > 0 ? `⏳ ${a.done}/${a.total}` : '⬜ not started'}</span>
            <button className="btn btn-ghost assign-del" type="button" onClick={() => remove(a.id)}>🗑️</button>
          </div>
        ))}
      </div>
    </main>
  );
}
