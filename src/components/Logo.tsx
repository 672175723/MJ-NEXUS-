import React from 'react';
import { motion } from 'motion/react';

export const Logo = ({ className = "", showText = true, size = "md", light = false }: { className?: string, showText?: boolean, size?: "sm" | "md" | "lg", light?: boolean }) => {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="MJ NEXUS Logo">
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 5 }}
        className={`${iconSizes[size]} bg-gradient-to-br from-indigo-600 via-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 z-10">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M12 22V12" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 7l10 5 10-5" />
          <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" />
        </svg>
      </motion.div>
      
      {showText && (
        <div className={`flex flex-col leading-none ${light ? 'text-white' : 'text-slate-900'}`}>
          <div className={`font-black tracking-tighter ${textSizes[size]}`}>
            MJ <span className="text-emerald-500">NEXUS</span>
          </div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase mt-1">
            The Unified World
          </div>
        </div>
      )}
    </div>
  );
};
