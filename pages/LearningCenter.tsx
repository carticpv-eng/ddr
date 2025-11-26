import React, { useState, useEffect, useRef } from 'react';

// --- DATA CONSTANTS ---

const DAILY_REMINDERS = [
    { type: 'Verset', arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', text: 'Et dis : "Ô mon Seigneur, accroît mes connaissances !"', ref: 'Sourate Taha, v.114' },
    { type: 'Hadith', arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', text: '"Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne."', ref: 'Rapporté par Al-Bukhari' },
    { type: 'Sagesse', arabic: 'العلم نور', text: '"La science est une lumière que Dieu jette dans le cœur de qui Il veut."', ref: 'Imam Malik' }
];

const FIVE_PILLARS = [
    { num: 1, title: "La Shahada", trans: "L'Attestation de Foi", icon: "☝️", desc: "Témoigner qu'il n'y a de dieu qu'Allah et que Muhammad est Son messager." },
    { num: 2, title: "La Salat", trans: "La Prière", icon: "🤲", desc: "Accomplir les 5 prières quotidiennes obligatoires." },
    { num: 3, title: "La Zakat", trans: "L'Aumône", icon: "💰", desc: "Purifier ses biens en donnant une part aux nécessiteux." },
    { num: 4, title: "Le Sawm", trans: "Le Jeûne", icon: "🌙", desc: "Jeûner le mois de Ramadan pour purifier l'âme." },
    { num: 5, title: "Le Hajj", trans: "Le Pèlerinage", icon: "🕋", desc: "Se rendre à la Mecque au moins une fois dans sa vie si on en a les moyens." }
];

const EDU_VIDEOS = [
    { id: '3YmQ6d5iC8o', title: "Comment faire les ablutions ?", duration: "3:45", thumb: "https://i.ytimg.com/vi/3YmQ6d5iC8o/hqdefault.jpg" },
    { id: 'kScrL8m1qYs', title: "Apprendre la prière (Pas à pas)", duration: "12:20", thumb: "https://i.ytimg.com/vi/kScrL8m1qYs/hqdefault.jpg" },
    { id: 'Fz-f1Wk4dYg', title: "L'histoire de la Kaaba", duration: "8:10", thumb: "https://i.ytimg.com/vi/Fz-f1Wk4dYg/hqdefault.jpg" },
    { id: 'u3l2C0Qj08E', title: "Comprendre le Tawhid", duration: "5:30", thumb: "https://i.ytimg.com/vi/u3l2C0Qj08E/hqdefault.jpg" }
];

const ARABIC_LETTERS = [
    { char: 'ا', name: 'Alif', sound: 'aa' },
    { char: 'b', name: 'Ba', sound: 'b' },
    { char: 'ت', name: 'Ta', sound: 't' },
    { char: 'ث', name: 'Tha', sound: 'th' },
    { char: 'ج', name: 'Jim', sound: 'j' },
    { char: 'ح', name: 'Ha', sound: 'h (dur)' },
    { char: 'خ', name: 'Kha', sound: 'kh' },
    { char: 'د', name: 'Dal', sound: 'd' },
    { char: 'ذ', name: 'Dhal', sound: 'dh' },
    { char: 'ر', name: 'Ra', sound: 'r' },
    { char: 'ز', name: 'Zay', sound: 'z' },
    { char: 'س', name: 'Sin', sound: 's' },
    { char: 'ش', name: 'Shin', sound: 'sh' },
    { char: 'ص', name: 'Sad', sound: 'S (emphatique)' },
    { char: 'ض', name: 'Dad', sound: 'D (emphatique)' },
    { char: 'ط', name: 'Ta', sound: 'T (emphatique)' },
    { char: 'ظ', name: 'Zha', sound: 'Z (emphatique)' },
    { char: 'ع', name: '\'Ayn', sound: '3' },
    { char: 'غ', name: 'Ghayn', sound: 'gh' },
    { char: 'f', name: 'Fa', sound: 'f' },
    { char: 'ق', name: 'Qaf', sound: 'q' },
    { char: 'k', name: 'Kaf', sound: 'k' },
    { char: 'l', name: 'Lam', sound: 'l' },
    { char: 'm', name: 'Mim', sound: 'm' },
    { char: 'n', name: 'Nun', sound: 'n' },
    { char: 'h', name: 'Ha', sound: 'h (doux)' },
    { char: 'w', name: 'Waw', sound: 'w / ou' },
    { char: 'y', name: 'Ya', sound: 'y / i' }
];

const SOCIAL_LINKS = [
    { 
        name: 'Facebook', 
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        ), 
        url: 'https://www.facebook.com/Oustazdianeoff', 
        bgClass: 'bg-[#1877F2]',
        borderClass: 'border-[#1877F2]',
        label: 'Rejoindre la communauté',
        subLabel: 'Oustaz Diane Officiel'
    },
    { 
        name: 'YouTube', 
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        ), 
        url: 'https://www.youtube.com/@ddrlavraiechaine', 
        bgClass: 'bg-[#FF0000]',
        borderClass: 'border-[#FF0000]',
        label: 'Voir les débats & lives',
        subLabel: 'DDR La Vraie Chaîne'
    },
    { 
        name: 'TikTok', 
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.49-3.35-3.98-5.6-.48-2.24-.08-4.62 1.09-6.64 1.19-2.05 3.29-3.56 5.6-4.05 1.58-.33 3.24-.18 4.79.46V11c-1.28-.65-2.73-.8-4.13-.39-1.27.37-2.33 1.25-2.94 2.42-.62 1.18-.63 2.61-.02 3.8.61 1.2 1.71 2.11 3.01 2.51 1.34.41 2.82.25 4.05-.44 1.24-.7 2.05-2 2.1-3.41.06-2.95.02-5.9.03-8.85h-.01c-.13-.01-.2.01-.53-.02-.85-.22-1.32-.87-1.6-1.58-.23-.6-.32-1.23-.32-1.85V3.06c0-.26.02-.51.05-.76.08-.72.4-1.37.94-1.87.53-.49 1.18-.76 1.91-.79h.03z"/></svg>
        ), 
        url: 'https://www.tiktok.com/@ddrofficielle', 
        bgClass: 'bg-[#000000]',
        borderClass: 'border-gray-600',
        label: 'Shorts & Reels',
        subLabel: '@ddrofficielle'
    }
];

