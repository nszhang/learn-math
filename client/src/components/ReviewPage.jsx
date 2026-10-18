import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { localDateStr, niceDate } from '../homework.js';
import { reviewQuestion, HSK_WORD, ruby } from '../catalog/zh/skills.js';
import { canSpeak, speakChinese } from '../speech.js';
import WriteCharacters from './WriteCharacters.jsx';

/* Chinese word review deck (spaced repetition). Words a student meets in practice join the
   deck; each one comes back after 1, 3, 7, 14, 30 and 60 days while they keep remembering it,
   and returns to the start when they forget. A missed word is asked once more in the same session. */
export const SESSION_SIZE = 20;
export const KNOWN_BOX = 3; // same as server/src/srs.js

export const dueWords = (words, today = localDateStr()) => words
  .filter(w => w.due <= today && HSK_WORD.has(w.word))
  .sort((a, b) => a.due.localeCompare(b.due) || a.box - b.box);

export default function ReviewPage({ toast, fireConfetti, onExit }) {
  const [deck, setDeck] = useState(null);
  const [queue, setQueue] = useState([]);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null); // null | true | false
  const [stats, setStats] = useState({ done: 0, firstTry: 0, total: 0 });
  const [turn, setTurn] = useState(0);
  const reviewed = useRef(new Set()); // words already scored this session
  const choicesRef = useRef(null);

  // a session: up to SESSION_SIZE due words, most overdue first
  function start(words) {
    const q = dueWords(words).slice(0, SESSION_SIZE).map(w => w.word);
    reviewed.current = new Set();
    setQueue(q);
    setStats({ done: 0, firstTry: 0, total: q.length });
    setSelected(null); setResult(null);
    setQuestion(q.length ? reviewQuestion(q[0]) : null);
  }
  useEffect(() => {
    api('GET', '/api/review').then(r => { setDeck(r.words); start(r.words); })
      .catch(e => { toast('⚠️', e.message); setDeck([]); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!question) return;
    choicesRef.current?.querySelector('button')?.focus();
    if (question.listen && canSpeak) { const t = setTimeout(() => speakChinese(question.say), 300); return () => clearTimeout(t); }
  }, [question]);

  function answer(correct) {
    if (result !== null) return;
    setResult(correct);
    const word = queue[0];
    if (!reviewed.current.has(word)) {
      reviewed.current.add(word);
      setStats(s => ({ ...s, firstTry: s.firstTry + (correct ? 1 : 0) }));
      api('POST', '/api/review', { word, correct, today: localDateStr(), mode: 'review' })
        .then(r => setDeck(d => d.map(w => (w.word === word ? r.word : w))))
        .catch(e => toast('⚠️', e.message));
    }
    if (!correct && canSpeak) speakChinese(question.say);
  }

  function next() {
    // a miss goes to the back of the queue for one more try this session
    const [word, ...rest] = queue;
    const again = result === false && !rest.includes(word) ? [...rest, word] : rest;
    if (result) setStats(s => ({ ...s, done: s.done + 1 }));
    setQueue(again);
    setTurn(t => t + 1);
    setSelected(null); setResult(null);
    if (again.length) setQuestion(reviewQuestion(again[0]));
    else { setQuestion(null); fireConfetti?.(); }
  }

  // Enter = check / next; 1–9 pick a choice
  const keyRef = useRef();
  keyRef.current = e => {
    if (!question) return;
    if (e.key === 'Enter' && !e.repeat) {
      if (e.target.closest?.('.practice-head')) return;
      e.preventDefault();
      if (result !== null) next();
      else if (question.type !== 'write' && selected !== null) answer(selected === question.answer);
    } else if (/^[1-9]$/.test(e.key) && question.choices[+e.key - 1] && result === null) setSelected(question.choices[+e.key - 1]);
  };
  useEffect(() => { const h = e => keyRef.current(e); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);

  if (deck === null) return <main className="page"><p className="muted">Loading your review deck…</p></main>;

  const head = (
    <div className="practice-head">
      <button className="btn btn-ghost" type="button" onClick={onExit}>← Back to Chinese</button>
      <h2>🔁 Review words</h2>
      {question && <span className="muted">{stats.done} of {stats.total} remembered · {queue.length} to go</span>}
    </div>
  );

  if (!question) {
    const known = deck.filter(w => w.box >= KNOWN_BOX).length;
    const upcoming = deck.filter(w => w.due > localDateStr()).map(w => w.due).sort()[0];
    return (
      <main className="page">
        {head}
        <div className="review-done">
          {stats.total > 0 ? (<>
            <div className="review-big">🎉</div>
            <h3>Review done!</h3>
            <p>You reviewed <strong>{stats.total}</strong> word{stats.total === 1 ? '' : 's'} and remembered <strong>{stats.firstTry}</strong> on the first try.</p>
          </>) : deck.length ? (<>
            <div className="review-big">✅</div>
            <h3>Nothing to review right now</h3>
          </>) : (<>
            <div className="review-big">🌱</div>
            <h3>Your review deck is empty</h3>
            <p>Practise the HSK word skills — every word you meet joins your deck, and it will come back here just before you'd forget it.</p>
          </>)}
          {deck.length > 0 && <p className="muted">{deck.length} words in your deck · {known} well known (🧠 remembered over 3+ days){upcoming ? ` · next review ${niceDate(upcoming)}` : ''}.</p>}
          {dueWords(deck).length > 0 && <button type="button" className="btn btn-primary" onClick={() => start(deck)}>Review more</button>}{' '}
          <button type="button" className="btn btn-ghost" onClick={onExit}>Back to Chinese</button>
        </div>
      </main>
    );
  }

  const e = HSK_WORD.get(queue[0]);
  return (
    <main className="page">
      {head}
      <div className="topic-progress" style={{ marginBottom: 14 }}>
        <div className="topic-progress-fill" style={{ width: Math.round(100 * stats.done / (stats.total || 1)) + '%' }} />
      </div>
      <section className="question-panel">
        <div className="question-prompt" dangerouslySetInnerHTML={{ __html: question.prompt }} />
        {question.listen && canSpeak && (
          <div className="listen-bar">
            <button type="button" className="btn btn-primary listen-btn" onClick={() => speakChinese(question.say)}>🔊 Play again</button>
            <button type="button" className="btn btn-ghost" onClick={() => speakChinese(question.say, { rate: 0.5 })}>🐢 Slowly</button>
          </div>
        )}
        {question.listen && !canSpeak && <p className="warn-box">🔇 This browser can't play speech, so here is the text: <span className="zh">{question.say}</span></p>}

        {question.type === 'write' ? (
          <WriteCharacters key={turn} word={question.answer} say={question.say} outline={question.outline}
            disabled={result !== null} onDone={ok => answer(ok)} />
        ) : (
          <div className="choices zh-choices" style={{ marginBottom: 22 }} ref={choicesRef} role="radiogroup" aria-label="Answer choices">
            {question.choices.map(c => (
              <button key={c} type="button" role="radio" aria-checked={selected === c} disabled={result !== null}
                className={'choice-btn' + (selected === c ? ' selected' : '') + (result !== null && c === question.answer ? ' correct-choice' : '')}
                onClick={() => setSelected(c)}>{c}</button>
            ))}
          </div>
        )}

        <div className="practice-actions">
          {result === null ? (
            question.type === 'write'
              ? <button type="button" className="btn btn-ghost btn-lg" onClick={() => answer(false)}>I can't write it yet — show me</button>
              : <button type="button" className="btn btn-primary btn-lg" disabled={selected === null} onClick={() => answer(selected === question.answer)}>Check</button>
          ) : <button type="button" className="btn btn-primary btn-lg" onClick={next}>{queue.length > 1 || result === false ? 'Next word' : 'Finish 🎉'}</button>}
        </div>

        {result !== null && (
          <div className={'feedback ' + (result ? 'good' : 'bad')}>
            <h3>{result ? '✅ Remembered!' : '🔁 This one will come back soon'}</h3>
            <p className="explain"><span className="review-word" dangerouslySetInnerHTML={{ __html: ruby(e.w[0], e.w[1]) }} /> — {e.w[2]} <span className="muted">(HSK {e.level})</span>{' '}
              {canSpeak && <button type="button" className="btn btn-ghost speak-btn" onClick={() => speakChinese(e.w[0])}>🔊</button>}</p>
          </div>
        )}
      </section>
    </main>
  );
}
