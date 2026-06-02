'use client';

import React, { useEffect, useState } from 'react';
import SubscriptionGuard from '@/components/auth/SubscriptionGuard';
import { useUser } from '@/context/UserContext';
import { apiFetch } from '@/lib/api';

export default function AlertDashboard() {
  const { user } = useUser();
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  useEffect(() => {
    async function checkConnection() {
      try {
        setBackendStatus('loading');
        const data = await apiFetch('/api/v1/auth/me');
        console.log('User data loaded:', data);
        setBackendStatus('connected');
      } catch (err) {
        console.error('Backend connection failed details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          url: process.env.NEXT_PUBLIC_BACKEND_URL
        });
        setBackendStatus('error');
      }
    }
    
    if (user) {
      checkConnection();
    }
  }, [user]);

  return (
    <SubscriptionGuard>
      <main className="min-h-screen bg-sys-bg-base py-96 px-24 md:px-48">
        <div className="max-w-[1152px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-64 gap-24">
            <div>
              <div className="text-xs font-mono text-accent-light mb-8 tracking-widest uppercase flex items-center gap-8">
                Operator Terminal
                {backendStatus === 'connected' && (
                  <span className="flex items-center gap-4 text-[10px] text-emerald-400 bg-emerald-400/10 px-6 py-2 rounded-full border border-emerald-400/20">
                    <span className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse"></span>
                    BACKEND_LINK_ACTIVE
                  </span>
                )}
                {backendStatus === 'error' && (
                  <span className="flex items-center gap-4 text-[10px] text-ruby-alert bg-ruby-alert/10 px-6 py-2 rounded-full border border-ruby-alert/20">
                    BACKEND_LINK_OFFLINE
                  </span>
                )}
              </div>
              <h1 className="mb-8">Alert Dashboard</h1>
              <p className="text-text-secondary">Welcome back, {user?.email}. Surveillance active for your assigned zones.</p>
            </div>
            <div className="flex gap-16">
              <button className="btn-secondary text-sm">Update Zones</button>
              <button className="btn-primary text-sm">New Subscription</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-32 mb-64">
            <div className="card-standard">
              <h3 className="text-sm font-bold mb-24 text-text-muted uppercase tracking-widest">Active Monitors</h3>
              <div className="space-y-16">
                <MonitorItem zone="Colombo North" status="Normal" risk="2.4%" />
                <MonitorItem zone="Gampaha Basin" status="Warning" risk="42.8%" />
                <MonitorItem zone="Ratnapura Area" status="Normal" risk="12.1%" />
              </div>
            </div>

            <div className="card-standard">
              <h3 className="text-sm font-bold mb-24 text-text-muted uppercase tracking-widest">Recent SAR Delta Reports</h3>
              <div className="space-y-12">
                <ReportItem date="2026-04-28" zone="Gampaha" type="Full Scan" />
                <ReportItem date="2026-04-26" zone="Ratnapura" type="Change Detection" />
                <ReportItem date="2026-04-25" zone="Colombo" type="Full Scan" />
              </div>
            </div>
          </div>

          <div className="bg-sys-layer-01 border border-white/5 rounded-6 p-32">
            <h3 className="text-sm font-bold mb-24 text-text-muted uppercase tracking-widest">Account & Notification Settings</h3>
            <div className="flex flex-col md:flex-row gap-48">
              <div>
                <label className="block text-xs text-text-muted mb-8 font-mono">SMS Notification Number</label>
                <div className="text-text-primary font-mono">+94 77 ••• ••89</div>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-8 font-mono">Email Delivery</label>
                <div className="text-text-primary font-mono">{user?.email}</div>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-8 font-mono">Subscription Plan</label>
                <div className="text-accent-light font-mono">LankaGeo Pro / Tier-1</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SubscriptionGuard>
  );
}

function MonitorItem({ zone, status, risk }: { zone: string; status: string; risk: string }) {
  const isWarning = status === 'Warning';
  return (
    <div className="flex justify-between items-center p-16 bg-white/5 rounded-4 border border-white/5">
      <div>
        <div className="text-sm font-medium">{zone}</div>
        <div className="text-[10px] text-text-muted font-mono uppercase">Zone ID: LG-S1-{zone.substring(0,3).toUpperCase()}</div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-bold ${isWarning ? 'text-ruby-alert' : 'text-accent-light'}`}>{status}</div>
        <div className="text-xs text-text-muted">Risk Index: {risk}</div>
      </div>
    </div>
  );
}

function ReportItem({ date, zone, type }: { date: string; zone: string; type: string }) {
  return (
    <div className="flex justify-between items-center py-12 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-16">
        <div className="text-text-muted">
          <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium">{zone} {type}</div>
          <div className="text-[10px] text-text-muted font-mono">{date}</div>
        </div>
      </div>
      <button className="text-xs text-accent-light hover:underline font-mono">DOWNLOAD_PDF</button>
    </div>
  );
}
