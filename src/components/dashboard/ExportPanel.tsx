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
    <div className="card-standard relative overflow-hidden group/panel">
      {/* Decorative scanning line effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent -translate-x-full group-hover/panel:translate-x-full transition-transform duration-1000"></div>
      
      <div className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-8">
          <div className="w-32 h-32 rounded-6 bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-accent-primary text-[18px]">file_download</span>
          </div>
          <div>
            <h3 className="text-white text-[16px] font-bold tracking-tight">Export Panel</h3>
            <p className="text-[10px] text-text-muted leading-tight mt-2 max-w-[280px]">
              Export current live analysis results, including flood zone delineations and impact metrics.
            </p>
          </div>
        </div>

        {/* Status Badge - Compact version */}
        <div className={`flex items-center gap-6 px-10 py-4 rounded-full border ${
          selectedYear 
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
            : 'bg-accent-primary/10 border-accent-primary/20 text-accent-primary'
        }`}>
          <span className={`w-5 h-5 rounded-full ${selectedYear ? 'bg-blue-400' : 'bg-accent-primary'} animate-pulse`}></span>
          <span className="text-[9px] font-bold uppercase tracking-tighter">
            {selectedYear ? `Archive: ${selectedYear}` : 'Live Stream'}
          </span>
        </div>
      </div>

      {isLiveDisabled && !selectedYear && !isLoading && (
        <div className="mb-12 flex items-center gap-8 px-12 py-8 bg-ruby-alert/10 border border-ruby-alert/20 rounded-4 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-ruby-alert text-[16px]">warning</span>
          <span className="text-ruby-alert text-[10px] font-bold uppercase tracking-wider">
            ANALYSIS MUST BE COMPLETED BEFORE EXPORT
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PDF Export Card - More compact */}
        <button
          onClick={selectedYear ? handleHistoricalPdfDownload : handleLivePdfDownload}
          disabled={(selectedYear ? isHistoricalDisabled : isLiveDisabled) || isExportingPdf}
          className="relative group/btn flex flex-col items-start p-10 rounded-6 bg-white/5 border border-white/10 hover:border-accent-primary/40 hover:bg-accent-primary/5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/btn:opacity-40 transition-opacity">
            <span className="material-symbols-outlined text-[20px] text-red-500">picture_as_pdf</span>
          </div>
          
          <div className="mb-6 p-4 rounded-4 bg-red-500/10 border border-red-500/20 group-hover/btn:bg-red-500 group-hover/btn:text-white transition-colors">
            {isExportingPdf ? (
              <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined text-[14px] text-red-500 group-hover/btn:text-white">description</span>
            )}
          </div>
          
          <span className="text-white font-bold text-[12px] leading-none">Analytical Report</span>
          <span className="text-[9px] text-text-muted mt-1">PDF • {selectedYear ? 'Archive' : 'Live'}</span>
          
          <div className="mt-8 w-full flex items-center justify-between text-[8px] font-mono text-red-400 opacity-0 group-hover/btn:opacity-100 transition-opacity">
            <span>START_GEN</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          </div>
        </button>

        {/* Data Export Card - More compact */}
        <button
          onClick={selectedYear ? handleHistoricalGeoJsonDownload : handleLiveGeoJsonDownload}
          disabled={selectedYear ? isHistoricalDisabled : isLiveDisabled}
          className="relative group/btn flex flex-col items-start p-10 rounded-6 bg-white/5 border border-white/10 hover:border-accent-primary/40 hover:bg-accent-primary/5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-left overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/btn:opacity-40 transition-opacity">
            <span className="material-symbols-outlined text-[20px] text-blue-500">polyline</span>
          </div>

          <div className="mb-6 p-4 rounded-4 bg-blue-500/10 border border-blue-500/20 group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-colors">
            <span className="material-symbols-outlined text-[14px] text-blue-500 group-hover/btn:text-white">database</span>
          </div>
          
          <span className="text-white font-bold text-[12px] leading-none">Geospatial Data</span>
          <span className="text-[9px] text-text-muted mt-1">GeoJSON • Vector</span>

          <div className="mt-8 w-full flex items-center justify-between text-[8px] font-mono text-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity">
            <span>EXTRACT_VEC</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          </div>
        </button>
      </div>

      <div className="mt-16 pt-12 border-t border-white/5 flex items-center gap-8 text-[10px] text-text-muted italic">
        <span className="material-symbols-outlined text-[12px]">verified_user</span>
        <p>Verified SAR Extraction Pipelines Active</p>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-accent-primary/5 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}
