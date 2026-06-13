'use client';

import React from 'react';

import { useHistorical } from '@/context/HistoricalContext';

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
  const { viewMode, setViewMode, historicalSubMode, setHistoricalSubMode } = useHistorical();

  return (
    <div className="absolute right-16 top-1/2 -translate-y-1/2 flex flex-col gap-12 z-20">
      {/* Mode Toggle (Live vs Historical) */}
      <div className="flex flex-col bg-sys-layer-01 border border-white/10 rounded-8 overflow-hidden shadow-lg mb-8">
        <button
          onClick={() => setViewMode('live')}
          className={`px-8 py-10 text-[10px] font-bold uppercase transition-all ${
            viewMode === 'live' ? 'bg-accent-primary text-white' : 'text-text-muted hover:bg-white/5'
          }`}
        >
          Live
        </button>
        <button
          onClick={() => setViewMode('historical')}
          className={`px-8 py-10 text-[10px] font-bold uppercase transition-all ${
            viewMode === 'historical' ? 'bg-accent-primary text-white' : 'text-text-muted hover:bg-white/5'
          }`}
        >
          Hist
        </button>
      </div>

      {/* Historical Sub-mode Toggle (Only visible in historical mode) */}
      {viewMode === 'historical' && (
        <div className="flex flex-col bg-sys-layer-01 border border-white/10 rounded-8 overflow-hidden shadow-lg animate-fade-in mb-8">
          <button
            onClick={() => setHistoricalSubMode('composite')}
            className={`px-4 py-8 text-[9px] font-bold uppercase transition-all ${
              historicalSubMode === 'composite' ? 'bg-magenta-glow/40 text-white' : 'text-text-muted hover:bg-white/5'
            }`}
            title="Composite View"
          >
            Comp
          </button>
          <button
            onClick={() => setHistoricalSubMode('heatmap')}
            className={`px-4 py-8 text-[9px] font-bold uppercase transition-all ${
              historicalSubMode === 'heatmap' ? 'bg-magenta-glow/40 text-white' : 'text-text-muted hover:bg-white/5'
            }`}
            title="Heatmap View"
          >
            Heat
          </button>
        </div>
      )}

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
