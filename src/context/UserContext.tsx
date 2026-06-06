'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
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
        // Ignore "no rows found" and ignore errors during recovery flow to reduce noise
        const isRecovery = window.location.pathname === '/reset-password';
        if (error.code !== 'PGRST116' && !isRecovery) { 
          console.error('Error fetching profile:', error.message);
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
    // Safety timeout: ensure loading state is cleared after 5 seconds
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // onAuthStateChange handles both the initial session check and subsequent changes.
    // This is the single source of truth for the user's auth state.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
      setLoading(true);
      // First, attempt to sign out from Supabase (this clears local session)
      await supabase.auth.signOut();
      
      // Clear local state immediately for reactivity
      setUser(null);
      setProfile(null);

      // Notify backend if needed (optional, non-blocking)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (apiUrl) {
        fetch(`${apiUrl}/api/v1/auth/logout`, {
          method: 'POST',
          mode: 'no-cors'
        }).catch(() => {});
      }
      
      router.push('/');
    } catch (error) {
      console.error('Error during logout process:', error);
    } finally {
      setLoading(false);
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
