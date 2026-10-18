import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { ChallengeCard, NewChallenge } from './Challenges.jsx';

/* Messages between classmates (students who share a teacher) and with teachers.
   Challenges are sent and answered right inside a conversation. */

const MAX_BODY = 500;
const time = d => {
  const t = new Date(d), today = new Date().toDateString() === t.toDateString();
  return t.toLocaleString(undefined, today ? { hour: 'numeric', minute: '2-digit' } : { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};
const RELATION = { classmate: '🎒 classmate', teacher: '🧑‍🏫 teacher', student: '🎒 student', admin: '⚙️ admin' };

export default function MessagesPage({ me, homework, toast, onPlay, initialContact = null, onInboxChange }) {
  const meId = me?.user?.id, isStudent = me?.user?.role === 'student';
  const [threads, setThreads] = useState(null);
  const [openId, setOpenId] = useState(initialContact);
  const [conv, setConv] = useState(null);       // { messages, challenges }
  const [text, setText] = useState('');
  const [challengeFor, setChallengeFor] = useState(null);
  const endRef = useRef(null);

  const loadThreads = () => api('GET', '/api/messages').then(r => setThreads(r.threads)).catch(e => { toast('⚠️', e.message); setThreads([]); });
  const loadConv = id => api('GET', `/api/messages/${id}`).then(r => { setConv(c => ({ ...r, forId: id, grew: !c || c.forId !== id || r.messages.length !== c.messages.length })); onInboxChange?.(); })
    .catch(e => toast('⚠️', e.message));

  useEffect(() => { loadThreads(); const t = setInterval(loadThreads, 20000); return () => clearInterval(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!openId) { setConv(null); return; }
    loadConv(openId);
    const t = setInterval(() => loadConv(openId), 6000);
    return () => clearInterval(t);
  }, [openId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (conv?.grew) endRef.current?.scrollIntoView({ block: 'end' }); }, [conv]);

  const thread = threads?.find(t => t.contact.id === openId);
  const contact = thread?.contact;
  const canChallenge = isStudent && contact?.relation === 'classmate';

  async function send(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    try {
      await api('POST', `/api/messages/${openId}`, { body });
      setText('');
      loadConv(openId); loadThreads();
    } catch (err) { toast('⚠️', err.message); }
  }
  async function createChallenge(payload) {
    try {
      await api('POST', '/api/challenges', payload);
      toast('⚔️', `Challenge sent to ${contact.displayName}!`);
      setChallengeFor(null);
      loadConv(openId); loadThreads();
    } catch (err) { toast('⚠️', err.message); }
  }
  async function act(c, action) {
    try {
      await api('POST', `/api/challenges/${c.id}/${action}`);
      if (action === 'accept') toast('🏁', 'Challenge accepted — go!');
      loadConv(openId); onInboxChange?.();
    } catch (err) { toast('⚠️', err.message); }
  }

  if (!threads) return <main className="page"><p className="muted">Loading messages…</p></main>;
  return (
    <main className="page">
      <div className="page-head">
        <h2>💬 Messages</h2>
        <p className="muted">{isStudent
          ? 'Chat with your classmates and teachers — and send a ⚔️ challenge to race a classmate through the same skills.'
          : 'Chat with your students.'} Be kind: messages are for school buddies only.</p>
      </div>
      {threads.length === 0 ? (
        <p className="muted">No one to message yet. {isStudent ? 'Once your teacher adds you to a class, your classmates and teacher appear here.' : 'Students in your roster appear here.'}</p>
      ) : (
        <div className={'chat' + (openId ? ' has-open' : '')}>
          <aside className="chat-list" aria-label="Conversations">
            {threads.map(t => (
              <button type="button" key={t.contact.id} className={'chat-thread' + (t.contact.id === openId ? ' active' : '')} onClick={() => setOpenId(t.contact.id)}>
                <span className="chat-avatar" aria-hidden="true">{t.contact.displayName.slice(0, 1).toUpperCase()}</span>
                <span className="chat-thread-main">
                  <strong>{t.contact.displayName}</strong> <span className="muted small">{RELATION[t.contact.relation] || ''}</span>
                  <span className="chat-preview muted small">{t.last ? (t.last.from === meId ? 'You: ' : '') + t.last.body : 'Say hi 👋'}</span>
                </span>
                {t.unread > 0 && <span className="nav-badge">{t.unread}</span>}
              </button>
            ))}
          </aside>
          <section className="chat-pane">
            {!contact ? <p className="muted chat-empty">← Pick someone to chat with.</p> : (<>
              <div className="chat-head">
                <button type="button" className="btn btn-ghost chat-back" onClick={() => setOpenId(null)} aria-label="Back to conversations">←</button>
                <strong>{contact.displayName}</strong> <span className="muted small">@{contact.username} · {RELATION[contact.relation]}</span>
                {canChallenge && <button type="button" className="btn btn-primary chat-challenge" onClick={() => setChallengeFor(contact)}>⚔️ Challenge</button>}
              </div>
              <div className="chat-messages" aria-live="polite">
                {!conv || conv.forId !== openId ? <p className="muted">Loading…</p>
                  : conv.messages.length === 0 ? <p className="muted chat-empty">No messages yet — say hi 👋{canChallenge ? ' or send a ⚔️ challenge!' : ''}</p>
                  : conv.messages.map(m => (
                    <div key={m.id} className={'msg ' + (m.from === meId ? 'mine' : 'theirs') + ' kind-' + m.kind}>
                      {m.kind === 'result' ? <div className="msg-system">{m.body}</div> : <div className="msg-bubble">{m.body}</div>}
                      {m.kind === 'challenge' && conv.challenges[m.challengeId] &&
                        <ChallengeCard c={conv.challenges[m.challengeId]} meId={meId} onAction={act} onPlay={onPlay} compact />}
                      <div className="msg-time muted small">{time(m.at)}</div>
                    </div>
                  ))}
                <div ref={endRef} />
              </div>
              <form className="chat-compose" onSubmit={send}>
                <input type="text" value={text} maxLength={MAX_BODY} placeholder={`Message ${contact.displayName}…`} aria-label="Message"
                  onChange={e => setText(e.target.value)} />
                <button type="submit" className="btn btn-primary" disabled={!text.trim()}>Send</button>
              </form>
            </>)}
          </section>
        </div>
      )}
      {challengeFor && <NewChallenge opponent={challengeFor} homework={homework} onCreate={createChallenge} onClose={() => setChallengeFor(null)} />}
    </main>
  );
}
