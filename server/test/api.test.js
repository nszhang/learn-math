// End-to-end API tests against an in-memory PostgreSQL (pg-mem).
// Account model: no public signup — an admin (seeded directly) creates
// student/teacher accounts and assigns teacher rosters.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { newDb } from 'pg-mem';
import bcrypt from 'bcryptjs';
import { createApp } from '../src/app.js';
import { runReminderScan } from '../src/reminders.js';
import { initSchema, createUser } from '../src/db.js';

let server, base, pool, sent;   // `sent` captures fake-mailer deliveries

function fakeMailer() {
  return {
    configured: true,
    async send({ to, subject }) { sent.push({ to, subject }); return { messageId: 'fake' }; }
  };
}

before(async () => {
  const mem = newDb();
  const pgAdapter = mem.adapters.createPg();
  pool = new pgAdapter.Pool();
  await initSchema(pool);
  const app = createApp(pool, 'test-secret', fakeMailer());
  await new Promise(resolve => { server = app.listen(0, resolve); });
  base = `http://localhost:${server.address().port}`;

  // seed the bootstrap admin directly in the DB
  await createUser(pool, {
    username: 'admin',
    displayName: 'Admin',
    passHash: await bcrypt.hash('adminpw', 10),
    role: 'admin'
  });
});

after(() => server.close());

