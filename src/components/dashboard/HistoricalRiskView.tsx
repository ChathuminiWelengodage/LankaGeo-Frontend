'use client';

import React from 'react';
import { useHistorical } from '@/context/HistoricalContext';
import HistoricalYearStepper from './HistoricalYearStepper';

export default function HistoricalRiskView() {
  const { currentData, selectedYear } = useHistorical();

  // Mock severity breakdown based on total zones
  const getSeverityBreakdown = (total: number) => {
    const critical = Math.floor(total * 0.3);
    const moderate = Math.floor(total * 0.5);
    const low = total - critical - moderate;
    return { critical, moderate, low };
  };

  const { critical, moderate, low } = getSeverityBreakdown(currentData.total_zones);

  return (
    <div className="flex flex-col space-y-24 p-24">
      {/* Source Chip */}
      <div className="flex">
        <div className="px-12 py-6 bg-white/5 border border-white/10 rounded-full flex items-center gap-8">
          <span className="w-8 h-8 rounded-full bg-[#14B8A6] animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]"></span>
          <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider font-bold">
            Source: Sentinel-2 Optical
          </span>
        </div>
      </div>

      {/* Year Stepper - Integrated into sidebar */}
      <div className="space-y-8">
        <span className="text-[14px] text-text-muted font-bold uppercase tracking-widest ml-4">Temporal Selection</span>
        <HistoricalYearStepper />
      </div>

      {/* Stats Card */}
      <div className="card-standard !p-16 space-y-16">
        <h4 className="text-white text-[13px] font-bold uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-12">
          <span>{selectedYear ? `${selectedYear} Metrics` : '5-Year Composite Metrics'}</span>
          <span className="text-text-muted font-mono font-normal">RES-0.5m</span>
        </h4>
        
        <div className="space-y-12">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-[12px]">Flood Frequency Index</span>
            <span className={`font-mono text-[13px] font-bold ${
              currentData.flood_frequency_index > 0.7 ? 'text-ruby-alert' : 'text-[#14B8A6]'
            }`}>
              {currentData.flood_frequency_index.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-[12px]">Impacted Area (Max)</span>
            <span className="text-white font-mono text-[13px] font-bold">{currentData.max_area_km2} km²</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-[12px]">Analysis Confidence</span>
            <span className="text-[#14B8A6] font-mono text-[13px] font-bold">98.4%</span>
          </div>
        </div>

        <div className="pt-12 mt-12 border-t border-white/5">
          <p className="text-text-muted text-[11px] leading-relaxed italic">
            &quot;{currentData.impact_summary}&quot;
          </p>
        </div>
      </div>

      {/* Flood Zones Breakdown */}
      <div className="space-y-16">
        <h4 className="text-white text-[13px] font-bold uppercase tracking-wider ml-4">Flood Risk Zones</h4>
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-ruby-alert/10 border border-ruby-alert/20 p-12 rounded-4 flex flex-col items-center gap-4 transition-all hover:bg-ruby-alert/20">
            <span className="text-ruby-alert text-[18px] font-black font-mono leading-none">{critical}</span>
            <span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter">Critical</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 p-12 rounded-4 flex flex-col items-center gap-4 transition-all hover:bg-amber-500/20">
            <span className="text-amber-500 text-[18px] font-black font-mono leading-none">{moderate}</span>
            <span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter">Moderate</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-12 rounded-4 flex flex-col items-center gap-4 transition-all hover:bg-emerald-500/20">
            <span className="text-emerald-500 text-[18px] font-black font-mono leading-none">{low}</span>
            <span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter">Seasonal</span>
          </div>
        </div>
      </div>

      {/* Status Row */}
      <div className="pt-16 border-t border-white/5 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="w-6 h-6 rounded-full bg-[#24a148]"></div>
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Baseline: Normal</span>
        </div>
        <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-wider px-8 py-2 bg-[#14B8A6]/10 rounded-4">
          Ready
        </span>
      </div>
    </div>
  );
}
