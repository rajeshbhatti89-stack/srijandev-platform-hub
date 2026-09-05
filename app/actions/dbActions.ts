import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

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

export async function fetchEnterpriseData() {
  const db = getCloudflareDb();
  if (!db) {
    return { users: [], sites: [], guards: [], incidents: [], leaveRequests: [], tasks: [], attendanceLogs: [] };
  }
  
  const [users, sites, guards, incidents, leaveRequests, tasks, attendanceLogs] = await Promise.all([
    db.select().from(schema.users),
    db.select().from(schema.sites),
    db.select().from(schema.guards),
    db.select().from(schema.incidents),
    db.select().from(schema.leaveRequests),
    db.select().from(schema.tasks),
    db.select().from(schema.attendanceLogs),
  ]);

  return { users, sites, guards, incidents, leaveRequests, tasks, attendanceLogs };
}

export async function fetchOperationsData() {
  const db = getCloudflareDb();
  if (!db) {
    return { patrolRoutes: [], patrolLogs: [], sosAlerts: [], rosterSlots: [], geofencePosts: [], geofenceCheckIns: [], gatePasses: [] };
  }
  
  const [patrolRoutes, patrolLogs, sosAlerts, rosterSlots, geofencePosts, geofenceCheckIns, gatePasses] = await Promise.all([
    db.select().from(schema.patrolRoutes),
    db.select().from(schema.patrolLogs),
    db.select().from(schema.sosAlerts),
    db.select().from(schema.rosterSlots),
    db.select().from(schema.geofencePosts),
    db.select().from(schema.geofenceCheckIns),
    db.select().from(schema.gatePasses),
  ]);

  return { 
    patrolRoutes: patrolRoutes.map((r: any) => ({ ...r, checkpoints: r.checkpoints || [] })), 
    patrolLogs: patrolLogs.map((l: any) => ({ ...l, checkpointScans: l.checkpointScans || [] })), 
    sosAlerts, 
    rosterSlots, 
    geofencePosts, 
    geofenceCheckIns, 
    gatePasses 
  };
}

export async function insertRecordAction(tableName: keyof typeof schema, data: any) {
  try {
    const db = getCloudflareDb();
    if (!db) return;
    const table = (schema as any)[tableName];
    if (!table) return;
    // Convert boolean to number for SQLite
    const cleanData = { ...data };
    for (const key in cleanData) {
      if (typeof cleanData[key] === 'boolean') {
        cleanData[key] = cleanData[key] ? 1 : 0;
      }
    }
    await db.insert(table).values(cleanData);
  } catch (err) {
    console.error(`[DB Security] Failed to insert record in ${String(tableName)}`);
  }
}

export async function updateRecordAction(tableName: keyof typeof schema, id: string, data: any) {
  try {
    const db = getCloudflareDb();
    if (!db) return;
    const table = (schema as any)[tableName];
    if (!table || !id) return;
    const cleanData = { ...data };
    for (const key in cleanData) {
      if (typeof cleanData[key] === 'boolean') {
        cleanData[key] = cleanData[key] ? 1 : 0;
      }
    }
    await db.update(table).set(cleanData).where(eq(table.id, id));
  } catch (err) {
    console.error(`[DB Security] Failed to update record in ${String(tableName)}`);
  }
}

export async function deleteRecordAction(tableName: keyof typeof schema, id: string) {
  try {
    const db = getCloudflareDb();
    if (!db) return;
    const table = (schema as any)[tableName];
    if (!table || !id) return;
    await db.delete(table).where(eq(table.id, id));
  } catch (err) {
    console.error(`[DB Security] Failed to delete record in ${String(tableName)}`);
  }
}

export async function seedAdminUser() {
  try {
    const db = getCloudflareDb();
    if (!db) return;
    const admin = await db.select().from(schema.users).where(eq(schema.users.id, 'SADMIN-001'));
    if (admin.length === 0) {
      const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin#2026!SrijanSec';
      await db.insert(schema.users).values({
        id: 'SADMIN-001',
        name: 'Admin',
        email: 'admin@srijandev.in',
        password: initialPassword,
        role: 'SrijanDev Admin',
        tenantId: 'GLOBAL',
        assignedSiteId: 'GLOBAL',
        contactNo: '+91 99999 00000',
        isActive: true,
      });
    }
  } catch (err) {
    console.error('[DB Security] Failed to seed admin user');
  }
}
