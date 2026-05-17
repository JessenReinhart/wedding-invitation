import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyBYS5Apl_32tnrWB267boU0dBjmCOdh7pk",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "vj-wedding-registry.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "vj-wedding-registry",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "vj-wedding-registry.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "682042806746",
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:682042806746:web:52cf6cc20069d2b1b230e3",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-ZNMV0JVEYS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
