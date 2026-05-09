import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize the app with the system-provided configuration
const app = initializeApp(firebaseConfig);

// Connect to the specific database ID specified in the configuration
// This matches the database where rules were deployed
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

// Export auth for login components
export const auth = getAuth(app);
