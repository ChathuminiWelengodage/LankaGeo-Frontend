export const SEVERITY_COLORS = {
  critical: '#ff4d4d',
  moderate: '#ffaa00',
  seasonal: '#708090',
} as const;

export type SeverityLevel = keyof typeof SEVERITY_COLORS;

export const MAP_STYLES = {
  fillOpacity: 0.5,
  strokeWeight: 2,
  strokeOpacity: 0.8,
};
