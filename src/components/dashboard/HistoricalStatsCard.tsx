'use client';

import React from 'react';
import { useHistorical } from '@/context/HistoricalContext';

export default function HistoricalStatsCard() {
  const { currentData, selectedYear } = useHistorical();

  const getFFIColor = (ffi: number) => {
    if (ffi < 0.50) return 'bg-emerald-500'; 
    if (ffi < 0.70) return 'bg-amber-500'; 
    return 'bg-ruby-alert'; 
  };

  const getFFITextColor = (ffi: number) => {
    if (ffi < 0.50) return 'text-emerald-500';
    if (ffi < 0.70) return 'text-amber-500';
    return 'text-ruby-alert';
  };

  const ffi = currentData?.flood_frequency_index ?? 0;
  const pixelsFlooded = currentData?.pixels_flooded ?? 0;
  const maxArea = currentData?.max_area_km2 ?? 0;
  const peakMonth = currentData?.peak_flood_month ?? 'May';

  return (
    <div className="card-standard !p-16 space-y-16">
      <h4 className="text-white text-[13px] font-bold uppercase tracking-wider flex items-center justify-between border-b border-white/5 pb-12">
        <span className="text-[#14B8A6]">
          {selectedYear ? `${selectedYear} Metrics` : '5-Year Composite Metrics'}
        </span>
        <span className="text-text-muted font-mono font-normal">RES-0.5m</span>
      </h4>
      
      <div className="space-y-16">
        {/* Flood Frequency Index */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-[12px]">Flood Frequency Index</span>
            <span className={`font-mono text-[14px] font-bold ${getFFITextColor(ffi)}`}>
              {ffi.toFixed(2)}
            </span>
          </div>
          {/* Dynamic Color Bar */}
          <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getFFIColor(ffi)}`}
              style={{ width: `${Math.min(Math.max(ffi, 0), 1) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Other Stats */}
        <div className="grid grid-cols-1 gap-12">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-[12px]">Pixels Flooded</span>
            <span className="text-white font-mono text-[13px] font-bold">
              {pixelsFlooded.toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-[12px]">Affected Area</span>
            <span className="text-white font-mono text-[13px] font-bold">
              {maxArea.toFixed(2)} km²
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-[12px]">Peak Flood Month</span>
            <span className="text-white font-mono text-[13px] font-bold">
              {peakMonth}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-text-secondary text-[12px]">Analysis Type</span>
            <span className="text-[#14B8A6] font-mono text-[13px] font-bold uppercase tracking-tighter">
              Historical Trend
            </span>
          </div>
        </div>
      </div>

      <div className="pt-12 mt-12 border-t border-white/5">
        <p className="text-text-muted text-[11px] leading-relaxed italic">
          &quot;{currentData.impact_summary}&quot;
        </p>
      </div>
    </div>
  );
}
