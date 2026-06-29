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

// Luxury mechanical lock: insertion click → rotation scrape → latch clack
const buildKeyTurn = (c: AudioContext) => {
  const t = c.currentTime;
  const sr = c.sampleRate;

  const noise = (dur: number) => {
    const buf = c.createBuffer(1, Math.floor(sr * dur), sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  };

  const connect = (...nodes: AudioNode[]) => {
    for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]);
  };

  // ── Phase 1: KEY INSERTION (0 – 90ms) ──────────────────────────────
  // Sharp metallic "tick" as key enters keyhole — two stacked transients
  // First: high-freq click (pin tumblers catching)
  const ins1 = c.createBufferSource(); ins1.buffer = noise(0.012);
  const insF1 = c.createBiquadFilter(); insF1.type = 'bandpass'; insF1.frequency.value = 3800; insF1.Q.value = 3;
  const insG1 = c.createGain();
  insG1.gain.setValueAtTime(0.55, t); insG1.gain.exponentialRampToValueAtTime(0.001, t + 0.012);
  connect(ins1, insF1, insG1, c.destination);
  ins1.start(t); ins1.stop(t + 0.014);

  // Second: low body thud immediately after (brass body contact)
  const ins2 = c.createBufferSource(); ins2.buffer = noise(0.025);
  const insF2 = c.createBiquadFilter(); insF2.type = 'bandpass'; insF2.frequency.value = 420; insF2.Q.value = 2;
  const insG2 = c.createGain();
  insG2.gain.setValueAtTime(0.0001, t + 0.008); insG2.gain.linearRampToValueAtTime(0.32, t + 0.013);
  insG2.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  connect(ins2, insF2, insG2, c.destination);
  ins2.start(t + 0.008); ins2.stop(t + 0.055);

  // Subtle metallic resonance from insertion
  const insOsc = c.createOscillator(); const insOscG = c.createGain();
  insOsc.type = 'sine'; insOsc.frequency.value = 1100;
  insOscG.gain.setValueAtTime(0.0001, t + 0.01); insOscG.gain.linearRampToValueAtTime(0.06, t + 0.014);
  insOscG.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  connect(insOsc, insOscG, c.destination);
  insOsc.start(t + 0.01); insOsc.stop(t + 0.09);

  // ── Phase 2: KEY ROTATION SCRAPE (100 – 340ms) ─────────────────────
  // Narrow bandpass noise — metal pin tumblers sliding against the key's cuts
  const scrBuf = noise(0.24);
  const scr = c.createBufferSource(); scr.buffer = scrBuf;
  const scrF1 = c.createBiquadFilter(); scrF1.type = 'bandpass'; scrF1.Q.value = 6;
  scrF1.frequency.setValueAtTime(950, t + 0.10);
  scrF1.frequency.linearRampToValueAtTime(700, t + 0.34);
  // Second bandpass for metallic texture
  const scrF2 = c.createBiquadFilter(); scrF2.type = 'bandpass'; scrF2.Q.value = 8;
  scrF2.frequency.setValueAtTime(2100, t + 0.10);
  scrF2.frequency.linearRampToValueAtTime(1600, t + 0.34);
  const scrMix = c.createGain(); scrMix.gain.value = 1;
  const scrG = c.createGain();
  scrG.gain.setValueAtTime(0.0001, t + 0.10);
  scrG.gain.linearRampToValueAtTime(0.055, t + 0.15);
  scrG.gain.setValueAtTime(0.055, t + 0.28);
  scrG.gain.exponentialRampToValueAtTime(0.001, t + 0.34);

  // Parallel filter paths merged into scrG
  const scrF1G = c.createGain(); scrF1G.gain.value = 0.65;
  const scrF2G = c.createGain(); scrF2G.gain.value = 0.35;
  scr.connect(scrF1); scrF1.connect(scrF1G); scrF1G.connect(scrG);
  scr.connect(scrF2); scrF2.connect(scrF2G); scrF2G.connect(scrG);
  scrG.connect(c.destination);
  scr.start(t + 0.10); scr.stop(t + 0.36);

  // Faint low rumble during rotation (cylinder turning)
  const rumBuf = noise(0.22);
  const rum = c.createBufferSource(); rum.buffer = rumBuf;
  const rumF = c.createBiquadFilter(); rumF.type = 'lowpass'; rumF.frequency.value = 180;
  const rumG = c.createGain();
  rumG.gain.setValueAtTime(0.0001, t + 0.11); rumG.gain.linearRampToValueAtTime(0.04, t + 0.17);
  rumG.gain.exponentialRampToValueAtTime(0.001, t + 0.33);
  connect(rum, rumF, rumG, c.destination);
  rum.start(t + 0.11); rum.stop(t + 0.35);

  // ── Phase 3: LATCH CLACK (340 – 520ms) ─────────────────────────────
  // Main impact: heavy brass bolt snapping into place
  const clkBuf = noise(0.018);
  const clk = c.createBufferSource(); clk.buffer = clkBuf;
  const clkHP = c.createBiquadFilter(); clkHP.type = 'highpass'; clkHP.frequency.value = 180;
  const clkLP = c.createBiquadFilter(); clkLP.type = 'lowpass'; clkLP.frequency.value = 2800;
  const clkG = c.createGain();
  clkG.gain.setValueAtTime(0.7, t + 0.345); clkG.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
  connect(clk, clkHP, clkLP, clkG, c.destination);
  clk.start(t + 0.345); clk.stop(t + 0.39);

  // Body resonance after clack — the lock housing rings
  [620, 1340, 2580].forEach((freq, i) => {
    const vol = [0.18, 0.09, 0.04][i];
    const decay = [0.14, 0.09, 0.06][i];
    const o = c.createOscillator(); const g = c.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t + 0.348);
    g.gain.linearRampToValueAtTime(vol, t + 0.351);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.348 + decay);
    connect(o, g, c.destination);
    o.start(t + 0.348); o.stop(t + 0.348 + decay + 0.01);
  });

  // Secondary micro-clack 45ms later (bolt settles fully into receiver)
  const clk2Buf = noise(0.01);
  const clk2 = c.createBufferSource(); clk2.buffer = clk2Buf;
  const clk2F = c.createBiquadFilter(); clk2F.type = 'bandpass'; clk2F.frequency.value = 1800; clk2F.Q.value = 2;
  const clk2G = c.createGain();
  clk2G.gain.setValueAtTime(0.22, t + 0.39); clk2G.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
  connect(clk2, clk2F, clk2G, c.destination);
  clk2.start(t + 0.39); clk2.stop(t + 0.43);
};

export type SoundType = 'particleClick' | 'startRecording' | 'warning' | 'diceRoll' | 'slotTick' | 'slotLand' | 'leverPull' | 'spaceSwipe' | 'keyTurn';

export const playSound = (type: SoundType) => {
  if (type === 'particleClick') play(buildClick);
  else if (type === 'startRecording') play(buildChime);
  else if (type === 'warning') play(buildBeeps);
  else if (type === 'diceRoll') play(buildDiceRoll);
  else if (type === 'slotTick') play(buildSlotTick);
  else if (type === 'slotLand') play(buildSlotLand);
  else if (type === 'leverPull') play(buildLeverPull);
  else if (type === 'spaceSwipe') play(buildSpaceSwipe);
  else if (type === 'keyTurn') play(buildKeyTurn);
};
