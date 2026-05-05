'use client';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Touch swipe hook
function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef<number | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; },
    onTouchEnd: (e: React.TouchEvent) => {
      if (startX.current === null) return;
      const diff = startX.current - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? onLeft() : onRight();
      startX.current = null;
    },
  };
}

interface Props { name: string; }

const PHOTOS = [
  { id: 1, src: '/images/photo1.jpg', caption: 'Family is everything ❤️',           tag: 'Family',     objectPos: 'center center' },
  { id: 2, src: '/images/photo2.jpg', caption: 'Bhaiyaa — always smiling 😊',        tag: 'Bhaiyaa',    objectPos: 'center center' },
  { id: 3, src: '/images/photo3.jpg', caption: 'Conquering peaks 🏔️',               tag: 'Adventures', objectPos: 'center top'    },
  { id: 4, src: '/images/photo4.jpg', caption: 'Always fresh, always stylish 🌿',   tag: 'Vibes',      objectPos: 'center top'    },
  { id: 5, src: '/images/photo5.jpg', caption: 'Kerala backwaters 🦅',              tag: 'Travel',     objectPos: 'center top'    },
  { id: 6, src: '/images/photo6.jpg', caption: 'Looking sharp as always 😎',        tag: 'Style',      objectPos: 'center 20%'    },
];

// ── Mobile carousel sub-component with real touch swipe ──────────────────────
function MobileCarousel({
  active, setActive, setLightbox,
}: {
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  setLightbox: (p: typeof PHOTOS[0]) => void;
}) {
  const next = () => setActive(p => (p + 1) % PHOTOS.length);
  const prev = () => setActive(p => (p - 1 + PHOTOS.length) % PHOTOS.length);
  const swipe = useSwipe(next, prev);

  return (
    <div className="md:hidden px-4 max-w-lg mx-auto">
      {/* Card with swipe */}
      <div
        className="relative rounded-2xl overflow-hidden touch-pan-y"
        style={{ aspectRatio: '4/3' }}
        {...swipe}
        onClick={() => setLightbox(PHOTOS[active])}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={PHOTOS[active].src}
              alt={PHOTOS[active].caption}
              fill
              className="object-cover"
              style={{ objectPosition: PHOTOS[active].objectPos }}
            />
            {/* Minimal bottom gradient only — no text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Large touch arrows */}
        <button
          onClick={e => { e.stopPropagation(); prev(); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white text-xl z-10"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
        >‹</button>
        <button
          onClick={e => { e.stopPropagation(); next(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white text-xl z-10"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
        >›</button>

        {/* Swipe hint */}
        <div className="absolute top-3 right-3 text-[10px] text-white/50 font-medium tracking-widest">
          swipe ←→
        </div>
      </div>


      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-3">
        {PHOTOS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              background: i === active ? '#FF6B9D' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PhotoGallery({ name }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [lightbox, setLightbox] = useState<typeof PHOTOS[0] | null>(null);
  const [active, setActive] = useState(0); // for mobile carousel

  return (
    <section id="gallery" className="relative py-24 px-4 z-10">
      {/* Heading */}
      <div ref={ref} className="text-center mb-16 max-w-2xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">
          📸 Photo Gallery
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="font-poppins font-black text-4xl md:text-5xl text-white mb-4">
          A Life of <span className="gradient-text">Beautiful Moments</span>
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }} className="text-gray-400">
          Every picture tells a story, {name.split(' ')[0]}. Every smile is a treasure.
        </motion.p>
      </div>

      {/* Desktop grid — 2 cols top row + 3 cols bottom row */}
      <div className="hidden md:grid grid-cols-3 gap-6 max-w-6xl mx-auto">
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.id}
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{ aspectRatio: '4/3' }}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ scale: 1.03, zIndex: 10 }}
            onClick={() => setLightbox(photo)}
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ objectPosition: photo.objectPos }}
            />
            {/* Subtle glow border on hover — NO text caption */}
            <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-pink-500/50 transition-colors duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Mobile carousel — with touch swipe support */}
      <MobileCarousel active={active} setActive={setActive} setLightbox={setLightbox} />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ aspectRatio: '16/10' }}
            >
              <Image src={lightbox.src} alt={lightbox.caption} fill className="object-contain"
                style={{ objectPosition: lightbox.objectPos }} />
              <button onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-white text-xl hover:bg-pink-500/30 transition-colors">
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
