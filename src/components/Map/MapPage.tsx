import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";
import "../../assets/styles/global.css"; // Import the CSS file for styling
import SaveButtonControl from "./SaveButtonControl";

interface Route {
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    name: string;
    description: string;
    elevationGain: number;
    length: number;
    difficulty: string;
    location: string;
    rating: number;
    conditions: string;
    safety: string;
    userRating: number;
}

const MapPage: React.FC = () => {
    const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
    const [routeName, setRouteName] = useState<string>("");
    const [routeDescription, setRouteDescription] = useState<string>("");
    const [routeElevationGain, setRouteElevationGain] = useState<number>(0);
    const [routeLength, setRouteLength] = useState<number>(0);
    const [routeDifficulty, setRouteDifficulty] = useState<string>("");
    const [routeLocation, setRouteLocation] = useState<string>("");
    const [routeRating, setRouteRating] = useState<number>(0);
    const [routeConditions, setRouteConditions] = useState<string>("");
    const [routeSafety, setRouteSafety] = useState<string>("");
    const [routeUserRating, setRouteUserRating] = useState<number>(0);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const routesCollection = collection(db, "routes");
                const routeSnapshot = await getDocs(routesCollection);
                const routesList = routeSnapshot.docs.map((doc) => doc.data() as Route);
                console.log("Fetched routes:", routesList);
            } catch (error) {
                console.error("Error fetching routes:", error);
            }
        
        };
      
        fetchRoutes();
    }, []);

    const handleCreate = (e: any) => {
        const { layer } = e;
        const newRouteGeoJSON = layer.toGeoJSON();

        const newRoute: Route = {
            type: newRouteGeoJSON.type,
            geometry: {
                type: newRouteGeoJSON.geometry.type,
                coordinates: newRouteGeoJSON.geometry.coordinates.flat() as number[],
            },
            name: routeName,
            description: routeDescription,
            elevationGain: routeElevationGain,
            length: routeLength,
            difficulty: routeDifficulty,
            location: routeLocation,
            rating: routeRating,
            conditions: routeConditions,
            safety: routeSafety,
            userRating: routeUserRating,
        };

        setCurrentRoute(newRoute);
        console.log("New route set:", newRoute);
    };

    const saveRoute = async () => {
        if (!currentRoute) {
            alert("No route to save!");
            return;
        }

        try {
            const routeData = {
                ...currentRoute,
                name: routeName,
                description: routeDescription,
                elevationGain: routeElevationGain,
                length: routeLength,
                difficulty: routeDifficulty,
                location: routeLocation,
                rating: routeRating,
                conditions: routeConditions,
                safety: routeSafety,
                userRating: routeUserRating,
            };

            const docRef = await addDoc(collection(db, "routes"), routeData);
            console.log("Route saved with ID:", docRef.id);

            // Reset fields
            setCurrentRoute(null);
            setRouteName("");
            setRouteDescription("");
            setRouteElevationGain(0);
            setRouteLength(0);
            setRouteDifficulty("");
            setRouteLocation("");
            setRouteRating(0);
            setRouteConditions("");
            setRouteSafety("");
            setRouteUserRating(0);

            alert("Route saved successfully!");
        } catch (error) {
            console.error("Error saving route:", error);
        }
    };

    return (
        <div className="map-page-container">
            <MapContainer className="map-container" center={[41.724487, -81.245659]} zoom={13}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={handleCreate}
                        draw={{
                            polyline: true,
                            polygon: false,
                            rectangle: false,
                            circle: false,
                            marker: false,
                            circlemarker: false,
                        }}
                    />
                </FeatureGroup>
                <SaveButtonControl />
            </MapContainer>
            <div className="form-container">
                <div className="form-group">
                    <label htmlFor="routeName">Route Name:</label>
                    <input type="text" id="routeName" value={routeName} onChange={(e) => setRouteName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="routeDescription">Route Description:</label>
                    <textarea id="routeDescription" value={routeDescription} onChange={(e) => setRouteDescription(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="routeElevationGain">Elevation Gain:</label>
                    <input type="number" id="routeElevationGain" value={routeElevationGain} onChange={(e) => setRouteElevationGain(Number(e.target.value))} />
                </div>

                <div className="form-group">
                    <label htmlFor="routeLength">Route Length:</label>
                    <input type="number" id="routeLength" value={routeLength} onChange={(e) => setRouteLength(Number(e.target.value))} />
                </div>

                <div className="form-group">
                    <label htmlFor="routeDifficulty">Route Difficulty:</label>
                    <input type="text" id="routeDifficulty" value={routeDifficulty} onChange={(e) => setRouteDifficulty(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="routeLocation">Route Location:</label>
                    <input type="text" id="routeLocation" value={routeLocation} onChange={(e) => setRouteLocation(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="routeRating">Route Rating:</label>
                    <input type="number" id="routeRating" value={routeRating} onChange={(e) => setRouteRating(Number(e.target.value))} />
                </div>

                <div className="form-group">
                    <label htmlFor="routeConditions">Route Conditions:</label>
                    <input type="text" id="routeConditions" value={routeConditions} onChange={(e) => setRouteConditions(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="routeSafety">Route Safety:</label>
                    <input type="text" id="routeSafety" value={routeSafety} onChange={(e) => setRouteSafety(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="routeUserRating">Route User Rating:</label>
                    <input type="number" id="routeUserRating" value={routeUserRating} onChange={(e) => setRouteUserRating(Number(e.target.value))} />
                </div>

                <hr className="separator" />

                <div className="form-group">
                    <button onClick={saveRoute}>Save Route</button>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
