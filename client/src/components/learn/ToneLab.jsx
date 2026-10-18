import { useEffect, useRef, useState } from 'react';
import { canSpeak, hasChineseVoice, speakChinese } from '../../speech.js';
import { ruby } from '../../catalog/zh/skills.js';

/* Mandarin tones, taught with sound: pitch contours on the 5-level scale,
   playable syllables, tone pairs, tone changes, ear training and a
   "say it" mode that draws the learner's own pitch from the microphone. */

const TONES = [
  { n: 1, name: '1st tone', mark: 'ā', shape: 'high and level', tip: 'Hold one high note, like singing "laaa".', pts: [[8, 12], [112, 12]], chao: '5 → 5' },
  { n: 2, name: '2nd tone', mark: 'á', shape: 'rising', tip: 'Go up, like asking "Huh?" or "What?"', pts: [[8, 52], [112, 12]], chao: '3 → 5' },
  { n: 3, name: '3rd tone', mark: 'ǎ', shape: 'low dip (then rise)', tip: 'Drop low and creaky, then come back up a little. In fast speech it often just stays low.', pts: [[8, 64], [52, 88], [112, 30]], chao: '2 → 1 → 4' },
  { n: 4, name: '4th tone', mark: 'à', shape: 'sharp fall', tip: 'Drop fast from high to low, like a firm "No!"', pts: [[8, 12], [112, 88]], chao: '5 → 1' }
];
const NEUTRAL = { tip: 'Short and light, with no tone mark — like the second 爸 in 爸爸 (bà ba) or 吗 at the end of a question.' };

// syllable families: [hanzi, pinyin, meaning] for tones 1–4
const FAMILIES = [
  ['ma', [['妈', 'mā', 'mom'], ['麻', 'má', 'hemp'], ['马', 'mǎ', 'horse'], ['骂', 'mà', 'to scold']]],
  ['ba', [['八', 'bā', 'eight'], ['拔', 'bá', 'to pull out'], ['把', 'bǎ', 'to hold'], ['爸', 'bà', 'dad']]],
  ['yi', [['衣', 'yī', 'clothes'], ['姨', 'yí', 'aunt'], ['椅', 'yǐ', 'chair'], ['意', 'yì', 'meaning']]],
  ['shi', [['诗', 'shī', 'poem'], ['十', 'shí', 'ten'], ['使', 'shǐ', 'to make (someone do)'], ['是', 'shì', 'to be']]],
  ['tang', [['汤', 'tāng', 'soup'], ['糖', 'táng', 'sugar; candy'], ['躺', 'tǎng', 'to lie down'], ['烫', 'tàng', 'very hot (to touch)']]],
  ['wen', [['温', 'wēn', 'warm'], ['文', 'wén', 'writing'], ['稳', 'wěn', 'steady'], ['问', 'wèn', 'to ask']]],
  ['tu', [['突', 'tū', 'sudden'], ['图', 'tú', 'picture'], ['土', 'tǔ', 'soil'], ['兔', 'tù', 'rabbit']]],
  ['fan', [['翻', 'fān', 'to turn over'], ['烦', 'fán', 'annoyed'], ['反', 'fǎn', 'opposite'], ['饭', 'fàn', 'meal; rice']]]
];

// two-syllable words: [hanzi, pinyin, meaning, [tone, tone]]
const PAIRS = [
  ['中国', 'zhōng guó', 'China', [1, 2]], ['今天', 'jīn tiān', 'today', [1, 1]], ['老师', 'lǎo shī', 'teacher', [3, 1]], ['学生', 'xué sheng', 'student', [2, 5]],
  ['北京', 'běi jīng', 'Beijing', [3, 1]], ['汉语', 'hàn yǔ', 'Chinese', [4, 3]], ['朋友', 'péng you', 'friend', [2, 5]], ['电脑', 'diàn nǎo', 'computer', [4, 3]],
  ['飞机', 'fēi jī', 'airplane', [1, 1]], ['熊猫', 'xióng māo', 'panda', [2, 1]], ['米饭', 'mǐ fàn', 'rice', [3, 4]], ['再见', 'zài jiàn', 'goodbye', [4, 4]],
  ['苹果', 'píng guǒ', 'apple', [2, 3]], ['喝水', 'hē shuǐ', 'drink water', [1, 3]], ['学校', 'xué xiào', 'school', [2, 4]], ['谢谢', 'xiè xie', 'thank you', [4, 5]]
];

