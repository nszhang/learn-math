import { useMemo } from 'react';
import Medallion from './Medallion.jsx';
import { clickable } from '../a11y.js';
import { studentLevelFor } from '../skills.js';

/* "Recommended for you" (IXL-style): what to practise next in this subject, from the student's progress.
   - Keep going: started but not mastered, most recent first
   - Needs review: lots of questions but still a low SmartScore
   - Up next: the next skill in a section where the student just did well
   - Get started: a new student's first skill in several sections of their grade */
export function recommend(subject, me, max = 6) {
  const progress = me?.skillProgress || [];
  const by = new Map(progress.map(p => [p.skill_id, p]));
  const where = new Map();   // skill id → { grade, section, index }
  for (const g of subject.grades) for (const sec of g.sections) sec.skills.forEach((sk, i) => where.set(sk.id, { g, sec, i, sk }));
  const recent = p => (p.last_at ? Date.parse(p.last_at) : 0);
  const mine = progress.filter(p => where.has(p.skill_id));
  const out = [], used = new Set();
  const add = (sk, reason) => { if (out.length < max && !used.has(sk.id)) { used.add(sk.id); out.push({ sk, reason, g: where.get(sk.id).g }); } };

  // needs review: practised a lot, still struggling
  mine.filter(p => p.answered >= 12 && p.score < 50).sort((a, b) => recent(b) - recent(a)).slice(0, 2)
    .forEach(p => add(where.get(p.skill_id).sk, 'Needs review'));
  // keep going
  mine.filter(p => p.score > 0 && p.score < 100).sort((a, b) => recent(b) - recent(a)).slice(0, 3)
    .forEach(p => add(where.get(p.skill_id).sk, 'Keep going'));
  // up next: the first unstarted skill after a recently strong one in the same section
  mine.filter(p => p.score >= 70).sort((a, b) => recent(b) - recent(a)).slice(0, 6).forEach(p => {
    const { sec, i } = where.get(p.skill_id);
    const next = sec.skills.slice(i + 1).find(sk => !(by.get(sk.id)?.score > 0));
    if (next) add(next, 'Up next');
  });
  // get started: the student's grade (or the first grade), one new skill per section
  if (out.length < max) {
    const level = studentLevelFor(subject, me?.user);
    const g = subject.grades.find(x => x.num === level) || (mine.length ? where.get(mine[0].skill_id).g : subject.grades.find(x => x.num >= 1) || subject.grades[0]);
    for (const sec of g.sections) {
      const sk = sec.skills.find(s => !(by.get(s.id)?.score > 0));
      if (sk) add(sk, mine.length ? 'Try something new' : 'Get started');
    }
  }
  return out;
}

const REASON_ICON = { 'Needs review': '🔁', 'Keep going': '▶️', 'Up next': '⏭️', 'Get started': '🚀', 'Try something new': '✨' };

export default function Recommendations({ subject, me, scoreOf, hwSkills, onPick }) {
  const recs = useMemo(() => recommend(subject, me), [subject, me]);
  if (!me?.user || me.user.role !== 'student' || !recs.length) return null;
  return (
    <section className="recs">
      <h3 className="recs-title">⭐ Recommended for you</h3>
      <div className="recs-grid">
        {recs.map(({ sk, reason, g }) => (
          <div className="rec-card" key={sk.id} {...clickable(() => onPick(sk.id))}>
            <div className="rec-reason">{REASON_ICON[reason]} {reason}</div>
            <div className="rec-name">{sk.title}</div>
            <div className="rec-meta muted">{g.name} · {sk.code}{hwSkills?.has(sk.id) ? ' · 📝 HW' : ''}</div>
            <Medallion score={scoreOf(sk.id)} />
          </div>
        ))}
      </div>
    </section>
  );
}