const NAMES_OF_ALLAH = [
    { arabic: 'الله', trans: 'Allah', fr: 'Le Dieu Absolu' },
    { arabic: 'الرَّحْمَنُ', trans: 'Ar-Rahman', fr: 'Le Tout Miséricordieux' },
    { arabic: 'الرَّحِيمُ', trans: 'Ar-Rahim', fr: 'Le Très Miséricordieux' },
    { arabic: 'الْمَلِكُ', trans: 'Al-Malik', fr: 'Le Souverain' },
    { arabic: 'الْقُدُّوسُ', trans: 'Al-Quddus', fr: 'Le Pur' },
    { arabic: 'السَّلاَمُ', trans: 'As-Salam', fr: 'La Paix' },
    { arabic: 'الْمُؤْمِنُ', trans: 'Al-Mu\'min', fr: 'La Sauvegarde' },
    { arabic: 'الْمُهَيْمِنُ', trans: 'Al-Muhaymin', fr: 'Le Préservateur' },
    { arabic: 'الْعَزِيزُ', trans: 'Al-Aziz', fr: 'Le Tout Puissant' },
    { arabic: 'الْجَبَّارُ', trans: 'Al-Jabbar', fr: 'Le Contraignant' },
    { arabic: 'الْمُتَكَبِّرُ', trans: 'Al-Mutakabbir', fr: 'Le Superbe' },
    { arabic: 'الْخَالِقُ', trans: 'Al-Khaliq', fr: 'Le Créateur' },
    { arabic: 'الbَارِئُ', trans: 'Al-Bari\'', fr: 'Le Producteur' },
    { arabic: 'الْمُصَوِّرُ', trans: 'Al-Musawwir', fr: 'Le Façonneur' },
    { arabic: 'الْغَفَّارُ', trans: 'Al-Ghaffar', fr: 'Le Grand Pardonneur' },
    { arabic: 'الْقَهَّارُ', trans: 'Al-Qahhar', fr: 'Le Dominateur Suprême' },
    { arabic: 'الْوَهَّابُ', trans: 'Al-Wahhab', fr: 'Le Donateur constant' },
    { arabic: 'الرَّزَّاقُ', trans: 'Ar-Razzaq', fr: 'Le Pourvoyeur' },
    { arabic: 'الْفَتَّاحُ', trans: 'Al-Fattah', fr: 'L\'Ouvreur' },
    { arabic: 'الْعَلِيمُ', trans: 'Al-\'Alim', fr: 'L\'Omniscient' },
    { arabic: 'الْقَابِضُ', trans: 'Al-Qabid', fr: 'Le Restrictif' },
    { arabic: 'الْبَاسِطُ', trans: 'Al-Basit', fr: 'L\'Extenseur' },
    { arabic: 'الْخَافِضُ', trans: 'Al-Khafid', fr: 'L\'Abaisseur' },
    { arabic: 'الرَّافِعُ', trans: 'Ar-Rafi\'', fr: 'L\'Éleveur' },
    { arabic: 'الْمُعِزُّ', trans: 'Al-Mu\'izz', fr: 'Celui qui donne la puissance' },
    { arabic: 'الْمُذِلُّ', trans: 'Al-Mudhill', fr: 'Celui qui humilie' },
    { arabic: 'السَّمِيعُ', trans: 'As-Sami\'', fr: 'L\'Audient' },
    { arabic: 'الْبَصِيرُ', trans: 'Al-Basir', fr: 'Le Voyant' },
    { arabic: 'الْحَكَمُ', trans: 'Al-Hakam', fr: 'L\'Arbitre' },
    { arabic: 'الْعَدْلُ', trans: 'Al-\'Adl', fr: 'Le Juste' },
    { arabic: 'اللَّطِيفُ', trans: 'Al-Latif', fr: 'Le Doux' },
    { arabic: 'الْخَبِيرُ', trans: 'Al-Khabir', fr: 'Le Bien-Informé' },
    { arabic: 'الْحَلِيمُ', trans: 'Al-Halim', fr: 'Le Très-Clément' },
    { arabic: 'الْعَظِيمُ', trans: 'Al-\'Azim', fr: 'L\'Immense' },
    { arabic: 'الْغَفُورُ', trans: 'Al-Ghafur', fr: 'Le Pardonneur' },
    { arabic: 'الشَّكُورُ', trans: 'Ash-Shakur', fr: 'Le Très-Reconnaissant' },
    { arabic: 'الْعَلِيُّ', trans: 'Al-\'Ali', fr: 'Le Très-Haut' },
    { arabic: 'الْكَبِيرُ', trans: 'Al-Kabir', fr: 'Le Très-Grand' },
    { arabic: 'الْحَفِيظُ', trans: 'Al-Hafiz', fr: 'Le Gardien' },
    { arabic: 'الْمُقِيتُ', trans: 'Al-Muqit', fr: 'Le Nourricier' },
    { arabic: 'الْحَسِيبُ', trans: 'Al-Hasib', fr: 'Celui qui tient compte' },
    { arabic: 'الْجَلِيلُ', trans: 'Al-Jalil', fr: 'Le Majestueux' },
    { arabic: 'الْكَرِيمُ', trans: 'Al-Karim', fr: 'Le Tout-Généreux' },
    { arabic: 'الرَّقِيبُ', trans: 'Ar-Raqib', fr: 'L\'Observateur' },
    { arabic: 'الْمُجِيبُ', trans: 'Al-Mujib', fr: 'Celui qui exauce' },
    { arabic: 'الْوَاسِعُ', trans: 'Al-Wasi\'', fr: 'Le Vaste' },
    { arabic: 'الْحَكِيمُ', trans: 'Al-Hakim', fr: 'Le Sage' },
    { arabic: 'الْوَدُودُ', trans: 'Al-Wadud', fr: 'Le Tout-Affectueux' },
    { arabic: 'الْمَجِيدُ', trans: 'Al-Majid', fr: 'Le Très-Glorieux' },
    { arabic: 'الْبَاعِثُ', trans: 'Al-Ba\'ith', fr: 'Celui qui ressuscite' },
    { arabic: 'الشَّهِيدُ', trans: 'Ash-Shahid', fr: 'Le Témoin' },
    { arabic: 'الْحَقُّ', trans: 'Al-Haqq', fr: 'Le Vrai' },
    { arabic: 'الْوَكِيلُ', trans: 'Al-Wakil', fr: 'Le Tuteur' },
    { arabic: 'الْقَوِيُّ', trans: 'Al-Qawiyy', fr: 'Le Fort' },
    { arabic: 'الْمَتِينُ', trans: 'Al-Matin', fr: 'Le Robuste' },
    { arabic: 'الْوَلِيُّ', trans: 'Al-Waliyy', fr: 'Le Protecteur' },
    { arabic: 'الْحَمِيدُ', trans: 'Al-Hamid', fr: 'Le Digne de louange' },
    { arabic: 'الْمُحْصِي', trans: 'Al-Muhsi', fr: 'Celui qui dénombre' },
    { arabic: 'الْمُبْدِئُ', trans: 'Al-Mubdi\'', fr: 'L\'Initiateur' },
    { arabic: 'الْمُعِيدُ', trans: 'Al-Mu\'id', fr: 'Celui qui réintègre' },
    { arabic: 'الْمُحْيِي', trans: 'Al-Muhyi', fr: 'Celui qui donne la vie' },
    { arabic: 'الْمُمِيتُ', trans: 'Al-Mumit', fr: 'Celui qui donne la mort' },
    { arabic: 'الْحَيُّ', trans: 'Al-Hayy', fr: 'Le Vivant' },
    { arabic: 'الْقَيُّومُ', trans: 'Al-Qayyum', fr: 'L\'Immuable' },
    { arabic: 'الْوَاجِدُ', trans: 'Al-Wajid', fr: 'Celui qui trouve' },
    { arabic: 'الْمَاجِدُ', trans: 'Al-Majid', fr: 'Le Noble' },
    { arabic: 'الْوَاحِدُ', trans: 'Al-Wahid', fr: 'L\'Unique' },
    { arabic: 'الصَّمَدُ', trans: 'As-Samad', fr: 'Le Soutien universel' },
    { arabic: 'الْقَادِرُ', trans: 'Al-Qadir', fr: 'Le Puissant' },
    { arabic: 'الْمُقْتَدِرُ', trans: 'Al-Muqtadir', fr: 'Le Déterminant' },
    { arabic: 'الْمُقَدِّمُ', trans: 'Al-Muqaddim', fr: 'Celui qui met en avant' },
    { arabic: 'الْمُؤَخِّرُ', trans: 'Al-Mu\'akhkhir', fr: 'Celui qui retarde' },
    { arabic: 'الْأَوَّلُ', trans: 'Al-Awwal', fr: 'Le Premier' },
    { arabic: 'الْآخِرُ', trans: 'Al-Akhir', fr: 'Le Dernier' },
    { arabic: 'الظَّاهِرُ', trans: 'Az-Zahir', fr: 'L\'Apparent' },
    { arabic: 'الْبَاطِنُ', trans: 'Al-Batin', fr: 'Le Caché' },
    { arabic: 'الْوَالِي', trans: 'Al-Wali', fr: 'Le Monarque' },
    { arabic: 'الْمُتَعَالِي', trans: 'Al-Muta\'ali', fr: 'Le Sublime' },
    { arabic: 'الْبَرُّ', trans: 'Al-Barr', fr: 'Le Bienfaisant' },
    { arabic: 'التَّوَّابُ', trans: 'At-Tawwab', fr: 'L\'Accueillant au repentir' },
    { arabic: 'الْمُنْتَقِمُ', trans: 'Al-Muntaqim', fr: 'Le Vengeur' },
    { arabic: 'الْعَفُوُّ', trans: 'Al-\'Afuww', fr: 'L\'Indulgent' },
    { arabic: 'الرَّءُوفُ', trans: 'Ar-Ra\'uf', fr: 'Le Bienveillant' },
    { arabic: 'مَالِكُ الْمُلْكِ', trans: 'Malik-ul-Mulk', fr: 'Maître du Pouvoir' },
    { arabic: 'ذُو الْجَلاَلِ وَالْإِكْرَامِ', trans: 'Dhul-Jalal wal-Ikram', fr: 'Détenteur de Majesté et Générosité' },
    { arabic: 'الْمُقْسِطُ', trans: 'Al-Muqsit', fr: 'L\'Équitable' },
    { arabic: 'الْجَامِعُ', trans: 'Al-Jami\'', fr: 'Le Rassembleur' },
    { arabic: 'الْغَنِيُّ', trans: 'Al-Ghaniyy', fr: 'Le Riche' },
    { arabic: 'الْمُغْنِي', trans: 'Al-Mughni', fr: 'Celui qui enrichit' },
    { arabic: 'الْمَانِعُ', trans: 'Al-Mani\'', fr: 'Le Défenseur' },
    { arabic: 'الضَّارُّ', trans: 'Ad-Darr', fr: 'Celui qui peut nuire' },
    { arabic: 'النَّافِعُ', trans: 'An-Nafi\'', fr: 'L\'Utile' },
    { arabic: 'النُّورُ', trans: 'An-Nur', fr: 'La Lumière' },
    { arabic: 'الْهَادِي', trans: 'Al-Hadi', fr: 'Le Guide' },
    { arabic: 'الْبَدِيعُ', trans: 'Al-Badi\'', fr: 'L\'Inventeur' },
    { arabic: 'الْبَاقِي', trans: 'Al-Baqi', fr: 'Le Permanent' },
    { arabic: 'الْوَارِثُ', trans: 'Al-Warith', fr: 'L\'Héritier' },
    { arabic: 'الرَّشِيدُ', trans: 'Ar-Rashid', fr: 'Le Droit' },
    { arabic: 'الصَّبُورُ', trans: 'As-Sabur', fr: 'Le Patient' },
];

