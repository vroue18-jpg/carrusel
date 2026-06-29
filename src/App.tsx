import { useState, useCallback, useRef, useEffect } from 'react';
import { PARTICLES } from './data/particles';
import { ParticleButton } from './components/ParticleButton';
import { ParticleDetail } from './components/ParticleDetail';
import { ParticleSlotMachine } from './components/ParticleSlotMachine';
import { VerbOfTheDay } from './components/VerbOfTheDay';
import { playSound } from './utils/sounds';

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const DAILY_GOAL = 3;

function getDailyProgress(): number {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem('craftEnglishDaily');
    if (!raw) return 0;
    const { date, count } = JSON.parse(raw);
    return date === today ? (count as number) : 0;
  } catch { return 0; }
}

function saveDailyProgress(count: number) {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('craftEnglishDaily', JSON.stringify({ date: today, count }));
}

// Circular SVG ring for daily goal
function GoalRing({ done, total, goalMet }: { done: number; total: number; goalMet: boolean }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(done / total, 1);
  const color = goalMet ? '#d4a017' : '#e8620a';

  return (
    <div className={`relative flex items-center justify-center transition-all duration-500 ${goalMet ? 'animate-streakPop' : ''}`}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={r} fill="none"
          stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${pct * circ} ${circ}`}
          transform="rotate(-90 24 24)"
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1), stroke 0.4s',
                   filter: goalMet ? `drop-shadow(0 0 6px ${color})` : undefined }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        {goalMet
          ? <span className="text-base">✓</span>
          : <span className="font-display text-sm tracking-wide" style={{ color }}>{done}</span>
        }
      </div>
    </div>
  );
}

function WelcomeModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { n: '1', icon: '🎰', title: 'Unlock the particle', desc: 'Spin the slot machine to reveal a particle like UP, OUT or THROUGH.' },
    { n: '2', icon: '📖', title: 'Learn the meaning', desc: 'See the visual metaphor, pattern and 10 phrasal verbs with real examples.' },
    { n: '3', icon: '🎙️', title: 'Practice speaking!', desc: 'Hit Record — the 1-minute timer starts automatically. Talk and get fluent.' },
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
         onClick={onClose}>
      <div
        className="relative max-w-sm w-full rounded-3xl p-8 shadow-2xl"
        style={{ background: 'linear-gradient(145deg, rgba(232,98,10,0.12) 0%, rgba(0,0,0,0.85) 60%)', border: '1px solid rgba(232,98,10,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl"
             style={{ background: 'radial-gradient(circle, rgba(232,98,10,0.25) 0%, transparent 70%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-center mb-1" style={{ color: 'rgba(232,98,10,0.7)' }}>How it works</p>
          <h2 className="font-display text-2xl tracking-wider text-white/90 text-center mb-7 leading-tight">
            3 steps to phrasal verb mastery
          </h2>
          <div className="space-y-4 mb-8">
            {steps.map(({ n, icon, title, desc }) => (
              <div key={n} className="flex gap-4 items-start">
                <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold"
                     style={{ background: 'rgba(232,98,10,0.15)', border: '1px solid rgba(232,98,10,0.3)', color: '#e8620a' }}>
                  {n}
                </div>
                <div>
                  <p className="text-white/85 font-semibold text-sm mb-0.5">{icon} {title}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl font-bold text-white tracking-wider text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{ background: 'linear-gradient(135deg, #e8620a, #e8620a88)', boxShadow: '0 4px 24px rgba(232,98,10,0.4)' }}
          >
            Let's go! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem('craftEnglishSeen_v2'));
  const [activeIndex, setActiveIndex]   = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [slotSpinCount, setSlotSpinCount] = useState(0);
  const [slotTarget, setSlotTarget]     = useState<number>(0);
  const [streak, setStreak]             = useState(0);
  const [streakAnim, setStreakAnim]     = useState(false);
  const [diceRolling, setDiceRolling]   = useState(false);
  const [diceFace, setDiceFace]         = useState('🎲');
  const [btnAnim, setBtnAnim]           = useState(false);
  const [dailyDone, setDailyDone]       = useState(getDailyProgress);
  const [goalFlash, setGoalFlash]       = useState(false);
  const diceIntervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  const goalMet = dailyDone >= DAILY_GOAL;

  // Persist daily progress whenever it changes
  useEffect(() => { saveDailyProgress(dailyDone); }, [dailyDone]);

  const pickRandom = useCallback(() => {
    if (diceRolling) return;
    playSound('diceRoll');
    setDiceRolling(true);
    setBtnAnim(true);

    let tick = 0;
    diceIntervalRef.current = setInterval(() => {
      setDiceFace(DICE_FACES[tick % DICE_FACES.length]);
      tick++;
    }, 80);

    setTimeout(() => {
      if (diceIntervalRef.current) clearInterval(diceIntervalRef.current);
      const idx = Math.floor(Math.random() * PARTICLES.length);
      setDiceFace(DICE_FACES[idx % DICE_FACES.length]);
      setDiceRolling(false);
      setBtnAnim(false);
      // If slot machine is visible (no active detail), spin it; otherwise go directly
      setSlotTarget(idx);
      setSlotSpinCount((c) => c + 1);
      setActiveIndex(null); // show slot machine if hidden
    }, 600);
  }, [diceRolling]);

  const handleStreakIncrement = useCallback(() => {
    setStreak((s) => s + 1);
    setStreakAnim(true);
    setTimeout(() => setStreakAnim(false), 400);

    setDailyDone((prev) => {
      const next = prev + 1;
      if (next === DAILY_GOAL) {
        setGoalFlash(true);
        setTimeout(() => setGoalFlash(false), 600);
      }
      return next;
    });
  }, []);

  const active = activeIndex !== null ? PARTICLES[activeIndex] : null;

  const handleCloseWelcome = () => { localStorage.setItem('craftEnglishSeen_v2', '1'); setShowWelcome(false); };

  return (
    <div className="min-h-screen bg-cinema-gradient font-sans relative overflow-x-hidden">
      {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}

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

            {/* Daily goal ring */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl glass border transition-all duration-500
              ${goalMet ? 'border-glow-gold/40 shadow-[0_0_16px_rgba(212,160,23,0.3)]' : 'border-white/10'}`}>
              <GoalRing done={dailyDone} total={DAILY_GOAL} goalMet={goalMet && !goalFlash} />
              <div className="hidden sm:flex flex-col leading-none">
                <span className={`text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300
                  ${goalMet ? 'text-glow-gold' : 'text-white/30'}`}>
                  {goalMet ? 'Goal met! 🎉' : 'Daily goal'}
                </span>
                <span className="text-white/20 text-[9px] mt-0.5">
                  {Math.min(dailyDone, DAILY_GOAL)}/{DAILY_GOAL} challenges
                </span>
              </div>
            </div>

            {/* Streak counter */}
            {streak > 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl glass border border-glow-gold/25 ${streakAnim ? 'animate-streakPop' : ''}`}>
                <span className="text-base">🔥</span>
                <span className="font-display text-lg tracking-wider text-glow-gold leading-none">{streak}</span>
                <span className="text-[10px] text-white/30 font-semibold tracking-widest uppercase hidden sm:inline">streak</span>
              </div>
            )}

          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10 space-y-8 relative z-10">

        {/* Verb of the Day */}
        <VerbOfTheDay onChallengeComplete={handleStreakIncrement} />

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
                coreMeaning={p.coreMeaning}
                isActive={activeIndex === i}
                isHovered={hoveredIndex === i}
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                onHover={(hovering) => setHoveredIndex(hovering ? i : null)}
              />
            ))}
          </div>
        </div>

        {/* Detail or slot machine */}
        {active ? (
          <ParticleDetail
            key={active.particle}
            data={active}
            onChallengeComplete={handleStreakIncrement}
          />
        ) : (
          <ParticleSlotMachine
            particles={PARTICLES}
            onSelect={(i) => setActiveIndex(i)}
            externalSpin={slotSpinCount}
            externalTarget={slotTarget}
          />
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
