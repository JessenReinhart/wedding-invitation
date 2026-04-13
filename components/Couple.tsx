import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export const Couple: React.FC = () => {
    const { t, isBatak } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Animate Image Blur, Scale, and Overlay
    const imageBlur = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(12px)"]);
    const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
    const overlayOpacity = useTransform(scrollYProgress, [0, 0.4], [0.1, 0.75]);

    // Text animations: wait until blur is half-way, then fade in and slide up
    const textOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
    const textY = useTransform(scrollYProgress, [0.2, 0.5], [40, 0]);
    const watermarkOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 0.04]);

    return (
        <section ref={containerRef} id="couple" className="relative w-full h-[200vh] bg-ivory">
            <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-center">

                {/* Image Background */}
                <motion.div
                    style={{ filter: imageBlur, scale: imageScale }}
                    className="absolute inset-0 w-full h-full origin-center"
                >
                    <picture className="w-full h-full absolute inset-0">
                        <source media="(min-width: 1024px)" srcSet="/images/couple-landscape.jpg" />
                        <img
                            src="/images/couple.png"
                            alt="Vita and Jessen"
                            className="w-full h-full object-cover object-[center_35%] lg:object-center"
                        />
                    </picture>
                </motion.div>

                {/* Light Ivory Overlay for Text Readability */}
                <motion.div
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-0 bg-ivory pointer-events-none"
                ></motion.div>

                {/* Background Decorative Text (V&J) */}
                <motion.div
                    style={{ opacity: watermarkOpacity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none"
                >
                    <h3 className="font-display text-[40vw] leading-none text-wine">V&J</h3>
                </motion.div>

                {/* Text Overlay */}
                <motion.div
                    style={{ opacity: textOpacity, y: textY }}
                    className="relative z-10 max-w-6xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start"
                >
                    {/* Vita Info */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right">
                        <span className="font-sans text-xs tracking-[0.3em] uppercase text-wine-light mb-6">{t('couple.brideTitle')}</span>
                        <h2 className="font-display text-5xl md:text-7xl text-wine mb-2 leading-none drop-shadow-sm">
                            VITA
                        </h2>
                        <p className="font-sans text-xs tracking-[0.2em] uppercase text-wine-dark mb-4">
                            {isBatak ? 'Alvita Fabiola Aprilia br. Sitorus' : 'Alvita Fabiola Aprilia'}
                        </p>
                        <div className="w-12 h-px bg-wine/30 my-6"></div>
                        <div className="font-serif italic text-base md:text-lg text-wine-dark/80 space-y-1">
                            {t('couple.daughterOf').split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>

                    {/* Divider for Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-px bg-wine/20"></div>

                    {/* Jessen Info */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <span className="font-sans text-xs tracking-[0.3em] uppercase text-wine-light mb-6">{t('couple.groomTitle')}</span>
                        <h2 className="font-display text-5xl md:text-7xl text-wine mb-2 leading-none drop-shadow-sm">
                            JESSEN
                        </h2>
                        <p className="font-sans text-xs tracking-[0.2em] uppercase text-wine-dark mb-4">
                            Muhammad Jessen Reinhart Sugiarto
                        </p>
                        <div className="w-12 h-px bg-wine/30 my-6"></div>
                        <div className="font-serif italic text-base md:text-lg text-wine-dark/80 space-y-1">
                            {t('couple.sonOf').split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};