'use client';

import React, { useState } from 'react';
import CaseStudyCard from '@/components/case-studies/CaseStudyCard';
import { MOCK_CASE_STUDIES } from '@/lib/mock-case-studies';

const categories = [
  "All Research",
  "Infrastructure",
  "Environment",
  "Agriculture",
  "Energy",
  "Topography",
  "Logistics",
  "Urban Planning"
];

export default function CaseStudiesPage() {
  const [activeCategory, setActiveCategory] = useState("All Research");

  const filteredCaseStudies = activeCategory === "All Research"
    ? MOCK_CASE_STUDIES
    : MOCK_CASE_STUDIES.filter(cs => 
        cs.category === activeCategory || 
        (activeCategory === "Urban Planning" && cs.category === "Topography") ||
        (activeCategory === "Environment" && cs.category === "Environmental Monitoring")
      );

  return (
    <main className="min-h-screen bg-sys-bg-base text-text-primary">
      <div className="pt-32 pb-96 px-24 md:px-48 max-w-[1152px] mx-auto">
        {/* Page Header */}
        <header className="mb-64">
          <div className="inline-block px-12 py-4 bg-accent-primary/10 border border-accent-primary/20 rounded-4 text-[12px] font-mono font-medium text-accent-light mb-24 tracking-widest uppercase">
            Geospatial Intelligence
          </div>
          <h1 className="mb-24">Case Studies</h1>
          <p className="text-text-secondary max-w-[600px] text-lg leading-relaxed">
            Exploring the frontiers of geospatial intelligence. Discover how LankaGeo enables precision decision-making through high-fidelity planetary data.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap gap-12 mb-48 items-center">
          <span className="text-[11px] font-mono uppercase text-text-muted mr-8 tracking-widest">Filter by:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-16 py-8 text-xs font-mono uppercase tracking-tighter rounded-4 transition-all duration-200 border ${
                activeCategory === category
                  ? 'bg-accent-primary border-accent-primary text-white shadow-blue-glow'
                  : 'bg-white/5 border-white/10 text-text-secondary hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        {filteredCaseStudies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaseStudies.map((cs) => (
              <CaseStudyCard key={cs.id} caseStudy={cs} />
            ))}
          </div>
        ) : (
          <div className="py-96 text-center border border-dashed border-white/10 rounded-8 bg-white/5">
            <p className="text-text-muted font-mono text-sm tracking-widest mb-24">NO_RESULTS_FOUND</p>
            <button 
              onClick={() => setActiveCategory("All Research")}
              className="btn-secondary mx-auto h-40 text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-64 pt-48 border-t border-white/5 flex justify-center items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-white/5 border border-white/10 text-text-muted cursor-not-allowed">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-accent-primary text-white font-mono text-[11px]">01</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-white/5 border border-white/10 text-text-secondary font-mono text-[11px] hover:bg-white/10 transition-colors">02</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-white/5 border border-white/10 text-text-secondary font-mono text-[11px] hover:bg-white/10 transition-colors">03</button>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </main>
  );
}
