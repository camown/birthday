import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundFx } from '../lib/audio';

// Real Animated GIF URLs for Chiikawa, Usagi, and Hachiware
export const GIF_URLS = {
  chiikawaMain: "https://media1.tenor.com/m/-zIxOFXGvJ4AAAAC/chiikawa.gif",
  chiikawaBirthday: "https://media.tenor.com/iParqyBnKjAAAAAM/chiikawa-birthday.gif",
  chiikawaTrio: "https://i.pinimg.com/originals/b5/0a/e3/b50ae3371b34b6f66f1e25dafd286ab1.gif",
  usagiRun: "https://media1.tenor.com/m/E0Tm5vxBNGUAAAAd/chiikawa-usagi.gif",
  hachiwareMain: "https://media1.tenor.com/m/46Ziq3F6I04AAAAC/chiikawa-hachiware.gif",
};

// GIF Image Component with Error Fallback
export const ChiikawaGIFImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  fallbackSvg?: React.ReactNode;
}> = ({ src, alt, className = "w-24 h-24", onClick, fallbackSvg }) => {
  const [hasError, setHasError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 50,
      origin: { x, y },
      colors: ['#f472b6', '#fb7185', '#fde047', '#60a5fa'],
      disableForReducedMotion: true,
    });

    if (onClick) onClick();
  };

  if (hasError && fallbackSvg) {
    return <div onClick={handleClick}>{fallbackSvg}</div>;
  }

  return (
    <div className="relative inline-flex items-center justify-center p-0 m-0 bg-transparent border-0 outline-none shadow-none select-none">
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        onClick={handleClick}
        className={`${className} cursor-pointer object-contain select-none border-0 outline-none shadow-none ring-0 transition-transform hover:scale-110 active:scale-95`}
        style={{
          mixBlendMode: 'multiply',
          filter: 'contrast(138%) brightness(116%)',
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        }}
      />
    </div>
  );
};

