'use client';

import React from 'react';
import { useHistorical } from '@/context/HistoricalContext';

export default function SidebarTabs() {
  const { viewMode, setViewMode } = useHistorical();

  return (
    <div className="flex border-b border-white/10 bg-sys-layer-01/30">
      <button
        onClick={() => setViewMode('live')}
        className={`flex-1 py-32 text-[13px] font-bold tracking-wider uppercase transition-all duration-300 relative ${
          viewMode === 'live'
            ? 'text-white'
            : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        Live Flood View
        {viewMode === 'live' && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-accent-primary shadow-[0_0_8px_rgba(15,98,254,0.6)]"></div>
        )}
      </button>
      <button
        onClick={() => setViewMode('historical')}
        className={`flex-1 py-32 text-[13px] font-bold tracking-wider uppercase transition-all duration-300 relative ${
          viewMode === 'historical'
            ? 'text-white'
            : 'text-text-muted hover:text-text-secondary'
        }`}
      >
        Historical Risk View
        {viewMode === 'historical' && (
          <div className="absolute bottom-0 left-0 w-full h-2 bg-accent-primary shadow-[0_0_8px_rgba(15,98,254,0.6)]"></div>
        )}
      </button>
    </div>
  );
}
