import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6 group">
            <span className="font-black text-3xl tracking-[-0.1em] uppercase whitespace-nowrap">
              KAAM<span className="text-orange-500 font-mono italic inline-block -rotate-12 translate-x-1">25</span>
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
            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            <li><Link to="/" className="hover:text-white transition-colors">Our Story</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 gap-6">
        <p className="text-[9px] font-mono uppercase font-bold tracking-widest text-neutral-600">
          © 2026 KAAM25 SYSTEM. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-8 text-[9px] font-mono uppercase font-bold tracking-widest text-neutral-600">
        </div>
      </div>
    </footer>
  );
};
