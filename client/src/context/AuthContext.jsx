// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Make sure this path points to your actual Firebase configuration file
import { auth } from "../config/firebase";
// 1. Create the context
export const AuthContext = createContext();

// 2. Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Create the Provider component
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth state check

  // This is the core of the solution:
  // It sets up a listener that Firebase calls whenever the auth state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If the user object exists, they are logged in. If not, they are logged out.
      setCurrentUser(user);
      setLoading(false); // Auth state has been confirmed
    });

    // This is a cleanup function that removes the listener when the component is no longer on screen
    // to prevent memory leaks.
    return unsubscribe;
  }, []); // The empty array [] ensures this effect runs only once

  // The actual logout function that signs the user out from Firebase
  const logout = () => {
    return signOut(auth);
  };

  // The value provided to all child components
  const value = {
    currentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* We wait until the initial auth check is done before rendering the app */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;