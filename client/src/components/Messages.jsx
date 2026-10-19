import { useEffect, useRef, useState } from 'react';
import { api, apiUpload } from '../api.js';
import { onLiveEvent } from '../events.js';
import { ChallengeCard, NewChallenge } from './Challenges.jsx';
import { useCalls } from './Calls.jsx';
import { EmojiPicker, shrinkImage, ChatImage, Lightbox, isBigEmoji } from './chatMedia.jsx';

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
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [sending, setSending] = useState(false);   // picture upload in progress
  const [dragging, setDragging] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const { startCall, inCall } = useCalls();
  const endRef = useRef(null), inputRef = useRef(null), fileRef = useRef(null);
  const openIdRef = useRef(openId); openIdRef.current = openId;

  const loadThreads = () => api('GET', '/api/messages').then(r => setThreads(r.threads)).catch(e => { toast('⚠️', e.message); setThreads([]); });
  const loadConv = id => api('GET', `/api/messages/${id}`).then(r => { setConv(c => ({ ...r, forId: id, grew: !c || c.forId !== id || r.messages.length !== c.messages.length })); onInboxChange?.(); })
    .catch(e => toast('⚠️', e.message));

  // live updates (with slow polling as a fallback if the live connection drops)
  useEffect(() => { loadThreads(); const t = setInterval(loadThreads, 45000); return () => clearInterval(t); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!openId) { setConv(null); return; }
    loadConv(openId);
    const t = setInterval(() => loadConv(openId), 20000);
    return () => clearInterval(t);
  }, [openId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => onLiveEvent(ev => {
    if (ev.type !== 'message') return;
    const other = ev.from === meId ? ev.to : ev.from;
    // open conversation: load it first (that marks it read), then refresh the list's unread counts
    if (other === openIdRef.current) loadConv(other).then(loadThreads);
    else loadThreads();
  }), [meId]); // eslint-disable-line react-hooks/exhaustive-deps
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
  async function sendPicture(file) {
    if (!file || !openId) return;
    setSending(true);
    try {
      const blob = await shrinkImage(file);
      await apiUpload(`/api/messages/${openId}/image`, blob);
      loadConv(openId); loadThreads();
    } catch (err) { toast('⚠️', err.message); }
    finally { setSending(false); if (fileRef.current) fileRef.current.value = ''; }
  }
  function onPaste(e) {
    const file = [...(e.clipboardData?.files || [])].find(f => f.type.startsWith('image/'));
    if (file) { e.preventDefault(); sendPicture(file); }
  }
  function onDrop(e) {
    e.preventDefault(); setDragging(false);
    const file = [...(e.dataTransfer?.files || [])].find(f => f.type.startsWith('image/'));
    if (file) sendPicture(file); else if (e.dataTransfer?.files?.length) toast('⚠️', 'Only pictures can be sent.');
  }
  function addEmoji(em) {
    const el = inputRef.current, start = el?.selectionStart ?? text.length, end = el?.selectionEnd ?? text.length;
    const next = (text.slice(0, start) + em + text.slice(end)).slice(0, MAX_BODY);
    setText(next);
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(start + em.length, start + em.length); });
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
                <span className="chat-head-actions">
                  <button type="button" className="icon-btn" title={`Voice call ${contact.displayName}`} aria-label={`Voice call ${contact.displayName}`} disabled={inCall} onClick={() => startCall(contact, false)}>📞</button>
                  <button type="button" className="icon-btn" title={`Video call ${contact.displayName}`} aria-label={`Video call ${contact.displayName}`} disabled={inCall} onClick={() => startCall(contact, true)}>🎥</button>
                  {canChallenge && <button type="button" className="btn btn-primary chat-challenge" onClick={() => setChallengeFor(contact)}>⚔️ Challenge</button>}
                </span>
              </div>
              <div className={'chat-messages' + (dragging ? ' dragging' : '')} aria-live="polite"
                onDragOver={e => { if ([...(e.dataTransfer?.types || [])].includes('Files')) { e.preventDefault(); setDragging(true); } }}
                onDragLeave={() => setDragging(false)} onDrop={onDrop}>
                {!conv || conv.forId !== openId ? <p className="muted">Loading…</p>
                  : conv.messages.length === 0 ? <p className="muted chat-empty">No messages yet — say hi 👋{canChallenge ? ' or send a ⚔️ challenge!' : ''}</p>
                  : conv.messages.map(m => (
                    <div key={m.id} className={'msg ' + (m.from === meId ? 'mine' : 'theirs') + ' kind-' + m.kind}>
                      {m.kind === 'result' || m.kind === 'call' ? <div className={'msg-system' + (m.kind === 'call' ? ' call' : '')}>{m.body}</div>
                        : m.kind === 'image' && m.imageId ? <ChatImage id={m.imageId} onOpen={setLightbox} />
                        : isBigEmoji(m.body) ? <div className="msg-emoji">{m.body}</div>
                        : <div className="msg-bubble">{m.body}</div>}
                      {m.kind === 'challenge' && conv.challenges[m.challengeId] &&
                        <ChallengeCard c={conv.challenges[m.challengeId]} meId={meId} onAction={act} onPlay={onPlay} compact />}
                      <div className="msg-time muted small">{time(m.at)}</div>
                    </div>
                  ))}
                <div ref={endRef} />
              </div>
              <form className="chat-compose" onSubmit={send}>
                <span className="compose-tools">
                  <button type="button" className="icon-btn" title="Emoji" aria-label="Add an emoji" aria-expanded={emojiOpen} onClick={() => setEmojiOpen(o => !o)}>😊</button>
                  {emojiOpen && <EmojiPicker onPick={addEmoji} onClose={() => setEmojiOpen(false)} />}
                  <button type="button" className="icon-btn" title="Send a picture" aria-label="Send a picture" disabled={sending} onClick={() => fileRef.current?.click()}>{sending ? '⏳' : '🖼️'}</button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => sendPicture(e.target.files?.[0])} />
                </span>
                <input ref={inputRef} type="text" value={text} maxLength={MAX_BODY} placeholder={`Message ${contact.displayName}…`} aria-label="Message"
                  onChange={e => setText(e.target.value)} onPaste={onPaste} />
                <button type="submit" className="btn btn-primary" disabled={!text.trim()}>Send</button>
              </form>
            </>)}
          </section>
        </div>
      )}
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      {challengeFor && <NewChallenge opponent={challengeFor} homework={homework} onCreate={createChallenge} onClose={() => setChallengeFor(null)} />}
    </main>
  );
}
