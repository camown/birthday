import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Gift, ArrowRight } from 'lucide-react';
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
  const defaultLetter = `My babeeeee,

Happy Birthday my babe! 🌸✨

First birthday of my babe with me hehehehe.. no words will never be enough to tell you how i love and appreciated you my babe. From every every calls and play we had since then, you make my life so much sweeter and lively. Your kindness, soft smile, and laughter mean everything to me my babe TT. Thank you so much for everything my babe, you yourself already is something that i am thankful for but you always take care of me that's why my babe i will always take care of you too and be grateful for having you.. i might not be the best babe for now but i am getting there! hehe i should have you ofc ^_^

I made this little website whenever i have time during lunch hahahahaha i still have shit design but i just wanted to give you the best thing i can do my babe from your faveorite pink to celebrate you, and everything that makes you happy (chiikawa).

I may not have the best gift for you now my babe but soon!!! that's a promise hehehe more dried mangoes to come and my gift to you next time will be 10x of this!.

Happy Birthday, my babe. Here is to a year filled with happiness, dreams coming true, and endless sweet moments together. 030❤️ i love you always!!!! `;

  if (mode === 'letter') {
    return (
      <div className="py-8 md:py-16 max-w-2xl md:max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-bold text-rose-500 font-dancing tracking-normal drop-shadow-[0_4px_12px_rgba(244,63,94,0.25)] leading-tight mb-2">
            For My Pwincess 💕
          </h2>
        </div>

        {/* Letter Card */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-b from-rose-50/90 via-pink-50/50 to-white/95 border-2 border-rose-200 p-8 sm:p-12 md:p-16 rounded-[2.5rem] shadow-2xl relative"
        >
          <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center shadow-xs">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/80 animate-pulse" />
          </div>

          <div className="prose max-w-none text-slate-800 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed sm:leading-loose whitespace-pre-line font-sans font-semibold">
            {defaultLetter}
          </div>
        </motion.div>

        {/* Navigation Button */}
        {onNextSurprise && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={onNextSurprise}
              className="px-8 py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm md:text-base shadow-md shadow-rose-200 flex items-center gap-2 active:scale-95 transition-all cursor-pointer border border-rose-400"
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
