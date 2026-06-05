'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  phone_number?: string;
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  authModal: {
    isOpen: boolean;
    mode: 'login' | 'signup';
    open: (mode?: 'login' | 'signup') => void;
    close: () => void;
  };
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const fetchProfile = async (userId: string) => {
    // Robust check for supabase instance methods
    if (typeof supabase.from !== 'function') {
      console.warn('Supabase client is not fully initialized or is using a mock object. Skipping profile fetch.');
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.error('Error fetching profile:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
        }
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Safety timeout: ensure loading state is cleared after 5 seconds even if Supabase hangs
    const safetyTimeout = setTimeout(() => {
      console.warn('UserContext: Loading state forced to false after 5s timeout.');
      setLoading(false);
    }, 5000);

    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
        clearTimeout(safetyTimeout);
      }
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
      clearTimeout(safetyTimeout);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    try {
      // First, attempt to sign out from Supabase (this clears local session)
      await supabase.auth.signOut();
      
      // Manually clear local state to ensure UI updates immediately
      setUser(null);
      setProfile(null);

      // Attempt to notify backend, but don't let it block redirection
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        if (apiUrl) {
          fetch(`${apiUrl}/api/v1/auth/logout`, {
            method: 'POST',
            mode: 'no-cors' // Use no-cors to prevent preflight issues during signout
          }).catch(() => {}); // Fire and forget
        }
      } catch (err) {
        // Ignore backend notification errors during signout
      }
    } catch (error) {
      console.error('Error during logout process:', error);
    } finally {
      // Force redirect to home page and refresh state
      window.location.href = '/';
    }
  };

  const authModal = {
    isOpen: isAuthModalOpen,
    mode: authModalMode,
    open: (mode: 'login' | 'signup' = 'login') => {
      setAuthModalMode(mode);
      setIsAuthModalOpen(true);
    },
    close: () => setIsAuthModalOpen(false)
  };

  return (
    <UserContext.Provider value={{ user, profile, loading, signOut, authModal, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
