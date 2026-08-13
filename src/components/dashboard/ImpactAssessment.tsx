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
 * Renders a high-fidelity 'Situation Report' for environmental impact.
 */
const ImpactAssessment: React.FC<ImpactAssessmentProps> = ({
  estimated_population,
  buildings_exposed,
  road_length_km,
  cropland_area_km2,
}) => {
  const formatNumber = (num: number) => num.toLocaleString();
  const formatDecimal = (num: number) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const metrics = [
    {
      label: 'Population Exposure',
      value: formatNumber(estimated_population),
      unit: 'people',
      icon: 'groups',
      color: 'text-accent-primary',
      bg: 'bg-accent-primary/10',
      description: 'Residents within detected flood zone.'
    },
    {
      label: 'Structural Risk',
      value: formatNumber(buildings_exposed),
      unit: 'buildings',
      icon: 'domain',
      color: 'text-ruby-alert',
      bg: 'bg-ruby-alert/10',
      description: 'Critical and residential infrastructure.'
    },
    {
      label: 'Logistics Impact',
      value: formatDecimal(road_length_km),
      unit: 'km',
      icon: 'alt_route',
      color: 'text-magenta-glow',
      bg: 'bg-magenta-glow/10',
      description: 'Affected transport network segments.'
    },
    {
      label: 'Agricultural Area',
      value: formatDecimal(cropland_area_km2),
      unit: 'km²',
      icon: 'potted_plant',
      color: 'text-[#24a148]',
      bg: 'bg-[#24a148]/10',
      description: 'Active cropland and primary vegetation.'
    }
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Section */}
      <div className="px-4">
        <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight uppercase text-white">
          Impact Assessment
        </h2>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="group card-standard !p-0 overflow-hidden relative"
          >
            {/* Hover Accent */}
            <div className={`absolute top-0 left-0 w-full h-2 ${metric.bg} transition-all duration-300 group-hover:h-full group-hover:opacity-5`}></div>
            
            <div className="p-5 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-8 h-8 rounded-6 ${metric.bg} flex items-center justify-center border border-white/5`}>
                  <span className={`material-symbols-outlined text-[18px] ${metric.color}`}>{metric.icon}</span>
                </div>
                <span className="material-symbols-outlined text-white/30 text-[16px] group-hover:text-white transition-colors">info</span>
              </div>

              <div className="space-y-1">
                <p className="text-white text-[10px] font-bold uppercase tracking-wider">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] font-mono font-bold leading-none tracking-tight text-white">
                    {metric.value}
                  </span>
                  <span className="text-white/70 text-[11px] font-bold uppercase tracking-tighter">
                    {metric.unit}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-[10px] text-white/80 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {metric.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactAssessment;
