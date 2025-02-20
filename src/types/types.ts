export interface Waypoint {
    lat: number;
    lng: number;
}

export interface Trail {
    name: string;
    waypoints: Waypoint[];
    lastUpdated: string;
}
