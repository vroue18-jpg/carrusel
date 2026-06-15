// All sounds generated via Web Audio API — no external files needed

type W = typeof window & { _audioCtx?: AudioContext };

// Create AudioContext lazily but always reuse the same one
const getCtx = (): AudioContext => {
  const w = window as W;
  if (!w._audioCtx) w._audioCtx = new AudioContext();
  return w._audioCtx;
};

// Must be called synchronously inside a user gesture (click/touch) to unlock iOS
const unlockAndPlay = (playFn: (c: AudioContext) => void) => {
  const c = getCtx();
  if (c.state === 'suspended') {
    // Resume then play — on iOS this must be triggered by the gesture
    c.resume().then(() => playFn(c)).catch(() => {});
  } else {
    playFn(c);
  }
};

// Short satisfying pop/click — particle selection
const buildParticleClick = (c: AudioContext) => {
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

// Gentle rising two-note chime — start speaking
const buildStartRecording = (c: AudioContext) => {
  [0, 0.1].forEach((delay, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(i === 0 ? 440 : 550, c.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, c.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.14, c.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.25);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + 0.28);
  });
};

// Soft triple beep — 10-second warning
const buildWarning = (c: AudioContext) => {
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

// Call this synchronously inside a click/touch handler — do NOT await before calling
export const playSound = (type: SoundType) => {
  try {
    const fn =
      type === 'particleClick' ? buildParticleClick :
      type === 'startRecording' ? buildStartRecording :
      buildWarning;
    unlockAndPlay(fn);
  } catch {
    // Silently fail
  }
};
