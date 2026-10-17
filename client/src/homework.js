// Date + homework helpers (client side).
import { ALL_SKILLS, SKILL_INDEX, SUBJECTS, gradeLevel } from './skills.js';

export function localDateStr(d = new Date()) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
export function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
export function niceDate(str) {
  return new Date(String(str).slice(0, 10) + 'T12:00:00')
    .toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

// Skills at a student's grade, per subject ([] when that subject has no such grade).
export function skillsAtGrade(grade) {
  return SUBJECTS.map(sub => ({
    subject: sub,
    skills: (sub.grades.find(g => g.num === grade)?.sections || []).flatMap(s => s.skills)
  }));
}

// Deterministic daily set for a calendar date: 3 skills × 5 questions.
// With a grade: one Math, one English and one Science skill at that grade.
// Without one: three math skills from any grade (the original behaviour).
export function dailyAssignment(dateString, grade = null) {
  let seed = 0;
  for (const c of dateString) seed = (seed * 31 + c.charCodeAt(0)) >>> 0;
  const items = [];
  const pools = grade !== null && grade !== undefined ? skillsAtGrade(grade).map(p => p.skills).filter(p => p.length) : [];
  if (pools.length) {
    pools.forEach((pool, k) => items.push({ skillId: pool[(seed + k * 7) % pool.length].id, count: 5 }));
  } else {
    for (let i = 0; items.length < 3 && i < ALL_SKILLS.length * 2; i++) {
      const s = ALL_SKILLS[(seed + i * 5) % ALL_SKILLS.length];
      if (!items.find(x => x.skillId === s.id)) items.push({ skillId: s.id, count: 5 });
    }
  }
  return { id: 'daily-' + dateString, daily: true, due: dateString, items };
}

// Merge server-provided daily progress into a daily assignment object.
export function dailyWithProgress(dateString, homeworkData) {
  const a = dailyAssignment(dateString, homeworkData?.grade ?? null);
  const rows = (homeworkData?.dailyProgress || []).filter(r => r.assignment_id === a.id);
  const progress = a.items.map(i => {
    const row = rows.find(r => r.skill_id === i.skillId);
    return { skillId: i.skillId, count: i.count, done: row ? row.done : 0, correct: row ? row.correct : 0 };
  });
  const done = progress.reduce((s, p) => s + Math.min(p.count, p.done), 0);
  const total = a.items.reduce((s, i) => s + i.count, 0);
  return { ...a, progress, done, total, completed: (homeworkData?.dailyCompleted || []).includes(a.id) };
}

export function assignmentTotals(a) {
  return { done: a.done ?? 0, total: a.total ?? a.items.reduce((s, i) => s + i.count, 0) };
}

// Skills that still have unfinished homework due today or overdue.
export function homeworkSkillIdsToday(homeworkData) {
  const today = localDateStr();
  const ids = new Set();
  (homeworkData?.assignments || [])
    .filter(a => a.due.slice(0, 10) <= today && !a.completed)
    .forEach(a => a.items.forEach(i => {
      const p = (a.progress || []).find(x => x.skillId === i.skillId);
      if (!p || p.done < i.count) ids.add(i.skillId);
    }));
  const daily = dailyWithProgress(today, homeworkData);
  if (!daily.completed) daily.items.forEach(i => {
    const p = daily.progress.find(x => x.skillId === i.skillId);
    if (p.done < i.count) ids.add(i.skillId);
  });
  return ids;
}

// First unfinished assignment (teacher-assigned preferred, then daily) needing this skill.
export function findHomeworkForSkill(skillId, homeworkData) {
  const today = localDateStr();
  const candidates = [
    ...(homeworkData?.assignments || []).filter(a => a.due.slice(0, 10) <= today),
    dailyWithProgress(today, homeworkData)
  ];
  return candidates.find(a => {
    if (a.completed) return false;
    const item = a.items.find(i => i.skillId === skillId);
    if (!item) return false;
    const p = (a.progress || []).find(x => x.skillId === skillId);
    return !p || p.done < item.count;
  }) || null;
}

// Grade number a skill belongs to (null if unknown).
export const skillGrade = skillId => SKILL_INDEX[skillId]?.grade.num ?? null;
// Is this skill above the student's grade? (false when the student has no grade)
export const isAboveGrade = (skillId, grade) => grade !== null && grade !== undefined && skillGrade(skillId) !== null && gradeLevel(skillGrade(skillId)) > grade;

export function skillName(skillId) {
  const e = SKILL_INDEX[skillId];
  if (!e) return skillId;
  // math codes are shown bare (A.1); other subjects carry their own prefix (EN-A.1)
  return `${e.skill.code} (gr. ${e.grade.num})`;
}
