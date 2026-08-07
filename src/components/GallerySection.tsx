import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Play, Plus, X, Image as ImageIcon, Video as VideoIcon, Calendar, Heart, Volume2 } from 'lucide-react';
import { GalleryItem } from '../types';
import { soundFx } from '../lib/audio';

interface GallerySectionProps {
  items: GalleryItem[];
  onAddItem: (item: GalleryItem) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items, onAddItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeMedia, setActiveMedia] = useState<GalleryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding new media
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');
  const [newCategory, setNewCategory] = useState<'Adventures' | 'Cute Moments' | 'Milestones' | 'Funny'>('Cute Moments');
  const [newUrl, setNewUrl] = useState('');

  const categories = ['All', 'Adventures', 'Cute Moments', 'Milestones', 'Funny', 'Videos'];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Videos') return item.type === 'video';
    return item.category === selectedCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith('video');
      setNewType(isVid ? 'video' : 'image');

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setNewUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newTitle) return;

    const newItem: GalleryItem = {
      id: 'media-' + Date.now(),
      type: newType,
      url: newUrl,
      title: newTitle,
      caption: newCaption || 'Special birthday memory!',
      date: 'Just Now',
      category: newCategory,
    };

    onAddItem(newItem);
    soundFx.playPop();

    // Reset form
    setNewTitle('');
    setNewCaption('');
    setNewUrl('');
    setShowAddModal(false);
  };

  return (
    <section id="gallery" className="py-16 md:py-24 relative bg-slate-900/60 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-3">
              <Camera className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Memory Vault</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300">
              Photos & Auto-Playing Videos 📸
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-xl">
              Click any photo or video card. Videos play automatically when selected! You can also upload your own photos and videos directly into this gallery.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 hover:opacity-90 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo or Video</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6 }}
              onClick={() => setActiveMedia(item)}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl cursor-pointer group flex flex-col justify-between relative"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                {item.type === 'video' ? (
                  <>
                    <video
                      src={item.url}
                      poster={item.posterUrl}
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Play Badge */}
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold flex items-center gap-1">
                      <VideoIcon className="w-3 h-3" />
                      <span>Video</span>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-rose-300 text-[10px] font-bold flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>Photo</span>
                    </div>
                  </>
                )}

                {item.date && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-rose-300 transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-rose-400/80 font-medium">#{item.category}</span>
                  <span className="text-amber-300 font-semibold group-hover:underline">Click to Expand →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox / Video Player Modal */}
      <AnimatePresence>
        {activeMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveMedia(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white flex items-center justify-center border border-white/20 transition-transform active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Media Content */}
              <div className="bg-black flex items-center justify-center max-h-[60vh] overflow-hidden relative">
                {activeMedia.type === 'video' ? (
                  <video
                    src={activeMedia.url}
                    autoPlay
                    controls
                    playsInline
                    className="max-h-[60vh] w-full object-contain"
                  />
                ) : (
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.title}
                    className="max-h-[60vh] w-full object-contain"
                  />
                )}
              </div>

              {/* Media Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold">
                    {activeMedia.category}
                  </span>
                  {activeMedia.type === 'video' && (
                    <span className="text-xs text-amber-300 flex items-center gap-1 font-semibold">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Playing Automatically</span>
                    </span>
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {activeMedia.title}
                </h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  {activeMedia.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Media Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-rose-400" />
                  <span>Insert Photo or Video</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMedia} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Upload Local File (Image / Video)
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600"
                  />
                </div>

                <div className="text-center text-xs text-slate-500 font-semibold uppercase">
                  — Or Enter URL —
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Media URL (Image or MP4 Video)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Summer Trip Memory"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Caption
                  </label>
                  <textarea
                    rows={2}
                    placeholder="A sweet memory caption..."
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Type
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as 'image' | 'video')}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="image">Photo</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as 'Adventures' | 'Cute Moments' | 'Milestones' | 'Funny')}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="Cute Moments">Cute Moments</option>
                      <option value="Adventures">Adventures</option>
                      <option value="Milestones">Milestones</option>
                      <option value="Funny">Funny</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!newUrl || !newTitle}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Save To Gallery</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
