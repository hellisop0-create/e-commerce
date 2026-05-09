import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldAlert, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/productService';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    onClose();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0A0A0A] text-white z-[70] shadow-2xl flex flex-col border-l border-white/10"
          >
            <div className="p-8 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-black text-2xl uppercase tracking-tighter">Your Bag</h2>
                <span className="text-[10px] font-bold bg-white text-black px-2 py-1 rounded-full">{totalItems.toString().padStart(2, '0')}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                  <div className="w-20 h-20 border-2 border-dashed border-white rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-widest text-xs text-white">Empty Bag</p>
                    <p className="text-[10px] mt-2 text-neutral-400">Your curated collection is empty</p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-6 group"
                  >
                    <div className="w-24 h-24 bg-neutral-900 overflow-hidden flex-shrink-0 border border-white/5 grayscale hover:grayscale-0 transition-all duration-500">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-black text-sm uppercase tracking-tight truncate border-b border-white/10 pb-1">{item.product.name}</h3>
                        <p className="font-black text-sm text-orange-500">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="font-mono text-[10px] text-neutral-500 mt-2 uppercase">Vintage / {item.product.category}</p>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center bg-white/5 rounded-none border border-white/10">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-white/10 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 text-[10px] font-black">{item.quantity.toString().padStart(2, '0')}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-white/10 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="text-neutral-600 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-8 bg-[#111111] border-t border-white/10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-widest block mb-1">Subtotal</span>
                  <p className="text-4xl font-black tracking-tighter">${totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {!user && cart.length > 0 && (
                <div className="mb-4 flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-lg">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Authentication Required</p>
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className="w-full bg-white text-black h-16 font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {user ? 'Secure Checkout' : 'Login to Checkout'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <div className="mt-6 text-center">
                <span className="text-[9px] font-mono uppercase text-neutral-600 tracking-widest">Sustainability Verified / Flat Rate Shipping</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
