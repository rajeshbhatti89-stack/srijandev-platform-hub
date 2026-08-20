import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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
