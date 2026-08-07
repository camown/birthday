import { RecipientConfig } from '../types';

export const defaultConfig: RecipientConfig = {
  recipientName: 'Maya',
  nickname: 'Maya Sunshine ✨',
  turningAge: 25,
  birthDate: 'August 10, 2026',
  headline: 'Happy 25th Birthday, Maya!',
  subheadline: 'To the person who turns ordinary days into magical memories. This entire website was built just for you.',
  letterMessage: `Dearest Maya,

Happy Birthday! 🎉

Words will never be enough to capture how bright you make every room you step into. From our spontaneous midnight Boba runs to laughing until our stomachs hurt on road trips, you bring unmatched warmth, kindness, and joy to my life.

I built this surprise space to celebrate you, our memories, and everything that makes you so genuinely incredible. Take your time exploring every corner—blow out your candles, unlock secret treasure boxes, watch our videos, and read messages from everyone who loves you!

Happy Birthday! May this year be filled with boundless wonder, unforgettable moments, and endless happiness. ❤️`,
  secretPasscode: '1234',

  photosAndVideos: [
    {
      id: 'media-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200',
      title: 'The Unforgettable Birthday Bash',
      caption: 'Sparklers, golden laughs, and unforgettable birthday vibes! You shone brighter than all the lights combined.',
      date: 'Aug 2025',
      category: 'Milestones'
    },
    {
      id: 'media-2',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800',
      title: 'Our Spontaneous Sunset Road Trip',
      caption: 'Dancing under the golden hour horizon with the windows rolled all the way down! Click to watch this video play.',
      date: 'June 2025',
      category: 'Adventures'
    },
    {
      id: 'media-3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
      title: 'Cozy Coffee & Endless Laughs',
      caption: 'When a simple coffee run turned into 4 hours of deep chats and uncontrollable giggles.',
      date: 'Feb 2026',
      category: 'Cute Moments'
    },
    {
      id: 'media-4',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
      title: 'Confetti & Midnight Celebrations',
      caption: 'When the clock struck 12 and the room exploded with birthday cheer!',
      date: 'Jan 2026',
      category: 'Funny'
    },
    {
      id: 'media-5',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
      title: 'Chasing Beach Sunsets',
      caption: 'Salty hair, warm sand, and the peaceful sound of ocean waves by your side.',
      date: 'July 2025',
      category: 'Adventures'
    },
    {
      id: 'media-6',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200',
      title: 'Popcorn & Movie Night Marathon',
      caption: 'Matching pajamas, giant blankets, and a 3-movie marathon!',
      date: 'Nov 2025',
      category: 'Cute Moments'
    }
  ],

  wishNotes: [
    {
      id: 'wish-1',
      sender: 'Your Best Friend',
      tag: 'Heartfelt',
      message: 'May your 25th year bring you as much happiness, clarity, and hilarious adventure as you bring to everyone around you!'
    },
    {
      id: 'wish-2',
      sender: 'Secret Scratch Card #1',
      tag: 'Scratch To Reveal 🪙',
      message: 'Scratch off this card to reveal your custom birthday gift voucher!',
      isScratchCard: true,
      scratchSecret: '🎟️ VIP REWARD: 1x Unlimited Fancy Dinner & Dessert Night On Me (No Expiration Date!)'
    },
    {
      id: 'wish-3',
      sender: 'Secret Scratch Card #2',
      tag: 'Scratch To Reveal 🪙',
      message: 'Scratch to reveal a sweet truth about you!',
      isScratchCard: true,
      scratchSecret: '🌟 TRUTH: You have the rarest superpower—making anyone feel instantly welcomed and loved.'
    },
    {
      id: 'wish-4',
      sender: 'Adventure Crew',
      tag: 'Road Trips',
      message: 'To many more spontaneous weekend getaways, terrible singing in the car, and delicious food stops!'
    }
  ],

  treasureStages: [
    {
      id: 1,
      title: 'Level 1: The Memory Key',
      riddle: 'What is our absolute favorite late-night treat after a long week? (Hint: Cold, sweet, comes in boba or ice cream!)',
      hint: 'Starts with "Boba" or "Ice Cream". Try typing "boba"!',
      answer: 'boba',
      unlockedContent: {
        heading: '🔓 Memory Vault #1 Unlocked!',
        body: 'You remembered! Remember when we waited 45 minutes in line in the rain just to get the brown sugar milk tea? Totally worth it.',
        couponTitle: '🧋 Free Boba Coupon Unlocked'
      }
    },
    {
      id: 2,
      title: 'Level 2: The Secret Nickname',
      riddle: 'What is the cheerful nickname given to you because you light up every room? (Hint: Check top header!)',
      hint: 'Look at the top nickname or type "sunshine".',
      answer: 'sunshine',
      unlockedContent: {
        heading: '🌟 Memory Vault #2 Unlocked!',
        body: 'Spot on! You truly are sunshine in human form. Keep glowing and spreading that magnetic positivity!',
        couponTitle: '☀️ 100 Compliment Pass Unlocked'
      }
    },
    {
      id: 3,
      title: 'Level 3: The Grand Birthday Password',
      riddle: 'What magic word opens the ultimate birthday surprise box? (Hint: Type "love" or "happy")',
      hint: 'Type "love" to open the grand vault.',
      answer: 'love',
      unlockedContent: {
        heading: '🎉 GRAND TREASURE UNLOCKED!',
        body: 'Congratulations! You unlocked the Grand Birthday Vault. You are cherished beyond words. Your real life gift box is waiting for you in the living room! 🎁✨',
        mediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200',
        couponTitle: '🏆 Ultimate Birthday Queen Crown 👑'
      }
    }
  ],

  guestbookNotes: [
    {
      id: 'gb-1',
      author: 'Sarah & Alex',
      relation: 'College Buddies',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      type: 'video',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      content: 'Happy Birthday Maya! Sending you the biggest virtual hug from across the country! 🥳',
      createdAt: 'Today at 10:15 AM',
      likes: 12
    },
    {
      id: 'gb-2',
      author: 'David (Big Brother)',
      relation: 'Family',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      type: 'text',
      content: 'Happy 25th Maya! So proud of the incredible person you are growing into every day. Enjoy your special day to the absolute fullest!',
      createdAt: 'Today at 8:30 AM',
      likes: 8
    },
    {
      id: 'gb-3',
      author: 'Elena',
      relation: 'Work Bestie',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      type: 'text',
      content: 'Work would be so boring without our coffee chats and funny slack memes! Have the best birthday ever, Maya! 🎂',
      createdAt: 'Yesterday',
      likes: 5
    }
  ],

  coupons: [
    { title: '☕ Coffee & Pastry On Me', desc: 'Redeem anytime for your favorite iced latte and almond croissant.', icon: 'Coffee' },
    { title: '🎬 Movie Night Choice', desc: 'You get full pick of movie, snacks, and seating control.', icon: 'Film' },
    { title: '🚗 Road Trip Escape', desc: 'A day trip to anywhere within 2 hours with all snacks paid.', icon: 'Car' }
  ]
};