// 1. Authentic Vector SVG Render for Usagi (Fallback)
export const UsagiSVG: React.FC<{ className?: string; onClick?: () => void }> = ({
  className = "w-20 h-20",
  onClick,
}) => (
  <svg
    viewBox="0 0 120 140"
    className={`${className} cursor-pointer select-none`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <ellipse cx="60" cy="132" rx="32" ry="5" fill="#cbd5e1" opacity="0.4" />
    <g>
      <path
        d="M 38 48 C 26 12, 38 2, 46 14 C 52 22, 48 42, 48 48 Z"
        fill="#fef08a"
        stroke="#18181b"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />
      <path d="M 40 40 C 34 20, 40 10, 44 18 Z" fill="#fbcfe8" />
      <path
        d="M 82 48 C 94 12, 82 2, 74 14 C 68 22, 72 42, 72 48 Z"
        fill="#fef08a"
        stroke="#18181b"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />
      <path d="M 80 40 C 86 20, 80 10, 76 18 Z" fill="#fbcfe8" />
      <path
        d="M 28 80 C 20 52, 40 38, 60 38 C 80 38, 100 52, 92 80 C 98 106, 85 125, 60 125 C 35 125, 22 106, 28 80 Z"
        fill="#fef08a"
        stroke="#18181b"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />
      <ellipse cx="42" cy="125" rx="8" ry="6" fill="#fef08a" stroke="#18181b" strokeWidth="3.2" />
      <ellipse cx="78" cy="125" rx="8" ry="6" fill="#fef08a" stroke="#18181b" strokeWidth="3.2" />
      <path d="M 26 78 C 14 68, 12 78, 24 84 Z" fill="#fef08a" stroke="#18181b" strokeWidth="3.2" />
      <path d="M 94 78 C 106 68, 108 78, 96 84 Z" fill="#fef08a" stroke="#18181b" strokeWidth="3.2" />
      <path d="M 38 58 Q 44 54 48 59" stroke="#18181b" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M 82 58 Q 76 54 72 59" stroke="#18181b" strokeWidth="2.8" strokeLinecap="round" />
      <ellipse cx="46" cy="67" rx="6.5" ry="8.5" fill="#18181b" />
      <circle cx="44" cy="64" r="2.8" fill="#ffffff" />
      <ellipse cx="74" cy="67" rx="6.5" ry="8.5" fill="#18181b" />
      <circle cx="72" cy="64" r="2.8" fill="#ffffff" />
      <ellipse cx="33" cy="75" rx="8" ry="5" fill="#f472b6" opacity="0.6" />
      <path d="M 29 73 L 29 77 M 33 73 L 33 77 M 37 73 L 37 77" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="87" cy="75" rx="8" ry="5" fill="#f472b6" opacity="0.6" />
      <path d="M 83 73 L 83 77 M 87 73 L 87 77 M 91 73 L 91 77" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
      <path d="M 54 74 Q 60 79 66 74" stroke="#18181b" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 60 72 L 60 76" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

// 2. Authentic Vector SVG Render for Chiikawa (Fallback)
export const ChiikawaSVG: React.FC<{ className?: string; onClick?: () => void }> = ({
  className = "w-20 h-20",
  onClick,
}) => (
  <svg
    viewBox="0 0 120 120"
    className={`${className} cursor-pointer select-none`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <ellipse cx="60" cy="110" rx="32" ry="5" fill="#cbd5e1" opacity="0.4" />
    <g>
      <circle cx="38" cy="28" r="11" fill="#ffffff" stroke="#18181b" strokeWidth="3.8" />
      <circle cx="38" cy="28" r="5" fill="#fbcfe8" />
      <circle cx="82" cy="28" r="11" fill="#ffffff" stroke="#18181b" strokeWidth="3.8" />
      <circle cx="82" cy="28" r="5" fill="#fbcfe8" />
      <path
        d="M 28 65 C 20 38, 40 22, 60 22 C 80 22, 100 38, 92 65 C 98 86, 85 105, 60 105 C 35 105, 22 86, 28 65 Z"
        fill="#ffffff"
        stroke="#18181b"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />
      <ellipse cx="44" cy="104" rx="7" ry="5" fill="#ffffff" stroke="#18181b" strokeWidth="3" />
      <ellipse cx="76" cy="104" rx="7" ry="5" fill="#ffffff" stroke="#18181b" strokeWidth="3" />
      <ellipse cx="26" cy="68" rx="6" ry="5" fill="#ffffff" stroke="#18181b" strokeWidth="3" />
      <ellipse cx="94" cy="68" rx="6" ry="5" fill="#ffffff" stroke="#18181b" strokeWidth="3" />
      <path d="M 40 42 Q 44 39 47 42" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 80 42 Q 76 39 73 42" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 41 52 Q 46 46 51 52" stroke="#18181b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M 69 52 Q 74 46 79 52" stroke="#18181b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <ellipse cx="35" cy="58" rx="8" ry="5" fill="#f472b6" opacity="0.6" />
      <path d="M 31 56 L 31 60 M 35 56 L 35 60 M 39 56 L 39 60" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="85" cy="58" rx="8" ry="5" fill="#f472b6" opacity="0.6" />
      <path d="M 81 56 L 81 60 M 85 56 L 85 60 M 89 56 L 89 60" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M 54 58 Q 60 66 66 58 Z"
        fill="#f43f5e"
        stroke="#18181b"
        strokeWidth="2.5"
      />
    </g>
  </svg>
);

// 3. Authentic Vector SVG Render for Hachiware (Fallback)
export const HachiwareSVG: React.FC<{ className?: string; onClick?: () => void }> = ({
  className = "w-20 h-20",
  onClick,
}) => (
  <svg
    viewBox="0 0 120 120"
    className={`${className} cursor-pointer select-none`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <ellipse cx="60" cy="110" rx="32" ry="5" fill="#cbd5e1" opacity="0.4" />
    <g>
      <path d="M 28 35 L 42 20 L 48 42 Z" fill="#60a5fa" stroke="#18181b" strokeWidth="3.2" />
      <path d="M 92 35 L 78 20 L 72 42 Z" fill="#60a5fa" stroke="#18181b" strokeWidth="3.2" />
      <path
        d="M 28 65 C 20 38, 40 22, 60 22 C 80 22, 100 38, 92 65 C 98 86, 85 105, 60 105 C 35 105, 22 86, 28 65 Z"
        fill="#ffffff"
        stroke="#18181b"
        strokeWidth="3.8"
        strokeLinejoin="round"
      />
      <path
        d="M 28 52 C 36 32, 52 24, 60 38 C 68 24, 84 32, 92 52 C 96 36, 82 22, 60 22 C 38 22, 24 36, 28 52 Z"
        fill="#60a5fa"
      />
      <ellipse cx="45" cy="52" rx="6.5" ry="8.5" fill="#18181b" />
      <circle cx="43" cy="49" r="2.8" fill="#ffffff" />
      <ellipse cx="75" cy="52" rx="6.5" ry="8.5" fill="#18181b" />
      <circle cx="73" cy="49" r="2.8" fill="#ffffff" />
      <ellipse cx="35" cy="60" rx="8" ry="5" fill="#f472b6" opacity="0.6" />
      <path d="M 31 58 L 31 62 M 35 58 L 35 62 M 39 58 L 39 62" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="85" cy="60" rx="8" ry="5" fill="#f472b6" opacity="0.6" />
      <path d="M 81 58 L 81 62 M 85 58 L 85 62 M 89 58 L 89 62" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
      <path d="M 54 58 Q 60 65 66 58" stroke="#18181b" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const ChiikawaBackground: React.FC = () => {
  const [usagiKey, setUsagiKey] = useState(0);
  const [usagiShout, setUsagiShout] = useState("Yaha! ⚡");
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);

  const shouts = ["Yaha! ⚡", "Ura! 🌟", "Puru! 🎂", "Yaaa! ✨", "Fuwa! 💕", "Haa?! 🐰"];

  useEffect(() => {
    const interval = setInterval(() => {
      setUsagiKey((prev) => prev + 1);
      setUsagiShout(shouts[Math.floor(Math.random() * shouts.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const triggerCharacterPop = (name: string, sound: string) => {
    setActiveSpeech(`${name}: ${sound}`);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#f472b6', '#fb7185', '#fde047', '#60a5fa'],
    });

    setTimeout(() => {
      setActiveSpeech(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Tap Pop Speech Indicator */}
      <AnimatePresence>
        {activeSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-rose-950/90 text-rose-100 text-xs sm:text-sm font-extrabold shadow-2xl border-2 border-rose-300 z-50 pointer-events-none flex items-center gap-2 backdrop-blur-md"
          >
            <span>✨</span>
            <span>{activeSpeech}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Real Chiikawa GIF (Top Left) */}
      <motion.div
        animate={{
          y: [0, -12, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{
          repeat: Infinity,
          duration: 4.2,
          ease: 'easeInOut',
        }}
        className="absolute top-16 left-3 sm:left-8 z-20 pointer-events-auto"
      >
        <ChiikawaGIFImage
          src={GIF_URLS.chiikawaMain}
          alt="Chiikawa GIF"
          className="w-24 h-24 sm:w-28 sm:h-28"
          onClick={() => triggerCharacterPop("Chiikawa", "Waaa! Yay! 🎉")}
          fallbackSvg={<ChiikawaSVG className="w-24 h-24" onClick={() => triggerCharacterPop("Chiikawa", "Yay! 🎉")} />}
        />
      </motion.div>

      {/* 2. Real Hachiware GIF (Top Right) */}
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [2, -2, 2],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: 'easeInOut',
        }}
        className="absolute top-20 right-3 sm:right-8 z-20 pointer-events-auto"
      >
        <ChiikawaGIFImage
          src={GIF_URLS.hachiwareMain}
          alt="Hachiware GIF"
          className="w-22 h-22 sm:w-26 sm:h-26"
          onClick={() => triggerCharacterPop("Hachiware", "Nantanoka! 📸✨")}
          fallbackSvg={<HachiwareSVG className="w-22 h-22" onClick={() => triggerCharacterPop("Hachiware", "Cheer! 📸")} />}
        />
      </motion.div>

      {/* 3. Real Running Usagi GIF across the bottom screen! */}
      <AnimatePresence>
        <motion.div
          key={usagiKey}
          initial={{ x: '-20vw', y: 0 }}
          animate={{ x: '115vw', y: [0, -15, 0, -15, 0] }}
          transition={{
            x: { duration: 11, ease: 'linear' },
            y: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
          }}
          className="absolute bottom-2 left-0 z-20 pointer-events-auto flex items-center"
        >
          <ChiikawaGIFImage
            src={GIF_URLS.usagiRun}
            alt="Usagi Running GIF"
            className="w-22 h-22 sm:w-28 sm:h-28"
            onClick={() => triggerCharacterPop("Usagi", "URAAA! ⚡⚡")}
            fallbackSvg={<UsagiSVG className="w-20 h-20" onClick={() => triggerCharacterPop("Usagi", "Yaha! ⚡")} />}
          />
        </motion.div>
      </AnimatePresence>

      {/* 4. Bottom Right Floating Transparent Party GIFs */}
      <div className="fixed bottom-4 right-4 z-30 pointer-events-auto hidden md:flex items-center gap-2">
        <ChiikawaGIFImage
          src={GIF_URLS.chiikawaBirthday}
          alt="Chiikawa Birthday"
          className="w-14 h-14"
          onClick={() => triggerCharacterPop("Chiikawa", "Happy Birthday! 🎂")}
          fallbackSvg={<ChiikawaSVG className="w-8 h-8" />}
        />
        <ChiikawaGIFImage
          src={GIF_URLS.chiikawaTrio}
          alt="Chiikawa Trio"
          className="w-14 h-14"
          onClick={() => triggerCharacterPop("Trio", "Yaha! Party! 🎈")}
          fallbackSvg={<UsagiSVG className="w-8 h-8" />}
        />
      </div>
    </div>
  );
};


