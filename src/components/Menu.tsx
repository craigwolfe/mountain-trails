import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate in React Router v6
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase auth methods

const Menu: React.FC = () => {
    const navigate = useNavigate(); // Hook for navigation after logging out

    const handleLogout = async () => {
        try {
            const auth = getAuth(); // Get Firebase authentication instance
            await signOut(auth); // Sign out the user
            navigate('/login'); // Redirect to the login page after logout
        } catch (error) {
            console.error('Error logging out: ', error); // Handle any errors
        }
    };

    return (
        <div className="master-container">
            <h1>Menu</h1>
            <div>
                <Link to="/events">
                    <button>Events</button>
                </Link>
                <Link to="/trails">
                    <button>Trails</button>
                </Link>
                <Link to="/video">
                    <button>Video</button>
                </Link>
                <Link to="/friends">
                    <button>Friends</button>
                </Link>
                <Link to="/notifications">
                    <button>Notifications</button>
                </Link>
                <Link to="/profile">
                    <button>Profile</button>
                </Link>
                <Link to="/map">
                    <button>Routes</button>
                </Link>
                <Link to="/create-account">
                    <button>Create Account</button>
                </Link>
                {/* Logout Button */}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Menu;
