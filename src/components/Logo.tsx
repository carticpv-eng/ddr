
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-14" }) => {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* 3D Stylized Mosque Icon */}
      <div className="relative w-12 h-12 flex-shrink-0">
        {/* Shadow/Glow effect */}
        <div className="absolute inset-0 bg-brand-500/20 blur-lg rounded-full group-hover:bg-brand-500/40 transition-all duration-500"></div>
        
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-2xl">
          {/* Mosque Building (Golden Orange) */}
          <path 
            d="M20 80 L20 50 Q20 40 30 40 L70 40 Q80 40 80 50 L80 80 Z" 
            fill="#f59e0b" 
            className="drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)]"
          />
          {/* Arches (Rounded) */}
          <path d="M30 80 L30 60 Q35 55 40 60 L40 80" fill="#78350f" />
          <path d="M60 80 L60 60 Q65 55 70 60 L70 80" fill="#78350f" />
          
          {/* Roof (Dark Black) */}
          <path 
            d="M15 50 L50 20 L85 50 Z" 
            fill="#1a1a1a" 
            stroke="#333" 
            strokeWidth="1"
          />
          
          {/* Crescent and Star (Gold) */}
          <g transform="translate(50, 15) scale(0.6)">
            <path 
              d="M-5 -5 Q5 0 -5 5 Q0 0 -5 -5" 
              fill="#fbbf24" 
              transform="rotate(-20)"
            />
            <path 
              d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" 
              fill="#fbbf24" 
              transform="translate(8, -5) scale(0.4)"
            />
          </g>
        </svg>
      </div>

      {/* Text Part */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-gray-700 tracking-tighter leading-none drop-shadow-[2px_2px_0px_rgba(255,255,255,0.1)] italic">
            DDR
          </span>
          <span className="text-[10px] font-bold text-brand-500 uppercase tracking-[0.3em] whitespace-nowrap">
            La Daawah Dans la Rue
          </span>
        </div>
        <span className="text-[14px] text-brand-400 font-medium leading-tight mt-1" style={{ fontFamily: "'Amiri', serif" }}>
          الدعوة في الشارع
        </span>
      </div>
    </div>
  );
};

export default Logo;
