"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleAuthProvider } from "../lib/firebase/config";
import { signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";

import app from "../lib/firebase/clientApp";
import { getFirestore, collection, addDoc } from "firebase/firestore";


// Create Auth Context
const AuthContext = createContext();

// Provide Auth State
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle Sign-In
  const login = async () => {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithRedirect(auth, googleAuthProvider);
  };

  // Handle Sign-Out
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

 /* // Get user after redirect
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error("Auth Error:", error);
      })
      .finally(() => setLoading(false));
  }, []);*/

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (typeof window !== "undefined") {
        window.currentUser = currentUser; // ✅ Now updates correctly!
        window.authContext = { user: currentUser, login, logout }; // ✅ Expose full auth context
      }

      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Auth
export const useAuth = () => {
  return useContext(AuthContext);
};

/*export function onAuthStateChanged(cb) {
    return _onAuthStateChanged(auth, cb);
}*/
