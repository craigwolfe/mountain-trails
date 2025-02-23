// Import necessary React hooks and Firebase functions
import React, { useState, useEffect } from "react";
import {
    doc, getDoc, updateDoc, collection, getDocs, setDoc
} from "firebase/firestore"; // Firestore methods
import {
    ref, uploadBytesResumable, getDownloadURL
} from "firebase/storage"; // Firebase Storage methods
import { Link } from "react-router-dom"; // For navigation }

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






    // Fetch user profile and available routes when the component mounts or when the user changes
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const docRef = doc(db, "profileData", user.uid); // Reference to user's profile doc
                const docSnap = await getDoc(docRef); // Fetch the document
                if (docSnap.exists()) {
                    setProfileData(docSnap.data()); // Update state with user profile data
                }
            };
            fetchProfile();

        }
    }, [user]); // Runs when 'user' changes



    return (
        <div className="form-container">
            <h1>Profile</h1>

            {/* Display user profile picture if available */}
            {profileData.photoURL && <img className="avatar" src={profileData.photoURL} alt="Profile" width="100" />}
            <div className="edit-profile">
                <Link to="/edit-profile" className="edit-profile-link">
                    <button className="edit-profile-btn">
                        <i className="fas fa-edit"></i> Edit Profile
                    </button>
                </Link>
            </div>
            {user ? (
                <>
                    {/* Display profile information */}
                    <div className="profile-info">
                        <p><strong>Name:</strong> {profileData.name}</p>
                        <p><strong>Age:</strong> {profileData.age}</p>
                        <p><strong>Email Address:</strong> {profileData.emailAddress}</p>
                        <p><strong>City:</strong> {profileData.city}</p>
                        <p><strong>State:</strong> {profileData.state}</p>
                        <p><strong>Experience:</strong> {profileData.experience}</p>
                    </div>
                    
                </>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
};

export default Profile;
