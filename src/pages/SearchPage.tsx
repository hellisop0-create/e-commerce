import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, ArrowLeft, Package } from 'lucide-react';

const SearchPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  // Use URLSearchParams to get the query from the URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  useEffect(() => {
    setIsLoading(true);
    productService.getAllProducts()
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        import('../data/inventory').then(module => {
          setProducts(module.INITIAL_INVENTORY);
          setIsLoading(false);
        });
      });
  }, []);

  const filteredProducts = products.filter(p => {
    if (!query) return false;
    const searchLower = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) ||
      (p.sku && p.sku.toLowerCase().includes(searchLower)) ||
      p.category.toLowerCase().includes(searchLower)
    );
  });

  return (
    <main className="pt-32 pb-20 px-4 md:px-8 min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Archive
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-orange-500 uppercase block mb-4">
                Search Results / System Query
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none flex items-center gap-4">
                <Search className="w-8 h-8 md:w-12 md:h-12 text-neutral-700" />
                {query ? `"${query}"` : 'New Search'}
              </h1>
            </div>
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest border-b border-white/10 pb-2">
              Found {filteredProducts.length} Match{filteredProducts.length !== 1 ? 'es' : ''} in the Archive
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">Scanning Archive...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-40 text-center border border-dashed border-white/10 rounded-lg">
            <Package className="w-12 h-12 text-neutral-800 mx-auto mb-6" />
            <h2 className="text-xl font-black uppercase tracking-tight text-neutral-400 mb-2">No Matches Found</h2>
            <p className="text-neutral-600 text-xs font-bold uppercase tracking-widest max-w-xs mx-auto">
              Our archive is vast, but this particular item remains elusive. Try another identifier.
            </p>
            <Link 
              to="/" 
              className="inline-block mt-8 bg-white text-black text-[10px] font-black uppercase tracking-widest px-8 py-3 hover:bg-orange-500 hover:text-white transition-all"
            >
              Return Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchPage;
