'use client';

import React, { useEffect, useState } from 'react';
import SubscriptionGuard from '@/components/auth/SubscriptionGuard';
import { useUser } from '@/context/UserContext';
import { apiFetch } from '@/lib/api';

/**
 * AlertDashboard - Authentication Verification Page
 * 
 * This page serves as a proof-of-concept that the Frontend and Backend 
 * are correctly integrated via Supabase.
 */
export default function AlertDashboard() {
  const { user } = useUser();
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    async function checkBackendConnection() {
      try {
        // This call tests the full Auth Bridge:
        // Frontend -> JWT -> Backend -> Supabase Verification -> Response
        const data = await apiFetch('/api/v1/auth/me');
        setUserData(data);
        setBackendStatus('connected');
      } catch (err) {
        console.error('Backend connection failed:', err);
        setBackendStatus('error');
      }
    }
    
    if (user) {
      checkBackendConnection();
    }
  }, [user]);

  return (
    <SubscriptionGuard>
      <main className="min-h-screen bg-sys-bg-base py-96 px-24 md:px-48">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-64">
            <div className="text-xs font-mono text-accent-light mb-8 tracking-widest uppercase flex items-center gap-8">
              System Integration Status
              {backendStatus === 'connected' && (
                <span className="flex items-center gap-4 text-[10px] text-emerald-400 bg-emerald-400/10 px-6 py-2 rounded-full border border-emerald-400/20">
                  <span className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse"></span>
                  AUTH_BRIDGE_ACTIVE
                </span>
              )}
              {backendStatus === 'error' && (
                <span className="flex items-center gap-4 text-[10px] text-ruby-alert bg-ruby-alert/10 px-6 py-2 rounded-full border border-ruby-alert/20">
                  AUTH_BRIDGE_OFFLINE
                </span>
              )}
            </div>
            <h1 className="mb-8">Integration Verified</h1>
            <p className="text-text-secondary">The login/signup module is now communicating with the backend.</p>
          </div>

          <div className="card-standard mb-32">
            <h3 className="text-sm font-bold mb-24 text-text-muted uppercase tracking-widest">Backend Identity Check</h3>
            <div className="space-y-16 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-8">
                <span className="text-text-muted">FRONTEND_EMAIL</span>
                <span>{user?.email}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-8">
                <span className="text-text-muted">BACKEND_USER_ID</span>
                <span className="text-accent-light">{userData?.id || '---'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-8">
                <span className="text-text-muted">BACKEND_VERIFIED_EMAIL</span>
                <span className="text-accent-light">{userData?.email || '---'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">AUTH_SUCCESS</span>
                <span className={backendStatus === 'connected' ? 'text-emerald-400' : 'text-ruby-alert'}>
                  {backendStatus === 'connected' ? 'TRUE' : 'FALSE'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-sys-layer-01 border border-white/5 rounded-6 p-32">
            <h4 className="text-xs font-bold text-text-muted uppercase mb-12">How it works:</h4>
            <ul className="text-sm text-text-secondary space-y-8 list-disc pl-16">
              <li>You logged in using Supabase in the <code className="text-accent-light">AuthModal</code>.</li>
              <li>The frontend stored your session JWT.</li>
              <li>The <code className="text-accent-light">apiFetch</code> function automatically attached that JWT to the request header.</li>
              <li>The FastAPI backend received the token and verified it with Supabase.</li>
              <li>Success! Your backend is now secure and recognizes your frontend session.</li>
            </ul>
          </div>
        </div>
      </main>
    </SubscriptionGuard>
  );
}
