import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';


// Define the type for the props received by the Trails component
interface TrailProps {
    db: any; // Firestore database instance
    user: any; // User object containing user details (like uid)
}

// Define the structure of the Trail object
interface Trail {
    id: string;
    name: string;
    [key: string]: any; // Allow other properties to be added to the Trail object
    trailName: string;
    description: string;
    difficulty: string;
    userRating: number;
    thumbnail?: string; // Mark as optional to prevent issues if missing
}

const Trails: React.FC<TrailProps> = ({ db, user }) => {
    // State to hold the fetched trails data
    const [trails, setTrails] = useState<Trail[]>([]);

    useEffect(() => {
        // Asynchronous function to fetch trails data from Firestore
        const fetchTrails = async () => {
            try {
                // Reference to the 'trails' collection in Firestore
                const trailsCollection = collection(db, 'trails');

                // Query to get trails where the 'uid' field matches the current user's UID
                const q = query(trailsCollection);

                // Fetch the query snapshot from Firestore
                const querySnapshot = await getDocs(q);

                // Array to store the trails data
                const trailsData: Trail[] = [];

                // Loop through the query snapshot and process each document
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    //console.log(data); // Log document data
                    // Ensure the data is an object and not null
                    if (typeof data === 'object' && data !== null) {
                        // Add the document id and other data to the trailsData array
                        trailsData.push({ id: doc.id, ...data } as Trail);
                    }
                });

                // Update the state with the fetched trails data
                setTrails(trailsData);
            } catch (error) {
                // Log any errors that occur during the fetch
                console.error("Error fetching trails: ", error);
            }
        };

        // Call the fetchTrails function when the component is mounted or when db or user changes
        fetchTrails();
    }, [db, user]); // Dependency array ensures the effect runs when db or user changes

    return (
        <div className="master-container">
            <div className="listTrails">
                <h1>Trails</h1>
                {/* Render the list of trails */}
                {trails.length === 0 ? (
                    <p>No scheduled events yet.</p>
                ) : (
                    <ul>
                        {trails.map((trail) => (
                            <li key={trail.id} className="trail-item">
                                {trail.thumbnail && (
                                    <img src={trail.thumbnail} alt={trail.trailName} className="trail-thumbnail" />
                                )}
                                <div className="trail-info">
                                    <h2>{trail.trailName}</h2>
                                    <p><strong>Description:</strong> {trail.description}</p>
                                    <p><strong>Difficulty:</strong> {trail.difficulty}</p>
                                    <p><strong>User Rating:</strong> {trail.userRating} / 5</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Trails;
