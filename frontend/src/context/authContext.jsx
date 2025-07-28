import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { setAuthToken, clearAuthToken } from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setAuthToken(token);

        console.log("token", token);
        const tokenExpiry = JSON.parse(atob(token.split(".")[1])).exp * 1000;

        const currentTime = Date.now();
        const timeUntilExpiry = tokenExpiry - currentTime;

        if (timeUntilExpiry > 0) {
          setTimeout(() => handleLogout(), timeUntilExpiry);
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
        handleLogout(); // clear bad data
      }
    }
  }, []);

  const handleLogin = (token, userData) => {
    setAuthToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);

    // Set token expiry (2 hours)
    setTimeout(() => {
      handleLogout();
    }, 2 * 60 * 60 * 1000);
  };

  const handleRegister = async (username, email, password) => {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/register", {
        username,
        email,
        password,
      });

      return res.data.message;
    } catch (err) {
      throw err.response?.data?.message || "Registration failed";
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
