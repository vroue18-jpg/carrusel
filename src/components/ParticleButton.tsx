import React, { useState } from 'react';
import { playSound } from '../utils/sounds';
import { getParticleColor } from './ParticleCarousel';

interface Props {
  particle: string;
  emoji: string;
  coreMeaning: string;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovering: boolean) => void;
}

export const ParticleButton: React.FC<Props> = ({
  particle, emoji, coreMeaning, isActive, isHovered, onClick, onHover,
}) => {
  const [flashing, setFlashing] = useState(false);
  const color = getParticleColor(particle);

  const handleClick = () => {
    playSound('particleClick');
    setFlashing(true);
    setTimeout(() => setFlashing(false), 350);
    onClick();
  };

  return (
    <div className="relative group" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
      <button
        onClick={handleClick}
        className={`
          relative px-5 py-3 rounded-2xl font-display tracking-widest text-base
          transition-all duration-200 focus:outline-none
          ${flashing ? 'animate-colorFlash' : ''}
        `}
        style={isActive ? {
          background: `linear-gradient(135deg, ${color.bg} 0%, rgba(0,0,0,0.3) 100%)`,
          border: `1px solid ${color.border}`,
          color: color.text,
          boxShadow: `0 0 16px ${color.glow}50, 0 4px 20px rgba(0,0,0,0.4)`,
          transform: 'scale(1.08)',
        } : {
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.55)',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.color = color.text;
            (e.currentTarget as HTMLButtonElement).style.borderColor = color.border;
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 12px ${color.glow}35`;
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
            (e.currentTarget as HTMLButtonElement).style.transform = '';
          }
        }}
      >
        <span className="mr-1.5 text-sm">{emoji}</span>
        {particle}
        {isActive && (
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-cinema-dark"
            style={{ background: color.text, boxShadow: `0 0 8px ${color.glow}` }}
          />
        )}
      </button>

      {/* Hover tooltip with core meaning */}
      {!isActive && (
        <div
          className="absolute bottom-full left-1/2 mb-2 z-50 pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.18s ease',
          }}
        >
          <div
            className="text-xs font-medium leading-snug text-center whitespace-nowrap max-w-[180px] whitespace-normal px-3 py-2 rounded-xl shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${color.bg}, rgba(10,10,10,0.95))`,
              border: `1px solid ${color.border}`,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <div className="font-display text-sm tracking-widest mb-1" style={{ color: color.text }}>
              {emoji} {particle}
            </div>
            {coreMeaning}
          </div>
          {/* Arrow */}
          <div
            className="w-2 h-2 mx-auto rotate-45 -mt-1"
            style={{ background: color.bg, borderRight: `1px solid ${color.border}`, borderBottom: `1px solid ${color.border}` }}
          />
        </div>
      )}
    </div>
  );
};
