'use client';

import React from 'react';
import { useHistorical } from '@/context/HistoricalContext';

export default function HistoricalYearStepper() {
  const { selectedYear, yearsData, selectYear, isTransitioning } = useHistorical();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="relative group">
        <select
          value={selectedYear || ''}
          onChange={(e) => selectYear(e.target.value ? parseInt(e.target.value) : null)}
          disabled={isTransitioning}
          className="w-full h-11 bg-sys-layer-01/50 border border-white/10 rounded-8 px-12 text-[16px] font-mono text-white appearance-none cursor-pointer focus:outline-none focus:border-[#14B8A6]/50 transition-all hover:bg-white/5 shadow-dual flex items-center"
        >
          <option value="" className="bg-sys-layer-01 text-text-primary">5-Year Composite (Baseline)</option>
          {yearsData.map((data) => (
            <option key={data.year} value={data.year} className="bg-sys-layer-01 text-text-primary">
              Analysis Year: {data.year}
            </option>
          ))}
        </select>
        
        {/* Custom Arrow Icon */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted group-hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[18px]">unfold_more</span>
        </div>
      </div>

      {/* Floating Status Label */}
      <div className="flex items-center gap-6 px-4">
        <div className={`w-6 h-6 rounded-full ${selectedYear ? 'bg-[#14B8A6]' : 'bg-blue-400'} animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.4)]`}></div>
        <span className="text-[10px] font-mono text-text-muted tracking-wide uppercase">
          {selectedYear 
            ? `Active SAR Stream: ${selectedYear}`
            : 'Multi-Temporal Composite Active'}
        </span>
      </div>
    </div>
  );
}
