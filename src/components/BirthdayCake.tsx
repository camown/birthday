import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Sparkles, Wind, Flame, Heart, Send } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface BirthdayCakeProps {
  recipientName: string;
  turningAge: number;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ recipientName, turningAge }) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [blowLevel, setBlowLevel] = useState(0); // 0 to 100
  const [showWishModal, setShowWishModal] = useState(false);
  const [wishText, setWishText] = useState('');
  const [wishSaved, setWishSaved] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const blowTimeoutRef = useRef<number | null>(null);

  // Extinguish candles logic
  const handleExtinguish = () => {
    if (!candlesLit) return;
    setCandlesLit(false);

    soundFx.playBlowout();
    soundFx.playFanfare();

    // Trigger celebratory confetti
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#fbbf24', '#38bdf8', '#fb7185', '#c084fc']
    });

    // Show wish modal after short delay
    setTimeout(() => {
      setShowWishModal(true);
    }, 1500);

    // Stop mic if active
    stopMic();
  };

  // Relight candles
  const handleRelight = () => {
    setCandlesLit(true);
    setWishSaved(false);
  };

  // Microphone audio volume monitoring
  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

        // Calculate average volume in low-mid frequencies (typical for air blowing)
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setBlowLevel(normalized);

        // Air blow usually produces steady high volume (> 35)
        if (normalized > 35) {
          blowAccumulator += 1;
          if (blowAccumulator > 12) { // sustained blow for ~0.3s
            handleExtinguish();
            return;
          }
        } else {
          blowAccumulator = Math.max(0, blowAccumulator - 1);
        }

        blowTimeoutRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn('Microphone permission denied or unsupported:', err);
      alert('Microphone access was denied or is unavailable. You can click on the candles directly to blow them out!');
      setMicActive(false);
    }
  };

  const stopMic = () => {
    if (blowTimeoutRef.current) {
      cancelAnimationFrame(blowTimeoutRef.current);
    }
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
    return () => {
      stopMic();
    };
  }, []);

  const handleSaveWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    setWishSaved(true);
    soundFx.playUnlock();
    setTimeout(() => {
      setShowWishModal(false);
    }, 1500);
  };

  const candleCount = 5; // 5 decorative candles on top tier

  return (
    <section id="cake" className="py-16 md:py-24 relative overflow-hidden bg-slate-900/40 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        
        {/* Section Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Interactive Birthday Ritual</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 mb-3">
          Make a Wish & Blow The Candles! 🕯️
        </h2>
        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto mb-10">
          Click the candles OR activate your microphone and blow directly into your device to extinguish the flames and make your {turningAge}th birthday wish come true!
        </p>

        {/* 3D Visual Birthday Cake Container */}
        <div className="relative my-8 py-10 flex flex-col items-center justify-center">
          
          {/* Cake Candles & Flames */}
          <div className="flex justify-center gap-4 md:gap-6 mb-[-8px] z-20">
            {Array.from({ length: candleCount }).map((_, idx) => (
              <div
                key={idx}
                onClick={handleExtinguish}
                title="Click to blow out candle!"
                className="relative cursor-pointer group flex flex-col items-center"
              >
                {/* Flame or Smoke */}
                <AnimatePresence>
                  {candlesLit ? (
                    <motion.div
                      key="flame"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: [1, 1.15, 0.95, 1.05, 1],
                        rotate: [-3, 3, -2, 2, 0],
                        opacity: 1,
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 0.6 + idx * 0.1 }}
                      className="relative w-5 h-7 md:w-6 md:h-8 flex items-end justify-center"
                    >
                      {/* Outer Glow */}
                      <div className="absolute inset-0 bg-amber-400 rounded-full blur-sm opacity-80 animate-pulse" />
                      {/* Inner Flame */}
                      <div className="w-3.5 h-5 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full shadow-lg" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="smoke"
                      initial={{ y: 0, opacity: 0.8, scale: 0.5 }}
                      animate={{ y: -40, opacity: 0, scale: 2 }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="w-4 h-4 bg-slate-400 rounded-full blur-md"
                    />
                  )}
                </AnimatePresence>

                {/* Candle Stick */}
                <div className="w-3 md:w-4 h-12 md:h-16 bg-gradient-to-b from-rose-200 via-pink-300 to-rose-400 rounded-t-sm shadow-md border-x border-pink-400/50 relative">
                  {/* Decorative stripes */}
                  <div className="absolute inset-x-0 top-2 h-1 bg-white/60" />
                  <div className="absolute inset-x-0 top-6 h-1 bg-white/60" />
                  <div className="absolute inset-x-0 top-10 h-1 bg-white/60" />
                </div>
              </div>
            ))}
          </div>

          {/* Cake Layers */}
          <div className="flex flex-col items-center shadow-2xl">
            {/* Top Cake Tier */}
            <div className="w-48 md:w-60 h-14 md:h-16 bg-gradient-to-r from-pink-300 via-rose-200 to-pink-300 rounded-t-3xl border-b-4 border-pink-400/60 relative flex items-center justify-center shadow-inner">
              <div className="absolute inset-x-0 top-0 h-3 bg-white/70 rounded-t-3xl border-b border-pink-300/80" />
              <span className="text-rose-700 font-extrabold text-sm md:text-base tracking-widest uppercase z-10">
                Happy {turningAge}th!
              </span>
            </div>

            {/* Middle Cake Tier */}
            <div className="w-64 md:w-80 h-16 md:h-20 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 border-b-4 border-rose-500/80 relative flex items-center justify-center shadow-md">
              <div className="absolute inset-x-0 top-0 h-4 bg-pink-200/80 rounded-b-xl" />
              <div className="flex gap-2 text-rose-200">
                <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
                <Sparkles className="w-4 h-4 text-amber-200" />
                <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
              </div>
            </div>

            {/* Bottom Cake Tier */}
            <div className="w-80 md:w-96 h-20 md:h-24 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 rounded-b-2xl border-t-2 border-white/20 relative flex items-center justify-center shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-4 bg-rose-200/60 rounded-b-xl" />
              <span className="text-white font-bold text-xs md:text-sm tracking-wider uppercase opacity-90">
                ✨ {recipientName} ✨
              </span>
            </div>

            {/* Plate Base */}
            <div className="w-96 md:w-[440px] h-5 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 rounded-full shadow-2xl border-t border-white" />
          </div>

        </div>

        {/* Controls & Mic Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
          {candlesLit ? (
            <>
              {/* Manual Blow Out Button */}
              <button
                onClick={handleExtinguish}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-xl shadow-rose-500/25 flex items-center gap-2 transition-all active:scale-95"
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>Tap To Blow Out Candles</span>
              </button>

              {/* Mic Toggle Button */}
              <button
                onClick={micActive ? stopMic : startMic}
                className={`px-6 py-3 rounded-2xl border text-sm font-bold flex items-center gap-2 transition-all active:scale-95 ${
                  micActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
              >
                {micActive ? (
                  <>
                    <Mic className="w-4 h-4 text-amber-300" />
                    <span>Listening... Blow into Mic! ({blowLevel}%)</span>
                  </>
                ) : (
                  <>
                    <Wind className="w-4 h-4 text-slate-400" />
                    <span>Enable Microphone Blow</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleRelight}
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Relight Candles For Another Wish 🕯️</span>
            </button>
          )}
        </div>

        {/* Microphone volume level visualizer bar when active */}
        {micActive && candlesLit && (
          <div className="mt-4 max-w-xs mx-auto bg-slate-800 p-2 rounded-full border border-slate-700 flex items-center gap-3">
            <Wind className="w-4 h-4 text-amber-300 ml-2" />
            <div className="flex-1 bg-slate-900 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-rose-500 h-full transition-all duration-75"
                style={{ width: `${blowLevel}%` }}
              />
            </div>
            <span className="text-xs text-amber-300 font-mono mr-2">{blowLevel}%</span>
          </div>
        )}

      </div>

      {/* Make A Wish Modal */}
      <AnimatePresence>
        {showWishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-slate-900 to-rose-950 border border-rose-500/30 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="text-2xl font-bold text-white">Candles Extinguished! ✨</h3>
                <p className="text-xs text-rose-200/80 mt-1">
                  The candles are out! Make a birthday wish and seal it into your digital time capsule.
                </p>
              </div>

              {wishSaved ? (
                <div className="py-6 text-center text-amber-300 font-semibold flex flex-col items-center gap-2">
                  <Heart className="w-10 h-10 text-rose-400 fill-rose-400 animate-bounce" />
                  <span>Your birthday wish has been sealed in the stars! 🌟</span>
                </div>
              ) : (
                <form onSubmit={handleSaveWish} className="space-y-4">
                  <textarea
                    rows={3}
                    required
                    placeholder="Type your birthday wish here..."
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    className="w-full bg-slate-900/90 border border-rose-500/30 rounded-2xl p-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowWishModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Seal Wish ✨</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
