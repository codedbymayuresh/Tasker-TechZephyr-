import React from 'react';

export default function CyberParticles() {
  // 30 well-balanced particles scattered across the entire screen
  const particles = Array.from({ length: 30 });

  return (
    <div className="cyber-particles">
      {particles.map((_, i) => {
        const leftPos = Math.random() * 100; // Random horizontal position (0% to 100%)
        const animDuration = Math.random() * 8 + 6; // Speed between 6s to 14s for smooth floating
        const animDelay = Math.random() * 10; // Staggered start times
        const size = Math.random() * 3 + 2; // Subtle size between 2px to 5px
        
        // Cycle through cyan, pink, and green neon accents
        const colorClass = i % 3 === 0 ? 'particle-cyan' : i % 3 === 1 ? 'particle-pink' : 'particle-green';

        return (
          <div
            key={i}
            className={`particle ${colorClass}`}
            style={{
              left: `${leftPos}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${animDuration}s`,
              animationDelay: `${animDelay}s`,
            }}
          />
        );
      })}
    </div>
  );
}