import { GRADES } from '../skills.js';
import Medallion from './Medallion.jsx';

export default function DashboardPage({ me, onStartSkill }) {
  if (!me) return <main className="page"><p className="muted">Loading…</p></main>;
  const { user, stats, skillProgress, awards } = me;
  const scoreOf = id => skillProgress.find(p => p.skill_id === id)?.score || 0;

  const total = skillProgress.reduce((s, p) => s + p.score, 0);
  const mastered = skillProgress.filter(p => p.score >= 100).length;
  const skillCount = GRADES.reduce((n, g) => n + g.sections.reduce((m, x) => m + x.skills.length, 0), 0);
  const pct = stats.answered ? Math.round(100 * stats.correct / stats.answered) : 0;

  const cards = [
    ['📊', total, 'Total SmartScore'],
    ['🥇', `${mastered}/${skillCount}`, 'Skills mastered'],
    ['❓', stats.answered, 'Questions answered'],
    ['🎯', pct + '%', 'Accuracy'],
    ['🔥', stats.best_streak, 'Best streak'],
    ['📝', stats.homework_done, 'Homework done'],
    ['⏱️', Math.floor(stats.time_sec / 60) + ' min', 'Time practiced'],
    ['⭐', user.stars, 'Stars earned'],
    ['🏆', awards.length, 'Badges earned']
  ];

  return (
    <main className="page">
      <div className="page-head">
        <h2>My Progress</h2>
        <p className="muted">{user.displayName}'s learning journey — member since {new Date(user.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="stat-cards">
        {cards.map(([emoji, num, label]) => (
          <div className="stat-card" key={label}>
            <div className="stat-emoji">{emoji}</div>
            <div className="stat-num">{num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {GRADES.map(grade => (
        <div key={grade.id}>
          <h3 className="section-title">🎓 {grade.name}</h3>
          {grade.sections.map(section => section.skills.map(s => (
            <div className="dash-row" key={s.id} onClick={() => onStartSkill(s.id)}>
              <span className="skill-code">{s.code}</span>
              <span style={{ minWidth: 200 }}>{section.icon} {s.title}</span>
              <div className="dash-bar"><div className="dash-bar-fill" style={{ width: scoreOf(s.id) + '%' }} /></div>
              <span className="dash-score">{scoreOf(s.id)}</span>
              <Medallion score={scoreOf(s.id)} />
            </div>
          )))}
        </div>
      ))}
    </main>
  );
}
