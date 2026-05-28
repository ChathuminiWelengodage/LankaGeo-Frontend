'use client';

import React, { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import LocationSearchBar from '@/components/dashboard/LocationSearchBar';
import FloodZoneMap from '@/components/dashboard/FloodZoneMap';
import HistoricalYearStepper from '@/components/dashboard/HistoricalYearStepper';
import FFITrendChart from '@/components/dashboard/FFITrendChart';
import { MOCK_GEOJSON } from '@/lib/mock-flood-data';
import { HistoricalProvider, useHistorical } from '@/context/HistoricalContext';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

function DashboardContent() {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<Record<string, unknown> | null>(null);
  const { currentData, selectedYear } = useHistorical();
  
  // Mock Tile URL for Google Earth Engine flood heatmap (SCRUM-94)
  const [tileUrl, setTileUrl] = useState<string | undefined>(
    'https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}' // Example URL (Hybrid labels as placeholder)
  );

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
      // Example heatmap overlay URL (using a colored placeholder here)
      setTileUrl('https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-sys-bg-base">
      {/* Header / Top Bar */}
      <header className="border-b border-white/5 bg-sys-layer-01/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-screen-2xl mx-auto px-24 md:px-48 h-80 flex items-center justify-between gap-32">
          <div className="flex items-center gap-16">
            <div className="w-32 h-32 bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-8 flex items-center justify-center shadow-[0_0_10px_rgba(20,184,166,0.3)] border border-white/10 animate-pulse flex-shrink-0">
              <span className="material-symbols-outlined text-white text-[18px]">satellite_alt</span>
            </div>
            <div>
              <h1 className="text-[20px] font-bold tracking-tight text-white m-0 uppercase leading-none">Live Analysis</h1>
              <p className="text-text-secondary text-[11px] m-0 font-mono mt-4 opacity-70">Precision SAR Surveillance Dashboard</p>
            </div>
          </div>
          
          <div className="flex-grow max-w-xl">
            <div className="interactive-glow rounded-4 overflow-hidden">
              <LocationSearchBar 
                onLocationSelect={handleLocationSelect}
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center gap-16 group cursor-help p-8 rounded-4 hover:bg-white/5 transition-all">
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider group-hover:text-text-secondary transition-colors">System Status</span>
              <span className="flex items-center gap-6 text-[#24a148] text-[13px] font-bold">
                <span className="w-8 h-8 rounded-full bg-[#24a148] animate-pulse shadow-[0_0_8px_rgba(36,161,72,0.6)]"></span>
                Operational
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-24 md:px-48 py-32 space-y-32">
        {/* Historical Timeline Controls */}
        <div className="max-w-3xl animate-in fade-in slide-in-from-top-4 duration-700">
          <HistoricalYearStepper />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
          {/* Map Section */}
          <div className="lg:col-span-8 h-[640px] bg-sys-layer-01 rounded-6 border border-white/5 overflow-hidden shadow-dual relative group transition-all duration-500 hover:border-[#14B8A6]/30">
            <FloodZoneMap center={coordinates} geoJsonData={geoJsonData} tileUrl={tileUrl} />

            {/* Scanning Effect Overlay */}
            {isLoading && (
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#14B8A6]/10 to-transparent h-1/2 w-full animate-scan"></div>
                <div className="absolute inset-0 bg-[#14B8A6]/5 animate-pulse"></div>
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
                <h3 className="text-white text-[18px] mb-16 font-bold tracking-tight">
                  {selectedYear ? `Historical Runoff: ${selectedYear}` : 'Analysis Parameters'}
                </h3>
                
                {selectedYear ? (
                  <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex justify-between items-center py-8 border-b border-white/5">
                      <span className="text-text-secondary text-[13px]">Monitored Areas</span>
                      <span className="text-white font-mono text-[13px]">{currentData.total_zones} Zone Nodes</span>
                    </div>
                    <div className="flex justify-between items-center py-8 border-b border-white/5">
                      <span className="text-text-secondary text-[13px]">Flood Frequency Index</span>
                      <span className={`font-mono text-[13px] px-8 py-2 rounded-4 ${
                        currentData.flood_frequency_index > 0.7 ? 'bg-ruby-alert/20 text-ruby-alert' : 'bg-[#14B8A6]/20 text-[#14B8A6]'
                      }`}>
                        {currentData.flood_frequency_index.toFixed(2)} / 1.00
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-8 border-b border-white/5">
                      <span className="text-text-secondary text-[13px]">Est. Max Area</span>
                      <span className="text-white font-mono text-[13px]">{currentData.max_area_km2} km²</span>
                    </div>
                    <p className="text-text-muted text-[12px] leading-relaxed mt-16 italic">
                      "{currentData.impact_summary}"
                    </p>
                  </div>
                ) : (
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
                )}
              </div>
              
              <button 
                onClick={startAnalysis}
                disabled={!coordinates || isLoading || !!selectedYear}
                className="btn-primary w-full mt-24 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <span className={`material-symbols-outlined mr-8 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`}>
                  {isLoading ? 'progress_activity' : 'sync'}
                </span>
                {isLoading ? 'Processing SAR Data...' : 'Start Live Analysis'}
              </button>
            </div>

            <FFITrendChart />

            <div className="card-standard">
              <h3 className="text-white text-[18px] mb-16">Macro Metric Coverage</h3>
              <div className="space-y-12">
                <div className="p-12 bg-[#14B8A6]/10 border-l-2 border-[#14B8A6] rounded-r-4">
                  <p className="text-[#14B8A6] text-[13px] font-semibold">5-Year Resilience Composite</p>
                  <p className="text-text-muted text-[11px] mt-4">Average FFI: 0.64</p>
                </div>
                <div className="p-12 bg-white/5 border-l-2 border-text-muted rounded-r-4">
                  <p className="text-text-secondary text-[13px]">System Health: Optimal</p>
                  <p className="text-text-muted text-[11px] mt-4">Last verify: Today, 08:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="min-h-screen bg-sys-bg-base flex items-center justify-center p-24">
        <div className="max-w-md w-full bg-sys-layer-01 p-32 rounded-12 border border-ruby-alert/30 shadow-dual text-center">
          <span className="material-symbols-outlined text-ruby-alert text-[48px] mb-16">warning</span>
          <h2 className="text-white text-[20px] font-semibold mb-8">Google Maps API Key Missing</h2>
          <p className="text-text-secondary text-[14px] mb-24">
            The Google Maps API key is not configured. Please add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your <code>.env.local</code> file to enable the dashboard features.
          </p>
          <div className="bg-black/20 p-12 rounded-4 text-left font-mono text-[12px] text-text-muted break-all">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} solutionChannel="GMP_GCC_placeautocomplete_v1">
      <HistoricalProvider>
        <DashboardContent />
      </HistoricalProvider>
    </APIProvider>
  );
}
