import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, CheckSquare, Image as ImageIcon, Pause, Play, MessageSquare, Gift, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useMusic } from '../contexts/MusicContext';

export const MobileNavigation: React.FC = () => {
    const { t } = useLanguage();
    const { isPlaying, togglePlay, hasInteracted } = useMusic();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { icon: <MapPin size={18} />, label: t('nav.location'), href: '#venue' },
        { icon: <Calendar size={18} />, label: t('nav.event'), href: '#event' },
        { icon: <CheckSquare size={18} />, label: t('nav.rsvp'), href: '#rsvp' },
        { icon: <MessageSquare size={18} />, label: t('nav.wishes'), href: '#wishes' },
        { icon: <Gift size={18} />, label: t('nav.gift'), href: '#gift' },
        { icon: <ImageIcon size={18} />, label: t('nav.gallery'), href: '#gallery' },
    ];

    const scrollToSection = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    return (
        <div className="fixed bottom-6 right-6 z-[110] md:hidden">
            <AnimatePresence>
                {isOpen && (
                    <motion.button
                        type="button"
                        aria-label="Close menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-[1px]"
                    />
                )}
            </AnimatePresence>

            <div className="relative">
                <AnimatePresence>
                    {!isOpen && !isPlaying && !hasInteracted && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-12 right-0 bg-wine text-ivory text-[9px] px-4 py-1.5 rounded-lg shadow-lg uppercase tracking-tight font-medium z-10 whitespace-nowrap"
                        >
                            {t('fab.tapToOpenMenu')}
                            <div className="absolute -bottom-1 right-5 w-2 h-2 bg-wine rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            className="absolute bottom-full right-0 mb-4 flex flex-col gap-3 items-end"
                        >
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.href}
                                    href={item.href}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={(e) => {
                                        scrollToSection(e, item.href);
                                        setIsOpen(false);
                                    }}
                                    className="group flex items-center gap-3"
                                >
                                    <span className="bg-ivory/95 backdrop-blur-2xl border border-wine/10 text-wine text-[11px] tracking-wide font-sans font-semibold px-4 py-2 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] whitespace-nowrap">
                                        {item.label}
                                    </span>
                                    <span className="w-12 h-12 flex items-center justify-center bg-ivory/95 backdrop-blur-2xl border border-wine/10 text-wine rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 group-active:scale-95">
                                        {item.icon}
                                    </span>
                                </motion.a>
                            ))}

                            <motion.button
                                type="button"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ delay: navItems.length * 0.03 }}
                                onClick={() => {
                                    togglePlay();
                                    setIsOpen(false);
                                }}
                                className="group flex items-center gap-3"
                                aria-label={isPlaying ? t('music.pause') : t('music.play')}
                            >
                                <span className="bg-ivory/95 backdrop-blur-2xl border border-wine/10 text-wine text-[11px] tracking-wide font-sans font-semibold px-4 py-2 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] whitespace-nowrap">
                                    {t('music.label')}
                                </span>
                                <span className={`w-12 h-12 flex items-center justify-center backdrop-blur-2xl border border-wine/10 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-transform duration-300 group-active:scale-95 ${isPlaying ? 'bg-wine text-ivory' : 'bg-ivory/95 text-wine'}`}>
                                    <AnimatePresence mode="wait">
                                        {isPlaying ? (
                                            <motion.span
                                                key="pause"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                            >
                                                <Pause size={18} fill="currentColor" />
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="play"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="ml-0.5"
                                            >
                                                <Play size={18} fill="currentColor" />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </span>
                            </motion.button>

                            <AnimatePresence>
                                {!isPlaying && !hasInteracted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="bg-wine text-ivory text-[9px] px-4 py-1.5 rounded-lg shadow-lg uppercase tracking-tight font-medium whitespace-nowrap"
                                    >
                                        {t('music.tapToPlay')}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    className="w-14 h-14 rounded-full bg-wine text-ivory shadow-[0_10px_40px_rgba(0,0,0,0.25)] flex items-center justify-center"
                >
                    <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                    >
                        <Plus size={22} />
                    </motion.span>
                </motion.button>
            </div>
        </div>
    );
};
