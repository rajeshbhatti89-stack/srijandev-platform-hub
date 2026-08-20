'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function fetchEnterpriseData() {
  const env = getRequestContext().env;
  const db = getDb(env);
  
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
  const env = getRequestContext().env;
  const db = getDb(env);
  
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
    patrolRoutes: patrolRoutes.map(r => ({ ...r, checkpoints: r.checkpoints || [] })), 
    patrolLogs: patrolLogs.map(l => ({ ...l, checkpointScans: l.checkpointScans || [] })), 
    sosAlerts, 
    rosterSlots, 
    geofencePosts, 
    geofenceCheckIns, 
    gatePasses 
  };
}

export async function insertRecordAction(tableName: keyof typeof schema, data: any) {
  const db = getDb(getRequestContext().env);
  const table = (schema as any)[tableName];
  // Convert boolean to number for SQLite
  const cleanData = { ...data };
  for (const key in cleanData) {
    if (typeof cleanData[key] === 'boolean') {
      cleanData[key] = cleanData[key] ? 1 : 0;
    }
  }
  await db.insert(table).values(cleanData);
}

export async function updateRecordAction(tableName: keyof typeof schema, id: string, data: any) {
  const db = getDb(getRequestContext().env);
  const table = (schema as any)[tableName];
  const cleanData = { ...data };
  for (const key in cleanData) {
    if (typeof cleanData[key] === 'boolean') {
      cleanData[key] = cleanData[key] ? 1 : 0;
    }
  }
  await db.update(table).set(cleanData).where(eq(table.id, id));
}

export async function deleteRecordAction(tableName: keyof typeof schema, id: string) {
  const db = getDb(getRequestContext().env);
  const table = (schema as any)[tableName];
  await db.delete(table).where(eq(table.id, id));
}

export async function seedAdminUser() {
  const db = getDb(getRequestContext().env);
  const admin = await db.select().from(schema.users).where(eq(schema.users.id, 'SADMIN-001'));
  if (admin.length === 0) {
    await db.insert(schema.users).values({
      id: 'SADMIN-001',
      name: 'Admin',
      email: 'admin@srijandev.in',
      password: 'Jaishreeram@123',
      role: 'SrijanDev Admin',
      tenantId: 'GLOBAL',
      assignedSiteId: 'GLOBAL',
      contactNo: '+91 99999 00000',
      isActive: 1, // SQLite boolean
    });
  }
}
