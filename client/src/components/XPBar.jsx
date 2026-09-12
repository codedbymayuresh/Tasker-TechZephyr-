import React from 'react';

// Shows current level and a progress bar toward the next one.
// Expects the shape returned by the backend's calculateLevelProgress():
// { level, currentLevelXp, xpForNextLevel }
export default function XPBar({ level, currentLevelXp, xpForNextLevel }) {
  const percent = xpForNextLevel > 0
    ? Math.min(100, Math.round((currentLevelXp / xpForNextLevel) * 100))
    : 0;

  return (
    <div className="xp-bar" role="group" aria-label="Experience progress">
      <div className="xp-bar-label">
        Level {level} — {currentLevelXp} / {xpForNextLevel} XP
      </div>
      <div
        className="xp-bar-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="xp-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
