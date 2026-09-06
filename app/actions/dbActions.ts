import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// Whitelist of allowed database table names to prevent arbitrary table access
const ALLOWED_TABLES = new Set([
  'users',
  'sites',
  'guards',
  'incidents',
  'leaveRequests',
  'tasks',
  'attendanceLogs',
  'patrolRoutes',
  'patrolLogs',
  'sosAlerts',
  'rosterSlots',
  'geofencePosts',
  'geofenceCheckIns',
  'gatePasses',
  'tenants',
]);

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

// Sanitize raw record objects to prevent prototype pollution and invalid types
function sanitizeData(data: Record<string, unknown>): Record<string, unknown> {
  if (!data || typeof data !== 'object') return {};
  const clean: Record<string, unknown> = {};
  
  for (const key of Object.keys(data)) {
    // Prevent prototype pollution attacks
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    
    const val = data[key];
    if (typeof val === 'boolean') {
      clean[key] = val ? 1 : 0;
    } else if (typeof val === 'string') {
      // Trim strings and prevent unbounded payloads
      clean[key] = val.trim().slice(0, 10000);
    } else if (typeof val === 'number' && Number.isFinite(val)) {
      clean[key] = val;
    } else if (val === null || val === undefined) {
      clean[key] = null;
    } else if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
      clean[key] = val;
    }
  }
  return clean;
}

export async function fetchEnterpriseData() {
  try {
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
  } catch (err) {
    console.error('[DB Security] Safe error caught during fetchEnterpriseData');
    return { users: [], sites: [], guards: [], incidents: [], leaveRequests: [], tasks: [], attendanceLogs: [] };
  }
}

export async function fetchOperationsData() {
  try {
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
  } catch (err) {
    console.error('[DB Security] Safe error caught during fetchOperationsData');
    return { patrolRoutes: [], patrolLogs: [], sosAlerts: [], rosterSlots: [], geofencePosts: [], geofenceCheckIns: [], gatePasses: [] };
  }
}

export async function insertRecordAction(tableName: keyof typeof schema, data: any) {
  try {
    if (!ALLOWED_TABLES.has(String(tableName))) {
      console.warn(`[DB Security] Unauthorized table access attempt: ${String(tableName)}`);
      return;
    }
    const db = getCloudflareDb();
    if (!db) return;
    const table = (schema as any)[tableName];
    if (!table) return;

    const cleanData = sanitizeData(data);
    await db.insert(table).values(cleanData);
  } catch (err) {
    console.error(`[DB Security] Failed to insert record safely in ${String(tableName)}`);
  }
}

export async function updateRecordAction(tableName: keyof typeof schema, id: string, data: any) {
  try {
    if (!ALLOWED_TABLES.has(String(tableName)) || !id || typeof id !== 'string') {
      return;
    }
    const db = getCloudflareDb();
    if (!db) return;
    const table = (schema as any)[tableName];
    if (!table) return;

    const cleanData = sanitizeData(data);
    await db.update(table).set(cleanData).where(eq(table.id, id.trim()));
  } catch (err) {
    console.error(`[DB Security] Failed to update record safely in ${String(tableName)}`);
  }
}

export async function deleteRecordAction(tableName: keyof typeof schema, id: string) {
  try {
    if (!ALLOWED_TABLES.has(String(tableName)) || !id || typeof id !== 'string') {
      return;
    }
    const db = getCloudflareDb();
    if (!db) return;
    const table = (schema as any)[tableName];
    if (!table) return;

    await db.delete(table).where(eq(table.id, id.trim()));
  } catch (err) {
    console.error(`[DB Security] Failed to delete record safely in ${String(tableName)}`);
  }
}

export async function seedAdminUser() {
  try {
    const db = getCloudflareDb();
    if (!db) return;
    const admin = await db.select().from(schema.users).where(eq(schema.users.id, 'SADMIN-001'));
    if (admin.length === 0) {
      // Securely generate a cryptographic initial password if not defined in env
      const securePassword = process.env.INITIAL_ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex') + '!Srijan';
      
      await db.insert(schema.users).values({
        id: 'SADMIN-001',
        name: 'Admin',
        email: 'admin@srijandev.in',
        password: securePassword,
        role: 'SrijanDev Admin',
        tenantId: 'GLOBAL',
        assignedSiteId: 'GLOBAL',
        contactNo: '+91 99999 00000',
        isActive: true,
      });
    }
  } catch (err) {
    console.error('[DB Security] Safe error caught during admin seeding');
  }
}
