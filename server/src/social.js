// Messaging and student challenges.
//
// Who may message whom (kept narrow — this is a site for children):
//   student ↔ classmates (students who share a teacher) and their own teachers
//   teacher ↔ students in their roster
//   admin   ↔ anyone
// Challenges are between two students who may message each other. Both do the same
// skills; a skill counts as done after `count` CORRECT answers, and the first player
// to complete every skill wins.
import crypto from 'node:crypto';
import express from 'express';
import { addClient, emit, isOnline } from './realtime.js';

export const MAX_BODY = 500;
export const MAX_ITEMS = 5, MAX_COUNT = 20;
export const MAX_OPEN_CHALLENGES = 10;  // pending + active, per challenger
export const WIN_STARS = 3;
const RATE_WINDOW_MS = 60_000, RATE_MAX = 20; // messages per minute per sender

const nameOf = u => u.display_name || u.username;
const publicContact = (u, relation) => ({ id: u.id, username: u.username, displayName: nameOf(u), role: u.role, relation });

export async function contactsOf(pool, uid) {
  const me = (await pool.query('SELECT id, role FROM users WHERE id = $1', [uid])).rows[0];
  if (!me) return [];
  const users = (await pool.query('SELECT id, username, display_name, role FROM users')).rows;
  const byId = new Map(users.map(u => [u.id, u]));
  const roster = (await pool.query('SELECT teacher_id, student_id FROM teacher_students')).rows;
  const out = new Map();
  const add = (id, relation) => { const u = byId.get(id); if (u && id !== uid && !out.has(id)) out.set(id, publicContact(u, relation)); };
  if (me.role === 'admin') users.forEach(u => add(u.id, u.role));
  else if (me.role === 'teacher') roster.filter(r => r.teacher_id === uid).forEach(r => add(r.student_id, 'student'));
  else {
    const myTeachers = new Set(roster.filter(r => r.student_id === uid).map(r => r.teacher_id));
    myTeachers.forEach(t => add(t, 'teacher'));
    roster.filter(r => myTeachers.has(r.teacher_id)).forEach(r => add(r.student_id, 'classmate'));
  }
  return [...out.values()].sort((a, b) => (a.relation === 'teacher') - (b.relation === 'teacher') || a.displayName.localeCompare(b.displayName));
}

async function sendMessage(pool, from, to, body, kind = 'text', challengeId = null, imageId = null) {
  const { rows } = await pool.query(
    `INSERT INTO messages (sender_id, recipient_id, body, kind, challenge_id, image_id) VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, sender_id, recipient_id, body, kind, challenge_id, image_id, created_at, read_at`,
    [from, to, body, kind, challengeId, imageId]);
  // live update for both people (the sender may have other tabs open)
  emit(to, { type: 'message', from, to, id: rows[0].id, kind });
  emit(from, { type: 'message', from, to, id: rows[0].id, kind });
  return rows[0];
}
const publicMessage = m => ({ id: m.id, from: m.sender_id, to: m.recipient_id, body: m.body, kind: m.kind, challengeId: m.challenge_id, imageId: m.image_id ?? null, at: m.created_at, read: !!m.read_at });

/* ---------- pictures ---------- */
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024, MAX_IMAGES_PER_DAY = 50;
// check the file really is a picture by its first bytes (never trust the declared type)
export function imageType(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.slice(0, 4).toString('latin1') === 'RIFF' && buf.slice(8, 12).toString('latin1') === 'WEBP') return 'image/webp';
  if (buf.slice(0, 4).toString('latin1') === 'GIF8') return 'image/gif';
  return null;
}

