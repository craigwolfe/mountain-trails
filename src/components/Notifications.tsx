// src/components/Notifications.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // Use useNavigate in React Router v6


const Notifications: React.FC = () => {
  return (
    <div className="master-container">
      <h1>Notifications</h1>
          <p>No new notifications.</p>
          <Link to="/profile">
                    <button>Profile</button>
                </Link>
      </div>
   
  );
};

export default Notifications;
