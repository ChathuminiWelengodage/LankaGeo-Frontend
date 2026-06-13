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
  selectYear: (year: number | null) => void;
  setTransitioning: (val: boolean) => void;
  setViewMode: (mode: 'live' | 'historical') => void;
  setHistoricalSubMode: (mode: 'composite' | 'heatmap') => void;
  fetchTrendData: (lat: number, lng: number) => Promise<void>;
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

  const fetchTrendData = useCallback(async (lat: number, lng: number) => {
    setLastCoordinates({ lat, lng });
    setIsTrendLoading(true);
    setTrendError(null);

    try {
      const response = await apiFetch('/api/v1/analyze/trend', {
        method: 'POST',
        body: JSON.stringify({ lat, lng, years: 5 })
      });

      if (response && response.years_data) {
         setYearsData(response.years_data);
         
         // Backend now returns composite_tile_url and trend_heatmap_url
         const composite = {
           ...COMPOSITE_FLOOD_DATA,
           tile_url: response.composite_tile_url || response.composite?.tile_url || COMPOSITE_FLOOD_DATA.tile_url,
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

  const selectYear = (year: number | null) => {
    if (isTransitioning) return;
    setSelectedYear(year);
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
