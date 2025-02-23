import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome  
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import '../src/assets/styles/global.css';
import MapPage from './components/Map/MapPage'; //import your map page
import SaveButtonControl from './components/Map/SaveButtonControl'; //import your save button control
import CreateAccount from './components/CreateAccount';
import EditEvent from './components/EditEvent';
import EditProfile from './components/EditProfile';
import CreateEvent from './components/CreateEvent';
import EventDetails from './components/EventDetails';
import EventForm from './components/EventForm';
import Events from './components/Events';
import Friends from './components/Friends';
import Home from './components/Home';
import Login from './components/Login';
import Menu from './components/Menu';
import MobileNav from './components/Navbar/MobileNav';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Settings from './components/Settings';
//import TrailDetails from './components/TrailDetails';
//import Trails from './components/Trails';
import UploadVideo from './components/UploadVideo';
import { auth, db, storage } from './firebase/firebaseconfig';


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
           <div className="master-container">
               <Routes>  
                   <Route path="/" element={<Home user={profile} db={db} />} />
                  <Route path="/video" element={<UploadVideo storage={storage} user={user} />} />  
                   <Route path="/profile" element={<Profile user={user} db={db} storage={storage} />} />
                   <Route path="/login" element={<Login auth={auth} />} />  
                   <Route path="/notifications" element={<Notifications />} />  
                   <Route path="/friends" element={<Friends user={user} db={db} />} />  
                   <Route path="/menu" element={<Menu />} />  
                   <Route path="/settings" element={<Settings />} />  
                   <Route path="/events" element={<Events db={db} user={user} />} />  
                   <Route path="/event/:id/edit" element={<EditEvent db={db} />} />  
                   <Route path="/event/:id" element={<EventDetails db={db} />} />
                   <Route path="/create-event" element={<CreateEvent db={db} />} />
                   <Route path="/create-account" element={<CreateAccount />} />
                   <Route path="/edit-profile" element={<EditProfile user={user} db={db} storage={storage} />} />  
                   <Route path="/event-form" element={<EventForm db={db} user={user} />} />   
                   <Route path="/map" element={<MapPage db={db} user={user} />} />
                   <Route path="/save-button" element={<SaveButtonControl />} />
           </Routes>
           </div>
               <MobileNav/>
       </Router>  
   );  
};  

export default App;
