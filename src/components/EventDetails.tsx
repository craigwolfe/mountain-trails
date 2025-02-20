import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import './styles.css'; // Import the combined CSS file

const EventDetails = ({ db }: { db: any }) => {
    const { id } = useParams();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const eventRef = doc(db, "events", id);
                const docSnap = await getDoc(eventRef);
                if (docSnap.exists()) {
                    setEvent({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("Event not found");
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [db, id]);

    if (loading) return <p>Loading...</p>;
    if (!event) return <p>Event not found.</p>;

    return (
        <div className="master-container">
            <h2>Event Details</h2>
            <h2>{event.id}</h2>
            <h3>{event.name}</h3>
            <p>{event.description}</p>
        </div>
    );
};

export default EventDetails;