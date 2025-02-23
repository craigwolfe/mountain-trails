import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Firebase Auth Import



const EventForm = ({ initialData = {}, onSubmit }:
    { initialData?: any, onSubmit: (data: any) => any }) => {
    const navigate = useNavigate();
    const auth = getAuth(); // Get Firebase Auth instance
    const user = auth.currentUser; // Get current logged-in user

    const [formData, setFormData] = useState({
        name: initialData.name || "",
        description: initialData.description || "",
        location: {
            address: initialData.location?.address || "",
            lat: initialData.location?.lat || "",
            long: initialData.location?.long || ""
        },
        attendees: initialData.attendees || [],
        date: initialData.date || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("location.")) {
            const field = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("User not logged in!");
            return;
        }

        const newEvent = {
            ...formData,
            createdAt: new Date().toISOString(),
            createdBy: user.email, // Fetch email dynamically
        };

        const eventId = onSubmit(newEvent);
        if (eventId) {
            navigate(`/eventdetails/${eventId}`);
        }
    };

    return (
        <div className="master-container">
            <form onSubmit={handleSubmit}>
                <label>Event Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />

                <label>Date:</label>
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />

                <label>Location Address:</label>
                <input type="text" name="location.address" value={formData.location.address} onChange={handleChange} required />

                <label>Latitude:</label>
                <input type="text" name="location.lat" value={formData.location.lat} onChange={handleChange} required />

                <label>Longitude:</label>
                <input type="text" name="location.long" value={formData.location.long} onChange={handleChange} required />

                <label>Attendees (comma-separated emails):</label>
                <input
                    type="text"
                    name="attendees"
                    value={formData.attendees.join(", ")}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value.split(", ") })}
                />

                <button type="submit">Save Event</button>
            </form>
        </div>
    );
};

export default EventForm;
