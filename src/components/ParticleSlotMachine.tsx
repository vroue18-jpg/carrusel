import React, { useState, useRef, useEffect } from 'react';
import type { ParticleData } from '../data/particles';
import { getParticleColor } from './ParticleCarousel';
import { playSound } from '../utils/sounds';


type Color = { glow: string; bg: string; border: string; text: string };

interface LockKeyProps {
  color: Color;
  spinning: boolean;
  hasSpun: boolean;
  onPull: () => void;
}

const LockKey: React.FC<LockKeyProps> = ({ color, spinning, hasSpun, onPull }) => {
  const [phase, setPhase] = useState<'idle' | 'inserting' | 'turning' | 'done'>('idle');

  const handleClick = () => {
    if (spinning || phase !== 'idle') return;
    setPhase('inserting');
    setTimeout(() => { setPhase('turning'); playSound('keyTurn'); }, 300);
    setTimeout(() => { onPull(); setPhase('done'); }, 650);
    setTimeout(() => setPhase('idle'), 1800);
  };

  const keyX = phase === 'idle' ? 0 : phase === 'inserting' || phase === 'turning' || phase === 'done' ? -18 : 0;
  const keyRotate = phase === 'turning' || phase === 'done' ? 90 : 0;
  const glowing = phase === 'turning' || phase === 'done';

  return (
    <div className="flex flex-col items-center gap-3 select-none" style={{ width: '72px' }}>
      <span className="text-[9px] font-semibold tracking-widest uppercase text-center leading-tight"
            style={{ color: color.text, opacity: spinning ? 0.3 : 0.65 }}>
        {spinning ? 'wait…' : hasSpun ? 'again!' : 'unlock!'}
      </span>

      {/* Lock + Key assembly */}
      <div className="relative flex items-center justify-center cursor-pointer" style={{ width: '72px', height: '88px' }} onClick={handleClick}>

        {/* Lock body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ width: '44px' }}>
          {/* Shackle */}
          <div className="w-5 h-5 rounded-t-full border-[3px] mb-[-2px] transition-all duration-500"
               style={{
                 borderColor: glowing ? color.text : `${color.text}88`,
                 boxShadow: glowing ? `0 0 12px ${color.glow}` : 'none',
                 transform: glowing ? 'translateY(-3px)' : 'translateY(0)',
                 transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
               }} />
          {/* Lock face */}
          <div className="w-full rounded-xl flex items-center justify-center transition-all duration-500"
               style={{
                 height: '38px',
                 background: glowing ? `linear-gradient(135deg, ${color.bg}, rgba(0,0,0,0.6))` : 'rgba(30,30,30,0.9)',
                 border: `2px solid ${glowing ? color.text : color.text + '55'}`,
                 boxShadow: glowing ? `0 0 20px ${color.glow}80, 0 0 40px ${color.glow}30` : 'none',
               }}>
            {/* Keyhole */}
            <div className="flex flex-col items-center gap-0" style={{ opacity: glowing ? 0.4 : 0.9 }}>
              <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: color.text + 'cc' }} />
              <div className="w-1.5 h-2.5 rounded-b-sm -mt-1" style={{ background: color.text + 'cc' }} />
            </div>
          </div>
        </div>

        {/* Key — floats to the right, slides in and rotates */}
        <div
          className="absolute transition-all"
          style={{
            right: '0px',
            top: '12px',
            transform: `translateX(${keyX}px) rotate(${keyRotate}deg)`,
            transformOrigin: '12px 50%',
            transition: phase === 'inserting'
              ? 'transform 0.28s cubic-bezier(0.4,0,0.2,1)'
              : phase === 'turning'
              ? 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)'
              : 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            filter: glowing ? `drop-shadow(0 0 6px ${color.glow})` : `drop-shadow(0 2px 4px ${color.glow}60)`,
          }}
        >
          <svg width="42" height="22" viewBox="0 0 42 22" fill="none">
            {/* Key bow (ring) */}
            <circle cx="33" cy="11" r="8" fill={color.glow} opacity="0.9" />
            <circle cx="33" cy="11" r="5" fill="rgba(0,0,0,0.7)" />
            <circle cx="33" cy="11" r="2" fill={color.text} opacity="0.6" />
            {/* Key blade */}
            <rect x="0" y="9" width="27" height="4" rx="2" fill={color.text} />
            {/* Key teeth */}
            <rect x="4"  y="13" width="3" height="4" rx="1" fill={color.text} />
            <rect x="10" y="13" width="3" height="6" rx="1" fill={color.text} />
            <rect x="16" y="13" width="3" height="3" rx="1" fill={color.text} />
          </svg>
        </div>
      </div>
    </div>
  );
};

