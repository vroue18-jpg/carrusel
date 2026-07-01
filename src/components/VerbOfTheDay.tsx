import React, { useState, useEffect, useRef } from 'react';
import { PARTICLES } from '../data/particles';
import { playSound } from '../utils/sounds';

const RECORDER_MIME_CANDIDATES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
const getSupportedMimeType = () =>
  RECORDER_MIME_CANDIDATES.find((type) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(type));

function getVerbOfTheDay() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const all = PARTICLES.flatMap((p) =>
    p.phrasalVerbs.map((v) => ({ ...v, particle: p.particle, emoji: p.emoji }))
  );
  const entry = all[dayOfYear % all.length];
  const prompt = `Use the phrasal verb "${entry.verb}" in conversation. Talk for 1 minute — give examples from your life, explain its meaning, or describe situations where people use it.`;
  return { ...entry, prompt };
}

const verb = getVerbOfTheDay();

interface Props {
  onChallengeComplete?: () => void;
}

export const VerbOfTheDay: React.FC<Props> = ({ onChallengeComplete }) => {
  const [open, setOpen] = useState(false);

  // ── Timer ──────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningRef = useRef(false);

  const startTimer = () => { setTimeLeft(60); setDone(false); setRunning(true); warningRef.current = false; playSound('startRecording'); };
  const stopTimer  = () => { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const resetTimer = () => { stopTimer(); setTimeLeft(60); setDone(false); warningRef.current = false; };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { setRunning(false); setDone(true); onChallengeComplete?.(); return 0; }
          if (t === 11 && !warningRef.current) { warningRef.current = true; playSound('warning'); }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  // ── Recorder ──────────────────────────────────────────────────
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recError, setRecError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRec = async () => {
    setRecError(null); setAudioURL(null); chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mrRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { setAudioURL(URL.createObjectURL(new Blob(chunksRef.current, { type: mr.mimeType || mimeType || 'audio/webm' }))); stream.getTracks().forEach((t) => t.stop()); };
      mr.start(); setRecording(true);
    } catch { setRecError('Microphone blocked — allow it in your browser settings.'); }
  };

  const stopRec = () => { if (mrRef.current && mrRef.current.state !== 'inactive') mrRef.current.stop(); setRecording(false); };

  const togglePlay = () => {
    if (!audioURL) return;
    if (!audioRef.current) { audioRef.current = new Audio(audioURL); audioRef.current.onended = () => setPlaying(false); }
    if (playing) { audioRef.current.pause(); audioRef.current.currentTime = 0; setPlaying(false); }
    else {
      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(() => setRecError("Couldn't play the recording. Try downloading it instead."));
    }
  };

  const download = () => {
    if (!audioURL) return;
    const a = document.createElement('a'); a.href = audioURL;
    a.download = `${verb.verb.toLowerCase().replace(/\s+/g, '-')}-practice.webm`; a.click();
  };

  useEffect(() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setPlaying(false); }, [audioURL]);

  // ── Visual ────────────────────────────────────────────────────
  const pct = timeLeft / 60;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const strokeColor = timeLeft > 30 ? '#e8620a' : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative overflow-hidden rounded-3xl border border-glow-gold/25 shadow-card animate-fadeIn"
         style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.12) 0%, rgba(232,98,10,0.10) 50%, rgba(192,57,43,0.07) 100%)' }}>

      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-glow-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-glow-orange/8 blur-2xl" />

      <div className="relative z-10 p-6 sm:p-8">

        {/* Label row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-glow-gold/80">Phrasal Verb of the Day</span>
          </div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-white/20">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Verb info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
          <div className="shrink-0">
            <div className="flex items-end gap-3 leading-none">
              <span className="font-display text-5xl sm:text-6xl tracking-widest text-white">{verb.verb}</span>
              <span className="mb-1 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase border"
                    style={{ background: 'rgba(212,160,23,0.15)', borderColor: 'rgba(212,160,23,0.35)', color: '#d4a017' }}>
                {verb.emoji} {verb.particle}
              </span>
            </div>
            <p className="text-white/50 text-sm font-medium mt-2">{verb.meaning}</p>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-white/65 text-sm sm:text-base leading-relaxed font-light italic">"{verb.example}"</p>
            <button
              onClick={() => setOpen((o) => !o)}
              className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm
                         border border-glow-gold/35 text-glow-gold
                         hover:bg-glow-gold/15 hover:border-glow-gold/60 hover:shadow-[0_0_16px_rgba(212,160,23,0.25)]
                         transition-all duration-200"
              style={{ background: 'rgba(212,160,23,0.08)' }}
            >
              <span>🎙️</span>
              {open ? 'Hide challenge' : 'Practice it now'}
            </button>
          </div>
        </div>

        {/* Inline speaking challenge */}
        {open && (
          <div className="animate-fadeIn">

            {/* Prompt */}
            <div className="mb-5 p-4 rounded-2xl border border-white/[0.07]" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 mb-1.5">Your prompt</p>
              <p className="text-white/65 text-sm leading-relaxed font-light">{verb.prompt}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">

              {/* Mini ring timer */}
              <div className={`relative shrink-0 ${running ? 'animate-timerPulse' : ''}`}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
                  <circle cx="40" cy="40" r={r} fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${pct * circ} ${circ}`} transform="rotate(-90 40 40)"
                    style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s', filter: `drop-shadow(0 0 6px ${strokeColor}99)` }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display leading-none" style={{ fontSize: '1.4rem', color: strokeColor }}>
                    {done ? '✓' : timeLeft}
                  </span>
                </div>
              </div>

              {/* Timer controls */}
              <div className="flex flex-col gap-2.5 flex-1 w-full">
                {!running && !done && (
                  <button onClick={startTimer}
                    className="w-full px-6 py-3 bg-btn-gradient text-white rounded-2xl font-bold text-sm tracking-wider
                               hover:shadow-glow-md hover:scale-105 active:scale-95 transition-all duration-200 shadow-glow-sm">
                    ▶ Start Speaking
                  </button>
                )}
                {running && (
                  <button onClick={stopTimer}
                    className="w-full px-6 py-3 bg-glow-amber/90 text-cinema-black rounded-2xl font-bold text-sm
                               tracking-wider hover:scale-105 active:scale-95 transition-all duration-200">
                    ⏸ Pause
                  </button>
                )}
                {done && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-green-400 font-bold">🎉 Great job!</div>
                    <button onClick={resetTimer}
                      className="w-full px-4 py-2.5 bg-green-500/15 border border-green-500/30 text-green-400
                                 rounded-2xl font-bold text-sm tracking-wider hover:bg-green-500/25 transition-all duration-200">
                      ↺ Again
                    </button>
                  </div>
                )}
                {(running || (!done && timeLeft < 60)) && (
                  <button onClick={resetTimer}
                    className="w-full px-6 py-2.5 glass text-white/35 rounded-2xl font-semibold text-sm
                               tracking-wider hover:text-white/60 transition-all duration-200">
                    ↺ Reset
                  </button>
                )}
              </div>

              {/* Recorder */}
              <div className="w-full sm:w-40 flex flex-col gap-2.5">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 text-center">Voice Recorder</p>
                <button onClick={recording ? stopRec : startRec}
                  className={`relative w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200
                    ${recording ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-white/5 border border-white/15 text-white/60 hover:bg-glow-orange/10 hover:border-glow-orange/40 hover:text-glow-orange'}`}>
                  {recording && <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                  <span>{recording ? '⏹' : '🎙️'}</span>
                  {recording ? 'Stop' : 'Record'}
                </button>
                {audioURL && (
                  <>
                    <button onClick={togglePlay}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200
                        ${playing ? 'bg-glow-gold/20 border border-glow-gold/40 text-glow-gold' : 'bg-white/5 border border-white/15 text-white/60 hover:bg-glow-gold/10 hover:border-glow-gold/30 hover:text-glow-gold'}`}>
                      <span>{playing ? '⏸' : '▶️'}</span>{playing ? 'Pause' : 'Play'}
                    </button>
                    <button onClick={download}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm tracking-wide
                                 bg-white/5 border border-white/15 text-white/60 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400 transition-all duration-200">
                      <span>⬇️</span>Download
                    </button>
                  </>
                )}
                {recError && <p className="text-red-400/70 text-[11px] text-center leading-relaxed">{recError}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
