// Mandarin speech with the browser's built-in voices (Web Speech API).
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

const zhVoice = () => window.speechSynthesis.getVoices().find(v => /^zh(-|_)?(CN|Hans)?/i.test(v.lang))
  || window.speechSynthesis.getVoices().find(v => /^zh/i.test(v.lang));
const voiceFor = lang => (lang.startsWith('zh') ? zhVoice()
  : window.speechSynthesis.getVoices().find(v => v.lang.replace('_', '-').toLowerCase() === lang.toLowerCase())
    || window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())));
// voices load asynchronously in some browsers; touching the list early warms it up
if (canSpeak) { try { window.speechSynthesis.getVoices(); } catch { /* ignore */ } }

export const hasChineseVoice = () => { try { return canSpeak && !!zhVoice(); } catch { return false; } };

/** Speak text (Mandarin by default; pass lang: 'en-US' for English). rate 0.8 is a clear
    learner pace; 0.5 is "slowly". onEnd fires when done. */
export function speakChinese(text, { rate = 0.8, lang = 'zh-CN', onStart, onEnd } = {}) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = rate;
    const voice = voiceFor(lang);
    if (voice) u.voice = voice;
    if (onStart) u.onstart = onStart;
    if (onEnd) { u.onend = onEnd; u.onerror = onEnd; }
    window.speechSynthesis.speak(u);
  } catch { onEnd?.(); }
}

export const speak = (text, opts = {}) => speakChinese(text, opts);
