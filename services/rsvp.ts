import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    doc,
    deleteDoc,
    serverTimestamp,
    type Unsubscribe,
    type Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface RSVPEntry {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dietary: string;
    attendance: 'yes' | 'no';
    pax: number;
    createdAt: Timestamp;
}

export interface RSVPInput {
    firstName: string;
    lastName: string;
    email: string;
    dietary: string;
    attendance: 'yes' | 'no' | null;
    pax: number;
}

const COLLECTION = 'rsvps';

/**
 * Submit an RSVP entry to Firestore.
 */
export async function submitRSVP(data: RSVPInput): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dietary: data.dietary,
        attendance: data.attendance,
        pax: data.pax,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Subscribe to real-time updates on all RSVP entries (for admin use).
 */
export function subscribeToRSVPs(
    callback: (entries: RSVPEntry[]) => void
): Unsubscribe {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const entries: RSVPEntry[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as RSVPEntry[];
        callback(entries);
    });
}

/**
 * Delete an RSVP entry from Firestore.
 */
export async function deleteRSVP(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
}
