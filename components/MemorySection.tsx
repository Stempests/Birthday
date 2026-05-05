'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Props { name: string; }

const MEMORIES = [
  {
    id: 1, emoji: '👶', year: 'Early Days', icon: '🌸',
    title: 'Where It All Began',
    description: 'From the very first day you came into this world, you filled every room with warmth and endless mischief. Those early morning giggles, those tiny hands — memories that live in my heart forever.',
    glow: 'rgba(255,107,157,0.3)', border: 'rgba(255,107,157,0.3)',
  },
  {
    id: 2, emoji: '🏫', year: 'School Days', icon: '📚',
    title: 'The Troublemaker & The Scholar',
    description: 'You somehow managed to be the class clown AND top of the class at the same time. Those late-night study sessions, tiffin-sharing moments, the "let\'s bunk this period" whispers — pure gold.',
    glow: 'rgba(155,89,182,0.3)', border: 'rgba(155,89,182,0.3)',
  },
  {
    id: 3, emoji: '🎮', year: 'Teen Years', icon: '🕹️',
    title: 'Epic Gaming Sessions',
    description: 'Those endless gaming nights where we\'d forget time existed — controller in hand, snacks everywhere, mom yelling at us to sleep. You always won, and you never let me forget it. The best nights.',
    glow: 'rgba(59,130,246,0.3)', border: 'rgba(59,130,246,0.3)',
  },
  {
    id: 4, emoji: '🏆', year: 'Achievements', icon: '⭐',
    title: 'Watching You Soar',
    description: 'Every certificate, every award, every proud moment — I was always your biggest cheerleader from the crowd. Watching you achieve your dreams is one of the greatest joys of my life.',
    glow: 'rgba(255,215,0,0.3)', border: 'rgba(255,215,0,0.3)',
  },
  {
    id: 5, emoji: '✈️', year: 'Adventures', icon: '🌍',
    title: 'Road Trips & Crazy Plans',
    description: 'That trip where everything went wrong but somehow felt right — because you were there. You turn any disaster into the best story we tell at every family gathering.',
    glow: 'rgba(52,211,153,0.3)', border: 'rgba(52,211,153,0.3)',
  },
  {
    id: 6, emoji: '🌟', year: 'Today & Beyond', icon: '🚀',
    title: 'The Best Is Yet To Come',
    description: 'Today you turn another year older — wiser, stronger, and more incredible than ever. The future holds nothing but beautiful chapters for you. And I\'ll be right there, cheering the loudest.',
    glow: 'rgba(255,107,157,0.3)', border: 'rgba(255,107,157,0.3)',
  },
];

function MemoryCard({ memory, index }: { memory: typeof MEMORIES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`flex items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col`}>
      {/* Card */}
      <motion.div
        className="flex-1 glass rounded-2xl p-6 md:p-8 relative overflow-hidden cursor-default"
        style={{ border: `1px solid ${memory.border}` }}
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        whileHover={{ scale: 1.02, y: -4, boxShadow: `0 12px 40px ${memory.glow}` }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: memory.glow }} />
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
          style={{ background: `${memory.glow}33`, border: `1px solid ${memory.glow}`, color: '#fff' }}>
          {memory.year}
        </span>
        <div className="flex items-start gap-4">
          <motion.div className="text-4xl flex-shrink-0"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            {memory.emoji}
          </motion.div>
          <div>
            <h3 className="font-poppins font-bold text-xl text-white mb-2">{memory.title}</h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{memory.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Timeline dot */}
      <motion.div className="relative flex-shrink-0 hidden md:flex items-center justify-center"
        initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl z-10 relative"
          style={{ background: `linear-gradient(135deg, ${memory.glow}, rgba(10,10,15,0.9))`, border: `2px solid ${memory.glow}`, boxShadow: `0 0 20px ${memory.glow}` }}>
          {memory.icon}
        </div>
        <motion.div className="absolute w-14 h-14 rounded-full"
          style={{ border: `1px solid ${memory.glow}` }}
          animate={{ scale: [1, 2], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity }} />
      </motion.div>

      <div className="flex-1 hidden md:block" />
    </div>
  );
}

export default function MemorySection({ name }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="memories" className="relative py-24 px-4 z-10">
      <div ref={ref} className="text-center mb-20 max-w-2xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-pink-400 text-sm font-semibold tracking-widest uppercase mb-3">
          🎞️ Memory Lane
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-poppins font-black text-4xl md:text-5xl text-white mb-4">
          Our Story, <span className="gradient-text">{name.split(' ')[0]}</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }} className="text-gray-400 text-lg">
          A lifetime of moments worth celebrating — every single one.
        </motion.p>
      </div>

      <div className="max-w-5xl mx-auto relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden md:block"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,107,157,0.5) 20%, rgba(155,89,182,0.5) 80%, transparent)' }} />
        <div className="flex flex-col gap-16">
          {MEMORIES.map((m, i) => <MemoryCard key={m.id} memory={m} index={i} />)}
        </div>
      </div>
    </section>
  );
}
