import React, { useState, useRef, useEffect } from 'react';
import type { ParticleData } from '../data/particles';
import { getParticleColor } from './ParticleCarousel';

interface Props {
  particles: ParticleData[];
  onSelect: (index: number) => void;
  externalSpin?: number; // increment to trigger spin from outside
  externalTarget?: number; // which index to land on
}

const ITEM_HEIGHT = 80; // px per slot item
const VISIBLE = 5;      // items visible at once
const CENTER = Math.floor(VISIBLE / 2);

export const ParticleSlotMachine: React.FC<Props> = ({
  particles, onSelect, externalSpin = 0, externalTarget,
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

  return (
    <div className="flex flex-col items-center gap-6 py-8">

      {/* Machine body */}
      <div className="relative" style={{ width: '320px' }}>

        {/* Ambient glow behind machine */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-700 blur-2xl"
          style={{ background: color.bg, opacity: 0.6 }}
        />

        {/* Slot window */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            height: `${windowHeight}px`,
            border: `2px solid ${color.border}`,
            background: 'rgba(5,5,5,0.85)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Top/bottom fade masks */}
          <div className="absolute inset-x-0 top-0 h-20 z-10 pointer-events-none"
               style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.95), transparent)' }} />
          <div className="absolute inset-x-0 bottom-0 h-20 z-10 pointer-events-none"
               style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.95), transparent)' }} />

          {/* Center highlight band */}
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

          {/* Drum */}
          <div
            style={{
              transform: `translateY(${CENTER * ITEM_HEIGHT - offset}px)`,
              willChange: 'transform',
            }}
          >
            {renderItems()}
          </div>
        </div>

        {/* Left/right side decorations */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-16 rounded-l-lg opacity-60"
             style={{ background: `linear-gradient(to bottom, ${color.glow}80, ${color.glow}20)` }} />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-16 rounded-r-lg opacity-60"
             style={{ background: `linear-gradient(to bottom, ${color.glow}80, ${color.glow}20)` }} />
      </div>

      {/* Core meaning shown below drum */}
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

      {/* Spin + Explore buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          style={{
            background: spinning
              ? 'rgba(255,255,255,0.05)'
              : `linear-gradient(135deg, ${color.bg}, rgba(255,255,255,0.04))`,
            border: `1px solid ${color.border}`,
            color: spinning ? 'rgba(255,255,255,0.3)' : color.text,
            boxShadow: spinning ? 'none' : `0 0 16px ${color.glow}30`,
          }}
        >
          <span className={spinning ? 'animate-spin' : ''} style={{ display: 'inline-block' }}>
            {spinning ? '⟳' : '🎰'}
          </span>
          {spinning ? 'Spinning…' : hasSpun ? 'Spin again' : 'Spin!'}
        </button>

        <button
          onClick={() => onSelect(currentIdx)}
          disabled={spinning}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-40 active:scale-95 text-white/70 hover:text-white"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          Explore {p.particle} →
        </button>
      </div>
    </div>
  );
};
