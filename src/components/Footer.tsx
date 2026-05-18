import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const Footer: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6 group">
            <span className="font-black text-3xl tracking-[-0.1em] uppercase whitespace-nowrap">
              ZEE<span className="text-orange-500 font-mono italic inline-block -rotate-6 translate-x-0.5">MARC</span>
            </span>
          </div>
          <p className="text-neutral-500 text-lg font-medium leading-tight max-w-sm">
            Sustainable style for the digital age. Authenticated vintage gear hand-picked from across the globe.
          </p>
        </div>
        
        <div>
          <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-neutral-400 mb-8 underline underline-offset-8 decoration-white/5">Archive</h4>
          <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            {isAdmin && (
              <>
                <li><Link to="/inventory" className="hover:text-white transition-colors">Inventory</Link></li>
                <li><Link to="/orders" className="hover:text-white transition-colors">Orders</Link></li>
              </>
            )}
            <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-neutral-400 mb-8 underline underline-offset-8 decoration-white/5">Connect</h4>
          <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            <li>
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Email Support
              </button>
            </li>
            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            <li><Link to="/" className="hover:text-white transition-colors">Our Story</Link></li>
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-black uppercase text-xl tracking-tighter mb-2">Support Transmission</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-8 leading-relaxed">
                Direct line to ZEEMARC logistics and support.
              </p>

              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                alert('Transmission received. We will respond shortly.');
                setIsContactModalOpen(false);
              }}>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase text-neutral-600">Verification ID</span>
                  <input 
                    required
                    type="email" 
                    placeholder="YOUR@EMAIL.COM" 
                    className="w-full bg-white/5 border border-white/10 p-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase text-neutral-600">Transmission Content</span>
                  <textarea 
                    required
                    placeholder="ENTER YOUR MESSAGE..." 
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 p-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all shadow-lg"
                >
                  Send Transmission
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 gap-6">
        <p className="text-[9px] font-mono uppercase font-bold tracking-widest text-neutral-600">
          © 2026 ZEEMARC SYSTEM. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-8 text-[9px] font-mono uppercase font-bold tracking-widest text-neutral-600">
          <Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
          <button 
            onClick={() => {
              localStorage.removeItem('cookie-consent');
              window.location.reload();
            }}
            className="hover:text-white transition-colors uppercase"
          >
            Manage Protocols
          </button>
        </div>
      </div>
    </footer>
  );
};
