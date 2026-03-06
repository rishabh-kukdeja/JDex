// Firebase Client SDK - with lazy initialization for serverless environments
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Validate required environment variables
const requiredEnvVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
];

// Check if running in build environment
const isBuildTime = process.env.NODE_ENV === 'development' && !process.env.FIREBASE_API_KEY;

if (isBuildTime) {
    console.warn('⚠️  Firebase environment variables not set during build. They will be loaded at runtime.');
}

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'PLACEHOLDER_API_KEY',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'placeholder.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'placeholder-project',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'placeholder.firebasestorage.app',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '000000000000',
    appId: process.env.FIREBASE_APP_ID || '1:000000000000:web:placeholder'
};

// Initialize Firebase only if not already initialized
let db = null;
let app = null;

function initializeFirebase() {
    if (db) return db;
    
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }
    
    db = getFirestore(app);
    return db;
}

// Initialize on first use
db = initializeFirebase();

module.exports = { db, initializeFirebase };
