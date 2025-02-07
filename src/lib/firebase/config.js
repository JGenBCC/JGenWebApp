import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyBVihl3qr_pRU7x5yCJL5V_zxBIhfswCgo",
  authDomain: "jgenwebapp.firebaseapp.com",
  projectId: "jgenwebapp",
  storageBucket: "jgenwebapp.firebasestorage.app",
  messagingSenderId: "453561510234",
  appId: "1:453561510234:web:61f8d2db95153708c52b63",
  measurementId: "G-BMK9PKBXHE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
