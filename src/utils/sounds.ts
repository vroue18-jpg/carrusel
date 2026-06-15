// All sounds generated via Web Audio API — no external files needed

type W = typeof window & { _audioCtx?: AudioContext; _audioReady?: boolean };

const getCtx = (): AudioContext => {
  const w = window as W;
  if (!w._audioCtx) w._audioCtx = new AudioContext();
  return w._audioCtx;
};

// Play a silent 1-frame buffer — this is the only reliable way to fully
// unlock Web Audio on iOS Safari/Chrome so sounds work even from timers.
const playSilentBuffer = (c: AudioContext) => {
  const buf = c.createBuffer(1, 1, 22050);
  const src = c.createBufferSource();
  src.buffer = buf;
  src.connect(c.destination);
  src.start(0);
  (window as W)._audioReady = true;
};

// Wire unlock to first user interaction
if (typeof window !== 'undefined') {
  const unlock = () => {
    if ((window as W)._audioReady) return;
    const c = getCtx();
    const doUnlock = () => playSilentBuffer(c);
    if (c.state === 'suspended') {
      c.resume().then(doUnlock).catch(() => {});
    } else {
      doUnlock();
    }
    ['touchstart', 'touchend', 'mousedown', 'click'].forEach((e) =>
      document.removeEventListener(e, unlock, true)
    );
  };
  ['touchstart', 'touchend', 'mousedown', 'click'].forEach((e) =>
    document.addEventListener(e, unlock, true)
  );
}

const play = (buildFn: (c: AudioContext) => void) => {
  try {
    const c = getCtx();
    if (c.state === 'suspended') {
      c.resume().then(() => buildFn(c)).catch(() => {});
    } else {
      buildFn(c);
    }
  } catch { /* silently fail */ }
};

const buildClick = (c: AudioContext) => {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain); gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.08);
  gain.gain.setValueAtTime(0.18, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
  osc.start(c.currentTime); osc.stop(c.currentTime + 0.12);
};

const buildChime = (c: AudioContext) => {
  [0, 0.1].forEach((delay, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(i === 0 ? 440 : 550, c.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, c.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.14, c.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.25);
    osc.start(c.currentTime + delay); osc.stop(c.currentTime + delay + 0.28);
  });
};

const buildDiceRoll = (c: AudioContext) => {
  // Rapid random clicks simulating dice tumbling
  const clicks = 10;
  for (let i = 0; i < clicks; i++) {
    const delay = i * 0.055;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200 + Math.random() * 400, c.currentTime + delay);
    gain.gain.setValueAtTime(0.12, c.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.04);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + 0.05);
  }
  // Final "landing" thud
  const thud = c.createOscillator();
  const thudGain = c.createGain();
  thud.connect(thudGain); thudGain.connect(c.destination);
  thud.type = 'sine';
  thud.frequency.setValueAtTime(120, c.currentTime + 0.58);
  thud.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.68);
  thudGain.gain.setValueAtTime(0.22, c.currentTime + 0.58);
  thudGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.68);
  thud.start(c.currentTime + 0.58);
  thud.stop(c.currentTime + 0.7);
};

const buildBeeps = (c: AudioContext) => {
  [0, 0.18, 0.36].forEach((delay) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain); gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, c.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, c.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.12, c.currentTime + delay + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.14);
    osc.start(c.currentTime + delay); osc.stop(c.currentTime + delay + 0.16);
  });
};

export type SoundType = 'particleClick' | 'startRecording' | 'warning' | 'diceRoll';

export const playSound = (type: SoundType) => {
  if (type === 'particleClick') play(buildClick);
  else if (type === 'startRecording') play(buildChime);
  else if (type === 'warning') play(buildBeeps);
  else if (type === 'diceRoll') play(buildDiceRoll);
};
