'use client';
import { useEffect, useRef } from 'react';

/**
 * Custom animated cursor.
 * – Hidden automatically on touch/mobile devices (pointer: coarse)
 * – Uses direct DOM mutation — zero React re-renders at 60fps
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const trail = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isTouch = useRef(false);

  useEffect(() => {
    // Detect touch/mobile — hide cursor entirely on those devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      isTouch.current = true;
      if (dotRef.current) dotRef.current.style.display = 'none';
      if (ringRef.current) ringRef.current.style.display = 'none';
      return;
    }

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    const onDown = () => {
      if (dotRef.current) { dotRef.current.style.width = '20px'; dotRef.current.style.height = '20px'; }
    };
    const onUp = () => {
      if (dotRef.current) { dotRef.current.style.width = '12px'; dotRef.current.style.height = '12px'; }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      trail.current.x = lerp(trail.current.x, pos.current.x, 0.12);
      trail.current.y = lerp(trail.current.y, pos.current.y, 0.12);
      if (dotRef.current) dotRef.current.style.transform = `translate(${pos.current.x - 6}px, ${pos.current.y - 6}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${trail.current.x - 18}px, ${trail.current.y - 18}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full shadow-[0_0_10px_rgba(255,107,157,0.8)]"
        style={{ width: 12, height: 12, background: '#FF6B9D', transition: 'width 0.15s, height 0.15s', willChange: 'transform' }} />
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2 border-purple-400"
        style={{ width: 36, height: 36, opacity: 0.6, willChange: 'transform' }} />
    </>
  );
}
