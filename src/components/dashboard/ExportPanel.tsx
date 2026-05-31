'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { HistoricalData } from '@/lib/mock-flood-data';

interface ExportPanelProps {
  isLoading: boolean;
  geoJsonData: Record<string, unknown> | null;
  selectedYear: number | null;
  currentData: HistoricalData;
  yearsData: HistoricalData[];
  locationName?: string;
}

export default function ExportPanel({
  isLoading,
  geoJsonData,
  selectedYear,
  currentData,
  yearsData,
  locationName = 'Region'
}: ExportPanelProps) {
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Helper to trigger browser download
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleLivePdfDownload = async () => {
    setIsExportingPdf(true);
    try {
      const blob = await apiFetch('/reports/live', {
        method: 'POST',
        responseType: 'blob',
        body: JSON.stringify({
          geoJsonData,
          location: locationName,
          timestamp: new Date().toISOString()
        })
      });
      triggerDownload(blob, `LG-LIVE-REPORT-${locationName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Failed to download live PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleLiveGeoJsonDownload = () => {
    if (!geoJsonData) return;
    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
    const date = new Date().toISOString().split('T')[0];
    const region = locationName.replace(/\s+/g, '-');
    triggerDownload(blob, `LG-LIVE-${region}-${date}.geojson`);
  };

  const handleHistoricalPdfDownload = async () => {
    setIsExportingPdf(true);
    try {
      const blob = await apiFetch('/reports/historical', {
        method: 'POST',
        responseType: 'blob',
        body: JSON.stringify({
          year: selectedYear,
          historicalData: currentData,
          allYears: yearsData
        })
      });
      const filename = selectedYear 
        ? `LG-HISTORICAL-${selectedYear}-REPORT.pdf`
        : `LG-HISTORICAL-COMPOSITE-REPORT.pdf`;
      triggerDownload(blob, filename);
    } catch (error) {
      console.error('Failed to download historical PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleHistoricalGeoJsonDownload = () => {
    // Generate export directly from the client-side years_data[] composite object
    // Use the currently visible data for historical view
    const exportData = {
      type: "FeatureCollection",
      metadata: {
        generated_at: new Date().toISOString(),
        view_type: selectedYear ? 'year-specific' : 'composite',
        year: selectedYear
      },
      data: selectedYear ? [currentData] : yearsData
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const filename = selectedYear 
      ? `LG-HISTORICAL-${selectedYear}.geojson`
      : `LG-HISTORICAL-COMPOSITE.geojson`;
    triggerDownload(blob, filename);
  };

  const isLiveDisabled = isLoading || !geoJsonData;
  const isHistoricalDisabled = isLoading; // Historical data is usually available from mock-flood-data

  return (
    <div className="card-standard">
      <div className="flex items-center gap-8 mb-16">
        <span className="material-symbols-outlined text-accent-primary">download</span>
        <h3 className="text-white text-[18px] font-bold tracking-tight">Export Panel</h3>
      </div>

      <div className="space-y-16">
        {/* Mode Indicator */}
        <div className="flex items-center gap-8 px-12 py-6 bg-white/5 rounded-4 border border-white/10">
          <span className="w-8 h-8 rounded-full bg-accent-primary animate-pulse"></span>
          <span className="text-[11px] font-mono text-text-secondary uppercase tracking-widest">
            {selectedYear ? `Historical Mode: ${selectedYear}` : 'Live Analysis Mode'}
          </span>
        </div>

        {!selectedYear ? (
          /* Live View Controls */
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={handleLivePdfDownload}
              disabled={isLiveDisabled || isExportingPdf}
              className="btn-secondary w-full flex items-center justify-center gap-12 py-12 disabled:opacity-30"
            >
              {isExportingPdf ? (
                <div className="w-16 h-16 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              )}
              <span className="text-[14px] font-medium">Download Live PDF</span>
            </button>
            <button
              onClick={handleLiveGeoJsonDownload}
              disabled={isLiveDisabled}
              className="btn-secondary w-full flex items-center justify-center gap-12 py-12 border-accent-primary/20 text-accent-primary hover:bg-accent-primary/5 disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[20px]">map</span>
              <span className="text-[14px] font-medium">Download Live GeoJSON</span>
            </button>
            {isLiveDisabled && !isLoading && (
              <p className="text-[11px] text-text-muted text-center italic">
                Perform an analysis to enable live exports
              </p>
            )}
          </div>
        ) : (
          /* Historical View Controls */
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={handleHistoricalPdfDownload}
              disabled={isHistoricalDisabled || isExportingPdf}
              className="btn-secondary w-full flex items-center justify-center gap-12 py-12 disabled:opacity-30"
            >
              {isExportingPdf ? (
                <div className="w-16 h-16 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
              )}
              <span className="text-[14px] font-medium">Download Historical PDF</span>
            </button>
            <button
              onClick={handleHistoricalGeoJsonDownload}
              disabled={isHistoricalDisabled}
              className="btn-secondary w-full flex items-center justify-center gap-12 py-12 border-accent-primary/20 text-accent-primary hover:bg-accent-primary/5 disabled:opacity-30"
            >
              <span className="material-symbols-outlined text-[20px]">database</span>
              <span className="text-[14px] font-medium">Download Historical GeoJSON</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-16 pt-16 border-t border-white/5">
        <p className="text-[11px] text-text-muted leading-relaxed">
          Reports are generated using high-fidelity SAR data and multi-temporal analysis pipelines.
        </p>
      </div>
    </div>
  );
}
