
import { NewsItem, Debate, Conversion, OrganizationInfo, Appointment, Donation, Speaker, DonationCampaign, ProphetStory } from './types';

export const SPEAKERS: Speaker[] = [
    {
        id: 'diane',
        name: 'Oustaz Diane',
        role: 'Le Savant du Comparatisme',
        bio: 'Figure emblématique de la DDR, Oustaz Diane est reconnu pour sa maîtrise exceptionnelle des textes bibliques et coraniques. Sa pédagogie et sa rigueur scientifique ont guidé des milliers de personnes vers la vérité.',
        imageUrl: 'https://images.unsplash.com/photo-1547496502-ffa22b335e6f?q=80&w=800&auto=format&fit=crop', // Fallback, le code priorise l'image locale si présente
        socials: {
            facebook: 'https://www.facebook.com/Oustazdianeoff',
            youtube: 'https://www.youtube.com/@ddrlavraiechaine',
            tiktok: 'https://www.tiktok.com/@ddrofficielle'
        }
    },
    {
        id: 'aka',
        name: 'Ismaël Aka',
        role: 'Le Stratège du Débat',
        bio: 'Redoutable débatteur, Ismaël Aka se distingue par son éloquence et sa capacité à déconstruire les arguments complexes avec simplicité. Il est un pilier de la Dawa de rue en Côte d\'Ivoire.',
        imageUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop', // Fallback
        socials: {
            facebook: 'https://www.facebook.com/ismaelAKAofficiel',
            youtube: 'https://www.youtube.com/@ddrlavraiechaine',
            tiktok: 'https://www.tiktok.com/@ddrofficielle'
        }
    }
];

