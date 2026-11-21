// Award definitions. Each award has value(ctx) and goal(ctx); it is earned when value ≥ goal.
// ctx: { stats: {answered, correct, time_sec, best_streak, homework_done},
//        mastered, totalScore, stars, scoreOf(skillId), grade: {ids, sections} | null }
// Early awards welcome new students; the later tiers and the grade awards need real breadth —
// many different skills mastered, and progress across the student's own grade.
const atLeast = (id, emoji, name, desc, value, goal) => ({ id, emoji, name, desc, value, goal: () => goal });

// grade awards: count the student's own-grade math skills at a SmartScore of `min` or more
const gradeCount = min => c => c.grade ? c.grade.ids.filter(id => c.scoreOf(id) >= min).length : 0;
const gradeShare = share => c => (c.grade?.ids.length ? Math.ceil(c.grade.ids.length * share) : null);

export const AWARDS = [
  // getting started
  atLeast('first',    '🌱', 'First Steps',       'Answer your very first question.',        c => c.stats.answered, 1),
  atLeast('q10',      '✏️', 'Warming Up',        'Answer 10 questions.',                     c => c.stats.answered, 10),
  atLeast('q50',      '📚', 'Bookworm',          'Answer 50 questions.',                     c => c.stats.answered, 50),
  atLeast('q100',     '💯', 'Century Club',      'Answer 100 questions.',                    c => c.stats.answered, 100),
  atLeast('q250',     '🚀', 'Unstoppable',       'Answer 250 questions.',                    c => c.stats.answered, 250),
  atLeast('q1000',    '🧠', 'Thousand Thinker',  'Answer 1,000 questions.',                  c => c.stats.answered, 1000),
  atLeast('q5000',    '🏔️', 'Summit Seeker',     'Answer 5,000 questions.',                  c => c.stats.answered, 5000),
  atLeast('c25',      '🎯', 'Sharpshooter',      'Get 25 questions correct.',                c => c.stats.correct, 25),
  atLeast('c100',     '🏹', 'Eagle Eye',         'Get 100 questions correct.',               c => c.stats.correct, 100),
  atLeast('c500',     '🎖️', 'Precision Pro',     'Get 500 questions correct.',               c => c.stats.correct, 500),
  atLeast('c2500',    '🦅', 'Bullseye Legend',   'Get 2,500 questions correct.',             c => c.stats.correct, 2500),
  atLeast('streak5',  '🔥', 'On Fire',           'Get 5 correct in a row.',                  c => c.stats.best_streak, 5),
  atLeast('streak10', '⚡', 'Lightning Mind',    'Get 10 correct in a row.',                 c => c.stats.best_streak, 10),
  atLeast('streak25', '🌋', 'Unbreakable',       'Get 25 correct in a row.',                 c => c.stats.best_streak, 25),
  atLeast('streak50', '☄️', 'Legendary Streak',  'Get 50 correct in a row.',                 c => c.stats.best_streak, 50),
  // mastering many different skills
  atLeast('master1',  '🥇', 'First Mastery',     'Reach a SmartScore of 100 on any skill.',  c => c.mastered, 1),
  atLeast('master3',  '🏅', 'Triple Crown',      'Master 3 skills (SmartScore 100).',        c => c.mastered, 3),
  atLeast('master8',  '👑', 'Mastery Royalty',   'Master 8 skills (SmartScore 100).',        c => c.mastered, 8),
  atLeast('master25', '🎓', 'Skill Collector',   'Master 25 different skills.',              c => c.mastered, 25),
  atLeast('master50', '🏛️', 'Master Builder',    'Master 50 different skills.',              c => c.mastered, 50),
  atLeast('master100','🌌', 'Grand Master',      'Master 100 different skills.',             c => c.mastered, 100),
  atLeast('score300', '📈', 'Rising Star',       'Reach a total SmartScore of 300.',         c => c.totalScore, 300),
  atLeast('score800', '🌟', 'Score Superstar',   'Reach a total SmartScore of 800.',         c => c.totalScore, 800),
  atLeast('score3000','✨', 'Score Champion',    'Reach a total SmartScore of 3,000.',       c => c.totalScore, 3000),
  atLeast('score10000','🏆', 'Score Legend',     'Reach a total SmartScore of 10,000.',      c => c.totalScore, 10000),
  // your own grade (math)
  { id: 'gradeExplorer', emoji: '🧭', name: 'Well-Rounded',  desc: 'Score 70+ on at least one skill in every section of your grade (math).',
    value: c => (c.grade ? c.grade.sections.filter(sec => sec.some(id => c.scoreOf(id) >= 70)).length : 0),
    goal: c => (c.grade?.sections.length || null) },
  { id: 'gradeQuarter', emoji: '🪜', name: 'Grade Climber',   desc: 'Master (100) a quarter of your grade\'s math skills.', value: gradeCount(100), goal: gradeShare(0.25) },
  { id: 'gradeBronze',  emoji: '🥉', name: 'Grade Bronze',    desc: 'Bronze (70+) on half of your grade\'s math skills.',   value: gradeCount(70),  goal: gradeShare(0.5) },
  { id: 'gradeSilver',  emoji: '🥈', name: 'Grade Silver',    desc: 'Silver (90+) on three quarters of your grade\'s math skills.', value: gradeCount(90), goal: gradeShare(0.75) },
  { id: 'gradeGold',    emoji: '🏆', name: 'Grade Champion',  desc: 'Master (100) every math skill in your grade.',          value: gradeCount(100), goal: gradeShare(1) },
  // time, stars, homework
  atLeast('time10',   '⏰', 'Dedicated',         'Practice for 10 total minutes.',           c => c.stats.time_sec, 600),
  atLeast('time30',   '🕰️', 'Marathoner',        'Practice for 30 total minutes.',           c => c.stats.time_sec, 1800),
  atLeast('time300',  '📆', 'Committed',         'Practice for 5 total hours.',              c => c.stats.time_sec, 5 * 3600),
  atLeast('time1200', '🧗', 'Iron Will',         'Practice for 20 total hours.',             c => c.stats.time_sec, 20 * 3600),
  atLeast('stars10',  '⭐', 'Star Collector',    'Earn 10 stars.',                           c => c.stars, 10),
  atLeast('stars25',  '💫', 'Superstar',         'Earn 25 stars.',                           c => c.stars, 25),
  atLeast('stars150', '🌠', 'Star Hoarder',      'Earn 150 stars.',                          c => c.stars, 150),
  atLeast('stars500', '🌞', 'Galaxy of Stars',   'Earn 500 stars.',                          c => c.stars, 500),
  atLeast('hw1',      '📝', 'Homework Hero',     'Complete your first homework assignment.', c => c.stats.homework_done, 1),
  atLeast('hw5',      '🗓️', 'Steady Scholar',    'Complete 5 homework assignments.',         c => c.stats.homework_done, 5),
  atLeast('hw10',     '🏫', "Teacher's Favorite", 'Complete 10 homework assignments.',       c => c.stats.homework_done, 10),
  atLeast('hw25',     '🎒', 'Homework Legend',   'Complete 25 homework assignments.',        c => c.stats.homework_done, 25)
];

/** Earned when the goal exists (a grade award needs a grade) and is reached. */
export const isEarned = (a, ctx) => { const g = a.goal(ctx); return g !== null && a.value(ctx) >= g; };

// public metadata (no functions) for the client's awards page
export const AWARD_META = AWARDS.map(({ id, emoji, name, desc }) => ({ id, emoji, name, desc }));
