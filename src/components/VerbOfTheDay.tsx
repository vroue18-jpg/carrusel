import React from 'react';
import { PARTICLES } from '../data/particles';

// Pick a deterministic verb based on today's date — same for all users on same day
function getVerbOfTheDay() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  // Flatten all verbs across all particles
  const all = PARTICLES.flatMap((p) =>
    p.phrasalVerbs.map((v) => ({ ...v, particle: p.particle, emoji: p.emoji }))
  );
  return all[dayOfYear % all.length];
}

const verb = getVerbOfTheDay();

interface Props {
  onPractice: (particle: string) => void;
}

export const VerbOfTheDay: React.FC<Props> = ({ onPractice }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-glow-gold/25 shadow-card animate-fadeIn"
         style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.12) 0%, rgba(232,98,10,0.10) 50%, rgba(192,57,43,0.07) 100%)' }}>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-glow-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-glow-orange/8 blur-2xl" />

      <div className="relative z-10 p-6 sm:p-8">

        {/* Label row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-glow-gold/80">
              Phrasal Verb of the Day
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-white/20">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Main content */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">

          {/* Verb + particle badge */}
          <div className="shrink-0">
            <div className="flex items-end gap-3 leading-none">
              <span className="font-display text-5xl sm:text-6xl tracking-widest text-white">
                {verb.verb}
              </span>
              <span className="mb-1 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase border"
                    style={{ background: 'rgba(212,160,23,0.15)', borderColor: 'rgba(212,160,23,0.35)', color: '#d4a017' }}>
                {verb.emoji} {verb.particle}
              </span>
            </div>
            <p className="text-white/50 text-sm font-medium mt-2">{verb.meaning}</p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch bg-white/10" />
          <div className="sm:hidden h-px bg-white/10" />

          {/* Example + CTA */}
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-white/65 text-sm sm:text-base leading-relaxed font-light italic">
              "{verb.example}"
            </p>
            <button
              onClick={() => onPractice(verb.particle)}
              className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                         border border-glow-gold/35 text-glow-gold
                         hover:bg-glow-gold/15 hover:border-glow-gold/60 hover:shadow-[0_0_16px_rgba(212,160,23,0.25)]
                         transition-all duration-200"
              style={{ background: 'rgba(212,160,23,0.08)' }}
            >
              <span>🎙️</span>
              Practice it now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
