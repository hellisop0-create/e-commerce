import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Plus, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div 
      layout
      onClick={handleCardClick}
      className="group relative bg-[#111111] border border-white/10 p-6 flex flex-col justify-between hover:bg-white transition-all duration-300 cursor-pointer"
    >
      <div>
        <div className="flex justify-end items-start mb-8">
          <span className="font-black text-xl tracking-tighter group-hover:text-black transition-colors">${product.price.toFixed(2)}</span>
        </div>

        <div className="aspect-square overflow-hidden bg-black/50 mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      <div className="group-hover:text-black transition-colors duration-300">
        <h2 className="text-3xl sm:text-4xl font-black uppercase leading-[0.85] tracking-tighter mb-3 group-hover:text-black">
          {product.name}
        </h2>
        <p className="text-[11px] text-neutral-400 group-hover:text-neutral-600 leading-relaxed mb-6 line-clamp-2">
          {product.description}
        </p>
        
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents the card click (redirect) from firing
            addToCart(product);
          }}
          className="w-full border border-current py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all"
        >
          Add to Cart
        </button>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="w-4 h-4 text-black" />
      </div>
    </motion.div>
  );
};