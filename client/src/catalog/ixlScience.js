/* ============================================================
   LearnAce — Science catalog organised like IXL science:
   Grade → lettered Section → numbered Skill. Skill specs { k, t, s, g, gen }
   expand into one skill per grade (id "sci" + k + grade). Content lives in
   sci/physical.js, sci/life.js, sci/earth.js and sci/chemphys.js; the
   original skills (science.js, science612.js) are placed into sections here.
   Kindergarten – Grade 10 follow IXL Canada's lists exactly (sci/ixlSciLists.js):
   each IXL title is matched to the generator with the same title, and our own
   extra skills are kept alongside. Grades 11–12 are our own.
   ============================================================ */
import { SCIENCE_SKILLS as OLD_1_5 } from './science.js';
import { SCIENCE_6_12 as OLD_6_12 } from './science612.js';
import { PHYSICAL_SPECS } from './sci/physical.js';
import { LIFE_SPECS } from './sci/life.js';
import { EARTH_SPECS } from './sci/earth.js';
import { CHEMPHYS_SPECS } from './sci/chemphys.js';
import { SCI_K2_SPECS } from './sci/ixlSciK2.js';
import { SCI_35_SPECS } from './sci/ixlSci35.js';
import { SCI_68_SPECS } from './sci/ixlSci68.js';
import { SCI_910_SPECS } from './sci/ixlSci910.js';
import { IXL_SCIENCE } from './sci/ixlSciLists.js';
import { MORE_K2 } from './sci/moreK2.js';
import { MORE_K2B } from './sci/moreK2b.js';
import { MORE_35 } from './sci/more35.js';
import { MORE_68 } from './sci/more68.js';
import { MORE_910 } from './sci/more910.js';

// extra questions mix with a skill's own bank, so small banks no longer repeat
const SCI_MORE = { ...MORE_K2, ...MORE_K2B, ...MORE_35, ...MORE_68, ...MORE_910 };
export const SCI_MORE_KEYS = Object.keys(SCI_MORE);
const withMore = spec => { const more = SCI_MORE[spec.k]; return more ? () => (Math.random() < 0.3 ? spec.gen() : more() || spec.gen()) : spec.gen; };

