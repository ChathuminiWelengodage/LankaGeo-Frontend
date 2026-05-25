'use client';

import React, { useEffect, useState } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { useFloodData } from '@/hooks/useFloodData';
import MapToggleControls from './controls/MapToggleControls';

interface FloodZoneMapProps {
  center: { lat: number; lng: number } | null;
  geoJsonData?: Record<string, unknown> | null;
  tileUrl?: string;
}

const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 }; // Center of Sri Lanka
const DEFAULT_ZOOM = 8;

export default function FloodZoneMap({ center, geoJsonData, tileUrl }: FloodZoneMapProps) {
  const map = useMap();
  const { addGeoJson } = useFloodData(map);
  
  // Layer states
  const [heatmapActive, setHeatmapActive] = useState(true);
  const [boundariesActive, setBoundariesActive] = useState(true);
  const [mapType, setMapType] = useState<'hybrid' | 'terrain'>('hybrid');

  // SCRUM-94: Handle Raster Tile Overlay
  useEffect(() => {
    if (!map || !tileUrl || typeof google === 'undefined') return;

    const tileLayer = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        return tileUrl
          .replace('{x}', coord.x.toString())
          .replace('{y}', coord.y.toString())
          .replace('{z}', zoom.toString());
      },
      tileSize: new google.maps.Size(256, 256),
      name: 'FloodHeatmap',
      opacity: heatmapActive ? 0.6 : 0,
    });

    map.overlayMapTypes.push(tileLayer);

    return () => {
      const arr = map.overlayMapTypes.getArray();
      const idx = arr.indexOf(tileLayer);
      if (idx !== -1) {
        map.overlayMapTypes.removeAt(idx);
      }
    };
  }, [map, tileUrl, heatmapActive]);

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