const PROPHET_FAMILY = {
    wives: ['Khadijah', 'Sawda', 'Aishah', 'Hafsa', 'Zaynab', 'Umm Salama', 'Zaynab', 'Juwayriya', 'Umm Habiba', 'Safiyya', 'Maymuna'],
    children: ['Qasim', 'Abdullah', 'Ibrahim', 'Zaynab', 'Ruqayyah', 'Umm Kulthum', 'Fatimah'],
    character: [
        { title: 'Al-Sadiq', meaning: 'Le Véridique', desc: 'Il ne mentait jamais, même avant la prophétie.' },
        { title: 'Al-Amin', meaning: 'Le Digne de Confiance', desc: 'Tout le monde lui confiait ses biens précieux.' },
        { title: 'Rahma', meaning: 'La Miséricorde', desc: 'Envoyé comme miséricorde pour l\'univers.' },
        { title: 'Sabr', meaning: 'La Patience', desc: 'Endurant face aux épreuves et aux persécutions.' }
    ]
};

const SUNNAS = [
    { title: 'Le Sourire', desc: 'Sourire à son frère est une aumône.' },
    { title: 'Main Droite', desc: 'Manger et boire avec la main droite.' },
    { title: 'Le Siwak', desc: 'Purifier sa bouche avant la prière.' },
    { title: 'Le Salam', desc: 'Saluer celui qu\'on connaît et celui qu\'on ne connaît pas.' },
    { title: 'Visiter le Malade', desc: 'Une cause de grande récompense.' }
];

