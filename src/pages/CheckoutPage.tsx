import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { orderService } from '../services/productService';
import { ShippingInfo } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Package, CreditCard, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Easypaisa' | 'JazzCash' | 'COD'>('COD');
  const [formData, setFormData] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  // Handle Return from JazzCash
  useEffect(() => {
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const error = searchParams.get('error');

    if (status === 'success') {
      setIsSuccess(true);
      clearCart();
    } else if (status === 'failed') {
      setPaymentError(error || 'Payment process failed. Please try again.');
    }
  }, [searchParams, clearCart]);

  if ((cart.length === 0 && !isSuccess) && !searchParams.get('status')) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8">
        <h2 className="text-4xl font-black uppercase mb-6 tracking-tighter text-center">Your Bag is Empty</h2>
        <Link to="/" className="bg-white text-black px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-orange-500 hover:text-white transition-all">
          Browse Vintage
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      if (paymentMethod === 'JazzCash') {
        // Special flow for JazzCash
        // 1. Create a "pending" order first
        const orderId = await orderService.createOrder(user.uid, cart, totalPrice, formData, 'JazzCash');
        
        // 2. Init JazzCash on server to get signed params
        const response = await fetch('/api/payments/jazzcash/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, amount: totalPrice })
        });
        const jazzData = await response.json();

        // 3. Form submission to JazzCash via hidden document form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = jazzData.url;
        
        Object.entries(jazzData.params).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        return;
      }

      // Default COD flow
      await orderService.createOrder(user.uid, cart, totalPrice, formData, paymentMethod);
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      setPaymentError('Transaction Error: System Interruption');
    } finally {
      if (paymentMethod !== 'JazzCash') {
        setIsProcessing(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-[#111111] border border-white/10 p-12 text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Vintage Secured</h2>
          <p className="text-neutral-500 text-sm font-medium mb-12 uppercase tracking-widest">Your order has been confirmed. Expect tracking details shortly.</p>
          <Link 
            to="/" 
            className="block w-full bg-white text-black py-5 font-black uppercase text-xs tracking-[0.4em] hover:bg-orange-500 hover:text-white transition-all"
          >
            Back to Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-32 pb-20 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left: Shipping Form */}
        <div className="lg:col-span-7">
          <header className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Abandon Order
            </Link>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase mb-4">Secure Checkout</h1>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest underline underline-offset-8 decoration-white/10">Finalize your sustainable style selection</p>
          </header>

          {paymentError && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500 uppercase font-black text-[10px] tracking-widest animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {paymentError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Full Legal Name</label>
                <input 
                  required
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="RECIPIENT NAME"
                  className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Contact Number</label>
                <input 
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="PHONE NUMBER"
                  className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Shipping Destination</label>
              <input 
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="STREET ADDRESS / APARTMENT"
                className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-2 lg:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">City / Region</label>
                <input 
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="CITY"
                  className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Postal Code</label>
                <input 
                  required
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="ZIP CODE"
                  className="w-full bg-white/5 border border-white/10 p-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-6 pt-8 border-t border-white/10">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-orange-500 mb-6">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'Easypaisa', label: 'Easypaisa', description: 'Wallet Transfer' },
                    { id: 'JazzCash', label: 'JazzCash', description: 'Mobile App' },
                    { id: 'COD', label: 'COD', description: 'Cash on Delivery' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-6 border text-left transition-all ${
                        paymentMethod === method.id 
                          ? 'bg-white border-white' 
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
                        paymentMethod === method.id ? 'text-black' : 'text-white'
                      }`}>
                        {method.label}
                      </div>
                      <div className={`text-[8px] font-mono uppercase ${
                        paymentMethod === method.id ? 'text-neutral-500' : 'text-neutral-500'
                      }`}>
                        {method.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between border-t border-white/10">
              <div className="flex items-center gap-4 text-neutral-500">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[9px] font-mono uppercase tracking-[0.2em]">Encrypted Handshake Protocol Active</span>
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className="bg-white text-black px-12 py-5 font-black uppercase text-xs tracking-[0.4em] hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20 flex items-center gap-4"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Order'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Summary */}
        <aside className="lg:col-span-5">
          <div className="bg-[#111111] border border-white/10 p-8 sticky top-32">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-8 pb-4 border-b border-white/5">Order Manifest</h3>
            <div className="space-y-6 mb-12">
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-black border border-white/5 flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover opacity-50" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">{item.product.name}</h4>
                      <p className="text-[9px] font-mono text-neutral-600 uppercase">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-white/5 pt-8">
              <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-500 tracking-widest">
                <span>Shipping Fee</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-3xl font-black tracking-tighter border-t border-white/5 pt-4">
                <span>TOTAL</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-12 bg-white/5 p-4 border border-white/5 space-y-4">
               <div className="flex gap-3">
                 <ShieldCheck className="w-5 h-5 text-neutral-500" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Authenticity Guaranteed</p>
               </div>
               <p className="text-[9px] text-neutral-600 leading-relaxed font-mono uppercase">Every garment is inspected for quality and brand authenticity before shipping.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
