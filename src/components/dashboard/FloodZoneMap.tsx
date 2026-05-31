'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { useFloodData } from '@/hooks/useFloodData';
import MapToggleControls from './controls/MapToggleControls';
import { useHistorical } from '@/context/HistoricalContext';
import HydrologicalStations from './HydrologicalStations';

interface FloodZoneMapProps {
  center: { lat: number; lng: number } | null;
  geoJsonData?: Record<string, unknown> | null;
  tileUrl?: string; // Fallback or current live tile
}

const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 }; // Center of Sri Lanka
const DEFAULT_ZOOM = 8;
const TRANSITION_DURATION = 300; // ms

export default function FloodZoneMap({ center, geoJsonData, tileUrl: liveTileUrl }: FloodZoneMapProps) {
  const map = useMap();
  const { addGeoJson } = useFloodData(map);
  const { currentData, setTransitioning } = useHistorical();
  
  // Layer states
  const [heatmapActive, setHeatmapActive] = useState(true);
  const [boundariesActive, setBoundariesActive] = useState(true);
  const [mapType, setMapType] = useState<'hybrid' | 'terrain'>('hybrid');

  const activeLayersRef = useRef<google.maps.ImageMapType[]>([]);
  const currentTileUrlRef = useRef<string | null>(null);

  // SCRUM-94: Handle Raster Tile Overlay with Smooth Cross-Fade
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;

    const targetUrl = currentData.tile_url || liveTileUrl;
    if (!targetUrl || targetUrl === currentTileUrlRef.current) return;

    setTransitioning(true);

    const newLayer = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        return targetUrl
          .replace('{x}', coord.x.toString())
          .replace('{y}', coord.y.toString())
          .replace('{z}', zoom.toString());
      },
      tileSize: new google.maps.Size(256, 256),
      opacity: 0,
    });

    // Add new layer to map
    map.overlayMapTypes.push(newLayer);
    const oldLayers = [...activeLayersRef.current];
    activeLayersRef.current = [newLayer];
    currentTileUrlRef.current = targetUrl;

    // Animate Cross-Fade
    let start: number | null = null;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / TRANSITION_DURATION, 1);
      
      const displayOpacity = heatmapActive ? opacity : 0;
      newLayer.setOpacity(displayOpacity);
      
      oldLayers.forEach(layer => {
        const oldOpacity = heatmapActive ? (1 - opacity) : 0;
        layer.setOpacity(oldOpacity);
      });

      if (progress < TRANSITION_DURATION) {
        requestAnimationFrame(animate);
      } else {
        // Cleanup old layers
        oldLayers.forEach(layer => {
          const idx = map.overlayMapTypes.getArray().indexOf(layer);
          if (idx !== -1) map.overlayMapTypes.removeAt(idx);
        });
        setTransitioning(false);
      }
    };

    requestAnimationFrame(animate);
  }, [map, currentData.tile_url, liveTileUrl, heatmapActive, setTransitioning]);

  // Handle Heatmap Toggle Opacity
  useEffect(() => {
    activeLayersRef.current.forEach(layer => {
      layer.setOpacity(heatmapActive ? 1 : 0);
    });
  }, [heatmapActive]);

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
