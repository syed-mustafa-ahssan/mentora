// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // --- ADD THIS STATE ---
  // This state will be used to trigger re-fetches when user data changes
  const [userUpdateTrigger, setUserUpdateTrigger] = useState({});

  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Decode the token to get user info
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          token,
          ...payload,
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []); // Only run on mount

  const login = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        token,
        ...payload,
      });
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error decoding token:", error);
      throw new Error("Invalid token format");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // --- ADD THIS FUNCTION ---
  // Call this function after successfully updating user profile data on the backend
  const triggerUserUpdate = () => {
    // Update the object to trigger re-renders for components depending on it
    setUserUpdateTrigger((prev) => ({ ...prev, timestamp: Date.now() }));
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    // --- ADD THIS TO THE CONTEXT VALUE ---
    userUpdateTrigger,
    triggerUserUpdate,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
