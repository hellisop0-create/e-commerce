import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Initializing System Protocol" 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 25; // Faster increments
      });
    }, 50); // Faster interval

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] bg-[#0A0A0A] flex flex-col items-center justify-center p-8">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      {/* Scanning Line Effect */}
      <motion.div 
        initial={{ y: "-100%" }}
        animate={{ y: "100%" }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-full h-[2px] bg-orange-500/10 z-10 pointer-events-none shadow-[0_0_15px_rgba(249,115,22,0.3)]"
      />

      <div className="relative z-20 flex flex-col items-center gap-12 max-w-sm w-full">
        {/* Animated Logo/Symbol */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 border-2 border-white flex items-center justify-center relative overflow-hidden"
          >
            <span className="text-2xl font-black italic tracking-tighter">K25</span>
            <motion.div 
              animate={{ 
                x: ["-100%", "100%"],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/20 skew-x-12"
            />
          </motion.div>
          
          {/* Corner Accents */}
          <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
        </div>

        <div className="w-full space-y-6">
          {/* Technical Info */}
          <div className="flex justify-between items-end font-mono">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-orange-500 tracking-[0.3em] block">Status</span>
              <motion.span 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-[9px] text-white/50 uppercase tracking-widest"
              >
                {message}...
              </motion.span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-neutral-600 tracking-[0.3em] block">Sync</span>
              <span className="text-xl font-black italic text-white tabular-nums">
                {Math.min(Math.round(progress), 100)}%
              </span>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="h-[4px] w-full bg-white/5 border border-white/10 relative overflow-hidden">
            <motion.div 
              className="h-full bg-orange-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Bottom Metatags */}
          <div className="flex justify-between text-[8px] font-bold text-neutral-700 uppercase tracking-[0.2em] font-mono">
            <span>Archive_v2.0.4</span>
            <span>Auth_Secure_Enabled</span>
            <span>Connection_Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
