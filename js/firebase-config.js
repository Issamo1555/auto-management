/**
 * Firebase Configuration
 * Initializes Firebase services for authentication and Firestore
 */

// Firebase configuration - Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, db;

try {
    // Check if Firebase is loaded
    if (typeof firebase !== 'undefined') {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();

        console.log('✅ Firebase initialized successfully');

        // Enable offline persistence
        db.enablePersistence()
            .catch((err) => {
                if (err.code === 'failed-precondition') {
                    console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
                } else if (err.code === 'unimplemented') {
                    console.warn('⚠️ The current browser does not support offline persistence');
                }
            });
    } else {
        console.warn('⚠️ Firebase SDK not loaded. Running in offline mode.');
    }
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Export Firebase instances
window.FirebaseApp = app;
window.FirebaseAuth = auth;
window.FirebaseDB = db;

// Helper to check if Firebase is available
window.isFirebaseAvailable = () => {
    return typeof firebase !== 'undefined' && auth && db;
};
