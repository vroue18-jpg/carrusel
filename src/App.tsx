import { useState, useCallback, useRef } from 'react';
import { PARTICLES } from './data/particles';
import { ParticleButton } from './components/ParticleButton';
import { ParticleDetail } from './components/ParticleDetail';
import { playSound } from './utils/sounds';

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function App() {
  const [activeIndex, setActiveIndex]   = useState<number | null>(null);
  const [streak, setStreak]             = useState(0);
  const [streakAnim, setStreakAnim]     = useState(false);
  const [diceRolling, setDiceRolling]   = useState(false);
  const [diceFace, setDiceFace]         = useState('🎲');
  const [btnAnim, setBtnAnim]           = useState(false);
  const diceIntervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  const pickRandom = useCallback(() => {
    if (diceRolling) return;
    playSound('diceRoll');
    setDiceRolling(true);
    setBtnAnim(true);

    // Cycle through dice faces rapidly while rolling
    let tick = 0;
    diceIntervalRef.current = setInterval(() => {
      setDiceFace(DICE_FACES[tick % DICE_FACES.length]);
      tick++;
    }, 80);

    setTimeout(() => {
      if (diceIntervalRef.current) clearInterval(diceIntervalRef.current);
      const idx = Math.floor(Math.random() * PARTICLES.length);
      setDiceFace(DICE_FACES[idx % DICE_FACES.length]);
      setActiveIndex(idx);
      setDiceRolling(false);
      setBtnAnim(false);
    }, 600);
  }, [diceRolling]);

  const handleStreakIncrement = useCallback(() => {
    setStreak((s) => s + 1);
    setStreakAnim(true);
    setTimeout(() => setStreakAnim(false), 400);
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
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl tracking-wider shimmer-text leading-none">
              Phrasal Verb Calculator
            </h1>
            <p className="text-white/30 text-[10px] font-semibold tracking-[0.2em] uppercase mt-0.5">
              by Craft English
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak counter */}
            {streak > 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-glow-gold/25 ${streakAnim ? 'animate-streakPop' : ''}`}>
                <span className="text-base">🔥</span>
                <span className="font-display text-lg tracking-wider text-glow-gold leading-none">{streak}</span>
                <span className="text-[10px] text-white/30 font-semibold tracking-widest uppercase hidden sm:inline">streak</span>
              </div>
            )}

            {/* Random / Dice button */}
            <button
              onClick={pickRandom}
              disabled={diceRolling}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white
                         bg-btn-gradient shadow-glow-sm hover:shadow-glow-md
                         active:scale-95 transition-all duration-200 disabled:cursor-not-allowed
                         ${btnAnim ? 'animate-slideInRight' : ''}`}
            >
              <span
                className="text-base inline-block"
                style={{ animation: diceRolling ? 'diceRoll 0.6s cubic-bezier(0.16,1,0.3,1)' : 'none' }}
              >
                {diceFace}
              </span>
              <span className="hidden sm:inline tracking-wide">
                {diceRolling ? 'Rolling…' : 'Random'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10 space-y-8 relative z-10">

        {/* Hero label */}
        <div className="text-center space-y-2">
          <p className="text-sm font-light tracking-[0.25em] uppercase text-white/35">
            Select a particle to unlock its meaning{' '}
            <span className="text-glow-orange/60">✦</span>
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
          <ParticleDetail
            key={active.particle}
            data={active}
            onChallengeComplete={handleStreakIncrement}
          />
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
