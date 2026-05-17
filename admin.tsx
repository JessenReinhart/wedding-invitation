import React from 'react';
import { createRoot } from 'react-dom/client';
import { AdminApp } from './components/AdminApp';
import { SiteConfigProvider } from './contexts/SiteConfigContext';

const root = createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <SiteConfigProvider>
            <AdminApp />
        </SiteConfigProvider>
    </React.StrictMode>
);
