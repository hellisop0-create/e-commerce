import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Grid3X3, ListFilter, SlidersHorizontal } from 'lucide-react';

interface CatalogProps {
  searchQuery?: string;
}

export const Catalog: React.FC<CatalogProps> = ({ searchQuery = '' }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    productService.getAllProducts()
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        // Fallback to initial inventory for demo stability if firestore fails
        import('../data/inventory').then(module => {
          setProducts(module.INITIAL_INVENTORY);
          setIsLoading(false);
        });
      });
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) ||
      (p.sku && p.sku.toLowerCase().includes(searchLower));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header / Hero */}
        <section className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
          <header className="max-w-3xl">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold tracking-[0.3em] text-orange-500 uppercase block mb-6 underline underline-offset-8 decoration-white/10"
            >
              Curated Finds / Est. 2024
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl md:text-9xl font-black leading-[0.8] tracking-tighter uppercase mb-8"
            >
              Pre-Loved<br/>Vintage
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-neutral-500 text-base md:text-xl font-medium leading-tight max-w-xl"
            >
              Sustainable style for the digital age. Every piece hand-picked, washed, and ready for a new chapter.
            </motion.p>
          </header>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 md:flex-none bg-white/5 border border-white/10 p-4 min-w-[120px]">
                <div className="text-[10px] font-bold uppercase text-neutral-500 mb-1">Items Saved</div>
                <div className="text-xl md:text-2xl font-black tracking-tighter">1.2k</div>
              </div>
              <div className="flex-1 md:flex-none bg-white/5 border border-white/10 p-4 min-w-[120px]">
                <div className="text-[10px] font-bold uppercase text-neutral-500 mb-1">Authenticity</div>
                <div className="text-xl md:text-2xl font-black text-emerald-500 tracking-tighter">100%</div>
              </div>
            </div>
            <button 
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-white text-black font-black uppercase text-[10px] py-4 tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all shadow-lg"
            >
              View New Arrivals
            </button>
          </div>
        </section>

        {/* Controls & Grid */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12" id="products">
          {/* Mobile Categories - Horizontal Scroll */}
          <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap px-6 py-3 text-[10px] font-black uppercase tracking-widest border transition-all ${
                  filter === cat 
                    ? 'bg-white text-black border-white' 
                    : 'bg-white/5 text-neutral-500 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sidebar Logic - Hidden on Mobile */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-12">
              <div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-6 underline underline-offset-4 decoration-white/10">Browse Gear</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`block w-full text-left text-xs font-black uppercase tracking-widest py-2 px-3 transition-all ${
                        filter === cat 
                          ? 'bg-white text-black translate-x-2' 
                          : 'text-neutral-500 hover:text-white hover:translate-x-1'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-white/5 font-mono text-[9px] leading-relaxed text-neutral-500 overflow-hidden">
                <div className="mb-2 font-bold">// heritage_archives.json</div>
                <div className="text-orange-400">{"{"}</div>
                <div className="pl-3">
                  <span className="text-purple-400">"sourcing"</span>: <span className="text-emerald-500">"global"</span>,<br/>
                  <span className="text-purple-400">"quality"</span>: <span className="text-yellow-200">"verified"</span>,<br/>
                  <span className="text-purple-400">"sustainability"</span>: <span className="text-emerald-400">true</span>
                </div>
                <div className="text-orange-400">{"}"}</div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square bg-white/5 border border-white/10 animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <AnimatePresence mode='popLayout'>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {filteredProducts.length === 0 && !isLoading && (
              <div className="py-40 text-center">
                <p className="text-gray-400 font-medium">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
