/* English — Vocabulary (grades 6–12). See ixlEnglish.js. */
import { classify, pairs, ok } from './quiz.js';

const G = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const em = s => `<em>${s}</em>`;
const b = s => `<strong>${s}</strong>`;

export const VOCAB_SPECS = [
  /* ================= Prefixes and suffixes ================= */
  sk('Pfx', 'Prefixes', 'Prefixes and suffixes', G(6, 12), pairs({
    prompt: w => `What does the word ${b(w)} mean?`,
    items: [
      ['antibiotic', 'a substance that works against bacteria', 'anti- means "against".'],
      ['bilingual', 'able to speak two languages', 'bi- means "two".'],
      ['circumnavigate', 'sail all the way around', 'circum- means "around".'],
      ['disembark', 'leave a ship or plane', 'dis- means "away from / not".'],
      ['extraordinary', 'beyond the ordinary', 'extra- means "beyond".'],
      ['hypersensitive', 'extremely sensitive', 'hyper- means "over / extremely".'],
      ['interstate', 'between states', 'inter- means "between".'],
      ['misjudge', 'judge wrongly', 'mis- means "wrongly".'],
      ['postpone', 'delay until later', 'post- means "after".'],
      ['semicircle', 'half a circle', 'semi- means "half".'],
      ['transatlantic', 'across the Atlantic', 'trans- means "across".'],
      ['unicycle', 'a cycle with one wheel', 'uni- means "one".']
    ]
  })),
  sk('Sfx', 'Suffixes', 'Prefixes and suffixes', G(6, 12), pairs({
    prompt: w => `What does the word ${b(w)} mean?`,
    items: [
      ['careless', 'without care', '-less means "without".'],
      ['helpful', 'full of help', '-ful means "full of".'],
      ['enjoyable', 'able to be enjoyed', '-able means "able to be".'],
      ['movement', 'the act of moving', '-ment means "act or result of".'],
      ['kindness', 'the state of being kind', '-ness means "state of being".'],
      ['artist', 'a person who makes art', '-ist means "a person who".'],
      ['strengthen', 'make strong', '-en means "to make".'],
      ['hopeful', 'full of hope', '-ful means "full of".'],
      ['visible', 'able to be seen', '-ible means "able to be".'],
      ['neighbourhood', 'the state or area of being neighbours', '-hood means "state or group".'],
      ['organize', 'to make organized', '-ize means "to make".'],
      ['actively', 'in an active way', '-ly means "in a way".']
    ]
  })),
  sk('WpAn', 'Word pattern analogies', 'Prefixes and suffixes', G(8, 12), pairs({
    prompt: q => `Complete the analogy.<br>${em(q)}`,
    items: [
      ['happy : unhappy :: lock : ___', 'unlock', 'The prefix un- makes the opposite.', ['unlock', 'relock', 'locker', 'locked']],
      ['kind : kindness :: dark : ___', 'darkness', 'Add -ness to make a noun.', ['darkness', 'darkly', 'darken', 'darker']],
      ['teach : teacher :: sing : ___', 'singer', 'Add -er for the person who does it.', ['singer', 'sings', 'sang', 'singing']],
      ['write : rewrite :: do : ___', 'redo', 'The prefix re- means again.', ['redo', 'undo', 'done', 'doing']],
      ['hope : hopeless :: care : ___', 'careless', '-less means without.', ['careless', 'careful', 'caring', 'cared']],
      ['quick : quickly :: slow : ___', 'slowly', 'Add -ly to make an adverb.', ['slowly', 'slowness', 'slower', 'slows']],
      ['agree : disagree :: appear : ___', 'disappear', 'The prefix dis- means not.', ['disappear', 'reappear', 'appearing', 'appearance']],
      ['act : action :: create : ___', 'creation', 'Add -ion to make a noun.', ['creation', 'creative', 'creator', 'created']]
    ]
  })),
  sk('WpSn', 'Word pattern sentences', 'Prefixes and suffixes', G(8, 12), pairs({
    prompt: s => `Choose the word that completes the sentence.<br>${em(s)}`,
    items: [
      ['The villain was ___ of any regret. (without feeling)', 'devoid', 'Devoid means without.', ['devoid', 'void', 'avoid', 'devout']],
      ['After the move, they had to ___ the furniture. (arrange again)', 'rearrange', 'Re- means again.', ['rearrange', 'prearrange', 'misarrange', 'arrangement']],
      ['The judge was ___ in her decision. (not biased)', 'impartial', 'Im- means not.', ['impartial', 'partial', 'repartial', 'partially']],
      ['The path was ___ after the storm. (not able to be passed)', 'impassable', 'Im- means not; -able means able.', ['impassable', 'passable', 'repass', 'passing']],
      ['The speech was ___ to the audience. (full of meaning)', 'meaningful', '-ful means full of.', ['meaningful', 'meaningless', 'meaning', 'meant']],
      ['The two countries signed a ___ agreement. (between nations)', 'international', 'Inter- means between.', ['international', 'subnational', 'nationalize', 'unnational']],
      ['It was ___ to see so many empty chairs. (causing sadness)', 'saddening', '-ening shows an ongoing effect.', ['saddening', 'unsad', 'resad', 'sadly']],
      ['He is ___ about nothing. (not worried)', 'unconcerned', 'Un- means not.', ['unconcerned', 'concerning', 'reconcerned', 'concernment']]
    ]
  })),

  /* ================= Greek and Latin roots ================= */
  sk('RtSo', 'Sort words by shared Greek or Latin roots', 'Greek and Latin roots', G(7, 12), classify({
    categories: ['bio (life)', 'graph (write)', 'port (carry)', 'spect (look)', 'dict (say)'],
    prompt: w => `Which root does ${b(w)} share?`,
    items: [
      ['biology', 'bio (life)'], ['biography', 'bio (life)'], ['antibiotic', 'bio (life)'],
      ['autograph', 'graph (write)'], ['photograph', 'graph (write)'], ['paragraph', 'graph (write)'],
      ['transport', 'port (carry)'], ['export', 'port (carry)'], ['portable', 'port (carry)'],
      ['inspect', 'spect (look)'], ['spectator', 'spect (look)'], ['perspective', 'spect (look)'],
      ['predict', 'dict (say)'], ['dictionary', 'dict (say)'], ['contradict', 'dict (say)']
    ].map(([w, r]) => [w, r, `${b(w)} contains the root ${b(r.split(' ')[0])}, meaning "${r.match(/\((.*)\)/)[1]}".`])
  })),
  sk('RtCl', 'Use Greek and Latin roots as clues to the meanings of words', 'Greek and Latin roots', G(7, 12), pairs({
    prompt: q => q,
    items: [
      ['The root <em>rupt</em> means "break". What does <em>interrupt</em> most likely mean?', 'break into a conversation', 'inter- (between) + rupt (break).', ['break into a conversation', 'walk away', 'repeat again', 'agree fully']],
      ['The root <em>aud</em> means "hear". What is an <em>audience</em>?', 'a group that listens', 'aud = hear.', ['a group that listens', 'a group that sings', 'a stage', 'a speaker']],
      ['The root <em>vis</em> means "see". What does <em>invisible</em> mean?', 'not able to be seen', 'in- (not) + vis (see) + -ible (able).', ['not able to be seen', 'easy to see', 'seen twice', 'seen by many']],
      ['The root <em>tract</em> means "pull". What does <em>tractor</em> do?', 'pulls heavy loads', 'tract = pull.', ['pulls heavy loads', 'pushes loads', 'carries water', 'lights fields']],
      ['The root <em>scrib/script</em> means "write". What is a <em>manuscript</em>?', 'a handwritten document', 'manu (hand) + script (write).', ['a handwritten document', 'a printed poster', 'a spoken speech', 'a drawing']],
      ['The root <em>chron</em> means "time". What does <em>chronological</em> order mean?', 'in order of time', 'chron = time.', ['in order of time', 'in alphabetical order', 'in order of size', 'in random order']],
      ['The root <em>geo</em> means "earth". What does a <em>geologist</em> study?', 'the Earth', 'geo = earth.', ['the Earth', 'the stars', 'the sea only', 'ancient words']],
      ['The root <em>mal</em> means "bad". What does <em>malfunction</em> mean?', 'to work badly', 'mal = bad.', ['to work badly', 'to work well', 'to start', 'to repair']]
    ]
  })),
  sk('RtMn', 'Determine the meanings of Greek and Latin roots', 'Greek and Latin roots', G(7, 12), pairs({
    prompt: r => `What does the root ${b(r)} mean?`,
    items: [
      ['aqua', 'water'], ['bene', 'good'], ['cred', 'believe'], ['duc/duct', 'lead'], ['fract', 'break'],
      ['gen', 'birth or kind'], ['jur/jus', 'law or right'], ['luc', 'light'], ['man', 'hand'],
      ['mort', 'death'], ['ped', 'foot'], ['phon', 'sound'], ['sol', 'sun or alone'], ['terr', 'earth'],
      ['vid/vis', 'see'], ['zo', 'animal'], ['hydro', 'water'], ['anthrop', 'human'], ['cosm', 'universe'], ['path', 'feeling']
    ].map(([r, m]) => [r, m, `The root ${b(r)} means "${m}".`])
  })),
  sk('RtWd', 'Determine the meanings of words with Greek and Latin roots', 'Greek and Latin roots', G(7, 12), pairs({
    prompt: w => `What does ${b(w)} mean?`,
    items: [
      ['benefactor', 'a person who does good for others', 'bene (good) + fact (do).'],
      ['credible', 'believable', 'cred (believe) + -ible (able).'],
      ['aquatic', 'relating to water', 'aqua = water.'],
      ['pedestrian', 'a person on foot', 'ped = foot.'],
      ['mortal', 'subject to death', 'mort = death.'],
      ['anthropology', 'the study of humans', 'anthrop (human) + -logy (study).'],
      ['hydrate', 'to supply with water', 'hydr = water.'],
      ['cosmopolitan', 'at home in the whole world', 'cosm (universe) + polit (citizen).'],
      ['sympathy', 'shared feeling', 'sym (together) + path (feeling).'],
      ['telepathy', 'communication of feelings from far away', 'tele (far) + path (feeling).'],
      ['zoology', 'the study of animals', 'zo (animal) + -logy (study).'],
      ['phonetics', 'the study of speech sounds', 'phon = sound.']
    ]
  })),

  /* ================= Homophones ================= */
  sk('HmUs', 'Use the correct homophone', 'Homophones', G(6, 12), pairs({
    prompt: s => `Choose the correct word.<br>${em(s)}`,
    items: [
      ['The queen\'s ___ lasted forty years.', 'reign', 'Reign means rule.', ['reign', 'rain', 'rein']],
      ['Pull the ___ to slow the horse.', 'rein', 'A rein is a strap used to guide a horse.', ['rein', 'reign', 'rain']],
      ['You must ___ the dough before baking.', 'knead', 'Knead means to work dough.', ['knead', 'need', 'kneed']],
      ['We ___ more flour.', 'need', 'Need means require.', ['need', 'knead', 'kneed']],
      ['The ___ of the bell echoed across the valley.', 'peal', 'A peal is a loud ringing.', ['peal', 'peel', 'pele']],
      ['Please ___ the orange for me.', 'peel', 'Peel means remove the skin.', ['peel', 'peal', 'pele']],
      ['I eat a bowl of ___ every morning.', 'cereal', 'Cereal is a grain food.', ['cereal', 'serial', 'cerial']],
      ['The TV ___ ran for six seasons.', 'serial', 'A serial is a story in parts.', ['serial', 'cereal', 'cerial']],
      ['The ___ to the throne waited patiently.', 'heir', 'An heir inherits.', ['heir', 'air', 'err']],
      ['The trees stood ___ in winter.', 'bare', 'Bare means without covering.', ['bare', 'bear', 'bair']],
      ['I ate the ___ pie by myself.', 'whole', 'Whole means all of it.', ['whole', 'hole', 'hoal']],
      ['The mouse squeezed through a ___ in the wall.', 'hole', 'A hole is an opening.', ['hole', 'whole', 'hoal']]
    ]
  })),
  sk('HmEr', 'Identify and correct errors with homophones', 'Homophones', G(7, 12), pairs({
    prompt: s => `Which word is used incorrectly, and what is the correction?<br>${em(s)}`,
    items: [
      ['The principle of the school gave a speech.', 'principle → principal', 'Principal is the head of a school.', ['principle → principal', 'gave → give', 'speech → speach', 'No error']],
      ['We had a quiet weak at the cottage.', 'weak → week', 'Week is seven days.', ['weak → week', 'quiet → quite', 'cottage → cotage', 'No error']],
      ['She past the ball to her teammate.', 'past → passed', 'Passed is the verb.', ['past → passed', 'ball → bawl', 'teammate → team mate', 'No error']],
      ['The knight was dark and stormy.', 'knight → night', 'Night is the time after day.', ['knight → night', 'dark → derk', 'stormy → stormey', 'No error']],
      ['The farmer plowed the hole field by noon.', 'hole → whole', 'Whole means all of it.', ['hole → whole', 'plowed → ploughed', 'noon → noone', 'No error']],
      ['The lessen was easy to understand.', 'lessen → lesson', 'A lesson is something taught.', ['lessen → lesson', 'easy → easey', 'understand → understan', 'No error']],
      ['The plain landed safely on the runway.', 'plain → plane', 'A plane is an aircraft.', ['plain → plane', 'landed → lended', 'safely → safly', 'No error']],
      ['I could not here the speaker.', 'here → hear', 'Hear is to listen.', ['here → hear', 'could → cud', 'speaker → speeker', 'No error']]
    ]
  })),

  /* ================= Foreign words and expressions ================= */
  sk('FgEt', 'Use etymologies to determine the meanings of words', 'Foreign words and expressions', G(9, 12), pairs({
    prompt: q => q,
    items: [
      ['<em>Quarantine</em> comes from the Italian <em>quaranta giorni</em>, "forty days". What does quarantine mean?', 'a period of isolation to stop disease spreading', 'Ships were once held for forty days.', ['a period of isolation to stop disease spreading', 'a forty-day holiday', 'a type of ship', 'a counting game']],
      ['<em>Salary</em> comes from the Latin <em>salarium</em>, linked to salt given to Roman soldiers. What does salary mean?', 'regular pay for work', 'Salt was once part of payment.', ['regular pay for work', 'a type of seasoning', 'a Roman coin', 'a soldier\'s uniform']],
      ['<em>Sabotage</em> likely comes from French <em>sabot</em>, a wooden shoe. What does sabotage mean?', 'to deliberately damage or obstruct', 'Workers allegedly threw shoes into machines.', ['to deliberately damage or obstruct', 'to walk loudly', 'to build shoes', 'to dance']],
      ['<em>Panic</em> comes from <em>Pan</em>, a Greek god whose sudden appearance frightened travellers. What does panic mean?', 'sudden overwhelming fear', 'It originally described fear caused by Pan.', ['sudden overwhelming fear', 'gentle joy', 'a musical instrument', 'a hiking trail']],
      ['<em>Disaster</em> comes from Italian <em>dis-</em> ("bad") + <em>astro</em> ("star"). What does disaster mean?', 'a sudden terrible event', 'It was thought to be caused by bad stars.', ['a sudden terrible event', 'a bright star', 'a map of stars', 'a telescope']],
      ['<em>Candidate</em> comes from Latin <em>candidatus</em>, "dressed in white". What is a candidate?', 'a person seeking a position', 'Roman office seekers wore white togas.', ['a person seeking a position', 'a person who sells candles', 'a type of robe', 'a kind of vote']]
    ]
  })),
  sk('FgCx', 'Use context as a clue to the meanings of foreign expressions', 'Foreign words and expressions', G(9, 12), pairs({
    prompt: s => `What does the expression in bold mean?<br>${s}`,
    items: [
      ['We have only one afternoon in Rome, so <strong>carpe diem</strong>: let\'s see everything!', 'seize the day', 'The speaker urges making the most of the time.', ['seize the day', 'goodbye', 'have a nice trip', 'thank you']],
      ['At the station she waved, calling "<strong>Bon voyage</strong>!"', 'have a good trip', 'Said to a person leaving.', ['have a good trip', 'good morning', 'see you soon', 'excuse me']],
      ['The two friends had a <strong>tête-à-tête</strong> in the quiet corner, sharing secrets.', 'a private conversation', 'Secrets are shared in a private chat.', ['a private conversation', 'a loud argument', 'a dance', 'a meal']],
      ['His <strong>faux pas</strong>—calling the host by the wrong name—left everyone silent.', 'a social blunder', 'It embarrassed everyone.', ['a social blunder', 'a clever joke', 'a rare gift', 'a fashion trend']],
      ['The dish was served <strong>à la carte</strong>, so each item was priced separately.', 'ordered as separate items', 'Priced separately.', ['ordered as separate items', 'for free', 'in a large group', 'with wine']],
      ['She had a certain <strong>je ne sais quoi</strong> that made her unforgettable, though no one could say why.', 'an indefinable special quality', 'No one could say why.', ['an indefinable special quality', 'a bad habit', 'a strong accent', 'a famous name']],
      ['The performance was a <strong>pièce de résistance</strong>; nothing else in the show compared.', 'the most outstanding part', 'Nothing compared.', ['the most outstanding part', 'the first act', 'a mistake', 'a rehearsal']],
      ['Before the trial, the lawyer reviewed the <strong>status quo</strong> of the case.', 'the existing state of affairs', 'It describes the current situation.', ['the existing state of affairs', 'the final verdict', 'a secret plan', 'the next step']]
    ]
  })),
  sk('FgUs', 'Use the correct foreign expression', 'Foreign words and expressions', G(9, 12), pairs({
    prompt: s => `Choose the expression that best completes the sentence.<br>${em(s)}`,
    items: [
      ['She arrived with a bouquet and said, "___!" as the guests cheered. (a cry of joy for a surprise)', 'Voilà', 'Voilà means "there it is!".', ['Voilà', 'Adios', 'Ciao', 'Gesundheit']],
      ['She returned to her ___ to give the graduation speech. (the school she attended)', 'alma mater', 'Alma mater means one\'s former school.', ['alma mater', 'carte blanche', 'pro bono', 'ad hoc']],
      ['The committee formed an ___ group to handle this one issue. (for this specific purpose)', 'ad hoc', 'Ad hoc means for this purpose only.', ['ad hoc', 'a priori', 'pro bono', 'de facto']],
      ['The lawyer took the case ___, charging no fee. (for the public good)', 'pro bono', 'Pro bono means done free for the public good.', ['pro bono', 'ad hoc', 'bona fide', 'per se']],
      ['The antique was a ___ Ming vase, not a copy. (genuine)', 'bona fide', 'Bona fide means genuine.', ['bona fide', 'pro bono', 'ad hoc', 'status quo']],
      ['Money itself is not evil ___; its use matters. (in itself)', 'per se', 'Per se means by itself.', ['per se', 'ad hoc', 'pro bono', 'carte blanche']],
      ['The director gave the designer ___ to redesign the stage. (full freedom)', 'carte blanche', 'Carte blanche means unrestricted authority.', ['carte blanche', 'faux pas', 'ad hoc', 'status quo']],
      ['The team lost, but she shrugged and said, "___" (such is life).', 'C\'est la vie', 'It means "that\'s life".', ['C\'est la vie', 'Bon appétit', 'Carpe diem', 'Alma mater']]
    ]
  })),

  /* ================= Word usage and nuance ================= */
  sk('NuDf', 'Describe the difference between related words', 'Word usage and nuance', G(6, 12), pairs({
    prompt: q => q,
    items: [
      ['Which word means a stronger kind of <em>walk</em> than "stroll"?', 'march', 'A march is deliberate and strong; a stroll is relaxed.', ['march', 'wander', 'drift', 'saunter']],
      ['Which word means a more intense feeling than <em>happy</em>?', 'ecstatic', 'Ecstatic means overwhelmed with joy.', ['ecstatic', 'content', 'pleased', 'satisfied']],
      ['Which word has the most negative meaning?', 'scheme', 'A scheme suggests secret or dishonest planning; "plan" is neutral.', ['scheme', 'plan', 'outline', 'strategy']],
      ['Which word describes a quieter voice than <em>shout</em>?', 'murmur', 'To murmur is to speak softly.', ['murmur', 'bellow', 'roar', 'yell']],
      ['Which word means <em>careful and exact</em> rather than just <em>careful</em>?', 'meticulous', 'Meticulous stresses attention to detail.', ['meticulous', 'cautious', 'wary', 'watchful']],
      ['Which word is stronger than <em>dislike</em>?', 'despise', 'To despise is to feel strong contempt.', ['despise', 'avoid', 'doubt', 'resist']],
      ['Which word is the most formal for <em>get</em>?', 'obtain', 'Obtain is formal.', ['obtain', 'grab', 'snag', 'nab']],
      ['Which word means <em>thin</em> in a positive way?', 'slender', 'Slender is complimentary; "skinny" and "scrawny" are not.', ['slender', 'scrawny', 'skinny', 'gaunt']]
    ]
  })),
  sk('NuCd', 'Choose the word whose connotation and denotation best match the sentence', 'Word usage and nuance', G(8, 12), pairs({
    prompt: s => `Choose the best word.<br>${em(s)}`,
    items: [
      ['The ___ lawyer pressed every point in court. (aggressive but admirable)', 'tenacious', 'Tenacious is positive: determined.', ['tenacious', 'stubborn', 'pushy', 'obstinate']],
      ['The ___ child refused to share anything. (negative)', 'selfish', 'Selfish is negative.', ['selfish', 'thrifty', 'independent', 'frugal']],
      ['Our guide was a ___ man who knew every trail. (positive: experienced)', 'seasoned', 'Seasoned suggests experience.', ['seasoned', 'aged', 'ancient', 'decrepit']],
      ['The coach praised the team\'s ___ spirit. (positive: eager and lively)', 'spirited', 'Spirited is positive.', ['spirited', 'rowdy', 'unruly', 'noisy']],
      ['The ___ crowd rushed the gates. (negative: out of control)', 'mob', 'Mob suggests disorder.', ['mob', 'gathering', 'audience', 'assembly']],
      ['The ___ chef refused to change a single ingredient. (positive: dedicated)', 'passionate', 'Passionate is positive.', ['passionate', 'obsessed', 'fanatical', 'stubborn']],
      ['Her ___ remarks wounded him. (negative: harsh)', 'biting', 'Biting means harsh and cutting.', ['biting', 'gentle', 'tender', 'mild']],
      ['The ___ landscape stretched for miles. (neutral/positive: wide open)', 'vast', 'Vast is neutral to positive.', ['vast', 'bleak', 'desolate', 'barren']]
    ]
  })),
  sk('NuPr', 'Use words accurately and precisely', 'Word usage and nuance', G(9, 12), pairs({
    prompt: s => `Which word fits the meaning best?<br>${em(s)}`,
    items: [
      ['The scientist\'s results were ___; no other lab could repeat them. (not reliable)', 'dubious', 'Dubious means doubtful.', ['dubious', 'robust', 'definitive', 'rigorous']],
      ['The politician\'s speech was full of ___, saying little in many words. (empty talk)', 'rhetoric', 'Rhetoric here means fancy but empty speech.', ['rhetoric', 'evidence', 'candour', 'logic']],
      ['Her ___ for detail saved the project. (careful attention)', 'eye', 'An "eye for detail" is idiomatic.', ['eye', 'ear', 'tongue', 'foot']],
      ['The two cultures ___ in many ways, blending traditions over centuries. (came together)', 'converged', 'Converge means come together.', ['converged', 'diverged', 'dispersed', 'receded']],
      ['The news ___ the town; people were shocked into silence. (stunned)', 'staggered', 'Staggered means shocked.', ['staggered', 'amused', 'entertained', 'soothed']],
      ['The chef\'s dishes are known for their ___ of flavours. (pleasing combination)', 'harmony', 'Harmony means a pleasing blend.', ['harmony', 'clash', 'discord', 'dispute']],
      ['The new rule will ___ the problem rather than solve it. (make worse)', 'exacerbate', 'Exacerbate means to worsen.', ['exacerbate', 'alleviate', 'resolve', 'mitigate']],
      ['The judge\'s ___ ruling surprised everyone. (clear and final)', 'unequivocal', 'Unequivocal means leaving no doubt.', ['unequivocal', 'ambiguous', 'tentative', 'vague']]
    ]
  })),
  sk('NuTh', 'Replace words using a thesaurus', 'Word usage and nuance', G(8, 12), pairs({
    prompt: s => `Which word can replace the underlined word without changing the meaning?<br>${s}`,
    items: [
      ['The speaker\'s <u>brief</u> remarks ended quickly.', 'concise', 'Brief and concise both mean short.', ['concise', 'lengthy', 'rambling', 'detailed']],
      ['The <u>enormous</u> tree shaded the yard.', 'gigantic', 'Enormous and gigantic are synonyms.', ['gigantic', 'slender', 'delicate', 'ancient']],
      ['She was <u>reluctant</u> to speak.', 'hesitant', 'Reluctant means unwilling; hesitant is similar.', ['hesitant', 'eager', 'ready', 'outspoken']],
      ['The <u>ancient</u> manuscript was fragile.', 'archaic', 'Ancient and archaic both mean very old.', ['archaic', 'modern', 'fresh', 'recent']],
      ['His <u>candid</u> answer surprised us.', 'frank', 'Candid means honest and open.', ['frank', 'evasive', 'secretive', 'guarded']],
      ['The soldiers showed great <u>courage</u>.', 'valour', 'Courage and valour are synonyms.', ['valour', 'fear', 'doubt', 'caution']],
      ['The city is <u>thriving</u>.', 'flourishing', 'Thriving means growing well.', ['flourishing', 'declining', 'fading', 'shrinking']],
      ['The teacher gave a <u>clear</u> explanation.', 'lucid', 'Clear and lucid both mean easy to understand.', ['lucid', 'murky', 'confusing', 'vague']]
    ]
  })),
  sk('NuDc', 'Use dictionary entries to determine correct usage', 'Word usage and nuance', G(8, 12), pairs({
    prompt: q => q,
    items: [
      ['<strong>ambivalent</strong> (adj.): having mixed feelings about something. Which sentence uses it correctly?', 'She felt ambivalent about moving: excited yet sad.', 'Mixed feelings match the definition.', ['She felt ambivalent about moving: excited yet sad.', 'The ambivalent dog ran across the field.', 'He was ambivalent when the exam ended with 100%.', 'The ambivalent cake was delicious.']],
      ['<strong>cache</strong> (n.): a hidden or stored supply. Which sentence uses it correctly?', 'The hikers found a cache of food in the cabin.', 'A cache is a stored supply.', ['The hikers found a cache of food in the cabin.', 'He paid in cache at the till.', 'The cache of the room was beautiful.', 'She cached for a cold.']],
      ['<strong>discreet</strong> (adj.): careful in what one says or does. Which sentence uses it correctly?', 'The assistant was discreet about the private meeting.', 'Discreet means careful and tactful.', ['The assistant was discreet about the private meeting.', 'The two discreet planets were far apart.', 'He was discreet when he announced it to everyone loudly.', 'The discreet music was very loud.']],
      ['<strong>tenuous</strong> (adj.): very weak or slight. Which sentence uses it correctly?', 'The evidence connecting the suspect to the crime was tenuous.', 'Tenuous means weak.', ['The evidence connecting the suspect to the crime was tenuous.', 'The tenuous bridge held a hundred trucks.', 'She had a tenuous grip on the heavy anchor.', 'He told a tenuous, bold lie.']],
      ['<strong>mitigate</strong> (v.): to make less severe. Which sentence uses it correctly?', 'Sandbags helped mitigate the flood damage.', 'Mitigate means lessen.', ['Sandbags helped mitigate the flood damage.', 'The sun mitigated the temperature to 40 degrees.', 'He mitigated his house into a mansion.', 'She mitigated the wall.']],
      ['<strong>lenient</strong> (adj.): not strict. Which sentence uses it correctly?', 'The lenient teacher allowed extra time on the test.', 'Lenient means not strict.', ['The lenient teacher allowed extra time on the test.', 'The lenient mountain was very steep.', 'A lenient iron bar bent in two.', 'He was lenient to the strict rules and enforced them harshly.']]
    ]
  })),
  sk('NuCt', 'Explore words with new or contested usages', 'Word usage and nuance', G(10, 12), pairs({
    prompt: q => q,
    items: [
      ['Traditionally, <em>decimate</em> means …', 'to destroy a large part of something', 'Originally it meant killing one in ten.', ['to destroy a large part of something', 'to count carefully', 'to divide by ten exactly', 'to decorate']],
      ['Traditionally, <em>nauseous</em> means …', 'causing nausea', 'Traditional usage: "nauseated" means feeling sick.', ['causing nausea', 'feeling sick', 'being angry', 'being dizzy']],
      ['Traditionally, <em>literally</em> means …', 'in a literal sense; exactly', 'It is often used loosely for emphasis, which some dispute.', ['in a literal sense; exactly', 'figuratively', 'kind of', 'rarely']],
      ['Traditionally, <em>disinterested</em> means …', 'impartial', '"Uninterested" means bored or indifferent.', ['impartial', 'bored', 'unfriendly', 'biased']],
      ['Which usage of <em>fewer</em> is traditionally correct?', 'Fewer students came today.', 'Use "fewer" with countable nouns.', ['Fewer students came today.', 'Less students came today.', 'Lesser students came today.', 'Least students came today.']],
      ['Which is the traditional meaning of <em>enormity</em>?', 'great wickedness', 'It is often used to mean huge size, which some dispute.', ['great wickedness', 'huge size', 'great speed', 'small amount']],
      ['Which is the traditional use of <em>who</em> vs. <em>whom</em>?', 'Whom is the object: "To whom did you speak?"', 'Whom takes the place of an object.', ['Whom is the object: "To whom did you speak?"', 'Whom is the subject: "Whom called?"', 'They are always interchangeable.', 'Who is only used in questions.']],
      ['"Can I go to the store?" Traditionally, which word asks permission?', 'may', '"May" asks permission; "can" asks ability.', ['may', 'can', 'will', 'shall']]
    ]
  })),

  /* ================= Analogies ================= */
  sk('Anl', 'Analogies', 'Analogies', G(6, 12), pairs({
    prompt: q => `Complete the analogy.<br>${em(q)}`,
    items: [
      ['hot : cold :: day : ___', 'night', 'Opposites.', ['night', 'sun', 'morning', 'warm']],
      ['puppy : dog :: kitten : ___', 'cat', 'Young to adult.', ['cat', 'lion', 'bird', 'mouse']],
      ['pen : write :: knife : ___', 'cut', 'Tool to its action.', ['cut', 'sharp', 'fork', 'kitchen']],
      ['finger : hand :: toe : ___', 'foot', 'Part to whole.', ['foot', 'leg', 'nail', 'shoe']],
      ['author : book :: composer : ___', 'symphony', 'Creator to creation.', ['symphony', 'concert', 'orchestra', 'note']],
      ['thermometer : temperature :: ruler : ___', 'length', 'Tool to what it measures.', ['length', 'weight', 'time', 'speed']],
      ['bee : hive :: bird : ___', 'nest', 'Animal to home.', ['nest', 'tree', 'wing', 'feather']],
      ['glad : happy :: sad : ___', 'unhappy', 'Synonyms.', ['unhappy', 'cheerful', 'angry', 'tired']],
      ['chapter : book :: scene : ___', 'play', 'Part to whole.', ['play', 'actor', 'stage', 'script']],
      ['drought : water :: famine : ___', 'food', 'Lack of something.', ['food', 'rain', 'money', 'wind']]
    ]
  })),
  sk('AnlC', 'Analogies: challenge', 'Analogies', G(8, 12), pairs({
    prompt: q => `Complete the analogy.<br>${em(q)}`,
    items: [
      ['frugal : miserly :: thrifty : ___', 'stingy', 'Both pairs go from positive to extreme negative.', ['stingy', 'generous', 'wealthy', 'careful']],
      ['reticent : talkative :: timid : ___', 'bold', 'Opposites.', ['bold', 'shy', 'quiet', 'afraid']],
      ['verbose : concise :: lavish : ___', 'sparse', 'Opposites.', ['sparse', 'rich', 'generous', 'grand']],
      ['whisper : shout :: stroll : ___', 'sprint', 'Mild to intense action.', ['sprint', 'walk', 'amble', 'wander']],
      ['archaic : modern :: ancient : ___', 'recent', 'Opposites.', ['recent', 'old', 'aged', 'historic']],
      ['eloquent : speaker :: skilled : ___', 'craftsperson', 'A quality of a person.', ['craftsperson', 'speech', 'tool', 'work']],
      ['catalyst : reaction :: spark : ___', 'fire', 'Something that triggers something.', ['fire', 'heat', 'match', 'smoke']],
      ['obstinate : yielding :: rigid : ___', 'flexible', 'Opposites.', ['flexible', 'hard', 'stiff', 'tough']]
    ]
  })),

  /* ================= Context clues ================= */
  sk('CxSy', 'Determine the meaning of words using synonyms in context', 'Context clues', G(6, 12), pairs({
    prompt: s => `${s}<br>What does the underlined word mean?`,
    items: [
      ['The explorer was <u>intrepid</u>, or fearless, as he entered the cave.', 'fearless', 'The synonym "fearless" is right in the sentence.'],
      ['The judge\'s <u>impartial</u>, unbiased ruling pleased both sides.', 'unbiased', '"Unbiased" is the clue.'],
      ['Mara\'s <u>meticulous</u>, or careful, notes impressed her teacher.', 'careful', '"Or careful" defines it.'],
      ['The desert was <u>arid</u>, dry and cracked.', 'dry', '"Dry" is the clue.'],
      ['He was a <u>benevolent</u> and kind king.', 'kind', '"Kind" is the clue.'],
      ['The task was <u>arduous</u>, demanding and difficult.', 'difficult', '"Difficult" is the clue.'],
      ['Her <u>candid</u>, honest answer surprised us.', 'honest', '"Honest" is the clue.'],
      ['The villagers were <u>jubilant</u>, joyful at the news.', 'joyful', '"Joyful" is the clue.']
    ].map(([s, a, n]) => [s, a, n])
  })),
  sk('CxAn', 'Determine the meaning of words using antonyms in context', 'Context clues', G(7, 12), pairs({
    prompt: s => `${s}<br>What does the underlined word mean?`,
    items: [
      ['Unlike his <u>garrulous</u> brother, Sam rarely said a word.', 'talkative', 'Unlike signals an opposite of "rarely said a word".', ['talkative', 'silent', 'angry', 'tall']],
      ['The first day was <u>tranquil</u>, but the second was full of chaos.', 'calm', '"But" signals the opposite of chaos.', ['calm', 'noisy', 'cold', 'brief']],
      ['She was <u>frugal</u>, whereas her sister spent money freely.', 'careful with money', '"Whereas" contrasts with spending freely.', ['careful with money', 'generous', 'greedy', 'poor']],
      ['His <u>lucid</u> explanation made sense, unlike the earlier muddled one.', 'clear', 'Contrasted with muddled.', ['clear', 'confusing', 'long', 'short']],
      ['The old building looked <u>decrepit</u>, yet its neighbour was brand-new.', 'run-down', 'Contrasted with brand-new.', ['run-down', 'modern', 'tall', 'quiet']],
      ['Though most animals avoid fire, the <u>intrepid</u> pony stayed close.', 'bold', 'Contrasted with animals that avoid fire.', ['bold', 'fearful', 'young', 'fast']],
      ['Rather than <u>ascend</u> the stairs, she took the elevator down.', 'go up', 'Contrasted with going down.', ['go up', 'go down', 'avoid', 'count']],
      ['He was <u>reticent</u> in class but outspoken at home.', 'reluctant to speak', 'Contrasted with outspoken.', ['reluctant to speak', 'talkative', 'angry', 'friendly']]
    ]
  })),
  sk('CxMn', 'Use context to identify the meaning of a word', 'Context clues', G(6, 12), pairs({
    prompt: s => `${s}<br>What does the underlined word most likely mean?`,
    items: [
      ['After weeks of no rain, the farmers feared the <u>drought</u> would ruin the harvest.', 'a long period without rain', 'The context describes lack of rain.', ['a long period without rain', 'a heavy storm', 'a strong wind', 'a pest']],
      ['The <u>meagre</u> meal of bread and water barely fed the family.', 'small in amount', '"Barely fed" suggests small.', ['small in amount', 'delicious', 'enormous', 'expensive']],
      ['The audience was <u>captivated</u>; no one moved or whispered.', 'held spellbound', 'No one moved suggests rapt attention.', ['held spellbound', 'bored', 'annoyed', 'confused']],
      ['The explorers faced <u>treacherous</u> cliffs, any one of which could send them tumbling.', 'dangerous', 'The danger of falling shows the meaning.', ['dangerous', 'beautiful', 'colourful', 'ancient']],
      ['His <u>apprehension</u> grew as the exam time approached, and his hands shook.', 'anxiety', 'Shaking hands show worry.', ['anxiety', 'excitement', 'pride', 'laughter']],
      ['The <u>scarce</u> supplies meant each person got only a spoonful.', 'in short supply', 'Only a spoonful suggests little.', ['in short supply', 'plentiful', 'tasty', 'fresh']],
      ['She spoke so <u>eloquently</u> that the crowd applauded her every sentence.', 'fluently and persuasively', 'The applause shows her skill.', ['fluently and persuasively', 'quietly', 'angrily', 'nervously']],
      ['The ship was <u>adrift</u> in the middle of the ocean, with no engine or sail.', 'floating without direction', 'No engine or sail suggests drifting.', ['floating without direction', 'sinking', 'racing', 'docked']]
    ]
  })),
  sk('CxDm', 'Domain-specific vocabulary in context: science and technical subjects', 'Context clues', G(8, 12), pairs({
    prompt: s => `${s}<br>What does the underlined word mean?`,
    items: [
      ['Plants use <u>photosynthesis</u> to convert sunlight, water and carbon dioxide into sugar.', 'making food from light', 'The sentence describes the process.', ['making food from light', 'absorbing water', 'releasing carbon', 'growing roots']],
      ['The engineer measured the <u>tensile</u> strength, how much pulling force the cable could take before breaking.', 'able to resist pulling', 'The definition is in the sentence.', ['able to resist pulling', 'able to resist heat', 'able to bend', 'able to melt']],
      ['The <u>enzyme</u> sped up the chemical reaction without being used up.', 'a protein that speeds up reactions', 'It speeds up reactions without being consumed.', ['a protein that speeds up reactions', 'a type of sugar', 'a gas', 'a metal']],
      ['A <u>herbivore</u>, such as a deer, feeds only on plants.', 'an animal that eats plants', 'The example and definition are given.', ['an animal that eats plants', 'an animal that eats meat', 'a hunter', 'a bird']],
      ['The <u>algorithm</u> followed a precise sequence of steps to sort the list.', 'a step-by-step procedure', 'It follows a precise sequence of steps.', ['a step-by-step procedure', 'a type of computer', 'a bug in a program', 'a password']],
      ['The <u>tectonic</u> plates shift slowly, causing earthquakes.', 'relating to Earth\'s crust movement', 'The clue is plates shifting and earthquakes.', ['relating to Earth\'s crust movement', 'relating to weather', 'relating to oceans', 'relating to stars']],
      ['Heat moves through the metal by <u>conduction</u>, passing from one particle to the next.', 'transfer of heat by contact', 'The sentence describes particle-to-particle transfer.', ['transfer of heat by contact', 'transfer of heat by light', 'cooling by wind', 'melting']],
      ['The <u>circumference</u> of the circle is the distance all the way around it.', 'the distance around a circle', 'The sentence defines it.', ['the distance around a circle', 'the distance across', 'the area inside', 'the centre']]
    ]
  }))
];
