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
      relative px-4 py-3 rounded-2xl font-bold text-sm tracking-widest transition-all duration-200
      border-2 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2
      ${isActive
        ? 'bg-brand-orange text-white border-brand-orange shadow-lg scale-105'
        : 'bg-white text-brand-orange border-brand-orange/30 hover:border-brand-orange hover:shadow-md hover:scale-102'
      }
    `}
  >
    <span className="mr-1">{emoji}</span>
    <span className="font-handwritten text-base">{particle}</span>
    {isActive && (
      <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
    )}
  </button>
);
