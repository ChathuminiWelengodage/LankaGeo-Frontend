'use client';

import React from 'react';
import FFITrendChart from './FFITrendChart';

interface LiveFloodViewProps {
  isLoading: boolean;
  startAnalysis: () => void;
  coordinates: { lat: number; lng: number } | null;
  error: string | null;
  selectedYear: number | null;
  currentData: any;
}

export default function LiveFloodView({ 
  isLoading, 
  startAnalysis, 
  coordinates, 
  error,
  selectedYear,
  currentData
}: LiveFloodViewProps) {
  return (
    <div className="flex flex-col space-y-24 p-24">
      <div className="card-standard min-h-[300px] flex flex-col justify-between !hover:translate-y-0">
        <div>
          <h3 className="text-white text-[18px] mb-16 font-bold tracking-tight">
            {selectedYear ? `Historical Runoff: ${selectedYear}` : 'Analysis Parameters'}
          </h3>
          
          {selectedYear ? (
            <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center py-8 border-b border-white/5">
                <span className="text-text-secondary text-[13px]">Monitored Areas</span>
                <span className="text-white font-mono text-[13px]">{currentData.total_zones} Zone Nodes</span>
              </div>
              <div className="flex justify-between items-center py-8 border-b border-white/5">
                <span className="text-text-secondary text-[13px]">Flood Frequency Index</span>
                <span className={`font-mono text-[13px] px-8 py-2 rounded-4 ${
                  currentData.flood_frequency_index > 0.7 ? 'bg-ruby-alert/20 text-ruby-alert' : 'bg-[#14B8A6]/20 text-[#14B8A6]'
                }`}>
                  {currentData.flood_frequency_index.toFixed(2)} / 1.00
                </span>
              </div>
              <div className="flex justify-between items-center py-8 border-b border-white/5">
                <span className="text-text-secondary text-[13px]">Est. Max Area</span>
                <span className="text-white font-mono text-[13px]">{currentData.max_area_km2} km²</span>
              </div>
              <p className="text-text-muted text-[12px] leading-relaxed mt-16 italic">
                &quot;{currentData.impact_summary}&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              <div className="flex justify-between items-center py-8 border-b border-white/5">
                <span className="text-text-secondary text-[13px]">Satellite Path</span>
                <span className="text-white font-mono text-[13px]">DES-9284</span>
              </div>
              <div className="flex justify-between items-center py-8 border-b border-white/5">
                <span className="text-text-secondary text-[13px]">Orbit Type</span>
                <span className="text-white font-mono text-[13px]">Sun-Sync</span>
              </div>
              <div className="flex justify-between items-center py-8 border-b border-white/5">
                <span className="text-text-secondary text-[13px]">Resolution</span>
                <span className="text-white font-mono text-[13px]">0.5m GSD</span>
              </div>
            </div>
          )}
        </div>
        
        <button 
          onClick={startAnalysis}
          disabled={!coordinates || isLoading || !!selectedYear || error === 'offline'}
          className="btn-primary w-full mt-24 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span className={`material-symbols-outlined mr-8 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`}>
            {isLoading ? 'progress_activity' : 'sync'}
          </span>
          {isLoading ? 'Processing SAR Data...' : 'Start Live Analysis'}
        </button>
      </div>

      <FFITrendChart />

      <div className="card-standard !p-12">
        <h3 className="text-white text-[16px] mb-8">Macro Metric Coverage</h3>
        <div className="space-y-6">
          <div className="p-8 bg-[#14B8A6]/10 border-l-2 border-[#14B8A6] rounded-r-4">
            <p className="text-[#14B8A6] text-[12px] font-semibold">5-Year Resilience Composite</p>
            <p className="text-text-muted text-[10px] mt-2">Average FFI: 0.64</p>
          </div>
          <div className="p-8 bg-white/5 border-l-2 border-text-muted rounded-r-4">
            <p className="text-text-secondary text-[12px]">System Health: Optimal</p>
            <p className="text-text-muted text-[10px] mt-2">Last verify: Today, 08:30 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
