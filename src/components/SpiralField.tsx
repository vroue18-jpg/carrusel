import { useEffect, useRef } from 'react';

const ARMS = 3;
const MAX_PARTICLES = 380;
const MIN_PARTICLES = 80;
const ROTATION_PERIOD = 90_000;

// Quality tiers — stepped down automatically when FPS drops
const TIERS = [
  { count: 380, glow: true,  drift: true  },  // HIGH
  { count: 220, glow: true,  drift: false },  // MEDIUM
  { count: 120, glow: false, drift: false },  // LOW
  { count: MIN_PARTICLES, glow: false, drift: false }, // MINIMAL
];

interface Particle {
  t: number;
  r: number;
  angle: number;
  size: number;
  baseBrightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftAngle: number;
  driftSpeed: number;
  driftRadius: number;
  // pre-baked color ints
  cr: number; cg: number; cb: number;
}

function buildParticles(maxR: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const arm = i % ARMS;
    const t = Math.pow(Math.random(), 0.7);
    const r = t * maxR;
    const spiralAngle = (arm * (2 * Math.PI / ARMS)) + 4.5 * Math.log(1 + t * 6);
    const scatter = (1 - t * 0.6) * 0.45;
    const angle = spiralAngle + (Math.random() - 0.5) * scatter;
    const warmth = 1 - t * 0.35;
    out.push({
      t, r, angle,
      size: 0.7 + Math.random() * (t < 0.3 ? 2.0 : 1.2),
      baseBrightness: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.4 + Math.random() * 1.5,
      twinkleOffset: Math.random() * Math.PI * 2,
      driftAngle: Math.random() * Math.PI * 2,
      driftSpeed: 0.1 + Math.random() * 0.3,
      driftRadius: 0.6 + Math.random() * (r * 0.014),
      cr: 255,
      cg: Math.round((122 + (157 - 122) * (1 - t)) * warmth),
      cb: Math.round(t * 8),
    });
  }
  return out;
}

export function SpiralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let cx = W / 2;
    let cy = H / 2;
    canvas.width = W;
    canvas.height = H;

    let particles = buildParticles(Math.sqrt(W * W + H * H) * 0.52);

    // ── Adaptive quality ──────────────────────────────────────────────
    let tierIdx = 0;
    let fpsSamples: number[] = [];
    let lastTs = 0;
    let frameCount = 0;
    // Check every 60 frames, upgrade every 300 frames if stable
    const MEASURE_INTERVAL = 60;
    const UPGRADE_INTERVAL = 300;

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
      cx = W / 2; cy = H / 2;
      particles = buildParticles(Math.sqrt(W * W + H * H) * 0.52);
    };
    window.addEventListener('resize', onResize);

    const draw = (ts: number) => {
      // ── FPS measurement & adaptive tier ──────────────────────────
      if (lastTs > 0) {
        const fps = 1000 / (ts - lastTs);
        fpsSamples.push(fps);
        if (fpsSamples.length >= MEASURE_INTERVAL) {
          const avg = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
          fpsSamples = [];
          if (avg < 30 && tierIdx < TIERS.length - 1) {
            tierIdx++;   // drop quality
          } else if (avg > 55 && frameCount % UPGRADE_INTERVAL === 0 && tierIdx > 0) {
            tierIdx--;   // try upgrading
          }
        }
      }
      lastTs = ts;
      frameCount++;

      const tier = TIERS[tierIdx];
      const count = tier.count;

      ctx.clearRect(0, 0, W, H);

      const globalRotation = prefersReduced
        ? 0
        : ((ts % ROTATION_PERIOD) / ROTATION_PERIOD) * Math.PI * 2;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        const twinkle = 0.55 + 0.45 * Math.sin(ts * 0.001 * p.twinkleSpeed + p.twinkleOffset);
        const brightness = p.baseBrightness * twinkle;

        const angle = p.angle + globalRotation;
        let x = cx + Math.cos(angle) * p.r;
        let y = cy + Math.sin(angle) * p.r;

        if (tier.drift) {
          const driftPhase = ts * 0.001 * p.driftSpeed + p.driftAngle;
          x += Math.cos(driftPhase) * p.driftRadius;
          y += Math.sin(driftPhase) * p.driftRadius;
        }

        const alpha = brightness * 0.82;

        if (tier.glow) {
          // Soft glow: draw two overlapping circles instead of RadialGradient
          // (much cheaper — no gradient object allocation per frame)
          ctx.globalAlpha = alpha * 0.22;
          ctx.fillStyle = `rgb(${p.cr},${p.cg},${p.cb})`;
          ctx.beginPath();
          ctx.arc(x, y, p.size * 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.globalAlpha = alpha * 0.45;
          ctx.beginPath();
          ctx.arc(x, y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core dot
        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${p.cr},${p.cg},${p.cb})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.14, mixBlendMode: 'screen' }}
    />
  );
}
