'use client';

import React, { useEffect, useState } from 'react';
import { Map, useMap, MapControl, ControlPosition } from '@vis.gl/react-google-maps';

interface FloodMapProps {
  center: { lat: number; lng: number } | null;
  tileUrl?: string;
}

/**
 * RasterTileLayer component handles the ImageMapType overlay.
 * It uses the useMap hook to access the underlying Google Map instance.
 */
const RasterTileLayer = ({ tileUrl, opacity = 0.6 }: { tileUrl: string; opacity?: number }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !tileUrl || typeof google === 'undefined') return;

    // SCRUM-94: Create ImageMapType for Raster Tile Overlay
    const tileLayer = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        return tileUrl
          .replace('{x}', coord.x.toString())
          .replace('{y}', coord.y.toString())
          .replace('{z}', zoom.toString());
      },
      tileSize: new google.maps.Size(256, 256),
      name: 'FloodHeatmap',
      opacity: opacity, // Set exactly to 0.6 as per requirement
    });

    // Add as an overlay on top of the base map
    map.overlayMapTypes.push(tileLayer);

    // Cleanup logic to remove the overlay when component unmounts or URL changes
    return () => {
      const index = map.overlayMapTypes.getArray().indexOf(tileLayer);
      if (index !== -1) {
        map.overlayMapTypes.removeAt(index);
      }
    };
  }, [map, tileUrl, opacity]);

  return null;
};

/**
 * FloodMap component provides a Google Map with a base layer toggle 
 * and a raster tile overlay for flood analysis.
 */
export default function FloodMap({ center, tileUrl }: FloodMapProps) {
  // SCRUM-93: Set initial mapTypeId to HYBRID
  const [mapTypeId, setMapTypeId] = useState<string>('hybrid');

  // Default center if none provided (center of Sri Lanka)
  const defaultCenter = { lat: 7.8731, lng: 80.7718 };
  const initialCenter = center || defaultCenter;

  return (
    <div className="w-full h-full relative">
      <Map
        defaultCenter={initialCenter}
        defaultZoom={center ? 12 : 7}
        mapTypeId={mapTypeId}
        disableDefaultUI={true} // Cleaner UI for the dashboard
        className="w-full h-full"
      >
        {/* SCRUM-39: Base Map Toggle Control */}
        <MapControl position={ControlPosition.TOP_RIGHT}>
          <div className="m-12 flex bg-sys-layer-02 border border-white/10 rounded-6 overflow-hidden shadow-floating">
            <button
              onClick={() => setMapTypeId('hybrid')}
              className={`px-12 py-8 text-[12px] font-medium transition-colors ${
                mapTypeId === 'hybrid' 
                  ? 'bg-accent-primary text-white' 
                  : 'text-text-secondary hover:bg-white/5'
              }`}
            >
              Hybrid
            </button>
            <button
              onClick={() => setMapTypeId('terrain')}
              className={`px-12 py-8 text-[12px] font-medium transition-colors ${
                mapTypeId === 'terrain' 
                  ? 'bg-accent-primary text-white' 
                  : 'text-text-secondary hover:bg-white/5'
              }`}
            >
              Terrain
            </button>
          </div>
        </MapControl>

        {/* Raster Tile Overlay */}
        {tileUrl && <RasterTileLayer tileUrl={tileUrl} />}
      </Map>

      {/* Placeholder info when no center is selected yet */}
      {!center && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-sys-bg-base/40 backdrop-blur-[2px]">
          <div className="text-center bg-sys-layer-01 p-24 rounded-8 border border-white/5 shadow-dual">
            <span className="material-symbols-outlined text-[48px] text-text-muted mb-16">explore</span>
            <p className="text-white text-[16px]">Select a location to begin analysis</p>
          </div>
        </div>
      )}
    </div>
  );
}
