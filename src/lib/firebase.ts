import { initializeApp } from "firebase/app";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize the app with the system-provided configuration
const app = initializeApp(firebaseConfig);

// Connect to the specific database ID specified in the configuration
// use initializeFirestore to configure long-polling and other settings for better reliability in some environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId || "(default)");

// Export auth for login components
export const auth = getAuth(app);
