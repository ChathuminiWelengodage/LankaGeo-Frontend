'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
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
import { apiFetch, ApiError, fetchLivePolygons } from '@/lib/api';
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

  const { user, profile, authModal } = useUser();
  const searchParams = useSearchParams();
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(PROGRESS_MESSAGES[0]);
  const [validationError, setValidationError] = useState<string>('');
  const [error, setError] = useState<'timeout' | 'offline' | 'server-error' | null>(() => {

    if (typeof window !== 'undefined' && !navigator.onLine) return 'offline';

    return null;

  });

  const [geoJsonData, setGeoJsonData] = useState<Record<string, unknown> | null>(null);
  const [impactData, setImpactData] = useState<{

    estimated_population: number;

    buildings_exposed: number;

    road_length_km: number;

    cropland_area_km2: number;

  } | null>(null);

  const [requestId, setRequestId] = useState<string | null>(null);

  const [tileUrl, setTileUrl] = useState<string | undefined>(undefined);

  const [liveAnalysisResult, setLiveAnalysisResult] = useState<any>(null);

  const [resultNotFoundError, setResultNotFoundError] = useState(false);

  const { viewMode, currentData, selectedYear, yearsData, fetchTrendData, historicalGeoJson } = useHistorical();


  const fetchDatabasePolygons = useCallback(async () => {

    try {

      const data = await fetchLivePolygons();

      if (Array.isArray(data) && data.length > 0) {

        // Combine all geojson results into a single FeatureCollection

        const allFeatures = data.flatMap((item: any) => {

          const geojson = item.result || item.geojson || (item.type === 'FeatureCollection' ? item : null);

          if (geojson && geojson.features) return geojson.features;

          if (geojson && geojson.type === 'Feature') return [geojson];

          // If the item itself is a feature

          if (item.type === 'Feature') return [item];

          return [];

        });


        if (allFeatures.length > 0) {

          setGeoJsonData({

            type: 'FeatureCollection',

            features: allFeatures

          });

        }

      }

    } catch (err) {

      // Silently fail for database polygon fetch to not disrupt the main analysis flow

      if (process.env.NODE_ENV === 'development') {

        console.warn('Persistent polygons could not be loaded from database:', err);

      }

    }

  }, []);


  // Initial load of database polygons when in live mode and no coordinates selected

  useEffect(() => {

    if (viewMode === 'live' && !coordinates && !geoJsonData && !isLoading) {

      fetchDatabasePolygons();

    }

  }, [viewMode, coordinates, geoJsonData, isLoading, fetchDatabasePolygons]);

 

  const startAnalysis = useCallback(async (coords?: { lat: number; lng: number }, name?: string) => {

    if (!navigator.onLine) {

      setError('offline');

      return;

    }


    const targetCoords = coords || coordinates;

    const targetName = name || locationName;


    if (!targetCoords) return;


    setIsLoading(true);

    setLoadingMessage(PROGRESS_MESSAGES[0]);

    setError(null);

    setValidationError('');

    setGeoJsonData(null);

    setImpactData(null);

    setRequestId(null);

    setResultNotFoundError(false);

    setLiveAnalysisResult(null);


    try {

      const data = await apiFetch('/analyze/live', {

        method: 'POST',

        body: JSON.stringify({

          lat: targetCoords.lat,

          lng: targetCoords.lng,

          radius_km: 5

        })

      });


      // Capture request_id from various possible fields

      const id = data.request_id || data.id || data.requestId;

      if (id) {

        setRequestId(id);

        setGeoJsonData(data.geojson || data.result || data);

        setLiveAnalysisResult(data);

       

        // Handle impact metrics if provided by API

        if (data.impact) {

          setImpactData(data.impact);

        } else if (data.impact_metrics) {

          setImpactData(data.impact_metrics);

        }


        // Capture tile_url if provided

        if (data.tile_url || data.tileUrl) {

          setTileUrl(data.tile_url || data.tileUrl);

        }

      } else {

        // If API succeeded but no ID, generate a local one for sharing capability

        const fallbackId = 'LOC-' + Math.random().toString(36).substring(2, 9).toUpperCase();

        setRequestId(fallbackId);

        setGeoJsonData(data.geojson || data.result || data);

        setLiveAnalysisResult(data);

      }

    } catch (err) {

      console.error('Analysis failed:', err);

     

      if (err instanceof ApiError) {

        if (err.status === 401) {

          // Open auth modal if unauthorized

          authModal.open('login', targetCoords ? { name: targetName, lat: targetCoords.lat, lng: targetCoords.lng } : undefined);

          setIsLoading(false);

          return;

        } else if (err.status === 422) {

          setValidationError(err.message);

        } else if (err.status === 504) {

          // If in development or if we want to allow demo fallback for timeouts

          console.warn('Analysis timed out. Falling back to Demo Mode.');

          setGeoJsonData(MOCK_GEOJSON);

          setRequestId('DEMO-' + Math.random().toString(36).substring(2, 9).toUpperCase());

          setTileUrl('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&opacity=0.4');

        } else if (err.status === 500) {

          setError('server-error');

        } else {

          // Generic API error

          setError('timeout'); // Defaulting to timeout/retry UI for other server errors

        }

      } else if (err instanceof TypeError && !navigator.onLine) {

        // Actual offline state

        setError('offline');

      } else {

        // Server unreachable or other error - Fallback to mock data (Demo Mode)

        console.warn('Backend unreachable or error occurred. Falling back to Demo Mode.');

        setGeoJsonData(MOCK_GEOJSON);

        setRequestId('DEMO-' + Math.random().toString(36).substring(2, 9).toUpperCase());

        setTileUrl('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&opacity=0.4');

      }

    } finally {

      setIsLoading(false);

    }

  }, [coordinates, locationName, viewMode, fetchTrendData]);


  const handleLocationSelect = useCallback((coords: { lat: number; lng: number }, name: string) => {

    setCoordinates(coords);

    setLocationName(name);

    setGeoJsonData(null); // Clear previous analysis

    setImpactData(null);

    setRequestId(null);

    setError(null);

    setValidationError('');

    setResultNotFoundError(false);

    setLiveAnalysisResult(null);

    console.log('Selected coordinates:', coords, 'Name:', name);

    // Automatically trigger analysis on location select

    setTimeout(() => {

      if (viewMode === 'live') {

        startAnalysis(coords, name);

      } else {

        fetchTrendData(coords.lat, coords.lng);

      }

    }, 0);

  }, [viewMode, startAnalysis, fetchTrendData]);


  // Handle shared result loading from ?result= parameter

  useEffect(() => {

    const resultId = searchParams.get('result');

    if (!resultId || requestId === resultId) return;


    const loadStoredResult = async () => {

      setIsLoading(true);

      setLoadingMessage('Fetching shared analysis...');

      setResultNotFoundError(false);

      setError(null);

      setGeoJsonData(null);

      setImpactData(null);

      setLiveAnalysisResult(null);


      try {

        const data = await apiFetch(`/analyze/result/${resultId}`);

       

        // Update state with fetched result

        setRequestId(resultId);

        setGeoJsonData(data.geojson || data.result || data);

        setLiveAnalysisResult(data);

       

        if (data.impact) {

          setImpactData(data.impact);

        } else if (data.impact_metrics) {

          setImpactData(data.impact_metrics);

        }


        if (data.latitude && data.longitude) {

          setCoordinates({ lat: data.latitude, lng: data.longitude });

        } else if (data.lat && data.lng) {

          setCoordinates({ lat: data.lat, lng: data.lng });

        }


        if (data.location_name) {

          setLocationName(data.location_name);

        }

        if (data.tile_url) {

          setTileUrl(data.tile_url);

        }

      } catch (err) {

        console.error('Failed to load shared result:', err);

        if (err instanceof ApiError && err.status === 404) {

          setResultNotFoundError(true);

        } else {

          setError('timeout');

        }

      } finally {

        setIsLoading(false);

      }

    };


    loadStoredResult();

  }, [searchParams, requestId]);


  // Handle search parameters from landing page

  useEffect(() => {

    const lat = searchParams.get('lat');

    const lng = searchParams.get('lng');

    const name = searchParams.get('name');

    const resultId = searchParams.get('result');


    // Bypass if we are loading a specific result

    if (resultId) return;


    if (lat && lng && !coordinates) {

      const coords = { lat: parseFloat(lat), lng: parseFloat(lng) };

      handleLocationSelect(coords, name || '');

    }

  }, [searchParams, coordinates, handleLocationSelect]);


  // Set initial location from profile if available

  useEffect(() => {

    const hasSearchParams = searchParams.get('lat') && searchParams.get('lng');

    const hasResultParam = searchParams.get('result');

   

    if (profile && !coordinates && !hasSearchParams && !hasResultParam) {

      const coords = { lat: profile.latitude, lng: profile.longitude };

      handleLocationSelect(coords, profile.location_name);

    }

  }, [profile, coordinates, searchParams, handleLocationSelect]);


  // Fetch historical trend data when switching to historical view if coordinates exist

  useEffect(() => {

    if (viewMode === 'historical' && coordinates && !isLoading) {

      fetchTrendData(coordinates.lat, coordinates.lng);

    }

  }, [viewMode, coordinates, fetchTrendData, isLoading]);


  // Auto-trigger live analysis when switching to live view if coordinates exist but no data yet

  useEffect(() => {

    const hasResultParam = searchParams.get('result');

    if (viewMode === 'live' && coordinates && !geoJsonData && !isLoading && !error && !hasResultParam) {

      startAnalysis(coordinates, locationName);

    }

  }, [viewMode, coordinates, geoJsonData, isLoading, error, startAnalysis, locationName, searchParams]);


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

