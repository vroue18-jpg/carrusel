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

  const handleGenerateExamples = async () => {
    setLoading(true);
    const examples = await generateExamples(data.phrasalVerbs);
    setAiExamples(examples);
    setLoading(false);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-orange to-brand-orange-light rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{data.emoji}</span>
          <div>
            <h2 className="font-handwritten text-4xl font-bold tracking-wide">{data.particle}</h2>
            <p className="text-white/80 text-sm font-medium uppercase tracking-widest">Particle</p>
          </div>
        </div>
        <p className="text-white/95 text-base font-medium leading-relaxed">{data.coreMeaning}</p>
      </div>

      {/* Visual Metaphor */}
      <div className="bg-cream-100 rounded-3xl p-5 border border-cream-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🖼️</span>
          <h3 className="font-handwritten text-lg font-bold text-brand-orange">Visual Metaphor</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{data.visualMetaphor}</p>
      </div>

      {/* Pattern Explanation */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-brand-orange/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📐</span>
          <h3 className="font-handwritten text-lg font-bold text-brand-orange">Pattern Explanation</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">{data.patternExplanation}</p>
      </div>

      {/* Phrasal Verbs Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h3 className="font-handwritten text-lg font-bold text-brand-orange">10 Common Phrasal Verbs</h3>
          </div>
          <button
            onClick={handleGenerateExamples}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-semibold hover:bg-brand-orange-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
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
              <>✨ Generate New Examples</>
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* Speaking Timer */}
      <SpeakingTimer prompt={data.speakingPrompt} />
    </div>
  );
};
