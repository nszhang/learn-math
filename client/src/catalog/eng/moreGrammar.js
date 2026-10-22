/* English — generated grammar and mechanics questions for skills whose banks were small.
   Sentences are assembled from word lists and patterns, so students meet new sentences
   instead of memorising a handful of answers. MORE_GRAMMAR[key] = gen(grade). */
import { ri, pick, shuffle, sample, uniq, b, mc } from './words.js';

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const NAMES = ['Maya', 'Liam', 'Aisha', 'Noah', 'Chen', 'Sofia', 'Ethan', 'Priya', 'Lucas', 'Zoe', 'Omar', 'Hana', 'Jack', 'Leila', 'Mateo', 'Ava'];
const choose = (prompt, ans, wrong, why) => mc(prompt, ans, uniq(wrong).filter(x => x !== ans).slice(0, 3), why);

/* ---------- commas ---------- */
const COORD = [['cold', 'windy'], ['long', 'tiring'], ['bright', 'cheerful'], ['quiet', 'peaceful'], ['dark', 'stormy'], ['brave', 'loyal'], ['sticky', 'sweet'], ['crisp', 'clear'], ['loud', 'annoying'], ['clever', 'funny'], ['calm', 'patient'], ['warm', 'sunny'], ['rough', 'rocky'], ['bold', 'colourful']];
const NOUNS = { cold: 'morning', long: 'hike', bright: 'kitchen', quiet: 'library', dark: 'night', brave: 'firefighter', sticky: 'syrup', crisp: 'autumn day', loud: 'alarm', clever: 'comedian', calm: 'teacher', warm: 'afternoon', rough: 'trail', bold: 'mural' };
const CUMUL = [['three', 'small', 'puppies'], ['an', 'old', 'stone wall'], ['two', 'red', 'apples'], ['a', 'big', 'brown bear'], ['the', 'first', 'snowfall'], ['several', 'tall', 'pine trees'], ['a', 'tiny', 'glass bottle'], ['my', 'new', 'running shoes']];
function coordAdj() {
  if (Math.random() < 0.35) { const [d, a, n] = pick(CUMUL); const ok = `We saw ${d} ${a} ${n}.`; return choose('Which sentence is punctuated correctly?', ok, [`We saw ${d}, ${a} ${n}.`, `We saw ${d} ${a}, ${n}.`, `We saw, ${d} ${a} ${n}.`], `${b(d)} and ${b(a)} are not coordinate adjectives (you can't say "${a} and ${d}"), so no comma.`); }
  const [x, y] = pick(COORD), n = NOUNS[x], art = /^[aeiou]/.test(x) ? 'an' : 'a', ok = `It was ${art} ${x}, ${y} ${n}.`;
  return choose('Which sentence uses commas correctly?', ok, [`It was ${art} ${x} ${y}, ${n}.`, `It was ${art}, ${x}, ${y} ${n}.`, `It was ${art} ${x}, ${y}, ${n}.`], `${b(x)} and ${b(y)} are coordinate adjectives (you could say "${y} and ${x}"), so separate them with a comma — but never put a comma before the noun.`);
}
const INTROS = ['However', 'Unfortunately', 'Of course', 'In fact', 'Meanwhile', 'Surprisingly', 'Yes', 'Well', 'Nevertheless', 'As a result'];
const CLAUSES = ['the meeting was cancelled', 'the bus arrived late', 'the team kept practising', 'the museum stayed open', 'the results were surprising', 'the trail was closed', 'the store sold out of bread', 'the experiment worked'];
function commaDirect() {
  const k = ri(0, 3), n = pick(NAMES), c = pick(CLAUSES);
  if (k === 0) { const i = pick(INTROS), ok = `${i}, ${c}.`; return choose('Which sentence uses commas correctly?', ok, [`${i} ${c}.`, `${i} ${c.replace(' ', ', ')}.`, `${i}, ${c.replace(' ', ', ')}.`], `Put a comma after an introductory word such as ${b(i)}.`); }
  if (k === 1) { const tail = pick(['please close the window', 'your essay is excellent', 'the bus is here', 'we need your help']), ok = `${n}, ${tail}.`; return choose('Which sentence uses commas correctly to set off a direct address?', ok, [`${n} ${tail}.`, `${n} ${tail.replace(' ', ', ')}.`, `${n}, ${tail.replace(' ', ', ')}.`], `Set off the name of the person spoken to (${b(n)}) with a comma.`); }
  if (k === 2) { const [subj, rest] = pick([['The results', 'were inconclusive'], ['The plan', 'needs more work'], ['The coach', 'seemed pleased'], ['Our trip', 'was postponed']]), word = pick(['however', 'of course', 'in fact', 'I think', 'it seems']), ok = `${subj}, ${word}, ${rest}.`; return choose('Which sentence correctly sets off the interrupter?', ok, [`${subj} ${word}, ${rest}.`, `${subj}, ${word} ${rest}.`, `${subj} ${word} ${rest}.`], `An interrupter (${b(word)}) needs a comma on both sides.`); }
  const [pos, neg] = pick([['patience', 'speed'], ['practice', 'luck'], ['kindness', 'money'], ['effort', 'talent'], ['evidence', 'rumours']]), ok = `Success comes from ${pos}, not ${neg}.`;
  return choose('Which sentence correctly punctuates the contrasting (antithetical) phrase?', ok, [`Success comes from ${pos} not ${neg}.`, `Success comes, from ${pos} not ${neg}.`, `Success, comes from ${pos} not, ${neg}.`], `Use a comma before a contrasting phrase that begins with ${b('not')}.`);
}