async function api(method, path, { token, body } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function login(username, password) {
  const r = await api('POST', '/api/auth/login', { body: { username, password } });
  assert.equal(r.status, 200, `login ${username}`);
  return r.data;
}

let admin, student, teacher, student2;

test('public signup is gone; login works', async () => {
  let r = await api('POST', '/api/auth/signup',
    { body: { username: 'hacker', password: 'pw123', role: 'teacher' } });
  assert.equal(r.status, 404, 'public signup endpoint removed');

  admin = await login('admin', 'adminpw');
  assert.equal(admin.user.role, 'admin');

  r = await api('POST', '/api/auth/login', { body: { username: 'admin', password: 'wrong' } });
  assert.equal(r.status, 401);
});

test('admin creates accounts; validation rules', async () => {
  let r = await api('POST', '/api/admin/users', { token: admin.token,
    body: { username: 'x', role: 'student' } });
  assert.equal(r.status, 400, 'bad username rejected');
  r = await api('POST', '/api/admin/users', { token: admin.token,
    body: { username: 'valid', role: 'wizard' } });
  assert.equal(r.status, 400, 'bad role rejected');

  r = await api('POST', '/api/admin/users', { token: admin.token,
    body: { username: 'stu1', displayName: 'Stu', password: 'pw123', role: 'student' } });
  assert.equal(r.status, 200);
  assert.equal(r.data.user.role, 'student');
  assert.equal(r.data.generated, false);

  r = await api('POST', '/api/admin/users', { token: admin.token,
    body: { username: 'stu2', displayName: 'Stu Two', role: 'student' } });
  assert.equal(r.status, 200);
  assert.ok(r.data.password && r.data.generated, 'password auto-generated');
  student2 = r.data;

  r = await api('POST', '/api/admin/users', { token: admin.token,
    body: { username: 'stu1', role: 'student' } });
  assert.equal(r.status, 409, 'duplicate username rejected');

  r = await api('POST', '/api/admin/users', { token: admin.token,
    body: { username: 'teach', displayName: 'Mrs Teach', password: 'pw123', role: 'teacher' } });
  assert.equal(r.status, 200);
  teacher = r.data;

  student = await login('stu1', 'pw123');
  teacher = await login('teach', 'pw123');
});

test('admin routes are admin-only', async () => {
  let r = await api('GET', '/api/admin/users', { token: student.token });
  assert.equal(r.status, 403);
  r = await api('POST', '/api/admin/users', { token: teacher.token, body: {} });
  assert.equal(r.status, 403);
  r = await api('GET', '/api/admin/users');
  assert.equal(r.status, 401);

  r = await api('GET', '/api/admin/users', { token: admin.token });
  assert.equal(r.status, 200);
  assert.equal(r.data.users.length, 4);
  assert.ok(Array.isArray(r.data.rosters));
});

test('teacher sees only rostered students; assignments enforced', async () => {
  let r = await api('GET', '/api/students', { token: teacher.token });
  assert.equal(r.status, 200);
  assert.equal(r.data.length, 0, 'no roster yet — no students visible');

  const today = new Date().toLocaleDateString('en-CA');
  const stuId = student.user.id;
  r = await api('POST', '/api/assignments', { token: teacher.token,
    body: { studentId: stuId, due: today, items: [{ skillId: 'algA1', count: 3 }] } });
  assert.equal(r.status, 403, 'cannot assign homework outside roster');

  // admin sets the roster: teacher -> stu1 only
  r = await api('PUT', `/api/admin/teachers/${teacher.user.id}/students`,
    { token: admin.token, body: { studentIds: [student.user.id] } });
  assert.equal(r.status, 200);
  assert.equal(r.data.count, 1);

  // roster validation: non-student ids rejected
  r = await api('PUT', `/api/admin/teachers/${teacher.user.id}/students`,
    { token: admin.token, body: { studentIds: [admin.user.id] } });
  assert.equal(r.status, 400);

  r = await api('GET', '/api/students', { token: teacher.token });
  assert.equal(r.data.length, 1);
  assert.equal(r.data[0].username, 'stu1');
});

test('answering questions updates SmartScore, stats, and awards', async () => {
  let r = await api('POST', '/api/answers',
    { token: student.token, body: { skillId: 'algB1', correct: true, streak: 1 } });
  assert.equal(r.status, 200);
  assert.ok(r.data.score > 0 && r.data.score <= 100, `score in range, got ${r.data.score}`);
  assert.ok(r.data.newAwards.some(a => a.id === 'first'), 'First Steps badge earned');
  assert.ok(r.data.stars >= 2, 'badge stars granted');

  for (let i = 0; i < 12; i++) {
    r = await api('POST', '/api/answers',
      { token: student.token, body: { skillId: 'algB1', correct: true, streak: i + 2 } });
  }
  const me = await api('GET', '/api/me', { token: student.token });
  const b1 = me.data.skillProgress.find(p => p.skill_id === 'algB1');
  assert.ok(b1.score >= 70, `B1 should be bronze+, got ${b1.score}`);
  assert.ok(b1.medals.includes('bronze'), 'bronze medal stored');
  assert.equal(me.data.stats.answered, 13);
  assert.equal(me.data.stats.correct, 13);
  assert.equal(me.data.stats.best_streak, 13);

  r = await api('POST', '/api/answers', { token: student.token, body: { skillId: 'XX', correct: true } });
  assert.equal(r.status, 400, 'unknown skill rejected');
});

test('score never goes below 0 on wrong answers', async () => {
  for (let i = 0; i < 5; i++) {
    const r = await api('POST', '/api/answers',
      { token: student.token, body: { skillId: 'algD1', correct: false, streak: 0 } });
    assert.ok(r.data.score >= 0);
  }
});

test('teacher assigns homework; student completes at exactly N questions', async () => {
  const students = await api('GET', '/api/students', { token: teacher.token });
  const stu = students.data.find(s => s.username === 'stu1');
  assert.ok(stu, 'teacher sees rostered student');

  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  let r = await api('POST', '/api/assignments', {
    token: teacher.token,
    body: { studentId: stu.id, due: today, items: [{ skillId: 'algA1', count: 10 }] }
  });
  assert.equal(r.status, 200);
  const assignmentId = r.data.id;

  const hw = await api('GET', '/api/homework', { token: student.token });
  const a = hw.data.assignments.find(x => x.id === assignmentId);
  assert.equal(a.items[0].count, 10);
  assert.equal(a.done, 0);
  assert.equal(a.completed, false);

  let justCompletedAt = -1;
  for (let i = 1; i <= 12; i++) {
    r = await api('POST', '/api/answers', {
      token: student.token,
      body: { skillId: 'algA1', correct: !(i === 3 || i === 7), streak: 1, assignmentId }
    });
    if (r.data.homework?.justCompleted) justCompletedAt = i;
  }
  assert.equal(justCompletedAt, 10, 'homework completed at exactly 10 answers');
  assert.ok(r.data.homework.done >= 10);

  const hw2 = await api('GET', '/api/homework', { token: student.token });
  assert.equal(hw2.data.assignments.find(x => x.id === assignmentId).completed, true);
  const list = await api('GET', '/api/assignments', { token: teacher.token });
  const row = list.data.find(x => x.id === assignmentId);
  assert.equal(row.completed, true);
  assert.ok(row.done >= 10);

  const me = await api('GET', '/api/me', { token: student.token });
  assert.equal(me.data.stats.homework_done, 1);
  assert.ok(me.data.awards.some(a => a.award_id === 'hw1'), 'Homework Hero badge');
});

test('daily homework: client-computed items tracked server-side', async () => {
  const today = new Date().toLocaleDateString('en-CA');
  const id = `daily-${today}`;
  const items = [{ skillId: 'algC1', count: 2 }];
  for (let i = 0; i < 2; i++) {
    const r = await api('POST', '/api/answers', {
      token: student.token, body: { skillId: 'algC1', correct: true, streak: 2, assignmentId: id, items }
    });
    if (i === 1) assert.equal(r.data.homework.justCompleted, true, 'daily completes at count');
  }
  const hw = await api('GET', '/api/homework', { token: student.token });
  assert.ok(hw.data.dailyCompleted.includes(id));
});

test('time tracking accumulates and awards stars over time', async () => {
  const r = await api('POST', '/api/time', { token: student.token, body: { seconds: 601 } });
  assert.equal(r.status, 200); // clamps to 600
  const me = await api('GET', '/api/me', { token: student.token });
  assert.equal(me.data.stats.time_sec, 600);
  assert.ok(me.data.awards.some(a => a.award_id === 'time10'), 'Dedicated badge at 10 min');
});

test('authorization rules', async () => {
  let r = await api('GET', '/api/me');
  assert.equal(r.status, 401);
  r = await api('GET', '/api/students', { token: student.token });
  assert.equal(r.status, 403, 'students cannot access teacher routes');
  r = await api('POST', '/api/assignments', { token: student.token, body: {} });
  assert.equal(r.status, 403);
});

test('teacher can delete own assignment only', async () => {
  const students = await api('GET', '/api/students', { token: teacher.token });
  const stu = students.data.find(s => s.username === 'stu1');
  const r = await api('POST', '/api/assignments', {
    token: teacher.token,
    body: { studentId: stu.id, due: '2030-01-01', items: [{ skillId: 'expB4', count: 3 }] }
  });
  const id = r.data.id;
  const del = await api('DELETE', `/api/assignments/${id}`, { token: student.token });
  assert.equal(del.status, 403);
  const del2 = await api('DELETE', `/api/assignments/${id}`, { token: teacher.token });
  assert.equal(del2.status, 200);
});

test('password change: requires current, invalidates old', async () => {
  let r = await api('POST', '/api/auth/password', { token: student.token,
    body: { currentPassword: 'wrong', newPassword: 'newpw99' } });
  assert.equal(r.status, 403, 'wrong current password rejected');
  r = await api('POST', '/api/auth/password', { token: student.token,
    body: { currentPassword: 'pw123', newPassword: 'newpw99' } });
  assert.equal(r.status, 200);
  r = await api('POST', '/api/auth/login', { body: { username: 'stu1', password: 'pw123' } });
  assert.equal(r.status, 401, 'old password no longer works');
  r = await api('POST', '/api/auth/login', { body: { username: 'stu1', password: 'newpw99' } });
  assert.equal(r.status, 200);
  student = r.data;
});

test('admin resets passwords and deletes accounts', async () => {
  // reset stu2's generated password
  let r = await api('POST', `/api/admin/users/${student2.user.id}/password`,
    { token: admin.token, body: {} });
  assert.equal(r.status, 200);
  assert.ok(r.data.generated);
  const login2 = await api('POST', '/api/auth/login',
    { body: { username: 'stu2', password: r.data.password } });
  assert.equal(login2.status, 200, 'reset password works');

  // roster cleanup then delete stu2
  r = await api('PUT', `/api/admin/teachers/${teacher.user.id}/students`,
    { token: admin.token, body: { studentIds: [student.user.id] } });
  assert.equal(r.status, 200);
  r = await api('DELETE', `/api/admin/users/${student2.user.id}`, { token: admin.token });
  assert.equal(r.status, 200);
  r = await api('POST', '/api/auth/login', { body: { username: 'stu2', password: 'whatever' } });
  assert.equal(r.status, 401, 'deleted user cannot log in');

  // guards
  r = await api('DELETE', `/api/admin/users/${admin.user.id}`, { token: admin.token });
  assert.equal(r.status, 400, 'cannot delete yourself');
  r = await api('DELETE', '/api/admin/users/99999', { token: admin.token });
  assert.equal(r.status, 404);
});


test('emails: user email field + assignment notification + reminders', async () => {
  sent = [];
  const today = new Date().toLocaleDateString('en-CA');
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA');

  // admin sets an email on a student
  let r = await api('PUT', `/api/admin/users/${student.user.id}/email`,
    { token: admin.token, body: { email: 'stu@example.com' } });
  assert.equal(r.status, 200);
  assert.equal(r.data.user.email, 'stu@example.com');
  r = await api('PUT', `/api/admin/users/${student.user.id}/email`,
    { token: admin.token, body: { email: 'not-an-email' } });
  assert.equal(r.status, 400, 'invalid email rejected');

  // teacher assigns homework due today → immediate 'assigned' email
  r = await api('POST', '/api/assignments', { token: teacher.token,
    body: { studentId: student.user.id, due: today, items: [{ skillId: 'algA1', count: 2 }] } });
  assert.equal(r.status, 200);
  const todayId = r.data.id;
  await new Promise(res => setTimeout(res, 50)); // fire-and-forget send
  assert.ok(sent.some(x => x.to === 'stu@example.com' && x.subject.includes('New homework')),
    'assigned email sent immediately');

  // a second assignment already overdue (created directly in the DB)
  await pool.query(`INSERT INTO assignments (id, teacher_id, student_id, due, items)
    VALUES ('emailtest-overdue', $1, $2, $3, $4)`,
    [teacher.user.id, student.user.id, yesterday, JSON.stringify([{ skillId: 'algB1', count: 3 }])]);

  // reminder scan: due-today reminder + overdue notice
  sent = [];
  const out = await runReminderScan(pool, fakeMailer());
  assert.ok(out.some(x => x.kind === 'due-soon' && x.sent), 'due-soon reminder sent');
  assert.ok(out.some(x => x.kind === 'overdue' && x.sent), 'overdue reminder sent');
  assert.equal(sent.length, 2, 'exactly two reminder emails');

  // idempotent: a second scan sends nothing
  sent = [];
  const out2 = await runReminderScan(pool, fakeMailer());
  assert.equal(out2.filter(x => x.sent).length, 0, 'no duplicate reminders');
  assert.equal(sent.length, 0);

  // completing the homework stops future scans for it
  await pool.query('INSERT INTO homework_completed (user_id, assignment_id) VALUES ($1, $2)',
    [student.user.id, 'emailtest-overdue']);
  sent = [];
  const out3 = await runReminderScan(pool, fakeMailer());
  assert.ok(!out3.some(x => x.kind === 'overdue'), 'completed homework gets no overdue email');

  // cleanup the direct-insert row so later scans stay quiet
  await pool.query('DELETE FROM assignments WHERE id = $1', ['emailtest-overdue']);
});

test('emails: users without an email are simply skipped', async () => {
  const out = await runReminderScan(pool, fakeMailer());
  // the today-assignment from the previous test still belongs to a student WITH email
  // so filter for other students: none should appear
  assert.ok(out.every(x => x.to === 'stu@example.com' || x.sent === false));
});

test('validation: bad homework input is rejected, not a 500 or free stars', async () => {
  let r = await api('POST', '/api/assignments', { token: teacher.token,
    body: { studentId: student.user.id, due: '2026-13-45', items: [{ skillId: 'algA1', count: 2 }] } });
  assert.equal(r.status, 400, 'impossible due date rejected');

  r = await api('POST', '/api/answers', { token: student.token,
    body: { skillId: 'algA1', correct: true, assignmentId: 42 } });
  assert.equal(r.status, 400, 'non-string assignmentId rejected');

  r = await api('POST', '/api/answers', { token: student.token,
    body: { skillId: 'algA1', correct: true, assignmentId: 'daily-whatever', items: [{ skillId: 'algA1', count: 1 }] } });
  assert.equal(r.status, 400, 'malformed daily id rejected');

  r = await api('POST', '/api/answers', { token: student.token,
    body: { skillId: 'algA1', correct: true, assignmentId: 'daily-2026-01-01', items: [] } });
  assert.equal(r.status, 400, 'empty daily set cannot be "completed"');
});

test('every skill in the client catalog is accepted by the server whitelist', async () => {
  const { EVERY_SKILL } = await import('../../client/src/skills.js');
  const { isSkillId } = await import('../src/app.js');
  const missing = EVERY_SKILL.map(s => s.id).filter(id => !isSkillId(id));
  assert.deepEqual(missing, []);
});
