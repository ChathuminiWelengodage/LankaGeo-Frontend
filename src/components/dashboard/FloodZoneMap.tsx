'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Map, useMap, MapControl, ControlPosition, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useFloodData } from '@/hooks/useFloodData';
import MapToggleControls from './controls/MapToggleControls';
import { useHistorical } from '@/context/HistoricalContext';
import HydrologicalStations from './HydrologicalStations';
import MapLegend from './MapLegend';

interface FloodZoneMapProps {
  center: { lat: number; lng: number } | null;
  geoJsonData?: Record<string, unknown> | null;
  tileUrl?: string;
}

const DEFAULT_CENTER = { lat: 7.8731, lng: 80.7718 }; // Center of Sri Lanka
const DEFAULT_ZOOM = 8;
const SEARCH_ZOOM = 13;
const TRANSITION_DURATION = 300;

/**
 * FloodZoneMap component provides a native Google Maps view with 
 * support for GeoJSON data and Raster Tile Overlays (Heatmaps).
 */
export default function FloodZoneMap({ center, geoJsonData, tileUrl: liveTileUrl }: FloodZoneMapProps) {
  const map = useMap();
  const { addGeoJson } = useFloodData(map);
  const { viewMode, historicalSubMode, currentData, setTransitioning } = useHistorical();
  
  // Layer states
  const [heatmapActive, setHeatmapActive] = useState(true);
  const [boundariesActive, setBoundariesActive] = useState(true);
  const [mapType, setMapType] = useState<'hybrid' | 'terrain'>('hybrid');

  const activeLayersRef = useRef<Record<string, google.maps.ImageMapType>>({});
  const currentTileUrlRef = useRef<string | null>(null);

  // Handle zooming to search location
  useEffect(() => {
    if (map && center) {
      map.setZoom(SEARCH_ZOOM);
    }
  }, [map, center]);

  // Handle Raster Tile Overlay with Smooth Cross-Fade
  useEffect(() => {
    if (!map || typeof google === 'undefined') return;

    // Determine target URL based on mode
    let targetUrl = liveTileUrl;
    if (viewMode === 'historical') {
      targetUrl = currentData.tile_url;
    }

    if (!targetUrl || targetUrl === currentTileUrlRef.current) {
      if (!targetUrl) {
         // Cleanup all layers if no URL
         Object.values(activeLayersRef.current).forEach(layer => {
           const idx = map.overlayMapTypes.getArray().indexOf(layer);
           if (idx !== -1) map.overlayMapTypes.removeAt(idx);
         });
         activeLayersRef.current = {};
         currentTileUrlRef.current = null;
      }
      return;
    }

    setTransitioning(true);

    const layerId = `${viewMode}-${historicalSubMode}-${targetUrl}`;
    
    const newLayer = new google.maps.ImageMapType({
      getTileUrl: (coord, zoom) => {
        return targetUrl!
          .replace('{x}', coord.x.toString())
          .replace('{y}', coord.y.toString())
          .replace('{z}', zoom.toString());
      },
      tileSize: new google.maps.Size(256, 256),
      opacity: 0,
      name: `FloodLayer-${viewMode}`
    });

    // Add new layer to map
    map.overlayMapTypes.push(newLayer);
    const oldLayers = Object.values(activeLayersRef.current);
    activeLayersRef.current = { [layerId]: newLayer };
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
  }, [map, viewMode, historicalSubMode, currentData.tile_url, liveTileUrl, heatmapActive, setTransitioning]);

  // Handle Heatmap Toggle Opacity
  useEffect(() => {
    Object.values(activeLayersRef.current).forEach(layer => {
      layer.setOpacity(heatmapActive ? 1 : 0);
    });
  }, [heatmapActive]);

  // Handle GeoJSON data updates - ONLY show polygons in LIVE mode
  useEffect(() => {
    if (map) {
      if (viewMode === 'live' && geoJsonData) {
        addGeoJson(geoJsonData);
      } else {
        // Clear polygons in historical mode
        map.data.forEach((feature) => {
          map.data.remove(feature);
        });
      }
    }
  }, [map, geoJsonData, addGeoJson, viewMode]);

  // Handle Boundaries Toggle (map.data visibility)
  useEffect(() => {
    if (!map) return;
    
    if (boundariesActive) {
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
        <HydrologicalStations />
        
        {center && (
          <AdvancedMarker position={center}>
            <Pin 
              background={'#0f62fe'} 
              borderColor={'#0043ce'} 
              glyphColor={'#ffffff'} 
            />
          </AdvancedMarker>
        )}

        <MapControl position={ControlPosition.LEFT_BOTTOM}>
          <MapLegend />
        </MapControl>
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
