import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="cyber-sidebar">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #222' }}>
        <h2 style={{ color: '#00f0ff', margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>
          TASKER
        </h2>
      </div>

      <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <Link 
          to="/dashboard" 
          style={{
            padding: '0.8rem 1rem',
            background: isActive('/dashboard') ? 'rgba(0,240,255,0.1)' : 'transparent',
            border: isActive('/dashboard') ? '1px solid #00f0ff' : '1px solid transparent',
            color: isActive('/dashboard') ? '#00f0ff' : '#888',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            letterSpacing: '1px'
          }}>
          &gt; DASHBOARD
        </Link>
        <Link 
          to="/shop" 
          style={{
            padding: '0.8rem 1rem',
            background: isActive('/shop') ? 'rgba(0,240,255,0.1)' : 'transparent',
            border: isActive('/shop') ? '1px solid #00f0ff' : '1px solid transparent',
            color: isActive('/shop') ? '#00f0ff' : '#888',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            letterSpacing: '1px'
          }}>
          &gt; BLACK MARKET
        </Link>
      </nav>

      <div style={{ padding: '1rem', marginTop: 'auto', borderTop: '1px solid #222' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.7rem',
            background: 'rgba(255,0,60,0.1)',
            border: '1px solid #ff003c',
            color: '#ff003c',
            fontFamily: 'inherit',
            fontWeight: 'bold',
            cursor: 'pointer',
            letterSpacing: '1px'
          }}>
          [ DISCONNECT ]
        </button>
      </div>
    </aside>
  );
}