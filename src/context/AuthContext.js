"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, provider } from "../../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signInLoading, setSignInLoading] = useState(false);

  useEffect(() => {
    // Debug dummy user for development
    if (process.env.NODE_ENV === "development") {
      const dummyUser = {
        displayName: "Dummy User",
        email: "dummy@example.com",
        uid: "dummy-uid",
        
        
        
        /*
        //kathir
        userType: "regular",
        phone: "9444377413",
        coordDocId: "Bq67iomOXmwWfYRbXH63",
        userDocId: "sGsLjO82tuJrClZo4MJw",
        */

        
        
        //Rogesh
        userType: "coord",
        phone: "8489284616",
        //coordDocId: "Bq67iomOXmwWfYRbXH63",
        userDocId: "Bq67iomOXmwWfYRbXH63",
        

         
        /*
        //Ashok
        userType: "admin",
        phone: "9994361566",
        //coordDocId: "Bq67iomOXmwWfYRbXH63",
        userDocId: "4NeqZU53OtsdVhOHa6tD",
        */
        
      };


      setUser(dummyUser);
      setLoading(false);
      return;
    }

    // Handle sign-in redirect result
    getRedirectResult(auth)
      .then((result) => {
        window.loggedInUserType = 'regular';

        if (result && result.user) {
          setUser(result.user);

          window.user = result.user;
        }
      })
      .catch((error) => console.error("Error during getRedirectResult:", error));

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      window.loggedInUserType = 'regular';
      window.user = currentUser;

      currentUser.userType = 'admin';
      currentUser.phone = '9994361566';
      currentUser.coordDocId = '4NeqZU53OtsdVhOHa6tD';

      /*
      name: string;
    phone: string;
    dob: string;
    gender: string;
    placeOfStay: string;
    education: string;
    collegeOrCompany: string;
    photo: string | null;
    userType: string;
    coordDocId: string;
      */
      

      if (currentUser) {
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

  const login = async () => {
    setSignInLoading(true);
    try {
    //await signInWithPopup(auth, provider);
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error during sign in:", error);
    } finally {
      setSignInLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, signInLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
