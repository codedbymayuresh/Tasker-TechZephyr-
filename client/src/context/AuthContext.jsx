import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Holds the logged-in user's data and auth actions (login/signup/logout)
// so any component in the app can read `useAuth()` instead of prop-drilling.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session
  const [error, setError] = useState('');

  // On first load, if there's a saved token, try to fetch the user's
  // profile so a page refresh doesn't log them out.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signup = async (username, email, password) => {
    setError('');
    try {
      const res = await api.post('/auth/signup', { username, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  const login = async (email, password) => {
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Lets other parts of the app (e.g., after completing a task) push
  // fresh user data into context without a full refetch.
  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so components do `const { user, logout } = useAuth();`
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
