import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";


const TrailDetails = ({ db }: { db: any }) => {
    const { id } = useParams();
    const [trail, setTrail] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrail = async () => {
            if (!id) return;
            try {
                const trailRef = doc(db, "trails", id);
                const docSnap = await getDoc(trailRef);
                if (docSnap.exists()) {
                    setTrail({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("Trail not found");
                }
            } catch (error) {
                console.error("Error fetching trail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrail();
    }, [db, id]);

    if (loading) return <p>Loading...</p>;
    if (!trail) return <p>Trail not found.</p>;

    return (
        <div className="master-container">
            <h2>Trail Details</h2>
            <h3>{trail.trailName}</h3>
            <p>{trail.description}</p>
        </div>
    );
};

export default TrailDetails;