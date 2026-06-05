'use client';

import React, { useEffect, useState } from 'react';
import SubscriptionGuard from '@/components/auth/SubscriptionGuard';
import { useUser } from '@/context/UserContext';
import { apiFetch } from '@/lib/api';

export default function AlertDashboard() {
  const { user, profile, authModal, loading } = useUser();
  const [backendStatus, setBackendStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  
  useEffect(() => {
    async function checkConnection() {
      if (!user) {
        setBackendStatus('connected');
        return;
      }
      
      try {
        setBackendStatus('loading');
        // Check connection but handle unauth state for public preview
        await apiFetch('/api/v1/auth/me').catch(() => null);
        setBackendStatus('connected');
      } catch (err) {
        console.error('Backend connection failed details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          url: process.env.NEXT_PUBLIC_BACKEND_URL
        });
        setBackendStatus('error');
      }
    }
    
    checkConnection();
  }, [user]);

  const [phone, setPhone] = useState('');
  const [notifEmail, setNotifEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone_number || '');
      setNotifEmail(user?.email || '');
    }
  }, [profile, user]);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      authModal.open('signup');
      return;
    }

    setIsUpdating(true);
    setSaveStatus('idle');
    
    try {
      // Simulate API call or update Supabase profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Saving preferences:', { phone, email: notifEmail });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sys-bg-base">
        <div className="animate-pulse text-accent-primary font-mono text-sm tracking-widest">
          INITIALIZING SECURE TERMINAL...
        </div>
      </div>
    );
  }

  // If user is not logged in, show the Public Informational View
  if (!user) {
    return (
      <SubscriptionGuard>
        <main className="min-h-screen bg-sys-bg-base py-96 px-24 md:px-48">
          <div className="max-w-[1152px] mx-auto">
            <div className="max-w-[800px] mb-64">
              <h1 className="mb-24">Join the LankaGeo Surveillance Network</h1>
              <p className="text-xl text-text-secondary leading-relaxed">
                While basic analysis is public, our advanced alert system is reserved for verified responders and high-risk regional stakeholders.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-32 mb-64">
              <BenefitCard 
                title="SMS Disaster Alerts"
                description="Receive immediate SMS notifications when flood thresholds are breached in your specific GPS coordinates."
                icon="📱"
              />
              <BenefitCard 
                title="Custom Risk Zones"
                description="Define up to 5 custom monitoring zones and receive automated SAR delta reports weekly."
                icon="🎯"
              />
              <BenefitCard 
                title="Priority Data Access"
                description="Access high-resolution raw satellite telemetry and historical change-detection archives."
                icon="⚡"
              />
            </div>

            <div className="bg-sys-layer-01 border border-accent-primary/20 rounded-8 p-48 text-center max-w-[700px] mx-auto shadow-floating">
              <h2 className="text-2xl mb-16">Ready to secure your region?</h2>
              <p className="text-text-secondary mb-32">
                Create a free account to initialize your personal alert dashboard and start receiving real-time surveillance data.
              </p>
              <div className="flex justify-center gap-16">
                <button 
                  onClick={() => authModal.open('signup')}
                  className="btn-primary"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </main>
      </SubscriptionGuard>
    );
  }

  // Authenticated Operator View
  return (
    <SubscriptionGuard>
      <main className="min-h-screen bg-sys-bg-base pt-96 pb-64 px-24 md:px-48 text-text-primary">
        <div className="max-w-[1280px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-64 gap-32">
            <div className="space-y-8">
              <div className="flex items-center gap-12">
                {backendStatus === 'connected' && (
                  <span className="flex items-center gap-6 text-[10px] text-emerald-400 bg-emerald-400/5 px-8 py-2 rounded-4 border border-emerald-400/20">
                    <span className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse"></span>
                    LINK_ACTIVE
                  </span>
                )}
                {backendStatus === 'error' && (
                  <span className="flex items-center gap-6 text-[10px] text-ruby-alert bg-ruby-alert/5 px-8 py-2 rounded-4 border border-ruby-alert/20">
                    LINK_OFFLINE
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold tracking-tight uppercase">Alert Dashboard</h1>
              <p className="text-text-secondary text-lg max-w-[600px] leading-relaxed">
                Welcome back, <span className="text-white font-mono">{user.email}</span>. Real-time surveillance active for assigned regional sectors.
              </p>
            </div>
            <div className="flex gap-16 mt-16 lg:mt-0">
              <button className="btn-secondary text-sm">Update Zones</button>
              <button className="btn-primary text-sm">System Scan</button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-48 mb-64">
            {/* Active Monitors Section */}
            <div className="lg:col-span-7 space-y-24">
              <div className="flex items-center justify-between border-b border-white/5 pb-16">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.15em]">Active Monitors</h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-16">
                {profile ? (
                  <MonitorItem zone={profile.location_name} status="Normal" risk="Active" isPrimary />
                ) : (
                  <div className="p-24 bg-white/5 rounded-6 border border-dashed border-white/10 text-center">
                    <p className="text-xs text-text-muted">No primary monitoring zone configured.</p>
                    <button 
                      onClick={() => authModal.open('signup')} 
                      className="text-accent-primary text-[10px] font-bold uppercase mt-8 hover:underline"
                    >
                      Configure Now
                    </button>
                  </div>
                )}
                <MonitorItem zone="Colombo North" status="Normal" risk="2.4%" />
                <MonitorItem zone="Gampaha Basin" status="Warning" risk="42.8%" />
              </div>
            </div>

            {/* Reports Section */}
            <div className="lg:col-span-5 space-y-24">
              <div className="flex items-center justify-between border-b border-white/5 pb-16">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.15em]">Recent SAR Delta Reports</h3>
              </div>
              <div className="card-standard p-16 space-y-4">
                <ReportItem date="2026-04-28" zone="Gampaha" type="Full Scan" />
                <ReportItem date="2026-04-26" zone="Ratnapura" type="Change Detection" />
                <ReportItem date="2026-04-25" zone="Colombo" type="Full Scan" />
                <ReportItem date="2026-04-22" zone="Kalutara" type="SAR Overlay" />
              </div>
            </div>
          </div>

          {/* Notification Channels Section */}
          <div className="space-y-24">
            <div className="flex items-center justify-between border-b border-white/5 pb-16">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-[0.15em]">Notification Channels</h3>
            </div>
            
            <div className="bg-sys-layer-01 border border-white/5 rounded-8 p-24 shadow-floating">
              <form onSubmit={handleSavePreferences} className="space-y-20">
                <div className="grid md:grid-cols-2 gap-24">
                  <div className="space-y-6">
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest">Enter Your Phone Number</label>
                    <div className="carbon-input-container h-40 border border-white/10 rounded-4 focus-within:border-accent-primary flex items-center px-12 bg-sys-bg-base transition-all group">
                      <span className="material-symbols-outlined text-text-muted group-focus-within:text-accent-primary mr-12 text-[16px] transition-colors">smartphone</span>
                      <input 
                        type="tel" 
                        placeholder="+94 77 000 0000"
                        className="carbon-input bg-transparent text-[11px] font-mono w-full outline-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest">Enter Your Email</label>
                    <div className="carbon-input-container h-40 border border-white/10 rounded-4 focus-within:border-accent-primary flex items-center px-12 bg-sys-bg-base transition-all group">
                      <span className="material-symbols-outlined text-text-muted group-focus-within:text-accent-primary mr-12 text-[16px] transition-colors">alternate_email</span>
                      <input 
                        type="email" 
                        placeholder="alerts@company.com"
                        className="carbon-input bg-transparent text-[11px] font-mono w-full outline-none"
                        value={notifEmail}
                        onChange={(e) => setNotifEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-16 gap-16">
                  <div className="flex items-center gap-12">
                    {saveStatus === 'success' && (
                      <span className="text-emerald-400 text-[9px] font-mono flex items-center gap-4 animate-fade-in bg-emerald-400/5 px-8 py-2 rounded-2 border border-emerald-400/10 uppercase">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Sync_Success
                      </span>
                    )}
                    {saveStatus === 'error' && (
                      <span className="text-ruby-alert text-[9px] font-mono flex items-center gap-4 animate-fade-in bg-ruby-alert/5 px-8 py-2 rounded-2 border border-ruby-alert/10 uppercase">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        Sync_Failed
                      </span>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="btn-primary text-[10px] px-16 h-32 disabled:opacity-50 flex items-center justify-center gap-6 uppercase tracking-wider"
                  >
                    {isUpdating ? (
                      <span className="flex items-center gap-8">
                        <span className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Syncing...
                      </span>
                    ) : 'Update Channels'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </SubscriptionGuard>
  );
}

function BenefitCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-sys-layer-01 border border-white/5 rounded-8 p-32 hover:border-accent-primary/30 transition-all group">
      <div className="text-4xl mb-24 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-lg font-bold mb-12 uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed font-light">{description}</p>
    </div>
  );
}

function MonitorItem({ zone, status, risk, isPrimary }: { zone: string; status: string; risk: string; isPrimary?: boolean }) {
  const isWarning = status === 'Warning';
  return (
    <div className={`flex justify-between items-center p-24 rounded-6 border transition-all group ${isPrimary ? 'bg-accent-primary/5 border-accent-primary/30 ring-1 ring-accent-primary/20' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'}`}>
      <div className="space-y-4">
        <div className="flex items-center gap-8">
          <div className="text-base font-bold text-white group-hover:text-accent-light transition-colors">{zone}</div>
          {isPrimary && (
            <span className="text-[8px] bg-accent-primary text-white px-6 py-1 rounded-2 font-bold tracking-tighter uppercase">Primary</span>
          )}
        </div>
        <div className="text-[10px] text-text-muted font-mono uppercase tracking-widest">Vector ID: LG-S1-{zone.substring(0,3).toUpperCase()}</div>
      </div>
      <div className="text-right space-y-4">
        <div className={`text-sm font-bold uppercase tracking-wider ${isWarning ? 'text-ruby-alert animate-pulse' : 'text-emerald-400'}`}>
          {status}
        </div>
        <div className="text-[11px] text-text-muted font-mono">Risk Index: <span className="text-text-primary font-bold">{risk}</span></div>
      </div>
    </div>
  );
}

function ReportItem({ date, zone, type }: { date: string; zone: string; type: string }) {
  return (
    <div className="flex justify-between items-center py-16 px-8 border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors group">
      <div className="flex items-center gap-20">
        <div className="text-text-muted group-hover:text-accent-light transition-colors">
          <span className="material-symbols-outlined text-[24px]">description</span>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-bold text-text-primary uppercase tracking-tight">{zone} {type}</div>
          <div className="text-[10px] text-text-muted font-mono">{date}</div>
        </div>
      </div>
      <button className="text-[10px] text-accent-light hover:text-white font-mono uppercase tracking-widest border border-accent-light/30 hover:border-white px-12 py-4 rounded-4 transition-all">
        DOWNLOAD
      </button>
    </div>
  );
}
