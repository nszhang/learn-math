import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import { STUDENT_GRADES, gradeLabel } from '../skills.js';

// Admin console: create/manage accounts (students & teachers) and assign
// which students belong to which teacher (the teacher's "roster").
const ROLE_BADGE = { student: 'role-student', teacher: 'role-teacher', admin: 'role-admin' };

export default function AdminPage({ toast }) {
  const [users, setUsers] = useState([]);
  const [rosters, setRosters] = useState([]);       // [{teacherId, studentId}]
  const [filter, setFilter] = useState('student');
  const [created, setCreated] = useState(null);     // {user, password, generated}
  const [resetPw, setResetPw] = useState(null);     // {user, password, generated}
  const [pwFor, setPwFor] = useState(null);         // user whose password is being reset
  const [newPw, setNewPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [nu, setNu] = useState({ username: '', displayName: '', role: 'student', password: '', email: '', grade: '' });
  const [busy, setBusy] = useState(false);
  // roster editor
  const [teacherId, setTeacherId] = useState('');
  const [picked, setPicked] = useState(() => new Set());

  async function load() {
    try {
      const data = await api('GET', '/api/admin/users');
      setUsers(data.users);
      setRosters(data.rosters);
    } catch (e) { toast('⚠️', e.message); }
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const students = useMemo(() => users.filter(u => u.role === 'student'), [users]);
  const teachers = useMemo(() => users.filter(u => u.role === 'teacher'), [users]);

  // default the roster editor to the first teacher
  useEffect(() => {
    if ((!teacherId || !teachers.some(t => String(t.id) === teacherId)) && teachers.length) {
      selectTeacher(String(teachers[0].id));
    }
  }, [teachers]); // eslint-disable-line react-hooks/exhaustive-deps

  function selectTeacher(id) {
    setTeacherId(id);
    setPicked(new Set(
      rosters.filter(r => String(r.teacherId) === id).map(r => r.studentId)));
  }

  async function createUser(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api('POST', '/api/admin/users', nu);
      setCreated(data);
      setResetPw(null);
      setNu({ username: '', displayName: '', role: 'student', password: '', email: '', grade: '' });
      toast('✅', `${data.user.displayName} (${data.user.role}) created`);
      await load();
    } catch (err) { toast('⚠️', err.message); }
    finally { setBusy(false); }
  }

  async function editEmail(u) {
    const email = window.prompt(`Email address for ${u.displayName} (${u.username}) — leave blank to remove:`, u.email || '');
    if (email === null) return; // cancelled
    try {
      await api('PUT', `/api/admin/users/${u.id}/email`, { email: email.trim() });
      toast('📧', email.trim() ? `Email set for ${u.username}` : `Email removed for ${u.username}`);
      await load();
    } catch (err) { toast('⚠️', err.message); }
  }

  async function setGrade(u, value) {
    const grade = value === '' ? null : Number(value);
    try {
      await api('PUT', `/api/admin/users/${u.id}/grade`, { grade });
      toast('🎓', `${u.displayName}: ${gradeLabel(grade)}`);
      await load();
    } catch (err) { toast('⚠️', err.message); }
  }

  function resetPassword(u) { setPwFor(u); setNewPw(''); setShowPw(false); }
  // set the typed password, or generate one when the box is left blank
  async function submitPassword(e) {
    e.preventDefault();
    const pw = newPw.trim() === '' ? '' : newPw;
    if (pw && pw.length < 4) return toast('⚠️', 'Password must be at least 4 characters.');
    try {
      const data = await api('POST', `/api/admin/users/${pwFor.id}/password`, pw ? { password: pw } : {});
      setResetPw({ user: pwFor, ...data });
      setCreated(null);
      setPwFor(null);
      toast('🔑', `Password ${data.generated ? 'generated' : 'set'} for ${pwFor.displayName}`);
    } catch (err) { toast('⚠️', err.message); }
  }

  async function removeUser(u) {
    if (!window.confirm(`Delete ${u.displayName} (${u.username}) and ALL their progress, awards, and assignments? This cannot be undone.`)) return;
    try {
      await api('DELETE', `/api/admin/users/${u.id}`);
      toast('🗑️', `Deleted ${u.username}`);
      await load();
    } catch (err) { toast('⚠️', err.message); }
  }

  function toggleStudent(id) {
    setPicked(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function saveRoster(e) {
    e.preventDefault();
    try {
      await api('PUT', `/api/admin/teachers/${teacherId}/students`, { studentIds: [...picked] });
      toast('✅', 'Roster saved');
      await load();
    } catch (err) { toast('⚠️', err.message); }
  }

  const shown = users.filter(u => filter === 'all' || u.role === filter);
  const rosterSize = tid => rosters.filter(r => r.teacherId === tid).length;
  const teachersOf = sid => rosters
    .filter(r => r.studentId === sid)
    .map(r => teachers.find(t => t.id === r.teacherId)?.displayName)
    .filter(Boolean).join(', ');

  const pwBanner = (b) => b && (
    <div className="pw-banner">
      <strong>{b.user.displayName} ({b.user.username})</strong> — password{' '}
      {b.generated ? 'generated' : 'set'}: <code>{b.password}</code>
      <div className="pw-note">Share it with the user now — they can change it after logging in (🔑 in the top bar). It is not shown again.</div>
    </div>
  );

  return (
    <div className="admin-wrap">
      <div className="admin-card">
        <h2>➕ Create an account</h2>
        {pwBanner(created)}
        <form id="form-admin-create" className="form-vertical" onSubmit={createUser}>
          <div className="admin-form-row">
            <label>Username
              <input type="text" maxLength="20" required placeholder="e.g. alex_c"
                value={nu.username} onChange={e => setNu({ ...nu, username: e.target.value })} />
            </label>
            <label>Display name
              <input type="text" maxLength="30" placeholder="e.g. Alex"
                value={nu.displayName} onChange={e => setNu({ ...nu, displayName: e.target.value })} />
            </label>
            <label>Role
              <select value={nu.role} onChange={e => setNu({ ...nu, role: e.target.value })}>
                <option value="student">🎒 Student</option>
                <option value="teacher">🍎 Teacher</option>
              </select>
            </label>
            {nu.role === 'student' && (
              <label>Grade
                <select value={nu.grade} onChange={e => setNu({ ...nu, grade: e.target.value })}>
                  <option value="">— not set —</option>
                  {STUDENT_GRADES.map(g => <option key={g} value={g}>{gradeLabel(g)}</option>)}
                </select>
              </label>
            )}
          </div>
          <label>Password (leave blank to auto-generate)
            <input type="text" maxLength="40" placeholder="blank = auto-generate"
              value={nu.password} onChange={e => setNu({ ...nu, password: e.target.value })} />
          </label>
          <label>Email (optional — homework reminders)
            <input type="email" placeholder="student@example.com" value={nu.email}
              onChange={e => setNu({ ...nu, email: e.target.value })} />
          </label>
          <button className="btn btn-primary" disabled={busy}>{busy ? '…' : 'Create account'}</button>
        </form>
      </div>

      <div className="admin-card">
        <h2>👥 Accounts</h2>
        {pwBanner(resetPw)}
        <div className="filter-chips">
          {[['student', `🎒 Students (${students.length})`],
            ['teacher', `🍎 Teachers (${teachers.length})`],
            ['all', `All (${users.length})`]].map(([id, label]) => (
            <button key={id} type="button" className={'chip' + (filter === id ? ' active' : '')}
              onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Grade</th><th>Roster / Teacher</th><th></th></tr>
          </thead>
          <tbody>
            {shown.map(u => (
              <tr key={u.id}>
                <td>{u.displayName}</td>
                <td className="mono">{u.username}</td>
                <td>
                  {u.email
                    ? <a href={'mailto:' + u.email} className="muted">{u.email}</a>
                    : <span className="muted">—</span>}
                  {' '}<button type="button" className="btn btn-ghost" style={{ padding: '2px 8px' }}
                    onClick={() => editEmail(u)} title="edit email">✉️</button>
                </td>
                <td><span className={'role-badge ' + (ROLE_BADGE[u.role] || '')}>{u.role}</span></td>
                <td>
                  {u.role === 'student' ? (
                    <select className="grade-select" value={u.grade ?? ''} onChange={e => setGrade(u, e.target.value)} aria-label={`Grade for ${u.username}`}>
                      <option value="">—</option>
                      {STUDENT_GRADES.map(g => <option key={g} value={g}>{gradeLabel(g)}</option>)}
                    </select>
                  ) : <span className="muted">—</span>}
                </td>
                <td className="muted">
                  {u.role === 'teacher' ? `${rosterSize(u.id)} student${rosterSize(u.id) === 1 ? '' : 's'}`
                    : u.role === 'student' ? (teachersOf(u.id) || '—')
                    : ''}
                </td>
                <td className="row-actions">
                  <button className="icon-btn" type="button" title="Reset password"
                    onClick={() => resetPassword(u)}>🔑</button>
                  <button className="icon-btn" type="button" title="Delete account"
                    onClick={() => removeUser(u)}>🗑️</button>
                </td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan="7" className="muted">No accounts yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h2>📋 Teacher rosters</h2>
        <p className="muted">Choose which students each teacher can see and assign homework to.</p>
        {!teachers.length && <p className="muted">Create a teacher account first.</p>}
        {teachers.length > 0 && (
          <form id="form-roster" onSubmit={saveRoster}>
            <label>Teacher
              <select value={teacherId} onChange={e => selectTeacher(e.target.value)}>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.displayName} ({t.username}) — {rosterSize(t.id)} student{rosterSize(t.id) === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </label>
            {!students.length && <p className="muted">No student accounts yet.</p>}
            <div className="roster-list">
              {students.map(s => (
                <label key={s.id}>
                  <input type="checkbox" checked={picked.has(s.id)} onChange={() => toggleStudent(s.id)} />
                  {s.displayName} <span className="muted mono">{s.username}</span> <span className="muted">· {gradeLabel(s.grade)}</span>
                </label>
              ))}
            </div>
            <button className="btn btn-primary" type="submit">Save roster</button>
          </form>
        )}
      </div>
      {pwFor && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPwFor(null)} onKeyDown={e => e.key === 'Escape' && setPwFor(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-label={`Reset password for ${pwFor.displayName}`}>
            <h3>🔑 Reset password</h3>
            <p className="muted" style={{ marginBottom: 14 }}>For <strong>{pwFor.displayName}</strong> (@{pwFor.username}). Type a new password, or leave it blank to generate one.</p>
            <form className="form-vertical" onSubmit={submitPassword}>
              <label>New password
                <span className="pw-field">
                  <input type={showPw ? 'text' : 'password'} autoFocus autoComplete="new-password" maxLength={40}
                    placeholder="leave blank to generate" value={newPw} onChange={e => setNewPw(e.target.value)} />
                  <button type="button" className="btn btn-ghost" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>{showPw ? '🙈' : '👁'}</button>
                </span>
              </label>
              <div className="modal-actions">
                <button className="btn btn-ghost" type="button" onClick={() => setPwFor(null)}>Cancel</button>
                <button className="btn btn-primary" type="submit">{newPw.trim() ? 'Set password' : 'Generate password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
