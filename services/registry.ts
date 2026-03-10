import {
    collection,
    onSnapshot,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface RegistryItem {
    id: string;
    name_id: string;
    name_en: string;
    name_ko: string;
    link: string;
    bought: boolean;
    boughtBy: string;
    order: number;
}

export type NewRegistryItem = Omit<RegistryItem, 'id'>;

const COLLECTION = 'registryItems';

/**
 * Subscribe to real-time updates on the registry items collection.
 * Returns an unsubscribe function.
 */
export function subscribeToRegistryItems(
    callback: (items: RegistryItem[]) => void
): Unsubscribe {
    const q = query(collection(db, COLLECTION), orderBy('order'));

    return onSnapshot(q, (snapshot) => {
        const items: RegistryItem[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as RegistryItem[];
        callback(items);
    });
}

/**
 * Mark a registry item as bought.
 */
export async function markItemAsBought(
    itemId: string,
    buyerName: string
): Promise<void> {
    const docRef = doc(db, COLLECTION, itemId);
    await updateDoc(docRef, {
        bought: true,
        boughtBy: buyerName,
    });
}

// ─── Admin Operations ──────────────────────────────────

/**
 * Add a new registry item.
 */
export async function addRegistryItem(item: NewRegistryItem): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION), item);
    return docRef.id;
}

/**
 * Update fields on a registry item.
 */
export async function updateRegistryItem(
    itemId: string,
    data: Partial<Omit<RegistryItem, 'id'>>
): Promise<void> {
    const docRef = doc(db, COLLECTION, itemId);
    await updateDoc(docRef, data);
}

/**
 * Delete a registry item.
 */
export async function deleteRegistryItem(itemId: string): Promise<void> {
    const docRef = doc(db, COLLECTION, itemId);
    await deleteDoc(docRef);
}

/**
 * Reset the bought status of a registry item.
 */
export async function resetItemBoughtStatus(itemId: string): Promise<void> {
    const docRef = doc(db, COLLECTION, itemId);
    await updateDoc(docRef, {
        bought: false,
        boughtBy: '',
    });
}
