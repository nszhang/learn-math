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
    async send({ to, subject, html }) { sent.push({ to, subject, html }); return { messageId: 'fake' }; }
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

after(() => { server.closeAllConnections?.(); server.close(); });

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

test('homework: reaching SmartScore 100 completes that skill, no more questions needed', async () => {
  const id = 'daily-2026-02-02';
  const items = [{ skillId: 'algC1', count: 50 }, { skillId: 'algA1', count: 1 }];
  let r;
  for (let i = 0; i < 50; i++) {
    r = await api('POST', '/api/answers', { token: student.token, body: { skillId: 'algC1', correct: true, streak: i + 1, assignmentId: id, items } });
    if (r.data.score >= 100) break;
  }
  assert.equal(r.data.score, 100);
  assert.equal(r.data.homework.mastered, true);
  assert.equal(r.data.homework.skillDone, 50, 'mastered skill counts as fully done');
  assert.equal(r.data.homework.done, 50);
  assert.equal(r.data.homework.justCompleted, false, 'the other skill is still to do');
  r = await api('POST', '/api/answers', { token: student.token, body: { skillId: 'algA1', correct: true, streak: 1, assignmentId: id, items } });
  assert.equal(r.data.homework.justCompleted, true);
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
  for (let t = 0; t < 40 && !sent.some(x => x.subject.includes('New homework')); t++) await new Promise(res => setTimeout(res, 50)); // fire-and-forget send
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

  // the teacher hears about it once the student finishes the homework
  await api('PUT', `/api/admin/users/${teacher.user.id}/email`, { token: admin.token, body: { email: 'teach@example.com' } });
  sent = [];
  for (let i = 0; i < 2; i++) await api('POST', '/api/answers', { token: student.token, body: { skillId: 'algA1', correct: i === 0, streak: 0, assignmentId: todayId, skillTitles: { algA1: 'A.1 <b>Variables</b>' } } });
  for (let t = 0; t < 40 && !sent.some(x => x.to === 'teach@example.com'); t++) await new Promise(res => setTimeout(res, 50));  // fire-and-forget send
  const done = sent.filter(x => x.to === 'teach@example.com');
  assert.equal(done.length, 1, 'one completion email to the teacher');
  assert.ok(/finished their homework/.test(done[0].subject));
  assert.ok(done[0].html.includes('50% correct') && done[0].html.includes('&lt;b&gt;Variables'), 'summary included and titles escaped');
  sent = [];
  await api('POST', '/api/answers', { token: student.token, body: { skillId: 'algA1', correct: true, streak: 0, assignmentId: todayId } });
  await new Promise(res => setTimeout(res, 50));
  assert.equal(sent.length, 0, 'no repeat email after completion');

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

test('student grade: set on create, by admin, and by roster teacher only', async () => {
  let r = await api('POST', '/api/admin/users', { token: admin.token, body: { username: 'gr_kid', role: 'student', password: 'pw123', grade: 4 } });
  assert.equal(r.status, 200);
  assert.equal(r.data.user.grade, 4, 'grade stored on create');
  const kidId = r.data.user.id;
  r = await api('POST', '/api/admin/users', { token: admin.token, body: { username: 'gr_bad', role: 'student', grade: 13 } });
  assert.equal(r.status, 400, 'grade out of range rejected');

  r = await api('PUT', `/api/admin/users/${kidId}/grade`, { token: admin.token, body: { grade: 5 } });
  assert.equal(r.status, 200);
  r = await api('GET', '/api/admin/users', { token: admin.token });
  assert.equal(r.data.users.find(u => u.id === kidId).grade, 5);

  // teacher can't change a student outside their roster…
  r = await api('PUT', `/api/students/${kidId}/grade`, { token: teacher.token, body: { grade: 6 } });
  assert.equal(r.status, 403);
  // …but can for a rostered student, and the student sees it
  r = await api('PUT', `/api/students/${student.user.id}/grade`, { token: teacher.token, body: { grade: 7 } });
  assert.equal(r.status, 200);
  r = await api('GET', '/api/students', { token: teacher.token });
  assert.equal(r.data.find(s => s.id === student.user.id).grade, 7);
  r = await api('GET', '/api/me', { token: student.token });
  assert.equal(r.data.user.grade, 7);
  r = await api('GET', '/api/homework', { token: student.token });
  assert.equal(r.data.grade, 7);
  r = await api('PUT', `/api/admin/users/${kidId}/grade`, { token: admin.token, body: { grade: 0 } });
  assert.equal(r.status, 200, 'Kindergarten (0) is a valid grade');
  // clearing
  r = await api('PUT', `/api/students/${student.user.id}/grade`, { token: teacher.token, body: { grade: null } });
  assert.equal(r.status, 200);
  r = await api('PUT', `/api/students/${student.user.id}/grade`, { token: student.token, body: { grade: 3 } });
  assert.equal(r.status, 403, 'students cannot set their own grade');
});

test('HSK level: independent of grade, students advance themselves, teachers for roster only', async () => {
  let r = await api('GET', '/api/me', { token: student.token });
  assert.equal(r.data.user.hskLevel, 1, 'everyone starts at HSK 1');
  r = await api('PUT', '/api/me/hsk-level', { token: student.token, body: { level: 3 } });
  assert.equal(r.status, 200, 'a keen student can move themselves up');
  r = await api('GET', '/api/homework', { token: student.token });
  assert.equal(r.data.hskLevel, 3);
  r = await api('PUT', '/api/me/hsk-level', { token: student.token, body: { level: 7 } });
  assert.equal(r.status, 400, 'only HSK 1–6');
  r = await api('PUT', '/api/me/hsk-level', { token: teacher.token, body: { level: 2 } });
  assert.equal(r.status, 403, 'teachers have no HSK level of their own');
  r = await api('PUT', `/api/students/${student.user.id}/hsk-level`, { token: teacher.token, body: { level: 2 } });
  assert.equal(r.status, 200);
  r = await api('GET', '/api/students', { token: teacher.token });
  assert.equal(r.data.find(s => s.id === student.user.id).hskLevel, 2);
  const other = await api('POST', '/api/admin/users', { token: admin.token, body: { username: 'hsk_other', role: 'student', password: 'pw123' } });
  r = await api('PUT', `/api/students/${other.data.user.id}/hsk-level`, { token: teacher.token, body: { level: 4 } });
  assert.equal(r.status, 403, 'not in roster');
  r = await api('PUT', `/api/admin/users/${other.data.user.id}/hsk-level`, { token: admin.token, body: { level: 4 } });
  assert.equal(r.status, 200);
});

test('Chinese review deck: words join when seen, move up boxes when reviewed, drop back on a miss', async () => {
  const post = body => api('POST', '/api/review', { token: student.token, body });
  let r = await post({ word: '你好', correct: true, today: '2026-03-01', mode: 'seen' });
  assert.equal(r.status, 200);
  assert.deepEqual([r.data.word.box, r.data.word.due], [1, '2026-03-02'], 'new word: due tomorrow');
  r = await post({ word: '你好', correct: true, today: '2026-03-01', mode: 'seen' });
  assert.equal(r.data.word.box, 1, 'a correct answer in ordinary practice does not move the schedule');
  r = await post({ word: '你好', correct: true, today: '2026-03-02', mode: 'review' });
  assert.deepEqual([r.data.word.box, r.data.word.due], [2, '2026-03-05'], 'box 2: 3 days');
  r = await post({ word: '你好', correct: true, today: '2026-03-05', mode: 'review' });
  assert.deepEqual([r.data.word.box, r.data.word.due], [3, '2026-03-12'], 'box 3: a week');
  r = await post({ word: '你好', correct: false, today: '2026-03-12', mode: 'review' });
  assert.deepEqual([r.data.word.box, r.data.word.due, r.data.word.lapses], [0, '2026-03-13', 1], 'a miss starts it over');
  r = await api('GET', '/api/review', { token: student.token });
  assert.equal(r.data.words.find(w => w.word === '你好').reviews, 3);
  assert.equal((await post({ word: 'hello', correct: true, today: '2026-03-01', mode: 'seen' })).status, 400);
  assert.equal((await post({ word: '好', correct: true, today: 'soon', mode: 'seen' })).status, 400);
  assert.equal((await post({ word: '好', correct: true, today: '2026-03-01', mode: 'cheat' })).status, 400);
  r = await api('GET', '/api/students', { token: teacher.token });
  assert.equal(typeof r.data.find(s => s.id === student.user.id).wordsKnown, 'number');
});

test('messages: classmates and teachers only; unread counts', async () => {
  const mk = async (username, role) => (await api('POST', '/api/admin/users', { token: admin.token, body: { username, displayName: username.toUpperCase(), password: 'pw123', role } })).data.user;
  const [t, a, b, x] = [await mk('msg_teach', 'teacher'), await mk('msg_ann', 'student'), await mk('msg_ben', 'student'), await mk('msg_out', 'student')];
  let r = await api('PUT', `/api/admin/teachers/${t.id}/students`, { token: admin.token, body: { studentIds: [a.id, b.id] } });
  assert.equal(r.status, 200);
  const [ann, ben, out, teach] = [await login('msg_ann', 'pw123'), await login('msg_ben', 'pw123'), await login('msg_out', 'pw123'), await login('msg_teach', 'pw123')];

  r = await api('GET', '/api/contacts', { token: ann.token });
  assert.deepEqual(r.data.contacts.map(c => c.username).sort(), ['msg_ben', 'msg_teach'], 'classmates + own teacher');
  r = await api('POST', `/api/messages/${x.id}`, { token: ann.token, body: { body: 'hi' } });
  assert.equal(r.status, 403, 'no messaging strangers');
  r = await api('POST', `/api/messages/${b.id}`, { token: ann.token, body: { body: '' } });
  assert.equal(r.status, 400);
  r = await api('POST', `/api/messages/${b.id}`, { token: ann.token, body: { body: 'x'.repeat(501) } });
  assert.equal(r.status, 400, 'length limit');
  r = await api('POST', `/api/messages/${b.id}`, { token: ann.token, body: { body: 'Hi Ben! Race me?' } });
  assert.equal(r.status, 200);
  r = await api('GET', '/api/inbox', { token: ben.token });
  assert.equal(r.data.unread, 1);
  r = await api('GET', `/api/messages/${a.id}`, { token: ben.token });
  assert.equal(r.data.messages.at(-1).body, 'Hi Ben! Race me?');
  r = await api('GET', '/api/inbox', { token: ben.token });
  assert.equal(r.data.unread, 0, 'opening the conversation marks it read');
  r = await api('POST', `/api/messages/${a.id}`, { token: teach.token, body: { body: 'Great work today' } });
  assert.equal(r.status, 200, 'teacher can message their student');
  r = await api('GET', '/api/messages', { token: out.token });
  assert.deepEqual(r.data.threads, [], 'no contacts, no threads');

  // ---------- challenges ----------
  const items = [{ skillId: 'algA1', count: 2 }];
  r = await api('POST', '/api/challenges', { token: ann.token, body: { opponentId: x.id, items, title: 'Race' } });
  assert.equal(r.status, 403, 'classmates only');
  r = await api('POST', '/api/challenges', { token: teach.token, body: { opponentId: a.id, items, title: 'Race' } });
  assert.equal(r.status, 403, 'students only');
  r = await api('POST', '/api/challenges', { token: ann.token, body: { opponentId: b.id, items: [{ skillId: 'nope!', count: 2 }], title: 'Race' } });
  assert.equal(r.status, 400);
  r = await api('POST', '/api/challenges', { token: ann.token, body: { opponentId: b.id, items, title: 'Algebra race' } });
  assert.equal(r.status, 200);
  const id = r.data.challenge.id;
  assert.equal(r.data.challenge.status, 'pending');
  r = await api('GET', '/api/inbox', { token: ben.token });
  assert.equal(r.data.pendingChallenges, 1);

  const answer = (who, correct) => api('POST', '/api/answers', { token: who.token, body: { skillId: 'algA1', correct, streak: 0, challengeId: id } });
  r = await api('POST', `/api/challenges/${id}/accept`, { token: ann.token });
  assert.equal(r.status, 404, 'only the opponent accepts');
  r = await api('POST', `/api/challenges/${id}/accept`, { token: ben.token });
  assert.equal(r.data.challenge.status, 'active');

  r = await answer(ann, true);
  assert.deepEqual([r.data.challenge.done, r.data.challenge.total], [1, 2]);
  r = await answer(ann, false);
  assert.equal(r.data.challenge.done, 1, 'wrong answers do not count toward finishing');
  r = await answer(ben, true);
  const starsBefore = (await api('GET', '/api/me', { token: ann.token })).data.user.stars;
  r = await answer(ann, true);
  assert.equal(r.data.challenge.won, true, 'first to finish wins');
  const starsAfter = (await api('GET', '/api/me', { token: ann.token })).data.user.stars;
  assert.ok(starsAfter >= starsBefore + 3, 'winner earns stars');
  r = await answer(ben, true);
  assert.equal(r.data.challenge.over, true);
  assert.equal(r.data.challenge.winnerName, 'MSG_ANN');
  assert.equal(r.data.challenge.won, false);

  r = await api('GET', '/api/challenges', { token: ben.token });
  const h = r.data.challenges.find(c => c.id === id);
  assert.equal(h.status, 'completed');
  assert.equal(h.winnerId, a.id);
  assert.equal(h.challenger.done, 2);
  assert.equal(h.opponent.done, 1, 'answers after the win are not counted');
  r = await api('GET', `/api/messages/${a.id}`, { token: ben.token });
  assert.ok(r.data.messages.some(m => m.kind === 'result' && m.body.includes('won')), 'result posted in the conversation');
  assert.ok(r.data.challenges[id], 'conversation includes the challenge card');

  // decline and cancel
  r = await api('POST', '/api/challenges', { token: ben.token, body: { opponentId: a.id, items, title: 'Rematch' } });
  const id2 = r.data.challenge.id;
  r = await api('POST', `/api/challenges/${id2}/decline`, { token: ann.token });
  assert.equal(r.data.challenge.status, 'declined');
  r = await api('POST', `/api/challenges/${id2}/accept`, { token: ann.token });
  assert.equal(r.status, 400, 'cannot accept after declining');
  r = await api('POST', '/api/challenges', { token: ben.token, body: { opponentId: a.id, items, title: 'Rematch 2' } });
  r = await api('POST', `/api/challenges/${r.data.challenge.id}/cancel`, { token: ben.token });
  assert.equal(r.data.challenge.status, 'cancelled');
  r = await api('POST', '/api/answers', { token: out.token, body: { skillId: 'algA1', correct: true, streak: 0, challengeId: id } });
  assert.equal(r.status, 400, 'outsiders cannot answer in a challenge');
});

test('admin can reset a password to a chosen value or a generated one', async () => {
  const u = (await api('POST', '/api/admin/users', { token: admin.token, body: { username: 'pw_kid', role: 'student', password: 'first1' } })).data.user;
  let r = await api('POST', `/api/admin/users/${u.id}/password`, { token: admin.token, body: { password: 'Panda2026!' } });
  assert.equal(r.status, 200);
  assert.deepEqual([r.data.password, r.data.generated], ['Panda2026!', false]);
  assert.equal((await api('POST', '/api/auth/login', { body: { username: 'pw_kid', password: 'Panda2026!' } })).status, 200, 'chosen password works');
  assert.equal((await api('POST', '/api/auth/login', { body: { username: 'pw_kid', password: 'first1' } })).status, 401, 'old password no longer works');
  r = await api('POST', `/api/admin/users/${u.id}/password`, { token: admin.token, body: {} });
  assert.equal(r.data.generated, true);
  assert.equal((await api('POST', '/api/auth/login', { body: { username: 'pw_kid', password: r.data.password } })).status, 200, 'generated password works');
  r = await api('POST', `/api/admin/users/${u.id}/password`, { token: admin.token, body: { password: 'abc' } });
  assert.equal(r.status, 400, 'too short');
  r = await api('POST', `/api/admin/users/${u.id}/password`, { token: admin.token, body: { password: 'x'.repeat(41) } });
  assert.equal(r.status, 400, 'longer than the login form allows');
  r = await api('POST', `/api/admin/users/${u.id}/password`, { token: teacher.token, body: { password: 'hacked1' } });
  assert.equal(r.status, 403, 'admins only');
});

test('live events, pictures and call signalling', async () => {
  const mk = async (username, role) => (await api('POST', '/api/admin/users', { token: admin.token, body: { username, displayName: username, password: 'pw123', role } })).data.user;
  const [t, a, b, x] = [await mk('rt_teach', 'teacher'), await mk('rt_amy', 'student'), await mk('rt_bob', 'student'), await mk('rt_out', 'student')];
  await api('PUT', `/api/admin/teachers/${t.id}/students`, { token: admin.token, body: { studentIds: [a.id, b.id] } });
  const [amy, bob, out] = [await login('rt_amy', 'pw123'), await login('rt_bob', 'pw123'), await login('rt_out', 'pw123')];

  // Bob listens for live events
  const ctrl = new AbortController();
  const res = await fetch(base + '/api/events', { headers: { Authorization: 'Bearer ' + bob.token }, signal: ctrl.signal });
  assert.equal(res.headers.get('content-type').split(';')[0], 'text/event-stream');
  const reader = res.body.getReader(), dec = new TextDecoder();
  let buf = '';
  const nextEvent = async () => {
    for (;;) {
      const i = buf.indexOf('\n\n');
      if (i >= 0) { const chunk = buf.slice(0, i); buf = buf.slice(i + 2); if (chunk.startsWith('data: ')) return JSON.parse(chunk.slice(6)); continue; }
      const { value, done } = await reader.read();
      if (done) throw new Error('stream ended');
      buf += dec.decode(value, { stream: true });
    }
  };
  assert.equal((await nextEvent()).type, 'hello');
  try {
  await api('POST', `/api/messages/${b.id}`, { token: amy.token, body: { body: 'ping' } });
  let ev = await nextEvent();
  assert.deepEqual([ev.type, ev.from], ['message', a.id], 'new messages arrive live');

  // pictures
  const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 7)]);
  const upload = (who, to, bytes) => fetch(`${base}/api/messages/${to}/image`, { method: 'POST', headers: { Authorization: 'Bearer ' + who.token, 'Content-Type': 'image/jpeg' }, body: bytes });
  let r = await upload(amy, b.id, jpeg);
  assert.equal(r.status, 200);
  const msg = (await r.json()).message;
  assert.equal(msg.kind, 'image');
  assert.ok(msg.imageId);
  ev = await nextEvent();
  assert.equal(ev.kind, 'image');
  r = await fetch(`${base}/api/images/${msg.imageId}`, { headers: { Authorization: 'Bearer ' + bob.token } });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('content-type'), 'image/jpeg');
  assert.ok(Buffer.from(await r.arrayBuffer()).equals(jpeg), 'picture comes back byte for byte');
  r = await fetch(`${base}/api/images/${msg.imageId}`, { headers: { Authorization: 'Bearer ' + out.token } });
  assert.equal(r.status, 404, 'outsiders cannot see the picture');
  assert.equal((await upload(amy, b.id, Buffer.from('<script>alert(1)</script> not an image'))).status, 400, 'non-pictures rejected');
  assert.equal((await upload(amy, x.id, jpeg)).status, 403, 'no pictures to strangers');
  assert.equal((await upload(amy, b.id, Buffer.concat([jpeg, Buffer.alloc(2.1 * 1024 * 1024)]))).status, 413, 'too big');

  // call signalling
  r = await api('POST', '/api/calls/signal', { token: amy.token, body: { to: b.id, callId: 'call-abc123', type: 'invite', data: { video: true, sdp: { type: 'offer', sdp: 'v=0' } } } });
  assert.equal(r.data.delivered, true, 'Bob is online, so the invite is delivered');
  ev = await nextEvent();
  assert.deepEqual([ev.type, ev.signal, ev.from, ev.fromName, ev.data.video], ['call', 'invite', a.id, 'rt_amy', true]);
  r = await api('POST', '/api/calls/signal', { token: bob.token, body: { to: a.id, callId: 'call-abc123', type: 'answer', data: {} } });
  assert.equal(r.data.delivered, false, 'Amy has no live connection open');
  r = await api('POST', '/api/calls/signal', { token: amy.token, body: { to: x.id, callId: 'call-abc123', type: 'invite' } });
  assert.equal(r.status, 403, 'no calling strangers');
  r = await api('POST', '/api/calls/signal', { token: amy.token, body: { to: b.id, callId: 'call-abc123', type: 'hack' } });
  assert.equal(r.status, 400);
  r = await api('POST', '/api/calls/log', { token: amy.token, body: { to: b.id, video: false, outcome: 'completed', seconds: 133 } });
  assert.equal(r.data.message.body, '📞 Voice call · 2:13');
  r = await api('GET', `/api/online/${b.id}`, { token: amy.token });
  assert.equal(r.data.online, true);
  } finally { ctrl.abort(); }
});
