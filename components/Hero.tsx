import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useLoadingState } from '../contexts/LoadingContext';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, isBatak } = useLanguage();
  const loadState = useLoadingState();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const textLeftX = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textRightX = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const imageBlur = useTransform(scrollYProgress, [0, 0.6], ["blur(0px)", "blur(12px)"]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-ivory transition-colors duration-1000"
    >
      <AnimatePresence>
        {loadState === 'loading' && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[9999] bg-ivory flex flex-col items-center justify-center pointer-events-auto"
          >
            {/* Monogram */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <span className="font-display text-6xl md:text-8xl text-wine tracking-tighter leading-none">
                V & J
              </span>

              {/* Divider doubles as loading bar */}
              <div className="mt-6 mb-6 w-20 h-px bg-wine/10 overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-wine/40 rounded-full"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <span className="font-sans text-[10px] md:text-xs tracking-[0.5em] uppercase text-wine/50">
                02 · 05 · 2026
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Image - always rendered, visibility controlled by loadState */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loadState === 'loaded' ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
        style={{
          y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]),
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.05]),
          filter: imageBlur
        }}
      >
        <picture className="absolute inset-0 w-full h-full">
          <source media="(min-width: 1024px)" srcSet="/images/hero-landscae.png" />
          <img
            src="/images/hero.jpg"
            alt="Vita & Jessen"
            className="w-full h-full object-cover object-[center_35%] lg:object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-wine/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y, opacity, scale }}
        className={`relative z-10 flex flex-col items-center justify-center pb-56 md:pt-56 lg:pt-56 w-full px-4 gap-12 md:gap-16 transition-colors duration-1000 ${loadState === 'loaded' ? 'text-ivory' : 'text-wine'}`}
      >
        {/* Name Block */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ x: textLeftX, textShadow: loadState === 'loaded' ? "0 4px 30px rgba(0,0,0,0.5)" : "none" }}
            className="font-display text-[15vw] lg:text-[7vw] xl:text-[6vw] leading-[0.8] tracking-tighter uppercase text-center transition-colors duration-1000"
          >
            Jessen
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 100 }}
            style={{ boxShadow: loadState === 'loaded' ? "0 4px 30px rgba(0,0,0,0.3)" : "none" }}
            className={`my-3 md:my-5 lg:my-0 shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border flex items-center justify-center font-serif italic text-2xl md:text-3xl lg:text-3xl xl:text-4xl bg-transparent transition-colors duration-1000 ${loadState === 'loaded' ? 'border-ivory/50 backdrop-blur-sm' : 'border-wine/50'}`}
          >
            <span className="relative top-[-2px]">&</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            style={{ x: textRightX, textShadow: loadState === 'loaded' ? "0 4px 30px rgba(0,0,0,0.5)" : "none" }}
            className="font-display text-[15vw] lg:text-[7vw] xl:text-[6vw] leading-[0.8] tracking-tighter uppercase text-center transition-colors duration-1000"
          >
            Vita
          </motion.h1>
        </div>

        {/* Date and Location Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex flex-col items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs font-sans tracking-[0.25em] md:tracking-[0.3em] uppercase text-center transition-colors duration-1000"
          style={{ textShadow: loadState === 'loaded' ? "0 2px 10px rgba(0,0,0,0.5)" : "none" }}
        >
          <span className="font-semibold tracking-[0.4em] mb-1">02 MAY 2026</span>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 opacity-90">
            <span>{t('hero.location')}</span>
            <span className={`hidden md:block w-1 h-1 rounded-full transition-colors duration-1000 ${loadState === 'loaded' ? 'bg-ivory/50' : 'bg-wine/50'}`}></span>
            <span>{t('hero.venue')}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Scroll Indicator Base */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 md:bottom-10 left-0 w-full flex justify-center z-20 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-wine text-lg md:text-xl opacity-60"
        >
          ↓
        </motion.div>
      </motion.div>

      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-56 md:h-72 bg-gradient-to-t from-ivory to-transparent pointer-events-none z-10" />
    </section>
  );
};