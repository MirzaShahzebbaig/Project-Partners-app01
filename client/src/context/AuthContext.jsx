import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('projectpartner_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('projectpartner_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, verify with backend /api/auth/me
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success' && data.user) {
            setUser(data.user);
            localStorage.setItem('projectpartner_user', JSON.stringify(data.user));
          } else {
            logout();
          }
        })
        .catch(() => {
          // If offline or network glitch, preserve cached user
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('projectpartner_user', JSON.stringify(userData));
    localStorage.setItem('projectpartner_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('projectpartner_user');
    localStorage.removeItem('projectpartner_token');
  };

  const updateUserSkills = (newSkills) => {
    if (user) {
      const updated = { ...user, skills: newSkills };
      setUser(updated);
      localStorage.setItem('projectpartner_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUserSkills }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
