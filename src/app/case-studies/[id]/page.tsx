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
      <div className="min-h-screen flex items-center justify-center bg-surface-dim text-on-surface">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Case Study Not Found</h2>
          <Link href="/case-studies" className="btn-primary">Back to Case Studies</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto min-h-screen bg-surface-dim text-on-surface">
      <Link 
        href="/case-studies" 
        className="flex items-center gap-2 text-accent-light hover:text-white transition-colors mb-8 group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-xs font-mono uppercase tracking-widest">Back to All Research</span>
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-accent-primary/10 border border-accent-primary/20 rounded-sm text-[10px] font-mono font-medium text-accent-light uppercase tracking-widest">
            {caseStudy.category}
          </span>
          <span className="text-text-muted text-[10px] font-mono uppercase tracking-widest">
            {caseStudy.date}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-light leading-tight mb-6">
          {caseStudy.title}
        </h1>
        <div className="flex items-center gap-2 text-on-surface-variant italic">
          <span className="material-symbols-outlined text-sm">location_on</span>
          <span className="text-sm">{caseStudy.location}</span>
        </div>
      </header>

      <div className="aspect-[21/9] w-full overflow-hidden rounded-lg mb-12 border border-outline-variant/30">
        <img 
          src={caseStudy.image_url} 
          alt={caseStudy.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-12">
        <section className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-light mb-6 border-b border-outline-variant/30 pb-2 text-accent-light">Overview</h2>
          <p className="text-on-surface-variant leading-relaxed text-lg mb-8">
            {caseStudy.content}
          </p>

          <h2 className="text-2xl font-light mb-6 border-b border-outline-variant/30 pb-2 text-accent-light">Flood Analysis Insights</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-container p-4 rounded-sm border border-outline-variant/20">
              <p className="text-[10px] font-mono text-text-muted uppercase mb-1">Max Rainfall</p>
              <p className="text-on-surface font-medium">{caseStudy.analysis.rainfall || 'N/A'}</p>
            </div>
            <div className="bg-surface-container p-4 rounded-sm border border-outline-variant/20">
              <p className="text-[10px] font-mono text-text-muted uppercase mb-1">Impact Level</p>
              <p className="text-on-surface font-medium">{caseStudy.analysis.impact || 'N/A'}</p>
            </div>
            <div className="bg-surface-container p-4 rounded-sm border border-outline-variant/20">
              <p className="text-[10px] font-mono text-text-muted uppercase mb-1">Event Duration</p>
              <p className="text-on-surface font-medium">{caseStudy.analysis.duration || 'N/A'}</p>
            </div>
            <div className="bg-surface-container p-4 rounded-sm border border-outline-variant/20">
              <p className="text-[10px] font-mono text-text-muted uppercase mb-1">Affected Area</p>
              <p className="text-on-surface font-medium">{caseStudy.analysis.affectedArea || 'N/A'}</p>
            </div>
          </div>
        </section>

        <aside className="space-y-8">
          <div className="bg-surface-container-high p-6 rounded-lg border border-accent-primary/20 shadow-dual">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest mb-6 text-accent-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">query_stats</span>
              Key Statistics
            </h3>
            <div className="space-y-6">
              {caseStudy.stats?.map((stat, idx) => (
                <div key={idx} className="border-b border-outline-variant/30 pb-4 last:border-0 last:pb-0">
                  <p className="text-[10px] font-mono text-text-muted uppercase mb-1">{stat.label}</p>
                  <p className="text-2xl font-light text-on-surface">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-accent-primary/5 border border-accent-primary/10 rounded-lg">
            <h3 className="text-xs font-bold mb-4 uppercase tracking-widest text-accent-light">Share Research</h3>
            <div className="flex gap-4">
              <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-container hover:bg-accent-primary transition-all text-on-surface-variant hover:text-white">
                <i className="fa-brands fa-x-twitter"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-container hover:bg-accent-primary transition-all text-on-surface-variant hover:text-white">
                <i className="fa-brands fa-linkedin-in"></i>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-container hover:bg-accent-primary transition-all text-on-surface-variant hover:text-white">
                <i className="fa-solid fa-link"></i>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
