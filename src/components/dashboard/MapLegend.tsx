'use client';

import React from 'react';
import { useHistorical } from '@/context/HistoricalContext';
import { SEVERITY_COLORS } from '@/lib/map-styles';

/**
 * MapLegend Component
 * 
 * A dynamic floating legend card that provides visual context 
 * based on the active map layer (Live vs Historical).
 */
export default function MapLegend() {
  const { viewMode, historicalSubMode } = useHistorical();

  const isLive = viewMode === 'live';

  return (
    <div className="m-8 w-[180px] bg-sys-layer-01/95 backdrop-blur-md border-[0.5px] border-white/10 rounded-4 p-8 shadow-md animate-fade-in">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-primary mb-8 flex items-center justify-between">
        {isLive ? 'Live Flood Legend' : `Historical ${historicalSubMode === 'heatmap' ? 'Heatmap' : 'Composite'}`}
        <span className="w-4 h-4 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse"></span>
        </span>
      </h4>

      {isLive ? (
        <ul className="space-y-8 mb-12">
          <LegendItem color={SEVERITY_COLORS[3]} label="Critical (Red)" />
          <LegendItem color={SEVERITY_COLORS[2]} label="Moderate (Amber)" />
          <LegendItem color={SEVERITY_COLORS[1]} label="Low (Seasonal/Blue)" />
          <LegendItem color="#495057" label="Gauge Station" />
        </ul>
      ) : (
        <ul className="space-y-8 mb-12">
          <LegendItem color="#FF0000" label="High Frequency" />
          <LegendItem color="#FFA500" label="Moderate" />
          <LegendItem color="#0000FF" label="Low / Rare" />
          <div className="pt-4 mt-4 border-t border-white/5">
             <p className="text-[8px] text-text-muted italic">Cumulative 5-Year Data</p>
          </div>
        </ul>
      )}

      <div className="pt-8 border-t border-white/10">
        <div className="flex justify-between items-center text-[8px] font-medium text-text-muted mb-2">
          <span>{isLive ? '0%' : 'Low'}</span>
          <span>{isLive ? '100%' : 'High'}</span>
        </div>
        <div className={`h-4 w-full rounded-1 bg-gradient-to-r ${isLive ? 'from-[#0000FF]/20 via-[#FFA500]/60 to-[#FF0000]' : 'from-[#0000FF]/20 via-[#FFA500]/60 to-[#FF0000]'}`}></div>
        <p className="text-[7px] text-text-muted mt-4 text-center uppercase tracking-tighter">Confidence / Intensity</p>
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
