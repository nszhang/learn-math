import { useEffect, useState } from 'react';
import { homeworkSkillIdsToday, findHomeworkForSkill } from '../homework.js';
import Medallion from './Medallion.jsx';
import { HSK_LEVELS, hskLabel, isHsk, studentLevelFor, levelLabelFor, isAboveLevel, hskReadiness } from '../skills.js';
import { api } from '../api.js';
import { dueWords, KNOWN_BOX } from './ReviewPage.jsx';
import { HSK } from '../catalog/zh/hsk.js';
import { clickable } from '../a11y.js';

const GRADE_EMOJI = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','1️⃣1️⃣','1️⃣2️⃣'];
const gradeEmoji = n => (n < 0 ? '🧸' : n === 0 ? '🎒' : n === 13 ? '∫' : GRADE_EMOJI[n - 1]);

export default function SkillsPage({ subject, me, homework, onStartSkill, onStartHomework, toast, onLevelChanged, onLearn, onStartReview }) {
  const GRADES = subject.grades;
  const hsk = isHsk(subject);
  const isStudent = me?.user?.role === 'student';
  // the student's level here: school grade, or for Chinese their own HSK level
  const myGrade = studentLevelFor(subject, me?.user);
  const unit = hsk ? 'HSK level' : 'grade';
  // Chinese review deck (students only)
  const [deck, setDeck] = useState(null);
  useEffect(() => {
    if (hsk && isStudent) api('GET', '/api/review').then(r => setDeck(r.words)).catch(() => setDeck(null));
  }, [hsk, isStudent]);
  const gradeKey = subject.id === 'math' ? 'mm_grade' : 'mm_grade_' + subject.id; // math keeps its original key
  const [gradeNum, setGradeNum] = useState(() => {
    const raw = localStorage.getItem(gradeKey), saved = raw === null ? NaN : Number(raw);   // grade 0 (Kindergarten) is valid, so don't treat "missing" as 0
    if (GRADES.some(g => g.num === saved)) return saved;
    return GRADES.some(g => g.num === myGrade) ? myGrade : null;   // else open on the student's own grade
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

  async function setHskLevel(level) {
    try {
      await api('PUT', '/api/me/hsk-level', { level });
      toast('🀄', `You're now studying ${hskLabel(level)} — 加油 (jiā yóu)!`);
      onLevelChanged?.();
    } catch (e) { toast('⚠️', e.message); }
  }

  // Chinese: the student's own HSK level and how close they are to the next one
  const hskPanel = hsk && myGrade !== null && (() => {
    const r = hskReadiness(myGrade, scoreOf), next = myGrade + 1;
    const levelWords = new Set(HSK[myGrade].map(w => w[0]));
    const known = deck ? deck.filter(w => w.box >= KNOWN_BOX && levelWords.has(w.word)).length : 0;
    const due = deck ? dueWords(deck).length : 0;
    return (
      <div className="hsk-panel">
        <div className="hsk-panel-main">
          <div><span className="hsk-badge">{hskLabel(myGrade)}</span> <strong>your Chinese level</strong>
            <span className="muted"> — separate from your school grade, so you can go at your own pace.</span></div>
          <div className="topic-progress" style={{ margin: '8px 0 4px' }}>
            <div className="topic-progress-fill" style={{ width: Math.round(100 * r.passed / (r.total || 1)) + '%' }} />
          </div>
          <div className="muted">{r.passed} of {r.total} skills at 🥉 70 or better.{' '}
            {myGrade < 6 && (r.ready ? <strong>You're ready for {hskLabel(next)}! 🎉</strong> : `Reach ${Math.ceil(r.total * 0.7)} and we'll suggest ${hskLabel(next)} — or move up whenever you feel ready.`)}</div>
          {deck && <div className="muted">🧠 You know <strong>{known}</strong> of the {levelWords.size} {hskLabel(myGrade)} words (remembered over 3+ days).</div>}
        </div>
        <div className="hsk-panel-actions">
          {isStudent && onStartReview && (
            <button type="button" className={'btn ' + (due ? 'btn-primary' : 'btn-ghost')} onClick={onStartReview}>
              🔁 Review words{deck ? ` (${due} due)` : ''}
            </button>
          )}
          {onLearn && <button type="button" className="btn btn-ghost" onClick={() => onLearn('tones')}>🎵 Learn the tones</button>}
          {isStudent && myGrade < 6 && (
            <button type="button" className={'btn ' + (r.ready ? 'btn-primary' : 'btn-ghost')}
              onClick={() => (r.ready || window.confirm(`You've passed ${r.passed} of ${r.total} ${hskLabel(myGrade)} skills. Move up to ${hskLabel(next)} anyway? You can always come back.`)) && setHskLevel(next)}>
              ⬆️ Move up to {hskLabel(next)}
            </button>
          )}
          {isStudent && (
            <select className="grade-select" aria-label="Choose your HSK level" value={myGrade} onChange={e => setHskLevel(Number(e.target.value))}>
              {HSK_LEVELS.map(l => <option key={l} value={l}>{hskLabel(l)}</option>)}
            </select>
          )}
        </div>
      </div>
    );
  })();

  // ---------- grade grid (IXL math home) ----------
  if (gradeNum === null) {
    return (
      <main className="page">
        <div className="page-head">
          <h2>{subject.emoji} {subject.name} skills by {hsk ? 'HSK level' : 'grade'}</h2>
          <p className="muted">{subject.blurb} {hsk ? '' : myGrade !== null
            ? <>You're in <strong>{levelLabelFor(subject, myGrade)}</strong> — start there, or explore any grade you like!</>
            : 'Pick your grade and start building skills!'} Earn 🥉 70 · 🥈 90 · 🥇 100 on every skill.</p>
        </div>
        {hskPanel}
        <div className="grade-grid">
          {GRADES.map(g => {
            const skills = g.sections.flatMap(s => s.skills);
            const avg = Math.round(skills.reduce((sum, s) => sum + scoreOf(s.id), 0) / skills.length);
            const mastered = skills.filter(s => scoreOf(s.id) >= 100).length;
            const sample = skills.slice(0, 3).map(s => s.title).join(' | ');
            return (
              <div className={'grade-card' + (g.num === myGrade ? ' my-grade' : '')} key={g.id} {...clickable(() => pickGrade(g.num))}>
                <div className="grade-card-top">
                  <span className="grade-num">{gradeEmoji(g.num)} {g.name}</span>
                  <span className="grade-count">{skills.length} skills</span>
                </div>
                {g.num === myGrade && <span className="grade-tag mine">⭐ Your {unit}</span>}
                {isAboveLevel(subject, g.num, me?.user) && <span className="grade-tag above">🚀 Above your {unit}</span>}
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
          ← All {hsk ? 'levels' : 'grades'}
        </button>
        <div>
          <h2>{gradeEmoji(grade.num)} {grade.name} {subject.name.toLowerCase()}</h2>
          <p className="muted">{grade.sections.reduce((n, s) => n + s.skills.length, 0)} skills ·
            click a section to explore</p>
        </div>
      </div>
      {isAboveLevel(subject, grade.num, me?.user) && (
        <div className="grade-note">{hsk
          ? <>🚀 This is above your level ({hskLabel(myGrade)}) — exploring ahead is great!{isStudent && <> Feeling ready? <button type="button" className="btn btn-ghost" onClick={() => setHskLevel(grade.num)}>Make {hskLabel(grade.num)} my level</button></>}</>
          : <>🚀 This is above your grade ({levelLabelFor(subject, myGrade)}) — exploring ahead is great! Homework will usually come from your own grade.</>}</div>
      )}
      {hsk && grade.num === myGrade && hskPanel}

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
