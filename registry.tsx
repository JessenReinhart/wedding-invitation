import React from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './contexts/LanguageContext';
import { RegistryPage } from './components/RegistryPage';
import { SiteConfigProvider } from './contexts/SiteConfigContext';

const root = createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <SiteConfigProvider>
            <LanguageProvider>
                <RegistryPage />
            </LanguageProvider>
        </SiteConfigProvider>
    </React.StrictMode>
);
