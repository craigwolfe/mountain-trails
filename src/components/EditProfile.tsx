import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './styles.css'; // Import the combined CSS file

interface ProfileProps {
    user: any;
    db: any;
    storage: any;
}

const Profile: React.FC<ProfileProps> = ({ user, db, storage }) => {
    const [profileData, setProfileData] = useState<any>({ name: "", age: "", city: "", state: "", experience: "", photoURL: "", emailAddress: "" });
    const [file, setFile] = useState<any>(null);

    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                const docRef = doc(db, "profileData", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfileData(docSnap.data());
                }
            };
            fetchProfile();

        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
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
                    emailAddress: profileData.emailAddress
                }, { merge: true });

                alert('Profile saved successfully!');
            } catch (error) {
                console.error('Error saving profile:', error);
                alert('Profile not saved.');
            }
        }
    };



    return (
        <div className="master-container">
            <h1>Profile</h1>
            {profileData.photoURL && <img className="avatar" src={profileData.photoURL} alt="Profile" />}
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
                  
                   
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload Photo</button>
                    <button onClick={handleSaveProfile}>Save Profile</button>
                </>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
};

export default Profile;
