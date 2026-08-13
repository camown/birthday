import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, ArrowRight, Scissors } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface BirthdayCakeProps {
  recipientName: string;
  turningAge: number;
  onNextSurprise?: () => void;
}

// Vector Strawberry Icon
const StrawberryIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" className={`${className} filter drop-shadow-sm inline-block`}>
    <path
      d="M16 29C16 29 6 22 6 13C6 8 10 5 16 5C22 5 26 8 26 13C26 22 16 29 16 29Z"
      fill="#F43F5E"
    />
    <path
      d="M16 5C13 2 9 3 9 3C9 3 11 7 14 7C17 7 19 3 19 3C19 3 23 2 20 5C18 7 16 5 16 5Z"
      fill="#22C55E"
    />
    <circle cx="11" cy="12" r="1" fill="#FEF08A" />
    <circle cx="15" cy="16" r="1" fill="#FEF08A" />
    <circle cx="21" cy="13" r="1" fill="#FEF08A" />
    <circle cx="18" cy="21" r="1" fill="#FEF08A" />
    <circle cx="13" cy="22" r="1" fill="#FEF08A" />
  </svg>
);

// Vector Twin Cherries Icon
const CherriesIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 32 32" className={`${className} filter drop-shadow-sm inline-block`}>
    <path d="M11 15Q15 6 20 4" stroke="#15803D" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M21 15Q17 8 20 4" stroke="#15803D" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="10" cy="19" r="6" fill="#E11D48" />
    <circle cx="22" cy="19" r="6" fill="#BE123C" />
    <circle cx="8" cy="17" r="2" fill="#FDA4AF" opacity="0.8" />
    <circle cx="20" cy="17" r="2" fill="#FDA4AF" opacity="0.8" />
  </svg>
);

// Scalloped Frosting Drips SVG Border
const ScallopedFrostingDrips: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-4',
  color = '#FCE7F3',
}) => (
  <svg
    viewBox="0 0 600 24"
    preserveAspectRatio="none"
    className={`${className} absolute left-0 right-0 -bottom-3 z-10 pointer-events-none drop-shadow-xs`}
  >
    <path
      d="M0,0 L600,0 L600,6 C580,18 560,18 540,6 C520,22 500,22 480,6 C460,18 440,18 420,6 C400,22 380,22 360,6 C340,18 320,18 300,6 C280,22 260,22 240,6 C220,18 200,18 180,6 C160,22 140,22 120,6 C100,18 80,18 60,6 C40,22 20,22 0,6 Z"
      fill={color}
    />
  </svg>
);

// Piped Cream Pearls Row Component
const PipedCreamRow: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="absolute -top-2.5 inset-x-0 flex justify-between px-2 z-20 pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-b from-white via-pink-50 to-pink-100 shadow-sm border border-pink-200/80 transform -translate-y-1/2"
      />
    ))}
  </div>
);

// Cute custom Vector Knife for splitting animation
const CutKnife: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 64 64" className={className} style={{ transform: 'rotate(-45deg)' }}>
    {/* Blade pointing down to the right */}
    <path d="M20 20 L40 20 L30 45 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" strokeLinejoin="round" />
    {/* Blade cutting edge */}
    <path d="M30 45 L40 20" stroke="#CBD5E1" strokeWidth="1.5" />
    {/* Guard */}
    <rect x="18" y="16" width="28" height="4" rx="1" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
    {/* Handle */}
    <rect x="27" y="2" width="10" height="14" rx="2" fill="#F43F5E" stroke="#E11D48" strokeWidth="1.5" />
    {/* Pommel */}
    <circle cx="32" cy="2" r="3" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
  </svg>
);

