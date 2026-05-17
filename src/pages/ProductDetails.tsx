import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Path to your firebase.ts
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, ShoppingBag, Info, Star, ChevronRight } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isInspecting, setIsInspecting] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsInspecting(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono text-white text-[10px] uppercase tracking-[0.5em]">
      Loading Data...
    </div>
  );

  if (!product) return <div className="bg-black min-h-screen text-white p-20 uppercase font-black">Item Not Found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black text-white p-4 md:p-12 font-sans overflow-x-hidden"
    >
      <AnimatePresence>
        {isInspecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsInspecting(false)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-8 left-0 right-0 flex justify-between items-center px-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  Inspecting Archive // {product.sku} // View {activeImage + 1}
                </span>
                <button className="text-[10px] font-black uppercase tracking-widest hover:text-orange-500 transition">Close [ESC]</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest hover:text-neutral-400 transition"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Grid
        </button>
        {/* Placeholder for alignment */}
        <div className="hidden md:block w-32" /> 
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
        
        {/* Left: Responsive Image Display */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-4">
            <motion.div 
              layoutId={`product-image-${product.id}`}
              onClick={() => setIsInspecting(true)}
              className="border border-white/10 aspect-[4/5] md:aspect-square grayscale hover:grayscale-0 transition-all duration-700 bg-[#111111] overflow-hidden cursor-zoom-in group relative"
            >
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`border transition-all duration-300 aspect-square overflow-hidden ${
                      activeImage === idx ? 'border-orange-500 scale-[0.98]' : 'border-white/10 grayscale hover:grayscale-0 hover:border-white/30'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-center py-4 md:py-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-baseline gap-4 mb-4">
               <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < (product.rating || 4.5) ? 'fill-orange-500 text-orange-500' : 'text-neutral-700'}`} 
                />
              ))}
              <span className="text-[10px] font-mono uppercase text-neutral-500 ml-2 tracking-widest">
                {(product.rating || 4.5).toFixed(1)} // {product.numReviews || '24'} Reviews
              </span>
            </div>

            <div className="flex justify-between items-center border-y border-white/10 py-8 mb-8">
              <span className="font-mono text-[10px] uppercase text-neutral-500">Price Points</span>
              <span className="text-4xl font-black tracking-tighter">Rs. {product.price.toLocaleString()}</span>
            </div>

            <p className="text-[12px] md:text-[14px] text-neutral-400 leading-relaxed mb-12 max-w-md">
              {product.description}
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-white text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3 border border-white"
              >
                <Plus className="w-4 h-4" /> Add to Order
              </button>
              <button 
                onClick={() => {
                  addToCart(product);
                  navigate('/checkout');
                }}
                className="w-full bg-orange-500 text-white py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 border border-orange-500"
              >
                <ShoppingBag className="w-4 h-4" /> Buy Now
              </button>
            </div>
            
            {/* Meta Data Section */}
            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
               <div>
                 <span className="block font-mono text-[9px] text-neutral-600 uppercase mb-2">Category</span>
                 <span className="text-[10px] uppercase font-bold tracking-widest">{product.category || 'Standard'}</span>
               </div>
               <div>
                 <span className="block font-mono text-[9px] text-neutral-600 uppercase mb-2">Availability</span>
                 <span className="text-[10px] uppercase font-bold tracking-widest">In Stock</span>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto mt-24 pt-24 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <h3 className="text-4xl font-black uppercase leading-none tracking-tighter mb-8">Member<br />Feedback</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black leading-none">{(product.rating || 4.5).toFixed(1)}</div>
                <div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-orange-500 text-orange-500' : 'text-neutral-800'}`} />
                    ))}
                  </div>
                  <div className="text-[9px] font-mono uppercase text-neutral-500 tracking-widest mt-1">Based on {product.numReviews || '24'} ratings</div>
                </div>
              </div>
              
              {/* Rating Bars */}
              <div className="space-y-2 pt-8">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-neutral-500 w-2">{star}</span>
                    <div className="flex-1 h-px bg-neutral-800 relative">
                      <div className="absolute left-0 top-0 h-full bg-orange-500" style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-12 w-full py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Write a Review
            </button>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-12">
              {[
                { name: 'S. AHMED', date: '2 DAYS AGO', rating: 5, comment: 'The quality of this piece is exceptional. You can tell it\'s been carefully sourced. The fit is exactly as described in the measurements.' },
                { name: 'K. MALIK', date: '1 WEEK AGO', rating: 4, comment: 'Perfect addition to my archive. Fast shipping and the packaging was industrial-grade premium.' },
                { name: 'M. ZAIN', date: '2 WEEKS AGO', rating: 5, comment: 'Authentic 90s vibes. KAAM25 is the only place in PK doing this right.' }
              ].map((review, idx) => (
                <div key={idx} className="pb-12 border-b border-white/5 last:border-0 hover:translate-x-2 transition-transform duration-500 group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-white text-white' : 'text-neutral-800'}`} />
                        ))}
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest">{review.name}</h4>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">{review.date}</span>
                  </div>
                  <p className="text-[13px] text-neutral-400 leading-relaxed max-w-2xl">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};