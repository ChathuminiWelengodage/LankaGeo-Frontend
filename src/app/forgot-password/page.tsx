'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'A reset link has been sent to your email. Please click the link to set your new password.'
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'An error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sys-bg-base text-text-primary min-h-[calc(100vh-64px)] flex items-center justify-center relative font-sans overflow-hidden">
      {/* Blurred Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center filter blur-md transform scale-105 opacity-30" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')" }}
      />
      
      {/* Dimming Overlay */}
      <div className="absolute inset-0 z-0 bg-black/60"></div>

      <div className="relative z-10 w-full max-w-md mx-4 p-32 bg-sys-layer-01 rounded-6 border border-white/5 shadow-floating flex flex-col items-center">
        {/* Icon */}
        <div className="w-48 h-48 rounded-full bg-sys-layer-02 flex items-center justify-center mb-24 border border-white/10">
          <span className="material-symbols-outlined text-accent-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
        </div>

        {/* Heading & Description */}
        <div className="text-center mb-32">
          <h1 className="text-2xl font-light mb-8">Reset Your Password</h1>
          <p className="text-sm text-text-secondary max-w-sm mx-auto">
            Enter your email and we'll send you a secure link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-24">
          <div className="flex flex-col gap-8">
            <label className="text-xs text-text-muted uppercase tracking-wider font-bold" htmlFor="email">
              Email Address
            </label>
            <div className="carbon-input-container h-48 border-b-2 border-white/20">
              <input 
                className="carbon-input" 
                id="email" 
                name="email" 
                placeholder="admin@lankageo.com" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || message?.type === 'success'}
              />
            </div>
          </div>

          {message && (
            <div className={`p-12 rounded-4 text-xs flex items-start gap-8 ${message.type === 'success' ? 'bg-accent-primary/10 text-accent-light border border-accent-primary/20' : 'bg-ruby-alert/10 text-ruby-alert border border-ruby-alert/20'}`}>
              <span className="material-symbols-outlined text-sm mt-2">
                {message.type === 'success' ? 'check_circle' : 'error'}
              </span>
              <span>{message.text}</span>
            </div>
          )}

          <div className="flex flex-col gap-16 mt-8">
            {!message || message.type !== 'success' ? (
              <button 
                className="btn-primary w-full gap-8 disabled:opacity-50" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Send Reset Link'}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            ) : null}
            
            <Link 
              href="/" 
              className="w-full flex items-center justify-center gap-8 py-8 rounded-4 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors group text-sm"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-4 transition-transform">arrow_back</span>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
