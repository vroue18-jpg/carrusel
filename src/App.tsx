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
    <div className="min-h-screen bg-cinema-gradient font-sans relative overflow-x-hidden">

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-orb absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-glow-orange/10 blur-3xl" />
        <div className="animate-orb absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-glow-red/8 blur-3xl" style={{ animationDelay: '-3s' }} />
        <div className="animate-orb absolute bottom-0 left-0 w-72 h-72 rounded-full bg-glow-gold/6 blur-3xl" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/[0.07]">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-wider shimmer-text leading-none">
              Phrasal Verb Calculator
            </h1>
            <p className="text-white/30 text-[10px] font-semibold tracking-[0.2em] uppercase mt-0.5">
              by Craft English
            </p>
          </div>

          <button
            onClick={pickRandom}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                       bg-btn-gradient shadow-glow-sm
                       hover:shadow-glow-md hover:scale-105
                       active:scale-95 transition-all duration-200"
          >
            <span className="text-base transition-transform duration-300 group-hover:rotate-180">🎲</span>
            <span className="hidden sm:inline tracking-wide">Random</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10 space-y-8 relative z-10">

        {/* Hero label */}
        <div className="text-center space-y-2">
          <p className="font-handwritten text-xl text-white/40">
            Select a particle to unlock its meaning ✦
          </p>
        </div>

        {/* Particle selector panel */}
        <div className="glass rounded-3xl p-6 shadow-card">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/25 mb-5">
            Choose a Particle
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
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

        {/* Detail or empty state */}
        {active ? (
          <ParticleDetail key={active.particle} data={active} />
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-6 animate-pulse2 inline-block">🔤</div>
            <p className="font-display text-3xl tracking-widest text-white/20">
              PICK A PARTICLE
            </p>
            <p className="text-white/20 text-sm mt-2 font-light">or hit the 🎲 Random button above</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-10 border-t border-white/[0.05] mt-8 relative z-10">
        <p className="font-handwritten text-lg text-white/25">Made with ❤️ by Craft English</p>
        <p className="text-white/15 text-xs mt-1 tracking-wide">
          Helping learners master English — one particle at a time
        </p>
      </footer>
    </div>
  );
}
