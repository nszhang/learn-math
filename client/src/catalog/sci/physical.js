/* Science — practices, units and physical science (grades 1–12). Specs: { k, t, s, g, gen }. */
import { classify, pairs } from '../quiz.js';
import { ri, pick, shuffle, sample, uniq, b, em, big, mc } from '../eng/words.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const G = (a, z) => Array.from({ length: z - a + 1 }, (_, i) => a + i);
const num = (prompt, answer, explain) => ({ type: 'num', prompt, answer, explain });
const cls = (categories, prompt, items) => classify({ categories, prompt, items });
const qa = (items, prompt = q => q) => pairs({ prompt, items });
// [question, answer, [hand-picked wrong answers]]
const fx = items => pairs({ prompt: q => q, items: items.map(([q, a, w]) => [q, a, `The answer is ${b(a)}.`, [a, ...w]]) });

export const PHYSICAL_SPECS = [
  /* ================= Science practices and tools ================= */
  sk('SciMeth', 'Identify steps of the scientific method', 'Science practices and tools', G(3, 10), qa([
    ['Which step comes first in the scientific method?', 'Ask a question', 'Science starts with a question about the world.', ['Ask a question', 'Draw a conclusion', 'Analyze data', 'Share results']],
    ['A student predicts, "Plants grow taller in sunlight." What step is this?', 'Form a hypothesis', 'A hypothesis is a testable prediction.', ['Form a hypothesis', 'Ask a question', 'Analyze data', 'Share results']],
    ['A student grows plants in light and dark and measures them each day. What step is this?', 'Test with an experiment', 'Testing the hypothesis is the experiment.', ['Test with an experiment', 'Form a hypothesis', 'Ask a question', 'Share results']],
    ['A student makes a graph of plant heights. What step is this?', 'Analyze data', 'Graphs help analyze data.', ['Analyze data', 'Ask a question', 'Form a hypothesis', 'Share results']],
    ['A student decides, "The plants in sunlight grew taller, so my hypothesis was supported." What step is this?', 'Draw a conclusion', 'A conclusion says whether the data support the hypothesis.', ['Draw a conclusion', 'Ask a question', 'Test with an experiment', 'Analyze data']],
    ['A student presents her findings at the science fair. What step is this?', 'Share results', 'Scientists communicate results so others can check them.', ['Share results', 'Form a hypothesis', 'Ask a question', 'Analyze data']],
    ['Which step comes right after forming a hypothesis?', 'Test with an experiment', 'You test the prediction.', ['Test with an experiment', 'Ask a question', 'Share results', 'Draw a conclusion']],
    ['What should a scientist do if the results do not support the hypothesis?', 'Revise the hypothesis and test again', 'Unsupported hypotheses are revised, not hidden.', ['Revise the hypothesis and test again', 'Change the data', 'Stop doing science', 'Ignore the results']]
  ])),
  sk('LabTool', 'Identify laboratory tools', 'Science practices and tools', G(3, 10), () => {
    const tools = [['a graduated cylinder', 'measure the volume of a liquid'], ['a balance', 'measure mass'], ['a thermometer', 'measure temperature'], ['a microscope', 'see very small things'],
      ['a stopwatch', 'measure time'], ['a ruler', 'measure length'], ['a spring scale', 'measure force (weight)'], ['a magnifying glass', 'make small things look bigger'],
      ['a beaker', 'hold and pour liquids'], ['a pipette', 'move small amounts of liquid'], ['a test tube', 'hold small samples for mixing or heating'], ['a Bunsen burner', 'heat substances with a flame']];
    const [tool, use] = pick(tools);
    return Math.random() < 0.5
      ? mc(`Which tool would you use to ${b(use)}?`, cap(tool), tools.map(t => cap(t[0])), `${cap(tool)} is used to ${use}.`)
      : mc(`What is ${b(tool)} used for?`, `to ${use}`, tools.map(t => `to ${t[1]}`), `${cap(tool)} is used to ${use}.`);
  }),
  sk('LabSafe', 'Laboratory safety equipment', 'Science practices and tools', G(5, 10), qa([
    ['What protects your eyes from splashes?', 'Safety goggles'], ['What should you use if a chemical splashes into your eyes?', 'An eyewash station'],
    ['What is used to put out a small fire?', 'A fire extinguisher'], ['What protects your hands from chemicals?', 'Gloves'], ['What protects your clothes and skin?', 'A lab coat'],
    ['What removes harmful fumes from the air?', 'A fume hood'], ['What should you use if a large chemical spill gets on your body?', 'A safety shower'], ['What can smother a fire on a person\'s clothes?', 'A fire blanket']
  ].map(([q, a]) => [q, a, `${b(a)} is the right safety equipment.`]))),

  /* ================= Designing experiments ================= */
  sk('CtlGrp', 'Identify control and experimental groups', 'Designing experiments', G(5, 10), qa([
    ['Maya tests whether fertilizer helps plants grow. Group A gets fertilizer; Group B gets none. Which is the control group?', 'Group B (no fertilizer)', 'The control group does not get the variable being tested.', ['Group B (no fertilizer)', 'Group A (fertilizer)', 'Both groups', 'Neither group']],
    ['Leo tests whether music helps mice run a maze faster. One group hears music; one hears silence. Which is the experimental group?', 'The group that hears music', 'The experimental group gets the variable being tested.', ['The group that hears music', 'The group that hears silence', 'Both groups', 'Neither group']],
    ['A doctor tests a new medicine. Half the patients get the medicine, half get a sugar pill. Which is the control group?', 'The patients who get the sugar pill', 'The control does not receive the real treatment.', ['The patients who get the sugar pill', 'The patients who get the medicine', 'All the patients', 'The doctor']],
    ['Ana tests whether salt makes ice melt faster. Cup 1 has salted ice; cup 2 has plain ice. Which is the experimental group?', 'Cup 1 (salted ice)', 'It receives the variable (salt).', ['Cup 1 (salted ice)', 'Cup 2 (plain ice)', 'Both cups', 'Neither cup']],
    ['Why does an experiment need a control group?', 'To compare results against a group without the change', 'The control shows what happens without the variable.', ['To compare results against a group without the change', 'To make the experiment longer', 'To use more materials', 'To guarantee the hypothesis is right']],
    ['Omar tests if light colour affects plant growth: red light, blue light, and normal white light. Which is the control?', 'The plants under white light', 'Normal conditions serve as the control.', ['The plants under white light', 'The plants under red light', 'The plants under blue light', 'All the plants']]
  ])),
  sk('IndDep', 'Identify independent and dependent variables', 'Designing experiments', G(5, 10), qa([
    ['A student tests how the amount of water affects bean growth. What is the independent variable?', 'The amount of water', 'The independent variable is what the scientist changes.', ['The amount of water', 'The height of the beans', 'The type of soil', 'The pot size']],
    ['A student tests how the amount of water affects bean growth. What is the dependent variable?', 'The height of the beans', 'The dependent variable is what is measured.', ['The height of the beans', 'The amount of water', 'The type of soil', 'The pot size']],
    ['How does the height of a ramp affect how far a toy car rolls? What is the independent variable?', 'The height of the ramp', 'It is changed on purpose.', ['The height of the ramp', 'The distance the car rolls', 'The type of car', 'The floor surface']],
    ['How does the height of a ramp affect how far a toy car rolls? What is the dependent variable?', 'The distance the car rolls', 'It is measured.', ['The distance the car rolls', 'The height of the ramp', 'The type of car', 'The floor surface']],
    ['Does water temperature affect how fast sugar dissolves? What is the independent variable?', 'The water temperature', 'It is changed on purpose.', ['The water temperature', 'The time to dissolve', 'The amount of sugar', 'The size of the cup']],
    ['Does water temperature affect how fast sugar dissolves? What is the dependent variable?', 'The time it takes to dissolve', 'It is measured.', ['The time it takes to dissolve', 'The water temperature', 'The amount of sugar', 'The size of the cup']],
    ['Does the type of ball affect how high it bounces? What should stay the same (a controlled variable)?', 'The height it is dropped from', 'Controlled variables are kept the same for a fair test.', ['The height it is dropped from', 'The type of ball', 'The bounce height', 'Nothing']],
    ['A student tests whether more sunlight makes plants greener. Which should be kept the same?', 'The amount of water', 'Keep other conditions the same so only sunlight changes.', ['The amount of water', 'The amount of sunlight', 'The greenness measured', 'Nothing']]
  ])),
  sk('ExpQ', 'Identify the experimental question', 'Designing experiments', G(5, 10), qa([
    ['Liam put one ice cube in a sunny window and one in the shade, then timed how long each took to melt. What question was he testing?', 'Does sunlight affect how fast ice melts?'],
    ['Priya planted seeds in sand, clay and potting soil and measured their growth. What question was she testing?', 'Does the type of soil affect how well seeds grow?'],
    ['Ben dropped a ball from 1 m, 2 m and 3 m and measured each bounce. What question was he testing?', 'Does drop height affect how high a ball bounces?'],
    ['Sofia wrapped cups of hot water in foil, wool and paper and recorded their temperatures. What question was she testing?', 'Which material keeps water warm the longest?'],
    ['Noah raced paper airplanes with different wing shapes. What question was he testing?', 'Does wing shape affect how far a paper airplane flies?'],
    ['Mia put bread in a fridge and on a counter and checked daily for mould. What question was she testing?', 'Does temperature affect how fast mould grows on bread?']
  ].map(([q, a]) => [q, a, 'The question matches what was changed and what was measured.']))),
  sk('EngDP', 'Identify parts of the engineering-design process', 'Engineering practices', G(3, 8), cls(['Define the problem', 'Brainstorm solutions', 'Build a prototype', 'Test and evaluate', 'Improve the design'],
    s => `Which step of the engineering-design process is this?<br>${em(s)}`, [
      ['Engineers figure out that the bridge must hold 20 tonnes and cost under $1 million.', 'Define the problem', 'They identify the need and the constraints.'],
      ['The team sketches ten different ideas for a water filter.', 'Brainstorm solutions', 'Many ideas are generated.'],
      ['Students build a small cardboard model of their shelter.', 'Build a prototype', 'A prototype is a first working model.'],
      ['The class drops their egg-protector from 3 m to see if the egg breaks.', 'Test and evaluate', 'They test how well the design works.'],
      ['After the test, they add more padding to fix the weak spot.', 'Improve the design', 'They change the design based on results.'],
      ['Engineers list what the solar oven must do and what materials they can use.', 'Define the problem', 'Criteria and constraints define the problem.'],
      ['The team builds a first version of the robot arm.', 'Build a prototype', 'A prototype is built.'],
      ['They measure how much weight their paper tower holds.', 'Test and evaluate', 'Testing measures performance.']
    ])),

  /* ================= Units and measurement ================= */
  sk('UnitCh', 'Choose units of length, mass and volume', 'Units and measurement', G(2, 8), () => {
    const items = [['the length of a pencil', 'centimetres'], ['the distance between two cities', 'kilometres'], ['the length of a soccer field', 'metres'], ['the width of an ant', 'millimetres'],
      ['the mass of an apple', 'grams'], ['the mass of a dog', 'kilograms'], ['the mass of a paper clip', 'grams'], ['the mass of a car', 'kilograms'],
      ['the volume of water in a spoon', 'millilitres'], ['the volume of water in a bathtub', 'litres'], ['the volume of juice in a glass', 'millilitres'], ['the volume of a swimming pool', 'litres']];
    const [thing, unit] = pick(items);
    const family = /metres$/.test(unit) ? ['millimetres', 'centimetres', 'metres', 'kilometres'] : /grams$/.test(unit) ? ['grams', 'kilograms', 'millilitres', 'centimetres'] : ['millilitres', 'litres', 'grams', 'metres'];
    return mc(`Which unit is best for measuring ${b(thing)}?`, unit, family, `${cap(thing)} is best measured in ${b(unit)}.`);
  }),
  sk('UnitAb', 'Abbreviate units', 'Units and measurement', G(5, 10), () => {
    const units = [['millimetre', 'mm'], ['centimetre', 'cm'], ['metre', 'm'], ['kilometre', 'km'], ['gram', 'g'], ['kilogram', 'kg'], ['millilitre', 'mL'], ['litre', 'L'],
      ['second', 's'], ['hour', 'h'], ['degree Celsius', '°C'], ['newton', 'N'], ['joule', 'J'], ['watt', 'W'], ['volt', 'V'], ['ampere', 'A'], ['metres per second', 'm/s'], ['kilometres per hour', 'km/h']];
    const [name, ab] = pick(units);
    return mc(`What is the abbreviation for ${b(name)}?`, ab, sample(units.map(u => u[1]), 5, [ab]), `${name} → ${b(ab)}.`);
  }),
  sk('SigFig', 'Identify significant figures in measurements', 'Units and measurement', G(9, 12), () => {
    const v = pick([['3.40', 3], ['0.052', 2], ['1200', 2], ['1200.', 4], ['105', 3], ['0.00710', 3], ['45.0', 3], ['7', 1], ['6.022', 4], ['300.0', 4], ['0.5', 1], ['20.08', 4]]);
    return num(`How many significant figures are in ${b(v[0])}?`, v[1], `${v[0]} has ${b(v[1])} significant figures. (Leading zeros never count; trailing zeros count only with a decimal point.)`);
  }),
  sk('CtoK', 'Convert temperature units: Celsius and Kelvin', 'Units and measurement', G(9, 12), () => {
    const c = ri(-100, 200);
    return Math.random() < 0.5
      ? num(`Convert ${b(c + ' °C')} to kelvins.`, c + 273, `K = °C + 273 = ${c} + 273 = ${b(c + 273)} K.`)
      : num(`Convert ${b((c + 273) + ' K')} to degrees Celsius.`, c, `°C = K − 273 = ${c + 273} − 273 = ${b(c)} °C.`);
  }),

  /* ================= Materials and comparing (early grades) ================= */
  sk('MatMt', 'Classify objects by material', 'Materials', [1, 2, 3], () => {
    const items = [['🥄 a spoon', 'Metal'], ['🔑 a key', 'Metal'], ['🪙 a coin', 'Metal'], ['🪑 a wooden chair', 'Wood'], ['✏️ a pencil', 'Wood'], ['🪵 a log', 'Wood'],
      ['🧦 a sock', 'Fabric'], ['🧣 a scarf', 'Fabric'], ['👕 a T-shirt', 'Fabric'], ['🥛 a drinking glass', 'Glass'], ['🪟 a window', 'Glass'], ['🫙 a jar', 'Glass'],
      ['🧸 a plastic toy block', 'Plastic'], ['🪥 a toothbrush handle', 'Plastic'], ['🎈 a balloon', 'Rubber'], ['🏀 a basketball', 'Rubber']];
    const [o, m] = pick(items);
    return mc(`What material is ${b(o)} made of?`, m, ['Metal', 'Wood', 'Fabric', 'Glass', 'Plastic', 'Rubber'], `${o.replace(/^\S+ /, '')} is usually made of ${b(m.toLowerCase())}.`);
  }),
  sk('MatTx', 'Classify objects by texture', 'Materials', [1, 2], cls(['Rough', 'Smooth', 'Soft', 'Hard'], s => `How does ${s} feel?`, [
    ['🪨 a rock', 'Hard'], ['🧸 a teddy bear', 'Soft'], ['🪵 tree bark', 'Rough'], ['🪟 a glass window', 'Smooth'], ['🛏️ a pillow', 'Soft'], ['🧽 sandpaper', 'Rough'], ['🧊 an ice cube', 'Smooth'], ['🔩 a metal bolt', 'Hard'], ['🐑 wool', 'Soft'], ['🍍 a pineapple skin', 'Rough']
  ].map(([s, c]) => [b(s), c, `${s.replace(/^\S+ /, '')} feels ${c.toLowerCase()}.`]))),
  sk('Compare', 'Comparing: long and short, light and heavy, hot and cold, fast and slow', 'Materials', [1], qa([
    ['Which is heavier?', '🐘 an elephant', '', ['🐘 an elephant', '🐁 a mouse']], ['Which is lighter?', '🪶 a feather', '', ['🪶 a feather', '🧱 a brick']],
    ['Which is longer?', '🐍 a snake', '', ['🐍 a snake', '🐛 a caterpillar']], ['Which is shorter?', '✏️ a pencil', '', ['✏️ a pencil', '🛤️ a train track']],
    ['Which is hotter?', '🔥 a campfire', '', ['🔥 a campfire', '🧊 an ice cube']], ['Which is colder?', '⛄ a snowman', '', ['⛄ a snowman', '☀️ the sun']],
    ['Which is faster?', '🐆 a cheetah', '', ['🐆 a cheetah', '🐢 a turtle']], ['Which is slower?', '🐌 a snail', '', ['🐌 a snail', '🐇 a rabbit']]
  ].map(([q, a, , w]) => [q, a, `${b(a)} is the answer.`, w]))),

  /* ================= States of matter, heat and change ================= */
  sk('SolLiq', 'Classify solids and liquids', 'States of matter', [1, 2], cls(['Solid', 'Liquid'], s => `Is ${b(s)} a solid or a liquid?`, [
    ['a rock', 'Solid'], ['milk', 'Liquid'], ['a book', 'Solid'], ['juice', 'Liquid'], ['an ice cube', 'Solid'], ['rain', 'Liquid'], ['a spoon', 'Solid'], ['honey', 'Liquid'], ['a crayon', 'Solid'], ['soup', 'Liquid'], ['a shoe', 'Solid'], ['shampoo', 'Liquid']
  ].map(([s, c]) => [s, c, c === 'Solid' ? 'A solid keeps its own shape.' : 'A liquid flows and takes the shape of its container.']))),
  sk('SLG', 'Classify matter as solid, liquid or gas', 'States of matter', G(3, 5), cls(['Solid', 'Liquid', 'Gas'], s => `Is ${b(s)} a solid, a liquid or a gas?`, [
    ['a brick', 'Solid'], ['steam', 'Gas'], ['vinegar', 'Liquid'], ['the air in a tire', 'Gas'], ['a coin', 'Solid'], ['olive oil', 'Liquid'], ['carbon dioxide', 'Gas'], ['a pencil', 'Solid'],
    ['seawater', 'Liquid'], ['helium in a balloon', 'Gas'], ['an ice cube', 'Solid'], ['water vapour', 'Gas'], ['maple syrup', 'Liquid'], ['sand', 'Solid']
  ].map(([s, c]) => [s, c, { Solid: 'Solids have a fixed shape and volume.', Liquid: 'Liquids have a fixed volume but take the shape of their container.', Gas: 'Gases spread out to fill any container.' }[c]]))),
  sk('HeatCool', 'Changes caused by heating and cooling', 'Heat and thermal energy', [1, 2, 3], fx([
    ['What happens to an ice cube left in a warm room?', 'It melts into water.', ['It gets bigger.', 'It turns into a rock.', 'It stays the same.']],
    ['What happens to water put in the freezer?', 'It freezes into ice.', ['It boils.', 'It turns into juice.', 'It disappears.']],
    ['What happens to chocolate left in a hot car?', 'It melts.', ['It freezes.', 'It turns into milk.', 'It gets harder.']],
    ['What happens to a puddle on a hot, sunny day?', 'It dries up (evaporates).', ['It freezes.', 'It gets deeper.', 'It turns into mud forever.']],
    ['What happens to melted wax when it cools?', 'It hardens into a solid.', ['It boils.', 'It turns into a gas.', 'It stays runny forever.']],
    ['What happens to an egg when it is cooked?', 'It turns from runny to firm.', ['It turns into a chick.', 'It melts.', 'It stays runny.']],
    ['What happens to bread in a toaster?', 'It turns brown and crunchy.', ['It turns into dough.', 'It melts.', 'It turns green.']]
  ])),
  sk('PhaseCh', 'Heating, cooling and changes of state', 'Heat and thermal energy', G(3, 8), () => {
    const ch = [['a solid', 'a liquid', 'Melting', 'heating'], ['a liquid', 'a solid', 'Freezing', 'cooling'], ['a liquid', 'a gas', 'Evaporation (boiling)', 'heating'],
      ['a gas', 'a liquid', 'Condensation', 'cooling'], ['a solid', 'a gas', 'Sublimation', 'heating'], ['a gas', 'a solid', 'Deposition', 'cooling']];
    const [from, to, name, hc] = pick(ch);
    return Math.random() < 0.5
      ? mc(`What is the change from ${b(from)} to ${b(to)} called?`, name, ch.map(c => c[2]), `${from} → ${to} is ${b(name.toLowerCase())}; it happens by ${hc}.`)
      : mc(`Does ${b(name.toLowerCase())} need heating or cooling?`, cap(hc), ['Heating', 'Cooling'], `${name}: ${from} → ${to}, caused by ${hc}.`, 2);
  }),
  sk('HeatFlow', 'Predict heat flow', 'Heat and thermal energy', G(3, 8), qa([
    ['You hold a cup of hot cocoa. Which way does heat flow?', 'From the cocoa to your hands'], ['You put an ice pack on a bump. Which way does heat flow?', 'From your skin to the ice pack'],
    ['A metal spoon sits in hot soup. Which way does heat flow?', 'From the soup to the spoon'], ['A cold drink sits on a warm table. Which way does heat flow?', 'From the table to the drink'],
    ['You step onto cold tile with bare feet. Which way does heat flow?', 'From your feet to the tile'], ['A warm pie cools on a windowsill. Which way does heat flow?', 'From the pie to the air']
  ].map(([q, a]) => [q, a, 'Heat always flows from a warmer object to a cooler one.', [a, a.replace(/^From (.*) to (.*)$/, 'From $2 to $1'), 'Heat does not flow', 'Cold flows into the warmer object']]))),
  sk('PhChem', 'Identify physical and chemical changes', 'Physical and chemical change', [3, 4, 6, 7, 8], cls(['Physical change', 'Chemical change'], s => `Is this a physical or chemical change?<br>${em(s)}`, [
    ['Tearing paper', 'Physical change'], ['Burning a candle wick', 'Chemical change'], ['Freezing juice into ice pops', 'Physical change'], ['A bike chain rusting', 'Chemical change'],
    ['Melting butter', 'Physical change'], ['Baking bread', 'Chemical change'], ['Chopping carrots', 'Physical change'], ['Fireworks exploding', 'Chemical change'],
    ['Dissolving salt in water', 'Physical change'], ['Vinegar and baking soda fizzing', 'Chemical change'], ['Bending a wire', 'Physical change'], ['A banana turning brown', 'Chemical change']
  ].map(([s, c]) => [s, c, c === 'Physical change' ? 'No new substance is made.' : 'A new substance is made (signs: gas, colour change, heat, light).']))),
  sk('Mixt', 'Identify mixtures and pure substances', 'Properties of matter', G(5, 8), cls(['Pure substance', 'Mixture'], s => `Is ${b(s)} a pure substance or a mixture?`, [
    ['gold', 'Pure substance'], ['distilled water', 'Pure substance'], ['table salt', 'Pure substance'], ['oxygen', 'Pure substance'], ['sugar', 'Pure substance'], ['carbon dioxide', 'Pure substance'],
    ['trail mix', 'Mixture'], ['salt water', 'Mixture'], ['air', 'Mixture'], ['lemonade', 'Mixture'], ['soil', 'Mixture'], ['salad', 'Mixture']
  ].map(([s, c]) => [s, c, c === 'Mixture' ? 'A mixture contains substances that are physically combined.' : 'A pure substance has only one kind of matter.']))),
  sk('Dens', 'Calculate density, mass and volume', 'Properties of matter', G(5, 10), () => {
    const d = pick([1, 2, 3, 4, 5, 8, 10, 11]), v = ri(2, 20), m = d * v;
    const kind = pick(['d', 'm', 'v']);
    if (kind === 'd') return num(`An object has a mass of ${b(m + ' g')} and a volume of ${b(v + ' cm³')}. What is its density in g/cm³?`, d, `density = mass ÷ volume = ${m} ÷ ${v} = ${b(d)} g/cm³.`);
    if (kind === 'm') return num(`An object has a density of ${b(d + ' g/cm³')} and a volume of ${b(v + ' cm³')}. What is its mass in grams?`, m, `mass = density × volume = ${d} × ${v} = ${b(m)} g.`);
    return num(`An object has a mass of ${b(m + ' g')} and a density of ${b(d + ' g/cm³')}. What is its volume in cm³?`, v, `volume = mass ÷ density = ${m} ÷ ${d} = ${b(v)} cm³.`);
  }),
  sk('DensCmp', 'Compare the densities of substances', 'Properties of matter', G(6, 8), qa([
    ['Water has a density of 1.0 g/cm³. Will a cork (0.24 g/cm³) sink or float in water?', 'Float', 'Less dense objects float.', ['Float', 'Sink']],
    ['Water has a density of 1.0 g/cm³. Will a steel bolt (7.8 g/cm³) sink or float in water?', 'Sink', 'Denser objects sink.', ['Sink', 'Float']],
    ['Oil floats on top of water. Which is denser?', 'Water', 'The denser liquid sinks to the bottom.', ['Water', 'Oil', 'They have equal density']],
    ['Two blocks have the same volume. Block A has more mass. Which is denser?', 'Block A', 'Density = mass ÷ volume.', ['Block A', 'Block B', 'They have equal density']],
    ['Ice (0.92 g/cm³) is placed in water (1.0 g/cm³). What happens?', 'It floats', 'Ice is less dense than water.', ['It floats', 'It sinks', 'It dissolves']],
    ['A rock is cut in half. What happens to the density of each half?', 'It stays the same', 'Density is a property of the material, not the size.', ['It stays the same', 'It is cut in half', 'It doubles']]
  ])),
  sk('ConsMat', 'Understand conservation of matter', 'Properties of matter', G(5, 8), () => {
    const a = ri(5, 60), c = ri(5, 60);
    return Math.random() < 0.5
      ? num(`In a sealed container, ${b(a + ' g')} of vinegar reacts with ${b(c + ' g')} of baking soda. What is the total mass of the products (in grams)?`, a + c, `Matter is conserved in a closed system: ${a} + ${c} = ${b(a + c)} g.`)
      : num(`In a closed flask, reactants have a total mass of ${b((a + c) + ' g')}. One product has a mass of ${b(a + ' g')}. What is the mass of the other product (in grams)?`, c, `${a + c} − ${a} = ${b(c)} g. Mass is not created or destroyed.`);
  }),
  sk('ReactProd', 'Identify reactants and products', 'Physical and chemical change', G(5, 8), () => {
    const rx = [['2H₂ + O₂ → 2H₂O', ['H₂', 'O₂'], ['H₂O']], ['CH₄ + 2O₂ → CO₂ + 2H₂O', ['CH₄', 'O₂'], ['CO₂', 'H₂O']], ['Fe + S → FeS', ['Fe', 'S'], ['FeS']],
      ['CaCO₃ → CaO + CO₂', ['CaCO₃'], ['CaO', 'CO₂']], ['2Na + Cl₂ → 2NaCl', ['Na', 'Cl₂'], ['NaCl']], ['C + O₂ → CO₂', ['C', 'O₂'], ['CO₂']]];
    const [eq, r, p] = pick(rx); const askR = Math.random() < 0.5;
    const ans = pick(askR ? r : p);
    return mc(`${b(eq)}<br>Which is a ${askR ? 'reactant' : 'product'}?`, ans, [...r, ...p], `Reactants are on the left of the arrow; products are on the right.`);
  }),
  sk('PartMot', 'Particle motion and energy', 'Particle motion and energy', G(5, 10), fx([
    ['As a substance is heated, what happens to its particles?', 'They move faster.', ['They move slower.', 'They stop moving.', 'They get bigger.']],
    ['In which state of matter do particles move the fastest?', 'Gas', ['Solid', 'Liquid', 'They all move at the same speed']],
    ['In which state are particles packed tightly and only vibrate in place?', 'Solid', ['Liquid', 'Gas', 'Plasma']],
    ['What happens to gas pressure in a sealed container when it is heated?', 'It increases.', ['It decreases.', 'It stays the same.', 'It drops to zero.']],
    ['Temperature is a measure of the average … of particles.', 'kinetic energy', ['colour', 'size', 'number']],
    ['Why does a balloon shrink in a cold car?', 'The gas particles slow down and push less on the balloon.', ['The balloon leaks air when it is cold.', 'The particles get smaller in the cold.', 'Cold air pushes the balloon inward from outside only.']],
    ['When water vapour condenses, its particles …', 'slow down and move closer together.', ['speed up and spread apart.', 'stop moving completely.', 'turn into new particles.']],
    ['In which state do particles slide past each other but stay close?', 'Liquid', ['Solid', 'Gas', 'Crystal']]
  ])),
  /* ================= Force and motion ================= */
  sk('PshPl', 'Push and pull', 'Force and motion', [1, 2], cls(['Push', 'Pull'], s => `Is this a push or a pull?<br>${big(s.split('|')[0])} ${em(s.split('|')[1])}`, [
    ['⚽|kicking a ball', 'Push'], ['🛒|moving a cart forward', 'Push'], ['🚪|shutting a door', 'Push'], ['🪁|flying a kite on a string', 'Pull'], ['🐕|walking a dog on a leash', 'Pull'],
    ['🧲|a magnet picking up a nail', 'Pull'], ['🛷|dragging a sled', 'Pull'], ['🎳|rolling a bowling ball', 'Push'], ['🗄️|opening a drawer', 'Pull'], ['🧒|pushing a friend on a swing', 'Push']
  ].map(([s, c]) => [s, c, c === 'Push' ? 'A push moves something away from you.' : 'A pull moves something toward you.']))),
  sk('BalForce', 'Balanced and unbalanced forces', 'Force and motion', G(3, 10), cls(['Balanced forces', 'Unbalanced forces'], s => `Are the forces balanced or unbalanced?<br>${em(s)}`, [
    ['A book sits still on a table.', 'Balanced forces'], ['Two teams pull a rope equally hard and nobody moves.', 'Balanced forces'], ['A car drives at a steady speed in a straight line.', 'Balanced forces'], ['A lamp hangs still from the ceiling.', 'Balanced forces'],
    ['A soccer ball starts rolling after a kick.', 'Unbalanced forces'], ['A bike speeds up going downhill.', 'Unbalanced forces'], ['One team pulls harder and wins tug-of-war.', 'Unbalanced forces'], ['A sled slows down on grass.', 'Unbalanced forces']
  ].map(([s, c]) => [s, c, c === 'Balanced forces' ? 'Balanced forces do not change motion.' : 'Unbalanced forces change speed or direction.']))),
  sk('MassForce', 'How does mass affect force and acceleration?', 'Force and motion', G(3, 10), qa([
    ['You push an empty cart and a full cart with the same force. Which speeds up more?', 'The empty cart', 'Less mass means more acceleration for the same force.', ['The empty cart', 'The full cart', 'They speed up the same']],
    ['To give a bowling ball and a tennis ball the same acceleration, which needs more force?', 'The bowling ball', 'More mass needs more force.', ['The bowling ball', 'The tennis ball', 'They need the same force']],
    ['If you push twice as hard on the same object, its acceleration …', 'doubles', 'Acceleration is proportional to force.', ['doubles', 'halves', 'stays the same']],
    ['A truck and a bike have the same speed. Which is harder to stop?', 'The truck', 'Greater mass needs more force to stop.', ['The truck', 'The bike', 'They are equally hard to stop']],
    ['A small ball and a big ball are kicked equally hard. Which goes faster?', 'The small (lighter) ball', 'Less mass, more acceleration.', ['The small (lighter) ball', 'The big (heavier) ball', 'They go equally fast']],
    ['If an object\'s mass doubles but the force stays the same, its acceleration …', 'halves', 'a = F ÷ m.', ['halves', 'doubles', 'stays the same']]
  ])),
  sk('Accel', 'Identify whether objects are accelerating', 'Force and motion', G(6, 10), cls(['Accelerating', 'Not accelerating'], s => `Is the object accelerating?<br>${em(s)}`, [
    ['A car speeds up from a stop sign.', 'Accelerating'], ['A bus slows down at a stop.', 'Accelerating'], ['A runner rounds a curve at constant speed.', 'Accelerating'], ['A ball falls from a roof.', 'Accelerating'],
    ['A train moves at a steady 80 km/h on a straight track.', 'Not accelerating'], ['A parked bike sits on the sidewalk.', 'Not accelerating'], ['An airplane cruises straight at a constant speed.', 'Not accelerating'], ['A satellite circles Earth at constant speed.', 'Accelerating']
  ].map(([s, c]) => [s, c, 'Acceleration is any change in speed OR direction.']))),
  sk('Newton3', 'Predict forces using Newton\'s third law of motion', 'Force and motion', G(6, 10), qa([
    ['A swimmer pushes the water backward. What does the water do?', 'Pushes the swimmer forward'], ['A rocket pushes gas downward. What does the gas do?', 'Pushes the rocket upward'],
    ['You push on a wall with 50 N. How hard does the wall push on you?', '50 N, in the opposite direction'], ['A skater pushes off a wall. What happens to the skater?', 'The skater moves away from the wall'],
    ['A hammer hits a nail. What does the nail do to the hammer?', 'Pushes back on the hammer with equal force'], ['A bird pushes air down with its wings. What does the air do?', 'Pushes the bird up']
  ].map(([q, a]) => [q, a, 'For every action there is an equal and opposite reaction.', [a, 'Nothing happens', 'Pushes in the same direction', 'Disappears']]))),
  sk('SpdCalc', 'Calculate speed, distance and time', 'Speed, distance and time', [6, 7, 9, 10], () => {
    const v = ri(2, 30), t = ri(2, 12), d = v * t; const k = pick(['v', 'd', 't']);
    if (k === 'v') return num(`A cyclist travels ${b(d + ' km')} in ${b(t + ' h')}. What is the average speed in km/h?`, v, `speed = distance ÷ time = ${d} ÷ ${t} = ${b(v)} km/h.`);
    if (k === 'd') return num(`A train travels at ${b(v + ' m/s')} for ${b(t + ' s')}. How far does it go in metres?`, d, `distance = speed × time = ${v} × ${t} = ${b(d)} m.`);
    return num(`A runner covers ${b(d + ' m')} at ${b(v + ' m/s')}. How many seconds does it take?`, t, `time = distance ÷ speed = ${d} ÷ ${v} = ${b(t)} s.`);
  }),
  sk('CmpSpd', 'Compare the speeds of moving objects', 'Force and motion', [3, 4], () => {
    const a = ri(10, 40), b2 = ri(10, 40), t = ri(2, 5);
    if (a === b2) return mc(`In ${t} seconds, a toy car goes ${a} m and a toy truck goes ${b2} m. Which is faster?`, 'They are equally fast', ['The car', 'The truck', 'They are equally fast'], 'Same distance in the same time means the same speed.', 3);
    return mc(`In ${t} seconds, a toy car goes ${b(a + ' m')} and a toy truck goes ${b(b2 + ' m')}. Which is faster?`, a > b2 ? 'The car' : 'The truck', ['The car', 'The truck', 'They are equally fast'], 'In the same time, the faster object goes farther.', 3);
  }),
  sk('MagAR', 'Identify magnets that attract or repel', 'Magnets', [2, 3, 4], () => {
    const p = pick([['N', 'S'], ['S', 'N'], ['N', 'N'], ['S', 'S']]);
    const att = p[0] !== p[1];
    return mc(`Two magnets are placed so that a ${b(p[0])} pole faces a ${b(p[1])} pole. Will they attract or repel?`, att ? 'Attract' : 'Repel', ['Attract', 'Repel'], att ? 'Opposite poles attract.' : 'Like poles repel.', 2);
  }),

  /* ================= Light, sound and waves ================= */
  sk('LightThru', 'Which lets light go through?', 'Light and sound', [1, 2, 3, 4], cls(['Transparent', 'Translucent', 'Opaque'], s => `How much light passes through ${b(s)}?`, [
    ['a clear window', 'Transparent'], ['clean water', 'Transparent'], ['plastic wrap', 'Transparent'], ['wax paper', 'Translucent'], ['frosted glass', 'Translucent'], ['a thin paper napkin', 'Translucent'],
    ['a brick wall', 'Opaque'], ['a wooden door', 'Opaque'], ['a book', 'Opaque'], ['a metal pan', 'Opaque']
  ].map(([s, c]) => [s, c, { Transparent: 'Almost all light passes through.', Translucent: 'Some light passes through.', Opaque: 'No light passes through.' }[c]]))),
  sk('Shadow', 'Investigate shadows', 'Light and sound', [1, 2, 5], fx([
    ['What causes a shadow?', 'An object blocks light.', ['An object reflects light.', 'Light passes through an object.', 'The ground makes it dark.']],
    ['When is your shadow longest on a sunny day?', 'Early morning or late afternoon', ['Around noon', 'At midnight', 'It never changes']],
    ['When is your shadow shortest on a sunny day?', 'Around noon', ['Early morning', 'Late afternoon', 'At sunset']],
    ['A flashlight moves closer to a toy. What happens to the toy\'s shadow?', 'It gets bigger.', ['It gets smaller.', 'It disappears.', 'It changes colour.']],
    ['Which object makes the darkest shadow?', 'A wooden block (opaque)', ['A clear glass (transparent)', 'Wax paper (translucent)', 'Plastic wrap (transparent)']],
    ['The Sun is in the east in the morning. Which way does your shadow point?', 'West', ['East', 'Straight down', 'Toward the Sun']]
  ])),
  sk('Sound', 'Sound and vibration', 'Light and sound', [1, 2, 3, 4], fx([
    ['What makes sound?', 'Vibrations', ['Light', 'Colours', 'Shadows']],
    ['How can you make a guitar string sound higher?', 'Make it tighter or shorter', ['Make it looser or longer', 'Paint it', 'Pluck it more gently']],
    ['Which travels faster: light or sound?', 'Light', ['Sound', 'They travel at the same speed', 'It depends on the colour']],
    ['Why do you see lightning before you hear thunder?', 'Light travels faster than sound.', ['Thunder happens later.', 'Sound travels faster than light.', 'Our eyes are faster than our ears.']],
    ['A drum is hit harder. What happens to the sound?', 'It gets louder.', ['It gets quieter.', 'It gets higher.', 'It stops.']],
    ['Can sound travel through empty space?', 'No — it needs a material such as air.', ['Yes, it travels best in space.', 'Yes, but only at night.', 'Only very loud sounds can.']]
  ])),
  sk('WaveP', 'Compare amplitudes, wavelengths and frequencies of waves', 'Waves', G(8, 10), fx([
    ['What is the distance from one crest of a wave to the next called?', 'Wavelength', ['Amplitude', 'Frequency', 'Speed']],
    ['What is the height of a wave from its rest position called?', 'Amplitude', ['Wavelength', 'Frequency', 'Period']],
    ['The number of waves passing a point each second is the …', 'Frequency', ['Amplitude', 'Wavelength', 'Crest']],
    ['A louder sound has a greater …', 'Amplitude', ['Wavelength', 'Speed', 'Period']],
    ['A higher-pitched sound has a higher …', 'Frequency', ['Amplitude', 'Wavelength', 'Volume']],
    ['If frequency increases and wave speed stays the same, the wavelength …', 'Decreases', ['Increases', 'Stays the same', 'Doubles']],
    ['Which wave carries more energy (same type, same frequency)?', 'The one with the larger amplitude', ['The one with the smaller amplitude', 'They carry the same energy', 'The one that is quieter']],
    ['In a transverse wave, particles move …', 'Perpendicular to the wave direction', ['Parallel to the wave direction', 'In circles only', 'Not at all']]
  ])),
  sk('EMwave', 'Electromagnetic waves', 'Waves', G(8, 10), qa([
    ['Which electromagnetic waves have the longest wavelength?', 'Radio waves'], ['Which electromagnetic waves have the highest energy?', 'Gamma rays'],
    ['Which type of wave do TV remotes and heat lamps use?', 'Infrared'], ['Which waves cause sunburn?', 'Ultraviolet'], ['Which waves are used to see bones in a doctor\'s office?', 'X-rays'],
    ['Which waves heat food in a microwave oven?', 'Microwaves'], ['Which is the only part of the spectrum humans can see?', 'Visible light'], ['How fast do all electromagnetic waves travel in a vacuum?', 'The speed of light']
  ].map(([q, a]) => [q, a, 'Order by energy: radio < microwave < infrared < visible < ultraviolet < X-ray < gamma.', [a, ...sample(['Radio waves', 'Gamma rays', 'Infrared', 'Ultraviolet', 'X-rays', 'Microwaves', 'Visible light', 'The speed of sound'], 3, [a])]]))),
  sk('ReflAbs', 'Transmission, reflection and absorption', 'Waves', G(4, 8), cls(['Reflection', 'Absorption', 'Transmission'], s => `What happens to the light (or sound)?<br>${em(s)}`, [
    ['You see yourself in a mirror.', 'Reflection'], ['A black shirt gets hot in the sun.', 'Absorption'], ['Sunlight shines through a window.', 'Transmission'], ['An echo bounces off a canyon wall.', 'Reflection'],
    ['A thick curtain blocks and soaks up sound.', 'Absorption'], ['Music passes through the wall from next door.', 'Transmission'], ['The moon shines with light from the sun.', 'Reflection'], ['Dark asphalt warms up on a sunny day.', 'Absorption']
  ].map(([s, c]) => [s, c, { Reflection: 'The wave bounces off.', Absorption: 'The wave\'s energy is taken in.', Transmission: 'The wave passes through.' }[c]]))),

  /* ================= Energy and electricity ================= */
  sk('EnTrans', 'Energy transformations', 'Energy', G(4, 8), qa([
    ['A battery-powered flashlight is on. What energy change happens in the battery?', 'Chemical → electrical'], ['A toaster browns bread. What energy change happens?', 'Electrical → thermal'],
    ['A solar panel powers a calculator. What energy change happens?', 'Light → electrical'], ['You eat food and then run. What energy change happens in your body?', 'Chemical → kinetic'],
    ['A wind turbine generates power. What energy change happens?', 'Kinetic → electrical'], ['A light bulb glows. What energy change happens?', 'Electrical → light'],
    ['A campfire burns wood. What energy change happens?', 'Chemical → thermal and light'], ['A speaker plays music. What energy change happens?', 'Electrical → sound']
  ].map(([q, a]) => [q, a, 'Energy is not created or destroyed; it changes form.', [a, ...sample(['Chemical → electrical', 'Electrical → thermal', 'Light → electrical', 'Chemical → kinetic', 'Kinetic → electrical', 'Electrical → light', 'Sound → chemical', 'Thermal → nuclear'], 3, [a])]]))),
  sk('PotKin', 'Identify changes in potential and kinetic energy', 'Energy', G(5, 8), fx([
    ['A roller coaster climbs the first hill. What happens to its gravitational potential energy?', 'It increases.', ['It decreases.', 'It stays the same.', 'It disappears.']],
    ['The coaster races down the hill. What happens to its kinetic energy?', 'It increases.', ['It decreases.', 'It stays the same.', 'It becomes zero.']],
    ['At the very top of a swing\'s path, which energy is greatest?', 'Potential energy', ['Kinetic energy', 'Sound energy', 'Electrical energy']],
    ['At the bottom of a swing\'s path, which energy is greatest?', 'Kinetic energy', ['Potential energy', 'Chemical energy', 'Light energy']],
    ['A ball is thrown straight up. As it rises, its kinetic energy …', 'decreases.', ['increases.', 'stays the same.', 'doubles.']],
    ['A book is moved from the floor to a high shelf. Its potential energy …', 'increases.', ['decreases.', 'stays the same.', 'becomes kinetic energy.']],
    ['A truck and a bike move at the same speed. Which has more kinetic energy?', 'The truck', ['The bike', 'They have the same', 'Neither has any']],
    ['A car doubles its speed. Its kinetic energy …', 'becomes four times as large.', ['doubles.', 'stays the same.', 'halves.']]
  ])),
  sk('Circuit', 'Electric circuits', 'Electricity and magnetism', G(4, 8), fx([
    ['A bulb lights only when the circuit is …', 'closed (a complete loop).', ['open (a broken loop).', 'made of rubber.', 'turned upside down.']],
    ['What does a switch do in a circuit?', 'Opens or closes the circuit', ['Stores electricity', 'Makes light', 'Changes the battery']],
    ['In a series circuit, if one bulb burns out, the others …', 'go out too.', ['stay on.', 'get brighter.', 'start blinking.']],
    ['In a parallel circuit, if one bulb burns out, the others …', 'stay on.', ['go out too.', 'turn off and on.', 'explode.']],
    ['What provides the energy in a simple circuit?', 'The battery', ['The bulb', 'The switch', 'The wire']],
    ['Which is the best material for wires?', 'Copper', ['Rubber', 'Plastic', 'Wood']],
    ['Adding more bulbs to a series circuit makes each bulb …', 'dimmer.', ['brighter.', 'the same.', 'change colour.']],
    ['Homes use which kind of circuit so each light works on its own?', 'Parallel', ['Series', 'Open', 'Broken']]
  ])),
  sk('CondIns', 'Conductors and insulators', 'Electricity and magnetism', G(5, 7), cls(['Conductor', 'Insulator'], s => `Is ${b(s)} an electrical conductor or insulator?`, [
    ['a copper wire', 'Conductor'], ['a silver ring', 'Conductor'], ['an aluminum can', 'Conductor'], ['a steel nail', 'Conductor'], ['salt water', 'Conductor'], ['graphite (pencil lead)', 'Conductor'],
    ['a rubber band', 'Insulator'], ['a plastic straw', 'Insulator'], ['a wooden ruler', 'Insulator'], ['a glass marble', 'Insulator'], ['dry cotton', 'Insulator'], ['a ceramic plate', 'Insulator']
  ].map(([s, c]) => [s, c, c === 'Conductor' ? 'Conductors let electricity flow easily (most metals).' : 'Insulators block the flow of electricity.']))),
  sk('Static', 'Static electricity and charged objects', 'Electricity and magnetism', G(6, 8), fx([
    ['Two balloons both have a negative charge. What happens when they are brought close?', 'They repel.', ['They attract.', 'Nothing happens.', 'They pop.']],
    ['A negatively charged balloon is held near a positively charged one. What happens?', 'They attract.', ['They repel.', 'Nothing happens.', 'Both become neutral instantly.']],
    ['Rubbing a balloon on your hair moves which particles?', 'Electrons', ['Protons', 'Neutrons', 'Atoms of hair']],
    ['A charged balloon sticks to a wall because …', 'opposite charges attract.', ['like charges attract.', 'the wall is magnetic.', 'the balloon is sticky.']],
    ['Lightning is a giant …', 'static discharge.', ['magnet.', 'sound wave.', 'chemical reaction.']],
    ['After you shuffle on carpet, a doorknob gives you a shock because …', 'extra charge jumps to the metal.', ['the doorknob is hot.', 'the carpet is magnetic.', 'your shoes make electricity.']]
  ])),
];

function cap(s) { return s[0].toUpperCase() + s.slice(1); }
