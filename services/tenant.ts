export const DEFAULT_TENANT_ID = 'vj';

export function getTenantId(): string {
    return DEFAULT_TENANT_ID;
}

export function isDefaultTenant(tenantId: string): boolean {
    return tenantId === DEFAULT_TENANT_ID;
}
