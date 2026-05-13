'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import AuthModal from '@/components/auth/AuthModal';

const Navbar = () => {
  const pathname = usePathname();
  const { user, signOut } = useUser();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Show navbar if scrolling up or at the top
      setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <nav className={`fixed top-0 w-full z-50 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_10px_rgba(15,98,254,0.15)] h-64 px-24 md:px-48 flex items-center justify-between transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center">
        <Link href="/" className="text-white text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          LankaGeo
        </Link>
      </div>

      <div className="flex items-center gap-32">
        <div className="hidden md:flex items-center gap-32">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            className={`text-sm font-medium transition-colors ${
              pathname === '/dashboard' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/alerts" 
            className={`text-sm font-medium transition-colors ${
              pathname === '/alerts' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Alerts
          </Link>
          <Link 
            href="/case-studies" 
            className={`text-sm font-medium transition-colors ${
              pathname === '/case-studies' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Case Studies
          </Link>
        </div>

        <div className="flex items-center gap-16">
          <Link 
            href="/alerts"
            className="bg-[#0f62fe] hover:bg-[#0043ce] text-white h-32 px-8 rounded-[4px] text-[11px] font-semibold transition-all flex items-center gap-4 shadow-blue-glow active:scale-[0.95]"
          >
            <span className="material-symbols-outlined text-[16px]">notifications</span>
            Get Alerts
          </Link>

          {user ? (
            <div className="flex items-center gap-16 ml-8">
              <span className="text-text-secondary text-[11px] font-medium hidden lg:inline">
                {user.email}
              </span>
              <button 
                onClick={() => signOut()}
                className="text-text-secondary hover:text-accent-primary text-[11px] font-medium transition-colors flex items-center gap-4"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="text-text-secondary hover:text-text-primary text-[11px] font-medium transition-colors flex items-center gap-4 px-8"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              Log In
            </button>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;
