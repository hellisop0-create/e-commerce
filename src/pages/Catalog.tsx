import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types';
import { PRODUCT_CATEGORIES } from '../constants';
import { siteConfigService, SiteConfig } from '../services/siteConfigService';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Grid3X3, ListFilter, SlidersHorizontal, Loader2 } from 'lucide-react';

export const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParams = searchParams.get('category') || 'All';
  const [filter, setFilter] = useState(filterParams);

  useEffect(() => {
    // Sync local filter state with url search param
    setFilter(filterParams);
  }, [filterParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, configData] = await Promise.all([
          productService.getAllProducts(),
          siteConfigService.getConfig()
        ]);
        setProducts(productsData);
        setSiteConfig(configData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        // Fallback
        const module = await import('../data/inventory');
        setProducts(module.INITIAL_INVENTORY);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories: string[] = ['All', ...PRODUCT_CATEGORIES];
  
  const handleFilterChange = (cat: string) => {
    setFilter(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter(p => {
    return filter === 'All' || p.category === filter;
  });

  return (
    <main className="pb-20">
      {/* Hero Section with Background */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden mb-16 md:mb-24">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={siteConfig?.heroImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop"} 
            alt="Hero background" 
            className="w-full h-full object-cover grayscale opacity-40 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12">
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
                {siteConfig?.heroTitle ? (
                  siteConfig.heroTitle.includes(' ') ? (
                    <>
                      {siteConfig.heroTitle.split(' ').slice(0, -1).join(' ')}
                      <br/>
                      {siteConfig.heroTitle.split(' ').slice(-1)}
                    </>
                  ) : siteConfig.heroTitle
                ) : (
                  <>Pre-Loved<br/>Vintage</>
                )}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-neutral-300 text-base md:text-xl font-medium leading-tight max-w-xl"
              >
                {siteConfig?.heroSubtitle || "Sustainable style for the digital age. Every piece hand-picked, washed, and ready for a new chapter."}
              </motion.p>
            </header>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className="flex-1 md:flex-none bg-white/5 backdrop-blur-sm border border-white/10 p-4 min-w-[120px]">
                  <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Items Saved</div>
                  <div className="text-xl md:text-2xl font-black tracking-tighter">1.2k</div>
                </div>
                <div className="flex-1 md:flex-none bg-white/5 backdrop-blur-sm border border-white/10 p-4 min-w-[120px]">
                  <div className="text-[10px] font-bold uppercase text-neutral-400 mb-1">Authenticity</div>
                  <div className="text-xl md:text-2xl font-black text-emerald-500 tracking-tighter">100%</div>
                </div>
              </div>
              <button 
                onClick={() => document.getElementById('drops')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-white text-black font-black uppercase text-[10px] py-4 tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all shadow-2xl"
              >
                Explore Archives
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12" id="drops">
          {/* Mobile Categories - Horizontal Scroll */}
          <div className="lg:hidden mb-12">
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest underline underline-offset-4 decoration-white/10">Categories</span>
              <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                Swipe to explore <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange(cat)}
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
          </div>

          {/* Sidebar Logic - Hidden on Mobile */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-12">
              <div>
                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-500 mb-6 underline underline-offset-4 decoration-white/10">Archive Filter</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => handleFilterChange(cat)}
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
      
      {/* Our Story Section */}
      <section id="story" className="border-t border-white/10 mt-32 pt-32 pb-20 px-4 md:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <span className="text-[10px] font-bold tracking-[0.3em] text-orange-500 uppercase block mb-6">Our Philosophy</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
              {siteConfig?.storyTitle ? (
                siteConfig.storyTitle.includes('. ') ? (
                  <>
                    {siteConfig.storyTitle.split('. ')[0]}<br />
                    {siteConfig.storyTitle.split('. ')[1]}
                  </>
                ) : siteConfig.storyTitle
              ) : (
                <>Not Just Gear.<br />It's History.</>
              )}
            </h2>
            <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              {siteConfig?.storyDescription || "KAAM25 was born from a desire to preserve the craftsmanship of the past. We don't just sell clothes; we curate pieces of history that have stood the test of time."}
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <div className="text-2xl font-black tracking-tighter mb-1">Global</div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sourcing Network</div>
              </div>
              <div>
                <div className="text-2xl font-black tracking-tighter mb-1">Zero</div>
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Waste Packaging</div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full aspect-[4/5] bg-neutral-900 border border-white/10 overflow-hidden group">
             <img 
               src={siteConfig?.storyImage || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop"} 
               alt="Vintage collection" 
               className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-105"
             />
          </div>
        </div>
      </section>
    </main>
  );
};
