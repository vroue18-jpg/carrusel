import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/sounds';

interface AccentColor { glow: string; bg: string; border: string; text: string }

const MiniLever: React.FC<{ color: AccentColor; shuffling: boolean; onClick: () => void }> = ({ color: c, shuffling, onClick }) => {
  const [pulled, setPulled] = useState(false);

  const handleClick = () => {
    if (shuffling || pulled) return;
    setPulled(true);
    playSound('spaceSwipe');
    onClick();
    setTimeout(() => setPulled(false), 500);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-1 select-none" style={{ width: '44px' }}>
      <span className="text-[8px] font-semibold tracking-widest uppercase text-center leading-tight"
            style={{ color: c.text, opacity: shuffling ? 0.3 : 0.6 }}>
        {shuffling ? '…' : 'new'}
      </span>
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={handleClick}
        style={{ opacity: shuffling ? 0.4 : 1 }}
      >
        {/* Knob */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${c.text}, ${c.glow})`,
            boxShadow: pulled ? `0 2px 6px ${c.glow}40` : `0 4px 14px ${c.glow}70`,
            transform: pulled ? 'translateY(50px)' : 'translateY(0)',
            transition: pulled
              ? 'transform 0.11s cubic-bezier(0.4,0,1,1)'
              : 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          🔀
        </div>
        {/* Shaft */}
        <div className="w-1.5 rounded-full"
          style={{
            height: pulled ? '20px' : '60px',
            background: `linear-gradient(to bottom, ${c.text}cc, ${c.glow}33)`,
            transition: pulled
              ? 'height 0.11s cubic-bezier(0.4,0,1,1)'
              : 'height 0.32s cubic-bezier(0.34,1.56,0.64,1)',
            marginTop: '-1px',
          }}
        />
        {/* Base */}
        <div className="w-6 h-2.5 rounded-full"
          style={{ background: `linear-gradient(to bottom, ${c.text}77, ${c.glow}11)`, boxShadow: `0 0 8px ${c.glow}40` }} />
      </div>
    </div>
  );
};

interface Props {
  prompt: string;
  promptIndex: number;
  totalPrompts: number;
  onNewChallenge: () => void;
  onChallengeComplete?: () => void;
  accentColor?: AccentColor;
}

const DEFAULT_COLOR: AccentColor = {
  glow: '#e8620a', bg: 'rgba(232,98,10,0.15)', border: 'rgba(232,98,10,0.35)', text: '#e8620a',
};

export const SpeakingTimer: React.FC<Props> = ({
  prompt, promptIndex, totalPrompts, onNewChallenge, onChallengeComplete, accentColor,
}) => {
  const c = accentColor ?? DEFAULT_COLOR;

  const [shuffling, setShuffling] = useState(false);
  const [timeLeft, setTimeLeft]   = useState(60);
  const [running, setRunning]     = useState(false);
  const [done, setDone]           = useState(false);
  const intervalRef               = useRef<ReturnType<typeof setInterval> | null>(null);
  const warningFiredRef           = useRef(false);

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL]   = useState<string | null>(null);
  const [recError, setRecError]   = useState<string | null>(null);
  const [playing, setPlaying]     = useState(false);
  const mediaRecorderRef          = useRef<MediaRecorder | null>(null);
  const chunksRef                 = useRef<Blob[]>([]);
  const audioRef                  = useRef<HTMLAudioElement | null>(null);

  const start = () => { setTimeLeft(60); setDone(false); setRunning(true); warningFiredRef.current = false; playSound('startRecording'); };
  const stop  = () => { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); };
  const reset = () => { stop(); setTimeLeft(60); setDone(false); warningFiredRef.current = false; };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { setRunning(false); setDone(true); onChallengeComplete?.(); return 0; }
          if (t === 11 && !warningFiredRef.current) { warningFiredRef.current = true; playSound('warning'); }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => { reset(); stopRecording(); setAudioURL(null); setRecError(null); }, [prompt]);
  useEffect(() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setPlaying(false); }, [audioURL]);

  const handleNewChallenge = () => {
    if (shuffling) return;
    setShuffling(true);
    setTimeout(() => { reset(); stopRecording(); setAudioURL(null); onNewChallenge(); }, 220);
    setTimeout(() => setShuffling(false), 600);
  };

  const startRecording = async () => {
    setRecError(null); setAudioURL(null); chunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => { setAudioURL(URL.createObjectURL(new Blob(chunksRef.current, { type: 'audio/webm' }))); stream.getTracks().forEach(t => t.stop()); };
      mr.start(); setRecording(true);
    } catch { setRecError('Microphone access denied.'); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const togglePlay = () => {
    if (!audioURL) return;
    if (!audioRef.current) { audioRef.current = new Audio(audioURL); audioRef.current.onended = () => setPlaying(false); }
    if (playing) { audioRef.current.pause(); audioRef.current.currentTime = 0; setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const downloadRecording = () => {
    if (!audioURL) return;
    const a = document.createElement('a'); a.href = audioURL;
    a.download = `speaking-${prompt.slice(0, 30).replace(/\s+/g, '-')}.webm`; a.click();
  };

  // Timer ring
  const pct = timeLeft / 60;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const ringColor = done ? c.text : timeLeft > 30 ? c.text : timeLeft > 10 ? '#f59e0b' : '#ef4444';

  return (
    <div
      className="relative overflow-hidden rounded-3xl shadow-card transition-all duration-700"
      style={{ border: `1px solid ${c.border}`, background: `linear-gradient(145deg, ${c.bg} 0%, rgba(0,0,0,0.6) 60%)` }}
    >
      {/* Ambient glow blob */}
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${c.glow}25 0%, transparent 70%)` }}
      />

      <div className="relative z-10 p-7 sm:p-9 space-y-6">

        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-all duration-700"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              🎙️
            </div>
            <div>
              <p className="font-display text-2xl tracking-widest text-white/90 leading-none">Speaking Challenge</p>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mt-0.5" style={{ color: c.text, opacity: 0.7 }}>
                1-minute fluency practice
              </p>
            </div>
          </div>

        </div>

        {/* Prompt card + mini lever side by side */}
        <div className="flex items-stretch gap-3">

          {/* Prompt card */}
          <div
            className="flex-1 relative rounded-2xl p-6 transition-all duration-300"
            style={{
              background: 'rgba(0,0,0,0.35)',
              border: `1px solid ${c.border}`,
              opacity: shuffling ? 0 : 1,
              transform: shuffling ? 'translateY(-8px) scale(0.98)' : 'translateY(0) scale(1)',
            }}
          >
            {/* Dot nav */}
            <div className="flex items-center gap-1.5 mb-4">
              {Array.from({ length: totalPrompts }).map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-300"
                     style={{ width: i === promptIndex ? '18px' : '5px', height: '5px',
                              background: i === promptIndex ? c.text : 'rgba(255,255,255,0.15)' }} />
              ))}
              <span className="ml-2 text-[10px] text-white/25 font-semibold tracking-wider">{promptIndex + 1}/{totalPrompts}</span>
            </div>
            <p
              className="text-white/90 text-xl sm:text-2xl leading-snug font-light animate-fadeIn"
              key={prompt}
              style={{ borderLeft: `3px solid ${c.text}`, paddingLeft: '1rem' }}
            >
              {prompt}
            </p>
          </div>

          {/* Mini lever for new question */}
          <MiniLever color={c} shuffling={shuffling} onClick={handleNewChallenge} />
        </div>

        {/* Timer + controls row */}
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* Ring timer */}
          <div className={`relative shrink-0 ${running ? 'animate-timerPulse' : ''}`}>
            <svg width="132" height="132" viewBox="0 0 132 132">
              <circle cx="66" cy="66" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
              <circle cx="66" cy="66" r={r} fill="none" stroke={ringColor} strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${pct * circ} ${circ}`} transform="rotate(-90 66 66)"
                style={{ transition: 'stroke-dasharray 1s linear, stroke 0.5s', filter: `drop-shadow(0 0 8px ${ringColor}99)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display leading-none" style={{ fontSize: done ? '2.8rem' : '3.2rem', color: ringColor, textShadow: `0 0 16px ${ringColor}66` }}>
                {done ? '✓' : timeLeft}
              </span>
              {!done && <span className="text-white/25 text-[9px] font-semibold tracking-widest uppercase mt-0.5">{running ? 'sec' : 'ready'}</span>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 w-full sm:flex-1">

            {!running && !done && (
              <button onClick={start}
                className="w-full px-6 py-4 rounded-2xl font-bold text-base tracking-wider text-white
                           hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${c.glow}, ${c.glow}88)`, boxShadow: `0 4px 24px ${c.glow}40` }}
              >
                ▶ Start Speaking
              </button>
            )}
            {running && (
              <button onClick={stop}
                className="w-full px-6 py-4 bg-amber-500/90 text-black rounded-2xl font-bold text-base
                           tracking-wider hover:bg-amber-400 hover:scale-[1.02] active:scale-95 transition-all duration-200">
                ⏸ Pause
              </button>
            )}
            {done && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-lg" style={{ color: c.text }}>
                  <span>🎉</span> Great job! You spoke for a full minute!
                </div>
                <div className="flex gap-2">
                  <button onClick={reset}
                    className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm tracking-wider transition-all duration-200"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
                    ↺ Again
                  </button>
                  <button onClick={handleNewChallenge}
                    className="flex-1 px-4 py-3 rounded-2xl font-bold text-sm tracking-wider transition-all duration-200 bg-white/5 border border-white/10 text-white/60 hover:text-white">
                    🔀 New Question
                  </button>
                </div>
              </div>
            )}
            {(running || (!done && timeLeft < 60)) && (
              <button onClick={reset}
                className="w-full px-6 py-3 glass text-white/30 rounded-2xl font-semibold text-sm tracking-wider hover:text-white/60 transition-all duration-200">
                ↺ Reset
              </button>
            )}

            {/* Progress bar */}
            {(running || timeLeft < 60 || done) && (
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                     style={{ width: `${(1 - pct) * 100}%`, background: `linear-gradient(90deg, ${ringColor}, ${ringColor}88)`, boxShadow: `0 0 8px ${ringColor}66` }} />
              </div>
            )}
          </div>

          {/* Record column */}
          <div className="w-full sm:w-44 flex flex-col gap-2.5">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-center" style={{ color: c.text, opacity: 0.5 }}>
              Voice Recorder
            </p>
            <button
              onClick={recording ? stopRecording : () => { start(); startRecording(); }}
              className="relative w-full flex items-center justify-center gap-2 px-4 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all duration-200"
              style={recording
                ? { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }
                : { background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
            >
              {recording && <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              <span className="text-xl">{recording ? '⏹' : '🎙️'}</span>
              {recording ? 'Stop' : 'Record'}
            </button>

            {audioURL && (
              <>
                <button onClick={togglePlay}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200"
                  style={playing
                    ? { background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.35)', color: '#d4a017' }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                >
                  <span>{playing ? '⏸' : '▶️'}</span> {playing ? 'Pause' : 'Play'}
                </button>
                <button onClick={downloadRecording}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm bg-white/5 border border-white/10 text-white/40 hover:text-green-400 hover:border-green-500/30 transition-all duration-200">
                  <span>⬇️</span> Save
                </button>
              </>
            )}
            {recError && <p className="text-red-400/70 text-[11px] text-center">{recError}</p>}
          </div>
        </div>

        {/* Tips — only when idle */}
        {!running && !done && (
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[{ icon: '💬', tip: 'Speak naturally' }, { icon: '🔁', tip: 'Use the particle' }, { icon: '📖', tip: 'Give examples' }].map(({ icon, tip }) => (
              <div key={tip}
                   className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-700"
                   style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <span className="text-lg">{icon}</span>
                <span className="text-white/40 text-[11px] font-medium text-center">{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
