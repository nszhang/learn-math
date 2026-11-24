/* Shared chemistry helpers: a table of compounds as { element: count }, with formula text and totals,
   so atom-count and molar-mass questions can be generated instead of picked from a short list. */
export const MASS = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, S: 32, Cl: 35, Ca: 40, K: 39, Al: 27 };
const sub = n => (n === 1 ? '' : String(n).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join(''));
export const formulaText = c => Object.entries(c).map(([e, n]) => e + sub(n)).join('');
export const atomTotal = c => Object.values(c).reduce((a, n) => a + n, 0);
export const molarMass = c => Object.entries(c).reduce((a, [e, n]) => a + MASS[e] * n, 0);
export const massWork = c => Object.entries(c).map(([e, n]) => (n === 1 ? `${MASS[e]}` : `${n}(${MASS[e]})`)).join(' + ');
export const countWork = c => `${Object.entries(c).map(([e, n]) => e + sub(n)).join(' + ')} = ${Object.values(c).join(' + ')}`;
// compounds whose formulas are simple (no brackets); noCl omits chlorine for grades that are not given its mass
export const COMPOUNDS = [
  { H: 2, O: 1 }, { C: 1, O: 2 }, { C: 1, O: 1 }, { C: 1, H: 4 }, { N: 1, H: 3 }, { H: 2, S: 1 }, { H: 2, S: 1, O: 4 }, { Na: 1, O: 1, H: 1 },
  { Mg: 1, O: 1 }, { Ca: 1, C: 1, O: 3 }, { C: 2, H: 6 }, { C: 3, H: 8 }, { C: 6, H: 12, O: 6 }, { C: 2, H: 6, O: 1 }, { N: 2, O: 1 }, { N: 1, O: 2 },
  { S: 1, O: 2 }, { S: 1, O: 3 }, { Ca: 1, O: 1 }, { Na: 2, O: 1 }, { K: 1, O: 1, H: 1 }, { Al: 2, O: 3 }, { Na: 2, C: 1, O: 3 }, { Mg: 1, S: 1, O: 4 },
  { C: 2, H: 4 }, { C: 2, H: 2 }, { C: 4, H: 10 }, { H: 2, O: 2 }, { N: 2, H: 4 }, { Ca: 1, S: 1, O: 4 }, { Na: 2, S: 1, O: 4 }, { C: 5, H: 12 }, { C: 8, H: 18 }
];
export const COMPOUNDS_CL = [{ Na: 1, Cl: 1 }, { H: 1, Cl: 1 }, { Mg: 1, Cl: 2 }, { Ca: 1, Cl: 2 }, { K: 1, Cl: 1 }, { Al: 1, Cl: 3 }, { C: 1, H: 3, Cl: 1 }, { C: 1, Cl: 4 }];
