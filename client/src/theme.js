/* Light / dark theme. 'auto' follows the device; the choice is saved per browser.
   index.html applies the saved choice before first paint so the page never flashes. */
const KEY = 'mm_theme';
export const THEMES = ['auto', 'light', 'dark'];
export function getTheme() {
  try { const t = localStorage.getItem(KEY); return THEMES.includes(t) ? t : 'auto'; } catch { return 'auto'; }
}
export function setTheme(t) {
  try { if (t === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, t); } catch { /* private mode */ }
  if (t === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
}
