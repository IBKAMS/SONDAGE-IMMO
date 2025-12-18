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
  // identifier peut être un email ou un numéro de téléphone
  const login = async (identifier, password) => {
    try {
      // Déterminer si c'est un email
      const isEmail = identifier.includes('@');

      // D'abord essayer la connexion admin (seulement si c'est un email)
      if (isEmail) {
        try {
          const adminResponse = await axios.post(`${API_URL}/api/auth/login`, {
            email: identifier,
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
          // Si l'admin échoue, on continue avec apporteur
          if (!adminError.response || adminError.response.status !== 401) {
            throw adminError;
          }
        }
      }

      // Essayer la connexion apporteur (email ou téléphone)
      try {
        const apporteurResponse = await axios.post(`${API_URL}/api/apporteur/login`, {
          identifier,
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
        return {
          success: false,
          message: 'Identifiants incorrects'
        };
      }

      return {
        success: false,
        message: 'Identifiants incorrects'
      };
    } catch (error) {
      console.error('Login error:', error);

      // Handle different error scenarios
      if (error.response) {
        return {
          success: false,
          message: error.response.data.message || 'Identifiants incorrects'
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

  // Admin se connecte en tant qu'apporteur
  const loginAsApporteur = async (apporteurIdentifier, adminEmail, adminPassword) => {
    try {
      const response = await axios.post(`${API_URL}/api/apporteur/admin-login-as`, {
        apporteurIdentifier,
        adminEmail,
        adminPassword
      });

      if (response.data.success) {
        const { token: authToken, apporteur, isImpersonation, adminName } = response.data;

        // Store in localStorage
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify({ ...apporteur, isImpersonation, adminName }));
        localStorage.setItem('userType', 'apporteur');
        localStorage.setItem('isImpersonation', 'true');

        // Update state
        setToken(authToken);
        setUser({ ...apporteur, isImpersonation, adminName });
        setUserType('apporteur');

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

        return { success: true, userType: 'apporteur', isImpersonation: true };
      }

      return {
        success: false,
        message: response.data.message || 'Erreur de connexion'
      };
    } catch (error) {
      console.error('Login as apporteur error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la connexion'
      };
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('isImpersonation');

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
    loginAsApporteur,
    logout,
    checkAuth,
    isAuthenticated: !!token && !!user,
    isAdmin: userType === 'admin',
    isApporteur: userType === 'apporteur',
    isImpersonation: user?.isImpersonation || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
