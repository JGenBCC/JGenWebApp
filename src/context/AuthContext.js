"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged, getRedirectResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase"; // removed provider and signInWithPopup/signInWithRedirect

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);

  useEffect(() => {
    // Use dummy user only in development; remove from production for proper Firebase auth
    /*if (process.env.NODE_ENV === "development") {
      const dummyUser = {
        displayName: "Dummy User",
        email: "dummy@example.com",
        uid: "dummy-uid",
        // ...other fields...
      };
      setUser(dummyUser);
      setLoading(false);
      return;
    }*/

    // Remove email login redirect handling
    // ...existing onAuthStateChanged code...
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // ...optional phone-specific user properties...
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Phone login function remains as is
  const loginWithPhone = async () => {
    let phoneInput = prompt("Enter your 10-digit phone number:");
    if (!phoneInput) return;
    phoneInput = phoneInput.trim();
    const indianPhoneRegex = /^\d{10}$/;
    let phoneNumber = phoneInput;
    if (indianPhoneRegex.test(phoneInput)) {
      phoneNumber = "+91" + phoneInput;
    } else if (!phoneInput.startsWith("+91") || phoneInput.length !== 13) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: (response) => { /* reCAPTCHA solved */ }
        });
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      const verificationCode = prompt("Enter the verification code you received:");
      if (verificationCode) {
        const result = await confirmationResult.confirm(verificationCode);
        setUser(result.user);
      }
    } catch (error) {
      console.error("Error during phone sign in:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, loginWithPhone, loading, signInLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
