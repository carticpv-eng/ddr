
export type UserRole = 'admin' | 'guest';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: 'Event' | 'News' | 'Announcement';
  createdAt: string;
  author: string;
  tags: string[];
}

export interface Debate {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube/TikTok link
  date: string;
  speaker: string;
  location: string;
  thumbnailUrl?: string; // Nouvelle propriété pour l'optimisation
}

export interface Conversion {
  id: string;
  name: string;
  story: string;
  date: string;
  mediaUrl: string; // Image or Video
}

export interface OrganizationInfo {
  id: string;
  title: string;
  description: string;
  icon: string; // Material symbol name
  order: number;
}

// Nouvelle interface pour la campagne de don (École)
export interface DonationCampaign {
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    imageUrl: string;
    trustIndicators: { icon: string, title: string, text: string }[];
}

export interface Donation {
  id: string;
  amount: number;
  donorName: string; // "Anonyme" si isAnonymous est true
  donorPhone: string;
  isAnonymous: boolean;
  method: 'Wave' | 'OrangeMoney' | 'MTN' | 'Carte' | 'PayPal';
  status: 'pending' | 'success' | 'failed';
  transactionId?: string;
  createdAt: string;
  campaignId?: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  subject: string;
  requestedDate: string;
  message: string;
  status: 'pending' | 'confirmed' | 'rejected';
  adminComment?: string;
  createdAt: string;
}

export interface Speaker {
    id: string;
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
    socials: {
        facebook?: string;
        youtube?: string;
        tiktok?: string;
    }
}
