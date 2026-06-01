'use client';

import React from 'react';

export interface ImpactAssessmentProps {
  estimated_population: number;
  buildings_exposed: number;
  road_length_km: number;
  cropland_area_km2: number;
}

/**
 * ImpactAssessment Component
 * Renders "Row 2" of the results stats bar containing impact metrics and source attributions.
 */
const ImpactAssessment: React.FC<ImpactAssessmentProps> = ({
  estimated_population,
  buildings_exposed,
  road_length_km,
  cropland_area_km2,
}) => {
  const formatNumber = (num: number) => num.toLocaleString();
  const formatDecimal = (num: number) => num.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const metrics = [
    {
      label: 'Estimated Population',
      value: formatNumber(estimated_population),
      unit: 'people',
      color: 'text-accent-primary'
    },
    {
      label: 'Buildings Exposed',
      value: formatNumber(buildings_exposed),
      unit: 'structures',
      color: 'text-ruby-alert'
    },
    {
      label: 'Road Length',
      value: formatDecimal(road_length_km),
      unit: 'km',
      color: 'text-magenta-glow'
    },
    {
      label: 'Cropland Area',
      value: formatDecimal(cropland_area_km2),
      unit: 'km²',
      color: 'text-[#24a148]' // Green
    }
  ];

  return (
    <div className="w-full space-y-16">
      <div className="flex items-center gap-12 px-4">
        <div className="h-1 w-24 bg-accent-primary"></div>
        <h2 className="text-[14px] font-bold tracking-widest uppercase text-text-primary">Impact Assessment</h2>
      </div>

      <div className="space-y-12">
        {/* Metrics Row (Row 2) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1 border border-white/10 bg-white/5 rounded-6 overflow-hidden">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="bg-sys-layer-01 p-16 flex flex-col justify-center transition-all hover:bg-sys-layer-02"
            >
              <p className="text-text-muted text-[10px] font-medium uppercase tracking-wider mb-8">
                {metric.label}
              </p>
              <div className="flex items-baseline gap-6">
                <span className={`text-[24px] font-mono font-bold leading-none ${metric.color}`}>
                  {metric.value}
                </span>
                <span className="text-text-muted text-[11px] font-medium uppercase tracking-tight">
                  {metric.unit}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Source Attributions */}
        <div className="flex flex-wrap items-center gap-x-16 gap-y-8 px-4">
          <div className="flex items-center gap-6">
            <span className="w-2 h-2 rounded-full bg-text-muted"></span>
            <span className="text-text-muted text-[10px] uppercase tracking-widest font-semibold">Sources:</span>
          </div>
          <div className="flex gap-12">
            {['WorldPop', 'ESA WorldCover', 'OSM'].map((source) => (
              <span 
                key={source} 
                className="text-text-muted text-[10px] hover:text-text-secondary transition-colors cursor-default border-b border-transparent hover:border-text-secondary/30 pb-1"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactAssessment;
