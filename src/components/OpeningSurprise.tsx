import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Heart, Sparkles, Volume2 } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface OpeningSurpriseProps {
  recipientName: string;
  turningAge: number;
  onOpen: () => void;
}

export const OpeningSurprise: React.FC<OpeningSurpriseProps> = ({
  recipientName,
  turningAge,
  onOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleUnwrap = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Play sound FX & start music
    soundFx.playPop();
    soundFx.playFanfare();
    soundFx.startMusic();

    // Fire big multi-stage confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f472b6', '#fb7185', '#fbbf24', '#c084fc', '#38bdf8', '#e879f9']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-950 via-purple-950 to-slate-950 text-white p-4 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-rose-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-lg w-full text-center flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl shadow-rose-950/80"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs md:text-sm font-medium tracking-wide mb-6">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>A Secret Delivery Just For You</span>
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 mb-3">
          Happy Birthday, {recipientName}!
        </h1>

        <p className="text-slate-300 text-sm md:text-base mb-8 max-w-sm">
          A special {turningAge}th birthday celebration made with love. Turn your sound on for the best experience! 🎵
        </p>

        {/* Animated Gift Box */}
        <div className="relative my-4 cursor-pointer group" onClick={handleUnwrap}>
          <motion.div
            animate={
              isOpening
                ? { scale: [1, 1.25, 0.9, 1.1, 0], rotate: [0, -10, 10, -5, 0] }
                : { y: [0, -10, 0] }
            }
            transition={
              isOpening
                ? { duration: 1 }
                : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
            }
            className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-2xl border-4 border-amber-300/60 relative overflow-hidden group-hover:scale-105 transition-transform"
          >
            {/* Box Ribbon */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-amber-300 shadow-md" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-amber-300 shadow-md" />

            <Gift className="w-16 h-16 text-amber-950 z-10 drop-shadow-md animate-bounce" />
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUnwrap}
          disabled={isOpening}
          className="mt-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-white font-bold text-lg shadow-xl shadow-rose-500/30 flex items-center gap-3 group transition-all"
        >
          <span>{isOpening ? 'Unwrapping Happiness...' : 'Tap To Unwrap Birthday Surprise'}</span>
          <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform" />
        </motion.button>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Volume2 className="w-3.5 h-3.5 text-amber-300" />
          <span>Interactive sound & music enabled</span>
        </div>
      </motion.div>
    </div>
  );
};
