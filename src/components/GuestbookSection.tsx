import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Video, Mic, Plus, Play, X, Heart, Camera, Send, Sparkles, CheckCircle } from 'lucide-react';
import { GuestbookNote } from '../types';
import { soundFx } from '../lib/audio';

interface GuestbookSectionProps {
  notes: GuestbookNote[];
  onAddNote: (note: GuestbookNote) => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({ notes, onAddNote }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'video' | 'text'>('all');
  const [activeVideo, setActiveVideo] = useState<GuestbookNote | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Webcam recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorRelation, setAuthorRelation] = useState('Friend');
  const [messageText, setMessageText] = useState('');

  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const filteredNotes = notes.filter((n) => {
    if (activeTab === 'video') return n.type === 'video';
    if (activeTab === 'text') return n.type === 'text';
    return true;
  });

  // Start Webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      alert('Unable to access camera/microphone. You can still leave a text message note!');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  useEffect(() => {
    if (showRecordModal) {
      startCamera();
    } else {
      stopCamera();
      setRecordedUrl(null);
      setRecordedBlob(null);
      setIsRecording(false);
    }
  }, [showRecordModal]);

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setRecordedUrl(url);
    };

    recorder.start();
    setIsRecording(true);
    soundFx.playPop();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      soundFx.playPop();
    }
  };

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) return;

    const newNote: GuestbookNote = {
      id: 'gb-' + Date.now(),
      author: authorName,
      relation: authorRelation,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
      type: recordedUrl ? 'video' : 'text',
      videoUrl: recordedUrl || undefined,
      content: messageText || (recordedUrl ? 'Recorded a special video note!' : 'Happy Birthday!'),
      createdAt: 'Just Now',
      likes: 1,
    };

    onAddNote(newNote);
    soundFx.playFanfare();
    setShowRecordModal(false);
  };

  return (
    <section id="guestbook" className="py-16 md:py-24 relative bg-slate-900/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>Virtual Birthday Guestbook</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-300">
              Heartfelt Video Notes & Wishes 📹
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-xl">
              Watch video messages left by loved ones, or record your own live webcam video note to post onto the birthday wall!
            </p>
          </div>

          <button
            onClick={() => setShowRecordModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 hover:opacity-90 self-start md:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Record / Leave Video Note</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Messages ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Notes Only</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'text'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Written Wishes
          </button>
        </div>

        {/* Guestbook Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative group hover:border-rose-500/30 transition-all"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={note.avatarUrl}
                    alt={note.author}
                    className="w-10 h-10 rounded-full object-cover border-2 border-rose-400/40"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{note.author}</h4>
                    <span className="text-[11px] text-rose-300/80">{note.relation} • {note.createdAt}</span>
                  </div>
                </div>

                {/* Video Note Thumbnail or Content */}
                {note.type === 'video' && note.videoUrl ? (
                  <div
                    onClick={() => setActiveVideo(note)}
                    className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 my-3 cursor-pointer group/vid"
                  >
                    <video
                      src={note.videoUrl}
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover/vid:bg-slate-950/20 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg group-hover/vid:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      <span>Watch Video Note</span>
                    </div>
                  </div>
                ) : null}

                <p className="text-slate-200 text-xs md:text-sm leading-relaxed my-2 italic">
                  "{note.content}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                <button
                  onClick={() => {
                    note.likes += 1;
                    soundFx.playPop();
                  }}
                  className="flex items-center gap-1.5 text-xs text-rose-400 font-medium hover:text-rose-300"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-400/30" />
                  <span>{note.likes} Likes</span>
                </button>

                <span className="text-[10px] text-slate-500 uppercase font-semibold">
                  Verified Guest
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-950/80 text-white flex items-center justify-center border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-black aspect-video flex items-center justify-center">
                <video
                  src={activeVideo.videoUrl}
                  autoPlay
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">
                  Video Note from {activeVideo.author}
                </h3>
                <p className="text-slate-300 text-xs italic">
                  "{activeVideo.content}"
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Record Live Video Note Modal */}
      <AnimatePresence>
        {showRecordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-rose-400" />
                  <span>Record Birthday Video Note</span>
                </h3>
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Webcam Preview or Recorded Video */}
              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative mb-4 border border-slate-800">
                {recordedUrl ? (
                  <video src={recordedUrl} controls className="w-full h-full object-cover" />
                ) : (
                  <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                )}

                {isRecording && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>RECORDING...</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mb-4">
                {!recordedUrl ? (
                  isRecording ? (
                    <button
                      onClick={stopRecording}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
                    >
                      Stop Recording
                    </button>
                  ) : (
                    <button
                      onClick={startRecording}
                      className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Start Webcam Recording</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => setRecordedUrl(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Re-record Video
                  </button>
                )}
              </div>

              <form onSubmit={handlePostNote} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aunt Jessica"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Relation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cousin / Friend"
                      value={authorRelation}
                      onChange={(e) => setAuthorRelation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Written Wish / Message
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Type your heartfelt birthday wish..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!authorName.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Post Note To Guestbook</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
