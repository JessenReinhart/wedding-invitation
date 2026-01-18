import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export const Gift: React.FC = () => {
    const { language } = useLanguage();
    const t = translations[language].gift;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(t.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="gift" className="relative py-32 px-4 bg-ivory overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="font-display text-5xl md:text-7xl text-wine mb-8 tracking-wide"
                >
                    {t.title}
                </motion.h2>

                <div className="h-24 w-px bg-wine/20 mx-auto mb-8"></div>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-serif italic text-xl md:text-2xl text-wine/80 leading-relaxed max-w-3xl mx-auto mb-16"
                >
                    {t.description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="max-w-xl mx-auto bg-wine/5 border border-wine/10 p-12 relative overflow-hidden group transition-colors duration-500 hover:bg-wine/10"
                >
                    {/* Decorative background element */}
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <CreditCard size={120} className="text-wine" />
                    </div>

                    <div className="flex flex-col items-center relative z-10">
                        <div className="w-20 h-20 bg-wine text-ivory rounded-full flex items-center justify-center mb-6 shadow-lg">
                            <CreditCard size={32} />
                        </div>

                        <h3 className="font-display text-3xl text-wine mb-2">{t.bankName}</h3>

                        <div className="text-center mb-8">
                            <p className="font-mono text-lg tracking-widest text-wine/70 uppercase mb-2">{t.accountNumber}</p>
                            <p className="font-serif text-xl text-wine">{t.accountName}</p>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="group relative px-8 py-4 bg-wine text-ivory font-sans uppercase tracking-widest text-sm font-bold overflow-hidden inline-block shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2 group-hover:gap-4 transition-all group-hover:text-wine">
                                {copied ? (
                                    <>
                                        {t.copied} <Check size={16} />
                                    </>
                                ) : (
                                    <>
                                        {t.copyButton} <Copy size={16} />
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-ivory transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
