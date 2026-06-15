import React, { useState, useEffect, useRef } from 'react';

interface Props {
  prompt: string;
}

export const SpeakingTimer: React.FC<Props> = ({ prompt }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setTimeLeft(60);
    setDone(false);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    stop();
    setTimeLeft(60);
    setDone(false);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setRunning(false);
            setDone(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => { reset(); }, [prompt]);

  const pct = (timeLeft / 60) * 100;
  const circumference = 2 * Math.PI * 28;
  const strokeDash = (pct / 100) * circumference;
  const color = timeLeft > 30 ? '#e8620a' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-orange/10">
      <div className="flex items-start gap-4 mb-4">
        <span className="text-2xl">🎙️</span>
        <div>
          <h3 className="font-handwritten text-xl font-bold text-brand-orange mb-1">Speaking Practice</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{prompt}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className={`relative ${running ? 'animate-timerPulse' : ''}`}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="28" fill="none" stroke="#fde8d8" strokeWidth="6" />
            <circle
              cx="36" cy="36" r="28"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 36 36)"
              style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-lg" style={{ color }}>
            {done ? '✓' : timeLeft}
          </span>
        </div>

        <div className="flex gap-2">
          {!running && !done && (
            <button
              onClick={start}
              className="px-5 py-2.5 bg-brand-orange text-white rounded-xl font-semibold text-sm hover:bg-brand-orange-dark transition-colors shadow-sm"
            >
              ▶ Start
            </button>
          )}
          {running && (
            <button
              onClick={stop}
              className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors shadow-sm"
            >
              ⏸ Pause
            </button>
          )}
          {done && (
            <div className="text-center">
              <p className="text-green-600 font-bold text-sm mb-2">🎉 Great job!</p>
              <button
                onClick={reset}
                className="px-4 py-2 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          {(running || (!done && timeLeft < 60)) && (
            <button
              onClick={reset}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              ↺
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
