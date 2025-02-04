import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig, googleAuthProvider, auth } from "./config";

import {
    signInWithPopup,
    onAuthStateChanged as _onAuthStateChanged,
    getAuth,
    getIdToken,
    signInWithRedirect,
    getRedirectResult
} from "firebase/auth";

//import { initializeApp } from "firebase/app";
import { getInstallations, getToken } from "firebase/installations";
import { Toaster, toast } from "react-hot-toast";

// const app = initializeApp(firebaseConfig); // Initialize the app here

// const auth = getAuth(app); // Moved to config.js

export function onAuthStateChanged(cb) {
    return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
    // const provider = new GoogleAuthProvider(); // Moved to config.js

    try {
        toast.success(`Before login`);

        const db = getFirestore(app);
        await addDoc(collection(db, "logging"), {"starting": "starting login"});

        await signInWithRedirect(auth, googleAuthProvider);
    } catch (error) {
        const db = getFirestore(app);
        await addDoc(collection(db, "logging"), {"starting": "error login"});

        console.error("Error during sign-in with redirect:", error);
        throw error;
    }
}

export async function handleRedirectResult() {
    console.log("handleRedirectResult called"); // Log statement to confirm function call
    
    const db = getFirestore(app);
    await addDoc(collection(db, "logging"), {"next": "starting handleRedirectResult"});


    try {
        await addDoc(collection(db, "logging"), {"next": "before getRedirectResult"});

        const result = await getRedirectResult(auth);

        await addDoc(collection(db, "logging"), {"next": result.user.displayName});
        await addDoc(collection(db, "logging"), {"next": "after getRedirectResult"});

        if (result) {
            // User signed in successfully.
            const user = result.user;
            toast.success(`Welcome, ${user.displayName}!`);
            console.log("User email:", user.email);
            await addDoc(collection(db, "logging"), {"next": user.email});
            // Additional user info can be accessed here.
            return user;
        }
    } catch (error) {
        toast.error("Google Sign-In failed!");
        console.error("Error handling redirect result:", error);
        throw error;
    }
}

export async function signOut() {
    try {
      return auth.signOut();
    } catch (error) {
      console.error("Error signing out with Google", error);
    }
}

async function fetchWithFirebaseHeaders(request) {
    const installations = getInstallations(app);
    const headers = new Headers(request.headers);
    const [authIdToken, installationToken] = await Promise.all([
      getAuthIdToken(auth),
      getToken(installations),
    ]);
    headers.append("Firebase-Instance-ID-Token", installationToken);
    if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
    const newRequest = new Request(request, { headers });
    return await fetch(newRequest);
}

async function getAuthIdToken(auth) {
    await auth.authStateReady();
    if (!auth.currentUser) return;
    return await getIdToken(auth.currentUser);
}
