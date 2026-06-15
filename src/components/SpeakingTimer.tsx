import React, { useState, useEffect, useRef } from 'react';

interface Props {
  prompt: string;
}

export const SpeakingTimer: React.FC<Props> = ({ prompt }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => { setTimeLeft(60); setDone(false); setRunning(true); };
  const stop  = () => { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const reset = () => { stop(); setTimeLeft(60); setDone(false); };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { setRunning(false); setDone(true); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => { reset(); }, [prompt]);

  const pct = timeLeft / 60;
  const r = 32;
  const circumference = 2 * Math.PI * r;
  const strokeColor = timeLeft > 30 ? '#e8620a' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  return (
    <div className="glass rounded-3xl p-7 shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-xl bg-glow-orange/10 border border-glow-orange/20 flex items-center justify-center text-lg">
          🎙️
        </div>
        <div>
          <h3 className="font-display text-xl tracking-wider text-white/90">Speaking Practice</h3>
          <p className="text-white/30 text-[10px] font-semibold tracking-widest uppercase">1-Minute Challenge</p>
        </div>
      </div>

      <p className="text-white/50 text-sm leading-relaxed mb-7 pl-1">{prompt}</p>

      {/* Controls */}
      <div className="flex items-center gap-6">
        {/* Ring */}
        <div className={`relative shrink-0 ${running ? 'animate-timerPulse' : ''}`}>
          <svg width="88" height="88" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <circle
              cx="44" cy="44" r={r}
              fill="none"
              stroke={strokeColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${pct * circumference} ${circumference}`}
              transform="rotate(-90 44 44)"
              style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s', filter: `drop-shadow(0 0 6px ${strokeColor}88)` }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-2xl tracking-wider"
            style={{ color: strokeColor }}>
            {done ? '✓' : timeLeft}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2.5">
          {!running && !done && (
            <button
              onClick={start}
              className="px-6 py-2.5 bg-btn-gradient text-white rounded-xl font-semibold text-sm
                         hover:shadow-glow-sm hover:scale-105 active:scale-95 transition-all duration-200 tracking-wide"
            >
              ▶ Start
            </button>
          )}
          {running && (
            <button
              onClick={stop}
              className="px-6 py-2.5 bg-glow-amber/90 text-cinema-black rounded-xl font-semibold text-sm
                         hover:bg-glow-amber hover:scale-105 active:scale-95 transition-all duration-200 tracking-wide"
            >
              ⏸ Pause
            </button>
          )}
          {done && (
            <div className="flex items-center gap-3">
              <span className="text-green-400 font-semibold text-sm">🎉 Great job!</span>
              <button
                onClick={reset}
                className="px-5 py-2.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl
                           font-semibold text-sm hover:bg-green-500/30 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          )}
          {(running || (!done && timeLeft < 60)) && (
            <button
              onClick={reset}
              className="px-4 py-2.5 glass text-white/40 rounded-xl font-semibold text-sm
                         hover:text-white/70 hover:border-white/20 transition-all duration-200"
            >
              ↺
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
