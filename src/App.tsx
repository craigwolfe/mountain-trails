import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SaveTrail from './components/SaveTrail';
import UploadVideo from './components/UploadVideo';
import Profile from './components/Profile';
import Login from './components/Login';
import Notifications from './components/Notifications';
import Friends from './components/Friends';
import Menu from './components/Menu';
import MobileNav from './components/MobileNav';
import Settings from './components/Settings';
import Events from './components/Events';
import CreateAccount from './components/CreateAccount';
import { auth, db, storage } from './firebase/firebaseconfig';
import { getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome

// Define a UserProfile interface for type safety
interface UserProfile {
    name?: string;
    email?: string;
    avatarUrl?: string;
}

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const docRef = doc(db, "profileData", currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfile);
                } else {
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }
        });

        return () => unsubscribe(); // Cleanup listener
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home user={profile} />} />
                    <Route path="/save-trail" element={<SaveTrail db={db} user={user} />} />
                    <Route path="/video" element={<UploadVideo storage={storage} user={user} />} />
                    <Route path="/profile" element={<Profile user={user} db={db} storage={storage} />} />
                    <Route path="/login" element={<Login auth={auth} />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/friends" element={<Friends user={user} db={db} />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/create-account" element={<CreateAccount />} />
                </Routes>
                <MobileNav />
            </div>
        </Router>
    );
};

export default App;
