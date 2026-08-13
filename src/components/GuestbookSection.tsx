import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, Send, Sparkles, User, Plus, RotateCcw } from 'lucide-react';
import { GuestbookNote } from '../types';
import { soundFx } from '../lib/audio';

interface GuestbookSectionProps {
  notes: GuestbookNote[];
  onAddNote: (note: GuestbookNote) => void;
  onRestartJourney?: () => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ notes, onAddNote, onRestartJourney }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorRelation, setAuthorRelation] = useState('Friend');
  const [messageText, setMessageText] = useState('');

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !messageText.trim()) return;

    const newNote: GuestbookNote = {
      id: 'gb-' + Date.now(),
      author: authorName,
      relation: authorRelation || 'Friend',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
      type: 'text',
      content: messageText,
      createdAt: 'Just now',
      likes: 1,
    };

    onAddNote(newNote);
    soundFx.playPop();
    setAuthorName('');
    setMessageText('');
    setShowAddForm(false);
  };

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
            <span>Surprise 6: The Birthday Wish Wall</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            Love Notes Wall 💌
          </h2>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-200 flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write A Wish Note</span>
        </button>
      </div>

      {/* Add Note Drawer */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <form onSubmit={handlePostNote} className="bg-white border border-rose-200 p-5 rounded-2xl shadow-md space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="bg-slate-50 border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Bestie / Family)..."
                  value={authorRelation}
                  onChange={(e) => setAuthorRelation(e.target.value)}
                  className="bg-slate-50 border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <textarea
                rows={2}
                required
                placeholder="Write your sweet birthday wish..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full bg-slate-50 border border-rose-200 rounded-xl p-2.5 text-xs text-slate-800"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Note</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            whileHover={{ y: -3 }}
            className="bg-white border border-rose-100 p-4 rounded-2xl shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 font-bold flex items-center justify-center">
                  <User className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{note.author}</h4>
                  <span className="text-[10px] text-rose-500 font-medium">{note.relation} • {note.createdAt}</span>
                </div>
              </div>

              <p className="text-slate-700 text-xs italic mb-3">"{note.content}"</p>
            </div>

            <div className="pt-2 border-t border-rose-50 flex items-center justify-between">
              <button
                onClick={() => {
                  note.likes += 1;
                  soundFx.playPop();
                }}
                className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-500" />
                <span>{note.likes} Likes</span>
              </button>
              <span className="text-[10px] text-rose-400 font-bold uppercase">Verified 💕</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Restart Journey Button */}
      {onRestartJourney && (
        <div className="pt-6 border-t border-rose-100 flex flex-col items-center gap-3 text-center">
          <p className="text-slate-600 text-xs font-medium">
            Hope you loved every moment of your birthday surprise, babe! 🌸
          </p>
          <button
            onClick={onRestartJourney}
            className="px-6 py-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Birthday Journey From Step 1</span>
          </button>
        </div>
      )}
    </div>
  );
};
