import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
    apiKey: "AIzaSyBVihl3qr_pRU7x5yCJL5V_zxBIhfswCgo",
    authDomain: "jgenwebapp.firebaseapp.com",
    projectId: "jgenwebapp",
    storageBucket: "jgenwebapp.firebasestorage.app",
    messagingSenderId: "453561510234",
    appId: "1:453561510234:web:61f8d2db95153708c52b63",
    measurementId: "G-BMK9PKBXHE"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
/*
if (typeof window !== 'undefined') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
}*/

export { auth, provider };
