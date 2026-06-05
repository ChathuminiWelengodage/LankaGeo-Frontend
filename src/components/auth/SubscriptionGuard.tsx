'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow public access to the /alerts page as a preview
    if (!loading && !user && pathname !== '/alerts') {
      router.push('/join');
    }
  }, [user, loading, router, pathname]);

  // Special handling for /alerts preview mode
  if (!user && pathname === '/alerts') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sys-bg-base">
        <div className="animate-pulse text-accent-primary font-mono text-sm tracking-widest">
          AUTHENTICATING SURVEILLANCE ACCESS...
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
