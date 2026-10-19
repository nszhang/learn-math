import { useEffect, useRef, useState } from 'react';
import { apiBlob } from '../api.js';

/* Emoji picker, picture helpers and picture display for the chat. */

export const EMOJI_GROUPS = [
  ['😀', 'Smileys', '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😛 😜 🤪 😎 🤓 🥳 🤩 😏 😌 😴 🤔 🤗 🤭 😮 😲 😳 🥺 😢 😭 😤 😡 🤯 😱 😬 🙄 😐'],
  ['👍', 'Hands', '👍 👎 👏 🙌 👋 ✌️ 🤞 🤝 💪 🙏 👌 ✋ ☝️ 👊 🤙 👀'],
  ['❤️', 'Hearts and symbols', '❤️ 🧡 💛 💚 💙 💜 🤍 💖 ✨ ⭐ 🌟 🔥 💯 ✅ ❌ ❓ ❗ 🎉 🎊 🏆 🥇 🎯 💡 🎁'],
  ['🐼', 'Animals', '🐶 🐱 🐼 🐨 🐯 🦁 🐸 🐵 🐧 🐦 🦄 🐝 🦋 🐢 🐬 🐳 🦖 🐙'],
  ['🍕', 'Food', '🍎 🍌 🍉 🍓 🍕 🍔 🍟 🌭 🍿 🍩 🍪 🎂 🍦 🍫 🥟 🍜 🍣 🧋'],
  ['⚽', 'Fun and school', '⚽ 🏀 🏈 ⚾ 🎾 🏐 🎮 🎲 🧩 🎨 🎵 🎸 📚 ✏️ 📝 🧮 🔬 🚀 🌈 ☀️ 🌙 ⛄']
].map(([icon, name, list]) => ({ icon, name, list: list.split(' ') }));

// A message of 1–3 emoji (and nothing else) is shown big.
const segments = s => (typeof Intl !== 'undefined' && Intl.Segmenter ? [...new Intl.Segmenter().segment(s)].length : [...s].length);
export const isBigEmoji = s => !!s && /^(?:\p{Extended_Pictographic}|\p{Emoji_Component}|‍|️|\s)+$/u.test(s) && /\p{Extended_Pictographic}/u.test(s) && segments(s.replace(/\s/g, '')) <= 3;

export function EmojiPicker({ onPick, onClose }) {
  const [group, setGroup] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const away = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const esc = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', away); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [onClose]);
  return (
    <div className="emoji-pop" ref={ref} role="dialog" aria-label="Pick an emoji">
      <div className="emoji-tabs" role="tablist">
        {EMOJI_GROUPS.map((g, i) => (
          <button key={g.name} type="button" role="tab" aria-selected={group === i} title={g.name} className={group === i ? 'on' : ''} onClick={() => setGroup(i)}>{g.icon}</button>
        ))}
      </div>
      <div className="emoji-grid">
        {EMOJI_GROUPS[group].list.map(e => <button key={e} type="button" onClick={() => onPick(e)} aria-label={e}>{e}</button>)}
      </div>
    </div>
  );
}

// The web server in front of the app accepts uploads up to 1 MB, so pictures are kept under this.
export const MAX_UPLOAD_BYTES = 900 * 1024;

/**
 * Shrink a picture before upload: at most 1280 px on the long side, re-saved as JPEG, and
 * stepped down in quality/size until it is under MAX_UPLOAD_BYTES.
 * Re-drawing it also drops hidden EXIF data such as the GPS location of a phone photo.
 */
export async function shrinkImage(file, maxSide = 1280) {
  if (!file.type.startsWith('image/')) throw new Error('Please choose a picture.');
  if (file.size > 25 * 1024 * 1024) throw new Error('That picture is too big.');
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => { const i = new Image(); i.onload = () => resolve(i); i.onerror = () => reject(new Error("That picture couldn't be opened.")); i.src = url; });
    const encode = async (side, quality) => {
      const scale = Math.min(1, side / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale)), h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); // transparent PNGs get a white background
      ctx.drawImage(img, 0, 0, w, h);
      return new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
    };
    for (const [side, quality] of [[maxSide, 0.82], [maxSide, 0.7], [1024, 0.7], [800, 0.65], [640, 0.6]]) {
      const blob = await encode(side, quality);
      if (!blob) break;
      if (blob.size <= MAX_UPLOAD_BYTES) return blob;
    }
    throw new Error("That picture couldn't be made small enough to send.");
  } finally { URL.revokeObjectURL(url); }
}

// pictures are protected, so they are fetched with the login token and shown from memory
const imageCache = new Map(); // id → object URL
export function ChatImage({ id, onOpen }) {
  const [src, setSrc] = useState(imageCache.get(id) || null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (src) return;
    let live = true;
    apiBlob(`/api/images/${id}`).then(b => { const u = URL.createObjectURL(b); imageCache.set(id, u); if (live) setSrc(u); }).catch(() => live && setFailed(true));
    return () => { live = false; };
  }, [id, src]);
  if (failed) return <div className="chat-img missing">📷 Picture unavailable</div>;
  if (!src) return <div className="chat-img loading" aria-label="Loading picture" />;
  return <button type="button" className="chat-img-btn" onClick={() => onOpen(src)} aria-label="Open picture"><img className="chat-img" src={src} alt="Picture in chat" /></button>;
}

export function Lightbox({ src, onClose }) {
  useEffect(() => { const esc = e => e.key === 'Escape' && onClose(); document.addEventListener('keydown', esc); return () => document.removeEventListener('keydown', esc); }, [onClose]);
  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Picture">
      <img src={src} alt="Picture in chat, full size" />
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
    </div>
  );
}
