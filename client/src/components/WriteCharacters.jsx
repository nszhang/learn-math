import { useEffect, useRef, useState } from 'react';
import HanziWriter from 'hanzi-writer';
import { canSpeak, speakChinese } from '../speech.js';

// Stroke data is copied into public/hanzi/ at build time (scripts/copy-hanzi.mjs).
const loadChar = (char, onLoad, onError) => {
  fetch(`${import.meta.env.BASE_URL}hanzi/${encodeURIComponent(char)}.json`)
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(r.status))))
    .then(onLoad)
    .catch(onError);
};

// A character "passes" with at most this many wrong strokes (hints appear after 3 misses on one stroke).
const MAX_MISTAKES = 3;

/**
 * Write a word stroke by stroke. Characters are quizzed one at a time; when the last one is done,
 * onDone(correct, mistakes) fires. `outline` shows a faint guide to trace over.
 */
export default function WriteCharacters({ word, say, outline = true, disabled = false, onDone }) {
  const chars = [...word];
  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState([]); // per finished character
  const [showGuide, setShowGuide] = useState(outline);
  const [error, setError] = useState(false);
  const boxRef = useRef(null), writerRef = useRef(null), doneRef = useRef(onDone);
  doneRef.current = onDone;

  // quiz the current character; when it's done, record its mistakes and move on
  function startQuiz(w) {
    if (disabled) return;
    w.quiz({
      showHintAfterMisses: 3,
      onComplete: ({ totalMistakes }) => {
        setMistakes(m => {
          const all = [...m, totalMistakes];
          if (all.length === chars.length) doneRef.current?.(all.every(x => x <= MAX_MISTAKES), all.reduce((sum, x) => sum + x, 0));
          return all;
        });
        setTimeout(() => setIdx(i => i + 1), 500);
      }
    });
  }

  useEffect(() => {
    if (idx >= chars.length || !boxRef.current) return;
    boxRef.current.innerHTML = '';
    const size = Math.min(260, (boxRef.current.parentElement?.clientWidth || 300) - 20);
    const w = HanziWriter.create(boxRef.current, chars[idx], {
      width: size, height: size, padding: 12,
      showOutline: showGuide, showCharacter: false,
      strokeColor: '#1e293b', outlineColor: '#cbd5e1', drawingColor: '#4f46e5', highlightColor: '#f59e0b',
      drawingWidth: 22, strokeAnimationSpeed: 1.2, delayBetweenStrokes: 250,
      charDataLoader: loadChar,
      onLoadCharDataError: () => setError(true)
    });
    writerRef.current = w;
    startQuiz(w);
    return () => { try { w.cancelQuiz(); } catch { /* already gone */ } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, word, showGuide, disabled]);

  function demo() {
    const w = writerRef.current;
    if (!w) return;
    w.cancelQuiz();
    w.animateCharacter({
      onComplete: () => {
        w.hideCharacter();
        startQuiz(w);
      }
    });
  }

  if (error) return <p className="warn-box">✍️ Stroke data for this character couldn't be loaded. Skip ahead with Next.</p>;
  const finished = idx >= chars.length;
  return (
    <div className="write-box">
      <div className="write-progress">
        {chars.map((c, i) => (
          <span key={i} className={'write-slot' + (i === idx ? ' current' : '') + (i < mistakes.length ? (mistakes[i] <= MAX_MISTAKES ? ' good' : ' shaky') : '')}>
            {i < mistakes.length || finished ? c : '？'}
          </span>
        ))}
      </div>
      {!finished && <div className="write-pad" ref={boxRef} aria-label={`Writing pad: draw character ${idx + 1} of ${chars.length} with your finger or mouse`} />}
      {!finished && (
        <div className="anim-controls">
          <button type="button" className="btn btn-ghost" onClick={demo}>▶️ Show strokes</button>
          <button type="button" className="btn btn-ghost" onClick={() => setShowGuide(g => !g)}>{showGuide ? '🙈 Hide outline' : '💡 Show outline'}</button>
          {canSpeak && say && <button type="button" className="btn btn-ghost" onClick={() => speakChinese(say)}>🔊 Listen</button>}
        </div>
      )}
      {!finished && <p className="muted small">Draw each stroke in order, with your finger or mouse. After 3 misses on a stroke you get a hint.</p>}
    </div>
  );
}
