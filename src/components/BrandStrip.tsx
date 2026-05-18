import React from 'react';
import { motion } from 'motion/react';

const BRANDS = [
  "BALENCIAGA",
  "RICK OWENS",
  "OFF-WHITE",
  "GUCCI",
  "PRADA",
  "MAISON MARGIELA",
  "HELMUT LANG",
  "RAF SIMONS",
  "ACNE STUDIOS",
  "YEEZY"
];

export const BrandStrip: React.FC = () => {
  return (
    <div className="w-full bg-white/5 border-y border-white/5 py-10 overflow-hidden relative group">
      {/* Subtle Overlay Gradients for smooth fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10" />
      
      <div className="flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex items-center gap-20 pr-20"
        >
          {/* Duplicate brands list multiple times for seamless scrolling */}
          {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, idx) => (
            <span 
              key={idx} 
              className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-neutral-800 hover:text-orange-500/40 transition-colors cursor-default"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Technical Label */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <span className="text-[8px] font-bold text-orange-500/20 uppercase tracking-[0.5em] font-mono">
          Authorized Archive Network
        </span>
      </div>
    </div>
  );
};
