export interface Location {
  lat: number;
  lng: number;
}

export interface Pothole {
  id: number;
  image: string;
  location: Location;
  route_id: string;
  segment_id: string;
  severity: number;
  timestamp: number;
} 