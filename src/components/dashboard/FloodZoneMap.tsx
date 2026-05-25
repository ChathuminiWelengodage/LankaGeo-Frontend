'use client';

import React, { useEffect, useState } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { useFloodData } from '@/hooks/useFloodData';
import MapToggleControls from './controls/MapToggleControls';

interface FloodZoneMapProps {
  center: { lat: number; lng: number } | null;
  geoJsonData?: Record<string, unknown> | null;
}

const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 }; // Center of Sri Lanka
const DEFAULT_ZOOM = 8;

export default function FloodZoneMap({ center, geoJsonData }: FloodZoneMapProps) {
  const map = useMap();
  const { addGeoJson } = useFloodData(map);
  
  // Layer states
  const [heatmapActive, setHeatmapActive] = useState(true);
  const [boundariesActive, setBoundariesActive] = useState(true);
  const [mapType, setMapType] = useState<'hybrid' | 'terrain'>('hybrid');

  useEffect(() => {
    if (map && geoJsonData) {
      addGeoJson(geoJsonData);
    }
  }, [map, geoJsonData, addGeoJson]);

  // Handle Heatmap Toggle (ImageMapType layer)
  useEffect(() => {
    if (!map) return;
    
    // We search for layers that might be ImageMapTypes
    // Since we don't have the specific layer reference yet, 
    // we'll implement a way to find and toggle them if they exist.
    map.overlayMapTypes.forEach((layer, index) => {
      if (layer && 'setOpacity' in (layer as any)) {
        (layer as any).setOpacity(heatmapActive ? 1.0 : 0);
      }
    });
  }, [map, heatmapActive]);

  // Handle Boundaries Toggle (map.data visibility)
  useEffect(() => {
    if (!map) return;
    
    if (boundariesActive) {
      map.data.setStyle((feature) => {
        // Re-trigger the styling from useFloodData logic 
        // by forcing a style update
        return (map.data.getStyle() as any);
      });
      // Set to visible (default for data layer)
      map.data.setMap(map);
    } else {
      map.data.setMap(null);
    }
  }, [map, boundariesActive]);

  return (
    <div className="w-full h-full relative">
      <Map
        mapId="flood_zone_map"
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        center={center}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapTypeId={mapType}
        className="w-full h-full"
      >
        {/* The Data Layer is managed via useFloodData hook */}
      </Map>

      <MapToggleControls 
        heatmapActive={heatmapActive}
        onHeatmapToggle={() => setHeatmapActive(!heatmapActive)}
        boundariesActive={boundariesActive}
        onBoundariesToggle={() => setBoundariesActive(!boundariesActive)}
        baseMapType={mapType}
        onBaseMapToggle={() => setMapType(mapType === 'hybrid' ? 'terrain' : 'hybrid')}
      />
    </div>
  );
}
