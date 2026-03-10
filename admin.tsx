import React from 'react';
import { createRoot } from 'react-dom/client';
import { AdminApp } from './components/AdminApp';

const root = createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <AdminApp />
    </React.StrictMode>
);
