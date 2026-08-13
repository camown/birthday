import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Gift, Mail, ArrowRight } from 'lucide-react';
import { WishNote } from '../types';
import { soundFx } from '../lib/audio';

interface WishCarouselProps {
  recipientName: string;
  letterMessage: string;
  wishNotes: WishNote[];
  coupons: { title: string; desc: string; icon: string }[];
  mode?: 'letter' | 'vouchers';
  onNextSurprise?: () => void;
}

// Canvas Scratch Off Voucher Card
const ScratchCard: React.FC<{ secret: string; label: string }> = ({ secret, label }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f472b6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH WITH FINGER / MOUSE ✨', canvas.width / 2, canvas.height / 2 + 4);
  }, []);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentCount++;
    }

    if (transparentCount > (pixels.length * 0.35) / 4 && !isRevealed) {
      setIsRevealed(true);
      soundFx.playPop();
    }
  };

  return (
    <div className="relative w-full bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center min-h-[140px] text-center overflow-hidden">
      <div className="text-rose-600 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        <span>{label}</span>
      </div>

      <div className="text-slate-800 font-bold text-xs sm:text-sm px-2 py-1">
        {secret}
      </div>

      {!isRevealed && (
        <canvas
          ref={canvasRef}
          width={300}
          height={120}
          onMouseMove={handleScratch}
          onTouchMove={handleScratch}
          className="absolute inset-0 w-full h-full cursor-pointer rounded-2xl touch-none"
        />
      )}
    </div>
  );
};

export const WishCarousel: React.FC<WishCarouselProps> = ({
  recipientName,
  letterMessage,
  wishNotes,
  coupons,
  mode = 'letter',
  onNextSurprise,
}) => {
  if (mode === 'letter') {
    return (
      <div className="py-8 md:py-12 max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2">
            <Mail className="w-3.5 h-3.5 text-rose-500" />
            <span>A Message From My Heart 💕</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            For My Dearest {recipientName} 💕
          </h2>
        </div>

        {/* Letter Card */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-b from-rose-50/90 to-pink-50/50 border border-rose-200 p-6 sm:p-10 rounded-3xl shadow-xl relative"
        >
          <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/80" />
          </div>

          <div className="prose max-w-none text-slate-800 text-sm md:text-base leading-relaxed whitespace-pre-line font-sans font-medium">
            {letterMessage}
          </div>
        </motion.div>

        {/* Navigation Button */}
        {onNextSurprise && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onNextSurprise}
              className="px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>Back to Birthday Cake 🎂</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Scratch Vouchers Mode
  return (
    <div className="py-8 md:py-12 max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2">
          <Gift className="w-3.5 h-3.5 text-rose-500" />
          <span>Surprise 3: Scratch & Reveal Vouchers</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
          Scratch Your Rewards, Babe! 🪙
        </h2>
        <p className="text-slate-600 text-xs md:text-sm mt-1">
          Use your mouse or finger to scratch off the silver foil and reveal your custom date vouchers!
        </p>
      </div>

      {/* Scratch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {wishNotes
          .filter((n) => n.isScratchCard)
          .map((note) => (
            <ScratchCard
              key={note.id}
              label={note.tag}
              secret={note.scratchSecret || '🌸 Romantic Gift Pass'}
            />
          ))}
      </div>

      {/* Next Step Progression Button */}
      {onNextSurprise && (
        <div className="flex justify-center">
          <button
            onClick={onNextSurprise}
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>Next Surprise: Polaroid Gallery 📸</span>
            <ArrowRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      )}
    </div>
  );
};
