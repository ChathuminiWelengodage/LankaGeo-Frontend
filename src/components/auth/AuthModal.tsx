'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LocationSearchBar from '../dashboard/LocationSearchBar';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [locationData, setLocationData] = useState<{ name: string; lat: number; lng: number } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setError(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setSignupStep(1);
      setLocationData(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setSignupStep(1);
    setError(null);
  }, [mode]);

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

    // SIGNUP - STEP 1: VALIDATE CREDENTIALS
    if (mode === 'signup' && signupStep === 1) {
      const validationError = validateSignup();
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }
      setSignupStep(2);
      setLoading(false);
      return;
    }

    // SIGNUP - STEP 2: PERFORM REGISTRATION
    if (mode === 'signup' && signupStep === 2) {
      if (!locationData) {
        setError("Please select a monitoring location.");
        setLoading(false);
        return;
      }

      try {
        // 1. Create the user account with location in metadata (Safety fallback)
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              location_name: locationData.name,
              latitude: locationData.lat,
              longitude: locationData.lng
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error("Failed to initialize user session.");

        // 2. Attempt to create the formal profile record
        // We do this second. If it fails, the user is still registered with metadata.
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: signUpData.user.id,
            location_name: locationData.name,
            latitude: locationData.lat,
            longitude: locationData.lng,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.warn("Profile table insert failed, but user created with metadata:", profileError.message);
          // We don't throw here because the user IS registered and we have metadata fallback
        }

        alert('Registration complete! Monitoring active for ' + locationData.name);
        onClose();
        router.push('/alerts');
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // LOGIN MODE
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      onClose();
      router.push('/alerts');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
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

          {/* Tabs - Only show in Step 1 */}
          {signupStep === 1 && (
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
          )}

          <h4 className="text-sm font-medium text-text-secondary mb-24">
            {mode === 'login' 
              ? 'Portal for Sri Lankan satellite and terrain data.' 
              : signupStep === 1 
                ? 'Join the Lanka Geo professional geospatial network.'
                : 'Configure your primary monitoring zone.'}
          </h4>

          <form onSubmit={handleAuth} className="space-y-24">
            {mode === 'login' || (mode === 'signup' && signupStep === 1) ? (
              <>
                <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16 bg-sys-layer-01">
                  <span className="material-symbols-outlined text-text-muted mr-8">mail</span>
                  <input 
                    type="email" 
                    placeholder="youremail@gmail.com"
                    className="carbon-input bg-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16 bg-sys-layer-01">
                  <span className="material-symbols-outlined text-text-muted mr-8">lock</span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="carbon-input bg-transparent"
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

                {mode === 'signup' && (
                  <div className="carbon-input-container h-48 border border-white/20 rounded-4 focus-within:border-accent-primary flex items-center px-16 bg-sys-layer-01">
                    <span className="material-symbols-outlined text-text-muted mr-8">lock</span>
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="carbon-input bg-transparent"
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
              </>
            ) : (
              <div className="space-y-16">
                <p className="text-xs text-text-muted uppercase tracking-widest font-bold">Select Regional Sector</p>
                <LocationSearchBar 
                  onLocationSelect={(coords, name) => setLocationData({ name, ...coords })}
                  isLoading={loading}
                />
                {locationData && (
                  <div className="p-12 bg-accent-primary/5 border border-accent-primary/20 rounded-4 flex items-center gap-12">
                    <span className="material-symbols-outlined text-accent-primary">verified_user</span>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase font-bold">Monitoring Target</p>
                      <p className="text-sm text-white font-medium">{locationData.name}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && <p className="text-ruby-alert text-xs">{error}</p>}

            {mode === 'login' && (
              <Link 
                href="/forgot-password" 
                onClick={onClose}
                className="text-accent-light text-xs hover:underline inline-block"
              >
                Forgot Password?
              </Link>
            )}

            <div className="flex flex-col gap-12">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Log In' : signupStep === 1 ? 'Continue' : 'Finish Registration'}
              </button>
              
              {mode === 'signup' && signupStep === 2 && (
                <button 
                  type="button"
                  onClick={() => setSignupStep(1)}
                  disabled={loading}
                  className="text-text-muted hover:text-white text-xs text-center py-8 transition-colors"
                >
                  Back to credentials
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