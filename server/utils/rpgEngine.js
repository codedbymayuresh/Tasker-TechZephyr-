// ===================================================================
// RPG ENGINE
// All the game-math for Life RPG lives here: XP curve, leveling,
// category -> attribute mapping, difficulty rewards, and streaks.
// Keeping it in one file makes the numbers easy to tune later.
// ===================================================================

// XP required to go from `level` to `level + 1`.
// Non-linear on purpose: level 1->2 needs 100 XP, level 9->10 needs 8100 XP.
function xpRequiredForLevel(level) {
  return level * level * 100;
}

// Given a user's TOTAL lifetime XP, work out their current level,
// how much XP they have into the current level, and how much is
// needed to hit the next one. This is recalculated from scratch every
// time XP changes, so there's no drift or bad incremental math.
function calculateLevelProgress(totalXp) {
  let level = 1;
  let remaining = totalXp;

  while (remaining >= xpRequiredForLevel(level)) {
    remaining -= xpRequiredForLevel(level);
    level += 1;
  }

  return {
    level,
    currentLevelXp: remaining,
    xpForNextLevel: xpRequiredForLevel(level),
  };
}

// Which character attribute a task category feeds into.
// Add more categories here as needed - the frontend dropdown should
// match these keys.
const CATEGORY_ATTRIBUTE_MAP = {
  fitness: 'strength',
  coding: 'intellect',
  study: 'intellect',
  reading: 'wisdom',
  mindfulness: 'wisdom',
  social: 'charisma',
  chores: 'discipline',
  discipline: 'discipline',
  other: 'discipline',
};

const VALID_CATEGORIES = Object.keys(CATEGORY_ATTRIBUTE_MAP);

// XP and gold awarded per difficulty tier, plus how much the matching
// attribute increases. Tune these numbers freely for game balance.
const DIFFICULTY_REWARDS = {
  easy: { xp: 20, gold: 10, attributePoints: 1 },
  medium: { xp: 50, gold: 25, attributePoints: 2 },
  hard: { xp: 100, gold: 50, attributePoints: 4 },
};

const VALID_DIFFICULTIES = Object.keys(DIFFICULTY_REWARDS);

// Updates a user's streak in place based on today's date vs the last
// day they completed a task. Call this once per task completion -
// it's safe to call multiple times in the same day (streak won't
// double-count).
function applyStreakUpdate(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = user.streak.lastCompletedDate
    ? new Date(user.streak.lastCompletedDate)
    : null;
  if (last) last.setHours(0, 0, 0, 0);

  if (!last) {
    user.streak.count = 1;
  } else {
    const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      // Already logged activity today - streak count doesn't change.
    } else if (diffDays === 1) {
      user.streak.count += 1;
    } else {
      // Missed one or more days - streak resets.
      user.streak.count = 1;
    }
  }

  user.streak.lastCompletedDate = today;
  if (user.streak.count > user.streak.longestStreak) {
    user.streak.longestStreak = user.streak.count;
  }
}

// The single entry point the task controller calls when a task is
// marked complete. Mutates `user` in place (caller is responsible for
// user.save()) and returns a summary of what happened, useful for
// frontend celebration animations.
function applyTaskCompletionRewards(user, task) {
  const difficulty = DIFFICULTY_REWARDS[task.difficulty]
    ? task.difficulty
    : 'medium';
  const reward = DIFFICULTY_REWARDS[difficulty];
  const attribute = CATEGORY_ATTRIBUTE_MAP[task.category] || 'discipline';

  const levelBefore = calculateLevelProgress(user.xp).level;

  user.xp += reward.xp;
  user.gold += reward.gold;
  user.attributes[attribute] = (user.attributes[attribute] || 0) + reward.attributePoints;

  applyStreakUpdate(user);

  const levelProgress = calculateLevelProgress(user.xp);
  const leveledUp = levelProgress.level > levelBefore;

  return {
    xpGained: reward.xp,
    goldGained: reward.gold,
    attributeGained: { attribute, amount: reward.attributePoints },
    leveledUp,
    newLevel: levelProgress.level,
    levelProgress,
    streak: user.streak,
  };
}

module.exports = {
  xpRequiredForLevel,
  calculateLevelProgress,
  applyTaskCompletionRewards,
  CATEGORY_ATTRIBUTE_MAP,
  VALID_CATEGORIES,
  DIFFICULTY_REWARDS,
  VALID_DIFFICULTIES,
};
