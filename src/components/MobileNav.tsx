// src/components/MobileNav.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css'; // Import the CSS file

const MobileNav: React.FC = () => {
  return (
    <nav className="mobile-nav">
      <Link to="/save-trail">
        <i className="fas fa-mountain"></i>
        <span>Trails</span>
      </Link>
      <Link to="/profile">
        <i className="fas fa-user"></i>
        <span>Profile</span>
      </Link>
      <Link to="/video">
        <i className="fas fa-video"></i>
        <span>Video</span>
      </Link>
      <Link to="/notifications">
        <i className="fas fa-bell"></i>
        <span>Notifications</span>
      </Link>
      <Link to="/friends">
        <i className="fas fa-users"></i>
        <span>Friends</span>
          </Link>
          <Link to="/menu">
              <i className="fas fa-bars"></i>
              <span>Menu</span>
          </Link>
    </nav>
  );
};

export default MobileNav;
