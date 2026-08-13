'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';

interface LiveFloodViewProps {
  isLoading: boolean;
  startAnalysis: () => void;
  coordinates: { lat: number; lng: number } | null;
  locationName?: string;
  error: string | null;
  selectedYear: number | null;
  currentData: unknown;
  liveAnalysisResult?: Record<string, unknown> | null;
}

export default function LiveFloodView({ 
  isLoading, 
  startAnalysis, 
  coordinates, 
  locationName,
  error,
  selectedYear
}: LiveFloodViewProps) {
  const { user, authModal, refreshProfile } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

// Dynamic Location Name derived from Map Search or formatted Coordinates
  const activeLocation = locationName || (coordinates ? `${coordinates.lat.toFixed(4)}°N, ${coordinates.lng.toFixed(4)}°E` : '');  

  const handleSetAlertZone = async () => {
    if (!coordinates) return;

    if (!user) {
      authModal.open('signup', {
        name: locationName || `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
        lat: coordinates.lat,
        lng: coordinates.lng
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          location_name: activeLocation,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSyncStatus('success');
      await refreshProfile();
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) {
      console.error('Error syncing alert zone:', err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="h-full p-4 grid grid-rows-[auto_1fr_1.3fr] gap-3.5 overflow-hidden">
      
      {/* 1. ACTION BUTTONS */}
      <div className="flex flex-col gap-2 shrink-0">
        <button 
          onClick={startAnalysis}
          disabled={!coordinates || isLoading || error === 'offline'}
          className="btn-primary w-full h-10 rounded-6 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden transition-all duration-300 active:scale-[0.99] shadow-sm flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="flex items-center justify-center gap-2">
            <span className={`material-symbols-outlined text-[16px] ${isLoading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform duration-500'}`}>
              {isLoading ? 'progress_activity' : 'satellite_alt'}
            </span>
            <span className="font-bold tracking-wider uppercase text-[11px]">
              {isLoading ? 'Processing...' : 'Refresh Analysis'}
            </span>
          </div>
        </button>

        <button 
          onClick={handleSetAlertZone}
          disabled={!coordinates || isSyncing}
          className="btn-secondary w-full h-10 rounded-6 disabled:opacity-50 group relative overflow-hidden transition-all duration-300 active:scale-[0.99] border-accent-primary/30 hover:bg-accent-primary/5 flex items-center justify-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : 'text-accent-primary'}`}>
              {isSyncing ? 'progress_activity' : syncStatus === 'success' ? 'check_circle' : 'notifications_active'}
            </span>
            <span className={`font-bold tracking-wider uppercase text-[11px] ${syncStatus === 'success' ? 'text-emerald-400' : syncStatus === 'error' ? 'text-ruby-alert' : ''}`}>
              {isSyncing ? 'Syncing...' : syncStatus === 'success' ? 'Zone Secured' : syncStatus === 'error' ? 'Sync Failed' : 'Set as Alert Zone'}
            </span>
          </div>
        </button>
      </div>

      {/* 2. TARGET MONITOR CARD  */}
      <div className="card-standard p-4 border-accent-primary/30 bg-accent-primary/10 shadow-blue-glow rounded-8 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-accent-primary/20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent-primary/30 flex items-center justify-center border border-accent-primary/30">
              <span className="material-symbols-outlined text-accent-light text-[16px]">location_on</span>
            </div>
            <h4 className="text-white text-[12px] font-bold uppercase tracking-wider">Target Monitor</h4>
          </div>
          
        </div>
        
        {coordinates ? (
          <div className="grid grid-cols-2 grid-rows-2 gap-2.5 my-3 flex-1">
            {/* Full Width Location Name Hero Tile */}
            <div className="col-span-2 bg-black/20 p-3.5 rounded-6 border border-white/5 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-accent-light text-[18px]">pin_drop</span>
                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider">Selected Location</span>
              </div>
              <span className="text-white text-[15px] font-bold truncate block">
                {activeLocation}
              </span>
            </div>

            {/* Latitude Tile */}
            <div className="bg-black/20 p-3.5 rounded-6 border border-white/5 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-accent-light text-[16px]">north</span>
                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider">Latitude</span>
              </div>
              <span className="text-white font-mono text-[15px] font-bold block">{coordinates.lat.toFixed(4)}°N</span>
            </div>

            {/* Longitude Tile */}
            <div className="bg-black/20 p-3.5 rounded-6 border border-white/5 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-accent-light text-[16px]">east</span>
                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider">Longitude</span>
              </div>
              <span className="text-white font-mono text-[15px] font-bold block">{coordinates.lng.toFixed(4)}°E</span>
            </div>
          </div> 
        ) : (
          <p className="text-text-muted text-[11px] italic my-auto text-center">No location selected.</p>
        )}

        <div className="pt-2 border-t border-accent-primary/20 flex items-center justify-between text-[9px] text-text-muted font-mono">
          {selectedYear && <span className="text-accent-light font-bold">YEAR: {selectedYear}</span>}
        </div>
      </div>

      {/* 3. SATELLITE SPECIFICATIONS CARD  */}
      <div className="bg-sys-layer-01 border border-white/5 rounded-8 p-4 shadow-dual flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-light text-[16px]">satellite_alt</span>
            <h3 className="text-white text-[12px] font-bold tracking-wider uppercase">
              Satellite Specifications
            </h3>
          </div>
        </div>
        
        {/* Grid expands vertically (flex-1 & grid-rows-2) to fill all available space */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 my-3 flex-1">
          {[
              { label: 'Path', value: 'DES-9284', icon: 'route' },
              { label: 'Orbit', value: 'Sun-Sync', icon: 'public' },
              { label: 'Resolution', value: '0.5m GSD', icon: 'grid_view' },
              { label: 'Sensor Mode', value: 'SAR-IW', icon: 'sensors' },

          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-black/20 p-3.5 rounded-6 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-center"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-accent-light text-[16px]">{item.icon}</span>
                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
              </div>
              <span className="text-white font-mono text-[14px] font-bold truncate block">
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[9px] text-text-muted font-mono">
          <span className="uppercase opacity-60">Secured by Google Earth Engine</span>
          <span className="flex items-center gap-1 text-accent-light font-medium">
            </span>
        </div>
      </div>

    </div>
  );
}