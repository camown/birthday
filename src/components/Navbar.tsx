import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Music, VolumeX, PartyPopper, Settings, Cake, Heart, Gift, Camera, Compass, MessageSquare } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface NavbarProps {
  recipientName: string;
  nickname: string;
  onOpenCreator: () => void;
  onReplayLanding?: () => void;
  currentStepIndex: number;
  totalSteps: number;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  recipientName,
  onOpenCreator,
  onReplayLanding,
  currentStepIndex,
  totalSteps,
  activeSection,
  setActiveSection,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(soundFx.getIsPlayingMusic());

  const handleToggleMusic = () => {
    const isNowPlaying = soundFx.toggleMusic();
    setIsPlayingMusic(isNowPlaying);
  };

  const handleTriggerConfetti = () => {
    soundFx.playPop();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.15 },
      colors: ['#f472b6', '#fb7185', '#fda4af', '#e879f9', '#fde047']
    });
  };

  const steps = [
    { id: 'cake', label: '1. Candle Wish', icon: Cake },
    { id: 'letter', label: '2. Love Letter', icon: Heart },
    { id: 'vouchers', label: '3. Scratch Cards', icon: Gift },
    { id: 'gallery', label: '4. Memories', icon: Camera },
    { id: 'treasure', label: '5. Love Capsules', icon: Compass },
    { id: 'guestbook', label: '6. Wish Wall', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-200 text-slate-800 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Recipient Badge & Progress Bar (No Navigation Tabs) */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {currentStepIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight block">
                {recipientName}'s Surprise 🌸
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-24 sm:w-32 h-1.5 bg-rose-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500 rounded-full"
                  style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-rose-500 font-bold whitespace-nowrap">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Replay Landing Page */}
          {onReplayLanding && (
            <button
              onClick={onReplayLanding}
              title="View Landing Page Greeting"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-extrabold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          )}

          {/* Confetti */}
          <button
            onClick={handleTriggerConfetti}
            title="Pop Confetti!"
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-pink-100 hover:bg-pink-200 border border-pink-200 text-rose-700 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
          >
            <PartyPopper className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Confetti</span>
          </button>

          {/* Music */}
          <button
            onClick={handleToggleMusic}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 ${
              isPlayingMusic
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            {isPlayingMusic ? (
              <>
                <Music className="w-3.5 h-3.5 animate-bounce" />
                <span className="hidden sm:inline">Music ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Music OFF</span>
              </>
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenCreator}
            title="Edit Birthday Surprise"
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
