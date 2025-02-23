import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

interface EventProps {
    db: any;
    user: any;
}

const Events: React.FC<EventProps> = ({ db }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsCollectionRef = collection(db, "events");
                const querySnapshot = await getDocs(eventsCollectionRef);

                if (querySnapshot.empty) {
                    console.log("No events found in the database.");
                }

                const eventsList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setEvents(eventsList);
            } catch (error: any) {
                console.error("Error fetching events:", error);
                setError("Error fetching events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [db]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="master-container">
        <div className="listTrails">
            <h1>Events</h1>
            {events.length === 0 ? (
                <p>No scheduled events yet.</p>
            ) : (
                <ul>
                            {events.map((event) => (
                                <Link to={`/event/${event.id}`}>
                        <li key={event.id} className="trail-item">
                                {event.thumbnail && <img src={event.thumbnail} alt={event.name} className="trail-thumbnail" />}
                                <div className="trail-info">
                                <h2>{event.id}</h2>
                                    {/*<p><strong>Difficulty:</strong> {event.difficulty}</p>*/}
                                    <p><strong>Description:</strong>{event.description}</p>
                                <p><strong>Location:</strong> {event.location?.address}</p>
                                    </div>
                           
                        </li>
                         </Link>
                    ))}
                </ul>
                )}
            </div>
        </div>
    );
};

export default Events;

