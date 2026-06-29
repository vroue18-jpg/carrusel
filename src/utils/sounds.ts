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

// Coin jingle — two or three quick metallic pings staggered
const buildLeverPull = (c: AudioContext) => {
  // Metallic ping = sine + slight detuned overtone, fast attack, slow decay
  const pings = [
    { freq: 2100, detune: 2180, delay: 0,    vol: 0.18 },
    { freq: 1760, detune: 1830, delay: 0.07, vol: 0.15 },
    { freq: 2400, detune: 2500, delay: 0.13, vol: 0.12 },
  ];

  pings.forEach(({ freq, detune, delay, vol }) => {
    // Fundamental
    const o1 = c.createOscillator();
    const g1 = c.createGain();
    o1.connect(g1); g1.connect(c.destination);
    o1.type = 'sine';
    o1.frequency.value = freq;
    g1.gain.setValueAtTime(0.0001, c.currentTime + delay);
    g1.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.008);
    g1.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.55);
    o1.start(c.currentTime + delay); o1.stop(c.currentTime + delay + 0.58);

    // Detuned overtone for metallic shimmer
    const o2 = c.createOscillator();
    const g2 = c.createGain();
    o2.connect(g2); g2.connect(c.destination);
    o2.type = 'sine';
    o2.frequency.value = detune;
    g2.gain.setValueAtTime(0.0001, c.currentTime + delay);
    g2.gain.linearRampToValueAtTime(vol * 0.4, c.currentTime + delay + 0.008);
    g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.35);
    o2.start(c.currentTime + delay); o2.stop(c.currentTime + delay + 0.38);
  });
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

export type SoundType = 'particleClick' | 'startRecording' | 'warning' | 'diceRoll' | 'slotTick' | 'slotLand' | 'leverPull';

export const playSound = (type: SoundType) => {
  if (type === 'particleClick') play(buildClick);
  else if (type === 'startRecording') play(buildChime);
  else if (type === 'warning') play(buildBeeps);
  else if (type === 'diceRoll') play(buildDiceRoll);
  else if (type === 'slotTick') play(buildSlotTick);
  else if (type === 'slotLand') play(buildSlotLand);
  else if (type === 'leverPull') play(buildLeverPull);
};
