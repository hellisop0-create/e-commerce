import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Github, Mail } from 'lucide-react';

export const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111111] border border-white/10 p-10"
      >
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold tracking-[0.3em] text-orange-500 uppercase block mb-4 underline underline-offset-8 decoration-white/5">
            Security Layer
          </span>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">ACCESS CORE</h1>
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-black h-14 font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20"
          >
            <Mail className="w-4 h-4" />
            Sign in with Google
          </button>
          
          <button 
            className="w-full border border-white/10 text-white h-14 font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all opacity-50 cursor-not-allowed"
          >
            <Github className="w-4 h-4" />
            GitHub [Disabled]
          </button>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] font-mono uppercase text-neutral-600 tracking-widest leading-relaxed">
            By accessing this node, you agree to the <br /> system architecture protocols.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
