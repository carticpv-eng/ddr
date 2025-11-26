
import React, { useState, useEffect } from 'react';

interface PrayerData {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
  };
  date: {
    readable: string;
    hijri: {
        date: string;
        day: string;
        month: { en: string; ar: string };
        year: string;
    }
  };
}

const PrayerTimes = () => {
  const [data, setData] = useState<PrayerData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; timeLeft: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Configuration par défaut : Abidjan
  const CITY = "Abidjan";
  const COUNTRY = "Ivory Coast";

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}?city=${CITY}&country=${COUNTRY}&method=2`
        );
        const json = await response.json();
        if (json.data) {
          setData(json.data);
          calculateNextPrayer(json.data.timings);
        }
      } catch (error) {
        console.error("Erreur API Prières:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();
    
    // Recalculer le temps restant chaque minute
    const interval = setInterval(() => {
        if (data) calculateNextPrayer(data.timings);
    }, 60000);

    return () => clearInterval(interval);
  }, [data]);

  const calculateNextPrayer = (timings: any) => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const prayers = [
          { name: 'Fajr', time: timings.Fajr },
          { name: 'Dhuhr', time: timings.Dhuhr },
          { name: 'Asr', time: timings.Asr },
          { name: 'Maghrib', time: timings.Maghrib },
          { name: 'Isha', time: timings.Isha },
      ];

      for (let p of prayers) {
          const [hours, minutes] = p.time.split(':').map(Number);
          const prayerTime = hours * 60 + minutes;
          
          if (prayerTime > currentTime) {
              const diff = prayerTime - currentTime;
              const h = Math.floor(diff / 60);
              const m = diff % 60;
              setNextPrayer({
                  name: p.name,
                  time: p.time,
                  timeLeft: `${h}h ${m}min`
              });
              return;
          }
      }

      // Si toutes passées, c'est Fajr demain
      setNextPrayer({ name: 'Fajr (Demain)', time: timings.Fajr, timeLeft: 'Demain' });
  };

  if (loading) return null;

  return (
    <div className="w-full bg-[#0a0a0a] border-y border-gray-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between py-6 gap-6">
                
                {/* Left: Date & Location */}
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-brand-900/30 border border-brand-500 flex items-center justify-center text-brand-500 animate-pulse">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-none">Horaires de Prière</h3>
                        <p className="text-gray-500 text-xs mt-1 font-mono uppercase tracking-wide">
                            {CITY}, {data?.date.readable} • <span className="text-gold-500">{data?.date.hijri.day} {data?.date.hijri.month.en} {data?.date.hijri.year}</span>
                        </p>
                    </div>
                </div>

                {/* Center: Next Prayer Highlight */}
                {nextPrayer && (
                    <div className="bg-gradient-to-r from-brand-900/50 to-black border border-brand-500/30 px-6 py-2 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                        <span className="text-gray-400 text-sm">Prochaine:</span>
                        <span className="text-xl font-bold text-white">{nextPrayer.name}</span>
                        <span className="bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded">dans {nextPrayer.timeLeft}</span>
                    </div>
                )}

                {/* Right: Grid of Times */}
                <div className="flex gap-2 md:gap-4 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => {
                        const isActive = nextPrayer?.name === p;
                        return (
                            <div key={p} className={`flex flex-col items-center p-3 min-w-[70px] rounded-xl border transition-all ${isActive ? 'bg-gold-500 text-black border-gold-400 scale-110 shadow-lg font-bold' : 'bg-gray-900 text-gray-400 border-gray-800'}`}>
                                <span className="text-[10px] uppercase tracking-wider opacity-80">{p}</span>
                                <span className="text-sm font-mono mt-1">
                                    {data?.timings[p as keyof typeof data.timings].split(' ')[0]}
                                </span>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    </div>
  );
};

export default PrayerTimes;
