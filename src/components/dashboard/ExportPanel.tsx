'use client';

import React, { useState } from 'react';
import { useHistorical } from '@/context/HistoricalContext';
import { apiFetch } from '@/lib/api';

interface ExportPanelProps {
  isAnalysisComplete: boolean;
  geoJsonData: Record<string, unknown> | null;
  region?: string;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ 
  isAnalysisComplete, 
  geoJsonData, 
  region = 'SL' 
}) => {
  const { selectedYear, yearsData, currentData } = useHistorical();
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const isLiveView = selectedYear === null;

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLivePDFExport = async () => {
    if (!isAnalysisComplete || isExportingPDF) return;

    setIsExportingPDF(true);
    try {
      const blob = await apiFetch('/reports/live', {
        method: 'POST',
        responseType: 'blob',
        body: JSON.stringify({
          region,
          data: geoJsonData,
          timestamp: new Date().toISOString()
        })
      });

      const date = new Date().toISOString().split('T')[0];
      triggerDownload(blob, `LG-LIVE-REPORT-${region}-${date}.pdf`);
    } catch (error) {
      console.error('Error exporting Live PDF:', error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleHistoricalPDFExport = async () => {
    if (!isAnalysisComplete || isExportingPDF) return;

    setIsExportingPDF(true);
    try {
      const blob = await apiFetch('/reports/historical', {
        method: 'POST',
        responseType: 'blob',
        body: JSON.stringify({
          year: selectedYear,
          region,
          data: currentData,
          timestamp: new Date().toISOString()
        })
      });

      const date = new Date().toISOString().split('T')[0];
      triggerDownload(blob, `LG-HISTORICAL-REPORT-${region}-${selectedYear}-${date}.pdf`);
    } catch (error) {
      console.error('Error exporting Historical PDF:', error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleLiveGeoJSONExport = () => {
    if (!isAnalysisComplete || !geoJsonData) return;

    const date = new Date().toISOString().split('T')[0];
    const filename = `LG-LIVE-${region}-${date}.geojson`;
    
    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/geo+json' });
    triggerDownload(blob, filename);
  };

  const handleHistoricalGeoJSONExport = () => {
    if (!isAnalysisComplete) return;

    // Generate export from the client-side years_data[] composite object (SCRUM-134)
    const exportData = {
      type: "FeatureCollection",
      features: yearsData.map(year => ({
        type: "Feature",
        properties: { 
          year: year.year,
          total_zones: year.total_zones,
          flood_frequency_index: year.flood_frequency_index,
          max_area_km2: year.max_area_km2,
          impact_summary: year.impact_summary
        },
        geometry: null // Historical summary data might not have geometry in this context
      }))
    };

    const date = new Date().toISOString().split('T')[0];
    const filename = `LG-HISTORICAL-${region}-${date}.geojson`;
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/geo+json' });
    triggerDownload(blob, filename);
  };

  return (
    <div className="card-standard">
      <div className="flex items-center justify-between mb-16">
        <h3 className="text-white text-[18px] font-bold tracking-tight">Export Panel</h3>
        <span className={`text-[11px] px-8 py-2 rounded-full border ${
          isAnalysisComplete 
            ? 'border-[#14B8A6]/30 text-[#14B8A6] bg-[#14B8A6]/5' 
            : 'border-white/10 text-text-muted bg-white/5'
        }`}>
          {isAnalysisComplete ? 'Data Ready' : 'Awaiting Analysis'}
        </span>
      </div>

      <div className="space-y-12">
        <p className="text-text-secondary text-[12px] leading-relaxed">
          {isLiveView 
            ? 'Export current live analysis results, including flood zone delineations and impact metrics.'
            : `Export historical runoff data for the year ${selectedYear}, including FFI trends and macro metrics.`
          }
        </p>

        <div className="grid grid-cols-2 gap-12 pt-8">
          <button
            onClick={isLiveView ? handleLivePDFExport : handleHistoricalPDFExport}
            disabled={!isAnalysisComplete || isExportingPDF}
            className="flex flex-col items-center justify-center gap-8 p-12 bg-white/5 border border-white/10 rounded-8 hover:bg-white/10 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all group"
          >
            {isExportingPDF ? (
              <span className="material-symbols-outlined text-[#14B8A6] animate-spin text-[24px]">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-ruby-alert group-hover:scale-110 transition-transform text-[24px]">picture_as_pdf</span>
            )}
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">PDF Report</span>
          </button>

          <button
            onClick={isLiveView ? handleLiveGeoJSONExport : handleHistoricalGeoJSONExport}
            disabled={!isAnalysisComplete}
            className="flex flex-col items-center justify-center gap-8 p-12 bg-white/5 border border-white/10 rounded-8 hover:bg-white/10 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all group"
          >
            <span className="material-symbols-outlined text-[#14B8A6] group-hover:scale-110 transition-transform text-[24px]">map</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">GeoJSON Data</span>
          </button>
        </div>

        {!isAnalysisComplete && (
          <div className="flex items-center gap-8 p-8 bg-ruby-alert/5 border border-ruby-alert/10 rounded-4 mt-8">
            <span className="material-symbols-outlined text-ruby-alert text-[14px]">info</span>
            <p className="text-ruby-alert/80 text-[10px] uppercase font-bold tracking-tighter">
              Analysis must be completed before export
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportPanel;
