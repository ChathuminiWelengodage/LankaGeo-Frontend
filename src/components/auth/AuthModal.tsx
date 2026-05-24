'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'signup' && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
        onClose();
        router.push('/alerts');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
        router.push('/alerts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-sys-layer-01 w-full max-w-md rounded-6 border border-white/5 shadow-floating relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-16 right-16 text-text-muted hover:text-text-primary transition-all active:scale-90 group/close z-10"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined text-[24px] block group-hover/close:rotate-90 transition-transform duration-300">close</span>
        </button>

        <div className="p-32">
          {/* Logo Placeholder */}
          <div className="mb-32">
            <h3 className="text-accent-primary font-bold">LankaGeo</h3>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-24">
            <button 
              onClick={() => setMode('login')}
              className={`pb-12 px-24 text-sm font-medium transition-all ${mode === 'login' ? 'border-b-2 border-accent-primary text-text-primary' : 'text-text-muted'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`pb-12 px-24 text-sm font-medium transition-all ${mode === 'signup' ? 'border-b-2 border-accent-primary text-text-primary' : 'text-text-muted'}`}
            >
              Sign Up
            </button>
          </div>

          <h4 className="text-sm font-medium text-text-secondary mb-24">
            {mode === 'login' 
              ? 'Portal for Sri Lankan satellite and terrain data.' 
              : 'Join the Lanka Geo professional geospatial network.'}
          </h4>

          <form onSubmit={handleAuth} className="space-y-24">
            <div className="carbon-input-container h-48">
              <input 
                type="email" 
                placeholder={mode === 'login' ? 'youremail@gmail.com' : 'youremail@gmail.com'}
                className="carbon-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="carbon-input-container h-48">
              <input 
                type="password" 
                placeholder="Password"
                className="carbon-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === 'signup' && (
              <div className="carbon-input-container h-48">
                <input 
                  type="password" 
                  placeholder="Confirm Password"
                  className="carbon-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {error && <p className="text-ruby-alert text-xs">{error}</p>}

            {mode === 'login' && (
              <button type="button" className="text-accent-light text-xs hover:underline">
                Forgot Password?
              </button>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
