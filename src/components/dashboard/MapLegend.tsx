'use client';

import React from 'react';

/**
 * MapLegend Component
 * 
 * A floating legend card that provides visual context for the map layers.
 * Positioned at the bottom-left of the map container.
 */
export default function MapLegend() {
  return (
    <div className="m-8 w-[160px] bg-sys-layer-01/95 backdrop-blur-sm border border-white/10 rounded-4 p-8 shadow-floating animate-fade-in">
      <h4 className="text-[8px] font-mono font-bold uppercase tracking-[0.1em] text-text-muted mb-6 border-b border-white/5 pb-2 flex items-center justify-between">
        <span>Legend</span>
        <span className="w-4 h-4 rounded-full bg-accent-primary animate-pulse"></span>
      </h4>

      <ul className="space-y-4 mb-10">
        <LegendItem color="#dc3545" label="Critical" />
        <LegendItem color="#ffc107" label="Moderate" />
        <LegendItem color="#4a90e2" label="Seasonal" />
        <LegendItem color="#495057" label="Hydrological Station" />
        
        <li className="flex items-center gap-6 group">
          <div className="w-14 flex items-center justify-center">
             <div className="w-full border-t border-dashed border-[#008080]"></div>
          </div>
          <span className="text-[10px] text-text-secondary font-medium tracking-tight group-hover:text-white transition-colors">
            Boundary
          </span>
        </li>
      </ul>

      <div className="space-y-3 pt-6 border-t border-white/5">
        <div className="flex justify-between items-center text-[7px] font-mono uppercase tracking-tighter text-text-muted">
          <span>low freq</span>
          <span>high freq</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gradient-to-r from-[#14B8A6]/10 via-[#14B8A6]/50 to-[#14B8A6]"></div>
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
    <li className="flex items-center gap-6 group cursor-default">
      <div 
        style={{ backgroundColor: color }}
        className="w-6 h-6 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.3)] group-hover:scale-125 transition-transform duration-300"
      ></div>
      <span className="text-[10px] text-text-secondary font-medium tracking-tight group-hover:text-white transition-colors">
        {label}
      </span>
    </li>
  );
}
