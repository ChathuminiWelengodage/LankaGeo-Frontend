'use client';

import React, { useEffect, useState } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { useFloodData } from '@/hooks/useFloodData';
import MapToggleControls from './controls/MapToggleControls';
import { useHistorical } from '@/context/HistoricalContext';
import HydrologicalStations from './HydrologicalStations';

interface FloodZoneMapProps {
  center: { lat: number; lng: number } | null;
  geoJsonData?: Record<string, unknown> | null;
}

const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 }; // Center of Sri Lanka
const DEFAULT_ZOOM = 8;

/**
 * FloodZoneMap component provides a sharp, native Google Maps view.
 * It removes custom Raster Tile Overlays that were causing blurriness.
 */
export default function FloodZoneMap({ center, geoJsonData }: FloodZoneMapProps) {
  const map = useMap();
  const { addGeoJson } = useFloodData(map);
  const { setTransitioning } = useHistorical();
  
  // Layer states
  const [heatmapActive, setHeatmapActive] = useState(true);
  const [boundariesActive, setBoundariesActive] = useState(true);
  const [mapType, setMapType] = useState<'hybrid' | 'terrain'>('hybrid');

  // Handle GeoJSON data updates
  useEffect(() => {
    if (map && geoJsonData) {
      addGeoJson(geoJsonData);
    }
  }, [map, geoJsonData, addGeoJson]);

  // Handle Boundaries Toggle (map.data visibility)
  useEffect(() => {
    if (!map) return;
    
    if (boundariesActive) {
      map.data.setStyle((map.data.getStyle() as google.maps.Data.StylingFunction) || {});
      map.data.setMap(map);
    } else {
      map.data.setMap(null);
    }
  }, [map, boundariesActive]);

  // Reset transitioning state (previously used for tile animation)
  useEffect(() => {
    setTransitioning(false);
  }, [setTransitioning]);

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
        <HydrologicalStations />
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
