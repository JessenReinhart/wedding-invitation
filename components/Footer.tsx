import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { config } = useSiteConfig();
  return (
    <footer className="w-full bg-wine-dark text-ivory/60 py-12 px-6 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center text-xs font-sans uppercase tracking-widest">
      <div className="mb-4 md:mb-0">
        &copy; 2026 {config.couple.bride.displayName} &amp; {config.couple.groom.displayName}{' '}
        <span className="mx-2">|</span> <span className="normal-case tracking-normal">{t('hero.hashtag')}</span>
      </div>
    </footer>
  );
};
