'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Props { name: string; }

// Reduced to 12 particles using CSS animations (compositor thread, no JS cost)
const HERO_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  emoji: ['🎉', '🎊', '⭐', '✨', '🌟', '💫', '🎈', '🎁', '❤️', '🎂', '🎀', '🌠'][i],
  x: (i * 8.5 + 3) % 95,
  y: (i * 7.3 + 5) % 88,
  size: 16 + (i % 4) * 6,
  delay: i * 0.6,
  duration: 5 + (i % 3) * 2,
}));

/**
 * HERO SECTION — Full-screen cinematic landing with floating particles,
 * gradient headline, and CTA button that scrolls to the next section.
 */
export default function HeroSection({ name }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [showSub, setShowSub] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowSub(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative flex flex-col items-center justify-center text-center px-4 z-10 py-28 md:py-36"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(255,107,157,0.18) 0%, rgba(155,89,182,0.12) 40%, transparent 70%)',
      }}
    >
      {/* Floating emoji particles — CSS animated for zero JS cost */}
      {HERO_PARTICLES.map(p => (
        <span
          key={p.id}
          className="absolute pointer-events-none select-none float-anim"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform',
          }}
        >
          {p.emoji}
        </span>
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto">
        {/* Pre-headline badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-block mb-6 px-5 py-2 rounded-full glass text-sm font-medium tracking-widest text-pink-300 uppercase"
        >
          🎂 A Special Day Has Arrived
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="font-poppins font-black leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem, 6vw, 5.5rem)' }}
        >
          <span style={{ color: '#fff' }}>Happy Birthday</span>
          <br />
          <span className="gradient-text">🎉 {name} 🎉</span>
        </motion.h1>

        {/* Subtext with shimmer underline */}
        {showSub && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 2.2vw, 1.3rem)' }}
          >
            On this beautiful day, the universe celebrates the most amazing soul.
            You make every moment brighter, every laugh louder, and every memory
            more precious. Here&apos;s to YOU — my incredible brother. 🌟
          </motion.p>
        )}

        {/* CTA Button */}
        <motion.a
          href="#gallery"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(255,107,157,0.7)' }}
          whileTap={{ scale: 0.96 }}
          className="btn-primary inline-block text-lg font-semibold no-underline"
          style={{ textDecoration: 'none' }}
        >
          🎁 Start the Surprise
        </motion.a>

        {/* Scroll indicator */}
        <motion.div
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-gray-500 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-pink-500 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
