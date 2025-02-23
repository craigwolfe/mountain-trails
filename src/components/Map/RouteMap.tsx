// src/components/RouteMap.tsx
import React, { useState, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface RouteMapProps {
    onSaveRoute: (route: any) => void; // Function to handle saving the route
}

const RouteMap: React.FC<RouteMapProps> = ({ onSaveRoute }) => {
    const [routeData, setRouteData] = useState<any>(null);
    const featureGroupRef = useRef<FeatureGroup>(null);

    const handleCreated = (e: any) => {
        const layer = e.layer;
        if (layer && layer.toGeoJSON) {
            const geoJsonData = layer.toGeoJSON();
            setRouteData(geoJsonData);
        }
    };

    const saveRoute = () => {
        if (routeData) {
            onSaveRoute(routeData);
            alert("Route saved!");
        }
    };

    return (
        <div className="master-container">
            <MapContainer
                center={[41.724487, -81.245659]} // Default center Painesville Ohio
                zoom={13}
                style={{ height: "100vh", width: "375px" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />
                <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                        position="topright"
                        draw={{
                            polyline: true, // Allow drawing a route
                            polygon: false,
                            rectangle: false,
                            circle: false,
                            marker: false,
                            circlemarker: false,
                        }}
                        onCreated={handleCreated}
                    />
                </FeatureGroup>
            </MapContainer>
            <button onClick={saveRoute} style={{ marginTop: "10px" }}>
                Save Route
            </button>
        </div>
    );
};

export default RouteMap;
