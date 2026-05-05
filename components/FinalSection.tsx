'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props { name: string; }

// ── Floating balloon component ───────────────────────────────────────────────
const BALLOON_COLORS = [
  '#FF6B9D', '#FFD700', '#9B59B6', '#4ECDC4', '#FF6B00', '#2ECC71', '#E74C3C', '#3498DB',
];

function Balloon({ color, x, delay }: { color: string; x: number; delay: number }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${x}%`, bottom: '-10%' }}
      animate={{ y: [0, '-140vh'] }}
      transition={{ duration: 5 + Math.random() * 3, delay, ease: 'easeIn', repeat: Infinity, repeatDelay: Math.random() * 4 }}
    >
      <div className="relative">
        {/* Balloon body */}
        <div className="w-10 h-12 md:w-14 md:h-16 rounded-full relative"
          style={{ background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color}88)`, boxShadow: `0 0 15px ${color}55` }}>
          {/* Shine */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/40" />
          {/* Knot */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-1.5 h-2 rounded-b-full"
            style={{ background: color }} />
        </div>
        {/* String */}
        <svg className="absolute bottom-0 left-1/2 -translate-x-1/2" width="2" height="40">
          <line x1="1" y1="0" x2="1" y2="40" stroke={`${color}88`} strokeWidth="1" />
        </svg>
      </div>
    </motion.div>
  );
}

// ── Firework effect ──────────────────────────────────────────────────────────
function launchFireworks() {
  const colors = ['#FF6B9D', '#FFD700', '#9B59B6', '#4ECDC4', '#FF6B00', '#fff'];
  const shoot = (origin: { x: number; y: number }) =>
    confetti({ particleCount: 80, spread: 120, origin, colors, startVelocity: 50, scalar: 1.2, ticks: 200 });

  // Staggered bursts
  [{ x: 0.2, y: 0.4 }, { x: 0.8, y: 0.35 }, { x: 0.5, y: 0.3 }].forEach((o, i) => {
    setTimeout(() => shoot(o), i * 350);
  });
  setTimeout(() => confetti({ particleCount: 200, spread: 180, origin: { x: 0.5, y: 0.5 }, colors, startVelocity: 60, scalar: 1.5 }), 1000);
}

export default function FinalSection({ name }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });
  const [balloons, setBalloons] = useState<{ id: number; color: string; x: number; delay: number }[]>([]);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (inView && !hasLaunched && mounted) {
      setHasLaunched(true);
      triggerCelebration();
    }
  }, [inView, hasLaunched, mounted]);

  const triggerCelebration = () => {
    launchFireworks();
    setBalloons(
      Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        x: Math.random() * 90 + 5,
        delay: i * 0.4,
      }))
    );
  };

  const replay = () => {
    setHasLaunched(false);
    setBalloons([]);
    setTimeout(() => {
      setHasLaunched(true);
      triggerCelebration();
    }, 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const firstWord = name.split(' ')[0];

  return (
    <section id="final" ref={ref} className="relative min-h-screen flex flex-col items-center justify-center py-24 px-4 z-10 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,107,157,0.15) 0%, rgba(155,89,182,0.1) 40%, transparent 70%)' }} />

      {/* Balloons */}
      {mounted && balloons.map(b => (
        <Balloon key={b.id} color={b.color} x={b.x} delay={b.delay} />
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Pulsing ring decoration */}
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border border-pink-500/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }} />
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full border border-purple-500/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} />

        {/* Big emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
          className="text-7xl md:text-8xl mb-8"
        >
          🎂
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-poppins font-black leading-tight mb-6"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
        >
          <span className="text-white">You are the </span>
          <span className="gradient-text">Best Brother</span>
          <br />
          <span className="gradient-text-gold">{name}</span>
          <span className="text-white"> ❤️</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
        >
          This is just the beginning. May every day of your life be filled with the same joy, love, and magic that you bring to ours.
          The world is lucky to have you, {firstWord}. And so are we. 🌟
        </motion.p>

        {/* Floating emojis around text */}
        {['🎉', '🎊', '✨', '💫', '🌟', '❤️', '🎈', '🎁'].map((e, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl pointer-events-none select-none"
            style={{
              left: `${10 + (i * 11) % 80}%`,
              top: `${15 + (i * 13) % 70}%`,
            }}
            animate={{ y: [0, -20, 0], rotate: [0, 15, -15, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3 + i * 0.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {e}
          </motion.span>
        ))}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={replay}
            whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(255,107,157,0.7)' }}
            whileTap={{ scale: 0.96 }}
            className="btn-primary text-lg px-10 py-4"
          >
            🔁 Replay Surprise
          </motion.button>
          <motion.button
            onClick={triggerCelebration}
            whileHover={{ scale: 1.06, boxShadow: '0 12px 40px rgba(255,215,0,0.5)' }}
            whileTap={{ scale: 0.96 }}
            className="btn-gold text-lg px-10 py-4"
          >
            🎊 More Confetti!
          </motion.button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-gray-600 text-sm mt-16"
        >
          Made with ❤️ especially for {name} • Happy Birthday! 🎂
        </motion.p>
      </div>
    </section>
  );
}
