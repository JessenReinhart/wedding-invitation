import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Registry } from './Registry';

export const RegistryPage: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();

    return (
        <main className="w-full min-h-screen bg-ivory text-wine selection:bg-wine selection:text-ivory">
            {/* Minimal Header */}
            <header className="w-full flex justify-between items-center px-6 py-6 md:px-12 border-b border-wine/10">
                <a
                    href="/"
                    className="flex items-center gap-3 text-wine/60 hover:text-wine transition-colors duration-300 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="text-xs font-sans tracking-[0.15em] uppercase">
                        {t('registry.backToInvitation')}
                    </span>
                </a>

                <div className="text-2xl font-display font-bold text-wine tracking-tighter">
                    V&J
                </div>

                <div className="flex gap-2 text-xs font-sans tracking-wider items-center">
                    <button
                        onClick={() => setLanguage('id')}
                        className={`hover:opacity-100 transition-opacity ${language === 'id' ? 'font-bold opacity-100' : 'opacity-50'}`}
                    >
                        ID
                    </button>
                    <span className="opacity-30">|</span>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`hover:opacity-100 transition-opacity ${language === 'en' ? 'font-bold opacity-100' : 'opacity-50'}`}
                    >
                        EN
                    </button>
                    <span className="opacity-30">|</span>
                    <button
                        onClick={() => setLanguage('ko')}
                        className={`hover:opacity-100 transition-opacity ${language === 'ko' ? 'font-bold opacity-100' : 'opacity-50'}`}
                    >
                        KO
                    </button>
                </div>
            </header>

            {/* Registry Content */}
            <Registry />

            {/* Minimal Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="py-12 text-center border-t border-wine/10"
            >
                <p className="font-display text-lg text-wine/40 tracking-widest">
                    V & J — 02.05.26
                </p>
            </motion.footer>

            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[9999] mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
                }}>
            </div>
        </main>
    );
};
