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
  } catch (e) {
    // Ignore in non-worker environments or static export
  }
  return null;
}

export async function fetchTenants(): Promise<Tenant[]> {
  try {
    const db = getCloudflareDb();
    if (!db) return [];
    const allTenants = await db.select().from(tenants);
    
    return allTenants.map((t: any) => ({
      ...t,
      logoUrl: t.logoUrl || '',
      assignedModules: (t.assignedModules || []) as any,
      plantSites: (t.plantSites || []) as any,
    }));
  } catch (err) {
    console.error('Failed to fetch tenants:', err);
    return [];
  }
}

export async function createTenantAction(data: Tenant) {
  try {
    const db = getCloudflareDb();
    if (!db) return { success: true };
    await db.insert(tenants).values({
      id: data.id,
      companyName: data.companyName,
      subdomain: data.subdomain,
      logoUrl: data.logoUrl,
      primaryColor: data.primaryColor,
      assignedModules: data.assignedModules,
      plantSites: data.plantSites,
      createdAt: data.createdAt,
      isActive: data.isActive
    });
    return { success: true };
  } catch (err) {
    console.error('[Tenant Action Security] Failed to create tenant');
    return { success: false, error: 'Failed to create tenant workspace. Please try again.' };
  }
}

export async function updateTenantAction(id: string, data: Partial<Tenant>) {
  try {
    const db = getCloudflareDb();
    if (!db) return { success: true };
    await db.update(tenants).set(data).where(eq(tenants.id, id));
    return { success: true };
  } catch (err) {
    console.error('[Tenant Action Security] Failed to update tenant');
    return { success: false, error: 'Failed to update tenant configuration. Please try again.' };
  }
}

export async function deleteTenantAction(id: string) {
  try {
    const db = getCloudflareDb();
    if (!db) return { success: true };
    await db.delete(tenants).where(eq(tenants.id, id));
    return { success: true };
  } catch (err) {
    console.error('[Tenant Action Security] Failed to delete tenant');
    return { success: false, error: 'Failed to delete tenant workspace. Please try again.' };
  }
}