// Gorgeous layered Vector Cake Slice Graphic
const CakeSliceGraphic: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => (
  <svg viewBox="0 0 64 64" className={className}>
    {/* Left side sponge/cream face */}
    <path d="M 12 36 L 32 48 L 32 20 L 12 12 Z" fill="#FEE2E2" stroke="#FDA4AF" strokeWidth="1" />
    {/* Right side sponge/cream face */}
    <path d="M 32 48 L 52 36 L 52 12 L 32 20 Z" fill="#FFF1F2" stroke="#FDA4AF" strokeWidth="1" />

    {/* Left cream filling layers */}
    <path d="M 12 26 L 32 35 L 32 37 L 12 28 Z" fill="#F43F5E" />
    <path d="M 12 18 L 32 27 L 32 29 L 12 20 Z" fill="#F43F5E" />

    {/* Right cream filling layers */}
    <path d="M 32 35 L 52 26 L 52 28 L 32 37 Z" fill="#F43F5E" />
    <path d="M 32 27 L 52 18 L 52 20 L 32 29 Z" fill="#F43F5E" />

    {/* Top pink frosting */}
    <path d="M 12 12 L 32 20 L 52 12 L 32 4 Z" fill="#FB7185" stroke="#F43F5E" strokeWidth="1" />

    {/* Whipped cream dollop on top */}
    <circle cx="32" cy="14" r="5" fill="#FFFFFF" />
    <circle cx="30" cy="12" r="3" fill="#FFF5F5" />
    <circle cx="34" cy="15" r="2.5" fill="#FFF5F5" />

    {/* Strawberry on top */}
    <path d="M 32 10 C 29 10, 28 6, 32 3 C 36 6, 35 10, 32 10 Z" fill="#E11D48" />
    <circle cx="31" cy="7" r="0.5" fill="#FDE047" />
    <circle cx="33" cy="7" r="0.5" fill="#FDE047" />
    <circle cx="32" cy="5" r="0.5" fill="#FDE047" />
  </svg>
);

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  recipientName,
  turningAge,
  onNextSurprise,
}) => {
  const candleCount = 5;
  const [candlesState] = useState<boolean[]>(() => Array(candleCount).fill(true));
  const [showSliceModal, setShowSliceModal] = useState(false);
  const [isSliced, setIsSliced] = useState(false);
  const [isCutting, setIsCutting] = useState(false);

  const handleSliceCake = () => {
    soundFx.playUnlock();
    setIsCutting(true);

    setTimeout(() => {
      setIsCutting(false);
      setIsSliced(true);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fda4af', '#fde047', '#f472b6', '#ffffff'],
      });

      setTimeout(() => {
        setShowSliceModal(true);
      }, 800);
    }, 350);
  };

  const renderCakeContent = () => (
    <div className="flex flex-col items-center">
      {/* Fruit Toppings Perched on Top Layer */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 mb-[-14px] z-25 pointer-events-none">
        <StrawberryIcon className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 transform -rotate-12 animate-pulse" />
        <CherriesIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transform rotate-6" />
        <StrawberryIcon className="w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 transform rotate-12 animate-pulse" />
      </div>

      {/* Birthday Candles */}
      <div className="flex justify-center gap-5 sm:gap-8 md:gap-10 lg:gap-12 mb-[-12px] z-30">
        {candlesState.map((isLit, idx) => (
          <div
            key={idx}
            className="relative flex flex-col items-center"
          >
            <AnimatePresence mode="wait">
              {isLit ? (
                <motion.div
                  key="flame"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{
                    scale: [1, 1.2, 0.95, 1],
                    rotate: [-4, 4, -2, 0],
                    opacity: 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 0.5 + idx * 0.12 }}
                  className="relative w-6 h-8 sm:w-8 sm:h-10 lg:w-10 lg:h-12 xl:w-12 xl:h-14 flex items-end justify-center"
                >
                  <div className="absolute inset-0 bg-amber-400/90 rounded-full blur-xs animate-pulse" />
                  <div className="w-4 h-6 sm:w-5 sm:h-7 lg:w-6 lg:h-9 bg-gradient-to-t from-rose-500 via-amber-300 to-yellow-100 rounded-full shadow-md" />
                </motion.div>
              ) : (
                <motion.div
                  key="smoke"
                  initial={{ y: 0, opacity: 0.9, scale: 0.6 }}
                  animate={{ y: -36, opacity: 0, scale: 2.2 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  className="w-5 h-5 bg-slate-300 rounded-full blur-xs"
                />
              )}
            </AnimatePresence>

            {/* Candle Body with Stripe Pattern */}
            <div className="w-4 sm:w-5 lg:w-6 xl:w-7 h-14 sm:h-20 lg:h-24 xl:h-28 bg-gradient-to-b from-rose-200 via-pink-200 to-rose-300 rounded-t-md shadow-md border-x border-pink-300/80 relative overflow-hidden">
              <div className="absolute inset-x-0 top-2 h-1.5 bg-white/90 transform -rotate-12 scale-125" />
              <div className="absolute inset-x-0 top-6 h-1.5 bg-white/90 transform -rotate-12 scale-125" />
              <div className="absolute inset-x-0 top-10 h-1.5 bg-white/90 transform -rotate-12 scale-125" />
              <div className="absolute inset-x-0 top-14 h-1.5 bg-white/90 transform -rotate-12 scale-125" />
              <div className="absolute inset-x-0 top-18 h-1.5 bg-white/90 transform -rotate-12 scale-125" />
            </div>
          </div>
        ))}
      </div>

      {/* 3 Tier Grand 2.5D Vector Cake (Clean frosting without text) */}
      <div className="flex flex-col items-center filter drop-shadow-xl">
        {/* Top Tier */}
        <div className="w-64 sm:w-80 md:w-[380px] lg:w-[480px] xl:w-[540px] h-20 sm:h-24 md:h-28 lg:h-30 xl:h-34 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 rounded-t-3xl border-b-4 border-rose-300 relative flex items-center justify-center shadow-md overflow-visible">
          <PipedCreamRow count={10} />
          <ScallopedFrostingDrips color="#FFF1F2" />
        </div>

        {/* Middle Tier */}
        <div className="w-80 sm:w-[420px] md:w-[500px] lg:w-[600px] xl:w-[680px] h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 border-b-4 border-rose-500 relative flex items-center justify-center shadow-lg overflow-visible">
          <PipedCreamRow count={14} />
          <ScallopedFrostingDrips color="#FCE7F3" />
        </div>

        {/* Bottom Tier */}
        <div className="w-96 sm:w-[500px] md:w-[600px] lg:w-[720px] xl:w-[820px] h-28 sm:h-34 md:h-40 lg:h-44 xl:h-48 bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 rounded-b-3xl border-t-2 border-white/50 relative flex items-center justify-center shadow-2xl overflow-visible">
          <PipedCreamRow count={18} />
          <ScallopedFrostingDrips color="#FBCFE8" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-8 md:py-12 max-w-6xl mx-auto px-4 text-center select-none font-nunito">
      {/* Title */}
      <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-rose-500 mb-6 font-dancing tracking-normal drop-shadow-[0_4px_12px_rgba(244,63,94,0.25)] leading-tight">
        Happy Birthday, My babe!!! 💖
      </h2>

      {/* Grand 2.5D Vector Cake Stage Container */}
      <div className="relative my-6 py-4 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 xl:gap-16">
        {/* Left Companion Chiikawa Eating Bread */}
        <div className="hidden md:block">
          <img
            src="/chiikawa-eating-bread.png"
            alt="Chiikawa Eating Bread"
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain mix-blend-multiply hover:scale-110 transition-transform cursor-pointer filter drop-shadow-sm"
          />
        </div>

        {/* Center Cake Stage Wrapper */}
        <div className="relative w-full max-w-lg sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl min-h-[350px] sm:min-h-[450px] lg:min-h-[550px] flex flex-col items-center justify-center">

          {/* Cake Cut Line / Knife Cutting */}
          <AnimatePresence>
            {isCutting && (
              <motion.div
                initial={{ y: -200, opacity: 0, rotate: -45 }}
                animate={{ y: 50, opacity: 1, rotate: -15 }}
                exit={{ y: 250, opacity: 0, rotate: 15 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute left-[calc(50%-32px)] z-50 pointer-events-none"
              >
                <CutKnife className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-md" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cake Split Layers */}
          <div className="relative w-full flex flex-col items-center">
            {/* Left Half */}
            <motion.div
              animate={isSliced ? { x: -50, rotate: -3, y: 10 } : { x: 0, rotate: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
              className="w-full z-20"
            >
              {renderCakeContent()}
            </motion.div>

            {/* Right Half (Absolute positioning to align perfectly) */}
            <motion.div
              animate={isSliced ? { x: 50, rotate: 3, y: 10 } : { x: 0, rotate: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
              className="absolute inset-x-0 top-0 z-20"
            >
              {renderCakeContent()}
            </motion.div>
          </div>

          {/* Solid Base Plate underneath (does not split) */}
          <div className="w-[380px] sm:w-[500px] md:w-[600px] lg:w-[720px] xl:w-[820px] h-7 sm:h-9 bg-gradient-to-r from-slate-200 via-white to-slate-200 rounded-full shadow-2xl border-t-2 border-slate-300 relative flex items-center justify-center mt-[-4px] z-10">
            <div className="w-full h-1 bg-slate-300/60 rounded-full" />
          </div>

          {/* Floating Cake Slice rising from the gap */}
          <AnimatePresence>
            {isSliced && (
              <motion.div
                initial={{ scale: 0, y: 80, opacity: 0, rotate: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [-120, -140, -120],
                  rotate: 360,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  scale: { duration: 0.8, ease: 'easeOut' },
                  opacity: { duration: 0.8 },
                  rotate: { duration: 1.2, ease: 'easeOut' },
                  y: {
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut',
                    times: [0, 0.5, 1],
                  },
                }}
                className="absolute left-1/2 -translate-x-1/2 z-35 flex flex-col items-center pointer-events-none"
              >
                {/* Floating Slice Shadow */}
                <div className="absolute w-20 h-3 bg-pink-900/10 rounded-full blur-sm bottom-[-16px] animate-pulse" />

                {/* Sparkles trailing behind */}
                <Sparkles className="absolute -top-4 -left-4 w-6 h-6 text-amber-400 animate-bounce" />
                <Sparkles className="absolute -bottom-4 -right-4 w-6 h-6 text-rose-400 animate-ping" />

                <CakeSliceGraphic className="w-28 h-28 sm:w-36 sm:h-36 filter drop-shadow-lg" />
                <span className="mt-2 text-rose-600 font-extrabold text-xs sm:text-sm bg-white/95 px-3 py-1 rounded-full shadow-md border border-pink-200 font-fredoka whitespace-nowrap animate-bounce">
                  A Sweet Slice For You! 💕
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Companion Chiikawa Heart */}
        <div className="hidden md:block">
          <img
            src="/chiikawa-heart.png"
            alt="Chiikawa Heart Love"
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain mix-blend-multiply hover:scale-110 transition-transform cursor-pointer filter drop-shadow-sm"
          />
        </div>
      </div>

      {/* Prominent Action Controls: Slice Cake & View Message */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 mb-6">
        <button
          onClick={handleSliceCake}
          className="px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white font-black text-base sm:text-lg md:text-xl shadow-xl shadow-rose-300/60 flex items-center justify-center gap-3 active:scale-95 transition-all cursor-pointer border-2 border-rose-300"
        >
          <Scissors className="w-6 h-6 sm:w-7 sm:h-7 text-amber-100 animate-bounce" />
          <span>Slice Cake 🍰</span>
        </button>

        {onNextSurprise && (
          <button
            onClick={onNextSurprise}
            className="px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base sm:text-lg md:text-xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all cursor-pointer border-2 border-slate-700"
          >
            <span>Click here... 💌</span>
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
          </button>
        )}
      </div>

      {/* Angel Chiikawa Theme Banner */}
      <div className="mt-12 bg-pink-100/90 border-2 border-pink-200 rounded-[2rem] p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col items-center justify-center max-w-lg md:max-w-2xl mx-auto">
        <span className="text-xs sm:text-sm font-black text-pink-600 tracking-widest mb-3 font-fredoka">
          \ てんし ANGEL CHIIKAWA /
        </span>

        {/* Main Angel Wallpaper preview */}
        <div className="w-full h-32 sm:h-48 md:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-sm border border-pink-200 mb-4 relative">
          <img
            src="https://wallpapers.com/images/hd/chiikawa-angel-character-kbtmw1cie6d8th5q.jpg"
            alt="Angel Chiikawa Wallpaper"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/30 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="flex items-center justify-between w-full px-2 my-1">
          <img
            src="https://i.pinimg.com/originals/78/46/82/784682badeebdaaa0035fa4e50ebe50b.png"
            alt="Angel Chiikawa Left"
            referrerPolicy="no-referrer"
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain mix-blend-multiply"
            style={{ mixBlendMode: 'multiply', filter: 'contrast(185%) brightness(130%)' }}
          />
          <p className="text-xs sm:text-sm md:text-base font-extrabold text-pink-700 text-center px-4 leading-relaxed">
            "My babe!!, you're the most adorable and cutest woman that i have ever met!" ❤️
          </p>
          <img
            src="https://i.pinimg.com/736x/f2/9c/09/f29c09fd33b028685919a01440a634c6.jpg"
            alt="Angel Chiikawa Right"
            referrerPolicy="no-referrer"
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full border-2 border-pink-300"
          />
        </div>
      </div>

      {/* Cake Slice Message Card Modal */}
      <AnimatePresence>
        {showSliceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="bg-white border-4 border-pink-200 p-6 sm:p-10 rounded-[2.5rem] max-w-lg md:max-w-xl w-full shadow-2xl text-center relative overflow-hidden my-auto"
            >
              <div className="text-5xl sm:text-6xl mb-3 animate-bounce">🍰</div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-rose-600 font-fredoka mb-2 tracking-tight">
                Slice of cake for you my babe ^_^
              </h3>


              <div className="bg-pink-50 border-2 border-pink-200 rounded-3xl p-6 sm:p-8 text-base sm:text-lg md:text-xl font-extrabold text-slate-800 leading-relaxed mb-6 shadow-inner">
                "Many many many more birthdays to come my babe.. I can't wait to spend more birthdays with you 030" 🍓🌸
              </div>

              <button
                onClick={() => setShowSliceModal(false)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white text-base sm:text-lg md:text-xl font-black shadow-lg shadow-rose-300/80 cursor-pointer border border-rose-300 transition-all hover:scale-102 active:scale-95"
              >
                Close & Enjoy 💖
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
