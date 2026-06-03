'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import { HistoricalData, COMPOSITE_FLOOD_DATA, HISTORICAL_YEARS_DATA } from '@/lib/mock-flood-data';
import { apiFetch, ApiError } from '@/lib/api';

interface HistoricalContextType {
  selectedYear: number | null;
  isTransitioning: boolean;
  viewMode: 'live' | 'historical';
  currentData: HistoricalData;
  yearsData: HistoricalData[];
  isTrendLoading: boolean;
  trendError: 'timeout' | 'generic' | null;
  lastCoordinates: { lat: number; lng: number } | null;
  selectYear: (year: number | null) => void;
  setTransitioning: (val: boolean) => void;
  setViewMode: (mode: 'live' | 'historical') => void;
  fetchTrendData: (lat: number, lng: number) => Promise<void>;
  dismissTrendError: () => void;
}

const HistoricalContext = createContext<HistoricalContextType | undefined>(undefined);

export function HistoricalProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isTransitioning, setTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState<'live' | 'historical'>('live');
  const [yearsData, setYearsData] = useState<HistoricalData[]>(HISTORICAL_YEARS_DATA); // Init with mock or empty array depending on preference
  const [compositeData, setCompositeData] = useState<HistoricalData>(COMPOSITE_FLOOD_DATA);
  const [isTrendLoading, setIsTrendLoading] = useState(false);
  const [trendError, setTrendError] = useState<'timeout' | 'generic' | null>(null);
  const [lastCoordinates, setLastCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const fetchTrendData = useCallback(async (lat: number, lng: number) => {
    setLastCoordinates({ lat, lng });
    setIsTrendLoading(true);
    setTrendError(null);

    try {
      // Endpoint expects { latitude, longitude, years }
      const response = await apiFetch('/analyze/trend', {
        method: 'POST',
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          years: 5
        })
      });

      // Assuming the backend returns { years_data: HistoricalData[], composite: HistoricalData }
      // Map the response to our data structures
      if (response && response.years_data && response.composite) {
         setYearsData(response.years_data);
         setCompositeData(response.composite);
         // Reset selected year to show composite by default on new fetch
         setSelectedYear(null);
      } else {
         // Fallback to mock data if response format is unexpected
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
      // On error, fallback to mock data for demo purposes, or leave previous data
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
    if (selectedYear === null) return compositeData;
    return yearsData.find(d => d.year === selectedYear) || compositeData;
  }, [selectedYear, yearsData, compositeData]);

  const selectYear = (year: number | null) => {
    if (isTransitioning) return;
    setSelectedYear(year);
  };

  const value = {
    selectedYear,
    isTransitioning,
    viewMode,
    currentData,
    yearsData,
    isTrendLoading,
    trendError,
    lastCoordinates,
    selectYear,
    setTransitioning,
    setViewMode,
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
