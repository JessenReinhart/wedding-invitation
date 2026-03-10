import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ExternalLink, Check, X, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { subscribeToRegistryItems, markItemAsBought, type RegistryItem } from '../services/registry';

export const Registry: React.FC = () => {
    const { language, t } = useLanguage();
    const [items, setItems] = useState<RegistryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [buyerName, setBuyerName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToRegistryItems((data) => {
            setItems(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getItemName = (item: RegistryItem): string => {
        const fallback = item.name_id || item.name_en || item.name_ko || '';
        if (language === 'en') return item.name_en || fallback;
        if (language === 'ko') return item.name_ko || fallback;
        return item.name_id || fallback;
    };

    const handleMarkAsBought = async () => {
        if (!confirmingId || !buyerName.trim()) return;
        setSubmitting(true);
        try {
            await markItemAsBought(confirmingId, buyerName.trim());
            setConfirmingId(null);
            setBuyerName('');
        } catch (err) {
            console.error('Failed to mark item as bought:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="registry" className="relative py-32 px-4 bg-ivory overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="font-display text-5xl md:text-7xl text-wine mb-8 tracking-wide"
                >
                    {t('registry.title')}
                </motion.h2>

                <div className="h-24 w-px bg-wine/20 mx-auto mb-8"></div>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-serif italic text-xl md:text-2xl text-wine/80 leading-relaxed max-w-3xl mx-auto mb-16"
                >
                    {t('registry.description')}
                </motion.p>

                {/* Shipping Address */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mb-16 max-w-xl mx-auto bg-wine/5 border border-wine/10 p-10 relative overflow-hidden group transition-colors duration-500 hover:bg-wine/10"
                >
                    <div className="flex flex-col items-center relative z-10">
                        <div className="w-14 h-14 bg-wine text-ivory rounded-full flex items-center justify-center mb-5 shadow-lg">
                            <MapPin size={24} />
                        </div>
                        <h3 className="font-display text-xl md:text-2xl text-wine mb-3 tracking-wide">
                            {t('registry.sendToTitle')}
                        </h3>
                        <p className="font-sans text-wine/70 text-sm md:text-base leading-relaxed text-center">
                            {t('registry.sendToAddress')}
                        </p>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-wine/20 border-t-wine rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Registry Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className={`group relative overflow-hidden text-left transition-all duration-500 ${item.bought
                                ? 'bg-wine/[0.03] border border-wine/5 opacity-70'
                                : 'bg-wine/5 border border-wine/10 hover:bg-wine/10'
                                }`}
                        >
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Gift size={80} className="text-wine" />
                            </div>

                            {/* Card Content */}
                            <div className="p-8 flex items-center gap-6">
                                {/* Icon */}
                                <div className={`w-14 h-14 min-w-[3.5rem] rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${item.bought
                                    ? 'bg-wine/30 text-ivory'
                                    : 'bg-wine text-ivory group-hover:scale-105'
                                    }`}>
                                    {item.bought ? <Check size={22} /> : <Gift size={22} />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 relative z-10">
                                    <h3 className={`font-serif text-lg md:text-xl mb-1 transition-all duration-300 ease-out ${item.bought
                                        ? 'text-wine/40 line-through'
                                        : 'text-wine group-hover:translate-x-1'
                                        }`}>
                                        {getItemName(item)}
                                    </h3>

                                    {item.bought ? (
                                        <span className="inline-flex items-center gap-1 font-sans text-xs tracking-widest uppercase text-wine/40">
                                            {t('registry.purchased')}
                                            {item.boughtBy && ` — ${item.boughtBy}`}
                                        </span>
                                    ) : (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 font-sans text-xs tracking-widest uppercase text-wine/50 group-hover:text-wine/80 transition-colors duration-300"
                                        >
                                            {t('registry.viewItem')} <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Mark as Bought Button */}
                            {!item.bought && (
                                <div className="px-8 pb-6">
                                    <button
                                        onClick={() => { setConfirmingId(item.id); setBuyerName(''); }}
                                        className="w-full py-3 border border-wine/20 text-wine/60 font-sans text-xs tracking-widest uppercase hover:bg-wine hover:text-ivory hover:border-wine transition-all duration-300"
                                    >
                                        {t('registry.markAsBought')}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmingId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-wine-dark/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                        onClick={() => setConfirmingId(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-ivory border border-wine/10 p-8 md:p-12 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="font-display text-2xl md:text-3xl text-wine mb-2 tracking-wide">
                                {t('registry.confirmTitle')}
                            </h3>
                            <p className="font-serif italic text-wine/60 mb-8">
                                {t('registry.confirmDesc')}
                            </p>

                            <input
                                type="text"
                                value={buyerName}
                                onChange={(e) => setBuyerName(e.target.value)}
                                placeholder={t('registry.buyerName') as string}
                                className="w-full px-4 py-3 border border-wine/20 bg-transparent font-sans text-wine placeholder:text-wine/30 focus:outline-none focus:border-wine transition-colors mb-6"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmingId(null)}
                                    className="flex-1 py-3 border border-wine/20 text-wine/60 font-sans text-xs tracking-widest uppercase hover:bg-wine/5 transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    <X size={14} />
                                    {t('registry.cancel')}
                                </button>
                                <button
                                    onClick={handleMarkAsBought}
                                    disabled={!buyerName.trim() || submitting}
                                    className="flex-1 py-3 bg-wine text-ivory font-sans text-xs tracking-widest uppercase hover:bg-wine-dark transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Check size={14} />
                                    {submitting ? '...' : t('registry.confirm')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