// Section registry — order here is the order shown on every grade page.
const SECTIONS = [
  ['Science practices and tools', '🔬'], ['Designing experiments', '🧪'], ['Engineering practices', '🛠️'],
  ['Materials', '🧱'], ['States of matter', '🧊'], ['Properties of matter', '⚖️'], ['Heat and thermal energy', '🌡️'], ['Physical and chemical change', '🔥'],
  ['Particle motion and energy', '⚛️'], ['Atomic structure', '⚛️'], ['Chemical bonding', '🔗'], ['Nomenclature', '🏷️'], ['Chemical reactions', '💥'],
  ['The mole and stoichiometry', '🧮'], ['Solutions', '🧴'], ['Energy changes', '♨️'],
  ['Force and motion', '🛒'], ['Speed, distance and time', '🏃'], ['Motion in one dimension', '➡️'], ['Forces and laws of motion', '🍎'], ['Work, energy and power', '🏋️'],
  ['Energy', '⚡'], ['Magnets', '🧲'], ['Electricity and magnetism', '🔌'], ['Light and sound', '💡'], ['Waves', '🌊'],
  ['Classification', '🗂️'], ['Animals', '🐾'], ['Plants', '🌱'], ['Adaptations and natural selection', '🦎'], ['Cells', '🧫'], ['Cell growth and division', '🔀'],
  ['DNA and protein synthesis', '🧬'], ['Genetics', '🧬'], ['Anatomy and physiology', '🫀'], ['Photosynthesis', '🌿'], ['Ecosystems', '🦊'],
  ['Earth\'s resources', '🌎'], ['Rocks and minerals', '🪨'], ['Fossils', '🦴'], ['Earth events', '🌋'], ['Plate tectonics', '🗺️'], ['Water cycle', '💧'],
  ['Weather', '⛅'], ['Weather and climate', '🌦️'], ['The atmosphere', '🌤️'], ['Natural resources and human impacts', '♻️'], ['Astronomy', '🪐'],
  ['Units and measurement', '📏'],
  // further IXL section names
  ['Science practices', '🔬'], ['Science foundations', '🔬'], ['Laboratory equipment and safety', '🥽'], ['Shapes and colours', '🔷'], ['Comparing', '⚖️'],
  ['Heating and cooling', '🌡️'], ['Changes of state', '💧'], ['Mixtures', '🥗'], ['Phase change', '♨️'], ['Electricity and magnets', '🧲'],
  ['Physical and chemical changes', '🔥'], ['Light', '💡'], ['Electricity', '🔌'], ['Matter and mass', '⚖️'], ['Acceleration and forces', '🚀'],
  ['Atoms and elements', '⚛️'], ['Modeling matter', '🧩'], ['Thermal energy', '🔥'], ['Density', '🧊'], ['Atoms, elements and ions', '⚛️'],
  ['Energy transfer and energy transformation', '⚡'], ['Electrical circuits', '🔋'], ['Nuclear chemistry', '☢️'], ['Periodic trends', '📈'],
  ['Molecular structure', '🧪'], ['The mole and quantifying matter', '🧮'], ['Balancing chemical equations', '⚖️'], ['Stoichiometry', '🧮'],
  ['Thermochemistry', '♨️'], ['Rates of reactions', '⏱️'], ['Electromagnetic waves', '📡'], ['Optics', '🔍'], ['Magnetism', '🧲'],
  ['Traits', '🧒'], ['Adaptations', '🦎'], ['Traits and heredity', '🧬'], ['Body systems', '🫁'], ['Scientific names', '🏷️'], ['Plant reproduction', '🌸'],
  ['Ecological interactions', '🐝'], ['Classification and scientific names', '🗂️'], ['Biochemistry', '🧪'], ['The chemistry of life', '💧'],
  ['Multicellular organisms', '🫀'], ['Cell energy', '🔋'], ['DNA', '🧬'], ['Meiosis and sexual reproduction', '🔀'], ['Genes to traits', '🧬'],
  ['Evolution', '🦕'], ['Ecology', '🦊'], ['Biodiversity', '🐠'], ['Cell structure', '🧫'], ['Cellular transport', '🚪'], ['Protein synthesis', '🧬'],
  ['Patterns of inheritance', '🧬'], ['Human impacts', '🏭'], ["Earth's features", '🏔️'], ['Conservation and natural resources', '♻️'],
  ["Earth's systems", '🌍'], ['Rocks', '🪨'], ['Conservation', '🐢'], ["Earth's cycles", '🔄']
];
const SECTION_INFO = new Map(SECTIONS.map(([name, icon], i) => [name, { icon, order: i }]));
// IXL spells a few section names with different capitals ("States of Matter").
const CANON = new Map(SECTIONS.map(([name]) => [name.toLowerCase(), name]));
const canon = name => CANON.get(name.toLowerCase()) || name;

