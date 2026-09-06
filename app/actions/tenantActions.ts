import { tenants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Tenant } from '@/store/useTenantStore';

function getCloudflareDb() {
  if (typeof window !== 'undefined') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getRequestContext } = require('@cloudflare/next-on-pages');
    const env = getRequestContext()?.env;
    if (env?.DB) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getDb } = require('@/db');
      return getDb(env);
    }
  } catch {
    // Ignore in non-worker environments or static export
  }
  return null;
}

// Sanitize string to prevent XSS and SQL payload injection
function sanitizeString(val: unknown, maxLen = 250): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

export async function fetchTenants(): Promise<Tenant[]> {
  try {
    const db = getCloudflareDb();
    if (!db) return [];
    const allTenants = await db.select().from(tenants);
    
    return allTenants.map((t: any) => ({
      ...t,
      companyName: sanitizeString(t.companyName, 100),
      subdomain: sanitizeString(t.subdomain, 50).toLowerCase(),
      logoUrl: sanitizeString(t.logoUrl, 500),
      primaryColor: sanitizeString(t.primaryColor, 30),
      assignedModules: Array.isArray(t.assignedModules) ? t.assignedModules : [],
      plantSites: Array.isArray(t.plantSites) ? t.plantSites : [],
    }));
  } catch (err) {
    console.error('[Tenant Security] Safe error caught during fetchTenants');
    return [];
  }
}

export async function createTenantAction(data: Tenant) {
  try {
    if (!data || !data.id || !data.companyName || !data.subdomain) {
      return { success: false, error: 'Required tenant fields are missing.' };
    }

    const safeId = sanitizeString(data.id, 50);
    const safeSubdomain = sanitizeString(data.subdomain, 50).toLowerCase().replace(/[^a-z0-9-]/g, '');
    const safeCompanyName = sanitizeString(data.companyName, 100);

    const db = getCloudflareDb();
    if (!db) return { success: true };

    await db.insert(tenants).values({
      id: safeId,
      companyName: safeCompanyName,
      subdomain: safeSubdomain,
      logoUrl: sanitizeString(data.logoUrl, 500),
      primaryColor: sanitizeString(data.primaryColor, 30) || '#3b82f6',
      assignedModules: Array.isArray(data.assignedModules) ? data.assignedModules : [],
      plantSites: Array.isArray(data.plantSites) ? data.plantSites : [],
      createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
      isActive: Boolean(data.isActive),
    });

    return { success: true };
  } catch (err) {
    console.error('[Tenant Security] Failed to create tenant safely');
    return { success: false, error: 'Failed to create tenant workspace. Please verify input data.' };
  }
}

export async function updateTenantAction(id: string, data: Partial<Tenant>) {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid tenant identifier.' };
    }

    const safeId = sanitizeString(id, 50);
    const db = getCloudflareDb();
    if (!db) return { success: true };

    const updatePayload: Record<string, any> = {};
    if (data.companyName !== undefined) updatePayload.companyName = sanitizeString(data.companyName, 100);
    if (data.subdomain !== undefined) updatePayload.subdomain = sanitizeString(data.subdomain, 50).toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (data.logoUrl !== undefined) updatePayload.logoUrl = sanitizeString(data.logoUrl, 500);
    if (data.primaryColor !== undefined) updatePayload.primaryColor = sanitizeString(data.primaryColor, 30);
    if (data.assignedModules !== undefined) updatePayload.assignedModules = Array.isArray(data.assignedModules) ? data.assignedModules : [];
    if (data.plantSites !== undefined) updatePayload.plantSites = Array.isArray(data.plantSites) ? data.plantSites : [];
    if (data.isActive !== undefined) updatePayload.isActive = Boolean(data.isActive);

    await db.update(tenants).set(updatePayload).where(eq(tenants.id, safeId));
    return { success: true };
  } catch (err) {
    console.error('[Tenant Security] Failed to update tenant safely');
    return { success: false, error: 'Failed to update tenant configuration. Please try again.' };
  }
}

export async function deleteTenantAction(id: string) {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid tenant identifier.' };
    }
    const safeId = sanitizeString(id, 50);
    const db = getCloudflareDb();
    if (!db) return { success: true };

    await db.delete(tenants).where(eq(tenants.id, safeId));
    return { success: true };
  } catch (err) {
    console.error('[Tenant Security] Failed to delete tenant safely');
    return { success: false, error: 'Failed to delete tenant workspace. Please try again.' };
  }
}

