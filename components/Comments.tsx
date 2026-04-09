import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Heart, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { submitComment, subscribeToComments, type CommentEntry } from '../services/comments';

export const Comments: React.FC = () => {
    const { t, guestName } = useLanguage();
    const [comments, setComments] = useState<CommentEntry[]>([]);
    const [formData, setFormData] = useState({ name: guestName || '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = subscribeToComments((data) => {
            setComments(data);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (guestName) {
            setFormData(prev => ({ ...prev, name: guestName }));
        }
    }, [guestName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.message.trim()) return;
        
        setSubmitting(true);
        try {
            await submitComment(formData);
            setFormData({ ...formData, message: '' });
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
        } catch (err) {
            console.error('Failed to submit wish:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (ts: CommentEntry['createdAt']) => {
        if (!ts) return '';
        const date = new Date(ts.seconds * 1000);
        return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short' });
    };

    return (
        <section id="wishes" className="w-full bg-ivory py-32 px-4 md:px-12 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-wine/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-wine/5 rounded-full blur-3xl -ml-48 -mb-48"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Centered Header */}
                <div className="mb-20 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="font-display text-5xl md:text-7xl text-wine mb-6 leading-tight"
                    >
                        {t('wishes.title')}
                    </motion.h2>
                    <p className="font-serif italic text-wine/60 text-xl md:text-2xl leading-relaxed">
                        {t('wishes.subtitle')}
                    </p>
                </div>

                {/* Form */}
                <motion.form 
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8 mb-20"
                >
                    <div className="space-y-8">
                        <div className="relative group">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder={t('wishes.name')}
                                className="w-full bg-transparent border-b border-wine/20 py-4 text-xl text-wine focus:outline-none focus:border-wine transition-colors font-serif placeholder:text-wine/30"
                                required
                            />
                            <User size={16} className="absolute right-0 top-5 text-wine/20 group-focus-within:text-wine transition-colors" />
                        </div>

                        <div className="relative group">
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder={t('wishes.message')}
                                className="w-full bg-transparent border-b border-wine/20 py-4 text-xl text-wine focus:outline-none focus:border-wine transition-colors font-serif placeholder:text-wine/30 min-h-[120px] resize-none"
                                required
                            ></textarea>
                            <MessageSquare size={16} className="absolute right-0 top-5 text-wine/20 group-focus-within:text-wine transition-colors" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="group relative px-8 py-4 bg-wine text-ivory font-sans uppercase tracking-widest text-sm font-bold overflow-hidden transition-all hover:shadow-2xl hover:shadow-wine/20"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {submitting ? 'Sending...' : (submitted ? (
                                    <><Heart size={16} fill="currentColor" className="animate-pulse" /> {t('wishes.successTitle')}</>
                                ) : (
                                    <>{t('wishes.submit')} <Send size={16} /> </>
                                ))}
                            </span>
                            <div className="absolute inset-0 bg-wine-light transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
                        </button>
                    </div>
                </motion.form>

                {/* Messages List */}
                <div 
                    ref={scrollRef}
                    className="max-h-[600px] overflow-y-auto pr-2 scroll-smooth custom-scrollbar space-y-6"
                >
                    <AnimatePresence mode="popLayout">
                        {comments.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center text-wine/30 space-y-4 py-20 border-2 border-dashed border-wine/10 rounded-3xl"
                            >
                                <Heart size={48} />
                                <p className="font-serif italic text-xl">{t('wishes.empty')}</p>
                            </motion.div>
                        ) : (
                            comments.map((comment, index) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                    className="bg-white/60 backdrop-blur-sm p-8 border border-wine/5 shadow-sm relative group hover:shadow-md transition-all overflow-hidden"
                                >
                                    {/* Decorative heart */}
                                    <Heart className={`absolute top-4 right-4 text-wine/5 transition-colors group-hover:text-wine/10 ${index % 3 === 0 ? 'fill-wine/5' : ''}`} size={48} />
                                    
                                    <div className="relative z-10">
                                        <p className="font-serif text-lg md:text-xl text-wine leading-relaxed mb-6 italic">
                                            "{comment.message}"
                                        </p>
                                        <div className="flex items-center justify-between border-t border-wine/10 pt-4">
                                            <h4 className="font-display text-sm text-wine tracking-wider uppercase">
                                                {comment.name}
                                            </h4>
                                            <span className="font-sans text-[10px] tracking-widest text-wine/40 uppercase">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(89, 28, 39, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(89, 28, 39, 0.2);
                }
            `}} />
        </section>
    );
};
