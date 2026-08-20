'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import { tenants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Tenant } from '@/store/useTenantStore';

export async function fetchTenants(): Promise<Tenant[]> {
  try {
    const env = getRequestContext().env;
    const db = getDb(env);
    const allTenants = await db.select().from(tenants);
    
    // Transform from DB schema to Tenant interface
    return allTenants.map(t => ({
      ...t,
      // Drizzle sqlite json mode handles parse/stringify, but let's ensure types are correct
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
    const db = getDb(getRequestContext().env);
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
    console.error('Failed to create tenant:', err);
    return { success: false, error: err };
  }
}

export async function updateTenantAction(id: string, data: Partial<Tenant>) {
  try {
    const db = getDb(getRequestContext().env);
    await db.update(tenants).set(data).where(eq(tenants.id, id));
    return { success: true };
  } catch (err) {
    console.error('Failed to update tenant:', err);
    return { success: false, error: err };
  }
}

export async function deleteTenantAction(id: string) {
  try {
    const db = getDb(getRequestContext().env);
    await db.delete(tenants).where(eq(tenants.id, id));
    return { success: true };
  } catch (err) {
    console.error('Failed to delete tenant:', err);
    return { success: false, error: err };
  }
}
