// Math skills of each school grade, read from the client catalog (the same source the app
// shows), so grade awards follow whatever skills exist — no list to keep in sync.
// Returns null if the catalog can't be loaded; grade awards are then simply not granted.
let catalog;   // Promise<Map<grade, {ids: string[], sections: string[][]}> | null>

function load() {
  catalog ??= import('../../client/src/skills.js').then(({ GRADES }) => {
    const byGrade = new Map();
    for (const g of GRADES) {
      if (g.num > 12) continue;   // Calculus is its own course, not part of Grade 12
      byGrade.set(g.num, {
        ids: g.sections.flatMap(s => s.skills.map(k => k.id)),
        sections: g.sections.map(s => s.skills.map(k => k.id))
      });
    }
    return byGrade;
  }).catch(err => { console.error('Grade awards disabled — skill catalog not loadable:', err.message); return null; });
  return catalog;
}

/** { ids, sections } for a grade's math skills, or null (no grade, or catalog unavailable). */
export async function mathSkillsForGrade(grade) {
  if (grade === null || grade === undefined) return null;
  const map = await load();
  return map?.get(grade) ?? null;
}
