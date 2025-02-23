import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";


// Custom Leaflet Control for "Save and Finish" Button
const SaveButtonControl = () => {
    const map = useMap(); // Access the Leaflet map instance

    useEffect(() => {
        const control = L.control({ position: "bottomleft" }); // Change position as needed

        control.onAdd = () => {
            const button = L.DomUtil.create("button", "save-finish-button");
            button.innerHTML = "Save and Finish";

            button.onclick = () => {
                alert("Saving..."); // Replace with actual save function
            };

            return button;
        };

        control.addTo(map);
        return () => control.remove(); // Cleanup on unmount
    }, [map]);

    return null; // This component does not render anything
};

export default SaveButtonControl;
