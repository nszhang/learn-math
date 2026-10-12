/* Science — life science (grades 1–12). Specs: { k, t, s, g, gen }. */
import { classify, pairs } from '../quiz.js';
import { ri, pick, shuffle, sample, uniq, b, em, big, mc } from '../eng/words.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const G = (a, z) => Array.from({ length: z - a + 1 }, (_, i) => a + i);
const num = (prompt, answer, explain) => ({ type: 'num', prompt, answer, explain });
const cls = (categories, prompt, items) => classify({ categories, prompt, items });
const qa = (items, prompt = q => q) => pairs({ prompt, items });
// [question, answer, [hand-picked wrong answers]]
const fx = items => pairs({ prompt: q => q, items: items.map(([q, a, w]) => [q, a, `The answer is ${b(a)}.`, [a, ...w]]) });
// items [q, a] with wrong answers drawn from the other answers
const facts = (items, note) => pairs({ prompt: q => q, items: items.map(([q, a]) => [q, a, note ? note(a) : `The answer is ${b(a)}.`]) });

// Punnett-square helpers
const gametes = g => [g[0], g[1]];
const cross = (p1, p2) => gametes(p1).flatMap(x => gametes(p2).map(y => [x, y].sort((m, n) => (m === m.toUpperCase() ? -1 : 1) - (n === n.toUpperCase() ? -1 : 1)).join('')));
const CODONS = { AUG: 'Met (start)', UUU: 'Phe', UUC: 'Phe', GGC: 'Gly', GGA: 'Gly', GCU: 'Ala', GCC: 'Ala', UGG: 'Trp', CAU: 'His', AAA: 'Lys', AAG: 'Lys', GAU: 'Asp', GAA: 'Glu', UAC: 'Tyr', CCU: 'Pro', UCU: 'Ser', CUU: 'Leu', AUU: 'Ile', GUU: 'Val', ACU: 'Thr', UAA: 'Stop', UAG: 'Stop', UGA: 'Stop' };
const DNA_TO_MRNA = { A: 'U', T: 'A', C: 'G', G: 'C' };

