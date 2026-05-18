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
    <div className="w-full bg-white/[0.02] border-y border-white/5 py-8 md:py-12 lg:py-16 my-8 md:my-12 lg:my-16 overflow-hidden relative group">
      {/* Subtle Overlay Gradients for smooth fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-24 lg:w-48 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-24 lg:w-48 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10" />
      
      <div className="flex whitespace-nowrap items-center">
        <motion.div 
          animate={{ x: [0, -2000] }}
          transition={{ 
            duration: 50, // Slightly slower for better readability
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex items-center gap-12 md:gap-20 lg:gap-32 pr-12 md:pr-20 lg:pr-32"
        >
          {[1, 2, 3, 4].map((set) => (
            <React.Fragment key={set}>
              <div className="flex items-center gap-12 md:gap-20 lg:gap-32">
                <span className="text-lg md:text-xl lg:text-3xl font-black tracking-[-0.05em] scale-y-95 text-white hover:text-orange-500 transition-colors cursor-default">BALENCIAGA</span>
                <span className="text-base md:text-lg lg:text-2xl font-light tracking-[0.25em] text-white/90 hover:text-orange-500 transition-colors cursor-default">RICK OWENS</span>
                <div className="flex flex-col items-center gap-0.5 group/margiela cursor-default">
                  <span className="text-[5px] md:text-[6px] lg:text-[8px] font-mono text-white/30 group-hover/margiela:text-orange-500/50 transition-colors">0 1 2 3 4 5 6 7 8 9</span>
                  <span className="text-xs md:text-sm lg:text-xl font-bold tracking-widest text-white">MAISON MARGIELA</span>
                  <span className="text-[5px] md:text-[6px] lg:text-[8px] font-mono text-white/30 group-hover/margiela:text-orange-500/50 transition-colors">17 18 19 20 21 22 23</span>
                </div>
                <span className="text-base md:text-lg lg:text-2xl font-black border-2 border-white px-2 md:px-3 lg:px-4 py-0.5 md:py-1 text-white hover:bg-white hover:text-black transition-all cursor-default">OFF-WHITE™</span>
                <span className="text-xl md:text-2xl lg:text-4xl font-serif italic tracking-[0.1em] text-white hover:text-orange-500 transition-colors cursor-default">Gucci</span>
                <span className="text-base md:text-lg lg:text-2xl font-serif tracking-[0.1em] md:tracking-[0.2em] lg:tracking-[0.3em] font-medium text-white border-y border-white/10 py-0.5 md:py-1 hover:border-orange-500 transition-colors cursor-default">PRADA</span>
                <span className="text-lg md:text-xl lg:text-3xl font-bold tracking-tighter text-white hover:text-orange-500 transition-colors cursor-default underline decoration-2 lg:decoration-4 underline-offset-4 lg:underline-offset-8">RAF SIMONS</span>
                <span className="text-base md:text-lg lg:text-2xl font-black uppercase text-white hover:text-orange-500 transition-colors cursor-default">ACNE STUDIOS</span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* Technical Label */}
      <div className="absolute top-2 md:top-3 lg:top-4 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="h-[1px] w-3 md:w-6 lg:w-8 bg-orange-500/10" />
          <span className="text-[6px] md:text-[8px] lg:text-[9px] font-black uppercase text-orange-500/30 tracking-[0.3em] md:tracking-[0.5em] font-mono whitespace-nowrap">
            Authorized Acquisition Network
          </span>
          <div className="h-[1px] w-3 md:w-6 lg:w-8 bg-orange-500/10" />
        </div>
      </div>
      
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 md:w-8 md:h-8 border-t border-l border-white/10" />
      <div className="absolute top-0 right-0 w-4 h-4 md:w-8 md:h-8 border-t border-r border-white/10" />
      <div className="absolute bottom-0 left-0 w-4 h-4 md:w-8 md:h-8 border-b border-l border-white/10" />
      <div className="absolute bottom-0 right-0 w-4 h-4 md:w-8 md:h-8 border-b border-r border-white/10" />
    </div>
  );
};

