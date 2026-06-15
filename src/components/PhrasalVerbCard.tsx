import React from 'react';
import type { PhrasalVerb } from '../data/particles';

interface Props {
  verb: PhrasalVerb;
  index: number;
  aiExample?: string;
}

export const PhrasalVerbCard: React.FC<Props> = ({ verb, index, aiExample }) => (
  <div
    className="group glass rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:border-glow-orange/20
               hover:-translate-y-0.5 transition-all duration-300 animate-fadeIn"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    <div className="flex items-start justify-between gap-2 mb-2.5">
      <span className="font-handwritten text-2xl font-bold text-glow-orange group-hover:text-glow-gold transition-colors duration-200">
        {verb.verb}
      </span>
      <span className="text-[10px] font-semibold tracking-widest text-white/20 bg-white/5 px-2 py-1 rounded-full shrink-0 mt-1 uppercase">
        #{index + 1}
      </span>
    </div>
    <p className="text-white/70 text-sm font-medium mb-2.5 leading-relaxed">{verb.meaning}</p>
    <p className="text-white/35 text-sm italic leading-relaxed border-l-2 border-glow-orange/30 pl-3">
      "{aiExample ?? verb.example}"
    </p>
  </div>
);