/* ---------- capitals ---------- */
const PROPER = [['the pacific ocean', 'the Pacific Ocean'], ['lake louise', 'Lake Louise'], ['the rocky mountains', 'the Rocky Mountains'], ['the first world war', 'the First World War'], ['the charter of rights and freedoms', 'the Charter of Rights and Freedoms'], ['prime minister trudeau', 'Prime Minister Trudeau'],
  ['dr. singh', 'Dr. Singh'], ['the university of toronto', 'the University of Toronto'], ['canada day', 'Canada Day'], ['the confederation bridge', 'the Confederation Bridge'], ['the renaissance', 'the Renaissance'], ['the treaty of paris', 'the Treaty of Paris'], ['mount logan', 'Mount Logan'], ['the canadian museum of history', 'the Canadian Museum of History']];
const FRAMES = ['We learned about ___ in class.', 'My grandmother told me about ___.', 'The documentary focused on ___.', 'Our report compares ___ with other examples.'];
function capErrors() {
  const [low, ok] = pick(PROPER), f = pick(FRAMES), right = f.replace('___', ok);
  const titleAll = ok.split(' ').map(w => cap(w)).join(' ');
  return choose('Which sentence uses capital letters correctly?', right, [f.replace('___', low), f.replace('___', titleAll), f.replace('___', ok.toUpperCase()), f.replace('___', ok.replace(/\b(\w)/, c => c.toLowerCase()))].filter(x => x !== right), `Capitalize proper nouns — the specific name ${b(ok)} — but not small words like "the" and "of" inside a name.`);
}
const NATION = [['Canadian', 'Canada'], ['French', 'France'], ['Japanese', 'Japan'], ['Mexican', 'Mexico'], ['Italian', 'Italy'], ['Korean', 'Korea'], ['Brazilian', 'Brazil'], ['Spanish', 'Spain'], ['Indian', 'India'], ['Greek', 'Greece']];
function capNationality() {
  const [adj] = pick(NATION), thing = pick(['food', 'music', 'artist', 'flag', 'restaurant', 'coins', 'history', 'author']), k = ri(0, 1);
  if (k === 0) { const ok = `We visited a ${adj} ${thing} downtown.`; return choose('Which sentence is capitalized correctly?', ok, [`We visited a ${adj.toLowerCase()} ${thing} downtown.`, `We visited a ${adj} ${cap(thing)} downtown.`, `We Visited a ${adj} ${thing} downtown.`], `Proper adjectives like ${b(adj)} are capitalized; the common noun "${thing}" is not.`); }
  const lang = pick(['French', 'Spanish', 'Mandarin', 'Cree', 'Arabic', 'Punjabi', 'German']), ok = `${pick(NAMES)} is learning ${lang} and math this year.`;
  return choose('Which sentence is capitalized correctly?', ok, [ok.replace(lang, lang.toLowerCase()), ok.replace('math', 'Math'), ok.replace('is learning', 'Is Learning')], `Names of languages (${b(lang)}) are always capitalized; school subjects like math are not (unless they are languages).`);
}

