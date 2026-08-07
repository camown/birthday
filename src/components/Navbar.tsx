import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Music, VolumeX, PartyPopper, Settings, Heart, Camera, Compass, MessageSquare, Cake } from 'lucide-react';
import { soundFx } from '../lib/audio';

interface NavbarProps {
  recipientName: string;
  nickname: string;
  onOpenCreator: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  recipientName,
  nickname,
  onOpenCreator,
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
      particleCount: 100,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#f472b6', '#fb7185', '#38bdf8', '#fbbf24', '#c084fc']
    });
  };

  const navItems = [
    { id: 'cake', label: 'Birthday Cake', icon: Cake },
    { id: 'letter', label: 'Heartfelt Wishes', icon: Heart },
    { id: 'gallery', label: 'Photos & Videos', icon: Camera },
    { id: 'treasure', label: 'Secret Treasure Hunt', icon: Compass },
    { id: 'guestbook', label: 'Video Guestbook', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-rose-500/20 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand & Recipient Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
          </div>
          <div>
            <span className="font-bold text-sm md:text-base text-rose-200 tracking-tight block">
              {recipientName}'s Birthday ✨
            </span>
            <span className="text-[11px] text-rose-300/80 hidden sm:block">
              {nickname}
            </span>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-full border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Interactive Action Controls */}
        <div className="flex items-center gap-2">
          {/* Confetti Burst Button */}
          <button
            onClick={handleTriggerConfetti}
            title="Pop Confetti!"
            className="p-2 md:px-3 md:py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <PartyPopper className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Pop Confetti</span>
          </button>

          {/* Music Toggle */}
          <button
            onClick={handleToggleMusic}
            title={isPlayingMusic ? 'Mute Music' : 'Play Happy Birthday Tune'}
            className={`p-2 md:px-3 md:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              isPlayingMusic
                ? 'bg-rose-500/20 border-rose-400/40 text-rose-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {isPlayingMusic ? (
              <>
                <Music className="w-4 h-4 text-rose-400 animate-bounce" />
                <span className="hidden sm:inline">Music ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Music OFF</span>
              </>
            )}
          </button>

          {/* Creator / Personalize Settings */}
          <button
            onClick={onOpenCreator}
            title="Personalize / Edit Surprise Details"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
