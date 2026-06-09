'use client';

import React from 'react';

interface LiveFloodViewProps {
  isLoading: boolean;
  startAnalysis: () => void;
  coordinates: { lat: number; lng: number } | null;
  error: string | null;
}

export default function LiveFloodView({ 
  isLoading, 
  startAnalysis, 
  coordinates, 
  error
}: LiveFloodViewProps) {
  return (
    <div className="h-full p-24 flex flex-col gap-24">
      {/* Target Location Card - High visibility context */}
      <div className="card-standard !p-16 border-accent-primary/20 bg-accent-primary/5">
        <div className="flex items-center gap-12 mb-12">
          <div className="w-32 h-32 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-accent-primary text-[18px]">location_on</span>
          </div>
          <h4 className="text-white text-[14px] font-bold uppercase tracking-wider">Target Monitor</h4>
        </div>
        
        {coordinates ? (
          <div className="flex justify-between items-end">
            <div>
              <p className="text-text-muted text-[10px] uppercase font-bold tracking-tighter">Coordinates</p>
              <p className="text-white font-mono text-[14px] mt-2">
                {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-muted text-[10px] uppercase font-bold tracking-tighter">Status</p>
              <p className="text-accent-primary text-[12px] font-bold flex items-center gap-4 mt-2">
                <span className="w-6 h-6 rounded-full bg-accent-primary animate-pulse"></span>
                Ready
              </p>
            </div>
          </div>
        ) : (
          <p className="text-text-muted text-[12px] italic">No location selected for analysis.</p>
        )}
      </div>

      {/* Analysis Parameters Card - Fills remaining space */}
      <div className="card-standard flex-grow flex flex-col justify-between !hover:translate-y-0 relative overflow-hidden">
        {/* Subtle background decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-20">
            <h3 className="text-white text-[16px] font-bold tracking-tight">
              Satellite Specs
            </h3>
            <span className="text-text-muted text-[10px] font-mono opacity-50">v4.2.1-Live</span>
          </div>
          
          <div className="space-y-12">
            {[
              { label: 'Satellite Path', value: 'DES-9284', icon: 'route' },
              { label: 'Orbit Type', value: 'Sun-Sync', icon: 'public' },
              { label: 'Resolution', value: '0.5m GSD', icon: 'grid_view' },
              { label: 'Sensor Mode', value: 'SAR-IW', icon: 'sensors' },
              { label: 'Last Pass', value: '42m ago', icon: 'update' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-8 border-b border-white/5 last:border-none">
                <div className="flex items-center gap-10">
                  <span className="material-symbols-outlined text-text-muted text-[16px]">{item.icon}</span>
                  <span className="text-text-secondary text-[12px]">{item.label}</span>
                </div>
                <span className="text-white font-mono text-[12px]">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-24 p-12 bg-white/5 rounded-6 border border-white/5 border-dashed">
            <p className="text-text-muted text-[11px] leading-relaxed text-center italic">
              SAR pipeline provides all-weather monitoring capabilities.
            </p>
          </div>
        </div>
        
        <div className="mt-auto pt-24 relative z-10">
          <button 
            onClick={startAnalysis}
            disabled={!coordinates || isLoading || error === 'offline'}
            className="btn-primary w-full h-48 rounded-8 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden transition-all duration-300 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <div className="flex items-center justify-center gap-10">
              <span className={`material-symbols-outlined text-[20px] ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>
                {isLoading ? 'progress_activity' : 'satellite_alt'}
              </span>
              <span className="font-bold tracking-wider uppercase text-[13px]">
                {isLoading ? 'Running Analysis...' : 'Refresh Live Analysis'}
              </span>
            </div>
          </button>
          
          <div className="flex items-center justify-center gap-8 mt-12 opacity-50">
            <span className="text-[9px] text-text-muted font-bold uppercase tracking-widest italic">
              Secured by Google Earth Engine
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

