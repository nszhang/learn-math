import { useEffect, useMemo, useState } from 'react';
import { solve, randomExpression, tokensText, opSpan, currentGroup, nextOpIndex, applyAt, hintFor, fmt, TRAPS, RULE } from '../../learn/bedmas.js';

const COLORS = { B: '#7c3aed', E: '#db2777', DM: '#2563eb', AS: '#16a34a' };
const LETTERS = [['B', 'Brackets', 'B'], ['E', 'Exponents', 'E'], ['D', 'Division', 'DM'], ['M', 'Multiplication', 'DM'], ['A', 'Addition', 'AS'], ['S', 'Subtraction', 'AS']];
const LEVELS = [[1, 'Basic'], [2, 'Brackets'], [3, 'Exponents'], [4, 'Tricky']];
const SPEED_MS = 2200;

function Expression({ tokens, span, group, rule, clickable, onPick, flash }) {
  return (
    <div className="bed-expr" aria-live="polite">
      {tokens.map((t, i) => {
        const inSpan = span && i >= span[0] && i <= span[1];
        const inGroup = group && group.bracket && i >= group.start - 1 && i <= group.end;
        const text = t.t === 'num' ? fmt(t.v) : t.t === 'op' ? t.v : t.t;
        const style = inSpan ? { background: COLORS[rule], color: '#fff', borderColor: COLORS[rule] } : {};
        const cls = 'bed-tok' + (t.t === 'op' ? ' bed-op' : '') + (t.t === '(' || t.t === ')' ? ' bed-par' : '') +
          (inGroup && !inSpan ? ' bed-group' : '') + (t.fresh ? ' bed-fresh' : '') + (flash === i ? ' bed-wrong' : '');
        if (clickable && t.t === 'op') {
          return <button type="button" key={i} className={cls + ' bed-pick'} style={style} onClick={() => onPick(i)} aria-label={`do ${text} next`}>{text}</button>;
        }
        return <span key={i} className={cls} style={style}>{text}</span>;
      })}
    </div>
  );
}

