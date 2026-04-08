import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export const Verse: React.FC = () => {
    const { t } = useLanguage();
    return (
        <section className="relative w-full bg-ivory py-24 md:py-32 px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center">
            {/* Decorative top ornament */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex items-center gap-4 mb-10"
            >
                <div className="w-16 md:w-24 h-px bg-wine/30"></div>
                <span className="font-display text-wine text-sm tracking-[0.3em] uppercase">✦</span>
                <div className="w-16 md:w-24 h-px bg-wine/30"></div>
            </motion.div>

            {/* Arabic Scripture */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="max-w-4xl mx-auto text-center mb-10"
            >
                <p
                    className="font-arabic text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-loose text-wine"
                    dir="rtl"
                    style={{ lineHeight: '2' }}
                    lang="ar"
                >
                    ﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ﴾
                </p>
            </motion.div>

            {/* Translation */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="max-w-2xl mx-auto text-center mb-8"
            >
                <p className="font-serif italic text-base md:text-lg text-wine-dark/80 leading-relaxed">
                    "{t('verse.translation')}"
                </p>
            </motion.div>

            {/* Surah Reference */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-center"
            >
                <span className="font-sans text-xs tracking-[0.2em] uppercase text-wine-light">
                    {t('verse.reference')}
                </span>
            </motion.div>

            {/* Decorative bottom ornament */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex items-center gap-4 mt-10"
            >
                <div className="w-16 md:w-24 h-px bg-wine/30"></div>
                <span className="font-display text-wine text-sm tracking-[0.3em] uppercase">✦</span>
                <div className="w-16 md:w-24 h-px bg-wine/30"></div>
            </motion.div>
        </section>
    );
};
