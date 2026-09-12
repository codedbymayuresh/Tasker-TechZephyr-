import React from 'react';

export default function StreakDisplay({ streak }) {
  if (!streak) return null;

  return (
    <div className="streak-display">
      <span aria-label={`Current streak: ${streak.count} days`}>
        🔥 {streak.count}-day streak
      </span>
      {streak.longestStreak > streak.count && (
        <span> (best: {streak.longestStreak})</span>
      )}
    </div>
  );
}
