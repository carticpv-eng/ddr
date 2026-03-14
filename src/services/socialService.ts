
import { MOCK_DEBATES, MOCK_NEWS } from '../constants';
import { Debate, NewsItem } from '../types';

// ==============================================================================
// ⚙️ CONFIGURATION YOUTUBE
// ==============================================================================

// Clé API fournie
const YOUTUBE_API_KEY = "AIzaSyDNd-hlSuhWOfVaIX7X6lWu27kpVRsKeMY"; 

// Handle de la chaîne
const CHANNEL_HANDLE = "@ddrofficielle"; 

// ==============================================================================

const CACHE_KEY = 'ddr_youtube_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 heure de cache

/**
 * Étape 1 : Trouve l'ID technique (UC...) à partir du handle (@ddrofficielle)
 */
const getChannelIdFromHandle = async (handle: string): Promise<string | null> => {
    // Nettoyage du handle (enlève le @ si présent)
    const cleanHandle = handle.replace('@', '');
    
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) return null;
        
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            return data.items[0].id; // Retourne l'ID qui commence par UC...
        }
        return null;
    } catch (e) {
        console.error("Erreur récupération ID chaîne:", e);
        return null;
    }
};

/**
 * Récupère les vidéos YouTube pour la section Débats
 * (Avec mise en cache pour économiser le quota)
 */
export const fetchYoutubeDebates = async (): Promise<Debate[]> => {
  // Vérification basique de la clé
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.includes("VOTRE_CLE")) {
      console.warn("⚠️ Clé API YouTube non configurée. Affichage des données de démonstration.");
      return new Promise(resolve => setTimeout(() => resolve(MOCK_DEBATES), 800));
  }

  // 1. Vérification du cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      // Si le cache a moins d'une heure, on l'utilise
      if (Date.now() - timestamp < CACHE_DURATION) {
          console.log("✅ Utilisation du cache YouTube");
          return data;
      }
  }

  try {
    // 2. On récupère le vrai ID de la chaîne
    let targetChannelId = "";
    
    // Si CHANNEL_HANDLE est défini, on cherche l'ID
    if (CHANNEL_HANDLE) {
        const resolvedId = await getChannelIdFromHandle(CHANNEL_HANDLE);
        if (resolvedId) {
            targetChannelId = resolvedId;
            console.log(`✅ ID trouvé pour ${CHANNEL_HANDLE} : ${resolvedId}`);
        } else {
            console.warn(`Impossible de trouver l'ID pour le handle ${CHANNEL_HANDLE}`);
            // En cas d'échec de résolution du handle, on retourne les mocks pour ne pas casser le site
            return MOCK_DEBATES;
        }
    } else {
        targetChannelId = "UC_PLACEHOLDER"; 
    }

    // 3. Appel API : Recherche les dernières vidéos de la chaîne trouvée
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${targetChannelId}&part=snippet,id&order=date&maxResults=12&type=video`
    );

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur API YouTube:', errorData);
        throw new Error('Échec de la récupération YouTube');
    }

    const data = await response.json();

    // 4. Transformation des données YouTube au format "Debate" de notre site
    const formattedData = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: decodeHTMLEntities(item.snippet.title),
      description: item.snippet.description,
      videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      date: new Date(item.snippet.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      speaker: item.snippet.channelTitle || 'DDR Officiel',
      location: 'YouTube',
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url
    }));

    // 5. Sauvegarde en cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: formattedData,
        timestamp: Date.now()
    }));

    return formattedData;

  } catch (error) {
    console.error("Erreur critique fetch YouTube, bascule sur Mock:", error);
    return MOCK_DEBATES; // Fallback : on montre les fausses données si l'API plante
  }
};

/**
 * Utilitaire pour nettoyer les titres YouTube (ex: &quot; -> ")
 */
const decodeHTMLEntities = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
};

/**
 * Récupère les posts Facebook (Simulé pour l'instant)
 */
export const fetchFacebookNews = async (): Promise<NewsItem[]> => {
    // Note: L'API Facebook est plus complexe et nécessite un Token Serveur.
    // Pour l'instant, on simule l'appel.
    return new Promise(resolve => setTimeout(() => resolve(MOCK_NEWS), 1000));
};
