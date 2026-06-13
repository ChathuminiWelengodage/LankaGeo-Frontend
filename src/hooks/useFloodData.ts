import { useEffect, useRef, useCallback } from 'react';
import { SEVERITY_COLORS, MAP_STYLES, SeverityLevel } from '@/lib/map-styles';

export interface GeoJSONProperties {
  zone_id: string;
  severity_level: SeverityLevel;
  affected_area_km2: number;
  confidence_score: number;
  satellite_source: string;
  risk_level: string;
  analysis_timestamp: string;
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
        const color = SEVERITY_COLORS[severity] || SEVERITY_COLORS[1];

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
        affected_area_km2: feature.getProperty('affected_area_km2') || feature.getProperty('area_km2'),
        confidence_score: feature.getProperty('confidence_score'),
        satellite_source: feature.getProperty('satellite_source'),
        risk_level: feature.getProperty('risk_level'),
        analysis_timestamp: feature.getProperty('analysis_timestamp'),
      } as GeoJSONProperties;

      if (!infoWindowRef.current) {
        infoWindowRef.current = new google.maps.InfoWindow();
      }

      const severityLabels: Record<number, string> = {
        1: 'Low (Seasonal)',
        2: 'Moderate',
        3: 'Critical'
      };

      const content = `
        <div style="padding: 12px; color: #111; font-family: sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 4px;">Zone: ${props.zone_id}</h3>
          <p style="margin: 4px 0;"><strong>Risk Level:</strong> <span style="color: ${SEVERITY_COLORS[props.severity_level] || '#333'}">${props.risk_level || severityLabels[props.severity_level] || 'Unknown'}</span></p>
          <p style="margin: 4px 0;"><strong>Affected Area:</strong> ${props.affected_area_km2?.toFixed(2) || '0.00'} km²</p>
          <p style="margin: 4px 0;"><strong>Confidence:</strong> ${props.confidence_score ? (props.confidence_score).toFixed(1) + '%' : 'N/A'}</p>
          <div style="margin-top: 8px; font-size: 11px; color: #666; background: #f9f9f9; padding: 6px; border-radius: 4px;">
            <p style="margin: 2px 0;">Source: ${props.satellite_source || 'Sentinel-1 SAR'}</p>
            <p style="margin: 2px 0;">Analyzed: ${props.analysis_timestamp ? new Date(props.analysis_timestamp).toLocaleString() : 'Recent'}</p>
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
