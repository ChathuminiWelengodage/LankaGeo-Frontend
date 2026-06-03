'use client';

import React from 'react';

/**
 * MapLegend Component
 * 
 * An improved, user-friendly floating legend card that provides 
 * visual context for map layers, optimized for professional use.
 */
export default function MapLegend() {
  return (
    <div className="m-8 w-[160px] bg-sys-layer-01/95 backdrop-blur-md border-[0.5px] border-white/10 rounded-4 p-8 shadow-md animate-fade-in">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-primary mb-8 flex items-center justify-between">
        Legend
        <span className="w-4 h-4 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
        </span>
      </h4>

      <ul className="space-y-8 mb-12">
        <LegendItem color="#dc3545" label="Critical Risk" />
        <LegendItem color="#ffc107" label="Moderate Risk" />
        <LegendItem color="#4a90e2" label="Seasonal" />
        <LegendItem color="#495057" label="Station" />

        <li className="flex items-center gap-8 group">
          <div className="w-16 h-1 border-t-2 border-dashed border-[#008080]"></div>
          <span className="text-[10px] text-text-secondary font-medium tracking-tight">
            Boundary
          </span>
        </li>
      </ul>

      <div className="pt-8 border-t border-white/10">
        <div className="flex justify-between items-center text-[8px] font-medium text-text-muted mb-2">
          <span>Low</span>
          <span>High</span>
        </div>
        <div className="h-4 w-full rounded-1 bg-gradient-to-r from-[#14B8A6]/20 via-[#14B8A6]/60 to-[#14B8A6]"></div>
      </div>
    </div>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <li className="flex items-center gap-8 group cursor-default">
      <div
        style={{ backgroundColor: color }}
        className="w-8 h-8 rounded-2 shadow-sm"
      ></div>
      <span className="text-[10px] text-text-secondary font-medium tracking-tight group-hover:text-text-primary transition-colors">
        {label}
      </span>
    </li>
  );
}
