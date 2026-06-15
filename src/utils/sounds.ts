// All sounds generated via Web Audio API — no external files needed

type W = typeof window & { _audioCtx?: AudioContext; _audioUnlocked?: boolean };

const getCtx = (): AudioContext => {
  const w = window as W;
  if (!w._audioCtx) w._audioCtx = new AudioContext();
  return w._audioCtx;
};

// iOS Safari requires creating + resuming AudioContext AND playing a silent
// buffer synchronously inside a user-gesture handler to fully unlock audio.
const playSilentBuffer = (c: AudioContext) => {
  const buf = c.createBuffer(1, 1, 22050);
  const src = c.createBufferSource();
  src.buffer = buf;
  src.connect(c.destination);
  src.start(0);
};

if (typeof window !== 'undefined') {
  const unlock = () => {
    const w = window as W;
    if (w._audioUnlocked) return;
    const c = getCtx();
    if (c.state === 'suspended') {
      c.resume().then(() => playSilentBuffer(c));
    } else {
      playSilentBuffer(c);
    }
    w._audioUnlocked = true;
    ['touchstart', 'touchend', 'mousedown', 'keydown'].forEach((ev) =>
      window.removeEventListener(ev, unlock, true)
    );
  };
  ['touchstart', 'touchend', 'mousedown', 'keydown'].forEach((ev) =>
    window.addEventListener(ev, unlock, true)
  );
}

const resume = async () => {
  const c = getCtx();
  if (c.state === 'suspended') await c.resume();
};

// Short satisfying pop/click — particle selection
const playParticleClick = () => {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.08);
  gain.gain.setValueAtTime(0.18, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.12);
};

// Gentle rising tone — start speaking
const playStartRecording = () => {
  const c = getCtx();
  [0, 0.1].forEach((delay, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    const freq = i === 0 ? 440 : 550;
    osc.frequency.setValueAtTime(freq, c.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, c.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.14, c.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.25);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + 0.28);
  });
};

// Soft triple beep — 10-second warning
const playWarning = () => {
  const c = getCtx();
  [0, 0.18, 0.36].forEach((delay) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, c.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, c.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.12, c.currentTime + delay + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.14);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + 0.16);
  });
};

export type SoundType = 'particleClick' | 'startRecording' | 'warning';

export const playSound = async (type: SoundType) => {
  try {
    await resume();
    if (type === 'particleClick') playParticleClick();
    else if (type === 'startRecording') playStartRecording();
    else if (type === 'warning') playWarning();
  } catch {
    // Silently fail if audio is blocked
  }
};
