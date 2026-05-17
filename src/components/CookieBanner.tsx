import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] max-w-lg z-[200]"
        >
          <div className="bg-[#111111] border border-white/10 p-6 shadow-2xl relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors" />
            
            <div className="flex items-start gap-4">
              <div className="bg-orange-500/10 p-3 rounded-full">
                <ShieldCheck className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-white mb-2 underline underline-offset-4 decoration-orange-500/30">
                  Data Privacy Protocol
                </h4>
                <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-widest leading-relaxed mb-6">
                  We utilize cookies to enhance your archival experience and optimize system architecture. View our <Link to="/cookie-policy" className="text-orange-500 hover:underline">Protocols</Link>. Do you accept?
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleAccept}
                    className="flex-1 bg-white text-black py-3 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleDecline}
                    className="flex-1 border border-white/10 text-white py-3 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => setIsVisible(false)}
                className="text-neutral-700 hover:text-white transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
