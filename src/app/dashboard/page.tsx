'use client';


import React, { useState, useEffect, Suspense } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useSearchParams } from 'next/navigation';
import LocationSearchBar from '@/components/dashboard/LocationSearchBar';
import FloodZoneMap from '@/components/dashboard/FloodZoneMap';
import ImpactAssessment from '@/components/dashboard/ImpactAssessment';
import ExportPanel from '@/components/dashboard/ExportPanel';
import AnalysisLoadingOverlay from '@/components/dashboard/AnalysisLoadingOverlay';
import SidebarTabs from '@/components/dashboard/SidebarTabs';
import LiveFloodView from '@/components/dashboard/LiveFloodView';
import HistoricalRiskView from '@/components/dashboard/HistoricalRiskView';
import { apiFetch, ApiError } from '@/lib/api';
import { MOCK_GEOJSON } from '@/lib/mock-flood-data';
import { HistoricalProvider, useHistorical } from '@/context/HistoricalContext';
import { useUser } from '@/context/UserContext';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

const PROGRESS_MESSAGES = [
  'Checking cloud cover',
  'Running SAR/optical analysis',
  'Classifying flood risk zones',
  'Computing impact',
  'Rendering map overlay'
];

function DashboardContent() {
  const { profile } = useUser();
  const searchParams = useSearchParams();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(PROGRESS_MESSAGES[0]);
  const [validationError, setValidationError] = useState<string>('');
  const [error, setError] = useState<'timeout' | 'offline' | null>(() => {
    if (typeof window !== 'undefined' && !navigator.onLine) return 'offline';
    return null;
  });
  const [geoJsonData, setGeoJsonData] = useState<Record<string, unknown> | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [tileUrl, setTileUrl] = useState<string | undefined>(undefined);
  const { viewMode, currentData, selectedYear, yearsData, fetchTrendData } = useHistorical();
  
  // Set initial location from profile if available
  useEffect(() => {
    const hasSearchParams = searchParams.get('lat') && searchParams.get('lng');
    if (profile && !coordinates && !hasSearchParams) {
      setCoordinates({ lat: profile.latitude, lng: profile.longitude });
      setLocationName(profile.location_name);
    }
  }, [profile, coordinates, searchParams]);

  // Fetch historical trend data when switching to historical view if coordinates exist
  useEffect(() => {
    if (viewMode === 'historical' && coordinates && !isLoading) {
      fetchTrendData(coordinates.lat, coordinates.lng);
    }
  }, [viewMode, coordinates, fetchTrendData, isLoading]);

  // Handle Offline/Online Status
  useEffect(() => {
    const handleOffline = () => {
      setError('offline');
      setIsLoading(false); // Stop loading on network failure
    };
    const handleOnline = () => {
      setError((prev) => (prev === 'offline' ? null : prev));
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Cycle through progress messages
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isLoading && !error && !requestId) {
      let index = 0;
      
      interval = setInterval(() => {
        index = (index + 1) % PROGRESS_MESSAGES.length;
        setLoadingMessage(PROGRESS_MESSAGES[index]);
      }, 3000); // 15s total / 5 messages = 3s each
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading, error, requestId]);

  const startAnalysis = async () => {
    if (!navigator.onLine) {
      setError('offline');
      return;
    }

    if (!coordinates) return;

    setIsLoading(true);
    setLoadingMessage(PROGRESS_MESSAGES[0]);
    setError(null);
    setValidationError('');
    setGeoJsonData(null);
    setRequestId(null);

    try {
      const data = await apiFetch('/analyze/live', {
        method: 'POST',
        body: JSON.stringify({
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          location_name: locationName
        })
      });

      // Capture request_id from various possible fields
      const id = data.request_id || data.id || data.requestId;
      if (id) {
        setRequestId(id);
        setGeoJsonData(data.result || data);
      } else {
        // If API succeeded but no ID, generate a local one for sharing capability
        const fallbackId = 'LOC-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        setRequestId(fallbackId);
        setGeoJsonData(data);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      
      if (err instanceof ApiError) {
        if (err.status === 422) {
          setValidationError(err.message);
        } else if (err.status === 504) {
          setError('timeout');
        } else {
          // Generic API error
          setError('timeout'); // Defaulting to timeout/retry UI for server errors
        }
      } else if (err instanceof TypeError) {
        // Network errors (e.g., fetch failed)
        setError('offline');
      } else {
        // Fallback to mock data for unknown errors (Demo Mode)
        setGeoJsonData(MOCK_GEOJSON);
        setRequestId('DEMO-' + Math.random().toString(36).substring(2, 9).toUpperCase());
        setTileUrl('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&opacity=0.4');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (coords: { lat: number; lng: number }, name: string) => {
    setCoordinates(coords);
    setLocationName(name);
    setGeoJsonData(null); // Clear previous analysis
    setRequestId(null);
    setError(null);
    setValidationError('');
    console.log('Selected coordinates:', coords, 'Name:', name);
    // Automatically trigger analysis on location select
    setTimeout(() => {
      if (viewMode === 'live') {
        startAnalysis();
      } else {
        fetchTrendData(coords.lat, coords.lng);
      }
    }, 0);
  };

  return (
    <div className="min-h-screen bg-sys-bg-base">
      {/* Header / Top Bar */}
      <header className="border-b border-white/5 bg-sys-layer-01/50 sticky top-0 z-30">
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
                errorMessage={validationError}
                onInputChange={() => setValidationError('')}
              />
            </div>
          </div>

          <div className="flex items-center gap-16">
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">System Status</span>
              <span className={`flex items-center gap-6 ${error === 'offline' ? 'text-ruby-alert' : 'text-[#24a148]'} text-[13px] font-bold`}>
                <span className={`w-8 h-8 rounded-full ${error === 'offline' ? 'bg-ruby-alert' : 'bg-[#24a148] animate-pulse shadow-[0_0_8px_rgba(36,161,72,0.6)]'}`}></span>
                {error === 'offline' ? 'Disconnected' : 'Operational'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-24 md:px-48 py-32 space-y-32">
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
          {/* Map & Export Section */}
          <div className="lg:col-span-8 space-y-32">
            <div className="h-[640px] bg-sys-layer-01 rounded-6 border border-white/5 overflow-hidden shadow-dual relative group transition-all duration-500 hover:border-[#14B8A6]/30">
              <FloodZoneMap center={coordinates} geoJsonData={geoJsonData} tileUrl={tileUrl} />
              
              <AnalysisLoadingOverlay 
                isLoading={isLoading} 
                message={loadingMessage} 
                error={error} 
                onRetry={startAnalysis}
              />

              {/* Scanning Effect Overlay */}
              {isLoading && (
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#14B8A6]/10 to-transparent h-1/2 w-full animate-scan"></div>
                  <div className="absolute inset-0 bg-[#14B8A6]/5 animate-pulse"></div>
                </div>
              )}

              {!geoJsonData && !isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted pointer-events-none bg-[#11131c]/40">
                  {coordinates ? (
                    <div className="text-center">
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

            <ExportPanel 
              isLoading={isLoading}
              geoJsonData={geoJsonData}
              requestId={requestId}
              selectedYear={selectedYear}
              currentData={currentData}
              yearsData={yearsData}
              locationName={locationName}
            />
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4 flex flex-col bg-sys-layer-01 rounded-6 border border-white/5 overflow-hidden shadow-dual">
            <SidebarTabs />
            
            <div className="flex-grow custom-scrollbar overflow-y-auto overflow-x-hidden">
              {viewMode === 'live' ? (
                <LiveFloodView 
                  isLoading={isLoading}
                  startAnalysis={startAnalysis}
                  coordinates={coordinates}
                  error={error}
                  selectedYear={selectedYear}
                  currentData={currentData}
                />
              ) : (
                <HistoricalRiskView />
              )}
            </div>
          </div>
        </div>

        {geoJsonData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ImpactAssessment 
              estimated_population={12450}
              buildings_exposed={842}
              road_length_km={15.4}
              cropland_area_km2={4.2}
            />
          </div>
        )}
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
        <Suspense fallback={<div className="min-h-screen bg-sys-bg-base flex items-center justify-center text-white">Loading Dashboard...</div>}>
          <DashboardContent />
        </Suspense>
      </HistoricalProvider>
    </APIProvider>
  );
}
