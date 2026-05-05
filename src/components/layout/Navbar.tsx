'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import AuthModal from '@/components/auth/AuthModal';

const Navbar = () => {
  const { user, signOut } = useUser();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-[#161616cc] backdrop-blur-[12px] border-b border-white/8 h-64 px-24 md:px-48 flex items-center justify-between">
        <div className="flex items-center gap-32">
          <Link href="/" className="text-accent-primary font-bold cursor-pointer hover:opacity-80 transition-opacity">
            LankaGeo
          </Link>
          <div className="hidden md:flex items-center gap-24">
            <Link href="/#analysis" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Live Analysis
            </Link>
            <Link href="/#risks" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Risk Trends
            </Link>
            <Link href="/case-studies" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Case Studies
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-16">
          {!user ? (
            <>
              <button 
                onClick={openLogin}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Login
              </button>
              <Link 
                href="/join"
                className="btn-primary h-40 text-sm"
              >
                Get Alerts
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/alerts"
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                My Dashboard
              </Link>
              <button 
                onClick={() => signOut()}
                className="btn-secondary h-40 text-sm"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
