'use client';

import React, { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import LocationSearchBar from '@/components/dashboard/LocationSearchBar';
import FloodZoneMap from '@/components/dashboard/FloodZoneMap';
import { MOCK_GEOJSON } from '@/lib/mock-flood-data';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function DashboardPage() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<Record<string, unknown> | null>(null);

  const handleLocationSelect = (coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
    setGeoJsonData(null); // Clear previous analysis
    console.log('Selected coordinates:', coords);
  };

  const startAnalysis = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setGeoJsonData(MOCK_GEOJSON);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} solutionChannel="GMP_GCC_placeautocomplete_v1">
      <div className="min-h-screen bg-sys-bg-base">
        {/* Header / Top Bar */}
        <div className="border-b border-white/5 bg-sys-layer-01/50 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-screen-2xl mx-auto px-24 md:px-48 h-80 flex items-center justify-between gap-32">
            <div>
              <h1 className="text-[24px] font-[300] tracking-tight text-white m-0">Live Analysis</h1>
              <p className="text-text-secondary text-[13px] m-0">Precision SAR Surveillance Dashboard</p>
            </div>
            
            <div className="flex-grow max-w-xl">
              <LocationSearchBar 
                onLocationSelect={handleLocationSelect}
                isLoading={isLoading}
              />
            </div>

            <div className="flex items-center gap-16">
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">System Status</span>
                <span className="flex items-center gap-6 text-[#24a148] text-[13px]">
                  <span className="w-8 h-8 rounded-full bg-[#24a148] animate-pulse"></span>
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-screen-2xl mx-auto px-24 md:px-48 py-32 space-y-32">
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
            {/* Map Section */}
            <div className="lg:col-span-8 h-[640px] bg-sys-layer-01 rounded-6 border border-white/5 overflow-hidden shadow-dual relative group">
              <FloodZoneMap center={coordinates} geoJsonData={geoJsonData} />
              
              {!geoJsonData && (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted pointer-events-none bg-[#11131c]/40 backdrop-blur-[2px]">
                  {coordinates ? (
                    <div className="text-center">
                      <span className="material-symbols-outlined text-[48px] text-accent-primary mb-16">satellite_alt</span>
                      <p className="text-[18px] font-[300]">Monitoring Coordinates</p>
                      <p className="text-accent-primary font-mono mt-4">
                        {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center opacity-40">
                      <span className="material-symbols-outlined text-[64px] mb-16">map</span>
                      <p>Initialize monitoring by selecting a location</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Decorative corners */}
              <div className="absolute top-16 left-16 w-32 h-32 border-t-2 border-l-2 border-white/10 pointer-events-none"></div>
              <div className="absolute top-16 right-16 w-32 h-32 border-t-2 border-r-2 border-white/10 pointer-events-none"></div>
              <div className="absolute bottom-16 left-16 w-32 h-32 border-b-2 border-l-2 border-white/10 pointer-events-none"></div>
              <div className="absolute bottom-16 right-16 w-32 h-32 border-b-2 border-r-2 border-white/10 pointer-events-none"></div>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-4 space-y-24">
              <div className="card-standard min-h-[300px] flex flex-col justify-between">
                <div>
                  <h3 className="text-white text-[18px] mb-16">Analysis Parameters</h3>
                  <div className="space-y-16">
                    <div className="flex justify-between items-center py-8 border-b border-white/5">
                      <span className="text-text-secondary text-[13px]">Satellite Path</span>
                      <span className="text-white font-mono text-[13px]">DES-9284</span>
                    </div>
                    <div className="flex justify-between items-center py-8 border-b border-white/5">
                      <span className="text-text-secondary text-[13px]">Orbit Type</span>
                      <span className="text-white font-mono text-[13px]">Sun-Sync</span>
                    </div>
                    <div className="flex justify-between items-center py-8 border-b border-white/5">
                      <span className="text-text-secondary text-[13px]">Resolution</span>
                      <span className="text-white font-mono text-[13px]">0.5m GSD</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={startAnalysis}
                  disabled={!coordinates || isLoading}
                  className="btn-primary w-full mt-24 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className={`material-symbols-outlined mr-8 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`}>
                    {isLoading ? 'progress_activity' : 'sync'}
                  </span>
                  {isLoading ? 'Processing SAR Data...' : 'Start Live Analysis'}
                </button>
              </div>

              <div className="card-standard">
                <h3 className="text-white text-[18px] mb-16">Recent Alerts</h3>
                <div className="space-y-12">
                  <div className="p-12 bg-ruby-alert/10 border-l-2 border-ruby-alert rounded-r-4">
                    <p className="text-ruby-alert text-[13px] font-semibold">Flood Warning: Kelani River</p>
                    <p className="text-text-muted text-[11px] mt-4">Updated 12 mins ago</p>
                  </div>
                  <div className="p-12 bg-white/5 border-l-2 border-text-muted rounded-r-4">
                    <p className="text-text-secondary text-[13px]">System Update Complete</p>
                    <p className="text-text-muted text-[11px] mt-4">Today, 08:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </APIProvider>
  );
}