/* ---------- calls ---------- */
export const CALL_SIGNALS = ['invite', 'answer', 'ice', 'decline', 'busy', 'end'];
const fmtDuration = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/* ---------- challenges ---------- */
async function getChallenge(pool, id) {
  return (await pool.query('SELECT * FROM challenges WHERE id = $1', [id])).rows[0] || null;
}
const total = items => items.reduce((s, i) => s + i.count, 0);
// a player's progress: correct answers counted up to each skill's target
function playerProgress(items, rows, finish) {
  const bySkill = items.map(i => {
    const r = rows.find(x => x.skill_id === i.skillId);
    return { skillId: i.skillId, count: i.count, done: Math.min(i.count, r ? r.correct : 0), answered: r ? r.answered : 0 };
  });
  const startedAt = rows.length ? rows.map(r => new Date(r.first_at)).sort((a, b) => a - b)[0] : null;
  return {
    progress: bySkill,
    done: bySkill.reduce((s, x) => s + x.done, 0),
    total: total(items),
    answered: bySkill.reduce((s, x) => s + x.answered, 0),
    startedAt, finishedAt: finish ? finish.finished_at : null
  };
}
async function challengeView(pool, c, names) {
  const [prog, fin] = await Promise.all([
    pool.query('SELECT * FROM challenge_progress WHERE challenge_id = $1', [c.id]).then(r => r.rows),
    pool.query('SELECT * FROM challenge_finishes WHERE challenge_id = $1', [c.id]).then(r => r.rows)
  ]);
  const player = uid => ({ id: uid, displayName: names.get(uid) || '?', ...playerProgress(c.items, prog.filter(p => p.user_id === uid), fin.find(f => f.user_id === uid)) });
  return {
    id: c.id, title: c.title, items: c.items, status: c.status, winnerId: c.winner_id,
    createdAt: c.created_at, acceptedAt: c.accepted_at, completedAt: c.completed_at,
    challenger: player(c.challenger_id), opponent: player(c.opponent_id)
  };
}
async function nameMap(pool) {
  return new Map((await pool.query('SELECT id, username, display_name FROM users')).rows.map(u => [u.id, nameOf(u)]));
}

/**
 * Record a practice answer inside a challenge. Returns progress for the answer's
 * player, or an error string. Wrong answers count as answered but not as done.
 */
