/* Science — high-school chemistry and physics (grades 9–12). Specs: { k, t, s, g, gen }. */
import { classify, pairs } from '../quiz.js';
import { ri, pick, sample, b, em, mc } from '../eng/words.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const num = (prompt, answer, explain) => ({ type: 'num', prompt, answer, explain });
const cls = (categories, prompt, items) => classify({ categories, prompt, items });
const facts = (items, note) => pairs({ prompt: q => q, items: items.map(([q, a]) => [q, a, note ? note(a) : `The answer is ${b(a)}.`]) });
// [question, answer, [hand-picked wrong answers]]
const fx = items => pairs({ prompt: q => q, items: items.map(([q, a, w]) => [q, a, `The answer is ${b(a)}.`, [a, ...w]]) });
const sub = n => String(n).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');
const gcd = (a, c) => (c ? gcd(c, a % c) : a);

// [symbol, name, Z, common mass number]
const ELEMENTS = [['H', 'hydrogen', 1, 1], ['He', 'helium', 2, 4], ['Li', 'lithium', 3, 7], ['C', 'carbon', 6, 12], ['N', 'nitrogen', 7, 14], ['O', 'oxygen', 8, 16], ['F', 'fluorine', 9, 19],
  ['Na', 'sodium', 11, 23], ['Mg', 'magnesium', 12, 24], ['Al', 'aluminum', 13, 27], ['P', 'phosphorus', 15, 31], ['S', 'sulfur', 16, 32], ['Cl', 'chlorine', 17, 35], ['K', 'potassium', 19, 39], ['Ca', 'calcium', 20, 40], ['Fe', 'iron', 26, 56]];
// ions: [symbol, name, charge]
const CATIONS = [['Na', 'sodium', 1], ['K', 'potassium', 1], ['Li', 'lithium', 1], ['Mg', 'magnesium', 2], ['Ca', 'calcium', 2], ['Ba', 'barium', 2], ['Al', 'aluminum', 3]];
// [symbol, ion name, charge, element name]
const ANIONS = [['Cl', 'chloride', 1, 'chlorine'], ['Br', 'bromide', 1, 'bromine'], ['I', 'iodide', 1, 'iodine'], ['F', 'fluoride', 1, 'fluorine'], ['O', 'oxide', 2, 'oxygen'], ['S', 'sulfide', 2, 'sulfur']];
const sup = n => (n > 1 ? '⁰¹²³⁴⁵⁶⁷⁸⁹'[n] : '');
const formula = (c, a) => { const g = gcd(c[2], a[2]); const nc = a[2] / g, na = c[2] / g; return c[0] + (nc > 1 ? sub(nc) : '') + a[0] + (na > 1 ? sub(na) : ''); };

