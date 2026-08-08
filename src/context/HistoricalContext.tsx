'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import { HistoricalData, COMPOSITE_FLOOD_DATA, HISTORICAL_YEARS_DATA } from '@/lib/mock-flood-data';
import { apiFetch, ApiError } from '@/lib/api';

interface HistoricalContextType {
  selectedYear: number | null;
  isTransitioning: boolean;
  viewMode: 'live' | 'historical';
  historicalSubMode: 'composite' | 'heatmap';
  currentData: HistoricalData;
  yearsData: HistoricalData[];
  isTrendLoading: boolean;
  trendError: 'timeout' | 'generic' | null;
  lastCoordinates: { lat: number; lng: number } | null;
  historicalGeoJson: Record<string, any> | null;
  isHistoricalPolygonsLoading: boolean;
  selectYear: (year: number | null) => void;
  setTransitioning: (val: boolean) => void;
  setViewMode: (mode: 'live' | 'historical') => void;
  setHistoricalSubMode: (mode: 'composite' | 'heatmap') => void;
  fetchTrendData: (lat: number, lng: number, radius_km?: number) => Promise<void>;
  dismissTrendError: () => void;
}

const HistoricalContext = createContext<HistoricalContextType | undefined>(undefined);

export function HistoricalProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isTransitioning, setTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState<'live' | 'historical'>('live');
  const [historicalSubMode, setHistoricalSubMode] = useState<'composite' | 'heatmap'>('composite');
  const [yearsData, setYearsData] = useState<HistoricalData[]>(HISTORICAL_YEARS_DATA);
  const [compositeData, setCompositeData] = useState<HistoricalData>(COMPOSITE_FLOOD_DATA);
  const [heatmapUrl, setHeatmapUrl] = useState<string | undefined>(undefined);
  const [isTrendLoading, setIsTrendLoading] = useState(false);
  const [trendError, setTrendError] = useState<'timeout' | 'generic' | null>(null);
  const [lastCoordinates, setLastCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [historicalGeoJson, setHistoricalGeoJson] = useState<Record<string, any> | null>(null);
  const [isHistoricalPolygonsLoading, setIsHistoricalPolygonsLoading] = useState(false);

  const fetchTrendData = useCallback(async (lat: number, lng: number, radius_km: number = 10) => {
    setLastCoordinates({ lat, lng });
    setIsTrendLoading(true);
    setTrendError(null);

    try {
      const response = await apiFetch('/api/v1/analyze/trend', {
        method: 'POST',
        body: JSON.stringify({ lat, lng, radius_km, years: 5 })
      });

      if (response && Array.isArray(response.years_data)) {
         const mappedYears: HistoricalData[] = response.years_data.map((item: any) => {
           const rawVal = item.value ?? item.flood_frequency_index ?? 0;
           const ffi = rawVal > 1 ? rawVal / 100 : rawVal;
           return {
             year: item.year,
             flood_frequency_index: ffi,
             total_zones: item.total_zones ?? Math.round(15 + ffi * 30),
             impact_summary: item.impact_summary ?? `Annual historical flood probability recorded at ${(ffi * 100).toFixed(1)}%.`,
             max_area_km2: item.max_area_km2 ?? Math.round((50 + ffi * 100) * 10) / 10,
             pixels_flooded: item.pixels_flooded ?? Math.round(50000 + ffi * 150000),
             peak_flood_month: item.peak_flood_month ?? 'May',
             tile_url: item.tile_url ?? COMPOSITE_FLOOD_DATA.tile_url
           };
         });
         setYearsData(mappedYears);
         
         // Composite FFI from avg_flood_probability or composite data
         const rawAvg = response.avg_flood_probability ?? COMPOSITE_FLOOD_DATA.flood_frequency_index;
         const compositeFFI = rawAvg > 1 ? rawAvg / 100 : rawAvg;

         const composite: HistoricalData = {
           ...COMPOSITE_FLOOD_DATA,
           flood_frequency_index: compositeFFI,
           tile_url: response.composite_tile_url || response.composite?.tile_url || COMPOSITE_FLOOD_DATA.tile_url,
           impact_summary: `5-Year longitudinal flood probability average: ${(compositeFFI * 100).toFixed(1)}%. Peak risk year: ${response.peak_year || 2023}.`,
           ...response.metadata
         };
         setCompositeData(composite);
         setHeatmapUrl(response.trend_heatmap_url);
         
         setSelectedYear(null);
      } else {
         console.warn('Unexpected response format from /analyze/trend, using mock data.');
         setYearsData(HISTORICAL_YEARS_DATA);
         setCompositeData(COMPOSITE_FLOOD_DATA);
      }

    } catch (err) {
      console.error('Trend analysis failed:', err);
      if (err instanceof ApiError && err.status === 504) {
        setTrendError('timeout');
      } else {
        setTrendError('generic');
      }
      setYearsData(HISTORICAL_YEARS_DATA);
      setCompositeData(COMPOSITE_FLOOD_DATA);
    } finally {
      setIsTrendLoading(false);
    }
  }, []);

  const dismissTrendError = useCallback(() => {
    setTrendError(null);
  }, []);

  const currentData = useMemo(() => {
    if (viewMode === 'historical' && historicalSubMode === 'heatmap' && heatmapUrl) {
      return { ...compositeData, tile_url: heatmapUrl };
    }
    if (selectedYear === null) return compositeData;
    return yearsData.find(d => d.year === selectedYear) || compositeData;
  }, [selectedYear, yearsData, compositeData, viewMode, historicalSubMode, heatmapUrl]);

  const selectYear = async (year: number | null) => {
    if (isTransitioning) return;
    setSelectedYear(year);

    if (year === null) {
      setHistoricalGeoJson(null);
      return;
    }

    setIsHistoricalPolygonsLoading(true);
    try {
      const data = await apiFetch(`/api/v1/analyze/polygons/year/${year}`);
      if (Array.isArray(data)) {
        setHistoricalGeoJson({
          type: 'FeatureCollection',
          features: data
        });
      } else {
        setHistoricalGeoJson(null);
      }
    } catch (err) {
      console.error(`Failed to fetch polygons for year ${year}:`, err);
      setHistoricalGeoJson(null);
    } finally {
      setIsHistoricalPolygonsLoading(false);
    }
  };

  const value = {
    selectedYear,
    isTransitioning,
    viewMode,
    historicalSubMode,
    currentData,
    yearsData,
    isTrendLoading,
    trendError,
    lastCoordinates,
    historicalGeoJson,
    isHistoricalPolygonsLoading,
    selectYear,
    setTransitioning,
    setViewMode,
    setHistoricalSubMode,
    fetchTrendData,
    dismissTrendError
  };

  return (
    <HistoricalContext.Provider value={value}>
      {children}
    </HistoricalContext.Provider>
  );
}

export function useHistorical() {
  const context = useContext(HistoricalContext);
  if (context === undefined) {
    throw new Error('useHistorical must be used within a HistoricalProvider');
  }
  return context;
}
