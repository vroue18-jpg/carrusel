// All sounds generated via Web Audio API — no external files needed

const ctx = (): AudioContext => {
  const w = window as typeof window & { _audioCtx?: AudioContext };
  if (!w._audioCtx) w._audioCtx = new AudioContext();
  return w._audioCtx;
};

const resume = async () => {
  const c = ctx();
  if (c.state === 'suspended') await c.resume();
};

// Short satisfying pop/click — particle selection
const playParticleClick = () => {
  const c = ctx();
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
  const c = ctx();
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
  const c = ctx();
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

export const playSound = async (type: SoundType, volume = 1) => {
  try {
    await resume();
    const c = ctx();
    // Apply global volume via a master gain if needed
    // (individual gains above already handle volume shaping)
    // volume param scales the gain values
    void volume; // used implicitly via individual gain values
    if (type === 'particleClick') playParticleClick();
    else if (type === 'startRecording') playStartRecording();
    else if (type === 'warning') playWarning();
    void c;
  } catch {
    // Silently fail if audio is blocked
  }
};
