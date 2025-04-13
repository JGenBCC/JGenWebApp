"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged, getRedirectResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import { getFirestore, collection, getDocs, query, where, documentId, addDoc, setDoc, doc } from "firebase/firestore";
import { firebaseApp } from "../lib/firebase/clientApp"; // Import the firebase app instance

const db = getFirestore(firebaseApp);
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);

  useEffect(() => {
    // Log whenever user changes
    console.log("Updated user:", user);
  }, [user]);

  useEffect(() => {
    // Remove email login redirect handling
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userQuery = query(collection(db, "users"), where("phone", "==", currentUser.phoneNumber));

        getDocs(userQuery)
          .then((userSnapshot) => {
            if (!userSnapshot.empty) {
              // User exists
              console.log("User exists");
              // Merge Firestore user details with the Firebase user object and save the document ID
              const firestoreUserData = userSnapshot.docs[0].data();
              setUser({
                ...currentUser,
                displayName: firestoreUserData.displayName,
                phone: firestoreUserData.phone,
                gender: firestoreUserData.gender,
                photoURL: firestoreUserData.photoURL,
                userType: firestoreUserData.userType,
                userDocId: userSnapshot.docs[0].id,
                isProfileComplete: !!(firestoreUserData.displayName && firestoreUserData.gender && firestoreUserData.photoURL) // new property
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } else {
        setUser(null);
      }
      setLoading(false);    
    });
    return () => {
      unsubscribe();
    };
  }, []);

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

        const userQuery = query(collection(db, "users"), where("phone", "==", phoneNumber));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty == false) {
          // User exists
          console.log("User exists");
          // Merge Firestore user details with the Firebase user object and save the document ID
          const firestoreUserData = userSnapshot.docs[0].data();
          setUser({ ...result.user, 
            displayName: firestoreUserData.displayName,
            phone: firestoreUserData.phone,
            gender: firestoreUserData.gender,
            photoURL: firestoreUserData.photoURL,
            userType: firestoreUserData.userType,
            userDocId: userSnapshot.docs[0].id,
            isProfileComplete: !!(firestoreUserData.displayName && firestoreUserData.gender && firestoreUserData.photoURL) // new property
          });
        }
        else {
          // User doesn't exist, handle accordingly
          console.log("User does not exist in Firestore. Creating new user with phone number " + phoneNumber);
          
          // Create a new user in Firestore with the phone number
          const userRef = collection(db, "users");
          const newUser = {
            phone: phoneNumber,
            displayName: null,
            gender: null,
            photoURL: null,
            userType: "regular", // Default user type
            isApproved: false, // New field to indicate admin approval is required
          };

          try {
            const docId = phoneNumber.replace("+91", ""); // Remove +91 from the phone number
            const docRef = await setDoc(doc(userRef, docId), newUser); // Use setDoc with custom docId
            console.log("New user created with ID:", docId);

            // Redirect to updateUserDetails.tsx page
            window.location.href = "/updateUserDetails";
          } catch (error) {
            console.error("Error creating new user:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error during phone sign in:", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    window.location.reload(); // Refresh the page after logout
  };

  return (
    <AuthContext.Provider value={{ user, logout, loginWithPhone, loading, signInLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