return (
  <div className="min-h-screen bg-sys-bg-base">
    <main className="max-w-screen-2xl mx-auto px-16 py-16 space-y-24">
      {/* Grid container with items-stretch for equal column heights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Header, Map, Export, & Impact Assessment     */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 flex flex-col space-y-6">

          {/* LIVE ANALYSIS HEADER SECTION */}
          <div className="bg-sys-layer-01 rounded-6 border border-white/5 shadow-dual px-6 sm:px-8 py-5">
            <h1 className="text-white text-[24px] sm:text-[28px] font-semibold leading-none tracking-[-0.4px] mb-4">
              LIVE ANALYSIS
            </h1>

            {/* Search instruction */}
            {!isLoading && !validationError && (
              <p className="mt-3 mb-3 px-1 text-[14px] sm:text-[15px] font-medium text-[#1d4ed8]">
                Search for a location to start live flood analysis
              </p>
            )}

            <div className="w-full max-w-[520px]">
              <div
                className="
                  relative
                  rounded-4
                  overflow-hidden
                  border border-white/10
                  bg-sys-bg-base/95
                  backdrop-blur-md
                  shadow-[0_4px_24px_rgba(0,0,0,0.35)]
                  transition-all duration-200
                  hover:border-white/20
                  focus-within:border-[#14B8A6]/60
                  focus-within:shadow-[0_0_0_3px_rgba(20,184,166,0.10),0_8px_30px_rgba(0,0,0,0.35)]
                "
              >
                <LocationSearchBar 
                  onLocationSelect={handleLocationSelect}
                  isLoading={isLoading}
                  errorMessage={validationError}
                  onInputChange={() => setValidationError('')}
                />
              </div>
            </div>
          </div>

          {/* MAP SECTION */}
          <div className="h-[600px] bg-sys-layer-01 rounded-6 border border-white/5 overflow-hidden shadow-dual relative group transition-all duration-500 hover:border-[#14B8A6]/30">
            <FloodZoneMap 
              center={coordinates} 
              geoJsonData={viewMode === 'live' ? geoJsonData : historicalGeoJson} 
              tileUrl={tileUrl} 
            />

            <AnalysisLoadingOverlay 
              isLoading={isLoading} 
              message={loadingMessage} 
              error={resultNotFoundError ? 'notFound' : error} 
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
                    <p className="text-[18px] font-[300]">
                      Monitoring Coordinates
                    </p>
                    <p className="text-accent-primary font-mono mt-4">
                      {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center opacity-40">
                    <span className="material-symbols-outlined text-[64px] mb-16">
                      map
                    </span>
                    <p>
                      Initialize monitoring by selecting a location
                    </p>
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

          {/* Export Panel */}
          <ExportPanel 
            isLoading={isLoading}
            geoJsonData={geoJsonData}
            requestId={requestId}
            selectedYear={selectedYear}
            currentData={currentData}
            yearsData={yearsData}
            locationName={locationName}
          />

          {/* ADDED: Impact Assessment Component */}
          {geoJsonData && (
            <ImpactAssessment 
              estimated_population={impactData?.estimated_population || 0}
              buildings_exposed={impactData?.buildings_exposed || 0}
              road_length_km={impactData?.road_length_km || 0}
              cropland_area_km2={impactData?.cropland_area_km2 || 0}
            />
          )}

        </div>

       
        {/* RIGHT COLUMN: Side Panel   */}
       
        <div className="lg:col-span-4 flex flex-col bg-sys-layer-01 rounded-6 border border-white/5 overflow-hidden shadow-dual h-full min-h-[600px]">
          <SidebarTabs />
          
          <div className="flex-1 custom-scrollbar overflow-y-auto overflow-x-hidden">
            {viewMode === 'live' ? (
              <LiveFloodView 
                isLoading={isLoading}
                startAnalysis={startAnalysis}
                coordinates={coordinates}
                error={error}
                selectedYear={selectedYear}
                currentData={currentData}
                liveAnalysisResult={liveAnalysisResult}
              />
            ) : (
              <HistoricalRiskView />
            )}
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
            NEXT_PUBLIC_GOOGLE_MAPS_API_Key=your_key
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


