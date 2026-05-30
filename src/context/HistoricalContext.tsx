'use client';

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { HistoricalData, HISTORICAL_YEARS_DATA, COMPOSITE_FLOOD_DATA } from '@/lib/mock-flood-data';

interface HistoricalContextType {
  selectedYear: number | null;
  isTransitioning: boolean;
  currentData: HistoricalData;
  yearsData: HistoricalData[];
  selectYear: (year: number | null) => void;
  setTransitioning: (val: boolean) => void;
}

const HistoricalContext = createContext<HistoricalContextType | undefined>(undefined);

export function HistoricalProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isTransitioning, setTransitioning] = useState(false);

  const yearsData = HISTORICAL_YEARS_DATA;
  
  const currentData = useMemo(() => {
    if (selectedYear === null) return COMPOSITE_FLOOD_DATA;
    return yearsData.find(d => d.year === selectedYear) || COMPOSITE_FLOOD_DATA;
  }, [selectedYear, yearsData]);

  const selectYear = (year: number | null) => {
    if (isTransitioning) return;
    setSelectedYear(year);
  };

  const value = {
    selectedYear,
    isTransitioning,
    currentData,
    yearsData,
    selectYear,
    setTransitioning
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
