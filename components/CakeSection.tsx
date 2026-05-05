'use client';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props { name: string; }

const CANDLES = [0, 1, 2, 3, 4, 5]; // 6 candles on the cake

function Candle({ lit, onClick, delay }: { lit: boolean; onClick: () => void; delay: number }) {
  return (
    <motion.div
      className="relative flex flex-col items-center cursor-pointer"
      onClick={onClick}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      style={{ transformOrigin: 'bottom' }}
    >
      {/* Flame */}
      <AnimatePresence>
        {lit && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-7 flex flex-col items-center"
          >
            <motion.div
              className="w-3 h-5 rounded-full"
              style={{ background: 'radial-gradient(circle, #fff 20%, #FFD700 40%, #FF6B00 70%, transparent 100%)' }}
              animate={{ scaleY: [1, 1.2, 0.9, 1], scaleX: [1, 0.85, 1.1, 1] }}
              transition={{ duration: 0.3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="w-1 h-2 rounded-full"
              style={{ background: 'rgba(255,200,50,0.6)' }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            {/* Glow */}
            <div className="absolute w-8 h-8 rounded-full top-0 opacity-40 blur-md"
              style={{ background: '#FFD700', transform: 'translate(-50%, -30%) translateX(50%)' }} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Wax stick */}
      <div className="w-3 h-10 rounded-sm" style={{ background: `hsl(${(delay * 60 + 200) % 360}, 80%, 70%)` }} />
      {/* Base */}
      <div className="w-4 h-1.5 rounded-sm" style={{ background: `hsl(${(delay * 60 + 200) % 360}, 60%, 50%)` }} />
    </motion.div>
  );
}

function fireworks() {
  const duration = 3000;
  const end = Date.now() + duration;
  const colors = ['#FF6B9D', '#FFD700', '#9B59B6', '#4ECDC4', '#FF6B00'];
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  // Big burst
  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors, startVelocity: 45 });
}

export default function CakeSection({ name }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [litCandles, setLitCandles] = useState<Set<number>>(new Set(CANDLES));
  const [blown, setBlown] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const lightAll = () => {
    setLitCandles(new Set(CANDLES));
    setBlown(false);
    setCelebrating(false);
  };

  const blowCandles = () => {
    setLitCandles(new Set());
    setBlown(true);
    setCelebrating(true);
    fireworks();
  };

  const toggleCandle = (i: number) => {
    if (blown) return;
    setLitCandles(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const allLit = litCandles.size === CANDLES.length;

  return (
    <section id="cake" className="relative py-24 px-4 z-10">
      <div ref={ref} className="max-w-3xl mx-auto text-center">
        {/* Heading */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-3">
          🎂 Make a Wish
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-poppins font-black text-4xl md:text-5xl text-white mb-4">
          {blown ? (
            <span className="gradient-text-gold">Happy Birthday {name.split(' ')[0]}! 🎊</span>
          ) : (
            <>Your Birthday <span className="gradient-text">Cake Awaits</span> 🎂</>
          )}
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }} className="text-gray-400 mb-14">
          {blown ? 'May all your wishes come true! ✨' : 'Click candles to light them, then blow them all out!'}
        </motion.p>

        {/* Cake illustration */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100, delay: 0.3 }}
          className="flex flex-col items-center mb-12"
        >
          {/* Candles row */}
          <div className="flex items-end gap-4 mb-2 px-8">
            {CANDLES.map(i => (
              <Candle key={i} lit={litCandles.has(i)} onClick={() => toggleCandle(i)} delay={0.4 + i * 0.08} />
            ))}
          </div>

          {/* Cake top tier */}
          <motion.div
            className="relative w-52 md:w-64 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FF6B9D, #9B59B6)',
              boxShadow: celebrating ? '0 0 60px rgba(255,107,157,0.8)' : '0 4px 20px rgba(255,107,157,0.4)',
              transition: 'box-shadow 0.5s',
            }}
            animate={celebrating ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.5, repeat: celebrating ? Infinity : 0, repeatType: 'reverse' }}
          >
            <span className="text-white font-bold text-sm tracking-widest">🎂 Happy Birthday 🎂</span>
            {/* Frosting drips */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="absolute bottom-0 w-3 h-4 rounded-b-full bg-white/30"
                style={{ left: `${8 + i * 12}%`, transform: 'translateY(50%)' }} />
            ))}
          </motion.div>

          {/* Middle tier */}
          <motion.div
            className="w-64 md:w-80 h-16 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
          >
            <span className="text-black/70 font-bold text-xs tracking-widest">✨ {name} ✨</span>
            {/* Shimmer */}
            <motion.div className="absolute inset-0 -skew-x-12"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', width: '40%' }}
              animate={{ x: ['-100%', '400%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }} />
          </motion.div>

          {/* Base tier */}
          <motion.div
            className="w-80 md:w-96 h-20 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4ECDC4, #2ECC71)' }}
          >
            <div className="flex gap-3 text-2xl">
              {['🌟', '❤️', '🎊', '💫', '🎈'].map((e, i) => (
                <motion.span key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}>
                  {e}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Plate */}
          <div className="w-96 md:w-[28rem] h-4 rounded-full mt-1" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!blown && (
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={blowCandles}
              disabled={!allLit}
              className="btn-primary text-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              💨 Blow the Candles!
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={lightAll}
            className="btn-gold text-lg"
          >
            🕯️ {blown ? 'Light Again' : 'Light All Candles'}
          </motion.button>
        </div>

        {!allLit && !blown && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-gray-500 text-sm mt-4">
            Click each candle to light it, then blow them all out! 🕯️
          </motion.p>
        )}
      </div>
    </section>
  );
}
