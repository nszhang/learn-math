import { useState } from 'react';
import { homeworkSkillIdsToday, findHomeworkForSkill } from '../homework.js';
import Medallion from './Medallion.jsx';
import { clickable } from '../a11y.js';

const GRADE_EMOJI = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','1️⃣1️⃣','1️⃣2️⃣'];
const gradeEmoji = n => (n < 0 ? '🧸' : n === 0 ? '🎒' : n === 13 ? '∫' : GRADE_EMOJI[n - 1]);

export default function SkillsPage({ subject, me, homework, onStartSkill, onStartHomework, toast }) {
  const GRADES = subject.grades;
  const gradeKey = subject.id === 'math' ? 'mm_grade' : 'mm_grade_' + subject.id; // math keeps its original key
  const [gradeNum, setGradeNum] = useState(() => {
    const raw = localStorage.getItem(gradeKey), saved = raw === null ? NaN : Number(raw);   // grade 0 (Kindergarten) is valid, so don't treat "missing" as 0
    return GRADES.some(g => g.num === saved) ? saved : null;
  });
  const [openSections, setOpenSections] = useState(() => new Set());
  const hwSkills = homeworkSkillIdsToday(homework);
  const scoreOf = id => me?.skillProgress?.find(p => p.skill_id === id)?.score || 0;

  function pickGrade(n) {
    setGradeNum(n);
    localStorage.setItem(gradeKey, String(n));
    setOpenSections(new Set());
  }
  function toggleSection(id) {
    setOpenSections(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function clickSkill(skillId) {
    const hw = findHomeworkForSkill(skillId, homework);
    if (hw) {
      toast('📝', 'This skill is in your homework — answers count toward it!');
      onStartHomework(hw);
    } else {
      onStartSkill(skillId);
    }
  }

  // ---------- grade grid (IXL math home) ----------
  if (gradeNum === null) {
    return (
      <main className="page">
        <div className="page-head">
          <h2>{subject.emoji} {subject.name} skills by grade</h2>
          <p className="muted">{subject.blurb} Pick your grade and start building skills! Earn 🥉 70 · 🥈 90 · 🥇 100 on every skill.</p>
        </div>
        <div className="grade-grid">
          {GRADES.map(g => {
            const skills = g.sections.flatMap(s => s.skills);
            const avg = Math.round(skills.reduce((sum, s) => sum + scoreOf(s.id), 0) / skills.length);
            const mastered = skills.filter(s => scoreOf(s.id) >= 100).length;
            const sample = skills.slice(0, 3).map(s => s.title).join(' | ');
            return (
              <div className="grade-card" key={g.id} {...clickable(() => pickGrade(g.num))}>
                <div className="grade-card-top">
                  <span className="grade-num">{gradeEmoji(g.num)} {g.name}</span>
                  <span className="grade-count">{skills.length} skills</span>
                </div>
                <p className="grade-includes muted">Includes: {sample}…</p>
                <div className="topic-progress">
                  <div className="topic-progress-fill" style={{ width: avg + '%' }} />
                </div>
                <div className="grade-card-bottom muted">
                  {mastered > 0 ? `🥇 ${mastered} mastered · ` : ''}{avg > 0 ? `${avg}% complete` : 'Not started yet'}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  // ---------- grade detail (IXL grade page) ----------
  const grade = GRADES.find(g => g.num === gradeNum);
  return (
    <main className="page">
      <div className="page-head grade-head">
        <button className="btn btn-ghost" type="button" onClick={() => { setGradeNum(null); localStorage.removeItem(gradeKey); }}>
          ← All grades
        </button>
        <div>
          <h2>{gradeEmoji(grade.num)} {grade.name} {subject.name.toLowerCase()}</h2>
          <p className="muted">{grade.sections.reduce((n, s) => n + s.skills.length, 0)} skills ·
            click a section to explore</p>
        </div>
      </div>

      {grade.sections.map((section, idx) => {
        const sid = grade.id + section.letter;
        const showCategory = section.category && section.category !== grade.sections[idx - 1]?.category;
        const avg = Math.round(section.skills.reduce((sum, s) => sum + scoreOf(s.id), 0) / section.skills.length);
        return (<div key={sid}>
          {showCategory && <h3 className="category-head">{section.category}</h3>}
          <div className={'topic-card' + (openSections.has(sid) ? ' open' : '')}>
            <div className="topic-head" {...clickable(() => toggleSection(sid))}>
              <span className="topic-icon">{section.icon}</span>
              <h3>{section.letter}. {section.name}</h3>
              <div className="topic-progress"><div className="topic-progress-fill" style={{ width: avg + '%' }} /></div>
              <span className="topic-pct">{avg}%</span>
              <span className="topic-caret">▶</span>
            </div>
            <div className="skill-list">
              {section.skills.map(s => (
                <div className="skill-row" key={s.id} {...clickable(() => clickSkill(s.id))}>
                  <span className="skill-code">{s.code}</span>
                  <span className="skill-name">{s.title}</span>
                  {hwSkills.has(s.id) && <span className="hw-tag">📝 HW</span>}
                  <Medallion score={scoreOf(s.id)} />
                </div>
              ))}
            </div>
          </div>
        </div>);
      })}
    </main>
  );
}
