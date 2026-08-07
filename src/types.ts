export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  caption: string;
  date?: string;
  category: 'Adventures' | 'Cute Moments' | 'Milestones' | 'Funny';
  posterUrl?: string;
}

export interface WishNote {
  id: string;
  sender: string;
  tag: string;
  message: string;
  isScratchCard?: boolean;
  scratchSecret?: string;
}

export interface TreasureStage {
  id: number;
  title: string;
  riddle: string;
  hint: string;
  answer: string; // Case-insensitive matching or code
  unlockedContent: {
    heading: string;
    body: string;
    mediaUrl?: string;
    couponTitle?: string;
  };
}

export interface GuestbookNote {
  id: string;
  author: string;
  relation: string;
  avatarUrl: string;
  type: 'text' | 'video' | 'audio';
  content?: string;
  videoUrl?: string;
  audioUrl?: string;
  createdAt: string;
  likes: number;
}

export interface RecipientConfig {
  recipientName: string;
  nickname: string;
  turningAge: number;
  birthDate: string;
  headline: string;
  subheadline: string;
  letterMessage: string;
  secretPasscode: string; // passcode to open Creator mode if desired
  photosAndVideos: GalleryItem[];
  wishNotes: WishNote[];
  treasureStages: TreasureStage[];
  guestbookNotes: GuestbookNote[];
  coupons: { title: string; desc: string; icon: string }[];
}
