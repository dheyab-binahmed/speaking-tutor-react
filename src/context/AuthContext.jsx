import React, { createContext, useState, useContext, useEffect } from "react";
import AuthService from "../services/authService";
import TokenService from "../services/tokenService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from stored tokens/user
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = TokenService.getUser();
        if (storedUser && TokenService.isAuthenticated()) {
          setUser(storedUser);
        }
      } catch (e) {
        console.error("Auth initialization error:", e);
        TokenService.clearTokens();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const userData = await AuthService.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMsg = err.message || "Login failed";
      setError(errorMsg);
      throw err;
    }
  };

  const register = async ({
    name,
    email,
    age,
    password,
    preferredLanguage,
    selectedLevel,
  }) => {
    try {
      setError(null);
      // First register the user
      const registerData = await AuthService.register(
        email,
        password,
        name,
        selectedLevel,
        preferredLanguage,
      );

      // Then login automatically
      const userData = await AuthService.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      const errorMsg = err.message || "Registration failed";
      setError(errorMsg);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const completeAssessment = (results = {}) => {
    const updated = {
      ...user,
      assessmentCompleted: true,
      assessmentResults: results,
    };
    setUser(updated);
    TokenService.setUser(updated);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    TokenService.setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        error,
        completeAssessment,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export default AuthContext;
