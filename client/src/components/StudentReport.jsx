/* ============================================================
   Teacher reports: what each student did over the last 7 / 30 days.
   Built from the daily activity the server records (activity_days,
   skill_days) plus SmartScores, mastery dates and homework.
   ============================================================ */
import { SKILL_INDEX, gradeLabel } from '../skills.js';
import { niceDate } from '../homework.js';
import { clickable } from '../a11y.js';

export const REPORTS_START = '2026-11-21';   // day-by-day history is recorded from this date

const localDay = d => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
/** the last n calendar days (local), oldest first, ending today */
export const lastDays = (n, end = new Date()) =>
  Array.from({ length: n }, (_, i) => localDay(new Date(end.getTime() - (n - 1 - i) * 864e5)));
const pct = (c, a) => (a ? Math.round(100 * c / a) : null);
const mins = sec => Math.round(sec / 60);
export const fmtMinutes = sec => { const m = mins(sec); return m >= 90 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`; };
const shortDay = day => new Date(day + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const daysAgo = day => Math.round((new Date(localDay(new Date()) + 'T12:00:00') - new Date(day + 'T12:00:00')) / 864e5);
export const agoText = day => (day === null ? 'never' : daysAgo(day) === 0 ? 'today' : daysAgo(day) === 1 ? 'yesterday' : `${daysAgo(day)} days ago`);

/** Everything the report needs about one student for the last `n` days. */
export function summarize(s, n) {
  const today = localDay(new Date());
  const days = lastDays(n), prevDays = lastDays(2 * n).slice(0, n);
  const byDay = new Map((s.activity || []).map(r => [r.day, r]));
  const sum = list => list.reduce((t, d) => {
    const r = byDay.get(d);
    if (r) { t.answered += r.answered; t.correct += r.correct; t.time += r.time_sec; if (r.answered > 0 || r.time_sec >= 60) t.activeDays++; }
    return t;
  }, { answered: 0, correct: 0, time: 0, activeDays: 0 });
  const period = sum(days), prev = sum(prevDays);

  // skills practised in the period
  const inPeriod = new Set(days);
  const skills = new Map();
  for (const r of s.skillDays || []) {
    if (!inPeriod.has(r.day)) continue;
    const k = skills.get(r.skill_id) || { skillId: r.skill_id, answered: 0, correct: 0, lastDay: r.day };
    k.answered += r.answered; k.correct += r.correct; k.lastDay = r.day;
    skills.set(r.skill_id, k);
  }
  const scoreOf = id => s.skillProgress.find(p => p.skill_id === id)?.score || 0;
  const skillRows = [...skills.values()].map(k => ({ ...k, score: scoreOf(k.skillId), accuracy: pct(k.correct, k.answered) }))
    .sort((a, b) => b.answered - a.answered);
  const struggling = skillRows.filter(k => k.answered >= 10 && (k.score < 50 || k.accuracy < 50));
  const start = new Date(days[0] + 'T00:00:00');
  const mastered = s.skillProgress.filter(p => p.mastered_at && new Date(p.mastered_at) >= start)
    .sort((a, b) => new Date(b.mastered_at) - new Date(a.mastered_at));

  const activeList = (s.activity || []).filter(r => r.answered > 0 || r.time_sec >= 60).map(r => r.day).sort();
  const lastActive = activeList.length ? activeList[activeList.length - 1] : null;
  const overdue = s.assignments.filter(a => !a.completed && a.due.slice(0, 10) < today);
  const open = s.assignments.filter(a => !a.completed && a.due.slice(0, 10) >= today);

  const accuracy = pct(period.correct, period.answered);
  const flags = [];
  if (lastActive === null || daysAgo(lastActive) >= 7) flags.push({ id: 'inactive', text: lastActive === null ? 'No practice recorded yet' : `No practice for ${daysAgo(lastActive)} days` });
  if (period.answered >= 20 && accuracy < 60) flags.push({ id: 'accuracy', text: `Low accuracy (${accuracy}%)` });
  if (struggling.length) flags.push({ id: 'struggling', text: `Struggling with ${struggling.length} skill${struggling.length > 1 ? 's' : ''}` });
  if (overdue.length) flags.push({ id: 'overdue', text: `${overdue.length} overdue homework` });
  if (prev.answered >= 20 && period.answered < prev.answered / 2) flags.push({ id: 'dropping', text: 'Practising much less than before' });

  return { n, days, byDay, period, prev, accuracy, skillRows, struggling, mastered, lastActive, overdue, open, flags };
}

const skillLabel = id => {
  const e = SKILL_INDEX[id];
  return e ? `${e.subject.id === 'math' ? '' : e.subject.name + ' '}${e.grade.name} · ${e.skill.code} ${e.skill.title}` : id;
};

const trend = r => {
  if (!r.prev.answered) return r.period.answered ? '🆕' : '—';
  const change = Math.round(100 * (r.period.answered - r.prev.answered) / r.prev.answered);
  return change === 0 ? '→ same' : `${change > 0 ? '▲' : '▼'} ${Math.abs(change)}%`;
};

/** One row per student for the chosen period; click a row to open that student's report. */
export function ClassOverview({ rows, onOpen }) {
  return (
    <div className="report-table-wrap">
      <table className="report-table">
        <thead><tr>
          <th>Student</th><th>Last practised</th><th title="Days with practice">Days</th><th>Time</th><th>Questions</th>
          <th>Accuracy</th><th title="Different skills practised">Skills</th><th>Mastered</th><th title="Questions compared with the previous period">Trend</th><th>Homework</th>
        </tr></thead>
        <tbody>
          {rows.map(({ s, r }) => (
            <tr key={s.id} {...clickable(() => onOpen(s.id))} title={`Open ${s.displayName}'s report`}>
              <td className="report-who"><strong>{s.displayName}</strong> <span className="muted">{s.grade === null ? 'no grade' : gradeLabel(s.grade)}</span>
                <div>{r.flags.length ? r.flags.map(f => <span key={f.id} className="report-flag">⚠️ {f.text}</span>) : <span className="report-good">✓ On track</span>}</div></td>
              <td>{agoText(r.lastActive)}</td>
              <td>{r.period.activeDays} / {r.n}</td>
              <td>{fmtMinutes(r.period.time)}</td>
              <td>{r.period.answered}</td>
              <td>{r.accuracy === null ? '—' : r.accuracy + '%'}</td>
              <td>{r.skillRows.length}</td>
              <td>{r.mastered.length}</td>
              <td>{trend(r)}</td>
              <td>{r.overdue.length ? <span className="report-bad">{r.overdue.length} overdue</span> : r.open.length ? `${r.open.length} open` : '✓'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Class overview as a CSV download (opens in Excel / Google Sheets). */
export function downloadCsv(rows, n) {
  const head = ['Student', 'Username', 'Grade', 'Last practised', `Days active (last ${n})`, 'Minutes', 'Questions', 'Correct', 'Accuracy %',
    'Skills practised', 'Skills mastered', 'Questions in previous period', 'Overdue homework', 'Open homework', 'Needs attention'];
  const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = rows.map(({ s, r }) => [s.displayName, s.username, s.grade === null ? '' : gradeLabel(s.grade), r.lastActive ?? 'never',
    r.period.activeDays, mins(r.period.time), r.period.answered, r.period.correct, r.accuracy ?? '', r.skillRows.length, r.mastered.length,
    r.prev.answered, r.overdue.length, r.open.length, r.flags.map(f => f.text).join('; ')].map(q).join(','));
  const blob = new Blob(['﻿' + [head.map(q).join(','), ...lines].join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `learnace-class-report-${localDay(new Date())}-last-${n}-days.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/** Minutes practised per day — one series, so the title names it (no legend). */
function DailyChart({ r }) {
  const vals = r.days.map(d => ({ day: d, sec: r.byDay.get(d)?.time_sec || 0, q: r.byDay.get(d)?.answered || 0 }));
  const max = Math.max(60, ...vals.map(v => v.sec));
  return (
    <figure className="report-chart">
      <figcaption><strong>Minutes practised per day</strong> <span className="muted">· max {mins(max)} min</span></figcaption>
      <div className="report-bars" role="img" aria-label={`Minutes practised per day over the last ${r.n} days`}>
        {vals.map(v => (
          <div className="report-bar-slot" key={v.day} title={`${shortDay(v.day)}: ${mins(v.sec)} min, ${v.q} questions`}>
            <div className="report-bar" style={{ height: `${Math.max(v.sec ? 3 : 0, 100 * v.sec / max)}%` }} />
          </div>
        ))}
      </div>
      <div className="report-axis muted"><span>{shortDay(r.days[0])}</span><span>today</span></div>
    </figure>
  );
}

/** The full activity report for one student (inside their card on the Student Progress page). */
export function StudentActivity({ s, r }) {
  const tiles = [
    ['Last practised', agoText(r.lastActive)],
    ['Days active', `${r.period.activeDays} of ${r.n}`],
    ['Time', fmtMinutes(r.period.time)],
    ['Questions', `${r.period.answered}`],
    ['Accuracy', r.accuracy === null ? '—' : r.accuracy + '%'],
    ['Skills mastered', `${r.mastered.length}`]
  ];
  return (
    <section className="report-student">
      <h4>📈 Activity — last {r.n} days</h4>
      {s.lastSeen && <p className="muted">Last opened LearnAce {new Date(s.lastSeen).toLocaleString()}.</p>}
      <div className="report-flags">
        {r.flags.length ? r.flags.map(f => <span key={f.id} className="report-flag">⚠️ {f.text}</span>) : <span className="report-good">✓ On track</span>}
      </div>
      <div className="report-tiles">
        {tiles.map(([k, v]) => <div className="report-tile" key={k}><div className="report-tile-v">{v}</div><div className="muted">{k}</div></div>)}
      </div>
      <DailyChart r={r} />

      {r.struggling.length > 0 && (<>
        <h5>⚠️ Needs help with</h5>
        <ul className="report-list">
          {r.struggling.map(k => <li key={k.skillId}>{skillLabel(k.skillId)} — SmartScore {k.score}, {k.accuracy}% correct on {k.answered} questions</li>)}
        </ul>
      </>)}
      {r.mastered.length > 0 && (<>
        <h5>🥇 Mastered in this period</h5>
        <ul className="report-list">
          {r.mastered.map(p => <li key={p.skill_id}>{skillLabel(p.skill_id)} <span className="muted">— {new Date(p.mastered_at).toLocaleDateString()}</span></li>)}
        </ul>
      </>)}

      <h5>Skills practised</h5>
      {r.skillRows.length === 0
        ? <p className="muted">No skills practised in the last {r.n} days.{r.n === 7 ? ' Try the 30-day view.' : ''}</p>
        : (
          <div className="report-table-wrap">
            <table className="report-table compact">
              <thead><tr><th>Skill</th><th>Questions</th><th>Accuracy</th><th>SmartScore now</th><th>Last practised</th></tr></thead>
              <tbody>{r.skillRows.map(k => (
                <tr key={k.skillId}>
                  <td>{skillLabel(k.skillId)}</td><td>{k.answered}</td>
                  <td className={k.accuracy < 50 ? 'report-bad' : ''}>{k.accuracy}%</td>
                  <td>{k.score}{k.score >= 100 ? ' 🥇' : k.score >= 90 ? ' 🥈' : k.score >= 70 ? ' 🥉' : ''}</td>
                  <td>{shortDay(k.lastDay)}</td>
                </tr>))}
              </tbody>
            </table>
          </div>
        )}
      {(r.overdue.length > 0 || r.open.length > 0) && (<>
        <h5>Homework</h5>
        <ul className="report-list">
          {r.overdue.map(a => <li key={a.id} className="report-bad">Overdue since {niceDate(a.due)} — {a.done}/{a.total} done</li>)}
          {r.open.map(a => <li key={a.id}>Due {niceDate(a.due)} — {a.done}/{a.total} done</li>)}
        </ul>
      </>)}
    </section>
  );
}