/* ---------- apostrophes ---------- */
const POSS = [['team', 'teams'], ['student', 'students'], ['teacher', 'teachers'], ['dog', 'dogs'], ['player', 'players'], ['committee', 'committees'], ['scientist', 'scientists'], ['girl', 'girls']];
const IRREG = [['child', 'children'], ['woman', 'women'], ['man', 'men'], ['mouse', 'mice'], ['person', 'people']];
function apostrophes() {
  const k = ri(0, 2);
  if (k === 2) { const [, pl] = pick(IRREG), what = pick(['coats', 'books', 'ideas', 'voices']), ok = `The ${pl}'s ${what} were all different.`; return choose('Which sentence uses the apostrophe correctly?', ok, [`The ${pl}s' ${what} were all different.`, `The ${pl}' ${what} were all different.`, `The ${pl}s ${what} were all different.`], `${b(pl)} is already plural without -s, so add ${b("'s")}.`); }
  const [sg, pl] = pick(POSS), what = pick(['schedule', 'uniforms', 'decision', 'notebooks', 'results', 'leashes']);
  if (k === 0) { const ok = `All the ${pl}' ${what} were ready.`; return choose('Several owners are involved. Which sentence is correct?', ok, [`All the ${pl}'s ${what} were ready.`, `All the ${pl} ${what} were ready.`, `All the ${sg}s's ${what} were ready.`], `For a plural noun ending in s, add only an apostrophe: ${b(pl + "'")}.`); }
  const ok = `The ${sg}'s ${what} changed twice.`; return choose('One owner is involved. Which sentence is correct?', ok, [`The ${sg}s ${what} changed twice.`, `The ${sg}s' ${what} changed twice.`, `The ${sg}' ${what} changed twice.`], `For one owner, add ${b("'s")}: ${b(sg + "'s")}.`);
}

