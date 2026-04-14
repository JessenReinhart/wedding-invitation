import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useLoadingState } from '../contexts/LoadingContext';
import { useMusic } from '../contexts/MusicContext';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, isBatak, guestName } = useLanguage();
  const loadState = useLoadingState();
  const { play } = useMusic();

  const [isInvitationOpened, setIsInvitationOpened] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('wedding_invitation_opened') === '1';
    } catch {
      return false;
    }
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // On mobile: only opacity + white overlay; skip parallax, scale, blur, text sliding
  const y = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [1, 1.05]);

  const bgY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "15%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [1, 1.05]);
  const textLeftX = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -100]);
  const textRightX = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, 100]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const imageBlur = useTransform(scrollYProgress, [0, 0.6], isMobile ? ["blur(0px)", "blur(0px)"] : ["blur(0px)", "blur(12px)"]);

  const isHeroReady = loadState === 'loaded' || loadState === 'timeout';
  const showWelcome = isHeroReady && !isInvitationOpened;
  const showOverlay = loadState === 'loading' || showWelcome;

  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
    document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOverlay]);

  const handleOpenInvitation = () => {
    try {
      window.localStorage.setItem('wedding_invitation_opened', '1');
    } catch {
      undefined;
    }
    setIsInvitationOpened(true);
    play();
    window.scrollTo(0, 0);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-ivory transition-colors duration-1000"
    >
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: "-10%", filter: "blur(12px)" }}
              transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[2147483647] bg-ivory flex flex-col items-center justify-center pointer-events-auto origin-top"
            >
              {/* Monogram */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center w-full"
                layout
              >
                <motion.span layout="position" className="font-display text-6xl md:text-8xl text-wine tracking-tighter leading-none">
                  V & J
                </motion.span>

                {/* Divider doubles as loading bar */}
                <motion.div layout="position" className="mt-6 mb-6 w-20 h-px bg-wine/10 overflow-hidden rounded-full relative">
                  <AnimatePresence mode="wait">
                    {loadState === 'loading' ? (
                      <motion.div
                        key="loadingBar"
                        className="absolute inset-0 bg-wine/40 rounded-full"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ) : (
                      <motion.div
                        key="separator"
                        className="absolute inset-0 bg-wine/25 rounded-full"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformOrigin: 'center' }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.span layout="position" className="font-sans text-[10px] md:text-xs tracking-[0.5em] uppercase text-wine/50">
                  02 · 05 · 2026
                </motion.span>

                <AnimatePresence>
                  {showWelcome && guestName && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 40 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-3 max-w-[22rem] md:max-w-md px-6 text-center text-wine/70 overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="font-sans text-[10px] md:text-xs tracking-[0.35em] uppercase text-wine/60 pt-2"
                      >
                        {t('hero.dear')}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="font-serif italic text-4xl md:text-5xl text-wine opacity-90 drop-shadow-sm px-4 text-center"
                      >
                        {guestName}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="font-sans text-[10px] md:text-xs tracking-[0.25em] uppercase text-wine/60 mt-1 pb-2"
                      >
                        {t('hero.invitationMessage')}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showWelcome && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, y: 20, filter: "blur(4px)", scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                      transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      onClick={handleOpenInvitation}
                      className="mt-12 px-8 py-3 rounded-full bg-wine text-ivory font-sans text-[11px] md:text-xs tracking-[0.35em] uppercase shadow-[0_20px_60px_rgba(0,0,0,0.18)] hover:bg-wine-dark focus:outline-none focus:ring-2 focus:ring-wine/20 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      {t('hero.openInvitation')}
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Background Image - always rendered, visibility controlled by loadState */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeroReady ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
        style={{
          y: bgY,
          scale: bgScale,
          filter: imageBlur
        }}
      >
        <picture className="absolute inset-0 w-full h-full">
          <source media="(min-width: 1024px)" srcSet="/images/hero-landscae.png" fetchPriority="high" />
          <img
            src="/images/hero.jpg"
            alt="Vita & Jessen"
            className="w-full h-full object-cover object-[center_35%] lg:object-center"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-white pointer-events-none"
        />
      </motion.div>

      {/* Guest Name Block - Desktop: absolute top to avoid blocking the couple */}
      {/* Guest Name Block is now integrated into the main content block for better flow */}


      <motion.div
        style={{ y, opacity, scale }}
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen py-10 md:py-16 lg:py-20 w-full px-4 gap-4 md:gap-6 lg:gap-8 transition-colors duration-1000 ${loadState === 'loaded' ? 'text-ivory drop-shadow-lg' : 'text-wine'}`}



      >
        {/* Guest Name Block - Integrated in-flow for all screen sizes */}
        {guestName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4 md:mb-6 lg:mb-8 mt-12 md:mt-16 lg:mt-14 flex flex-col items-center"
          >
            <span className="font-sans text-[10px] md:text-sm tracking-[0.35em] uppercase text-center mb-1 md:mb-2 opacity-80">
              {t('hero.dear')}
            </span>
            <h2 className="font-serif italic text-2xl md:text-4xl lg:text-4xl text-center opacity-90 drop-shadow-sm px-4">
              {guestName}
            </h2>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-8">
          <motion.div style={{ x: textLeftX }}>
            <motion.h1
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="font-display text-[clamp(3.5rem,15vw,8rem)] lg:text-[clamp(6rem,7vw,12rem)] leading-[0.85] tracking-tighter uppercase text-center transition-colors duration-1000"

            >
              Jessen
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 100 }}
            style={{ boxShadow: loadState === 'loaded' ? "0 4px 30px rgba(0,0,0,0.3)" : "none" }}
            className={`my-3 md:my-5 lg:my-0 shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full border flex items-center justify-center font-serif italic text-2xl md:text-3xl lg:text-3xl xl:text-4xl bg-transparent transition-colors duration-1000 ${loadState === 'loaded' ? 'border-ivory/50' : 'border-wine/50'}`}
          >
            <span className="relative top-[-2px]">&</span>
          </motion.div>

          <motion.div style={{ x: textRightX }}>
            <motion.h1
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
              className="font-display text-[clamp(3.5rem,15vw,8rem)] lg:text-[clamp(6rem,7vw,12rem)] leading-[0.85] tracking-tighter uppercase text-center transition-colors duration-1000"

            >
              Vita
            </motion.h1>
          </motion.div>
        </div>

        {/* Date and Location Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex flex-col items-center justify-center gap-2 md:gap-3 text-[10px] md:text-[11px] font-sans tracking-[0.25em] md:tracking-[0.3em] uppercase text-center transition-colors duration-1000"
        >
          <span className="font-semibold tracking-[0.4em] mb-1 drop-shadow-sm">02 MAY 2026</span>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 opacity-90 drop-shadow-sm">
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
          className="text-wine text-lg md:text-xl opacity-60 drop-shadow"
        >
          ↓
        </motion.div>
      </motion.div>

      {/* Gradient transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-36 bg-gradient-to-t from-ivory to-transparent pointer-events-none z-10" />
    </section>
  );
};
