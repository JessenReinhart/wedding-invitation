import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBYS5Apl_32tnrWB267boU0dBjmCOdh7pk",
    authDomain: "vj-wedding-registry.firebaseapp.com",
    projectId: "vj-wedding-registry",
    storageBucket: "vj-wedding-registry.firebasestorage.app",
    messagingSenderId: "682042806746",
    appId: "1:682042806746:web:52cf6cc20069d2b1b230e3",
    measurementId: "G-ZNMV0JVEYS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
