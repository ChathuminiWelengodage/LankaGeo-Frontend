'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { authModal } = useUser();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Check if we are in a recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Optional: redirect or show message
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage("Password updated successfully! Redirecting to dashboard...");
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background with slight blur if desired, or just dark background */}
      <div className="absolute inset-0 z-0 bg-background/60 backdrop-blur-md"></div>

      <div className="bg-sys-layer-01 w-full max-w-md rounded-6 border border-white/5 shadow-floating relative z-10">
        <div className="p-32">
          {/* Logo Placeholder */}
          <div className="mb-32">
            <h3 className="text-accent-primary font-bold">LankaGeo</h3>
          </div>

          <div className="mb-24">
            <h2 className="text-lg font-bold text-text-primary">Create New Password</h2>
            <p className="text-sm text-text-secondary mt-4">Set a secure password for your account.</p>
          </div>

          <form onSubmit={handleReset} className="space-y-24">
            {/* New Password Input */}
            <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16 bg-sys-layer-01">
              <span className="material-symbols-outlined text-text-muted mr-8">lock</span>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="carbon-input bg-transparent w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-primary ml-8"
              >
                <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16 bg-sys-layer-01">
              <span className="material-symbols-outlined text-text-muted mr-8">lock</span>
              <input 
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                className="carbon-input bg-transparent w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-text-muted hover:text-text-primary ml-8"
              >
                <span className="material-symbols-outlined">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>

            {error && <p className="text-ruby-alert text-xs">{error}</p>}
            {message && <p className="text-accent-primary text-xs">{message}</p>}

            <button 
              type="submit" 
              disabled={loading || !!message}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Complete Reset'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-24 pt-24 border-t border-white/10 flex justify-center">
            <button 
              onClick={() => {
                router.push('/');
                setTimeout(() => authModal.open('login'), 100);
              }}
              className="text-accent-light text-xs hover:underline flex items-center"
            >
              <span className="material-symbols-outlined text-xs mr-4">arrow_back</span>
              Return to Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
