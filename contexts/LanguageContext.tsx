import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Language } from '@/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any; // Helper for nested keys
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('id');

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
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
