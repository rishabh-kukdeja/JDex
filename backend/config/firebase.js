// In previous conversations, the user preferred using the Firebase Client SDK
// instead of firebase-admin to avoid service account key hassle for now.
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Add your Firebase configuration details here.
// These typically look like:
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? require('firebase/analytics').getAnalytics(app) : null;
const db = getFirestore(app);

module.exports = { db };
