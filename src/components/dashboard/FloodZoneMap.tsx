'use client';

import React, { useEffect } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { useFloodData } from '@/hooks/useFloodData';

interface FloodZoneMapProps {
  center: { lat: number; lng: number } | null;
  geoJsonData?: Record<string, unknown> | null;
}

const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 }; // Center of Sri Lanka
const DEFAULT_ZOOM = 8;

export default function FloodZoneMap({ center, geoJsonData }: FloodZoneMapProps) {
  const map = useMap();
  const { addGeoJson } = useFloodData(map);

  useEffect(() => {
    if (map && geoJsonData) {
      addGeoJson(geoJsonData);
    }
  }, [map, geoJsonData, addGeoJson]);

  return (
    <Map
      mapId="flood_zone_map"
      defaultCenter={DEFAULT_CENTER}
      defaultZoom={DEFAULT_ZOOM}
      center={center}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      className="w-full h-full"
    >
      {/* The Data Layer is managed via useFloodData hook */}
    </Map>
  );
}
