"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleAuthProvider } from "../lib/firebase/config";
import { signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import Cookies from "js-cookie";

import app from "../lib/firebase/clientApp";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

// Create Auth Context
const AuthContext = createContext();

// Provide Auth State
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure persistence is set before any auth action
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("Persistence set to localStorage");
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  
    // Check if the user is returning from redirect using the cookie
    if (Cookies.get("redirecting") === "true") {
      console.log("Returning from redirect... Fetching user data.");
  
      getRedirectResult(auth)
        .then((result) => {
          if (result?.user) {
            console.log("User restored after redirect:", result.user);
            setUser(result.user);
          }
        })
        .catch((error) => {
          console.error("Auth Error:", error);
        })
        .finally(() => {
          Cookies.remove("redirecting"); // Cleanup the cookie
          setLoading(false);
        });
    }
  
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User detected:", currentUser);
      }
      setUser(currentUser);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  

  // Handle Sign-In
  const login = async () => {
    try {
      toast.success(`Before login`);

      const db = getFirestore(app);
      await addDoc(collection(db, "logging"), { "starting": "starting login" });

      // Store redirecting state in a cookie (expires in 5 minutes)
      Cookies.set("redirecting", "true", { expires: 1 / 288, path: "/" });

      await signInWithRedirect(auth, googleAuthProvider);
    } catch (error) {
      const db = getFirestore(app);
      await addDoc(collection(db, "logging"), { "starting": "error login" });

      console.error("Login error:", error);
    }
  };

  // Handle Sign-Out
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

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