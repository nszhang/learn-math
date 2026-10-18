// Spaced repetition for the Chinese word review deck (a Leitner box system).
// A correct review moves a word up a box and pushes it further out; a miss sends it back to box 0.

export const DAYS = [1, 1, 3, 7, 14, 30, 60]; // days until next review, by box
export const MAX_BOX = DAYS.length - 1;
export const KNOWN_BOX = 3; // remembered across at least a 3-day gap

export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

// Answer given in the review deck.
export function reviewed(row, correct, today) {
  const box = correct ? Math.min((row?.box ?? 0) + 1, MAX_BOX) : 0;
  return {
    box, due: addDays(today, DAYS[box]),
    reviews: (row?.reviews ?? 0) + 1,
    lapses: (row?.lapses ?? 0) + (correct ? 0 : 1)
  };
}

// Word met during ordinary practice: new words join the deck (due tomorrow);
// a miss on a known word sends it back for relearning; a correct answer leaves the schedule alone.
export function seen(row, correct, today) {
  if (!row) return { box: correct ? 1 : 0, due: addDays(today, 1), reviews: 0, lapses: 0 };
  if (correct) return null; // no change
  return { box: 0, due: addDays(today, 1), reviews: row.reviews, lapses: row.lapses + 1 };
}
