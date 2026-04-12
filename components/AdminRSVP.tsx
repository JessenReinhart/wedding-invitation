import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Users, CheckCircle, XCircle, Download, Trash2, RotateCcw } from 'lucide-react';
import { subscribeToRSVPs, deleteRSVP, type RSVPEntry } from '../services/rsvp';

type SortField = 'firstName' | 'lastName' | 'email' | 'attendance' | 'createdAt';
type SortDir = 'asc' | 'desc';

export const AdminRSVP: React.FC = () => {
    const [entries, setEntries] = useState<RSVPEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('createdAt');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToRSVPs((data) => {
            setEntries(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ─── Search + Sort ─────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        let result = entries;

        if (q) {
            result = entries.filter(
                (e) =>
                    e.firstName?.toLowerCase().includes(q) ||
                    e.lastName?.toLowerCase().includes(q) ||
                    e.email?.toLowerCase().includes(q) ||
                    e.dietary?.toLowerCase().includes(q)
            );
        }

        return [...result].sort((a, b) => {
            let aVal: string | number = '';
            let bVal: string | number = '';

            if (sortField === 'createdAt') {
                aVal = a.createdAt?.seconds ?? 0;
                bVal = b.createdAt?.seconds ?? 0;
            } else {
                aVal = (a[sortField] ?? '').toString().toLowerCase();
                bVal = (b[sortField] ?? '').toString().toLowerCase();
            }

            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [entries, search, sortField, sortDir]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const handleDelete = async (id: string) => {
        setSubmitting(true);
        try {
            await deleteRSVP(id);
            setDeletingId(null);
        } catch (err) {
            console.error('Failed to delete RSVP:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const attendingCount = entries.filter((e) => e.attendance === 'yes').length;
    const notAttendingCount = entries.filter((e) => e.attendance === 'no').length;

    const formatDate = (ts: RSVPEntry['createdAt']) => {
        if (!ts?.seconds) return '—';
        const d = new Date(ts.seconds * 1000);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
            ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    // ─── CSV Export ────────────────────────────────────────
    const handleExport = () => {
        const headers = ['First Name', 'Last Name', 'Email', 'Attendance', 'Dietary', 'Submitted At'];
        const rows = filtered.map((e) => [
            e.firstName,
            e.lastName,
            e.email,
            e.attendance,
            e.dietary || '',
            formatDate(e.createdAt),
        ]);
        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rsvp-export-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
        if (sortField !== field) return <ChevronUp size={12} className="text-ivory/20" />;
        return sortDir === 'asc'
            ? <ChevronUp size={12} className="text-ivory" />
            : <ChevronDown size={12} className="text-ivory" />;
    };

    const ThButton: React.FC<{ field: SortField; children: React.ReactNode; className?: string }> = ({ field, children, className = '' }) => (
        <th className={`text-left ${className}`}>
            <button
                onClick={() => handleSort(field)}
                className="flex items-center gap-1 text-xs tracking-widest uppercase text-ivory/40 hover:text-ivory transition-colors font-sans font-normal w-full"
            >
                {children} <SortIcon field={field} />
            </button>
        </th>
    );

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-ivory/5 border border-ivory/10 p-6 text-center">
                    <p className="font-display text-3xl text-ivory">{entries.length}</p>
                    <p className="text-xs tracking-widest uppercase text-ivory/40 mt-1 flex items-center justify-center gap-1">
                        <Users size={12} /> Total RSVPs
                    </p>
                </div>
                <div className="bg-ivory/5 border border-ivory/10 p-6 text-center">
                    <p className="font-display text-3xl text-green-400">{attendingCount}</p>
                    <p className="text-xs tracking-widest uppercase text-ivory/40 mt-1 flex items-center justify-center gap-1">
                        <CheckCircle size={12} /> Attending
                    </p>
                </div>
                <div className="bg-ivory/5 border border-ivory/10 p-6 text-center">
                    <p className="font-display text-3xl text-red-400">{notAttendingCount}</p>
                    <p className="text-xs tracking-widest uppercase text-ivory/40 mt-1 flex items-center justify-center gap-1">
                        <XCircle size={12} /> Not Attending
                    </p>
                </div>
            </div>

            {/* Search + Export Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/30" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search guests..."
                        className="w-full pl-11 pr-4 py-3 border border-ivory/20 bg-transparent font-sans text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-ivory/50 transition-colors"
                    />
                </div>
                <button
                    onClick={handleExport}
                    disabled={filtered.length === 0}
                    className="flex items-center gap-2 px-5 py-3 border border-ivory/20 text-ivory/60 text-xs tracking-widest uppercase hover:border-ivory/40 hover:text-ivory transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Download size={14} /> Export CSV
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-ivory/20 border-t-ivory rounded-full animate-spin"></div>
                </div>
            )}

            {/* Table */}
            {!loading && filtered.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-ivory/10">
                                <th className="text-left py-3 pr-4">
                                    <span className="text-xs tracking-widest uppercase text-ivory/40 font-sans font-normal">#</span>
                                </th>
                                <ThButton field="firstName" className="py-3 pr-4">Name</ThButton>
                                <ThButton field="email" className="py-3 pr-4">Email</ThButton>
                                <ThButton field="attendance" className="py-3 pr-4">Status</ThButton>
                                <th className="text-left py-3 pr-4">
                                    <span className="text-xs tracking-widest uppercase text-ivory/40 font-sans font-normal">Dietary</span>
                                </th>
                                <ThButton field="createdAt" className="py-3 pr-4">Submitted</ThButton>
                                <th className="text-right py-3">
                                    <span className="text-xs tracking-widest uppercase text-ivory/40 font-sans font-normal">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((entry, i) => (
                                <tr
                                    key={entry.id}
                                    className="border-b border-ivory/5 hover:bg-ivory/5 transition-colors"
                                >
                                    <td className="py-4 pr-4 font-sans text-sm text-ivory/30">{i + 1}</td>
                                    <td className="py-4 pr-4">
                                        <p className="font-serif text-ivory">{entry.firstName} {entry.lastName}</p>
                                    </td>
                                    <td className="py-4 pr-4 font-sans text-sm text-ivory/60">{entry.email}</td>
                                    <td className="py-4 pr-4">
                                        {entry.attendance === 'yes' ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-500/20 text-green-400/80 text-xs tracking-wider uppercase font-sans">
                                                <CheckCircle size={12} /> Attending
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-900/30 border border-red-500/20 text-red-400/80 text-xs tracking-wider uppercase font-sans">
                                                <XCircle size={12} /> Not Attending
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 pr-4 font-sans text-sm text-ivory/40 italic">
                                        {entry.dietary || '—'}
                                    </td>
                                    <td className="py-4 pr-4 font-sans text-xs text-ivory/30">
                                        {formatDate(entry.createdAt)}
                                    </td>
                                    <td className="py-4 text-right">
                                        {deletingId === entry.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setDeletingId(null)}
                                                    className="p-2 text-ivory/40 hover:text-ivory transition-colors"
                                                    title="Cancel"
                                                >
                                                    <RotateCcw size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(entry.id)}
                                                    disabled={submitting}
                                                    className="p-2 text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-30"
                                                    title="Confirm Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeletingId(entry.id)}
                                                className="p-2 text-ivory/20 hover:text-red-400 transition-colors"
                                                title="Delete RSVP"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
                <div className="text-center py-20 border border-dashed border-ivory/10">
                    <Users size={48} className="text-ivory/20 mx-auto mb-4" />
                    {search ? (
                        <>
                            <p className="font-serif text-xl text-ivory/40 mb-2">No matching guests</p>
                            <p className="font-sans text-sm text-ivory/30">Try a different search term.</p>
                        </>
                    ) : (
                        <>
                            <p className="font-serif text-xl text-ivory/40 mb-2">No RSVPs yet</p>
                            <p className="font-sans text-sm text-ivory/30">Guest responses will appear here.</p>
                        </>
                    )}
                </div>
            )}

            {/* Results count */}
            {!loading && entries.length > 0 && (
                <p className="text-xs text-ivory/30 font-sans mt-4">
                    Showing {filtered.length} of {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                    {search && ` matching "${search}"`}
                </p>
            )}
        </div>
    );
};
