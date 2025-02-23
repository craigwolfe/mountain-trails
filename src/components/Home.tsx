import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

interface HomeProps {
    db: any;
    user: any;
}

const Home: React.FC<HomeProps> = ({ db, user }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                console.log("Fetching events...");

                const eventsCollectionRef = collection(db, "events");
                const querySnapshot = await getDocs(eventsCollectionRef);

                if (querySnapshot.empty) {
                    console.log("No events found in the database.");
                }

                const eventsList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("Fetched events:", eventsList);
                setEvents(eventsList);
            } catch (error: any) {
                console.error("Error fetching events:", error);
                setError("Error fetching events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [db, user]);

    return (
        <div className="master-container">
            <img className="home-image" src="./src/assets/images/logo.png" alt="Mountain Biking" />
            <h1>Welcome to Hummingbird Outdoor MTB Trails</h1>
            <h2>Hi, {user?.name || "Rider"}!</h2>
            <p>Explore, save, and share your favorite trails!</p>

            <h2>Upcoming Events</h2>

            {loading ? (
                <p>Loading events...</p>
            ) : error ? (
                <p>{error}</p>
            ) : events.length === 0 ? (
                <p>No upcoming events.</p>
            ) : (
                <ul>
                    {events.slice(0, 3).map((event) => ( // Display only the first 2 events
                        <li key={event.id}>
                            <Link to={`/event/${event.id}`}>
                                <strong>{event.name}</strong> - {event.date}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <Link to="/events">
                <button>View All Events</button>
            </Link>
        </div>
    );
};

export default Home;
