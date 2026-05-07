'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-sys-bg-base overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-[64px] pb-96 px-24 md:px-48 max-w-[1152px] mx-auto">
        <div className="max-w-[800px]">
          <div className="inline-block px-12 py-4 bg-accent-primary/10 border border-accent-primary/20 rounded-4 text-[12px] font-mono font-medium text-accent-light mb-24 tracking-widest uppercase">
            Public Satellite Intelligence
          </div>
          <h1 className="mb-24">LankaGeo</h1>
          <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-48 max-w-[600px]">
            Precision SAR satellite monitoring for Sri Lanka&apos;s high-risk regions. 
            Real-time penetration through dense cloud cover for disaster mitigation.
          </p>
          <div className="flex flex-wrap gap-16">
            <Link href="/#analysis" className="btn-primary">Explore Live Analysis</Link>
            <Link href="/join" className="btn-secondary">Get Risk Alerts</Link>
          </div>
        </div>
      </section>

      {/* Analysis Section Placeholder */}
     {/* <section id="analysis" className="py-96 px-24 md:px-48 max-w-[1152px] mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-48 gap-24">
          <div>
            <h2 className="mb-16">Live Analysis</h2>
            <p className="text-text-secondary max-w-[500px]">
              Access real-time SAR data processing for flood detection and terrain monitoring across the island.
            </p>
          </div>
          <div className="flex gap-8">
            <span className="h-8 w-8 rounded-full bg-ruby-alert animate-ping"></span>
            <span className="text-xs font-mono text-text-muted uppercase tracking-tighter">Live Telemetry Active</span>
          </div>
        </div>*
        
        <div className="aspect-video bg-sys-layer-01 rounded-8 border border-white/10 flex items-center justify-center relative overflow-hidden group cursor-crosshair">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20 grayscale transition-transform duration-700 group-hover:scale-110"></div>
          <div className="z-10 text-center">
            <div className="text-accent-primary mb-16">
              <svg className="w-48 h-48 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="font-mono text-xs tracking-widest text-text-muted">SAR_MAP_LAYER_V2.0_LOADED</p>
          </div>
        </div>
      </section>*/}

      {/* Mission & Features */}
      <section className="bg-sys-bg-base py-96 px-24 md:px-48 max-w-[1152px] mx-auto grid md:grid-cols-2 gap-64 border-t border-white/5">
        <div>
          <div className="inline-block px-12 py-4 bg-white/5 border border-white/10 rounded-4 text-[12px] font-medium text-accent-light mb-16">
            OUR MISSION
          </div>
          <h2 className="mb-24">About LankaGeo</h2>
          <p className="text-text-secondary">
            Lanka Geo delivers high-precision flood analysis to support disaster response and regional safety across Sri Lanka. 
            By transforming complex satellite telemetry into simple, data-driven reports, we empower the Disaster Management Center 
            and local communities to act quickly and effectively during environmental crises.
          </p>
        </div>

        <div className="space-y-32">
          <FeatureCard 
            title="Advanced SAR Monitoring"
            description="Uses advanced Radar technology to see through heavy rain, clouds, and darkness, providing clear flood maps even during the worst monsoon storms."
            icon="🛰️"
          />
          <FeatureCard 
            title="Real-time Risk Assessment"
            description="Automated analysis pipelines that identify vulnerabilities and flood risks as they emerge."
            icon="📊"
          />
          <FeatureCard 
            title="Agile Response Coordination"
            description="Turning complex satellite images into clear, actionable maps and reports to help Sri Lankan emergency teams respond to floods faster."
            icon="🤝"
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="card-standard text-right group">
      <div className="text-3xl mb-16">{icon}</div>
      <h3 className="text-xl mb-8 group-hover:text-accent-primary transition-colors">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
