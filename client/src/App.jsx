import { useCallback, useEffect, useState } from 'react';
import { api, setToken } from './api.js';
import { SUBJECTS, SKILL_INDEX, gradeLabel } from './skills.js';
import Auth from './components/Auth.jsx';
import SkillsPage from './components/SkillsPage.jsx';
import HomeworkPage from './components/HomeworkPage.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import AwardsPage from './components/AwardsPage.jsx';
import TeacherStudents from './components/TeacherStudents.jsx';
import TeacherAssign from './components/TeacherAssign.jsx';
import AdminPage from './components/AdminPage.jsx';
import ChangePassword from './components/ChangePassword.jsx';
import LearnPage from './components/LearnPage.jsx';
import ReviewPage from './components/ReviewPage.jsx';
import MessagesPage from './components/Messages.jsx';
import ChallengesPage from './components/Challenges.jsx';
import PracticePage from './components/PracticePage.jsx';
import Confetti from './components/Confetti.jsx';

function ToastList({ toasts }) {
  return (
    <div id="toast-container">
      {toasts.map(t => (
        <div className="toast" key={t.id}>
          <span className="toast-emoji">{t.emoji}</span><span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('mm_user') || 'null'));
  const [page, setPage] = useState('home');
  const [me, setMe] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [homework, setHomework] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [practiceCfg, setPracticeCfg] = useState(null);
  const [learnOpen, setLearnOpen] = useState(null);   // lesson to open when jumping to Learn
  const [confettiTick, setConfettiTick] = useState(0);
  const [showChpw, setShowChpw] = useState(false);
  const [inbox, setInbox] = useState({ unread: 0, pendingChallenges: 0 });
  const [chatWith, setChatWith] = useState(null);     // contact to open when jumping to Messages

  const toast = useCallback((emoji, msg) => {
    const id = Math.random().toString(36);
    setToasts(t => [...t, { id, emoji, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3600);
  }, []);
  const fireConfetti = useCallback(() => setConfettiTick(t => t + 1), []);

  const refreshMe = useCallback(async () => {
    try {
      setLoadError(null);
      setMe(await api('GET', '/api/me'));
    } catch (e) {
      if (e.status === 401) logout();           // expired/foreign token → back to login
      else setLoadError('Could not reach the server — check your connection.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const refreshHomework = useCallback(async () => {
    try { setHomework(await api('GET', '/api/homework')); }
    catch (e) { if (e.status === 401) logout(); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // unread messages and challenge invitations, for the nav badges
  const refreshInbox = useCallback(() => {
    api('GET', '/api/inbox').then(setInbox).catch(() => {});
  }, []);
  useEffect(() => {
    if (!user) return;
    refreshInbox();
    const t = setInterval(refreshInbox, 30000);
    return () => clearInterval(t);
  }, [user, refreshInbox]);

  useEffect(() => {
    if (user) {
      setPage(user.role === 'student' ? 'home' : user.role === 'teacher' ? 'students' : 'admin');
      refreshMe();
      if (user.role === 'student') refreshHomework();
    }
  }, [user, refreshMe, refreshHomework]);

  function onAuth({ token, user: u }) {
    setToken(token);
    localStorage.setItem('mm_user', JSON.stringify(u));
    setUser(u);
  }
  function logout() {
    setToken(null);
    localStorage.removeItem('mm_user');
    setUser(null); setMe(null); setHomework(null); setPracticeCfg(null);
  }

  if (!user) {
    return (<>
      <Auth onAuth={onAuth} />
      <ToastList toasts={toasts} />
    </>);
  }

  const isTeacher = user.role === 'teacher';
  const isAdmin = user.role === 'admin';
  const homePage = isAdmin ? 'admin' : isTeacher ? 'students' : 'home';
  const nav = isAdmin
    ? [['admin', '⚙️ Admin'], ['learn', '🎓 Learn']]
    : isTeacher
      ? [['students', '👥 Students'], ['assign', '📝 Assign'], ['learn', '🎓 Learn']]
      : [['home', '➗ Math'], ['english', '📖 English'], ['science', '🔬 Science'], ['chinese', '🀄 Chinese'], ['homework', '📝 Homework'], ['learn', '🎓 Learn'], ['dashboard', '📊 My Progress'], ['awards', '🏆 Awards']];
  // Messages and Challenges sit next to the stars as icon buttons with badges (keeps the nav short)
  const social = [['messages', '💬', 'Messages', inbox.unread], ...(user.role === 'student' ? [['challenges', '⚔️', 'Challenges', inbox.pendingChallenges]] : [])];
  const goTo = id => { setPracticeCfg(null); setLearnOpen(null); setChatWith(null); setPage(id); };

  const startSkill = skillId => setPracticeCfg({ mode: 'skill', skillId });
  const startHomework = assignment => setPracticeCfg({ mode: 'homework', assignment });
  // race a challenge: the player's own side supplies progress so far
  const startChallenge = c => {
    const mine = c.challenger.id === me?.user?.id ? c.challenger : c.opponent;
    setPracticeCfg({ mode: 'challenge', assignment: { id: c.id, title: c.title, items: c.items, progress: mine.progress, done: mine.done, total: mine.total } });
  };
  const openChat = contactId => { setPracticeCfg(null); setChatWith(contactId); setPage('messages'); };

  function exitPractice(cfg) {
    setPracticeCfg(null);
    refreshMe();
    if (user.role === 'student') refreshHomework();
    const subj = cfg.mode === 'skill' ? SKILL_INDEX[cfg.skillId]?.subject.id : null;
    if (cfg.mode === 'challenge') { refreshInbox(); return setPage('challenges'); }
    setPage(cfg.mode === 'homework' ? 'homework' : subj && subj !== 'math' ? subj : 'home');
  }

  return (<>
    <Confetti tick={confettiTick} />
    {showChpw && <ChangePassword onClose={() => setShowChpw(false)} toast={toast} />}
    <header className="topbar">
      <button type="button" className="brand brand-sm brand-link" title="Go to home page"
        onClick={() => { setPracticeCfg(null); setPage(homePage); }}>
        <span className="brand-logo">A+</span>
        <span className="brand-name">Learn<span className="brand-accent">Ace</span></span>
      </button>
      <nav className="main-nav">
        {nav.map(([id, label]) => (
          <button key={id} type="button"
            className={'nav-btn' + (page === id && !practiceCfg ? ' active' : '')}
            onClick={() => goTo(id)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="user-chip">
        {social.map(([id, icon, label, n]) => (
          <button key={id} type="button" className={'icon-btn' + (page === id && !practiceCfg ? ' active' : '')}
            title={label} aria-label={n > 0 ? `${label}: ${n} new` : label} onClick={() => goTo(id)}>
            {icon}{n > 0 && <span className="nav-badge">{n}</span>}
          </button>
        ))}
        {user.role === 'student' && me?.user?.grade != null && <span className="stars-chip" title="Your grade">🎓 {gradeLabel(me.user.grade)}</span>}
        {user.role === 'student' && <span className="stars-chip">⭐ {me?.user?.stars ?? user.stars}</span>}
        <span className="greeting">Hi, {user.displayName}!</span>
        <button className="btn btn-ghost" type="button" title="Change password"
          onClick={() => setShowChpw(true)}>🔑</button>
        <button className="btn btn-ghost" type="button" onClick={logout}>Log out</button>
      </div>
    </header>

    {practiceCfg?.mode === 'review' ? (
      <ReviewPage toast={toast} fireConfetti={fireConfetti} onExit={() => { setPracticeCfg(null); refreshMe(); setPage('chinese'); }} />
    ) : practiceCfg ? (
      <PracticePage cfg={practiceCfg} me={me} toast={toast}
        fireConfetti={fireConfetti} onExit={() => exitPractice(practiceCfg)}
        onLearn={lesson => { setPracticeCfg(null); setLearnOpen(lesson); setPage('learn'); }} />
    ) : (<>
      {loadError && !me && (
        <main className="page">
          <p>⚠️ {loadError}{' '}
            <button className="btn btn-primary" type="button"
              onClick={() => { setLoadError(null); refreshMe(); refreshHomework(); }}>
              Retry
            </button>
          </p>
        </main>
      )}
      {SUBJECTS.map(subj => page === (subj.id === 'math' ? 'home' : subj.id) && (
        <SkillsPage key={subj.id} subject={subj} me={me} homework={homework}
          onStartSkill={startSkill} onStartHomework={startHomework} toast={toast}
          onLevelChanged={() => { refreshMe(); refreshHomework(); }}
          onLearn={lesson => { setLearnOpen(lesson); setPage('learn'); }}
          onStartReview={() => setPracticeCfg({ mode: 'review' })} />))}
      {page === 'homework' && <HomeworkPage homework={homework} onStart={startHomework} />}
      {page === 'learn' && <LearnPage key={learnOpen || 'learn'} toast={toast} fireConfetti={fireConfetti} initialOpen={learnOpen}
        myGrade={me?.user?.grade ?? null} onPractice={user.role === 'student' ? startSkill : null} />}
      {page === 'messages' && <MessagesPage key={chatWith || 'messages'} me={me} homework={homework} toast={toast} onPlay={startChallenge}
        initialContact={chatWith} onInboxChange={refreshInbox} />}
      {page === 'challenges' && <ChallengesPage me={me} toast={toast} onPlay={startChallenge} onOpenChat={openChat} />}
      {page === 'dashboard' && <DashboardPage me={me} onStartSkill={startSkill} />}
      {page === 'awards' && <AwardsPage me={me} />}
      {page === 'students' && <TeacherStudents toast={toast} />}
      {page === 'assign' && <TeacherAssign toast={toast} />}
      {page === 'admin' && isAdmin && <AdminPage toast={toast} />}
    </>)}

    <ToastList toasts={toasts} />
  </>);
}
