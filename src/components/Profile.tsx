// Import necessary React hooks and Firebase functions
import React, { useState, useEffect } from "react";
import {
    doc, getDoc, updateDoc, collection, getDocs, setDoc
} from "firebase/firestore"; // Firestore methods
import {
    ref, uploadBytesResumable, getDownloadURL
} from "firebase/storage"; // Firebase Storage methods

// Define TypeScript interface for the component props
interface ProfileProps {
    user: any;     // User object (could be FirebaseAuth user)
    db: any;       // Firestore database instance
    storage: any;  // Firebase Storage instance
}

// Define the Profile component with the given props
const Profile: React.FC<ProfileProps> = ({ user, db, storage }) => {
    // State to store user profile data
    const [profileData, setProfileData] = useState<any>({
        name: "", age: "", city: "", state: "",
        experience: "", photoURL: "", emailAddress: ""
    });

    // State for file upload (profile picture)
    const [file, setFile] = useState<any>(null);

    // State to store available routes from Firestore
    const [routes, setRoutes] = useState<any[]>([]);

    // State to store selected routes by the user
    const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);

    // Fetch user profile and available routes when the component mounts or when the user changes
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const docRef = doc(db, "profileData", user.uid); // Reference to user's profile doc
                const docSnap = await getDoc(docRef); // Fetch the document
                if (docSnap.exists()) {
                    setProfileData(docSnap.data()); // Update state with user profile data
                    setSelectedRoutes(docSnap.data().selectedRoutes || []); // Set selected routes
                }
            };
            fetchProfile();

            const fetchRoutes = async () => {
                const routesCollectionRef = collection(db, 'routes'); // Reference to routes collection
                const routesSnapshot = await getDocs(routesCollectionRef); // Fetch all documents
                const routesList = routesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Convert to list
                setRoutes(routesList); // Update state
            };
            fetchRoutes();
        }
    }, [user]); // Runs when 'user' changes

    // Handle file selection for profile picture upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]); // Update state with selected file
        }
    };

    // Upload profile picture to Firebase Storage
    const handleUpload = async () => {
        if (!file || !user) return; // Prevent upload if no file or user

        const storageRef = ref(storage, `profile_pictures/${user.uid}`); // Storage reference
        const uploadTask = uploadBytesResumable(storageRef, file); // Start upload

        uploadTask.on("state_changed", null, null, async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref); // Get download URL
            setProfileData(prev => ({ ...prev, photoURL: url })); // Update local state
            await updateDoc(doc(db, "profileData", user.uid), { photoURL: url }); // Save in Firestore
        });
    };

    // Save user profile data to Firestore
    const handleSaveProfile = async () => {
        if (user) {
            try {
                await setDoc(doc(db, "profileData", user.uid), {
                    name: profileData.name,
                    age: profileData.age,
                    city: profileData.city,
                    state: profileData.state,
                    experience: profileData.experience,
                    photoURL: profileData.photoURL,
                    emailAddress: profileData.emailAddress,
                    selectedRoutes: selectedRoutes
                }, { merge: true }); // Merge to avoid overwriting existing fields

                alert('Profile saved successfully!');
            } catch (error) {
                console.error('Error saving profile:', error);
                alert('Profile not saved.');
            }
        }
    };

    // Handle selection of a route
    const handleRouteSelection = async (routeId: string) => {
        const userDocRef = doc(db, "profileData", user.uid); // Reference to user's profile document
        const selectedRouteRef = doc(collection(userDocRef, "selectedRoutes"), routeId); // Reference to selected route
        const route = routes.find(t => t.id === routeId); // Find the selected route

        if (route) {
            await setDoc(selectedRouteRef, route); // Save the selected route in Firestore
            setSelectedRoutes(prevSelectedRoutes =>
                prevSelectedRoutes.includes(routeId)
                    ? prevSelectedRoutes.filter(id => id !== routeId) // Remove if already selected
                    : [...prevSelectedRoutes, routeId] // Add if not selected
            );
        }
    };

    return (
        <div className="form-container">
            <h1>Profile</h1>

            {/* Display user profile picture if available */}
            {profileData.photoURL && <img className="avatar" src={profileData.photoURL} alt="Profile" width="100" />}

            {user ? (
                <>
                    {/* Profile input fields */}
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Age:</label>
                        <input
                            type="number"
                            placeholder="Age"
                            value={profileData.age}
                            onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="emailAddress">Email Address:</label>
                        <input
                            type="text"
                            placeholder="Email Address"
                            value={profileData.emailAddress}
                            onChange={(e) => setProfileData({ ...profileData, emailAddress: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">City:</label>
                        <input
                            type="text"
                            placeholder="City"
                            value={profileData.city}
                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="state">State:</label>
                        <input
                            type="text"
                            placeholder="State"
                            value={profileData.state}
                            onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                        />
                    </div>

                    {/* Dropdown for selecting experience level */}
                    <div className="form-group">
                        <label htmlFor="experience">Experience:</label>
                        <select
                            value={profileData.experience}
                            onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                        >
                            <option value="">Select Experience</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>

                    {/* Routes selection */}
                    <h2>Completed Routes</h2>
                    <div className="completedRoutes">
                        {routes.map(route => (
                            <button
                                key={route.id}
                                className={`route-button ${selectedRoutes.includes(route.id) ? "selected" : ""}`}
                                onClick={() => handleRouteSelection(route.id)}
                            >
                                {route.name}
                            </button>
                        ))}
                    </div>

                    {/* File upload section */}
                    <div className="file-upload">
                        <hr className="separator" />
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={handleUpload}>Upload Photo</button>
                    </div>

                    {/* Save profile button */}
                    <div>
                        <hr className="separator" />
                        <button onClick={handleSaveProfile}>Save Profile</button>
                    </div>
                </>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
};

export default Profile;
