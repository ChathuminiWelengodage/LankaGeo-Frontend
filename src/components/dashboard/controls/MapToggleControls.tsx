'use client';

import React from 'react';

interface MapToggleControlsProps {
  heatmapActive: boolean;
  onHeatmapToggle: () => void;
  boundariesActive: boolean;
  onBoundariesToggle: () => void;
  baseMapType: 'hybrid' | 'terrain';
  onBaseMapToggle: () => void;
}

export default function MapToggleControls({
  heatmapActive,
  onHeatmapToggle,
  boundariesActive,
  onBoundariesToggle,
  baseMapType,
  onBaseMapToggle
}: MapToggleControlsProps) {
  return (
    <div className="absolute right-16 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-20">
      {/* Heatmap Toggle */}
      <button
        onClick={onHeatmapToggle}
        className={`w-48 h-48 rounded-8 flex items-center justify-center transition-all duration-300 shadow-lg border ${
          heatmapActive 
            ? 'bg-accent-primary border-accent-primary text-white' 
            : 'bg-sys-layer-01 border-white/10 text-text-muted hover:text-white hover:border-white/20'
        }`}
        title="Toggle Heatmap"
      >
        <span className="material-symbols-outlined text-[20px]">
          {heatmapActive ? 'layers' : 'layers_clear'}
        </span>
      </button>

      {/* Boundaries Toggle */}
      <button
        onClick={onBoundariesToggle}
        className={`w-48 h-48 rounded-8 flex items-center justify-center transition-all duration-300 shadow-lg border ${
          boundariesActive 
            ? 'bg-accent-primary border-accent-primary text-white' 
            : 'bg-sys-layer-01 border-white/10 text-text-muted hover:text-white hover:border-white/20'
        }`}
        title="Toggle Boundaries"
      >
        <span className="material-symbols-outlined text-[20px]">
          {boundariesActive ? 'grid_on' : 'grid_off'}
        </span>
      </button>

      {/* Base Map Toggle */}
      <button
        onClick={onBaseMapToggle}
        className={`w-48 h-48 rounded-8 flex items-center justify-center transition-all duration-300 shadow-lg border bg-sys-layer-01 border-white/10 text-text-muted hover:text-white hover:border-white/20 overflow-hidden relative group`}
        title={`Switch to ${baseMapType === 'hybrid' ? 'Terrain' : 'Hybrid'} Map`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">
            {baseMapType === 'hybrid' ? 'satellite' : 'terrain'}
          </span>
          <span className="text-[8px] font-bold uppercase tracking-tighter">
            {baseMapType === 'hybrid' ? 'Hybr' : 'Terr'}
          </span>
        </div>
        
        {/* Active indicator */}
        <div className="absolute inset-0 bg-accent-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>
    </div>
  );
}
