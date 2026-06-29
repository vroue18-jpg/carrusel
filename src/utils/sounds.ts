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
  const duration = 0.6;
  const sampleRate = c.sampleRate;

  // White noise buffer — sounds like dice rattling in a cup
  const bufLen = Math.floor(sampleRate * duration);
  const buf = c.createBuffer(1, bufLen, sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1);

  const src = c.createBufferSource();
  src.buffer = buf;

  // Bandpass filter to make it sound woody/rattly rather than hissy
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, c.currentTime);
  filter.Q.value = 1.2;

  // Gain envelope: shake bursts that fade out toward the end
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.35, c.currentTime + 0.05);
  gain.gain.setValueAtTime(0.35, c.currentTime + 0.05);
  // Pulsing shake effect
  gain.gain.linearRampToValueAtTime(0.15, c.currentTime + 0.15);
  gain.gain.linearRampToValueAtTime(0.32, c.currentTime + 0.25);
  gain.gain.linearRampToValueAtTime(0.10, c.currentTime + 0.35);
  gain.gain.linearRampToValueAtTime(0.25, c.currentTime + 0.45);
  gain.gain.linearRampToValueAtTime(0.001, c.currentTime + duration);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start(c.currentTime);
  src.stop(c.currentTime + duration);

  // Final soft thud when dice land
  const thud = c.createOscillator();
  const thudGain = c.createGain();
  thud.connect(thudGain); thudGain.connect(c.destination);
  thud.type = 'sine';
  thud.frequency.setValueAtTime(90, c.currentTime + duration);
  thud.frequency.exponentialRampToValueAtTime(45, c.currentTime + duration + 0.1);
  thudGain.gain.setValueAtTime(0.18, c.currentTime + duration);
  thudGain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration + 0.12);
  thud.start(c.currentTime + duration);
  thud.stop(c.currentTime + duration + 0.15);
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

// Whoosh of wind — filtered noise that sweeps down in pitch
const buildSlotTick = (c: AudioContext) => {
  const bufLen = Math.floor(c.sampleRate * 0.08);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, c.currentTime);
  filter.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.08);
  filter.Q.value = 2;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.12, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
  src.connect(filter); filter.connect(gain); gain.connect(c.destination);
  src.start(); src.stop(c.currentTime + 0.09);
};

// Whoosh + Bell — air rush that resolves into a bright bell
const buildLeverPull = (c: AudioContext) => {
  const t = c.currentTime;
  // Whoosh
  const wLen = Math.floor(c.sampleRate * 0.35);
  const wBuf = c.createBuffer(1, wLen, c.sampleRate);
  const wd = wBuf.getChannelData(0);
  for (let i = 0; i < wLen; i++) wd[i] = Math.random() * 2 - 1;
  const wSrc = c.createBufferSource(); wSrc.buffer = wBuf;
  const wF = c.createBiquadFilter(); wF.type = 'bandpass';
  wF.frequency.setValueAtTime(400, t);
  wF.frequency.exponentialRampToValueAtTime(2200, t + 0.18);
  wF.frequency.exponentialRampToValueAtTime(600, t + 0.35);
  wF.Q.value = 2;
  const wG = c.createGain();
  wG.gain.setValueAtTime(0.0001, t);
  wG.gain.linearRampToValueAtTime(0.22, t + 0.08);
  wG.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  wSrc.connect(wF); wF.connect(wG); wG.connect(c.destination);
  wSrc.start(t); wSrc.stop(t + 0.37);
  // Bell
  const bell = c.createOscillator(); const bg = c.createGain();
  bell.connect(bg); bg.connect(c.destination);
  bell.type = 'sine'; bell.frequency.value = 1046;
  bg.gain.setValueAtTime(0.0001, t + 0.3);
  bg.gain.linearRampToValueAtTime(0.25, t + 0.308);
  bg.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
  bell.start(t + 0.3); bell.stop(t + 1.15);
  // Bell overtone
  const b2 = c.createOscillator(); const b2g = c.createGain();
  b2.connect(b2g); b2g.connect(c.destination);
  b2.type = 'sine'; b2.frequency.value = 2637;
  b2g.gain.setValueAtTime(0.0001, t + 0.3);
  b2g.gain.linearRampToValueAtTime(0.09, t + 0.308);
  b2g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
  b2.start(t + 0.3); b2.stop(t + 0.75);
};

// Space Swipe — laser whoosh landing on a deep thud (for challenge/mini lever)
const buildSpaceSwipe = (c: AudioContext) => {
  const t = c.currentTime;
  const wLen = Math.floor(c.sampleRate * 0.4);
  const wBuf = c.createBuffer(1, wLen, c.sampleRate);
  const wd = wBuf.getChannelData(0);
  for (let i = 0; i < wLen; i++) wd[i] = Math.random() * 2 - 1;
  const wSrc = c.createBufferSource(); wSrc.buffer = wBuf;
  const wF = c.createBiquadFilter(); wF.type = 'bandpass';
  wF.frequency.setValueAtTime(3000, t);
  wF.frequency.exponentialRampToValueAtTime(150, t + 0.4);
  wF.Q.value = 3;
  const wG = c.createGain();
  wG.gain.setValueAtTime(0.0001, t);
  wG.gain.linearRampToValueAtTime(0.3, t + 0.05);
  wG.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  wSrc.connect(wF); wF.connect(wG); wG.connect(c.destination);
  wSrc.start(t); wSrc.stop(t + 0.42);
  // Deep thud
  const sub = c.createOscillator(); const sg = c.createGain();
  sub.connect(sg); sg.connect(c.destination);
  sub.type = 'sine'; sub.frequency.setValueAtTime(80, t + 0.35);
  sub.frequency.exponentialRampToValueAtTime(30, t + 0.55);
  sg.gain.setValueAtTime(0.4, t + 0.35);
  sg.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  sub.start(t + 0.35); sub.stop(t + 0.65);
};

// Hard mechanical clunk when drum locks in place
const buildSlotLand = (c: AudioContext) => {
  // Noise clunk
  const bufLen = Math.floor(c.sampleRate * 0.12);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(500, c.currentTime);
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.35, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
  src.connect(filter); filter.connect(gain); gain.connect(c.destination);
  src.start(); src.stop(c.currentTime + 0.13);

  // Sub-bass punch underneath
  const sub = c.createOscillator();
  const sg = c.createGain();
  sub.connect(sg); sg.connect(c.destination);
  sub.type = 'sine';
  sub.frequency.setValueAtTime(60, c.currentTime);
  sub.frequency.exponentialRampToValueAtTime(30, c.currentTime + 0.1);
  sg.gain.setValueAtTime(0.3, c.currentTime);
  sg.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
  sub.start(c.currentTime); sub.stop(c.currentTime + 0.13);
};

export type SoundType = 'particleClick' | 'startRecording' | 'warning' | 'diceRoll' | 'slotTick' | 'slotLand' | 'leverPull' | 'spaceSwipe';

export const playSound = (type: SoundType) => {
  if (type === 'particleClick') play(buildClick);
  else if (type === 'startRecording') play(buildChime);
  else if (type === 'warning') play(buildBeeps);
  else if (type === 'diceRoll') play(buildDiceRoll);
  else if (type === 'slotTick') play(buildSlotTick);
  else if (type === 'slotLand') play(buildSlotLand);
  else if (type === 'leverPull') play(buildLeverPull);
  else if (type === 'spaceSwipe') play(buildSpaceSwipe);
};