export const CHEMPHYS_SPECS = [
  /* ================= Atomic structure ================= */
  sk('SubAt', 'Count subatomic particles in atoms and ions', 'Atomic structure', [9, 10, 11, 12], () => {
    const [sym, name, Z, A] = pick(ELEMENTS);
    const charge = pick([0, 0, 1, -1, 2]);
    const kind = pick(['protons', 'neutrons', 'electrons']);
    const ans = kind === 'protons' ? Z : kind === 'neutrons' ? A - Z : Z - charge;
    const label = charge === 0 ? `a neutral ${name} atom` : `the ion ${sym}${charge > 0 ? (charge > 1 ? charge : '') + '⁺' : '⁻'}`.replace('2⁺', '²⁺');
    return num(`${name[0].toUpperCase() + name.slice(1)} has atomic number ${b(Z)} and mass number ${b(A)}. How many ${b(kind)} are in ${label}?`, ans,
      kind === 'protons' ? `Protons = atomic number = ${b(Z)}.` : kind === 'neutrons' ? `Neutrons = mass number − atomic number = ${A} − ${Z} = ${b(A - Z)}.` : `Electrons = protons − charge = ${Z} − (${charge}) = ${b(ans)}.`);
  }),
  sk('Decay', 'Types of radioactive decay', 'Atomic structure', [10, 11, 12], fx([
    ['Which decay releases a helium nucleus (2 protons and 2 neutrons)?', 'Alpha decay', ['Beta decay', 'Gamma decay', 'Fusion']],
    ['Which decay turns a neutron into a proton and releases an electron?', 'Beta decay', ['Alpha decay', 'Gamma decay', 'Fission']],
    ['Which decay releases only high-energy electromagnetic radiation?', 'Gamma decay', ['Alpha decay', 'Beta decay', 'Positron decay']],
    ['Which radiation can be stopped by a sheet of paper?', 'Alpha particles', ['Gamma rays', 'Beta particles', 'X-rays']],
    ['Which radiation needs thick lead or concrete to stop it?', 'Gamma rays', ['Alpha particles', 'Beta particles', 'Visible light']],
    ['In alpha decay, the atomic number …', 'decreases by 2', ['increases by 1', 'stays the same', 'decreases by 4']]
  ])),
  sk('PerTr', 'Periodic trends', 'Atomic structure', [10, 11, 12], fx([
    ['Moving left to right across a period, atomic radius generally …', 'decreases', ['increases', 'stays the same', 'doubles']],
    ['Moving down a group, atomic radius generally …', 'increases', ['decreases', 'stays the same', 'halves']],
    ['Moving left to right across a period, ionization energy generally …', 'increases', ['decreases', 'stays the same', 'drops to zero']],
    ['Which has the larger atomic radius: Na or Cl?', 'Na', ['Cl', 'They are equal', 'Cannot be compared']],
    ['Which has the higher first ionization energy: Li or F?', 'F', ['Li', 'They are equal', 'Cannot be compared']],
    ['Which element is the most electronegative?', 'Fluorine', ['Sodium', 'Cesium', 'Helium']]
  ])),
  /* ================= Bonding and nomenclature ================= */
  sk('BondT', 'Determine which type of chemical bond can form', 'Chemical bonding', [9, 11, 12], cls(['Ionic', 'Covalent', 'Metallic'], s => `What type of bond forms in ${b(s)}?`, [
    ['NaCl', 'Ionic'], ['MgO', 'Ionic'], ['KBr', 'Ionic'], ['CaF₂', 'Ionic'], ['H₂O', 'Covalent'], ['CO₂', 'Covalent'], ['NH₃', 'Covalent'], ['CH₄', 'Covalent'], ['copper wire', 'Metallic'], ['an iron bar', 'Metallic']
  ].map(([s, c]) => [s, c, { Ionic: 'A metal and a nonmetal transfer electrons.', Covalent: 'Nonmetals share electrons.', Metallic: 'Metal atoms share a "sea" of electrons.' }[c]]))),
  sk('NameIon', 'Name binary ionic compounds', 'Nomenclature', [10, 11, 12], () => {
    const c = pick(CATIONS), a = pick(ANIONS); const f = formula(c, a);
    const name = `${c[1]} ${a[1]}`;
    return mc(`What is the name of ${b(f)}?`, name, [`${c[1]} ${a[1].replace(/ide$/, '')}`, `${a[1]} ${c[1]}`, `${c[1]} ${a[1].replace(/ide$/, 'ate')}`, ...sample(ANIONS, 2).map(x => `${c[1]} ${x[1]}`)], `Name the metal, then the nonmetal with -ide: ${b(name)}.`);
  }),
  sk('FormIon', 'Write chemical formulas of ionic compounds', 'Nomenclature', [10, 11, 12], () => {
    const c = pick(CATIONS), a = pick(ANIONS); const f = formula(c, a);
    // other subscript combinations with a different ratio (so none is secretly equivalent)
    const g0 = gcd(c[2], a[2]), right = (a[2] / g0) / (c[2] / g0);
    const wrong = [];
    for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) if (Math.abs(i / j - right) > 1e-9) wrong.push(c[0] + (i > 1 ? sub(i) : '') + a[0] + (j > 1 ? sub(j) : ''));
    return mc(`${c[1][0].toUpperCase() + c[1].slice(1)} forms ${c[0]}${sup(c[2])}⁺ ions and ${a[3]} forms ${a[0]}${sup(a[2])}⁻ ions. What is the formula of ${b(c[1] + ' ' + a[1])}?`, f, wrong, `Balance the charges: ${b(f)}.`);
  }),
  sk('NameCov', 'Write chemical formulas of binary covalent compounds', 'Nomenclature', [10, 11, 12], facts([
    ['carbon dioxide', 'CO₂'], ['carbon monoxide', 'CO'], ['dinitrogen tetroxide', 'N₂O₄'], ['sulfur trioxide', 'SO₃'], ['phosphorus pentachloride', 'PCl₅'], ['nitrogen trifluoride', 'NF₃'], ['dihydrogen monoxide', 'H₂O'], ['carbon tetrachloride', 'CCl₄']
  ].map(([n, f]) => [`What is the formula for ${b(n)}?`, f]), a => `Prefixes give the number of each atom: ${b(a)}.`)),

  /* ================= The mole, equations and stoichiometry ================= */
  sk('MolarM', 'Calculate molar mass', 'The mole and stoichiometry', [10, 11, 12], () => {
    const f = pick([['H₂O', 18, '2(1) + 16'], ['CO₂', 44, '12 + 2(16)'], ['NaCl', 58, '23 + 35'], ['CH₄', 16, '12 + 4(1)'], ['NH₃', 17, '14 + 3(1)'], ['O₂', 32, '2(16)'], ['CaCO₃', 100, '40 + 12 + 3(16)'], ['MgO', 40, '24 + 16'], ['H₂SO₄', 98, '2(1) + 32 + 4(16)'], ['C₆H₁₂O₆', 180, '6(12) + 12(1) + 6(16)']]);
    return num(`Using H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Cl = 35, Ca = 40: what is the molar mass of ${b(f[0])} in g/mol?`, f[1], `${f[2]} = ${b(f[1])} g/mol.`);
  }),
  sk('MolConv', 'Convert between mass and moles of a substance', 'The mole and stoichiometry', [9, 11, 12], () => {
    const [f, M] = pick([['H₂O', 18], ['CO₂', 44], ['NaOH', 40], ['CaCO₃', 100], ['O₂', 32], ['CH₄', 16]]); const n = ri(2, 8);
    return Math.random() < 0.5
      ? num(`How many moles are in ${b(M * n + ' g')} of ${b(f)}? (M = ${M} g/mol)`, n, `n = m ÷ M = ${M * n} ÷ ${M} = ${b(n)} mol.`)
      : num(`What is the mass, in grams, of ${b(n + ' mol')} of ${b(f)}? (M = ${M} g/mol)`, M * n, `m = n × M = ${n} × ${M} = ${b(M * n)} g.`);
  }),
  sk('CntAt', 'Count atoms in chemical equations', 'Chemical reactions', [9, 10, 11, 12], () => {
    const [eq, el, n] = pick([['2H₂ + O₂ → 2H₂O', 'H', 4], ['2H₂ + O₂ → 2H₂O', 'O', 2], ['CH₄ + 2O₂ → CO₂ + 2H₂O', 'O', 4], ['CH₄ + 2O₂ → CO₂ + 2H₂O', 'H', 4],
      ['N₂ + 3H₂ → 2NH₃', 'H', 6], ['2Na + Cl₂ → 2NaCl', 'Na', 2], ['C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', 'O', 10], ['C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', 'C', 3]]);
    return num(`In the balanced equation ${b(eq)}, how many ${b(el)} atoms are on each side?`, n, `Multiply coefficients by subscripts: each side has ${b(n)} ${el} atoms.`);
  }),
  sk('Balance', 'Balance chemical equations', 'Chemical reactions', [10, 11, 12], facts([
    ['Balance: __H₂ + __O₂ → __H₂O', '2, 1, 2'], ['Balance: __N₂ + __H₂ → __NH₃', '1, 3, 2'], ['Balance: __Na + __Cl₂ → __NaCl', '2, 1, 2'],
    ['Balance: __CH₄ + __O₂ → __CO₂ + __H₂O', '1, 2, 1, 2'], ['Balance: __Fe + __O₂ → __Fe₂O₃', '4, 3, 2'], ['Balance: __Mg + __O₂ → __MgO', '2, 1, 2'],
    ['Balance: __KClO₃ → __KCl + __O₂', '2, 2, 3'], ['Balance: __Al + __O₂ → __Al₂O₃', '4, 3, 2']
  ], a => `The coefficients are ${b(a)}, so every element has the same count on both sides.`)),
  sk('RxnCls', 'Classify chemical reactions', 'Chemical reactions', [9, 11, 12], cls(['Synthesis', 'Decomposition', 'Single replacement', 'Double replacement', 'Combustion'], s => `What type of reaction is ${b(s)}?`, [
    ['2Mg + O₂ → 2MgO', 'Synthesis'], ['CaCO₃ → CaO + CO₂', 'Decomposition'], ['Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag', 'Single replacement'], ['NaOH + HCl → NaCl + H₂O', 'Double replacement'],
    ['C₂H₆O + 3O₂ → 2CO₂ + 3H₂O', 'Combustion'], ['2H₂O₂ → 2H₂O + O₂', 'Decomposition'], ['2K + Br₂ → 2KBr', 'Synthesis'], ['Zn + CuSO₄ → ZnSO₄ + Cu', 'Single replacement']
  ].map(([s, c]) => [s, c, { Synthesis: 'A + B → AB', Decomposition: 'AB → A + B', 'Single replacement': 'A + BC → AC + B', 'Double replacement': 'AB + CD → AD + CB', Combustion: 'Fuel + O₂ → CO₂ + H₂O' }[c]]))),
  sk('MolRat', 'Determine mole ratios', 'The mole and stoichiometry', [10, 11, 12], () => {
    const [eq, a, ca, c2, cc] = pick([['N₂ + 3H₂ → 2NH₃', 'H₂', 3, 'NH₃', 2], ['2H₂ + O₂ → 2H₂O', 'O₂', 1, 'H₂O', 2], ['CH₄ + 2O₂ → CO₂ + 2H₂O', 'CH₄', 1, 'H₂O', 2], ['2KClO₃ → 2KCl + 3O₂', 'KClO₃', 2, 'O₂', 3]]);
    const n = ri(1, 6) * ca;
    const ans = n * cc / ca;
    return num(`${b(eq)}<br>How many moles of ${b(c2)} form from ${b(n + ' mol')} of ${b(a)}?`, ans, `Mole ratio ${a}:${c2} = ${ca}:${cc}, so ${n} × ${cc}/${ca} = ${b(ans)} mol.`);
  }),
  sk('Molarity', 'Calculate the molarity of a solution', 'Solutions', [10, 11, 12], () => {
    const M = pick([0.5, 1, 2, 3, 4]), V = pick([0.5, 1, 2, 4]); const n = M * V;
    return num(`A solution contains ${b(n + ' mol')} of solute in ${b(V + ' L')} of solution. What is its molarity (mol/L)?`, M, `M = n ÷ V = ${n} ÷ ${V} = ${b(M)} mol/L.`);
  }),
  sk('SpecH', 'Calculations involving specific heat', 'Energy changes', [10, 11, 12], () => {
    const m = pick([10, 20, 50, 100]), dT = pick([2, 5, 10, 20]), c = 4.18;
    const Q = Math.round(m * c * dT * 100) / 100;
    return num(`How much heat (in joules) is needed to raise ${b(m + ' g')} of water by ${b(dT + ' °C')}? (c = 4.18 J/g·°C)`, Q, `Q = mcΔT = ${m} × 4.18 × ${dT} = ${b(Q)} J.`);
  }),
  sk('ExoEndo', 'Identify exothermic and endothermic processes', 'Energy changes', [9, 10, 11, 12], cls(['Exothermic', 'Endothermic'], s => `Is this process exothermic or endothermic?<br>${em(s)}`, [
    ['Burning wood in a fireplace', 'Exothermic'], ['Water freezing into ice', 'Exothermic'], ['A hand warmer heating up', 'Exothermic'], ['Steam condensing on a mirror', 'Exothermic'],
    ['Ice melting', 'Endothermic'], ['An instant cold pack getting cold', 'Endothermic'], ['Photosynthesis', 'Endothermic'], ['Water boiling', 'Endothermic']
  ].map(([s, c]) => [s, c, c === 'Exothermic' ? 'Energy is released to the surroundings.' : 'Energy is absorbed from the surroundings.']))),
  sk('Rate', 'Factors that affect reaction rate', 'Chemical reactions', [9, 10, 11, 12], fx([
    ['Raising the temperature usually makes a reaction …', 'faster', ['slower', 'stop', 'unchanged']],
    ['Grinding a solid into powder makes it react faster because it increases …', 'surface area', ['mass', 'density', 'colour']],
    ['A substance that speeds up a reaction without being used up is a …', 'catalyst', ['product', 'reactant', 'solvent']],
    ['Increasing the concentration of reactants usually makes a reaction …', 'faster', ['slower', 'stop', 'unchanged']],
    ['Food spoils more slowly in a fridge because lower temperature …', 'slows reactions', ['speeds reactions', 'adds oxygen', 'removes water']],
    ['Enzymes are biological …', 'catalysts', ['reactants', 'products', 'solvents']]
  ])),
  /* ================= Physics ================= */
  sk('Disp', 'Distance and displacement in one dimension', 'Motion in one dimension', [9, 10, 11, 12], () => {
    const a = ri(2, 15), c = ri(1, a - 1);
    return Math.random() < 0.5
      ? num(`A runner jogs ${b(a + ' m')} east, then ${b(c + ' m')} west. What total distance did she travel (m)?`, a + c, `Distance adds every path: ${a} + ${c} = ${b(a + c)} m.`)
      : num(`A runner jogs ${b(a + ' m')} east, then ${b(c + ' m')} west. What is the size of her displacement (m)?`, a - c, `Displacement is the change in position: ${a} − ${c} = ${b(a - c)} m east.`);
  }),
  sk('Kinem', 'Solve problems using kinematic equations', 'Motion in one dimension', [9, 10, 12], () => {
    const u = ri(0, 10), a = ri(1, 6), t = ri(2, 8); const v = u + a * t;
    const s = u * t + (a * t * t) / 2;
    return Math.random() < 0.5
      ? num(`An object starts at ${b(u + ' m/s')} and accelerates at ${b(a + ' m/s²')} for ${b(t + ' s')}. What is its final speed (m/s)?`, v, `v = u + at = ${u} + ${a}×${t} = ${b(v)} m/s.`)
      : num(`An object starts at ${b(u + ' m/s')} and accelerates at ${b(a + ' m/s²')} for ${b(t + ' s')}. How far does it travel (m)?`, s, `s = ut + ½at² = ${u}×${t} + ½×${a}×${t}² = ${b(s)} m.`);
  }),
  sk('NewtonL', 'Newton\'s laws of motion', 'Forces and laws of motion', [9, 10, 11, 12], cls(['First law', 'Second law', 'Third law'], s => `Which of Newton's laws best explains this?<br>${em(s)}`, [
    ['A hockey puck keeps sliding on smooth ice.', 'First law'], ['Passengers lurch forward when a car brakes.', 'First law'], ['A tablecloth is yanked away but the dishes stay put.', 'First law'],
    ['A heavier cart needs a bigger push to accelerate equally.', 'Second law'], ['F = ma: a 2 kg mass pushed with 10 N accelerates at 5 m/s².', 'Second law'],
    ['A gun recoils when fired.', 'Third law'], ['A rocket pushes exhaust down and moves up.', 'Third law'], ['You push off a wall and roll backward.', 'Third law']
  ].map(([s, c]) => [s, c, { 'First law': 'Inertia: objects keep their motion unless a net force acts.', 'Second law': 'F = ma.', 'Third law': 'Every action has an equal and opposite reaction.' }[c]]))),
  sk('FmaP', 'Newton\'s second law of motion', 'Forces and laws of motion', [10, 11, 12], () => {
    const m = ri(2, 25), a = ri(1, 12), F = m * a;
    const k = pick(['F', 'a', 'm']);
    if (k === 'F') return num(`What net force (N) accelerates a ${b(m + ' kg')} cart at ${b(a + ' m/s²')}?`, F, `F = ma = ${m} × ${a} = ${b(F)} N.`);
    if (k === 'a') return num(`A net force of ${b(F + ' N')} acts on a ${b(m + ' kg')} box. What is its acceleration (m/s²)?`, a, `a = F ÷ m = ${F} ÷ ${m} = ${b(a)} m/s².`);
    return num(`A net force of ${b(F + ' N')} gives an object an acceleration of ${b(a + ' m/s²')}. What is its mass (kg)?`, m, `m = F ÷ a = ${F} ÷ ${a} = ${b(m)} kg.`);
  }),
  sk('Grav', 'Newton\'s law of universal gravitation', 'Forces and laws of motion', [10, 11, 12], fx([
    ['If the distance between two masses doubles, the gravitational force becomes …', 'one-quarter as strong', ['half as strong', 'twice as strong', 'four times as strong']],
    ['If one of the masses doubles, the gravitational force …', 'doubles', ['halves', 'quadruples', 'stays the same']],
    ['If the distance between two masses is cut in half, the force becomes …', 'four times as strong', ['twice as strong', 'half as strong', 'one-quarter as strong']],
    ['Why do you weigh less on the Moon?', 'The Moon has less mass, so its gravity is weaker.', ['There is no air on the Moon.', 'Your mass decreases on the Moon.', 'The Moon is colder.']],
    ['The gravitational force between two masses is always …', 'attractive', ['repulsive', 'zero', 'magnetic']],
    ['What keeps the Moon in orbit around Earth?', 'Earth\'s gravity', ['The Sun\'s magnetism', 'Air pressure', 'The Moon\'s engines']]
  ])),
  sk('MechE', 'Conservation of mechanical energy', 'Work, energy and power', [10, 11, 12], () => {
    const [h, v] = pick([[5, 10], [20, 20], [45, 30], [80, 40], [125, 50]]);
    return num(`A ball is dropped from ${b(h + ' m')}. Ignoring air resistance (g = 10 m/s²), how fast is it moving just before it hits the ground (m/s)?`, v, `mgh = ½mv² → v = √(2gh) = √(2×10×${h}) = ${b(v)} m/s.`);
  }),
  sk('WorkP', 'Work and power', 'Work, energy and power', [9, 10, 11, 12], () => {
    const F = ri(5, 50), d = ri(2, 10), t = pick([1, 2, 4, 5]); const W = F * d;
    return Math.random() < 0.5
      ? num(`A force of ${b(F + ' N')} pushes a box ${b(d + ' m')}. How much work is done (J)?`, W, `W = F × d = ${F} × ${d} = ${b(W)} J.`)
      : num(`A motor does ${b(W * t + ' J')} of work in ${b(t + ' s')}. What is its power (W)?`, W, `P = W ÷ t = ${W * t} ÷ ${t} = ${b(W)} W.`);
  }),
  sk('OhmLaw', 'Ohm\'s law and circuits', 'Electricity and magnetism', [9, 10, 12], () => {
    const I = ri(1, 8), R = ri(2, 25), V = I * R; const k = pick(['V', 'I', 'R']);
    if (k === 'V') return num(`A current of ${b(I + ' A')} flows through a ${b(R + ' Ω')} resistor. What is the voltage (V)?`, V, `V = IR = ${I} × ${R} = ${b(V)} V.`);
    if (k === 'I') return num(`A ${b(V + ' V')} source is connected to ${b(R + ' Ω')}. What current flows (A)?`, I, `I = V ÷ R = ${V} ÷ ${R} = ${b(I)} A.`);
    return num(`A ${b(V + ' V')} source drives ${b(I + ' A')}. What is the resistance (Ω)?`, R, `R = V ÷ I = ${V} ÷ ${I} = ${b(R)} Ω.`);
  }),
  sk('Coulomb', 'Coulomb\'s law: electrostatic forces', 'Electricity and magnetism', [10, 11, 12], fx([
    ['If the distance between two charges triples, the force becomes …', 'one-ninth as strong', ['one-third as strong', 'three times as strong', 'nine times as strong']],
    ['If both charges double, the force becomes …', 'four times as strong', ['twice as strong', 'half as strong', 'unchanged']],
    ['Two positive charges …', 'repel each other', ['attract each other', 'cancel to zero mass', 'do not interact']],
    ['A positive charge and a negative charge …', 'attract each other', ['repel each other', 'do not interact', 'become neutrons']],
    ['What is the SI unit of electric charge?', 'The coulomb', ['The volt', 'The ampere', 'The ohm']],
    ['Electric force depends on the size of the charges and the …', 'distance between them', ['colour of the objects', 'temperature of the room', 'speed of light']]
  ])),
  sk('Reflect', 'The law of reflection', 'Waves', [10, 11, 12], () => {
    const i = ri(10, 80);
    return Math.random() < 0.5
      ? num(`A ray of light hits a flat mirror at an angle of incidence of ${b(i + '°')}. What is the angle of reflection (degrees)?`, i, `Angle of incidence = angle of reflection = ${b(i)}°.`)
      : num(`A ray strikes a mirror ${b((90 - i) + '°')} from the mirror's surface. What is the angle of reflection measured from the normal (degrees)?`, i, `Angles are measured from the normal: 90 − ${90 - i} = ${b(i)}°.`);
  }),
  sk('WaveSp', 'Wave speed, frequency and wavelength', 'Waves', [9, 10, 12], () => {
    const f = ri(2, 20), l = ri(2, 15), v = f * l; const k = pick(['v', 'f', 'l']);
    if (k === 'v') return num(`A wave has frequency ${b(f + ' Hz')} and wavelength ${b(l + ' m')}. What is its speed (m/s)?`, v, `v = fλ = ${f} × ${l} = ${b(v)} m/s.`);
    if (k === 'f') return num(`A wave moves at ${b(v + ' m/s')} with wavelength ${b(l + ' m')}. What is its frequency (Hz)?`, f, `f = v ÷ λ = ${v} ÷ ${l} = ${b(f)} Hz.`);
    return num(`A wave moves at ${b(v + ' m/s')} with frequency ${b(f + ' Hz')}. What is its wavelength (m)?`, l, `λ = v ÷ f = ${v} ÷ ${f} = ${b(l)} m.`);
  }),
  sk('Magnet', 'Magnetic forces and fields', 'Electricity and magnetism', [9, 10, 11, 12], fx([
    ['Outside a magnet, magnetic field lines point from the …', 'north pole to the south pole', ['south pole to the north pole', 'middle to both ends', 'ground to the sky']],
    ['A wire carrying an electric current creates a …', 'magnetic field', ['gravitational field', 'sound wave', 'chemical reaction']],
    ['A coil of wire wrapped around an iron core and carrying current is an …', 'electromagnet', ['insulator', 'battery', 'resistor']],
    ['Moving a magnet through a coil of wire produces …', 'an electric current', ['heat only', 'light only', 'a chemical change']],
    ['A compass needle points toward Earth\'s …', 'magnetic north pole', ['equator', 'Moon', 'geographic south pole']],
    ['Increasing the current in an electromagnet makes it …', 'stronger', ['weaker', 'unchanged', 'non-magnetic']]
  ])),
];
