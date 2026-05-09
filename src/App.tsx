import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Cart } from './components/Cart';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Catalog } from './pages/Catalog';
import { ProductDetailPage } from './pages/ProductDetails';
import { LoginPage } from './pages/LoginPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-orange-500 selection:text-white">
            <Navbar onCartToggle={() => setIsCartOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <Routes>
              <Route path="/" element={<Catalog searchQuery={searchQuery} />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/inventory" element={<AdminPage />} />
            </Routes>

          <footer className="bg-[#0A0A0A] border-t border-white/10 pt-20 pb-10 px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6 group">
                  <span className="font-black text-2xl tracking-tighter uppercase whitespace-nowrap">
                    RETRO<span className="text-orange-500 group-hover:text-white transition-colors duration-300">THREADS</span>
                  </span>
                </div>
                <p className="text-neutral-500 text-lg font-medium leading-tight max-w-sm">
                  Sustainable style for the digital age. Authenticated vintage gear hand-picked from across the globe.
                </p>
              </div>
              
              <div>
                <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-neutral-400 mb-8 underline underline-offset-8 decoration-white/5">Archive</h4>
                <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  <li><Link to="/" className="hover:text-white transition-colors">Vintage</Link></li>
                  <li><Link to="/inventory" className="hover:text-white transition-colors">Inventory</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Drops</Link></li>
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
                © 2026 RETRO THREADS. ALL RIGHTS RESERVED.
              </p>
              <div className="flex items-center gap-8 text-[9px] font-mono uppercase font-bold tracking-widest text-neutral-600">
                <span className="opacity-40">Authenticity Verified</span>
                <span className="opacity-40">Eco-Friendly Shipping</span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
  );
}
