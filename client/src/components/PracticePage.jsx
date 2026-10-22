import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { SKILL_INDEX, PRAISE, PRAISE_CHALLENGE, ENCOURAGE, MASTERY_MSGS, pick, fmtNum } from '../skills.js';
import { niceDate, localDateStr } from '../homework.js';
import WriteCharacters from './WriteCharacters.jsx';
import { createDeduper, questionSig } from '../questionPool.js';
import { canSpeak, speak } from '../speech.js';

let audioCtx = null;

function beep(freq, dur) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = freq; o.type = 'sine';
    g.gain.setValueAtTime(0.08, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g).connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  } catch { /* audio unavailable */ }
}

export default function PracticePage({ cfg, me, toast, fireConfetti, onExit, onLearn }) {
  // challenge mode reuses the homework queue: same skills and counts, but only correct answers count
  const isCh = cfg.mode === 'challenge';
  const isHw = cfg.mode === 'homework' || isCh;

  // homework queue: items with remaining questions
  const [queue, setQueue] = useState(() => isHw
    ? cfg.assignment.items.map(i => {
        const p = (cfg.assignment.progress || []).find(x => x.skillId === i.skillId);
        return { skillId: i.skillId, count: i.count, done: p ? p.done : 0 };
      }).filter(it => it.done < it.count)
    : null);
  const [qi, setQi] = useState(0);

  const currentItem = isHw ? queue[Math.min(qi, queue.length - 1)] : null;
  const skillId = isHw ? currentItem.skillId : cfg.skillId;
  const skill = SKILL_INDEX[skillId].skill;
  const isChinese = SKILL_INDEX[skillId].subject.id === 'chinese';

  // no repeated questions within an assignment (remembered across visits) or a practice session
  const [dedupe] = useState(() => createDeduper(isHw ? `mm_seen_${me?.user?.id ?? 'u'}_${cfg.assignment.id}` : null));
  // practice stops at SmartScore 100 and never repeats a question; a finished round shows `ended`
  const startScore = me?.skillProgress?.find(p => p.skill_id === skillId)?.score || 0;
  const [ended, setEnded] = useState(() => (!isHw && startScore >= 100 ? 'mastered' : null)); // 'mastered' | 'exhausted'
  const [reviewing, setReviewing] = useState(false); // chose to keep going after mastery
  const [question, setQuestion] = useState(() => (!isHw && startScore >= 100 ? null : dedupe.next(skill, { allowRepeat: isHw })));
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null); // { correct, title }
  const [inputVal, setInputVal] = useState('');
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(startScore);
  const [session, setSession] = useState({ answered: 0, correct: 0, streak: 0, seconds: 0, rewards: [] });
  const [hwTotals, setHwTotals] = useState(() => isHw
    ? { done: cfg.assignment.done ?? 0, total: cfg.assignment.total ?? cfg.assignment.items.reduce((s, i) => s + i.count, 0) }
    : null);
  const [hwDone, setHwDone] = useState(false);
  const [chEnd, setChEnd] = useState(null); // { won, winnerName } when a challenge is over
  // live race: the other player's progress
  const [rival, setRival] = useState(null);
  useEffect(() => {
    if (!isCh) return;
    const meId = me?.user?.id;
    const poll = () => api('GET', `/api/challenges/${cfg.assignment.id}`).then(({ challenge: c }) => {
      setRival(c.challenger.id === meId ? c.opponent : c.challenger);
      if (c.status === 'completed' && c.winnerId !== meId) { setHwDone(true); setChEnd(e => e || { won: false, winnerName: (c.challenger.id === c.winnerId ? c.challenger : c.opponent).displayName }); }
    }).catch(() => {});
    poll();
    const t = setInterval(poll, 8000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCh]);
  const secondsRef = useRef(0);
  const inputRef = useRef(null);

  // practice timer + 15s time pings to the server
  useEffect(() => {
    const t = setInterval(() => {
      setSession(s => ({ ...s, seconds: s.seconds + 1 }));
      secondsRef.current += 1;
      if (secondsRef.current % 15 === 0) {
        api('POST', '/api/time', { seconds: 15 })
          .then(r => r.newAwards.forEach(a => toast(a.emoji, `Badge earned: ${a.name}! +2 ⭐`)))
          .catch(() => {});
      }
    }, 1000);
    return () => clearInterval(t);
  }, [toast]);

  // when the homework queue moves to a new skill, reset its displayed score
  useEffect(() => {
    setScore(me?.skillProgress?.find(p => p.skill_id === skillId)?.score || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillId]);

  const choicesRef = useRef(null);
  useEffect(() => {
    // number questions: focus the box; choice questions: focus the first choice
    (inputRef.current || choicesRef.current?.querySelector('button'))?.focus();
    // listening questions play on their own
    if (question?.listen && canSpeak) {
      const t = setTimeout(() => speak(question.say, { lang: question.lang }), 300);
      return () => clearTimeout(t);
    }
  }, [question]);

  // Enter anywhere on the page = Submit, or Next once answered. Latest handler
  // is kept in a ref so the window listener never goes stale.
  const actRef = useRef();
  actRef.current = advanceOrSubmit;
  useEffect(() => {
    const onKey = e => {
      if (e.key !== 'Enter' || e.repeat || e.isComposing) return;
      if (e.target.closest?.('.practice-head')) return; // let Back button keep its own Enter
      e.preventDefault(); // also stops a focused choice/button from double-firing its click
      actRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Arrow keys (and 1-9) move through / pick choices
  function onChoiceKey(e) {
    const cs = question.choices;
    const i = selected === null ? -1 : cs.indexOf(selected);
    let n = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % cs.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i <= 0 ? cs.length : i) - 1;
    else if (/^[1-9]$/.test(e.key) && +e.key <= cs.length) n = +e.key - 1;
    if (n === null || answered) return;
    e.preventDefault();
    setSelected(cs[n]);
    choicesRef.current?.querySelectorAll('button')[n]?.focus();
  }

  function nextQuestion() {
    const q = dedupe.next(skill, { allowRepeat: isHw });
    if (!q) { setEnded('exhausted'); return; }
    setQuestion(q);
    setAnswered(false); setFeedback(null); setInputVal(''); setSelected(null);
  }

  // practice: start a fresh round (or keep going after mastery) when the student asks for it
  function practiceAgain() {
    if (ended === 'exhausted') dedupe.reset(skill);
    else setReviewing(true);
    const q = dedupe.next(skill, { allowRepeat: false }) || (dedupe.reset(skill), dedupe.next(skill, { allowRepeat: false }));
    setEnded(null); setQuestion(q);
    setAnswered(false); setFeedback(null); setInputVal(''); setSelected(null);
  }

  // writing questions submit themselves when the last character is drawn
  async function submitAnswer(written = null) {
    if (answered) return;
    let correct;
    if (question.type === 'write') {
      if (written === null) return;
      correct = written;
    } else if (question.type === 'num') {
      if (inputVal.trim() === '') return;
      correct = Math.abs(Number(inputVal) - question.answer) < 1e-9;
    } else {
      if (selected === null) return;
      correct = selected === question.answer;
    }

    beep(correct ? 880 : 220, correct ? 0.12 : 0.2);
    if (!correct) dedupe.missed(skill, question);
    const newStreak = correct ? session.streak + 1 : 0;
    setSession(s => ({
      ...s, answered: s.answered + 1,
      correct: s.correct + (correct ? 1 : 0), streak: newStreak
    }));
    setAnswered(true);
    setFeedback({
      correct,
      title: correct ? (score >= 90 ? pick(PRAISE_CHALLENGE) : pick(PRAISE)) : pick(ENCOURAGE)
    });

    // Chinese words met in practice join the student's review deck (a miss brings one back sooner)
    if (question.word && me?.user?.role === 'student') {
      api('POST', '/api/review', { word: question.word, correct, today: localDateStr(), mode: 'seen' }).catch(() => {});
    }

    try {
      const body = { skillId, correct, streak: newStreak };
      if (isCh) body.challengeId = cfg.assignment.id;
      else if (isHw) {
        body.assignmentId = cfg.assignment.id;
        if (cfg.assignment.daily) body.items = cfg.assignment.items;
        // readable skill names for the teacher's "homework finished" email
        else body.skillTitles = Object.fromEntries(cfg.assignment.items.map(i => {
          const x = SKILL_INDEX[i.skillId];
          return [i.skillId, x ? `${x.subject.name} · ${x.grade.name} · ${x.skill.code} ${x.skill.title}` : i.skillId];
        }));
      }
      const r = await api('POST', '/api/answers', body);
      setScore(r.score);

      const rewards = [];
      if (r.newMedal) {
        rewards.push(`${r.newMedal.emoji} ${r.newMedal.label} (+${r.newMedal.stars}⭐)`);
        toast(r.newMedal.emoji, `${r.newMedal.label} +${r.newMedal.stars} ⭐`);
        if (r.newMedal.id === 'gold') { fireConfetti(); toast('🎊', pick(MASTERY_MSGS)); }
      }
      r.newAwards.forEach(a => {
        rewards.push(`${a.emoji} Badge: ${a.name} (+2⭐)`);
        toast(a.emoji, `Badge earned: ${a.name}! +2 ⭐`);
      });

      if (isCh && r.challenge) {
        const c = r.challenge;
        setHwTotals({ done: c.done, total: c.total });
        const nq = queue.map((it, idx) => idx === qi ? { ...it, done: c.skillDone } : it);
        setQueue(nq);
        if (nq[qi].done >= nq[qi].count) setQi(qi + 1);
        if (c.over) {
          setHwDone(true);
          setChEnd({ won: c.won, winnerName: c.winnerName, finished: c.justCompleted });
          if (c.won) {
            rewards.push('🏆 Challenge won! (+3⭐)');
            fireConfetti();
            toast('🏆', 'You won the challenge! +3 ⭐');
          } else toast('⚔️', c.winnerName ? `${c.winnerName} finished first — good race!` : 'This challenge is over.');
        }
      }
      if (!isCh && isHw && r.homework) {
        setHwTotals({ done: r.homework.done, total: r.homework.total });
        const nq = queue.map((it, idx) => idx === qi ? { ...it, done: r.homework.skillDone ?? it.done + 1 } : it);
        if (r.homework.mastered && !r.homework.justCompleted && nq[qi].done >= nq[qi].count && currentItem.done + 1 < currentItem.count) {
          rewards.push(`🥇 ${skill.code} mastered — skill complete`);
          toast('🥇', 'SmartScore 100 — this skill is done! Moving on.');
        }
        setQueue(nq);
        if (nq[qi].done >= nq[qi].count) setQi(qi + 1);
        if (r.homework.justCompleted) {
          setHwDone(true);
          rewards.push('🎉 Homework complete! (+5⭐)');
          fireConfetti();
          toast('🎉', 'Homework complete! +5 ⭐');
        }
      }
      if (rewards.length) setSession(s => ({ ...s, rewards: [...s.rewards, ...rewards] }));
    } catch (e) {
      toast('⚠️', e.message);
    }
  }

  function advanceOrSubmit() {
    if (ended) return onExit();
    if (!answered) return submitAnswer();
    if (hwDone) return onExit();
    if (!isHw && !reviewing && score >= 100) return setEnded('mastered');
    nextQuestion();
  }

  const medalText = isCh
    ? (chEnd ? (chEnd.won ? '🏆 You won!' : `⚔️ ${chEnd.winnerName || 'Your rival'} won this one`) : `⚔️ Race: ${hwTotals.done}/${hwTotals.total} correct`)
    : isHw
    ? (hwDone ? '🎉 Done! Head back to see your stars.' : `📝 Homework: ${hwTotals.done}/${hwTotals.total} questions done`)
    : score >= 100 ? '🥇 Mastered!'
    : score >= 90 ? '🥈 Silver — Challenge Zone!'
    : score >= 70 ? '🥉 Bronze — on your way!'
    : 'Reach 70 for a bronze medal 🥉';

  return (
    <main className="page">
      <div className="practice-head">
        <button className="btn btn-ghost" type="button" onClick={onExit}>
          ← Back to {isCh ? 'challenges' : isHw ? 'homework' : 'skills'}
        </button>
        {skill.learn && onLearn && (
          <button className="btn btn-ghost" type="button" onClick={() => onLearn(skill.learn)} title="Open the matching lesson">🎓 Learn it</button>
        )}
        <div className="practice-title">
          <span className="skill-code">{isCh ? '⚔️' : isHw ? (cfg.assignment.daily ? 'Daily' : 'HW') : skill.code}</span>
          <h2>{isCh ? `Challenge: ${cfg.assignment.title}` : isHw
            ? (cfg.assignment.daily ? `Daily ${cfg.assignment.subject || ''} Practice — ${niceDate(cfg.assignment.due)}` : `Homework from ${cfg.assignment.teacherName || 'your teacher'}`)
            : skill.title}</h2>
        </div>
        {isCh && (
          <div className={'practice-banner challenge-banner' + (chEnd ? (chEnd.won ? ' won' : ' lost') : '')}>
            {chEnd
              ? (chEnd.won ? <>🏆 <strong>You won the challenge!</strong> +3 ⭐</>
                : <>⚔️ <strong>{chEnd.winnerName || 'Your rival'}</strong> finished first.{chEnd.finished ? ' You finished too — great effort!' : ''} Ask for a rematch!</>)
              : <>⚔️ <strong>Race!</strong> Only correct answers count.
                  {' • '}{SKILL_INDEX[currentItem.skillId].skill.code}: {currentItem.done} of {currentItem.count} correct
                  {' • '}You {hwTotals.done}/{hwTotals.total}
                  {rival && <> {' • '}{rival.displayName} {rival.done}/{rival.total}</>}</>}
            {!chEnd && rival && (
              <div className="race-bars">
                <div className="race-bar"><span>You</span><div><i style={{ width: Math.round(100 * hwTotals.done / (hwTotals.total || 1)) + '%' }} /></div></div>
                <div className="race-bar rival"><span>{rival.displayName}</span><div><i style={{ width: Math.round(100 * rival.done / (rival.total || 1)) + '%' }} /></div></div>
              </div>
            )}
          </div>
        )}
        {!isCh && isHw && (
          <div className="practice-banner">
            {hwDone
              ? <>🎉 <strong>Homework complete!</strong> Amazing work — you earned 5 ⭐</>
              : <>📝 <strong>{cfg.assignment.daily ? 'Daily Practice' : 'Homework'}</strong> due {niceDate(cfg.assignment.due)}
                  {' • '}{SKILL_INDEX[currentItem.skillId].skill.code}: question {currentItem.done + 1} of {currentItem.count}
                  {' • '}Overall {hwTotals.done} of {hwTotals.total} questions</>}
          </div>
        )}
      </div>

      <div className="practice-layout">
        <section className="question-panel">
          {ended ? (
            <div className="practice-ended">
              {ended === 'mastered' ? (<>
                <div className="ended-emoji">🥇</div>
                <h3>SmartScore 100 — you've mastered this skill!</h3>
                <p className="muted">There are no more questions to answer here. Pick another skill to keep learning.</p>
              </>) : (<>
                <div className="ended-emoji">🎯</div>
                <h3>You've answered every question in this skill</h3>
                <p className="muted">That's the whole set — no repeats! Your SmartScore is {score}. Start a new round to keep climbing, or try another skill.</p>
              </>)}
              <div className="practice-actions">
                <button className="btn btn-primary btn-lg" type="button" onClick={onExit}>Choose another skill</button>
                <button className="btn btn-ghost" type="button" onClick={practiceAgain}>{ended === 'mastered' ? 'Review anyway' : 'Start a new round'}</button>
              </div>
            </div>
          ) : (<>
          <div className="question-prompt" dangerouslySetInnerHTML={{ __html: question.prompt }} />
          {question.listen ? (
            canSpeak ? (
              <div className="listen-bar">
                <button type="button" className="btn btn-primary listen-btn" onClick={() => speak(question.say, { lang: question.lang })} title="Play again">🔊 Play again</button>
                <button type="button" className="btn btn-ghost" onClick={() => speak(question.say, { rate: 0.5, lang: question.lang })} title="Play slowly">🐢 Slowly</button>
              </div>
            ) : <p className="warn-box">🔇 This browser can't play speech, so here is the text: <span className="zh">{question.say}</span></p>
          ) : question.say && canSpeak && (
            <button type="button" className="btn btn-ghost speak-btn" onClick={() => speak(question.say, { lang: question.lang })} title="Listen">🔊 Listen</button>
          )}

          {question.type === 'write' ? (
            <div style={{ marginBottom: 22 }}>
              <WriteCharacters key={questionSig(question)} word={question.answer} say={question.say} outline={question.outline}
                disabled={answered} onDone={ok => submitAnswer(ok)} />
            </div>
          ) : question.type === 'num' ? (
            <div style={{ marginBottom: 22 }}>
              <input ref={inputRef} className="answer-input" type="number" step="any" placeholder="?"
                autoComplete="off" value={inputVal} disabled={answered}
                onChange={e => setInputVal(e.target.value)} />
            </div>
          ) : (
            <div className={'choices' + (isChinese ? ' zh-choices' : '')} style={{ marginBottom: 22 }} ref={choicesRef}
              role="radiogroup" aria-label="Answer choices" onKeyDown={onChoiceKey}>
              {question.choices.map(c => (
                <button key={c} type="button" role="radio" aria-checked={selected === c}
                  className={'choice-btn' + (selected === c ? ' selected' : '')}
                  disabled={answered}
                  onClick={() => setSelected(c)}>{c}</button>
              ))}
            </div>
          )}

          <div className="practice-actions">
            <button className={'btn btn-lg ' + (question.type === 'write' && !answered ? 'btn-ghost' : 'btn-primary')} type="button"
              onClick={() => (question.type === 'write' && !answered ? submitAnswer(false) : advanceOrSubmit())}>
              {!answered ? (question.type === 'write' ? "I can't write it yet — show me" : 'Submit') : hwDone ? 'Finish 🎉' : !isHw && !reviewing && score >= 100 ? 'Finish 🥇' : 'Next question'}
            </button>
          </div>

          {feedback && (
            <div className={'feedback ' + (feedback.correct ? 'good' : 'bad')}>
              <h3>{feedback.title}</h3>
              {!feedback.correct && (<>
                <p className="explain">The correct answer is <strong>
                  {question.type === 'num' ? fmtNum(question.answer) : question.answer}</strong>.</p>
                <p className="explain"><strong>Why?</strong>{' '}
                  <span dangerouslySetInnerHTML={{ __html: question.explain }} /></p>
              </>)}
              {feedback.correct && question.listen && (
                <p className="explain"><span dangerouslySetInnerHTML={{ __html: question.explain }} />{' '}
                  {canSpeak && <button type="button" className="btn btn-ghost speak-btn" onClick={() => speak(question.say, { lang: question.lang })}>🔊 Hear it again</button>}</p>)}
              {feedback.correct && score >= 100 && !isHw && (
                <p className="explain">🥇 <strong>SmartScore 100 — mastery achieved!</strong> This skill is complete.</p>)}
            </div>
          )}
          </>)}
        </section>

        <aside className="score-panel">
          <div className="score-card">
            <div className="score-label">SmartScore</div>
            <div className={'score-value' + (score >= 100 ? ' gold' : '')}>{score}</div>
            <div className="score-bar">
              <div className="score-bar-zone zone-challenge" />
              <div className={'score-bar-fill' + (score >= 100 ? ' gold' : '')} style={{ width: score + '%' }} />
            </div>
            <div className="score-bar-labels"><span>0</span><span className="cz-label">Challenge Zone 90+</span><span>100</span></div>
            <div className="score-medal">{medalText}</div>
          </div>

          <div className="session-card">
            <div className="session-row"><span>🔥 Streak</span><strong>{session.streak}</strong></div>
            <div className="session-row"><span>✅ Correct</span><strong>{session.correct}/{session.answered}</strong></div>
            <div className="session-row"><span>⏱️ Time</span>
              <strong>{Math.floor(session.seconds / 60)}:{String(session.seconds % 60).padStart(2, '0')}</strong></div>
          </div>

          {session.rewards.length > 0 && (
            <div className="session-rewards">
              <h4>🎁 Earned this session</h4>
              {session.rewards.map((r, i) => <span className="reward-pill" key={i}>{r}</span>)}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
