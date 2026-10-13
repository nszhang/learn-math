/* ============================================================
   Rule engine: attaches a generator to each manifest skill by matching
   its title. Rules are tried in order — put specific rules before general
   ones. A rule is R(regex, make, { grades?, section? }) where
   make(match, ctx) returns a gen() function.
   ============================================================ */
export const R = (re, make, opts = {}) => ({ re, make, ...opts });

export function findGen(rules, ctx) {
  for (const r of rules) {
    if (r.grades && !r.grades.includes(ctx.grade)) continue;
    if (r.section && !r.section.test(ctx.section)) continue;
    const mt = ctx.title.match(r.re);
    if (mt) {
      const gen = r.make(mt, ctx);
      if (gen) return gen;
    }
  }
  return null;
}
