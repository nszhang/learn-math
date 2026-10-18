// Server entrypoint: connect to PostgreSQL, ensure schema, serve API + built client.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import pg from 'pg';
import { createApp } from './app.js';
import { createMailer } from './mailer.js';
import { runReminderScan } from './reminders.js';
import { initSchema } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL
  || 'postgres://postgres:postgres@localhost:5432/learn_math';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'dev-secret-change-me') {
  console.error('❌ JWT_SECRET must be set in production');
  process.exit(1);
}

const useSSL = process.env.PGSSL === 'true' || /sslmode=require/i.test(DATABASE_URL);
const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined
});
await initSchema(pool);
console.log('✅ Connected to PostgreSQL and schema is ready');

const mailer = createMailer();
const app = createApp(pool, JWT_SECRET, mailer);
console.log(mailer.configured ? '📧 SMTP mailer configured' : '📧 SMTP not configured — emails skipped (set SMTP_HOST/USER/PASS)');

// reminder scheduler: due-today & overdue homework emails (idempotent)
const REMINDER_INTERVAL = 6 * 60 * 60 * 1000;
setTimeout(async function scan() {
  try {
    const out = await runReminderScan(pool, mailer);
    if (out.length) console.log('⏰ reminders:', JSON.stringify(out));
  } catch (e) { console.error('reminder scan failed:', e.message); }
  setTimeout(scan, REMINDER_INTERVAL);
}, 30 * 1000);

// Serve the built React client in production (client/dist)
const dist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(path.join(dist, 'index.html')));
}

app.listen(PORT, () => console.log(`🚀 LearnAce server on http://localhost:${PORT}`));
