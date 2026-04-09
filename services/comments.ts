import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    limit,
    serverTimestamp,
    type Unsubscribe,
    type Timestamp,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '../firebase';

export interface CommentEntry {
    id: string;
    name: string;
    message: string;
    createdAt: Timestamp;
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
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...data,
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
    const q = query(
        collection(db, COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(maxCount)
    );

    return onSnapshot(q, (snapshot) => {
        const comments: CommentEntry[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as CommentEntry[];
        callback(comments);
    });
}

/**
 * Delete a comment (Admin function).
 */
export async function deleteComment(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
}
