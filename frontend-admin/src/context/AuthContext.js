import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated
  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      if (response.data.success) {
        const { token: authToken, admin } = response.data;

        // Store in localStorage
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(admin));

        // Update state
        setToken(authToken);
        setUser(admin);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || 'Erreur de connexion'
        };
      }
    } catch (error) {
      console.error('Login error:', error);

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error
        return {
          success: false,
          message: error.response.data.message || 'Email ou mot de passe incorrect'
        };
      } else if (error.request) {
        // Request made but no response
        return {
          success: false,
          message: 'Impossible de se connecter au serveur'
        };
      } else {
        // Something else happened
        return {
          success: false,
          message: 'Une erreur est survenue'
        };
      }
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setToken(null);
    setUser(null);

    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
