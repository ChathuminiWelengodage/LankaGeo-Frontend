'use client';

import React from 'react';
import { useHistorical } from '@/context/HistoricalContext';

export default function FFITrendChart() {
  const { yearsData, selectedYear, selectYear } = useHistorical();

  const getSeverityColor = (ffi: number) => {
    if (ffi < 0.50) return 'bg-emerald-500';
    if (ffi < 0.70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getSeverityLabel = (ffi: number) => {
    if (ffi < 0.50) return 'Low';
    if (ffi < 0.70) return 'Moderate';
    return 'High';
  };

  return (
    <div className="card-standard space-y-24">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-[16px] flex items-center gap-8">
          <span className="text-white font-bold tracking-wider">HISTORICAL ANALYSIS</span>
          <span className="text-text-muted font-light px-8 border-l border-white/10 uppercase text-[12px]">5-Year FFI Trends</span>
        </h3>
      </div>

      <div className="space-y-16">
        {yearsData.map((data) => {
          const ratio = Math.min(Math.max(data.flood_frequency_index, 0), 1);
          const colorClass = getSeverityColor(data.flood_frequency_index);
          const isSelected = selectedYear === data.year;

          return (
            <div 
              key={data.year} 
              onClick={() => selectYear(isSelected ? null : data.year)}
              className={`flex items-center gap-16 p-8 -mx-8 rounded-4 transition-all duration-300 cursor-pointer group ${
                isSelected ? 'bg-white/5 shadow-inner' : 'hover:bg-white/5'
              }`}
            >
              {/* Year Column */}
              <div className="w-48 flex-shrink-0">
                <span className={`text-[12px] font-mono font-bold tracking-wider transition-colors ${
                  isSelected ? 'text-[#14B8A6]' : 'text-text-secondary group-hover:text-white'
                }`}>
                  {data.year}
                </span>
              </div>
              
              {/* Bar Column */}
              <div className="flex-grow flex-shrink basis-0 h-8 bg-white/10 rounded-4 overflow-hidden relative border border-white/5 group-hover:border-white/10 transition-colors">
                <div 
                  className={`h-full ${colorClass} transition-all duration-1000 ease-out rounded-r-4 shadow-[0_0_12px_rgba(0,0,0,0.5)] ${
                    isSelected ? 'ring-2 ring-white/20' : ''
                  }`}
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>

              {/* Value Column */}
              <div className="w-48 text-right flex-shrink-0">
                <span className={`font-mono text-[13px] font-black transition-colors ${
                  isSelected ? 'text-white' : 'text-text-secondary group-hover:text-white'
                }`}>
                  {data.flood_frequency_index.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Threshold Legend - Compact same-row layout with valid tokens */}
      <div className="pt-24 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-24">
          <div className="flex items-center gap-8">
            <div className="w-8 h-8 rounded-4 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
            <span className="text-text-muted text-[10px] font-medium uppercase tracking-widest">Low</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-8 h-8 rounded-4 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
            <span className="text-text-muted text-[10px] font-medium uppercase tracking-widest">Mod</span>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-8 h-8 rounded-4 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
            <span className="text-text-muted text-[10px] font-medium uppercase tracking-widest">High</span>
          </div>
        </div>
        <span className="text-text-muted text-[10px] font-mono uppercase opacity-60">FFI Trend</span>
      </div>
    </div>
  );
}
