'use client';

import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';

interface LiveFloodViewProps {
  isLoading: boolean;
  startAnalysis: () => void;
  coordinates: { lat: number; lng: number } | null;
  locationName: string;
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
  error
}: LiveFloodViewProps) {
  const { user, authModal, refreshProfile } = useUser();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSetAlertZone = async () => {
    if (!coordinates) return;

    if (!user) {
      // Guest user: Open signup with pre-filled location
      authModal.open('signup', {
        name: locationName || `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
        lat: coordinates.lat,
        lng: coordinates.lng
      });
      return;
    }

    // Logged in user: Sync to profile
    setIsSyncing(true);
    setSyncStatus('idle');

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          location_name: locationName || `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
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
    <div className="h-full p-16 flex flex-col gap-16">
      {/* Action Buttons - Standardized slim style */}
      <div className="relative z-10 flex flex-col gap-8">
        <button 
          onClick={startAnalysis}
          disabled={!coordinates || isLoading || error === 'offline'}
          className="btn-primary w-full h-32 rounded-4 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden transition-all duration-300 active:scale-[0.99] shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          <div className="flex items-center justify-center gap-8">
            <span className={`material-symbols-outlined text-[15px] ${isLoading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform duration-500'}`}>
              {isLoading ? 'progress_activity' : 'satellite_alt'}
            </span>
            <span className="font-bold tracking-widest uppercase text-[10px]">
              {isLoading ? 'Processing...' : 'Refresh'}
            </span>
          </div>
        </button>

        <button 
          onClick={handleSetAlertZone}
          disabled={!coordinates || isSyncing}
          className="btn-secondary w-full h-32 rounded-4 disabled:opacity-50 group relative overflow-hidden transition-all duration-300 active:scale-[0.99] border-accent-primary/30 hover:bg-accent-primary/5"
        >
          <div className="flex items-center justify-center gap-8">
            <span className={`material-symbols-outlined text-[15px] ${isSyncing ? 'animate-spin' : 'text-accent-primary'}`}>
              {isSyncing ? 'progress_activity' : syncStatus === 'success' ? 'check_circle' : 'notifications_active'}
            </span>
            <span className={`font-bold tracking-widest uppercase text-[10px] ${syncStatus === 'success' ? 'text-emerald-400' : syncStatus === 'error' ? 'text-ruby-alert' : ''}`}>
              {isSyncing ? 'Syncing...' : syncStatus === 'success' ? 'Zone Secured' : syncStatus === 'error' ? 'Sync Failed' : 'Set as Alert Zone'}
            </span>
          </div>
        </button>
      </div>

      {/* Target Location Card - Enhanced blue tint for better grouping */}
      <div className="card-standard !p-12 border-accent-primary/30 bg-accent-primary/10 shadow-blue-glow">
        <div className="flex items-center gap-10 mb-8">
          <div className="w-28 h-28 rounded-full bg-accent-primary/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-accent-light text-[16px]">location_on</span>
          </div>
          <h4 className="text-white text-[12px] font-bold uppercase tracking-wider">Target Monitor</h4>
        </div>
        
        {coordinates ? (
          <div className="flex justify-between items-end">
            <div>
              <p className="text-text-muted text-[9px] uppercase font-bold tracking-tighter">Coordinates</p>
              <p className="text-white font-mono text-[13px] mt-1">
                {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-muted text-[9px] uppercase font-bold tracking-tighter">Status</p>
              <p className="text-accent-light text-[11px] font-bold flex items-center gap-4 mt-1">
                <span className="w-5 h-5 rounded-full bg-accent-primary animate-pulse shadow-[0_0_8px_rgba(15,98,254,0.6)]"></span>
                Ready
              </p>
            </div>
          </div>
        ) : (
          <p className="text-text-muted text-[11px] italic">No location selected.</p>
        )}
      </div>

      {/* Satellite Specs Card - Optimized Tile Sizes */}
      <div className="card-standard flex-grow flex flex-col justify-between !hover:translate-y-0 relative overflow-hidden group/card !p-16">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-primary/15 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none group-hover/card:bg-accent-primary/25 transition-colors duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-8">
              <h3 className="text-white text-[14px] font-bold tracking-tight uppercase">
                Satellite Specs
              </h3>
              <div className="flex items-center gap-4 px-6 py-2 bg-accent-primary/30 rounded-full">
                <span className="w-4 h-4 rounded-full bg-accent-primary animate-pulse"></span>
                <span className="text-[9px] text-accent-light font-bold uppercase tracking-widest">Live</span>
              </div>
            </div>
            <span className="text-text-muted text-[9px] font-mono opacity-50">v4.2.1</span>
          </div>
          
          {/* Data Grid - Larger, clearer tiles in 2x2 with subtle blue fill */}
          <div className="grid grid-cols-2 gap-10">
            {[
              { label: 'Path', value: 'DES-9284', icon: 'route' },
              { label: 'Orbit', value: 'Sun-Sync', icon: 'public' },
              { label: 'Resolution', value: '0.5m GSD', icon: 'grid_view' },
              { label: 'Sensor Mode', value: 'SAR-IW', icon: 'sensors' },
            ].map((item, idx) => (
              <div key={idx} className="bg-accent-primary/5 p-10 rounded-8 border border-white/5 hover:border-accent-primary/40 hover:bg-accent-primary/10 transition-all duration-300 group/tile">
                <div className="flex items-center gap-6 mb-4">
                  <span className="material-symbols-outlined text-accent-light text-[14px]">{item.icon}</span>
                  <span className="text-text-muted text-[9px] uppercase font-bold tracking-wider">{item.label}</span>
                </div>
                <span className="text-white font-mono text-[12px] block font-bold truncate group-hover/tile:text-accent-light transition-colors">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Featured Spec: Last Pass */}
          <div className="mt-12 bg-accent-primary/10 p-10 rounded-8 border border-accent-primary/20 flex justify-between items-center group-hover/card:border-accent-primary/40 transition-colors">
             <div className="flex items-center gap-6">
               <span className="material-symbols-outlined text-accent-light text-[16px] animate-pulse">update</span>
               <span className="text-text-secondary text-[11px] font-medium">Last Pass</span>
             </div>
             <span className="text-white font-mono text-[11px] font-bold bg-accent-primary/30 px-6 py-1 rounded-4 shadow-sm">42m ago</span>
          </div>

          <div className="mt-16 p-10 bg-white/5 rounded-6 border border-white/5 border-dashed relative overflow-hidden">
            <p className="text-text-muted text-[10px] leading-relaxed text-center italic relative z-10">
              SAR pipeline provides all-weather monitoring capabilities.
            </p>
          </div>
        </div>
        
        <div className="mt-auto pt-16 relative z-10">
          <div className="flex items-center justify-center gap-6 opacity-40">
            <span className="text-[8px] text-text-muted font-bold uppercase tracking-widest italic">
              Secured by Google Earth Engine
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
