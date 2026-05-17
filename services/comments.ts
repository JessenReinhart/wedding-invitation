import {
    collection,
    addDoc,
    onSnapshot,
    query,
    serverTimestamp,
    type Unsubscribe,
    type Timestamp,
    deleteDoc,
    doc,
    where
} from 'firebase/firestore';
import { db } from '../firebase';
import { getTenantId, isDefaultTenant } from './tenant';

export interface CommentEntry {
    id: string;
    name: string;
    message: string;
    createdAt: Timestamp;
    tenantId?: string;
}

export interface CommentInput {
    name: string;
    message: string;
}

const COLLECTION = 'comments';

/**
 * Submit a new wish/comment to Firestore.
 */
export async function submitComment(data: CommentInput): Promise<string> {
    const tenantId = getTenantId();
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
        tenantId,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Subscribe to real-time updates on latest comments.
 */
export function subscribeToComments(
    callback: (comments: CommentEntry[]) => void,
    maxCount: number = 50
): Unsubscribe {
    const tenantId = getTenantId();
    const qTenant = query(
        collection(db, COLLECTION),
        where('tenantId', '==', tenantId)
    );

    const state: { tenant?: CommentEntry[]; legacy?: CommentEntry[] } = {};

    const emit = () => {
        const merged = [...(state.tenant ?? []), ...(state.legacy ?? [])];
        const byId = new Map<string, CommentEntry>();
        merged.forEach((c) => byId.set(c.id, c));
        const next = Array.from(byId.values()).sort((a, b) => {
            const aSec = (a.createdAt as any)?.seconds ?? 0;
            const bSec = (b.createdAt as any)?.seconds ?? 0;
            return bSec - aSec;
        });
        callback(next.slice(0, maxCount));
    };

    const unsubTenant = onSnapshot(qTenant, (snapshot) => {
        state.tenant = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as CommentEntry[];
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
        state.legacy = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as CommentEntry[];
        emit();
    });

    return () => {
        unsubTenant();
        unsubLegacy();
    };
}

/**
 * Delete a comment (Admin function).
 */
export async function deleteComment(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}
