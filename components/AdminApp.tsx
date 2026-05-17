import React, { useMemo, useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, RotateCcw, Save, X, ExternalLink, Gift, Check, Users, Settings } from 'lucide-react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { collection, documentId, getDocs, limit, orderBy, query, startAfter, updateDoc, type DocumentData } from 'firebase/firestore';
import { AdminRSVP } from './AdminRSVP';
import { AdminWishes } from './AdminWishes';
import { Heart } from 'lucide-react';
import {
    subscribeToRegistryItems,
    addRegistryItem,
    updateRegistryItem,
    deleteRegistryItem,
    resetItemBoughtStatus,
    type RegistryItem,
    type NewRegistryItem,
} from '../services/registry';
import { subscribeToRegistryVisits } from '../services/tracker';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { normalizeSiteConfig, type SiteConfig, type SiteLanguage } from '@/services/siteConfig';
import { auth } from '@/firebase';
import { db } from '@/firebase';

const emptyForm: Omit<NewRegistryItem, 'order'> = {
    name_id: '',
    name_en: '',
    name_ko: '',
    link: '',
    bought: false,
    boughtBy: '',
};

type Tab = 'site' | 'registry' | 'rsvp' | 'wishes';
type SortOption = 'default' | 'name' | 'status' | 'buyer';

