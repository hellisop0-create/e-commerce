import { initializeApp } from "firebase/app";
import { initializeFirestore, CACHE_SIZE_UNLIMITED, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize the app with the system-provided configuration
const app = initializeApp(firebaseConfig);

// Connect to the specific database ID specified in the configuration
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  // Increase timeout or other settings if needed
}, firebaseConfig.firestoreDatabaseId || "(default)");

// Enable offline persistence for better resilience
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firestore persistence failed: Browser not supported');
    }
  });
} catch (err) {
  console.error('Firestore persistence error:', err);
}

// Export auth for login components
export const auth = getAuth(app);
