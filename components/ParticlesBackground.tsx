'use client';
import { useEffect, useRef } from 'react';

/**
 * Draws animated star particles on a fixed canvas behind all sections.
 * Optimised: viewport-only canvas, 120 stars (down from 220), skip draw
 * when tab is hidden, throttled resize via ResizeObserver.
 */
interface Star {
  x: number; y: number; r: number;
  dx: number; dy: number;
  opacity: number; dOpacity: number;
  color: string;
}

const COLORS = ['#FF6B9D', '#9B59B6', '#FFD700', '#4ECDC4', '#fff', '#fff', '#fff'];
const STAR_COUNT = 120; // was 220

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let stars: Star[] = [];
    let hidden = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Drastically reduce particles on mobile to fix lag
      const count = window.innerWidth < 768 ? 40 : 100;
      initStars(count);
    };

    const initStars = (count: number) => {
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.3,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        opacity: Math.random(),
        dOpacity: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = () => {
      if (hidden) { animId = requestAnimationFrame(draw); return; }

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.opacity += s.dOpacity;
        if (s.opacity <= 0.1 || s.opacity >= 1) s.dOpacity *= -1;
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0) s.x = w;
        else if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        else if (s.y > h) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = s.color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    // Pause when tab is not visible
    const onVisibility = () => { hidden = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    // Throttle resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); };

    resize();
    draw();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8, willChange: 'auto' }}
    />
  );
}
