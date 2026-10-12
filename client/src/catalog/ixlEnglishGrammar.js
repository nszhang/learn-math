/* English — Grammar and Mechanics (grades 6–12). See ixlEnglish.js. */
import { classify, pairs, ok } from './quiz.js';

const G = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const em = s => `<em>${s}</em>`;
const b = s => `<strong>${s}</strong>`;
// "Which is correct?" builder. items: [correct, [wrong…], note, optionalContextQuestion]
const correct = (items, q = 'Which sentence is correct?') => pairs({
  prompt: ctx => ctx || q,
  items: items.map(([a, w, n, ctx]) => [ctx || '', a, n, [a, ...w]])
});

export const GRAMMAR_SPECS = [
  /* ================= Sentences, fragments and run-ons ================= */
  sk('Frag', 'Identify sentence fragments', 'Sentences, fragments and run-ons', G(6, 12), classify({
    categories: ['Complete sentence', 'Fragment'],
    prompt: s => `Is this a complete sentence or a fragment?<br>${em(s)}`,
    items: [
      ['Running down the hill at top speed.', 'Fragment', 'It has no subject or complete verb.'],
      ['The dog barked all night.', 'Complete sentence', 'It has a subject and a verb and expresses a complete thought.'],
      ['Because the power went out.', 'Fragment', 'A dependent clause cannot stand alone.'],
      ['We left early because the power went out.', 'Complete sentence', 'The dependent clause is attached to a main clause.'],
      ['The tallest building in the city.', 'Fragment', 'There is no verb.'],
      ['Maya won the race.', 'Complete sentence', 'It is complete.'],
      ['After the game ended and the crowd went home.', 'Fragment', 'It begins with "after" and lacks a main clause.'],
      ['Stop talking.', 'Complete sentence', 'A command with an understood subject (you).'],
      ['Although she studied for hours.', 'Fragment', 'A dependent clause alone.'],
      ['My brother, a talented violinist.', 'Fragment', 'There is no main verb.'],
      ['The museum closes at five.', 'Complete sentence', 'It is complete.'],
      ['Which was the best part of the trip.', 'Fragment', 'A relative clause cannot stand alone.']
    ]
  })),
  sk('RunO', 'Identify run-on sentences', 'Sentences, fragments and run-ons', G(6, 12), classify({
    categories: ['Complete sentence', 'Run-on'],
    prompt: s => `Is this a complete sentence or a run-on?<br>${em(s)}`,
    items: [
      ['I love music I play the guitar every day.', 'Run-on', 'Two independent clauses are joined with no punctuation.'],
      ['I love music, and I play the guitar every day.', 'Complete sentence', 'A comma and "and" join the clauses.'],
      ['It rained all morning, the game was cancelled.', 'Run-on', 'A comma alone cannot join two independent clauses (comma splice).'],
      ['It rained all morning; the game was cancelled.', 'Complete sentence', 'A semicolon joins the clauses.'],
      ['She wrote the report he edited it.', 'Run-on', 'Two sentences are fused together.'],
      ['She wrote the report, and he edited it.', 'Complete sentence', 'Correctly joined.'],
      ['The movie was long it was also boring.', 'Run-on', 'Two independent clauses fused.'],
      ['The movie was long and boring.', 'Complete sentence', 'One clause with two adjectives.'],
      ['We were tired, we kept walking.', 'Run-on', 'Comma splice.'],
      ['Although we were tired, we kept walking.', 'Complete sentence', 'Correct complex sentence.']
    ]
  })),
  sk('FrRo', 'Is it a complete sentence, a fragment or a run-on?', 'Sentences, fragments and run-ons', G(6, 12), classify({
    categories: ['Complete sentence', 'Fragment', 'Run-on'],
    prompt: s => `${em(s)}`,
    items: [
      ['The bus arrived late.', 'Complete sentence', 'Subject + verb + complete thought.'],
      ['When the bus arrived late.', 'Fragment', 'Dependent clause only.'],
      ['The bus arrived late we missed the show.', 'Run-on', 'Two clauses fused.'],
      ['Under the old oak tree by the river.', 'Fragment', 'A string of phrases with no verb.'],
      ['Birds migrate south in winter.', 'Complete sentence', 'Complete.'],
      ['Birds migrate south in winter, many travel thousands of miles.', 'Run-on', 'Comma splice.'],
      ['Wishing the day would never end.', 'Fragment', 'Participial phrase only.'],
      ['Please close the window.', 'Complete sentence', 'A command.'],
      ['I called you, you did not answer.', 'Run-on', 'Comma splice.'],
      ['Such a lovely day for a walk.', 'Fragment', 'No verb.']
    ]
  })),
  sk('FrPn', 'Choose punctuation to avoid fragments and run-ons', 'Sentences, fragments and run-ons', G(7, 12), pairs({
    prompt: s => `Choose the best revision.<br>${em(s)}`,
    items: [
      ['We hiked for hours we reached the summit.', 'We hiked for hours; we reached the summit.', 'A semicolon joins related independent clauses.', ['We hiked for hours; we reached the summit.', 'We hiked for hours, we reached the summit.', 'We hiked for hours: we reached the summit and.', 'We hiked for hours. we reached the summit.']],
      ['I was tired, I stayed up late.', 'I was tired, but I stayed up late.', 'A comma plus a conjunction fixes the comma splice.', ['I was tired, but I stayed up late.', 'I was tired I stayed up late.', 'I was tired; but I stayed up late.', 'I was tired but, I stayed up late.']],
      ['Since the storm destroyed the bridge.', 'Since the storm destroyed the bridge, the town was cut off.', 'Add a main clause to fix the fragment.', ['Since the storm destroyed the bridge, the town was cut off.', 'Since the storm destroyed the bridge,', 'Since, the storm destroyed the bridge.', 'Since the storm. Destroyed the bridge.']],
      ['The class read a poem it was long.', 'The class read a poem. It was long.', 'Separate into two sentences.', ['The class read a poem. It was long.', 'The class read a poem, it was long.', 'The class read a poem it, was long.', 'The class read a poem; it, was long.']],
      ['My cousin, who lives in Calgary.', 'My cousin, who lives in Calgary, is visiting.', 'Add a verb to complete the thought.', ['My cousin, who lives in Calgary, is visiting.', 'My cousin who lives in Calgary.', 'My cousin, who lives, in Calgary.', 'My cousin who, lives in Calgary.']],
      ['She loves to paint, however she rarely has time.', 'She loves to paint; however, she rarely has time.', 'A semicolon precedes a conjunctive adverb, followed by a comma.', ['She loves to paint; however, she rarely has time.', 'She loves to paint, however, she rarely has time.', 'She loves to paint however, she rarely has time.', 'She loves to paint: however she rarely has time.']]
    ]
  })),

  /* ================= Phrases and clauses ================= */
  sk('PhCl', 'Is it a phrase or a clause?', 'Phrases and clauses', G(7, 12), classify({
    categories: ['Phrase', 'Clause'],
    prompt: s => `Is this group of words a phrase or a clause?<br>${em(s)}`,
    items: [
      ['under the bridge', 'Phrase', 'No subject and verb.'],
      ['when the rain stopped', 'Clause', 'It has a subject (rain) and a verb (stopped).'],
      ['running along the beach', 'Phrase', 'A participial phrase with no subject.'],
      ['because she studied', 'Clause', 'Subject (she) + verb (studied).'],
      ['to finish the race', 'Phrase', 'An infinitive phrase.'],
      ['the boy laughed', 'Clause', 'Subject + verb.'],
      ['after the long meeting', 'Phrase', 'A prepositional phrase.'],
      ['who lives next door', 'Clause', 'A relative clause with a subject (who) and verb (lives).'],
      ['a tall glass of water', 'Phrase', 'A noun phrase.'],
      ['if you call me', 'Clause', 'Subject (you) + verb (call).']
    ]
  })),
  sk('PrPh', 'Identify prepositional phrases', 'Phrases and clauses', G(6, 12), pairs({
    prompt: s => `Which group of words is a prepositional phrase?<br>${em(s)}`,
    items: [
      ['The cat slept on the warm windowsill.', 'on the warm windowsill', 'It starts with the preposition "on".', ['on the warm windowsill', 'The cat slept', 'slept on', 'the warm']],
      ['We walked along the river after dinner.', 'along the river', 'Preposition "along" + object.', ['along the river', 'We walked', 'walked along', 'after']],
      ['She hid the key under the mat.', 'under the mat', 'Preposition "under" + object.', ['under the mat', 'She hid', 'hid the key', 'key under']],
      ['The gift from my aunt arrived today.', 'from my aunt', 'Preposition "from" + object.', ['from my aunt', 'The gift', 'arrived today', 'gift from']],
      ['Despite the rain, the parade continued.', 'Despite the rain', 'Preposition "despite" + object.', ['Despite the rain', 'the parade', 'parade continued', 'rain, the']],
      ['He sat between his two sisters.', 'between his two sisters', 'Preposition "between" + object.', ['between his two sisters', 'He sat', 'sat between', 'his two']],
      ['The book about dragons won an award.', 'about dragons', 'Preposition "about" + object.', ['about dragons', 'The book', 'won an award', 'book about']],
      ['They arrived before sunrise.', 'before sunrise', 'Preposition "before" + object.', ['before sunrise', 'They arrived', 'arrived before', 'sunrise']]
    ]
  })),
  sk('Appo', 'Identify appositives and appositive phrases', 'Phrases and clauses', G(7, 12), pairs({
    prompt: s => `Which group of words is the appositive?<br>${em(s)}`,
    items: [
      ['My neighbour, a retired pilot, tells great stories.', 'a retired pilot', 'It renames "my neighbour".', ['a retired pilot', 'My neighbour', 'tells great stories', 'great stories']],
      ['Toronto, the largest city in Canada, hosts many festivals.', 'the largest city in Canada', 'It renames Toronto.', ['the largest city in Canada', 'Toronto', 'hosts many festivals', 'many festivals']],
      ['Her sister Mia won the contest.', 'Mia', 'It names which sister.', ['Mia', 'Her sister', 'won the contest', 'the contest']],
      ['We read <em>Hamlet</em>, a tragedy by Shakespeare.', 'a tragedy by Shakespeare', 'It renames Hamlet.', ['a tragedy by Shakespeare', 'We read', 'by Shakespeare', 'Hamlet']],
      ['Dr. Lee, our principal, spoke first.', 'our principal', 'It renames Dr. Lee.', ['our principal', 'Dr. Lee', 'spoke first', 'first']],
      ['The Nile, the longest river in Africa, flows north.', 'the longest river in Africa', 'It renames the Nile.', ['the longest river in Africa', 'The Nile', 'flows north', 'in Africa']],
      ['I met Sam, a friend from camp, at the mall.', 'a friend from camp', 'It renames Sam.', ['a friend from camp', 'I met Sam', 'at the mall', 'from camp']],
      ['Her favourite dessert, chocolate cake, was served.', 'chocolate cake', 'It renames "her favourite dessert".', ['chocolate cake', 'Her favourite dessert', 'was served', 'favourite']]
    ]
  })),
  sk('DpIn', 'Identify dependent and independent clauses', 'Phrases and clauses', G(8, 12), classify({
    categories: ['Independent clause', 'Dependent clause'],
    prompt: s => `${em(s)}`,
    items: [
      ['She baked the bread', 'Independent clause', 'It is a complete thought.'],
      ['which she baked this morning', 'Dependent clause', 'A relative clause that cannot stand alone.'],
      ['The crowd cheered loudly', 'Independent clause', 'It is a complete thought.'],
      ['whenever the crowd cheered', 'Dependent clause', '"Whenever" makes it incomplete.'],
      ['unless you hurry', 'Dependent clause', '"Unless" makes it incomplete.'],
      ['The train leaves at noon', 'Independent clause', 'It is a complete thought.'],
      ['while the orchestra tuned', 'Dependent clause', '"While" makes it incomplete.'],
      ['He forgot his keys', 'Independent clause', 'It is a complete thought.'],
      ['that he borrowed', 'Dependent clause', 'It cannot stand alone.'],
      ['so the plan worked', 'Independent clause', 'It is a complete thought (so is a coordinating conjunction).']
    ]
  })),
  sk('SnTy', 'Is the sentence simple, compound, complex or compound-complex?', 'Phrases and clauses', G(8, 12), classify({
    categories: ['Simple', 'Compound', 'Complex', 'Compound-complex'],
    prompt: s => `${em(s)}`,
    items: [
      ['The dog chased the ball.', 'Simple', 'One independent clause.'],
      ['The dog chased the ball, and the cat watched.', 'Compound', 'Two independent clauses.'],
      ['When the dog chased the ball, the cat watched.', 'Complex', 'One dependent and one independent clause.'],
      ['When the dog chased the ball, the cat watched, and the kids laughed.', 'Compound-complex', 'Two independent clauses and one dependent clause.'],
      ['We hiked and camped for a week.', 'Simple', 'One independent clause with a compound predicate.'],
      ['I was nervous, but I spoke clearly.', 'Compound', 'Two independent clauses.'],
      ['Because it was late, we went home.', 'Complex', 'One dependent and one independent clause.'],
      ['Although it was late, we stayed, so the staff locked up.', 'Compound-complex', 'Two independent clauses and one dependent clause.']
    ]
  })),
  sk('RlCl', 'Combine sentences using relative clauses', 'Phrases and clauses', G(8, 12), pairs({
    prompt: s => `Choose the best way to combine the sentences.<br>${em(s)}`,
    items: [
      ['The girl won the race. The girl is my cousin.', 'The girl who won the race is my cousin.', 'Use "who" for a person.', ['The girl who won the race is my cousin.', 'The girl which won the race is my cousin.', 'The girl whose won the race is my cousin.', 'The girl won the race is my cousin.']],
      ['The book is on the shelf. I borrowed the book.', 'The book that I borrowed is on the shelf.', 'Use "that" for a thing.', ['The book that I borrowed is on the shelf.', 'The book who I borrowed is on the shelf.', 'The book whom I borrowed is on the shelf.', 'The book I borrowed it is on the shelf.']],
      ['The author spoke tonight. We admire the author.', 'The author whom we admire spoke tonight.', 'Use "whom" for the object of "admire".', ['The author whom we admire spoke tonight.', 'The author which we admire spoke tonight.', 'The author whose we admire spoke tonight.', 'The author who we admire him spoke tonight.']],
      ['The student left early. The student\'s backpack was lost.', 'The student whose backpack was lost left early.', 'Use "whose" to show possession.', ['The student whose backpack was lost left early.', 'The student who backpack was lost left early.', 'The student whom backpack was lost left early.', 'The student which backpack was lost left early.']],
      ['The town is small. The town lies near the coast.', 'The town, which lies near the coast, is small.', '"Which" with commas for extra information.', ['The town, which lies near the coast, is small.', 'The town, who lies near the coast, is small.', 'The town who lies near the coast, is small.', 'The town lies near the coast is small.']],
      ['I met a woman. The woman had climbed Everest.', 'I met a woman who had climbed Everest.', 'Use "who" for a person.', ['I met a woman who had climbed Everest.', 'I met a woman which had climbed Everest.', 'I met a woman whom had climbed Everest.', 'I met a woman had climbed Everest.']]
    ]
  })),

  /* ================= Pronouns ================= */
  sk('PnSO', 'Identify and correct errors with subject and object pronouns', 'Pronouns', G(7, 12), correct([
    ['She and I went to the concert.', ['Her and I went to the concert.', 'Her and me went to the concert.', 'Me and her went to the concert.'], 'Use subject pronouns (she, I) as the subject.'],
    ['The teacher gave Sam and me extra time.', ['The teacher gave Sam and I extra time.', 'The teacher gave Sam and myself extra time.', 'The teacher gave Sam and mine extra time.'], 'Use the object pronoun "me" after the verb.'],
    ['Between you and me, the plan is risky.', ['Between you and I, the plan is risky.', 'Between yourself and I, the plan is risky.', 'Between you and mine, the plan is risky.'], 'Prepositions take object pronouns.'],
    ['He and they carpooled to work.', ['Him and they carpooled to work.', 'He and them carpooled to work.', 'Him and them carpooled to work.'], 'Both subjects need subject pronouns.'],
    ['The winners were Mia and she.', ['The winners were Mia and her.', 'The winners were Mia and hers.', 'The winners were Mia and herself.'], 'After "were" use a subject pronoun.'],
    ['Please send the invitation to Tom and her.', ['Please send the invitation to Tom and she.', 'Please send the invitation to Tom and hers.', 'Please send the invitation to Tom and herself.'], 'Use the object pronoun after "to".'],
    ['Kofi and I will present first.', ['Kofi and me will present first.', 'Me and Kofi will present first.', 'Kofi and myself will present first.'], 'Use the subject pronoun "I".'],
    ['The coach picked them and us.', ['The coach picked they and we.', 'The coach picked them and we.', 'The coach picked they and us.'], 'Use object pronouns after the verb.']
  ], 'Which sentence uses pronouns correctly?')),
  sk('PnTA', 'Pronouns after "than" and "as"', 'Pronouns', G(9, 12), correct([
    ['My brother is taller than I.', ['My brother is taller than me.', 'My brother is taller than myself.', 'My brother is taller than mine.'], 'Think "taller than I am".'],
    ['She cooks as well as he.', ['She cooks as well as him.', 'She cooks as well as his.', 'She cooks as well as himself.'], 'Think "as well as he does".'],
    ['Nobody works harder than she.', ['Nobody works harder than her.', 'Nobody works harder than hers.', 'Nobody works harder than herself.'], 'Think "than she does".'],
    ['You are as nervous as I.', ['You are as nervous as me.', 'You are as nervous as mine.', 'You are as nervous as myself.'], 'Think "as I am".'],
    ['They finished sooner than we.', ['They finished sooner than us.', 'They finished sooner than ours.', 'They finished sooner than ourselves.'], 'Think "than we did".'],
    ['The cat likes you more than me.', ['The cat likes you more than I.', 'The cat likes you more than mine.', 'The cat likes you more than myself.'], '"More than me" = more than it likes me.'],
    ['The cat likes you more than I.', ['The cat likes you more than me do.', 'The cat likes you more than I does.', 'The cat likes you more than I likes.'], '"More than I" = more than I like you.'],
    ['Ana is as tall as he.', ['Ana is as tall as him.', 'Ana is as tall as his.', 'Ana is as tall as himself.'], 'Think "as he is".']
  ], 'Which sentence uses the correct pronoun?')),
  sk('PnWh', 'Identify and correct pronoun errors with "who"', 'Pronouns', G(9, 12), correct([
    ['Who is calling?', ['Whom is calling?', 'Whose is calling?', 'Who are calling?'], '"Who" is the subject of "is calling".'],
    ['To whom did you send the letter?', ['To who did you send the letter?', 'To whose did you send the letter?', 'To whomever did you send the letter?'], '"Whom" follows the preposition "to".'],
    ['She is the actor who won the award.', ['She is the actor whom won the award.', 'She is the actor whose won the award.', 'She is the actor which won the award.'], '"Who" is the subject of "won".'],
    ['The man whom we met was a pilot.', ['The man who we met him was a pilot.', 'The man whom we met him was a pilot.', 'The man whose we met was a pilot.'], '"Whom" is the object of "met".'],
    ['Whoever finishes first wins.', ['Whomever finishes first wins.', 'Whichever finishes first wins.', 'Whosever finishes first wins.'], '"Whoever" is the subject of "finishes".'],
    ['Give the prize to whoever answers correctly.', ['Give the prize to whomever answers correctly.', 'Give the prize to whichever answers correctly.', 'Give the prize to who answers correctly.'], '"Whoever" is the subject of "answers".'],
    ['Whom did the committee choose?', ['Who did the committee choose to?', 'Whose did the committee choose?', 'Whomever did the committee choose?'], '"Whom" is the object of "choose".'],
    ['For whom are these flowers?', ['For who are these flowers?', 'For whose are these flowers?', 'For whoever are these flowers?'], '"Whom" follows the preposition "for".']
  ], 'Which sentence is correct?')),
  sk('PnRl', 'Use relative pronouns: who, whom, whose, which and that', 'Pronouns', G(7, 12), pairs({
    prompt: s => `Choose the best relative pronoun.<br>${em(s)}`,
    items: [
      ['The woman ___ lives next door is a doctor.', 'who', 'Use "who" for a person (subject).', ['who', 'whom', 'whose', 'which']],
      ['The coat, ___ I bought last winter, is too small.', 'which', 'Use "which" for extra information.', ['which', 'that', 'who', 'whose']],
      ['The song ___ she wrote became a hit.', 'that', 'Use "that" for essential information about a thing.', ['that', 'who', 'whom', 'whose']],
      ['The student ___ essay won is my cousin.', 'whose', '"Whose" shows possession.', ['whose', 'who', 'whom', 'which']],
      ['The teacher ___ I admire most retired.', 'whom', '"Whom" is the object of "admire".', ['whom', 'who', 'whose', 'which']],
      ['The bridge, ___ was built in 1930, is closing.', 'which', 'Non-essential clause about a thing.', ['which', 'that', 'who', 'whom']],
      ['She is the one ___ called.', 'who', '"Who" is the subject of "called".', ['who', 'whom', 'whose', 'which']],
      ['Any book ___ has pictures is welcome.', 'that', '"That" introduces an essential clause about a thing.', ['that', 'who', 'whose', 'whom']]
    ]
  })),
  sk('PnVg', 'Identify vague pronoun references', 'Pronouns', G(8, 12), classify({
    categories: ['Clear', 'Vague'],
    prompt: s => `Is the pronoun reference clear or vague?<br>${em(s)}`,
    items: [
      ['Mia told Ana that she had won.', 'Vague', '"She" could be Mia or Ana.'],
      ['Mia told Ana, "I won."', 'Clear', 'The quotation removes the ambiguity.'],
      ['In the report, it says sales fell.', 'Vague', '"It" has no antecedent.'],
      ['The report says sales fell.', 'Clear', 'There is no vague pronoun.'],
      ['They say the new mall will open soon.', 'Vague', '"They" has no antecedent.'],
      ['The mayor announced that the new mall will open soon.', 'Clear', 'The source is named.'],
      ['Dad put the cake on the table, and it was beautiful.', 'Vague', '"It" could be the cake or the table.'],
      ['Dad put the beautiful cake on the table.', 'Clear', 'There are no pronouns to confuse.'],
      ['Tom likes to swim, which is good for his health.', 'Vague', '"Which" has no clear single antecedent.'],
      ['Tom\'s habit of swimming is good for his health.', 'Clear', 'The reference is precise.']
    ]
  })),
  sk('PnAn', 'Identify all of the possible antecedents', 'Pronouns', G(9, 12), pairs({
    prompt: s => `What could the underlined pronoun refer to?<br>${s}`,
    items: [
      ['Kai told Leo that <u>he</u> was late.', 'Kai or Leo', 'Both are possible.', ['Kai or Leo', 'Only Kai', 'Only Leo', 'Neither']],
      ['The trophy didn\'t fit in the box because <u>it</u> was too large.', 'the trophy or the box', 'Grammatically, both nouns could be the antecedent.', ['the trophy or the box', 'only the trophy', 'only the box', 'neither']],
      ['Anna called Maria after <u>she</u> got home.', 'Anna or Maria', 'Both are possible.', ['Anna or Maria', 'only Anna', 'only Maria', 'neither']],
      ['The dog chased the cat until <u>it</u> was exhausted.', 'the dog or the cat', 'Both are possible.', ['the dog or the cat', 'only the dog', 'only the cat', 'neither']],
      ['The dentist told the patient that <u>she</u> needed a break.', 'the dentist or the patient', 'Both are possible.', ['the dentist or the patient', 'only the dentist', 'only the patient', 'neither']],
      ['When Dev gave Sam the keys, <u>he</u> smiled.', 'Dev or Sam', 'Both are possible.', ['Dev or Sam', 'only Dev', 'only Sam', 'neither']]
    ]
  })),
  sk('PnSh', 'Correct inappropriate shifts in pronoun number and person', 'Pronouns', G(8, 12), correct([
    ['When students arrive, they should check in.', ['When students arrive, he should check in.', 'When students arrive, you should check in.', 'When students arrive, one should check in.'], 'Keep number and person consistent.'],
    ['If a person studies, he or she will succeed.', ['If a person studies, you will succeed.', 'If a person studies, we will succeed.', 'If a person studies, I will succeed.'], 'Keep the same person (third) throughout.'],
    ['When you visit Paris, you should try the pastries.', ['When you visit Paris, one should try the pastries.', 'When you visit Paris, they should try the pastries.', 'When you visit Paris, a person should try the pastries.'], 'Stay in second person.'],
    ['Each of the players brought his or her own helmet.', ['Each of the players brought your own helmet.', 'Each of the players brought our own helmet.', 'Each of the players brought my own helmet.'], '"Each" is singular, so the pronoun must be third person.'],
    ['Many people enjoy cooking because it relaxes them.', ['Many people enjoy cooking because it relaxes you.', 'Many people enjoy cooking because it relaxes one.', 'Many people enjoy cooking because it relaxes him.'], 'Keep third person plural.'],
    ['I like hiking because I can see wildlife.', ['I like hiking because you can see wildlife.', 'I like hiking because one can see wildlife.', 'I like hiking because we can see wildlife.'], 'Keep first person.'],
    ['Students should bring their notebooks.', ['Students should bring your notebooks.', 'Students should bring his notebooks.', 'Students should bring its notebooks.'], 'Number agrees with "students".'],
    ['A good leader listens to the team and values its ideas.', ['A good leader listens to the team and values their ideas.', 'A good leader listens to the team and values your ideas.', 'A good leader listens to the team and values his ideas.'], 'The team is a single unit.']
  ], 'Which sentence keeps pronoun number and person consistent?')),
  sk('PnRf', 'Is the pronoun reflexive or intensive?', 'Pronouns', G(7, 12), classify({
    categories: ['Reflexive', 'Intensive'],
    prompt: s => `${em(s)}`,
    items: [
      ['She taught herself to code.', 'Reflexive', 'The action reflects back to the subject; it is necessary.'],
      ['The president herself answered the call.', 'Intensive', 'It emphasizes who did it and can be removed.'],
      ['I hurt myself playing soccer.', 'Reflexive', 'The action returns to the subject.'],
      ['I made the cake myself.', 'Intensive', 'It adds emphasis.'],
      ['They enjoyed themselves at the party.', 'Reflexive', 'The action reflects back on the subject.'],
      ['The chef himself tasted every dish.', 'Intensive', 'It emphasizes the chef.'],
      ['We congratulated ourselves.', 'Reflexive', 'We are both the doers and receivers.'],
      ['You yourself must decide.', 'Intensive', 'It emphasizes "you".']
    ]
  })),

  /* ================= Verb types ================= */
  sk('VbTr', 'Identify transitive and intransitive verbs', 'Verb types', G(8, 12), classify({
    categories: ['Transitive', 'Intransitive'],
    prompt: s => `Is the underlined verb transitive or intransitive?<br>${s}`,
    items: [
      ['She <u>kicked</u> the ball.', 'Transitive', 'It has a direct object (the ball).'],
      ['The baby <u>slept</u> peacefully.', 'Intransitive', 'No direct object.'],
      ['He <u>wrote</u> a letter.', 'Transitive', 'Direct object: a letter.'],
      ['The sun <u>rose</u> at six.', 'Intransitive', 'No direct object.'],
      ['They <u>painted</u> the fence.', 'Transitive', 'Direct object: the fence.'],
      ['We <u>arrived</u> late.', 'Intransitive', 'No direct object.'],
      ['The chef <u>made</u> a salad.', 'Transitive', 'Direct object: a salad.'],
      ['The leaves <u>fell</u> to the ground.', 'Intransitive', 'No direct object.']
    ]
  })),
  sk('VbLk', 'Identify linking verbs, predicate adjectives and predicate nouns', 'Verb types', G(8, 12), classify({
    categories: ['Predicate adjective', 'Predicate noun', 'Direct object'],
    prompt: s => `What is the underlined word?<br>${s}`,
    items: [
      ['The soup smells <u>delicious</u>.', 'Predicate adjective', 'It follows a linking verb and describes the subject.'],
      ['My uncle is a <u>pilot</u>.', 'Predicate noun', 'It follows a linking verb and renames the subject.'],
      ['She baked a <u>cake</u>.', 'Direct object', 'It follows an action verb.'],
      ['The night grew <u>cold</u>.', 'Predicate adjective', '"Grew" links the subject to the adjective.'],
      ['Mr. Lee became our <u>principal</u>.', 'Predicate noun', '"Became" links the subject to the noun.'],
      ['The dog chased the <u>squirrel</u>.', 'Direct object', 'It receives the action.'],
      ['He seems <u>tired</u>.', 'Predicate adjective', '"Seems" is a linking verb.'],
      ['Canada is a <u>country</u>.', 'Predicate noun', '"Is" links the subject to a noun.']
    ]
  })),
  sk('VbPt', 'Identify participles and what they modify', 'Verb types', G(8, 12), pairs({
    prompt: s => `${s}<br>What noun does the participle modify?`,
    items: [
      ['The <u>smiling</u> child waved goodbye.', 'child', 'The participle describes the child.', ['child', 'goodbye', 'waved', 'smiling']],
      ['We watched the <u>setting</u> sun.', 'sun', 'The participle describes the sun.', ['sun', 'watched', 'We', 'setting']],
      ['The <u>broken</u> window let in the cold.', 'window', 'The participle describes the window.', ['window', 'cold', 'let', 'broken']],
      ['<u>Exhausted</u>, the runner collapsed.', 'runner', 'The participle describes the runner.', ['runner', 'collapsed', 'Exhausted', 'the']],
      ['The coach praised the team <u>practising</u> in the rain.', 'team', 'The participle describes the team.', ['team', 'coach', 'rain', 'praised']],
      ['Rising early, Dev made breakfast.', 'Dev', 'The participle describes Dev.', ['Dev', 'breakfast', 'Rising', 'early']],
      ['A <u>frightened</u> kitten hid under the porch.', 'kitten', 'The participle describes the kitten.', ['kitten', 'porch', 'hid', 'frightened']],
      ['The <u>carved</u> pumpkin glowed.', 'pumpkin', 'The participle describes the pumpkin.', ['pumpkin', 'glowed', 'carved', 'The']]
    ]
  })),
  sk('VbGr', 'Identify gerunds and their functions', 'Verb types', G(8, 12), classify({
    categories: ['Subject', 'Direct object', 'Object of a preposition', 'Predicate noun'],
    prompt: s => `What function does the underlined gerund have?<br>${s}`,
    items: [
      ['<u>Swimming</u> keeps me fit.', 'Subject', 'The gerund is the subject of "keeps".'],
      ['I enjoy <u>reading</u> before bed.', 'Direct object', 'It receives the action of "enjoy".'],
      ['She is good at <u>drawing</u>.', 'Object of a preposition', 'It follows the preposition "at".'],
      ['Her hobby is <u>collecting</u> stamps.', 'Predicate noun', 'It renames the subject "hobby".'],
      ['<u>Laughing</u> is good medicine.', 'Subject', 'It is the subject.'],
      ['They love <u>hiking</u> in autumn.', 'Direct object', 'It receives the action of "love".'],
      ['He left without <u>saying</u> goodbye.', 'Object of a preposition', 'It follows "without".'],
      ['My goal is <u>finishing</u> the marathon.', 'Predicate noun', 'It renames "goal".']
    ]
  })),
  sk('VbIn', 'Identify infinitives and infinitive phrases', 'Verb types', G(8, 12), classify({
    categories: ['Noun', 'Adjective', 'Adverb'],
    prompt: s => `How is the underlined infinitive phrase used?<br>${s}`,
    items: [
      ['<u>To succeed</u> takes effort.', 'Noun', 'It is the subject.'],
      ['She wants <u>to travel</u>.', 'Noun', 'It is the direct object.'],
      ['He has a report <u>to finish</u>.', 'Adjective', 'It describes "report".'],
      ['We came <u>to help</u>.', 'Adverb', 'It tells why we came.'],
      ['The best way <u>to learn</u> is to practise.', 'Adjective', 'It describes "way".'],
      ['Her dream is <u>to become a doctor</u>.', 'Noun', 'It is a predicate noun renaming "dream".'],
      ['I saved money <u>to buy a bike</u>.', 'Adverb', 'It tells why.'],
      ['It is time <u>to leave</u>.', 'Adjective', 'It describes "time".']
    ]
  })),
  sk('DiOb', 'Is it a direct object or an indirect object?', 'Verb types', G(8, 12), classify({
    categories: ['Direct object', 'Indirect object'],
    prompt: s => `What is the underlined word?<br>${s}`,
    items: [
      ['She gave her <u>sister</u> a gift.', 'Indirect object', 'It tells to whom the gift was given.'],
      ['She gave her sister a <u>gift</u>.', 'Direct object', 'It receives the action of "gave".'],
      ['Dad read the <u>children</u> a story.', 'Indirect object', 'The children receive the story.'],
      ['Dad read the children a <u>story</u>.', 'Direct object', 'It is what was read.'],
      ['The coach handed the <u>captain</u> the trophy.', 'Indirect object', 'The captain receives the trophy.'],
      ['The coach handed the captain the <u>trophy</u>.', 'Direct object', 'It is what was handed.'],
      ['I told <u>Maya</u> the secret.', 'Indirect object', 'Maya was told.'],
      ['I told Maya the <u>secret</u>.', 'Direct object', 'It is what was told.']
    ]
  })),

  /* ================= Subject-verb agreement ================= */
  sk('SvEr', 'Identify and correct errors with subject-verb agreement', 'Subject-verb agreement', G(8, 12), correct([
    ['The box of chocolates is on the table.', ['The box of chocolates are on the table.', 'The box of chocolates were on the table.', 'The box of chocolates be on the table.'], 'The subject is "box" (singular).'],
    ['The students in the back row were talking.', ['The students in the back row was talking.', 'The students in the back row is talking.', 'The students in the back row talks.'], 'The subject is "students" (plural).'],
    ['There are three reasons for the delay.', ['There is three reasons for the delay.', 'There was three reasons for the delay.', 'There be three reasons for the delay.'], 'The subject "reasons" is plural.'],
    ['Here comes the bus.', ['Here come the bus.', 'Here are the bus.', 'Here comes the buses.'], 'The subject "bus" is singular.'],
    ['The news is surprising.', ['The news are surprising.', 'The news were surprising.', 'The news be surprising.'], '"News" is singular.'],
    ['Physics is my favourite subject.', ['Physics are my favourite subject.', 'Physics were my favourite subject.', 'Physics be my favourite subject.'], 'Physics is singular.'],
    ['The jury has reached its verdict.', ['The jury have reached its verdict.', 'The jury has reached their verdicts.', 'The jury have reach its verdict.'], 'A jury acting as one unit is singular.'],
    ['The pair of shoes was on sale.', ['The pair of shoes were on sale.', 'The pair of shoes are on sale.', 'The pair of shoes be on sale.'], 'The subject is "pair".']
  ], 'Which sentence has correct subject-verb agreement?')),
  sk('SvIn', 'Identify and correct errors with indefinite pronoun-verb agreement', 'Subject-verb agreement', G(8, 12), correct([
    ['Everyone is ready.', ['Everyone are ready.', 'Everyone were ready.', 'Everyone be ready.'], '"Everyone" is singular.'],
    ['Each of the tickets costs ten dollars.', ['Each of the tickets cost ten dollars.', 'Each of the tickets are ten dollars.', 'Each of the tickets costing ten dollars.'], '"Each" is singular.'],
    ['Both of the answers are correct.', ['Both of the answers is correct.', 'Both of the answers was correct.', 'Both of the answers be correct.'], '"Both" is plural.'],
    ['Somebody has left a bag.', ['Somebody have left a bag.', 'Somebody are leaving a bag.', 'Somebody were left a bag.'], '"Somebody" is singular.'],
    ['Few of the seats were empty.', ['Few of the seats was empty.', 'Few of the seats is empty.', 'Few of the seats be empty.'], '"Few" is plural.'],
    ['Neither of the options is perfect.', ['Neither of the options are perfect.', 'Neither of the options were perfect.', 'Neither of the options be perfect.'], '"Neither" is singular.'],
    ['All of the cake is gone.', ['All of the cake are gone.', 'All of the cake were gone.', 'All of the cake be gone.'], '"All" depends on the noun: cake is singular.'],
    ['All of the cookies are gone.', ['All of the cookies is gone.', 'All of the cookies was gone.', 'All of the cookies be gone.'], '"All" depends on the noun: cookies is plural.']
  ], 'Which sentence is correct?')),
  sk('SvCp', 'Identify and correct verb agreement with compound subjects', 'Subject-verb agreement', G(8, 12), correct([
    ['Sam and Lee are partners.', ['Sam and Lee is partners.', 'Sam and Lee was partners.', 'Sam and Lee be partners.'], 'Subjects joined by "and" take a plural verb.'],
    ['Neither the coach nor the players were ready.', ['Neither the coach nor the players was ready.', 'Neither the coach nor the players is ready.', 'Neither the coach nor the players be ready.'], 'The verb agrees with the nearer subject (players).'],
    ['Either the students or the teacher is responsible.', ['Either the students or the teacher are responsible.', 'Either the students or the teacher were responsible.', 'Either the students or the teacher be responsible.'], 'The verb agrees with the nearer subject (teacher).'],
    ['Bread and butter is a classic pairing.', ['Bread and butter are a classic pairing.', 'Bread and butter were a classic pairing.', 'Bread and butter be a classic pairing.'], 'A single unit takes a singular verb.'],
    ['My friend and teammate has arrived.', ['My friend and teammate have arrived.', 'My friend and teammate are arrived.', 'My friend and teammate were arrived.'], 'One person is both friend and teammate.'],
    ['Neither of the girls nor the boy was late.', ['Neither of the girls nor the boy were late.', 'Neither of the girls nor the boy are late.', 'Neither of the girls nor the boy be late.'], 'The nearer subject is "boy" (singular).'],
    ['The cat and the dogs are sleeping.', ['The cat and the dogs is sleeping.', 'The cat and the dogs was sleeping.', 'The cat and the dogs be sleeping.'], 'Joined by "and", so plural.'],
    ['Either the dogs or the cat is hungry.', ['Either the dogs or the cat are hungry.', 'Either the dogs or the cat were hungry.', 'Either the dogs or the cat be hungry.'], 'The nearer subject is "cat".']
  ], 'Which sentence is correct?')),

  /* ================= Verb tense ================= */
  sk('TnPr', 'Form the progressive verb tenses', 'Verb tense', G(6, 12), pairs({
    prompt: s => `Choose the correct verb form.<br>${em(s)}`,
    items: [
      ['Right now, she ___ a book. (read, present progressive)', 'is reading', 'Present progressive: am/is/are + -ing.', ['is reading', 'was reading', 'will read', 'has read']],
      ['Yesterday at noon, they ___ lunch. (eat, past progressive)', 'were eating', 'Past progressive: was/were + -ing.', ['were eating', 'are eating', 'will eat', 'have eaten']],
      ['Tomorrow at six, I ___ for the exam. (study, future progressive)', 'will be studying', 'Future progressive: will be + -ing.', ['will be studying', 'am studying', 'was studying', 'have studied']],
      ['The kids ___ in the yard when it began to rain. (play, past progressive)', 'were playing', 'Past progressive.', ['were playing', 'are playing', 'will play', 'played']],
      ['We ___ to the lake next week. (drive, future progressive)', 'will be driving', 'Future progressive.', ['will be driving', 'were driving', 'are driven', 'drive']],
      ['He ___ his bike at the moment. (ride, present progressive)', 'is riding', 'Present progressive.', ['is riding', 'was riding', 'will ride', 'rode']],
      ['At this time last year, I ___ in Spain. (live, past progressive)', 'was living', 'Past progressive.', ['was living', 'am living', 'will live', 'have lived']],
      ['By the time you call, I ___ dinner. (cook, future progressive)', 'will be cooking', 'Future progressive.', ['will be cooking', 'am cooked', 'was cooked', 'cooked']]
    ]
  })),
  sk('TnPf', 'Form the perfect verb tenses', 'Verb tense', G(6, 12), pairs({
    prompt: s => `Choose the correct verb form.<br>${em(s)}`,
    items: [
      ['She ___ the book three times. (read, present perfect)', 'has read', 'Present perfect: has/have + past participle.', ['has read', 'had read', 'will have read', 'is reading']],
      ['By noon, they ___ the work. (finish, future perfect)', 'will have finished', 'Future perfect: will have + past participle.', ['will have finished', 'have finished', 'had finished', 'finish']],
      ['When we arrived, the movie ___. (start, past perfect)', 'had started', 'Past perfect: had + past participle.', ['had started', 'has started', 'will have started', 'starts']],
      ['I ___ here for ten years. (live, present perfect)', 'have lived', 'Present perfect.', ['have lived', 'had lived', 'will have lived', 'am living']],
      ['He ___ the test before the bell rang. (finish, past perfect)', 'had finished', 'Past perfect.', ['had finished', 'has finished', 'will finish', 'finishes']],
      ['By next June, she ___ her degree. (earn, future perfect)', 'will have earned', 'Future perfect.', ['will have earned', 'has earned', 'had earned', 'earned']],
      ['They ___ the city twice already. (visit, present perfect)', 'have visited', 'Present perfect.', ['have visited', 'had visited', 'will have visited', 'visit']],
      ['The soup ___ cold before we sat down. (get, past perfect)', 'had gotten', 'Past perfect.', ['had gotten', 'has gotten', 'will have gotten', 'gets']]
    ]
  })),
  sk('TnSh', 'Identify and correct inappropriate shifts in verb tense', 'Verb tense', G(7, 12), correct([
    ['She opened the door and walked inside.', ['She opened the door and walks inside.', 'She opens the door and walked inside.', 'She opened the door and will walk inside.'], 'Keep both verbs in the past tense.'],
    ['He studies hard and earns good grades.', ['He studies hard and earned good grades.', 'He studied hard and earns good grades.', 'He studies hard and will earned good grades.'], 'Keep both verbs in the present tense.'],
    ['When I arrived, the show had already started.', ['When I arrived, the show has already started.', 'When I arrive, the show had already started.', 'When I arrived, the show starts already.'], 'Past perfect shows an earlier past event.'],
    ['He called yesterday and left a message.', ['He called yesterday and leaves a message.', 'He calls yesterday and left a message.', 'He called yesterday and will leave a message.'], 'Keep both verbs in the past tense.'],
    ['The hero enters the room and sees the villain.', ['The hero enters the room and saw the villain.', 'The hero entered the room and sees the villain.', 'The hero will enter the room and sees the villain.'], 'Literary present: keep both verbs present.'],
    ['I was walking home when it started to rain.', ['I was walking home when it starts to rain.', 'I walk home when it started to rain.', 'I was walking home when it will start to rain.'], 'Both events happened in the past.'],
    ['She says she is tired.', ['She says she was tired now.', 'She said she is tired yesterday.', 'She says she will been tired.'], 'Both verbs are present.'],
    ['They arrived late because the traffic was heavy.', ['They arrived late because the traffic is heavy.', 'They arrive late because the traffic was heavy.', 'They arrived late because the traffic will be heavy.'], 'Both events happened in the past.']
  ], 'Which sentence keeps verb tense consistent?')),
  sk('TnIr', 'Irregular past tense: review', 'Verb tense', G(6, 12), pairs({
    prompt: s => `Choose the correct form.<br>${em(s)}`,
    items: [
      ['Yesterday I ___ a new song. (sing)', 'sang', 'Past of sing is sang.', ['sang', 'sung', 'singed', 'sing']],
      ['She has ___ the answer. (know)', 'known', 'Past participle of know is known.', ['known', 'knew', 'knowed', 'know']],
      ['He ___ the window by accident. (break)', 'broke', 'Past of break is broke.', ['broke', 'broken', 'breaked', 'break']],
      ['They have ___ their lunch. (eat)', 'eaten', 'Past participle of eat is eaten.', ['eaten', 'ate', 'eated', 'eat']],
      ['The bell ___ at noon. (ring)', 'rang', 'Past of ring is rang.', ['rang', 'rung', 'ringed', 'ring']],
      ['I have ___ that movie before. (see)', 'seen', 'Past participle of see is seen.', ['seen', 'saw', 'seed', 'see']],
      ['She ___ the ball over the fence. (throw)', 'threw', 'Past of throw is threw.', ['threw', 'thrown', 'throwed', 'throw']],
      ['The river had ___ over its banks. (rise)', 'risen', 'Past participle of rise is risen.', ['risen', 'rose', 'rised', 'rise']]
    ]
  })),

  /* ================= Adjectives and adverbs ================= */
  sk('AdCp', 'Form and use comparative and superlative adjectives', 'Adjectives and adverbs', G(6, 12), pairs({
    prompt: s => `Choose the correct form.<br>${em(s)}`,
    items: [
      ['This is the ___ day of the year. (long)', 'longest', 'Superlative: three or more.', ['longest', 'longer', 'more long', 'most longer']],
      ['My bag is ___ than yours. (heavy)', 'heavier', 'Comparative: two things.', ['heavier', 'heaviest', 'more heavy', 'heavyer']],
      ['She is the ___ student in the class. (intelligent)', 'most intelligent', 'Long adjectives use "most".', ['most intelligent', 'intelligentest', 'more intelligent', 'most intelligenter']],
      ['This route is ___ than that one. (direct)', 'more direct', 'Use "more" with long adjectives.', ['more direct', 'directer', 'most direct', 'directest']],
      ['It was the ___ movie I have ever seen. (funny)', 'funniest', 'Change y to i and add -est.', ['funniest', 'funnyest', 'most funny', 'more funniest']],
      ['Of the two paths, this one is ___. (narrow)', 'narrower', 'Comparative for two.', ['narrower', 'narrowest', 'most narrow', 'more narrowest']],
      ['Today is ___ than yesterday. (warm)', 'warmer', 'Comparative.', ['warmer', 'warmest', 'most warm', 'more warmest']],
      ['That was the ___ decision of all. (wise)', 'wisest', 'Superlative.', ['wisest', 'wiser', 'most wiser', 'more wise']]
    ]
  })),
  sk('AdGb', 'Good, better, best, bad, worse and worst', 'Adjectives and adverbs', G(6, 12), pairs({
    prompt: s => `Choose the correct word.<br>${em(s)}`,
    items: [
      ['This pizza is ___ than the last one. (good)', 'better', 'Comparative of good.', ['better', 'best', 'gooder', 'more good']],
      ['It was the ___ concert of my life. (good)', 'best', 'Superlative of good.', ['best', 'better', 'goodest', 'most good']],
      ['Today\'s weather is ___ than yesterday\'s. (bad)', 'worse', 'Comparative of bad.', ['worse', 'worst', 'badder', 'more bad']],
      ['That was the ___ storm in a decade. (bad)', 'worst', 'Superlative of bad.', ['worst', 'worse', 'baddest', 'most bad']],
      ['Of all the options, this is the ___. (good)', 'best', 'Superlative (three or more).', ['best', 'better', 'goodest', 'gooder']],
      ['Her second attempt was ___ than the first. (good)', 'better', 'Comparative (two).', ['better', 'best', 'gooder', 'more better']],
      ['His cold got ___ overnight. (bad)', 'worse', 'Comparative.', ['worse', 'worst', 'badder', 'more worse']],
      ['This is the ___ day of my life! (bad)', 'worst', 'Superlative.', ['worst', 'worse', 'baddest', 'most worst']]
    ]
  })),
  sk('AvCp', 'Form and use comparative and superlative adverbs', 'Adjectives and adverbs', G(7, 12), pairs({
    prompt: s => `Choose the correct form.<br>${em(s)}`,
    items: [
      ['Of the three runners, Ana finished ___. (quickly)', 'most quickly', 'Superlative adverb: three or more.', ['most quickly', 'more quickly', 'quicklier', 'quickliest']],
      ['He drives ___ than his brother. (carefully)', 'more carefully', 'Comparative adverb: two.', ['more carefully', 'most carefully', 'carefuller', 'carefullest']],
      ['She sings ___ than anyone in the choir. (loudly)', 'more loudly', 'Comparative.', ['more loudly', 'most loudly', 'loudlier', 'loudliest']],
      ['Of all the players, Kai trains ___. (hard)', 'hardest', 'Short adverb: add -est.', ['hardest', 'harder', 'most hard', 'more hardest']],
      ['Please speak ___ so I can hear you. (softly)', 'more softly', 'Comparative.', ['more softly', 'most softly', 'softlier', 'softliest']],
      ['He arrived ___ than expected. (early)', 'earlier', 'Change y to i and add -er.', ['earlier', 'earliest', 'more early', 'most earlier']],
      ['She works ___ of all her colleagues. (diligently)', 'most diligently', 'Superlative.', ['most diligently', 'more diligently', 'diligentlier', 'diligentliest']],
      ['The cheetah runs ___ than the lion. (fast)', 'faster', 'Short adverb: add -er.', ['faster', 'fastest', 'more fast', 'most faster']]
    ]
  })),
  sk('AvWl', 'Well, better, best, badly, worse and worst', 'Adjectives and adverbs', G(7, 12), pairs({
    prompt: s => `Choose the correct word.<br>${em(s)}`,
    items: [
      ['She plays the piano ___. (adverb)', 'well', 'Well is the adverb form of good.', ['well', 'good', 'goodly', 'best']],
      ['He did ___ on the test, better than last time. (adverb, comparative)', 'better', 'Comparative adverb of well.', ['better', 'best', 'gooder', 'more good']],
      ['The team played ___ of all last night. (adverb, superlative)', 'best', 'Superlative adverb of well.', ['best', 'better', 'goodest', 'most well']],
      ['The engine runs ___ in the cold. (adverb)', 'badly', 'Badly is the adverb.', ['badly', 'bad', 'worst', 'worse']],
      ['She sang ___ than she had expected. (adverb, comparative)', 'worse', 'Comparative adverb of badly.', ['worse', 'worst', 'badlier', 'more bad']],
      ['He plays ___ of all the guitarists. (adverb, superlative)', 'worst', 'Superlative adverb of badly.', ['worst', 'worse', 'baddest', 'most badly']],
      ['I feel ___ today; my cold is gone. (adjective for health)', 'well', 'After "feel", "well" describes health.', ['well', 'good', 'goodly', 'best']],
      ['You look ___ in that colour. (adjective)', 'good', 'After a linking verb, use the adjective "good".', ['good', 'well', 'goodly', 'best']]
    ]
  })),
  sk('AdAv', 'Choose between adjectives and adverbs', 'Adjectives and adverbs', G(6, 11), pairs({
    prompt: s => `Choose the correct word.<br>${em(s)}`,
    items: [
      ['She answered the question ___. (quick / quickly)', 'quickly', 'An adverb describes the verb "answered".', ['quickly', 'quick']],
      ['The soup tastes ___. (delicious / deliciously)', 'delicious', 'After a linking verb, use an adjective.', ['delicious', 'deliciously']],
      ['He walked ___ down the hall. (slow / slowly)', 'slowly', 'An adverb describes how he walked.', ['slowly', 'slow']],
      ['The music sounded ___. (beautiful / beautifully)', 'beautiful', 'After a linking verb, use an adjective.', ['beautiful', 'beautifully']],
      ['She sings ___. (beautiful / beautifully)', 'beautifully', 'An adverb describes the verb "sings".', ['beautifully', 'beautiful']],
      ['The room smells ___. (fresh / freshly)', 'fresh', 'After a linking verb, use an adjective.', ['fresh', 'freshly']],
      ['He was ___ tired. (extreme / extremely)', 'extremely', 'An adverb describes the adjective "tired".', ['extremely', 'extreme']],
      ['The dog looked ___ at the stranger. (suspicious / suspiciously)', 'suspiciously', 'An adverb describes how it looked (an action).', ['suspiciously', 'suspicious']]
    ]
  })),

  /* ================= Misplaced modifiers ================= */
  sk('MdSl', 'Select the misplaced or dangling modifier', 'Misplaced modifiers', G(8, 12), classify({
    categories: ['Misplaced modifier', 'Dangling modifier', 'Correct'],
    prompt: s => `${em(s)}`,
    items: [
      ['She served sandwiches to the guests on paper plates.', 'Misplaced modifier', 'It sounds like the guests were on the plates.'],
      ['Walking to school, a squirrel ran across my path.', 'Dangling modifier', 'The squirrel was not walking to school.'],
      ['Walking to school, I saw a squirrel run across my path.', 'Correct', 'The modifier describes "I".'],
      ['The woman bought a dress at the store with a red bow.', 'Misplaced modifier', 'It sounds like the store has a red bow; place the phrase next to "dress".'],
      ['After finishing the exam, the bell rang.', 'Dangling modifier', 'Who finished the exam?'],
      ['After finishing the exam, we heard the bell ring.', 'Correct', 'The modifier describes "we".'],
      ['The man with the umbrella waited on the bench.', 'Correct', 'The phrases are next to the words they describe.'],
      ['Having finished dinner, the dishes were washed.', 'Dangling modifier', 'The dishes did not finish dinner.']
    ]
  })),
  sk('MdOk', 'Are the modifiers used correctly?', 'Misplaced modifiers', G(8, 12), classify({
    categories: ['Correct', 'Incorrect'],
    prompt: s => `Are the modifiers used correctly?<br>${em(s)}`,
    items: [
      ['Running through the park, I noticed the flowers.', 'Correct', 'The runner is "I".'],
      ['Running through the park, the flowers caught my eye.', 'Incorrect', 'The flowers were not running.'],
      ['Tired after the long hike, we went to bed early.', 'Correct', '"Tired" describes "we".'],
      ['Tired after the long hike, bed was a welcome sight.', 'Incorrect', 'Bed was not tired.'],
      ['The teacher returned the tests to the students that she had graded.', 'Incorrect', 'It sounds like the students were graded.'],
      ['The teacher returned the tests that she had graded to the students.', 'Correct', 'The modifier is next to "tests".'],
      ['To pass the course, studying is necessary.', 'Incorrect', 'Studying cannot pass the course.'],
      ['To pass the course, you must study.', 'Correct', 'The infinitive phrase describes "you".']
    ]
  })),

  /* ================= Restrictive and nonrestrictive elements ================= */
  sk('RsPn', 'What does the punctuation suggest?', 'Restrictive and nonrestrictive elements', G(8, 12), pairs({
    prompt: s => `${s}<br>What does the punctuation suggest?`,
    items: [
      ['My brother, who lives in Calgary, is a chef.', 'I have only one brother.', 'Commas show the clause is extra information.', ['I have only one brother.', 'I have several brothers.', 'My brother is a chef in Calgary only.', 'Calgary is far.']],
      ['My brother who lives in Calgary is a chef.', 'I have more than one brother.', 'No commas: the clause identifies which brother.', ['I have more than one brother.', 'I have only one brother.', 'Calgary is far.', 'My brother is not a chef.']],
      ['The students, who studied hard, passed.', 'All the students studied hard and passed.', 'Commas make the clause extra information about all of them.', ['All the students studied hard and passed.', 'Only some students passed.', 'Some students did not study.', 'The students failed.']],
      ['The students who studied hard passed.', 'Only the students who studied hard passed.', 'No commas: the clause limits which students.', ['Only the students who studied hard passed.', 'All the students passed.', 'Nobody studied.', 'The students failed.']],
      ['Her car, which is red, was stolen.', 'She has only one car, and it is red.', 'The clause is extra information.', ['She has only one car, and it is red.', 'She has several cars.', 'Her car was not stolen.', 'Red cars are stolen more often.']],
      ['Her car which is red was stolen.', 'She has more than one car.', 'No commas: the clause tells which car.', ['She has more than one car.', 'She has only one car.', 'Her car was not red.', 'Nothing was stolen.']]
    ]
  })),
  sk('RsCm', 'Commas with nonrestrictive elements', 'Restrictive and nonrestrictive elements', G(8, 12), correct([
    ['Mount Everest, the tallest mountain on Earth, attracts climbers.', ['Mount Everest the tallest mountain on Earth, attracts climbers.', 'Mount Everest, the tallest mountain on Earth attracts climbers.', 'Mount Everest the tallest mountain on Earth attracts climbers.'], 'Set off extra information with a pair of commas.'],
    ['Students who finish early may leave.', ['Students, who finish early, may leave.', 'Students who finish early, may leave.', 'Students, who finish early may leave.'], 'The clause tells which students, so no commas.'],
    ['Our principal, Dr. Singh, welcomed the guests.', ['Our principal Dr. Singh, welcomed the guests.', 'Our principal, Dr. Singh welcomed the guests.', 'Our principal Dr. Singh welcomed, the guests.'], 'A nonessential appositive needs a pair of commas.'],
    ['The book that I borrowed was excellent.', ['The book, that I borrowed, was excellent.', 'The book, that I borrowed was excellent.', 'The book that, I borrowed was excellent.'], '"That" clauses are essential; no commas.'],
    ['The Nile, which flows north, is the longest river in Africa.', ['The Nile which flows north, is the longest river in Africa.', 'The Nile, which flows north is the longest river in Africa.', 'The Nile which flows north is the longest river in Africa.'], 'A "which" clause with extra information takes a pair of commas.'],
    ['Paris, the capital of France, is famous for its cafés.', ['Paris the capital of France, is famous for its cafés.', 'Paris, the capital of France is famous for its cafés.', 'Paris the capital of France is famous for its cafés.'], 'A pair of commas surrounds the appositive.'],
    ['Anyone who finishes early may leave.', ['Anyone, who finishes early, may leave.', 'Anyone who finishes early, may leave.', 'Anyone, who finishes early may leave.'], 'The clause is essential, so no commas.'],
    ['My sister, who lives in Halifax, called last night.', ['My sister who lives in Halifax, called last night.', 'My sister, who lives in Halifax called last night.', 'My sister who lives, in Halifax called last night.'], 'Extra information is set off with a pair of commas.']
  ], 'Which sentence is punctuated correctly?')),
  /* ================= Commas ================= */
  sk('CmDa', 'Commas with direct addresses, introductory elements and interrupters', 'Commas', G(8, 12), correct([
    ['Maria, please close the door.', ['Maria please close the door.', 'Maria please, close the door.', 'Maria, please close, the door.'], 'Set off a name used in direct address.'],
    ['However, we decided to stay.', ['However we decided to stay.', 'However we, decided to stay.', 'However we decided, to stay.'], 'Use a comma after an introductory word.'],
    ['After the storm passed, we went outside.', ['After the storm passed we went outside.', 'After the storm, passed we went outside.', 'After, the storm passed we went outside.'], 'Use a comma after an introductory clause.'],
    ['The answer, I believe, is correct.', ['The answer I believe, is correct.', 'The answer, I believe is correct.', 'The answer I believe is, correct.'], 'Set off an interrupter with commas.'],
    ['Well, that was unexpected.', ['Well that was unexpected.', 'Well that, was unexpected.', 'Well that was, unexpected.'], 'Use a comma after an interjection.'],
    ['It was a good plan, not a perfect one.', ['It was a good plan not a perfect one.', 'It was a good plan not, a perfect one.', 'It was, a good plan not a perfect one.'], 'Use a comma before an antithetical phrase.'],
    ['Weather permitting, the game will go on.', ['Weather permitting the game will go on.', 'Weather, permitting the game will go on.', 'Weather permitting the game, will go on.'], 'Use a comma after an absolute phrase.'],
    ['Do you know, Sam, where the keys are?', ['Do you know Sam, where the keys are?', 'Do you know, Sam where the keys are?', 'Do you know Sam where, the keys are?'], 'Set off a direct address in the middle with two commas.']
  ], 'Which sentence uses commas correctly?')),
  sk('CmCs', 'Commas with compound, complex and compound-complex sentences', 'Commas', G(8, 12), correct([
    ['I wanted to go, but the weather was bad.', ['I wanted to go but, the weather was bad.', 'I wanted to go but the weather was bad.', 'I wanted, to go but the weather was bad.'], 'Use a comma before a coordinating conjunction joining two independent clauses.'],
    ['Because it was late, we went home.', ['Because it was late we went home.', 'Because, it was late we went home.', 'Because it was late we went, home.'], 'A comma follows an introductory dependent clause.'],
    ['We went home because it was late.', ['We went home, because it was late.', 'We went, home because it was late.', 'We went home because, it was late.'], 'No comma before a dependent clause at the end.'],
    ['The team practised hard, so they won the game.', ['The team practised hard so, they won the game.', 'The team practised, hard so they won the game.', 'The team practised hard so they won the game.'], 'Use a comma before "so" joining independent clauses.'],
    ['We stayed inside, and when the rain stopped, we went to the park.', ['We stayed inside and when the rain stopped we went to the park.', 'We stayed inside, and when the rain stopped we went to the park.', 'We stayed inside and, when the rain stopped, we went to the park.'], 'Commas are needed before "and" and after the introductory clause.'],
    ['Although he was tired, he finished the race.', ['Although he was tired he finished the race.', 'Although he was tired he, finished the race.', 'Although, he was tired he finished the race.'], 'A comma follows an introductory dependent clause.'],
    ['I will help you if you ask.', ['I will help you, if you ask.', 'I will help, you if you ask.', 'I will help you if, you ask.'], 'No comma needed before a dependent clause at the end.'],
    ['She packed her bag, and he locked the door.', ['She packed her bag and, he locked the door.', 'She packed, her bag and he locked the door.', 'She packed her bag and he locked, the door.'], 'Use a comma before "and" joining two independent clauses.']
  ], 'Which sentence uses commas correctly?')),
  sk('CmCa', 'Commas with coordinate adjectives', 'Commas', G(8, 12), correct([
    ['It was a long, difficult exam.', ['It was a long difficult, exam.', 'It was a, long difficult exam.', 'It was a long difficult exam.'], 'Coordinate adjectives (you can swap them or join them with "and") take a comma.'],
    ['She wore a bright red scarf.', ['She wore a bright, red scarf.', 'She wore a, bright red scarf.', 'She wore a bright red, scarf.'], '"Bright" modifies "red scarf"; these are cumulative adjectives, so no comma.'],
    ['He lived in a quiet, peaceful village.', ['He lived in a quiet peaceful, village.', 'He lived in a, quiet peaceful village.', 'He lived in a quiet peaceful village.'], 'You can say "peaceful, quiet village" — coordinate.'],
    ['We bought three large pizzas.', ['We bought three, large pizzas.', 'We bought, three large pizzas.', 'We bought three large, pizzas.'], 'A number is not a coordinate adjective.'],
    ['A tall, dark stranger appeared.', ['A tall dark, stranger appeared.', 'A, tall dark stranger appeared.', 'A tall dark stranger, appeared.'], 'Coordinate adjectives.'],
    ['She carried an old leather bag.', ['She carried an old, leather bag.', 'She carried an, old leather bag.', 'She carried an old leather, bag.'], 'Cumulative adjectives: no comma.'],
    ['It was a cold, rainy day.', ['It was a cold rainy, day.', 'It was a, cold rainy day.', 'It was a cold rainy day.'], 'Coordinate adjectives.'],
    ['He drove a shiny new car.', ['He drove a shiny, new car.', 'He drove a, shiny new car.', 'He drove a shiny new, car.'], 'Cumulative adjectives.']
  ], 'Which sentence uses commas correctly?')),
  sk('CmRv', 'Commas: review', 'Commas', G(8, 12), correct([
    ['On Monday, March 3, we leave for Ottawa.', ['On Monday March 3, we leave for Ottawa.', 'On Monday, March, 3 we leave for Ottawa.', 'On Monday March 3 we leave for Ottawa.'], 'Commas set off dates in a sentence.'],
    ['She lives in Halifax, Nova Scotia.', ['She lives in Halifax Nova Scotia.', 'She lives, in Halifax Nova Scotia.', 'She lives in, Halifax Nova Scotia.'], 'A comma separates city and province.'],
    ['We need eggs, flour, sugar, and butter.', ['We need eggs flour sugar and butter.', 'We need, eggs flour sugar, and butter.', 'We need eggs, flour sugar and, butter.'], 'Commas separate items in a series.'],
    ['"I am ready," she said.', ['"I am ready" she said.', '"I am ready", she said.', '"I am ready." she said.'], 'A comma goes inside the closing quotation mark.'],
    ['Yes, I can help.', ['Yes I can help.', 'Yes I can, help.', 'Yes, I can, help.'], 'A comma follows "yes" at the start of a sentence.'],
    ['Dear Sam,', ['Dear Sam', 'Dear, Sam,', 'Dear Sam;'], 'A comma follows the greeting in a friendly letter.'],
    ['Sincerely,', ['Sincerely;', 'Sincerely.', 'Sincerely:'], 'A comma follows the closing of a letter.'],
    ['The meeting, however, was cancelled.', ['The meeting however was cancelled.', 'The meeting, however was cancelled.', 'The meeting however, was cancelled.'], 'Set off an interrupter with a pair of commas.']
  ], 'Which is punctuated correctly?')),
  /* ================= Semicolons, colons and commas ================= */
  sk('ScJn', 'Join sentences with semicolons, colons and commas', 'Semicolons, colons and commas', G(8, 12), correct([
    ['The test was hard; I still passed.', ['The test was hard, I still passed.', 'The test was hard: I still passed.', 'The test was hard; but I still passed.'], 'A semicolon joins closely related independent clauses.'],
    ['She had one wish: to travel the world.', ['She had one wish; to travel the world.', 'She had one wish, to travel the world.', 'She had one wish: and to travel the world.'], 'A colon introduces an explanation.'],
    ['It rained all day, so we stayed inside.', ['It rained all day; so we stayed inside.', 'It rained all day: so we stayed inside.', 'It rained all day so, we stayed inside.'], 'Comma + conjunction joins clauses.'],
    ['I like tea; my sister prefers coffee.', ['I like tea, my sister prefers coffee.', 'I like tea: my sister prefers coffee.', 'I like tea; and my sister prefers coffee.'], 'A semicolon joins related clauses.'],
    ['We have a problem: the printer is broken.', ['We have a problem; the printer is broken.', 'We have a problem, the printer is broken.', 'We have a problem: but the printer is broken.'], 'A colon introduces an explanation.'],
    ['He studied hard; therefore, he succeeded.', ['He studied hard, therefore, he succeeded.', 'He studied hard; therefore he, succeeded.', 'He studied hard: therefore, he succeeded.'], 'A semicolon precedes a conjunctive adverb; a comma follows it.'],
    ['The sky darkened, and the wind rose.', ['The sky darkened; and the wind rose.', 'The sky darkened: and the wind rose.', 'The sky darkened and, the wind rose.'], 'Comma + conjunction.'],
    ['Pack carefully: you will not have a second chance.', ['Pack carefully; you will, not have a second chance.', 'Pack carefully, you will not have a second chance.', 'Pack carefully: and you will not have a second chance.'], 'A colon introduces a reason or explanation.']
  ], 'Which sentence is correct?')),
  sk('ScCl', 'Use colons and commas to introduce lists, quotations and appositives', 'Semicolons, colons and commas', G(8, 12), correct([
    ['We need three things: flour, eggs and milk.', ['We need: three things flour, eggs and milk.', 'We need three things, flour, eggs and milk.', 'We need three things; flour, eggs and milk.'], 'A colon introduces a list after a complete sentence.'],
    ['We need flour, eggs and milk.', ['We need: flour, eggs and milk.', 'We need; flour, eggs and milk.', 'We need flour: eggs and milk.'], 'No colon after a verb that needs the list to be complete.'],
    ['She said, "I will be there."', ['She said: "I will be there."', 'She said "I will be there."', 'She said; "I will be there."'], 'A comma introduces a short quotation.'],
    ['The author made one point: courage matters.', ['The author made one point, courage matters.', 'The author made one point; courage matters.', 'The author made one point courage: matters.'], 'A colon introduces the explanation.'],
    ['My friend, a skilled chef, cooked dinner.', ['My friend: a skilled chef cooked dinner.', 'My friend; a skilled chef, cooked dinner.', 'My friend a skilled chef, cooked dinner.'], 'Commas set off the appositive.'],
    ['Remember the rules: be kind, be honest and be on time.', ['Remember the rules, be kind, be honest and be on time.', 'Remember the rules; be kind; be honest and be on time.', 'Remember: the rules be kind, be honest and be on time.'], 'A colon introduces a list after a complete sentence.'],
    ['He announced the winner: Maya Chen.', ['He announced the winner; Maya Chen.', 'He announced the winner, Maya Chen (as a list).', 'He announced: the winner Maya Chen.'], 'A colon introduces the appositive.'],
    ['The inscription read: "Gone but not forgotten."', ['The inscription read, "Gone but not forgotten."', 'The inscription read; "Gone but not forgotten."', 'The inscription: read "Gone but not forgotten."'], 'A colon after a complete sentence introduces a quotation.']
  ], 'Which sentence is punctuated correctly?')),
  sk('ScSr', 'Use semicolons and commas to separate items in a series', 'Semicolons, colons and commas', G(8, 12), correct([
    ['We visited Paris, France; Rome, Italy; and Madrid, Spain.', ['We visited Paris, France, Rome, Italy, and Madrid, Spain.', 'We visited Paris; France, Rome; Italy, and Madrid; Spain.', 'We visited Paris, France; Rome, Italy, and Madrid, Spain.'], 'Use semicolons when the items contain commas.'],
    ['The committee includes Dr. Lee, a chemist; Ms. Ortiz, a lawyer; and Mr. Kim, a teacher.', ['The committee includes Dr. Lee, a chemist, Ms. Ortiz, a lawyer, and Mr. Kim, a teacher.', 'The committee includes Dr. Lee; a chemist, Ms. Ortiz; a lawyer, and Mr. Kim; a teacher.', 'The committee includes Dr. Lee, a chemist; Ms. Ortiz, a lawyer, and Mr. Kim, a teacher.'], 'Semicolons separate items that already contain commas.'],
    ['I bought apples, oranges and bananas.', ['I bought apples; oranges; and bananas.', 'I bought apples; oranges and bananas.', 'I bought, apples oranges and bananas.'], 'Simple items are separated by commas.'],
    ['The meetings are on Monday, May 5; Tuesday, May 6; and Friday, May 9.', ['The meetings are on Monday, May 5, Tuesday, May 6, and Friday, May 9.', 'The meetings are on Monday; May 5, Tuesday; May 6, and Friday; May 9.', 'The meetings are on Monday, May 5; Tuesday, May 6, and Friday, May 9.'], 'Semicolons separate items containing commas.'],
    ['We packed tents, sleeping bags and stoves.', ['We packed tents; sleeping bags; and stoves.', 'We packed tents; sleeping bags and stoves.', 'We packed: tents sleeping bags and stoves.'], 'Simple items are separated by commas.'],
    ['The tour stops in Lyon, France; Zurich, Switzerland; and Vienna, Austria.', ['The tour stops in Lyon, France, Zurich, Switzerland, and Vienna, Austria.', 'The tour stops in Lyon; France, Zurich; Switzerland, and Vienna; Austria.', 'The tour stops in Lyon, France; Zurich, Switzerland, and Vienna, Austria.'], 'Semicolons separate items that contain commas.']
  ], 'Which sentence is punctuated correctly?')),
  sk('ScRv', 'Semicolons, colons and commas: review', 'Semicolons, colons and commas', G(8, 12), correct([
    ['I have three pets: a dog, a cat and a parrot.', ['I have three pets; a dog, a cat and a parrot.', 'I have three pets, a dog; a cat and a parrot.', 'I have: three pets a dog, a cat and a parrot.'], 'A colon introduces the list.'],
    ['The trip was long; the scenery was worth it.', ['The trip was long, the scenery was worth it.', 'The trip was long: the scenery was worth it.', 'The trip was long; but, the scenery was worth it.'], 'A semicolon joins independent clauses.'],
    ['She packed her bag, and then she left.', ['She packed her bag; and then she left.', 'She packed her bag: and then she left.', 'She packed her bag and, then she left.'], 'Comma + conjunction.'],
    ['He had one rule: never give up.', ['He had one rule, never give up.', 'He had one rule; never give up.', 'He had: one rule never give up.'], 'A colon introduces the explanation of the rule.'],
    ['The store sells shirts, ties and socks.', ['The store sells: shirts, ties and socks.', 'The store sells; shirts, ties and socks.', 'The store sells shirts; ties and socks.'], 'No colon after the verb.'],
    ['Whenever it snows, the schools close; however, the buses still run.', ['Whenever it snows the schools close, however the buses still run.', 'Whenever it snows, the schools close, however, the buses still run.', 'Whenever it snows, the schools close: however the buses still run.'], 'A semicolon comes before "however"; a comma follows it.']
  ], 'Which is punctuated correctly?')),
  /* ================= Dashes, hyphens and ellipses ================= */
  sk('DsUs', 'Use dashes', 'Dashes, hyphens and ellipses', G(8, 12), correct([
    ['My sister—the one in Vancouver—is visiting.', ['My sister-the one in Vancouver-is visiting.', 'My sister—the one in Vancouver is visiting.', 'My sister the one in Vancouver—is visiting.'], 'Em dashes set off a sudden aside; use a matching pair.'],
    ['Three things matter—time, effort and patience.', ['Three things matter—time—effort and patience.', 'Three things matter time—effort and patience.', 'Three things matter-time, effort and patience.'], 'A dash can introduce a list or explanation.'],
    ['He wanted one thing—to win.', ['He wanted one thing - to win.', 'He wanted one thing—to, win.', 'He wanted—one thing to win.'], 'A dash adds emphasis.'],
    ['I thought I could—but I was wrong.', ['I thought I could—, but I was wrong.', 'I thought I could but—I was wrong.', 'I thought—I could but I was wrong.'], 'A dash shows an abrupt break.'],
    ['The weather—cold and wet—spoiled our plans.', ['The weather—cold and wet, spoiled our plans.', 'The weather, cold and wet—spoiled our plans.', 'The weather—cold and wet spoiled—our plans.'], 'Use a pair of dashes around an interruption.'],
    ['She had only one fear—heights.', ['She had only one fear—, heights.', 'She had only—one fear heights.', 'She had only one fear heights—.'], 'A dash introduces a summarizing word.']
  ], 'Which sentence uses dashes correctly?')),
  sk('DsHy', 'Use hyphens in compound adjectives', 'Dashes, hyphens and ellipses', G(8, 12), correct([
    ['She is a well-known author.', ['She is a well known author.', 'She is a wellknown author.', 'She is a well—known author.'], 'Hyphenate compound adjectives before a noun.'],
    ['The author is well known.', ['The author is well-known.', 'The author is wellknown.', 'The author is well—known.'], 'No hyphen after the noun.'],
    ['We saw a six-year-old boy.', ['We saw a six year old boy.', 'We saw a six-year old boy.', 'We saw a six year-old boy.'], 'Hyphenate the whole compound.'],
    ['It was a long-awaited result.', ['It was a long awaited result.', 'It was a longawaited result.', 'It was a long—awaited result.'], 'Compound adjective before a noun.'],
    ['He drove a fast-moving truck.', ['He drove a fast moving truck.', 'He drove a fastmoving truck.', 'He drove a fast—moving truck.'], 'Hyphenate before the noun.'],
    ['The truck was moving fast.', ['The truck was moving-fast.', 'The truck was moving—fast.', 'The truck was-moving fast.'], '"Moving fast" is not a compound adjective here, so no hyphen.'],
    ['She wrote a two-page essay.', ['She wrote a two page essay.', 'She wrote a twopage essay.', 'She wrote a two—page essay.'], 'Compound adjective before a noun.'],
    ['They bought a high-quality camera.', ['They bought a high quality camera.', 'They bought a highquality camera.', 'They bought a high—quality camera.'], 'Compound adjective before a noun.']
  ], 'Which sentence uses hyphens correctly?')),
  sk('DsEl', 'Decide whether ellipses are used appropriately', 'Dashes, hyphens and ellipses', G(8, 12), classify({
    categories: ['Appropriate', 'Not appropriate'],
    prompt: s => `Is the ellipsis used appropriately?<br>${s}`,
    items: [
      ['Original: <em>"We hold these truths to be self-evident, that all men are created equal."</em><br>Quote: "We hold these truths … that all men are created equal."', 'Appropriate', 'The ellipsis marks omitted words without changing meaning.'],
      ['Quote: "I … love … this … book" (as a normal sentence by the writer)', 'Not appropriate', 'Ellipses should not replace normal punctuation.'],
      ['Original: <em>"The trip was long and tiring, but the view was spectacular."</em><br>Quote: "The trip was long and tiring … the view was spectacular."', 'Appropriate', 'Words were omitted ("but") without changing the main idea.'],
      ['Original: <em>"I do not support this plan."</em><br>Quote: "I … support this plan."', 'Not appropriate', 'It changes the meaning by removing "not".'],
      ['Original: <em>"Winter is cold, and it is dark early, but spring follows."</em><br>Quote: "Winter is cold … spring follows."', 'Appropriate', 'Omitted words do not change the meaning.'],
      ['Writing: "Well … I guess so." in dialogue to show hesitation', 'Appropriate', 'An ellipsis can show a pause in dialogue.'],
      ['Original: <em>"He was not guilty of the crime."</em><br>Quote: "He was … guilty of the crime."', 'Not appropriate', 'It reverses the meaning.'],
      ['Original: <em>"The results, which were published in 2020, surprised experts."</em><br>Quote: "The results … surprised experts."', 'Appropriate', 'The omitted clause is extra information.']
    ]
  })),

  /* ================= Apostrophes ================= */
  sk('ApPl', 'Identify and correct errors with plural and possessive nouns', 'Apostrophes', G(8, 12), correct([
    ['The three dogs\' bowls are empty.', ['The three dog\'s bowls are empty.', 'The three dogs bowls are empty.', 'The three dogs\'s bowls are empty.'], 'Plural possessive: add an apostrophe after the s.'],
    ['The children\'s toys are in the box.', ['The childrens\' toys are in the box.', 'The childrens toys are in the box.', 'The children toys are in the box.'], 'Irregular plural: add \'s.'],
    ['My brother\'s friends are visiting.', ['My brothers\' friends are visiting.', 'My brothers friends are visiting.', 'My brother friends are visiting.'], 'One brother: add \'s.'],
    ['Both teachers\' desks were tidy.', ['Both teacher\'s desks were tidy.', 'Both teachers desks were tidy.', 'Both teachers\'s desks were tidy.'], 'Two teachers: plural possessive.'],
    ['I bought three books at the sale.', ['I bought three book\'s at the sale.', 'I bought three books\' at the sale.', 'I bought three bookes at the sale.'], 'Simple plural: no apostrophe.'],
    ['Charles\'s car is new.', ['Charles\'s\' car is new.', 'Charle\'s car is new.', 'Charles car is new.'], 'A singular name ending in s can take \'s.'],
    ['The women\'s team won.', ['The womens\' team won.', 'The womens team won.', 'The womans\' team won.'], 'Irregular plural: add \'s.'],
    ['The two sisters\' bedroom is upstairs.', ['The two sister\'s bedroom is upstairs.', 'The two sisters bedroom is upstairs.', 'The two sisters\'s bedroom is upstairs.'], 'Two sisters: plural possessive.']
  ], 'Which sentence uses apostrophes correctly?')),
  sk('ApCp', 'Identify and correct errors with compound and joint possession', 'Apostrophes', G(9, 12), correct([
    ['Anna and Ben\'s house is big.', ['Anna\'s and Ben\'s house is big.', 'Anna and Bens\' house is big.', 'Annas and Ben\'s house is big.'], 'Joint possession: add \'s only to the last name.', 'Anna and Ben own one house together. Which sentence is correct?'],
    ['Anna\'s and Ben\'s coats are wet.', ['Anna and Ben\'s coats are wet.', 'Annas\' and Bens\' coats are wet.', 'Anna and Bens coats are wet.'], 'Separate possession: add \'s to each name.', 'Anna and Ben each own a coat. Which sentence is correct?'],
    ['My mother-in-law\'s recipe is famous.', ['My mother\'s-in-law recipe is famous.', 'My mother-in-laws recipe is famous.', 'My mothers-in-law recipe is famous.'], 'In compound nouns, add \'s to the last word.', 'Which sentence is correct?'],
    ['Tom and Sue\'s band won the contest.', ['Tom\'s and Sue\'s band won the contest.', 'Toms and Sue\'s band won the contest.', 'Tom and Sues\' band won the contest.'], 'Joint possession: one band owned together.', 'Tom and Sue lead one band together. Which sentence is correct?'],
    ['Lee\'s and Kim\'s essays were graded.', ['Lee and Kim\'s essays were graded.', 'Lees and Kims essays were graded.', 'Lee\'s and Kims\' essays were graded.'], 'Separate possession: each wrote an essay.', 'Lee and Kim each wrote an essay. Which sentence is correct?'],
    ['The editor-in-chief\'s decision was final.', ['The editor\'s-in-chief decision was final.', 'The editor-in-chiefs decision was final.', 'The editors-in-chief decision was final.'], 'Add \'s to the last word of a compound noun.', 'Which sentence is correct?'],
    ['Dad and Mom\'s anniversary is today.', ['Dad\'s and Mom\'s anniversary is today.', 'Dads and Mom\'s anniversary is today.', 'Dad and Moms\' anniversary is today.'], 'Joint possession: one shared anniversary.', 'Dad and Mom share one anniversary. Which sentence is correct?'],
    ['Sara\'s and Raj\'s answers differed.', ['Sara and Raj\'s answers differed.', 'Saras and Rajs answers differed.', 'Sara\'s and Rajs\' answers differed.'], 'Separate possession: each gave an answer.', 'Sara and Raj each gave an answer. Which sentence is correct?']
  ])),
  /* ================= Capitalization ================= */
  sk('CpEr', 'Correct capitalization errors', 'Capitalization', G(6, 12), correct([
    ['The Prime Minister of Canada spoke on Tuesday.', ['the prime minister of Canada spoke on tuesday.', 'The prime minister of canada spoke on Tuesday.', 'The Prime Minister Of Canada Spoke On Tuesday.'], 'Capitalize titles used with names, countries and days.'],
    ['We drove west along the highway.', ['We drove West along the highway.', 'we drove west along the Highway.', 'We Drove west along the highway.'], 'Directions are not capitalized.'],
    ['He grew up in the Midwest.', ['He grew up in the midwest.', 'He grew up in the MidWest.', 'he grew up in the Midwest.'], 'Named regions are capitalized.'],
    ['My aunt Linda and Uncle Joe came.', ['My Aunt Linda and uncle Joe came.', 'my aunt Linda and Uncle Joe came.', 'My aunt linda and Uncle joe came.'], 'Capitalize family titles used before names.'],
    ['I love math and history.', ['I love Math and History.', 'i love math and history.', 'I love math and History.'], 'School subjects are lowercase unless they are languages or course names.'],
    ['In July, we visited Lake Ontario.', ['In july, we visited lake ontario.', 'In July, we visited lake Ontario.', 'in July, we visited Lake Ontario.'], 'Months and proper names are capitalized.'],
    ['Grandma asked, "Did you finish?"', ['Grandma asked, "did you finish?"', 'grandma asked, "Did you finish?"', 'Grandma asked, "Did You finish?"'], 'Capitalize the first word of a quoted sentence.'],
    ['The Rocky Mountains are in Canada.', ['the rocky mountains are in Canada.', 'The Rocky mountains are in Canada.', 'The rocky Mountains are in canada.'], 'Capitalize proper names of places.']
  ], 'Which sentence uses capital letters correctly?')),
  sk('CpTt', 'Capitalizing titles', 'Capitalization', G(6, 12), correct([
    ['The Lord of the Rings', ['The Lord Of The Rings', 'The lord of the rings', 'The Lord of The Rings'], 'Capitalize main words; keep short articles and prepositions lowercase.'],
    ['A Wrinkle in Time', ['A Wrinkle In Time', 'A wrinkle in time', 'a Wrinkle in Time'], 'The first word is always capitalized.'],
    ['To Kill a Mockingbird', ['To kill a Mockingbird', 'To Kill A Mockingbird', 'to Kill a Mockingbird'], 'Capitalize main words and the first word.'],
    ['Harry Potter and the Sorcerer\'s Stone', ['Harry Potter And The Sorcerer\'s Stone', 'Harry potter and the sorcerer\'s stone', 'Harry Potter and the sorcerer\'s Stone'], 'Keep "and" and "the" lowercase.'],
    ['"The Road Not Taken"', ['"The road not taken"', '"The Road not Taken"', '"the Road Not Taken"'], 'Capitalize main words; "not" is a main word.'],
    ['Charlotte\'s Web', ['Charlotte\'s web', 'charlotte\'s Web', 'Charlotte\'s WEB'], 'Capitalize main words.'],
    ['Where the Wild Things Are', ['Where The Wild Things Are', 'Where the wild things are', 'where the Wild Things Are'], '"The" in the middle is lowercase; "Are" is a verb, so capitalized.'],
    ['Journey to the Center of the Earth', ['Journey To The Center Of The Earth', 'Journey to the center of the earth', 'journey to the Center of the Earth'], 'Short prepositions and articles stay lowercase.']
  ], 'Which title is capitalized correctly?')),

  /* ================= Formatting ================= */
  sk('FmQt', 'Formatting quotations and dialogue', 'Formatting', G(6, 12), correct([
    ['"Where are you going?" she asked.', ['"Where are you going"? she asked.', '"Where are you going?" She asked.', '"Where are you going." she asked.'], 'The question mark stays inside the quotation marks; "she asked" is lowercase.'],
    ['"I\'m tired," he said, "but I\'ll finish."', ['"I\'m tired," he said, "But I\'ll finish."', '"I\'m tired", he said, "but I\'ll finish."', '"I\'m tired," he said "but I\'ll finish."'], 'Commas go inside the quotation marks; the second part starts lowercase.'],
    ['She said, "Let\'s go."', ['She said "Let\'s go".', 'She said, "let\'s go."', 'She said: "Let\'s go.'], 'Comma before the quote; capital letter; period inside.'],
    ['"Stop!" he shouted. "You\'ll miss the bus."', ['"Stop!" He shouted. "You\'ll miss the bus."', '"Stop"! he shouted. "You\'ll miss the bus."', '"Stop!", he shouted. "You\'ll miss the bus."'], 'Exclamation point inside; "he shouted" lowercase.'],
    ['My teacher said, "Read chapter four."', ['My teacher said "Read chapter four".', 'My teacher said, "read chapter four."', 'My teacher said: Read chapter four."'], 'Comma, capital letter, period inside.'],
    ['Did he say, "I\'ll be late"?', ['Did he say, "I\'ll be late?"', 'Did he say "I\'ll be late?"', 'Did he say, I\'ll be late?"'], 'The whole sentence is a question, so the question mark goes outside.'],
    ['"I think," said Maya, "that we should go."', ['"I think" said Maya "that we should go."', '"I think," said Maya, "That we should go."', '"I think", said Maya, "that we should go."'], 'Commas inside the quotes; continuation is lowercase.'],
    ['Each time a new person speaks, start a new paragraph.', ['Each time a new person speaks start on the same line.', 'Each time a new person speaks, use italics.', 'Each time a new person speaks, use a colon.'], 'In dialogue, a new speaker begins a new paragraph.']
  ], 'Which sentence is formatted correctly?')),
  sk('FmTt', 'Formatting titles', 'Formatting', G(6, 12), classify({
    categories: ['Italics', 'Quotation marks'],
    prompt: t => `How should the title ${b(t)} be formatted?`,
    items: [
      ['a novel: Pride and Prejudice', 'Italics', 'Titles of long works (books, films, albums) are italicized.'],
      ['a poem: The Raven', 'Quotation marks', 'Titles of short works (poems, songs, articles) go in quotes.'],
      ['a movie: The Lion King', 'Italics', 'Long works are italicized.'],
      ['a song: Happy Birthday', 'Quotation marks', 'Short works go in quotation marks.'],
      ['a newspaper: The Globe and Mail', 'Italics', 'Newspapers are italicized.'],
      ['a short story: The Gift of the Magi', 'Quotation marks', 'Short stories go in quotes.'],
      ['a TV series: Planet Earth', 'Italics', 'Series titles are italicized.'],
      ['a magazine article: Ocean Plastics', 'Quotation marks', 'Articles go in quotes.'],
      ['an album: Thriller', 'Italics', 'Albums are italicized.'],
      ['a chapter: The Boy Who Lived', 'Quotation marks', 'Chapters go in quotes.']
    ]
  }))
];
