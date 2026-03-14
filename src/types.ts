
export type UserRole = 'admin' | 'guest';

export interface NewsItem {
  id: string;
  title: string;
  content: string; // Résumé pour la liste
  body?: string;   // Contenu complet pour la page de détail
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

// Nouvelle interface pour la Boîte de Réception (Témoignages & Messages)
export interface InboxMessage {
    id: string;
    type: 'text' | 'audio';
    senderName: string;
    senderPhone?: string; // Optionnel
    content: string; // Texte ou Base64 Audio URL
    audioDuration?: string; // Pour l'affichage "0:15"
    receivedAt: number; // Timestamp
    expiresAt: number; // Timestamp + 24h
    isRead: boolean;
}

// Interface pour le générateur de cartes
export interface DawaCardTemplate {
    id: string;
    name: string;
    bgGradient: string;
    textColor: string;
    borderColor: string;
}

// --- TYPES HALAQA / KHATMA ---
export interface JuzStatus {
    juzNumber: number;
    status: 'free' | 'reading' | 'completed';
    readerName?: string;
    completedAt?: string;
}

export interface KhatmaSession {
    id: string;
    intention: string; // Ex: "Pour la paix", "Pour les malades"
    startDate: string;
    completedCount: number; // Nombre total de Khatmas finies avant celle-ci
    juzs: JuzStatus[]; // Liste des 30 Juz
}

export interface ProphetStory {
    id: string;
    title: string;
    content: string; // Markdown supporté
    source: string;
    readTime: string;
    category: 'Histoire' | 'Sunnah' | 'Miracle';
}
