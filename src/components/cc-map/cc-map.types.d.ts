interface HeatmapPoint {
  lat: number;// Latitude
  lon: number;// Longitude
  count: number; // Number of occurences for this location
}

type MapModeType = "points" | "heatmap";

interface Point {
  lat: number;          // Latitude
  lon: number;          // Longitude
  count?: number;       // Number of occurences for this location (default: 1)
  delay?: number | string; // How long the point needs to stay (in ms), 'none' for a fixed point, (default: 1000)
  tooltip?: string;     // Tooltip when the point is hovered
  marker?: Marker;
}

interface Marker {
  tag: string;           // The HTML tag name used for the marker
  // Additional specific properties for the marker custom element.
}
