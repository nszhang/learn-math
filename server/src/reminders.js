// Homework email reminders. Idempotent via the email_log table:
// each (student, assignment, kind) is sent at most once.
//   'assigned' — fired immediately when a teacher creates homework
//   'due-soon' — fired on the morning the homework is due
//   'overdue'  — fired the day after the due date if still incomplete

// public address of the app, used for links in emails
export const APP_URL = process.env.APP_URL || 'https://learn.pnpsolutions.ca/learnace/';
const todayStr = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
// node-pg returns DATE columns as Date objects — normalize to YYYY-MM-DD either way
const dateStr = d => (d instanceof Date ? d.toISOString() : String(d)).slice(0, 10);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function assignmentEmail({ student, assignment, kind }) {
  const url = APP_URL;
  const due = dateStr(assignment.due);
  const pretty = new Date(due + 'T12:00:00').toLocaleDateString('en-CA',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const skills = (assignment.items || [])
    .map(i => `${i.count} question${i.count > 1 ? 's' : ''} of a skill`)
    .join(', ');
  const total = (assignment.items || []).reduce((s, i) => s + i.count, 0);

  const subjects = {
    assigned: { title: 'New homework assigned 📝', lead: `Your teacher assigned you homework due <strong>${pretty}</strong>.` },
    'due-soon': { title: 'Homework due today! ⏰', lead: `Just a friendly reminder — your homework is due <strong>today (${pretty})</strong> and isn't finished yet.` },
    overdue: { title: 'Homework overdue 😬', lead: `Your homework was due <strong>${pretty}</strong> and is still incomplete. It's not too late to finish it!` }
  };
  const s = subjects[kind];

  return {
    subject: `[LearnAce] ${s.title}`,
    html: `
      <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#4f46e5">A+ LearnAce</h2>
        <p>Hi ${esc(student.display_name)},</p>
        <p>${s.lead}</p>
        <p style="background:#eef2ff;border-radius:10px;padding:14px">
          <strong>${total} question${total > 1 ? 's' : ''}</strong> across ${assignment.items.length} skill${assignment.items.length > 1 ? 's' : ''} (${skills})
        </p>
        <p>
          <a href="${url}" style="background:#4f46e5;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:700">
            Open LearnAce →
          </a>
        </p>
        <p style="color:#94a3b8;font-size:13px">Wrong answers still count as done — just do your best! 💪</p>
      </div>`
  };
}

export async function sendAssignmentEmail(pool, mailer, { student, assignment, kind }) {
  const already = await pool.query(
    'SELECT 1 FROM email_log WHERE user_id = $1 AND assignment_id = $2 AND kind = $3',
    [student.id, assignment.id, kind]);
  if (already.rowCount) return { sent: false, reason: 'already-sent' };

  const { subject, html } = assignmentEmail({ student, assignment, kind });
  const result = await mailer.send({ to: student.email, subject, html });
  if (result.skipped) return { sent: false, reason: 'smtp-not-configured' };

  await pool.query(
    'INSERT INTO email_log (user_id, assignment_id, kind) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
    [student.id, assignment.id, kind]);
  return { sent: true };
}

/** Tell the teacher that a student has finished an assignment (sent once, when it completes). */
export async function sendCompletionEmail(pool, mailer, { assignmentId, studentId, titles = {} }) {
  const row = await pool.query(
    `SELECT a.id, a.due, a.items, t.email AS teacher_email, t.display_name AS teacher_name, s.display_name AS student_name
       FROM assignments a JOIN users t ON t.id = a.teacher_id JOIN users s ON s.id = a.student_id
      WHERE a.id = $1 AND a.student_id = $2`, [assignmentId, studentId]).then(r => r.rows[0]);
  if (!row) return { sent: false, reason: 'no-assignment' };
  if (!row.teacher_email) return { sent: false, reason: 'teacher-has-no-email' };
  const progress = await pool.query(
    'SELECT skill_id, done, correct FROM homework_progress WHERE user_id = $1 AND assignment_id = $2', [studentId, assignmentId]).then(r => r.rows);
  const due = dateStr(row.due), today = todayStr(), late = today > due;
  const prettyDue = new Date(due + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });
  let answered = 0, right = 0;
  const lines = (row.items || []).map(i => {
    const p = progress.find(x => x.skill_id === i.skillId) || { done: 0, correct: 0 };
    answered += Math.min(p.done, i.count); right += Math.min(p.correct, i.count);
    const pct = p.done ? Math.round((100 * p.correct) / p.done) : 0;
    const name = esc(String(titles[i.skillId] || i.skillId).slice(0, 120));
    return `<tr><td style="padding:4px 10px">${name}</td><td style="padding:4px 10px;text-align:center">${p.correct} / ${p.done}</td><td style="padding:4px 10px;text-align:center">${pct}%</td></tr>`;
  }).join('');
  const pct = answered ? Math.round((100 * right) / answered) : 0;
  const subject = `[LearnAce] ${row.student_name} finished their homework ✅`;
  const html = `
      <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#4f46e5">A+ LearnAce</h2>
        <p>Hi ${esc(row.teacher_name)},</p>
        <p><strong>${esc(row.student_name)}</strong> has completed the homework you assigned (due ${prettyDue})${late ? ' — <span style="color:#b45309">after the due date</span>' : ' on time'}.</p>
        <p style="background:#eef2ff;border-radius:10px;padding:14px">Overall: <strong>${pct}% correct</strong></p>
        <table style="border-collapse:collapse;font-size:14px"><tr style="background:#f1f5f9"><th style="padding:4px 10px;text-align:left">Skill</th><th style="padding:4px 10px">Correct</th><th style="padding:4px 10px">Accuracy</th></tr>${lines}</table>
        <p style="margin-top:18px"><a href="${APP_URL}" style="background:#4f46e5;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:700">Open LearnAce →</a></p>
        <p style="color:#94a3b8;font-size:13px">A skill reached at SmartScore 100 counts as complete, so it may show fewer answers than assigned.</p>
      </div>`;
  const result = await mailer.send({ to: row.teacher_email, subject, html });
  return result.skipped ? { sent: false, reason: 'smtp-not-configured' } : { sent: true };
}

