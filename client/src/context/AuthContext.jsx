import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [isGuest, setIsGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestAvatar, setGuestAvatar] = useState('');
  const [authType, setAuthType] = useState(''); // 'user' | 'guest' | ''

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        const userData = {
          name: firebaseUser.displayName || firebaseUser.email,
          uid: firebaseUser.uid,
          avatar: firebaseUser.photoURL || '',
        };
        setUser(userData);
        setAuthType('user');
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // User is signed out
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
          setUser(storedUser);
          setAuthType('user');
        }
      }
    });

    // Load guest data if exists
    const storedGuest = JSON.parse(localStorage.getItem('guest'));
    if (storedGuest && storedGuest.name) {
      setIsGuest(true);
      setGuestName(storedGuest.name);
      setGuestAvatar(storedGuest.avatar || '');
      setAuthType('guest');
    }

    return () => unsubscribe();
  }, []);

  const loginAsGuest = (name, avatar) => {
    setIsGuest(true);
    setGuestName(name);
    setGuestAvatar(avatar);
    setAuthType('guest');
    localStorage.setItem('guest', JSON.stringify({ name, avatar }));
  };

  const logoutGuest = () => {
    setIsGuest(false);
    setGuestName('');
    setGuestAvatar('');
    setAuthType('');
    localStorage.removeItem('guest');
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear local state
      setUser(null);
      setAuthType('');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      logoutGuest(); // Also clears guest if any
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isGuest,
        guestName,
        guestAvatar,
        authType,
        loginAsGuest,
        logoutGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
