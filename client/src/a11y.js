// Props that make a non-button element (card/row) keyboard-operable:
// focusable, announced as a button, activated by Enter or Space.
export function clickable(onActivate) {
  return {
    role: 'button',
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: e => {
      if (e.target !== e.currentTarget) return; // ignore keys from nested controls
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(e); }
    }
  };
}