/* ---------- agreement ---------- */
const SINGULAR_SUBJ = [['The quality of the essays', 'is', 'are'], ['The box of crayons', 'is', 'are'], ['A list of names', 'was', 'were'], ['The leader of the hikers', 'has', 'have'], ['Neither the coach nor the captain', 'was', 'were'], ['The team', 'plays', 'play'], ['Mathematics', 'is', 'are'], ['The news', 'was', 'were'], ['Each of the players', 'has', 'have'], ['One of my cousins', 'lives', 'live'], ['Every student and teacher', 'was', 'were'], ['The cost of the repairs', 'seems', 'seem']];
const PLURAL_SUBJ = [['The students in the class', 'are', 'is'], ['The keys to the car', 'were', 'was'], ['Both the singer and the drummer', 'have', 'has'], ['The scissors', 'are', 'is'], ['Several of the windows', 'were', 'was'], ['Many of the books', 'have', 'has'], ['The results of the survey', 'show', 'shows'], ['My friends from camp', 'visit', 'visits']];
const REST = { is: 'surprising', are: 'surprising', was: 'on the table', were: 'on the table', has: 'a plan', have: 'a plan', plays: 'well together', play: 'well together', lives: 'in Halifax', live: 'in Halifax', seems: 'high', seem: 'high', show: 'a clear trend', shows: 'a clear trend', visit: 'every summer', visits: 'every summer', practises: 'every day', practise: 'every day', works: 'well', work: 'well' };
function subjVerb(indef = false) {
  const pool = indef ? [...SINGULAR_SUBJ.filter(x => /^(Each|One|Every|Neither)/.test(x[0])), ['Everyone in the band', 'practises', 'practise'], ['Somebody', 'has', 'have'], ['Nobody on the bus', 'was', 'were'], ['Either of the routes', 'works', 'work'], ['Few of the apples', 'were', 'was'], ['Both of the twins', 'play', 'plays'], ['Several of the answers', 'are', 'is'], ['All of the pizza', 'is', 'are'], ['All of the cookies', 'are', 'is'], ['Some of the water', 'was', 'were'], ['Some of the chairs', 'were', 'was']] : [...SINGULAR_SUBJ, ...PLURAL_SUBJ];
  const [s, good, bad] = pick(pool), rest = REST[good] || REST[bad] || 'ready';
  const ok = `${s} ${good} ${rest}.`;
  return choose('Which sentence has correct subject-verb agreement?', ok, [`${s} ${bad} ${rest}.`], `The verb must agree with the true subject: ${b(s)} takes ${b(good)}.`);
}
function pronouns() {
  const [n1] = sample(NAMES, 1), k = ri(0, 3);
  if (k === 0) { const ok = `The coach gave ${n1} and me a ride.`; return choose('Which sentence uses pronouns correctly?', ok, [`The coach gave ${n1} and I a ride.`, `The coach gave ${n1} and myself a ride.`, `The coach gave I and ${n1} a ride.`], `"Me" is an object pronoun (the coach gave me a ride).`); }
  if (k === 1) { const ok = `${n1} and I finished the project early.`; return choose('Which sentence uses pronouns correctly?', ok, [`${n1} and me finished the project early.`, `Me and ${n1} finished the project early.`, `${n1} and myself finished the project early.`], `"I" is a subject pronoun (I finished the project).`); }
  if (k === 2) { const ok = `Between you and me, the test was easy.`; return choose('Which sentence uses pronouns correctly?', ok, [`Between you and I, the test was easy.`, `Between yourself and I, the test was easy.`, `Between you and myself, the test was easy.`], `"Between" is a preposition, so it takes the object pronoun ${b('me')}.`); }
  const ok = `${n1} is taller than she.`; return choose('Which sentence is correct in formal English?', ok, [`${n1} is taller than her is.`, `${n1} is more taller than she.`, `${n1} is taller then she.`], `In formal English, complete the comparison in your head: taller than ${b('she')} (is).`);
}
const ADV = [['quickly', 'more quickly', 'most quickly'], ['carefully', 'more carefully', 'most carefully'], ['fast', 'faster', 'fastest'], ['hard', 'harder', 'hardest'], ['early', 'earlier', 'earliest'], ['late', 'later', 'latest'], ['quietly', 'more quietly', 'most quietly'], ['soon', 'sooner', 'soonest'], ['gracefully', 'more gracefully', 'most gracefully'], ['loudly', 'more loudly', 'most loudly'], ['well', 'better', 'best'], ['badly', 'worse', 'worst']];
function adverbCompare(onlyIrregular = false) {
  const pool = onlyIrregular ? ADV.filter(a => ['well', 'badly'].includes(a[0])).concat([['far', 'farther', 'farthest']]) : ADV;
  const [base, comp, sup] = pick(pool), [a, c] = sample(NAMES, 2), three = Math.random() < 0.5;
  const verb = pick(['ran', 'worked', 'sang', 'read', 'swam', 'played', 'arrived', 'spoke']);
  const ans = three ? sup : comp, s = three ? `Of all the students, ${a} ${verb} the ___.` : `${a} ${verb} ___ than ${c}.`;
  const wrong = [base, three ? comp : sup, base.endsWith('ly') ? `${base}er` : `more ${base}`, base === 'well' ? 'gooder' : base === 'badly' ? 'badder' : `most ${comp}`];
  return choose(`Which word or phrase completes the sentence?<br><em>${s}</em>`, ans, wrong, three ? `Comparing three or more → superlative: ${b(sup)}.` : `Comparing two → comparative: ${b(comp)}.`);
}
const PREPS = ['under the bridge', 'across the field', 'during the storm', 'behind the library', 'after lunch', 'with great care', 'along the river', 'before sunrise', 'inside the old barn', 'through the forest', 'without a map', 'beside the lake'];
function prepPhrase() {
  const p = pick(PREPS), subj = pick(['The children', 'A small fox', 'Our class', 'The hikers', 'My uncle', 'The musicians']), verb = pick(['waited', 'walked', 'rested', 'met', 'laughed', 'practised']);
  const front = Math.random() < 0.4, s = front ? `${cap(p)}, ${subj.toLowerCase()} ${verb}.` : `${subj} ${verb} ${p}.`;
  return choose(`What is the prepositional phrase in this sentence?<br><em>${s}</em>`, p, [subj.toLowerCase(), `${subj.toLowerCase()} ${verb}`, p.split(' ').slice(1).join(' '), verb], `It begins with the preposition ${b(p.split(' ')[0])} and ends with its object.`);
}

