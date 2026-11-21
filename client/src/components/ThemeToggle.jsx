import { useState } from 'react';
import { THEMES, getTheme, setTheme } from '../theme.js';

const LOOK = { auto: ['🌓', 'Theme: automatic (follows your device)'], light: ['☀️', 'Theme: light'], dark: ['🌙', 'Theme: dark'] };

/* One button that cycles Automatic → Light → Dark. */
export default function ThemeToggle() {
  const [theme, set] = useState(getTheme);
  const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
  const [icon, label] = LOOK[theme];
  return (
    <button type="button" className="btn btn-ghost theme-toggle" title={`${label} — click for ${next}`} aria-label={`${label}. Switch to ${next}.`}
      onClick={() => { setTheme(next); set(next); }}>{icon}</button>
  );
}