// --- DONNÉES DU COMPARATEUR ---
const COMPARISONS = [
    {
        id: 'jesus',
        title: 'Jésus (Issa)',
        icon: '✝️ vs ☪️',
        islam: {
            source: 'Coran 4:171',
            text: 'Le Messie Jésus, fils de Marie, n\'est qu\'un Messager d\'Allah, Sa parole qu\'Il envoya à Marie, et un souffle venant de Lui.'
        },
        christianity: {
            source: 'Jean 3:16',
            text: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point.'
        },
        verdict: 'L\'Islam honore Jésus comme un grand Prophète (né miraculeusement) mais rejette la Trinité. Dieu est Unique et sans enfant.'
    },
    {
        id: 'wine',
        title: 'Le Vin / Alcool',
        icon: '🍷',
        islam: {
            source: 'Coran 5:90',
            text: 'Le vin, le jeu de hasard... ne sont qu\'une abomination, œuvre du Diable. Écartez-vous en.'
        },
        christianity: {
            source: 'Psaumes 104:15',
            text: 'Le vin qui réjouit le cœur de l\'homme, Et fait plus que l\'huile resplendir son visage...'
        },
        verdict: 'Haram (Interdit) en Islam pour préserver la raison. Permis (avec modération) dans le Christianisme, symbole du sang du Christ.'
    },
    {
        id: 'pork',
        title: 'Le Porc',
        icon: '🐖',
        islam: {
            source: 'Coran 2:173',
            text: 'Certes, Il vous interdit la chair d\'une bête morte, le sang, la viande de porc...'
        },
        christianity: {
            source: 'Marc 7:19',
            text: '(Jésus) déclarait purs tous les aliments... Ce n\'est pas ce qui entre dans la bouche qui souille l\'homme.'
        },
        verdict: 'Considéré impur et interdit en Islam. Autorisé dans le Christianisme moderne qui se détache des lois alimentaires lévitiques.'
    },
    {
        id: 'salvation',
        title: 'Le Salut (Paradis)',
        icon: '🗝️',
        islam: {
            source: 'Coran 103:3',
            text: 'Sauf ceux qui croient et accomplissent les bonnes œuvres, s\'enjoignent mutuellement la vérité...'
        },
        christianity: {
            source: 'Éphésiens 2:8',
            text: 'Car c\'est par la grâce que vous êtes sauvés, par le moyen de la foi. Cela ne vient pas de vos œuvres.'
        },
        verdict: 'En Islam, le salut s\'obtient par la Foi ET les Œuvres. En Christianisme (Protestant), par la Foi seule (Sola Fide).'
    }
];

