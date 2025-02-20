import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import EventForm from "./EventForm";
import './styles.css'; // Import the combined CSS file

const EditEvent = ({ db }: { db: any }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);

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
            }
        };
        fetchEvent();
    }, [db, id]);

    const handleUpdate = async (eventData: any) => {
        try {
            const eventRef = doc(db, "events", id!);
            await updateDoc(eventRef, eventData);
            console.log("Event updated");
            navigate(`/event/${id}`); // Redirect to event details
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    if (!event) return <p>Loading...</p>;

    return (
        <div className="master-container">
            <h1>Edit Event</h1>
            <EventForm initialData={event} onSubmit={handleUpdate} />
        </div>
    );
};

export default EditEvent;
