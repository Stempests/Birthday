'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Background music player using HTML5 Audio API
 * Plays a local mp3 file from the public folder.
 */

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Auto-dismiss banner after 8 s
    const t = setTimeout(() => setShowBanner(false), 8000);
    return () => clearTimeout(t);
  }, []);

  const toggle = () => {
    setShowBanner(false);
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      setPlaying(true);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* ── Hidden HTML5 Audio Element ─────────────────────────────────── */}
      <audio
        ref={audioRef}
        src="/music/happy-birthday.mp3"
        loop
        preload="auto"
      />

      {/* ── "Tap to play" nudge banner ─────────────────────────────────── */}
      <AnimatePresence>
        {showBanner && (
          <motion.button
            key="banner"
            onClick={toggle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="fixed bottom-24 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold text-white select-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,157,0.92), rgba(155,89,182,0.92))',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,107,157,0.6)',
              boxShadow: '0 4px 24px rgba(255,107,157,0.55)',
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              🎵
            </motion.span>
            Tap to play music
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Main toggle button ─────────────────────────────────────────── */}
      <motion.button
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        className="fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center select-none"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
        style={{
          background: playing
            ? 'linear-gradient(135deg, #FF6B9D, #9B59B6)'
            : 'linear-gradient(135deg, rgba(255,107,157,0.22), rgba(155,89,182,0.22))',
          border: '1.5px solid rgba(255,107,157,0.6)',
          backdropFilter: 'blur(14px)',
          boxShadow: playing
            ? '0 0 30px rgba(255,107,157,0.8)'
            : '0 2px 14px rgba(0,0,0,0.45)',
          transition: 'background 0.35s, box-shadow 0.35s',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={playing ? 'on' : 'off'}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 30 }}
            transition={{ duration: 0.2 }}
            className="text-2xl"
          >
            {playing ? '🎵' : '🔇'}
          </motion.span>
        </AnimatePresence>

        {/* Ripple rings when playing */}
        {playing && (
          <>
            <span className="absolute inset-0 rounded-full border border-pink-400 animate-ping opacity-60" />
            <span
              className="absolute rounded-full border border-pink-500/30 animate-ping opacity-30"
              style={{ inset: -6, animationDelay: '0.45s' }}
            />
          </>
        )}
      </motion.button>
    </>
  );
}
