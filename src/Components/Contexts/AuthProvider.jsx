import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../../Firebase.init';



export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const GoogleProvider = new GoogleAuthProvider();

  const creatUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, GoogleProvider);
  };

const signOutUser = async () => {
  try {
    await fetch('https://lostfoundserver-five.vercel.app/logout', {
      method: 'POST',
      credentials: 'include'
    });
    await signOut(auth);
    setUser(null);
    setLoading(true);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

  const updateUserProfile = async (profileData) => {
    if (!auth.currentUser) {
      throw new Error('No authenticated user found');
    }

    await updateProfile(auth.currentUser, profileData);
    await auth.currentUser.reload();
    setUser({ ...auth.currentUser });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          await currentUser.getIdToken();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to refresh auth token:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const userinfo = {
    user,
    creatUser,
    signInUser,
    signOutUser,
    loading,
    signInWithGoogle,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={userinfo}>
      {children}
    </AuthContext.Provider>
  );
}
