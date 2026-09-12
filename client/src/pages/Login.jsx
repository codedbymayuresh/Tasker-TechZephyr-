import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#0a0a0c',
      fontFamily: "'Share Tech Mono', monospace",
      color: '#fff',
      padding: '1rem'
    }}>
      <div style={{
        background: '#121215',
        border: '2px solid #00f0ff',
        width: '400px',
        padding: '2.5rem',
        boxShadow: '0 0 30px rgba(0,240,255,0.25)',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#00f0ff', margin: '0 0 0.5rem 0', letterSpacing: '2px', textShadow: '0 0 10px rgba(0,240,255,0.5)', fontSize: '1.8rem' }}>
            SYSTEM ACCESS
          </h1>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>AUTHENTICATE TO DEPLOYMENT DECK</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.2rem' }}>
            <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '0.4rem', letterSpacing: '1px' }}>EMAIL</label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@net.net"
              style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid #333', color: '#fff', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ marginBottom: '1.8rem' }}>
            <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.75rem', color: '#888', marginBottom: '0.4rem', letterSpacing: '1px' }}>PASSWORD</label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.8rem', background: '#000', border: '1px solid #333', color: '#fff', fontFamily: 'inherit' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            style={{ width: '100%', padding: '0.85rem', background: '#00f0ff', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', letterSpacing: '1.5px', fontFamily: 'inherit', boxShadow: '0 0 15px rgba(0,240,255,0.4)' }}>
            {submitting ? 'AUTHENTICATING...' : 'LOG IN'}
          </button>

          {error && <p className="error-message" role="alert" style={{ background: 'rgba(255,0,60,0.1)', border: '1px solid #ff003c', padding: '0.8rem', marginTop: '1rem', color: '#ff003c', textAlign: 'center', fontSize: '0.85rem' }}>{error}</p>}
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#888' }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: '#00f0ff', textDecoration: 'none', fontWeight: 'bold' }}>
            [ Sign up ]
          </Link>
        </div>
      </div>
    </div>
  );
}