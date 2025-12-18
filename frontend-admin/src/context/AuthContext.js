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
  const [userType, setUserType] = useState(null); // 'admin' ou 'apporteur'
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
      const storedUserType = localStorage.getItem('userType');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setUserType(storedUserType || 'admin');

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

  // Login function - essaie d'abord admin, puis apporteur
  const login = async (email, password) => {
    try {
      // D'abord essayer la connexion admin
      try {
        const adminResponse = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password
        });

        if (adminResponse.data.success) {
          const { token: authToken, admin } = adminResponse.data;

          // Store in localStorage
          localStorage.setItem('token', authToken);
          localStorage.setItem('user', JSON.stringify(admin));
          localStorage.setItem('userType', 'admin');

          // Update state
          setToken(authToken);
          setUser(admin);
          setUserType('admin');

          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

          return { success: true, userType: 'admin' };
        }
      } catch (adminError) {
        // Si l'admin échoue avec 401, essayer apporteur
        if (adminError.response && adminError.response.status === 401) {
          // Essayer la connexion apporteur
          try {
            const apporteurResponse = await axios.post(`${API_URL}/api/apporteur/login`, {
              email,
              password
            });

            if (apporteurResponse.data.success) {
              const { token: authToken, apporteur } = apporteurResponse.data;

              // Store in localStorage
              localStorage.setItem('token', authToken);
              localStorage.setItem('user', JSON.stringify(apporteur));
              localStorage.setItem('userType', 'apporteur');

              // Update state
              setToken(authToken);
              setUser(apporteur);
              setUserType('apporteur');

              // Set axios default header
              axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

              return { success: true, userType: 'apporteur' };
            }
          } catch (apporteurError) {
            // Les deux ont échoué
            return {
              success: false,
              message: 'Email ou mot de passe incorrect'
            };
          }
        } else {
          throw adminError;
        }
      }

      return {
        success: false,
        message: 'Email ou mot de passe incorrect'
      };
    } catch (error) {
      console.error('Login error:', error);

      // Handle different error scenarios
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message || 'Email ou mot de passe incorrect'
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Impossible de se connecter au serveur'
        };
      } else {
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
    localStorage.removeItem('userType');

    // Clear state
    setToken(null);
    setUser(null);
    setUserType(null);

    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    userType,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!token && !!user,
    isAdmin: userType === 'admin',
    isApporteur: userType === 'apporteur'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