export async function recordChallengeAnswer(pool, uid, challengeId, skillId, correct) {
  const c = await getChallenge(pool, challengeId);
  if (!c || (c.challenger_id !== uid && c.opponent_id !== uid)) return { error: 'Unknown challenge' };
  const item = c.items.find(i => i.skillId === skillId);
  if (!item) return { error: 'That skill is not part of this challenge' };
  const names = await nameMap(pool);
  if (c.status !== 'active') {
    const v = await challengeView(pool, c, names);
    const me = c.challenger_id === uid ? v.challenger : v.opponent;
    return { challenge: { done: me.done, total: me.total, skillDone: me.progress.find(p => p.skillId === skillId).done, over: true, status: c.status, winnerId: c.winner_id, winnerName: names.get(c.winner_id) || null, justCompleted: false, won: false } };
  }
  const finished = (await pool.query('SELECT 1 FROM challenge_finishes WHERE challenge_id = $1 AND user_id = $2', [c.id, uid])).rowCount > 0;
  if (!finished) {
    await pool.query(
      `INSERT INTO challenge_progress (challenge_id, user_id, skill_id, answered, correct) VALUES ($1, $2, $3, 1, $4)
       ON CONFLICT (challenge_id, user_id, skill_id) DO UPDATE SET answered = challenge_progress.answered + 1, correct = challenge_progress.correct + $4`,
      [c.id, uid, skillId, correct ? 1 : 0]);
  }
  const rows = (await pool.query('SELECT * FROM challenge_progress WHERE challenge_id = $1 AND user_id = $2', [c.id, uid])).rows;
  const p = playerProgress(c.items, rows, null);
  let justCompleted = false, won = false;
  if (!finished && p.done >= p.total) {
    justCompleted = true;
    await pool.query('INSERT INTO challenge_finishes (challenge_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [c.id, uid]);
    // first finisher wins — the status check makes this safe if both finish at once
    const r = await pool.query("UPDATE challenges SET status = 'completed', winner_id = $2, completed_at = now() WHERE id = $1 AND status = 'active'", [c.id, uid]);
    won = r.rowCount > 0;
    if (won) {
      const other = c.challenger_id === uid ? c.opponent_id : c.challenger_id;
      await sendMessage(pool, uid, other, `🏆 ${names.get(uid)} won the challenge "${c.title}"!`, 'result', c.id);
    }
  }
  return { challenge: { done: p.done, total: p.total, skillDone: p.progress.find(x => x.skillId === skillId).done, justCompleted, won, over: justCompleted, status: won ? 'completed' : c.status, winnerId: won ? uid : c.winner_id, winnerName: won ? names.get(uid) : null }, stars: won ? WIN_STARS : 0 };
}

export function registerSocial(app, { pool, auth, isSkillId }) {
  const canMessage = async (uid, other) => (await contactsOf(pool, uid)).some(c => c.id === other);
  const role = async uid => (await pool.query('SELECT role FROM users WHERE id = $1', [uid])).rows[0]?.role;

  app.get('/api/contacts', auth, async (req, res) => {
    res.json({ contacts: await contactsOf(pool, req.uid) });
  });

  // Conversations: every contact, with the last message and unread count.
  app.get('/api/messages', auth, async (req, res) => {
    const contacts = await contactsOf(pool, req.uid);
    const { rows } = await pool.query(
      'SELECT * FROM messages WHERE sender_id = $1 OR recipient_id = $1 ORDER BY id DESC LIMIT 2000', [req.uid]);
    const threads = contacts.map(c => {
      const mine = rows.filter(m => m.sender_id === c.id || m.recipient_id === c.id);
      return { contact: c, last: mine[0] ? publicMessage(mine[0]) : null, unread: mine.filter(m => m.recipient_id === req.uid && !m.read_at).length };
    }).sort((a, b) => (b.last?.id ?? 0) - (a.last?.id ?? 0));
    res.json({ threads });
  });

  app.get('/api/messages/:userId', auth, async (req, res) => {
    const other = req.params.userId | 0;
    if (!(await canMessage(req.uid, other))) return res.status(403).json({ error: 'You can only message classmates and teachers.' });
    const { rows } = await pool.query(
      `SELECT * FROM messages WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)
       ORDER BY id DESC LIMIT 200`, [req.uid, other]);
    await pool.query('UPDATE messages SET read_at = now() WHERE recipient_id = $1 AND sender_id = $2 AND read_at IS NULL', [req.uid, other]);
    const ids = [...new Set(rows.filter(m => m.challenge_id).map(m => m.challenge_id))];
    const names = await nameMap(pool);
    const challenges = {};
    for (const id of ids) { const c = await getChallenge(pool, id); if (c) challenges[id] = await challengeView(pool, c, names); }
    res.json({ messages: rows.reverse().map(publicMessage), challenges });
  });

  app.post('/api/messages/:userId', auth, async (req, res) => {
    const other = req.params.userId | 0;
    const body = typeof req.body?.body === 'string' ? req.body.body.trim() : '';
    if (!body) return res.status(400).json({ error: 'Type a message first.' });
    if (body.length > MAX_BODY) return res.status(400).json({ error: `Messages can be up to ${MAX_BODY} characters.` });
    if (!(await canMessage(req.uid, other))) return res.status(403).json({ error: 'You can only message classmates and teachers.' });
    const recent = (await pool.query('SELECT created_at FROM messages WHERE sender_id = $1 ORDER BY id DESC LIMIT $2', [req.uid, RATE_MAX])).rows;
    if (recent.length >= RATE_MAX && Date.now() - new Date(recent[RATE_MAX - 1].created_at).getTime() < RATE_WINDOW_MS)
      return res.status(429).json({ error: 'Slow down a little — too many messages in a minute.' });
    res.json({ message: publicMessage(await sendMessage(pool, req.uid, other, body)) });
  });

  // Live events (Server-Sent Events). The browser reads this with fetch so the token stays in a header.
  app.get('/api/events', auth, (req, res) => {
    res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.flushHeaders?.();
    res.write(`data: ${JSON.stringify({ type: 'hello' })}\n\n`);
    const remove = addClient(req.uid, res);
    const beat = setInterval(() => { try { res.write(': ping\n\n'); } catch { /* closed */ } }, 25000);
    req.on('close', () => { clearInterval(beat); remove(); });
  });

  // Send a picture: the raw image bytes are the request body.
  app.post('/api/messages/:userId/image', auth, express.raw({ type: () => true, limit: MAX_IMAGE_BYTES }), async (req, res) => {
    const other = req.params.userId | 0;
    if (!(await canMessage(req.uid, other))) return res.status(403).json({ error: 'You can only message classmates and teachers.' });
    const buf = Buffer.isBuffer(req.body) ? req.body : null;
    const mime = imageType(buf);
    if (!mime) return res.status(400).json({ error: 'That file is not a picture (JPEG, PNG, WebP or GIF).' });
    const recent = (await pool.query('SELECT created_at FROM message_images WHERE owner_id = $1 ORDER BY id DESC LIMIT $2', [req.uid, MAX_IMAGES_PER_DAY])).rows;
    if (recent.length >= MAX_IMAGES_PER_DAY && Date.now() - new Date(recent[MAX_IMAGES_PER_DAY - 1].created_at).getTime() < 86400000)
      return res.status(429).json({ error: `That's ${MAX_IMAGES_PER_DAY} pictures today — try again tomorrow.` });
    const img = (await pool.query('INSERT INTO message_images (owner_id, mime, data) VALUES ($1, $2, $3) RETURNING id', [req.uid, mime, buf.toString('base64')])).rows[0];
    res.json({ message: publicMessage(await sendMessage(pool, req.uid, other, '📷 Photo', 'image', null, img.id)) });
  });

  // A picture can be seen by the two people in its conversation (and admins).
  app.get('/api/images/:id', auth, async (req, res) => {
    const id = req.params.id | 0;
    const m = (await pool.query('SELECT sender_id, recipient_id FROM messages WHERE image_id = $1', [id])).rows[0];
    const allowed = m && (m.sender_id === req.uid || m.recipient_id === req.uid || (await role(req.uid)) === 'admin');
    if (!allowed) return res.status(404).json({ error: 'Picture not found' });
    const img = (await pool.query('SELECT mime, data FROM message_images WHERE id = $1', [id])).rows[0];
    if (!img) return res.status(404).json({ error: 'Picture not found' });
    res.set({ 'Content-Type': img.mime, 'Cache-Control': 'private, max-age=86400', 'X-Content-Type-Options': 'nosniff' });
    res.send(Buffer.from(img.data, 'base64'));
  });

  // Call set-up (WebRTC signalling): relay offers/answers/ICE between two people who may message.
  app.post('/api/calls/signal', auth, async (req, res) => {
    const { to, callId, type, data } = req.body || {};
    const other = to | 0;
    if (!CALL_SIGNALS.includes(type) || typeof callId !== 'string' || !/^[\w-]{6,40}$/.test(callId))
      return res.status(400).json({ error: 'Bad call signal' });
    if (!(await canMessage(req.uid, other))) return res.status(403).json({ error: 'You can only call classmates and teachers.' });
    const me = (await pool.query('SELECT username, display_name FROM users WHERE id = $1', [req.uid])).rows[0];
    const delivered = emit(other, { type: 'call', signal: type, callId, from: req.uid, fromName: nameOf(me), data: data ?? null });
    res.json({ delivered: delivered > 0 });
  });

  // The caller records how a call went; it shows in the conversation.
  app.post('/api/calls/log', auth, async (req, res) => {
    const { to, video, outcome, seconds } = req.body || {};
    const other = to | 0;
    if (!['completed', 'missed', 'declined', 'unavailable'].includes(outcome)) return res.status(400).json({ error: 'Bad outcome' });
    if (!(await canMessage(req.uid, other))) return res.status(403).json({ error: 'You can only call classmates and teachers.' });
    const kind = video ? '🎥 Video call' : '📞 Voice call';
    const secs = Math.max(0, Math.min(86400, seconds | 0));
    const body = outcome === 'completed' ? `${kind} · ${fmtDuration(secs)}`
      : outcome === 'declined' ? `${kind} — declined` : outcome === 'unavailable' ? `${kind} — not online` : `${kind} — missed`;
    res.json({ message: publicMessage(await sendMessage(pool, req.uid, other, body, 'call')) });
  });

  app.get('/api/online/:userId', auth, async (req, res) => {
    const other = req.params.userId | 0;
    if (!(await canMessage(req.uid, other))) return res.status(403).json({ error: 'Not a contact' });
    res.json({ online: isOnline(other) });
  });

  // Badge counts for the top bar (polled).
  app.get('/api/inbox', auth, async (req, res) => {
    const [m, c] = await Promise.all([
      pool.query('SELECT COUNT(*) AS n FROM messages WHERE recipient_id = $1 AND read_at IS NULL', [req.uid]),
      pool.query("SELECT COUNT(*) AS n FROM challenges WHERE opponent_id = $1 AND status = 'pending'", [req.uid])
    ]);
    res.json({ unread: Number(m.rows[0].n), pendingChallenges: Number(c.rows[0].n) });
  });

  /* ---------- challenges ---------- */
  app.get('/api/challenges', auth, async (req, res) => {
    const { rows } = await pool.query(
      'SELECT * FROM challenges WHERE challenger_id = $1 OR opponent_id = $1 ORDER BY created_at DESC', [req.uid]);
    const names = await nameMap(pool);
    const list = [];
    for (const c of rows) list.push(await challengeView(pool, c, names));
    res.json({ challenges: list });
  });

  app.get('/api/challenges/:id', auth, async (req, res) => {
    const c = await getChallenge(pool, String(req.params.id));
    if (!c || (c.challenger_id !== req.uid && c.opponent_id !== req.uid)) return res.status(404).json({ error: 'Challenge not found' });
    res.json({ challenge: await challengeView(pool, c, await nameMap(pool)) });
  });

  app.post('/api/challenges', auth, async (req, res) => {
    const { opponentId, items, title, note } = req.body || {};
    const opp = opponentId | 0;
    if ((await role(req.uid)) !== 'student') return res.status(403).json({ error: 'Challenges are for students.' });
    if ((await role(opp)) !== 'student' || !(await canMessage(req.uid, opp)))
      return res.status(403).json({ error: 'You can challenge classmates only.' });
    if (!Array.isArray(items) || !items.length || items.length > MAX_ITEMS) return res.status(400).json({ error: `Pick 1–${MAX_ITEMS} skills.` });
    const clean = [];
    for (const i of items) {
      if (!i || !isSkillId(i.skillId) || !Number.isInteger(i.count) || i.count < 1 || i.count > MAX_COUNT || clean.some(x => x.skillId === i.skillId))
        return res.status(400).json({ error: 'Invalid challenge skills' });
      clean.push({ skillId: i.skillId, count: i.count });
    }
    const t = typeof title === 'string' ? title.trim().slice(0, 80) : '';
    if (!t) return res.status(400).json({ error: 'Give the challenge a name.' });
    const open = (await pool.query("SELECT id FROM challenges WHERE challenger_id = $1 AND status IN ('pending', 'active')", [req.uid])).rowCount;
    if (open >= MAX_OPEN_CHALLENGES) return res.status(400).json({ error: `You already have ${open} open challenges — finish some first!` });
    const id = 'ch-' + crypto.randomBytes(6).toString('hex');
    await pool.query('INSERT INTO challenges (id, challenger_id, opponent_id, title, items) VALUES ($1, $2, $3, $4, $5)',
      [id, req.uid, opp, t, JSON.stringify(clean)]);
    const n = typeof note === 'string' ? note.trim().slice(0, MAX_BODY) : '';
    await sendMessage(pool, req.uid, opp, n || `⚔️ I challenge you: "${t}"!`, 'challenge', id);
    res.json({ challenge: await challengeView(pool, await getChallenge(pool, id), await nameMap(pool)) });
  });

  // accept / decline (opponent, while pending) and cancel (challenger, while pending)
  for (const [action, who, to] of [['accept', 'opponent_id', 'active'], ['decline', 'opponent_id', 'declined'], ['cancel', 'challenger_id', 'cancelled']]) {
    app.post(`/api/challenges/:id/${action}`, auth, async (req, res) => {
      const c = await getChallenge(pool, String(req.params.id));
      if (!c || c[who] !== req.uid) return res.status(404).json({ error: 'Challenge not found' });
      if (c.status !== 'pending') return res.status(400).json({ error: `This challenge is already ${c.status}.` });
      await pool.query(`UPDATE challenges SET status = $2${to === 'active' ? ', accepted_at = now()' : ''} WHERE id = $1 AND status = 'pending'`, [c.id, to]);
      const names = await nameMap(pool), other = req.uid === c.challenger_id ? c.opponent_id : c.challenger_id;
      const text = { accept: `✅ ${names.get(req.uid)} accepted "${c.title}" — race is on!`, decline: `🙅 ${names.get(req.uid)} declined "${c.title}".`, cancel: `↩️ ${names.get(req.uid)} cancelled "${c.title}".` }[action];
      await sendMessage(pool, req.uid, other, text, 'result', c.id);
      res.json({ challenge: await challengeView(pool, await getChallenge(pool, c.id), names) });
    });
  }
}
