import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RecipientConfig } from './types';
import { defaultConfig } from './data/defaultConfig';
import { OpeningSurprise } from './components/OpeningSurprise';
import { BirthdayCake } from './components/BirthdayCake';
import { WishCarousel } from './components/WishCarousel';
import { CreatorModal } from './components/CreatorModal';
import { BackgroundParticles } from './components/BackgroundParticles';
import { ChiikawaBackground } from './components/ChiikawaBackground';
import { Heart, Music, VolumeX, Settings, Sparkles } from 'lucide-react';
import { soundFx } from './lib/audio';

export default function App() {
  const [config, setConfig] = useState<RecipientConfig>(() => {
    const saved = localStorage.getItem('birthday_surprise_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultConfig;
      }
    }
    return defaultConfig;
  });

  const [hasOpenedSurprise, setHasOpenedSurprise] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'cake' | 'letter'>('cake');
  const [showCreator, setShowCreator] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(soundFx.getIsPlayingMusic());

  const handleToggleMusic = () => {
    const isNowPlaying = soundFx.toggleMusic();
    setIsPlayingMusic(isNowPlaying);
  };

  const handleSaveConfig = (newConfig: RecipientConfig) => {
    setConfig(newConfig);
    localStorage.setItem('birthday_surprise_config', JSON.stringify(newConfig));
  };

  const handleOpenSurprise = () => {
    setHasOpenedSurprise(true);
    sessionStorage.setItem('birthday_opened', 'true');
  };

  const handleToggleSection = () => {
    setActiveSection((prev) => (prev === 'cake' ? 'letter' : 'cake'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/70 via-pink-50/40 to-white text-slate-800 font-sans selection:bg-rose-500 selection:text-white relative overflow-x-hidden flex flex-col justify-between">
      {/* Ambient Canvas Background */}
      <BackgroundParticles />
      <ChiikawaBackground />

      {/* Opening Gift Box Overlay Landing Page */}
      {!hasOpenedSurprise && (
        <OpeningSurprise
          recipientName={config.recipientName}
          turningAge={config.turningAge}
          onOpen={handleOpenSurprise}
        />
      )}

      {/* Floating Minimal Controls (Music, Replay Landing, & Settings) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={() => setHasOpenedSurprise(false)}
          className="p-2.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-rose-200 text-rose-600 shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 px-3 text-xs font-bold"
          title="Replay Opening Landing Page"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span className="hidden sm:inline">Landing</span>
        </button>

        <button
          onClick={handleToggleMusic}
          className="p-2.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-rose-200 text-rose-600 shadow-md transition-all active:scale-95 cursor-pointer"
          title={isPlayingMusic ? 'Mute Music' : 'Play Music'}
        >
          {isPlayingMusic ? <Music className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        <button
          onClick={() => setShowCreator(true)}
          className="p-2.5 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-rose-200 text-rose-600 shadow-md transition-all active:scale-95 cursor-pointer"
          title="Personalize Card"
        >
          <Settings className="w-4 h-4 text-rose-500" />
        </button>
      </div>

      {/* Primary Focused Stage Container */}
      <main className="relative z-10 flex-1 my-4 sm:my-8 px-2 sm:px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {activeSection === 'cake' && (
              <BirthdayCake
                recipientName={config.recipientName}
                turningAge={config.turningAge}
                onNextSurprise={handleToggleSection}
              />
            )}

            {activeSection === 'letter' && (
              <WishCarousel
                recipientName={config.recipientName}
                letterMessage={config.letterMessage}
                wishNotes={config.wishNotes}
                coupons={config.coupons}
                mode="letter"
                onNextSurprise={handleToggleSection}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-rose-100/80 bg-white/60 backdrop-blur-xs text-center relative z-10 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-1.5 font-semibold text-rose-600">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>Made with love for {config.recipientName} (my babe)</span>
        </div>
      </footer>

      {/* Creator / Personalize Modal */}
      {showCreator && (
        <CreatorModal
          config={config}
          onSaveConfig={handleSaveConfig}
          onClose={() => setShowCreator(false)}
        />
      )}
    </div>
  );
}
