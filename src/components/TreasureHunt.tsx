import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Lock, Unlock, Key, HelpCircle, CheckCircle2, Heart, Gift, ArrowRight } from 'lucide-react';
import { TreasureStage } from '../types';
import { soundFx } from '../lib/audio';

interface TreasureHuntProps {
  stages: TreasureStage[];
  onNextSurprise?: () => void;
}

export const TreasureHunt: React.FC<TreasureHuntProps> = ({ stages, onNextSurprise }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [unlockedStages, setUnlockedStages] = useState<number[]>([]);
  const [completedAll, setCompletedAll] = useState(false);

  const activeStage = stages[currentStageIdx] || stages[0];
  const isCurrentUnlocked = unlockedStages.includes(activeStage.id);

  const handleUnlockStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedAns = activeStage.answer.toLowerCase();

    if (normalizedUser.includes(normalizedAns) || normalizedAns.includes(normalizedUser)) {
      soundFx.playUnlock();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fb7185', '#fbbf24', '#e879f9']
      });

      if (!unlockedStages.includes(activeStage.id)) {
        const updated = [...unlockedStages, activeStage.id];
        setUnlockedStages(updated);
        if (updated.length >= stages.length) {
          setCompletedAll(true);
        }
      }

      setErrorMsg('');
      setUserAnswer('');
    } else {
      soundFx.playPop();
      setErrorMsg('Not quite right babe! Check the hint below or try again.');
    }
  };

  return (
    <div className="py-8 md:py-12 max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2">
          <Key className="w-3.5 h-3.5 text-rose-500" />
          <span>Surprise 5: Love Capsule Lockers</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
          Secret Memory Locks 🔒
        </h2>
        <p className="text-slate-600 text-xs md:text-sm mt-1">
          Answer quick sweet questions to unlock your birthday treasure capsules!
        </p>
      </div>

      {/* Progress Pills */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {stages.map((stage, idx) => {
          const isUnlocked = unlockedStages.includes(stage.id);
          const isCurrent = idx === currentStageIdx;

          return (
            <button
              key={stage.id}
              onClick={() => {
                setCurrentStageIdx(idx);
                setShowHint(false);
                setErrorMsg('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isCurrent
                  ? 'bg-rose-500 text-white shadow-xs'
                  : isUnlocked
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {isUnlocked ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>Capsule {stage.id}</span>
            </button>
          );
        })}
      </div>

      {/* Stage Card */}
      <div className="bg-gradient-to-b from-rose-50/90 to-white border border-rose-200 p-6 md:p-8 rounded-3xl shadow-xl relative">
        <div className="flex items-center justify-between mb-4 border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-base md:text-lg text-slate-900">{activeStage.title}</h3>
          </div>
          <span className="px-3 py-0.5 rounded-full bg-rose-100 text-[11px] font-bold text-rose-700">
            {isCurrentUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED'}
          </span>
        </div>

        {/* Riddle */}
        <p className="text-slate-800 text-xs md:text-sm font-medium leading-relaxed bg-white p-4 rounded-2xl border border-rose-100 shadow-xs mb-3">
          "{activeStage.riddle}"
        </p>

        {!isCurrentUnlocked && (
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-rose-600 flex items-center gap-1 font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
          </div>
        )}

        {showHint && !isCurrentUnlocked && (
          <div className="mb-4 p-3 rounded-xl bg-pink-100 border border-pink-200 text-pink-800 text-xs font-medium">
            💡 <strong>Hint:</strong> {activeStage.hint}
          </div>
        )}

        {/* Content or Unlock Form */}
        {isCurrentUnlocked ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-rose-200 p-5 rounded-2xl text-center space-y-3 shadow-xs"
          >
            <Unlock className="w-6 h-6 text-rose-500 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">{activeStage.unlockedContent.heading}</h4>
            <p className="text-slate-700 text-xs leading-relaxed max-w-md mx-auto">
              {activeStage.unlockedContent.body}
            </p>

            {activeStage.unlockedContent.couponTitle && (
              <div className="inline-block px-3 py-1 rounded-xl bg-rose-100 text-rose-700 font-bold text-xs">
                {activeStage.unlockedContent.couponTitle}
              </div>
            )}

            {currentStageIdx < stages.length - 1 && (
              <div className="pt-2">
                <button
                  onClick={() => setCurrentStageIdx(currentStageIdx + 1)}
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-xs"
                >
                  Open Next Lock #{currentStageIdx + 2} →
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <form onSubmit={handleUnlockStage} className="space-y-3 max-w-sm mx-auto">
            <input
              type="text"
              required
              placeholder="Type answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full bg-white border border-rose-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 text-center font-bold"
            />

            {errorMsg && <p className="text-rose-500 text-xs font-semibold text-center">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-1.5"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Capsule</span>
            </button>
          </form>
        )}
      </div>

      {completedAll && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6 bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-300 p-6 rounded-3xl text-center shadow-md"
        >
          <Gift className="w-10 h-10 text-rose-500 mx-auto mb-1 animate-bounce" />
          <h3 className="text-xl font-extrabold text-slate-900">
            🎉 ALL LOVE CAPSULES UNLOCKED! 🎉
          </h3>
          <p className="text-slate-700 text-xs mt-1">
            Happy Birthday Emily! You unlocked every memory vault. I love you so much babe! 💖
          </p>
        </motion.div>
      )}

      {/* Next Step Progression Button */}
      {onNextSurprise && (
        <div className="mt-8 flex justify-center pt-4 border-t border-rose-100">
          <button
            onClick={onNextSurprise}
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <span>Final Surprise: Birthday Wish Wall 💬</span>
            <ArrowRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      )}
    </div>
  );
};
