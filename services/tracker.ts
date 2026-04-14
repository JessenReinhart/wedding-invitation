import { doc, getDoc, setDoc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const TRACKER_DOC = 'registry_visits';
const COLLECTION = 'page_stats';

// Log visit mechanism with localStorage so it only trips once per browser
export const logRegistryVisit = async () => {
    try {
        const hasVisited = localStorage.getItem('vj_registry_visited');
        if (hasVisited) {
            return; // Already tracked for this device/browser
        }

        const docRef = doc(db, COLLECTION, TRACKER_DOC);
        await setDoc(docRef, { views: increment(1) }, { merge: true });
        
        localStorage.setItem('vj_registry_visited', 'true');
    } catch (error) {
        console.error("Failed to log registry visit:", error);
    }
};

// Subscribe to views count
export const subscribeToRegistryVisits = (callback: (views: number) => void) => {
    const docRef = doc(db, COLLECTION, TRACKER_DOC);
    
    return onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
            callback(snap.data()?.views || 0);
        } else {
            callback(0);
        }
    }, (error) => {
        console.error("Error subscribing to registry visits:", error);
    });
};