export async function runReminderScan(pool, mailer) {
  const today = todayStr();
  const { rows } = await pool.query(`
    SELECT a.id, a.due, a.items, u.id AS uid, u.email, u.display_name,
           (hc.user_id IS NOT NULL) AS done,
           array_agg(el.kind) FILTER (WHERE el.kind IS NOT NULL) AS sent_kinds
    FROM assignments a
    JOIN users u ON u.id = a.student_id
    LEFT JOIN homework_completed hc ON hc.user_id = u.id AND hc.assignment_id = a.id
    LEFT JOIN email_log el ON el.user_id = u.id AND el.assignment_id = a.id
    WHERE u.email IS NOT NULL
    GROUP BY a.id, a.due, a.items, u.id, u.email, u.display_name, hc.user_id`);

  const out = [];
  for (const r of rows) {
    if (r.done) continue;
    const sent = new Set(r.sent_kinds || []);
    const student = { id: r.uid, email: r.email, display_name: r.display_name };
    const assignment = { id: r.id, due: r.due, items: r.items };
    const due = dateStr(r.due);

    if (due === today && !sent.has('due-soon')) {
      const res = await sendAssignmentEmail(pool, mailer, { student, assignment, kind: 'due-soon' });
      out.push({ kind: 'due-soon', to: r.email, ...res });
    } else if (due < today && !sent.has('overdue')) {
      const res = await sendAssignmentEmail(pool, mailer, { student, assignment, kind: 'overdue' });
      out.push({ kind: 'overdue', to: r.email, ...res });
    }
  }
  return out;
}
