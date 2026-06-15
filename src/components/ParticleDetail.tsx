import React, { useState } from 'react';
import type { ParticleData } from '../data/particles';
import { PhrasalVerbCard } from './PhrasalVerbCard';
import { SpeakingTimer } from './SpeakingTimer';
import { generateExamples } from '../utils/aiExamples';

interface Props {
  data: ParticleData;
}

export const ParticleDetail: React.FC<Props> = ({ data }) => {
  const [aiExamples, setAiExamples] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);

  const handleGenerateExamples = async () => {
    setLoading(true);
    const examples = await generateExamples(data.phrasalVerbs);
    setAiExamples(examples);
    setLoading(false);
  };

  const handleNewChallenge = () => {
    const next = (promptIndex + 1 + Math.floor(Math.random() * (data.speakingPrompts.length - 1))) % data.speakingPrompts.length;
    setPromptIndex(next);
  };

  return (
    <div className="animate-fadeIn space-y-5">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-card border border-glow-orange/20"
           style={{ background: 'linear-gradient(135deg, rgba(232,98,10,0.20) 0%, rgba(192,57,43,0.12) 60%, rgba(212,160,23,0.08) 100%)' }}>
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-glow-orange/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="text-6xl drop-shadow-lg shrink-0">{data.emoji}</div>
          <div>
            <div className="font-display text-6xl sm:text-7xl tracking-widest text-glow-orange text-glow leading-none">
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
        <div className="glass rounded-3xl p-6 shadow-card hover:shadow-card-hover hover:border-white/12 transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-glow-gold/10 border border-glow-gold/20 flex items-center justify-center text-sm">
              🖼️
            </div>
            <h3 className="font-display text-xl tracking-wider text-white/80">Visual Metaphor</h3>
          </div>
          <p className="text-white/45 text-sm leading-relaxed">{data.visualMetaphor}</p>
        </div>

        <div className="glass rounded-3xl p-6 shadow-card hover:shadow-card-hover hover:border-white/12 transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-glow-orange/10 border border-glow-orange/20 flex items-center justify-center text-sm">
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
            disabled={loading}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide
                       bg-glow-orange/10 border border-glow-orange/25 text-glow-orange
                       hover:bg-glow-orange/20 hover:border-glow-orange/50 hover:shadow-glow-sm
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating…
              </>
            ) : (
              <>
                <span className="transition-transform duration-300 group-hover:rotate-12">✨</span>
                Generate New Examples
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.phrasalVerbs.map((pv, i) => (
            <PhrasalVerbCard
              key={pv.verb}
              verb={pv}
              index={i}
              aiExample={aiExamples[pv.verb]}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 pt-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-glow-orange/30 to-transparent" />
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/20">Now practice</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-glow-orange/30 to-transparent" />
      </div>

      {/* Speaking Timer */}
      <SpeakingTimer
        prompt={data.speakingPrompts[promptIndex]}
        promptIndex={promptIndex}
        totalPrompts={data.speakingPrompts.length}
        onNewChallenge={handleNewChallenge}
      />
    </div>
  );
};
