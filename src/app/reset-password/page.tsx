'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function ResetPassword() {
  const router = useRouter();
  const { user, loading: contextLoading } = useUser();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!contextLoading) {
      if (!user) {
        setError('Invalid or expired reset link. Please request a new one.');
      } else {
        // Check if this is a recovery session. 
        // Supabase often sets the event to 'PASSWORD_RECOVERY' which we can check via session or metadata.
        // If the user has a session but is NOT in recovery mode, then we redirect.
        const isRecoverySession = user.app_metadata?.recovery || false;
        
        // If it's a normal session (not from a recovery link) and no message is showing yet, 
        // redirect to dashboard. If it IS recovery, stay here to show the form.
        if (!isRecoverySession && !message) {
           // Double check if we actually have a 'recovery' type session. 
           // In some Supabase versions, we might need to check the URL or a specific flag.
           // For now, if they are here, we assume it's recovery unless proven otherwise.
        }
      }
    }
  }, [user, contextLoading, router, message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      // Force sign out to clear the temporary recovery session.
      // This ensures the user must manually log in with their new password.
      await supabase.auth.signOut();

      setMessage('Password has been reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) {
    return (
      <div className="bg-sys-bg-base text-text-primary min-h-[calc(100vh-64px)] flex items-center justify-center font-sans">
        <div className="animate-pulse text-text-muted">Verifying secure link...</div>
      </div>
    );
  }

  return (
    <div className="bg-sys-bg-base text-text-primary min-h-[calc(100vh-64px)] flex items-center justify-center relative font-sans overflow-hidden">
      {/* Blurred Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center filter blur-md transform scale-105 opacity-30" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')" }}
      />
      
      {/* Dimming Overlay */}
      <div className="absolute inset-0 z-0 bg-black/60"></div>

      {/* Modal Container */}
      <main className="z-10 relative bg-sys-layer-01 border border-white/5 rounded-6 shadow-floating w-full max-w-[440px] flex flex-col p-32">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center mb-24">
          <div className="w-64 h-64 rounded-full bg-sys-layer-02 border border-white/10 flex items-center justify-center mb-16">
            <span className="material-symbols-outlined text-accent-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
          <h1 className="text-2xl font-light mb-8">Set New Password</h1>
          <p className="text-sm text-text-secondary max-w-[280px]">Create a strong new password for your account.</p>
        </header>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-16 w-full">
          {/* New Password Input */}
          <div className="flex flex-col gap-8 w-full">
            <label className="text-xs text-text-muted uppercase tracking-wider font-bold px-1" htmlFor="new-password">New Password</label>
            <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16">
              <span className="material-symbols-outlined text-text-muted mr-8">lock</span>
              <input 
                className="carbon-input bg-transparent" 
                id="new-password" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !!message}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-primary ml-8"
              >
                <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-8 w-full mb-8">
            <label className="text-xs text-text-muted uppercase tracking-wider font-bold px-1" htmlFor="confirm-password">Confirm New Password</label>
            <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16">
              <span className="material-symbols-outlined text-text-muted mr-8">lock</span>
              <input 
                className="carbon-input bg-transparent" 
                id="confirm-password" 
                placeholder="••••••••" 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !!message}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-text-muted hover:text-text-primary ml-8"
              >
                <span className="material-symbols-outlined">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-12 rounded-4 bg-ruby-alert/10 text-ruby-alert border border-ruby-alert/20 text-xs flex items-center gap-8">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}
          
          {message && (
            <div className="p-12 rounded-4 bg-accent-primary/10 text-accent-light border border-accent-primary/20 text-xs flex items-center gap-8">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {message}
            </div>
          )}

          {/* Action Button */}
          {!message && (
            <button 
              className="btn-primary w-full gap-8 disabled:opacity-50 mt-8" 
              type="submit"
              disabled={loading || !!error}
            >
              <span className="material-symbols-outlined text-[18px]">gpp_good</span>
              {loading ? 'Updating...' : 'Complete'}
            </button>
          )}
        </form>

        {/* Footer / Return link */}
        <div className="mt-24 pt-16 border-t border-white/10 flex justify-center w-full">
          <Link href="/" className="text-xs text-text-secondary hover:text-accent-primary transition-colors flex items-center gap-4">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Return to Login
          </Link>
        </div>
      </main>
    </div>
  );
}
