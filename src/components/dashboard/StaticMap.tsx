'use client';

import React from 'react';

interface StaticMapProps {
  location: string;
  width?: number;
  height?: number;
  zoom?: number;
  maptype?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
}

/**
 * StaticMap component that displays a non-interactive map image 
 * using the Google Maps Static API.
 */
export default function StaticMap({ 
  location, 
  width = 600, 
  height = 300, 
  zoom = 13, 
  maptype = 'roadmap' 
}: StaticMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STATIC_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) return null;

  const encodedLocation = encodeURIComponent(location);
  const url = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=${zoom}&size=${width}x${height}&maptype=${maptype}&key=${apiKey}&style=feature:all|element:all|saturation:-100|lightness:-20&style=feature:water|element:geometry|color:0x000000`;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-4 border border-white/10 group">
      <img 
        src={url} 
        alt={`Map of ${location}`} 
        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-12 left-12 flex items-center gap-6">
        <span className="material-symbols-outlined text-[14px] text-accent-primary">location_on</span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-white">{location}</span>
      </div>
    </div>
  );
}
