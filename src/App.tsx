// 👇 CLIENT-SIDE PATCH TO SILENCE GOOGLE AI STUDIO WEBSOCKET CONNECTION ERRORS
if (typeof window !== 'undefined') {
  const originalError = window.console.error;
  window.console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('[vite] failed to connect to websocket')) {
      return; 
    }
    originalError.apply(window, args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('WebSocket closed without opened')) {
      event.preventDefault(); 
    }
  });
}

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Cart } from './components/Cart';
import { CookieBanner } from './components/CookieBanner';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Catalog } from './pages/Catalog';
import { ProductDetailPage } from './pages/ProductDetails';
import { LoginPage } from './pages/LoginPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';
import OrdersPage from './pages/OrdersPage';
import SearchPage from './pages/SearchPage';
import ShippingReturns from './pages/ShippingReturns';
import CookiePolicy from './pages/CookiePolicy';
import ProfilePage from './pages/ProfilePage';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { loading } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="splash" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
             <LoadingScreen message="Syncing with Archive" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ScrollToTop />
      <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-orange-500 selection:text-white">
        <Navbar onCartToggle={() => setIsCartOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/inventory" element={<AdminPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/shipping-returns" element={<ShippingReturns />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>

        <Footer />
        <CookieBanner />
      </div>
    </BrowserRouter>
  );
}
