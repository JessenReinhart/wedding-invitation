import {
    doc,
    onSnapshot,
    setDoc,
    getDoc,
    serverTimestamp,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { Language } from '@/translations';
import { getTenantId, isDefaultTenant } from './tenant';

export type SiteLanguage = Language;

export type CopyOverrides = Record<SiteLanguage, Record<string, string>>;

export interface SiteConfig {
    schemaVersion: 1;
    brand: {
        projectName: string;
        metaTitle: string;
        metaDescription: string;
    };
    couple: {
        bride: {
            displayName: string;
            fullName: {
                default: string;
                alt?: string;
            };
        };
        groom: {
            displayName: string;
            fullName: {
                default: string;
                alt?: string;
            };
        };
    };
    wedding: {
        dateISO: string;
        dateLabel: Record<SiteLanguage, string>;
        dateLabelShort: Record<SiteLanguage, string>;
    };
    links: {
        googleMapsUrl: string;
        map: {
            lat: number;
            lng: number;
        };
    };
    copyOverrides: CopyOverrides;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
    schemaVersion: 1,
    brand: {
        projectName: 'Vita & Jessen - Editorial Wedding',
        metaTitle: 'Vita & Jessen | 02.05.26',
        metaDescription: "A high-end, brutalist editorial wedding invitation website featuring kinetic typography, smooth scrolling, and minimalist luxury aesthetics.",
    },
    couple: {
        bride: {
            displayName: 'Vita',
            fullName: {
                default: 'Alvita Fabiola Aprilia',
                alt: 'Alvita Fabiola Aprilia br. Sitorus',
            },
        },
        groom: {
            displayName: 'Jessen',
            fullName: {
                default: 'Muhammad Jessen Reinhart Sugiarto',
            },
        },
    },
    wedding: {
        dateISO: '2026-05-02',
        dateLabel: {
            id: '02 Mei 2026',
            en: 'May 02, 2026',
            ko: '2026년 5월 2일',
        },
        dateLabelShort: {
            id: '02.05.26',
            en: '02.05.26',
            ko: '02.05.26',
        },
    },
    links: {
        googleMapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=-6.179173700072192,106.84046081165128',
        map: {
            lat: -6.179173700072192,
            lng: 106.84046081165128,
        },
    },
    copyOverrides: {
        id: {},
        en: {},
        ko: {},
    },
};

const COLLECTION = 'siteConfig';
const DOC_ID = 'current';

function getTenantDocId(): string {
    const tenantId = getTenantId();
    return tenantId;
}

function asRecord(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object') return null;
    return value as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
    return typeof value === 'string' ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function mergeLanguageMaps<T extends Record<SiteLanguage, Record<string, string>>>(
    base: T,
    extra: unknown
): T {
    const extraRec = asRecord(extra);
    if (!extraRec) return base;

    const next: T = {
        ...base,
        id: { ...base.id },
        en: { ...base.en },
        ko: { ...base.ko },
    };

    (['id', 'en', 'ko'] as const).forEach((lang) => {
        const perLang = asRecord(extraRec[lang]);
        if (!perLang) return;
        Object.entries(perLang).forEach(([k, v]) => {
            const s = asString(v);
            if (s !== undefined) next[lang][k] = s;
        });
    });

    return next;
}

function mergeLocalizedStrings(
    base: Record<SiteLanguage, string>,
    extra: unknown
): Record<SiteLanguage, string> {
    const extraRec = asRecord(extra);
    if (!extraRec) return base;
    return {
        id: asString(extraRec.id) ?? base.id,
        en: asString(extraRec.en) ?? base.en,
        ko: asString(extraRec.ko) ?? base.ko,
    };
}

export function normalizeSiteConfig(input: unknown): SiteConfig {
    const base = DEFAULT_SITE_CONFIG;
    const rec = asRecord(input);
    if (!rec) return base;

    const brand = asRecord(rec.brand);
    const couple = asRecord(rec.couple);
    const bride = couple ? asRecord(couple.bride) : null;
    const groom = couple ? asRecord(couple.groom) : null;
    const wedding = asRecord(rec.wedding);
    const links = asRecord(rec.links);
    const map = links ? asRecord(links.map) : null;

    const dateLabel = mergeLocalizedStrings(base.wedding.dateLabel, wedding?.dateLabel);
    const dateLabelShort = mergeLocalizedStrings(base.wedding.dateLabelShort, wedding?.dateLabelShort);

    const normalized: SiteConfig = {
        schemaVersion: 1,
        brand: {
            projectName: asString(brand?.projectName) ?? base.brand.projectName,
            metaTitle: asString(brand?.metaTitle) ?? base.brand.metaTitle,
            metaDescription: asString(brand?.metaDescription) ?? base.brand.metaDescription,
        },
        couple: {
            bride: {
                displayName: asString(bride?.displayName) ?? base.couple.bride.displayName,
                fullName: {
                    default:
                        asString(asRecord(bride?.fullName)?.default) ??
                        base.couple.bride.fullName.default,
                    alt:
                        asString(asRecord(bride?.fullName)?.alt) ??
                        base.couple.bride.fullName.alt,
                },
            },
            groom: {
                displayName: asString(groom?.displayName) ?? base.couple.groom.displayName,
                fullName: {
                    default:
                        asString(asRecord(groom?.fullName)?.default) ??
                        base.couple.groom.fullName.default,
                    alt:
                        asString(asRecord(groom?.fullName)?.alt) ??
                        base.couple.groom.fullName.alt,
                },
            },
        },
        wedding: {
            dateISO: asString(wedding?.dateISO) ?? base.wedding.dateISO,
            dateLabel,
            dateLabelShort,
        },
        links: {
            googleMapsUrl: asString(links?.googleMapsUrl) ?? base.links.googleMapsUrl,
            map: {
                lat: asNumber(map?.lat) ?? base.links.map.lat,
                lng: asNumber(map?.lng) ?? base.links.map.lng,
            },
        },
        copyOverrides: mergeLanguageMaps(base.copyOverrides, rec.copyOverrides),
    };

    return normalized;
}

export function getMonogram(config: SiteConfig): string {
    const a = config.couple.bride.displayName.trim().slice(0, 1).toUpperCase();
    const b = config.couple.groom.displayName.trim().slice(0, 1).toUpperCase();
    if (!a && !b) return 'W';
    if (!a) return b;
    if (!b) return a;
    return `${a}&${b}`;
}

function stripUndefined(value: unknown): any {
    if (Array.isArray(value)) {
        return value.map(stripUndefined).filter((v) => v !== undefined);
    }
    if (value && typeof value === 'object') {
        const out: Record<string, any> = {};
        Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
            if (v === undefined) return;
            const next = stripUndefined(v);
            if (next === undefined) return;
            out[k] = next;
        });
        return out;
    }
    return value;
}

