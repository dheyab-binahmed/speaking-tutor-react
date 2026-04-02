import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('polylingo_auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('polylingo_auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && email.includes('@') && password.length >= 4) {
          const storedAccounts = JSON.parse(localStorage.getItem('polylingo_accounts') || '{}');
          const account = storedAccounts[email.toLowerCase()];
          const userData = account
            ? { ...account, authenticated: true }
            : {
                email,
                name: email.split('@')[0],
                age: null,
                preferredLanguage: 'Spanish',
                authenticated: true,
                assessmentCompleted: false,
                joinedAt: new Date().toISOString(),
                streak: 0,
                totalMinutes: 0,
                achievements: 0,
              };
          setUser(userData);
          localStorage.setItem('polylingo_auth_user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 600);
    });
  };

  const register = ({ name, email, age, password, preferredLanguage }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password || !preferredLanguage) {
          reject(new Error('All fields are required'));
          return;
        }
        if (!email.includes('@')) {
          reject(new Error('Please enter a valid email address'));
          return;
        }
        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters'));
          return;
        }
        const storedAccounts = JSON.parse(localStorage.getItem('polylingo_accounts') || '{}');
        if (storedAccounts[email.toLowerCase()]) {
          reject(new Error('An account with this email already exists'));
          return;
        }
        const userData = {
          email,
          name,
          age: parseInt(age) || null,
          preferredLanguage,
          authenticated: true,
          assessmentCompleted: false,
          joinedAt: new Date().toISOString(),
          streak: 0,
          totalMinutes: 0,
          achievements: 0,
        };
        storedAccounts[email.toLowerCase()] = userData;
        localStorage.setItem('polylingo_accounts', JSON.stringify(storedAccounts));
        setUser(userData);
        localStorage.setItem('polylingo_auth_user', JSON.stringify(userData));
        resolve(userData);
      }, 700);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('polylingo_auth_user');
  };

  const completeAssessment = (results = {}) => {
    const updated = { ...user, assessmentCompleted: true, assessmentResults: results };
    setUser(updated);
    localStorage.setItem('polylingo_auth_user', JSON.stringify(updated));
    const storedAccounts = JSON.parse(localStorage.getItem('polylingo_accounts') || '{}');
    if (user?.email && storedAccounts[user.email.toLowerCase()]) {
      storedAccounts[user.email.toLowerCase()] = updated;
      localStorage.setItem('polylingo_accounts', JSON.stringify(storedAccounts));
    }
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('polylingo_auth_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, completeAssessment, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
