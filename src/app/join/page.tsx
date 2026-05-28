'use client';

import React from 'react';
import { useUser } from '@/context/UserContext';

export default function JoinPage() {
  const { authModal } = useUser();

  return (
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
              Initialize Account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function BenefitCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-sys-layer-01 border border-white/5 rounded-6 p-32 hover:border-accent-primary/30 transition-all">
      <div className="text-4xl mb-24">{icon}</div>
      <h3 className="text-lg font-bold mb-12">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </div>
  );
}