/* ---------- sentence structure ---------- */
const IND = ['the rain stopped', 'we went outside', 'the bell rang', 'Maya finished her essay', 'the lights flickered', 'the crowd cheered', 'the river rose', 'Liam fixed the bike', 'the store closed early', 'our team scored'];
const DEP = ['because the power went out', 'after the game ended', 'although it was late', 'when the bus arrived', 'while we were eating', 'since the road was icy', 'before the guests came', 'until the sun set'];
function sentenceType() {
  const kind = pick(['Simple', 'Compound', 'Complex', 'Compound-complex']), [i1, i2] = sample(IND, 2), d = pick(DEP), conj = pick(['and', 'but', 'so']);
  const s = kind === 'Simple' ? `${cap(i1)} ${pick(['in the morning', 'at noon', 'without warning', 'again'])}.` : kind === 'Compound' ? `${cap(i1)}, ${conj} ${i2}.` : kind === 'Complex' ? (Math.random() < 0.5 ? `${cap(d)}, ${i1}.` : `${cap(i1)} ${d}.`) : `${cap(d)}, ${i1}, ${conj} ${i2}.`;
  return choose(`Is this sentence simple, compound, complex or compound-complex?<br><em>${s}</em>`, kind, ['Simple', 'Compound', 'Complex', 'Compound-complex'], { Simple: 'One independent clause.', Compound: 'Two independent clauses joined by a comma and a conjunction.', Complex: 'One independent clause and one dependent clause.', 'Compound-complex': 'Two independent clauses plus a dependent clause.' }[kind]);
}
const VERBS = [['walks', 'walked', 'into the room'], ['opens', 'opened', 'the old chest'], ['smiles', 'smiled', 'at her friend'], ['looks', 'looked', 'around carefully'], ['runs', 'ran', 'toward the door'], ['finds', 'found', 'a hidden note'], ['takes', 'took', 'a deep breath'], ['writes', 'wrote', 'a quick letter'], ['sees', 'saw', 'a strange light'], ['calls', 'called', 'for help']];
function tenseShift() {
  const [[p1, q1, o1], [p2, q2, o2]] = sample(VERBS, 2), who = pick(['The narrator', 'The detective', 'Maya', 'The old man', 'The fox']), past = Math.random() < 0.5;
  const ok = past ? `${who} ${q1} ${o1} and then ${q2} ${o2}.` : `${who} ${p1} ${o1} and then ${p2} ${o2}.`;
  return choose('Which sentence keeps the verb tense consistent?', ok, [`${who} ${q1} ${o1} and then ${p2} ${o2}.`, `${who} ${p1} ${o1} and then ${q2} ${o2}.`, `${who} had ${q1} ${o1} and then ${p2} ${o2}.`.replace(/had (ran|took|wrote|saw)/, (x, v) => 'had ' + { ran: 'run', took: 'taken', wrote: 'written', saw: 'seen' }[v])], `Keep both verbs in the ${past ? 'past' : 'present'} tense.`);
}
function compoundSP() {
  const [a, c] = sample(NAMES, 2), subjFirst = Math.random() < 0.5;
  if (subjFirst) { const v = pick(['play hockey on Saturdays', 'walked to school', 'built a snow fort']), s = `${a} and ${c} ${v}.`; return choose(`What is the compound subject?<br><em>${s}</em>`, `${a} and ${c}`, [a, v, `${c} ${v.split(' ')[0]}`], `Two subjects share one verb: ${b(`${a} and ${c}`)}.`); }
  const [v1, v2] = sample(['washed the dishes', 'swept the floor', 'read a book', 'fed the cat', 'called her aunt', 'finished his homework'], 2), s = `${a} ${v1} and ${v2}.`;
  return choose(`What is the compound predicate?<br><em>${s}</em>`, `${v1} and ${v2}`, [a, v1, `${a} ${v1}`], `One subject does two actions: ${b(`${v1} and ${v2}`)}.`);
}

