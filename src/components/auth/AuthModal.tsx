'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot-password';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setMessage(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setMode(initialMode);
      setForgotStep(1);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const validateSignup = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain uppercase, lowercase, number, and special character";
    }
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const validationError = validateSignup();
        if (validationError) {
          setError(validationError);
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
        router.push('/alerts');
      } else if (mode === 'forgot-password') {
        if (forgotStep === 1) {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
          });
          if (error) throw error;
          setMessage('Password reset link sent to your email! You can now set a new password below.');
          setForgotStep(2);
        } else {
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
          const { error } = await supabase.auth.updateUser({
            password: password,
          });
          if (error) throw error;
          setMessage('Password updated successfully! Redirecting to login...');
          setTimeout(() => {
            setMode('login');
            setForgotStep(1);
            setMessage(null);
            setPassword('');
            setConfirmPassword('');
          }, 2000);
        }
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

          {/* Tabs - Only show for login/signup */}
          {mode !== 'forgot-password' ? (
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
          ) : (
            <div className="mb-24">
              <h2 className="text-lg font-bold text-text-primary">
                {forgotStep === 1 ? 'Reset Password' : 'Set New Password'}
              </h2>
            </div>
          )}

          <h4 className="text-sm font-medium text-text-secondary mb-24">
            {mode === 'login' 
              ? 'Portal for Sri Lankan satellite and terrain data.' 
              : mode === 'signup'
              ? 'Join the Lanka Geo professional geospatial network.'
              : forgotStep === 1
              ? 'Enter your email to receive a password reset link.'
              : 'Create a new secure password for your account.'}
          </h4>

          <form onSubmit={handleAuth} className="space-y-24">
            {/* Step 1: Email (Shown in login, signup, and forgot-password step 1) */}
            {(mode !== 'forgot-password' || forgotStep === 1) && (
              <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16 bg-sys-layer-01">
                <span className="material-symbols-outlined text-text-muted mr-8">mail</span>
                <input 
                  type="email" 
                  placeholder="youremail@gmail.com"
                  className="carbon-input bg-transparent w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Password Fields */}
            {((mode !== 'forgot-password') || (mode === 'forgot-password' && forgotStep === 2)) && (
              <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16 bg-sys-layer-01">
                <span className="material-symbols-outlined text-text-muted mr-8">lock</span>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === 'forgot-password' ? "New Password" : "Password"}
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
            )}

            {/* Confirm Password Fields (Signup or Forgot Step 2) */}
            {(mode === 'signup' || (mode === 'forgot-password' && forgotStep === 2)) && (
              <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16 bg-sys-layer-01">
                <span className="material-symbols-outlined text-text-muted mr-8">lock</span>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={mode === 'forgot-password' ? "Confirm New Password" : "Confirm Password"}
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
            )}

            {error && <p className="text-ruby-alert text-xs">{error}</p>}
            {message && <p className="text-accent-primary text-xs">{message}</p>}

            <div className="flex items-center justify-between">
              {mode === 'login' && (
                <button 
                  type="button" 
                  onClick={() => setMode('forgot-password')}
                  className="text-accent-light text-xs hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>

            <div className="flex flex-col gap-12">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-8"
              >
                {loading ? 'Processing...' : 
                  mode === 'login' ? 'Log In' : 
                  mode === 'signup' ? 'Create Account' : 
                  forgotStep === 1 ? 'Next' : 'Update Password'}
                {(mode === 'forgot-password' && forgotStep === 1) && (
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                )}
              </button>

              {mode === 'forgot-password' && (
                <button 
                  type="button" 
                  onClick={() => {
                    setMode('login');
                    setForgotStep(1);
                  }}
                  className="btn-secondary w-full flex items-center justify-center gap-8 group"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform duration-200">arrow_back</span>
                  Back to Login
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;