export const AdminApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('registry');
    const [items, setItems] = useState<RegistryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [addForm, setAddForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [pageViews, setPageViews] = useState<number>(0);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [authOk, setAuthOk] = useState<boolean>(() => {
        try {
            return window.sessionStorage.getItem('admin_auth_ok_v1') === '1';
        } catch {
            return false;
        }
    });
    const [authPw, setAuthPw] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [firebaseAuthError, setFirebaseAuthError] = useState<string | null>(null);
    const [authBusy, setAuthBusy] = useState(false);

    const requiredPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD as string | undefined;
    const requiresAuth = Boolean(requiredPassword && requiredPassword.trim().length > 0);

    useEffect(() => {
        return onAuthStateChanged(auth, (u) => setUser(u));
    }, []);

    const sortedItems = [...items].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return (a.name_id || a.name_en || '').localeCompare(b.name_id || b.name_en || '');
            case 'status':
                return (a.bought === b.bought) ? 0 : a.bought ? -1 : 1;
            case 'buyer':
                return (a.boughtBy || '').localeCompare(b.boughtBy || '');
            case 'default':
            default:
                return a.order - b.order || 0;
        }
    });

    useEffect(() => {
        if (activeTab !== 'registry') return;
        setLoading(true);

        const unsubscribeItems = subscribeToRegistryItems((data) => {
            setItems(data);
            setLoading(false);
        });

        const unsubscribeVisits = subscribeToRegistryVisits((views) => {
            setPageViews(views);
        });

        return () => {
            unsubscribeItems();
            unsubscribeVisits();
        };
    }, [activeTab]);

    const handleLogin = () => {
        if (!requiresAuth) return;
        if (authPw === requiredPassword) {
            setAuthOk(true);
            setAuthError(null);
            try {
                window.sessionStorage.setItem('admin_auth_ok_v1', '1');
            } catch {
                undefined;
            }
            return;
        }
        setAuthError('Invalid password');
    };

    const handleFirebaseLogin = async () => {
        setAuthBusy(true);
        setFirebaseAuthError(null);
        try {
            await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        } catch (err) {
            console.error('Firebase auth login failed:', err);
            const message =
                (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string')
                    ? (err as any).message
                    : 'Unknown error';
            const code =
                (err && typeof err === 'object' && 'code' in err && typeof (err as any).code === 'string')
                    ? (err as any).code
                    : null;
            setFirebaseAuthError(code ? `${code}: ${message}` : message);
        } finally {
            setAuthBusy(false);
        }
    };

    const handleFirebaseLogout = async () => {
        setAuthBusy(true);
        setFirebaseAuthError(null);
        try {
            await signOut(auth);
        } catch (err) {
            console.error('Firebase auth logout failed:', err);
        } finally {
            setAuthBusy(false);
        }
    };

    // ─── ADD ────────────────────────────────────────────
    const handleAdd = async () => {
        if (!addForm.name_id.trim()) return;
        setSubmitting(true);
        try {
            const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) + 1 : 1;
            await addRegistryItem({ ...addForm, order: nextOrder });
            setAddForm(emptyForm);
            setShowAddForm(false);
        } catch (err) {
            console.error('Failed to add item:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // ─── EDIT ───────────────────────────────────────────
    const startEdit = (item: RegistryItem) => {
        setEditingId(item.id);
        setEditForm({
            name_id: item.name_id,
            name_en: item.name_en,
            name_ko: item.name_ko,
            link: item.link,
            bought: item.bought,
            boughtBy: item.boughtBy,
        });
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        setSubmitting(true);
        try {
            await updateRegistryItem(editingId, editForm);
            setEditingId(null);
        } catch (err) {
            console.error('Failed to update item:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // ─── DELETE ─────────────────────────────────────────
    const handleDelete = async (id: string) => {
        setSubmitting(true);
        try {
            await deleteRegistryItem(id);
            setDeletingId(null);
        } catch (err) {
            console.error('Failed to delete item:', err);
        } finally {
            setSubmitting(false);
        }
    };

    // ─── RESET BOUGHT ──────────────────────────────────
    const handleReset = async (id: string) => {
        try {
            await resetItemBoughtStatus(id);
        } catch (err) {
            console.error('Failed to reset item:', err);
        }
    };

    if (requiresAuth && !authOk) {
        return (
            <div className="min-h-screen bg-wine-dark text-ivory font-sans flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-ivory/5 border border-ivory/10 p-8">
                    <h1 className="font-display text-2xl tracking-wide mb-2">Admin Login</h1>
                    <p className="text-sm text-ivory/50 mb-6">Enter the admin password to continue.</p>
                    <label className="block text-xs tracking-widest uppercase text-ivory/40 mb-2 font-sans">Password</label>
                    <input
                        type="password"
                        value={authPw}
                        onChange={(e) => setAuthPw(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleLogin();
                        }}
                        className="w-full px-4 py-3 border border-ivory/20 bg-transparent font-sans text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-ivory/50 transition-colors"
                    />
                    {authError && <div className="mt-3 text-xs tracking-widest uppercase text-red-300">{authError}</div>}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleLogin}
                            className="flex items-center gap-2 px-5 py-3 bg-ivory text-wine font-sans text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors"
                        >
                            <Save size={14} /> Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-wine-dark text-ivory font-sans flex items-center justify-center px-6">
                <div className="w-full max-w-md bg-ivory/5 border border-ivory/10 p-8">
                    <h1 className="font-display text-2xl tracking-wide mb-2">Admin Login</h1>
                    <p className="text-sm text-ivory/50 mb-6">Sign in with Firebase to manage and save data.</p>

                    <label className="block text-xs tracking-widest uppercase text-ivory/40 mb-2 font-sans">Email</label>
                    <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-ivory/20 bg-transparent font-sans text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-ivory/50 transition-colors"
                    />

                    <label className="block text-xs tracking-widest uppercase text-ivory/40 mb-2 font-sans mt-4">Password</label>
                    <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleFirebaseLogin();
                        }}
                        className="w-full px-4 py-3 border border-ivory/20 bg-transparent font-sans text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-ivory/50 transition-colors"
                    />

                    {firebaseAuthError && (
                        <div className="mt-3 text-xs tracking-widest uppercase text-red-300">
                            {firebaseAuthError}
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleFirebaseLogin}
                            disabled={authBusy || !authEmail.trim() || !authPassword}
                            className="flex items-center gap-2 px-5 py-3 bg-ivory text-wine font-sans text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Save size={14} /> {authBusy ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-wine-dark text-ivory font-sans">
            {/* Header */}
            <header className="border-b border-ivory/10 px-6 py-6 md:px-12">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl tracking-wide">Admin Dashboard</h1>
                        <p className="font-sans text-ivory/40 text-sm mt-1">
                            {activeTab === 'site' && 'Edit branding, names, locations, and site copy'}
                            {activeTab === 'registry' && 'Manage your wedding registry items'}
                            {activeTab === 'rsvp' && 'View guest RSVP responses'}
                            {activeTab === 'wishes' && 'Manage guest wishes and messages'}
                        </p>
                    </div>
                    <a
                        href="/"
                        className="font-sans text-xs tracking-widest uppercase text-ivory/50 hover:text-ivory transition-colors border border-ivory/20 px-4 py-2 hover:border-ivory/40"
                    >
                        ← Back to Site
                    </a>
                </div>
                <div className="max-w-5xl mx-auto mt-4 flex items-center justify-between">
                    <div className="text-xs tracking-widest uppercase text-ivory/40 font-sans">
                        Signed in as {user.email ?? user.uid}
                    </div>
                    <button
                        onClick={handleFirebaseLogout}
                        disabled={authBusy}
                        className="px-4 py-2 border border-ivory/20 text-ivory/60 text-xs tracking-widest uppercase hover:border-ivory/40 hover:text-ivory transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Sign Out
                    </button>
                </div>
                {/* Tabs */}
                <div className="max-w-5xl mx-auto flex gap-1 mt-6">
                    <button
                        onClick={() => setActiveTab('site')}
                        className={`flex items-center gap-2 px-5 py-3 text-xs tracking-widest uppercase font-sans transition-all ${activeTab === 'site'
                                ? 'bg-ivory/10 text-ivory border border-ivory/20 font-bold'
                                : 'text-ivory/40 border border-transparent hover:text-ivory/70'
                            }`}
                    >
                        <Settings size={14} /> Site
                    </button>
                    <button
                        onClick={() => setActiveTab('registry')}
                        className={`flex items-center gap-2 px-5 py-3 text-xs tracking-widest uppercase font-sans transition-all ${activeTab === 'registry'
                                ? 'bg-ivory/10 text-ivory border border-ivory/20 font-bold'
                                : 'text-ivory/40 border border-transparent hover:text-ivory/70'
                            }`}
                    >
                        <Gift size={14} /> Registry
                    </button>
                    <button
                        onClick={() => setActiveTab('rsvp')}
                        className={`flex items-center gap-2 px-5 py-3 text-xs tracking-widest uppercase font-sans transition-all ${activeTab === 'rsvp'
                                ? 'bg-ivory/10 text-ivory border border-ivory/20 font-bold'
                                : 'text-ivory/40 border border-transparent hover:text-ivory/70'
                            }`}
                    >
                        <Users size={14} /> Guest List
                    </button>
                    <button
                        onClick={() => setActiveTab('wishes')}
                        className={`flex items-center gap-2 px-5 py-3 text-xs tracking-widest uppercase font-sans transition-all ${activeTab === 'wishes'
                                ? 'bg-ivory/10 text-ivory border border-ivory/20 font-bold'
                                : 'text-ivory/40 border border-transparent hover:text-ivory/70'
                            }`}
                    >
                        <Heart size={14} /> Wishes
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 md:px-12 py-10">

                {activeTab === 'site' && <AdminSiteSettings />}
                {activeTab === 'rsvp' && <AdminRSVP />}
                {activeTab === 'wishes' && <AdminWishes />}
                {activeTab === 'registry' && (
                    <>
                        {/* Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            <div className="bg-ivory/5 border border-ivory/10 p-6 text-center">
                                <p className="font-display text-3xl text-ivory">{items.length}</p>
                                <p className="text-xs tracking-widest uppercase text-ivory/40 mt-1">Total Items</p>
                            </div>
                            <div className="bg-ivory/5 border border-ivory/10 p-6 text-center">
                                <p className="font-display text-3xl text-ivory">{items.filter(i => !i.bought).length}</p>
                                <p className="text-xs tracking-widest uppercase text-ivory/40 mt-1">Available</p>
                            </div>
                            <div className="bg-ivory/5 border border-ivory/10 p-6 text-center">
                                <p className="font-display text-3xl text-ivory">{items.filter(i => i.bought).length}</p>
                                <p className="text-xs tracking-widest uppercase text-ivory/40 mt-1">Purchased</p>
                            </div>
                            <div className="bg-ivory/5 border border-ivory/10 p-6 text-center">
                                <p className="font-display text-3xl text-ivory">{pageViews}</p>
                                <p className="text-xs tracking-widest uppercase text-ivory/40 mt-1">Page Views</p>
                            </div>
                        </div>

                        {/* Add Button */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-display text-xl tracking-wide">Items</h2>
                            <div className="flex items-center gap-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="bg-transparent border border-ivory/20 text-ivory text-xs tracking-widest uppercase font-sans py-3 px-3 focus:outline-none focus:border-ivory/50"
                                >
                                    <option value="default" className="bg-wine-dark text-white">Sort: Default</option>
                                    <option value="name" className="bg-wine-dark text-white">Sort: Name</option>
                                    <option value="status" className="bg-wine-dark text-white">Sort: Status</option>
                                    <option value="buyer" className="bg-wine-dark text-white">Sort: Buyer</option>
                                </select>
                                <button
                                    onClick={() => { setShowAddForm(true); setAddForm(emptyForm); }}
                                    className="flex items-center gap-2 px-5 py-3 bg-ivory text-wine font-sans text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors"
                                >
                                    <Plus size={14} /> <span className="hidden sm:inline">Add</span>
                                </button>
                            </div>
                        </div>

                        {/* Add Form */}
                        {showAddForm && (
                            <div className="bg-ivory/5 border border-ivory/10 p-8 mb-6">
                                <h3 className="font-display text-lg mb-6 tracking-wide">New Registry Item</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <InputField label="Name (English)" value={addForm.name_en} onChange={(v) => setAddForm({ ...addForm, name_en: v })} placeholder="e.g. Coffee Machine" />
                                    <InputField label="Name (Indonesian) *" value={addForm.name_id} onChange={(v) => setAddForm({ ...addForm, name_id: v })} placeholder="e.g. Mesin Kopi" />
                                    <InputField label="Name (Korean)" value={addForm.name_ko} onChange={(v) => setAddForm({ ...addForm, name_ko: v })} placeholder="e.g. 커피 머신" />
                                    <InputField label="Link" value={addForm.link} onChange={(v) => setAddForm({ ...addForm, link: v })} placeholder="https://..." />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button onClick={() => setShowAddForm(false)} className="px-5 py-3 border border-ivory/20 text-ivory/60 text-xs tracking-widest uppercase hover:border-ivory/40 hover:text-ivory transition-all flex items-center gap-2">
                                        <X size={14} /> Cancel
                                    </button>
                                    <button onClick={handleAdd} disabled={!addForm.name_id.trim() || submitting} className="px-5 py-3 bg-ivory text-wine text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2">
                                        <Save size={14} /> {submitting ? 'Saving...' : 'Save Item'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="flex justify-center py-16">
                                <div className="w-8 h-8 border-2 border-ivory/20 border-t-ivory rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="space-y-3">
                            {sortedItems.map((item, index) => (
                                <div key={item.id}>
                                    {editingId === item.id ? (
                                        /* ── Edit Mode ── */
                                        <div className="bg-ivory/5 border border-ivory/20 p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <InputField label="Name (English)" value={editForm.name_en} onChange={(v) => setEditForm({ ...editForm, name_en: v })} />
                                                <InputField label="Name (Indonesian)" value={editForm.name_id} onChange={(v) => setEditForm({ ...editForm, name_id: v })} />
                                                <InputField label="Name (Korean)" value={editForm.name_ko} onChange={(v) => setEditForm({ ...editForm, name_ko: v })} />
                                                <InputField label="Link" value={editForm.link} onChange={(v) => setEditForm({ ...editForm, link: v })} />
                                            </div>
                                            <div className="flex gap-3 justify-end">
                                                <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-ivory/20 text-ivory/60 text-xs tracking-widest uppercase hover:border-ivory/40 transition-all flex items-center gap-2">
                                                    <X size={14} /> Cancel
                                                </button>
                                                <button onClick={handleUpdate} disabled={submitting} className="px-4 py-2 bg-ivory text-wine text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors disabled:opacity-30 flex items-center gap-2">
                                                    <Save size={14} /> Save
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ── View Mode ── */
                                        <div className={`group border transition-all duration-300 ${item.bought ? 'bg-ivory/[0.02] border-ivory/5' : 'bg-ivory/5 border-ivory/10 hover:bg-ivory/10'}`}>
                                            {/* Delete Confirmation Overlay */}
                                            {deletingId === item.id && (
                                                <div className="bg-red-900/90 p-6 flex items-center justify-between">
                                                    <p className="font-sans text-sm">Delete <strong>"{item.name_id || item.name_en}"</strong>? This cannot be undone.</p>
                                                    <div className="flex gap-3">
                                                        <button onClick={() => setDeletingId(null)} className="px-4 py-2 border border-ivory/30 text-xs tracking-widest uppercase hover:bg-ivory/10 transition-colors">
                                                            Cancel
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} disabled={submitting} className="px-4 py-2 bg-ivory text-red-900 text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                    {deletingId !== item.id && (
                                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                            {/* Top info and Index */}
                                            <div className="flex items-start sm:items-center gap-4 sm:gap-6 min-w-0">
                                                {/* Order Number */}
                                                <div className={`w-10 h-10 min-w-[2.5rem] rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${item.bought ? 'bg-ivory/10 text-ivory/30' : 'bg-ivory/10 text-ivory/70'}`}>
                                                    {index + 1}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-serif text-lg mb-0.5 ${item.bought ? 'line-through text-ivory/30' : 'text-ivory'} break-words`}>
                                                        {item.name_id || item.name_en}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                        {item.name_en && <span className="text-xs text-ivory/30 font-sans">EN: {item.name_en}</span>}
                                                        {item.name_ko && <span className="text-xs text-ivory/30 font-sans">KO: {item.name_ko}</span>}
                                                    </div>
                                                    {item.link && (
                                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-ivory/30 hover:text-ivory/60 transition-colors mt-1 break-all">
                                                            <ExternalLink size={10} className="shrink-0" /> {item.link.replace(/^https?:\/\//, '').slice(0, 40)}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bought Status & Actions wrapper */}
                                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 mt-2 sm:mt-0 sm:ml-auto w-full sm:w-auto border-t sm:border-t-0 border-ivory/10 pt-4 sm:pt-0">
                                                {/* Bought Status */}
                                                {item.bought && (
                                                    <div className="text-left flex flex-col sm:items-end w-full sm:w-auto">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-500/20 text-green-400/80 text-[10px] sm:text-xs tracking-wider uppercase font-sans whitespace-nowrap w-max">
                                                            <Check size={12} /> <span className="hidden sm:inline">Purchased</span>
                                                        </span>
                                                        {item.boughtBy && (
                                                            <p className="text-[10px] sm:text-xs text-ivory/60 mt-1 font-sans font-medium">by {item.boughtBy}</p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className={`flex items-center gap-1 sm:gap-2 ${!item.bought ? 'ml-auto sm:ml-0' : ''}`}>
                                                    {item.bought && (
                                                        <button onClick={() => handleReset(item.id)} title="Reset bought status" className="p-2 sm:p-2.5 text-ivory/30 hover:text-ivory hover:bg-ivory/10 transition-all rounded">
                                                            <RotateCcw size={16} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => startEdit(item)} title="Edit" className="p-2 sm:p-2.5 text-ivory/30 hover:text-ivory hover:bg-ivory/10 transition-all rounded">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button onClick={() => setDeletingId(item.id)} title="Delete" className="p-2 sm:p-2.5 text-ivory/30 hover:text-red-400 hover:bg-red-900/30 transition-all rounded">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {!loading && items.length === 0 && (
                            <div className="text-center py-20 border border-dashed border-ivory/10">
                                <Gift size={48} className="text-ivory/20 mx-auto mb-4" />
                                <p className="font-serif text-xl text-ivory/40 mb-2">No items yet</p>
                                <p className="font-sans text-sm text-ivory/30">Click "Add Item" to start building your registry.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

// ─── Reusable Input Component ──────────────────────────
const InputField: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-xs tracking-widest uppercase text-ivory/40 mb-2 font-sans">{label}</label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-ivory/20 bg-transparent font-sans text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-ivory/50 transition-colors"
        />
    </div>
);

const LANGS: SiteLanguage[] = ['id', 'en', 'ko'];

const AdminSiteSettings: React.FC = () => {
    const { config, isLoaded, save } = useSiteConfig();
    const [draft, setDraft] = useState<SiteConfig>(() => normalizeSiteConfig(config));
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [saveError, setSaveError] = useState<string | null>(null);
    const [migrating, setMigrating] = useState(false);
    const [migrateError, setMigrateError] = useState<string | null>(null);
    const [migrateDone, setMigrateDone] = useState<string | null>(null);
    const [jsonValue, setJsonValue] = useState('');
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [newOverrideKey, setNewOverrideKey] = useState('');

    useEffect(() => {
        setDraft(normalizeSiteConfig(config));
    }, [config]);

    const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(config), [draft, config]);

    const updateDraft = (updater: (prev: SiteConfig) => SiteConfig) => {
        setDraft((prev) => updater(prev));
        setStatus('idle');
        setSaveError(null);
    };

    const setOverride = (key: string, lang: SiteLanguage, value: string) => {
        updateDraft((prev) => ({
            ...prev,
            copyOverrides: {
                ...prev.copyOverrides,
                [lang]: {
                    ...prev.copyOverrides[lang],
                    [key]: value,
                },
            },
        }));
    };

    const removeOverrideKey = (key: string) => {
        updateDraft((prev) => {
            const next: SiteConfig = {
                ...prev,
                copyOverrides: {
                    id: { ...prev.copyOverrides.id },
                    en: { ...prev.copyOverrides.en },
                    ko: { ...prev.copyOverrides.ko },
                },
            };
            LANGS.forEach((lang) => {
                delete next.copyOverrides[lang][key];
            });
            return next;
        });
    };

    const allOverrideKeys = useMemo(() => {
        const keys = new Set<string>();
        LANGS.forEach((lang) => Object.keys(draft.copyOverrides?.[lang] ?? {}).forEach((k) => keys.add(k)));
        return Array.from(keys).sort();
    }, [draft]);

    const quickKeys = useMemo(() => ([
        { key: 'hero.location', label: 'Hero Location' },
        { key: 'hero.venue', label: 'Hero Venue Name' },
        { key: 'hero.invitationMessage', label: 'Hero Invitation Message' },
        { key: 'hero.hashtag', label: 'Hashtag' },
        { key: 'venue.city', label: 'Venue City Line' },
        { key: 'venue.quote', label: 'Venue Quote' },
        { key: 'venue.description', label: 'Venue Description' },
        { key: 'venue.address', label: 'Venue Address' },
        { key: 'venue.locationDetail', label: 'Venue Location Detail' },
        { key: 'event.date', label: 'Event Date' },
        { key: 'gift.bankName', label: 'Gift Bank Name' },
        { key: 'gift.accountName', label: 'Gift Account Name' },
        { key: 'gift.accountNumber', label: 'Gift Account Number' },
    ]), []);

    const handleSave = async () => {
        setStatus('saving');
        setSaveError(null);
        try {
            await save(draft);
            setStatus('saved');
        } catch (err) {
            console.error('Failed to save site config:', err);
            const message =
                (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string')
                    ? (err as any).message
                    : 'Unknown error';
            const code =
                (err && typeof err === 'object' && 'code' in err && typeof (err as any).code === 'string')
                    ? (err as any).code
                    : null;
            setSaveError(code ? `${code}: ${message}` : message);
            setStatus('error');
        }
    };

    const handleExport = () => {
        setJsonError(null);
        setJsonValue(JSON.stringify(draft, null, 2));
    };

    const handleImport = () => {
        setJsonError(null);
        try {
            const parsed = JSON.parse(jsonValue);
            setDraft(normalizeSiteConfig(parsed));
        } catch {
            setJsonError('Invalid JSON');
        }
    };

    const addOverrideKey = () => {
        const k = newOverrideKey.trim();
        if (!k) return;
        updateDraft((prev) => {
            const next = normalizeSiteConfig(prev);
            LANGS.forEach((lang) => {
                if (next.copyOverrides[lang][k] === undefined) next.copyOverrides[lang][k] = '';
            });
            return next;
        });
        setNewOverrideKey('');
    };

    const backfillTenantId = async (collectionName: string) => {
        const pageSize = 500;
        let cursor: DocumentData | null = null;
        let updated = 0;

        while (true) {
            const q = cursor
                ? query(collection(db, collectionName), orderBy(documentId()), startAfter(cursor), limit(pageSize))
                : query(collection(db, collectionName), orderBy(documentId()), limit(pageSize));

            const snap = await getDocs(q);
            if (snap.empty) break;

            const updates = snap.docs
                .filter((d) => (d.data() as any)?.tenantId === undefined)
                .map(async (d) => {
                    await updateDoc(d.ref, { tenantId: 'vj' });
                    updated += 1;
                });

            await Promise.all(updates);
            cursor = snap.docs[snap.docs.length - 1] as any;
            if (snap.size < pageSize) break;
        }

        return updated;
    };

    const handleBackfill = async () => {
        setMigrating(true);
        setMigrateError(null);
        setMigrateDone(null);
        try {
            const [c, r, g] = await Promise.all([
                backfillTenantId('comments'),
                backfillTenantId('rsvps'),
                backfillTenantId('registryItems'),
            ]);
            setMigrateDone(`Updated: comments ${c}, rsvps ${r}, registryItems ${g}`);
        } catch (err) {
            console.error('Legacy backfill failed:', err);
            const message =
                (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string')
                    ? (err as any).message
                    : 'Unknown error';
            const code =
                (err && typeof err === 'object' && 'code' in err && typeof (err as any).code === 'string')
                    ? (err as any).code
                    : null;
            setMigrateError(code ? `${code}: ${message}` : message);
        } finally {
            setMigrating(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-ivory/20 border-t-ivory rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <section className="bg-ivory/5 border border-ivory/10 p-8">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div>
                        <h2 className="font-display text-xl tracking-wide">Branding</h2>
                        <p className="text-sm text-ivory/40 mt-1">Updates the browser title and description.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={!isDirty || status === 'saving'}
                        className="flex items-center gap-2 px-5 py-3 bg-ivory text-wine font-sans text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Save size={14} /> {status === 'saving' ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <InputField label="Project Name" value={draft.brand.projectName} onChange={(v) => updateDraft((p) => ({ ...p, brand: { ...p.brand, projectName: v } }))} />
                    <InputField label="Meta Title" value={draft.brand.metaTitle} onChange={(v) => updateDraft((p) => ({ ...p, brand: { ...p.brand, metaTitle: v } }))} />
                </div>
                <div className="mt-4">
                    <label className="block text-xs tracking-widest uppercase text-ivory/40 mb-2 font-sans">Meta Description</label>
                    <textarea
                        value={draft.brand.metaDescription}
                        onChange={(e) => updateDraft((p) => ({ ...p, brand: { ...p.brand, metaDescription: e.target.value } }))}
                        className="w-full px-4 py-3 border border-ivory/20 bg-transparent font-sans text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-ivory/50 transition-colors min-h-[96px]"
                    />
                </div>
                {status === 'saved' && <div className="mt-4 text-xs tracking-widest uppercase text-green-300">Saved</div>}
                {status === 'error' && (
                    <div className="mt-4 text-xs tracking-widest uppercase text-red-300">
                        Save failed{saveError ? ` — ${saveError}` : ''}
                    </div>
                )}
            </section>

            <section className="bg-ivory/5 border border-ivory/10 p-8">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div>
                        <h2 className="font-display text-xl tracking-wide">Legacy Data</h2>
                        <p className="text-sm text-ivory/40 mt-1">Backfills tenantId="vj" for older docs that predate multi-tenant support.</p>
                    </div>
                    <button
                        onClick={handleBackfill}
                        disabled={migrating}
                        className="flex items-center gap-2 px-5 py-3 border border-ivory/20 text-ivory/70 text-xs tracking-widest uppercase hover:border-ivory/40 hover:text-ivory transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <RotateCcw size={14} /> {migrating ? 'Running...' : 'Backfill tenantId'}
                    </button>
                </div>
                {migrateDone && <div className="mt-4 text-xs tracking-widest uppercase text-green-300">{migrateDone}</div>}
                {migrateError && <div className="mt-4 text-xs tracking-widest uppercase text-red-300">{migrateError}</div>}
            </section>

            <section className="bg-ivory/5 border border-ivory/10 p-8">
                <h2 className="font-display text-xl tracking-wide">Couple</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div>
                        <h3 className="font-display text-lg tracking-wide mb-4">Bride</h3>
                        <div className="space-y-4">
                            <InputField label="Display Name" value={draft.couple.bride.displayName} onChange={(v) => updateDraft((p) => ({ ...p, couple: { ...p.couple, bride: { ...p.couple.bride, displayName: v } } }))} />
                            <InputField label="Full Name (Default)" value={draft.couple.bride.fullName.default} onChange={(v) => updateDraft((p) => ({ ...p, couple: { ...p.couple, bride: { ...p.couple.bride, fullName: { ...p.couple.bride.fullName, default: v } } } }))} />
                            <InputField label="Full Name (Alt)" value={draft.couple.bride.fullName.alt ?? ''} onChange={(v) => updateDraft((p) => ({ ...p, couple: { ...p.couple, bride: { ...p.couple.bride, fullName: { ...p.couple.bride.fullName, alt: v } } } }))} />
                        </div>
                    </div>

                    <div>
                        <h3 className="font-display text-lg tracking-wide mb-4">Groom</h3>
                        <div className="space-y-4">
                            <InputField label="Display Name" value={draft.couple.groom.displayName} onChange={(v) => updateDraft((p) => ({ ...p, couple: { ...p.couple, groom: { ...p.couple.groom, displayName: v } } }))} />
                            <InputField label="Full Name (Default)" value={draft.couple.groom.fullName.default} onChange={(v) => updateDraft((p) => ({ ...p, couple: { ...p.couple, groom: { ...p.couple.groom, fullName: { ...p.couple.groom.fullName, default: v } } } }))} />
                            <InputField label="Full Name (Alt)" value={draft.couple.groom.fullName.alt ?? ''} onChange={(v) => updateDraft((p) => ({ ...p, couple: { ...p.couple, groom: { ...p.couple.groom, fullName: { ...p.couple.groom.fullName, alt: v } } } }))} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-ivory/5 border border-ivory/10 p-8">
                <h2 className="font-display text-xl tracking-wide">Wedding Date</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <InputField label="Date ISO (YYYY-MM-DD)" value={draft.wedding.dateISO} onChange={(v) => updateDraft((p) => ({ ...p, wedding: { ...p.wedding, dateISO: v } }))} />
                    <InputField label="Short Label (ID)" value={draft.wedding.dateLabelShort.id} onChange={(v) => updateDraft((p) => ({ ...p, wedding: { ...p.wedding, dateLabelShort: { ...p.wedding.dateLabelShort, id: v } } }))} />
                    <InputField label="Short Label (EN)" value={draft.wedding.dateLabelShort.en} onChange={(v) => updateDraft((p) => ({ ...p, wedding: { ...p.wedding, dateLabelShort: { ...p.wedding.dateLabelShort, en: v } } }))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <InputField label="Short Label (KO)" value={draft.wedding.dateLabelShort.ko} onChange={(v) => updateDraft((p) => ({ ...p, wedding: { ...p.wedding, dateLabelShort: { ...p.wedding.dateLabelShort, ko: v } } }))} />
                    <InputField label="Full Label (ID)" value={draft.wedding.dateLabel.id} onChange={(v) => updateDraft((p) => ({ ...p, wedding: { ...p.wedding, dateLabel: { ...p.wedding.dateLabel, id: v } } }))} />
                    <InputField label="Full Label (EN)" value={draft.wedding.dateLabel.en} onChange={(v) => updateDraft((p) => ({ ...p, wedding: { ...p.wedding, dateLabel: { ...p.wedding.dateLabel, en: v } } }))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <InputField label="Full Label (KO)" value={draft.wedding.dateLabel.ko} onChange={(v) => updateDraft((p) => ({ ...p, wedding: { ...p.wedding, dateLabel: { ...p.wedding.dateLabel, ko: v } } }))} />
                    <div />
                    <div />
                </div>
            </section>

            <section className="bg-ivory/5 border border-ivory/10 p-8">
                <h2 className="font-display text-xl tracking-wide">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <InputField label="Google Maps URL" value={draft.links.googleMapsUrl} onChange={(v) => updateDraft((p) => ({ ...p, links: { ...p.links, googleMapsUrl: v } }))} />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Map Lat"
                            value={String(draft.links.map.lat)}
                            onChange={(v) => updateDraft((p) => {
                                const n = Number(v);
                                return { ...p, links: { ...p.links, map: { ...p.links.map, lat: Number.isFinite(n) ? n : p.links.map.lat } } };
                            })}
                        />
                        <InputField
                            label="Map Lng"
                            value={String(draft.links.map.lng)}
                            onChange={(v) => updateDraft((p) => {
                                const n = Number(v);
                                return { ...p, links: { ...p.links, map: { ...p.links.map, lng: Number.isFinite(n) ? n : p.links.map.lng } } };
                            })}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-ivory/5 border border-ivory/10 p-8">
                <h2 className="font-display text-xl tracking-wide">Copy (Quick Fields)</h2>
                <p className="text-sm text-ivory/40 mt-1">Overrides the built-in translations. Leave blank to override with an empty string.</p>

                <div className="mt-6 space-y-8">
                    {quickKeys.map(({ key, label }) => (
                        <div key={key} className="border border-ivory/10 p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-xs tracking-widest uppercase text-ivory/60">{label}</div>
                                <button
                                    onClick={() => removeOverrideKey(key)}
                                    className="px-4 py-2 border border-ivory/20 text-ivory/60 text-xs tracking-widest uppercase hover:border-ivory/40 hover:text-ivory transition-all"
                                >
                                    Remove Override
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                {LANGS.map((lang) => (
                                    <div key={lang}>
                                        <label className="block text-xs tracking-widest uppercase text-ivory/40 mb-2 font-sans">{lang.toUpperCase()}</label>
                                        <textarea
                                            value={draft.copyOverrides[lang][key] ?? ''}
                                            onChange={(e) => setOverride(key, lang, e.target.value)}
                                            className="w-full px-4 py-3 border border-ivory/20 bg-transparent font-sans text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-ivory/50 transition-colors min-h-[96px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-ivory/5 border border-ivory/10 p-8">
                <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div>
                        <h2 className="font-display text-xl tracking-wide">Copy (Advanced Overrides)</h2>
                        <p className="text-sm text-ivory/40 mt-1">Add any translation key path you want to override.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newOverrideKey}
                            onChange={(e) => setNewOverrideKey(e.target.value)}
                            placeholder="e.g. rsvp.successDesc"
                            className="px-4 py-3 border border-ivory/20 bg-transparent font-sans text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-ivory/50 transition-colors w-64"
                        />
                        <button
                            onClick={addOverrideKey}
                            className="flex items-center gap-2 px-5 py-3 bg-ivory text-wine font-sans text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors"
                        >
                            <Plus size={14} /> Add
                        </button>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    {allOverrideKeys.map((k) => (
                        <div key={k} className="border border-ivory/10 p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="text-xs tracking-widest uppercase text-ivory/60">{k}</div>
                                <button
                                    onClick={() => removeOverrideKey(k)}
                                    className="px-4 py-2 border border-ivory/20 text-ivory/60 text-xs tracking-widest uppercase hover:border-ivory/40 hover:text-ivory transition-all"
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                {LANGS.map((lang) => (
                                    <div key={lang}>
                                        <label className="block text-xs tracking-widest uppercase text-ivory/40 mb-2 font-sans">{lang.toUpperCase()}</label>
                                        <textarea
                                            value={draft.copyOverrides[lang][k] ?? ''}
                                            onChange={(e) => setOverride(k, lang, e.target.value)}
                                            className="w-full px-4 py-3 border border-ivory/20 bg-transparent font-sans text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-ivory/50 transition-colors min-h-[96px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {allOverrideKeys.length === 0 && (
                        <div className="text-center py-12 border border-dashed border-ivory/10 text-ivory/40">
                            No overrides yet.
                        </div>
                    )}
                </div>
            </section>

            <section className="bg-ivory/5 border border-ivory/10 p-8">
                <h2 className="font-display text-xl tracking-wide">Import / Export</h2>
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        onClick={handleExport}
                        className="px-5 py-3 border border-ivory/20 text-ivory/70 text-xs tracking-widest uppercase hover:border-ivory/40 hover:text-ivory transition-all"
                    >
                        Export JSON
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-5 py-3 bg-ivory text-wine font-sans text-xs tracking-widest uppercase font-bold hover:bg-ivory/90 transition-colors"
                    >
                        Import JSON
                    </button>
                </div>
                {jsonError && <div className="mt-4 text-xs tracking-widest uppercase text-red-300">{jsonError}</div>}
                <div className="mt-4">
                    <textarea
                        value={jsonValue}
                        onChange={(e) => setJsonValue(e.target.value)}
                        placeholder="{ ... }"
                        className="w-full px-4 py-3 border border-ivory/20 bg-transparent font-mono text-xs text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-ivory/50 transition-colors min-h-[320px]"
                    />
                </div>
            </section>
        </div>
    );
};
