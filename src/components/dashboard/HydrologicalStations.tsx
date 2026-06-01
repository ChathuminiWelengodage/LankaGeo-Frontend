'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { GAUGE_STATIONS, LiveGaugeData, GaugeStation, GaugeStatus } from '@/lib/mock-flood-data';
import { fetchLiveGauges } from '@/lib/api';

/**
 * HydrologicalStations component renders fixed monitoring nodes on the map.
 * It handles marker interactions, loading states, and telemetry display.
 */
export default function HydrologicalStations() {
  const map = useMap();
  const [selectedStation, setSelectedStation] = useState<GaugeStation | null>(null);
  const [gaugeData, setGaugeData] = useState<LiveGaugeData | null>(null);
  const [loading, setLoading] = useState(false);

  // Close InfoWindow when map is clicked
  useEffect(() => {
    if (!map) return;
    
    const listener = map.addListener('click', () => {
      setSelectedStation(null);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map]);

  const handleMarkerClick = useCallback(async (station: GaugeStation) => {
    setSelectedStation(station);
    setLoading(true);
    setGaugeData(null);

    try {
      const data = await fetchLiveGauges();
      setGaugeData(data[station.id] || null);
    } catch (error) {
      console.error('Failed to fetch gauge telemetry:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusBadge = (status: GaugeStatus) => {
    switch (status) {
      case 'critical':
        return {
          text: 'TORRENTIAL SPILLING / ACTIVE WARNING ALERT',
          classes: 'bg-[#FEE2E2] text-[#EF4444]'
        };
      case 'elevated':
        return {
          text: 'MINOR INUNDATION OVERFLOW RISK',
          classes: 'bg-[#FEF3C7] text-[#F59E0B]'
        };
      case 'normal':
      default:
        return {
          text: 'SAFE FLOW CAPACITY RATE',
          classes: 'bg-[#E6F4EA] text-[#10B981]'
        };
    }
  };

  return (
    <>
      {GAUGE_STATIONS.map((station) => (
        <AdvancedMarker
          key={station.id}
          position={station.position}
          title={station.name}
          onClick={() => handleMarkerClick(station)}
        >
          {/* SCRUM-XX: Custom Vector Circle Marker */}
          <div className="group relative">
            <div className="w-16 h-16 rounded-full bg-[#64748B] border-2 border-[#1E293B] shadow-md transition-transform duration-200 group-hover:scale-125 cursor-pointer" />
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 px-8 py-4 bg-sys-layer-02 text-white text-[10px] rounded-4 border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {station.name}
            </div>
          </div>
        </AdvancedMarker>
      ))}

      {selectedStation && (
        <InfoWindow
          position={selectedStation.position}
          onCloseClick={() => setSelectedStation(null)}
          headerDisabled={true}
        >
          <div className="p-16 min-w-[280px] font-sans text-slate-900 bg-white rounded-4">
            {loading ? (
              <div className="flex flex-col items-center py-24 gap-12">
                <div className="w-24 h-24 border-2 border-[#64748B] border-t-transparent rounded-full animate-spin" />
                <span className="animate-pulse text-slate-500 text-[13px] font-medium text-center">
                  Fetching live gauge telemetry stream...
                </span>
              </div>
            ) : gaugeData ? (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-8 mb-16 border-b border-slate-100 pb-12">
                  <span className="material-symbols-outlined text-[#64748B] text-[20px]">water_drop</span>
                  <h3 className="text-[14px] font-bold text-slate-800 m-0 uppercase tracking-tight">
                    {gaugeData.name}
                  </h3>
                </div>

                <div className="space-y-12">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[12px] font-medium uppercase tracking-wider">Current Level:</span>
                    <span className="text-[14px] font-mono font-bold text-slate-900">
                      {gaugeData.current_level.toFixed(2)} m
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[12px] font-medium uppercase tracking-wider">Normal Baseline:</span>
                    <span className="text-[14px] font-mono text-slate-600">
                      {gaugeData.baseline.toFixed(2)} m
                    </span>
                  </div>

                  <div className="pt-12 border-t border-slate-50">
                    <div className="flex flex-col gap-8">
                      <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Alert Status:</span>
                      <span className={`px-8 py-6 rounded-4 text-[10px] font-bold text-center leading-tight shadow-sm ${getStatusBadge(gaugeData.status).classes}`}>
                        [ {getStatusBadge(gaugeData.status).text} ]
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-ruby-alert text-[13px] flex items-center gap-8">
                <span className="material-symbols-outlined text-[18px]">error</span>
                Telemetry stream unavailable
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}
