/* ============================================================
   In-app navigation on the browser history, so Back/Forward move
   between LearnAce pages instead of leaving the site.
   - A top-level view (App's page) starts a fresh history entry.
   - A sub-view (open grade, lesson, chat) adds its key to the
     current entry; a key missing from an entry means "initial".
   ============================================================ */
import { useCallback, useEffect, useRef, useState } from 'react';

const cur = () => window.history.state || {};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function useNavState(key, initial, { top = false } = {}) {
  const [value, setValue] = useState(() => (key in cur() ? cur()[key] : initial));
  const initialRef = useRef(initial);
  useEffect(() => {
    // record this view on the current entry so coming Back restores it
    if (!(key in cur())) window.history.replaceState({ ...cur(), [key]: value }, '');
    const onPop = e => { const s = e.state || {}; setValue(key in s ? s[key] : initialRef.current); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = useCallback((v, { replace = false } = {}) => {
    const s = cur();
    if (key in s && same(s[key], v)) return;   // already there — no duplicate entry
    const next = top ? { idx: (s.idx || 0) + (replace ? 0 : 1), [key]: v } : { ...s, [key]: v };
    if (replace) window.history.replaceState(next, '');
    else window.history.pushState(next, '');
    setValue(v);
  }, [key, top]);
  return [value, set];
}

/* true when Back stays inside the app (an earlier top-level entry exists) */
export const canGoBack = () => (cur().idx || 0) > 0;
