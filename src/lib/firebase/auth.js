// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { firebaseConfig } from "./config";

import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged as _onAuthStateChanged,
    getAuth,
    getIdToken,
    signInWithRedirect,
    getRedirectResult
} from "firebase/auth";

import { initializeApp } from "firebase/app";
import { getInstallations, getToken } from "firebase/installations";

import { auth } from './clientApp';

export function onAuthStateChanged(cb) {
    return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        await signInWithRedirect(auth, provider);
        // Handle the redirect result in your component or another function
    } catch (error) {
        console.error("Error during sign-in with redirect:", error);
        throw error;
    }
}

export async function handleRedirectResult() {
    try {
        const result = await getRedirectResult(auth);
        if (result) {
            // User signed in successfully.
            const user = result.user;
            // Additional user info can be accessed here.
            return user;
        }
    } catch (error) {
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
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
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
