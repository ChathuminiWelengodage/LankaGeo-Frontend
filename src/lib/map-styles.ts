export const SEVERITY_COLORS = {
  1: '#0000FF', // Low (Seasonal/Water)
  2: '#FFA500', // Moderate
  3: '#FF0000', // Critical
} as const;

export type SeverityLevel = keyof typeof SEVERITY_COLORS;

export const MAP_STYLES = {
  fillOpacity: 0.4,
  strokeWeight: 1,
  strokeOpacity: 0.8,
};
