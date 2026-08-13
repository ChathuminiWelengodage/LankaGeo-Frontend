'use client';

import { useHistorical } from '@/context/HistoricalContext';

import HistoricalYearStepper from './HistoricalYearStepper';
import HistoricalStatsCard from './HistoricalStatsCard';
import FFITrendChart from './FFITrendChart';

export default function HistoricalRiskView() {
  const { 
    currentData, 
    isTrendLoading, 
    trendError, 
    fetchTrendData, 
    lastCoordinates, 
    dismissTrendError,
  } = useHistorical();

  // Severity breakdown based on total zones
  const getSeverityBreakdown = (total: number) => {
    const critical = Math.floor(total * 0.3);
    const moderate = Math.floor(total * 0.5);
    const low = total - critical - moderate;
    return { critical, moderate, low };
  };

  const { critical, moderate, low } = getSeverityBreakdown(currentData?.total_zones || 0);

  return (
    <div className="h-full p-4 flex flex-col justify-between overflow-hidden relative min-h-0">

      {/* LOADING OVERLAY */}
      {isTrendLoading && (
        <div className="absolute inset-0 z-20 bg-sys-layer-01/85 backdrop-blur-sm flex flex-col items-center justify-center rounded-8 animate-in fade-in duration-300 border border-white/5 m-4">
          <div className="w-10 h-10 border-4 border-[#14B8A6]/20 border-t-[#14B8A6] rounded-full animate-spin mb-3"></div>
          <p className="text-white font-medium text-[13px]">
            Analyzing Historical Trends...
          </p>
          <p className="text-text-secondary text-[11px] font-mono mt-1">
            Compiling 5-Year Data
          </p>
        </div>
      )}

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">

        {/* Error Banners */}
        {trendError === 'timeout' && (
          <div className="bg-ruby-alert/10 border border-ruby-alert/30 p-3 rounded-8 flex items-start gap-3 shrink-0 animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-ruby-alert text-[20px]">timer</span>
            <div className="flex-1">
              <h4 className="text-ruby-alert text-[12px] font-bold">Analysis Timed Out</h4>
              <p className="text-text-secondary text-[11px] mt-0.5">The trend analysis took too long to respond.</p>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <button onClick={dismissTrendError} className="text-text-muted hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
              {lastCoordinates && (
                <button 
                  onClick={() => fetchTrendData(lastCoordinates.lat, lastCoordinates.lng)}
                  className="text-ruby-alert text-[10px] font-bold uppercase tracking-wider hover:underline"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {trendError === 'generic' && (
          <div className="bg-ruby-alert/10 border border-ruby-alert/30 p-3 rounded-8 flex items-start gap-3 shrink-0 animate-in fade-in slide-in-from-top-2">
            <span className="material-symbols-outlined text-ruby-alert text-[20px]">error</span>
            <div className="flex-1">
              <h4 className="text-ruby-alert text-[12px] font-bold">Failed to Load Data</h4>
              <p className="text-text-secondary text-[11px] mt-0.5">Could not retrieve historical trend data.</p>
            </div>
            <button onClick={dismissTrendError} className="text-text-muted hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Source Badge */}
        <div className="flex shrink-0">
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]"></span>
            <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider font-bold">
              Source: Sentinel-2 Optical
            </span>
          </div>
        </div>

        {/* Temporal Selection */}
        <div className="space-y-1 shrink-0">
          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest block ml-1">
            Analysis Year
          </span>
          <HistoricalYearStepper />
        </div>

        {/* Dynamic Space Filling Cards */}
        <div className="flex-1 flex flex-col justify-center min-h-[100px]">
          <HistoricalStatsCard />
        </div>

        <div className="flex-1 flex flex-col justify-center min-h-[130px]">
          <FFITrendChart />
        </div>

        {/* Flood Risk Zones */}
        <div className="space-y-1.5 shrink-0">
          <h4 className="text-white text-[11px] font-bold uppercase tracking-wider ml-1">
            Flood Risk Zones
          </h4>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-ruby-alert/10 border border-ruby-alert/20 p-2.5 rounded-6 flex flex-col items-center gap-1 transition-all hover:bg-ruby-alert/20">
              <span className="text-ruby-alert text-[17px] font-black font-mono leading-none">{critical}</span>
              <span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter">Critical</span>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-6 flex flex-col items-center gap-1 transition-all hover:bg-amber-500/20">
              <span className="text-amber-500 text-[17px] font-black font-mono leading-none">{moderate}</span>
              <span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter">Moderate</span>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-6 flex flex-col items-center gap-1 transition-all hover:bg-emerald-500/20">
              <span className="text-emerald-500 text-[17px] font-black font-mono leading-none">{low}</span>
              <span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter">Seasonal</span>
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono shrink-0 mt-2">
        <div className="flex items-center gap-2">
          
          
        </div>

        
      </div>

    </div>
  );
}