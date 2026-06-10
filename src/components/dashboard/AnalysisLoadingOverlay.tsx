'use client';

import React from 'react';

interface AnalysisLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  error?: 'timeout' | 'offline' | 'notFound' | null;
  onRetry?: () => void;
}

/**
 * AnalysisLoadingOverlay component for SCRUM-42.
 * Provides visual feedback during GEE processing.
 */
export default function AnalysisLoadingOverlay({ 
  isLoading, 
  message, 
  error, 
  onRetry 
}: AnalysisLoadingOverlayProps) {
  if (!isLoading && !error) return null;

  return (
    <>
      {/* Loading Overlay - Semi-transparent covering the map */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#11131c]/80 transition-all duration-500 animate-fade-in">
          <div className="text-center animate-zoom-in duration-500">
            <div className="relative mb-24 flex justify-center">
              {/* Outer pulse */}
              <div className="absolute w-64 h-64 rounded-full bg-accent-primary/20 animate-ping"></div>
              {/* Spinner */}
              <div className="relative w-64 h-64 border-4 border-white/10 border-t-accent-primary rounded-full animate-spin"></div>
              {/* Inner icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-accent-primary text-[28px] animate-pulse">satellite_alt</span>
              </div>
            </div>
            
            <div className="space-y-8 px-24">
              <h4 className="text-[16px] font-bold text-white tracking-widest uppercase">Processing GEE Pipeline</h4>
              <p className="text-accent-primary font-mono text-[13px] min-h-[20px] transition-all duration-300">
                {message || 'Initializing...'}
              </p>
            </div>

            {/* Progress bar simulation */}
            <div className="mt-32 w-128 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-accent-primary animate-[loading-bar_15s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error Banners - Non-blocking UI at the top (SCRUM-101) */}
      {error && (
        <div className="absolute top-16 left-0 right-0 z-[60] flex justify-center px-16 pointer-events-none">
          <div className="max-w-xl w-full bg-sys-layer-01/95 backdrop-blur-sm border border-ruby-alert/40 rounded-6 shadow-floating p-16 flex items-center justify-between gap-16 animate-slide-in-from-top duration-500 pointer-events-auto">
            <div className="flex items-center gap-12">
              <div className="w-40 h-40 bg-ruby-alert/20 rounded-full flex items-center justify-center flex-shrink-0 border border-ruby-alert/30">
                <span className="material-symbols-outlined text-ruby-alert text-[20px]">
                  {error === 'timeout' ? 'timer_off' : error === 'offline' ? 'cloud_off' : 'error'}
                </span>
              </div>
              <div>
                <h3 className="text-white text-[14px] font-bold m-0 leading-tight uppercase tracking-tight">
                  {error === 'timeout' ? 'Analysis Timeout (504)' : error === 'offline' ? 'Connection Lost' : 'Result Not Found (404)'}
                </h3>
                <p className="text-text-secondary text-[12px] m-0 mt-2 line-clamp-1">
                  {error === 'timeout' 
                    ? 'The Google Earth Engine computation took longer than expected.' 
                    : error === 'offline'
                    ? 'You are currently offline. Please check internet connection.'
                    : 'The requested analysis result does not exist or has expired.'}
                </p>
              </div>
            </div>

            {error !== 'notFound' && (
              <button 
                onClick={onRetry}
                className="btn-primary h-36 px-16 gap-8 bg-ruby-alert hover:bg-ruby-alert/80 border-none text-[12px] font-bold flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                {error === 'timeout' ? 'Retry Analysis' : 'Reconnect & Retry'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
