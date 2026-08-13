import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RefreshCw, Plus, ArrowRight, BookOpen, Quote, Smile, Star, Gift } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface LoveJarSectionProps {
  recipientName: string;
  onNextSurprise?: () => void;
}

interface ReasonNote {
  id: number;
  text: string;
  category: string;
  emoji: string;
}

const defaultReasons: ReasonNote[] = [
  { id: 1, text: "The warm, genuine smile that lights up your whole face whenever you see me.", category: "Your Smile", emoji: "😊" },
  { id: 2, text: "How you always know how to make me laugh, even on my hardest days.", category: "Your Joy", emoji: "✨" },
  { id: 3, text: "The sweet sound of your voice when you say 'I love you' before bed.", category: "Sweet Moments", emoji: "💕" },
  { id: 4, text: "Your kind and compassionate heart towards everyone around you.", category: "Your Heart", emoji: "🌷" },
  { id: 5, text: "The way your hand feels perfectly made to fit right in mine.", category: "Touch", emoji: "🤝" },
  { id: 6, text: "How passionate and dedicated you are about the things you love.", category: "Your Spirit", emoji: "🌟" },
  { id: 7, text: "Our cozy coffee dates where hours pass by like seconds.", category: "Memories", emoji: "☕" },
  { id: 8, text: "Your adorable nose crinkle when you laugh uncontrollably.", category: "Cute Traits", emoji: "🌸" },
  { id: 9, text: "How safe, peaceful, and truly at home I feel whenever I am with you.", category: "Love", emoji: "🏡" },
  { id: 10, text: "The thoughtful little surprises and gestures you do without even thinking.", category: "Kindness", emoji: "🎁" },
  { id: 11, text: "How we can talk about absolutely everything and anything together.", category: "Connection", emoji: "💬" },
  { id: 12, text: "Simply being you — the most wonderful girl in the entire world.", category: "Everything", emoji: "👑" },
];

interface StoryMilestone {
  title: string;
  date: string;
  story: string;
  icon: string;
}

const defaultMilestones: StoryMilestone[] = [
  {
    title: "The First Time We Met",
    date: "A Day I'll Never Forget",
    story: "The moment you walked in, time slowed down. I immediately noticed your soft smile and knew you were someone extraordinarily special.",
    icon: "✨",
  },
  {
    title: "Our First Official Date",
    date: "Pure Magic",
    story: "We sat and talked for hours until the staff started closing down. Neither of us wanted the night to end.",
    icon: "☕",
  },
  {
    title: "The Moment I Fell In Love",
    date: "Forever Locked",
    story: "Watching you laugh so effortlessly, I realized my heart belonged to you completely and unconditionally.",
    icon: "💖",
  },
  {
    title: "Our Sweet Favorite Memory",
    date: "Just You & Me",
    story: "Walking together under the evening sky, wrapped in warm coffee and endless laughter. My favorite place in the world is right beside you.",
    icon: "🌸",
  },
];

