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
  locationName = 'Region',
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

  // Share result
  const handleShare = async () => {
    if (!requestId) {
      console.warn('Share failed: No requestId available');
      return;
    }

    const cleanPath = window.location.pathname.endsWith('/')
      ? window.location.pathname.slice(0, -1)
      : window.location.pathname;

    const shareUrl = `${window.location.origin}${cleanPath}?result=${requestId}`;

    console.log('Generating shareable link:', shareUrl);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');

        textArea.value = shareUrl;
        document.body.appendChild(textArea);

        textArea.select();
        document.execCommand('copy');

        document.body.removeChild(textArea);
      }

      setShowShareConfirmation(true);

      setTimeout(() => {
        setShowShareConfirmation(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);

      alert(
        'Failed to copy link to clipboard. Manually copy this URL: ' +
          shareUrl
      );
    }
  };

  // Live PDF download
  const handleLivePdfDownload = async () => {
    setIsExportingPdf(true);

    try {
      const blob = await apiFetch('/api/v1/reports/live', {
        method: 'POST',
        responseType: 'blob',
        body: JSON.stringify({
          geoJsonData,
          location: locationName,
          timestamp: new Date().toISOString(),
        }),
      });

      triggerDownload(
        blob,
        `LG-LIVE-REPORT-${locationName.replace(/\s+/g, '-')}-${new Date()
          .toISOString()
          .split('T')[0]}.pdf`
      );
    } catch (error) {
      console.error('Failed to download live PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Live GeoJSON download
  const handleLiveGeoJsonDownload = () => {
    if (!geoJsonData) return;

    const blob = new Blob(
      [JSON.stringify(geoJsonData, null, 2)],
      {
        type: 'application/json',
      }
    );

    const date = new Date().toISOString().split('T')[0];
    const region = locationName.replace(/\s+/g, '-');

    triggerDownload(
      blob,
      `LG-LIVE-${region}-${date}.geojson`
    );
  };

  // Historical PDF download
  const handleHistoricalPdfDownload = async () => {
    setIsExportingPdf(true);

    try {
      const blob = await apiFetch('/api/v1/reports/historical', {
        method: 'POST',
        responseType: 'blob',
        body: JSON.stringify({
          year: selectedYear,
          historicalData: currentData,
          allYears: yearsData,
        }),
      });

      const filename = selectedYear
        ? `LG-HISTORICAL-${selectedYear}-REPORT.pdf`
        : `LG-HISTORICAL-COMPOSITE-REPORT.pdf`;

      triggerDownload(blob, filename);
    } catch (error) {
      console.error(
        'Failed to download historical PDF:',
        error
      );

      alert(
        'Failed to generate PDF report. Please try again.'
      );
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Historical GeoJSON download
  const handleHistoricalGeoJsonDownload = () => {
    const exportData = {
      type: 'FeatureCollection',
      metadata: {
        generated_at: new Date().toISOString(),
        view_type: selectedYear
          ? 'year-specific'
          : 'composite',
        year: selectedYear,
      },
      data: selectedYear ? [currentData] : yearsData,
    };

    const blob = new Blob(
      [JSON.stringify(exportData, null, 2)],
      {
        type: 'application/json',
      }
    );

    const filename = selectedYear
      ? `LG-HISTORICAL-${selectedYear}.geojson`
      : `LG-HISTORICAL-COMPOSITE.geojson`;

    triggerDownload(blob, filename);
  };

  const isLiveDisabled =
    isLoading || !geoJsonData;

  const isHistoricalDisabled = isLoading;

  const isShareDisabled =
    isLoading || !requestId || !!selectedYear;

  return (
    <div className="bg-sys-layer-01 border border-white/5 rounded-4 shadow-dual relative overflow-hidden group/panel p-4">

      {/* Decorative scanning line */}
      <div
        className="
          absolute top-0 left-0 w-full h-px
          bg-gradient-to-r
          from-transparent
          via-accent-primary/40
          to-transparent
          -translate-x-full
          group-hover/panel:translate-x-full
          transition-transform duration-1000
        "
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">

          <div
            className="
              w-10 h-10
              rounded-2
              bg-accent-primary/10
              border border-accent-primary/20
              flex items-center justify-center
            "
          >
            <span className="material-symbols-outlined text-accent-primary text-[12px]">
              file_download
            </span>
          </div>

          <div>
            <h3 className="text-white text-[12px] font-bold tracking-tight leading-none">
              Export
            </h3>
          </div>

        </div>

        
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

        {/* ================= PDF ================= */}
        <button
          onClick={
            selectedYear
              ? handleHistoricalPdfDownload
              : handleLivePdfDownload
          }
          disabled={
            (selectedYear
              ? isHistoricalDisabled
              : isLiveDisabled) || isExportingPdf
          }
          className="
            relative
            group/btn
            flex flex-col
            items-center
            justify-center
            p-3
            rounded-2
            bg-white/5
            border border-white/10
            hover:border-accent-primary/40
            hover:bg-accent-primary/5
            transition-all duration-300
            disabled:opacity-30
            disabled:cursor-not-allowed
            text-center
            overflow-hidden
          "
        >
          {/* Top-right icon */}
          <div
            className="
              absolute top-0 right-0
              p-1
              opacity-10
              group-hover/btn:opacity-40
              transition-opacity
            "
          >
            <span className="material-symbols-outlined text-[14px] text-red-500">
              picture_as_pdf
            </span>
          </div>

          {/* Main icon */}
          <div
            className="
              mb-1
              p-2
              rounded-2
              bg-red-500/10
              border border-red-500/20
              group-hover/btn:bg-red-500
              group-hover/btn:text-white
              transition-colors
            "
          >
            {isExportingPdf ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[14px] text-red-500 group-hover/btn:text-white">
                description
              </span>
            )}
          </div>

          {/* Only main title */}
          <span className="text-white font-bold text-[10px] leading-none">
            PDF Report
          </span>
        </button>

        {/* ================= GEOJSON ================= */}
        <button
          onClick={
            selectedYear
              ? handleHistoricalGeoJsonDownload
              : handleLiveGeoJsonDownload
          }
          disabled={
            selectedYear
              ? isHistoricalDisabled
              : isLiveDisabled
          }
          className="
            relative
            group/btn
            flex flex-col
            items-center
            justify-center
            p-3
            rounded-2
            bg-white/5
            border border-white/10
            hover:border-accent-primary/40
            hover:bg-accent-primary/5
            transition-all duration-300
            disabled:opacity-30
            disabled:cursor-not-allowed
            text-center
            overflow-hidden
          "
        >
          {/* Top-right icon */}
          <div
            className="
              absolute top-0 right-0
              p-1
              opacity-10
              group-hover/btn:opacity-40
              transition-opacity
            "
          >
            <span className="material-symbols-outlined text-[14px] text-blue-500">
              polyline
            </span>
          </div>

          {/* Main icon */}
          <div
            className="
              mb-1
              p-2
              rounded-2
              bg-blue-500/10
              border border-blue-500/20
              group-hover/btn:bg-blue-500
              group-hover/btn:text-white
              transition-colors
            "
          >
            <span className="material-symbols-outlined text-[14px] text-blue-500 group-hover/btn:text-white">
              database
            </span>
          </div>

          {/* Only main title */}
          <span className="text-white font-bold text-[10px] leading-none">
            GeoJSON
          </span>
        </button>

        {/* ================= SHARE ================= */}
        <button
          onClick={handleShare}
          disabled={isShareDisabled}
          className="
            relative
            group/btn
            flex flex-col
            items-center
            justify-center
            p-3
            rounded-2
            bg-white/5
            border border-white/10
            hover:border-[#14B8A6]/40
            hover:bg-[#14B8A6]/5
            transition-all duration-300
            disabled:opacity-30
            disabled:cursor-not-allowed
            text-center
            overflow-hidden
          "
        >
          {/* Top-right icon */}
          <div
            className="
              absolute top-0 right-0
              p-1
              opacity-10
              group-hover/btn:opacity-40
              transition-opacity
            "
          >
            <span className="material-symbols-outlined text-[14px] text-[#14B8A6]">
              share
            </span>
          </div>

          {/* Main icon */}
          <div
            className="
              mb-1
              p-2
              rounded-2
              bg-[#14B8A6]/10
              border border-[#14B8A6]/20
              group-hover/btn:bg-[#14B8A6]
              group-hover/btn:text-white
              transition-colors
            "
          >
            {showShareConfirmation ? (
              <span className="material-symbols-outlined text-[14px] text-[#14B8A6] group-hover/btn:text-white">
                check
              </span>
            ) : (
              <span className="material-symbols-outlined text-[14px] text-[#14B8A6] group-hover/btn:text-white">
                link
              </span>
            )}
          </div>

          {/* Only main title */}
          <span className="text-white font-bold text-[10px] leading-none">
            {showShareConfirmation ? 'Copied!' : 'Share'}
          </span>
        </button>

      </div>

      {/* Background decoration */}
      <div
        className="
          absolute
          -bottom-8
          -right-8
          w-32
          h-32
          bg-accent-primary/5
          rounded-full
          blur-xl
          pointer-events-none
        "
      />
    </div>
  );
}