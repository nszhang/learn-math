/* ============================================================
   LearnAce — Science grades 6–12 (life, earth, chemistry, physics).
   IDs are prefixed "sci". Appended to the grade 1–5 list in skills.js.
   ============================================================ */
import { S, classify, pairs, ri, pick } from './quiz.js';

const b = w => `<strong>${w}</strong>`;
const em = w => `<em>${w}</em>`;
// Numeric-answer question (integer answers keep exact matching safe).
const num = (prompt, answer, explain) => ({ type: 'num', prompt, answer, explain });

export const SCIENCE_6_12 = [
  /* ================= GRADE 6 ================= */
  S('sciORG6', 'Cell organelles', 6, 'Life science', '🧫', pairs({
    prompt: q => q,
    items: [
      ['Which organelle is the “control center” that holds DNA?', 'Nucleus'],
      ['Which organelle releases energy from food (the “powerhouse”)?', 'Mitochondria'],
      ['Which organelle makes food by photosynthesis in plant cells?', 'Chloroplast'],
      ['Which structure surrounds the cell and controls what enters and leaves?', 'Cell membrane'],
      ['Which organelle builds proteins?', 'Ribosome'],
      ['Which stiff outer layer gives plant cells their shape?', 'Cell wall'],
      ['Which organelle stores water, food and waste?', 'Vacuole'],
      ['What is the jelly-like fluid that fills the cell?', 'Cytoplasm']
    ].map(([q, a]) => [q, a, `${b(a)} does this job.`])
  })),
  S('sciKNG6', 'Kingdoms of life', 6, 'Life science', '🌳', classify({
    categories: ['Animal', 'Plant', 'Fungus', 'Bacteria'],
    prompt: o => `Which kingdom does ${b(o)} belong to?`,
    items: [
      ['a mushroom', 'Fungus', 'Fungi absorb nutrients from their surroundings and are not plants.'],
      ['an oak tree', 'Plant', 'Plants make food by photosynthesis.'],
      ['a jellyfish', 'Animal', 'Animals consume other organisms for food.'],
      ['E. coli', 'Bacteria', 'Bacteria are single-celled organisms with no nucleus.'],
      ['yeast', 'Fungus', 'Yeast is a single-celled fungus.'],
      ['a fern', 'Plant', 'Ferns are plants.'],
      ['a spider', 'Animal', 'Spiders are animals (arthropods).'],
      ['Lactobacillus in yogurt', 'Bacteria', 'Lactobacillus is a bacterium.'],
      ['bread mold', 'Fungus', 'Mold is a fungus.'],
      ['a sponge', 'Animal', 'Sponges are simple animals.']
    ]
  })),
  S('sciPLT6', 'Plate boundaries', 6, 'Earth science', '🌋', classify({
    categories: ['Convergent (collide)', 'Divergent (move apart)', 'Transform (slide past)'],
    prompt: s => `Which type of plate boundary is described?<br>${em(s)}`,
    items: [
      ['Two plates push toward each other, forming mountains like the Himalayas.', 'Convergent (collide)', 'Colliding plates crumple crust into mountains.'],
      ['Two plates pull apart, and new crust forms at a mid-ocean ridge.', 'Divergent (move apart)', 'Plates moving apart create new crust.'],
      ['Two plates grind sideways past each other, as at the San Andreas Fault.', 'Transform (slide past)', 'Plates sliding past each other cause earthquakes.'],
      ['One plate sinks beneath another, forming a deep ocean trench.', 'Convergent (collide)', 'Subduction occurs at convergent boundaries.'],
      ['A rift valley forms as the land stretches and splits, like the East African Rift.', 'Divergent (move apart)', 'Stretching and splitting is divergent.'],
      ['Plates slip past each other without creating or destroying crust.', 'Transform (slide past)', 'Neither creating nor destroying crust marks a transform boundary.']
    ]
  })),
  S('sciHTT6', 'Heat transfer', 6, 'Physical science', '🌡️', classify({
    categories: ['Conduction', 'Convection', 'Radiation'],
    prompt: s => `Which type of heat transfer is this?<br>${em(s)}`,
    items: [
      ['A metal spoon gets hot in a pot of soup.', 'Conduction', 'Heat moves by direct contact.'],
      ['Warm air rises from a heater and circulates around the room.', 'Convection', 'Heat moves as a fluid (air/liquid) circulates.'],
      ['You feel warmth from the Sun.', 'Radiation', 'Heat travels as waves, even through empty space.'],
      ['Your hand gets warm touching a mug of tea.', 'Conduction', 'Heat moves by direct contact.'],
      ['Boiling water bubbles up and sinks as it circulates in a pot.', 'Convection', 'Heat moves as a fluid circulates.'],
      ['You feel heat from a campfire on your face from a few steps away.', 'Radiation', 'Heat travels as waves through the air.'],
      ['A frying pan handle becomes hot.', 'Conduction', 'Heat moves through the metal by contact.'],
      ['Sea breezes form as warm air rises over land.', 'Convection', 'Warm air rises and cooler air moves in.']
    ]
  })),
  S('sciVAR6', 'Variables in experiments', 6, 'Scientific method', '🧪', classify({
    categories: ['Independent variable', 'Dependent variable', 'Controlled variable'],
    prompt: s => `${s}`,
    items: [
      ['A student tests how sunlight affects plant growth. The amount of sunlight is the …', 'Independent variable', 'It is what the scientist changes on purpose.'],
      ['A student tests how sunlight affects plant growth. The height of the plant is the …', 'Dependent variable', 'It is what is measured as a result.'],
      ['A student tests how sunlight affects plant growth. The type of soil used for all plants is a …', 'Controlled variable', 'It is kept the same in every trial.'],
      ['A student tests how temperature affects how fast sugar dissolves. The water temperature is the …', 'Independent variable', 'It is what the scientist changes.'],
      ['A student tests how temperature affects how fast sugar dissolves. The time to dissolve is the …', 'Dependent variable', 'It is what is measured.'],
      ['A student tests how temperature affects how fast sugar dissolves. The amount of sugar in every cup is a …', 'Controlled variable', 'It is kept the same.'],
      ['A student tests how ramp height affects how far a car rolls. The height of the ramp is the …', 'Independent variable', 'It is what the scientist changes.'],
      ['A student tests how ramp height affects how far a car rolls. The distance rolled is the …', 'Dependent variable', 'It is what is measured.']
    ]
  })),

  /* ================= GRADE 7 ================= */
  S('sciECR7', 'Ecosystem relationships', 7, 'Life science', '🐝', classify({
    categories: ['Mutualism', 'Commensalism', 'Parasitism', 'Predation'],
    prompt: s => `Which relationship is shown?<br>${em(s)}`,
    items: [
      ['Bees get nectar from flowers while pollinating them.', 'Mutualism', 'Both organisms benefit.'],
      ['A barnacle rides on a whale, which is not harmed or helped.', 'Commensalism', 'One benefits; the other is unaffected.'],
      ['A tick feeds on a dog\'s blood.', 'Parasitism', 'One benefits at the other\'s expense, usually without killing it quickly.'],
      ['A lion hunts and eats a zebra.', 'Predation', 'One organism kills and eats another.'],
      ['Clownfish live safely in anemones while keeping them clean.', 'Mutualism', 'Both benefit.'],
      ['A bird builds a nest in a tree without affecting the tree.', 'Commensalism', 'One benefits; the other is unaffected.'],
      ['A tapeworm lives in a person\'s intestines and takes nutrients.', 'Parasitism', 'One benefits while harming the host.'],
      ['An owl catches a mouse.', 'Predation', 'One organism kills and eats another.']
    ]
  })),
  S('sciATM7', 'Layers of the atmosphere', 7, 'Earth science', '🌤️', pairs({
    prompt: q => q,
    items: [
      ['Which layer of the atmosphere is closest to Earth and contains our weather?', 'Troposphere', 'Weather happens in the troposphere.', ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere']],
      ['Which layer contains the ozone layer?', 'Stratosphere', 'The ozone layer sits in the stratosphere.', ['Stratosphere', 'Troposphere', 'Mesosphere', 'Thermosphere']],
      ['In which layer do most meteors burn up?', 'Mesosphere', 'Meteors burn up from friction in the mesosphere.', ['Mesosphere', 'Troposphere', 'Stratosphere', 'Exosphere']],
      ['Which layer is where auroras form and the International Space Station orbits?', 'Thermosphere', 'Auroras and the ISS are in the thermosphere.', ['Thermosphere', 'Troposphere', 'Stratosphere', 'Mesosphere']],
      ['Which is the outermost layer, fading into space?', 'Exosphere', 'The exosphere is the outermost layer.', ['Exosphere', 'Troposphere', 'Stratosphere', 'Mesosphere']],
      ['Which gas makes up most of Earth\'s atmosphere?', 'Nitrogen', 'About 78% of air is nitrogen.', ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Argon']],
      ['Which gas makes up about 21% of Earth\'s atmosphere?', 'Oxygen', 'About 21% of air is oxygen.', ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Argon']]
    ]
  })),
  S('sciATO7', 'Parts of an atom', 7, 'Physical science', '⚛️', pairs({
    prompt: q => q,
    items: [
      ['Which particle has a positive charge?', 'Proton', 'Protons are positive.', ['Proton', 'Electron', 'Neutron', 'Photon']],
      ['Which particle has a negative charge?', 'Electron', 'Electrons are negative.', ['Electron', 'Proton', 'Neutron', 'Photon']],
      ['Which particle has no charge?', 'Neutron', 'Neutrons are neutral.', ['Neutron', 'Proton', 'Electron', 'Ion']],
      ['Where are protons and neutrons found?', 'In the nucleus', 'The nucleus holds the protons and neutrons.', ['In the nucleus', 'In the electron cloud', 'Outside the atom', 'In the bonds']],
      ['Where do electrons move?', 'Around the nucleus', 'Electrons move in a cloud around the nucleus.', ['Around the nucleus', 'Inside the nucleus', 'Only in metals', 'Between protons']],
      ['The atomic number of an element equals its number of …', 'protons', 'Atomic number = number of protons.', ['protons', 'neutrons', 'electrons only', 'isotopes']],
      ['Which particles have almost no mass compared to the others?', 'Electrons', 'An electron is about 1/1800 the mass of a proton.', ['Electrons', 'Protons', 'Neutrons', 'Nuclei']]
    ]
  })),
  S('sciMIX7', 'Elements, compounds and mixtures', 7, 'Physical science', '🧂', classify({
    categories: ['Element', 'Compound', 'Mixture'],
    prompt: s => `Is ${b(s)} an element, a compound or a mixture?`,
    items: [
      ['gold', 'Element', 'Gold (Au) is a single type of atom.'],
      ['water (H₂O)', 'Compound', 'Two elements chemically bonded.'],
      ['salad', 'Mixture', 'Parts are physically mixed and can be separated.'],
      ['oxygen gas (O₂)', 'Element', 'Only oxygen atoms.'],
      ['table salt (NaCl)', 'Compound', 'Sodium and chlorine chemically bonded.'],
      ['air', 'Mixture', 'A mix of nitrogen, oxygen and other gases.'],
      ['carbon dioxide (CO₂)', 'Compound', 'Carbon and oxygen chemically bonded.'],
      ['saltwater', 'Mixture', 'Salt mixed into water — not chemically bonded.'],
      ['iron', 'Element', 'Iron (Fe) is a single type of atom.'],
      ['sugar (C₁₂H₂₂O₁₁)', 'Compound', 'Carbon, hydrogen and oxygen chemically bonded.']
    ]
  })),
  S('sciPUN7', 'Punnett squares: dominant and recessive', 7, 'Life science', '🧬', pairs({
    prompt: q => q,
    items: [
      ['In pea plants, tall (T) is dominant over short (t). What is the phenotype of a plant with genotype Tt?', 'Tall', 'One dominant allele is enough to show the dominant trait.', ['Tall', 'Short', 'Medium', 'Cannot tell']],
      ['What is the genotype of a short pea plant (t is recessive)?', 'tt', 'A recessive trait shows only when both alleles are recessive.', ['tt', 'Tt', 'TT', 'T']],
      ['Cross Tt × Tt. What fraction of offspring are expected to be short (tt)?', '1/4', 'The square gives TT, Tt, Tt, tt — one in four is tt.', ['1/4', '1/2', '3/4', '0']],
      ['Cross Tt × Tt. What fraction are expected to show the dominant trait?', '3/4', 'TT, Tt and Tt show the dominant trait — three out of four.', ['3/4', '1/4', '1/2', '1']],
      ['Cross TT × tt. What fraction of offspring are Tt?', 'All (1)', 'Every offspring gets one T and one t.', ['All (1)', '1/2', '1/4', '0']],
      ['Which genotype is “homozygous dominant”?', 'TT', 'Homozygous means two identical alleles; dominant means T.', ['TT', 'Tt', 'tt', 'tT']],
      ['Cross Tt × tt. What fraction of offspring are expected to be tt?', '1/2', 'The square gives Tt, Tt, tt, tt — half are tt.', ['1/2', '1/4', '3/4', '0']]
    ]
  })),

  /* ================= GRADE 8 ================= */
  S('sciNWT8', 'Newton\'s laws of motion', 8, 'Physical science', '🍎', classify({
    categories: ['First law (inertia)', 'Second law (F = ma)', 'Third law (action–reaction)'],
    prompt: s => `Which of Newton's laws explains this?<br>${em(s)}`,
    items: [
      ['Passengers lurch forward when a bus brakes suddenly.', 'First law (inertia)', 'Objects keep moving unless a force acts on them.'],
      ['A heavy cart is harder to accelerate than a light cart with the same push.', 'Second law (F = ma)', 'More mass means less acceleration for the same force.'],
      ['A rocket moves up as it pushes gas down.', 'Third law (action–reaction)', 'Every action has an equal and opposite reaction.'],
      ['A ball keeps rolling until friction slows it.', 'First law (inertia)', 'An object in motion stays in motion unless a force acts.'],
      ['Pushing a wall makes you slide backwards on roller skates.', 'Third law (action–reaction)', 'The wall pushes back on you.'],
      ['Doubling the force on an object doubles its acceleration.', 'Second law (F = ma)', 'Acceleration is proportional to force.'],
      ['A book on a table stays at rest.', 'First law (inertia)', 'An object at rest stays at rest unless acted on by an unbalanced force.']
    ]
  })),
  S('sciSPD8', 'Speed, distance and time', 8, 'Physical science', '🏃', () => {
    const v = ri(2, 20), t = ri(2, 12), d = v * t;
    const kind = pick(['v', 'd', 't']);
    if (kind === 'v') return num(`A runner covers <strong>${d} m</strong> in <strong>${t} s</strong>. What is the speed in m/s?`, v, `speed = distance ÷ time = ${d} ÷ ${t} = <strong>${v} m/s</strong>.`);
    if (kind === 'd') return num(`A cyclist travels at <strong>${v} m/s</strong> for <strong>${t} s</strong>. How far does the cyclist go (in metres)?`, d, `distance = speed × time = ${v} × ${t} = <strong>${d} m</strong>.`);
    return num(`A car travels <strong>${d} m</strong> at <strong>${v} m/s</strong>. How many seconds does it take?`, t, `time = distance ÷ speed = ${d} ÷ ${v} = <strong>${t} s</strong>.`);
  }),
  S('sciPER8', 'Periodic table groups', 8, 'Physical science', '🧱', classify({
    categories: ['Alkali metal', 'Alkaline earth metal', 'Halogen', 'Noble gas', 'Transition metal'],
    prompt: e => `Which group is ${b(e)} in?`,
    items: [
      ['sodium (Na)', 'Alkali metal', 'Group 1 elements are soft, very reactive alkali metals.'],
      ['helium (He)', 'Noble gas', 'Group 18 elements are unreactive noble gases.'],
      ['chlorine (Cl)', 'Halogen', 'Group 17 elements are reactive halogens.'],
      ['calcium (Ca)', 'Alkaline earth metal', 'Group 2 elements are alkaline earth metals.'],
      ['iron (Fe)', 'Transition metal', 'Iron is in the central block of transition metals.'],
      ['potassium (K)', 'Alkali metal', 'Group 1 elements are alkali metals.'],
      ['neon (Ne)', 'Noble gas', 'Group 18 elements are noble gases.'],
      ['fluorine (F)', 'Halogen', 'Group 17 elements are halogens.'],
      ['magnesium (Mg)', 'Alkaline earth metal', 'Group 2 elements are alkaline earth metals.'],
      ['copper (Cu)', 'Transition metal', 'Copper is a transition metal.']
    ]
  })),
  S('sciATC8', 'Count atoms in a formula', 8, 'Physical science', '🔢', () => {
    const f = pick([
      ['H₂O', 3, 'H₂ + O = 2 + 1'], ['CO₂', 3, 'C + O₂ = 1 + 2'], ['NaCl', 2, 'Na + Cl = 1 + 1'],
      ['CH₄', 5, 'C + H₄ = 1 + 4'], ['H₂SO₄', 7, 'H₂ + S + O₄ = 2 + 1 + 4'], ['C₆H₁₂O₆', 24, 'C₆ + H₁₂ + O₆ = 6 + 12 + 6'],
      ['NH₃', 4, 'N + H₃ = 1 + 3'], ['CaCO₃', 5, 'Ca + C + O₃ = 1 + 1 + 3'], ['Mg(OH)₂', 5, 'Mg + O₂ + H₂ = 1 + 2 + 2'], ['C₂H₆', 8, 'C₂ + H₆ = 2 + 6']
    ]);
    return num(`How many atoms are in one molecule (or formula unit) of ${b(f[0])}?`, f[1], `${f[2]} = <strong>${f[1]}</strong> atoms.`);
  }),
  S('sciNAT8', 'Natural selection', 8, 'Life science', '🦎', pairs({
    prompt: q => q,
    items: [
      ['What is the process by which organisms with helpful traits survive and reproduce more?', 'Natural selection'],
      ['Who proposed the theory of evolution by natural selection?', 'Charles Darwin'],
      ['What is a trait that helps an organism survive in its environment called?', 'An adaptation'],
      ['Which is passed from parents to offspring?', 'Genes'],
      ['Fossils show that organisms have changed over time. This is evidence for …', 'Evolution'],
      ['Moths with darker wings survive better on sooty trees. Over time, dark moths become …', 'More common'],
      ['Which is required for natural selection to occur?', 'Variation in traits']
    ].map(([q, a]) => [q, a, `The answer is ${b(a)}.`, ['Natural selection', 'Charles Darwin', 'An adaptation', 'Genes', 'Evolution', 'More common', 'Variation in traits', 'Photosynthesis', 'Gregor Mendel', 'Mutation only']])
  })),

  /* ================= GRADE 9 ================= */
  S('sciPHR9', 'Photosynthesis and respiration', 9, 'Biology', '🌿', classify({
    categories: ['Photosynthesis', 'Cellular respiration', 'Both'],
    prompt: s => `${s}`,
    items: [
      ['Which process takes in carbon dioxide and water to make glucose?', 'Photosynthesis', 'Plants build glucose from CO₂ and water using light.'],
      ['Which process uses glucose and oxygen to release energy (ATP)?', 'Cellular respiration', 'Cells burn glucose with oxygen to make ATP.'],
      ['Which process releases oxygen as a product?', 'Photosynthesis', 'Oxygen is released when water is split.'],
      ['Which process releases carbon dioxide as a product?', 'Cellular respiration', 'CO₂ is a waste product of respiration.'],
      ['Which process occurs in chloroplasts?', 'Photosynthesis', 'Chloroplasts hold the chlorophyll.'],
      ['Which process occurs in mitochondria?', 'Cellular respiration', 'Mitochondria are the sites of most ATP production.'],
      ['Which process occurs in plant cells?', 'Both', 'Plants photosynthesize and also respire.'],
      ['Which process requires light energy?', 'Photosynthesis', 'Light drives the reactions of photosynthesis.']
    ]
  })),
  S('sciDNA9', 'DNA and protein synthesis', 9, 'Biology', '🧬', pairs({
    prompt: q => q,
    items: [
      ['Which base pairs with adenine (A) in DNA?', 'Thymine (T)'],
      ['Which base pairs with guanine (G) in DNA?', 'Cytosine (C)'],
      ['Which base replaces thymine in RNA?', 'Uracil (U)'],
      ['What is the shape of the DNA molecule?', 'Double helix'],
      ['What is the process of copying DNA into mRNA called?', 'Transcription'],
      ['What is the process of building a protein from mRNA called?', 'Translation'],
      ['A group of three bases that codes for one amino acid is a …', 'Codon'],
      ['Which sugar is found in DNA?', 'Deoxyribose']
    ].map(([q, a]) => [q, a, `The answer is ${b(a)}.`, ['Thymine (T)', 'Cytosine (C)', 'Uracil (U)', 'Double helix', 'Transcription', 'Translation', 'Codon', 'Deoxyribose', 'Adenine (A)', 'Ribose']])
  })),
  S('sciMTS9', 'Mitosis and meiosis', 9, 'Biology', '🔀', classify({
    categories: ['Mitosis', 'Meiosis'],
    prompt: s => `${s}`,
    items: [
      ['Which process produces two identical daughter cells?', 'Mitosis', 'Mitosis makes genetically identical copies.'],
      ['Which process produces four cells with half the chromosomes?', 'Meiosis', 'Meiosis makes four haploid cells.'],
      ['Which process is used for growth and repair?', 'Mitosis', 'Body cells divide by mitosis.'],
      ['Which process produces gametes (sperm and egg)?', 'Meiosis', 'Gametes are made by meiosis.'],
      ['In which process does crossing over occur?', 'Meiosis', 'Crossing over mixes genes in meiosis I.'],
      ['Which process has one round of cell division?', 'Mitosis', 'Meiosis has two rounds.'],
      ['Which process creates genetic variation?', 'Meiosis', 'Crossing over and independent assortment create variety.']
    ]
  })),
  S('sciMMS9', 'Molar mass', 9, 'Chemistry', '⚖️', () => {
    const f = pick([
      ['H₂O', 18, '2(1) + 16'], ['CO₂', 44, '12 + 2(16)'], ['CH₄', 16, '12 + 4(1)'], ['NH₃', 17, '14 + 3(1)'],
      ['O₂', 32, '2(16)'], ['N₂', 28, '2(14)'], ['CaCO₃', 100, '40 + 12 + 3(16)'], ['NaOH', 40, '23 + 16 + 1'],
      ['H₂SO₄', 98, '2(1) + 32 + 4(16)'], ['MgO', 40, '24 + 16'], ['Ca(OH)₂', 74, '40 + 2(16 + 1)']
    ]);
    return num(`Using H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Ca = 40, what is the molar mass of ${b(f[0])} (g/mol)?`, f[1], `${f[2]} = <strong>${f[1]} g/mol</strong>.`);
  }),
  S('sciFMA9', 'Force, mass and acceleration', 9, 'Physics', '🚀', () => {
    const m = ri(2, 20), a = ri(2, 15), F = m * a;
    const kind = pick(['F', 'a', 'm']);
    if (kind === 'F') return num(`A <strong>${m} kg</strong> object accelerates at <strong>${a} m/s²</strong>. What net force acts on it (in newtons)?`, F, `F = m × a = ${m} × ${a} = <strong>${F} N</strong>.`);
    if (kind === 'a') return num(`A net force of <strong>${F} N</strong> acts on a <strong>${m} kg</strong> object. What is its acceleration (m/s²)?`, a, `a = F ÷ m = ${F} ÷ ${m} = <strong>${a} m/s²</strong>.`);
    return num(`A net force of <strong>${F} N</strong> gives an object an acceleration of <strong>${a} m/s²</strong>. What is its mass (kg)?`, m, `m = F ÷ a = ${F} ÷ ${a} = <strong>${m} kg</strong>.`);
  }),

  /* ================= GRADE 10 ================= */
  S('sciBND10', 'Ionic and covalent bonds', 10, 'Chemistry', '🔗', classify({
    categories: ['Ionic', 'Covalent'],
    prompt: c => `What type of bonding holds ${b(c)} together?`,
    items: [
      ['NaCl (table salt)', 'Ionic', 'A metal and a nonmetal transfer electrons.'],
      ['H₂O (water)', 'Covalent', 'Two nonmetals share electrons.'],
      ['CO₂', 'Covalent', 'Two nonmetals share electrons.'],
      ['MgO', 'Ionic', 'A metal and a nonmetal transfer electrons.'],
      ['CH₄ (methane)', 'Covalent', 'Two nonmetals share electrons.'],
      ['CaCl₂', 'Ionic', 'A metal and a nonmetal transfer electrons.'],
      ['O₂', 'Covalent', 'Atoms of the same nonmetal share electrons.'],
      ['KBr', 'Ionic', 'A metal and a nonmetal transfer electrons.'],
      ['NH₃', 'Covalent', 'Two nonmetals share electrons.']
    ]
  })),
  S('sciPHS10', 'Acids, bases and pH', 10, 'Chemistry', '🧪', classify({
    categories: ['Acidic', 'Neutral', 'Basic'],
    prompt: s => `A solution has ${s}. Is it acidic, neutral or basic?`,
    items: [
      ['pH 2', 'Acidic', 'pH below 7 is acidic.'], ['pH 7', 'Neutral', 'pH 7 is neutral (pure water).'],
      ['pH 12', 'Basic', 'pH above 7 is basic.'], ['pH 5', 'Acidic', 'pH below 7 is acidic.'],
      ['pH 9', 'Basic', 'pH above 7 is basic.'], ['pH 1', 'Acidic', 'pH below 7 is acidic.'],
      ['pH 14', 'Basic', 'pH above 7 is basic.'], ['pH 6.5', 'Acidic', 'pH below 7 is (slightly) acidic.'],
      ['pH 7.0 (pure water)', 'Neutral', 'pH 7 is neutral.'], ['pH 8.5', 'Basic', 'pH above 7 is (slightly) basic.']
    ]
  })),
  S('sciRXN10', 'Types of chemical reactions', 10, 'Chemistry', '💥', classify({
    categories: ['Synthesis', 'Decomposition', 'Single replacement', 'Double replacement', 'Combustion'],
    prompt: s => `What type of reaction is this?<br>${s}`,
    items: [
      ['2H₂ + O₂ → 2H₂O', 'Synthesis', 'Two substances combine into one.'],
      ['2H₂O → 2H₂ + O₂', 'Decomposition', 'One substance breaks into simpler ones.'],
      ['Zn + 2HCl → ZnCl₂ + H₂', 'Single replacement', 'One element replaces another in a compound.'],
      ['AgNO₃ + NaCl → AgCl + NaNO₃', 'Double replacement', 'The positive ions swap partners.'],
      ['CH₄ + 2O₂ → CO₂ + 2H₂O', 'Combustion', 'A fuel burns in oxygen, giving CO₂ and H₂O.'],
      ['N₂ + 3H₂ → 2NH₃', 'Synthesis', 'Two substances combine into one.'],
      ['2KClO₃ → 2KCl + 3O₂', 'Decomposition', 'One substance breaks into simpler ones.'],
      ['Fe + CuSO₄ → FeSO₄ + Cu', 'Single replacement', 'Iron replaces copper in the compound.'],
      ['C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', 'Combustion', 'A hydrocarbon burns in oxygen.']
    ]
  })),
  S('sciGAS10', 'Gas laws', 10, 'Chemistry', '🎈', pairs({
    prompt: q => q,
    items: [
      ['At constant temperature, if the pressure on a gas increases, its volume …', 'decreases', 'Boyle\'s law: pressure and volume are inversely related.', ['decreases', 'increases', 'stays the same', 'doubles']],
      ['At constant pressure, if a gas is heated, its volume …', 'increases', 'Charles\'s law: volume rises with temperature.', ['increases', 'decreases', 'stays the same', 'halves']],
      ['At constant volume, if a gas is heated, its pressure …', 'increases', 'Gay-Lussac\'s law: pressure rises with temperature.', ['increases', 'decreases', 'stays the same', 'halves']],
      ['Which law relates pressure and volume at constant temperature?', 'Boyle\'s law', 'P₁V₁ = P₂V₂.', ['Boyle\'s law', 'Charles\'s law', 'Gay-Lussac\'s law', 'Avogadro\'s law']],
      ['Which law relates volume and temperature at constant pressure?', 'Charles\'s law', 'V₁/T₁ = V₂/T₂.', ['Charles\'s law', 'Boyle\'s law', 'Gay-Lussac\'s law', 'Avogadro\'s law']],
      ['Equal volumes of gases at the same temperature and pressure contain equal numbers of molecules. This is …', 'Avogadro\'s law', 'Avogadro\'s law links volume and amount of gas.', ['Avogadro\'s law', 'Boyle\'s law', 'Charles\'s law', 'Dalton\'s law']]
    ]
  })),
  S('sciMOL10', 'Moles and mass', 10, 'Chemistry', '🧮', () => {
    const f = pick([['H₂O', 18], ['CO₂', 44], ['NaOH', 40], ['CaCO₃', 100], ['O₂', 32], ['H₂SO₄', 98], ['NH₃', 17], ['CH₄', 16]]);
    const n = ri(2, 6), g = f[1] * n;
    return num(`How many moles are in <strong>${g} g</strong> of ${b(f[0])}? (Molar mass = ${f[1]} g/mol)`, n, `moles = mass ÷ molar mass = ${g} ÷ ${f[1]} = <strong>${n} mol</strong>.`);
  }),

  /* ================= GRADE 11 ================= */
  S('sciVEL11', 'Velocity, acceleration and time', 11, 'Physics', '🚗', () => {
    const u = ri(0, 10), a = ri(2, 9), t = ri(2, 10), v = u + a * t;
    const kind = pick(['v', 'a']);
    if (kind === 'v') return num(`A car with initial speed <strong>${u} m/s</strong> accelerates at <strong>${a} m/s²</strong> for <strong>${t} s</strong>. What is its final speed (m/s)?`, v, `v = u + at = ${u} + ${a}×${t} = <strong>${v} m/s</strong>.`);
    return num(`A cyclist speeds up from <strong>${u} m/s</strong> to <strong>${v} m/s</strong> in <strong>${t} s</strong>. What is the acceleration (m/s²)?`, a, `a = (v − u) ÷ t = (${v} − ${u}) ÷ ${t} = <strong>${a} m/s²</strong>.`);
  }),
  S('sciKEN11', 'Kinetic and potential energy', 11, 'Physics', '⚡', () => {
    if (Math.random() < 0.5) {
      const m = 2 * ri(1, 10), v = ri(2, 10), ke = 0.5 * m * v * v;
      return num(`What is the kinetic energy (J) of a <strong>${m} kg</strong> object moving at <strong>${v} m/s</strong>?`, ke, `KE = ½mv² = ½ × ${m} × ${v}² = <strong>${ke} J</strong>.`);
    }
    const m = ri(1, 10), h = ri(2, 20), pe = m * 10 * h;
    return num(`What is the gravitational potential energy (J) of a <strong>${m} kg</strong> object <strong>${h} m</strong> above the ground? (Use g = 10 m/s²)`, pe, `PE = mgh = ${m} × 10 × ${h} = <strong>${pe} J</strong>.`);
  }),
  S('sciOHM11', 'Ohm\'s law', 11, 'Physics', '🔌', () => {
    const I = ri(1, 9), R = ri(2, 20), V = I * R;
    const kind = pick(['V', 'I', 'R']);
    if (kind === 'V') return num(`A current of <strong>${I} A</strong> flows through a <strong>${R} Ω</strong> resistor. What is the voltage (V)?`, V, `V = IR = ${I} × ${R} = <strong>${V} V</strong>.`);
    if (kind === 'I') return num(`A <strong>${V} V</strong> battery is connected to a <strong>${R} Ω</strong> resistor. What is the current (A)?`, I, `I = V ÷ R = ${V} ÷ ${R} = <strong>${I} A</strong>.`);
    return num(`A <strong>${V} V</strong> battery drives a current of <strong>${I} A</strong>. What is the resistance (Ω)?`, R, `R = V ÷ I = ${V} ÷ ${I} = <strong>${R} Ω</strong>.`);
  }),
  S('sciWVS11', 'Wave speed', 11, 'Physics', '🌊', () => {
    const f = ri(2, 20), l = ri(2, 15), v = f * l;
    const kind = pick(['v', 'f', 'l']);
    if (kind === 'v') return num(`A wave has frequency <strong>${f} Hz</strong> and wavelength <strong>${l} m</strong>. What is its speed (m/s)?`, v, `v = fλ = ${f} × ${l} = <strong>${v} m/s</strong>.`);
    if (kind === 'f') return num(`A wave travels at <strong>${v} m/s</strong> with a wavelength of <strong>${l} m</strong>. What is its frequency (Hz)?`, f, `f = v ÷ λ = ${v} ÷ ${l} = <strong>${f} Hz</strong>.`);
    return num(`A wave travels at <strong>${v} m/s</strong> with a frequency of <strong>${f} Hz</strong>. What is its wavelength (m)?`, l, `λ = v ÷ f = ${v} ÷ ${f} = <strong>${l} m</strong>.`);
  }),
  S('sciEMG11', 'Electricity and magnetism concepts', 11, 'Physics', '🧲', pairs({
    prompt: q => q,
    items: [
      ['Like charges … each other.', 'repel', 'Like charges repel; opposite charges attract.', ['repel', 'attract', 'ignore', 'cancel']],
      ['Opposite charges … each other.', 'attract', 'Like charges repel; opposite charges attract.', ['attract', 'repel', 'ignore', 'cancel']],
      ['The unit of electric current is the …', 'ampere', 'Current is measured in amperes (A).', ['ampere', 'volt', 'ohm', 'watt']],
      ['The unit of electric potential difference is the …', 'volt', 'Voltage is measured in volts (V).', ['volt', 'ampere', 'ohm', 'watt']],
      ['In a series circuit, the current is … at every point.', 'the same', 'There is only one path, so the current is the same.', ['the same', 'different', 'zero', 'doubled']],
      ['Moving a magnet through a coil of wire produces …', 'an induced current', 'Faraday\'s law of electromagnetic induction.', ['an induced current', 'a gravitational field', 'a sound wave', 'no effect']],
      ['The force between two charges depends on the distance between them. This is …', 'Coulomb\'s law', 'Force falls off with the square of the distance.', ['Coulomb\'s law', 'Ohm\'s law', 'Boyle\'s law', 'Hooke\'s law']]
    ]
  })),

  /* ================= GRADE 12 ================= */
  S('sciPNN12', 'Heredity: Punnett square probabilities', 12, 'Biology', '🧬', pairs({
    prompt: q => q,
    items: [
      ['Two carriers (Aa) of a recessive disorder have a child. What is the probability the child has the disorder (aa)?', '25%', 'Aa × Aa gives AA, Aa, Aa, aa — one in four.', ['25%', '50%', '75%', '0%']],
      ['Two carriers (Aa) have a child. What is the probability the child is a carrier (Aa)?', '50%', 'Two of the four boxes are Aa.', ['50%', '25%', '75%', '100%']],
      ['An Aa parent and an aa parent have a child. What is the probability of aa?', '50%', 'Aa × aa gives Aa, Aa, aa, aa.', ['50%', '25%', '75%', '100%']],
      ['An AA parent and an aa parent have a child. What is the probability the child is Aa?', '100%', 'All offspring receive one A and one a.', ['100%', '50%', '25%', '0%']],
      ['In humans, sex is determined by chromosomes. A child with XY chromosomes is …', 'male', 'XY is male; XX is female.', ['male', 'female', 'neither', 'both']],
      ['Red-green colour blindness is X-linked recessive. A man who is colour-blind passes the allele to his …', 'daughters', 'He gives his X to daughters and his Y to sons.', ['daughters', 'sons', 'all children', 'no one']],
      ['Incomplete dominance means the heterozygote shows …', 'a blend of both traits', 'Neither allele fully dominates.', ['a blend of both traits', 'only the dominant trait', 'only the recessive trait', 'neither trait']]
    ]
  })),
  S('sciBIO12', 'Biological molecules', 12, 'Biology', '🍞', classify({
    categories: ['Carbohydrate', 'Lipid', 'Protein', 'Nucleic acid'],
    prompt: s => `Which type of biological molecule is ${b(s)}?`,
    items: [
      ['glucose', 'Carbohydrate', 'Glucose is a simple sugar.'],
      ['starch', 'Carbohydrate', 'Starch is a polysaccharide of glucose.'],
      ['olive oil', 'Lipid', 'Oils are lipids (fats).'],
      ['cholesterol', 'Lipid', 'Cholesterol is a lipid (steroid).'],
      ['hemoglobin', 'Protein', 'Hemoglobin is a protein made of amino acids.'],
      ['an enzyme such as amylase', 'Protein', 'Most enzymes are proteins.'],
      ['DNA', 'Nucleic acid', 'DNA is made of nucleotides.'],
      ['RNA', 'Nucleic acid', 'RNA is made of nucleotides.'],
      ['cellulose', 'Carbohydrate', 'Cellulose is a polysaccharide in plant cell walls.'],
      ['a phospholipid', 'Lipid', 'Phospholipids form cell membranes.']
    ]
  })),
  S('sciENV12', 'Energy and environment', 12, 'Earth and environmental science', '♻️', classify({
    categories: ['Renewable', 'Nonrenewable'],
    prompt: s => `Is ${b(s)} a renewable or nonrenewable energy source?`,
    items: [
      ['solar power', 'Renewable', 'The Sun is not used up on human timescales.'],
      ['coal', 'Nonrenewable', 'Coal takes millions of years to form.'],
      ['wind power', 'Renewable', 'Wind is continually replenished.'],
      ['natural gas', 'Nonrenewable', 'A fossil fuel that takes millions of years to form.'],
      ['hydroelectric power', 'Renewable', 'Flowing water is replenished by the water cycle.'],
      ['oil (petroleum)', 'Nonrenewable', 'A fossil fuel.'],
      ['geothermal energy', 'Renewable', 'Earth\'s heat is continually available.'],
      ['uranium (nuclear fission)', 'Nonrenewable', 'Uranium is a limited resource.'],
      ['biomass (wood, crops)', 'Renewable', 'Plants can be regrown.']
    ]
  })),
  S('sciGHG12', 'Climate and greenhouse gases', 12, 'Earth and environmental science', '🌡️', pairs({
    prompt: q => q,
    items: [
      ['Which gas is the main greenhouse gas released by burning fossil fuels?', 'Carbon dioxide', 'Burning fossil fuels releases CO₂.'],
      ['Which greenhouse gas is released by cattle and rice paddies?', 'Methane', 'Methane (CH₄) comes from livestock and wetlands.'],
      ['What is the layer of gas that protects Earth from most ultraviolet radiation?', 'Ozone layer', 'Ozone absorbs harmful UV.'],
      ['What process traps heat in Earth\'s atmosphere?', 'The greenhouse effect', 'Greenhouse gases absorb and re-emit heat.'],
      ['Which gas, once used in refrigerators, damaged the ozone layer?', 'CFCs', 'Chlorofluorocarbons were banned by the Montreal Protocol.'],
      ['Rising sea levels are partly caused by melting ice and …', 'thermal expansion of water', 'Warmer water takes up more space.'],
      ['Burning fossil fuels also causes acid rain by releasing …', 'sulfur dioxide', 'Sulfur and nitrogen oxides make rain acidic.']
    ].map(([q, a, n]) => [q, a, n, ['Carbon dioxide', 'Methane', 'Ozone layer', 'The greenhouse effect', 'CFCs', 'thermal expansion of water', 'sulfur dioxide']])
  })),
  S('sciSTR12', 'Stars and the universe', 12, 'Astronomy', '🌌', pairs({
    prompt: q => q,
    items: [
      ['What is the name of our galaxy?', 'The Milky Way'],
      ['What process powers stars like the Sun?', 'Nuclear fusion'],
      ['A star about 8 times the Sun\'s mass or more ends its life as a …', 'Supernova'],
      ['What is the leftover core of a massive star that has a gravity so strong that light cannot escape?', 'Black hole'],
      ['The theory that the universe began from a hot, dense state is the …', 'Big Bang theory'],
      ['The Sun will eventually become a red giant and then a …', 'White dwarf'],
      ['Distant galaxies shifting to longer (redder) wavelengths shows that the universe is …', 'Expanding'],
      ['Which unit measures the distance light travels in one year?', 'Light-year']
    ].map(([q, a]) => [q, a, `The answer is ${b(a)}.`, ['The Milky Way', 'Nuclear fusion', 'Supernova', 'Black hole', 'Big Bang theory', 'White dwarf', 'Expanding', 'Light-year', 'Nuclear fission']])
  }))
];
