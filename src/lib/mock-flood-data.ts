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
