import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Gift, Mail, Sparkle, RefreshCw } from 'lucide-react';
import { WishNote } from '../types';
import { soundFx } from '../lib/audio';

interface WishCarouselProps {
  recipientName: string;
  letterMessage: string;
  wishNotes: WishNote[];
  coupons: { title: string; desc: string; icon: string }[];
}

// Canvas-based Scratch Off Card Component
const ScratchCard: React.FC<{ secret: string; label: string }> = ({ secret, label }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill canvas with shiny silver metallic pattern
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add metallic texture & text
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH HERE WITH MOUSE/FINGER ✨', canvas.width / 2, canvas.height / 2 + 4);
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
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    // Check how much is scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentCount++;
    }

    if (transparentCount > pixels.length * 0.35 / 4 && !isRevealed) {
      setIsRevealed(true);
      soundFx.playPop();
    }
  };

  return (
    <div className="relative w-full bg-slate-900 border border-amber-400/30 rounded-2xl p-4 shadow-lg flex flex-col items-center justify-center min-h-[140px] text-center overflow-hidden">
      <div className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>

      <div className="text-rose-200 font-semibold text-sm px-2 py-1">
        {secret}
      </div>

      {!isRevealed && (
        <canvas
          ref={canvasRef}
          width={280}
          height={110}
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
}) => {
  const [aiWish, setAiWish] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleGenerateAiWish = async () => {
    setLoadingAi(true);
    soundFx.playPop();
    try {
      const res = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: recipientName }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiWish(data.wish);
      } else {
        // Fallback custom birthday praise
        setAiWish(
          `✨ "May your birthday shine as radiantly as your smile, ${recipientName}! Here is to 365 new days of unconditional laughter, sparkling victories, and unforgettable adventures!"`
        );
      }
    } catch {
      setAiWish(
        `✨ "May your birthday shine as radiantly as your smile, ${recipientName}! Here is to 365 new days of unconditional laughter, sparkling victories, and unforgettable adventures!"`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <section id="letter" className="py-16 md:py-24 relative bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-3">
            <Mail className="w-3.5 h-3.5 text-amber-300" />
            <span>Personal Letter & Secret Scratch Cards</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300">
            Messages Written Just For You ❤️
          </h2>
        </div>

        {/* The Sealed Envelope & Main Letter */}
        <div className="mb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-slate-900/90 to-rose-950/60 border border-rose-500/30 p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl relative backdrop-blur-xl overflow-hidden"
          >
            {/* Top Envelope Wax Seal Icon */}
            <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-rose-600/30 border border-rose-400/50 flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-300 fill-rose-400/80" />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-6 h-6 text-amber-300" />
              <h3 className="text-xl md:text-2xl font-bold text-amber-200">
                A Letter To My Favorite Person
              </h3>
            </div>

            <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed whitespace-pre-line font-sans">
              {letterMessage}
            </div>

            {/* AI Custom Wish Generator Action */}
            <div className="mt-8 pt-6 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-rose-300/80">
                Need extra birthday inspiration? Generate a fresh AI birthday poem!
              </div>

              <button
                onClick={handleGenerateAiWish}
                disabled={loadingAi}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all active:scale-95 hover:opacity-90 disabled:opacity-50"
              >
                {loadingAi ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-200" />
                )}
                <span>Generate AI Birthday Poem</span>
              </button>
            </div>

            {aiWish && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-sm italic"
              >
                {aiWish}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Grid of Wish Notes & Scratch Cards */}
        <div className="mb-16">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-amber-300" />
            <span>Interactive Scratch Cards & Birthday Notes</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishNotes.map((note) => (
              <React.Fragment key={note.id}>
                {note.isScratchCard && note.scratchSecret ? (
                  <ScratchCard label={note.tag} secret={note.scratchSecret} />
                ) : (
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-slate-900/80 border border-rose-500/20 p-5 rounded-2xl shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-medium mb-3">
                        {note.tag}
                      </div>
                      <p className="text-slate-200 text-xs md:text-sm leading-relaxed mb-4">
                        "{note.message}"
                      </p>
                    </div>
                    <div className="text-right text-xs font-bold text-amber-300">
                      — {note.sender}
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Birthday Gift Coupons */}
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Gift className="w-5 h-5 text-rose-400" />
            <span>Redeemable Birthday Vouchers</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {coupons.map((coupon, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-900 to-rose-950/40 border border-amber-400/30 p-5 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-400 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-3 text-amber-300 font-bold text-lg">
                  🎁
                </div>
                <h4 className="text-white font-bold text-base mb-1">{coupon.title}</h4>
                <p className="text-slate-300 text-xs leading-normal mb-4">{coupon.desc}</p>
                <button
                  onClick={() => {
                    soundFx.playUnlock();
                    alert(`🎟️ Voucher Claimed: "${coupon.title}"! Take a screenshot and send it to your favorite person to redeem!`);
                  }}
                  className="w-full py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all"
                >
                  Claim Voucher
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
