import { useEffect, useRef, useCallback } from 'react';
import { SEVERITY_COLORS, MAP_STYLES, SeverityLevel } from '@/lib/map-styles';

export interface GeoJSONProperties {
  zone_id: string;
  severity_level: SeverityLevel;
  area_km2: number;
  water_type: string;
  signal1: boolean;
  signal2: boolean;
  signal3: boolean;
}

export const useFloodData = (map: google.maps.Map | null) => {
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const clearDataLayer = useCallback(() => {
    if (!map) return;
    
    // Close any open InfoWindow
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    // Remove all features from the data layer
    map.data.forEach((feature) => {
      map.data.remove(feature);
    });
  }, [map]);

  const addGeoJson = useCallback((data: Record<string, unknown>) => {
    if (!map) return;

    clearDataLayer();

    try {
      map.data.addGeoJson(data);

      // Apply styling based on severity_level
      map.data.setStyle((feature) => {
        const severity = feature.getProperty('severity_level') as SeverityLevel;
        const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS.moderate;

        return {
          fillColor: color,
          strokeColor: color,
          ...MAP_STYLES,
        };
      });
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    }
  }, [map, clearDataLayer]);

  useEffect(() => {
    if (!map) return;

    // Set up global click listener on map.data
    const clickListener = map.data.addListener('click', (event: google.maps.Data.MouseEvent) => {
      const feature = event.feature;
      const props = {
        zone_id: feature.getProperty('zone_id'),
        severity_level: feature.getProperty('severity_level'),
        area_km2: feature.getProperty('area_km2'),
        water_type: feature.getProperty('water_type'),
        signal1: feature.getProperty('signal1'),
        signal2: feature.getProperty('signal2'),
        signal3: feature.getProperty('signal3'),
      } as GeoJSONProperties;

      if (!infoWindowRef.current) {
        infoWindowRef.current = new google.maps.InfoWindow();
      }

      const content = `
        <div style="padding: 12px; color: #111; font-family: sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Zone: ${props.zone_id}</h3>
          <p style="margin: 4px 0;"><strong>Severity:</strong> <span style="text-transform: capitalize;">${props.severity_level}</span></p>
          <p style="margin: 4px 0;"><strong>Area:</strong> ${props.area_km2.toFixed(2)} km²</p>
          <p style="margin: 4px 0;"><strong>Water Type:</strong> ${props.water_type}</p>
          <div style="margin-top: 8px; font-size: 12px; border-top: 1px solid #eee; pt: 8px;">
            <p style="margin: 2px 0;">Signal 1: ${props.signal1 ? '✅' : '❌'}</p>
            <p style="margin: 2px 0;">Signal 2: ${props.signal2 ? '✅' : '❌'}</p>
            <p style="margin: 2px 0;">Signal 3: ${props.signal3 ? '✅' : '❌'}</p>
          </div>
        </div>
      `;

      infoWindowRef.current.setContent(content);
      infoWindowRef.current.setPosition(event.latLng);
      infoWindowRef.current.open(map);
    });

    return () => {
      google.maps.event.removeListener(clickListener);
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [map]);

  return { addGeoJson, clearDataLayer };
};