/* ---------- Kindergarten / Grade 1 ---------- */
const SIMPLE = ['the cat is big', 'we like to play', 'my mom is nice', 'it is a sunny day', 'the dog can run', 'i see a bird', 'we go to school', 'the sun is hot', 'my dad can cook', 'the fish can swim', 'we have a red ball', 'the frog is green', 'i like my hat', 'the bus is yellow'];
const firstCap = () => { const raw = pick(SIMPLE), ok = cap(raw.replace(/\bi\b/g, 'I')) + '.'; return choose('Which sentence is written correctly?', ok, [raw.replace(/\bi\b/g, 'I') + '.', ok.toUpperCase(), raw.replace(/\bi\b/g, 'I').split(' ').map((w, i) => (i === 1 ? cap(w) : w)).join(' ') + '.'], 'A sentence starts with a capital letter.'); };
const capI = () => { const ok = pick(['I like to read.', 'Mom and I went to the park.', 'Can I have a turn?', 'I see a big tree.', 'My friend and I played tag.', 'I am six years old.', 'Today I made a card.', 'I have a new bike.', 'Dad and I baked bread.', 'May I go outside?', 'I can hop on one foot.']); return choose('Which sentence is written correctly?', ok, [ok.replace(/\bI\b/g, 'i'), ok.replace(/\bI\b/g, 'i').toLowerCase(), ok.replace(/\b(\w)(\w+)\b/, (x, a, rest) => a.toLowerCase() + rest)], 'The word "I" is always a capital letter.'); };
const spacing = () => { const ok = cap(pick(SIMPLE).replace(/\bi\b/g, 'I')) + '.', w = ok.slice(0, -1).split(' '); const join = j => w.map((x, i) => x + (i < w.length - 1 ? (i === j ? '' : ' ') : '')).join('') + '.'; return choose('Which sentence is spaced correctly?', ok, [join(0), join(1), join(w.length - 2)], 'Leave a space between each word.'); };
const completeSentence = () => { const ok = cap(pick(SIMPLE).replace(/\bi\b/g, 'I')) + '.', w = ok.slice(0, -1).split(' '); return choose('Which is a complete sentence?', ok, [w.slice(0, 2).join(' ').toLowerCase() === 'i see' ? 'The big red' : w.slice(0, 2).join(' '), `${pick(['The big red', 'A little', 'In the', 'My best'])} ${pick(['ball', 'tree', 'house', 'friend'])}`, `${pick(['Running', 'Jumping', 'Playing'])} in the ${pick(['park', 'rain', 'yard'])}`], 'A complete sentence tells who or what and what happens.'); };
const TIME = { Past: ['Yesterday we played in the snow.', 'Last night I read a book.', 'We baked cookies last week.', 'The dog barked all night.', 'Mom planted flowers yesterday.', 'I lost my tooth last Friday.', 'We swam at the lake last summer.', 'The baby cried this morning.'], Present: ['I am eating lunch now.', 'The bird is singing.', 'We are reading right now.', 'The sun shines today.', 'My sister is drawing a picture.', 'The cat sleeps on my bed.', 'It is raining outside now.', 'Dad is making supper.'], Future: ['Tomorrow we will go to the zoo.', 'I will visit Grandma next week.', 'We will plant seeds in the spring.', 'The bus will come soon.', 'Next year I will be in Grade 2.', 'We are going to swim later.', 'It will snow tonight.', 'I will clean my room after school.'] };
const tells = when => () => { const ok = pick(TIME[when]), others = Object.keys(TIME).filter(k => k !== when); return choose(`Which sentence tells about the ${b(when.toLowerCase())}?`, ok, [pick(TIME[others[0]]), pick(TIME[others[1]]), pick(TIME[others[pick([0, 1])]])], `Look for time words and verbs: this sentence is about the ${when.toLowerCase()}.`); };

export const MORE_GRAMMAR = {
  CmCa: coordAdj, CmDa: commaDirect, CpEr: capErrors, XCpNl: capNationality, ApPl: apostrophes,
  SvEr: () => subjVerb(false), SvIn: () => subjVerb(true), PnSO: pronouns, AvCp: () => adverbCompare(false), AvWl: () => adverbCompare(true),
  PrPh: prepPhrase, SnTy: sentenceType, TnSh: tenseShift, XCmpSP: compoundSP,
  XCapF: firstCap, XCapI: capI, XSpace: spacing, XCmpS: completeSentence, XTlPr: tells('Present'), XTlPa: tells('Past'), XTlFu: tells('Future')
};