// Where the original science skills now live.
const OLD_PLACEMENT = {
  sciANI1: 'Classification', sciPLT1: 'Plants', sciSNS1: 'Animals', sciWTH1: 'Weather', sciHAB2: 'Ecosystems', sciMAT2: 'States of matter', sciLIF2: 'Animals', sciMAG2: 'Magnets',
  sciFCH3: 'Ecosystems', sciSOL3: 'Astronomy', sciFRC3: 'Force and motion', sciMCH3: 'Force and motion', sciENE4: 'Energy', sciCND4: 'Electricity and magnetism', sciWTR4: 'Water cycle', sciBDY4: 'Anatomy and physiology',
  sciCHG5: 'Physical and chemical change', sciCEL5: 'Cells', sciERT5: 'Plate tectonics', sciRCK5: 'Rocks and minerals',
  sciORG6: 'Cells', sciKNG6: 'Classification', sciPLT6: 'Plate tectonics', sciHTT6: 'Heat and thermal energy', sciVAR6: 'Designing experiments',
  sciECR7: 'Ecosystems', sciATM7: 'The atmosphere', sciATO7: 'Atomic structure', sciMIX7: 'Properties of matter', sciPUN7: 'Genetics',
  sciNWT8: 'Force and motion', sciSPD8: 'Speed, distance and time', sciPER8: 'Atomic structure', sciATC8: 'Chemical reactions', sciNAT8: 'Adaptations and natural selection',
  sciPHR9: 'Photosynthesis', sciDNA9: 'DNA and protein synthesis', sciMTS9: 'Cell growth and division', sciMMS9: 'The mole and stoichiometry', sciFMA9: 'Forces and laws of motion',
  sciBND10: 'Chemical bonding', sciPHS10: 'Solutions', sciRXN10: 'Chemical reactions', sciGAS10: 'Particle motion and energy', sciMOL10: 'The mole and stoichiometry',
  sciVEL11: 'Motion in one dimension', sciKEN11: 'Work, energy and power', sciOHM11: 'Electricity and magnetism', sciWVS11: 'Waves', sciEMG11: 'Electricity and magnetism',
  sciPNN12: 'Genetics', sciBIO12: 'Cells', sciENV12: 'Natural resources and human impacts', sciGHG12: 'The atmosphere', sciSTR12: 'Astronomy'
};
// The original skills become one-grade specs (key = id without "sci" and the grade), so their ids stay the same.
const oldSpecs = [...OLD_1_5, ...OLD_6_12].map(sk => {
  const s = OLD_PLACEMENT[sk.id];
  if (!SECTION_INFO.has(s)) throw new Error(`No section placement for ${sk.id}`);
  return { k: sk.id.replace(/^sci/, '').replace(/\d+$/, ''), t: sk.title, s, g: [sk.grade], gen: sk.gen, old: true };
});
const NEW_SPECS = [...SCI_K2_SPECS, ...SCI_35_SPECS, ...SCI_68_SPECS, ...SCI_910_SPECS];
const SPECS = [...oldSpecs, ...PHYSICAL_SPECS, ...LIFE_SPECS, ...EARTH_SPECS, ...CHEMPHYS_SPECS, ...NEW_SPECS];

const norm = t => t.toLowerCase().replace(/[^a-z0-9]/g, '');
const byTitle = new Map();
for (const spec of SPECS) if (!byTitle.has(norm(spec.t))) byTitle.set(norm(spec.t), spec);
// Skills written for IXL alignment are offered only at the grades where IXL lists them.
const IXL_ONLY = new Set(NEW_SPECS.map(s => s.k));

const all = [], ids = new Set(), unresolved = [];
const add = (spec, grade, section) => {
  const id = 'sci' + spec.k + grade;
  if (ids.has(id)) return;
  ids.add(id);
  const sec = canon(section), info = SECTION_INFO.get(sec);
  if (!info) throw new Error(`Unknown science section "${sec}" for ${spec.k}`);
  all.push({ id, title: spec.t, grade, section: sec, icon: info.icon, _order: info.order, _ixl: all.length, gen: withMore(spec) });
};
// 1) IXL's skills, in IXL's order
for (const [g, rows] of Object.entries(IXL_SCIENCE)) {
  for (const [section, title] of rows) {
    const spec = byTitle.get(norm(title));
    if (!spec) { unresolved.push(`${g}: ${title}`); continue; }
    add(spec, +g, section);
  }
}
const ixlCount = all.length;
// 2) our own skills at their own grades (titles IXL also lists at that grade were added above)
for (const spec of SPECS) {
  if (IXL_ONLY.has(spec.k)) continue;
  for (const g of spec.g) {
    const ixlTitles = IXL_SCIENCE[g];
    if (ixlTitles && byTitle.get(norm(spec.t)) === spec && ixlTitles.some(([, t]) => norm(t) === norm(spec.t))) continue;
    add(spec, g, spec.s);
  }
}
export const SCIENCE_UNRESOLVED = unresolved;

// IXL grades keep IXL's order; our extras follow within each section. Grades 11–12 use the registry order.
export const SCIENCE_ALL = all
  .map((sk, i) => ({ sk, i }))
  .sort((a, b) => a.sk.grade - b.sk.grade || (IXL_SCIENCE[a.sk.grade] ? 0 : a.sk._order - b.sk._order) || a.i - b.i)
  .map(({ sk }) => { const { _order, _ixl, ...rest } = sk; return rest; });
export const SCIENCE_IXL_COUNT = ixlCount;
