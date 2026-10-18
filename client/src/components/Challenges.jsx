import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { SUBJECTS, SKILL_INDEX, levelLabelFor } from '../skills.js';
import { dailyWithProgress, localDateStr, niceDate, skillName } from '../homework.js';

/* Student challenges: race a classmate through the same skills; the first to finish wins.
   A skill counts as done after `count` correct answers. */

const MAX_ITEMS = 5;
const when = d => (d ? new Date(d).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '');
const duration = (a, b) => {
  if (!a || !b) return null;
  const s = Math.max(0, Math.round((new Date(b) - new Date(a)) / 1000));
  return s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
};
export const challengeSkills = items => items.map(i => `${skillName(i.skillId)} ×${i.count}`).join(', ');

/** One challenge, from the viewer's side, with the actions open to them. */
export function ChallengeCard({ c, meId, onAction, onPlay, compact = false }) {
  const mine = c.challenger.id === meId ? c.challenger : c.opponent;
  const theirs = c.challenger.id === meId ? c.opponent : c.challenger;
  const iChallenged = c.challenger.id === meId;
  const label = {
    pending: iChallenged ? `⏳ Waiting for ${theirs.displayName}` : `⚔️ ${theirs.displayName} challenged you!`,
    active: '🏁 Race in progress', declined: '🙅 Declined', cancelled: '↩️ Cancelled',
    completed: c.winnerId === meId ? '🏆 You won!' : `🥈 ${theirs.displayName} won`
  }[c.status];
  const bar = (p, cls) => (
    <div className={'race-bar ' + cls}>
      <span>{p.id === meId ? 'You' : p.displayName}</span>
      <div><i style={{ width: Math.round(100 * p.done / (p.total || 1)) + '%' }} /></div>
      <em>{p.done}/{p.total}{p.finishedAt && p.startedAt ? ` · ${duration(p.startedAt, p.finishedAt)}` : ''}{p.answered ? ` · ${Math.round(100 * p.done / p.answered)}% right` : ''}</em>
    </div>
  );
  return (
    <div className={'challenge-card status-' + c.status + (c.status === 'completed' ? (c.winnerId === meId ? ' won' : ' lost') : '')}>
      <div className="challenge-head">
        <strong>⚔️ {c.title}</strong>
        <span className="challenge-status">{label}</span>
      </div>
      {!compact && <div className="muted small">{challengeSkills(c.items)}</div>}
      {(c.status === 'active' || c.status === 'completed') && <div className="race-bars">{bar(mine, '')}{bar(theirs, 'rival')}</div>}
      <div className="challenge-actions">
        {c.status === 'pending' && !iChallenged && <>
          <button type="button" className="btn btn-primary" onClick={() => onAction(c, 'accept')}>✅ Accept</button>
          <button type="button" className="btn btn-ghost" onClick={() => onAction(c, 'decline')}>Decline</button>
        </>}
        {c.status === 'pending' && iChallenged && <button type="button" className="btn btn-ghost" onClick={() => onAction(c, 'cancel')}>Cancel</button>}
        {c.status === 'active' && !mine.finishedAt && <button type="button" className="btn btn-primary" onClick={() => onPlay(c)}>{mine.answered ? '▶️ Keep racing' : '🏁 Start racing'}</button>}
        <span className="muted small">{when(c.createdAt)}</span>
      </div>
    </div>
  );
}

