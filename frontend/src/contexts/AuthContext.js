import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [skipValidation, setSkipValidation] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const sessionId = params.get('session_id');

      if (sessionId) {
        try{
          const response = await axios.post(`${API}/auth/session`, {}, {
            headers: { 'X-Session-ID': sessionId }
          });
          const { token: newToken, user: newUser } = response.data;
          setToken(newToken);
          setUser(newUser);
          localStorage.setItem('token', newToken);
          window.location.hash = '';
          window.history.replaceState(null, '', window.location.pathname);
        } catch (err) {
          console.error('Session error:', err);
        }
        setLoading(false);
        return;
      }

      // Skip validation if we just logged in (user data already set)
      if (skipValidation && user) {
        setSkipValidation(false);
        setLoading(false);
        return;
      }

      if (token && !user) {
        try {
          const response = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (err) {
          console.error('Token invalid:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, [token, skipValidation]);

  const login = async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('token', newToken);
    setSkipValidation(true);
    setUser(newUser);
    setToken(newToken);
    return newUser;
  };

  const register = async (email, password, name, role = 'owner') => {
    const response = await axios.post(`${API}/auth/register`, { email, password, name, role });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem('token', newToken);
    setSkipValidation(true);
    setUser(newUser);
    setToken(newToken);
    return newUser;
  };

  const loginWithGoogle = () => {
    const redirectUrl = `${window.location.origin}/`;
    const authUrl = process.env.REACT_APP_AUTH_URL || 'https://auth.emergentagent.com';
    window.location.href = `${authUrl}/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    if (token) {
      try {
        await axios.post(`${API}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);