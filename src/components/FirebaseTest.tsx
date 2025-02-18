import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import SaveTrail from './components/SaveTrail';
import UploadVideo from './components/UploadVideo';
import Profile from './components/Profile';
import Login from './components/Login';
import Notifications from './components/Notifications';
import Friends from './components/Friends';
import Menu from './components/Menu';
import MobileNav from './components/MobileNav';
import FirebaseTest from './components/FirebaseTest';
import { auth, db, storage } from './firebase/firebaseconfig';
import { getDoc, doc } from 'firebase/firestore';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, "profileData", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
            } else {
                setUser(null);
                setProfile(null);
            }
        });
        return () => unsubscribe();
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
                    <Route path="/firebase-test" element={<FirebaseTest />} />
                </Routes>
                <MobileNav />
            </div>
        </Router>
    );
}

export default App;
