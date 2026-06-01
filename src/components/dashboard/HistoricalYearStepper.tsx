'use client';

import React from 'react';
import { useHistorical } from '@/context/HistoricalContext';

export default function HistoricalYearStepper() {
  const { selectedYear, yearsData, selectYear, isTransitioning } = useHistorical();

  const handlePrev = () => {
    if (selectedYear === null) return;
    const currentIndex = yearsData.findIndex(y => y.year === selectedYear);
    if (currentIndex > 0) {
      selectYear(yearsData[currentIndex - 1].year);
    }
  };

  const handleNext = () => {
    if (selectedYear === null) {
      selectYear(yearsData[0].year);
      return;
    }
    const currentIndex = yearsData.findIndex(y => y.year === selectedYear);
    if (currentIndex < yearsData.length - 1) {
      selectYear(yearsData[currentIndex + 1].year);
    }
  };

  const isFirstYear = selectedYear === yearsData[0]?.year;
  const isLastYear = selectedYear === yearsData[yearsData.length - 1]?.year;

  return (
    <div className="flex flex-col gap-16 w-full">
      <div className="flex items-center justify-between bg-sys-layer-01/80 backdrop-blur-md p-16 rounded-8 border border-white/5 shadow-dual">
        <div className="flex items-center gap-16">
          <button
            onClick={handlePrev}
            disabled={isFirstYear || isTransitioning || selectedYear === null}
            className="p-8 rounded-8 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-white">chevron_left</span>
          </button>

          <div className="flex items-center gap-8">
            {yearsData.map((data) => (
              <button
                key={data.year}
                onClick={() => selectYear(data.year)}
                disabled={isTransitioning}
                className={`px-16 py-8 rounded-full text-[13px] font-medium transition-all duration-300 ${
                  selectedYear === data.year
                    ? 'bg-[#14B8A6] text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]'
                    : 'text-text-secondary hover:bg-white/5'
                }`}
              >
                {data.year}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={isLastYear || isTransitioning}
            className="p-8 rounded-8 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-white">chevron_right</span>
          </button>
        </div>

        <button
          onClick={() => selectYear(null)}
          disabled={isTransitioning}
          className={`px-16 py-8 rounded-8 text-[12px] font-medium transition-colors ${
            selectedYear === null
              ? 'bg-white/10 text-white'
              : 'text-text-muted hover:text-white hover:bg-white/5'
          }`}
        >
          Clear Selection
        </button>
      </div>

      {/* Floating Status Label */}
      <div className="flex items-center gap-8 px-16">
        <div className="w-8 h-8 rounded-full bg-[#14B8A6] animate-pulse"></div>
        <span className="text-[12px] font-mono text-text-secondary tracking-wide uppercase">
          {selectedYear 
            ? `Displaying Inundation Heatmap: ${selectedYear}`
            : '5-Year Cumulative Frequency Composite'}
        </span>
      </div>
    </div>
  );
}
