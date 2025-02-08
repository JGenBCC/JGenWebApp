import { initializeApp } from "firebase/app";
import { getAuth, getIdToken } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

// this is set during install
let firebaseConfig;

self.addEventListener('install', event => {
  // extract firebase config from query string
  const serializedFirebaseConfig = new URL(location).searchParams.get('firebaseConfig');

  if (!serializedFirebaseConfig) {
    throw new Error('Firebase Config object not found in service worker query string.');
  }

  firebaseConfig = JSON.parse(serializedFirebaseConfig);
  initializeApp(firebaseConfig);
  console.log("Service worker installed with Firebase config", firebaseConfig);
});

self.addEventListener("fetch", (event) => {
  const { origin } = new URL(event.request.url);
  if (origin !== self.location.origin) return;
  event.respondWith(fetchWithFirebaseHeaders(event.request));
});

async function fetchWithFirebaseHeaders(request) {
  try {
    const auth = getAuth();
    const token = await getIdToken(auth.currentUser);

    const headers = new Headers(request.headers);
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    return await fetch(request, {
      headers: headers,
    });
  } catch (error) {
    console.error("Error fetching with Firebase headers:", error);
    return await fetch(request);
  }
}

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'JGenWebApp';
  const options = {
    body: event.data.text(),
    icon: '/firebase-logo.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://jgenwebapp.firebaseapp.com/')
  );
});

const messaging = getMessaging();
