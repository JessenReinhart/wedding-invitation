import {
    collection,
    addDoc,
    onSnapshot,
    query,
    doc,
    deleteDoc,
    serverTimestamp,
    type Unsubscribe,
    type Timestamp,
    where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getTenantId, isDefaultTenant } from './tenant';

export interface RSVPEntry {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    dietary: string;
    attendance: 'yes' | 'no';
    pax: number;
    createdAt: Timestamp;
    tenantId?: string;
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
    const tenantId = getTenantId();
    const docRef = await addDoc(collection(db, COLLECTION), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dietary: data.dietary,
        attendance: data.pax > 1 ? 'yes' : data.attendance,
        pax: data.pax,
        tenantId,
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
    const tenantId = getTenantId();
    const maxCount = 500;

    const qTenant = query(
        collection(db, COLLECTION),
        where('tenantId', '==', tenantId)
    );

    const state: { tenant?: RSVPEntry[]; legacy?: RSVPEntry[] } = {};

    const emit = () => {
        const merged = [...(state.tenant ?? []), ...(state.legacy ?? [])];
        const byId = new Map<string, RSVPEntry>();
        merged.forEach((e) => byId.set(e.id, e));
        const next = Array.from(byId.values()).sort((a, b) => {
            const aSec = (a.createdAt as any)?.seconds ?? 0;
            const bSec = (b.createdAt as any)?.seconds ?? 0;
            return bSec - aSec;
        });
        callback(next);
    };

    const unsubTenant = onSnapshot(qTenant, (snapshot) => {
        state.tenant = snapshot.docs.map((doc) => {
            const data: any = doc.data();
            return {
                id: doc.id,
                ...data,
                attendance: data.pax > 1 ? 'yes' : data.attendance,
            };
        }) as RSVPEntry[];
        emit();
    });

    if (!isDefaultTenant(tenantId)) {
        return () => {
            unsubTenant();
        };
    }

    const qLegacy = query(
        collection(db, COLLECTION),
        where('tenantId', '==', null)
    );

    const unsubLegacy = onSnapshot(qLegacy, (snapshot) => {
        state.legacy = snapshot.docs.map((doc) => {
            const data: any = doc.data();
            return {
                id: doc.id,
                ...data,
                attendance: data.pax > 1 ? 'yes' : data.attendance,
            };
        }) as RSVPEntry[];
        emit();
    });

    return () => {
        unsubTenant();
        unsubLegacy();
    };
}

/**
 * Delete an RSVP entry from Firestore.
 */
export async function deleteRSVP(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION, id);
    await deleteDoc(docRef);
}
