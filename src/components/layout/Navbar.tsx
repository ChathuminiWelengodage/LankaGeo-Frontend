'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

const Navbar = () => {
  const pathname = usePathname();
  const { user, signOut, authModal } = useUser();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Show navbar if scrolling up or at the top
      setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      setIsDropdownOpen(false); // Close dropdown on scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 bg-sys-layer-01/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.4)] h-64 pl-12 pr-24 md:pl-24 md:pr-48 flex items-center justify-between transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex items-center">
          <Link href="/" className="relative w-30 h-30 transition-all hover:opacity-80 active:scale-95 group">
            <Image
              src="/Images/logo.png"
              alt="LankaGeo Logo"
              fill
              className="object-contain transition-all group-hover:drop-shadow-[0_0_8px_rgba(15,98,254,0.6)]"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-32">
          {/* ... (Home/Dashboard/Alerts/Case Studies links remain unchanged) ... */}
          <div className="hidden md:flex items-center gap-32">
            <Link 
              href="/" 
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                pathname === '/' ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                pathname.startsWith('/dashboard') ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/alerts" 
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                pathname.startsWith('/alerts') ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Alerts
            </Link>
            <Link 
              href="/case-studies" 
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                pathname.startsWith('/case-studies') ? 'text-accent-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Case Studies
            </Link>
          </div>

          <div className="flex items-center gap-16">
            {user ? (
              <Link 
                href="/alerts"
                className="bg-accent-primary hover:bg-accent-hover text-white h-32 px-12 rounded-4 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-4 shadow-blue-glow active:scale-[0.95]"
              >
                <span className="material-symbols-outlined text-[16px]">notifications</span>
                Get Alert
              </Link>
            ) : (
              <button 
                onClick={() => authModal.open('signup')}
                className="bg-accent-primary hover:bg-accent-hover text-white h-32 px-12 rounded-4 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-4 shadow-blue-glow active:scale-[0.95]"
              >
                <span className="material-symbols-outlined text-[16px]">notifications</span>
                Get Alert
              </button>
            )}

            {user ? (
              <div className="relative ml-8">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-8 text-text-secondary hover:text-text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">account_circle</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-8 w-[180px] bg-sys-layer-01 border border-white/10 rounded-4 shadow-floating p-4 z-50 animate-fade-in">
                    {/* Explicit Close Button */}
                    <button 
                      onClick={() => setIsDropdownOpen(false)}
                      className="absolute top-2 right-2 text-text-muted hover:text-text-primary transition-colors z-10 p-2"
                      aria-label="Close menu"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>

                    <div className="px-8 py-8 flex items-center gap-6 border-b border-white/5 mb-4 pr-20">
                      <span className="material-symbols-outlined text-[14px] text-accent-light">mail</span>
                      <span className="text-[10px] text-text-primary truncate font-medium">
                        {user.email}
                      </span>
                    </div>
                    <button 
                      onClick={() => { signOut(); setIsDropdownOpen(false); }}
                      className="w-full text-left px-8 py-8 text-[10px] font-bold uppercase tracking-wider text-white bg-accent-primary hover:bg-accent-hover rounded-4 transition-all duration-200 flex items-center gap-6 group shadow-blue-glow active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined text-[16px] group-hover:rotate-12 transition-transform">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
