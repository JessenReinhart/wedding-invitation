import React from 'react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from './contexts/LanguageContext';
import { RegistryPage } from './components/RegistryPage';

const root = createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <LanguageProvider>
            <RegistryPage />
        </LanguageProvider>
    </React.StrictMode>
);
