'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { HistoricalData } from '@/lib/mock-flood-data';

interface ExportPanelProps {
  isLoading: boolean;
  geoJsonData: Record<string, unknown> | null;
  requestId: string | null;
  selectedYear: number | null;
  currentData: HistoricalData;
  yearsData: HistoricalData[];
  locationName?: string;
}

export default function ExportPanel({
  isLoading,
  geoJsonData,
  requestId,
  selectedYear,
  currentData,
  yearsData,
  locationName = 'Region'
}: ExportPanelProps) {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showShareConfirmation, setShowShareConfirmation] = useState(false);

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

  const handleShare = async () => {
    if (!requestId) {
      console.warn('Share failed: No requestId available');
      return;
    }

    // Clean up the pathname to avoid double slashes or missing slashes
    const cleanPath = window.location.pathname.endsWith('/') 
      ? window.location.pathname.slice(0, -1) 
      : window.location.pathname;
    
    const shareUrl = `${window.location.origin}${cleanPath}?result=${requestId}`;
    console.log('Generating shareable link:', shareUrl);
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      
      setShowShareConfirmation(true);
      setTimeout(() => setShowShareConfirmation(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      alert('Failed to copy link to clipboard. Manually copy this URL: ' + shareUrl);
    }
  };

  const handleLivePdfDownload = async () => {
    setIsExportingPdf(true);
    try {
      const blob = await apiFetch('/api/v1/reports/live', {
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
      const blob = await apiFetch('/api/v1/reports/historical', {
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
  const isShareDisabled = isLoading || !requestId || !!selectedYear;

  return (
    <div className="card-standard relative overflow-hidden group/panel !p-4 !rounded-4">
      {/* Decorative scanning line effect */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent -translate-x-full group-hover/panel:translate-x-full transition-transform duration-1000"></div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2 bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-accent-primary text-[12px]">file_download</span>
          </div>
          <div>
            <h3 className="text-white text-[12px] font-bold tracking-tight leading-none">Export</h3>
            <p className="text-[8px] text-text-muted leading-none max-w-[120px]">
              Share analysis link.
            </p>
          </div>
        </div>

        {/* Status Badge - Ultra Compact */}
        <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full border ${
          selectedYear 
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
            : 'bg-accent-primary/10 border-accent-primary/20 text-accent-primary'
        }`}>
          <span className={`w-2 h-2 rounded-full ${selectedYear ? 'bg-blue-400' : 'bg-accent-primary'} animate-pulse`}></span>
          <span className="text-[8px] font-bold uppercase tracking-tighter leading-none">
            {selectedYear ? `Arch: ${selectedYear}` : 'Live'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* PDF Export Card - Ultra Compact */}
        <button
          onClick={selectedYear ? handleHistoricalPdfDownload : handleLivePdfDownload}
          disabled={(selectedYear ? isHistoricalDisabled : isLiveDisabled) || isExportingPdf}
          className="relative group/btn flex flex-col items-center p-2 rounded-2 bg-white/5 border border-white/10 hover:border-accent-primary/40 hover:bg-accent-primary/5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-1 opacity-10 group-hover/btn:opacity-40 transition-opacity">
            <span className="material-symbols-outlined text-[14px] text-red-500">picture_as_pdf</span>
          </div>
          
          <div className="mb-1 p-1 rounded-2 bg-red-500/10 border border-red-500/20 group-hover/btn:bg-red-500 group-hover/btn:text-white transition-colors">
            {isExportingPdf ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined text-[12px] text-red-500 group-hover/btn:text-white">description</span>
            )}
          </div>
          
          <span className="text-white font-bold text-[10px] leading-none">PDF Report</span>
          <span className="text-[7px] text-text-muted leading-none">{selectedYear ? 'Archive' : 'Live'}</span>
          
          <div className="mt-1 w-full flex items-center justify-between text-[7px] font-mono text-red-400 opacity-0 group-hover/btn:opacity-100 transition-opacity">
            <span>GEN</span>
            <span className="material-symbols-outlined text-[8px]">chevron_right</span>
          </div>
        </button>

        {/* Data Export Card - Ultra Compact */}
        <button
          onClick={selectedYear ? handleHistoricalGeoJsonDownload : handleLiveGeoJsonDownload}
          disabled={selectedYear ? isHistoricalDisabled : isLiveDisabled}
          className="relative group/btn flex flex-col items-center p-2 rounded-2 bg-white/5 border border-white/10 hover:border-accent-primary/40 hover:bg-accent-primary/5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-1 opacity-10 group-hover/btn:opacity-40 transition-opacity">
            <span className="material-symbols-outlined text-[14px] text-blue-500">polyline</span>
          </div>

          <div className="mb-1 p-1 rounded-2 bg-blue-500/10 border border-blue-500/20 group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-colors">
            <span className="material-symbols-outlined text-[12px] text-blue-500 group-hover/btn:text-white">database</span>
          </div>
          
          <span className="text-white font-bold text-[10px] leading-none">GeoJSON</span>
          <span className="text-[7px] text-text-muted leading-none">Vector</span>

          <div className="mt-1 w-full flex items-center justify-between text-[7px] font-mono text-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity">
            <span>EXTRACT</span>
            <span className="material-symbols-outlined text-[8px]">chevron_right</span>
          </div>
        </button>

        {/* Share Link Card - Ultra Compact */}
        <button
          onClick={handleShare}
          disabled={isShareDisabled}
          className="relative group/btn flex flex-col items-center p-2 rounded-2 bg-white/5 border border-white/10 hover:border-[#14B8A6]/40 hover:bg-[#14B8A6]/5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-1 opacity-10 group-hover/btn:opacity-40 transition-opacity">
            <span className="material-symbols-outlined text-[14px] text-[#14B8A6]">share</span>
          </div>

          <div className="mb-1 p-1 rounded-2 bg-[#14B8A6]/10 border border-[#14B8A6]/20 group-hover/btn:bg-[#14B8A6] group-hover/btn:text-white transition-colors">
            {showShareConfirmation ? (
              <span className="material-symbols-outlined text-[12px] text-[#14B8A6] group-hover/btn:text-white">check</span>
            ) : (
              <span className="material-symbols-outlined text-[12px] text-[#14B8A6] group-hover/btn:text-white">link</span>
            )}
          </div>
          
          <span className="text-white font-bold text-[10px] leading-none">
            {showShareConfirmation ? 'Copied!' : 'Share'}
          </span>
          <span className="text-[7px] text-text-muted leading-none">{requestId ? 'Active' : 'N/A'}</span>

          <div className="mt-1 w-full flex items-center justify-between text-[7px] font-mono text-[#14B8A6] opacity-0 group-hover/btn:opacity-100 transition-opacity">
            <span>LINK</span>
            <span className="material-symbols-outlined text-[8px]">chevron_right</span>
          </div>
        </button>
      </div>

      <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2 text-[8px] text-text-muted italic leading-none">
        <span className="material-symbols-outlined text-[10px]">verified_user</span>
        <p>Verified SAR Pipeline</p>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent-primary/5 rounded-full blur-xl pointer-events-none"></div>
    </div>
  );
}
