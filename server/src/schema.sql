-- AlgebraAce schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  pass_hash    TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  stars        INT  NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stats (
  user_id       INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  answered      INT NOT NULL DEFAULT 0,
  correct       INT NOT NULL DEFAULT 0,
  time_sec      INT NOT NULL DEFAULT 0,
  best_streak   INT NOT NULL DEFAULT 0,
  homework_done INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skill_progress (
  user_id  INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id TEXT NOT NULL,
  score    INT  NOT NULL DEFAULT 0,
  answered INT  NOT NULL DEFAULT 0,
  correct  INT  NOT NULL DEFAULT 0,
  medals   JSONB NOT NULL DEFAULT '[]',
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS awards (
  user_id   INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  award_id  TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, award_id)
);

CREATE TABLE IF NOT EXISTS assignments (
  id         TEXT PRIMARY KEY,
  teacher_id INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  due        DATE NOT NULL,
  items      JSONB NOT NULL,           -- [{ skillId, count }]
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Homework progress. assignment_id also covers client-computed daily sets
-- ('daily-YYYY-MM-DD'), which live only as progress rows.
CREATE TABLE IF NOT EXISTS homework_progress (
  user_id       INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id TEXT NOT NULL,
  skill_id      TEXT NOT NULL,
  done          INT  NOT NULL DEFAULT 0,
  correct       INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, assignment_id, skill_id)
);

CREATE TABLE IF NOT EXISTS homework_completed (
  user_id       INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id TEXT NOT NULL,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, assignment_id)
);

-- Roster: which students belong to which teacher (admin-managed).
-- Teachers can only see / assign homework to students in their roster.
CREATE TABLE IF NOT EXISTS teacher_students (
  teacher_id INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (teacher_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_assignments_student ON assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_hw_progress_user ON homework_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_students_student ON teacher_students(student_id);

-- Email notifications
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;

-- Student grade level (−1 = JK, 0 = K, 1–12), used to suggest and check homework. NULL = not set.
ALTER TABLE users ADD COLUMN IF NOT EXISTS grade INT;

CREATE TABLE IF NOT EXISTS email_log (
  user_id       INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id TEXT NOT NULL,
  kind          TEXT NOT NULL CHECK (kind IN ('assigned', 'due-soon', 'overdue')),
  sent_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, assignment_id, kind)
);

-- Chinese HSK level (1–6), independent of school grade. Students may move themselves up at their own pace.
ALTER TABLE users ADD COLUMN IF NOT EXISTS hsk_level INT NOT NULL DEFAULT 1;

-- Chinese word review deck (spaced repetition). One row per word a student has met.
-- box 0 = relearning, 1–6 = growing intervals; due is the student's local date (YYYY-MM-DD).
CREATE TABLE IF NOT EXISTS word_reviews (
  user_id  INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word     TEXT NOT NULL,
  box      INT  NOT NULL DEFAULT 0,
  due      TEXT NOT NULL,
  reviews  INT  NOT NULL DEFAULT 0,
  lapses   INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, word)
);

-- Messages between users (classmates who share a teacher, a teacher and their students; admins anyone).
-- kind: 'text' (typed), 'challenge' (a challenge invitation), 'result' (who won).
CREATE TABLE IF NOT EXISTS messages (
  id           SERIAL PRIMARY KEY,
  sender_id    INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body         TEXT NOT NULL,
  kind         TEXT NOT NULL DEFAULT 'text',
  challenge_id TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- Student challenges: both players do the same skills; the first to complete wins.
-- status: pending → active (accepted) → completed; or declined / cancelled.
CREATE TABLE IF NOT EXISTS challenges (
  id            TEXT PRIMARY KEY,
  challenger_id INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opponent_id   INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  items         JSONB NOT NULL,          -- [{ skillId, count }]: count CORRECT answers needed per skill
  status        TEXT NOT NULL DEFAULT 'pending',
  winner_id     INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at   TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_challenges_challenger ON challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_challenges_opponent ON challenges(opponent_id);

CREATE TABLE IF NOT EXISTS challenge_progress (
  challenge_id TEXT NOT NULL,
  user_id      INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id     TEXT NOT NULL,
  answered     INT  NOT NULL DEFAULT 0,
  correct      INT  NOT NULL DEFAULT 0,
  first_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (challenge_id, user_id, skill_id)
);

CREATE TABLE IF NOT EXISTS challenge_finishes (
  challenge_id TEXT NOT NULL,
  user_id      INT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  finished_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (challenge_id, user_id)
);
