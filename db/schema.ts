import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const tenants = sqliteTable('tenants', {
  id: text('id').primaryKey(),
  companyName: text('company_name').notNull(),
  subdomain: text('subdomain').notNull().unique(),
  logoUrl: text('logo_url'),
  primaryColor: text('primary_color').notNull().default('#3b82f6'),
  assignedModules: text('assigned_modules', { mode: 'json' }).$type<string[]>(),
  plantSites: text('plant_sites', { mode: 'json' }).$type<any[]>(),
  createdAt: text('created_at').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password'),
  role: text('role').notNull(),
  tenantId: text('tenant_id').notNull(),
  assignedSiteId: text('assigned_site_id').notNull(),
  contactNo: text('contact_no').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
});

export const sites = sqliteTable('sites', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status').notNull(),
});

export const guards = sqliteTable('guards', {
  id: text('id').primaryKey(),
  guardCode: text('guard_code').notNull(),
  personnelId: text('personnel_id').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  department: text('department'),
  company: text('company'),
  designation: text('designation').notNull(),
  tenantId: text('tenant_id').notNull(),
  assignedSiteId: text('assigned_site_id').notNull(),
  assignedPost: text('assigned_post').notNull(),
  shift: text('shift').notNull(),
  status: text('status').notNull(),
  lastCheckIn: text('last_check_in'),
});

export const incidents = sqliteTable('incidents', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  siteId: text('site_id').notNull(),
  type: text('type').notNull(),
  direction: text('direction'),
  vehicleNo: text('vehicle_no'),
  severity: text('severity').notNull(),
  description: text('description').notNull(),
  reportedBy: text('reported_by').notNull(),
  timestamp: text('timestamp').notNull(),
  status: text('status').notNull(),
});

export const leaveRequests = sqliteTable('leave_requests', {
  id: text('id').primaryKey(),
  guardId: text('guard_id').notNull(),
  guardName: text('guard_name').notNull(),
  tenantId: text('tenant_id').notNull(),
  siteId: text('site_id').notNull(),
  leaveType: text('leave_type').notNull(),
  fromDate: text('from_date').notNull(),
  toDate: text('to_date').notNull(),
  reason: text('reason').notNull(),
  substituteGuardId: text('substitute_guard_id'),
  substituteGuardName: text('substitute_guard_name'),
  status: text('status').notNull(),
  appliedAt: text('applied_at').notNull(),
  decidedBy: text('decided_by'),
  decidedAt: text('decided_at'),
});

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  siteId: text('site_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  creatorRole: text('creator_role').notNull(),
  assignedTo: text('assigned_to').notNull(),
  assignedToName: text('assigned_to_name').notNull(),
  post: text('post').notNull(),
  taskType: text('task_type').notNull(),
  status: text('status').notNull(),
  createdAt: text('created_at').notNull(),
  startedAt: text('started_at'),
  completedAt: text('completed_at'),
  verifiedAt: text('verified_at'),
  completionNote: text('completion_note'),
  createdBy: text('created_by').notNull(),
});

export const attendanceLogs = sqliteTable('attendance_logs', {
  id: text('id').primaryKey(),
  guardId: text('guard_id').notNull(),
  guardName: text('guard_name').notNull(),
  tenantId: text('tenant_id').notNull(),
  siteId: text('site_id').notNull(),
  date: text('date').notNull(),
  shift: text('shift').notNull(),
  status: text('status').notNull(),
  loggedAt: text('logged_at').notNull(),
  loggedBy: text('logged_by').notNull(),
  photoUrl: text('photo_url'),
  lat: real('lat'),
  lng: real('lng'),
});

// Operations Store Data

export const patrolRoutes = sqliteTable('patrol_routes', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  siteId: text('site_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  checkpoints: text('checkpoints', { mode: 'json' }).$type<any[]>(),
  estimatedMinutes: integer('estimated_minutes').notNull(),
});

export const patrolLogs = sqliteTable('patrol_logs', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  routeId: text('route_id').notNull(),
  routeName: text('route_name').notNull(),
  siteId: text('site_id').notNull(),
  guardId: text('guard_id').notNull(),
  guardName: text('guard_name').notNull(),
  checkpointScans: text('checkpoint_scans', { mode: 'json' }).$type<any[]>(),
  status: text('status').notNull(),
  startedAt: text('started_at').notNull(),
  completedAt: text('completed_at'),
  breachCheckpointId: text('breach_checkpoint_id'),
});

export const sosAlerts = sqliteTable('sos_alerts', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  guardId: text('guard_id').notNull(),
  guardName: text('guard_name').notNull(),
  siteId: text('site_id').notNull(),
  post: text('post').notNull(),
  coordinates: text('coordinates').notNull(),
  timestamp: text('timestamp').notNull(),
  status: text('status').notNull(),
  acknowledgedBy: text('acknowledged_by'),
  acknowledgedAt: text('acknowledged_at'),
});

export const rosterSlots = sqliteTable('roster_slots', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  date: text('date').notNull(),
  post: text('post').notNull(),
  shift: text('shift').notNull(),
  guardId: text('guard_id').notNull(),
  guardName: text('guard_name').notNull(),
  siteId: text('site_id').notNull(),
});

export const geofencePosts = sqliteTable('geofence_posts', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  siteId: text('site_id').notNull(),
  postName: text('post_name').notNull(),
  radiusMeters: integer('radius_meters').notNull(),
  centerLat: real('center_lat').notNull(),
  centerLng: real('center_lng').notNull(),
});

export const geofenceCheckIns = sqliteTable('geofence_check_ins', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  postId: text('post_id').notNull(),
  postName: text('post_name').notNull(),
  guardId: text('guard_id').notNull(),
  guardName: text('guard_name').notNull(),
  siteId: text('site_id').notNull(),
  timestamp: text('timestamp').notNull(),
  status: text('status').notNull(),
  simulatedDistance: real('simulated_distance').notNull(),
});

export const gatePasses = sqliteTable('gate_passes', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull(),
  siteId: text('site_id').notNull(),
  passType: text('pass_type').notNull(),
  direction: text('direction').notNull(),
  vehicleNo: text('vehicle_no'),
  transporterName: text('transporter_name'),
  grossWeight: real('gross_weight'),
  netWeight: real('net_weight'),
  driverName: text('driver_name'),
  driverPhone: text('driver_phone'),
  materialDescription: text('material_description'),
  visitorName: text('visitor_name'),
  visitorPhone: text('visitor_phone'),
  visitorCompany: text('visitor_company'),
  hostName: text('host_name'),
  purpose: text('purpose'),
  entryAt: text('entry_at').notNull(),
  exitAt: text('exit_at'),
  status: text('status').notNull(),
  createdBy: text('created_by').notNull(),
});
