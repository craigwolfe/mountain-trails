import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { getFirestore, setDoc, doc, collection } from 'firebase/firestore';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

interface SaveTrailProps {
    db: any;
    user: any;
}

const SaveTrail: React.FC<SaveTrailProps> = ({ db, user }) => {
    const [trailName, setTrailName] = useState<string>('');
    const [trailDescription, setTrailDescription] = useState<string>('');
    const [trailElevationGain, setTrailElevationGain] = useState<number>(0);
    const [trailLength, setTrailLength] = useState<number>(0);
    const [trailDifficulty, setTrailDifficulty] = useState<string>('');
    const [trailLocation, setTrailLocation] = useState<string>('');
    const [trailRating, setTrailRating] = useState<number>(0);
    const [trailGPX, setTrailGPX] = useState<string>('');
    const [trailConditions, setTrailConditions] = useState<string>('');
    const [trailSurface, setTrailSurface] = useState<string>('');
    const [trailUserRating, setTrailUserRating] = useState<number>(0);
    const [trailSafety, setTrailSafety] = useState<string>('');
    const [trailLandmarks, setTrailLandmarks] = useState<string>(''); // New field for nearby attractions

    // Latitude & Longitude states
    const [latitude, setLatitude] = useState<number>(37.7749); // Default: San Francisco
    const [longitude, setLongitude] = useState<number>(-122.4194);

    // Function to fetch city and state using reverse geocoding
    const fetchLocationDetails = async (lat: number, lon: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || '';
                const state = data.address.state || '';
                setTrailLocation(`${city}, ${state}`);
            }

        } catch (error) {
            console.error('Error fetching location details:', error);
        }
    };

    // Component to handle map clicks
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setLatitude(e.latlng.lat);
                setLongitude(e.latlng.lng);
                fetchLocationDetails(e.latlng.lat, e.latlng.lng);
            },
        });
        return <Marker position={[latitude, longitude]} />;
    };

    const handleSaveTrail = async () => {
        if (!trailName || !trailDescription) {
            alert('Please provide both name and description of the trail');
            return;
        }

        if (!user) {
            alert('User is not authenticated');
            return;
        }

        try {
            const trailRef = doc(collection(db, 'trails'));
            await setDoc(trailRef, {
                trailName,
                description: trailDescription,
                timestamp: new Date(),
                elevationGain: trailElevationGain,
                length: trailLength,
                difficulty: trailDifficulty,
                location: trailLocation,
                rating: trailRating,
                gpx: trailGPX,
                conditions: trailConditions,
                surface: trailSurface,
                userRating: trailUserRating,
                safety: trailSafety,
                latitude, // Save Lat & Long
                longitude,
                landmarks: trailLandmarks, // Save nearby attractions
            });
            alert('Trail saved successfully!');
        } catch (error) {
            console.error('Error saving trail:', error);
        }
    };

    return (
        <div className="master-container">
            <h1>Save a New Trail</h1>

            <label htmlFor="trailName">Trail Name:</label>
            <input type="text" value={trailName} onChange={(e) => setTrailName(e.target.value)} />

            <label htmlFor="trailDescription">Trail Description:</label>
            <textarea value={trailDescription} onChange={(e) => setTrailDescription(e.target.value)} />

            <label htmlFor="trailElevationGain">Elevation Gain:</label>
            <input type="number" value={trailElevationGain} onChange={(e) => setTrailElevationGain(Number(e.target.value))} />

            <label htmlFor="trailLength">Trail Length:</label>
            <input type="number" value={trailLength} onChange={(e) => setTrailLength(Number(e.target.value))} />

            <label htmlFor="trailDifficulty">Trail Difficulty:</label>
            <input type="text" value={trailDifficulty} onChange={(e) => setTrailDifficulty(e.target.value)} />

            <label htmlFor="trailLocation">Trail Location:</label>
            <input type="text" value={trailLocation} readOnly />

            <label htmlFor="trailGPX">Trail GPX:</label>
            <input type="text" value={trailGPX} onChange={(e) => setTrailGPX(e.target.value)} />

            <label htmlFor="trailConditions">Trail Conditions:</label>
            <input type="text" value={trailConditions} onChange={(e) => setTrailConditions(e.target.value)} />

            <label htmlFor="trailSurface">Trail Surface:</label>
            <input type="text" value={trailSurface} onChange={(e) => setTrailSurface(e.target.value)} />

            <label htmlFor="trailRating">Trail Rating:</label>
            <input type="number" value={trailRating} onChange={(e) => setTrailRating(Number(e.target.value))} />

            <label htmlFor="trailSafety">Trail Safety:</label>
            <input type="text" value={trailSafety} onChange={(e) => setTrailSafety(e.target.value)} />

            <label htmlFor="trailUserRating">Trail User Rating:</label>
            <input type="number" value={trailUserRating} onChange={(e) => setTrailUserRating(Number(e.target.value))} />

            <label htmlFor="trailLandmarks">Nearby Attractions or Landmarks:</label>
            <input type="text" value={trailLandmarks} onChange={(e) => setTrailLandmarks(e.target.value)} />

            {/* Latitude & Longitude Fields */}
            <label htmlFor="latitude">Latitude:</label>
            <input type="number" value={latitude} readOnly />

            <label htmlFor="longitude">Longitude:</label>
            <input type="number" value={longitude} readOnly />

            {/* Leaflet Map */}
            <div style={{ height: '300px', width: '100%', marginTop: '10px' }}>
                <MapContainer center={[latitude, longitude]} zoom={10} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                </MapContainer>
            </div>

            <button onClick={handleSaveTrail}>Save Trail</button>
        </div>
    );
};

export default SaveTrail;
