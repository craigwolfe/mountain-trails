// src/pages/RoutePage.tsx
import React, { useState } from "react";
import RouteMap from "../components/Map/RouteMap";

const RoutePage: React.FC = () => {
    const [savedRoutes, setSavedRoutes] = useState<any[]>([]);

    const handleSaveRoute = (route: any) => {
        setSavedRoutes((prevRoutes) => [...prevRoutes, route]);
    };

    return (
        <div className="master-container">
            <h1>Draw and Save Your Trail</h1>
            <RouteMap onSaveRoute={handleSaveRoute} />
            <h2>Saved Routes</h2>
            <pre>{JSON.stringify(savedRoutes, null, 2)}</pre>
        </div>
    );
};

export default RoutePage;
