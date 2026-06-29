import React, { useState, useEffect, useRef } from 'react';
import type { ParticleData } from '../data/particles';

interface Props {
  particles: ParticleData[];
  hoveredIndex: number | null;
  onSelect: (index: number) => void;
}

// Per-particle accent colors
const PARTICLE_COLORS: Record<string, { glow: string; bg: string; border: string; text: string }> = {
  UP:      { glow: '#e8620a', bg: 'rgba(232,98,10,0.15)',   border: 'rgba(232,98,10,0.35)',   text: '#e8620a' },
  OUT:     { glow: '#c0392b', bg: 'rgba(192,57,43,0.15)',   border: 'rgba(192,57,43,0.35)',   text: '#e05040' },
  OFF:     { glow: '#8e44ad', bg: 'rgba(142,68,173,0.15)',  border: 'rgba(142,68,173,0.35)',  text: '#b06fd0' },
  ON:      { glow: '#27ae60', bg: 'rgba(39,174,96,0.15)',   border: 'rgba(39,174,96,0.35)',   text: '#40c070' },
  OVER:    { glow: '#2980b9', bg: 'rgba(41,128,185,0.15)',  border: 'rgba(41,128,185,0.35)',  text: '#4aa0d5' },
  THROUGH: { glow: '#d4a017', bg: 'rgba(212,160,23,0.15)', border: 'rgba(212,160,23,0.35)', text: '#d4a017' },
  AWAY:    { glow: '#16a085', bg: 'rgba(22,160,133,0.15)', border: 'rgba(22,160,133,0.35)', text: '#20c0a0' },
  BACK:    { glow: '#e67e22', bg: 'rgba(230,126,34,0.15)', border: 'rgba(230,126,34,0.35)', text: '#e67e22' },
  AROUND:  { glow: '#e91e8c', bg: 'rgba(233,30,140,0.15)', border: 'rgba(233,30,140,0.35)', text: '#f060a8' },
  DOWN:    { glow: '#7f8c8d', bg: 'rgba(127,140,141,0.15)',border: 'rgba(127,140,141,0.35)',text: '#a0b0b1' },
};

export function getParticleColor(particle: string) {
  return PARTICLE_COLORS[particle] ?? PARTICLE_COLORS['UP'];
}

export const ParticleCarousel: React.FC<Props> = ({ particles, hoveredIndex, onSelect }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (idx === activeIdx) return;
    setVisible(false);
    setAnimating(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setVisible(true);
      setTimeout(() => setAnimating(false), 400);
    }, 220);
  };

  // Auto-cycle unless user is hovering a button
  useEffect(() => {
    if (hoveredIndex !== null) {
      // Show hovered particle immediately
      goTo(hoveredIndex);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = (prev + 1) % particles.length;
        setVisible(false);
        setTimeout(() => { setVisible(true); }, 220);
        return next;
      });
    }, 2600);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredIndex, particles.length]);

  const current = particles[activeIdx];
  const color = getParticleColor(current.particle);

  return (
    <div className="relative flex flex-col items-center py-12 select-none overflow-hidden">
      {/* Ambient glow behind the active particle */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(ellipse 60% 55% at 50% 40%, ${color.bg} 0%, transparent 70%)` }}
      />

      {/* Ghost particles above (previous) */}
      <div className="flex items-center gap-3 mb-5 opacity-20 scale-75 transition-all duration-300 pointer-events-none">
        {[-2, -1].map((offset) => {
          const idx = (activeIdx + offset + particles.length) % particles.length;
          const p = particles[idx];
          return (
            <span key={idx} className="font-display text-xl tracking-widest text-white/50">
              {p.emoji} {p.particle}
            </span>
          );
        })}
      </div>

      {/* Main active card */}
      <div
        className="relative z-10 flex flex-col items-center text-center cursor-pointer group"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.96)',
          transition: animating
            ? 'opacity 0.22s ease-out, transform 0.22s ease-out'
            : 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
        }}
        onClick={() => onSelect(activeIdx)}
      >
        <div className="text-7xl mb-3 drop-shadow-lg" style={{ filter: `drop-shadow(0 0 20px ${color.glow}60)` }}>
          {current.emoji}
        </div>

        <div
          className="font-display text-7xl sm:text-8xl tracking-widest leading-none mb-4"
          style={{
            color: color.text,
            textShadow: `0 0 30px ${color.glow}80, 0 0 60px ${color.glow}40`,
          }}
        >
          {current.particle}
        </div>

        <div
          className="text-sm font-medium leading-relaxed max-w-xs px-4 py-2 rounded-2xl"
          style={{ background: color.bg, border: `1px solid ${color.border}`, color: 'rgba(255,255,255,0.75)' }}
        >
          {current.coreMeaning}
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase"
             style={{ color: color.text, opacity: 0.6 }}>
          <span>Click to explore</span>
          <span>→</span>
        </div>
      </div>

      {/* Ghost particles below (next) */}
      <div className="flex items-center gap-3 mt-5 opacity-20 scale-75 transition-all duration-300 pointer-events-none">
        {[1, 2].map((offset) => {
          const idx = (activeIdx + offset) % particles.length;
          const p = particles[idx];
          return (
            <span key={idx} className="font-display text-xl tracking-widest text-white/50">
              {p.emoji} {p.particle}
            </span>
          );
        })}
      </div>

      {/* Dot nav */}
      <div className="flex items-center gap-1.5 mt-6">
        {particles.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeIdx ? '20px' : '6px',
              height: '6px',
              background: i === activeIdx ? color.text : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>
    </div>
  );
};