const LearningCenter = () => {
    const [tasbihCount, setTasbihCount] = useState(0);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedTopic, setSelectedTopic] = useState(0); // Index du sujet sélectionné
    const [showAllNames, setShowAllNames] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    // Carousel Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % DAILY_REMINDERS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleTasbih = () => {
        setTasbihCount(prev => prev + 1);
        if (navigator.vibrate) navigator.vibrate(20); // Retour haptique
    };

    // Logic for visible names
    const visibleNames = showAllNames ? NAMES_OF_ALLAH : NAMES_OF_ALLAH.slice(0, 12);

    return (
        <div className="min-h-screen bg-black text-gray-100 pb-20 relative overflow-x-hidden font-sans">
            
            {/* VIDEO MODAL */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur flex items-center justify-center p-4 animate-fade-in-up">
                    <button 
                        onClick={() => setSelectedVideo(null)} 
                        className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                        <iframe 
                            src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`} 
                            title="Video Educative"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* --- HERO SECTION & CAROUSEL --- */}
            <div className="relative bg-[#0a0a0a] border-b border-gray-800 pb-16 pt-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/30 via-black to-black"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10 mb-12">
                    <span className="text-brand-500 font-bold tracking-widest uppercase text-sm mb-4 inline-block bg-brand-900/20 px-4 py-1 rounded-full border border-brand-500/20 animate-fade-in-up">Markaz Al-Ilm</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight animate-fade-in-up delay-100">
                        Le Centre du <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-yellow-500">Savoir</span>
                    </h1>
                </div>

                {/* --- CAROUSEL RAPPEL --- */}
                <div className="max-w-3xl mx-auto relative z-20 animate-fade-in-up delay-200">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 text-center shadow-2xl relative overflow-hidden group hover:border-brand-500/30 transition duration-500">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
                        
                        {DAILY_REMINDERS.map((slide, idx) => (
                            <div 
                                key={idx} 
                                className={`transition-all duration-700 absolute inset-0 flex flex-col items-center justify-center p-8 ${idx === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
                            >
                                <span className="text-brand-500 text-xs font-bold uppercase tracking-widest mb-3 border border-brand-500/30 px-2 py-1 rounded">{slide.type} du jour</span>
                                <h3 className="text-2xl md:text-3xl text-white font-serif mb-4 dir-rtl" style={{ direction: 'rtl' }}>{slide.arabic}</h3>
                                <p className="text-gray-300 italic text-lg mb-2">"{slide.text}"</p>
                                <p className="text-xs text-gray-500 font-bold uppercase">{slide.ref}</p>
                            </div>
                        ))}
                        {/* Placeholder height for layout stability */}
                        <div className="invisible">
                            <h3 className="text-3xl mb-4">Placeholder</h3>
                            <p className="text-lg mb-2">Placeholder text long enough</p>
                        </div>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {DAILY_REMINDERS.map((_, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-brand-500 w-6' : 'bg-gray-600 hover:bg-gray-400'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">

                {/* --- 0. LES 5 PILIERS (ANIMÉS) --- */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-2">Les 5 Piliers de l'Islam</h2>
                        <p className="text-gray-500">Les fondations sur lesquelles repose notre religion.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {FIVE_PILLARS.map((pillar) => (
                            <div key={pillar.num} className="group relative h-64 perspective-1000">
                                <div className="absolute inset-0 bg-[#121214] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-500 transform group-hover:bg-brand-900/10 group-hover:border-brand-500/50 shadow-lg group-hover:-translate-y-2">
                                    <div className="text-xs font-bold text-gray-600 absolute top-4 left-4">0{pillar.num}</div>
                                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">{pillar.icon}</div>
                                    <h3 className="text-lg font-bold text-white mb-1">{pillar.title}</h3>
                                    <p className="text-xs text-brand-500 uppercase tracking-wider font-bold mb-3">{pillar.trans}</p>
                                    <p className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-6 px-4">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- NOUVEAU: COMPARATEUR THÉOLOGIQUE (REFONTE PRO & DYNAMIQUE) --- */}
                <section className="relative">
                    {/* Header dynamique */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-900/40 to-black rounded-full border border-red-500/30 mb-4 animate-pulse">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span className="text-red-400 font-bold text-xs uppercase tracking-widest">Armurerie du Débatteur</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white">Le Choc des Textes</h2>
                        <p className="text-gray-500 mt-2">Comparez les sources en temps réel pour dominer le débat.</p>
                    </div>

                    {/* SELECTEUR STYLISÉ */}
                    <div className="flex justify-center mb-12">
                        <div className="flex gap-2 p-1.5 bg-gray-900 rounded-xl border border-gray-800 overflow-x-auto max-w-full">
                            {COMPARISONS.map((topic, index) => (
                                <button
                                    key={topic.id}
                                    onClick={() => setSelectedTopic(index)}
                                    className={`px-5 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all duration-300 whitespace-nowrap ${
                                        selectedTopic === index 
                                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/40' 
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <span>{topic.icon}</span>
                                    {topic.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* INTERFACE DE COMBAT (VERSUS) */}
                    <div className="relative bg-[#050505] rounded-3xl border border-gray-800 p-1 shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-gray-800/50 rounded-[20px] overflow-hidden">
                            
                            {/* COTÉ ISLAM */}
                            <div key={`islam-${selectedTopic}`} className="bg-[#020d05] p-8 md:p-12 relative overflow-hidden animate-fade-in-up">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-green-900/30 border border-green-500 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]">☪️</div>
                                    <h3 className="text-green-500 font-bold uppercase tracking-widest text-sm">Vision Islamique</h3>
                                </div>
                                <blockquote className="text-2xl md:text-3xl text-white font-serif leading-relaxed mb-8 relative z-10">
                                    <span className="text-green-800 text-6xl absolute -top-6 -left-4 opacity-30 select-none">“</span>
                                    {COMPARISONS[selectedTopic].islam.text}
                                </blockquote>
                                <div className="inline-block bg-green-900/20 border border-green-500/20 px-3 py-1 rounded text-green-400 text-xs font-mono font-bold">
                                    📖 {COMPARISONS[selectedTopic].islam.source}
                                </div>
                            </div>

                            {/* DIVISEUR VS (Absolu au centre pour desktop) */}
                            <div className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black border-2 border-gray-700 rounded-full items-center justify-center shadow-2xl">
                                <span className="text-gray-500 font-black text-xs italic">VS</span>
                            </div>

                            {/* COTÉ CHRISTIANISME */}
                            <div key={`christianity-${selectedTopic}`} className="bg-[#05060f] p-8 md:p-12 relative overflow-hidden animate-fade-in-up delay-100">
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-10 w-10 rounded-full bg-blue-900/30 border border-blue-500 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]">✝️</div>
                                    <h3 className="text-blue-500 font-bold uppercase tracking-widest text-sm">Vision Biblique</h3>
                                </div>
                                <blockquote className="text-2xl md:text-3xl text-white font-serif leading-relaxed mb-8 relative z-10">
                                    <span className="text-blue-800 text-6xl absolute -top-6 -left-4 opacity-30 select-none">“</span>
                                    {COMPARISONS[selectedTopic].christianity.text}
                                </blockquote>
                                <div className="inline-block bg-blue-900/20 border border-blue-500/20 px-3 py-1 rounded text-blue-400 text-xs font-mono font-bold">
                                    📖 {COMPARISONS[selectedTopic].christianity.source}
                                </div>
                            </div>
                        </div>

                        {/* VERDICT DDR */}
                        <div key={`verdict-${selectedTopic}`} className="bg-gradient-to-r from-brand-900/80 to-black border-t border-brand-500/30 p-8 text-center relative animate-fade-in-up delay-200">
                            <div className="inline-flex items-center gap-2 mb-3">
                                <span className="text-xl">⚖️</span>
                                <h4 className="text-brand-500 font-bold uppercase text-xs tracking-[0.2em]">Synthèse & Argument Massue</h4>
                            </div>
                            <p className="text-xl text-white font-medium max-w-3xl mx-auto leading-relaxed">
                                {COMPARISONS[selectedTopic].verdict}
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- 1. RESEAUX SOCIAUX OFFICIELS --- */}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SOCIAL_LINKS.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`group relative p-6 rounded-2xl border ${link.borderClass} bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden`}
                                style={{ backgroundColor: link.name === 'Facebook' ? 'rgba(24, 119, 242, 0.1)' : link.name === 'YouTube' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                                <div className="flex flex-col items-center text-center relative z-10">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${link.bgClass} text-white shadow-lg`}>
                                        {link.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{link.name}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">{link.label}</p>
                                    <p className="text-sm text-gray-400">{link.subLabel}</p>
                                    
                                    <span className="mt-4 px-4 py-2 bg-white/10 rounded-full text-xs font-bold text-white group-hover:bg-white group-hover:text-black transition-colors">
                                        S'abonner →
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* --- CAROUSEL VIDÉOS ÉDUCATIVES --- */}
                <section>
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-bold text-white">Vidéos Éducatives</h2>
                        <button className="text-sm text-brand-500 hover:text-white transition">Voir tout →</button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
                        {EDU_VIDEOS.map((video) => (
                            <div 
                                key={video.id} 
                                onClick={() => setSelectedVideo(video.id)}
                                className="min-w-[280px] bg-[#121214] rounded-xl overflow-hidden border border-gray-800 group hover:border-brand-500/50 transition snap-center cursor-pointer"
                            >
                                <div className="relative h-40 overflow-hidden">
                                    <img src={video.thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded font-bold">{video.duration}</span>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-white font-bold text-sm line-clamp-2 leading-snug group-hover:text-brand-500 transition-colors">{video.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- 2. PROPHET SECTION (VISUAL BLOCKS) --- */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 bg-green-900/30 rounded-full flex items-center justify-center border border-green-500/50 text-green-500 font-serif font-bold text-xl">ﷺ</div>
                        <h2 className="text-3xl font-bold text-white">Le Prophète Muhammad</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Caractère */}
                        <div className="bg-[#121214] border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
                            <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-green-500 pl-4">Son Noble Caractère</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {PROPHET_FAMILY.character.map((char, i) => (
                                    <div key={i} className="bg-black/50 p-4 rounded-xl border border-gray-800 hover:border-green-500/50 transition duration-300">
                                        <div className="text-green-500 font-bold text-sm uppercase mb-1">{char.title}</div>
                                        <div className="text-white font-serif text-lg mb-2">{char.meaning}</div>
                                        <p className="text-xs text-gray-500 leading-snug">{char.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Famille (Tree-like visualization) */}
                        <div className="bg-[#121214] border border-gray-800 rounded-3xl p-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-5">
                                 <svg className="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                             </div>
                            <h3 className="text-xl font-bold text-white mb-6 border-l-4 border-brand-500 pl-4">L'Arbre Béni</h3>
                            
                            <div className="space-y-6 relative z-10">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Ses Nobles Épouses (Mères des Croyants)</span>
                                    <div className="flex flex-wrap gap-2">
                                        {PROPHET_FAMILY.wives.map(w => (
                                            <span key={w} className="bg-brand-900/20 text-brand-200 border border-brand-500/20 px-3 py-1 rounded-full text-xs font-medium hover:bg-brand-900/40 transition cursor-default">{w}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Ses Enfants</span>
                                    <div className="flex flex-wrap gap-2">
                                        {PROPHET_FAMILY.children.map(c => (
                                            <span key={c} className="bg-blue-900/20 text-blue-200 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-900/40 transition cursor-default">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 3. 99 NAMES GRID --- */}
                <section>
                    <div className="text-center mb-10">
                         <h2 className="text-3xl font-bold text-white mb-2">Les plus beaux Noms d'Allah</h2>
                         <p className="text-gray-500">Apprenez-les et invoquez-Le par eux.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {visibleNames.map((name, i) => (
                            <div key={i} className="group bg-[#1a1a1a] border border-gray-800 p-6 rounded-2xl hover:border-gold-500/50 hover:bg-[#222] transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                                <div className="absolute top-2 right-3 text-[10px] text-gray-600 font-mono">#{i + 1}</div>
                                <div className="text-3xl text-white font-serif mb-2 group-hover:scale-110 transition-transform">{name.arabic}</div>
                                <div className="text-gold-500 font-bold text-sm mb-1">{name.trans}</div>
                                <div className="text-gray-400 text-xs">{name.fr}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => setShowAllNames(!showAllNames)}
                            className="text-sm text-gray-500 hover:text-white underline decoration-gray-700 underline-offset-4 transition"
                        >
                            {showAllNames ? "Réduire la liste" : "Voir la liste complète (99)"}
                        </button>
                    </div>
                </section>

                {/* --- 4. TASBIH & SUNNAS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Tasbih Interactif */}
                    <div className="bg-[#121214] border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/10 to-transparent"></div>
                        <h3 className="text-2xl font-bold text-white mb-8 relative z-10">Tasbih Numérique</h3>
                        
                        <div className="w-48 h-48 rounded-full border-8 border-gray-800 flex items-center justify-center bg-black shadow-[inset_0_0_20px_rgba(0,0,0,1)] mb-8 relative z-10 transition-transform duration-100 transform" style={{ transform: tasbihCount > 0 ? 'scale(0.98)' : 'scale(1)' }}>
                            <span className="text-6xl font-mono text-brand-500 font-bold tracking-tighter">{tasbihCount}</span>
                        </div>
                        
                        <div className="flex gap-4 relative z-10 w-full max-w-xs">
                            <button 
                                onClick={handleTasbih}
                                className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
                            >
                                COMPTER
                            </button>
                            <button 
                                onClick={() => setTasbihCount(0)}
                                className="px-6 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold"
                            >
                                ↺
                            </button>
                        </div>
                        <p className="mt-6 text-xs text-gray-500">"SubhanAllah, Alhamdulillah, Allahu Akbar"</p>
                    </div>

                    {/* Sunnas Checklist */}
                    <div className="bg-[#121214] border border-gray-800 rounded-3xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Sunnas Quotidiennes</h3>
                        <div className="space-y-4">
                            {SUNNAS.map((sunna, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-gray-800 hover:border-gray-600 transition group hover:bg-gray-900/50">
                                    <div className="mt-1 h-5 w-5 rounded-full border-2 border-brand-500 flex items-center justify-center shrink-0 group-hover:bg-brand-500 transition-colors">
                                        <div className="h-2 w-2 bg-brand-500 rounded-full group-hover:bg-white"></div>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{sunna.title}</h4>
                                        <p className="text-gray-400 text-xs">{sunna.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- 5. ALPHABET ARABE --- */}
                <section>
                    <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                        <h2 className="text-2xl font-bold text-white">L'Alphabet Arabe</h2>
                        <span className="text-xs text-gray-500">Sens de lecture : Droite à Gauche</span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 dir-rtl" style={{ direction: 'rtl' }}>
                        {ARABIC_LETTERS.map((item, index) => (
                            <div 
                                key={index} 
                                className="bg-[#18181b] hover:bg-brand-900/20 border border-gray-800 hover:border-brand-500/50 rounded-xl p-4 flex flex-col items-center justify-center transition-all duration-300 group cursor-default"
                            >
                                <span className="text-3xl font-serif text-white mb-2 group-hover:scale-125 transition-transform duration-300">{item.char}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold group-hover:text-brand-400">{item.name}</span>
                                <span className="text-[9px] text-gray-600 font-mono mt-1">/{item.sound}/</span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default LearningCenter;