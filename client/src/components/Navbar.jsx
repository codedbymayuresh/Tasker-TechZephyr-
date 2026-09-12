import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/dashboard" className="nav-brand">
        CYBERTASK.EXE
      </Link>
      {user && (
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/shop">Shop</Link>
          
          {/* Cyberpunk Stats Section */}
          <div className="cyber-user-stats">
            <span className="stat-badge level-badge" aria-label={`Level ${user.level}`}>
              LVL {user.level}
            </span>
            <span className="stat-badge credits-badge" aria-label={`${user.gold} credits`}>
              {user.gold} CR
            </span>
          </div>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}