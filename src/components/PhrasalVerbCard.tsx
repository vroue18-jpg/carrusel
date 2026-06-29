import React from 'react';
import type { PhrasalVerb } from '../data/particles';

interface AccentColor { glow: string; bg: string; border: string; text: string }

interface Props {
  verb: PhrasalVerb;
  index: number;
  exampleSet: number;
  accentColor?: AccentColor;
}

export const PhrasalVerbCard: React.FC<Props> = ({ verb, index, exampleSet, accentColor }) => {
  const c = accentColor ?? { glow: '#e8620a', bg: 'rgba(232,98,10,0.15)', border: 'rgba(232,98,10,0.35)', text: '#e8620a' };
  const displayExample =
    exampleSet === 0
      ? verb.example
      : verb.extraExamples[exampleSet - 1] ?? verb.example;

  return (
    <div
      className="group rounded-2xl p-5 shadow-card hover:-translate-y-0.5 transition-all duration-300 animate-fadeIn"
      style={{
        animationDelay: `${index * 50}ms`,
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${c.border}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <span className="font-handwritten text-2xl font-bold transition-colors duration-200" style={{ color: c.text }}>
          {verb.verb}
        </span>
        <span className="text-[10px] font-semibold tracking-widest text-white/20 bg-white/5 px-2 py-1 rounded-full shrink-0 mt-1 uppercase">
          #{index + 1}
        </span>
      </div>
      <p className="text-white/70 text-sm font-medium mb-2.5 leading-relaxed">{verb.meaning}</p>
      <p
        className="text-white/35 text-sm italic leading-relaxed pl-3 animate-fadeIn"
        style={{ borderLeft: `2px solid ${c.border}` }}
        key={displayExample}
      >
        "{displayExample}"
      </p>
    </div>
  );
};
