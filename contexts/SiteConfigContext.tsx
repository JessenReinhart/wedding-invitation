import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
    DEFAULT_SITE_CONFIG,
    normalizeSiteConfig,
    saveSiteConfig,
    subscribeToSiteConfig,
    type SiteConfig,
    type SiteLanguage,
} from '@/services/siteConfig';

type SiteConfigContextValue = {
    config: SiteConfig;
    isLoaded: boolean;
    setConfig: (next: SiteConfig) => void;
    updateConfig: (updater: (prev: SiteConfig) => SiteConfig) => void;
    save: (next?: SiteConfig) => Promise<void>;
    getOverride: (lang: SiteLanguage, key: string) => string | undefined;
};

const SiteConfigContext = createContext<SiteConfigContextValue | undefined>(undefined);

const STORAGE_KEY = 'wedding_site_config_v1';

function safeReadLocal(): SiteConfig | null {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return normalizeSiteConfig(JSON.parse(raw));
    } catch {
        return null;
    }
}

function safeWriteLocal(config: SiteConfig) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
        undefined;
    }
}

function applyMeta(config: SiteConfig) {
    if (typeof document === 'undefined') return;
    const title = config.brand.metaTitle?.trim();
    if (title) document.title = title;

    const desc = config.brand.metaDescription?.trim();
    if (desc) {
        const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
        if (meta) meta.content = desc;
    }
}

export const SiteConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [config, setConfigState] = useState<SiteConfig>(() => safeReadLocal() ?? DEFAULT_SITE_CONFIG);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        applyMeta(config);
    }, [config]);

    useEffect(() => {
        const unsubscribe = subscribeToSiteConfig(
            (remote) => {
                setConfigState(remote);
                safeWriteLocal(remote);
                setIsLoaded(true);
            },
            () => {
                setIsLoaded(true);
            }
        );
        return unsubscribe;
    }, []);

    const setConfig = (next: SiteConfig) => {
        const normalized = normalizeSiteConfig(next);
        setConfigState(normalized);
        safeWriteLocal(normalized);
    };

    const updateConfig = (updater: (prev: SiteConfig) => SiteConfig) => {
        setConfig(updater(config));
    };

    const save = async (next?: SiteConfig) => {
        const toSave = normalizeSiteConfig(next ?? config);
        await saveSiteConfig(toSave);
        setConfig(toSave);
    };

    const getOverride = useMemo(() => {
        return (lang: SiteLanguage, key: string) => config.copyOverrides?.[lang]?.[key];
    }, [config]);

    return (
        <SiteConfigContext.Provider value={{ config, isLoaded, setConfig, updateConfig, save, getOverride }}>
            {children}
        </SiteConfigContext.Provider>
    );
};

export function useSiteConfig(): SiteConfigContextValue {
    const ctx = useContext(SiteConfigContext);
    if (!ctx) throw new Error('useSiteConfig must be used within a SiteConfigProvider');
    return ctx;
}
