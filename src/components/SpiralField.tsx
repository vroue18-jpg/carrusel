import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 420;
const ARMS = 3;

interface Particle {
  arm: number;
  t: number;        // position along spiral (0–1)
  r: number;        // computed radius
  angle: number;    // computed angle
  size: number;
  baseBrightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftAngle: number;
  driftSpeed: number;
  driftRadius: number;
  blur: boolean;
}

function buildParticles(maxR: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const arm = i % ARMS;
    // Bias toward inner spiral — cube-root so core is denser
    const t = Math.pow(Math.random(), 0.7);
    const r = t * maxR;
    // Logarithmic spiral: angle grows as log of radius
    const spiralAngle = (arm * (2 * Math.PI / ARMS)) + 4.5 * Math.log(1 + t * 6);
    // Small scatter around the arm
    const scatter = (1 - t * 0.6) * 0.45;
    const angle = spiralAngle + (Math.random() - 0.5) * scatter;
    particles.push({
      arm,
      t,
      r,
      angle,
      size: 0.6 + Math.random() * (t < 0.3 ? 2.2 : 1.4),
      baseBrightness: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.4 + Math.random() * 1.6,
      twinkleOffset: Math.random() * Math.PI * 2,
      driftAngle: Math.random() * Math.PI * 2,
      driftSpeed: 0.1 + Math.random() * 0.3,
      driftRadius: 0.5 + Math.random() * (r * 0.015),
      blur: t > 0.55 && Math.random() < 0.4,
    });
  }
  return particles;
}

export function SpiralField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const maxR = Math.sqrt(W * W + H * H) * 0.52;
    let cx = W / 2;
    let cy = H / 2;

    canvas.width = W;
    canvas.height = H;

    let particles = buildParticles(maxR);

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      cx = W / 2;
      cy = H / 2;
      particles = buildParticles(Math.sqrt(W * W + H * H) * 0.52);
    };
    window.addEventListener('resize', onResize);

    // Rotation period: 90s clockwise
    const ROTATION_PERIOD = 90_000;

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, W, H);

      const globalRotation = prefersReduced ? 0 : ((ts % ROTATION_PERIOD) / ROTATION_PERIOD) * Math.PI * 2;

      for (const p of particles) {
        const twinkle = 0.55 + 0.45 * Math.sin(ts * 0.001 * p.twinkleSpeed + p.twinkleOffset);
        const brightness = p.baseBrightness * twinkle;

        // Drift: tiny circular oscillation around the particle's home position
        const driftPhase = ts * 0.001 * p.driftSpeed + p.driftAngle;
        const dx = Math.cos(driftPhase) * p.driftRadius;
        const dy = Math.sin(driftPhase) * p.driftRadius;

        const angle = p.angle + globalRotation;
        const x = cx + Math.cos(angle) * p.r + dx;
        const y = cy + Math.sin(angle) * p.r + dy;

        // Orange palette: inner core warmer, outer arms cooler orange
        const warmth = 1 - p.t * 0.35;
        const r = Math.round(255);
        const g = Math.round((122 + (157 - 122) * (1 - p.t)) * warmth);
        const b = Math.round(0 + p.t * 8);

        const alpha = brightness * (p.blur ? 0.35 : 0.75);
        const color = `rgba(${r},${g},${b},${alpha})`;

        if (p.blur) {
          ctx.filter = 'blur(1.5px)';
        }

        // Glow: large soft halo
        const glow = ctx.createRadialGradient(x, y, 0, x, y, p.size * 4);
        glow.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.9})`);
        glow.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.3})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.filter = 'none';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

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
      style={{ opacity: 0.13, mixBlendMode: 'screen' }}
    />
  );
}
