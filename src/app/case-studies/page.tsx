'use client';

import React, { useState } from 'react';
import CaseStudyCard from '@/components/case-studies/CaseStudyCard';
import { MOCK_CASE_STUDIES } from '@/lib/mock-case-studies';

const categories = [
  "All Research",
  "Urban Planning",
  "Maritime Logistics",
  "Environmental Monitoring",
  "Infrastructure",
  "Agriculture",
  "Energy",
  "Topography",
  "Logistics"
];

export default function CaseStudiesPage() {
  const [activeCategory, setActiveCategory] = useState("All Research");

  const filteredCaseStudies = activeCategory === "All Research"
    ? MOCK_CASE_STUDIES
    : MOCK_CASE_STUDIES.filter(cs => cs.category === activeCategory || (activeCategory === "Urban Planning" && cs.category === "Topography")); // Simplified mapping for demo

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto min-h-screen bg-surface-dim text-on-surface">
      {/* Page Header */}
      <header className="mb-16">
        <h1 className="text-[56px] leading-tight font-light tracking-tight mb-4">Case Studies</h1>
        <p className="text-on-surface-variant max-w-2xl text-lg font-light">
          Exploring the frontiers of geospatial intelligence. Discover how LankaGeo enables precision decision-making through high-fidelity planetary data.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-12 items-center">
        <span className="text-[11px] font-mono uppercase text-text-muted mr-2">Category:</span>
        {categories.slice(0, 5).map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-colors ${
              activeCategory === category
                ? 'bg-primary-container text-white'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCaseStudies.map((cs) => (
          <CaseStudyCard key={cs.id} caseStudy={cs} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-20 flex justify-center items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-surface-container border border-outline-variant/30 text-text-muted cursor-not-allowed">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-primary-container text-white font-mono text-[11px]">01</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-mono text-[11px] transition-colors">02</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-mono text-[11px] transition-colors">03</button>
          <span className="text-text-muted px-2">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-mono text-[11px] transition-colors">12</button>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-sm bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </main>
  );
}
