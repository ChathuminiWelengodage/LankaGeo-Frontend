export const MOCK_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "zone_polygon_2026",
      geometry: {
        type: "Polygon",
        coordinates: [
          [[80.012, 6.843], [80.015, 6.846], [80.019, 6.841], [80.012, 6.843]]
        ]
      },
      properties: {
        zone_id: "FLD-2026-98X",
        severity_level: "critical",
        area_km2: 12.45,
        water_type: "new flood",
        signal1: true,
        signal2: false,
        signal3: true
      }
    },
    {
      type: "Feature",
      id: "zone_polygon_moderate",
      geometry: {
        type: "Polygon",
        coordinates: [
          [[80.022, 6.853], [80.025, 6.856], [80.029, 6.851], [80.022, 6.853]]
        ]
      },
      properties: {
        zone_id: "FLD-2026-99Y",
        severity_level: "moderate",
        area_km2: 8.12,
        water_type: "seasonal",
        signal1: true,
        signal2: true,
        signal3: false
      }
    }
  ]
};

export interface HistoricalData {
  year: number;
  tile_url?: string;
  total_zones: number;
  flood_frequency_index: number;
  impact_summary: string;
  max_area_km2: number;
}

export const HISTORICAL_YEARS_DATA: HistoricalData[] = [
  {
    year: 2020,
    tile_url: 'https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}&opacity=0.4',
    total_zones: 32,
    flood_frequency_index: 0.42,
    impact_summary: 'Significant runoff in western provinces during monsoon peak.',
    max_area_km2: 88.4
  },
  {
    year: 2021,
    tile_url: 'https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}&opacity=0.4',
    total_zones: 28,
    flood_frequency_index: 0.58,
    impact_summary: 'Moderate inundation across north-central agricultural zones.',
    max_area_km2: 76.2
  },
  {
    year: 2022,
    tile_url: 'https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}&opacity=0.4',
    total_zones: 42,
    flood_frequency_index: 0.88,
    impact_summary: 'High risk detected. Extreme precipitation events recorded.',
    max_area_km2: 112.4
  },
  {
    year: 2023,
    tile_url: 'https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}&opacity=0.4',
    total_zones: 35,
    flood_frequency_index: 0.28,
    impact_summary: 'Urban flooding in Colombo metropolitan area significantly elevated.',
    max_area_km2: 92.1
  },
  {
    year: 2024,
    tile_url: 'https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}&opacity=0.4',
    total_zones: 30,
    flood_frequency_index: 0.62,
    impact_summary: 'Steady frequency observed in southern river basins.',
    max_area_km2: 82.5
  }
];

export const COMPOSITE_FLOOD_DATA: HistoricalData = {
  year: 0, // 0 represents the 5-Year Composite
  tile_url: 'https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}&opacity=0.3',
  total_zones: 167,
  flood_frequency_index: 0.64,
  impact_summary: 'Cumulative 5-year resilience composite showing macro trends.',
  max_area_km2: 145.8
};

// --- Hydrological Stations ---

export interface GaugeStation {
  id: string;
  name: string;
  position: { lat: number; lng: number };
}

export type GaugeStatus = 'normal' | 'elevated' | 'critical';

export interface LiveGaugeData {
  station_id: string;
  name: string;
  current_level: number;
  baseline: number;
  status: GaugeStatus;
}

export const GAUGE_STATIONS: GaugeStation[] = [
  { 
    id: 'HS-01', 
    name: 'Hanwella Gauging Core', 
    position: { lat: 6.9038, lng: 80.1311 } 
  },
  { 
    id: 'HS-02', 
    name: 'Nagalagam Street Base', 
    position: { lat: 6.9586, lng: 79.8732 } 
  }
];

export const MOCK_LIVE_GAUGES: Record<string, LiveGaugeData> = {
  'HS-01': {
    station_id: 'HS-01',
    name: 'Hanwella Gauging Station - HS-01',
    current_level: 4.82,
    baseline: 2.50,
    status: 'critical'
  },
  'HS-02': {
    station_id: 'HS-02',
    name: 'Nagalagam Street Base - HS-02',
    current_level: 1.25,
    baseline: 1.10,
    status: 'normal'
  }
};
