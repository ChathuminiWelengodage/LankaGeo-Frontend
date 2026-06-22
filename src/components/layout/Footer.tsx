'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-sys-layer-01 border-t border-white/10 pt-6 pb-12 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-24 md:px-48">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-32 mb-12">
          {/* Left: Brand Section */}
          <div className="space-y-8 max-w-sm pt-8">
            <Link href="/" className="relative block w-100 h-25 transition-opacity hover:opacity-80 flex-shrink-0">
              <Image
                src="/Images/logo.png"
                alt="LankaGeo Logo"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-[12px] leading-[1.4] text-text-secondary">
              Precision SAR satellite monitoring for Sri Lanka&apos;s high-risk regions. 
              Transforming complex telemetry into actionable response intelligence.
            </p>
          </div>

          {/* Center: Platform Section */}
          <div className="flex flex-col items-start lg:items-center space-y-12">
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-white">Platform</h4>
            <ul className="flex flex-col items-start lg:items-center -space-y-1">
              <li>
                <Link href="/" className="text-[12px] py-1 text-text-secondary hover:text-accent-light transition-colors block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-[12px] py-1 text-text-secondary hover:text-accent-light transition-colors block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-[12px] py-1 text-text-secondary hover:text-accent-light transition-colors block">
                  Alerts
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-[12px] py-1 text-text-secondary hover:text-accent-light transition-colors block">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Right: Social Media Icons with heading */}
          <div className="flex flex-col items-center lg:items-center space-y-12">
            <h4 className="text-[12px] font-bold uppercase tracking-widest text-white text-center">Contact Us</h4>
            <div className="flex items-center gap-12 justify-center">
              <Link href="#" className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-300">
                <i className="fab fa-facebook-f text-[14px]"></i>
              </Link>
              <Link href="#" className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-300">
                <i className="fab fa-x-twitter text-[14px]"></i>
              </Link>
              <Link href="#" className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-300">
                <i className="fab fa-linkedin-in text-[14px]"></i>
              </Link>
              <Link href="#" className="w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-300">
                <i className="fab fa-instagram text-[14px]"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-widest">
            © {currentYear} <span className="text-accent-light">LankaGeo</span> PRECISION SAR MONITORING
          </p>
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-widest">
            Developed by <span className="text-white hover:text-accent-light cursor-default transition-colors">Team LankaGeo</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
