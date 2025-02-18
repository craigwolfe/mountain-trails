// src/components/Home.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css'; // Import the CSS file

interface HomeProps {
    user: any;
}

const Home: React.FC<HomeProps> = ({ user }) => {
    return (
        <div className="master-container">
            <h1>Welcome to MTB Trails</h1>
            <h1>Hi, {user?.name || "Rider"}!</h1>
            <p>Explore, save, and share your favorite trails!</p>
         
                {/*<Link to="/save-trail">Save a Trail</Link> |*/}
                {/*<Link to="/upload-video">Upload a Video</Link> |*/}
                {/*<Link to="/profile">View Profile</Link> |*/}
                {/*<Link to="/login">Login</Link>*/}
        
        </div>
    );
};

export default Home;
