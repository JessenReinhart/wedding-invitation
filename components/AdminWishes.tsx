import React, { useState, useEffect } from 'react';
import { Trash2, MessageCircle, Clock, User, Heart } from 'lucide-react';
import { subscribeToComments, deleteComment, type CommentEntry } from '../services/comments';

export const AdminWishes: React.FC = () => {
    const [wishes, setWishes] = useState<CommentEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToComments((data) => {
            setWishes(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteComment(id);
            setDeletingId(null);
        } catch (err) {
            console.error('Failed to delete wish:', err);
        }
    };

    const formatDate = (ts: CommentEntry['createdAt']) => {
        if (!ts) return '—';
        const d = new Date(ts.seconds * 1000);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
            ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-10">
                <div className="bg-ivory/5 border border-ivory/10 p-4 sm:p-6 text-center">
                    <p className="font-display text-2xl sm:text-3xl text-ivory">{wishes.length}</p>
                    <p className="text-[10px] sm:text-xs tracking-widest uppercase text-ivory/40 mt-1 flex items-center justify-center gap-1">
                        <MessageCircle size={12} /> Total Wishes
                    </p>
                </div>
                <div className="bg-ivory/5 border border-ivory/10 p-4 sm:p-6 text-center">
                    <p className="font-display text-2xl sm:text-3xl text-wine-light animate-pulse">
                        <Heart size={24} className="inline mr-2" fill="currentColor" />
                    </p>
                    <p className="text-[10px] sm:text-xs tracking-widest uppercase text-ivory/40 mt-1">Spread the Love</p>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-2 border-ivory/20 border-t-ivory rounded-full animate-spin"></div>
                </div>
            )}

            {/* Wishes List */}
            {!loading && wishes.length > 0 && (
                <div className="space-y-4">
                    {wishes.map((wish) => (
                        <div 
                            key={wish.id}
                            className="bg-ivory/5 border border-ivory/10 p-5 sm:p-8 hover:bg-ivory/10 transition-all group relative"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                                <div className="flex-1">
                                    <p className="font-serif text-lg sm:text-xl text-ivory leading-relaxed mb-4 break-words">
                                        "{wish.message}"
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] sm:text-xs tracking-widest uppercase text-ivory/40">
                                        <span className="flex items-center gap-1.5 text-ivory/60">
                                            <User size={12} /> {wish.name}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={12} /> {formatDate(wish.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => setDeletingId(wish.id)}
                                    className="p-3 text-ivory/20 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all self-end sm:self-start sm:opacity-0 sm:group-hover:opacity-100"
                                    title="Delete Wish"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Delete Confirmation Overlay */}
                            {deletingId === wish.id && (
                                <div className="absolute inset-0 bg-red-950/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center border border-red-500/50">
                                    <p className="font-sans text-sm mb-4">Delete wish from <strong>{wish.name}</strong>?</p>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setDeletingId(null)}
                                            className="px-4 py-2 border border-ivory/20 text-xs tracking-widest uppercase hover:bg-ivory/10 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(wish.id)}
                                            className="px-4 py-2 bg-red-600 text-ivory text-xs tracking-widest uppercase font-bold hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && wishes.length === 0 && (
                <div className="text-center py-20 border border-dashed border-ivory/10">
                    <Heart size={48} className="text-ivory/20 mx-auto mb-4" />
                    <p className="font-serif text-xl text-ivory/40 mb-2">No wishes yet</p>
                    <p className="font-sans text-sm text-ivory/30">Wishes from your guests will appear here.</p>
                </div>
            )}
        </div>
    );
};
