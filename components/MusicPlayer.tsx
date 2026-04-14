import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Pause, Play } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { useLanguage } from '../contexts/LanguageContext';

export const MusicPlayer: React.FC = () => {
    const { isPlaying, hasInteracted, togglePlay } = useMusic();
    const { t } = useLanguage();

    return (
        <div className="fixed bottom-6 right-6 z-[100] hidden md:flex items-center gap-3">
            <AnimatePresence mode="wait">
                {!isPlaying && !hasInteracted && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white/80 backdrop-blur-md border border-wine/10 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 pointer-events-none"
                    >
                        <span className="text-[10px] uppercase tracking-widest text-wine/60 font-sans font-medium whitespace-nowrap">
                            {t('music.clickToPlay')}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-wine animate-pulse" />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="group relative w-12 h-12 flex items-center justify-center bg-wine text-ivory rounded-full shadow-xl overflow-hidden"
                title={isPlaying ? t('music.pause') : t('music.play')}
            >
                <motion.div
                    animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-10 flex items-center justify-center"
                >
                    <Music size={32} />
                </motion.div>

                <AnimatePresence mode="wait">
                    {isPlaying ? (
                        <motion.div
                            key="pause"
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 45 }}
                        >
                            <Pause size={20} fill="currentColor" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="play"
                            initial={{ opacity: 0, rotate: -45 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 45 }}
                            className="ml-1"
                        >
                            <Play size={20} fill="currentColor" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Music Waves Animation */}
                {isPlaying && (
                    <div className="absolute bottom-2 flex items-end justify-center gap-0.5 h-3">
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    height: [4, 12, 4],
                                }}
                                transition={{
                                    duration: 0.5 + Math.random() * 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.1
                                }}
                                className="w-0.5 bg-ivory/60 rounded-full"
                            />
                        ))}
                    </div>
                )}
            </motion.button>
        </div>
    );
};
