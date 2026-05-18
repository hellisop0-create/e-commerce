import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (location.pathname === '/search') {
      onSearchChange('');
      setIsSearchExpanded(false);
    }
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else if (location.pathname === '/search') {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className={`flex items-center gap-4 sm:gap-12 ${isSearchExpanded ? 'hidden sm:flex' : 'flex'}`}>
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-black text-2xl tracking-[-0.1em] uppercase whitespace-nowrap">
              KAAM<span className="text-orange-500 font-mono italic inline-block -rotate-12 translate-x-1">25</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold tracking-widest uppercase text-neutral-400">
            {isAdmin && (
              <>
                <Link to="/inventory" className="hover:text-white transition-colors">Inventory</Link>
                <Link to="/orders" className="hover:text-white transition-colors">Orders</Link>
              </>
            )}
            <button onClick={() => scrollToSection('drops')} className="hover:text-white transition-colors uppercase">Drops</button>
            <button onClick={() => scrollToSection('story')} className="hover:text-white transition-colors uppercase">Our Story</button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6 flex-1 justify-end">
          <form 
            onSubmit={handleSearch}
            className={`relative flex items-center transition-all duration-300 ${isSearchExpanded ? 'flex-1 max-w-full lg:max-w-md' : 'w-10'}`}
          >
            <AnimatePresence>
              {isSearchExpanded && (
                <motion.input
                  autoFocus
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="SEARCH GEAR..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onBlur={() => {
                    // Small timeout to allow handleSearch click to register
                    setTimeout(() => setIsSearchExpanded(false), 200);
                  }}
                  className="bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-orange-500 transition-all w-full placeholder:text-neutral-600"
                />
              )}
            </AnimatePresence>
            <button 
              type="button"
              onClick={() => {
                if (isSearchExpanded && searchQuery) {
                  handleSearch();
                } else {
                  setIsSearchExpanded(!isSearchExpanded);
                }
              }}
              className={`p-2 hover:bg-white/5 rounded-full transition-colors absolute left-0 ${isSearchExpanded ? 'text-orange-500' : 'text-neutral-400'}`}
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
          
          {user ? (
            <div className={`hidden lg:flex items-center gap-2 sm:gap-4 ${isSearchExpanded ? 'hidden sm:flex' : 'flex'}`}>
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-3 group transition-all">
                  <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden hidden sm:block group-hover:border-orange-500 transition-colors">
                    <img 
                      src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors border-b border-transparent group-hover:border-orange-500/50 pb-0.5">
                    Account
                  </span>
                </Link>
                <button 
                  onClick={() => signOut()}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 text-neutral-500 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              className={`hidden lg:block p-2 hover:bg-white/5 rounded-full transition-colors ${isSearchExpanded ? 'hidden sm:block' : 'block'}`}
            >
              <User className="w-5 h-5 text-neutral-400" />
            </Link>
          )}

          <button 
            onClick={onCartToggle}
            className={`flex items-center gap-3 px-4 py-2 bg-white text-black rounded-full font-black text-[10px] tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] whitespace-nowrap ${isSearchExpanded ? 'hidden sm:flex' : 'flex'}`}
          >
            <span className="hidden sm:inline">Cart</span> ({totalItems.toString().padStart(2, '0')})
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 hover:bg-white/5 rounded-full ${isSearchExpanded ? 'hidden' : 'block'}`}
          >
            <Menu className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[60] bg-[#0A0A0A] p-8 lg:hidden overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-12">
            <span className="font-black text-2xl tracking-[-0.1em] uppercase">
              KAAM<span className="text-orange-500 font-mono italic inline-block -rotate-12 translate-x-1">25</span>
            </span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-white/5 rounded-full"
            >
              <Menu className="w-6 h-6 text-white rotate-90" />
            </button>
          </div>

          <div className="flex flex-col gap-8 pb-12">
            {isAdmin && (
              <>
                <Link 
                  to="/inventory" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-black uppercase tracking-tighter hover:text-orange-500 transition-colors"
                >
                  Inventory
                </Link>
                <Link 
                  to="/orders" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-black uppercase tracking-tighter hover:text-orange-500 transition-colors"
                >
                  Orders
                </Link>
              </>
            )}
            <button 
              onClick={() => scrollToSection('drops')}
              className="text-left text-4xl font-black uppercase tracking-tighter hover:text-orange-500 transition-colors"
            >
              Drops
            </button>
            <button 
              onClick={() => scrollToSection('story')}
              className="text-left text-4xl font-black uppercase tracking-tighter hover:text-orange-500 transition-colors"
            >
              Our Story
            </button>

            <div className="mt-8 pt-8 border-t border-white/10">
              {user ? (
                 <div className="space-y-6">
                   <Link 
                     to="/profile"
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="flex items-center gap-3 group"
                   >
                     <img 
                       src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                       alt="Profile" 
                       className="w-12 h-12 rounded-full border border-white/10 group-hover:border-orange-500 transition-colors"
                     />
                     <div>
                       <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Collector</div>
                       <div className="text-lg font-black uppercase tracking-tight group-hover:text-orange-500 transition-colors">{user.displayName || 'Control Center'}</div>
                     </div>
                   </Link>
                   <button 
                     onClick={() => {
                       signOut();
                       setIsMobileMenuOpen(false);
                     }} 
                     className="flex items-center gap-2 text-xs font-black uppercase text-red-500 tracking-widest hover:translate-x-2 transition-transform"
                   >
                     <LogOut className="w-4 h-4" /> Sign Out
                   </button>
                 </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter hover:text-orange-500 transition-colors"
                >
                  <User className="w-6 h-6" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
};
