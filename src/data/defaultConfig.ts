import { RecipientConfig } from '../types';

export const defaultConfig: RecipientConfig = {
  recipientName: 'Emily',
  nickname: 'My Babe 🌸',
  turningAge: 24,
  birthDate: 'August 10, 2026',
  headline: 'Happy Birthday, My Dearest Emily! 💕',
  subheadline: 'To my favorite person in the whole world. I created this special cozy space just for you, babe.',
  letterMessage: `Dearest Emily,

Happy Birthday my babe! 🌸✨

Words will never be enough to tell you how deeply loved and appreciated you are. From every quiet morning coffee to every sunset walk together, you make my life infinitely sweeter and brighter. Your kindness, soft smile, and laughter mean everything to me.

I created this little sanctuary wrapped in all your favorite shades of soft pink to celebrate you, our sweet memories, and everything that makes you so uniquely wonderful. 

Take your time unwrapping your candles, exploring our Polaroid gallery, opening your secret memory lock box, and reading warm birthday notes from the people who adore you.

Happy Birthday, babe. Here is to a year filled with happiness, dreams coming true, and endless sweet moments together. ❤️`,
  secretPasscode: '1234',

  photosAndVideos: [
    {
      id: 'media-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200',
      title: 'Golden Sunset Together',
      caption: 'Holding hands while watching the pink horizon over the water. You looked so radiant, babe.',
      date: 'May 2025',
      category: 'Adventures'
    },
    {
      id: 'media-2',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800',
      title: 'Our Spontaneous Laughs',
      caption: 'Dancing under the soft evening lights. Tap to play our video moment!',
      date: 'Aug 2025',
      category: 'Cute Moments'
    },
    {
      id: 'media-3',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=1200',
      title: 'Cozy Pink Floral Afternoon',
      caption: 'Surprising you with your favorite pink peonies and fresh baked pastries.',
      date: 'Oct 2025',
      category: 'Milestones'
    },
    {
      id: 'media-4',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
      title: 'Picnic in the Park',
      caption: 'Sunny skies, strawberries, iced lattes, and endless smiles with my babe.',
      date: 'Jan 2026',
      category: 'Cute Moments'
    },
    {
      id: 'media-5',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
      title: 'Late Night Dessert Run',
      caption: 'Craving strawberry shortcake at midnight and laughing all the way there.',
      date: 'March 2026',
      category: 'Funny'
    }
  ],

  wishNotes: [
    {
      id: 'wish-1',
      sender: 'For My Babe 💖',
      tag: 'Heartfelt',
      message: 'Thank you for bringing so much tenderness and joy into my life. Every day with you feels like a gift.'
    },
    {
      id: 'wish-2',
      sender: 'Scratch Card #1 🪙',
      tag: 'Scratch To Reveal ✨',
      message: 'Scratch off this card to reveal your custom birthday surprise voucher!',
      isScratchCard: true,
      scratchSecret: '🌸 BABE REWARD: 1x Romantic Candlelight Dinner & Flowers of Your Choice!'
    },
    {
      id: 'wish-3',
      sender: 'Scratch Card #2 🪙',
      tag: 'Scratch To Reveal ✨',
      message: 'Scratch to reveal a sweet promise!',
      isScratchCard: true,
      scratchSecret: '🎀 PROMISE: A full weekend spa getaway & breakfast in bed on me!'
    },
    {
      id: 'wish-4',
      sender: 'Sweet Reminder 🌷',
      tag: 'Love Note',
      message: 'You have the warmest heart and the prettiest smile. Never forget how truly special you are, Emily!'
    }
  ],

  treasureStages: [
    {
      id: 1,
      title: 'Capsule 1: Our Favorite Nickname',
      riddle: 'What do I love calling you every single day? (Hint: Soft, sweet, 4 letters!)',
      hint: 'Type "babe"',
      answer: 'babe',
      unlockedContent: {
        heading: '🔓 Secret Love Capsule #1 Unlocked!',
        body: 'Spot on! You will always be my babe. You bring so much sweetness to my world.',
        couponTitle: '🧋 1x Fresh Strawberry Milk Tea & Pastry Pass'
      }
    },
    {
      id: 2,
      title: 'Capsule 2: Your Favorite Color',
      riddle: 'What color makes your eyes light up and makes your heart happiest?',
      hint: 'Type "pink"',
      answer: 'pink',
      unlockedContent: {
        heading: '🌸 Secret Love Capsule #2 Unlocked!',
        body: 'Of course! Beautiful soft pink, just like this entire website made just for you, Emily.',
        couponTitle: '💐 1x Fresh Pink Roses Delivery'
      }
    },
    {
      id: 3,
      title: 'Capsule 3: The Magic Birthday Wish',
      riddle: 'What is the special magic word to open your grand birthday surprise box? (Hint: Type "love" or "emily")',
      hint: 'Type "love" or "emily"',
      answer: 'love',
      unlockedContent: {
        heading: '💖 GRAND BIRTHDAY TREASURE UNLOCKED!',
        body: 'Happy Birthday Emily! You have unlocked the final love capsule. I have a real gift box waiting for you right now! I love you so much, babe. 🎁✨',
        mediaUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200',
        couponTitle: '👑 Ultimate Queen of My Heart Pass'
      }
    }
  ],

  guestbookNotes: [
    {
      id: 'gb-1',
      author: 'Sarah (Best Friend)',
      relation: 'Bestie',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      type: 'text',
      content: 'Happy Birthday Emily! Sending you the biggest hugs! May your year be filled with lots of pink, iced matcha, and happiness! 🥳💖',
      createdAt: 'Today at 10:15 AM',
      likes: 12
    },
    {
      id: 'gb-2',
      author: 'Mom & Dad',
      relation: 'Family',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      type: 'text',
      content: 'Happy Birthday to our wonderful Emily! So proud of everything you do. We love you so much!',
      createdAt: 'Today at 8:30 AM',
      likes: 9
    },
    {
      id: 'gb-3',
      author: 'Jessica',
      relation: 'Friend',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      type: 'text',
      content: 'Happy Birthday babe!! Can’t wait to celebrate with you this weekend! 🥂✨',
      createdAt: 'Yesterday',
      likes: 6
    }
  ],

  coupons: [
    { title: '🌷 Fresh Pink Flowers', desc: 'Redeem anytime for a bouquet of your favorite fresh pink blooms.', icon: 'Flower' },
    { title: '☕ Cafe & Bakery Date', desc: 'Unlimited iced drinks and strawberry tarts on me.', icon: 'Coffee' },
    { title: '🎬 Movie & Foot Massage', desc: 'Your choice of movie, cozy blankets, and full relaxation.', icon: 'Sparkles' }
  ]
};
