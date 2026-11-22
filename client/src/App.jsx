import { useCallback, useEffect, useRef, useState } from 'react';
import { api, setToken } from './api.js';
import { useNavState, canGoBack } from './nav.js';
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
import { CallProvider } from './components/Calls.jsx';
import { startLiveEvents, stopLiveEvents, onLiveEvent } from './events.js';
import ChallengesPage from './components/Challenges.jsx';
import PracticePage from './components/PracticePage.jsx';
import DiagnosticPage from './components/DiagnosticPage.jsx';
import Confetti from './components/Confetti.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';

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

// pages each role may be on; the first is that role's home
const PAGES = {
  student: ['home', 'english', 'science', 'chinese', 'homework', 'learn', 'dashboard', 'awards', 'messages', 'challenges'],
  teacher: ['students', 'assign', 'learn', 'messages'],
  admin: ['admin', 'learn', 'messages']
};

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('mm_user') || 'null'));
  // the current page is kept in browser history so Back/Forward move between app pages
  const [view, setView] = useNavState('view', { page: null, practice: null, learn: null, chat: null }, { top: true });
  const { page, practice: practiceCfg, learn: learnOpen, chat: chatWith } = view;
  const go = (pg, extra = {}, opts) => setView({ page: pg, practice: null, learn: null, chat: null, ...extra }, opts);
  const [me, setMe] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [homework, setHomework] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [confettiTick, setConfettiTick] = useState(0);
  const [showChpw, setShowChpw] = useState(false);
  const [inbox, setInbox] = useState({ unread: 0, pendingChallenges: 0 });

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
    startLiveEvents();
    const off = onLiveEvent(ev => { if (ev.type === 'message') refreshInbox(); });
    const t = setInterval(refreshInbox, 60000);
    return () => { clearInterval(t); off(); stopLiveEvents(); };
  }, [user, refreshInbox]);

  useEffect(() => {
    if (user) {
      // keep the page across a reload (but not a half-done practice run); otherwise start at the role's home
      if (!PAGES[user.role].includes(page)) go(PAGES[user.role][0], {}, { replace: true });
      else if (practiceCfg) setView({ ...view, practice: null }, { replace: true });
      refreshMe();
      if (user.role === 'student') refreshHomework();
    }
  }, [user, refreshMe, refreshHomework]); // eslint-disable-line react-hooks/exhaustive-deps

  // practice saves as it goes; refresh stars, homework and badges whenever it ends (button or Back)
  const wasPracticing = useRef(false);
  useEffect(() => {
    if (wasPracticing.current && !practiceCfg && user) {
      refreshMe(); refreshInbox();
      if (user.role === 'student') refreshHomework();
    }
    wasPracticing.current = !!practiceCfg;
  }, [practiceCfg]); // eslint-disable-line react-hooks/exhaustive-deps

  function onAuth({ token, user: u }) {
    setToken(token);
    localStorage.setItem('mm_user', JSON.stringify(u));
    setUser(u);
  }
  function logout() {
    setToken(null);
    localStorage.removeItem('mm_user');
    setUser(null); setMe(null); setHomework(null);
    go(null, {}, { replace: true });
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
  const goTo = id => go(id);
  const startPractice = cfg => setView({ ...view, practice: cfg });

  const startSkill = skillId => startPractice({ mode: 'skill', skillId });
  const startHomework = assignment => startPractice({ mode: 'homework', assignment });
  // race a challenge: the player's own side supplies progress so far
  const startChallenge = c => {
    const mine = c.challenger.id === me?.user?.id ? c.challenger : c.opponent;
    startPractice({ mode: 'challenge', assignment: { id: c.id, title: c.title, items: c.items, progress: mine.progress, done: mine.done, total: mine.total } });
  };
  const openChat = contactId => go('messages', { chat: contactId });
  const openLesson = lesson => go('learn', { learn: lesson });

  // leaving practice goes Back to the page it was started from
  function exitPractice(cfg) {
    if (canGoBack()) return window.history.back();
    const subj = cfg.mode === 'skill' ? SKILL_INDEX[cfg.skillId]?.subject.id : null;
    go(cfg.mode === 'challenge' ? 'challenges' : cfg.mode === 'homework' ? 'homework'
      : cfg.mode === 'review' ? 'chinese' : subj && subj !== 'math' ? subj : 'home', {}, { replace: true });
  }

  return (<CallProvider me={me} toast={toast}>
    <Confetti tick={confettiTick} />
    {showChpw && <ChangePassword onClose={() => setShowChpw(false)} toast={toast} />}
    <header className="topbar">
      <button type="button" className="brand brand-sm brand-link" title="Go to home page"
        onClick={() => go(homePage)}>
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
        <ThemeToggle />
        <button className="btn btn-ghost" type="button" title="Change password"
          onClick={() => setShowChpw(true)}>🔑</button>
        <button className="btn btn-ghost" type="button" onClick={logout}>Log out</button>
      </div>
    </header>

    {practiceCfg?.mode === 'diagnostic' ? (
      <DiagnosticPage subject={SUBJECTS.find(s => s.id === practiceCfg.subject)} me={me} onExit={() => exitPractice(practiceCfg)}
        onStartSkill={skillId => setView({ ...view, practice: { mode: 'skill', skillId } }, { replace: true })} />
    ) : practiceCfg?.mode === 'review' ? (
      <ReviewPage toast={toast} fireConfetti={fireConfetti} onExit={() => exitPractice(practiceCfg)} />
    ) : practiceCfg ? (
      <PracticePage cfg={practiceCfg} me={me} toast={toast}
        fireConfetti={fireConfetti} onExit={() => exitPractice(practiceCfg)}
        onLearn={openLesson} />
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
          onLearn={openLesson}
          onStartReview={() => startPractice({ mode: 'review' })}
          onStartDiagnostic={() => startPractice({ mode: 'diagnostic', subject: subj.id })} />))}
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
  </CallProvider>);
}
