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
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const imageBlur = useTransform(scrollYProgress, [0, 0.6], ["blur(0px)", "blur(12px)"]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-ivory"
    >
      {/* Background Image with Parallax and Blur */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]),
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.05]),
          filter: imageBlur
        }}
      >
        <picture className="absolute inset-0 w-full h-full">
          {/* Desktop / Landscape image */}
          <source media="(min-width: 1024px)" srcSet="/images/hero-landscae.png" />
          {/* Mobile / Portrait fallback image */}
          <img
            src="/images/hero.jpg"
            alt="Vita & Jessen"
            className="w-full h-full object-cover object-[center_35%] lg:object-center"
          />
        </picture>
        {/* Subtle base shadow to maintain minimum legibility */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

        {/* Cinematic wash that darkens as you scroll down */}
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
        className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-8 pb-56 md:pt-56 lg:pt-56 text-ivory w-full px-4"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ x: textLeftX, textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
          className="font-display text-[15vw] lg:text-[7vw] xl:text-[6vw] leading-[0.8] tracking-tighter uppercase text-center text-ivory"
        >
          Jessen
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 100 }}
          style={{ boxShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
          className="my-3 md:my-5 lg:my-0 shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border border-ivory/50 flex items-center justify-center font-serif italic text-2xl md:text-3xl lg:text-3xl xl:text-4xl bg-transparent text-ivory backdrop-blur-sm"
        >
          <span className="relative top-[-2px]">&</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          style={{ x: textRightX, textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
          className="font-display text-[15vw] lg:text-[7vw] xl:text-[6vw] leading-[0.8] tracking-tighter uppercase text-center text-ivory"
        >
          Vita
        </motion.h1>

      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 md:bottom-10 left-0 w-full flex flex-col items-center justify-center gap-2 md:gap-3 px-6 md:px-12 text-[10px] md:text-xs font-sans tracking-[0.25em] md:tracking-[0.3em] uppercase text-wine z-20 text-center"
      >
        {/* Animated Bouncing Arrow */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-wine mb-2 md:mb-4 lg:mb-6 opacity-60 text-lg md:text-xl"
        >
          ↓
        </motion.div>

        <span className="font-semibold tracking-[0.4em] mb-1">02 MAY 2026</span>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 opacity-80">
          <span>{t('hero.location')}</span>
          <span className="hidden md:block w-1 h-1 rounded-full bg-wine/50"></span>
          <span>{t('hero.venue')}</span>
        </div>
      </motion.div>

      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-ivory to-transparent pointer-events-none z-10" />
    </section>
  );
};