import React from 'react';
import type { PhrasalVerb } from '../data/particles';

interface Props {
  verb: PhrasalVerb;
  index: number;
  aiExample?: string;
}

export const PhrasalVerbCard: React.FC<Props> = ({ verb, index, aiExample }) => (
  <div
    className="bg-white rounded-2xl p-4 shadow-sm border border-brand-orange/10 hover:shadow-md hover:border-brand-orange/30 transition-all duration-200 animate-fadeIn"
    style={{ animationDelay: `${index * 40}ms` }}
  >
    <div className="flex items-start justify-between gap-2 mb-2">
      <span className="font-handwritten text-xl font-bold text-brand-orange">{verb.verb}</span>
      <span className="text-xs bg-brand-orange-pale text-brand-orange px-2 py-0.5 rounded-full shrink-0 mt-0.5">
        #{index + 1}
      </span>
    </div>
    <p className="text-gray-700 text-sm mb-2 font-medium">{verb.meaning}</p>
    <p className="text-gray-500 text-sm italic">"{aiExample ?? verb.example}"</p>
  </div>
);
