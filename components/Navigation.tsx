import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { NAV_ITEMS } from '../constants';

export const Navigation: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

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
      <div className="text-sm font-sans tracking-widest uppercase font-bold">
        V & J
      </div>
      
      <div className="hidden md:flex gap-8">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => scrollToSection(e, item.href)}
            className="text-xs font-sans tracking-[0.2em] uppercase hover:opacity-50 transition-opacity duration-300"
          >
            {item.label}
          </a>
        ))}
      </div>

      <div className="text-sm font-sans tracking-widest uppercase">
        02.05.26
      </div>
    </motion.nav>
  );
};