/** Pick what to race: one of your homework sets, or up to 5 skills from any subject. */
export function NewChallenge({ opponent, homework, onCreate, onClose }) {
  const [tab, setTab] = useState('homework');
  const [items, setItems] = useState([]);   // [{ skillId, count }]
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id);
  const subject = SUBJECTS.find(s => s.id === subjectId);
  const [levelNum, setLevelNum] = useState(subject.grades[0].num);
  const level = subject.grades.find(g => g.num === levelNum) || subject.grades[0];
  const [busy, setBusy] = useState(false);

  const sets = useMemo(() => {
    const list = (homework?.assignments || []).map(a => ({ key: a.id, name: `Homework due ${niceDate(a.due)}`, items: a.items }));
    const daily = dailyWithProgress(localDateStr(), homework);
    if (daily.items.length) list.unshift({ key: daily.id, name: `Today's ${daily.subject} daily practice`, items: daily.items });
    return list;
  }, [homework]);

  const autoTitle = list => (list.length ? SKILL_INDEX[list[0].skillId].skill.title + (list.length > 1 ? ` + ${list.length - 1} more` : '') : '');
  const choose = list => { const l = list.slice(0, MAX_ITEMS).map(i => ({ skillId: i.skillId, count: Math.min(20, i.count) })); setItems(l); setTitle(autoTitle(l)); };
  const toggle = id => {
    const has = items.some(i => i.skillId === id);
    const l = has ? items.filter(i => i.skillId !== id) : items.length < MAX_ITEMS ? [...items, { skillId: id, count: 5 }] : items;
    setItems(l);
    setTitle(t => (!t || t === autoTitle(items) ? autoTitle(l) : t));
  };

  async function create() {
    if (!items.length) return;
    setBusy(true);
    try { await onCreate({ opponentId: opponent.id, items, title: title.trim() || autoTitle(items), note }); }
    finally { setBusy(false); }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()} onKeyDown={e => e.key === 'Escape' && onClose()}>
      <div className="modal-card challenge-modal" role="dialog" aria-modal="true" aria-label={`Challenge ${opponent.displayName}`}>
        <h3>⚔️ Challenge {opponent.displayName}</h3>
        <p className="muted small">You both do the same skills. A skill is done after that many <strong>correct</strong> answers — the first to finish everything wins 🏆 (+3 ⭐).</p>
        <div className="tone-tabs">
          <button type="button" className={'btn ' + (tab === 'homework' ? 'btn-primary' : 'btn-ghost')} onClick={() => setTab('homework')}>📝 From my homework</button>
          <button type="button" className={'btn ' + (tab === 'skills' ? 'btn-primary' : 'btn-ghost')} onClick={() => setTab('skills')}>🧩 Pick skills</button>
        </div>
        {tab === 'homework' && (sets.length
          ? sets.map(s => (
            <button type="button" key={s.key} className={'pick-row' + (items.length && items.every(i => s.items.some(x => x.skillId === i.skillId)) && items.length === Math.min(MAX_ITEMS, s.items.length) ? ' picked' : '')} onClick={() => choose(s.items)}>
              <strong>{s.name}</strong> <span className="muted small">{challengeSkills(s.items.slice(0, MAX_ITEMS))}</span>
            </button>))
          : <p className="muted">No homework right now — pick skills instead.</p>)}
        {tab === 'skills' && (<>
          <div className="assign-grid">
            <label>Subject
              <select value={subjectId} onChange={e => { const sub = SUBJECTS.find(s => s.id === e.target.value); setSubjectId(sub.id); setLevelNum(sub.grades[0].num); }}>
                {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
              </select>
            </label>
            <label>{subject.levels === 'hsk' ? 'Level' : 'Grade'}
              <select value={level.num} onChange={e => setLevelNum(Number(e.target.value))}>
                {subject.grades.map(g => <option key={g.id} value={g.num}>{g.name}</option>)}
              </select>
            </label>
          </div>
          <div className="pick-skills">
            {level.sections.map(sec => (
              <div key={sec.letter}>
                <div className="muted small pick-section">{sec.icon} {sec.letter}. {sec.name}</div>
                {sec.skills.map(sk => (
                  <label className="assign-skill" key={sk.id}>
                    <input type="checkbox" checked={items.some(i => i.skillId === sk.id)} onChange={() => toggle(sk.id)}
                      disabled={!items.some(i => i.skillId === sk.id) && items.length >= MAX_ITEMS} /> {sk.code} {sk.title}
                  </label>
                ))}
              </div>
            ))}
          </div>
        </>)}
        {items.length > 0 && (
          <div className="challenge-picked">
            <h4>Your challenge ({items.length}/{MAX_ITEMS} skills)</h4>
            {items.map(i => (
              <div className="picked-item" key={i.skillId}>
                <span>{skillName(i.skillId)} — {SKILL_INDEX[i.skillId].skill.title} <span className="muted small">({levelLabelFor(SKILL_INDEX[i.skillId].subject, SKILL_INDEX[i.skillId].grade.num)})</span></span>
                <label className="muted small">correct needed{' '}
                  <input type="number" min="1" max="20" value={i.count}
                    onChange={e => setItems(l => l.map(x => (x.skillId === i.skillId ? { ...x, count: Math.max(1, Math.min(20, Number(e.target.value) || 1)) } : x)))} />
                </label>
                <button type="button" className="btn btn-ghost" aria-label="Remove" onClick={() => toggle(i.skillId)}>✕</button>
              </div>
            ))}
            <label className="block">Challenge name
              <input type="text" maxLength="80" value={title} onChange={e => setTitle(e.target.value)} />
            </label>
            <label className="block">Message (optional)
              <input type="text" maxLength="500" value={note} placeholder={`I challenge you: "${title}"!`} onChange={e => setNote(e.target.value)} />
            </label>
          </div>
        )}
        <div className="anim-controls" style={{ marginTop: 12 }}>
          <button type="button" className="btn btn-primary" disabled={!items.length || busy} onClick={create}>⚔️ Send challenge</button>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/** Challenges page: open challenges, then the full history with a head-to-head record. */
export default function ChallengesPage({ me, toast, onPlay, onOpenChat, refreshKey = 0 }) {
  const [list, setList] = useState(null);
  const meId = me?.user?.id;
  const load = () => api('GET', '/api/challenges').then(r => setList(r.challenges)).catch(e => { toast('⚠️', e.message); setList([]); });
  useEffect(() => { load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

  async function act(c, action) {
    try {
      await api('POST', `/api/challenges/${c.id}/${action}`);
      toast(action === 'accept' ? '🏁' : '👍', action === 'accept' ? 'Challenge accepted — go!' : `Challenge ${action === 'decline' ? 'declined' : 'cancelled'}`);
      load();
    } catch (e) { toast('⚠️', e.message); }
  }

  if (!list) return <main className="page"><p className="muted">Loading challenges…</p></main>;
  const open = list.filter(c => c.status === 'pending' || c.status === 'active');
  const done = list.filter(c => c.status === 'completed');
  const other = list.filter(c => c.status === 'declined' || c.status === 'cancelled');
  const wins = done.filter(c => c.winnerId === meId).length;

  // head-to-head record per classmate
  const h2h = new Map();
  for (const c of done) {
    const rival = c.challenger.id === meId ? c.opponent : c.challenger;
    const r = h2h.get(rival.id) || { name: rival.displayName, id: rival.id, won: 0, lost: 0 };
    c.winnerId === meId ? r.won++ : r.lost++;
    h2h.set(rival.id, r);
  }

  return (
    <main className="page">
      <div className="page-head">
        <h2>⚔️ Challenges</h2>
        <p className="muted">Race a classmate through the same skills — only correct answers count, and the first to finish wins 🏆 +3 ⭐. Start a challenge from 💬 Messages.</p>
      </div>
      <div className="stat-cards">
        <div className="stat-card"><div className="stat-emoji">🏆</div><div className="stat-num">{wins}</div><div className="stat-label">Wins</div></div>
        <div className="stat-card"><div className="stat-emoji">🥈</div><div className="stat-num">{done.length - wins}</div><div className="stat-label">Losses</div></div>
        <div className="stat-card"><div className="stat-emoji">🏁</div><div className="stat-num">{open.length}</div><div className="stat-label">Open</div></div>
      </div>

      <h3 className="section-title">Open challenges</h3>
      {open.length ? open.map(c => <ChallengeCard key={c.id} c={c} meId={meId} onAction={act} onPlay={onPlay} />)
        : <p className="muted">No open challenges. <button type="button" className="btn btn-ghost" onClick={() => onOpenChat(null)}>💬 Challenge a classmate</button></p>}

      {h2h.size > 0 && (<>
        <h3 className="section-title">Head to head</h3>
        <div className="h2h">
          {[...h2h.values()].sort((a, b) => b.won + b.lost - a.won - a.lost).map(r => (
            <button type="button" className="h2h-row" key={r.id} onClick={() => onOpenChat(r.id)}>
              <strong>{r.name}</strong>
              <span className="h2h-score"><span className="won">{r.won}</span> – <span className="lost">{r.lost}</span></span>
              <span className="muted small">{r.won > r.lost ? "you're ahead" : r.won < r.lost ? 'they lead' : 'tied'} · 💬 rematch</span>
            </button>
          ))}
        </div>
      </>)}

      <h3 className="section-title">History</h3>
      {done.length + other.length === 0 ? <p className="muted">Finished challenges will show up here.</p>
        : [...done, ...other].sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt))
          .map(c => <ChallengeCard key={c.id} c={c} meId={meId} onAction={act} onPlay={onPlay} />)}
    </main>
  );
}
