import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Path to your firebase.ts
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, ShoppingBag, Info } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

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
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest hover:text-neutral-400 transition"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Grid
        </button>
        <span className="font-mono text-[10px] text-neutral-500 uppercase">Archive // {product.sku}</span>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Brutalist Image Display */}
        <div className="lg:col-span-7 space-y-4">
          <motion.div 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="border border-white/10 aspect-square grayscale hover:grayscale-0 transition-all duration-700 bg-[#111111] overflow-hidden"
          >
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Thumbnail Gallery (if more than 1 image) */}
          <div className="grid grid-cols-4 gap-4">
             {product.images.slice(1).map((img, idx) => (
               <div key={idx} className="border border-white/10 aspect-square grayscale hover:grayscale-0 transition-all cursor-crosshair">
                 <img src={img} className="w-full h-full object-cover" />
               </div>
             ))}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-end lg:pb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-baseline gap-4 mb-4">
               <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] tracking-tighter">
                {product.name}
              </h1>
            </div>

            <div className="flex justify-between items-center border-y border-white/10 py-8 mb-8">
              <span className="font-mono text-[10px] uppercase text-neutral-500">Price Points</span>
              <span className="text-4xl font-black tracking-tighter">${product.price.toFixed(2)}</span>
            </div>

            <p className="text-[12px] md:text-[14px] text-neutral-400 leading-relaxed mb-12 max-w-md">
              {product.description}
            </p>

            <div className="space-y-4">
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-white text-black py-5 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                <Plus className="w-4 h-4" /> Add to Order
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
    </motion.div>
  );
};