export const PROPHET_STORIES: ProphetStory[] = [
    {
        id: 'beginnings',
        title: "Le début de la Révélation",
        category: "Histoire",
        readTime: "3 min",
        source: "Sahih Al-Bukhari",
        content: `
**La Grotte de Hira**

Le Prophète (paix et bénédiction sur lui) aimait l'isolement. Il se retirait dans la grotte de Hira pour y adorer Allah pendant plusieurs nuits. 

C'est là, durant le mois de Ramadan, que l'Ange Jibril (Gabriel) lui apparut pour la première fois. L'ange lui dit : **"Lis !" (Iqra)**.
Le Prophète répondit : *"Je ne sais pas lire."*

L'ange le saisit et le pressa fort jusqu'à ce qu'il ne puisse plus supporter, puis le relâcha et dit : **"Lis !"**.
Il répondit encore : *"Je ne sais pas lire."*

Cela se produisit trois fois. Puis l'ange récita les premiers versets révélés du Coran :
> "Lis, au nom de ton Seigneur qui a créé, qui a créé l'homme d'une adhérence. Lis ! Ton Seigneur est le Très Noble..." (Sourate 96)

Le Prophète rentra chez lui, le cœur tremblant, auprès de son épouse Khadija (qu'Allah l'agrée), en disant : *"Couvrez-moi ! Couvrez-moi !"*.
        `
    },
    {
        id: 'taif',
        title: "La Miséricorde à Taif",
        category: "Miracle",
        readTime: "4 min",
        source: "Seerah Ibn Hisham",
        content: `
**L'épreuve la plus dure**

Après avoir été rejeté par les siens à la Mecque, le Prophète (paix et bénédiction sur lui) se rendit à Taif dans l'espoir de trouver du soutien. Mais les chefs de Taif se moquèrent de lui et envoyèrent les enfants et les esclaves pour lui jeter des pierres. Il saigna jusqu'à ce que ses sandales soient collées à ses pieds par le sang.

Il se réfugia dans un jardin, leva les mains vers le ciel et fit cette invocation poignante :
*"Ô Allah, je me plains à Toi de ma faiblesse, de mon manque de moyens et de mon humiliation devant les gens..."*

**L'Ange des Montagnes**

L'Ange Jibril apparut avec l'Ange des Montagnes et dit : *"Ô Muhammad ! Si tu le souhaites, je refermerai les deux montagnes sur eux (les habitants de Taif) pour les écraser."*

Malgré sa douleur et son humiliation, le Prophète, qui est une miséricorde pour l'univers, répondit :
> **"Non, j'espère plutôt qu'Allah fera sortir de leurs reins une descendance qui adorera Allah seul sans rien Lui associer."**

Et c'est ce qui arriva. Taif devint plus tard une ville musulmane.
        `
    },
    {
        id: 'cat',
        title: "Le Prophète et le Chat",
        category: "Sunnah",
        readTime: "2 min",
        source: "Hadith & Tradition",
        content: `
**La douceur envers les animaux**

Le Messager d'Allah (paix et bénédiction sur lui) a dit : *"Une femme est entrée en Enfer à cause d'une chatte qu'elle avait enfermée sans la nourrir ni la laisser manger les bêtes de la terre."*

On rapporte qu'un jour, le Prophète s'apprêtait à faire ses ablutions ou à prier, et il trouva un chat endormi sur le pan de son habit (Abaya).
Plutôt que de réveiller l'animal, il préféra **couper le morceau de tissu** de son habit pour ne pas déranger le sommeil du chat.

Cette histoire nous enseigne que la miséricorde en Islam s'étend à toutes les créatures vivantes.
        `
    },
    {
        id: 'smile',
        title: "Le Sourire du Prophète",
        category: "Sunnah",
        readTime: "2 min",
        source: "At-Tirmidhi",
        content: `
**Un visage rayonnant**

Abdullah ibn Al-Harith a dit : *"Je n'ai jamais vu quelqu'un sourire plus que le Messager d'Allah (paix et bénédiction sur lui)."*

Même dans les moments difficiles, son visage était apaisant pour ses compagnons. Il a enseigné :
> **"Sourire au visage de ton frère est une aumône (Sadaqa)."**

Le sourire n'est pas seulement une expression, c'est un acte d'adoration, une façon de répandre la paix et la positivité autour de soi, comme le faisait le meilleur des hommes.
        `
    },
    {
        id: 'date',
        title: "Le Tronc de Palmier qui pleure",
        category: "Miracle",
        readTime: "3 min",
        source: "Sahih Al-Bukhari",
        content: `
**La nostalgie d'un arbre**

Le Prophète (paix et bénédiction sur lui) avait l'habitude de s'appuyer contre un tronc de palmier lorsqu'il prononçait son sermon (Khutba) dans sa mosquée.
Lorsque la chaire (Minbar) fut construite pour qu'il soit plus visible, il délaissa le tronc pour monter sur le Minbar.

Soudain, toute la mosquée entendit un son déchirant, comme les pleurs d'un enfant ou le gémissement d'une chamelle. C'était le tronc de palmier qui pleurait la séparation d'avec le Prophète.

Le Prophète descendit du Minbar, alla vers le tronc et le serra contre lui jusqu'à ce qu'il se calme, comme on console un enfant.
Il dit : *"Il pleure à cause du Rappel (Dhikr) qu'il entendait près de lui."*
        `
    }
];

// Données de la campagne pour l'École
export const SCHOOL_CAMPAIGN: DonationCampaign = {
    id: 'ecole-science-foi',
    title: 'Grande Mosquée & École "Science & Foi"',
    description: "La DDR lance la construction d'un complexe éducatif islamique de référence à Abidjan. Cette école formera la future élite musulmane ivoirienne, alliant excellence académique et valeurs morales.",
    targetAmount: 50000000, // 50 Millions FCFA
    currentAmount: 12450000,
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop',
    trustIndicators: [
        { icon: '🧱', title: 'Matériaux & Briques', text: 'Achat de ciment, fer et briques pour les fondations.' },
        { icon: '👷', title: 'Main d\'œuvre', text: 'Paiement des maçons et ouvriers sur le chantier.' },
        { icon: '📚', title: 'Futur des Enfants', text: 'Investissement pour la Oumma de demain.' }
    ]
};

