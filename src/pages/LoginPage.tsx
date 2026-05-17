import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Github, Mail } from 'lucide-react';

export const LoginPage = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Google Authentication Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication Failed');
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
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
            {isSignUp ? 'CREATE ACCOUNT' : 'ACCESS CORE'}
          </h1>
          <p className="text-neutral-500 text-xs font-medium uppercase tracking-widest">
            {isSignUp ? 'Initialize your credentials' : 'Authorized Personnel Only'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-8">
          <input 
            type="email"
            required
            placeholder="EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 h-14 px-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
          />
          <input 
            type="password"
            required
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 h-14 px-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-500 text-white h-14 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white hover:text-black transition-all disabled:opacity-20"
          >
            {isSignUp ? 'Initialize' : 'Authorize'}
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em]">
            <span className="bg-[#111111] px-4 text-neutral-600">OR PROVIDER</span>
          </div>
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
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-orange-500 transition-colors"
          >
            {isSignUp ? 'Already have credentials? Access' : 'No credentials? Initialize'}
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
