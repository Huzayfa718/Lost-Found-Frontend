import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
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

  useEffect(() => {
    console.log(user);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
            (async () => {
        const token = await currentUser.getIdToken();
        console.log("User token:", token);
        setUser(currentUser);
        setLoading(false);
      })();
      } else {
        setUser(null);
      }
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
  };

  return (
    <AuthContext.Provider value={userinfo}>
      {children}
    </AuthContext.Provider>
  );
}