export const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Oustaz Diane : Grande tournée à l\'intérieur du pays',
    content: 'Le maître du comparatisme, Oustaz Diane, entame une série de conférences historiques à travers la Côte d\'Ivoire. Suivez son périple.',
    body: `
**Une mobilisation sans précédent pour la vérité**

Depuis le début du mois, Oustaz Diane a entamé une tournée historique à travers les villes de l'intérieur de la Côte d'Ivoire. De Bouaké à Korhogo, en passant par Daloa et San Pedro, la caravane de la DDR est accueillie par des foules immenses, assoiffées de savoir et de vérité.

"Notre mission n'est pas seulement de débattre, mais d'éduquer et d'apaiser les cœurs par la lumière des textes sacrés", a déclaré Oustaz Diane lors de son étape à Man.

**Les thèmes abordés**

Lors de ces rencontres, plusieurs sujets cruciaux sont traités :
*   La véritable nature de Jésus (Issa) dans les textes.
*   L'importance de la cohésion sociale entre Chrétiens et Musulmans.
*   Les preuves scientifiques de la prophétie de Muhammad (PSL).

Chaque conférence est suivie d'une séance de questions-réponses ouverte à tous, sans distinction de religion. C'est la marque de fabrique de la DDR : le débat ouvert, respectueux mais sans concession sur la vérité.

**Rejoignez-nous**

La tournée continue. Consultez le calendrier sur notre page Facebook officielle pour connaître la prochaine date près de chez vous.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop',
    category: 'Event',
    createdAt: '2023-11-25',
    author: 'Admin DDR',
    tags: ['Oustaz Diane', 'Conférence', 'Tournée']
  },
  {
    id: '2',
    title: 'Ismaël Aka face aux contradictions : Retour sur le débat',
    content: 'Retour sur le dernier débat percutant d\'Ismaël Aka qui a rassemblé des milliers de personnes à Yopougon. Une démonstration de logique implacable.',
    body: `
**Yopougon a tremblé sous la puissance de l'argumentation**

Ce samedi, la place Ficgayo de Yopougon était noire de monde. Ismaël Aka, fidèle à sa réputation de stratège du débat, a fait face à plusieurs contradicteurs venus questionner les fondements de l'Islam.

Le thème central : **"Le Péché Originel est-il biblique ?"**

Avec un calme olympien et une maîtrise textuelle impressionnante, Ismaël Aka a démontré, Bible en main, que le concept de péché héréditaire contredit les enseignements mêmes des prophètes de l'Ancien Testament.

> "L'âme qui pèche, c'est celle qui mourra. Le fils ne portera pas l'iniquité de son père..." (Ézéchiel 18:20)

Cette citation a marqué un tournant dans le débat, laissant l'audience, y compris de nombreux chrétiens présents, dans une profonde réflexion.

**Des conversions en direct**

Comme souvent lors des interventions de la DDR, la soirée s'est conclue par plusieurs Shahadas (attestations de foi) émouvantes. Des jeunes, touchés par la clarté du message, ont décidé d'embrasser l'Islam sur le champ.

