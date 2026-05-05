'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface Props { name: string; }

// ── Edit these messages to personalise ────────────────────────────────────────────
const getMessages = (name: string) => [
  {
    id: 1, icon: '❤️',
    title: 'To My Dearest Brother',
    text: `Hey ${name}, on this special day I want to remind you of something you already know deep in your heart — you are extraordinary. Not just as a brother, but as a human being. Your kindness, your strength, and your beautiful soul inspire everyone around you. I am so incredibly lucky to call you my brother.`,
    color: 'rgba(255,107,157,0.2)', border: 'rgba(255,107,157,0.4)',
  },
  {
    id: 2, icon: '🌟',
    title: 'A Promise From Me',
    text: `No matter where life takes us — across cities, across seas, or just across the room — know that I will always be there. Through your highest highs and your lowest lows. Through every dream you chase and every obstacle you face. I am your biggest fan, your loudest cheerleader, and your forever family.`,
    color: 'rgba(155,89,182,0.2)', border: 'rgba(155,89,182,0.4)',
  },
  {
    id: 3, icon: '🚀',
    title: 'What Lies Ahead',
    text: `The world has not even seen your best yet. Every single day you prove that greatness is not just a destination — it is a way of living. This birthday is not just another year older; it is a reminder that your journey is just getting started. The universe has the most magical things planned for you.`,
    color: 'rgba(255,215,0,0.15)', border: 'rgba(255,215,0,0.4)',
  },
  {
    id: 4, icon: '🎊',
    title: `Today Is Yours, ${name}`,
    text: `Today, the stars align for you. The sun shines a little brighter because YOU are in this world. Every laugh is louder, every color is bolder, every moment is more alive because you exist. Happy Birthday, ${name} — you deserve every happiness this universe can offer. We love you endlessly. ❤️`,
    color: 'rgba(78,205,196,0.15)', border: 'rgba(78,205,196,0.4)',
  },
];

// ── Typing animation hook ────────────────────────────────────────────────────
function useTyping(text: string, speed = 22, startDelay = 400) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const t0 = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setDone(true); }
      }, speed);
      return () => clearInterval(id);
    }, startDelay);
    return () => clearTimeout(t0);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

type MessageItem = ReturnType<typeof getMessages>[0];
function MessageCard({ msg, index }: { msg: MessageItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(false);
  const { displayed, done } = useTyping(active ? msg.text : '', 18, 100);

  useEffect(() => { if (inView && index === 0) setActive(true); }, [inView, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden cursor-pointer"
      style={{ background: msg.color, border: `1px solid ${msg.border}` }}
      onClick={() => setActive(true)}
    >
      {/* Glow blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-30"
        style={{ background: msg.border }} />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <motion.span className="text-3xl"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            {msg.icon}
          </motion.span>
          <h3 className="font-poppins font-bold text-xl text-white">{msg.title}</h3>
        </div>

        <div className="min-h-[6rem]">
          {active ? (
            <p className="text-gray-200 leading-relaxed text-base">
              {displayed}
              {!done && (
                <motion.span className="inline-block w-0.5 h-4 bg-pink-400 ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }} />
              )}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-3 rounded-full bg-white/10"
                  style={{ width: `${100 - i * 10}%` }} />
              ))}
              <p className="text-pink-400 text-sm mt-2 font-medium">✨ Tap to reveal message</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MessageSection({ name }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="messages" className="relative py-24 px-4 z-10">
      <div ref={ref} className="text-center mb-16 max-w-2xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-pink-400 text-sm font-semibold tracking-widest uppercase mb-3">
          💌 From the Heart
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-poppins font-black text-4xl md:text-5xl text-white mb-4">
          Words for <span className="gradient-text">{name.split(' ')[0]}</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }} className="text-gray-400">
          Some feelings are too big for words — but we&apos;ll try anyway. 💕
        </motion.p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {getMessages(name).map((msg, i) => (
          <MessageCard key={msg.id} msg={msg} index={i} />
        ))}
      </div>
    </section>
  );
}
