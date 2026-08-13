import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Mic, Wind, Flame, Heart, Send, Sparkles, ArrowRight, Scissors } from 'lucide-react';
import { soundFx } from '../lib/audio';
import { GIF_URLS, ChiikawaGIFImage } from './ChiikawaBackground';

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

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  recipientName,
  turningAge,
  onNextSurprise,
}) => {
  const candleCount = Math.min(7, Math.max(3, turningAge > 0 ? 5 : 5));
  const [candlesState, setCandlesState] = useState<boolean[]>(() =>
    Array(candleCount).fill(true)
  );

  const [micActive, setMicActive] = useState(false);
  const [blowLevel, setBlowLevel] = useState(0);
  const [showWishModal, setShowWishModal] = useState(false);
  const [showSliceModal, setShowSliceModal] = useState(false);
  const [isSliced, setIsSliced] = useState(false);
  const [wishText, setWishText] = useState('');
  const [wishSaved, setWishSaved] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const blowTimeoutRef = useRef<number | null>(null);

  const allCandlesOut = candlesState.every((lit) => !lit);

  const handleToggleCandle = (idx: number) => {
    soundFx.playBlowout();
    setCandlesState((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];

      const nowAllOut = next.every((lit) => !lit);
      if (nowAllOut) {
        soundFx.playFanfare();
        confetti({
          particleCount: 180,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#fb7185', '#fda4af', '#fde047', '#e879f9', '#a7f3d0'],
        });
        setTimeout(() => setShowWishModal(true), 1100);
      }
      return next;
    });
  };

  const handleExtinguishAll = () => {
    setCandlesState(Array(candleCount).fill(false));
    soundFx.playBlowout();
    soundFx.playFanfare();

    confetti({
      particleCount: 180,
      spread: 110,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fb7185', '#fda4af', '#fde047', '#e879f9', '#a7f3d0'],
    });

    setTimeout(() => {
      setShowWishModal(true);
    }, 1100);

    stopMic();
  };

  const handleRelightAll = () => {
    setCandlesState(Array(candleCount).fill(true));
    setWishSaved(false);
    setIsSliced(false);
  };

  const handleSliceCake = () => {
    soundFx.playUnlock();
    setIsSliced(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#fda4af', '#fde047', '#f472b6'],
    });
    setTimeout(() => {
      setShowSliceModal(true);
    }, 600);
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      source.connect(analyser);
      setMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let blowAccumulator = 0;

      const checkVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setBlowLevel(normalized);

        if (normalized > 35) {
          blowAccumulator += 1;
          if (blowAccumulator > 8) {
            handleExtinguishAll();
            return;
          }
        } else {
          blowAccumulator = Math.max(0, blowAccumulator - 1);
        }

        blowTimeoutRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn('Mic error:', err);
      alert('Microphone access unavailable. Tap directly on each candle to blow them out!');
      setMicActive(false);
    }
  };

  const stopMic = () => {
    if (blowTimeoutRef.current) cancelAnimationFrame(blowTimeoutRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setMicActive(false);
    setBlowLevel(0);
  };

  useEffect(() => {
    return () => stopMic();
  }, []);

  const handleSaveWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    setWishSaved(true);
    soundFx.playUnlock();
    setTimeout(() => {
      setShowWishModal(false);
    }, 1200);
  };

  return (
    <div className="py-6 md:py-10 max-w-4xl mx-auto px-4 text-center select-none font-nunito">
      {/* Title */}
      <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-2 font-fredoka tracking-tight drop-shadow-sm">
        Make a Wish, {recipientName}! 🕯️
      </h2>
      <p className="text-slate-600 text-xs sm:text-sm md:text-base mb-6 max-w-lg mx-auto font-bold">
        Tap individual candles or blow into your microphone to extinguish the birthday flames!
      </p>

      {/* Grand 2.5D Vector Cake Stage Container */}
      <div className="relative my-6 py-4 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
        {/* Left Companion Chiikawa GIF */}
        <div className="hidden sm:block">
          <ChiikawaGIFImage
            src={GIF_URLS.chiikawaBirthday}
            alt="Chiikawa Birthday GIF"
            className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 filter drop-shadow-md"
          />
        </div>

        {/* Center Grand Cake Block */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Fruit Toppings Perched on Top Layer */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 mb-[-14px] z-25 pointer-events-none">
            <StrawberryIcon className="w-7 h-7 sm:w-9 sm:h-9 transform -rotate-12 animate-pulse" />
            <CherriesIcon className="w-8 h-8 sm:w-10 sm:h-10 transform rotate-6" />
            <StrawberryIcon className="w-7 h-7 sm:w-9 sm:h-9 transform rotate-12 animate-pulse" />
          </div>

          {/* Interactive Birthday Candles */}
          <div className="flex justify-center gap-5 sm:gap-8 md:gap-10 mb-[-12px] z-30">
            {candlesState.map((isLit, idx) => (
              <div
                key={idx}
                onClick={() => handleToggleCandle(idx)}
                title="Tap to blow out candle!"
                className="relative cursor-pointer group flex flex-col items-center"
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
                      className="relative w-6 h-8 sm:w-8 sm:h-10 flex items-end justify-center"
                    >
                      <div className="absolute inset-0 bg-amber-400/90 rounded-full blur-xs animate-pulse" />
                      <div className="w-4 h-6 sm:w-5 sm:h-7 bg-gradient-to-t from-rose-500 via-amber-300 to-yellow-100 rounded-full shadow-md" />
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
                <div className="w-4 sm:w-5 h-14 sm:h-20 bg-gradient-to-b from-rose-200 via-pink-200 to-rose-300 rounded-t-md shadow-md border-x border-pink-300/80 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-2 h-1.5 bg-white/90 transform -rotate-12 scale-125" />
                  <div className="absolute inset-x-0 top-6 h-1.5 bg-white/90 transform -rotate-12 scale-125" />
                  <div className="absolute inset-x-0 top-10 h-1.5 bg-white/90 transform -rotate-12 scale-125" />
                  <div className="absolute inset-x-0 top-14 h-1.5 bg-white/90 transform -rotate-12 scale-125" />
                </div>
              </div>
            ))}
          </div>

          {/* Cake Cut Line Animation */}
          {isSliced && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 0.5 }}
              className="absolute top-10 bottom-4 w-1 bg-rose-600 z-40 shadow-lg shadow-rose-300 pointer-events-none"
            />
          )}

          {/* 3 Tier Grand 2.5D Vector Cake */}
          <div className="flex flex-col items-center filter drop-shadow-xl">
            {/* Top Tier */}
            <div className="w-64 sm:w-80 md:w-[380px] h-20 sm:h-24 md:h-28 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 rounded-t-3xl border-b-4 border-rose-300 relative flex items-center justify-center shadow-md overflow-visible">
              <PipedCreamRow count={10} />
              <ScallopedFrostingDrips color="#FFF1F2" />
              <span className="text-rose-700 font-extrabold text-sm sm:text-base md:text-lg tracking-wider uppercase font-fredoka drop-shadow-xs z-20">
                Happy Birthday! 🎂
              </span>
            </div>

            {/* Middle Tier */}
            <div className="w-80 sm:w-[420px] md:w-[500px] h-24 sm:h-28 md:h-32 bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 border-b-4 border-rose-500 relative flex items-center justify-center shadow-lg overflow-visible">
              <PipedCreamRow count={14} />
              <ScallopedFrostingDrips color="#FCE7F3" />
              <div className="flex items-center gap-3 text-white font-black z-20">
                <Heart className="w-5 h-5 fill-white text-white drop-shadow-xs" />
                <span className="text-white text-base sm:text-lg md:text-xl tracking-wider font-fredoka drop-shadow-sm">
                  Turning {turningAge}! 💕
                </span>
                <Heart className="w-5 h-5 fill-white text-white drop-shadow-xs" />
              </div>
            </div>

            {/* Bottom Tier */}
            <div className="w-96 sm:w-[500px] md:w-[600px] h-28 sm:h-34 md:h-40 bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 rounded-b-3xl border-t-2 border-white/50 relative flex items-center justify-center shadow-2xl overflow-visible">
              <PipedCreamRow count={18} />
              <ScallopedFrostingDrips color="#FBCFE8" />
              <span className="text-white font-extrabold text-lg sm:text-2xl md:text-3xl tracking-wide uppercase font-fredoka [text-shadow:_0_2px_8px_rgba(0,0,0,0.25)] z-20">
                ✨ {recipientName} ✨
              </span>
            </div>

            {/* Grand Cake Stand Base Plate */}
            <div className="w-[410px] sm:w-[540px] md:w-[640px] h-7 sm:h-9 bg-gradient-to-r from-slate-200 via-white to-slate-200 rounded-full shadow-2xl border-t-2 border-slate-300 relative flex items-center justify-center">
              <div className="w-full h-1 bg-slate-300/60 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Companion Chiikawa Trio GIF */}
        <div className="hidden sm:block">
          <ChiikawaGIFImage
            src={GIF_URLS.chiikawaTrio}
            alt="Chiikawa Trio GIF"
            className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 filter drop-shadow-md"
          />
        </div>
      </div>

      {/* Blowout & Slice Cake Interactive Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {!allCandlesOut ? (
          <>
            <button
              onClick={handleExtinguishAll}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-rose-200 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-200" />
              <span>Blow Out All Candles 🕯️</span>
            </button>

            <button
              onClick={micActive ? stopMic : startMic}
              className={`px-6 py-3.5 rounded-2xl border text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                micActive
                  ? 'bg-rose-100 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-white border-rose-200 text-slate-700 hover:bg-rose-50 shadow-xs'
              }`}
            >
              {micActive ? (
                <>
                  <Mic className="w-4 h-4 text-rose-600 animate-bounce" />
                  <span>Listening... Blow! ({blowLevel}%)</span>
                </>
              ) : (
                <>
                  <Wind className="w-4 h-4 text-slate-500" />
                  <span>Enable Mic Blow</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleRelightAll}
              className="px-5 py-3 rounded-2xl bg-white border border-rose-200 text-rose-700 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xs hover:bg-rose-50 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span>Relight Candles</span>
            </button>

            <button
              onClick={handleSliceCake}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-200 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Scissors className="w-4 h-4 text-amber-100" />
              <span>Slice Cake 🍰</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Button */}
      {onNextSurprise && (
        <div className="mt-10 pt-6 border-t border-rose-100/80 flex justify-center">
          <button
            onClick={onNextSurprise}
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>View Message 💌</span>
            <ArrowRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      )}

      {/* Angel Chiikawa Theme Banner */}
      <div className="mt-10 bg-pink-100/90 border-2 border-pink-200 rounded-3xl p-4 shadow-sm relative overflow-hidden flex flex-col items-center justify-center max-w-lg mx-auto">
        <span className="text-xs font-black text-pink-600 tracking-widest mb-2 font-fredoka">
          \ てんし ANGEL CHIIKAWA /
        </span>

        {/* Main Angel Wallpaper preview */}
        <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden shadow-sm border border-pink-200 mb-3 relative">
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
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain mix-blend-multiply"
          />
          <p className="text-xs sm:text-sm font-extrabold text-pink-700 text-center px-2">
            "My babe!!, you're the most adorable and cutest woman that i have ever met!" ❤️
          </p>
          <img
            src="https://i.pinimg.com/736x/f2/9c/09/f29c09fd33b028685919a01440a634c6.jpg"
            alt="Angel Chiikawa Right"
            referrerPolicy="no-referrer"
            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full border-2 border-pink-300"
          />
        </div>
      </div>

      {/* Wish Seal Modal */}
      <AnimatePresence>
        {showWishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-rose-200 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative text-center"
            >
              <div className="mb-4">
                <Sparkles className="w-8 h-8 text-rose-500 mx-auto mb-2 animate-bounce" />
                <h3 className="text-xl font-bold text-slate-900 font-fredoka">
                  All Candles Extinguished! ✨
                </h3>
                <p className="text-xs text-slate-600 mt-1">Make your birthday wish, babe!</p>
              </div>

              {wishSaved ? (
                <div className="py-4 text-center text-rose-600 font-semibold flex flex-col items-center gap-1.5 text-xs">
                  <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-bounce" />
                  <span>Your birthday wish is sealed in the stars! 💖</span>
                </div>
              ) : (
                <form onSubmit={handleSaveWish} className="space-y-3">
                  <textarea
                    rows={2}
                    required
                    placeholder="Type your birthday wish..."
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    className="w-full bg-slate-50 border border-rose-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 font-nunito"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowWishModal(false)}
                      className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold cursor-pointer"
                    >
                      Skip
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Seal Wish</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cake Slice Message Card Modal */}
      <AnimatePresence>
        {showSliceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white border-2 border-pink-200 p-6 rounded-3xl max-w-sm w-full shadow-2xl text-center relative overflow-hidden"
            >
              <div className="text-4xl mb-2">🍰</div>
              <h3 className="text-2xl font-black text-rose-600 font-fredoka mb-1">
                A Sweet Slice for You!
              </h3>
              <p className="text-xs text-slate-600 font-bold mb-4">
                Here's a delicious slice of love baked with extra sweetness for {recipientName}!
              </p>

              <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 text-xs font-bold text-slate-700 leading-relaxed mb-4">
                "May your new age be filled with endless smiles, sweet moments, and all the love in the world! Happy Birthday my darling!" 🍓🌸
              </div>

              <button
                onClick={() => setShowSliceModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-200 cursor-pointer"
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