export const LoveJarSection: React.FC<LoveJarSectionProps> = ({ recipientName, onNextSurprise }) => {
  const [reasons, setReasons] = useState<ReasonNote[]>(defaultReasons);
  const [activeReason, setActiveReason] = useState<ReasonNote | null>(null);
  const [drawnIds, setDrawnIds] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReasonText, setNewReasonText] = useState('');
  const [newCategory, setNewCategory] = useState('Sweet Moments');
  const [activeTab, setActiveTab] = useState<'jar' | 'milestones'>('jar');

  const handleDrawReason = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    soundFx.playPop();

    setTimeout(() => {
      // Pick a random un-drawn or random reason
      const remaining = reasons.filter((r) => !drawnIds.includes(r.id));
      const pool = remaining.length > 0 ? remaining : reasons;
      const picked = pool[Math.floor(Math.random() * pool.length)];

      setActiveReason(picked);
      if (!drawnIds.includes(picked.id)) {
        setDrawnIds((prev) => [...prev, picked.id]);
      }
      setIsDrawing(false);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#fda4af', '#fde047'],
      });
    }, 400);
  };

  const handleAddCustomReason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReasonText.trim()) return;

    const newNote: ReasonNote = {
      id: Date.now(),
      text: newReasonText.trim(),
      category: newCategory || 'Special Reason',
      emoji: '💕',
    };

    setReasons((prev) => [newNote, ...prev]);
    setActiveReason(newNote);
    setDrawnIds((prev) => [...prev, newNote.id]);
    setNewReasonText('');
    setShowAddModal(false);
    soundFx.playPop();
  };

  return (
    <div className="py-8 md:py-12 max-w-3xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Surprise 4: The Love Jar & Story</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
          Reasons Why I Love You, {recipientName} 🌸
        </h2>
        <p className="text-slate-600 text-xs md:text-sm mt-1 max-w-md mx-auto">
          Tap the romantic love jar to pull folded origami notes written straight from my heart!
        </p>
      </div>

      {/* Mode Sub-Navigation */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('jar')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'jar'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white border border-rose-200 text-slate-600 hover:bg-rose-50'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>The Love Jar ({drawnIds.length}/{reasons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'milestones'
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-white border border-rose-200 text-slate-600 hover:bg-rose-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Our Love Journey</span>
        </button>
      </div>

      {/* Main Tab 1: The Love Jar */}
      {activeTab === 'jar' && (
        <div className="flex flex-col items-center">
          {/* Visual Jar Container */}
          <div
            onClick={handleDrawReason}
            className="relative cursor-pointer group my-2 transition-transform active:scale-95"
            title="Click jar to pull a love note!"
          >
            {/* Sparkle Halo */}
            <div className="absolute -inset-4 bg-rose-200/50 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />

            {/* Glass Jar Graphic */}
            <motion.div
              animate={isDrawing ? { rotate: [-5, 5, -5, 0], scale: [1, 1.05, 1] } : { y: [0, -4, 0] }}
              transition={isDrawing ? { duration: 0.4 } : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative w-48 h-60 sm:w-56 sm:h-68 rounded-3xl bg-gradient-to-b from-white/80 via-rose-50/70 to-pink-100/90 border-4 border-rose-200/90 shadow-xl flex flex-col items-center justify-between p-4 overflow-hidden backdrop-blur-md"
            >
              {/* Jar Lid */}
              <div className="w-32 sm:w-36 h-6 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 rounded-lg border-2 border-amber-300 shadow-sm flex items-center justify-center">
                <div className="w-24 h-1 bg-amber-400/50 rounded-full" />
              </div>

              {/* Wooden Tag on Jar */}
              <div className="my-auto px-3 py-1.5 rounded-xl bg-white/90 border border-rose-200 shadow-xs text-center z-10">
                <span className="text-[10px] font-extrabold text-rose-600 uppercase tracking-widest block">
                  Love Jar 🌸
                </span>
                <span className="text-xs font-bold text-slate-800">
                  For {recipientName}
                </span>
              </div>

              {/* Floating Folded Heart Notes inside Jar */}
              <div className="absolute bottom-4 inset-x-4 h-32 flex flex-wrap items-end justify-center gap-2 pointer-events-none opacity-80">
                {reasons.slice(0, 8).map((r, i) => (
                  <motion.div
                    key={r.id}
                    animate={{ y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2 + i * 0.3 }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs shadow-xs border ${
                      i % 3 === 0
                        ? 'bg-rose-400 text-white border-rose-300'
                        : i % 3 === 1
                        ? 'bg-pink-300 text-pink-900 border-pink-200'
                        : 'bg-amber-200 text-amber-900 border-amber-300'
                    }`}
                  >
                    💕
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Action Trigger Button */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center">
            <button
              onClick={handleDrawReason}
              disabled={isDrawing}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-200 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
              <span>{isDrawing ? "Unfolding Note..." : "Draw A Love Note 💕"}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-3 rounded-2xl bg-white border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1.5 hover:bg-rose-50 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Reason</span>
            </button>
          </div>

          {/* Unfolded Love Note Display */}
          <AnimatePresence mode="wait">
            {activeReason && (
              <motion.div
                key={activeReason.id}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mt-8 max-w-md w-full bg-gradient-to-b from-rose-50 to-pink-50/60 border-2 border-rose-200 p-6 sm:p-8 rounded-3xl shadow-xl relative text-center"
              >
                {/* Decorative Heart Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-xs flex items-center gap-1">
                  <span>{activeReason.emoji}</span>
                  <span>{activeReason.category}</span>
                </div>

                <Quote className="w-8 h-8 text-rose-300 mx-auto mb-2 opacity-60" />

                <p className="text-slate-800 text-sm sm:text-base font-serif italic font-medium leading-relaxed my-2">
                  "{activeReason.text}"
                </p>

                <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-xs text-rose-600 font-semibold">
                  <span>Reason #{reasons.findIndex((r) => r.id === activeReason.id) + 1}</span>
                  <button
                    onClick={handleDrawReason}
                    className="flex items-center gap-1 text-slate-700 hover:text-rose-600 font-bold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Draw Next</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main Tab 2: Our Love Journey Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {defaultMilestones.map((m, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="bg-white border border-rose-200 p-5 rounded-2xl shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      {m.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{m.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{m.story}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-rose-100 text-right">
                  <span className="text-[10px] font-extrabold text-rose-500 uppercase">
                    Forever In My Heart 💕
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Next Step Progression Button */}
      {onNextSurprise && (
        <div className="mt-10 pt-6 border-t border-rose-100 flex justify-center">
          <button
            onClick={onNextSurprise}
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>Next Surprise: Unlock Love Capsules 🔒</span>
            <ArrowRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      )}

      {/* Modal to Add Custom Reason */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border border-rose-200 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-1">Add A Love Reason</h3>
              <p className="text-xs text-slate-500 mb-4">Add a new reason why she is so special!</p>

              <form onSubmit={handleAddCustomReason} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Cute Moments, Smile..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Reason Text</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Write a sweet reason..."
                    value={newReasonText}
                    onChange={(e) => setNewReasonText(e.target.value)}
                    className="w-full bg-slate-50 border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-md shadow-rose-200"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
