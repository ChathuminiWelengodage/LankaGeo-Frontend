'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  authModal: {
    isOpen: boolean;
    mode: 'login' | 'signup' | 'forgot-password';
    open: (mode?: 'login' | 'signup' | 'forgot-password') => void;
    close: () => void;
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot-password'>('login');

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Optional: Notify backend about logout if session exists
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }).catch(err => console.error('Backend logout notification failed:', err));
      }
    } catch (error) {
      console.error('Error during logout process:', error);
    } finally {
      await supabase.auth.signOut();
      window.location.href = '/';
    }
  };

  const authModal = {
    isOpen: isAuthModalOpen,
    mode: authModalMode,
    open: (mode: 'login' | 'signup' | 'forgot-password' = 'login') => {
      setAuthModalMode(mode);
      setIsAuthModalOpen(true);
    },
    close: () => setIsAuthModalOpen(false)
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut, authModal }}>
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
