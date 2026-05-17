import { doc, getDoc, setDoc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getTenantId, isDefaultTenant } from './tenant';

const TRACKER_DOC = 'registry_visits';
const COLLECTION = 'page_stats';

// Log visit mechanism with localStorage so it only trips once per browser
export const logRegistryVisit = async () => {
    try {
        const tenantId = getTenantId();
        const storageKey = `registry_visited_${tenantId}`;
        const hasVisited = localStorage.getItem(storageKey);
        if (hasVisited) {
            return; // Already tracked for this device/browser
        }

        const docId = isDefaultTenant(tenantId) ? TRACKER_DOC : `${TRACKER_DOC}_${tenantId}`;
        const docRef = doc(db, COLLECTION, docId);
        await setDoc(docRef, { views: increment(1) }, { merge: true });
        
        localStorage.setItem(storageKey, 'true');
    } catch (error) {
        console.error("Failed to log registry visit:", error);
    }
};

// Subscribe to views count
export const subscribeToRegistryVisits = (callback: (views: number) => void) => {
    const tenantId = getTenantId();
    const docId = isDefaultTenant(tenantId) ? TRACKER_DOC : `${TRACKER_DOC}_${tenantId}`;
    const docRef = doc(db, COLLECTION, docId);
    
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
