// Homework email reminders. Idempotent via the email_log table:
// each (student, assignment, kind) is sent at most once.
//   'assigned' — fired immediately when a teacher creates homework
//   'due-soon' — fired on the morning the homework is due
//   'overdue'  — fired the day after the due date if still incomplete

const todayStr = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
// node-pg returns DATE columns as Date objects — normalize to YYYY-MM-DD either way
const dateStr = d => (d instanceof Date ? d.toISOString() : String(d)).slice(0, 10);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function assignmentEmail({ student, assignment, kind }) {
  const url = 'https://math.pnpsolutions.ca/learn-math/';
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
    subject: `[MathAce] ${s.title}`,
    html: `
      <div style="font-family:Segoe UI,system-ui,sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#4f46e5">π MathAce</h2>
        <p>Hi ${esc(student.display_name)},</p>
        <p>${s.lead}</p>
        <p style="background:#eef2ff;border-radius:10px;padding:14px">
          <strong>${total} question${total > 1 ? 's' : ''}</strong> across ${assignment.items.length} skill${assignment.items.length > 1 ? 's' : ''} (${skills})
        </p>
        <p>
          <a href="${url}" style="background:#4f46e5;color:#fff;padding:10px 22px;border-radius:8px;text-decoration:none;font-weight:700">
            Open MathAce →
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
