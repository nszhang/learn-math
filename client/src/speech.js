// Mandarin speech with the browser's built-in voices (Web Speech API).
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

const zhVoice = () => window.speechSynthesis.getVoices().find(v => /^zh(-|_)?(CN|Hans)?/i.test(v.lang))
  || window.speechSynthesis.getVoices().find(v => /^zh/i.test(v.lang));
// voices load asynchronously in some browsers; touching the list early warms it up
if (canSpeak) { try { window.speechSynthesis.getVoices(); } catch { /* ignore */ } }

export const hasChineseVoice = () => { try { return canSpeak && !!zhVoice(); } catch { return false; } };

/** Speak Chinese text. rate 0.8 is a clear learner pace; 0.5 is "slowly". onEnd fires when done. */
export function speakChinese(text, { rate = 0.8, onStart, onEnd } = {}) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN'; u.rate = rate;
    const voice = zhVoice();
    if (voice) u.voice = voice;
    if (onStart) u.onstart = onStart;
    if (onEnd) { u.onend = onEnd; u.onerror = onEnd; }
    window.speechSynthesis.speak(u);
  } catch { onEnd?.(); }
}
