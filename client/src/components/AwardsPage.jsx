import { useEffect, useState } from 'react';
import { api } from '../api.js';

// practice time is counted in seconds; show it as minutes or hours
const fmt = (id, v) => {
  if (!id.startsWith('time')) return Math.floor(v).toLocaleString();
  const min = Math.floor(v / 60);
  return min >= 120 ? `${Math.floor(min / 60)} h` : `${min} min`;
};

export default function AwardsPage({ me }) {
  const [meta, setMeta] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    api('GET', '/api/meta/awards').then(setMeta).catch(() => {});
    api('GET', '/api/awards/progress').then(setProgress).catch(() => {});
  }, [me]);

  const earned = new Map((me?.awards || []).map(a => [a.award_id, a.earned_at]));
  const count = meta.filter(a => earned.has(a.id)).length;

  return (
    <main className="page">
      <div className="page-head">
        <h2>My Awards</h2>
        <p className="muted">Earn badges by practicing, building streaks, and mastering skills — the biggest ones need you to master your whole grade.
          {meta.length > 0 && <> You have <strong>{count} of {meta.length}</strong>.</>}</p>
      </div>
      <div className="awards-grid">
        {meta.map(a => {
          const at = earned.get(a.id);
          const [value, goal] = progress[a.id] || [];
          const pct = goal ? Math.min(100, Math.round(100 * value / goal)) : 0;
          return (
            <div className={'award-card ' + (at ? 'earned' : 'locked')} key={a.id}>
              <div className="award-emoji">{a.emoji}</div>
              <h4>{a.name}</h4>
              <p>{a.desc}</p>
              {at
                ? <span className="award-date">Earned {new Date(at).toLocaleDateString()}</span>
                : goal === null
                  ? <span className="award-progress-text">Needs your grade — ask your teacher to set it.</span>
                  : goal !== undefined && (<>
                    <div className="award-progress" aria-hidden="true"><div style={{ width: pct + '%' }} /></div>
                    <span className="award-progress-text">{fmt(a.id, Math.min(value, goal))} / {fmt(a.id, goal)}</span>
                  </>)}
            </div>
          );
        })}
      </div>
    </main>
  );
}
