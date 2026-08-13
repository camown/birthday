import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Gift, Heart, Sparkles, Volume2, Flower2 } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface OpeningSurpriseProps {
  recipientName: string;
  turningAge: number;
  onOpen: () => void;
}

// Typewriter component for sub heading
const TypewriterText: React.FC<{ text: string; speed?: number; delay?: number }> = ({
  text,
  speed = 40,
  delay = 400,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsDone(true);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, speed, delay]);

  return (
    <span className="inline">
      {displayedText}
      {!isDone && (
        <span className="inline-block w-[2px] h-4 sm:h-5 bg-rose-500 ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
};

// Generate floating hearts & flowers elements (slow, gentle floating speed)
const FLOATING_ITEMS = [
  { type: 'heart', emoji: '❤️', left: '5%', duration: 11, delay: 0, size: 'text-2xl' },
  { type: 'flower', emoji: '🌸', left: '12%', duration: 14, delay: 2, size: 'text-3xl' },
  { type: 'heart', emoji: '💖', left: '20%', duration: 12, delay: 1, size: 'text-2xl' },
  { type: 'flower', emoji: '🌷', left: '28%', duration: 15, delay: 4, size: 'text-3xl' },
  { type: 'heart', emoji: '💕', left: '35%', duration: 10, delay: 3, size: 'text-xl' },
  { type: 'flower', emoji: '🌺', left: '44%', duration: 13, delay: 0.5, size: 'text-2xl' },
  { type: 'heart', emoji: '💓', left: '52%', duration: 11.5, delay: 3.5, size: 'text-3xl' },
  { type: 'flower', emoji: '🌸', left: '60%', duration: 14.5, delay: 1.5, size: 'text-2xl' },
  { type: 'heart', emoji: '💗', left: '68%', duration: 12.5, delay: 5, size: 'text-3xl' },
  { type: 'flower', emoji: '🌼', left: '76%', duration: 16, delay: 2.5, size: 'text-2xl' },
  { type: 'heart', emoji: '❤️', left: '84%', duration: 11, delay: 0.8, size: 'text-2xl' },
  { type: 'flower', emoji: '🌸', left: '92%', duration: 15, delay: 3.8, size: 'text-3xl' },
];

export const OpeningSurprise: React.FC<OpeningSurpriseProps> = ({
  recipientName,
  onOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleUnwrap = () => {
    if (isOpening) return;
    setIsOpening(true);

    soundFx.playPop();
    soundFx.playFanfare();
    soundFx.startMusic();

    const count = 220;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#fda4af', '#fde047', '#e879f9', '#f43f5e', '#ff85a1']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-100 to-rose-200 text-slate-800 p-4 overflow-hidden select-none">
      {/* Cute Pink Radial Glows */}
      <div className="absolute w-[600px] h-[600px] bg-rose-300/40 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-pink-300/30 rounded-full blur-2xl top-10 left-10 pointer-events-none" />

      {/* Floating Hearts and Flowers Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_ITEMS.map((item, index) => (
          <motion.div
            key={index}
            initial={{ y: '100vh', opacity: 0.2 }}
            animate={{
              y: ['100vh', '-10vh'],
              opacity: [0, 0.9, 0.9, 0],
              x: ['0px', index % 2 === 0 ? '25px' : '-25px', '0px'],
              rotate: [0, index % 2 === 0 ? 20 : -20, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: 'easeInOut',
            }}
            style={{ left: item.left }}
            className={`absolute ${item.size} filter drop-shadow-sm`}
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Main Landing Card Container */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-lg w-full text-center flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl border-4 border-rose-200 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl"
      >
        {/* Top Floating Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-700 text-xs sm:text-sm font-extrabold mb-4 shadow-sm border border-rose-200"
        >
          <Sparkles className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>A Very Special Surprise For Babe</span>
          <Flower2 className="w-4 h-4 text-rose-500" />
        </motion.div>

        {/* Popping Big Text: Happy Birthday, Emily ❤️ */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-3xl sm:text-5xl font-black text-rose-600 tracking-tight leading-tight mb-3 drop-shadow-xs flex flex-wrap items-center justify-center gap-x-2 gap-y-1"
        >
          {`Happy Birthday, ${recipientName}`.split(' ').map((word, wIdx) => (
            <motion.span
              key={wIdx}
              initial={{ scale: 0.2, opacity: 0, y: -20, rotate: wIdx % 2 === 0 ? -6 : 6 }}
              animate={{ scale: [0.2, 1.15, 1], opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.25 + wIdx * 0.12,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="inline-block bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent"
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
            className="inline-block text-rose-500 ml-1"
          >
            ❤️
          </motion.span>
        </motion.h1>

        {/* Subtext Below with Typewriter Effect */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-slate-700 font-extrabold text-sm sm:text-base md:text-lg max-w-md leading-relaxed mb-5 px-2 text-center"
        >
          <TypewriterText
            text={`"My babe!!, you're the most adorable and cutest woman that i have ever met!" ❤️`}
            speed={40}
            delay={500}
          />
        </motion.p>

        {/* Angel Chiikawa Illustration Banner Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full bg-pink-100/90 border-2 border-pink-200 rounded-3xl p-3 mb-5 relative overflow-hidden flex flex-col items-center justify-center shadow-md group"
        >
          {/* Main Angel Chiikawa Wallpaper Image */}
          <div className="relative w-full h-40 sm:h-48 rounded-2xl overflow-hidden shadow-inner bg-pink-50 border border-pink-200">
            <img
              src="https://wallpapers.com/images/hd/chiikawa-angel-character-kbtmw1cie6d8th5q.jpg"
              alt="Chiikawa Angel Characters"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-transparent to-pink-900/10 pointer-events-none" />
            <div className="absolute bottom-2 left-0 right-0 text-center">
              <span className="text-xs font-black text-white bg-pink-600/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-sm border border-pink-300/40 inline-flex items-center gap-1">
                ✨ Angel Chiikawa Blessings For Emily ✨
              </span>
            </div>
          </div>

          {/* Left & Right Side Angel Avatars seamlessly blended */}
          <div className="flex items-center justify-around w-full px-4 mt-3">
            <img
              src="https://i.pinimg.com/originals/78/46/82/784682badeebdaaa0035fa4e50ebe50b.png"
              alt="Angel Chiikawa Left"
              referrerPolicy="no-referrer"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain mix-blend-multiply filter drop-shadow-sm animate-pulse"
            />

            <img
              src="https://i.pinimg.com/736x/f2/9c/09/f29c09fd33b028685919a01440a634c6.jpg"
              alt="Angel Chiikawa Right"
              referrerPolicy="no-referrer"
              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full border-2 border-pink-300 shadow-sm"
            />
          </div>
        </motion.div>

        {/* Interactive Gift Box Button */}
        <div className="w-full">
          <motion.button
            onClick={handleUnwrap}
            disabled={isOpening}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-rose-300/80 flex items-center justify-center gap-3 cursor-pointer transition-all border-2 border-rose-300"
          >
            <Gift className={`w-6 h-6 ${isOpening ? 'animate-spin' : 'animate-bounce'}`} />
            <span>{isOpening ? 'Opening Birthday Gift...' : 'Open Birthday Gift 🎁'}</span>
            <Heart className="w-5 h-5 fill-white text-white" />
          </motion.button>
        </div>

        <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500">
          <Volume2 className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>Turn on sound for birthday music & surprises!</span>
        </div>
      </motion.div>
    </div>
  );
};