export const LIFE_SPECS = [
  /* ================= Classification ================= */
  sk('LivNon', 'Identify living and nonliving things', 'Classification', [1, 2], cls(['Living', 'Nonliving'], s => `Is ${s} living or nonliving?`, [
    ['🌳 a tree', 'Living'], ['🐶 a dog', 'Living'], ['🍄 a mushroom', 'Living'], ['🐛 a caterpillar', 'Living'], ['🌻 a sunflower', 'Living'], ['👶 a baby', 'Living'],
    ['🪨 a rock', 'Nonliving'], ['🚗 a car', 'Nonliving'], ['🧸 a teddy bear', 'Nonliving'], ['☁️ a cloud', 'Nonliving'], ['💧 water', 'Nonliving'], ['🤖 a robot', 'Nonliving']
  ].map(([s, c]) => [b(s), c, c === 'Living' ? 'Living things grow, need food and water, and make new living things.' : 'Nonliving things do not grow, eat or reproduce.']))),
  sk('PlAn', 'Identify plants and animals', 'Classification', [1], cls(['Plant', 'Animal'], s => `Is ${s} a plant or an animal?`, [
    ['🌵 a cactus', 'Plant'], ['🌷 a tulip', 'Plant'], ['🌲 a pine tree', 'Plant'], ['🌿 a fern', 'Plant'], ['🥕 a carrot plant', 'Plant'],
    ['🐝 a bee', 'Animal'], ['🐟 a fish', 'Animal'], ['🦉 an owl', 'Animal'], ['🐌 a snail', 'Animal'], ['🐸 a frog', 'Animal']
  ].map(([s, c]) => [b(s), c, c === 'Plant' ? 'Plants make their own food from sunlight.' : 'Animals eat food and can usually move around.']))),
  sk('Vert5', 'Identify mammals, birds, fish, reptiles and amphibians', 'Classification', G(3, 8), cls(['Mammal', 'Bird', 'Fish', 'Reptile', 'Amphibian'], s => `What kind of animal is ${b(s)}?`, [
    ['a dolphin', 'Mammal', 'It breathes air and feeds its young milk.'], ['a bat', 'Mammal', 'It has fur and feeds its young milk.'], ['a whale', 'Mammal', 'It breathes air and feeds its young milk.'],
    ['a penguin', 'Bird', 'It has feathers and lays eggs.'], ['an ostrich', 'Bird', 'It has feathers and lays eggs.'], ['a hummingbird', 'Bird', 'It has feathers and lays eggs.'],
    ['a shark', 'Fish', 'It breathes with gills.'], ['a seahorse', 'Fish', 'It breathes with gills.'], ['a salmon', 'Fish', 'It breathes with gills.'],
    ['a crocodile', 'Reptile', 'It has dry, scaly skin.'], ['a gecko', 'Reptile', 'It has dry, scaly skin.'], ['a tortoise', 'Reptile', 'It has dry, scaly skin.'],
    ['a frog', 'Amphibian', 'It lives in water when young and on land as an adult; it has moist skin.'], ['a salamander', 'Amphibian', 'It has moist skin and lays eggs in water.'], ['a newt', 'Amphibian', 'It has moist skin.']
  ])),
  sk('VertInv', 'Identify vertebrates and invertebrates', 'Classification', G(4, 8), cls(['Vertebrate', 'Invertebrate'], s => `Is ${b(s)} a vertebrate or an invertebrate?`, [
    ['a horse', 'Vertebrate'], ['an eagle', 'Vertebrate'], ['a trout', 'Vertebrate'], ['a snake', 'Vertebrate'], ['a toad', 'Vertebrate'], ['a human', 'Vertebrate'],
    ['a jellyfish', 'Invertebrate'], ['an earthworm', 'Invertebrate'], ['a spider', 'Invertebrate'], ['an octopus', 'Invertebrate'], ['a crab', 'Invertebrate'], ['a butterfly', 'Invertebrate']
  ].map(([s, c]) => [s, c, c === 'Vertebrate' ? 'Vertebrates have a backbone.' : 'Invertebrates have no backbone.']))),
  sk('Kingdom', 'Describe, classify and compare kingdoms', 'Classification', [7, 8], cls(['Animals', 'Plants', 'Fungi', 'Protists', 'Bacteria'], s => `Which kingdom does ${b(s)} belong to?`, [
    ['a mushroom', 'Fungi', 'Fungi absorb food and have cell walls made of chitin.'], ['yeast', 'Fungi', 'Yeast is a single-celled fungus.'], ['a moss', 'Plants', 'Mosses make food by photosynthesis.'],
    ['a maple tree', 'Plants', 'Plants make their own food.'], ['an amoeba', 'Protists', 'Amoebas are single-celled organisms with a nucleus.'], ['a paramecium', 'Protists', 'A paramecium is a single-celled protist.'],
    ['E. coli', 'Bacteria', 'Bacteria are single cells without a nucleus.'], ['Streptococcus', 'Bacteria', 'Bacteria are single cells without a nucleus.'], ['a sea sponge', 'Animals', 'Sponges are simple animals.'], ['a beetle', 'Animals', 'Beetles are animals.']
  ])),
  sk('SciName', 'Identify common and scientific names', 'Classification', G(6, 8), fx([
    ['What is the common name of <em>Homo sapiens</em>?', 'Human', ['Gorilla', 'Chimpanzee', 'Wolf']],
    ['What is the common name of <em>Canis lupus</em>?', 'Grey wolf', ['Red fox', 'House cat', 'Lion']],
    ['What is the common name of <em>Felis catus</em>?', 'House cat', ['Lion', 'Tiger', 'Grey wolf']],
    ['What is the common name of <em>Ursus maritimus</em>?', 'Polar bear', ['Grizzly bear', 'Walrus', 'Seal']],
    ['What is the common name of <em>Panthera leo</em>?', 'Lion', ['Tiger', 'Leopard', 'House cat']],
    ['What is the common name of <em>Apis mellifera</em>?', 'Honeybee', ['Wasp', 'Ant', 'Butterfly']],
    ['In a scientific name such as <em>Panthera leo</em>, the first word is the …', 'genus', ['species', 'kingdom', 'family']],
    ['In a scientific name such as <em>Panthera leo</em>, the second word is the …', 'species', ['genus', 'phylum', 'order']]
  ])),
  sk('Taxon', 'Levels of classification', 'Classification', [7, 8, 9, 10], () => {
    const lv = ['Domain', 'Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];
    const i = ri(0, lv.length - 2);
    return Math.random() < 0.5
      ? mc(`Which level comes right after ${b(lv[i])} (from broadest to most specific)?`, lv[i + 1], lv, `The order is ${lv.join(' → ')}.`)
      : mc('Which is the most specific level of classification?', 'Species', lv, `Species is the most specific level; domain is the broadest.`);
  }),

  /* ================= Animals and plants ================= */
  sk('Parent', 'Match animals to their parents', 'Animals', [1, 2], () => {
    const pairs2 = [['puppy', 'dog 🐶'], ['kitten', 'cat 🐱'], ['calf', 'cow 🐄'], ['foal', 'horse 🐴'], ['lamb', 'sheep 🐑'], ['chick', 'chicken 🐔'], ['tadpole', 'frog 🐸'],
      ['cub', 'bear 🐻'], ['joey', 'kangaroo 🦘'], ['duckling', 'duck 🦆'], ['piglet', 'pig 🐖'], ['fawn', 'deer 🦌'], ['caterpillar', 'butterfly 🦋'], ['kid', 'goat 🐐']];
    const [baby, adult] = pick(pairs2);
    return mc(`A ${b(baby)} grows up to be a …`, adult, pairs2.map(p => p[1]), `A ${baby} is a baby ${adult.split(' ')[0]}.`);
  }),
  sk('Needs', 'What do living things need to survive?', 'Animals', [1, 2], fx([
    ['What do plants need to make their own food?', 'Sunlight, water and air', ['Candy and juice', 'Rocks and sand', 'Darkness and cold']],
    ['What do animals need to survive?', 'Food, water, air and shelter', ['Toys and games', 'Only sunlight', 'Only sleep']],
    ['Why does a bear sleep in a den all winter?', 'For shelter during the cold', ['To find food', 'To get a suntan', 'To meet other bears']],
    ['Why do plants grow toward a window?', 'To get more sunlight', ['To see outside', 'To find water', 'To stay cold']],
    ['What do fish use to get oxygen from water?', 'Gills', ['Lungs', 'Fins', 'Scales']],
    ['What happens to a plant that gets no water?', 'It wilts and may die.', ['It grows faster.', 'It turns into a tree.', 'It changes colour to blue.']]
  ])),
  sk('BodyUse', 'How do animals use their body parts?', 'Animals', [1, 2, 3], fx([
    ['How does a duck use its webbed feet?', 'To paddle through water', ['To climb trees', 'To dig tunnels', 'To catch insects in the air']],
    ['How does an eagle use its sharp claws?', 'To grab its prey', ['To swim', 'To sing', 'To keep warm']],
    ['How does a giraffe use its long neck?', 'To reach leaves high in trees', ['To dig for roots', 'To swim fast', 'To hide underground']],
    ['How does a porcupine use its quills?', 'To protect itself from predators', ['To fly', 'To smell food', 'To swim']],
    ['How does an elephant use its trunk?', 'To grab food and drink water', ['To fly', 'To see in the dark', 'To lay eggs']],
    ['How does a fish use its fins?', 'To steer and balance in water', ['To breathe', 'To see', 'To walk on land']],
    ['How does a woodpecker use its strong beak?', 'To drill holes in wood for insects', ['To swim underwater', 'To carry its babies', 'To keep warm']],
    ['How does a rabbit use its long ears?', 'To hear danger coming', ['To dig', 'To swim', 'To catch fish']]
  ])),
  sk('Adapt', 'Animal adaptations', 'Adaptations and natural selection', G(3, 6), facts([
    ['A polar bear has thick fur and a layer of fat. This helps it …', 'stay warm in the cold'], ['A camel stores fat in its hump. This helps it …', 'survive without food for a long time'],
    ['A chameleon changes colour. This helps it …', 'hide from predators'], ['A hummingbird has a long, thin beak. This helps it …', 'drink nectar from flowers'],
    ['A duck has webbed feet. This helps it …', 'paddle through water'], ['An owl has large eyes. This helps it …', 'see at night'],
    ['A cactus has spines instead of leaves. This helps it …', 'save water and avoid being eaten'], ['A woodpecker has a strong, pointed beak. This helps it …', 'drill into wood for insects']
  ], a => `This adaptation helps the organism ${b(a)}.`)),
  sk('LifeCyc', 'Compare animal life cycles', 'Animals', [3, 4, 6, 7], cls(['Complete metamorphosis', 'Incomplete metamorphosis', 'No metamorphosis'], s => `What kind of life cycle does ${b(s)} have?`, [
    ['a butterfly', 'Complete metamorphosis', 'Egg → larva → pupa → adult.'], ['a beetle', 'Complete metamorphosis', 'Egg → larva → pupa → adult.'], ['a mosquito', 'Complete metamorphosis', 'Egg → larva → pupa → adult.'],
    ['a grasshopper', 'Incomplete metamorphosis', 'Egg → nymph → adult.'], ['a dragonfly', 'Incomplete metamorphosis', 'Egg → nymph → adult.'], ['a cockroach', 'Incomplete metamorphosis', 'Egg → nymph → adult.'],
    ['a dog', 'No metamorphosis', 'The young look like small adults.'], ['a chicken', 'No metamorphosis', 'The chick looks like a small adult.'], ['a human', 'No metamorphosis', 'Babies grow into adults without changing body form.']
  ])),
  sk('PlntFn', 'Identify what plant parts do', 'Plants', [1, 2, 3, 4, 6], fx([
    ['Which plant part takes in water and holds the plant in the ground?', 'Roots', ['Leaves', 'Flower', 'Fruit']],
    ['Which plant part makes food using sunlight?', 'Leaves', ['Roots', 'Seeds', 'Bark']],
    ['Which plant part carries water from the roots to the leaves?', 'Stem', ['Flower', 'Seed', 'Fruit']],
    ['Which plant part makes seeds?', 'Flower', ['Roots', 'Stem', 'Leaves']],
    ['Which plant part protects the seeds?', 'Fruit', ['Roots', 'Stem', 'Leaves']],
    ['Which plant part can grow into a new plant?', 'Seed', ['Leaf', 'Petal', 'Bark']],
    ['Which colourful parts of a flower attract bees?', 'Petals', ['Roots', 'Stem', 'Seeds']]
  ])),
  sk('FrVeg', 'Classify fruits and vegetables as plant parts', 'Plants', [4, 6, 7], cls(['Root', 'Stem', 'Leaf', 'Flower', 'Fruit', 'Seed'], s => `Which plant part do we eat when we eat ${b(s)}?`, [
    ['a carrot', 'Root'], ['a beet', 'Root'], ['celery', 'Stem'], ['asparagus', 'Stem'], ['lettuce', 'Leaf'], ['spinach', 'Leaf'], ['broccoli', 'Flower'], ['cauliflower', 'Flower'],
    ['an apple', 'Fruit'], ['a tomato', 'Fruit'], ['a pea', 'Seed'], ['a sunflower seed', 'Seed']
  ].map(([s, c]) => [s, c, `${cap(s)} is a ${c.toLowerCase()}.`]))),
  sk('Flower', 'Identify flower parts and their functions', 'Plants', [6, 7], facts([
    ['Which flower part makes pollen?', 'Anther'], ['Which flower part is sticky and catches pollen?', 'Stigma'], ['Which flower part contains the ovules (future seeds)?', 'Ovary'],
    ['Which flower parts are colourful and attract pollinators?', 'Petals'], ['Which leaf-like parts protect the flower bud?', 'Sepals'], ['What is the male part of the flower (anther + filament) called?', 'Stamen'],
    ['What is the female part of the flower (stigma, style and ovary) called?', 'Pistil'], ['After pollination, which part grows into the fruit?', 'Ovary']
  ])),
  sk('Pollin', 'Pollinators and seed dispersers', 'Plants', [3, 4], facts([
    ['How does a bee help a flower?', 'It carries pollen from flower to flower.'], ['How does a squirrel help an oak tree?', 'It buries acorns that can grow into trees.'],
    ['How does wind help a dandelion?', 'It blows the seeds to new places.'], ['How does a bird that eats berries help the plant?', 'It drops the seeds in new places.'],
    ['Why do burrs stick to animal fur?', 'So the seeds are carried to new places.'], ['Why do many flowers have bright colours and sweet smells?', 'To attract pollinators.']
  ])),

  /* ================= Cells and body ================= */
  sk('CellFn', 'Identify functions of plant and animal cell parts', 'Cells', G(7, 10), facts([
    ['Which cell part contains DNA and controls the cell?', 'Nucleus'], ['Which cell part releases energy from food?', 'Mitochondria'], ['Which cell part makes food in plant cells?', 'Chloroplast'],
    ['Which cell part controls what enters and leaves the cell?', 'Cell membrane'], ['Which cell part makes proteins?', 'Ribosome'], ['Which cell part gives plant cells a rigid shape?', 'Cell wall'],
    ['Which cell part stores water and waste?', 'Vacuole'], ['Which cell part packages and ships proteins?', 'Golgi apparatus'], ['Which cell part is a network that moves materials through the cell?', 'Endoplasmic reticulum']
  ])),
  sk('CellCmp', 'Compare cells and cell parts', 'Cells', G(7, 10), cls(['Plant cells only', 'Animal cells only', 'Both'], s => `Which cells have ${b(s)}?`, [
    ['a cell wall', 'Plant cells only', 'Cell walls support plant cells.'], ['chloroplasts', 'Plant cells only', 'Chloroplasts carry out photosynthesis.'], ['a large central vacuole', 'Plant cells only', 'Plant cells store water in a large vacuole.'],
    ['a nucleus', 'Both', 'Both cell types have a nucleus.'], ['mitochondria', 'Both', 'Both release energy with mitochondria.'], ['a cell membrane', 'Both', 'All cells have a membrane.'],
    ['ribosomes', 'Both', 'All cells make proteins.'], ['centrioles', 'Animal cells only', 'Centrioles help animal cells divide.'], ['lysosomes (commonly)', 'Animal cells only', 'Lysosomes are common in animal cells.']
  ])),
  sk('ProEu', 'Compare cell types by their structures', 'Cells', [9, 10, 11], cls(['Prokaryotic', 'Eukaryotic'], s => `Is this describing a prokaryotic or eukaryotic cell?<br>${em(s)}`, [
    ['It has no nucleus.', 'Prokaryotic'], ['Its DNA floats in the cytoplasm.', 'Prokaryotic'], ['Bacteria are made of this cell type.', 'Prokaryotic'], ['It is usually very small and simple.', 'Prokaryotic'],
    ['It has a nucleus.', 'Eukaryotic'], ['It has membrane-bound organelles such as mitochondria.', 'Eukaryotic'], ['Plants, animals and fungi are made of this cell type.', 'Eukaryotic'], ['It is usually larger and more complex.', 'Eukaryotic']
  ].map(([s, c]) => [s, c, c === 'Prokaryotic' ? 'Prokaryotes lack a nucleus and membrane-bound organelles.' : 'Eukaryotes have a nucleus and organelles.']))),
  sk('Transp', 'Cellular transport', 'Cells', [9, 10, 11], facts([
    ['Movement of particles from high to low concentration without energy is …', 'Diffusion'], ['Diffusion of water across a membrane is …', 'Osmosis'],
    ['Moving particles from low to high concentration using energy is …', 'Active transport'], ['A cell placed in salty water loses water. The water moves by …', 'Osmosis'],
    ['Passive transport through a protein channel is called …', 'Facilitated diffusion'], ['Which type of transport needs ATP?', 'Active transport']
  ])),
  sk('Organs', 'Human organs and their functions', 'Anatomy and physiology', [4, 5], facts([
    ['Which organ pumps blood?', 'Heart'], ['Which organs take in oxygen?', 'Lungs'], ['Which organ controls the body and thinking?', 'Brain'], ['Which organ breaks down food with acid?', 'Stomach'],
    ['Which organs filter waste from the blood?', 'Kidneys'], ['Which is the body\'s largest organ?', 'Skin'], ['Where is most food absorbed into the blood?', 'Small intestine'], ['Which organ makes bile and cleans the blood?', 'Liver']
  ])),
  sk('BodySys', 'Body systems', 'Anatomy and physiology', G(5, 8), () => {
    const s = [['Circulatory system', 'moves blood, oxygen and nutrients around the body', 'heart, blood vessels'], ['Respiratory system', 'takes in oxygen and removes carbon dioxide', 'lungs, trachea'],
      ['Digestive system', 'breaks down food into nutrients', 'stomach, intestines'], ['Excretory (urinary) system', 'removes liquid waste from the blood', 'kidneys, bladder'],
      ['Nervous system', 'sends signals and controls the body', 'brain, spinal cord, nerves'], ['Skeletal system', 'supports and protects the body', 'bones'], ['Muscular system', 'moves the body', 'muscles'], ['Immune system', 'fights germs and disease', 'white blood cells']];
    const [name, job, parts] = pick(s);
    return Math.random() < 0.5
      ? mc(`Which body system ${b(job)}?`, name, s.map(x => x[0]), `The ${name.toLowerCase()} ${job}.`)
      : mc(`The ${b(parts)} belong to which body system?`, name, s.map(x => x[0]), `The ${parts} are part of the ${name.toLowerCase()}.`);
  }),
  sk('Homeo', 'Homeostasis and feedback loops', 'Anatomy and physiology', [9, 10, 11], fx([
    ['When you are hot, you sweat to cool down. Keeping conditions inside the body stable is called …', 'homeostasis', ['metabolism', 'digestion', 'evolution']],
    ['When blood sugar rises after a meal, the pancreas releases …', 'insulin', ['adrenaline', 'bile', 'saliva']],
    ['Shivering when you are cold helps the body …', 'produce heat', ['lose heat', 'store water', 'digest food']],
    ['A loop that reverses a change to keep conditions stable is a …', 'negative feedback loop', ['positive feedback loop', 'food chain', 'reflex arc only']],
    ['During exercise, your breathing rate increases to …', 'supply more oxygen to muscles', ['cool down the lungs', 'slow the heart', 'store carbon dioxide']],
    ['Which body system releases hormones that help maintain homeostasis?', 'Endocrine system', ['Skeletal system', 'Digestive system', 'Integumentary system']]
  ])),
  /* ================= Energy in living things ================= */
  sk('PhotoE', 'How do plants use and change energy?', 'Photosynthesis', G(6, 8), fx([
    ['What energy source do plants use to make food?', 'Sunlight', ['Soil', 'Wind', 'Heat from the ground']],
    ['What gas do plants take in for photosynthesis?', 'Carbon dioxide', ['Oxygen', 'Nitrogen', 'Helium']],
    ['What gas do plants release during photosynthesis?', 'Oxygen', ['Carbon dioxide', 'Methane', 'Hydrogen']],
    ['Where in the cell does photosynthesis happen?', 'Chloroplasts', ['Mitochondria', 'Nucleus', 'Cell wall']],
    ['What sugar do plants make?', 'Glucose', ['Salt', 'Protein', 'Fat']],
    ['Photosynthesis changes light energy into …', 'chemical energy', ['sound energy', 'nuclear energy', 'electrical energy']],
    ['Which organism can photosynthesize?', 'Algae', ['Mushrooms', 'Rabbits', 'Bacteria that cause colds']],
    ['What green pigment captures light energy?', 'Chlorophyll', ['Melanin', 'Hemoglobin', 'Keratin']]
  ])),
  sk('PhotoCh', 'The chemistry of photosynthesis and cellular respiration', 'Photosynthesis', [10, 11, 12], fx([
    ['What are the reactants of photosynthesis?', 'Carbon dioxide and water', ['Glucose and oxygen', 'Oxygen and water', 'Glucose and carbon dioxide']],
    ['What are the products of photosynthesis?', 'Glucose and oxygen', ['Carbon dioxide and water', 'Water and ATP', 'Oxygen and nitrogen']],
    ['What are the reactants of cellular respiration?', 'Glucose and oxygen', ['Carbon dioxide and water', 'Water and light', 'Oxygen and ATP']],
    ['What are the products of cellular respiration?', 'Carbon dioxide, water and ATP', ['Glucose and oxygen', 'Oxygen and light', 'Glucose and water']],
    ['Where does the Calvin cycle take place?', 'The stroma of the chloroplast', ['The mitochondrial matrix', 'The nucleus', 'The cytoplasm']],
    ['Which stage of cellular respiration makes the most ATP?', 'The electron transport chain', ['Glycolysis', 'The Calvin cycle', 'Fermentation']],
    ['Where does glycolysis take place?', 'The cytoplasm', ['The chloroplast', 'The nucleus', 'The cell wall']],
    ['Which molecule carries usable energy in the cell?', 'ATP', ['DNA', 'Glucose only', 'Water']]
  ])),
  /* ================= Genetics ================= */
  sk('GenVoc', 'Genetics vocabulary: genotype, phenotype, dominant and recessive', 'Genetics', G(8, 11), () => {
    const v = pick([
      ['Bb', 'Heterozygous genotype', 'Two different alleles.'], ['BB', 'Homozygous dominant genotype', 'Two dominant alleles.'], ['bb', 'Homozygous recessive genotype', 'Two recessive alleles.'],
      ['brown eyes', 'Phenotype', 'A phenotype is an observable trait.'], ['tall stem', 'Phenotype', 'A phenotype is an observable trait.'], ['Tt', 'Heterozygous genotype', 'Two different alleles.'], ['tt', 'Homozygous recessive genotype', 'Two recessive alleles.']]);
    return mc(`What is ${b(v[0])}?`, v[1], ['Heterozygous genotype', 'Homozygous dominant genotype', 'Homozygous recessive genotype', 'Phenotype'], v[2]);
  }),
  sk('Punnett', 'Punnett squares: Mendelian inheritance', 'Genetics', G(8, 12), () => {
    const p1 = pick(['AA', 'Aa', 'aa']), p2 = pick(['AA', 'Aa', 'aa']);
    const kids = cross(p1, p2);
    const want = pick(['recessive', 'dominant', 'heterozygous']);
    const count = kids.filter(k => want === 'recessive' ? k === 'aa' : want === 'dominant' ? k.includes('A') : k === 'Aa').length;
    const ans = `${count}/4`;
    return mc(`A plant with genotype ${b(p1)} is crossed with one that is ${b(p2)}. A (purple) is dominant over a (white).<br>What fraction of offspring are expected to be ${b(want === 'recessive' ? 'white (aa)' : want === 'dominant' ? 'purple' : 'heterozygous (Aa)')}?`,
      ans, ['0/4', '1/4', '2/4', '3/4', '4/4'], `The Punnett square gives ${kids.join(', ')} → ${b(ans)}.`, 5);
  }),
  sk('IncDom', 'Punnett squares: incomplete dominance and codominance', 'Genetics', [10, 11, 12], fx([
    ['Red (RR) and white (WW) snapdragons produce pink (RW) offspring. This is …', 'incomplete dominance', ['codominance', 'complete dominance', 'a mutation']],
    ['A roan cow has both red hairs and white hairs. This is …', 'codominance', ['incomplete dominance', 'complete dominance', 'natural selection']],
    ['Two pink (RW) snapdragons are crossed. What fraction of offspring are expected to be pink?', '1/2', ['1/4', '3/4', '0']],
    ['Two pink (RW) snapdragons are crossed. What fraction are expected to be red?', '1/4', ['1/2', '3/4', '0']],
    ['Blood type AB, where both A and B are fully expressed, shows …', 'codominance', ['incomplete dominance', 'recessive inheritance', 'sex-linked inheritance']],
    ['In incomplete dominance, a heterozygote shows …', 'a blend of the two traits', ['only the dominant trait', 'only the recessive trait', 'both traits side by side']]
  ])),
  sk('Transcr', 'Transcribe DNA into mRNA', 'DNA and protein synthesis', G(9, 12), () => {
    const dna = Array.from({ length: 6 }, () => pick(['A', 'T', 'C', 'G'])).join('');
    const mrna = dna.split('').map(c => DNA_TO_MRNA[c]).join('');
    const wrong = [dna.replace(/T/g, 'U'), dna.split('').map(c => ({ A: 'T', T: 'A', C: 'G', G: 'C' }[c])).join(''), mrna.split('').reverse().join('')];
    return mc(`A DNA template strand reads ${b(dna)}. What is the mRNA strand?`, mrna, wrong, `Pair A→U, T→A, C→G, G→C: ${b(mrna)}.`);
  }),
  sk('Codon', 'Read a codon table', 'DNA and protein synthesis', G(10, 12), () => {
    const codon = pick(Object.keys(CODONS));
    return mc(`Using the genetic code, which amino acid (or signal) does the mRNA codon ${b(codon)} code for?`, CODONS[codon], uniq(Object.values(CODONS)), `${codon} → ${b(CODONS[codon])}.`);
  }),
  sk('DNAst', 'Structure and function: nucleic acids', 'DNA and protein synthesis', [9, 10, 11], fx([
    ['What are the building blocks of DNA called?', 'Nucleotides', ['Amino acids', 'Fatty acids', 'Simple sugars']],
    ['Which base pairs with cytosine in DNA?', 'Guanine', ['Adenine', 'Thymine', 'Uracil']],
    ['What is the shape of a DNA molecule?', 'A double helix', ['A single straight line', 'A triangle', 'A ring of six atoms']],
    ['Which sugar is found in RNA?', 'Ribose', ['Deoxyribose', 'Glucose', 'Fructose']],
    ['Which base is found in RNA but not in DNA?', 'Uracil', ['Thymine', 'Adenine', 'Guanine']],
    ['What holds the two strands of DNA together?', 'Hydrogen bonds between bases', ['Ionic bonds between sugars', 'Magnets', 'Peptide bonds']],
    ['Where is DNA found in eukaryotic cells?', 'In the nucleus', ['In the cell wall', 'In the vacuole only', 'In the cell membrane']],
    ['What does DNA carry?', 'Genetic instructions', ['Oxygen', 'Energy for movement', 'Waste products']]
  ])),
  sk('CellCyc', 'Describe phases of mitosis and the cell cycle', 'Cell growth and division', [10, 11, 12], facts([
    ['In which phase does the cell grow and copy its DNA?', 'Interphase'], ['In which phase do chromosomes condense and become visible?', 'Prophase'], ['In which phase do chromosomes line up in the middle?', 'Metaphase'],
    ['In which phase are sister chromatids pulled apart?', 'Anaphase'], ['In which phase do two new nuclei form?', 'Telophase'], ['What process splits the cytoplasm into two cells?', 'Cytokinesis']
  ])),

  /* ================= Evolution ================= */
  sk('NatSel', 'Introduction to natural selection', 'Adaptations and natural selection', [6, 7, 9, 10], fx([
    ['Organisms with helpful traits survive and reproduce more. This process is called …', 'natural selection', ['photosynthesis', 'metamorphosis', 'hibernation']],
    ['What must exist in a population for natural selection to happen?', 'Variation in traits', ['Identical individuals', 'No predators', 'Only one generation']],
    ['Light moths were eaten more often on dark, sooty trees. Over time, the moth population became …', 'mostly dark', ['mostly light', 'extinct', 'larger in size']],
    ['Why do bacteria become resistant to an antibiotic over time?', 'Resistant bacteria survive and reproduce.', ['The antibiotic teaches them.', 'All bacteria change on purpose.', 'The antibiotic gets weaker in the bottle.']],
    ['For natural selection to act on a trait, the trait must be …', 'inherited', ['learned', 'temporary', 'caused by injury']],
    ['Who proposed the theory of evolution by natural selection?', 'Charles Darwin', ['Isaac Newton', 'Gregor Mendel', 'Marie Curie']]
  ])),
  sk('TraitPct', 'Calculate the percentages of traits in a population', 'Adaptations and natural selection', [6, 7], () => {
    const total = pick([20, 25, 40, 50, 100, 200]); const pct = pick([10, 20, 25, 40, 50, 60, 75, 80]);
    const n = total * pct / 100;
    return num(`A population has ${b(total)} beetles. ${b(n)} of them are green. What percentage are green?`, pct, `${n} ÷ ${total} × 100 = ${b(pct)}%.`);
  }),
  sk('EvoEvid', 'Evaluate evidence of evolution', 'Adaptations and natural selection', [10, 11, 12], fx([
    ['A human arm, a bat wing and a whale flipper share the same bone pattern. These are …', 'homologous structures', ['analogous structures', 'vestigial structures', 'fossils']],
    ['Bird wings and insect wings do the same job but evolved separately. They are …', 'analogous structures', ['homologous structures', 'vestigial structures', 'identical structures']],
    ['A whale\'s tiny leftover hip bones are …', 'vestigial structures', ['homologous structures', 'analogous structures', 'new adaptations']],
    ['In undisturbed rock, fossils in deeper layers are generally …', 'older', ['younger', 'the same age', 'made of metal']],
    ['Species whose DNA sequences are more similar are …', 'more closely related', ['less closely related', 'the same species', 'unrelated']],
    ['Similar early embryos in fish, birds and humans suggest …', 'common ancestry', ['identical adult forms', 'no relationship', 'recent extinction']]
  ])),
  /* ================= Ecology ================= */
  sk('FoodRole', 'Producers, consumers and decomposers', 'Ecosystems', G(4, 8), cls(['Producer', 'Primary consumer', 'Secondary consumer', 'Decomposer'], s => `What role does ${b(s)} play in its food web?`, [
    ['grass', 'Producer'], ['algae', 'Producer'], ['an oak tree', 'Producer'], ['a rabbit', 'Primary consumer'], ['a grasshopper', 'Primary consumer'], ['a deer', 'Primary consumer'],
    ['a fox that eats rabbits', 'Secondary consumer'], ['a frog that eats grasshoppers', 'Secondary consumer'], ['a mushroom', 'Decomposer'], ['an earthworm', 'Decomposer'], ['bacteria in soil', 'Decomposer']
  ].map(([s, c]) => [s, c, { Producer: 'Producers make their own food.', 'Primary consumer': 'Primary consumers eat producers.', 'Secondary consumer': 'Secondary consumers eat primary consumers.', Decomposer: 'Decomposers break down dead matter.' }[c]]))),
  sk('FoodCh', 'Interpret food chains', 'Ecosystems', G(3, 7), () => {
    const chain = pick([['grass', 'grasshopper', 'frog', 'snake', 'hawk'], ['algae', 'krill', 'fish', 'seal', 'orca'], ['clover', 'rabbit', 'fox', 'wolf'], ['acorn', 'squirrel', 'owl'], ['plankton', 'small fish', 'tuna', 'shark']]);
    const i = ri(0, chain.length - 2);
    return Math.random() < 0.5
      ? mc(`Food chain: ${chain.join(' → ')}<br>What does the ${b(chain[i + 1])} eat?`, chain[i], chain.filter(x => x !== chain[i + 1]), `Arrows point from the food to the eater: the ${chain[i + 1]} eats the ${chain[i]}.`)
      : mc(`Food chain: ${chain.join(' → ')}<br>Which is the producer?`, chain[0], chain, `The producer is first: ${b(chain[0])}.`);
  }),
  sk('EcoRel', 'Ecosystem relationships', 'Ecosystems', G(7, 10), cls(['Mutualism', 'Commensalism', 'Parasitism', 'Predation', 'Competition'], s => `Which relationship is this?<br>${em(s)}`, [
    ['Bees pollinate flowers and get nectar.', 'Mutualism'], ['Oxpecker birds eat ticks off rhinos.', 'Mutualism'], ['A barnacle rides on a whale, which is unaffected.', 'Commensalism'], ['An orchid grows on a tree branch without harming it.', 'Commensalism'],
    ['A flea feeds on a dog\'s blood.', 'Parasitism'], ['A tapeworm lives in an animal\'s gut.', 'Parasitism'], ['A hawk catches a mouse.', 'Predation'], ['Lions and hyenas fight over the same zebra.', 'Competition']
  ].map(([s, c]) => [s, c, { Mutualism: 'Both benefit.', Commensalism: 'One benefits; the other is unaffected.', Parasitism: 'One benefits; the other is harmed.', Predation: 'One eats the other.', Competition: 'Both need the same resource.' }[c]]))),
  sk('Biome', 'Identify ecosystems', 'Ecosystems', G(3, 10), cls(['Desert', 'Tundra', 'Tropical rainforest', 'Grassland', 'Ocean', 'Deciduous forest'], s => `Which ecosystem is described?<br>${em(s)}`, [
    ['Very little rain, hot days, cold nights, cacti and lizards.', 'Desert'], ['Frozen ground (permafrost), short summers, mosses and caribou.', 'Tundra'],
    ['Hot and wet all year, tall trees, the most species on land.', 'Tropical rainforest'], ['Wide open land with grasses, few trees, bison or zebras.', 'Grassland'],
    ['Salt water covering most of Earth, coral reefs and whales.', 'Ocean'], ['Four seasons, trees that drop their leaves in autumn, deer and squirrels.', 'Deciduous forest'],
    ['Sand dunes and plants with deep roots that store water.', 'Desert'], ['A thick canopy where monkeys, toucans and frogs live.', 'Tropical rainforest']
  ].map(([s, c]) => [s, c, `These features describe a ${c.toLowerCase()}.`]))),
  sk('PopEco', 'Describe populations, communities and ecosystems', 'Ecosystems', [6, 7], cls(['Population', 'Community', 'Ecosystem'], s => `Which level of organization is this?<br>${em(s)}`, [
    ['All the deer in a forest.', 'Population'], ['All the bullfrogs in a pond.', 'Population'], ['All the living things in a pond: frogs, fish, plants and insects.', 'Community'],
    ['All the organisms on a coral reef.', 'Community'], ['A pond: its living things plus water, rocks and sunlight.', 'Ecosystem'], ['A desert: its plants, animals, sand and climate.', 'Ecosystem']
  ].map(([s, c]) => [s, c, { Population: 'One species in one area.', Community: 'All species living together.', Ecosystem: 'Living things plus nonliving parts.' }[c]]))),
  sk('Carbon', 'The carbon cycle and carrying capacity', 'Ecosystems', [10, 11, 12], fx([
    ['Which process removes carbon dioxide from the air?', 'Photosynthesis', ['Respiration', 'Burning fuel', 'Decomposition']],
    ['Which processes return carbon dioxide to the air?', 'Respiration and burning fuels', ['Photosynthesis only', 'Condensation and freezing', 'Evaporation only']],
    ['Where is carbon stored for millions of years?', 'Fossil fuels and rocks', ['Clouds', 'Living leaves', 'Fresh rainwater']],
    ['The largest population an environment can support long-term is its …', 'carrying capacity', ['birth rate', 'biodiversity', 'food chain']],
    ['A population growing without limits shows … growth.', 'exponential (J-shaped)', ['logistic (S-shaped)', 'zero', 'negative']],
    ['A population that levels off at carrying capacity shows … growth.', 'logistic (S-shaped)', ['exponential (J-shaped)', 'unlimited', 'random']]
  ])),
];

function cap(s) { return s[0].toUpperCase() + s.slice(1); }
