import React from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import EventForm from "./EventForm";
import './styles.css'; // Import the combined CSS file

const CreateEvent = ({ db }: { db: any }) => {
    const navigate = useNavigate();

    const handleCreate = async (eventData: any) => {
        try {
            const docRef = await addDoc(collection(db, "events"), eventData);
            console.log("Event created with ID:", docRef.id);
            navigate(`/event/${docRef.id}`);
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    return (
        <div className="master-container">
            <h1>Create Event</h1>
            <EventForm onSubmit={handleCreate} />
        </div>
    );
};

export default CreateEvent;
