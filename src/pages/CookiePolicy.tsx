import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Bell } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-8 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <span className="text-[10px] font-black uppercase text-orange-500 tracking-[0.4em] mb-4 block">
            Legal Transmission
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
            Cookie <br/> Protocols
          </h1>
          <div className="h-[2px] w-24 bg-white/10" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 border border-white/5 bg-white/[0.02]"
          >
            <Shield className="w-8 h-8 text-orange-500 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Core Functionality</h3>
            <p className="text-neutral-500 text-sm leading-relaxed font-medium">
              We use essential cookies to maintain your authentication state and manage your archive cart. These are non-negotiable for system stability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 border border-white/5 bg-white/[0.02]"
          >
            <Lock className="w-8 h-8 text-orange-500 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Data Security</h3>
            <p className="text-neutral-500 text-sm leading-relaxed font-medium">
              Information stored via cookies is encrypted and never shared with unauthorized external entities. Your archival footprint remains secure.
            </p>
          </motion.div>
        </div>

        <div className="space-y-12">
          <section>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6 border-b border-white/5 pb-4">
              01. Protocol Definition
            </h4>
            <p className="text-neutral-400 text-sm leading-8 font-medium">
              Cookies are small data fragments sent from our servers to your terminal. They allow our systems to recognize your unique archival ID and remember your preferences across sessions.
            </p>
          </section>

          <section>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6 border-b border-white/5 pb-4">
              02. Utilization Matrix
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-sm text-neutral-500">
                <span className="w-6 h-[1px] bg-white/20 mt-3" />
                <span>Session Continuity: Keeping you logged into the KAAM25 terminal.</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-neutral-500">
                <span className="w-6 h-[1px] bg-white/20 mt-3" />
                <span>Inventory Retention: Persisting items in your cart during archival selection.</span>
              </li>
              <li className="flex items-start gap-4 text-sm text-neutral-500">
                <span className="w-6 h-[1px] bg-white/20 mt-3" />
                <span>System Optimization: Analyzing traffic flow to improve interface response times.</span>
              </li>
            </ul>
          </section>

          <section>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-6 border-b border-white/5 pb-4">
              03. Management Control
            </h4>
            <p className="text-neutral-400 text-sm leading-8 font-medium">
              You maintain full authority over your cookie state. Protocols can be adjusted through your terminal's browser settings or by utilizing the preference banner provided on initial connection.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Bell className="w-4 h-4 text-orange-500" />
            <span className="text-[9px] font-mono uppercase text-neutral-600 font-bold tracking-widest">
              Last Protocol Revision: May 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
