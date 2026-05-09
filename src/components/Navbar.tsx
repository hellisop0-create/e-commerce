import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, User, Search, Package, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onCartToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartToggle, searchQuery, onSearchChange }) => {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  const isAdmin = user?.email === 'vetdrsaad5@gmail.com';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-black text-xl tracking-tighter uppercase whitespace-nowrap">
              RETRO<span className="text-orange-500 group-hover:text-white transition-colors duration-300">THREADS</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold tracking-widest uppercase text-neutral-400">
            <Link to="/" className="text-white border-b border-white/0 hover:border-white transition-all">Vintage</Link>
            {isAdmin && (
              <Link to="/inventory" className="hover:text-white transition-colors">Inventory</Link>
            )}
            <a href="/" className="hover:text-white transition-colors">Drops</a>
            <a href="/" className="hover:text-white transition-colors">Our Story</a>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-1 justify-end">
          <div className={`relative flex items-center transition-all duration-500 ease-in-out ${isSearchExpanded ? 'flex-1 max-w-md' : 'w-10'}`}>
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.input
                  autoFocus
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="SEARCH VINTAGE..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onBlur={() => !searchQuery && setIsSearchExpanded(false)}
                  className="bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-4 text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-orange-500 transition-all w-full placeholder:text-neutral-600"
                />
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className={`p-2 hover:bg-white/5 rounded-full transition-colors absolute left-0 ${isSearchExpanded ? 'text-orange-500' : 'text-neutral-400'}`}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden hidden sm:block">
                  <img 
                    src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => signOut()}
                  className="p-2 hover:bg-red-500/10 rounded-full transition-colors group"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 text-neutral-500 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <User className="w-5 h-5 text-neutral-400" />
            </Link>
          )}

          <button 
            onClick={onCartToggle}
            className="flex items-center gap-3 px-4 py-2 bg-white text-black rounded-full font-black text-[10px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Cart ({totalItems.toString().padStart(2, '0')})
          </button>

          <button className="md:hidden p-2 hover:bg-white/5 rounded-full">
            <Menu className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </div>
    </nav>
  );
};
