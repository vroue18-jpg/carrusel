import React, { useState } from 'react';
import type { ParticleData } from '../data/particles';
import { PhrasalVerbCard } from './PhrasalVerbCard';
import { SpeakingTimer } from './SpeakingTimer';
import { getParticleColor } from './ParticleCarousel';

interface Props {
  data: ParticleData;
  onChallengeComplete?: () => void;
}

export const ParticleDetail: React.FC<Props> = ({ data, onChallengeComplete }) => {
  const c = getParticleColor(data.particle);
  const [exampleSet, setExampleSet] = useState(0); // 0 = original, 1-2 = extras
  const [promptIndex, setPromptIndex] = useState(0);

  // total sets = original + 2 extra examples per verb
  const totalSets = 3;

  const handleGenerateExamples = () => {
    setExampleSet((prev) => (prev + 1) % totalSets);
  };

  const handleNewChallenge = () => {
    const next = (promptIndex + 1 + Math.floor(Math.random() * (data.speakingPrompts.length - 1))) % data.speakingPrompts.length;
    setPromptIndex(next);
  };

  return (
    <div className="animate-fadeIn space-y-5">

      {/* Hero banner */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 shadow-card transition-all duration-700"
        style={{
          border: `1px solid ${c.border}`,
          background: `linear-gradient(135deg, ${c.bg} 0%, rgba(0,0,0,0.4) 60%, ${c.bg.replace('0.15','0.05')} 100%)`,
        }}
      >
        <div
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700"
          style={{ background: c.bg, opacity: 1.5 }}
        />
        <div className="relative z-10 flex items-center gap-5">
          <div className="text-6xl drop-shadow-lg shrink-0">{data.emoji}</div>
          <div>
            <div
              className="font-display text-6xl sm:text-7xl tracking-widest leading-none transition-all duration-700"
              style={{ color: c.text, textShadow: `0 0 30px ${c.glow}80, 0 0 60px ${c.glow}40` }}
            >
              {data.particle}
            </div>
            <p className="text-white/60 text-sm font-medium mt-2 leading-relaxed max-w-xl">
              {data.coreMeaning}
            </p>
          </div>
        </div>
      </div>

      {/* Two-col info row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className="rounded-3xl p-6 shadow-card transition-all duration-700"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.border}` }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-700"
                 style={{ background: c.bg, border: `1px solid ${c.border}` }}>
              🖼️
            </div>
            <h3 className="font-display text-xl tracking-wider text-white/80">Visual Metaphor</h3>
          </div>
          <p className="text-white/45 text-sm leading-relaxed">{data.visualMetaphor}</p>
        </div>

        <div
          className="rounded-3xl p-6 shadow-card transition-all duration-700"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.border}` }}
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-700"
                 style={{ background: c.bg, border: `1px solid ${c.border}` }}>
              📐
            </div>
            <h3 className="font-display text-xl tracking-wider text-white/80">Pattern</h3>
          </div>
          <p className="text-white/45 text-sm leading-relaxed">{data.patternExplanation}</p>
        </div>
      </div>

      {/* Phrasal Verbs section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">
              📚
            </div>
            <h3 className="font-display text-xl tracking-wider text-white/80">
              10 Common Phrasal Verbs
            </h3>
          </div>

          <button
            onClick={handleGenerateExamples}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200"
            style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
          >
            <span className="transition-transform duration-300 group-hover:rotate-12">✨</span>
            New Examples
            <span className="text-white/25 ml-1">{exampleSet + 1}/{totalSets}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.phrasalVerbs.map((pv, i) => (
            <PhrasalVerbCard
              key={pv.verb}
              verb={pv}
              index={i}
              exampleSet={exampleSet}
              accentColor={c}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 pt-4">
        <div className="h-px flex-1 transition-all duration-700" style={{ background: `linear-gradient(to right, transparent, ${c.border}, transparent)` }} />
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/20">Now practice</span>
        <div className="h-px flex-1 transition-all duration-700" style={{ background: `linear-gradient(to right, transparent, ${c.border}, transparent)` }} />
      </div>

      {/* Speaking Timer */}
      <SpeakingTimer
        prompt={data.speakingPrompts[promptIndex]}
        promptIndex={promptIndex}
        totalPrompts={data.speakingPrompts.length}
        onNewChallenge={handleNewChallenge}
        onChallengeComplete={onChallengeComplete}
      />
    </div>
  );
};
