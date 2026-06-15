import { useState, useCallback } from 'react';
import { PARTICLES } from './data/particles';
import { ParticleButton } from './components/ParticleButton';
import { ParticleDetail } from './components/ParticleDetail';

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const pickRandom = useCallback(() => {
    const idx = Math.floor(Math.random() * PARTICLES.length);
    setActiveIndex(idx);
  }, []);

  const active = activeIndex !== null ? PARTICLES[activeIndex] : null;

  return (
    <div className="min-h-screen bg-cream-100 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-brand-orange/10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-handwritten text-2xl sm:text-3xl font-bold text-brand-orange leading-none">
              Phrasal Verb Calculator
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 font-medium tracking-wide uppercase">by Craft English</p>
          </div>
          <button
            onClick={pickRandom}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-orange text-white rounded-2xl font-semibold text-sm hover:bg-brand-orange-dark transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            <span className="text-base">🎲</span>
            <span className="hidden sm:inline">Random</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Subtitle */}
        <div className="text-center">
          <p className="font-handwritten text-lg text-gray-500">
            Choose a particle to explore its meaning ✨
          </p>
        </div>

        {/* Particle Grid */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-brand-orange/10">
          <h2 className="font-handwritten text-base font-bold text-gray-400 uppercase tracking-widest mb-4">
            Select a Particle
          </h2>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {PARTICLES.map((p, i) => (
              <ParticleButton
                key={p.particle}
                particle={p.particle}
                emoji={p.emoji}
                isActive={activeIndex === i}
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {active ? (
          <ParticleDetail key={active.particle} data={active} />
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4 animate-pulse2">🔤</div>
            <p className="font-handwritten text-xl text-gray-400">Pick a particle above to get started</p>
            <p className="text-sm mt-2">or hit the 🎲 Random button</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-gray-400 border-t border-brand-orange/10 mt-8">
        <p className="font-handwritten text-sm">Made with ❤️ by Craft English</p>
        <p className="mt-1">Helping learners master English one particle at a time</p>
      </footer>
    </div>
  );
}
