import {
    collection,
    onSnapshot,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    type Unsubscribe,
    where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getTenantId, isDefaultTenant } from './tenant';

export interface RegistryItem {
    id: string;
    name_id: string;
    name_en: string;
    name_ko: string;
    link: string;
    bought: boolean;
    boughtBy: string;
    order: number;
    tenantId?: string;
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
    const tenantId = getTenantId();
    const qTenant = query(collection(db, COLLECTION), where('tenantId', '==', tenantId));

    const state: { tenant?: RegistryItem[]; legacy?: RegistryItem[] } = {};

    const emit = () => {
        const merged = [...(state.tenant ?? []), ...(state.legacy ?? [])];
        const byId = new Map<string, RegistryItem>();
        merged.forEach((i) => byId.set(i.id, i));
        const next = Array.from(byId.values()).sort((a, b) => (a.order - b.order) || 0);
        callback(next);
    };

    const unsubTenant = onSnapshot(qTenant, (snapshot) => {
        state.tenant = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as RegistryItem[];
        emit();
    });

    if (!isDefaultTenant(tenantId)) {
        return () => {
            unsubTenant();
        };
    }

    const qLegacy = query(collection(db, COLLECTION), where('tenantId', '==', null));
    const unsubLegacy = onSnapshot(qLegacy, (snapshot) => {
        state.legacy = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as RegistryItem[];
        emit();
    });

    return () => {
        unsubTenant();
        unsubLegacy();
    };
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
    const tenantId = getTenantId();
    const docRef = await addDoc(collection(db, COLLECTION), { ...item, tenantId });
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
