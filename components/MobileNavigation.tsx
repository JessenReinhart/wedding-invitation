import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, CheckSquare, Image as ImageIcon, Music, Pause, Play, MessageSquare, Gift } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useMusic } from '../contexts/MusicContext';

export const MobileNavigation: React.FC = () => {
    const { t } = useLanguage();
    const { isPlaying, togglePlay, hasInteracted } = useMusic();

    const navItems = [
        { icon: <Calendar size={18} />, label: t('nav.event'), href: '#event' },
        { icon: <MapPin size={18} />, label: t('nav.location'), href: '#venue' },
        { icon: <CheckSquare size={18} />, label: t('nav.rsvp'), href: '#rsvp' },
        { icon: <ImageIcon size={18} />, label: t('nav.gallery'), href: '#gallery' },
        { icon: <MessageSquare size={18} />, label: t('nav.wishes'), href: '#wishes' },
        { icon: <Gift size={18} />, label: t('nav.gift'), href: '#gift' },
    ];

    const scrollToSection = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.div
            initial={{ y: 100, x: '-50%' }}
            animate={{ y: 0, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[60] md:hidden w-[98%] max-w-md"
        >
            <div className="bg-ivory/95 backdrop-blur-2xl border border-wine/10 rounded-2xl py-3 px-1 shadow-[0_8px_40px_rgba(0,0,0,0.15)] flex justify-around items-center relative overflow-hidden">
                
                {/* Autoplay Prompt Tooltip */}
                <AnimatePresence>
                    {!isPlaying && !hasInteracted && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-12 right-2 bg-wine text-ivory text-[9px] px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-tight font-medium z-10"
                        >
                            Tap music to play
                            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-wine rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {navItems.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => scrollToSection(e, item.href)}
                        className="flex flex-col items-center gap-1 text-wine/50 hover:text-wine transition-all duration-300 active:scale-90 flex-1 min-w-0"
                    >
                        <div className="p-0.5">
                            {item.icon}
                        </div>
                        <span className="text-[7px] font-sans uppercase tracking-tighter font-semibold opacity-80 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                            {item.label}
                        </span>
                    </a>
                ))}

                {/* Music Toggle Integrated - Smaller for 7 items */}
                <button
                    onClick={togglePlay}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 active:scale-90 flex-1 min-w-0 ${isPlaying ? 'text-wine' : 'text-wine/40'}`}
                >
                    <div className="p-0.5 relative flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            {isPlaying ? (
                                <motion.div
                                    key="pause"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Pause size={18} fill="currentColor" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="play"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                >
                                    <Play size={18} fill="currentColor" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        {isPlaying && (
                            <div className="flex items-end justify-center gap-[1px] h-1.5 mt-0.5">
                                {[0, 1].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ 
                                            height: [1, 4, 1],
                                        }}
                                        transition={{ 
                                            duration: 0.5 + Math.random() * 0.5, 
                                            repeat: Infinity,
                                            delay: i * 0.1
                                        }}
                                        className="w-[1.2px] bg-wine rounded-full"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <span className="text-[7px] font-sans uppercase tracking-tighter font-semibold opacity-80">Music</span>
                </button>
            </div>
        </motion.div>
    );
};
