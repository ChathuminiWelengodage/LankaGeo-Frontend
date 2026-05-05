import { CaseStudy } from "@/types/case-study";

export const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "colombo-port-2024",
    title: "Colombo Port Expansion Analysis",
    summary: "High-frequency temporal monitoring of the western terminal development using sub-meter SAR imagery for real-time logistics optimization.",
    content: "The Colombo Port Expansion project required constant monitoring to ensure construction remained on schedule despite heavy monsoon seasons. Using SAR (Synthetic Aperture Radar) satellite data, LankaGeo provided sub-meter resolution imagery that could penetrate cloud cover and rain, which are frequent in the region. Our analysis helped logistics teams optimize the movement of materials and identified potential drainage issues before they became critical. The high-fidelity data revealed subtle terrain shifts and sediment accumulation patterns that were invisible to traditional optical satellites.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZvGfqTDJtIxwmGCW94RBng36vt3MUMGguq2CRjwUGs1XeKqhrEtrI4BQnaN9DwEIfwQgQesX0Yh22bgM8RY_KzUk2p9QvuDNpSAVTvVGN2M4y9QImEbpISX8KfWandX5v9RjU7xS7HfEPjlGoxFrGby6moRwY1-oWX5n5aVstuZgcgfi-nRdvJ3NN1qbdMOVUA7hJdHn7N_unJCRUklaNPA-H_HL20NTomrPg38nxLtfyPtflzo6WRWSA1WKkt403sBVytuU6pjh3",
    category: "Infrastructure",
    date: "2024.Q1",
    location: "Colombo, Sri Lanka",
    analysis: {
      rainfall: "Variable",
      impact: "Logistics Optimization",
      duration: "Ongoing",
      affectedArea: "Western Terminal"
    },
    stats: [
      { label: "Resolution", value: "0.5m SAR" },
      { label: "Data Points", value: "1,200+" },
      { label: "Accuracy", value: "98.2%" }
    ]
  },
  {
    id: "monsoon-predictive-2023",
    title: "Monsoon Pattern Predictive Modeling",
    summary: "Utilizing multispectral data fusion to enhance early warning systems for rural agricultural zones during peak seasonal shifts.",
    content: "During the 2023 Southwest Monsoon, LankaGeo deployed a predictive modeling system that fused multispectral satellite data with local meteorological feeds. This allowed for the identification of potential flash flood zones up to 48 hours before extreme rainfall events. In rural agricultural zones, this early warning system was instrumental in allowing farmers to protect livestock and harvest early where possible. The model specifically tracked water saturation levels in the soil, providing a granular look at runoff risks across different topographic profiles.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuARIFhgzPxCabbFoY1hitbmAxqWbtKsQ6kPMQCfJWbE7XEQMzmElcucto4ibV7zTIsWjaLEbSAn8qroVb96h_llhoRAKVx1pHgABwaqBzSvwGobfVvklJyYA-HVZwbJLtAU2-ftpNfc5xDPoAZ6Mv2ukzftxa68NGpzpMe0-A8RJN90oBeBU3_voFsdYjU7w4NDM87hNT6HsG4V1ZSR3IIitlLa6z8dVgiHjFybt_U5fi0JmUGkpbR_DCYDy6MyzzpadfVBLued6yIh",
    category: "Environment",
    date: "2023.Q4",
    location: "Central Province, Sri Lanka",
    analysis: {
      rainfall: "450mm",
      impact: "Severe Runoff Risk",
      duration: "3 Weeks",
      affectedArea: "Agricultural Highlands"
    },
    stats: [
      { label: "Lead Time", value: "48 Hours" },
      { label: "Soil Saturation", value: "92%" },
      { label: "Model Confidence", value: "94%" }
    ]
  },
  {
    id: "tea-plantation-lidar-2023",
    title: "Precision Tea Plantation Inventory",
    summary: "Lidar-driven biomass estimation and health indexing for high-altitude tea estates in the central highlands.",
    content: "Maintaining the health of tea plantations in the central highlands is vital for Sri Lanka's economy. LankaGeo used high-altitude Lidar mapping to perform a comprehensive biomass estimation across several major estates. This data, combined with multispectral health indexing, allowed plantation managers to identify areas of nutrient deficiency and pest infestation with unprecedented precision. The geometric mosaic of the fields was captured in high resolution, providing a structural map that aids in long-term land use management and terrace maintenance.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8KoXOT6tgj5mFxjl5WePcqkI_fO6OZiZfseJQ9asm8iDQO2UmCg4HTBgK1IjP8wqTj1mAHfLFjaOkQszI_egyfZRWaTXB8sYii7f5drvGBHt9wEopf53WWK3B8NKvT7wtByyezh3eZTuB1MXbhSuvSgPS4x_T3n5mideoYegdRTMSXqS2KXc0QX3RrCe2Nk0dbQD8Qt91rseqzH02yH1rY5gNd1eAVxPX_Up2M-_wo-E6QQN7AvA6VPRYCbVZhqIhMXXhc_oAYSow",
    category: "Agriculture",
    date: "2023.Q4",
    location: "Nuwara Eliya, Sri Lanka",
    analysis: {
      rainfall: "Seasonal",
      impact: "Yield Optimization",
      duration: "Annual Review",
      affectedArea: "2,500 Hectares"
    },
    stats: [
      { label: "Plant Count", value: "1.2M+" },
      { label: "Health Index", value: "Optimal" },
      { label: "Biomass Error", value: "< 2%" }
    ]
  },
  {
    id: "sustainable-energy-2023",
    title: "Sustainable Energy Site Selection",
    summary: "Using multi-criteria decision analysis and solar irradiance mapping to identify optimal locations for regional grid expansion.",
    content: "Sri Lanka's transition to renewable energy requires strategic placement of solar and wind farms. LankaGeo performed a island-wide survey using multi-criteria decision analysis (MCDA) to identify optimal sites. We mapped solar irradiance, wind speed patterns, terrain slope, and proximity to existing grid infrastructure. Our study identified three high-potential zones in the northern and eastern provinces where renewable energy output could be maximized with minimal environmental impact. The visualization used deep purple and orange hues to highlight peak efficiency zones at various times of the day.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDei6-VWXgYyGrLqqovAIFGu8yYZ2VoZm-EET-84TRiUFeg93QdUdDho3EIJwWbRTOjpJjsrjSecQiR2IJ9Yy9anP9MsjLQvcQswglmTD-q7v_mHhmFK1luvBp1J3M_HWjtX8B0qEphAxeIr6EgEk6u4tStRBFmmyhtDeeyzZ5ze5G8AdamXA4XLJ7ITWaEOjEEWs0NxzQTQimC3w-vFxomqrDAt94eHjVUhbIr9ui95wk_ctOngzaYFbUqF3avMSKioIU67sdycm-",
    category: "Energy",
    date: "2023.Q3",
    location: "Northern Province, Sri Lanka",
    analysis: {
      rainfall: "Low",
      impact: "Grid Expansion",
      duration: "6 Months",
      affectedArea: "Regional Grid"
    },
    stats: [
      { label: "Sunlight Hours", value: "2,800/yr" },
      { label: "Potential MW", value: "450" },
      { label: "Grid Distance", value: "< 5km" }
    ]
  },
  {
    id: "coastal-erosion-2023",
    title: "Coastal Erosion Bathymetric Survey",
    summary: "Satellite-derived bathymetry and shoreline change detection for long-term urban coastal defense strategies.",
    content: "Coastal erosion poses a significant threat to Sri Lanka's urban infrastructure. LankaGeo utilized satellite-derived bathymetry (SDB) to map shallow water depths and sediment transport patterns along the southwestern coast. By comparing historical satellite records with current high-resolution imagery, we identified critical erosion 'hotspots' where the shoreline has retreated by more than 15 meters over the last decade. This data is now being used by urban planners to design more effective coastal defense structures, such as artificial reefs and nourishment programs.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBIck9pQHD2UDbs0x_HWxJy5KyEl7IJ4bEStu1WD7qbrqmIKFJ_zaBWKRtAFDZQ5X2StpLANa7X6HA36LUeoOJVxMfOmRCL6ttelXZpCVi83e7bUEfcaUn88G5InLjIcgtKK_dM2V7jRo5FY-p8Sm6VGPDmSgdP1EYwVt_dKeiZuHwFiuBkXA2W6OhJB2Qfecfwla3FLc-SmgNgB2MVpV0i7sg3stdva2EOyn5H0TI149KM4qg9DDGdiDDeUQZE0W8p0ZPEQY8Z-QR",
    category: "Topography",
    date: "2023.Q2",
    location: "Galle, Sri Lanka",
    analysis: {
      rainfall: "High",
      impact: "Coastal Defense",
      duration: "Decadal Study",
      affectedArea: "80km Coastline"
    },
    stats: [
      { label: "Erosion Rate", value: "1.5m/yr" },
      { label: "Max Depth", value: "12m SDB" },
      { label: "Hotspots", value: "12 Areas" }
    ]
  },
  {
    id: "highland-transit-2023",
    title: "Central Highland Transit Corridor",
    summary: "Optimizing logistics through terrain-aware routing algorithms integrated with real-time satellite weather feeds.",
    content: "Transporting goods through the central highlands is often hampered by unpredictable weather and steep terrain. LankaGeo developed a terrain-aware routing algorithm that integrates real-time satellite weather feeds with high-resolution topographic maps. This system identifies the safest and most fuel-efficient routes for heavy logistics vehicles, taking into account current road conditions, visibility, and landslide risks. The 3D terrain models used neon blue elevation contours to highlight optimal paths through mountain passes, significantly reducing transit times and improving safety during the monsoon season.",
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoAXwf-px5m6stiZ-h1dM_v4sDC87fnZDFhnfPSLPKZfYU7jwqyPrzEJWqFVYQEpf4dtuWCYGQMPWXDNUaW6netJPgEPWQZMhN7EoHdNp8ECQnvguZRS4p0zMzFTQ29w2o9Eigpt3wBRO5b9T1n27UMgQr_KsS544jvSgIbkpXa06t2ouuVltBArmcLSg198r_YrVVDkIPtm2XsTAj50hpGYOy7cAUnNCohu2hpyvTTn7cBxqqBIULcqsqStyrUypK8a9RegO3rEXu",
    category: "Logistics",
    date: "2023.Q2",
    location: "Kandy-Badulla Road",
    analysis: {
      rainfall: "Frequent",
      impact: "Safety & Efficiency",
      duration: "Continuous",
      affectedArea: "Transit Corridors"
    },
    stats: [
      { label: "Time Saved", value: "18%" },
      { label: "Fuel Efficiency", value: "+12%" },
      { label: "Safety Incidents", value: "-40%" }
    ]
  }
];
