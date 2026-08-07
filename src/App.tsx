import React, { useState, useEffect } from 'react';
import { RecipientConfig, GalleryItem, GuestbookNote } from './types';
import { defaultConfig } from './data/defaultConfig';
import { OpeningSurprise } from './components/OpeningSurprise';
import { Navbar } from './components/Navbar';
import { BirthdayCake } from './components/BirthdayCake';
import { WishCarousel } from './components/WishCarousel';
import { GallerySection } from './components/GallerySection';
import { TreasureHunt } from './components/TreasureHunt';
import { GuestbookSection } from './components/GuestbookSection';
import { CreatorModal } from './components/CreatorModal';
import { BackgroundParticles } from './components/BackgroundParticles';
import { Sparkles, Heart, Gift, Camera, Compass, MessageSquare, Cake } from 'lucide-react';

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

  const [hasOpenedSurprise, setHasOpenedSurprise] = useState<boolean>(() => {
    return sessionStorage.getItem('birthday_opened') === 'true';
  });

  const [activeSection, setActiveSection] = useState<string>('cake');
  const [showCreator, setShowCreator] = useState<boolean>(false);

  // Save config changes to localStorage
  const handleSaveConfig = (newConfig: RecipientConfig) => {
    setConfig(newConfig);
    localStorage.setItem('birthday_surprise_config', JSON.stringify(newConfig));
  };

  const handleOpenSurprise = () => {
    setHasOpenedSurprise(true);
    sessionStorage.setItem('birthday_opened', 'true');
  };

  // Gallery handlers
  const handleAddGalleryItem = (item: GalleryItem) => {
    const updatedMedia = [item, ...config.photosAndVideos];
    const updatedConfig = { ...config, photosAndVideos: updatedMedia };
    handleSaveConfig(updatedConfig);
  };

  // Guestbook handlers
  const handleAddGuestbookNote = (note: GuestbookNote) => {
    const updatedNotes = [note, ...config.guestbookNotes];
    const updatedConfig = { ...config, guestbookNotes: updatedNotes };
    handleSaveConfig(updatedConfig);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Canvas Background */}
      <BackgroundParticles />

      {/* Opening Gift Box Overlay */}
      {!hasOpenedSurprise && (
        <OpeningSurprise
          recipientName={config.recipientName}
          turningAge={config.turningAge}
          onOpen={handleOpenSurprise}
        />
      )}

      {/* Sticky Navigation Header */}
      <Navbar
        recipientName={config.recipientName}
        nickname={config.nickname}
        onOpenCreator={() => setShowCreator(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Hero Welcome Banner */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs md:text-sm font-semibold mb-6 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{config.birthDate} • Celebrating You</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300 mb-6 leading-tight">
            {config.headline}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            {config.subheadline}
          </p>

          {/* Direct Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#cake"
              onClick={() => setActiveSection('cake')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs md:text-sm shadow-xl shadow-rose-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Cake className="w-4 h-4" />
              <span>Blow The Candles 🕯️</span>
            </a>

            <a
              href="#gallery"
              onClick={() => setActiveSection('gallery')}
              className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs md:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Camera className="w-4 h-4 text-rose-400" />
              <span>Memories & Videos</span>
            </a>

            <a
              href="#treasure"
              onClick={() => setActiveSection('treasure')}
              className="px-5 py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs md:text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Secret Treasure Hunt 🗺️</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Interactive Sections */}
      <main className="relative z-10 space-y-12">
        {/* Interactive Birthday Cake */}
        <BirthdayCake
          recipientName={config.recipientName}
          turningAge={config.turningAge}
        />

        {/* Personalized Messages & Scratch Cards */}
        <WishCarousel
          recipientName={config.recipientName}
          letterMessage={config.letterMessage}
          wishNotes={config.wishNotes}
          coupons={config.coupons}
        />

        {/* Photos & Auto-Playing Video Gallery */}
        <GallerySection
          items={config.photosAndVideos}
          onAddItem={handleAddGalleryItem}
        />

        {/* Secret Digital Treasure Hunt */}
        <TreasureHunt stages={config.treasureStages} />

        {/* Virtual Video Guestbook */}
        <GuestbookSection
          notes={config.guestbookNotes}
          onAddNote={handleAddGuestbookNote}
        />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950 text-center relative z-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-rose-300 font-semibold">
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400 animate-pulse" />
            <span>Crafted uniquely for {config.recipientName}</span>
          </div>
          <p className="text-slate-500 max-w-sm">
            A 1-of-1 personalized birthday experience packed with love, interactive fireworks, and digital treasures.
          </p>
        </div>
      </footer>

      {/* Creator / Personalizer Modal */}
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
