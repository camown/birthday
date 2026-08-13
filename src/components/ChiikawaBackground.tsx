import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundFx } from '../lib/audio';

export const ChiikawaBackground: React.FC = () => {
  const [usagiKey, setUsagiKey] = useState(0);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsagiKey((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const triggerCharacterPop = (name: string, sound: string) => {
    setActiveSpeech(`${name}: ${sound}`);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#f472b6', '#fb7185', '#fde047', '#60a5fa'],
    });

    setTimeout(() => {
      setActiveSpeech(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Tap Pop Speech Indicator */}
      <AnimatePresence>
        {activeSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-rose-950/90 text-rose-100 text-xs sm:text-sm font-extrabold shadow-2xl border-2 border-rose-300 z-50 pointer-events-none flex items-center gap-2 backdrop-blur-md"
          >
            <span>✨</span>
            <span>{activeSpeech}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Official Ninja Chiikawa (Top Left) */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          repeat: Infinity,
          duration: 4.2,
          ease: 'easeInOut',
        }}
        className="absolute top-16 left-3 sm:left-8 z-20 pointer-events-auto"
      >
        <img
          src="/chiikawa-ninja.png"
          alt="Ninja Chiikawa"
          onClick={() => triggerCharacterPop("Ninja Chiikawa", "Yaaah! ⚔️✨")}
          className="w-20 h-20 sm:w-26 sm:h-26 object-contain mix-blend-multiply hover:scale-110 transition-transform cursor-pointer filter drop-shadow-sm"
        />
      </motion.div>

      {/* 2. Official Usagi Standing (Top Right) */}
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [2, -2, 2],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: 'easeInOut',
        }}
        className="absolute top-20 right-3 sm:right-8 z-20 pointer-events-auto"
      >
        <img
          src="/usagi-standing.png"
          alt="Usagi Standing"
          onClick={() => triggerCharacterPop("Usagi", "URAAA! ⚡⚡")}
          className="w-20 h-20 sm:w-26 sm:h-26 object-contain mix-blend-multiply hover:scale-110 transition-transform cursor-pointer filter drop-shadow-sm"
        />
      </motion.div>

      {/* 3. Official Usagi Running across the bottom screen! */}
      <AnimatePresence>
        <motion.div
          key={usagiKey}
          initial={{ x: '-20vw', y: 0 }}
          animate={{ x: '115vw', y: [0, -15, 0, -15, 0] }}
          transition={{
            x: { duration: 11, ease: 'linear' },
            y: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
          }}
          className="absolute bottom-6 sm:bottom-10 left-0 z-20 pointer-events-auto flex items-center"
        >
          <img
            src="/usagi-running.png"
            alt="Usagi Running"
            onClick={() => triggerCharacterPop("Usagi", "HAHA! Yaha! ⚡🏃")}
            className="w-24 h-24 sm:w-30 sm:h-30 object-contain mix-blend-multiply hover:scale-110 transition-transform cursor-pointer filter drop-shadow-sm"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};


