'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_CASE_STUDIES } from '@/lib/mock-case-studies';

export default function CaseStudyDetailsPage() {
  const { id } = useParams();
  
  const caseStudy = MOCK_CASE_STUDIES.find(cs => cs.id === id);

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sys-bg-base text-text-primary">
        <div className="text-center">
          <h2 className="mb-24">Case Study Not Found</h2>
          <Link href="/case-studies" className="btn-primary">Back to Case Studies</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-sys-bg-base text-text-primary pb-96">
      <div className="pt-32 px-24 md:px-48 max-w-[1152px] mx-auto">
        <Link 
          href="/case-studies" 
          className="flex items-center gap-8 text-accent-light hover:text-white transition-colors mb-48 group w-fit"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-4 transition-transform">arrow_back</span>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em]">Return to Registry</span>
        </Link>

        <header className="mb-64">
          <div className="flex items-center gap-16 mb-24">
            <span className="px-12 py-4 bg-accent-primary/10 border border-accent-primary/20 rounded-4 text-[10px] font-mono font-medium text-accent-light uppercase tracking-widest">
              {caseStudy.category}
            </span>
            <span className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em]">
              {caseStudy.date}
            </span>
          </div>
          <h1 className="mb-24 max-w-[800px]">
            {caseStudy.title}
          </h1>
          <div className="flex items-center gap-8 text-text-secondary font-mono text-[12px] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[14px] text-accent-primary">location_on</span>
            <span>Loc: {caseStudy.location}</span>
          </div>
        </header>

        <div className="aspect-[21/9] w-full overflow-hidden rounded-8 mb-64 border border-white/10 shadow-elevated group">
          <img 
            src={caseStudy.image_url} 
            alt={caseStudy.title} 
            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
          />
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-64">
          <div className="space-y-64">
            <section>
              <h2 className="text-sm font-mono font-bold uppercase tracking-widest mb-32 text-accent-light border-b border-white/10 pb-16">
                01_Overview
              </h2>
              <p className="text-text-secondary leading-relaxed text-lg max-w-[700px]">
                {caseStudy.content}
              </p>
            </section>

            <section>
              <h2 className="text-sm font-mono font-bold uppercase tracking-widest mb-32 text-accent-light border-b border-white/10 pb-16">
                02_Analysis_Metrics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                <MetricCard label="Max Rainfall" value={caseStudy.analysis.rainfall} />
                <MetricCard label="Impact Level" value={caseStudy.analysis.impact} />
                <MetricCard label="Event Duration" value={caseStudy.analysis.duration} />
                <MetricCard label="Affected Area" value={caseStudy.analysis.affectedArea} />
              </div>
            </section>
          </div>

          <aside className="space-y-48">
            <div className="card-standard !border-accent-primary/20">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest mb-32 text-accent-primary flex items-center gap-12">
                <span className="h-4 w-4 rounded-full bg-accent-primary animate-pulse"></span>
                Telemetry_Data
              </h3>
              <div className="space-y-32">
                {caseStudy.stats?.map((stat, idx) => (
                  <div key={idx} className="group">
                    <p className="text-[10px] font-mono text-text-muted uppercase mb-8 group-hover:text-accent-light transition-colors">{stat.label}</p>
                    <p className="text-3xl font-light text-text-primary tracking-tighter">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-32 bg-white/5 border border-white/10 rounded-6">
              <h3 className="text-[11px] font-bold mb-24 uppercase tracking-[0.2em] text-text-muted">Research_Distribution</h3>
              <div className="flex gap-16">
                <button className="w-40 h-40 flex items-center justify-center rounded-4 bg-white/5 border border-white/10 hover:bg-accent-primary hover:border-accent-primary transition-all text-text-secondary hover:text-white">
                  <i className="fa-brands fa-x-twitter"></i>
                </button>
                <button className="w-40 h-40 flex items-center justify-center rounded-4 bg-white/5 border border-white/10 hover:bg-accent-primary hover:border-accent-primary transition-all text-text-secondary hover:text-white">
                  <i className="fa-brands fa-linkedin-in"></i>
                </button>
                <button className="w-40 h-40 flex items-center justify-center rounded-4 bg-white/5 border border-white/10 hover:bg-accent-primary hover:border-accent-primary transition-all text-text-secondary hover:text-white">
                  <i className="fa-solid fa-link"></i>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value?: string }) {
  return (
    <div className="bg-white/5 p-24 rounded-4 border border-white/10 hover:bg-white/10 transition-colors group">
      <p className="text-[10px] font-mono text-text-muted uppercase mb-8 group-hover:text-accent-light transition-colors">{label}</p>
      <p className="text-text-primary font-medium tracking-wide">{value || 'N/A'}</p>
    </div>
  );
}
