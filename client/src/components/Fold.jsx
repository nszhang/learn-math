import { useEffect, useState } from 'react';

// A <details> fold that only renders its contents once opened — the skill
// lists are large (thousands of skills), so closed folds stay cheap.
export default function Fold({ summary, open: initiallyOpen = false, className = 'fold', children }) {
  const [open, setOpen] = useState(initiallyOpen);
  useEffect(() => { if (initiallyOpen) setOpen(true); }, [initiallyOpen]);
  return (
    <details className={className} open={open} onToggle={e => setOpen(e.currentTarget.open)}>
      <summary>{summary}</summary>
      {open && children}
    </details>
  );
}
