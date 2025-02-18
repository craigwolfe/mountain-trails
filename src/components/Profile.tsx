// src/components/Profile.tsx

import React, { useState, useEffect } from "react";
//useState and useEffect are used to manage state and lifecycle effects.
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs, setDoc } from "firebase/firestore";
//getFirestore, doc, getDoc, updateDoc, collection, getDocs, and setDoc are used to interact with Firestore (database).
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
//getStorage, ref, uploadBytesResumable, getDownloadURL handle Firebase Storage operations for image uploads.
import './styles.css'; // Import the combined CSS file

//user: The authenticated user object, db: Firestore database instance, storage: Firebase Storage instance.
interface ProfileProps {
    user: any;
    db: any;
    storage: any;
}
//This function is a React Functional Component that accepts ProfileProps.
const Profile: React.FC<ProfileProps> = ({ user, db, storage }) => {
    //State to hold user profile data, initialized with empty values.
    const [profileData, setProfileData] = useState<any>({ name: "", age: "", city: "", state: "", experience: "", photoURL: "", emailAddress: "" });
    //State for storing a selected file (profile picture before upload).
    const [file, setFile] = useState<any>(null);
    //State for storing available trails retrieved from Firestore.
    const [trails, setTrails] = useState<any[]>([]);
    //state for storing selected trails.
    const [selectedTrails, setSelectedTrails] = useState<string[]>([]);
    //useEffect hook to fetch user profile data and available trails when the component mounts.
    useEffect(() => {
        //If a user is authenticated, fetch their profile data and selected trails.
        if (user) {
            //Function to fetch user profile data from Firestore.
            const fetchProfile = async () => {
                //Reference to the user's profile data document in Firestore.
                const docRef = doc(db, "profileData", user.uid);
                //Get the document snapshot from Firestore.
                const docSnap = await getDoc(docRef);
                //If the document exists, set the profile data and selected trails.
                if (docSnap.exists()) {
                    //Set the profile data state with the document data.
                    setProfileData(docSnap.data());
                    //Set the selected trails state with the document data or an empty array.
                    setSelectedTrails(docSnap.data().selectedTrails || []);
                }
            };
            //Call the fetchProfile function to retrieve user profile data.
            fetchProfile();

            const fetchTrails = async () => {
                const trailsCollectionRef = collection(db, 'trails');
                const trailsSnapshot = await getDocs(trailsCollectionRef);
                const trailsList = trailsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTrails(trailsList);
            };
            fetchTrails();
        }
    }, [user]);//The useEffect hook runs when the user object changes.

    //Function to handle file input change and store the selected file in state.
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //If a file is selected, set the file state with the first file in the list.
        if (e.target.files && e.target.files[0]) {
            //Set the file state with the selected file.
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !user) return;

        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", null, null, async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setProfileData(prev => ({ ...prev, photoURL: url }));
            await updateDoc(doc(db, "profileData", user.uid), { photoURL: url });
        });
    };

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
                    selectedTrails: selectedTrails
                },
                    { merge: true });
                    
                alert('Profile saved successfully!');
            } catch (error) {
                console.error('Error saving profile:', error);
                alert('Profile not saved.');
            }
        }
    };

    const handleTrailSelection = async (trailId: string) => {
        const userDocRef = doc(db, "profileData", user.uid);
        const selectedTrailRef = doc(collection(userDocRef, "selectedTrails"), trailId);
        const trail = trails.find(t => t.id === trailId);

        if (trail) {
            await setDoc(selectedTrailRef, trail);
            setSelectedTrails(prevSelectedTrails =>
                prevSelectedTrails.includes(trailId)
                    ? prevSelectedTrails.filter(id => id !== trailId)
                    : [...prevSelectedTrails, trailId]
            );
        }
    };

    return (
        <div className="master-container">
            <h1>Profile</h1>
            {user ? (
                <>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        placeholder="Age"
                        value={profileData.age}
                        onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                    />
                    <label htmlFor="emailAddress">Email Address:</label>
                    <input
                        type="text"
                        placeholder="Email Address"
                        value={profileData.emailAddress}
                        onChange={(e) => setProfileData({ ...profileData, emailAddress: e.target.value })}
                    />
                    <label htmlFor="city">City:</label>
                    <input
                        type="text"
                        placeholder="City"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    />
                    <label htmlFor="state">State:</label>
                    <input
                        type="text"
                        placeholder="State"
                        value={profileData.state}
                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                    />
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
                    <h2>Completed Trails</h2>
                    <ul>
                        {trails.map(trail => (
                            <li key={trail.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedTrails.includes(trail.id)}
                                        onChange={() => handleTrailSelection(trail.id)}
                                    />
                                    {trail.trailName}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload Photo</button>
                    <button onClick={handleSaveProfile}>Save Profile</button>
                    {profileData.photoURL && <img src={profileData.photoURL} alt="Profile" width="100" />}
                </>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
};

export default Profile;
