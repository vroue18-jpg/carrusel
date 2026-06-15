import React from 'react';

interface Props {
  particle: string;
  emoji: string;
  isActive: boolean;
  onClick: () => void;
}

export const ParticleButton: React.FC<Props> = ({ particle, emoji, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      relative px-5 py-3 rounded-2xl font-display tracking-widest text-base
      transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-glow-orange/50 focus:ring-offset-2 focus:ring-offset-cinema-dark
      ${isActive
        ? 'bg-particle-active text-white shadow-glow-md scale-105 border border-glow-orange/30'
        : 'glass text-white/60 hover:text-white hover:border-glow-orange/30 hover:shadow-glow-sm hover:scale-105 active:scale-95'
      }
    `}
  >
    <span className="mr-1.5 text-sm">{emoji}</span>
    {particle}
    {isActive && (
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-glow-gold rounded-full shadow-glow-sm border border-cinema-dark" />
    )}
  </button>
);
