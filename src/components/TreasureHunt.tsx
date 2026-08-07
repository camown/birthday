import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Compass, Lock, Unlock, Key, HelpCircle, CheckCircle2, Trophy, Sparkles, Gift } from 'lucide-react';
import { TreasureStage } from '../types';
import { soundFx } from '../lib/audio';

interface TreasureHuntProps {
  stages: TreasureStage[];
}

export const TreasureHunt: React.FC<TreasureHuntProps> = ({ stages }) => {
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
      // Success!
      soundFx.playUnlock();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#fbbf24', '#38bdf8', '#c084fc']
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
      setErrorMsg('Oops! That password is not quite right. Try again or check the hint!');
    }
  };

  return (
    <section id="treasure" className="py-16 md:py-24 relative bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Birthday Quest</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300">
            Secret Digital Treasure Hunt 🗺️
          </h2>
          <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-lg mx-auto">
            Solve inside-joke riddles and memory challenges to crack open the secret vaults and claim your ultimate birthday prize!
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-10 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 shadow-md'
                    : isUnlocked
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>Level {stage.id}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-400/30 p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">{activeStage.title}</h3>
                <span className="text-xs text-rose-300/80">Riddle Challenge {currentStageIdx + 1} of {stages.length}</span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-amber-300 border border-slate-700">
              {isCurrentUnlocked ? '🔓 VAULT UNLOCKED' : '🔒 VAULT LOCKED'}
            </div>
          </div>

          {/* Riddle Content */}
          <div className="mb-8">
            <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 mb-4">
              "{activeStage.riddle}"
            </p>

            {!isCurrentUnlocked && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs text-amber-300/90 hover:text-amber-200 flex items-center gap-1.5 font-semibold"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showHint ? 'Hide Hint' : 'Need A Hint?'}</span>
                </button>
              </div>
            )}

            {showHint && !isCurrentUnlocked && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-medium"
              >
                💡 <strong>Hint:</strong> {activeStage.hint}
              </motion.div>
            )}
          </div>

          {/* Form or Unlocked Memory View */}
          {isCurrentUnlocked ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-400/40 p-6 rounded-2xl text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mx-auto text-amber-300">
                <Unlock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-amber-200">{activeStage.unlockedContent.heading}</h4>
              <p className="text-slate-200 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
                {activeStage.unlockedContent.body}
              </p>

              {activeStage.unlockedContent.mediaUrl && (
                <div className="max-w-md mx-auto rounded-2xl overflow-hidden border border-amber-400/30 my-4 shadow-lg">
                  <img src={activeStage.unlockedContent.mediaUrl} alt="Secret Treasure" className="w-full h-48 object-cover" />
                </div>
              )}

              {activeStage.unlockedContent.couponTitle && (
                <div className="inline-block px-4 py-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-xs">
                  {activeStage.unlockedContent.couponTitle}
                </div>
              )}

              {currentStageIdx < stages.length - 1 && (
                <div className="pt-4">
                  <button
                    onClick={() => setCurrentStageIdx(currentStageIdx + 1)}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition-all"
                  >
                    Proceed To Level {currentStageIdx + 2} →
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <form onSubmit={handleUnlockStage} className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Enter Password / Memory Answer:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Type your answer..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center font-bold tracking-wide"
                />
              </div>

              {errorMsg && (
                <p className="text-rose-400 text-xs font-semibold text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Unlock className="w-4 h-4 text-slate-950" />
                <span>Crack Open Vault</span>
              </button>
            </form>
          )}

        </div>

        {/* Grand Prize Winner Banner */}
        <AnimatePresence>
          {completedAll && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-12 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border-2 border-amber-400 p-8 rounded-3xl text-center backdrop-blur-xl relative shadow-2xl"
            >
              <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-3 animate-bounce" />
              <h3 className="text-2xl md:text-4xl font-extrabold text-amber-200">
                🏆 TREASURE HUNT COMPLETED! 🏆
              </h3>
              <p className="text-slate-200 text-sm max-w-md mx-auto mt-2">
                You unlocked all memory vaults! You truly are a master detective and the absolute light of our lives.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