Retrouvez la vidéo complète de ce débat sur notre chaîne YouTube officielle.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
    category: 'News',
    createdAt: '2023-11-20',
    author: 'DDR Media',
    tags: ['Ismaël Aka', 'Débat', 'Yopougon']
  },
  {
    id: '3',
    title: 'La DDR lance sa chaîne TikTok officielle',
    content: 'Retrouvez les meilleurs moments (Reels/Shorts) des débats de nos maîtres sur notre nouvelle chaîne TikTok @ddrofficielle.',
    body: `
**La Dawa à l'ère du numérique**

Consciente que la jeunesse est connectée en permanence, l'association DDR franchit une nouvelle étape dans sa communication digitale. Nous sommes fiers d'annoncer le lancement officiel de notre compte TikTok : **@ddrofficielle**.

**Pourquoi TikTok ?**

*   **Format court :** Des extraits percutants de 1 à 3 minutes pour aller à l'essentiel.
*   **Viralité :** Toucher un public qui ne regarderait pas forcément une conférence de 2 heures.
*   **Réactivité :** Réagir à l'actualité religieuse rapidement.

Nous vous invitons à vous abonner massivement et à partager les vidéos. Chaque partage est une forme de Dawa. Faites circuler la parole de vérité !

👉 [Cliquez ici pour vous abonner](https://www.tiktok.com/@ddrofficielle)
    `,
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    category: 'Announcement',
    createdAt: '2023-12-01',
    author: 'Communication',
    tags: ['Réseaux Sociaux', 'Vidéo', 'Digital']
  },
  {
    id: '4',
    title: 'Formation des jeunes avec Oustaz Diane',
    content: 'Une session privée où Oustaz Diane transmet son savoir aux futurs cadres de la DDR. "La relève est assurée".',
    body: `
**Préparer les leaders de demain**

Loin des caméras et des foules, un travail de fond s'opère. Oustaz Diane a tenu ce weekend un séminaire intensif de formation destiné aux jeunes membres actifs de la DDR.

L'objectif : transmettre les outils de la science comparée et les méthodes de prédication (Dawa) respectueuses.

"La fougue de la jeunesse doit être canalisée par la sagesse de la science", a rappelé Oustaz Diane.

Au programme :
1.  Mémorisation des versets clés (Bible & Coran).
2.  Techniques de rhétorique et d'éloquence.
3.  Comportement et éthique du débatteur musulman.

La DDR ne s'arrête pas à aujourd'hui. Nous construisons une génération capable de porter le flambeau de l'Islam avec intelligence et paix pour les décennies à venir.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop',
    category: 'News',
    createdAt: '2023-11-15',
    author: 'Formation',
    tags: ['Jeunesse', 'Transmission', 'Éducation']
  }
];

export const MOCK_DEBATES: Debate[] = [
  {
    id: '1',
    title: 'Jésus (Issa) : Prophète ou Dieu ?',
    description: 'Le débat légendaire d\'Oustaz Diane qui clarifie la position de l\'Islam avec des preuves bibliques irréfutables.',
    videoUrl: 'https://www.youtube.com/embed/LXb3EKWsInQ', 
    date: '2023-11-05',
    speaker: 'Oustaz Diane',
    location: 'Abidjan, Place DDR'
  },
  {
    id: '2',
    title: 'La vérité sur le Péché Originel',
    description: 'Ismaël Aka décortique le concept du péché originel face à des contradicteurs. Un chef-d\'œuvre de rhétorique.',
    videoUrl: 'https://www.youtube.com/embed/F1B9Fk_SgI0', 
    date: '2023-10-15',
    speaker: 'Ismaël Aka',
    location: 'Yopougon'
  },
  {
    id: '3',
    title: 'Bible & Coran : Laquelle est la parole de Dieu ?',
    description: 'Une analyse comparative textuelle menée par Oustaz Diane devant une foule attentive.',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', 
    date: '2023-09-20',
    speaker: 'Oustaz Diane',
    location: 'Abobo'
  },
  {
    id: '4',
    title: 'Qui est le Paraclet ?',
    description: 'Ismaël Aka démontre avec brio que le Paraclet annoncé par Jésus correspond au Prophète Muhammad (PSL).',
    videoUrl: 'https://www.youtube.com/embed/tMKXbLBgkEc', 
    date: '2023-08-12',
    speaker: 'Ismaël Aka',
    location: 'Adjamé'
  }
];

export const MOCK_CONVERSIONS: Conversion[] = [
  {
    id: '1',
    name: 'Aïcha K.',
    story: "C'est en regardant une vidéo d'Oustaz Diane sur Facebook que tout a basculé. Il expliquait un verset avec une telle clarté que mes doutes se sont dissipés. J'ai pris contact via la page officielle.",
    date: '2023-08-20',
    mediaUrl: 'https://images.unsplash.com/photo-1531123414780-f74242c2b052?q=80&w=800&auto=format&fit=crop' // Femme Africaine Voilée
  },
  {
    id: '2',
    name: 'Moussa (Ex-Marc)',
    story: "Je suivais Ismaël Aka sur YouTube pour me moquer au début. Mais sa patience et ses arguments logiques m'ont désarmé. Aujourd'hui, je suis fier d'être musulman grâce à la DDR.",
    date: '2023-09-15',
    mediaUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=800&auto=format&fit=crop' // Homme Africain
  },
  {
    id: '3',
    name: 'Maman Berthe',
    story: "À 60 ans, j'ai embrassé l'Islam. Mes enfants étaient choqués au début, mais en voyant que je suis devenue plus douce et patiente, ils ont accepté mon choix. La DDR m'a offert mes premiers livres.",
    date: '2023-10-02',
    mediaUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=800&auto=format&fit=crop' // Homme Africain âgé (Simulé Maman Berthe, image placeholder pour diversité)
  }
];

export const MOCK_INFO: OrganizationInfo[] = [
  { id: '1', title: 'Mission', description: 'Promouvoir le dialogue interreligieux.', icon: 'handshake', order: 1 },
  { id: '2', title: 'Vision', description: 'Une société apaisée et instruite.', icon: 'visibility', order: 2 },
  { id: '3', title: 'Valeurs', description: 'Respect, Vérité, Fraternité.', icon: 'favorite', order: 3 },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: '1', name: 'Kouamé Jean', phone: '0707070707', subject: 'Question théologique', requestedDate: '2023-11-20', message: 'Je veux comprendre...', status: 'pending', createdAt: '2023-11-15'},
    { id: '2', name: 'Awa Koné', phone: '0505050505', subject: 'Don matériel', requestedDate: '2023-11-22', message: 'Je veux donner des chaises', status: 'confirmed', createdAt: '2023-11-16'}
];

export const MOCK_DONATIONS: Donation[] = [
    { id: '1', amount: 5000, donorName: 'Anonyme', isAnonymous: true, donorPhone: '0101010101', method: 'Wave', status: 'success', createdAt: '2023-11-01' },
    { id: '2', amount: 150000, donorName: 'Traoré Moussa', isAnonymous: false, donorPhone: '0708091011', method: 'OrangeMoney', status: 'success', createdAt: '2023-11-05' },
    { id: '3', amount: 25000, donorName: 'Anonyme', isAnonymous: true, donorPhone: '0505050505', method: 'MTN', status: 'success', createdAt: '2023-11-06' },
    { id: '4', amount: 10000, donorName: 'Kader', isAnonymous: false, donorPhone: '0102030405', method: 'Wave', status: 'success', createdAt: '2023-11-07' },
    { id: '5', amount: 500000, donorName: 'El Hadj Bakary', isAnonymous: false, donorPhone: '0707070707', method: 'Carte', status: 'success', createdAt: '2023-11-08' }
];

export const BACKEND_RULES = `
// REGLES DE TEST POUR LE DEVELOPPEMENT
// Copiez ceci dans la console Firebase > Firestore Database > Règles
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
`;

export const BACKEND_FUNCTIONS = `
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.onDonationSuccess = functions.firestore
  .document("donations/{donationId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    if (newData.status === "success") {
       console.log("Paiement reçu :", newData.amount);
       // Envoyer SMS de remerciement via Twilio
    }
  });
`;

export const COUNTRY_CODES = [
    { code: '+225', flag: '🇨🇮' },
    { code: '+33', flag: '🇫🇷' },
    { code: '+221', flag: '🇸🇳' },
    { code: '+223', flag: '🇲🇱' },
    { code: '+226', flag: '🇧🇫' },
    { code: '+229', flag: '🇧🇯' },
    { code: '+228', flag: '🇹🇬' },
    { code: '+212', flag: '🇲🇦' },
    { code: '+1', flag: '🇺🇸' },
    { code: '+44', flag: '🇬🇧' },
];
