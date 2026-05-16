import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Cart } from './components/Cart';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Catalog } from './pages/Catalog';
import { ProductDetailPage } from './pages/ProductDetails';
import { LoginPage } from './pages/LoginPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';
import OrdersPage from './pages/OrdersPage';
import ShippingReturns from './pages/ShippingReturns';

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-orange-500 selection:text-white">
            <Navbar onCartToggle={() => setIsCartOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <Routes>
              <Route path="/" element={<Catalog searchQuery={searchQuery} />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/inventory" element={<AdminPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/shipping-returns" element={<ShippingReturns />} />
            </Routes>

            <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
  );
}
