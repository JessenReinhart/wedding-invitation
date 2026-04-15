import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, RotateCcw, Save, X, ExternalLink, Gift, Check, Users } from 'lucide-react';
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

const emptyForm: Omit<NewRegistryItem, 'order'> = {
    name_id: '',
    name_en: '',
    name_ko: '',
    link: '',
    bought: false,
    boughtBy: '',
};

type Tab = 'registry' | 'rsvp' | 'wishes';
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
    }, []);

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

    return (
        <div className="min-h-screen bg-wine-dark text-ivory font-sans">
            {/* Header */}
            <header className="border-b border-ivory/10 px-6 py-6 md:px-12">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl tracking-wide">Admin Dashboard</h1>
                        <p className="font-sans text-ivory/40 text-sm mt-1">
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
                {/* Tabs */}
                <div className="max-w-5xl mx-auto flex gap-1 mt-6">
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
