import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sounds';

interface Props {
  prompt: string;
  promptIndex: number;
  totalPrompts: number;
  onNewChallenge: () => void;
  onChallengeComplete?: () => void;
}

export const SpeakingTimer: React.FC<Props> = ({ prompt, promptIndex, totalPrompts, onNewChallenge, onChallengeComplete }) => {
  // ── Timer state ──────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Recorder state ───────────────────────────────────────────
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recError, setRecError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // ── Timer logic ──────────────────────────────────────────────
  const warningFiredRef = useRef(false);

  const start = () => { setTimeLeft(60); setDone(false); setRunning(true); warningFiredRef.current = false; playSound('startRecording'); };
  const stop  = () => { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const reset = () => { stop(); setTimeLeft(60); setDone(false); warningFiredRef.current = false; };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { setRunning(false); setDone(true); onChallengeComplete?.(); return 0; }
          if (t === 11 && !warningFiredRef.current) {
            warningFiredRef.current = true;
            playSound('warning');
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => {
    reset();
    stopRecording();
    setAudioURL(null);
    setRecError(null);
  }, [prompt]);

  const handleNewChallenge = () => { reset(); stopRecording(); setAudioURL(null); onNewChallenge(); };

  // ── Recorder logic ───────────────────────────────────────────
  const startRecording = async () => {
    setRecError(null);
    setAudioURL(null);
    chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecording(true);
    } catch {
      setRecError('Microphone access denied. Please allow it in your browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const togglePlay = () => {
    if (!audioURL) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioURL);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const downloadRecording = () => {
    if (!audioURL) return;
    const a = document.createElement('a');
    a.href = audioURL;
    a.download = `speaking-practice-${prompt.slice(0, 30).replace(/\s+/g, '-')}.webm`;
    a.click();
  };

  // Reset audio player when URL changes
  useEffect(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlaying(false);
  }, [audioURL]);

  // ── Visual helpers ───────────────────────────────────────────
  const pct = timeLeft / 60;
  const r = 56;
  const circumference = 2 * Math.PI * r;
  const strokeColor = timeLeft > 30 ? '#e8620a' : timeLeft > 10 ? '#f59e0b' : '#ef4444';
  const trackColor  = timeLeft > 30 ? 'rgba(232,98,10,0.10)' : timeLeft > 10 ? 'rgba(245,158,11,0.10)' : 'rgba(239,68,68,0.10)';

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-card border border-glow-orange/20"
         style={{ background: 'linear-gradient(145deg, rgba(232,98,10,0.10) 0%, rgba(192,57,43,0.06) 50%, rgba(212,160,23,0.05) 100%)' }}>

      {/* Ambient blobs */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-3xl"
           style={{ background: `radial-gradient(circle, ${strokeColor}22 0%, transparent 70%)`, transition: 'background 0.5s' }} />
      <div className="pointer-events-none absolute -top-10 -left-10 w-48 h-48 rounded-full bg-glow-gold/5 blur-2xl" />

      <div className="relative z-10 p-8 sm:p-10">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-glow-orange/40 to-transparent" />
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-glow-orange/70">✦ Main Activity ✦</span>
          <div className="h-px flex-1 bg-gradient-to-l from-glow-orange/40 to-transparent" />
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl border border-glow-orange/25 flex items-center justify-center text-2xl shrink-0"
                 style={{ background: 'rgba(232,98,10,0.12)' }}>
              🎙️
            </div>
            <div>
              <h3 className="font-display text-4xl sm:text-5xl tracking-widest text-white leading-none">Speaking Challenge</h3>
              <p className="text-white/30 text-xs font-semibold tracking-[0.2em] uppercase mt-1">1-Minute Fluency Practice</p>
            </div>
          </div>
          <button
            onClick={handleNewChallenge}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl shrink-0
                       bg-white/5 border border-white/10 text-white/50 text-xs font-semibold tracking-wide
                       hover:bg-glow-orange/10 hover:border-glow-orange/30 hover:text-glow-orange transition-all duration-200"
            title="Get a new speaking prompt"
          >
            <span className="text-sm transition-transform duration-500 group-hover:rotate-180 inline-block">🔀</span>
            <span className="hidden sm:inline">New Challenge</span>
          </button>
        </div>

        {/* Prompt dots */}
        <div className="flex items-center gap-1.5 mb-4 pl-16">
          {Array.from({ length: totalPrompts }).map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300"
                 style={{ width: i === promptIndex ? '20px' : '6px', height: '6px',
                          background: i === promptIndex ? '#e8620a' : 'rgba(255,255,255,0.12)' }} />
          ))}
          <span className="ml-2 text-[10px] text-white/20 font-semibold tracking-wider">{promptIndex + 1} / {totalPrompts}</span>
        </div>

        {/* Prompt box */}
        <div className="mt-2 mb-8 p-5 rounded-2xl border border-white/[0.07]"
             style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 mb-2">Your prompt</p>
          <p className="text-white/65 text-base sm:text-lg leading-relaxed font-light animate-fadeIn" key={prompt}>{prompt}</p>
        </div>

        {/* ── Timer + mic side by side ── */}
        <div className="flex flex-col sm:flex-row items-center gap-8">

          {/* Ring */}
          <div className={`relative shrink-0 ${running ? 'animate-timerPulse' : ''}`}>
            <svg width="148" height="148" viewBox="0 0 148 148">
              <circle cx="74" cy="74" r={r + 10} fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.12"
                style={{ transition: 'stroke 0.5s' }} />
              <circle cx="74" cy="74" r={r} fill="none" stroke={trackColor} strokeWidth="8"
                style={{ transition: 'stroke 0.5s' }} />
              <circle cx="74" cy="74" r={r} fill="none" stroke={strokeColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${pct * circumference} ${circumference}`}
                transform="rotate(-90 74 74)"
                style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s',
                         filter: `drop-shadow(0 0 10px ${strokeColor}99)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display leading-none"
                style={{ fontSize: done ? '3rem' : '3.5rem', color: strokeColor, textShadow: `0 0 20px ${strokeColor}66` }}>
                {done ? '✓' : timeLeft}
              </span>
              {!done && (
                <span className="text-white/25 text-[10px] font-semibold tracking-widest uppercase mt-1">
                  {running ? 'seconds' : 'ready'}
                </span>
              )}
            </div>
          </div>

          {/* Controls column */}
          <div className="flex flex-col gap-3 w-full sm:flex-1">

            {/* Timer buttons */}
            {!running && !done && (
              <button onClick={start}
                className="w-full px-8 py-4 bg-btn-gradient text-white rounded-2xl font-bold text-base
                           tracking-wider hover:shadow-glow-md hover:scale-105 active:scale-95
                           transition-all duration-200 shadow-glow-sm">
                ▶ Start Speaking
              </button>
            )}
            {running && (
              <button onClick={stop}
                className="w-full px-8 py-4 bg-glow-amber/90 text-cinema-black rounded-2xl font-bold text-base
                           tracking-wider hover:bg-glow-amber hover:scale-105 active:scale-95 transition-all duration-200">
                ⏸ Pause
              </button>
            )}
            {done && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
                  <span>🎉</span> Great job!
                </div>
                <p className="text-white/30 text-sm">You spoke for a full minute!</p>
                <div className="flex gap-2">
                  <button onClick={reset}
                    className="flex-1 px-4 py-3 bg-green-500/15 border border-green-500/30 text-green-400
                               rounded-2xl font-bold text-sm tracking-wider hover:bg-green-500/25 transition-all duration-200">
                    ↺ Again
                  </button>
                  <button onClick={handleNewChallenge}
                    className="flex-1 px-4 py-3 bg-glow-orange/10 border border-glow-orange/30 text-glow-orange
                               rounded-2xl font-bold text-sm tracking-wider hover:bg-glow-orange/20 transition-all duration-200">
                    🔀 Next
                  </button>
                </div>
              </div>
            )}
            {(running || (!done && timeLeft < 60)) && (
              <button onClick={reset}
                className="w-full px-8 py-3 glass text-white/35 rounded-2xl font-semibold text-sm
                           tracking-wider hover:text-white/60 transition-all duration-200">
                ↺ Reset
              </button>
            )}

            {/* Progress bar */}
            {(running || (!done && timeLeft < 60) || done) && (
              <div className="mt-1">
                <div className="flex justify-between text-[10px] text-white/25 mb-1.5 font-semibold tracking-wide uppercase">
                  <span>Progress</span><span>{Math.round((1 - pct) * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000"
                       style={{ width: `${(1 - pct) * 100}%`,
                                background: `linear-gradient(90deg, ${strokeColor}, ${strokeColor}aa)`,
                                boxShadow: `0 0 8px ${strokeColor}66` }} />
                </div>
              </div>
            )}
          </div>

          {/* ── Microphone panel ── */}
          <div className="w-full sm:w-48 flex flex-col gap-3">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 text-center">
              Voice Recorder
            </p>

            {/* Record button */}
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`relative w-full flex items-center justify-center gap-2.5 px-4 py-4 rounded-2xl
                          font-bold text-sm tracking-wide transition-all duration-200
                          ${recording
                            ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
                            : 'bg-white/5 border border-white/15 text-white/60 hover:bg-glow-orange/10 hover:border-glow-orange/40 hover:text-glow-orange'
                          }`}
            >
              {/* Pulsing dot when recording */}
              {recording && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
              <span className="text-xl">{recording ? '⏹' : '🎙️'}</span>
              {recording ? 'Stop Rec' : 'Record'}
            </button>

            {/* Playback + download — only when a recording exists */}
            {audioURL && (
              <>
                <button
                  onClick={togglePlay}
                  className={`w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl
                              font-bold text-sm tracking-wide transition-all duration-200
                              ${playing
                                ? 'bg-glow-gold/20 border border-glow-gold/40 text-glow-gold'
                                : 'bg-white/5 border border-white/15 text-white/60 hover:bg-glow-gold/10 hover:border-glow-gold/30 hover:text-glow-gold'
                              }`}
                >
                  <span className="text-lg">{playing ? '⏸' : '▶️'}</span>
                  {playing ? 'Pause' : 'Play'}
                </button>

                <button
                  onClick={downloadRecording}
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl
                             font-bold text-sm tracking-wide
                             bg-white/5 border border-white/15 text-white/60
                             hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400
                             transition-all duration-200"
                >
                  <span className="text-lg">⬇️</span>
                  Download
                </button>

                <p className="text-center text-[10px] text-white/20 font-medium">Recording saved ✓</p>
              </>
            )}

            {/* Permission error */}
            {recError && (
              <p className="text-red-400/70 text-[11px] text-center leading-relaxed">{recError}</p>
            )}
          </div>
        </div>

        {/* Tips */}
        {!running && !done && (
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: '💬', tip: 'Speak naturally' },
              { icon: '🔁', tip: 'Use the particle' },
              { icon: '📖', tip: 'Give examples' },
            ].map(({ icon, tip }) => (
              <div key={tip} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/[0.05]"
                   style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-xl">{icon}</span>
                <span className="text-white/30 text-[11px] font-medium text-center">{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