const SANDHI = [
  { title: 'Two 3rd tones in a row', rule: 'The first 3rd tone is said as a 2nd tone. (It is still written as 3rd.)',
    ex: [['你好', 'nǐ hǎo', 'ní hǎo'], ['很好', 'hěn hǎo', 'hén hǎo'], ['水果', 'shuǐ guǒ', 'shuí guǒ'], ['可以', 'kě yǐ', 'ké yǐ']] },
  { title: '不 (bù) before a 4th tone', rule: '不 becomes bú before a 4th tone. Before tones 1, 2 and 3 it stays bù.',
    ex: [['不是', 'bù shì', 'bú shì'], ['不要', 'bù yào', 'bú yào'], ['不好', 'bù hǎo', 'bù hǎo'], ['不来', 'bù lái', 'bù lái']] },
  { title: '一 (yī) changes too', rule: '一 becomes yí before a 4th tone and yì before tones 1, 2 and 3. Counting (一, 十一) and "first" (第一) keep yī.',
    ex: [['一个', 'yī gè', 'yí gè'], ['一样', 'yī yàng', 'yí yàng'], ['一天', 'yī tiān', 'yì tiān'], ['第一', 'dì yī', 'dì yī']] }
];

const toneColor = n => `var(--tone${n}, #888)`;
// straight line, or a curve through the middle point (control point chosen so the curve passes through it)
const pathOf = pts => {
  if (pts.length === 2) return `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
  const [a, m, z] = pts, cx = 2 * m[0] - (a[0] + z[0]) / 2, cy = 2 * m[1] - (a[1] + z[1]) / 2;
  return `M${a[0]},${a[1]} Q${cx},${cy} ${z[0]},${z[1]}`;
};

/** Pitch chart with the five Chao levels; draws a tone (or two side by side) and traces it while playing. */
function Contour({ tones, playing, user = null, width = 120 }) {
  const n = tones.length, W = width * n;
  return (
    <svg className="tone-svg" viewBox={`0 0 ${W} 100`} role="img" aria-label={`Pitch: ${tones.map(t => (t === 5 ? 'neutral' : 'tone ' + t)).join(', ')}`}>
      {[12, 31, 50, 69, 88].map((y, i) => <line key={y} x1="0" x2={W} y1={y} y2={y} className="tone-grid" data-level={5 - i} />)}
      {tones.map((t, i) => {
        const dx = i * width;
        if (t === 5) return <circle key={i} cx={dx + width / 3} cy="66" r="6" fill={toneColor(5)} />; // neutral: short and light
        const pts = TONES[t - 1].pts.map(([x, y]) => [x * (width / 120) + dx, y]);
        return <path key={i + '-' + playing} d={pathOf(pts)} pathLength="100" className={'tone-path' + (playing ? ' tracing' : '')}
          style={{ stroke: toneColor(t), animationDelay: `${i * 0.45}s` }} />;
      })}
      {user && <polyline points={user} className="tone-user" />}
    </svg>
  );
}

/* ---------- microphone pitch tracking (autocorrelation) ---------- */
function detectPitch(buf, rate) {
  let rms = 0;
  for (const v of buf) rms += v * v;
  if (Math.sqrt(rms / buf.length) < 0.015) return null; // silence
  const minLag = Math.floor(rate / 500), maxLag = Math.floor(rate / 70); // 70–500 Hz voices
  let best = -1, bestLag = -1;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0, e1 = 0, e2 = 0;
    for (let i = 0; i + lag < buf.length; i++) { sum += buf[i] * buf[i + lag]; e1 += buf[i] * buf[i]; e2 += buf[i + lag] * buf[i + lag]; }
    const c = sum / Math.sqrt(e1 * e2 || 1);
    if (c > best) { best = c; bestLag = lag; }
  }
  return best > 0.85 ? rate / bestLag : null;
}
// Classify a pitch track (semitones) by shape. Heuristic — good enough for practice feedback.
function classify(st) {
  if (st.length < 5) return null;
  const k = Math.max(1, Math.floor(st.length / 5));
  const avg = a => a.reduce((s, x) => s + x, 0) / a.length;
  const start = avg(st.slice(0, k)), end = avg(st.slice(-k)), lo = Math.min(...st), loAt = st.indexOf(lo) / st.length;
  if (start - end > 3) return 4;
  if (lo < start - 1.5 && lo < end - 1.5 && loAt > 0.2 && loAt < 0.85) return 3;
  if (end - start > 2) return 2;
  if (Math.max(...st) - lo < 2.5) return 1;
  return end > start ? 2 : 4;
}

function SayIt({ target, onResult }) {
  const [state, setState] = useState('idle'); // idle | listening | done | error
  const [line, setLine] = useState(null);
  const [heard, setHeard] = useState(null);
  const stopRef = useRef(null);
  useEffect(() => () => stopRef.current?.(), []);

  async function record() {
    setLine(null); setHeard(null);
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { setState('error'); return; }
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const src = ctx.createMediaStreamSource(stream), an = ctx.createAnalyser();
    an.fftSize = 2048; src.connect(an);
    const buf = new Float32Array(an.fftSize), track = [];
    setState('listening');
    const timer = setInterval(() => { an.getFloatTimeDomainData(buf); track.push(detectPitch(buf, ctx.sampleRate)); }, 20);
    const stop = () => { clearInterval(timer); stream.getTracks().forEach(t => t.stop()); ctx.close(); stopRef.current = null; };
    stopRef.current = stop;
    setTimeout(() => {
      stop();
      // keep the voiced stretch, drop octave jumps, convert to semitones
      const v = track.filter(Boolean);
      if (v.length < 5) { setState('done'); setHeard('quiet'); return; }
      const med = [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];
      const st = v.filter(f => f > med / 1.8 && f < med * 1.8).map(f => 12 * Math.log2(f / med));
      const smooth = st.map((_, i) => { const w = st.slice(Math.max(0, i - 2), i + 3); return w.reduce((s, x) => s + x, 0) / w.length; });
      // plot: ±6 semitones around the speaker's middle spans the chart
      const pts = smooth.map((s, i) => `${8 + (104 * i) / Math.max(1, smooth.length - 1)},${Math.max(4, Math.min(96, 50 - s * 6.5))}`).join(' ');
      setLine(pts);
      const t = classify(smooth);
      setHeard(t);
      setState('done');
      onResult?.(t === target);
    }, 1600);
  }

  if (!navigator.mediaDevices?.getUserMedia) return <p className="muted">🎙️ This browser can't use the microphone.</p>;
  return (
    <div className="say-it">
      <Contour tones={[target]} playing={false} user={line} />
      <div className="anim-controls">
        <button type="button" className="btn btn-primary" onClick={record} disabled={state === 'listening'}>
          {state === 'listening' ? '🔴 Listening… say it now' : '🎙️ Say it'}
        </button>
      </div>
      {state === 'error' && <p className="warn-box">🎙️ Microphone permission was blocked. Allow it in the browser's address bar to try this.</p>}
      {state === 'done' && heard === 'quiet' && <p className="muted">I couldn't hear a voice — try again a little louder and closer.</p>}
      {state === 'done' && typeof heard === 'number' && (
        <p className={heard === target ? 'tone-good' : 'tone-try'}>
          {heard === target ? `✅ That sounded like the ${TONES[target - 1].name}!` : `Your pitch looked more like the ${TONES[heard - 1].name} (${TONES[heard - 1].shape}). ${TONES[target - 1].tip}`}
        </p>
      )}
      {state === 'done' && heard === null && <p className="muted">Hmm, that was too short to tell — hold the vowel a little longer.</p>}
      <p className="muted small">Your pitch is drawn in black over the target. Everyone's voice is different, so the chart is centred on <em>your</em> voice. (Pitch detection is approximate.)</p>
    </div>
  );
}

const TABS = [['four', '🎵 The four tones'], ['pairs', '🎶 Tone pairs'], ['changes', '🔀 Tone changes'], ['ear', '👂 Ear training'], ['say', '🎙️ Say it']];

export default function ToneLab({ fireConfetti, toast, onPractice }) {
  const [tab, setTab] = useState('four');
  const [fam, setFam] = useState(0);
  const [playing, setPlaying] = useState(null); // key of what is being played
  const play = (text, key, opts) => {
    if (!canSpeak) return toast?.('🔇', "This browser can't play speech.");
    setPlaying(null);
    requestAnimationFrame(() => setPlaying(key));
    speakChinese(text, { ...opts, onEnd: () => setPlaying(p => (p === key ? null : p)) });
  };
  const [noVoice, setNoVoice] = useState(false);
  useEffect(() => { const t = setTimeout(() => setNoVoice(canSpeak && !hasChineseVoice()), 800); return () => clearTimeout(t); }, []);

  // ear training
  const [quiz, setQuiz] = useState(null); // { ch, py, t, picked }
  const [tally, setTally] = useState({ right: 0, total: 0, streak: 0 });
  function newQuiz() {
    const [, fam4] = FAMILIES[Math.floor(Math.random() * FAMILIES.length)];
    const t = Math.floor(Math.random() * 4) + 1, [ch, py, en] = fam4[t - 1];
    const q = { ch, py, en, t, picked: null };
    setQuiz(q);
    play(ch, 'quiz');
  }
  function answer(t) {
    if (!quiz || quiz.picked) return;
    const ok = t === quiz.t, streak = ok ? tally.streak + 1 : 0;
    setQuiz({ ...quiz, picked: t });
    setTally({ right: tally.right + ok, total: tally.total + 1, streak });
    if (ok && streak > 0 && streak % 5 === 0) { fireConfetti?.(); toast?.('🎉', `${streak} in a row — great ears!`); }
  }

  // say it
  const [sayTarget, setSayTarget] = useState(1);
  const sayChar = FAMILIES[fam][1][sayTarget - 1];

  return (
    <div className="tone-lab">
      {!canSpeak && <p className="warn-box">🔇 This browser can't play speech. The charts still show how each tone moves.</p>}
      {noVoice && <p className="warn-box">🔈 No Mandarin voice was found on this device, so the sound may be wrong. On Windows add "Chinese (Simplified)" under Settings → Time &amp; language → Speech; on iPhone/iPad/Mac add a Chinese voice under Accessibility → Spoken content.</p>}
      <div className="tone-tabs" role="tablist">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} className={'btn ' + (tab === id ? 'btn-primary' : 'btn-ghost')} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {tab === 'four' && (<>
        <p>Mandarin is a <strong>tonal</strong> language: the same syllable with a different pitch is a different word.
          <strong> mā</strong> is "mom" but <strong>mǎ</strong> is "horse"! Pitch is drawn on five levels, 5 = your highest comfortable note, 1 = your lowest.</p>
        <div className="anim-controls">
          {FAMILIES.map(([name], i) => (
            <button key={name} type="button" className={'btn ' + (fam === i ? 'btn-primary' : 'btn-ghost')} onClick={() => setFam(i)}>{name}</button>
          ))}
          <button type="button" className="btn btn-ghost" onClick={() => play(FAMILIES[fam][1].map(x => x[0]).join('，'), 'all', { rate: 0.6 })}>▶️ Play all four</button>
        </div>
        <div className="tone-grid-cards">
          {TONES.map(t => {
            const [ch, py, en] = FAMILIES[fam][1][t.n - 1], key = 'four' + t.n;
            return (
              <button type="button" key={t.n} className={'tone-card tone-c' + t.n} onClick={() => play(ch, key)} aria-label={`Play ${py}, ${en}`}>
                <div className="tone-card-head"><strong>{t.name}</strong> <span className="muted">{t.shape} · {t.chao}</span></div>
                <Contour tones={[t.n]} playing={playing === key || playing === 'all'} />
                <div className="tone-char" dangerouslySetInnerHTML={{ __html: ruby(ch, py) }} />
                <div className="muted">{en} 🔊</div>
                <p className="small">{t.tip}</p>
              </button>
            );
          })}
        </div>
        <p className="muted"><strong>Neutral tone:</strong> {NEUTRAL.tip}{' '}
          <button type="button" className="btn btn-ghost" onClick={() => play('爸爸', 'n1')}>🔊 爸爸</button>
          <button type="button" className="btn btn-ghost" onClick={() => play('你好吗？', 'n2')}>🔊 你好吗？</button></p>
        <p className="muted"><strong>Tone marks</strong> go on the vowel: a, o and e always get the mark (hǎo, duō, xiè); in iu and ui it goes on the second letter (liù, duì).</p>
      </>)}

      {tab === 'pairs' && (<>
        <p>In real speech, tones come in pairs and groups. Tap a word to hear it and watch both tones. The grey dot is a neutral tone.</p>
        <div className="tone-pairs">
          {PAIRS.map(([hz, py, en, ts]) => (
            <button type="button" key={hz} className="tone-pair" onClick={() => play(hz, 'p' + hz)}>
              <Contour tones={ts} playing={playing === 'p' + hz} width={60} />
              <span dangerouslySetInnerHTML={{ __html: ruby(hz, py) }} />
              <span className="muted small">{en}</span>
            </button>
          ))}
        </div>
      </>)}

      {tab === 'changes' && (<>
        <p>A few tones change depending on the next syllable (this is called <em>tone sandhi</em>). Tap each word and listen for the change.</p>
        {SANDHI.map(s => (
          <div className="sandhi" key={s.title}>
            <h4>{s.title}</h4>
            <p className="muted">{s.rule}</p>
            <div className="anim-controls">
              {s.ex.map(([hz, written, said]) => (
                <button type="button" key={hz} className="btn btn-ghost" onClick={() => play(hz, 's' + hz)}>
                  🔊 <span className="zh">{hz}</span> {written === said ? <strong>{said}</strong> : <>{written} → <strong>{said}</strong></>}
                </button>
              ))}
            </div>
          </div>
        ))}
        {onPractice && <button type="button" className="btn btn-primary" onClick={() => onPractice('chiH2TnSd')}>✏️ Practice tone changes</button>}
      </>)}

      {tab === 'ear' && (<>
        <p>Listen to a syllable and pick its tone. Five in a row earns a celebration! 🎉</p>
        <div className="anim-controls">
          <button type="button" className="btn btn-primary" onClick={newQuiz}>{quiz ? '▶️ Next sound' : '▶️ Start'}</button>
          {quiz && <button type="button" className="btn btn-ghost" onClick={() => play(quiz.ch, 'quiz')}>🔊 Again</button>}
          {quiz && <button type="button" className="btn btn-ghost" onClick={() => play(quiz.ch, 'quiz', { rate: 0.5 })}>🐢 Slowly</button>}
          <span className="muted">Score {tally.right}/{tally.total} · streak {tally.streak}</span>
        </div>
        {quiz && (
          <div className="tone-grid-cards">
            {TONES.map(t => (
              <button type="button" key={t.n} disabled={!!quiz.picked}
                className={'tone-card tone-c' + t.n + (quiz.picked ? (t.n === quiz.t ? ' right' : t.n === quiz.picked ? ' wrong' : '') : '')}
                onClick={() => answer(t.n)}>
                <div className="tone-card-head"><strong>{t.name}</strong> <span className="muted">{t.mark}</span></div>
                <Contour tones={[t.n]} playing={false} />
              </button>
            ))}
          </div>
        )}
        {quiz?.picked && (
          <p className={quiz.picked === quiz.t ? 'tone-good' : 'tone-try'}>
            {quiz.picked === quiz.t ? '✅ Yes! ' : '❌ Not quite. '}
            It was <span dangerouslySetInnerHTML={{ __html: ruby(quiz.ch, quiz.py) }} /> ({quiz.en}) — the {TONES[quiz.t - 1].name}, {TONES[quiz.t - 1].shape}.
          </p>
        )}
        {onPractice && <p><button type="button" className="btn btn-ghost" onClick={() => onPractice('chiH1TnLs')}>✏️ Practice skill: Listen — which tone is it?</button></p>}
      </>)}

      {tab === 'say' && (<>
        <p>Pick a tone, listen to the model, then press <strong>Say it</strong> and say the syllable. Your voice's pitch is drawn over the target shape.</p>
        <div className="anim-controls">
          {FAMILIES.map(([name], i) => (
            <button key={name} type="button" className={'btn ' + (fam === i ? 'btn-primary' : 'btn-ghost')} onClick={() => setFam(i)}>{name}</button>
          ))}
        </div>
        <div className="anim-controls">
          {TONES.map(t => (
            <button key={t.n} type="button" className={'btn ' + (sayTarget === t.n ? 'btn-primary' : 'btn-ghost')} onClick={() => setSayTarget(t.n)}>{FAMILIES[fam][1][t.n - 1][1]}</button>
          ))}
          <button type="button" className="btn btn-ghost" onClick={() => play(sayChar[0], 'model')}>🔊 Hear <span className="zh">{sayChar[0]}</span> ({sayChar[2]})</button>
        </div>
        <SayIt key={fam + '-' + sayTarget} target={sayTarget} onResult={ok => ok && toast?.('🎙️', 'Nice tone!')} />
      </>)}
    </div>
  );
}