interface Props {
  particles: ParticleData[];
  onSelect: (index: number) => void;
  activeIndex: number | null;
  externalSpin?: number;
  externalTarget?: number;
}

const ITEM_HEIGHT = 80; // px per slot item
const VISIBLE = 5;      // items visible at once
const CENTER = Math.floor(VISIBLE / 2);

export const ParticleSlotMachine: React.FC<Props> = ({
  particles, onSelect, activeIndex, externalSpin = 0, externalTarget,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [offset, setOffset] = useState(0);           // continuous drum offset in px
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const rafRef = useRef<number | null>(null);
  const prevExternalSpin = useRef(externalSpin);

  const color = getParticleColor(particles[currentIdx].particle);

  // Build an infinite-ish repeating list: duplicate particles 5x to allow long spins
  const drumList = [...particles, ...particles, ...particles, ...particles, ...particles];
  const drumLen = drumList.length;

  // Current visual offset → which "real" index is in center
  // offset = how many px we've scrolled down from top
  // center item index in drumList = Math.round(offset / ITEM_HEIGHT)

  const spinTo = (targetRealIdx: number) => {
    if (spinning) return;
    setSpinning(true);
    setIsAnimating(true);
    setHasSpun(true);

    const n = particles.length;
    // Start from somewhere in the middle of the drum so we have room to spin
    const startBlock = 2 * n; // start in 3rd repetition
    const currentDrumIdx = startBlock + currentIdx;

    // Target: at least 2 full rotations + land on target in next block
    const fullSpins = 2;
    const targetDrumIdx = startBlock + fullSpins * n + targetRealIdx;

    const startOffset = currentDrumIdx * ITEM_HEIGHT;
    const endOffset = targetDrumIdx * ITEM_HEIGHT;
    const distance = endOffset - startOffset;

    const duration = 1400; // ms
    const startTime = performance.now();

    // Ease out cubic
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      const newOffset = startOffset + distance * eased;

      setOffset(newOffset);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setOffset(endOffset);
        setCurrentIdx(targetRealIdx);
        setSpinning(false);
        setTimeout(() => setIsAnimating(false), 200);
        playSound('slotLand');
        onSelect(targetRealIdx);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  // Spin triggered externally (Random button)
  useEffect(() => {
    if (externalSpin !== prevExternalSpin.current && externalTarget !== undefined) {
      prevExternalSpin.current = externalSpin;
      spinTo(externalTarget);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSpin, externalTarget]);

  // Internal spin button
  const handleSpin = () => {
    if (spinning) return;
    const next = Math.floor(Math.random() * particles.length);
    spinTo(next);
  };

  // Compute which drum items to render around current position
  // We show from (currentIdx - CENTER) to (currentIdx + CENTER) in the "current" repetition
  // But use the continuous offset for translation
  const renderItems = () => {
    const items = [];
    for (let i = 0; i < drumLen; i++) {
      const realIdx = i % particles.length;
      const p = particles[realIdx];
      const c = getParticleColor(p.particle);
      const isCenter = realIdx === currentIdx && !isAnimating;
      const distFromCenter = Math.abs(i * ITEM_HEIGHT - offset) / ITEM_HEIGHT;

      items.push(
        <div
          key={i}
          className="flex items-center justify-center"
          style={{
            height: `${ITEM_HEIGHT}px`,
            flexShrink: 0,
            transition: isAnimating ? 'none' : 'opacity 0.3s',
          }}
        >
          <div
            className="flex items-center gap-3 px-6 py-2 rounded-2xl transition-all duration-300 cursor-pointer select-none"
            style={{
              opacity: isAnimating
                ? Math.max(0, 1 - distFromCenter * 0.35)
                : isCenter ? 1 : 0.25,
              transform: isCenter && !isAnimating ? 'scale(1.05)' : 'scale(0.9)',
              background: isCenter && !isAnimating ? c.bg : 'transparent',
              border: isCenter && !isAnimating ? `1px solid ${c.border}` : '1px solid transparent',
            }}
            onClick={() => !spinning && onSelect(realIdx)}
          >
            <span className="text-2xl">{p.emoji}</span>
            <span
              className="font-display text-3xl tracking-widest"
              style={{
                color: isCenter && !isAnimating ? c.text : 'rgba(255,255,255,0.6)',
                textShadow: isCenter && !isAnimating
                  ? `0 0 20px ${c.glow}90, 0 0 40px ${c.glow}40`
                  : 'none',
              }}
            >
              {p.particle}
            </span>
          </div>
        </div>
      );
    }
    return items;
  };

  const windowHeight = VISIBLE * ITEM_HEIGHT;
  const p = particles[currentIdx];
  const isActive = activeIndex === currentIdx;

  return (
    <div className="flex flex-col items-center gap-6 py-8">

      {/* Drum + Lever side by side */}
      <div className="flex items-center gap-4">

        {/* Machine body */}
        <div className="relative" style={{ width: '300px' }}>
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-700 blur-2xl"
            style={{ background: color.bg, opacity: 0.6 }}
          />
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{
              height: `${windowHeight}px`,
              border: `2px solid ${color.border}`,
              background: 'rgba(5,5,5,0.85)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-20 z-10 pointer-events-none"
                 style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.95), transparent)' }} />
            <div className="absolute inset-x-0 bottom-0 h-20 z-10 pointer-events-none"
                 style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.95), transparent)' }} />
            <div
              className="absolute inset-x-0 z-10 pointer-events-none transition-all duration-700"
              style={{
                top: `${CENTER * ITEM_HEIGHT}px`,
                height: `${ITEM_HEIGHT}px`,
                borderTop: `1px solid ${color.border}`,
                borderBottom: `1px solid ${color.border}`,
                background: `linear-gradient(to right, transparent, ${color.bg}, transparent)`,
              }}
            />
            <div style={{ transform: `translateY(${CENTER * ITEM_HEIGHT - offset}px)`, willChange: 'transform' }}>
              {renderItems()}
            </div>
          </div>
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-16 rounded-l-lg opacity-60"
               style={{ background: `linear-gradient(to bottom, ${color.glow}80, ${color.glow}20)` }} />
        </div>

        {/* Lock & Key */}
        <LockKey color={color} spinning={spinning} onPull={handleSpin} hasSpun={hasSpun} />
      </div>

      {/* Core meaning card */}
      <div
        className="text-center px-5 py-3 rounded-2xl max-w-xs transition-all duration-500"
        style={{
          opacity: spinning ? 0.3 : 1,
          background: color.bg,
          border: `1px solid ${color.border}`,
          color: 'rgba(255,255,255,0.75)',
          fontSize: '0.8rem',
          lineHeight: '1.5',
        }}
      >
        <span className="font-display tracking-widest text-sm mr-2" style={{ color: color.text }}>
          {p.emoji} {p.particle}
        </span>
        — {p.coreMeaning}
      </div>

      {/* Scroll down hint when detail is loaded */}
      {isActive && !spinning && (
        <div
          className="flex flex-col items-center gap-1 animate-bounce"
          style={{ color: color.text, opacity: 0.6, fontSize: '0.75rem' }}
        >
          <span className="font-semibold tracking-widest uppercase">Scroll down</span>
          <span>↓</span>
        </div>
      )}
    </div>
  );
};
