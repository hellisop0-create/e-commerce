import React from 'react';
import { motion } from 'motion/react';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

const ShippingReturns: React.FC = () => {
  return (
    <main className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <header className="border-b border-white/10 pb-12">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Shipping & Returns</h1>
          <p className="text-neutral-500 font-medium">Everything you need to know about receiving your curated gear.</p>
        </header>

        <section className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-orange-500">
              <Truck className="w-5 h-5" />
              <h2 className="font-black uppercase tracking-widest text-xs">Shipping Policy</h2>
            </div>
            <div className="space-y-4 text-neutral-400 text-sm leading-relaxed">
              <p>
                All orders are processed within 2-3 business days. We ship worldwide using carbon-neutral logistics providers to ensure your vintage finds reach you sustainably.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Domestic (US): 3-5 business days - $8.00</li>
                <li>International: 7-14 business days - $25.00</li>
                <li>Free shipping on orders over $150</li>
              </ul>
              <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-600">
                Note: Import duties and taxes for international shipments are the responsibility of the customer.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-orange-500">
              <RotateCcw className="w-5 h-5" />
              <h2 className="font-black uppercase tracking-widest text-xs">Returns & Exchanges</h2>
            </div>
            <div className="space-y-4 text-neutral-400 text-sm leading-relaxed">
              <p>
                Due to the unique, one-of-a-kind nature of vintage clothing, <span className="text-white font-bold">all sales are final</span>. 
              </p>
              <p>
                We provide detailed measurements and condition reports for every item. Please review these carefully before purchasing. If there is a significant error in our listing, contact us within 48 hours of delivery.
              </p>
              <div className="bg-white/5 border border-white/10 p-4">
                <p className="text-[10px] leading-tight font-medium">
                  Each piece is authenticated and professionally cleaned before being added to the archive.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 p-8 md:p-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 text-emerald-500 mb-6">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="font-black uppercase tracking-widest text-xs">Sustainability Commitment</h2>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              By choosing vintage, you're extending the lifecycle of quality garments and reducing environmental impact. We use compostable mailers and recycled paper for all our packaging.
            </p>
            <div className="text-[10px] font-mono text-neutral-600">
              // NO PLASTIC POLICY / RECYCLED ARCHIVE GEAR
            </div>
          </div>
        </section>
      </motion.div>
    </main>
  );
};

export default ShippingReturns;
