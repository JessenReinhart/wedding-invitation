import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const textLeftX = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textRightX = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-ivory"
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 flex flex-col items-center justify-center text-wine w-full px-4"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ x: textLeftX }}
          className="font-display text-[15vw] leading-[0.8] tracking-tighter uppercase text-center text-wine"
        >
          Vita
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 100 }}
          className="my-4 md:my-8 w-16 h-16 md:w-24 md:h-24 rounded-full border border-wine flex items-center justify-center font-serif italic text-2xl md:text-4xl bg-transparent text-wine"
        >
          <span className="relative top-[-2px]">&</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          style={{ x: textRightX }}
          className="font-display text-[15vw] leading-[0.8] tracking-tighter uppercase text-center text-wine"
        >
          Jessen
        </motion.h1>

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-0 w-full flex justify-between px-6 md:px-12 text-xs md:text-sm font-sans tracking-[0.2em] uppercase text-wine-light"
      >
        <span>{t('hero.location')}</span>
        <span className="hidden md:inline">{t('hero.celebration')}</span>
        <span>{t('hero.venue')}</span>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ivory pointer-events-none" />
    </section>
  );
};