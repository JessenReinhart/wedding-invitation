import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export const Navigation: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const { language, setLanguage, t } = useLanguage();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const scrollToSection = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: t('nav.bride'), href: '#hero' }, // Using #hero for Bride as it is the top section often or closely related, originally #hero in constants
    { label: t('nav.location'), href: '#venue' },
    { label: t('nav.event'), href: '#event' },
    { label: t('nav.rsvp'), href: '#rsvp' },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: -100 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-6 md:px-12 text-wine bg-ivory/80 backdrop-blur-sm border-b border-wine/10"
    >
      <div className="text-2xl font-display font-bold text-wine tracking-tighter">
        V&J
      </div>

      <div className="hidden md:flex gap-8">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => scrollToSection(e, item.href)}
            className="text-xs font-sans tracking-[0.2em] uppercase hover:opacity-50 transition-opacity duration-300"
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:block text-sm font-sans tracking-widest uppercase">
          02.05.26
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
      </div>
    </motion.nav>
  );
};