export function subscribeToSiteConfig(
    callback: (config: SiteConfig) => void,
    onError?: (error: Error) => void
): Unsubscribe {
    const tenantId = getTenantId();
    const primaryDocId = getTenantDocId();

    let legacyUnsub: Unsubscribe | null = null;

    const unsub = onSnapshot(
        doc(db, COLLECTION, primaryDocId),
        (snapshot) => {
            if (snapshot.exists()) {
                callback(normalizeSiteConfig(snapshot.data()));
                return;
            }

            callback(DEFAULT_SITE_CONFIG);
        },
        (err) => {
            onError?.(err as Error);
        }
    );

    if (isDefaultTenant(tenantId)) {
        legacyUnsub = onSnapshot(
            doc(db, COLLECTION, DOC_ID),
            (snapshot) => {
                if (snapshot.exists()) {
                    callback(normalizeSiteConfig(snapshot.data()));
                }
            },
            () => {
                undefined;
            }
        );
    }

    return () => {
        unsub();
        legacyUnsub?.();
    };
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
    const tenantId = getTenantId();
    const primary = await getDoc(doc(db, COLLECTION, getTenantDocId()));
    if (primary.exists()) return normalizeSiteConfig(primary.data());

    if (isDefaultTenant(tenantId)) {
        const legacy = await getDoc(doc(db, COLLECTION, DOC_ID));
        if (legacy.exists()) return normalizeSiteConfig(legacy.data());
    }

    return DEFAULT_SITE_CONFIG;
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
    const normalized = normalizeSiteConfig(config);
    const tenantId = getTenantId();
    const data = stripUndefined(normalized) as SiteConfig;

    await setDoc(
        doc(db, COLLECTION, getTenantDocId()),
        {
            ...data,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );

    if (!isDefaultTenant(tenantId)) return;

    await setDoc(
        doc(db, COLLECTION, DOC_ID),
        {
            ...data,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}
