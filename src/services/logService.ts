
export interface LogEntry {
    id: string;
    timestamp: number;
    action: string;
    category: 'info' | 'success' | 'warning' | 'danger';
    details: string;
    device: string;
    meta?: any; // Données techniques avancées
}

const STORAGE_KEY = 'ddr_activity_logs';

const getDetailedDeviceInfo = () => {
    const ua = navigator.userAgent;
    let deviceType = "Ordinateur";
    
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        deviceType = "Tablette";
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/.test(ua)) {
        deviceType = "Mobile";
    }

    // Infos techniques "Espion"
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const lang = navigator.language;
    const isOnline = navigator.onLine ? "En Ligne" : "Hors Ligne";
    
    // Tentative de détection connexion (Chrome only)
    const conn = (navigator as any).connection;
    const netType = conn ? conn.effectiveType : 'Inconnu';

    return `${deviceType} (${screenRes}) • ${netType} • ${lang} • ${isOnline}`;
};

export const logAction = (action: string, details: string, category: 'info' | 'success' | 'warning' | 'danger' = 'info') => {
    try {
        const logs: LogEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        
        const newLog: LogEntry = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            action,
            category,
            details,
            device: getDetailedDeviceInfo()
        };

        // Garder seulement les 500 derniers logs
        const updatedLogs = [newLog, ...logs].slice(0, 500);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
        
        console.log(`[ESPION] ${action}: ${details}`);
    } catch (e) {
        console.error("Erreur log", e);
    }
};

export const getLogs = (): LogEntry[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

export const clearLogs = () => {
    localStorage.removeItem(STORAGE_KEY);
};