export default function BedmasLab({ toast, fireConfetti, myGrade = null, onPractice = null }) {
  const [mode, setMode] = useState('watch');           // 'watch' | 'practice'
  const [level, setLevel] = useState(2);
  const [expr, setExpr] = useState(() => randomExpression(2));
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [note, setNote] = useState(null);              // trap explanation
  const [idx, setIdx] = useState(0);                   // watch: frame index
  const [playing, setPlaying] = useState(false);
  // practice state
  const [pTokens, setPTokens] = useState(null);
  const [pLog, setPLog] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [hint, setHint] = useState(null);
  const [flash, setFlash] = useState(null);

  const solved = useMemo(() => { try { return solve(expr); } catch (e) { return { error: e.message }; } }, [expr]);

  function load(e, trapNote = null) {
    setExpr(e); setIdx(0); setPlaying(false); setNote(trapNote); setError(null);
    try { const r = solve(e); setPTokens(r.frames.length ? r.frames[0].tokens : r.final); } catch { setPTokens(null); }
    setPLog([]); setMistakes(0); setHint(null);
  }
  useEffect(() => { load(expr); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function tryCustom(e) {
    e.preventDefault();
    try { solve(input); load(input); } catch (err) { setError(err.message); }
  }

  /* ---------- watch mode ---------- */
  const frames = solved.frames || [];
  const done = idx >= frames.length;
  useEffect(() => {
    if (mode !== 'watch' || !playing || done) return;
    const t = setTimeout(() => setIdx(i => i + 1), SPEED_MS);
    return () => clearTimeout(t);
  });
  useEffect(() => {
    if (mode === 'watch' && done && frames.length) { setPlaying(false); fireConfetti?.(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, mode]);

  /* ---------- practice mode ---------- */
  const pNext = pTokens ? nextOpIndex(pTokens) : null;
  const pDone = pTokens && pNext === null;
  function pick(i) {
    if (pNext === null) return;
    if (i === pNext) {
      const { tokens, step } = applyAt(pTokens, i);
      setPLog(l => [...l, step]); setPTokens(tokens); setHint(null);
      if (nextOpIndex(tokens) === null) {
        fireConfetti?.();
        toast?.('🎉', mistakes ? `Solved! ${mistakes} hint${mistakes > 1 ? 's' : ''} along the way.` : 'Perfect — every step in the right order!');
      }
    } else {
      setMistakes(m => m + 1);
      setHint(hintFor(pTokens, i, pNext));
      setFlash(i); setTimeout(() => setFlash(null), 600);
    }
  }

  const frame = frames[Math.min(idx, frames.length - 1)];
  const watchTokens = done ? solved.final : frame?.tokens;
  const activeRule = mode === 'watch'
    ? (!done && frame ? frame.step.rule : null)
    : (pNext !== null && pTokens ? RULE[pTokens[pNext].v] : null);
  const inBracket = mode === 'watch' ? (!done && frame?.step.inBrackets) : (pTokens && pNext !== null && currentGroup(pTokens).bracket);

  return (
    <div className="learn-grid">
      <section className="lesson-board">
        <div className="lesson-controls">
          <div className="level-tabs">
            <button type="button" className={'role-tab' + (mode === 'watch' ? ' active' : '')} onClick={() => { setMode('watch'); load(expr, note); }}>👀 Watch it solve</button>
            <button type="button" className={'role-tab' + (mode === 'practice' ? ' active' : '')} onClick={() => { setMode('practice'); load(expr, note); }}>🎯 You pick the step</button>
          </div>
          <div className="level-tabs">
            {LEVELS.map(([l, name]) => (
              <button key={l} type="button" className={'role-tab' + (level === l ? ' active' : '')} onClick={() => { setLevel(l); load(randomExpression(l)); }}>{name}</button>
            ))}
          </div>
        </div>

        <div className="bed-letters" aria-label="BEDMAS">
          {LETTERS.map(([L, word, rule]) => {
            const on = (rule === 'B' && inBracket) || rule === activeRule;
            return (
              <div key={L} className={'bed-letter' + (on ? ' on' : '')} style={on ? { background: COLORS[rule], borderColor: COLORS[rule] } : { color: COLORS[rule], borderColor: COLORS[rule] }}>
                <strong>{L}</strong><small>{word}</small>
              </div>
            );
          })}
        </div>

        {solved.error ? <p className="expr-error">⚠ {solved.error}</p> : mode === 'watch' ? (<>
          <div className="eq-stage" style={{ paddingTop: 16 }}>
            <Expression key={idx} tokens={watchTokens} span={!done && frame ? opSpan(frame.tokens, frame.opIndex) : null}
              group={!done && frame ? currentGroup(frame.tokens) : null} rule={frame?.step.rule} />
            <div className="frame-note">
              {done
                ? <>🎉 Answer: <strong>{tokensText(solved.final)}</strong> — every step done in BEDMAS order.</>
                : <><strong>Step {idx + 1} of {frames.length}:</strong> {frame.step.why}<br />➜ <strong>{frame.step.text}</strong></>}
            </div>
          </div>
          <div className="anim-controls">
            <button type="button" className="btn btn-primary" onClick={() => (done ? load(expr, note) : setPlaying(p => !p))}>
              {playing ? '⏸ Pause' : done ? '↺ Replay' : idx > 0 ? '▶ Resume' : '▶ Play'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setPlaying(false); setIdx(i => Math.max(0, i - 1)); }} disabled={idx === 0}>⏮ Back</button>
            <button type="button" className="btn btn-ghost" onClick={() => { setPlaying(false); setIdx(i => Math.min(frames.length, i + 1)); }} disabled={done}>⏭ Step</button>
            <button type="button" className="btn btn-ghost" onClick={() => load(randomExpression(level))}>🎲 New expression</button>
          </div>
        </>) : (<>
          <div className="eq-stage" style={{ paddingTop: 16 }}>
            {pTokens && <Expression tokens={pTokens} clickable={!pDone} onPick={pick} flash={flash}
              span={null} group={pDone ? null : currentGroup(pTokens)} />}
            <div className="frame-note">
              {pDone
                ? <>🎉 Answer: <strong>{tokensText(pTokens)}</strong> {mistakes === 0 ? '— perfect order!' : `— solved with ${mistakes} hint${mistakes > 1 ? 's' : ''}.`}</>
                : hint ? <>🤔 <strong>Not that one yet.</strong> {hint}</>
                : <>👆 <strong>Click the operation you would do first.</strong> {currentGroup(pTokens || []).bracket ? 'The shaded part is inside brackets.' : ''}</>}
            </div>
          </div>
          <div className="anim-controls">
            <button type="button" className="btn btn-ghost" onClick={() => load(expr, note)}>↺ Start over</button>
            <button type="button" className="btn btn-primary" onClick={() => load(randomExpression(level))}>🎲 New expression</button>
          </div>
        </>)}

        {note && <div className="warn-box" style={{ marginTop: 12 }}>💡 {note}</div>}

        <form className="bed-custom" onSubmit={tryCustom}>
          <label htmlFor="bed-input" className="muted">Try your own:</label>
          <input id="bed-input" className="expr-input" value={input} onChange={e => { setInput(e.target.value); setError(null); }}
            placeholder="e.g. 3 + 4 × (6 − 2)^2 ÷ 8" autoComplete="off" spellCheck={false} />
          <button type="submit" className="btn btn-ghost">Solve it</button>
          {error && <div className="expr-error">⚠ {error}</div>}
        </form>
      </section>

      <aside className="lesson-steps">
        <h4>📋 {mode === 'watch' ? 'Steps' : 'Your steps'}</h4>
        {mode === 'watch'
          ? frames.map((f, i) => (
            <div key={i} className={'lesson-step' + (i < idx ? ' step-done' : i === idx ? ' step-current' : '')}>
              <span className="step-num" style={i === idx ? { background: COLORS[f.step.rule] } : {}}>{i < idx ? '✓' : i + 1}</span>
              <div className="step-text">{f.step.text} <span className="muted">({f.step.inBrackets ? 'B → ' : ''}{f.step.rule === 'DM' ? 'D/M' : f.step.rule === 'AS' ? 'A/S' : 'E'})</span></div>
            </div>
          ))
          : pLog.length === 0 ? <p className="muted">Your steps will appear here.</p>
          : pLog.map((st, i) => (
            <div key={i} className="lesson-step step-done"><span className="step-num">✓</span><div className="step-text">{st.text}</div></div>
          ))}

        {onPractice && (<>
          <h4 style={{ marginTop: 18 }}>🎯 Practise for points</h4>
          {myGrade !== null && myGrade >= 3 && myGrade <= 9
            ? <button type="button" className="btn btn-primary" onClick={() => onPractice(`mthBev${myGrade}`)}>Practise BEDMAS — Grade {myGrade}</button>
            : <div className="preset-row" style={{ flexWrap: 'wrap' }}>
                {[3, 4, 5, 6, 7, 8, 9].map(g => <button key={g} type="button" className="preset-btn" onClick={() => onPractice(`mthBev${g}`)}>Grade {g}</button>)}
              </div>}
          <p className="muted" style={{ fontSize: '.85rem', marginTop: 6 }}>More BEDMAS skills are in Math → your grade → “BEDMAS: order of operations”.</p>
        </>)}

        <h4 style={{ marginTop: 18 }}>⚠️ Common traps</h4>
        <div className="preset-row" style={{ flexWrap: 'wrap' }}>
          {TRAPS.map(t => (
            <button key={t.expr} type="button" className={'preset-btn' + (expr === t.expr ? ' active' : '')} onClick={() => load(t.expr, t.note)}>{t.expr}</button>
          ))}
        </div>
        <div className="graph-facts">
          <p><strong>B</strong>rackets first — the innermost ones.</p>
          <p><strong>E</strong>xponents next.</p>
          <p><strong>D</strong>ivision and <strong>M</strong>ultiplication are a team: whichever comes first, <em>left to right</em>.</p>
          <p><strong>A</strong>ddition and <strong>S</strong>ubtraction are a team too: left to right.</p>
        </div>
      </aside>
    </div>
  );
}
