/* ============================================================
   MathAce — Science catalog organised like IXL science:
   Grade → lettered Section → numbered Skill. Skill specs { k, t, s, g, gen }
   expand into one skill per grade (id "sci" + k + grade). Content lives in
   sci/physical.js, sci/life.js, sci/earth.js and sci/chemphys.js; the
   original skills (science.js, science612.js) are placed into sections here.
   ============================================================ */
import { SCIENCE_SKILLS as OLD_1_5 } from './science.js';
import { SCIENCE_6_12 as OLD_6_12 } from './science612.js';
import { PHYSICAL_SPECS } from './sci/physical.js';
import { LIFE_SPECS } from './sci/life.js';
import { EARTH_SPECS } from './sci/earth.js';
import { CHEMPHYS_SPECS } from './sci/chemphys.js';

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
  ['Units and measurement', '📏']
];
const SECTION_INFO = new Map(SECTIONS.map(([name, icon], i) => [name, { icon, order: i }]));

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
const placedOld = [...OLD_1_5, ...OLD_6_12].map(sk => {
  const sec = OLD_PLACEMENT[sk.id];
  const info = SECTION_INFO.get(sec);
  if (!info) throw new Error(`No section placement for ${sk.id}`);
  return { ...sk, section: sec, icon: info.icon, _order: info.order };
});

function expand(specs) {
  return specs.flatMap(spec => {
    const info = SECTION_INFO.get(spec.s);
    if (!info) throw new Error(`Unknown science section "${spec.s}" for ${spec.k}`);
    return spec.g.map(grade => ({ id: 'sci' + spec.k + grade, title: spec.t, grade, section: spec.s, icon: info.icon, _order: info.order, gen: spec.gen }));
  });
}

const all = [...placedOld, ...expand([...PHYSICAL_SPECS, ...LIFE_SPECS, ...EARTH_SPECS, ...CHEMPHYS_SPECS])];
const ids = new Set();
for (const sk of all) {
  if (ids.has(sk.id)) throw new Error(`Duplicate science skill id ${sk.id}`);
  ids.add(sk.id);
}
export const SCIENCE_ALL = all
  .map((sk, i) => ({ sk, i }))
  .sort((a, b) => a.sk.grade - b.sk.grade || a.sk._order - b.sk._order || a.i - b.i)
  .map(({ sk }) => { const { _order, ...rest } = sk; return rest; });
