import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { translations, Language } from '@/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any; // Helper for nested keys
    isBatak: boolean;
    guestName: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('id');

    const isBatak = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('fam') === '1';
    }, []);

    const guestName = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('to');
    }, []);

    const t = (path: string) => {
        const keys = path.split('.');
        let value: any = translations[language];

        for (const key of keys) {
            if (value === undefined || value === null) return path;
            value = value[key as keyof typeof value];
        }

        return value === undefined ? path : value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isBatak, guestName }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
